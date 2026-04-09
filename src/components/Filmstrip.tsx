'use client'

import { useEffect, useRef, useState } from 'react'
import { Act } from '@/types/article'

interface FilmstripProps {
  acts: Act[]
  totalMinutes: number
}

export default function Filmstrip({ acts, totalMinutes }: FilmstripProps) {
  const [activeActId, setActiveActId] = useState<string | null>(null)
  const [minutesLeft, setMinutesLeft] = useState(totalMinutes)
  const [finished, setFinished] = useState(false)
  const activeIndexRef = useRef<number>(-1)

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    acts.forEach((act) => {
      const el = document.querySelector(`[data-act-id="${act.id}"]`)
      if (!el) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveActId(act.id)
              activeIndexRef.current = acts.findIndex((a) => a.id === act.id)
            }
          })
        },
        { threshold: 0, rootMargin: '-48px 0px -60% 0px' }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [acts])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) return

      const scrollPercent = scrollTop / docHeight

      if (scrollPercent >= 0.98) {
        setFinished(true)
      } else {
        setFinished(false)
        setMinutesLeft(Math.max(1, Math.round(totalMinutes * (1 - scrollPercent))))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalMinutes])

  const handlePipClick = (id: string) => {
    const target = document.getElementById(id)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <style>{`
        .filmstrip {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 48px;
          z-index: 500;
          background: rgba(10, 8, 6, 0.97);
          border-bottom: 0.5px solid rgba(240, 232, 216, 0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          gap: 1rem;
        }

        .filmstrip-logo {
          font-family: var(--font-label);
          font-size: 15px;
          letter-spacing: 0.12em;
          color: var(--gold);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .filmstrip-logo-short {
          display: none;
        }

        .filmstrip-pips {
          display: flex;
          align-items: center;
          gap: 0;
          flex: 1;
          justify-content: center;
        }

        .filmstrip-pip {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 1.25rem;
          height: 48px;
          justify-content: center;
          cursor: pointer;
          background: none;
          border: none;
          position: relative;
          gap: 2px;
        }

        .pip-label {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.14em;
          color: rgba(240, 232, 216, 0.28);
          text-transform: uppercase;
          line-height: 1;
        }

        .pip-name {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.08em;
          color: rgba(240, 232, 216, 0.22);
          text-transform: uppercase;
          line-height: 1;
          white-space: nowrap;
        }

        .pip-underline {
          position: absolute;
          bottom: 0;
          left: 0.5rem;
          right: 0.5rem;
          height: 2px;
          transform-origin: left;
          transform: scaleX(0);
          transition: transform 0.35s ease;
        }

        .filmstrip-pip.active .pip-label,
        .filmstrip-pip.active .pip-name {
          color: rgba(200, 169, 110, 0.85);
        }

        .filmstrip-pip.active .pip-underline {
          background: var(--gold);
          transform: scaleX(1);
        }

        .filmstrip-pip.done .pip-underline {
          background: rgba(200, 169, 110, 0.35);
          transform: scaleX(1);
        }

        .filmstrip-time {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(240, 232, 216, 0.2);
          text-transform: uppercase;
          white-space: nowrap;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .filmstrip-logo-full { display: none; }
          .filmstrip-logo-short { display: block; }
          .pip-name { display: none; }
          .filmstrip-pip { padding: 0 0.75rem; }
        }
      `}</style>

      <nav className="filmstrip">
        <a href="/" className="filmstrip-logo">
          <span className="filmstrip-logo-full">longcut.ink</span>
          <span className="filmstrip-logo-short">lc</span>
        </a>

        <div className="filmstrip-pips">
          {acts.map((act, i) => {
            const activeIndex = acts.findIndex((a) => a.id === activeActId)
            const isActive = act.id === activeActId
            const isDone = activeIndex > -1 && i < activeIndex

            return (
              <button
                key={act.id}
                className={`filmstrip-pip${isActive ? ' active' : ''}${isDone ? ' done' : ''}`}
                onClick={() => handlePipClick(act.id)}
                aria-label={`Jump to ${act.name}`}
              >
                <span className="pip-label">{act.label}</span>
                <span className="pip-name">{act.name}</span>
                <span className="pip-underline" />
              </button>
            )
          })}
        </div>

        <div className="filmstrip-time">
          {finished ? 'Finished' : `~${minutesLeft} min left`}
        </div>
      </nav>
    </>
  )
}
