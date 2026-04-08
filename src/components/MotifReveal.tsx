'use client'

import { useEffect, useRef } from 'react'
import { VerdictLine } from '@/types/article'

interface MotifRevealProps {
  lines: VerdictLine[]
}

function renderLine(line: VerdictLine): React.ReactNode {
  if (typeof line === 'string') return line

  if (line.em === true) {
    return <span style={{ color: 'var(--gold)' }}>{line.text}</span>
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

export default function MotifReveal({ lines }: MotifRevealProps) {
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
              setTimeout(() => el.classList.add('lit'), i * 250)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  const lastIndex = lines.length - 1

  return (
    <>
      <style>{`
        .motif-wrap {
          padding: 5rem 2rem;
          text-align: center;
        }

        .motif-line {
          font-family: var(--font-headline);
          font-size: clamp(17px, 2.5vw, 26px);
          font-style: italic;
          font-weight: 400;
          color: rgba(240, 232, 216, 0.07);
          transition: color 0.8s ease;
          line-height: 1.45;
          margin: 0 0 0.5rem;
        }

        .motif-line.lit {
          color: rgba(240, 232, 216, 0.9);
        }

        .motif-line-last {
          font-size: clamp(14px, 2vw, 21px);
        }

        .motif-line-last.lit {
          color: rgba(240, 232, 216, 0.6);
        }
      `}</style>

      <div className="motif-wrap" ref={containerRef}>
        {lines.map((line, i) => {
          const isLast = i === lastIndex
          return (
            <p
              key={i}
              className={`motif-line${isLast ? ' motif-line-last' : ''}`}
              ref={(el) => { lineRefs.current[i] = el }}
            >
              {renderLine(line)}
            </p>
          )
        })}
      </div>
    </>
  )
}
