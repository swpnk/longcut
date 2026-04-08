'use client'

import { useState } from 'react'
import { EvidenceItem } from '@/types/article'

interface EvidenceFileProps {
  label: string
  from: string
  to: string
  subject: string
  items: EvidenceItem[]
}

export default function EvidenceFile({ label, from, to, subject, items = [] }: EvidenceFileProps) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set())

  const toggle = (i: number) => {
    setRevealed((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  return (
    <>
      <style>{`
        .ef-wrap {
          max-width: 660px;
          margin: 0 auto;
          padding: 0 2.5rem 3rem;
        }

        .ef-label {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
        }

        .ef-label::before {
          content: '';
          display: inline-block;
          width: 10px;
          height: 10px;
          border: 0.5px solid var(--gold);
          flex-shrink: 0;
        }

        .ef-card {
          background: #0d0a07;
          border: 0.5px solid rgba(200, 169, 110, 0.12);
          padding: 2rem;
          position: relative;
        }

        .ef-watermark {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-family: var(--font-label);
          font-size: 7px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.1);
          user-select: none;
        }

        .ef-header {
          margin-bottom: 1.5rem;
        }

        .ef-header-row {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(240, 232, 216, 0.25);
          margin-bottom: 0.35rem;
          line-height: 1.5;
        }

        .ef-header-row span {
          color: rgba(240, 232, 216, 0.5);
        }

        .ef-subject {
          font-family: var(--font-label);
          font-size: 10px;
          letter-spacing: 0.08em;
          color: rgba(200, 169, 110, 0.55);
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 0.5px solid rgba(240, 232, 216, 0.05);
        }

        .ef-separator {
          border-bottom: 0.5px solid rgba(240, 232, 216, 0.05);
          margin-bottom: 1.5rem;
        }

        .ef-items {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ef-item {
          display: flex;
          gap: 0.75rem;
          padding: 0.65rem;
          background: rgba(240, 232, 216, 0.015);
          border-left: 0.5px solid rgba(200, 169, 110, 0.18);
        }

        .ef-num {
          font-family: var(--font-label);
          font-size: 11px;
          color: rgba(200, 169, 110, 0.45);
          flex-shrink: 0;
          line-height: 1.85;
        }

        .ef-text {
          font-family: var(--font-label);
          font-size: 11px;
          color: rgba(240, 232, 216, 0.65);
          line-height: 1.85;
        }

        .ef-redacted {
          background: rgba(240, 232, 216, 0.12);
          color: transparent;
          border-radius: 2px;
          padding: 0 3px;
          cursor: pointer;
          transition: background 0.3s, color 0.3s;
          user-select: none;
        }

        .ef-redacted.revealed {
          background: transparent;
          color: rgba(200, 169, 110, 0.85);
        }

        .ef-hint {
          font-family: var(--font-label);
          font-size: 7px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.18);
          margin-top: 0.65rem;
        }

        @media (max-width: 640px) {
          .ef-wrap {
            padding: 0 1.5rem 3rem;
          }
        }
      `}</style>

      <div className="ef-wrap">
        <div className="ef-label">{label}</div>
        <div className="ef-card">
          <div className="ef-watermark">Document</div>

          <div className="ef-header">
            <div className="ef-header-row">From: <span>{from}</span></div>
            <div className="ef-header-row">To: <span>{to}</span></div>
            <div className="ef-subject">Re: {subject}</div>
          </div>

          <div className="ef-separator" />

          <div className="ef-items">
            {items.map((item, i) => (
              <div key={i} className="ef-item">
                <span className="ef-num">{item.number}</span>
                <span className="ef-text">
                  {item.text}
                  {item.redacted && (
                    <span
                      className={`ef-redacted${revealed.has(i) ? ' revealed' : ''}`}
                      onClick={() => toggle(i)}
                    >
                      {item.redacted}
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>

          <div className="ef-hint">Click redacted lines to reveal</div>
        </div>
      </div>
    </>
  )
}
