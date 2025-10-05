'use client'
import { EchoSignIn } from '@merit-systems/echo-next-sdk/client'
import { useState } from 'react'

type Ingredient = { item: string; amount: string }
type Recipe = {
  name: string
  alcohol_free: boolean
  glass: string
  ingredients?: Ingredient[]
  steps?: string[]
  garnish?: string
  vibe_note?: string
  estimated_time_min?: number
}

export default function Page() {
  const [mood, setMood] = useState('lazy Sunday, craving something fresh')
  const [base, setBase] = useState<'cocktail' | 'mocktail'>('mocktail')
  const [style, setStyle] = useState('tropical')
  const [occasion, setOccasion] = useState('chill with friends')
  const [ing, setIng] = useState('lime, mint, soda, ginger, honey')
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string>('')

  async function generate() {
    try {
      setLoading(true)
      setErr('')
      setRecipes([])

      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood, base, style, occasion, ingredientsCSV: ing }),
      })

      if (!res.ok) {
        const t = await res.text().catch(() => '')
        throw new Error(t || 'Failed to generate')
      }

      const data: { recipes?: Recipe[] } = await res.json()
      setRecipes(Array.isArray(data.recipes) ? data.recipes : [])
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Something went wrong'
      setErr(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>AI Bartender 🍹</h1>
        {/* Echo sign-in button for users */}
        <EchoSignIn />
      </header>

      <p style={{ opacity: 0.7, margin: '8px 0 20px' }}>
        Type a mood/vibe and get 3–5 custom recipes.
      </p>

      <div style={{ display: 'grid', gap: 12 }}>
        <textarea
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          rows={3}
          style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 12 }}
        />
        <div style={{ display: 'flex', gap: 8 }}>
          <select
            value={base}
            onChange={(e) => setBase(e.target.value as 'cocktail' | 'mocktail')}
            style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}
          >
            <option value="mocktail">Mocktail (0%)</option>
            <option value="cocktail">Cocktail</option>
          </select>
          <input
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            placeholder="Style (tropical, cozy, classy)"
            style={{ flex: 1, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}
          />
        </div>
        <input
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          placeholder="Occasion (party, study, date night)"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}
        />
        <input
          value={ing}
          onChange={(e) => setIng(e.target.value)}
          placeholder="Available ingredients (comma,separated)"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }}
        />
<button
  onClick={generate}
  disabled={loading || !mood.trim()}
  style={{
    background: '#2563eb',       // keep your current blue
    color: '#ffffff',            // <-- make the label white
    padding: '10px 14px',
    borderRadius: 12,
    opacity: loading ? 0.6 : 1
  }}
>
  {loading ? 'Mixing…' : 'Generate Drinks'}
</button>
        {err && <div style={{ color: '#fca5a5' }}>{err}</div>}
      </div>

      <section style={{ marginTop: 24, display: 'grid', gap: 16 }}>
        {recipes.map((r, i) => (
          <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 16, padding: 16, background: '#ffffff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 18, fontWeight: 600 }}>
                {r.name} {r.alcohol_free ? '🫧' : '🍸'}
              </h3>
              <span style={{ opacity: 0.7 }}>{r.glass}</span>
            </div>
            <p style={{ opacity: 0.8 }}>{r.vibe_note}</p>
            <ul style={{ marginTop: 8, paddingLeft: 18 }}>
              {r.ingredients?.map((x: Ingredient, idx: number) => (
                <li key={idx}>
                  {x.amount} {x.item}
                </li>
              ))}
            </ul>
            <ol style={{ marginTop: 8, paddingLeft: 18 }}>
              {r.steps?.map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
            <div style={{ opacity: 0.8, marginTop: 6 }}>
              Garnish: {r.garnish} • ~{r.estimated_time_min} min
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

