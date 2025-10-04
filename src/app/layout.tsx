import type { ReactNode } from 'react'
import EchoClientProvider from './echo-provider'

export const metadata = {
  title: 'AI Bartender',
  description: 'Mood-based cocktail/mocktail recipes powered by Echo',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{fontFamily:'ui-sans-serif,system-ui',background:'#0b0b0b',color:'#f3f3f3'}}>
        <EchoClientProvider>
          <main style={{maxWidth:720, margin:'0 auto', padding:24}}>
            {children}
          </main>
        </EchoClientProvider>
      </body>
    </html>
  )
}

