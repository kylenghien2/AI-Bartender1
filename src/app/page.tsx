'use client'
import { useState } from 'react'
import { EchoSignIn } from '@merit-systems/echo-next-sdk/client'

export default function Page() {
  const [mood, setMood] = useState('lazy Sunday, craving something fresh')
  const [base, setBase] = useState<'cocktail' | 'mocktail'>('mocktail')
  const [style, setStyle] = useState('tropical')
  const [occasion, setOccasion] = useState('chill with friends')
  const [ing, setIng] = useState('lime, mint, soda, ginger, honey')
  const [recipes, setRecipes] = useState<any[]>([])
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
        const t = await res.text().catch(()=>'')
        throw new Error(t || 'Failed to generate')
      }
      const data = await res.json()
      setRecipes(Array.isArray(data.recipes) ? data.recipes : [])
    } catch (e: any) {
      setErr(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
        <h1 style={{ fontSize:28, fontWeight:700, letterSpacing:.2 }}>AI Bartender 🍹</h1>
        <EchoSignIn />
      </header>

      <p style={{ opacity:.8, margin:'8px 0 20px' }}>
        Type a mood/vibe and get custom recipes.
      </p>

      <div style={{ display:'grid', gap:12 }}>
        <textarea
          value={mood}
          onChange={(e)=>setMood(e.target.value)}
          rows={3}
          style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:12, padding:12 }}
        />
        <div style={{ display:'flex', gap:8 }}>
          <select
            value={base}
            onChange={(e)=>setBase(e.target.value as 'cocktail'|'mocktail')}
            style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:10, padding:10 }}
          >
            <option value="mocktail">Mocktail (0%)</option>
            <option value="cocktail">Cocktail</option>
          </select>
          <input
            value={style}
            onChange={(e)=>setStyle(e.target.value)}
            placeholder="Style (tropical, cozy, classy)"
            style={{ flex:1, background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:10, padding:10 }}
          />
        </div>
        <input
          value={occasion}
          onChange={(e)=>setOccasion(e.target.value)}
          placeholder="Occasion (party, study, date night)"
          style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:10, padding:10 }}
        />
        <input
          value={ing}
          onChange={(e)=>setIng(e.target.value)}
          placeholder="Available ingredients (comma,separated)"
          style={{ background:'#ffffff', border:'1px solid #e5e7eb', borderRadius:10, padding:10 }}
        />
        <button
          onClick={generate}
          disabled={loading || !mood.trim()}
          style={{
            background:'#2563eb',
            color:'#ffffff',           // white text as you wanted
            padding:'10px 14px',
            borderRadius:12,
            fontWeight:600,
            opacity: loading ? .7 : 1,
            border:'1px solid rgba(255,255,255,0.12)'
          }}
        >
          {loading ? 'Mixing…' : 'Generate Drinks'}
        </button>
        {err && <div style={{ color:'#ef4444' }}>{err}</div>}
      </div>

      {/* RESULTS */}
      <section style={{ marginTop:24, display:'grid', gap:16 }}>
        {recipes.map((r, i) => (
          <div
            key={i}
            className="card"
            style={{
              border:'1px solid #e5e7eb',
              borderRadius:16,
              padding:16,
              background:'#ffffff',
              boxShadow:'0 8px 20px rgba(2,6,23,0.05)'
            }}
          >
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <h3 style={{ fontSize:18, fontWeight:600 }}>
                {r.name} {r.alcohol_free ? '🫧' : '🍸'}
              </h3>
              <span style={{ opacity:.7 }}>{r.glass}</span>
            </div>
            <p style={{ opacity:.8 }}>{r.vibe_note}</p>
            <ul style={{ marginTop:8, paddingLeft:18 }}>
              {r.ingredients?.map((x:any, idx:number)=>(
                <li key={idx}>
                  {x.amount} {x.item}
                </li>
              ))}
            </ul>
            <ol style={{ marginTop:8, paddingLeft:18 }}>
              {r.steps?.map((s:string, idx:number)=>(
                <li key={idx}>{s}</li>
              ))}
            </ol>
            <div style={{ opacity:.8, marginTop:6 }}>
              Garnish: {r.garnish} • ~{r.estimated_time_min} min
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}
