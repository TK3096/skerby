# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Skerby is a 2D side-scrolling platformer built with Phaser 3, TypeScript, and Vite. It's a rewrite of a legacy Java Swing game. The game features a single level with block platforms, enemies (horizontal/vertical patrol), collectibles (donuts, health packs, poison), a fireball attack system, and a score leaderboard stored in localStorage.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — typecheck then build (`tsc && vite build`)
- `npm run test` — run Vitest (watch mode by default)
- `npx vitest run` — single test run (CI-friendly)
- `npx vitest run tests/playerState.test.ts` — run a single test file
- `npx tsx scripts/generateLevel1.ts` — regenerate `public/levels/level1.json` from legacy data

## Architecture

**Game engine**: Phaser 3 with Arcade physics. Base resolution 960×540, scaled with `Scale.FIT`. Gravity is 800 on Y axis.

**Scene flow**: `MenuScene → EnterNameScene → GameScene → DeathScene` (loops back). Side branches: `MenuScene → HowToPlayScene → MenuScene` and `MenuScene → HighScoreScene → MenuScene`. Scene keys match class names exactly.

**Separation of game logic from Phaser**: Pure-logic classes (`PlayerState`, `EnemyState`, `ScoreManager`, `collectibles`, `levelLoader`) contain no Phaser dependencies — they operate on plain numbers/strings. This is what the tests exercise. `GameScene` is the glue that wires these into Phaser sprites, physics, and overlaps.

**Level data pipeline**: Level geometry is defined procedurally in `scripts/generateLevel1.ts` (ported from legacy Java), which outputs `public/levels/level1.json`. At runtime, `GameScene` loads this JSON as a text asset and passes it through `parseLevelData()`. The JSON schema is defined by the `LevelData` interface in `src/levels/types.ts`.

**Asset path convention**: Assets live in `public/assets/` and are referenced from Phaser loaders without the `public/` prefix (e.g., `"assets/Player/playerR.png"`). Level JSON lives at `public/levels/`.

**Deployment**: GitHub Actions builds and deploys to GitHub Pages on push to `main`. Vite `base` is set to `/skerby/`.

## Key Constants

Game tuning values are centralized in `src/config.ts`: tile size (45px), player speed (200), jump velocity (-400), fireball speed (400). Entity-specific constants (enemy speed, damage values, collectible amounts) live in their respective files under `src/entities/`.

## Testing

Tests are pure unit tests against the logic classes — no Phaser mocking needed. `ScoreManager` tests use a mock `Storage` object injected via constructor.
