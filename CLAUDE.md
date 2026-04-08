# longcut.ink — Claude Code Master Context

> Read this file before every task. It contains everything you need to know about this project. Never ask for clarification on anything covered here.

---

## What This Project Is

longcut.ink is a cinematic long-form journalism site. Each article takes a real-world subject (Sam Altman, Modi, Trump) and structures it as a non-linear film narrative — four acts, interactive components, scroll-triggered reveals, reader participation. Think The Pudding meets investigative journalism.

The site is built so that publishing a new article = dropping in one MDX file and pushing to Vercel. The platform is built once. Articles are content files.

**Live domain:** longcut.ink (GoDaddy → Vercel nameservers)
**Deployment:** Vercel, auto-deploys on push to main
**First article:** Sam Altman — "The Architect" at /altman

---

## Tech Stack

```
Framework:     Next.js 14 (App Router)
Language:      TypeScript
Styling:       Tailwind CSS + CSS custom properties
Content:       MDX (next-mdx-remote)
Scroll:        Scrollama.js (scrollytelling sections only)
Animation:     CSS transitions + IntersectionObserver (no heavy libraries)
State:         localStorage only (no backend, no auth)
Fonts:         Google Fonts via next/font
Deployment:    Vercel
```

**Do not add:** Redux, Zustand, Framer Motion, GSAP, any CMS, any database, any auth. Keep the stack minimal.

---

## Design System

### CSS Custom Properties
Define these in `src/styles/globals.css`. Use them everywhere — never hardcode hex values.

```css
:root {
  --ink: #0a0806;        /* page background — warm black */
  --paper: #f0e8d8;      /* primary text */
  --gold: #c8a96e;       /* accent — used sparingly */
  --gold-dim: rgba(200, 169, 110, 0.18);
  --muted: rgba(240, 232, 216, 0.45);
  --faint: rgba(240, 232, 216, 0.07);
  --red: rgba(200, 65, 45, 0.7);  /* contradiction engine only */
}
```

### Typography
Import via `next/font/google` in `src/app/layout.tsx`:
- **Playfair Display** — weights 400, 700, italic — headlines, act titles, pull quotes
- **EB Garamond** — weights 400, italic — body prose, oral history quotes
- **DM Mono** — weights 300, 400 — all labels, metadata, tags, navigation

### Type Scale
```
Hero title:      clamp(44px, 7vw, 84px)   Playfair Display
Act title:       clamp(22px, 3.5vw, 38px) Playfair Display italic
Prose body:      19px / line-height 1.8   EB Garamond
Pull quote:      clamp(17px, 2.2vw, 22px) Playfair Display italic
Labels/tags:     9–10px / tracking .15em  DM Mono uppercase
```

### Spacing
- Prose max-width: 660px, centered, padding 0 2.5rem
- Wide components (oral history, contradiction engine): max-width 820px
- Full-bleed components (hero, act breaks, second person): no max-width
- Vertical rhythm: 3rem between major sections, 1.65em between prose paragraphs

### Borders
- Standard: `0.5px solid var(--faint)`
- Emphasis: `0.5px solid var(--gold-dim)`
- Pull quote accent: `2px solid var(--gold)` (left border only)

---

## Project Structure

```
longcut/
├── CLAUDE.md                    ← this file
├── TASKS.md                     ← build task list
├── src/
│   ├── app/
│   │   ├── layout.tsx           ← root layout, fonts, metadata
│   │   ├── page.tsx             ← landing page (gate question)
│   │   ├── globals.css          ← CSS custom properties
│   │   └── [article]/
│   │       └── page.tsx         ← dynamic article route
│   ├── components/
│   │   ├── README.md            ← component contracts
│   │   ├── Filmstrip.tsx        ← fixed nav with act pips
│   │   ├── Gate.tsx             ← commitment device
│   │   ├── Hero.tsx             ← full-vh cold open hero
│   │   ├── ActBreak.tsx         ← cinematic act separator
│   │   ├── Prose.tsx            ← body text wrapper
│   │   ├── OpenLoop.tsx         ← planted word component
│   │   ├── PullQuote.tsx        ← editorial blockquote
│   │   ├── SceneCard.tsx        ← promise vs reality 2-col
│   │   ├── OralHistory.tsx      ← multi-voice section
│   │   ├── SecondPerson.tsx     ← immersive 2nd-person wrapper
│   │   ├── EvidenceFile.tsx     ← redactable document
│   │   ├── ContradictionEngine.tsx ← he said / he did
│   │   ├── Verdict.tsx          ← timed sequential reveal
│   │   ├── MotifReveal.tsx      ← motif detonation
│   │   ├── MentalModel.tsx      ← portable concept box
│   │   └── ReaderVote.tsx       ← final vote with recall
│   ├── content/
│   │   └── altman.mdx           ← Sam Altman article
│   ├── lib/
│   │   └── mdx.ts               ← MDX processing utilities
│   └── types/
│       └── article.ts           ← shared TypeScript types
├── public/
│   └── og/
│       └── altman.jpg           ← OG image for social sharing
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Component Conventions

### Props pattern
Every component receives strongly typed props. Define interfaces in the component file, not in a separate types file (except shared types in `src/types/article.ts`).

### Scroll reveals
Use `IntersectionObserver` directly — no library. Standard pattern:

```typescript
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
        }
      })
    },
    { threshold: 0.2 }
  )
  // observe elements
  return () => observer.disconnect()
}, [])
```

### State persistence
Use `localStorage` only. Keys:
- `lc_gate` — gate vote ('yes' | 'no')
- `lc_final` — final vote ('yes' | 'no')

Always check `typeof window !== 'undefined'` before accessing localStorage (SSR safety).

### Animation
CSS transitions only. No JavaScript animation libraries.

```css
.reveal-item {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}
.reveal-item.visible {
  opacity: 1;
  transform: translateY(0);
}
```

### Mobile breakpoint
Single breakpoint at 640px. Use Tailwind `sm:` prefix or CSS media query `@media (max-width: 640px)`.

At mobile:
- 2-column grids → 1 column
- Filmstrip act names hidden, numbers only
- Prose padding: 0 1.5rem
- Ghost numerals in act breaks: hidden

---

## MDX Article Format

Every article is an MDX file in `src/content/`. Structure:

```mdx
---
title: string
subject: string
issue: string           ("001", "002"...)
deck: string
totalMinutes: number
gate: string            (the gate question)
coldOpenTag: string     ("Cold open · Las Vegas · November 17, 2023")
acts:
  - id: string
    label: string       ("Act I")
    name: string        ("The Boy")
