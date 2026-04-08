# longcut.ink — Component Contracts

This file defines the exact props, behaviour, and visual spec for every component.
Claude Code reads this before building or modifying any component.

---

## Filmstrip

**File:** `src/components/Filmstrip.tsx`
**Purpose:** Fixed navigation showing current position across all article acts.

```typescript
interface FilmstripProps {
  acts: Act[]          // from article frontmatter
  totalMinutes: number // for time countdown
}
```

**Behaviour:**
- Fixed top-0, z-index 500, height 48px
- Active act: detected via IntersectionObserver on elements with `data-act-id` attribute
- Time remaining: `Math.round(totalMinutes * (1 - scrollPercent))` minutes, shows "Finished" at bottom
- Pip click: smooth scroll to element with matching id — never auto-scrolls

**Visual:**
- Background: rgba(10,8,6,0.97)
- Border-bottom: 0.5px solid rgba(240,232,216,0.08)
- Active pip underline: 2px gold, scaleX(0→1) CSS transition
- Done pip underline: 2px rgba(200,169,110,0.35)
- Inactive: no underline
- Mobile (≤640px): act names hidden, numbers only

---

## Gate

**File:** `src/components/Gate.tsx`
**Purpose:** Pre-reading commitment device. Reader votes before seeing evidence.

```typescript
interface GateProps {
  question: string
  issueLabel?: string           // "longcut.ink · Issue 001 · The Architect"
  seedVotes?: { yes: number, no: number }  // default: { yes: 3241, no: 11087 }
}
```

**Behaviour:**
- Reads existing vote from `localStorage('lc_gate')` on mount — restores UI state
- On vote: saves to localStorage, shows percentage bars with 300ms animation delay
- Never auto-scrolls. "Enter the piece ↓" is a user-initiated link only
- SSR safe: all localStorage access in useEffect

**Visual:**
- min-height: 100vh, flex column centered, text-align center
- Issue label: DM Mono 9px, rgba(200,169,110,0.4), uppercase, margin-bottom 2rem
- Question: Playfair Display italic, clamp(24px,4.5vw,50px), max-width 620px, margin auto
- Subtext: EB Garamond 18px italic muted
- Buttons: DM Mono 10px uppercase, padding 14px 32px, border 0.5px rgba(240,232,216,0.2)
- Button hover: border gold, color gold
- Yes selected: border gold, color gold, background rgba(200,169,110,0.06)
- No selected: border rgba(200,65,45,0.5), color rgba(200,65,45,0.9), background rgba(200,65,45,0.04)
- Bars: height 2px, Yes=gold 45%, No=red 40%, max-width 200px

---

## Hero

**File:** `src/components/Hero.tsx`
**Purpose:** Full-viewport cold open — drops reader into the scene before the title.

```typescript
interface HeroProps {
  title: string         // full title text
  titleEm: string       // substring to render in gold italic (must match substring of title)
  coldOpenTag: string   // "Cold open · Las Vegas · November 17, 2023"
  deck: string          // italic subtitle
  meta: string[]        // ["Sam Altman", "Four acts", "~28 min read"]
}
```

**Behaviour:**
- Static — no interactive behaviour
- Scroll cue animates infinitely (CSS, no JS)

**Visual:**
- min-height: 100vh, flex column justify-end, padding 48px 2.5rem 5rem
- Dark vignette: absolute inset, linear-gradient to bottom, pointer-events none
- Ghost numeral "01": absolute right 1rem, Playfair Display bold, clamp(140px,18vw,240px), opacity 0.022, user-select none
- Cold open tag: DM Mono 9px gold uppercase, flex align-center gap 1rem, ::before gold line 30px
- H1: Playfair Display 400, clamp(44px,7vw,84px), line-height 1, letter-spacing -0.02em, color #f5f0e8
- H1 em: color var(--gold), font-style italic
- Deck: EB Garamond 20px italic, color var(--muted), max-width 520px
- Meta: DM Mono 9px, color rgba(240,232,216,0.22), items separated by · at 30% opacity
- Scroll cue: absolute bottom 2rem, centered, animated gold line (.5px, 36px) + "scroll" text

