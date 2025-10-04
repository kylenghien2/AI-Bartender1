import { generateObject } from 'ai'
import { z } from 'zod'
import { openai } from '../../../echo'

export const runtime = 'edge'

// --- Schema (guarantees valid JSON shape) ---
const Ingredient = z.object({
  item: z.string(),
  amount: z.string(),
})

const Recipe = z.object({
  name: z.string(),
  alcohol_free: z.boolean(),
  glass: z.enum(['rocks','highball','coupe','martini','collins','mug','wine']).default('rocks'),
  ingredients: z.array(Ingredient).default([]),
  steps: z.array(z.string()).default([]),
  garnish: z.string().default(''),
  vibe_note: z.string().default(''),
  estimated_time_min: z.number().int().min(1).max(10).default(3),
})

const OutputSchema = z.object({
  recipes: z.array(Recipe).min(3).max(5),
})

export async function POST(req: Request) {
  try {
    const { mood, occasion, style, base, ingredientsCSV } = await req.json()

    // Bind Echo provider to this request so auth/session is forwarded
    const withAuth = openai.bind({ request: req })

    const system = [
      'You are “AI Bartender,” a concise, safety-conscious mixologist.',
      'Output MUST be valid JSON that matches the provided schema. No markdown or extra text.',
      'Keep each recipe under 120 words.',
      'If base=mocktail or user implies no alcohol, set alcohol_free=true and avoid spirits.',
      'Prefer AVAILABLE_INGREDIENTS when possible.',
    ].join(' ')

    const user = `MOOD: ${mood}
OCCASION: ${occasion || '-'}
STYLE: ${style || '-'}
BASE: ${base}
AVAILABLE_INGREDIENTS: ${ingredientsCSV || '-'}`

    const { object } = await generateObject({
      model: withAuth('gpt-4o-mini'),
      system,
      prompt: user,
      schema: OutputSchema,
      temperature: 0.6,
      maxOutputTokens: 800,
    })

    return Response.json(object)
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : typeof err === 'string' ? err : 'Unknown error'
    console.error('recipes route error:', err)
    return new Response(
      JSON.stringify({ error: 'Model did not return valid JSON', detail: message }),
      { status: 502, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

