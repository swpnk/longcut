'use client'

import { useEffect, useRef } from 'react'
import { ReactNode } from 'react'

interface SecondPersonProps {
  tag: string
  children: ReactNode
}

export default function SecondPerson({ tag, children }: SecondPersonProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tagRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    const tagEl = tagRef.current
    if (!container || !tagEl) return

    // Reveal the container border/background on intersection
    const containerObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          container.classList.add('sp-vis')
          containerObserver.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    containerObserver.observe(container)

    // Stagger-reveal each paragraph inside the content
    const contentEl = container.querySelector('.second-person-content')
    if (contentEl) {
      const paras = Array.from(contentEl.querySelectorAll('p'))
      paras.forEach((p, i) => {
        p.classList.add('sp-para')
        const paraObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => p.classList.add('sp-para-vis'), i * 120)
              paraObserver.disconnect()
            }
          },
          { threshold: 0.2 }
        )
        paraObserver.observe(p)
      })
    }

    return () => containerObserver.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .second-person {
          width: 100%;
          background: rgba(200, 169, 110, 0.025);
          border-top: 0.5px solid transparent;
          border-bottom: 0.5px solid transparent;
          padding: 4rem 2.5rem;
          margin: 3rem 0;
          transition: border-color 0.6s ease 0.2s;
        }

        .second-person.sp-vis {
          border-top-color: var(--gold-dim);
          border-bottom-color: var(--gold-dim);
        }

        .second-person-inner {
          max-width: 660px;
          margin: 0 auto;
        }

        .second-person-tag {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.35);
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s ease 0.35s, transform 0.5s ease 0.35s;
        }

        .second-person.sp-vis .second-person-tag {
          opacity: 1;
          transform: translateY(0);
        }

        .second-person-tag::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: var(--gold-dim);
        }

        .second-person-content {
          font-family: var(--font-headline);
          font-size: clamp(16px, 2vw, 20px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.7;
          color: rgba(240, 232, 216, 0.88);
        }

        .second-person-content p {
          margin-bottom: 1.1em;
        }

        .second-person-content p:last-child {
          margin-bottom: 0;
        }

        .second-person-content em {
          color: var(--gold);
          font-style: italic;
        }

        /* Per-paragraph reveals */
        .sp-para {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }

        .sp-para.sp-para-vis {
          opacity: 1;
          transform: translateY(0);
        }

        @media (max-width: 640px) {
          .second-person {
            padding: 3rem 1.5rem;
          }
        }
      `}</style>

      <div className="second-person" ref={containerRef}>
        <div className="second-person-inner">
          <div className="second-person-tag" ref={tagRef}>{tag}</div>
          <div className="second-person-content">{children}</div>
        </div>
      </div>
    </>
  )
}