---

## ActBreak

**File:** `src/components/ActBreak.tsx`
**Purpose:** Cinematic separator between acts. Marks structural transitions.

```typescript
interface ActBreakProps {
  number: string | number    // "I", "II", "III", "IV" or 1,2,3,4
  title: string              // "The Boy Who Took Computers Apart"
  id?: string                // scroll anchor id (matches filmstrip act id)
}
```

**Behaviour:**
- Renders invisible scroll anchor `<span id={id}>` at top with -48px offset
- Renders `data-act-id={id}` for Filmstrip IntersectionObserver

**Visual:**
- display flex, align-center justify-center, padding 5rem 2rem 4rem
- border-top: 0.5px solid var(--faint)
- Ghost numeral: absolute, Playfair Display bold, clamp(80px,14vw,160px), opacity 0.018, hidden on mobile
- Act label: DM Mono 9px gold uppercase, margin-bottom 0.75rem
- Gold rule: 40px wide, 0.5px, gold-dim, margin 0.6rem auto
- Title: Playfair Display italic 400, clamp(20px,3.2vw,36px), color #f5f0e8

---

## Prose

**File:** `src/components/Prose.tsx`
**Purpose:** Body text container. Handles typography and drop cap.

```typescript
interface ProseProps {
  children: React.ReactNode
  dropcap?: boolean    // adds drop cap to first paragraph's first letter
  wide?: boolean       // max-width 820px instead of 660px
}
```

**Visual:**
- max-width: dropcap/default=660px, wide=820px
- margin: 0 auto, padding: 1rem 2.5rem 3rem
- p: font-size 19px, EB Garamond, line-height 1.8, color rgba(240,232,216,0.87), margin-bottom 1.65em
- Drop cap: first-child p ::first-letter — Playfair Display bold, 4.2em, float left, margin 0.05em 0.12em 0 0, color gold
- Mobile: padding 1rem 1.5rem 2.5rem

---

## OpenLoop

**File:** `src/components/OpenLoop.tsx`
**Purpose:** Plants the central word/accusation immediately after the cold open.

```typescript
interface OpenLoopProps {
  word: string          // "Lying."
  note: string          // "We'll return to what was in them. Keep reading."
  preLabel?: string     // "The Ilya Memos — first item on the list"
}
```

**Visual:**
- max-width 660px, margin 0 auto, padding 2.5rem
- border-top and border-bottom: 0.5px solid gold-dim
- Pre-label: DM Mono 9px, rgba(240,232,216,0.25), uppercase, margin-bottom 0.75rem
- Word: Playfair Display 700 italic, clamp(44px,7vw,80px), color gold, display block, margin 0.5rem 0
- Note: DM Mono 9px, rgba(240,232,216,0.18), uppercase, flex align-center gap 0.75rem
- Note ::before: 20px wide, 0.5px height, background gold-dim

---

## PullQuote

**File:** `src/components/PullQuote.tsx`
**Purpose:** Editorial blockquote for key sourced quotes.

```typescript
interface PullQuoteProps {
  quote: string
  cite: string    // "— Helen Toner, former OpenAI board member"
}
```

**Visual:**
- max-width 580px, margin 0 auto 3rem, padding 1.75rem 2.5rem
- border-left: 2px solid var(--gold) — NOTE: 2px not 0.5px
- border-radius: 0 (single-sided border rule)
- Quote: Playfair Display italic, clamp(16px,2vw,21px), line-height 1.45, color #f0e8d8, margin-bottom 0.75rem
- Cite: DM Mono 9px gold uppercase, font-style normal

---

## SceneCard

**File:** `src/components/SceneCard.tsx`
**Purpose:** Side-by-side "promise vs reality" comparison. Used for documented gaps.

```typescript
interface SceneCardProps {
  leftLabel: string     // "The promise · 2023"
  leftText: string
  leftSource: string    // "Public announcement · OpenAI blog · 2023"
  rightLabel: string    // "The reality · Same year"
  rightText: string
  rightSource: string
}
```

