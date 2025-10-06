import type { ReactNode } from 'react'
import EchoClientProvider from './echo-provider'

export const metadata = {
  title: 'AI Bartender',
  description: 'Mood-based cocktail/mocktail recipes powered by Echo',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="hero-bg">
        {/* Background layers */}
        <div className="hero-img" />
        <div className="hero-fade" />

        {/* App content must be inside EchoProvider */}
        <EchoClientProvider>
          <main className="container">{children}</main>
        </EchoClientProvider>

        <style>{`
          :root {
            --page-max: 980px;
          }

          /* Dark stage */
          .hero-bg{
            background: #000;             /* solid black fallback */
            min-height: 100vh;
            position: relative;
            overflow: hidden;
          }

          /* Photo on the left (full-bleed) */
          .hero-img{
            position: fixed;
            inset: 0 40% 0 0;             /* occupy the left ~60% */
            background-image: url('/hero-splash.jpg');
            background-size: cover;
            background-position: left center;
            background-repeat: no-repeat;
            filter: saturate(1.05) contrast(1.05) brightness(.88);
            z-index: 0;
          }

          /* Fade the photo into darkness on the right */
          .hero-fade{
            position: fixed;
            inset: 0;
            pointer-events: none;
            z-index: 1;
            /* left: dark overlay; center: gentle; right: fully black */
            background:
              linear-gradient(90deg,
                rgba(0,0,0,.65) 0%,
                rgba(0,0,0,.55) 30%,
                rgba(0,0,0,.35) 50%,
                rgba(0,0,0,.25) 60%,
                rgba(0,0,0,.10) 68%,
                rgba(0,0,0,.00) 75%),
              radial-gradient(120% 120% at 50% 50%, transparent 65%, rgba(0,0,0,.4) 100%);
          }

          /* Content area */
          .container{
            position: relative;
            z-index: 2;
            max-width: var(--page-max);
            margin: 0 auto;
            padding: 32px 20px 80px;
            font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial;
            color: #f1f5f9;              /* light text by default */
          }

          /* Make form controls pop on dark */
          .container input,
          .container select,
          .container textarea,
          .container button{
            color: #0b1220;              /* dark text inside white inputs */
          }

          /* allow cards to stay white and float nicely */
          .container .card{
            box-shadow: 0 10px 24px rgba(0,0,0,.22);
          }

          /* Small screens: make image cover top, then fade downwards */
          @media (max-width: 900px){
            .hero-img{ inset: 0; background-position: center; opacity: .45; }
            .hero-fade{
              background:
                linear-gradient(180deg,
                  rgba(0,0,0,.55) 0%,
                  rgba(0,0,0,.35) 40%,
                  rgba(0,0,0,.10) 70%,
                  rgba(0,0,0,.00) 85%),
                radial-gradient(120% 120% at 50% 50%, transparent 65%, rgba(0,0,0,.45) 100%);
            }
          }
        `}</style>
      </body>
    </html>
  )
}

