# Landing Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge the gate and article into one page so voting auto-scrolls into the hero with a 2-second percentage overlay; already-voted users skip the gate entirely.

**Architecture:** `page.tsx` becomes an async server component that fetches altman MDX and passes it as children to a new `LandingClient` client component. `LandingClient` owns gate visibility, the vote overlay, and scroll logic. The `<Gate>` tag inside the MDX is suppressed via `Gate: () => null` in the components map so it never double-renders.

**Tech Stack:** Next.js 14 App Router, next-mdx-remote/rsc, localStorage, IntersectionObserver (none needed here — plain scroll), TypeScript, inline CSS-in-JS (existing pattern)

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/Gate.tsx` | Modify | Add `onVoted` callback; remove "Enter" link + its CSS; add mobile button styles |
| `src/components/LandingClient.tsx` | Create | Gate visibility state, vote overlay, scroll-to-hero, already-voted skip |
| `src/app/page.tsx` | Rewrite | Async server component; fetch MDX; render LandingClient + MDXRemote |

---

## Task 1: Modify Gate — add `onVoted`, remove "Enter" link, add mobile styles

**Files:**
- Modify: `src/components/Gate.tsx`

- [ ] **Step 1: Replace the full Gate.tsx with the updated version**

Write `src/components/Gate.tsx` with these three changes:
1. `onVoted?: (choice: 'yes' | 'no') => void` added to the interface
2. `onVoted?.(choice)` called at the top of `handleVote` (before any state updates)
3. `.gate-enter` CSS removed; `{vote && <a ...>Enter the piece ↓</a>}` JSX removed
4. Mobile media query added

```tsx
'use client'

import { useEffect, useState } from 'react'

interface GateProps {
  question: string
  issueLabel?: string
  seedVotes?: { yes: number; no: number }
  onVoted?: (choice: 'yes' | 'no') => void
}

const DEFAULT_SEED = { yes: 3241, no: 11087 }