**Visual:**
- max-width 820px, margin 2rem auto, grid 1fr 1fr, border 0.5px faint
- Left col: background rgba(200,169,110,0.02), border-right 0.5px faint
- Both cols: padding 2.5rem
- Label: DM Mono 9px gold uppercase, margin-bottom 1rem
- Text: EB Garamond 16px italic, rgba(240,232,216,0.75), line-height 1.7
- Source: DM Mono 9px, rgba(240,232,216,0.2), margin-top 1rem
- Mobile: single column, left becomes top with border-bottom

---

## OralHistory

**File:** `src/components/OralHistory.tsx`
**Purpose:** Multi-voice section. Five perspectives on one event.

```typescript
interface OralHistoryVoice {
  name: string      // "Satya Nadella"
  role: string      // "Microsoft CEO · $13B investor"
  quote: string
}

interface OralHistoryProps {
  voices: OralHistoryVoice[]
  eyebrow?: string   // "Five voices · One week · November 17–22"
}
```

**Visual:**
- max-width 820px, margin 0 auto, padding 3rem 2.5rem
- Eyebrow: DM Mono 9px gold uppercase, flex, ::after gold line flex:1 height 0.5px
- Each voice: grid `130px 1fr`, gap 1.25rem, border-bottom 0.5px faint, padding-bottom 2rem, margin-bottom 2rem
- Last voice: no border-bottom, no margin-bottom
- Left: name in DM Mono 9px gold uppercase; role in DM Mono 8px rgba(240,232,216,0.2) uppercase line-height 1.5
- Right: EB Garamond 16px italic, rgba(240,232,216,0.75), line-height 1.7
- Mobile: single column, name/role above quote

---

## SecondPerson

**File:** `src/components/SecondPerson.tsx`
**Purpose:** Immersive second-person passage. Used once per article at the emotional peak.

```typescript
interface SecondPersonProps {
  tag: string              // "Second person · The Ambien night"
  children: React.ReactNode
}
```

**Visual:**
- Full-width, background rgba(200,169,110,0.025)
- border-top and border-bottom: 0.5px solid gold-dim
- padding: 4rem 2.5rem, margin: 3rem 0
- Inner: max-width 660px, margin 0 auto
- Tag: DM Mono 9px, rgba(200,169,110,0.35), uppercase, flex, ::after gold line flex:1 0.5px
- Content: Playfair Display italic, clamp(16px,2vw,20px), line-height 1.7, color rgba(240,232,216,0.88)
- p: margin-bottom 1.1em
- em: color gold, font-style italic

---

## EvidenceFile

**File:** `src/components/EvidenceFile.tsx`
**Purpose:** Renders classified-style document with click-to-reveal redactions.

```typescript
interface EvidenceItem {
  number: string      // "01", "02"...
  text: string        // visible text
  redacted?: string   // text to show as black bar, revealed on click
}

interface EvidenceFileProps {
  label: string       // "Primary source — internal document · Fall 2023"
  from: string        // "I. Sutskever"
  to: string          // "[Board — disappearing message]"
  subject: string     // "Sam exhibits a consistent pattern of..."
  items: EvidenceItem[]
}
```

**Behaviour:**
- Redacted spans: `onClick` toggles `.revealed` class
- No JavaScript animation — pure CSS transition on color and background

**Visual:**
- max-width 660px, centered, padding 0 2.5rem
- Label: DM Mono 8px gold uppercase, flex, ::before 10x10px square border 0.5px gold
- Document card: background #0d0a07, border 0.5px rgba(200,169,110,0.12), padding 2rem, relative
- "DOCUMENT" watermark: absolute top-right, DM Mono 7px, rgba(200,169,110,0.1), uppercase
- Header: DM Mono 9px, from/to in rgba(240,232,216,0.25), span inside in rgba(240,232,216,0.5)
- Subject: DM Mono 10px, rgba(200,169,110,0.55)
- Header separator: border-bottom 0.5px rgba(240,232,216,0.05), margin-bottom 1.5rem
- Items: flex row, gap 0.75rem, padding 0.65rem, background rgba(240,232,216,0.015), border-left 0.5px rgba(200,169,110,0.18)
- Item number: rgba(200,169,110,0.45)
- Item text: rgba(240,232,216,0.65), DM Mono 11px, line-height 1.85
- Redacted span: background rgba(240,232,216,0.12), color transparent, border-radius 2px, padding 0 3px, cursor pointer, transition 0.3s
- Revealed: background transparent, color rgba(200,169,110,0.85)
- Hint: DM Mono 7px, rgba(240,232,216,0.18), uppercase, margin-top 0.65rem

