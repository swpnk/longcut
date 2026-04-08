import type { Metadata } from 'next'
import Gate from '@/components/Gate'

export const metadata: Metadata = {
  title: 'longcut.ink',
  description: 'Cinematic long-form journalism. The long game, in ink.',
  openGraph: {
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
}

export default function HomePage() {
  return (
    <>
      <style>{`
        .landing {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        .landing-gate-wrap {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .landing-enter {
          display: block;
          text-align: center;
          margin-top: 1rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .landing-enter:hover {
          color: var(--gold);
        }

        .landing-footer {
          text-align: center;
          padding: 2rem;
          border-top: 0.5px solid var(--faint);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
        }

        .landing-footer-logo {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(240, 232, 216, 0.2);
          text-transform: uppercase;
        }

        .landing-footer-sep {
          color: rgba(240, 232, 216, 0.1);
        }

        .landing-footer-tagline {
          font-family: var(--font-body);
          font-size: 13px;
          font-style: italic;
          color: rgba(240, 232, 216, 0.18);
        }
      `}</style>

      <div className="landing">
        <div className="landing-gate-wrap">
          <Gate
            question="Should one person be trusted with the most powerful technology in human history?"
            issueLabel="longcut.ink · Issue 001 · The Architect"
          />
          <a href="/altman" className="landing-enter">
            Read the piece: Sam Altman — The Architect →
          </a>
        </div>

        <footer className="landing-footer">
          <span className="landing-footer-logo">longcut.ink</span>
          <span className="landing-footer-sep">·</span>
          <span className="landing-footer-tagline">The long game, in ink.</span>
        </footer>
      </div>
    </>
  )
}
