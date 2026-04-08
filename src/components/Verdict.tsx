'use client'

import { useEffect, useRef } from 'react'
import { VerdictLine } from '@/types/article'

interface VerdictProps {
  lines: VerdictLine[]
  coda?: string
}

function renderLine(line: VerdictLine, isLit: boolean): React.ReactNode {
  if (typeof line === 'string') return line

  if (line.em === true) {
    return <span style={{ color: isLit ? 'var(--gold)' : 'inherit' }}>{line.text}</span>
  }

  if (typeof line.em === 'string') {
    const parts = line.text.split(line.em)
    return parts.map((part, i) =>
      i < parts.length - 1 ? (
        <span key={i}>
          {part}
          <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>{line.em as string}</em>
        </span>
      ) : (
        <span key={i}>{part}</span>
      )
    )
  }

  return line.text
}

export default function Verdict({ lines = [], coda }: VerdictProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLParagraphElement | null)[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lineRefs.current.forEach((el, i) => {
              if (!el) return
              setTimeout(() => el.classList.add('lit'), i * 300)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.35 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .verdict-wrap {
          padding: 5rem 2rem;
          text-align: center;
          background: rgba(200, 169, 110, 0.012);
        }

        .verdict-line {
          font-family: var(--font-headline);
          font-size: clamp(17px, 2.5vw, 26px);
          font-style: italic;
          font-weight: 400;
          color: rgba(240, 232, 216, 0.07);
          transition: color 0.8s ease;
          line-height: 1.45;
          margin: 0 0 0.5rem;
        }

        .verdict-line.lit {
          color: rgba(240, 232, 216, 0.9);
        }

        .verdict-coda {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.2);
          margin-top: 2.5rem;
        }
      `}</style>

      <div className="verdict-wrap" ref={containerRef}>
        {lines.map((line, i) => (
          <p
            key={i}
            className="verdict-line"
            ref={(el) => { lineRefs.current[i] = el }}
          >
            {renderLine(line, lineRefs.current[i]?.classList.contains('lit') ?? false)}
          </p>
        ))}
        {coda && <div className="verdict-coda">{coda}</div>}
      </div>
    </>
  )
}
