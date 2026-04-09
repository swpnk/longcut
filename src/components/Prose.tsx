'use client'

import { useEffect, useRef } from 'react'
import { ReactNode } from 'react'

interface ProseProps {
  children: ReactNode
  dropcap?: boolean
  wide?: boolean
}

export default function Prose({ children, dropcap, wide }: ProseProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger each paragraph
          const paras = el.querySelectorAll('p')
          paras.forEach((p, i) => {
            setTimeout(() => p.classList.add('prose-p-vis'), i * 80)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .prose {
          max-width: 660px;
          margin: 0 auto;
          padding: 1rem 2.5rem 3rem;
        }

        .prose-wide {
          max-width: 820px;
        }

        .prose p {
          font-family: var(--font-body);
          font-size: 19px;
          line-height: 1.8;
          color: rgba(240, 232, 216, 0.87);
          margin-bottom: 1.65em;
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }

        .prose p.prose-p-vis {
          opacity: 1;
          transform: translateY(0);
        }

        .prose-dropcap p:first-child::first-letter {
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: 4.2em;
          float: left;
          margin: 0.05em 0.12em 0 0;
          color: var(--gold);
          line-height: 0.85;
        }

        @media (max-width: 640px) {
          .prose {
            padding: 1rem 1.5rem 2.5rem;
          }
        }
      `}</style>

      <div
        className={`prose${wide ? ' prose-wide' : ''}${dropcap ? ' prose-dropcap' : ''}`}
        ref={ref}
      >
        {children}
      </div>
    </>
  )
}
