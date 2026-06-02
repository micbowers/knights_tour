# Knights Tour — project handbook

A Sparkworks classroom math game. Visualizes the classic chess knight's-tour puzzle (knight must visit every square on a board exactly once). Vite static site deployed to Vercel. Live at **https://knightstour.sparkworks.kids**.

> This is the per-game project handbook (a reference doc, not an agent — there is no CLAUDE.md here). The owning agent is **Sparkworks Web Games** at `../../CLAUDE.md` (the umbrella, two levels up) — read that for org-wide config, interaction protocols with other Cairn agents, and the shared web-game conventions. This file is the game-specific reference.

## What it is

A puzzle visualizer for the knight's tour problem. Math/CS background reference: `knights_tour_detailed.md` in this folder (the puzzle's math, history, algorithms, complexity). The app visualizes the puzzle for kids in grades 2–6.

## Tech stack

- **Vanilla JS + Vite** for the front-end. No React. ES modules across `src/`.
- **Vercel** for hosting + custom domain. `vercel.json` is minimal (`buildCommand: npm run build`, `outputDirectory: dist`, `cleanUrls: true`).
- **`api/health.js`** — single trivial serverless function returning `{ ok: true, service: 'knightstour', ... }`.
- **No LLM, no audio pipeline, no localStorage state today.** This is intentionally a thin static visualizer.

## Directory map

```
KnightsTourApp/
├── PROJECT.md (this file), knights_tour_detailed.md, vercel.json, vite.config.js, .env, .env.example, .gitignore
├── api/
│   └── health.js               # Trivial health endpoint
├── public/
│   └── knight.svg              # Knight visual
├── src/
│   ├── main.js                 # Entry
│   └── styles/                 # tokens.css, base.css
└── dist/                       # Build output (gitignored)
```

## Run / build / deploy

```bash
npm install                     # one-time
npm run dev                     # vite dev server
npm run build                   # production build to dist/
git push                        # Vercel auto-deploys main
```

Env vars: none required today. `.env.example` is a marker for a possible future AI Coach feature (would add `ANTHROPIC_API_KEY` then).

## Conventions when changing this code

- **Keep it small.** Vanilla JS / no React. Bundle should stay tiny — the puzzle visualization doesn't need a framework.
- **Match the Sparkworks brand surfaces** — read brand canonicals at `../../../../Sparkworks Marketing/Brand guidelines/` before adding visual elements. Don't modify canonicals.
- **`.env` and `.env.local` are gitignored** — never commit.
- **If you add a serverless function** that touches an LLM or external API, follow the defense pattern from FTA's `/api/interpret` (rate limit, CORS, input validation, output ceiling, spending cap). See `../../FindTheAlien/FindAlienApp/PROJECT.md` and its `lib/` directory for the reference.
- **If you add an AI Coach** (the `.env.example` hints at this), it must follow the same defense pattern and have its own STATUS update.

## Known issues

- _None outstanding._ (The `api/health.js` `service: 'findthealien'` scaffolding leftover was fixed 2026-06-01.)

## Cross-game pattern

This game is one of two web games in the Sparkworks Web Games umbrella. Find The Alien (sibling) is more developed (LLM-backed, audio, full handbook). If you're tempted to add similar infrastructure here (LLM, audio, hidden-state-with-server-mediation), look at FTA's handbook first so the patterns stay consistent.
