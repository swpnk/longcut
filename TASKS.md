# longcut.ink — Build Tasks

Work through these tasks in order. Mark each `[x]` when complete before moving to the next.
Never skip a task. Never work on a later task before earlier ones are marked complete.
After each task, run `next build` to verify no TypeScript or build errors before marking done.

---

## PHASE 1 — Foundation
*Do once. Never touch again.*

### Task 1.1 — Next.js scaffold
- [ ] Verify `next.config.ts` has MDX support configured
- [ ] Verify `tailwind.config.ts` includes `src/**/*.{ts,tsx,mdx}` in content paths
- [ ] Verify `tsconfig.json` has strict mode enabled
- [x] Install required packages: `npm install next-mdx-remote gray-matter scrollama`
- [x] Install dev packages: `npm install -D @types/scrollama` (package does not exist — scrollama bundles its own types)

**Verify:** `npm run dev` starts without errors.

---

### Task 1.2 — Design system
- [x] Create `src/app/globals.css` with all CSS custom properties from CLAUDE.md
- [x] Add base body styles: `background: var(--ink); color: var(--paper); overflow-x: hidden`
- [x] Add smooth scroll: `html { scroll-behavior: smooth }`
- [x] Add reveal animation classes: `.reveal-item` (opacity 0, translateY 20px) and `.reveal-item.visible` (opacity 1, translateY 0)
- [x] Add `.lit` class for sequential text reveals: same pattern as reveal-item

**Verify:** Import globals.css in `src/app/layout.tsx`. Background should be near-black.

---

### Task 1.3 — Fonts and root layout
- [x] Create `src/app/layout.tsx`
- [x] Import Playfair Display (weights: 400, 700, subsets: latin, display: swap)
- [x] Import EB Garamond (weights: 400, 500, subsets: latin, display: swap)
- [x] Import DM Mono (weights: 300, 400, subsets: latin, display: swap)
- [x] Apply font CSS variables to `:root` in globals.css
- [x] Set metadata: title template `%s | longcut.ink`, description, og defaults
- [x] Root layout renders `{children}` with font class names on body

**Verify:** Fonts load. No FOUT (flash of unstyled text).

---

### Task 1.4 — TypeScript types
- [x] Create `src/types/article.ts`
- [x] Define `ArticleFrontmatter` interface (title, subject, issue, deck, totalMinutes, gate, coldOpenTag, acts)
- [x] Define `Act` interface (id, label, name)
- [x] Define `ContradictionItem` interface (yearSaid, quote, source, yearDid, action, badge, gap)
- [x] Define `OralHistoryVoice` interface (name, role, quote)
- [x] Define `EvidenceItem` interface (number, text, redacted?)
- [x] Define `VerdictLine` type (string | { text: string, em?: boolean | string })

**Verify:** No TypeScript errors. Types are exported and importable.

---

### Task 1.5 — MDX processing
- [x] Create `src/lib/mdx.ts`
- [x] Function `getArticleBySlug(slug: string)` — reads from `src/content/[slug].mdx`, parses frontmatter with gray-matter, returns `{ frontmatter: ArticleFrontmatter, content: string }`
- [x] Function `getAllArticleSlugs()` — returns array of slugs from src/content directory
- [x] Handle file-not-found gracefully (return null, let page handle 404)

