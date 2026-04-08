# Landing Page Redesign — Design Spec
Date: 2026-04-08

## Goal

Remove the two-step gate → "enter the piece" flow. The vote IS the entry. After voting, the article hero appears automatically. Users who already voted skip the gate entirely.

## Approach

Approach A: Full article inline on `/`. Gate and article content live on the same page in a single scroll container. No navigation events after voting.

## Architecture

`src/app/page.tsx` becomes an `async` server component. It fetches the altman MDX via `getArticleBySlug('altman')` and renders a `LandingClient` client component, passing frontmatter props and the MDX output as children.

```
page.tsx (server)
  └── LandingClient (client)
        ├── <Filmstrip acts totalMinutes />
        ├── {gateVisible && <Gate onVoted={handleVoted} />}
        ├── {overlay && <VoteOverlay counts fading />}
        └── <main>
              <MDXRemote components={{ Gate: NullGate, Hero, … }} />
            </main>
```

The `<Gate>` inside `altman.mdx` is suppressed by passing `Gate: () => null` in the MDX components map. `LandingClient` owns the real Gate above the MDX content. The MDX file is not modified.

## Files Changed

| File | Change |
|---|---|
| `src/app/page.tsx` | Rewrite as async server component; fetch MDX; render LandingClient + MDXRemote |
| `src/components/LandingClient.tsx` | New client component; gate state, overlay, scroll logic |
| `src/components/Gate.tsx` | Add `onVoted` callback prop; remove "Enter" link; add mobile button styles |

## LandingClient State Machine

| State | Trigger | What renders |
|---|---|---|
| `gate` | Default; `lc_gate` absent in localStorage | Gate fullscreen, article below in DOM |
| `skipped` | `lc_gate` found on mount | Gate never shown; article starts at top |
| `voted` | User clicks Yes/No | Gate unmounted; overlay shown; scroll to `#hero` starts |

**On mount:** reads `localStorage.lc_gate`. If present → `gateVisible = false` immediately (gate never renders). If absent → gate renders.

**On vote:** `Gate.onVoted(choice)` fires. Parent sets `gateVisible = false`, shows overlay, calls `requestAnimationFrame(() => document.getElementById('hero').scrollIntoView({ behavior: 'smooth' }))`.

## Vote Overlay

- `position: fixed; inset: 0; z-index: 450; pointer-events: none`
- Background: `rgba(10,8,6,0.68)` — semi-transparent so hero is faintly visible behind
- Content: yes% in gold Playfair italic + no% in red-tinted, side by side, DM Mono uppercase labels
- Timeline:
  - `t=0ms` — overlay appears (opacity 1), scroll starts
  - `t=900ms` — begin fade (`transition: opacity 1.4s ease`)
  - `t=2300ms` — removed from DOM

## Gate Component Changes

**New prop:** `onVoted?: (choice: 'yes' | 'no') => void`
- Called inside `handleVote` synchronously, before state updates
- Parent unmounts Gate immediately so the post-vote bar UI never renders

**Removed:** "Enter the piece ↓" link (`.gate-enter`) — deleted entirely from Gate

**Mobile additions:**
```css
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
```

## `/altman` Route

Unchanged. Still renders the full article independently. `Gate` inside the MDX renders normally on that route (no suppression).

## What Does Not Change

- `altman.mdx` — no modifications
- All article components — no modifications except Gate
- `[article]/page.tsx` — unchanged
- localStorage keys `lc_gate` / `lc_final` — unchanged; `ReaderVote` still reads `lc_gate` correctly

## Success Criteria

1. First-time visitor sees Gate fullscreen; clicking Yes/No triggers overlay + smooth scroll to Hero
2. Already-voted visitor lands directly on article Hero with no gate flash
3. Overlay shows vote percentages for ~2s while hero comes into view, then fades to nothing
4. No "Enter the piece" link anywhere
5. Mobile gate buttons are full-width, minimum 48px height
6. `next build` passes with 0 errors
