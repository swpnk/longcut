'use client'

import { useEffect, useRef } from 'react'

interface OpenLoopProps {
  word: string
  note: string
  preLabel?: string
}

export default function OpenLoop({ word, note, preLabel }: OpenLoopProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('ol-vis')
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .open-loop {
          max-width: 660px;
          margin: 0 auto;
          padding: 2.5rem;
          border-top: 0.5px solid var(--gold-dim);
          border-bottom: 0.5px solid var(--gold-dim);
        }

        .open-loop-prelabel {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.25);
          margin-bottom: 0.75rem;
          opacity: 0;
          transition: opacity 0.5s ease 0.15s;
        }

        .open-loop.ol-vis .open-loop-prelabel {
          opacity: 1;
        }

        .open-loop-word {
          display: block;
          font-family: var(--font-headline);
          font-weight: 700;
          font-style: italic;
          font-size: clamp(44px, 7vw, 80px);
          color: var(--gold);
          margin: 0.5rem 0;
          line-height: 1;
          opacity: 0;
          transform: translateY(30px) scale(0.94);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s,
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.05s;
        }

        .open-loop.ol-vis .open-loop-word {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .open-loop-note {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.18);
          margin-top: 0.5rem;
          opacity: 0;
          transition: opacity 0.5s ease 0.5s;
        }

        .open-loop.ol-vis .open-loop-note {
          opacity: 1;
        }

        .open-loop-note::before {
          content: '';
          display: block;
          width: 20px;
          height: 0.5px;
          background: var(--gold-dim);
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .open-loop {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>

      <div className="open-loop" ref={ref}>
        {preLabel && <div className="open-loop-prelabel">{preLabel}</div>}
        <span className="open-loop-word">{word}</span>
        <div className="open-loop-note">{note}</div>
      </div>
    </>
  )
}
