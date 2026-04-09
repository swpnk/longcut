'use client'

import { useEffect, useRef } from 'react'

interface MentalModelProps {
  name: string
  definition: string
  note: string
}

export default function MentalModel({ name, definition, note }: MentalModelProps) {
  const mainRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('mm-vis')
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
        .mm-letterbox {
          width: 100%;
          margin: 3rem 0;
        }

        /* Cinema bars */
        .mm-bar {
          background: #000;
          height: 56px;
          width: 100%;
        }

        /* Main panel */
        .mm-main {
          background: #050403;
          border-top: 0.5px solid #1a1614;
          border-bottom: 0.5px solid #1a1614;
          padding: 4rem 2rem;
          text-align: center;
        }

        .mm-eyebrow {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(200,169,110,0.35);
          margin-bottom: 2rem;
          opacity: 0;
          transition: opacity 0.5s ease 0.1s;
        }

        .mm-main.mm-vis .mm-eyebrow {
          opacity: 1;
        }

        .mm-name {
          font-family: var(--font-headline);
          font-size: clamp(28px, 5vw, 54px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          line-height: 1.1;
          letter-spacing: -0.01em;
          margin-bottom: 2rem;
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.75s ease 0.25s, transform 0.75s ease 0.25s;
        }

        .mm-main.mm-vis .mm-name {
          opacity: 1;
          transform: translateY(0);
        }

        .mm-def {
          font-family: var(--font-body);
          font-size: clamp(14px, 1.8vw, 17px);
          font-style: italic;
          color: rgba(240,232,216,0.48);
          line-height: 1.8;
          max-width: 520px;
          margin: 0 auto 2rem;
          opacity: 0;
          transition: opacity 0.6s ease 0.55s;
        }

        .mm-main.mm-vis .mm-def {
          opacity: 1;
        }

        .mm-divider {
          width: 32px;
          height: 0.5px;
          background: rgba(200,169,110,0.2);
          margin: 0 auto 2rem;
          opacity: 0;
          transition: opacity 0.4s ease 0.7s;
        }

        .mm-main.mm-vis .mm-divider {
          opacity: 1;
        }

        .mm-note {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(200,169,110,0.25);
          max-width: 440px;
          margin: 0 auto;
          line-height: 1.9;
          opacity: 0;
          transition: opacity 0.5s ease 0.85s;
        }

        .mm-main.mm-vis .mm-note {
          opacity: 1;
        }

        @media (max-width: 640px) {
          .mm-bar { height: 36px; }
          .mm-main { padding: 3rem 1.5rem; }
        }
      `}</style>

      <div className="mm-letterbox">
        <div className="mm-bar" />
        <div className="mm-main" ref={mainRef}>
          <div className="mm-eyebrow">Mental Model &middot; Take this with you</div>
          <div className="mm-name">{name}</div>
          <div className="mm-def">{definition}</div>
          <div className="mm-divider" />
          <div className="mm-note">{note}</div>
        </div>
        <div className="mm-bar" />
      </div>
    </>
  )
}
