'use client'

import { useEffect, useRef } from 'react'

interface PullQuoteProps {
  quote: string
  cite: string
}

export default function PullQuote({ quote, cite }: PullQuoteProps) {
  const ref = useRef<HTMLQuoteElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('pq-vis')
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style>{`
        .pull-quote {
          max-width: 580px;
          margin: 0 auto 3rem;
          padding: 1.75rem 2.5rem;
          border-left: 2px solid transparent;
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.8s ease, transform 0.8s ease, border-left-color 0.6s ease 0.5s;
        }

        .pull-quote.pq-vis {
          opacity: 1;
          transform: translateY(0);
          border-left-color: var(--gold);
        }

        .pull-quote-text {
          font-family: var(--font-headline);
          font-size: clamp(16px, 2vw, 21px);
          font-style: italic;
          font-weight: 400;
          line-height: 1.45;
          color: #f0e8d8;
          margin-bottom: 0.75rem;
        }

        .pull-quote-cite {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          font-style: normal;
          opacity: 0;
          transition: opacity 0.5s ease 0.9s;
        }

        .pull-quote.pq-vis .pull-quote-cite {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .pull-quote {
            margin: 0 1.5rem 3rem;
            padding: 1.5rem;
          }
        }
      `}</style>

      <blockquote className="pull-quote" ref={ref}>
        <p className="pull-quote-text">{quote}</p>
        <cite className="pull-quote-cite">{cite}</cite>
      </blockquote>
    </>
  )
}
