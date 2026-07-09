# Tellera — prototype (cool brand direction)

A self-contained, click-through **prototype** of Tellera for team review. Plain
HTML/CSS/JS — no build step, no dependencies. Open `index.html` in a browser, or
serve the folder statically.

> This is a prototype to share and react to — **not** the production build. When we
> code it "for real," this is the pixel/interaction reference; port it to Next.js
> (or the LTVco stack) and wire real data.

## Screens
| File | Screen |
|------|--------|
| `index.html` | Marketing homepage (responsive: desktop + mobile story) |
| `property.html` | Tellera Property — agent landing (map hero, features, data, API) |
| `deep-search.html` | Deep Search — the in-product research app |

They cross-link: homepage agent cards / "Get started" → Property & Deep Search;
those pages link back to the homepage.

## Run locally
Just open `index.html`. To serve (nicer for relative paths):
```
npx serve .          # then open the printed http://localhost:PORT
```

## How it's organized
```
index.html property.html deep-search.html
styles/
  tokens.css        # the "cool" design system — colors, type, spacing, prism utilities
  home.css property.css deep-search.css
js/
  data.js           # the nine agents, example records, comparisons, brands
  home.js property.js deep-search.js
assets/fonts/       # Nunito Sans (self-hosted). Spectral + IBM Plex Mono via Google Fonts
```

## Design system (from the Claude Design handoff)
- **Prism motif** — gradient bar `#2E7BFF → #7B5BFF → #B0402F`, ray-fan behind heroes,
  diagonal cross-hatch texture. Reused across all screens (`tokens.css`).
- **Type** — Spectral (display), IBM Plex Mono (eyebrows/labels/code), Nunito Sans (body).
- **Surfaces** — cool blue-grey paper `#E9EEF5`, app bg `#F5F8FC`, white cards.
- All tokens live as CSS variables in `styles/tokens.css`.

## Interactions
- Blinking caret in ask/prompt fields; sample-question chips fill the bar.
- Homepage record card auto-advances through four cited examples (clickable dots).
- Deep Search agent pills seed the query; "New search" resets.
- Property developer panel: REST / MCP / GraphQL tabs.
- Draggable / wheel-scroll agent rails; responsive mobile nav.

## Not wired (prototype scope)
Real records API, auth/accounts, actual search results, report/usage counts. The
data in `js/data.js` is the handoff's example content.