export default function Gate({ question, issueLabel, seedVotes, onVoted }: GateProps) {
  const seed = seedVotes ?? DEFAULT_SEED
  const [vote, setVote] = useState<'yes' | 'no' | null>(null)
  const [counts, setCounts] = useState(seed)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('lc_gate') as 'yes' | 'no' | null
    if (stored) {
      setVote(stored)
      setCounts({ yes: seed.yes + (stored === 'yes' ? 1 : 0), no: seed.no + (stored === 'no' ? 1 : 0) })
    }
  }, [])

  const handleVote = (choice: 'yes' | 'no') => {
    if (vote) return
    onVoted?.(choice)
    localStorage.setItem('lc_gate', choice)
    setVote(choice)
    setCounts((prev) => ({ ...prev, [choice]: prev[choice] + 1 }))
  }

  const total = counts.yes + counts.no
  const yesPct = Math.round((counts.yes / total) * 100)
  const noPct = 100 - yesPct

  return (
    <>
      <style>{`
        .gate {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 3rem 2rem;
        }

        .gate-issue {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.15em;
          color: rgba(200, 169, 110, 0.4);
          text-transform: uppercase;
          margin-bottom: 2rem;
        }

        .gate-question {
          font-family: var(--font-headline);
          font-size: clamp(24px, 4.5vw, 50px);
          font-style: italic;
          font-weight: 400;
          max-width: 620px;
          margin: 0 auto 1.5rem;
          line-height: 1.2;
          color: var(--paper);
        }

        .gate-subtext {
          font-family: var(--font-body);
          font-size: 18px;
          font-style: italic;
          color: var(--muted);
          margin-bottom: 2.5rem;
        }

        .gate-buttons {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .gate-btn {
          font-family: var(--font-label);
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 14px 32px;
          border: 0.5px solid rgba(240, 232, 216, 0.2);
          background: transparent;
          color: var(--paper);
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .gate-btn:hover:not(:disabled) {
          border-color: var(--gold);
          color: var(--gold);
        }

        .gate-btn:disabled {
          cursor: default;
        }

        .gate-btn.selected-yes {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(200, 169, 110, 0.06);
        }

        .gate-btn.selected-no {
          border-color: rgba(200, 65, 45, 0.5);
          color: rgba(200, 65, 45, 0.9);
          background: rgba(200, 65, 45, 0.04);
        }

        .gate-bars {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          width: 100%;
          max-width: 200px;
          opacity: 0;
          transition: opacity 0.3s ease 0.3s;
          margin-bottom: 2.5rem;
        }

        .gate-bars.show {
          opacity: 1;
        }

        .gate-bar-row {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .gate-bar-meta {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-label);
          font-size: 8px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(240, 232, 216, 0.3);
        }

        .gate-bar-track {
          height: 2px;
          background: rgba(240, 232, 216, 0.06);
          width: 100%;
          overflow: hidden;
        }

        .gate-bar-fill {
          height: 100%;
          width: 0;
          transition: width 0.6s ease 0.4s;
        }

        .gate-bar-fill.yes {
          background: var(--gold);
        }

        .gate-bar-fill.no {
          background: rgba(200, 65, 45, 0.7);
        }

        .gate-bar-fill.ready {
          width: var(--target-width);
        }

        @media (max-width: 640px) {
          .gate-buttons {
            flex-direction: column;
            width: 100%;
            max-width: 320px;
          }
          .gate-btn {
            width: 100%;
            min-height: 48px;
            padding: 16px 32px;
          }
        }
      `}</style>

      <section className="gate">
        {issueLabel && <p className="gate-issue">{issueLabel}</p>}

        <p className="gate-question">{question}</p>

        <p className="gate-subtext">
          Answer now. Before the evidence. We&rsquo;ll ask again at the end.
        </p>

        <div className="gate-buttons">
          <button
            className={`gate-btn${vote === 'yes' ? ' selected-yes' : ''}`}
            onClick={() => handleVote('yes')}
            disabled={!!vote}
          >
            Yes, I trust him
          </button>
          <button
            className={`gate-btn${vote === 'no' ? ' selected-no' : ''}`}
            onClick={() => handleVote('no')}
            disabled={!!vote}
          >
            No, I don&rsquo;t
          </button>
        </div>

        <div className={`gate-bars${vote ? ' show' : ''}`}>
          <div className="gate-bar-row">
            <div className="gate-bar-meta">
              <span>Yes</span>
              <span>{yesPct}%</span>
            </div>
            <div className="gate-bar-track">
              <div
                className={`gate-bar-fill yes${vote ? ' ready' : ''}`}
                style={{ '--target-width': `${yesPct}%` } as React.CSSProperties}
              />
            </div>
          </div>
          <div className="gate-bar-row">
            <div className="gate-bar-meta">
              <span>No</span>
              <span>{noPct}%</span>
            </div>
            <div className="gate-bar-track">
              <div
                className={`gate-bar-fill no${vote ? ' ready' : ''}`}
                style={{ '--target-width': `${noPct}%` } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/swapnik/Desktop/longcut && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Gate.tsx
git commit -m "feat: add onVoted callback to Gate, remove Enter link, add mobile button styles"
```

---

## Task 2: Create LandingClient component

**Files:**
- Create: `src/components/LandingClient.tsx`

- [ ] **Step 1: Create the file**

```tsx
'use client'

import { useEffect, useState } from 'react'
import Filmstrip from './Filmstrip'
import Gate from './Gate'
import { Act } from '@/types/article'

interface LandingClientProps {
  question: string
  acts: Act[]
  totalMinutes: number
  children: React.ReactNode
}

const SEED = { yes: 3241, no: 11087 }

export default function LandingClient({ question, acts, totalMinutes, children }: LandingClientProps) {
  const [gateVisible, setGateVisible] = useState(true)
  const [overlay, setOverlay] = useState<{ counts: { yes: number; no: number }; fading: boolean } | null>(null)

  useEffect(() => {
    if (localStorage.getItem('lc_gate')) {
      setGateVisible(false)
    }
  }, [])

  const handleVoted = (choice: 'yes' | 'no') => {
    const counts = {
      yes: SEED.yes + (choice === 'yes' ? 1 : 0),
      no: SEED.no + (choice === 'no' ? 1 : 0),
    }
    setGateVisible(false)
    setOverlay({ counts, fading: false })

    requestAnimationFrame(() => {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
    })

    setTimeout(() => setOverlay((o) => (o ? { ...o, fading: true } : null)), 900)
    setTimeout(() => setOverlay(null), 2300)
  }

  const total = overlay ? overlay.counts.yes + overlay.counts.no : 1
  const yesPct = overlay ? Math.round((overlay.counts.yes / total) * 100) : 0
  const noPct = 100 - yesPct

  return (
    <>
      <style>{`
        .lc-overlay {
          position: fixed;
          inset: 0;
          z-index: 450;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4rem;
          background: rgba(10, 8, 6, 0.68);
          opacity: 1;
          transition: opacity 1.4s ease;
          pointer-events: none;
        }

        .lc-overlay-out {
          opacity: 0;
        }

        .lc-ov-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .lc-ov-pct {
          font-family: var(--font-headline);
          font-size: clamp(36px, 6vw, 60px);
          font-weight: 400;
          font-style: italic;
          line-height: 1;
        }

        .lc-ov-pct-yes {
          color: var(--gold);
        }

        .lc-ov-pct-no {
          color: rgba(200, 65, 45, 0.8);
        }

        .lc-ov-label {
          font-family: var(--font-label);
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .lc-ov-label-yes {
          color: rgba(200, 169, 110, 0.4);
        }

        .lc-ov-label-no {
          color: rgba(200, 65, 45, 0.35);
        }
      `}</style>

      <Filmstrip acts={acts} totalMinutes={totalMinutes} />

      {gateVisible && (
        <Gate
          question={question}
          issueLabel="longcut.ink · Issue 001 · The Architect"
          onVoted={handleVoted}
        />
      )}

      {overlay && (
        <div
          className={`lc-overlay${overlay.fading ? ' lc-overlay-out' : ''}`}
          aria-hidden="true"
        >
          <div className="lc-ov-item">
            <div className="lc-ov-pct lc-ov-pct-yes">{yesPct}%</div>
            <div className="lc-ov-label lc-ov-label-yes">Trust him</div>
          </div>
          <div className="lc-ov-item">
            <div className="lc-ov-pct lc-ov-pct-no">{noPct}%</div>
            <div className="lc-ov-label lc-ov-label-no">Don&rsquo;t trust</div>
          </div>
        </div>
      )}

      <main>
        {children}
      </main>
    </>
  )
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/swapnik/Desktop/longcut && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add src/components/LandingClient.tsx
git commit -m "feat: add LandingClient — gate state, vote overlay, scroll-to-hero"
```

---

## Task 3: Rewrite page.tsx as server component

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx**

```tsx
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getArticleBySlug } from '@/lib/mdx'
import LandingClient from '@/components/LandingClient'
import Hero from '@/components/Hero'
import ActBreak from '@/components/ActBreak'
import Prose from '@/components/Prose'
import OpenLoop from '@/components/OpenLoop'
import PullQuote from '@/components/PullQuote'
import SceneCard from '@/components/SceneCard'
import OralHistory from '@/components/OralHistory'
import SecondPerson from '@/components/SecondPerson'
import EvidenceFile from '@/components/EvidenceFile'
import ContradictionEngine from '@/components/ContradictionEngine'
import Verdict from '@/components/Verdict'
import MotifReveal from '@/components/MotifReveal'
import MentalModel from '@/components/MentalModel'
import ReaderVote from '@/components/ReaderVote'

export const metadata: Metadata = {
  title: 'longcut.ink',
  description: 'Cinematic long-form journalism. The long game, in ink.',
  openGraph: {
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'longcut.ink',
    description: 'Cinematic long-form journalism. The long game, in ink.',
  },
}

// Gate inside the MDX is suppressed — LandingClient renders the real Gate above
const NullGate = () => null

const components = {
  Gate: NullGate,
  Hero,
  ActBreak,
  Prose,
  OpenLoop,
  PullQuote,
  SceneCard,
  OralHistory,
  SecondPerson,
  EvidenceFile,
  ContradictionEngine,
  Verdict,
  MotifReveal,
  MentalModel,
  ReaderVote,
}

export default async function HomePage() {
  const data = getArticleBySlug('altman')
  if (!data) return null

  const { frontmatter, content } = data

  return (
    <LandingClient
      question={frontmatter.gate}
      acts={frontmatter.acts}
      totalMinutes={frontmatter.totalMinutes}
    >
      <MDXRemote source={content} components={components} />
    </LandingClient>
  )
}
```

- [ ] **Step 2: Run build to verify**

```bash
cd /Users/swapnik/Desktop/longcut && npm run build
```

Expected output includes:
```
✓ Compiled successfully
Route (app)
┌ ○ /
├ ● /[article]
│ └ /altman
└ ○ /sitemap.xml
```
No errors, no type failures.

- [ ] **Step 3: Smoke-test locally**

```bash
npm run dev
```

Open `http://localhost:3000`:
- Gate question renders fullscreen
- Clicking Yes/No → overlay appears with two percentages → page smoothly scrolls to Hero → overlay fades out
- Clear `lc_gate` from localStorage DevTools → reload → gate shows
- Set `lc_gate` to `"yes"` in DevTools → reload → gate is skipped, page opens on Hero
- At 375px width: buttons are full-width and visually ≥48px tall

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign landing page — gate + article inline, vote auto-scrolls to hero"
```

---

## Task 4: Push and verify

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

- [ ] **Step 2: Verify Vercel deployment**

Watch Vercel dashboard for deploy to complete. Then:
- `longcut.ink` — gate shows, vote scrolls to hero, overlay fades
- `longcut.ink/altman` — article still works independently, gate inside MDX renders normally
- Already-voted user (check with `lc_gate` in localStorage): lands directly on Hero
