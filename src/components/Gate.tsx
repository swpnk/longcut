'use client'

import { useEffect, useState } from 'react'

interface GateProps {
  question: string
  issueLabel?: string
  seedVotes?: { yes: number; no: number }
  onVoted?: (choice: 'yes' | 'no') => void
  variant?: 'full' | 'inline'
}

const DEFAULT_SEED = { yes: 3241, no: 11087 }

export default function Gate({ question, issueLabel, seedVotes, onVoted, variant = 'full' }: GateProps) {
  const seed = seedVotes ?? DEFAULT_SEED
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [counts, setCounts] = useState(seed)

  useEffect(() => {
    setMounted(true)
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('lc_gate') as 'yes' | 'no' | null
    if (stored) {
      setVote(stored)
      setCounts({ yes: seed.yes + (stored === 'yes' ? 1 : 0), no: seed.no + (stored === 'no' ? 1 : 0) })
      if (variant === 'inline') setCollapsed(true)
    }
  }, [])

  const handleVote = (choice: 'yes' | 'no') => {
    if (vote) return
    onVoted?.(choice)
    localStorage.setItem('lc_gate', choice)
    setVote(choice)
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }))
    if (variant === 'inline') {
      setTimeout(() => setCollapsed(true), 400)
    }
  }

  const total = counts.yes + counts.no
  const yesPct = Math.round((counts.yes / total) * 100)
  const noPct = 100 - yesPct

  // Inline variant: already voted on previous visit → render nothing at all
  if (variant === 'inline' && mounted && collapsed) return null

  if (variant === 'inline') {
    return (
      <>
        <style>{`
          .gate-inline {
            max-width: 660px;
            margin: 0 auto 3rem;
            padding: 20px 28px;
            border: 0.5px solid var(--faint);
            opacity: 1;
            transition: opacity 0.4s ease, max-height 0.4s ease;
            overflow: hidden;
          }

          .gate-inline-pre {
            font-family: var(--font-label);
            font-size: 8px;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            color: rgba(200,169,110,0.4);
            margin-bottom: 10px;
          }

          .gate-inline-question {
            font-family: var(--font-body);
            font-size: 14px;
            font-style: italic;
            color: var(--muted);
            line-height: 1.55;
            margin-bottom: 14px;
          }

          .gate-inline-buttons {
            display: flex;
            gap: 10px;
          }

          .gate-inline-btn {
            font-family: var(--font-label);
            font-size: 8px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 8px 18px;
            border: 0.5px solid var(--faint);
            background: transparent;
            color: rgba(240,232,216,0.45);
            cursor: pointer;
            transition: border-color 0.2s, color 0.2s, background 0.2s;
          }

          .gate-inline-btn:hover:not(:disabled) {
            border-color: var(--gold);
            color: var(--gold);
            background: rgba(200,169,110,0.04);
          }

          .gate-inline-btn:disabled {
            cursor: default;
          }

          .gate-inline-btn.sel-yes {
            border-color: var(--gold);
            color: var(--gold);
          }

          .gate-inline-btn.sel-no {
            border-color: rgba(200,65,45,0.4);
            color: rgba(200,65,45,0.8);
          }

          @media (max-width: 640px) {
            .gate-inline {
              margin: 0 1.5rem 3rem;
            }
          }
        `}</style>

        <div className="gate-inline">
          <div className="gate-inline-pre">Before you read — a question</div>
          <div className="gate-inline-question">{question}</div>
          <div className="gate-inline-buttons">
            <button
              className={`gate-inline-btn${vote === 'yes' ? ' sel-yes' : ''}`}
              onClick={() => handleVote('yes')}
              disabled={!!vote}
            >
              Yes
            </button>
            <button
              className={`gate-inline-btn${vote === 'no' ? ' sel-no' : ''}`}
              onClick={() => handleVote('no')}
              disabled={!!vote}
            >
              No
            </button>
          </div>
        </div>
      </>
    )
  }

  // Full variant (original behaviour)
  return (
    <>
      <style>{`
        .gate {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 2rem;
        }

        .gate-issue {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(200, 169, 110, 0.4);
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .gate-question {
          font-family: var(--font-headline);
          font-size: clamp(24px, 4.5vw, 50px);
          font-style: italic;
          font-weight: 400;
          max-width: 620px;
          margin: 0 auto 1.5rem;
          line-height: 1.2;
          color: var(--paper);
        }

        .gate-subtext {
          font-family: var(--font-body);
          font-size: 18px;
          font-style: italic;
          color: var(--muted);
          margin-bottom: 2.5rem;
        }

        .gate-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .gate-btn {
          font-family: var(--font-label);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: 0.5px solid rgba(240, 232, 216, 0.2);
          background: transparent;
          color: var(--paper);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .gate-btn:hover:not(:disabled) {
          border-color: var(--gold);
          color: var(--gold);
        }

        .gate-btn:disabled { cursor: default; }

        .gate-btn.selected-yes {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(200, 169, 110, 0.06);
        }

        .gate-btn.selected-no {
          border-color: rgba(200, 65, 45, 0.5);
          color: rgba(200, 65, 45, 0.9);
          background: rgba(200, 65, 45, 0.04);
        }

        .gate-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 200px;
          opacity: 0;
          transition: opacity 0.3s ease 0.3s;
          margin-bottom: 2.5rem;
        }

        .gate-bars.show { opacity: 1; }

        .gate-bar-row { display: flex; flex-direction: column; gap: 4px; }

        .gate-bar-meta {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.3);
        }

        .gate-bar-track {
          height: 2px;
          background: rgba(240, 232, 216, 0.06);
          width: 100%;
          overflow: hidden;
        }

        .gate-bar-fill { height: 100%; width: 0; transition: width 0.6s ease 0.4s; }
        .gate-bar-fill.yes { background: var(--gold); }
        .gate-bar-fill.no { background: rgba(200, 65, 45, 0.7); }
        .gate-bar-fill.ready { width: var(--target-width); }

        @media (max-width: 640px) {
          .gate-buttons { flex-direction: column; width: 100%; max-width: 320px; }
          .gate-btn { width: 100%; min-height: 48px; padding: 16px 32px; }
        }
      `}</style>

      <section className="gate">
        {issueLabel && <p className="gate-issue">{issueLabel}</p>}
        <p className="gate-question">{question}</p>
        <p className="gate-subtext">Answer now. Before the evidence. We&rsquo;ll ask again at the end.</p>

        <div className="gate-buttons">
          <button
            className={`gate-btn${vote === 'yes' ? ' selected-yes' : ''}`}
            onClick={() => handleVote('yes')}
            disabled={!!vote}
          >
            Yes, I trust him
          </button>
          <button
            className={`gate-btn${vote === 'no' ? ' selected-no' : ''}`}
            onClick={() => handleVote('no')}
            disabled={!!vote}
          >
            No, I don&rsquo;t
          </button>
        </div>

        <div className={`gate-bars${vote ? ' show' : ''}`}>
          <div className="gate-bar-row">
            <div className="gate-bar-meta"><span>Yes</span><span>{yesPct}%</span></div>
            <div className="gate-bar-track">
              <div className={`gate-bar-fill yes${vote ? ' ready' : ''}`} style={{ '--target-width': `${yesPct}%` } as React.CSSProperties} />
            </div>
          </div>
          <div className="gate-bar-row">
            <div className="gate-bar-meta"><span>No</span><span>{noPct}%</span></div>
            <div className="gate-bar-track">
              <div className={`gate-bar-fill no${vote ? ' ready' : ''}`} style={{ '--target-width': `${noPct}%` } as React.CSSProperties} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
