interface HeroProps {
  title: string
  titleEm: string
  coldOpenTag: string
  deck: string
  meta: string[]
}

export default function Hero({ title, titleEm, coldOpenTag, deck, meta }: HeroProps) {
  const parts = title.split(titleEm)

  return (
    <>
      <style>{`
        .hero {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 48px 2.5rem 5rem;
          position: relative;
          overflow: hidden;
        }

        .hero-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,8,6,0.2) 0%, rgba(10,8,6,0.5) 60%, rgba(10,8,6,0.85) 100%);
          pointer-events: none;
        }

        .hero-ghost {
          position: absolute;
          right: 1rem;
          bottom: 3rem;
          font-family: var(--font-headline);
          font-weight: 700;
          font-size: clamp(140px, 18vw, 240px);
          color: rgba(240, 232, 216, 0.022);
          line-height: 1;
          user-select: none;
          pointer-events: none;
        }

        .hero-content {
          position: relative;
          z-index: 1;
          max-width: 820px;
        }

        .hero-tag {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }

        .hero-tag::before {
          content: '';
          display: block;
          width: 30px;
          height: 0.5px;
          background: var(--gold);
          flex-shrink: 0;
        }

        .hero-title {
          font-family: var(--font-headline);
          font-size: clamp(44px, 7vw, 84px);
          font-weight: 400;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #f5f0e8;
          margin-bottom: 1.5rem;
        }

        .hero-title em {
          color: var(--gold);
          font-style: italic;
        }

        .hero-deck {
          font-family: var(--font-body);
          font-size: 20px;
          font-style: italic;
          color: var(--muted);
          max-width: 520px;
          line-height: 1.5;
          margin-bottom: 1.5rem;
        }

        .hero-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.1em;
          color: rgba(240, 232, 216, 0.22);
          flex-wrap: wrap;
        }

        .hero-meta-sep {
          color: rgba(240, 232, 216, 0.3);
          opacity: 0.3;
        }

        .hero-scroll {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          z-index: 1;
        }

        .hero-scroll-line {
          width: 0.5px;
          height: 36px;
          background: var(--gold);
          animation: hero-scroll-pulse 1.8s ease-in-out infinite;
        }

        .hero-scroll-text {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(200, 169, 110, 0.4);
        }

        @keyframes hero-scroll-pulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1); }
          50% { opacity: 1; transform: scaleY(1.1); }
        }

        @media (max-width: 640px) {
          .hero {
            padding: 48px 1.5rem 4rem;
          }
          .hero-ghost {
            display: none;
          }
        }
      `}</style>

      <section className="hero" id="hero">
        <div className="hero-vignette" />
        <div className="hero-ghost">01</div>

        <div className="hero-content">
          <div className="hero-tag">{coldOpenTag}</div>

          <h1 className="hero-title">
            {parts[0]}
            <em>{titleEm}</em>
            {parts[1]}
          </h1>

          <p className="hero-deck">{deck}</p>

          <div className="hero-meta">
            {meta.map((item, i) => (
              <span key={i}>
                {item}
                {i < meta.length - 1 && <span className="hero-meta-sep"> · </span>}
              </span>
            ))}
          </div>
        </div>

        <div className="hero-scroll">
          <div className="hero-scroll-line" />
          <span className="hero-scroll-text">scroll</span>
        </div>
      </section>
    </>
  )
}
