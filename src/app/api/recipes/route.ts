import { generateText } from 'ai'
import { openai } from '../../../echo'

export const runtime = 'edge'

export async function POST(req: Request){
  const { mood, occasion, style, base, ingredientsCSV } = await req.json()

  const system = `You are “AI Bartender,” a witty, safety-conscious mixologist. You create short, practical drink recipes. Follow JSON schema strictly. If base=mocktail or the user implies no alcohol/underage, produce only alcohol-free recipes. Keep each recipe under 120 words.`

  const user = `MOOD: ${mood}
OCCASION: ${occasion||'-'}
STYLE: ${style||'-'}
BASE: ${base}
AVAILABLE_INGREDIENTS: ${ingredientsCSV||'-'}

Return JSON with:
{
  "recipes": [
    {
      "name": string,
      "alcohol_free": boolean,
      "glass": "rocks"|"highball"|"coupe"|"martini"|"collins"|"mug"|"wine",
      "ingredients": [{ "item": string, "amount": string }],
      "steps": [string,...],
      "garnish": string,
      "vibe_note": string,
      "estimated_time_min": number
    }
  ]
}
Generate 3-5 recipes. Prefer available ingredients when possible.`

  const prompt = `${system}\n\n${user}`

  const { text } = await generateText({
    model: openai('gpt-5'),
    prompt,
    temperature: 0.7,
    maxTokens: 800
  })

  try{
    const data = JSON.parse(text)
    return Response.json(data)
  }catch{
    return new Response(JSON.stringify({ error: 'Model did not return valid JSON', raw: text }), { status: 502 })
  }
}