---

## ContradictionEngine

**File:** `src/components/ContradictionEngine.tsx`
**Purpose:** Core interactive element. Documents 5 he-said/he-did pairs with escalating gap bars.

```typescript
interface ContradictionItem {
  yearSaid: string      // "December 2015"
  quote: string         // exact sourced quote
  source: string        // "OpenAI founding principles"
  yearDid: string       // "2022–2023"
  action: string        // documented action (may contain **bold** markdown)
  badge: string         // "Lobbied against own principles"
  gap: number           // 18 | 42 | 64 | 82 | 97
}

interface ContradictionEngineProps {
  contradictions: ContradictionItem[]
  intro?: {
    eyebrow: string     // "Act IV · The Contradiction Engine"
    title: string       // "He said. He did."
    sub: string         // "His exact words. His exact actions."
  }
}
```

**Behaviour:**
- Each contradiction: IntersectionObserver entry → add `.vis` class → fade in + gap bar animates
- Gap bar: width 0 → gap% with 380ms delay after entry, 1.1s ease transition
- Threshold: 0.2 (fires when 20% visible)

**Visual — Intro section (if provided):**
- text-center, padding 5rem 2rem 3rem, border-top 0.5px faint, border-bottom rgba(200,169,110,0.1)
- Eyebrow: DM Mono 9px gold uppercase
- Title: Playfair Display italic, clamp(26px,4.5vw,48px), color #f5f0e8
- Sub: EB Garamond 17px italic muted, max-width 400px centered
- Bouncing arrow: DM Mono 9px gold-dim, CSS bounce animation

**Visual — Each contradiction:**
- grid 1fr 1fr, border-bottom 0.5px faint
- Initial: opacity 0, translateY 20px
- Visible: opacity 1, translateY 0, transition 0.7s
- Left padding: clamp(2rem,4.5vw,4rem) clamp(1.5rem,3.5vw,3.5rem)
- "He said" tag: DM Mono 8px, rgba(200,169,110,0.45) + gold line flex:1 0.5px
- "He did" tag: DM Mono 8px, rgba(200,65,45,0.5) + red line
- Year: DM Mono 9px rgba(240,232,216,0.22)
- Quote: Playfair Display italic, clamp(13px,1.7vw,17px), color #f0e8d8 (em children: gold)
- Source: DM Mono 8px, rgba(240,232,216,0.16) uppercase
- Action: EB Garamond, clamp(13px,1.6vw,16px), rgba(240,232,216,0.68) (strong children: brighter)
- Badge: DM Mono 8px, border 0.5px rgba(200,65,45,0.25), color rgba(200,65,45,0.55), padding 4px 10px
- Ghost numeral: absolute right 1.5rem, Playfair Display bold, 90px, rgba(200,65,45,0.025), hidden mobile
- Gap row: grid-column 1/-1, flex, background rgba(200,65,45,0.018), border-top 0.5px faint
- Gap label: DM Mono 8px, rgba(240,232,216,0.16), min-width 80px
- Gap track: flex:1, height 2px, background rgba(240,232,216,0.05)
- Gap fill: height 100%, background rgba(200,65,45,0.42), width 0 (animates to gap%)
- Gap value: DM Mono 8px rgba(200,65,45,0.45), min-width 56px, text-right
- Mobile: single column, ghost numeral hidden

---

## Verdict

**File:** `src/components/Verdict.tsx`
**Purpose:** Sequential cinematic reveal of conclusion lines.