**Verify:** Import and call `getArticleBySlug('altman')` — should return null (file doesn't exist yet) without crashing.

---

## PHASE 2 — Components
*Build in this order. Each component depends on the design system from Phase 1.*
*Reference `src/components/README.md` for the full contract of each component.*

### Task 2.1 — Filmstrip nav
- [ ] Create `src/components/Filmstrip.tsx`
- [ ] Props: `acts: Act[]`, `totalMinutes: number`
- [ ] Fixed position, z-index 500, height 48px, background rgba(10,8,6,0.97)
- [ ] Left: longcut.ink logo in DM Mono gold
- [ ] Center: act pips row — each pip has act label (small, DM Mono) and act name (DM Mono, hidden on mobile)
- [ ] Each pip has a 2px gold underline that animates scaleX(0→1) when active
- [ ] Active pip tracked via IntersectionObserver watching elements with `data-act-id` attribute
- [ ] Pip click scrolls to element with matching `id` — smooth, user-initiated only
- [ ] Done pips (before active) show gold at 35% opacity underline
- [ ] Right: time remaining ("~28 min left" counting down based on scroll %, "Finished" at bottom)
- [ ] Mobile: act names hidden, numbers only, logo shortened

**Verify:** Renders correctly. Pips update as you scroll. Time counter works.

---

### Task 2.2 — Gate component
- [ ] Create `src/components/Gate.tsx`
- [ ] Props: `question: string`, `seedVotes?: { yes: number, no: number }`
- [ ] Full viewport height, flex column centered
- [ ] Issue label in DM Mono gold (reads from article context or prop)
- [ ] Question in Playfair Display italic, clamp(24px, 4.5vw, 50px), max-width 620px
- [ ] Subtext: "Answer now. Before the evidence. We'll ask again at the end."
- [ ] Two buttons: "Yes, I trust him" / "No, I don't" — DM Mono uppercase, border .5px
- [ ] On vote: store in `localStorage('lc_gate')`, highlight chosen button, show live percentage bars (seed + 0 or 1 vote)
- [ ] Percentage bars animate width on appear (300ms delay)
- [ ] "Enter the piece ↓" link below — scrolls to hero, user-initiated only, NO auto-scroll
- [ ] SSR safe: all localStorage access inside useEffect or behind typeof window check

**Verify:** Vote persists on refresh. Buttons highlight correctly. No SSR errors.

---

### Task 2.3 — Hero component
- [ ] Create `src/components/Hero.tsx`
- [ ] Props: `title: string`, `titleEm: string`, `coldOpenTag: string`, `deck: string`, `meta: string[]`
- [ ] Full viewport height, flex column justify-end, padding bottom 5rem
- [ ] Dark vignette overlay (CSS gradient, pointer-events none)
- [ ] Ghost numeral "01" — absolute position right, clamp(140px,18vw,240px), opacity 0.022
- [ ] Cold open tag: DM Mono 9px gold uppercase with gold line before (::before)
- [ ] H1: Playfair Display, clamp(44px,7vw,84px), `titleEm` wrapped in `<em>` styled gold italic
- [ ] Deck: EB Garamond 20px italic muted, max-width 520px
- [ ] Meta row: DM Mono 9px, items joined by · separator at 30% opacity
- [ ] Scroll cue: absolute bottom 2rem, centered, animated gold line + "scroll" text

**Verify:** Ghost numeral visible but very subtle. Em word renders in gold.

---

### Task 2.4 — Act break component
- [ ] Create `src/components/ActBreak.tsx`
- [ ] Props: `number: string | number`, `title: string`, `id?: string`
- [ ] Centered, padding 5rem 2rem 4rem, border-top .5px faint
- [ ] Ghost numeral: absolute, Playfair Display, clamp(80px,14vw,160px), opacity 0.018, hidden on mobile
- [ ] Act label: DM Mono 9px gold uppercase ("Act I")
- [ ] Gold rule: 40px wide, .5px, gold-dim, centered
- [ ] Title: Playfair Display italic, clamp(20px,3.2vw,36px)
- [ ] Renders a `data-act-id` attribute matching id prop (for Filmstrip IntersectionObserver)
- [ ] Also renders a scroll anchor `<span id={id}>` with negative top offset for nav height

**Verify:** Ghost numeral sits behind content. Filmstrip detects when in view.

---

### Task 2.5 — Prose component
- [ ] Create `src/components/Prose.tsx`
- [ ] Props: `children: React.ReactNode`, `dropcap?: boolean`, `wide?: boolean`
- [ ] Max-width 660px (wide: 820px), centered, padding 1rem 2.5rem 3rem
- [ ] Paragraph styles: 19px EB Garamond, line-height 1.8, color rgba(240,232,216,0.87), margin-bottom 1.65em
- [ ] Drop cap: first paragraph first letter — Playfair Display, 4.2em, float left, gold, only when dropcap prop true
- [ ] Mobile: padding 1rem 1.5rem 2.5rem

**Verify:** Drop cap appears only when prop passed. Text is readable at 19px.

---

### Task 2.6 — Open loop component
- [ ] Create `src/components/OpenLoop.tsx`
- [ ] Props: `word: string`, `note: string`, `preLabel?: string`
- [ ] Max-width 660px, centered, padding 2.5rem
- [ ] Border top and bottom: .5px gold-dim
- [ ] Pre-label: DM Mono 9px, rgba(240,232,216,0.25), uppercase
- [ ] Word: Playfair Display bold italic, clamp(44px,7vw,80px), gold, display block
- [ ] Note: DM Mono 9px, rgba(240,232,216,0.18), uppercase, flex with gold line before

**Verify:** Word is large and gold. Note is subtle. Component feels like a designed pause.

---

### Task 2.7 — Pull quote component
- [ ] Create `src/components/PullQuote.tsx`
- [ ] Props: `quote: string`, `cite: string`
- [ ] Max-width 580px, centered, margin bottom 3rem
- [ ] Border left: 2px solid gold
- [ ] Padding: 1.75rem 2.5rem
- [ ] Quote: Playfair Display italic, clamp(16px,2vw,21px), line-height 1.45, color #f0e8d8
- [ ] Cite: DM Mono 9px gold uppercase, font-style normal

**Verify:** Left gold border is 2px (not .5px). Quote is readable and elegant.

---

### Task 2.8 — Scene card component
- [ ] Create `src/components/SceneCard.tsx`
- [ ] Props: `leftLabel: string`, `leftText: string`, `leftSource: string`, `rightLabel: string`, `rightText: string`, `rightSource: string`
- [ ] Max-width 820px, centered, 2-column grid, border .5px faint
- [ ] Left column: gold-tinted background (rgba(200,169,110,0.02)), border-right .5px faint
- [ ] Both columns: padding 2.5rem, label in DM Mono 9px gold uppercase, text in EB Garamond 16px italic muted, source in DM Mono 9px dimmer
- [ ] Mobile: single column, left becomes top with border-bottom instead of border-right

**Verify:** Two columns clearly distinct. Mobile stacks correctly.

---

### Task 2.9 — Oral history component
- [ ] Create `src/components/OralHistory.tsx`
- [ ] Props: `voices: OralHistoryVoice[]`, `eyebrow?: string`
- [ ] Max-width 820px, centered, padding 3rem 2.5rem
- [ ] Eyebrow: DM Mono 9px gold uppercase with gold line after (flex, ::after)
- [ ] Each voice: CSS grid, columns `130px 1fr`, gap 1.25rem, border-bottom .5px faint, padding-bottom 2rem
- [ ] Last voice: no border-bottom
- [ ] Left col: name in DM Mono 9px gold uppercase, role in DM Mono 8px dimmer
- [ ] Right col: EB Garamond 16px italic, rgba(240,232,216,0.75), line-height 1.7
- [ ] Mobile: single column, name/role above quote

**Verify:** Voices are visually distinct. Grid aligns names and quotes cleanly.

---

### Task 2.10 — Second person component
- [ ] Create `src/components/SecondPerson.tsx`
- [ ] Props: `tag: string`, `children: React.ReactNode`
- [ ] Full-width, background rgba(200,169,110,0.025), border-top and border-bottom .5px gold-dim
- [ ] Padding 4rem 2.5rem, margin 3rem 0
- [ ] Inner max-width 660px centered
- [ ] Tag: DM Mono 9px gold uppercase, flex with gold line after (::after)
- [ ] Content: Playfair Display italic, clamp(16px,2vw,20px), line-height 1.7
- [ ] `<em>` inside content: color gold

**Verify:** Gold tint is subtle, not garish. Italic Playfair feels cinematic.

---

### Task 2.11 — Evidence file component
- [ ] Create `src/components/EvidenceFile.tsx`
- [ ] Props: `label: string`, `from: string`, `to: string`, `subject: string`, `items: EvidenceItem[]`
- [ ] Max-width 660px, centered, padding 0 2.5rem
- [ ] Label row: DM Mono 8px, gold, uppercase, flex with small square before (::before border .5px gold)
- [ ] Document card: background #0d0a07, border .5px rgba(200,169,110,0.12), padding 2rem
- [ ] "DOCUMENT" watermark: absolute top-right, DM Mono 7px, opacity 0.1
- [ ] Header: DM Mono 9px — From/To in dim, Subject in gold
- [ ] Separator: border-bottom .5px rgba(240,232,216,0.05), margin-bottom 1.5rem
- [ ] Each item: flex row, number in gold, text in rgba(240,232,216,0.65), DM Mono 11px
- [ ] Item background: rgba(240,232,216,0.015), border-left .5px rgba(200,169,110,0.18)
- [ ] Redacted spans: `background rgba(240,232,216,0.12)`, `color transparent`, cursor pointer
- [ ] On click: add class `.revealed` — background transparent, color rgba(200,169,110,0.85), transition 0.3s
- [ ] Hint text at bottom: "Click redacted lines to reveal"

**Verify:** Redaction click-to-reveal works. Document looks like a classified file.

---

### Task 2.12 — Contradiction engine component
- [ ] Create `src/components/ContradictionEngine.tsx`
- [ ] Props: `contradictions: ContradictionItem[]`, `intro?: { eyebrow: string, title: string, sub: string }`
- [ ] If intro prop: render centered intro section with eyebrow, large italic title, subtitle, bouncing arrow
- [ ] Each contradiction: 2-column grid, border-bottom .5px faint
- [ ] Scroll reveal: opacity 0 → 1, translateY 20px → 0, on IntersectionObserver entry (threshold 0.2)
- [ ] Left column ("He said"): gold tag + line, year in DM Mono dim, quote in Playfair italic (em children in gold), source in DM Mono dimmer
- [ ] Right column ("He did"): red tag + line, year, body text (strong children brighter), badge (red border pill)
- [ ] Ghost numeral: absolute right, Playfair Display bold, 90px, opacity 0.025, red tint
- [ ] Gap row: spans both columns, border-top .5px faint, red background tint 0.018
- [ ] Gap bar: flex row, "Integrity gap" label, track (2px height, dim background), fill (red, width 0 → gap% on scroll entry, transition 1.1s ease), value label
- [ ] Mobile: single column, ghost numeral hidden

**Verify:** Gap bars animate on scroll. Each contradiction fades in. Mobile stacks cleanly.

---

### Task 2.13 — Verdict component
- [ ] Create `src/components/Verdict.tsx`
- [ ] Props: `lines: VerdictLine[]`, `coda?: string`
- [ ] Padding 5rem 2rem, text-center, background rgba(200,169,110,0.012)
- [ ] Each line: Playfair Display italic, clamp(17px,2.5vw,26px), color rgba(240,232,216,0.07), transition color 0.8s
- [ ] On IntersectionObserver entry (threshold 0.35): add `.lit` class to each line with staggered delay (i * 300ms)
- [ ] `.lit` class: color rgba(240,232,216,0.9)
- [ ] Lines with `em: true`: entire line in gold when lit
- [ ] Lines with `em: string`: that substring wrapped in em (gold)
- [ ] Coda: DM Mono 8px gold-dim uppercase, margin-top 2.5rem

**Verify:** Lines reveal sequentially. Last line hits hardest. Coda is subtle.

---

### Task 2.14 — Motif reveal component
- [ ] Create `src/components/MotifReveal.tsx`
- [ ] Props: `lines: VerdictLine[]`
- [ ] Same pattern as Verdict but stagger 250ms per line (slightly faster)
- [ ] Padding 5rem 2rem, text-center
- [ ] Last line: slightly smaller font, opacity 0.6 when lit (feels like a whisper after the detonation)

**Verify:** Motif fires in sequence. Feels like recognition, not announcement.

---

### Task 2.15 — Mental model component
- [ ] Create `src/components/MentalModel.tsx`
- [ ] Props: `name: string`, `definition: string`, `note: string`
- [ ] Max-width 660px, centered, margin 0 2.5rem 3rem (or use padding for full-width sections)
- [ ] Border: .5px solid gold-dim (all four sides)
- [ ] Padding: 2.5rem
- [ ] Tag: DM Mono 8px gold uppercase, margin-bottom 1.25rem
- [ ] Name: Playfair Display italic, clamp(20px,3vw,30px), color #f5f0e8
- [ ] Definition: EB Garamond 17px, rgba(240,232,216,0.68), line-height 1.7, margin-bottom 1.5rem
- [ ] Note: DM Mono 9px, rgba(200,169,110,0.3), line-height 1.7

**Verify:** Gold border is visible but not harsh. Name is the visual anchor.

---

### Task 2.16 — Reader vote component
- [ ] Create `src/components/ReaderVote.tsx`
- [ ] Props: `question: string`, `seedVotes?: { yes: number, no: number }`
- [ ] Reads gate answer from `localStorage('lc_gate')` on mount
- [ ] If gate answer exists: shows pre-recall text above — "Before reading, you said: [Yes/No]. Has that changed?"
- [ ] Same button design as Gate but slightly smaller padding
- [ ] On vote: store in `localStorage('lc_final')`, show bars
- [ ] Post-vote recall text:
  - If answer changed: "You started saying [X]. By the end, you changed your mind. That's the piece working."
  - If same: "You started saying [X]. You finished the same. Either the evidence confirmed what you knew — or it wasn't enough to move you. Both are worth sitting with."
- [ ] Bars: Yes = gold, No = red, animate width on show
- [ ] Border-top .5px faint above component, padding-top 3rem

**Verify:** Recall text appears correctly for both changed and unchanged answers. SSR safe.

---

## PHASE 3 — Article Route

### Task 3.1 — Dynamic article page
- [ ] Create `src/app/[article]/page.tsx`
- [ ] Use `getArticleBySlug(params.article)` to fetch content
- [ ] If null: `notFound()`
- [ ] Use `next-mdx-remote/rsc` to render MDX with all components passed as `components` prop
- [ ] Pass all components: Gate, Hero, ActBreak, Prose, OpenLoop, PullQuote, SceneCard, OralHistory, SecondPerson, EvidenceFile, ContradictionEngine, Verdict, MotifReveal, MentalModel, ReaderVote
- [ ] Wrap in article layout that includes `<Filmstrip acts={frontmatter.acts} totalMinutes={frontmatter.totalMinutes} />`
- [ ] Generate metadata from frontmatter: title, description (deck), og:title, og:description, og:image (`/og/[article].jpg`)
- [ ] `generateStaticParams` using `getAllArticleSlugs()`

**Verify:** `/altman` returns 404 (correct — MDX file doesn't exist yet). `/nonexistent` returns 404.

---

### Task 3.2 — Altman MDX content file
- [ ] Create `src/content/altman.mdx`
- [ ] Frontmatter: all fields from CLAUDE.md MDX format section
- [ ] Full article content populated — all components with real data
- [ ] Contradiction engine: 5 items, gap values exactly 18, 42, 64, 82, 97
- [ ] Oral history: 5 voices including one defender (Ron Conway or Sue Yoon)
- [ ] Evidence file: 5 items, items 3, 4, 5 have redacted text
- [ ] Motif appears in: OpenLoop (Act I), one sentence in Act II prose, one sentence in Act III prose, MotifReveal (7 lines)
- [ ] Open loop word ("Lying.") closes with "This is what was in them." before EvidenceFile

**Verify:** `/altman` renders the full article. All components appear. Scroll reveals work.

---

## PHASE 4 — Landing Page

### Task 4.1 — Landing page
- [ ] Create `src/app/page.tsx`
- [ ] Full viewport height, background var(--ink)
- [ ] Gate question centered: "Should one person be trusted with the most powerful technology in human history?"
- [ ] Two buttons — same Gate component logic
- [ ] After vote: live percentage shown, "enter the piece →" link to `/altman`
- [ ] Bottom: minimal footer — "longcut.ink" in DM Mono dim · "The long game, in ink." in EB Garamond italic dim
- [ ] Metadata: title "longcut.ink", description "Cinematic long-form journalism. The long game, in ink."

**Verify:** Landing page loads. Vote works. Link to article works.

---

## PHASE 5 — Polish and Launch

### Task 5.1 — Mobile pass
- [ ] Test every component at 375px width
- [ ] Fix: contradiction engine → single column
- [ ] Fix: oral history → single column
- [ ] Fix: scene card → single column
- [ ] Fix: parallel → single column
- [ ] Fix: filmstrip → numbers only, no names
- [ ] Fix: ghost numerals → hidden on mobile
- [ ] Fix: hero → prose padding 1.5rem
- [ ] Fix: all `clamp()` font sizes verified readable at 375px

**Verify:** No horizontal scroll at 375px. All text readable. All interactions work on touch.

---

### Task 5.2 — Performance
- [ ] Run `next build` — verify 0 errors, 0 warnings
- [ ] Check bundle sizes in build output — no page > 150kb JS
- [ ] Verify fonts load with `next/font` (not CSS @import)
- [ ] Add `loading="lazy"` to any images
- [ ] Verify no layout shift on font load (use `display: swap`)

**Verify:** Build succeeds cleanly. Lighthouse performance > 85.

---

### Task 5.3 — SEO and social
- [ ] Verify og:image path exists at `public/og/altman.jpg` (create placeholder if not)
- [ ] Verify canonical URL set correctly
- [ ] Add `robots.txt` allowing all crawlers
- [ ] Add `sitemap.xml` listing `/` and `/altman`
- [ ] Verify Twitter card meta tags present

**Verify:** Paste `/altman` URL into https://cards-dev.twitter.com/validator — card renders.

---

### Task 5.4 — Content final check
- [ ] Every contradiction quote is exact — no paraphrase. Check against New Yorker source.
- [ ] Open loop ("Lying.") closes with ceremony before EvidenceFile
- [ ] Motif appears in Acts I, II, III and MotifReveal (not just beginning and end)
- [ ] One oral history voice is a genuine defender (not a strawman)
- [ ] Mental model feels discovered, not explained

---

### Task 5.5 — Launch
- [ ] `git add .`
- [ ] `git commit -m "longcut.ink — Sam Altman — The Architect — launch"`
- [ ] `git push origin main`
- [ ] Verify Vercel deployment completes (check Vercel dashboard)
- [ ] Verify longcut.ink resolves and loads correctly
- [ ] Verify longcut.ink/altman loads the full article
- [ ] Test gate vote, scroll reveals, contradiction engine, reader vote on the live URL

**LAUNCHED. ✓**

---

## Future Articles (after launch)

Each new article follows this minimal path:

1. Receive article brief (5 slots + sources)
2. Create `src/content/[subject].mdx` with full content
3. Add OG image to `public/og/[subject].jpg`
4. Update `src/app/page.tsx` to include new article in archive (if needed)
5. `git push origin main` → live

No new components. No new infrastructure. One file per article.
