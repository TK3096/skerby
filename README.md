# Skerby

A 2D side-scrolling platformer built with Phaser 3 and TypeScript — a rewrite of a legacy Java Swing game.

**Play it:** https://TK3096.github.io/skerby/

## Gameplay

- **Arrow keys** — move left/right, jump (up to double-jump)
- **Space** — jump
- **Z** — shoot fireball (destroys enemies) / melee attack on contact

Collect donuts (+10 score), health packs (+15 HP), and avoid poison (-10 HP). Reach the exit warp gate to clear the stage. Top 5 scores are saved locally.

## Development

```bash
npm install
npm run dev       # start dev server at localhost:5173
npm run build     # typecheck + production build → dist/
npm run test      # run tests (watch mode)
```

Regenerate the level JSON from source data:

```bash
npx tsx scripts/generateLevel1.ts
```

## Tech Stack

- [Phaser 3](https://phaser.io/) — game engine (Arcade physics)
- TypeScript + Vite
- Vitest — unit tests
- GitHub Actions → GitHub Pages (deploys on push to `main`)
