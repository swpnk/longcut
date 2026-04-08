'use client'

import { useEffect, useRef } from 'react'
import { ContradictionItem } from '@/types/article'

interface ContradictionEngineProps {
  contradictions: ContradictionItem[]
  intro?: {
    eyebrow: string
    title: string
    sub: string
  }
}

export default function ContradictionEngine({ contradictions = [], intro }: ContradictionEngineProps) {
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const fillRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    rowRefs.current.forEach((row, i) => {
      if (!row) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              row.classList.add('vis')
              const fill = fillRefs.current[i]
              if (fill) {
                setTimeout(() => {
                  fill.style.width = `${contradictions[i].gap}%`
                }, 380)
              }
              observer.disconnect()
            }
          })
        },
        { threshold: 0.2 }
      )

      observer.observe(row)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [contradictions])

  return (
    <>
      <style>{`
        .ce-wrap {
          position: relative;
        }

        .ce-intro {
          text-align: center;
          padding: 5rem 2rem 3rem;
          border-top: 0.5px solid var(--faint);
          border-bottom: 0.5px solid rgba(200, 169, 110, 0.1);
        }

        .ce-intro-eyebrow {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
        }

        .ce-intro-title {
          font-family: var(--font-headline);
          font-size: clamp(26px, 4.5vw, 48px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          margin-bottom: 1rem;
          line-height: 1.1;
        }

        .ce-intro-sub {
          font-family: var(--font-body);
          font-size: 17px;
          font-style: italic;
          color: var(--muted);
          max-width: 400px;
          margin: 0 auto 1.5rem;
        }

        .ce-intro-arrow {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: var(--gold-dim);
          animation: ce-bounce 1.6s ease-in-out infinite;
          display: inline-block;
        }

        @keyframes ce-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }

        .ce-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          border-bottom: 0.5px solid var(--faint);
          position: relative;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }

        .ce-row.vis {
          opacity: 1;
          transform: translateY(0);
        }

        .ce-col {
          padding: clamp(2rem, 4.5vw, 4rem) clamp(1.5rem, 3.5vw, 3.5rem);
        }

        .ce-col-right {
          border-left: 0.5px solid var(--faint);
        }

        .ce-tag {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .ce-tag::after {
          content: '';
          flex: 1;
          height: 0.5px;
        }

        .ce-tag-said {
          color: rgba(200, 169, 110, 0.45);
        }

        .ce-tag-said::after {
          background: rgba(200, 169, 110, 0.2);
        }

        .ce-tag-did {
          color: rgba(200, 65, 45, 0.5);
        }

        .ce-tag-did::after {
          background: rgba(200, 65, 45, 0.25);
        }

        .ce-year {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(240, 232, 216, 0.22);
          margin-bottom: 0.6rem;
          text-transform: uppercase;
        }

        .ce-quote {
          font-family: var(--font-headline);
          font-size: clamp(13px, 1.7vw, 17px);
          font-style: italic;
          font-weight: 400;
          color: #f0e8d8;
          line-height: 1.5;
          margin-bottom: 0.6rem;
        }

        .ce-quote em {
          color: var(--gold);
          font-style: italic;
        }

        .ce-source {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.16);
        }

        .ce-action {
          font-family: var(--font-body);
          font-size: clamp(13px, 1.6vw, 16px);
          color: rgba(240, 232, 216, 0.68);
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .ce-action strong {
          color: rgba(240, 232, 216, 0.88);
          font-weight: 500;
        }

        .ce-badge {
          display: inline-block;
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 0.5px solid rgba(200, 65, 45, 0.25);
          color: rgba(200, 65, 45, 0.55);
          padding: 4px 10px;
        }

        .ce-ghost {
          position: absolute;
          right: 1.5rem;
          top: 50%;
          transform: translateY(-50%);
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: 90px;
          color: rgba(200, 65, 45, 0.025);
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }

        .ce-gap-row {
          grid-column: 1 / -1;
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem clamp(1.5rem, 3.5vw, 3.5rem);
          background: rgba(200, 65, 45, 0.018);
          border-top: 0.5px solid var(--faint);
        }

        .ce-gap-label {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.16);
          min-width: 80px;
        }

        .ce-gap-track {
          flex: 1;
          height: 2px;
          background: rgba(240, 232, 216, 0.05);
          overflow: hidden;
        }

        .ce-gap-fill {
          height: 100%;
          background: rgba(200, 65, 45, 0.42);
          width: 0;
          transition: width 1.1s ease;
        }

        .ce-gap-value {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(200, 65, 45, 0.45);
          min-width: 56px;
          text-align: right;
        }

        @media (max-width: 640px) {
          .ce-wrap {
            overflow-x: hidden;
          }

          .ce-row {
            grid-template-columns: 1fr;
          }

          .ce-col-right {
            border-left: none;
            border-top: 0.5px solid var(--faint);
          }

          .ce-ghost {
            display: none;
          }

          .ce-gap-row {
            grid-column: 1;
          }
        }
      `}</style>

      <div className="ce-wrap">
        {intro && (
          <div className="ce-intro">
            <div className="ce-intro-eyebrow">{intro.eyebrow}</div>
            <div className="ce-intro-title">{intro.title}</div>
            <div className="ce-intro-sub">{intro.sub}</div>
            <span className="ce-intro-arrow">↓</span>
          </div>
        )}

        {contradictions.map((item, i) => (
          <div
            key={i}
            className="ce-row"
            ref={(el) => { rowRefs.current[i] = el }}
          >
            <div className="ce-ghost">{i + 1}</div>

            <div className="ce-col">
              <div className="ce-tag ce-tag-said">He said</div>
              <div className="ce-year">{item.yearSaid}</div>
              <div className="ce-quote">&ldquo;{item.quote}&rdquo;</div>
              <div className="ce-source">{item.source}</div>
            </div>

            <div className="ce-col ce-col-right">
              <div className="ce-tag ce-tag-did">He did</div>
              <div className="ce-year">{item.yearDid}</div>
              <div
                className="ce-action"
                dangerouslySetInnerHTML={{
                  __html: item.action.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
              <div className="ce-badge">{item.badge}</div>
            </div>

            <div className="ce-gap-row">
              <div className="ce-gap-label">Integrity gap</div>
              <div className="ce-gap-track">
                <div
                  className="ce-gap-fill"
                  ref={(el) => { fillRefs.current[i] = el }}
                />
              </div>
              <div className="ce-gap-value">{item.gap}%</div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
