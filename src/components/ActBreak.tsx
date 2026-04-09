'use client'

import { useEffect, useRef } from 'react'

interface ActBreakProps {
  number: string | number
  title: string
  id?: string
}

export default function ActBreak({ number, title, id }: ActBreakProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('ab-vis')
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .act-break {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 5rem 2rem 4rem;
          border-top: 0.5px solid var(--faint);
          position: relative;
          text-align: center;
          overflow: hidden;
        }

        .act-break-anchor {
          position: absolute;
          top: -48px;
          visibility: hidden;
          pointer-events: none;
        }

        .act-ghost {
          position: absolute;
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: clamp(80px, 14vw, 160px);
          color: rgba(240, 232, 216, 0.018);
          line-height: 1;
          user-select: none;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.82);
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s,
                      color 1.2s ease 0.1s;
        }

        .act-break.ab-vis .act-ghost {
          transform: translate(-50%, -50%) scale(1);
          color: rgba(240, 232, 216, 0.03);
        }

        .act-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.75rem;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(14px);
          transition: opacity 0.6s ease 0.2s, transform 0.6s ease 0.2s;
        }

        .act-break.ab-vis .act-label {
          opacity: 1;
          transform: translateY(0);
        }

        .act-rule {
          width: 0;
          height: 0.5px;
          background: var(--gold-dim);
          margin: 0.6rem auto;
          position: relative;
          z-index: 1;
          transition: width 0.5s ease 0.5s;
        }

        .act-break.ab-vis .act-rule {
          width: 40px;
        }

        .act-title {
          font-family: var(--font-headline);
          font-size: clamp(20px, 3.2vw, 36px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          position: relative;
          z-index: 1;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s;
        }

        .act-break.ab-vis .act-title {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .act-ghost {
            display: none;
          }
        }
      `}</style>

      <div
        className="act-break"
        data-act-id={id}
        ref={containerRef}
      >
        {id && <span id={id} className="act-break-anchor" />}
        <div className="act-ghost">{number}</div>
        <div className="act-label">Act {number}</div>
        <div className="act-rule" />
        <div className="act-title">{title}</div>
      </div>
    </>
  )
}
