# Plan: Skerby Rewrite

> Source PRD: [TK3096/skerby#1](https://github.com/TK3096/skerby/issues/1)

## Architectural decisions

Durable decisions that apply across all phases:

- **Engine**: Phaser 3 with Arcade physics
- **Language**: TypeScript
- **Bundler**: Vite
- **Base resolution**: 960x540 (16:9), scaled with `Scale.FIT`
- **Scene keys**: `MenuScene`, `EnterNameScene`, `HowToPlayScene`, `GameScene`, `DeathScene`, `HighScoreScene`
- **Level data model**: Custom JSON format with top-level arrays for `blocks`, `enemies`, `coins`, `items`, `warpGates`, `hints`
- **Score storage**: localStorage key holding a JSON array of `{name, score}` objects
- **Asset pipeline**: Legacy PNGs from `legacy-skerby/src/Images/` copied into the new project, loaded via Phaser's asset loader
- **Test framework**: Vitest
- **Deployment**: GitHub Pages (static site)

---

## Phase 1: Scaffold + Walking on Blocks

**User stories**: 1, 5, 6, 7, 11, 25

### What to build

Set up the Vite + TypeScript + Phaser 3 project from scratch. Create a minimal `GameScene` with a handful of hardcoded test blocks (using the legacy floor tile PNGs) and a player character. The player can move left/right, jump, and land on blocks using Arcade physics. The player sprite flips horizontally when changing direction. The camera follows the player horizontally. The game scales responsively to fit the browser window at 16:9.

This phase proves the entire render + physics + input pipeline works end-to-end. You can open a browser and walk a character around on platforms.

### Acceptance criteria

- [ ] `npm run dev` starts a Vite dev server that loads the Phaser game in a browser
- [ ] Game renders at 960x540 base resolution and scales to fit the browser window (16:9, `Scale.FIT`)
- [ ] A player character is visible and renders the legacy `playerR.png` sprite
- [ ] Left/Right arrow keys move the player horizontally
- [ ] Space or Up arrow makes the player jump
- [ ] Player lands on and is stopped by block tiles (Arcade physics collision)
- [ ] Player sprite flips horizontally when changing direction
- [ ] Camera follows the player horizontally, showing more of the level as the player moves
- [ ] Legacy floor tile PNGs are loaded and rendered for the test blocks

---

## Phase 2: Level Loader + JSON Schema

**User stories**: 27, 28

### What to build

Design the custom JSON schema for level data covering all entity types: blocks (with tile type), enemies (with patrol type and bounds), coins, items (with item type), warp gates, and hint graphics. Build a Level Loader module that parses this JSON and creates the corresponding Phaser game objects in the GameScene. Convert a small representative section of the legacy Level 1 (a few block formations, a couple of enemies, some coins) into the new format to validate the schema works.

Replace the hardcoded test blocks from Phase 1 with the Level Loader. Write Level Loader tests using Vitest.

### Acceptance criteria

- [ ] A JSON schema is defined that can represent all legacy entity types (blocks, enemies, coins, items, warp gates, hints)
- [ ] The Level Loader parses a JSON file and produces the correct entity configurations
- [ ] GameScene loads level data from JSON instead of hardcoded values
- [ ] A small test section of Level 1 is playable using the JSON format
- [ ] Block tile types are specified in the JSON (not derived from insertion order like the legacy code)
- [ ] Level Loader tests pass: valid JSON produces correct entities, malformed JSON is handled gracefully

---

## Phase 3: Player Mechanics

**User stories**: 8, 12, 19

### What to build

Extend the player with full mechanics: double-jump (max 2 jumps in the air, resets on landing), an HP system (starts at 100, capped at 100), and death conditions (HP reaches 0 or player falls below level bounds). Add a temporary debug HUD showing HP and score so these values are visible during development. When the player dies, the game pauses or restarts for now (proper death screen comes in Phase 7).

Write Player module tests covering movement, jump counting, HP clamping, and death triggers.

### Acceptance criteria

- [ ] Player can double-jump (exactly 2 jumps allowed before landing)
- [ ] Jump count resets when player lands on a block
- [ ] Player has an HP value starting at 100
- [ ] HP is capped at 100 (cannot exceed)
- [ ] Player dies when HP reaches 0
- [ ] Player dies when falling below the level bounds
- [ ] A temporary debug HUD displays current HP and score
- [ ] Player tests pass: double-jump logic, HP clamping, death conditions

---

## Phase 4: Combat (Fireball + Enemies)

**User stories**: 9, 10, 16, 17, 18

### What to build

Implement the fireball system: pressing Z spawns a projectile that travels in the direction the player is currently facing. Fireballs despawn on enemy hit or when leaving the camera bounds.

Implement the enemy system: enemies are placed by the Level Loader (extend the test JSON with a few enemies). Two patrol types — horizontal enemies move left/right within bounds, vertical enemies move up/down within bounds. Enemies deal continuous damage to the player on contact. Enemies are destroyed when hit by a fireball or when the player attacks (Z key) on contact, awarding +15 score.

Write tests for the enemy patrol behavior and the collectibles/combat score logic.

### Acceptance criteria

- [ ] Pressing Z fires a projectile in the direction the player faces
- [ ] Fireball destroys enemies on contact and awards +15 score
- [ ] Fireball despawns when leaving camera bounds
- [ ] Horizontal-patrol enemies move back and forth within defined bounds
- [ ] Vertical-patrol enemies move up and down within defined bounds
- [ ] Player takes continuous HP damage while overlapping an enemy
- [ ] Player's attack (Z key on contact) destroys enemies and awards +15 score
- [ ] Enemy system tests pass: patrol behavior, destruction, score awarding

---

## Phase 5: Collectibles + HUD

**User stories**: 13, 14, 15, 12

### What to build

Implement the collectibles system: three item types loaded from the level JSON — donuts (+10 score), health packs (+15 HP, capped at 100), and poison (-10 HP). Items disappear after the player picks them up.

Replace the temporary debug HUD with the final HUD overlay: player name (top-left), score (top-right), and an HP bar rendered as a filled rectangle. The HUD is fixed to the screen, not the world.

Write collectibles tests covering each item type's effect and removal after pickup.

### Acceptance criteria

- [ ] Donuts award +10 score on pickup and disappear
- [ ] Health packs restore +15 HP (capped at 100) on pickup and disappear
- [ ] Poison items reduce HP by 10 on pickup and disappear
- [ ] HUD displays player name (top-left), score (top-right), and HP bar
- [ ] HUD is fixed to the screen and does not scroll with the camera
- [ ] Collectibles tests pass: score changes, HP changes, capping, item removal

---

## Phase 6: Full Level 1 + Win Condition

**User stories**: 20, 26, 29

### What to build

Convert the entire legacy Level 1 into the custom JSON format. This includes all ~55 block formations (with correct tile types), 28 enemy placements (with patrol types and bounds), 130+ coin positions, 18 item positions, the start and exit warp gates, and all hint graphics (arrow keys, Z key, spacebar hints).

Implement the win condition: reaching the exit warp gate at the end of the level completes the stage and records the player's score. World coordinates are adapted from the legacy 640x480 viewport to the 960x540 base.

After this phase, the full Level 1 is playable end-to-end from start to finish.

### Acceptance criteria

- [ ] The complete Level 1 is defined in a JSON file with all blocks, enemies, coins, items, warp gates, and hints
- [ ] All block formations render with correct tile types matching the legacy visual layout
- [ ] All 28 enemies are placed correctly with appropriate patrol types and bounds
- [ ] All 130+ coins and 18 items are placed at correct positions
- [ ] Start warp gate is visible at the level beginning
- [ ] Reaching the exit warp gate completes the stage
- [ ] Hint graphics (arrow keys, Z, spacebar) appear at appropriate locations in the level
- [ ] The full level is playable from start to finish and matches the legacy gameplay experience

---

## Phase 7: UI Screens + Score System

**User stories**: 2, 3, 4, 21, 22, 23, 24

### What to build

Implement all remaining Phaser scenes to complete the game flow:

- **MenuScene**: main menu with Play, How To Play, and High Score buttons (using the legacy `Interface.png` background)
- **EnterNameScene**: text input for the player's name (using legacy `EnterYourName.png` background)
- **HowToPlayScene**: two-page instructions display with navigation (using legacy How To Play backgrounds)
- **DeathScene**: game over screen with Play Again, Main Menu, and Exit options (using legacy `YouDie.png` background)
- **HighScoreScene**: displays top 5 scores with a back button (using legacy `HighScore.png` background)

Implement the Score Manager: reads and writes scores as a JSON array in localStorage. Records score on stage clear or death. Sorts descending and returns top 5.

Wire up the complete scene flow: Menu → Enter Name → Game → Death → (Play Again / Menu). Menu → How To Play → Menu. Menu → High Score → Menu.

Write Score Manager tests.

### Acceptance criteria

- [ ] MenuScene displays with legacy background and three working navigation buttons
- [ ] EnterNameScene accepts text input and passes the name to GameScene
- [ ] HowToPlayScene shows two pages of instructions with page navigation
- [ ] DeathScene shows after death or stage clear with Play Again, Main Menu options
- [ ] HighScoreScene displays the top 5 scores from localStorage
- [ ] Score is recorded to localStorage on death and on stage clear
- [ ] Scores are sorted descending, only top 5 shown
- [ ] Complete scene flow works: Menu → Name → Game → Death → Menu (and all branches)
- [ ] Score Manager tests pass: recording, sorting, top-5 retrieval, localStorage interaction

---

## Phase 8: GitHub Pages Deployment

**User stories**: 1

### What to build

Configure the Vite build to output a static site suitable for GitHub Pages. Set up a GitHub Actions workflow that builds the project and deploys to GitHub Pages on push to the main branch. Verify the game loads and plays correctly from the deployed URL.

### Acceptance criteria

- [ ] `npm run build` produces a static output directory with all assets
- [ ] A GitHub Actions workflow builds and deploys to GitHub Pages on push to main
- [ ] The game loads and is fully playable from the GitHub Pages URL
- [ ] Assets (images, JSON level data) load correctly in production
