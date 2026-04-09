import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'longcut',
  description: 'Cinematic long-form journalism. The long game, in ink.',
  openGraph: {
    title: 'longcut',
    description: 'Cinematic long-form journalism. The long game, in ink.',
    images: ['/og/altman.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'longcut',
    description: 'Cinematic long-form journalism. The long game, in ink.',
    images: ['/og/altman.jpg'],
  },
}

export default function HomePage() {
  return (
    <>
      <style>{`
        .lp-wrap {
          min-height: 100vh;
          background: var(--ink);
          color: var(--paper);
        }

        /* Nav */
        .lp-nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10,8,6,0.97);
          border-bottom: 0.5px solid var(--faint);
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
        }

        .lp-nav-logo {
          font-family: var(--font-label);
          font-size: 11px;
          letter-spacing: 0.16em;
          color: var(--gold);
          font-style: italic;
          text-decoration: none;
          text-transform: uppercase;
        }

        .lp-nav-tag {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.13em;
          color: rgba(240,232,216,0.2);
          text-transform: uppercase;
        }

        /* Brand */
        .lp-brand {
          padding: 52px 2rem 40px;
          text-align: center;
          border-bottom: 0.5px solid var(--faint);
        }

        .lp-brand-logo {
          font-family: var(--font-headline);
          font-size: clamp(32px, 5vw, 52px);
          font-style: italic;
          font-weight: 400;
          letter-spacing: 0.12em;
          color: var(--paper);
          margin-bottom: 10px;
          line-height: 1;
        }

        .lp-brand-logo em {
          color: var(--gold);
        }

        .lp-brand-tag {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.18em;
          color: rgba(240,232,216,0.18);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .lp-brand-desc {
          font-family: var(--font-body);
          font-size: 14px;
          font-style: italic;
          color: rgba(240,232,216,0.38);
          line-height: 1.65;
          max-width: 420px;
          margin: 0 auto;
        }

        /* Featured card */
        .lp-featured {
          display: grid;
          grid-template-columns: 1fr 240px;
          border-bottom: 0.5px solid var(--faint);
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
        }

        .lp-featured:hover {
          background: rgba(200,169,110,0.02);
        }

        .lp-feat-body {
          padding: 32px 36px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
        }

        .lp-feat-issue {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.15em;
          color: rgba(200,169,110,0.5);
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .lp-feat-issue::before {
          content: '';
          display: block;
          width: 18px;
          height: 0.5px;
          background: rgba(200,169,110,0.3);
          flex-shrink: 0;
        }

        .lp-feat-title {
          font-family: var(--font-headline);
          font-size: clamp(26px, 4vw, 42px);
          font-style: italic;
          font-weight: 400;
          color: #f5f0e8;
          line-height: 1.05;
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .lp-feat-subject {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(240,232,216,0.22);
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .lp-feat-deck {
          font-family: var(--font-body);
          font-size: 15px;
          font-style: italic;
          color: rgba(240,232,216,0.48);
          line-height: 1.6;
        }

        .lp-feat-meta {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(240,232,216,0.14);
          text-transform: uppercase;
        }

        /* Image panel */
        .lp-feat-img {
          border-left: 0.5px solid var(--faint);
          position: relative;
          overflow: hidden;
          height: 100%;
          min-height: 220px;
        }

        .lp-feat-img-inner {
          position: absolute;
          inset: 0;
        }

        .lp-feat-img-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          filter: brightness(0.72) saturate(0.8);
          display: block;
        }

        .lp-feat-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(10,8,6,0.65) 0%, rgba(10,8,6,0.1) 100%);
          pointer-events: none;
        }

        /* Coming next */
        .lp-coming {
          padding: 28px 2rem 36px;
        }

        .lp-coming-label {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.15em;
          color: rgba(240,232,216,0.14);
          text-transform: uppercase;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .lp-coming-label::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: var(--faint);
        }

        .lp-coming-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .lp-coming-item {
          border: 0.5px solid var(--faint);
          padding: 18px;
        }

        .lp-coming-item.tbd {
          opacity: 0.25;
        }

        .lp-coming-num {
          font-family: var(--font-label);
          font-size: 7px;
          letter-spacing: 0.12em;
          color: rgba(200,169,110,0.22);
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .lp-coming-name {
          font-family: var(--font-headline);
          font-size: 18px;
          font-style: italic;
          color: rgba(240,232,216,0.45);
          margin-bottom: 5px;
          line-height: 1.1;
        }

        .lp-coming-sub {
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          color: rgba(240,232,216,0.18);
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .lp-coming-deck {
          font-family: var(--font-body);
          font-size: 12px;
          font-style: italic;
          color: rgba(240,232,216,0.28);
          line-height: 1.55;
        }

        /* Mobile */
        @media (max-width: 640px) {
          .lp-nav-tag { display: none; }

          .lp-brand { padding: 36px 1.5rem 28px; }

          .lp-featured {
            grid-template-columns: 1fr;
          }

          .lp-feat-body {
            padding: 24px 1.5rem;
          }

          .lp-feat-img {
            border-left: none;
            border-top: 0.5px solid var(--faint);
            height: 200px;
            min-height: unset;
          }

          .lp-coming {
            padding: 24px 1.5rem 28px;
          }

          .lp-coming-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>

      <div className="lp-wrap">

        <nav className="lp-nav">
          <span className="lp-nav-logo">longcut</span>
          <span className="lp-nav-tag">The long game, in ink</span>
        </nav>

        <div className="lp-brand">
          <div className="lp-brand-logo"><em>long</em>cut</div>
          <div className="lp-brand-tag">Cinematic long-form journalism</div>
          <div className="lp-brand-desc">Each piece takes a real subject and structures it as a non-linear film — four acts, interactive evidence, scroll-triggered reveals. One subject. One reckoning.</div>
        </div>

        <Link href="/altman" className="lp-featured">
          <div className="lp-feat-body">
            <div>
              <div className="lp-feat-issue">Issue 001 · Now reading</div>
              <div className="lp-feat-title">The Architect</div>
              <div className="lp-feat-subject">Sam Altman</div>
              <div className="lp-feat-deck">He said he was building AI to save humanity. He was also building an empire. These are not incompatible — unless you believe the things he said.</div>
            </div>
            <div className="lp-feat-meta">Four acts · ~28 min read</div>
          </div>
          <div className="lp-feat-img">
            <div className="lp-feat-img-inner">
              <Image
                src="/og/altman.jpg"
                alt="The Architect"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center 20%', filter: 'brightness(0.72) saturate(0.8)' }}
                priority
              />
            </div>
            <div className="lp-feat-img-overlay" />
          </div>
        </Link>

        <div className="lp-coming">
          <div className="lp-coming-label">Coming next</div>
          <div className="lp-coming-grid">

            <div className="lp-coming-item">
              <div className="lp-coming-num">Issue 002</div>
              <div className="lp-coming-name">The Strongman</div>
              <div className="lp-coming-sub">Narendra Modi</div>
              <div className="lp-coming-deck">The democracy he bent without breaking.</div>
            </div>

            <div className="lp-coming-item">
              <div className="lp-coming-num">Issue 003</div>
              <div className="lp-coming-name">The Deal</div>
              <div className="lp-coming-sub">Donald Trump</div>
              <div className="lp-coming-deck">The art of winning by never committing to anything.</div>
            </div>

            <div className="lp-coming-item tbd">
              <div className="lp-coming-num">Issue 004</div>
              <div className="lp-coming-name">?</div>
              <div className="lp-coming-sub">To be announced</div>
            </div>

          </div>
        </div>

      </div>
    </>
  )
}
