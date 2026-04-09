'use client'

import { useEffect, useRef } from 'react'

interface SceneCardProps {
  leftLabel: string
  leftText: string
  leftSource: string
  rightLabel: string
  rightText: string
  rightSource: string
}

export default function SceneCard({
  leftLabel, leftText, leftSource,
  rightLabel, rightText, rightSource,
}: SceneCardProps) {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const pairs: [HTMLDivElement | null, number][] = [
      [leftRef.current, 0],
      [rightRef.current, 100],
    ]
    const observers: IntersectionObserver[] = []

    pairs.forEach(([el, delay]) => {
      if (!el) return
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => el.classList.add('sc-vis'), delay)
            observer.disconnect()
          }
        },
        { threshold: 0.15 }
      )
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <>
      <style>{`
        .scene-card {
          max-width: 820px;
          margin: 2rem auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          border: 0.5px solid var(--faint);
          overflow: hidden;
        }

        .scene-col {
          padding: 2.5rem;
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }

        .scene-col.sc-vis {
          opacity: 1;
          transform: translateY(0);
        }

        .scene-col-left {
          background: rgba(200, 169, 110, 0.02);
          border-right: 0.5px solid var(--faint);
        }

        .scene-col-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.4s;
        }

        .scene-col.sc-vis .scene-col-label {
          opacity: 1;
        }

        .scene-col-text {
          font-family: var(--font-body);
          font-size: 16px;
          font-style: italic;
          color: rgba(240, 232, 216, 0.75);
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .scene-col-source {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.08em;
          color: rgba(240, 232, 216, 0.2);
          margin-top: 1rem;
        }

        @media (max-width: 640px) {
          .scene-card {
            grid-template-columns: 1fr;
          }

          .scene-col-left {
            border-right: none;
            border-bottom: 0.5px solid var(--faint);
          }
        }
      `}</style>

      <div className="scene-card">
        <div className="scene-col scene-col-left" ref={leftRef}>
          <div className="scene-col-label">{leftLabel}</div>
          <div className="scene-col-text">{leftText}</div>
          <div className="scene-col-source">{leftSource}</div>
        </div>
        <div className="scene-col" ref={rightRef}>
          <div className="scene-col-label">{rightLabel}</div>
          <div className="scene-col-text">{rightText}</div>
          <div className="scene-col-source">{rightSource}</div>
        </div>
      </div>
    </>
  )
}
