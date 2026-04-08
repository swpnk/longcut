'use client'

import { useEffect, useState } from 'react'

interface ReaderVoteProps {
  question: string
  seedVotes?: { yes: number; no: number }
}

const DEFAULT_SEED = { yes: 3241, no: 11087 }

export default function ReaderVote({ question, seedVotes }: ReaderVoteProps) {
  const seed = seedVotes ?? DEFAULT_SEED
  const [gateAnswer, setGateAnswer] = useState<'yes' | 'no' | null>(null)
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const [counts, setCounts] = useState(seed)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const gate = localStorage.getItem('lc_gate') as 'yes' | 'no' | null
    const final = localStorage.getItem('lc_final') as 'yes' | 'no' | null
    setGateAnswer(gate)
    if (final) {
      setVote(final)
      setCounts({
        yes: seed.yes + (final === 'yes' ? 1 : 0),
        no: seed.no + (final === 'no' ? 1 : 0),
      })
    }
  }, [])

  const handleVote = (choice: 'yes' | 'no') => {
    if (vote) return
    localStorage.setItem('lc_final', choice)
    setVote(choice)
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }))
  }

  const total = counts.yes + counts.no
  const yesPct = Math.round((counts.yes / total) * 100)
  const noPct = 100 - yesPct

  const gateLabel = gateAnswer === 'yes' ? 'Yes' : 'No'
  const recallText =
    vote && gateAnswer
      ? vote !== gateAnswer
        ? `You started this piece saying ${gateLabel}. By the end, you changed your mind. That's the piece working.`
        : `You started saying ${gateLabel}. You finished the same. Either the evidence confirmed what you knew — or it wasn't enough to move you. Both are worth sitting with.`
      : null

  return (
    <>
      <style>{`
        .reader-vote {
          max-width: 660px;
          margin: 0 auto;
          padding: 3rem 2.5rem;
          border-top: 0.5px solid var(--faint);
        }

        .reader-vote-pre {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.2);
          margin-bottom: 1.25rem;
        }

        .reader-vote-question {
          font-family: var(--font-headline);
          font-size: clamp(17px, 2.5vw, 24px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.3;
          color: var(--paper);
          margin-bottom: 0.75rem;
        }

        .reader-vote-sub {
          font-family: var(--font-body);
          font-size: 15px;
          font-style: italic;
          color: var(--muted);
          margin-bottom: 1.75rem;
        }

        .reader-vote-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .reader-vote-btn {
          font-family: var(--font-label);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 24px;
          border: 0.5px solid rgba(240, 232, 216, 0.2);
          background: transparent;
          color: var(--paper);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .reader-vote-btn:hover:not(:disabled) {
          border-color: var(--gold);
          color: var(--gold);
        }

        .reader-vote-btn:disabled {
          cursor: default;
        }

        .reader-vote-btn.selected-yes {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(200, 169, 110, 0.06);
        }

        .reader-vote-btn.selected-no {
          border-color: rgba(200, 65, 45, 0.5);
          color: rgba(200, 65, 45, 0.9);
          background: rgba(200, 65, 45, 0.04);
        }

        .reader-vote-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease 0.3s;
        }

        .reader-vote-bars.show {
          opacity: 1;
        }

        .reader-vote-bar-row {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .reader-vote-bar-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.25);
          min-width: 22px;
        }

        .reader-vote-bar-track {
          flex: 1;
          max-width: 200px;
          height: 2px;
          background: rgba(240, 232, 216, 0.06);
          overflow: hidden;
        }

        .reader-vote-bar-fill {
          height: 100%;
          width: 0;
          transition: width 0.6s ease 0.4s;
        }

        .reader-vote-bar-fill.yes {
          background: var(--gold);
        }

        .reader-vote-bar-fill.no {
          background: rgba(200, 65, 45, 0.4);
        }

        .reader-vote-bar-fill.ready {
          width: var(--target-width);
        }

        .reader-vote-bar-pct {
          font-family: var(--font-label);
          font-size: 9px;
          color: rgba(240, 232, 216, 0.25);
        }

        .reader-vote-recall {
          font-family: var(--font-body);
          font-size: 15px;
          font-style: italic;
          color: rgba(240, 232, 216, 0.38);
          border-top: 0.5px solid var(--faint);
          padding-top: 1.25rem;
          margin-top: 1.25rem;
          line-height: 1.6;
        }
      `}</style>

      <div className="reader-vote">
        {gateAnswer && (
          <div className="reader-vote-pre">
            Before reading, you said: {gateLabel}. Has that changed?
          </div>
        )}

        <div className="reader-vote-question">{question}</div>
        <div className="reader-vote-sub">You&rsquo;ve read the evidence. Vote again.</div>

        <div className="reader-vote-buttons">
          <button
            className={`reader-vote-btn${vote === 'yes' ? ' selected-yes' : ''}`}
            onClick={() => handleVote('yes')}
            disabled={!!vote}
          >
            Yes, I trust him
          </button>
          <button
            className={`reader-vote-btn${vote === 'no' ? ' selected-no' : ''}`}
            onClick={() => handleVote('no')}
            disabled={!!vote}
          >
            No, I don&rsquo;t
          </button>
        </div>

        <div className={`reader-vote-bars${vote ? ' show' : ''}`}>
          <div className="reader-vote-bar-row">
            <span className="reader-vote-bar-label">Yes</span>
            <div className="reader-vote-bar-track">
              <div
                className={`reader-vote-bar-fill yes${vote ? ' ready' : ''}`}
                style={{ '--target-width': `${yesPct}%` } as React.CSSProperties}
              />
            </div>
            <span className="reader-vote-bar-pct">{yesPct}%</span>
          </div>
          <div className="reader-vote-bar-row">
            <span className="reader-vote-bar-label">No</span>
            <div className="reader-vote-bar-track">
              <div
                className={`reader-vote-bar-fill no${vote ? ' ready' : ''}`}
                style={{ '--target-width': `${noPct}%` } as React.CSSProperties}
              />
            </div>
            <span className="reader-vote-bar-pct">{noPct}%</span>
          </div>
        </div>

        {recallText && <div className="reader-vote-recall">{recallText}</div>}
      </div>
    </>
  )
}