```typescript
// VerdictLine = string | { text: string, em?: boolean | string }
// em: true = entire line in gold when lit
// em: string = that substring wrapped in <em> (gold)

interface VerdictProps {
  lines: VerdictLine[]
  coda?: string    // "New Yorker · Farrow & Marantz · 2025"
}
```

**Behaviour:**
- IntersectionObserver threshold 0.35
- On entry: stagger adds `.lit` class to each line at i * 300ms delay

**Visual:**
- padding 5rem 2rem, text-center, background rgba(200,169,110,0.012)
- Each line: Playfair Display italic, clamp(17px,2.5vw,26px), color rgba(240,232,216,0.07), transition color 0.8s
- Lit: color rgba(240,232,216,0.9)
- Lit + em: color gold (if em: true) or substring in gold em tag
- Coda: DM Mono 8px, rgba(200,169,110,0.2), uppercase, margin-top 2.5rem

---

## MotifReveal

**File:** `src/components/MotifReveal.tsx`
**Purpose:** Fires the planted motif 6–7 times, each transformed.

```typescript
interface MotifRevealProps {
  lines: VerdictLine[]   // same type as Verdict
}
```

**Behaviour:**
- Same as Verdict but stagger 250ms per line (faster = detonation rhythm)
- IntersectionObserver threshold 0.3

**Visual:**
- padding 5rem 2rem, text-center (no background tint — contrast with Verdict)
- Same font spec as Verdict
- Last line: slightly reduced font size, opacity 0.6 when lit (feels like a whisper)

---

## MentalModel

**File:** `src/components/MentalModel.tsx`
**Purpose:** The portable concept the reader carries out of the piece.

```typescript
interface MentalModelProps {
  name: string         // "The Constraint Escape"
  definition: string   // one paragraph
  note: string         // the practical application line
}
```

**Visual:**
- max-width 660px, margin 0 2.5rem 3rem (or auto if inside centered section)
- border: 0.5px solid gold-dim (all four sides)
- padding: 2.5rem
- Tag: DM Mono 8px, rgba(200,169,110,0.4), uppercase, margin-bottom 1.25rem ("The mental model — take this with you")
- Name: Playfair Display italic 400, clamp(20px,3vw,30px), color #f5f0e8, margin-bottom 1rem
- Definition: EB Garamond 17px, rgba(240,232,216,0.68), line-height 1.7, margin-bottom 1.5rem
- Note: DM Mono 9px, rgba(200,169,110,0.3), line-height 1.7

---

## ReaderVote

**File:** `src/components/ReaderVote.tsx`
**Purpose:** Final vote — same question as Gate, but the reader has read the evidence.

```typescript
interface ReaderVoteProps {
  question: string
  seedVotes?: { yes: number, no: number }   // default: { yes: 3241, no: 11087 }
}
```

**Behaviour:**
- Reads `localStorage('lc_gate')` on mount — shows pre-recall text if exists
- Reads `localStorage('lc_final')` on mount — restores voted state if exists
- On vote: saves to localStorage, increments local count, shows bars and recall text
- Recall text logic:
  - Gate answer !== final answer: "You started this piece saying [X]. By the end, you changed your mind. That's the piece working."
  - Gate answer === final answer: "You started saying [X]. You finished the same. Either the evidence confirmed what you knew — or it wasn't enough to move you. Both are worth sitting with."
- SSR safe: all localStorage in useEffect

**Visual:**
- max-width 660px, margin 0 auto, padding 3rem 2.5rem, border-top 0.5px faint
- Pre-recall: DM Mono 9px, rgba(240,232,216,0.2), margin-bottom 1.25rem
- Question: Playfair Display italic, clamp(17px,2.5vw,24px), line-height 1.3
- Sub: EB Garamond 15px italic muted
- Buttons: same style as Gate
- Bars: Yes=gold 45%, No=rgba(200,65,45,0.4), height 2px, animate on show
- Bar labels: DM Mono 9px rgba(240,232,216,0.25) uppercase, min-width 22px
- Recall text: EB Garamond 15px italic, rgba(240,232,216,0.38), border-top 0.5px faint, padding-top 1.25rem, margin-top 1.25rem
