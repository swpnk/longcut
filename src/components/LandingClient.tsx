'use client'

import { useEffect, useState } from 'react'
import Filmstrip from './Filmstrip'
import Gate from './Gate'
import { Act } from '@/types/article'

interface LandingClientProps {
  question: string
  acts: Act[]
  totalMinutes: number
  children: React.ReactNode
}

const SEED = { yes: 3241, no: 11087 }

export default function LandingClient({ question, acts, totalMinutes, children }: LandingClientProps) {
  const [gateVisible, setGateVisible] = useState(true)
  const [overlay, setOverlay] = useState<{ counts: { yes: number; no: number }; fading: boolean } | null>(null)

  useEffect(() => {
    if (localStorage.getItem('lc_gate')) {
      setGateVisible(false)
    }
  }, [])

  const handleVoted = (choice: 'yes' | 'no') => {
    const counts = {
      yes: SEED.yes + (choice === 'yes' ? 1 : 0),
      no: SEED.no + (choice === 'no' ? 1 : 0),
    }
    setGateVisible(false)
    setOverlay({ counts, fading: false })

    requestAnimationFrame(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    })

    setTimeout(() => setOverlay((o) => (o ? { ...o, fading: true } : null)), 900)
    setTimeout(() => setOverlay(null), 2300)
  }

  const total = overlay ? overlay.counts.yes + overlay.counts.no : 1
  const yesPct = overlay ? Math.round((overlay.counts.yes / total) * 100) : 0
  const noPct = 100 - yesPct

  return (
    <>
      <style>{`
        .lc-overlay {
          position: fixed;
          inset: 0;
          z-index: 450;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          background: rgba(10, 8, 6, 0.68);
          opacity: 1;
          transition: opacity 1.4s ease;
          pointer-events: none;
        }

        .lc-overlay-out {
          opacity: 0;
        }

        .lc-ov-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .lc-ov-pct {
          font-family: var(--font-headline);
          font-size: clamp(36px, 6vw, 60px);
          font-weight: 400;
          font-style: italic;
          line-height: 1;
        }

        .lc-ov-pct-yes {
          color: var(--gold);
        }

        .lc-ov-pct-no {
          color: rgba(200, 65, 45, 0.8);
        }

        .lc-ov-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .lc-ov-label-yes {
          color: rgba(200, 169, 110, 0.4);
        }

        .lc-ov-label-no {
          color: rgba(200, 65, 45, 0.35);
        }
      `}</style>

      <Filmstrip acts={acts} totalMinutes={totalMinutes} />

      {gateVisible && (
        <Gate
          question={question}
          issueLabel="longcut.ink · Issue 001 · The Architect"
          onVoted={handleVoted}
        />
      )}

      {overlay && (
        <div
          className={`lc-overlay${overlay.fading ? ' lc-overlay-out' : ''}`}
          aria-hidden="true"
        >
          <div className="lc-ov-item">
            <div className="lc-ov-pct lc-ov-pct-yes">{yesPct}%</div>
            <div className="lc-ov-label lc-ov-label-yes">Trust him</div>
          </div>
          <div className="lc-ov-item">
            <div className="lc-ov-pct lc-ov-pct-no">{noPct}%</div>
            <div className="lc-ov-label lc-ov-label-no">Don&rsquo;t trust</div>
          </div>
        </div>
      )}

      <main>
        {children}
      </main>
    </>
  )
}
