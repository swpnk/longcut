# Editorial UX Redesign — Design Spec

**Date:** 2026-04-08
**Scope:** Landing page editorial homepage, inline gate, end-of-article sources panel, body typography increase

---

## 1. Landing Page (`/`)

### Goal
Replace the current gate-first landing page with a brand homepage that establishes longcut's identity and features the current article, with a coming-next strip for future issues.

### Layout

```
┌─────────────────────────────────────────┐
│ Nav: longcut (gold italic monospace)    │
│                   THE LONG GAME, IN INK │
├─────────────────────────────────────────┤
│         Brand section (centered)        │
│      longcut  (italic Georgia, long=gold│
│   CINEMATIC LONG-FORM JOURNALISM        │
│   Each piece takes a real subject...    │
├─────────────────────────────────────────┤
│ Featured card (full-width, clickable)   │
│  Left: Issue 001 · Now reading          │
│        The Architect                    │
│        Sam Altman                       │
│        He said he was building AI...    │
│        Four acts · ~28 min read         │
│  Right: altman.jpg (fixed height, crop) │
├─────────────────────────────────────────┤
│ Coming next (3-up grid)                 │
│  Modi / Trump / Issue 004 TBD           │
└─────────────────────────────────────────┘
```

### Component: `src/app/page.tsx`

Rewritten as a static server component (no MDX rendering). Renders a new `LandingPage` client component or pure JSX — no dependency on the altman MDX file.

Key rules:
- The featured card's entire surface is a `<Link href="/altman">` — no button, no "Enter the piece" copy.
- Coming-next items for Modi and Trump show taglines ("The democracy he bent without breaking." / "The art of winning by never committing to anything."). Issue 004 is faded/dimmed with `opacity: 0.3`.
- Image panel: `altman.jpg` at fixed height (220px), `object-fit: cover`, `object-position: center 20%`, left-to-right gradient overlay blending into the dark background.
- No gate question on the landing page.

### Design tokens used
- Background: `var(--ink)` `#0a0806`
- Text: `var(--paper)` `#f0e8d8`
- Accent: `var(--gold)` `#c8a96e`
- Borders: `0.5px solid var(--faint)`

---

## 2. Inline Gate (article page)

### Goal
Keep the commitment-device question but make it non-intrusive. Reader can scroll past without interacting — scrolling is the skip.

### Placement
Between the Hero component and Act I's `<ActBreak>`. Rendered once inside the MDX article layout, not on the landing page.

### Behavior
- On mount: check `localStorage.lc_gate`. If already set → render nothing (already voted on a previous visit).
- If not set: show the gate element quietly.
- On vote: collapse with a 400ms fade, write `localStorage.lc_gate = 'yes' | 'no'`.
- No "skip" button or label — scrolling past is the implicit skip.
- The `ReaderVote` component at the end of the article serves readers who scrolled past.

### Visual spec
```
──────────────────────────────────────
  Before you read — a question.

  Should one person be trusted with
  the most powerful technology in
  human history?

  [ Yes ]   [ No ]
──────────────────────────────────────
```
- Container: `max-width: 660px`, centered, `padding: 20px 24px`, `border: 0.5px solid var(--faint)`
- Question: 13px EB Garamond italic, `color: var(--muted)`
- Label "Before you read — a question.": 8px DM Mono uppercase, `color: rgba(200,169,110,0.4)`
- Buttons: 8px DM Mono uppercase, `border: 0.5px solid var(--faint)`, `padding: 8px 16px`, hover background `rgba(200,169,110,0.05)`
- Collapsed state: `height: 0; overflow: hidden; opacity: 0` with CSS transition

### Gate component changes
The existing `Gate.tsx` receives a `variant?: 'full' | 'inline'` prop:
- `'full'` — current full-screen behavior (used nowhere after this redesign, kept for backwards compat)
- `'inline'` — new quiet inline rendering described above

The MDX article renders `<Gate variant="inline" question={frontmatter.gate} />` just before the first ActBreak.

---

## 3. Sources Panel (end of article)

### Goal
Full attribution for all cited material at the bottom of each article. Legal coverage via fair-use notice. Clickable links where public URLs exist.

### Placement
After `<ReaderVote>`, before the page closes. Part of the MDX article content.

### Component: `src/components/SourcesPanel.tsx`

```typescript
interface Source {
  label: string        // e.g. "OpenAI founding principles"
  publication?: string // e.g. "OpenAI Blog"
  year?: string        // e.g. "2015"
  url?: string         // public URL, if available
  note?: string        // e.g. "Source on file" for confidential docs
}

interface SourcesPanelProps {
  sources: Source[]
}
```

### Visual spec
- Section label: "Sources & Notes" — 8px DM Mono uppercase, gold-dim
- Fair-use notice at top: 11px EB Garamond italic, muted — *"All quoted material is used for editorial commentary and criticism under fair use. longcut is an independent publication."*
- Each source: `publication · year` as label (DM Mono, 8px), then linked title text if URL exists (`<a>` opens in new tab, `color: var(--gold)`, no underline, hover underline), or plain text if no URL, then "Source on file" in faint italic if `note` is set.
- Separator: `0.5px solid var(--faint)` between fair-use notice and sources list.

### Usage in MDX
```mdx
<SourcesPanel sources={[
  { label: "Sam won't rule out running for political office", publication: "The Atlantic", year: "2023", url: "https://..." },
  { label: "Board removal letter", publication: "Internal document", year: "2023", note: "Source on file" }
]} />
```

---

## 4. Typography

### Change
Body prose: `19px → 21px`. Applied in `src/styles/globals.css` on the `.prose` selector (or equivalent base prose style).

Line-height stays at `1.8`. No other type scale changes.

---

## Multi-article Architecture Note

The landing page is designed to scale: the featured card always points to the current live article, the coming-next strip is manually curated in `page.tsx`. When a new article ships, update `page.tsx` to feature it and move the previous issue into the coming-next strip (or remove it). No CMS, no dynamic data fetching.

---

## What This Spec Does NOT Cover

- New article MDX files (Modi, Trump) — content only, same platform
- Any backend, auth, or database
- Scroll-triggered animations on the landing page (out of scope for v1)