---

<Gate question={frontmatter.gate} />

<Hero
  title="..."
  titleEm="..."          (the word to render in gold italic)
  coldOpenTag={frontmatter.coldOpenTag}
  deck={frontmatter.deck}
  meta={["Sam Altman", "Four acts", "~28 min read"]}
/>

<OpenLoop word="Lying." note="We'll return to what was in them." />

<ActBreak number="I" title="The Boy Who Took Computers Apart" />

<Prose dropcap>
  Prose content here...
</Prose>

<PullQuote
  quote="Quote text here."
  cite="— Attribution"
/>

<SceneCard
  leftLabel="The promise · 2023"
  leftText="..."
  leftSource="Source · Publication · Year"
  rightLabel="The reality · Same year"
  rightText="..."
  rightSource="Source · Publication · Year"
/>

<OralHistory voices={[
  { name: "Name", role: "Role · Context", quote: "Quote text." }
]} />

<SecondPerson tag="Second person · The Ambien night">
  Prose in second person here...
</SecondPerson>

<EvidenceFile
  label="Primary source — internal document · Fall 2023"
  from="I. Sutskever"
  to="[Board — disappearing message]"
  subject="Sam exhibits a consistent pattern of..."
  items={[
    { number: "01", text: "Lying." },
    { number: "03", text: "Deceiving the board about safety protocols — including ", redacted: "claiming GPT-4 Turbo needed no safety review." }
  ]}
/>

<ContradictionEngine contradictions={[
  {
    yearSaid: "December 2015",
    quote: "Safety should be a first-class requirement.",
    source: "OpenAI founding principles",
    yearDid: "2022–2023",
    action: "Quietly lobbied to dilute EU AI oversight...",
    badge: "Lobbied against own principles",
    gap: 18
  }
]} />

<Verdict lines={[
  "He used apocalyptic rhetoric to explain how AGI could destroy us all.",
  { text: "And why, therefore, he should be the one to build it.", em: true }
]} />

<MotifReveal lines={[
  "He took the computer apart to understand how it worked.",
  { text: "He took Loopt apart.", em: "Loopt" }
]} />

<MentalModel
  name="The Constraint Escape"
  definition="A leader builds structures that constrain their future power..."
  note="Next time you see a powerful institution built around safety..."
/>

<ReaderVote question={frontmatter.gate} />
```

---

## Seeded Vote Data

The Gate and ReaderVote components display live-looking percentages. Use these seed values:

```typescript
const SEED_VOTES = { yes: 3241, no: 11087 }
```

Increment by 1 when user votes. Store in localStorage. Reset never.

---

## Performance Targets

- First Contentful Paint: < 1.5s
- No client-side data fetching (all content is static MDX)
- Images: next/image with lazy loading
- Fonts: next/font (no CSS @import)
- Bundle: no component > 10kb gzipped

---

## Vercel Configuration

```json
// vercel.json (if needed)
{
  "framework": "nextjs",
  "buildCommand": "next build",
  "outputDirectory": ".next"
}
```

No environment variables needed for v1. No API routes. No serverless functions.

---

## What Claude Code Should Never Do

- Add any backend, database, or API
- Add authentication
- Use any animation library (Framer Motion, GSAP, anime.js)
- Use inline styles when a CSS custom property or Tailwind class exists
- Hardcode hex color values
- Add comments explaining obvious code
- Create files not listed in the project structure without flagging it
- Auto-scroll the reader anywhere — all navigation is user-initiated
- Use `display: none` for scroll-reveal elements (use opacity 0 + transform instead)

---

## Current Build Status

See TASKS.md for what is done and what is next.
