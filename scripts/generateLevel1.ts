/**
 * Generates the Level 1 JSON from legacy hardcoded data.
 * Run with: npx tsx scripts/generateLevel1.ts
 *
 * Legacy viewport: 640x480, new: 960x540
 * We keep world coordinates as-is — the camera just shows more.
 */

import { writeFileSync } from "fs";

interface Block { x: number; y: number; tile: string }
interface Enemy { x: number; y: number; patrol: string; boundStart: number; boundEnd: number }
interface Coin { x: number; y: number }
interface Item { x: number; y: number; type: string }
interface WarpGate { x: number; y: number; kind: string }
interface Hint { x: number; y: number; image: string }

const BOX = 45;
const blocks: Block[] = [];
const enemies: Enemy[] = [];
const coins: Coin[] = [];
const items: Item[] = [];
const warpGates: WarpGate[] = [];
const hints: Hint[] = [];

// ========== BLOCK HELPERS ==========

function addRect(startX: number, startY: number, cols: number, rows: number) {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      blocks.push({
        x: startX + c * BOX + BOX / 2,
        y: startY + r * BOX + BOX / 2,
        tile: "floorUp", // will be reassigned later
      });
    }
  }
}

function addAlternating(startX: number, startY: number, totalCols: number, stack: number, space: number) {
  let col = 0;
  while (col < totalCols) {
    for (let s = 0; s < stack && col < totalCols; s++, col++) {
      blocks.push({
        x: startX + col * BOX + BOX / 2,
        y: startY + BOX / 2,
        tile: "floorUp",
      });
    }
    col += space; // skip gap
  }
}

function addStair(yArg: number, xArg: number, height: number, width: number) {
  // Legacy constructor: (y, x, height, width, "Stair")
  // i iterates X positions (height steps), j iterates Y positions (width)
  // Each step: width += 2, yArg -= 45
  let currentY = yArg;
  let currentWidth = width;
  for (let step = 0; step < height; step++) {
    const currentX = xArg + step * BOX;
    for (let w = 0; w < currentWidth; w++) {
      blocks.push({
        x: currentX + BOX / 2,
        y: currentY + w * BOX + BOX / 2,
        tile: "floorUp",
      });
    }
    currentWidth += 2;
    currentY -= BOX;
  }
}

// ========== BLOCKS (from Level1.java) ==========

// #1: ground section 1
addRect(10, 405, 30, 1);
// #2: ground section 2
addRect(1765, 405, 25, 1);
// #3: ceiling section 1
addRect(10, 0, 150, 1);
// #4: left wall
addRect(10, 0, 1, 10);
// #5: platform
addRect(550, 135, 5, 1);
// #6: platform
addRect(955, 225, 6, 1);
// #7: tall pillar
addRect(1360, 135, 2, 5);
// #8: platform
addRect(1450, 180, 4, 2);
// #9: tall pillar
addRect(1855, 45, 2, 6);
// #10: small platform
addRect(1945, 270, 2, 1);
// #11: large block
addRect(2170, 135, 5, 6);
// #12: long platform
addRect(2800, 180, 20, 1);
// #13: small platform
addRect(3970, 180, 2, 1);
// #14
addRect(5320, 270, 2, 1);
// #15
addRect(5635, 225, 2, 1);
// #16: ceiling section 2
addRect(6755, 0, 300, 1);
// #17: ground section 3
addRect(5905, 405, 30, 1);
// #18
addRect(5995, 270, 6, 1);
// #19
addRect(6220, 225, 5, 1);
// #20
addRect(7390, 270, 3, 1);
// #21
addRect(7705, 225, 3, 1);
// #22
addRect(8020, 180, 3, 1);
// #23: ground section 4
addRect(8515, 405, 45, 1);
// #24-28: vertical pillars
addRect(8690, 45, 1, 6);
addRect(8825, 45, 1, 6);
addRect(8960, 45, 1, 6);
addRect(9095, 45, 1, 6);
addRect(9230, 45, 1, 6);
// #29
addRect(10310, 135, 9, 1);
// #30
addRect(10670, 45, 1, 2);
// #31
addRect(10675, 270, 4, 1);
// #32-36: single blocks
addRect(10900, 180, 1, 1);
addRect(11080, 180, 1, 1);
addRect(11350, 225, 1, 1);
addRect(11660, 180, 1, 1);
addRect(11930, 180, 1, 1);
// #37
addRect(12245, 270, 15, 1);
// #38
addRect(13010, 405, 10, 1);
// #39
addRect(13505, 270, 10, 1);
// #40
addRect(13910, 405, 21, 1);
// #41
addRect(14180, 180, 20, 1);
// #42: vertical pillar
addRect(14810, 225, 1, 4);
// #43
addRect(15260, 405, 10, 1);
// #44
addRect(15845, 270, 2, 1);
// #45
addRect(16160, 180, 5, 1);
// #46
addRect(16340, 405, 15, 1);
// #47
addRect(17060, 275, 4, 1);
// #48
addRect(17110, 135, 4, 1);
// #49
addRect(17240, 405, 20, 1);

// TYPE B: alternating
// #50
addAlternating(3070, 405, 30, 5, 5);

// TYPE C: stairs (y, x, height, width)
addStair(550, 270, 3, 5);
addStair(2395, 180, 5, 1);
addStair(3610, 45, 4, 1);
addStair(4330, 270, 4, 15);
addStair(6670, 270, 3, 5);
addStair(9505, 225, 4, 12);
addStair(12425, 180, 2, 6);

// ========== AUTO-ASSIGN TILE TYPES ==========
// Simple heuristic: check neighbors to determine tile type
// For now, use "floorUp" for all - the visual improvement comes later
// We'll use a basic approach: top surface = floorUp, everything else = floorInside

const blockSet = new Set<string>();
for (const b of blocks) {
  blockSet.add(`${b.x},${b.y}`);
}

for (const b of blocks) {
  const hasAbove = blockSet.has(`${b.x},${b.y - BOX}`);
  const hasBelow = blockSet.has(`${b.x},${b.y + BOX}`);
  const hasLeft = blockSet.has(`${b.x - BOX},${b.y}`);
  const hasRight = blockSet.has(`${b.x + BOX},${b.y}`);

  if (!hasAbove && !hasLeft && !hasRight) b.tile = "floorUp";
  else if (!hasAbove && !hasLeft && hasRight) b.tile = "floorTopLeft";
  else if (!hasAbove && hasLeft && !hasRight) b.tile = "floorTopRight";
  else if (!hasAbove && hasLeft && hasRight) b.tile = "floorUp";
  else if (hasAbove && !hasLeft && !hasRight) b.tile = "floorDown";
  else if (hasAbove && !hasLeft && hasRight) b.tile = "floorLeft";
  else if (hasAbove && hasLeft && !hasRight) b.tile = "floorRight";
  else if (!hasBelow && !hasLeft) b.tile = "floorDownLeft";
  else if (!hasBelow && !hasRight) b.tile = "floorDownRight";
  else b.tile = "floorInside";
}

// ========== ENEMIES ==========

const PATROL_HALF_RANGE = 150; // ~50 ticks × 3px/tick

// Horizontal patrol enemies
const hEnemies = [
  [1050, 340], [1750, 340], [3250, 115], [3100, 340], [3500, 340],
  [4500, 210], [6241, 340], [9620, 158], [9840, 158], [13688, 202],
  [14432, 337], [16702, 340],
];
for (const [x, y] of hEnemies) {
  enemies.push({
    x, y,
    patrol: "horizontal",
    boundStart: x - PATROL_HALF_RANGE,
    boundEnd: x + PATROL_HALF_RANGE,
  });
}

// Vertical patrol enemies
const vEnemies = [
  [480, 30], [800, 40], [1300, 60], [1650, 30], [2500, 30],
  [4200, 100], [5100, 45], [5540, 55], [6310, 30], [6497, 60],
  [7598, 100], [8747, 150], [8894, 160], [9034, 150], [9150, 160],
  [11196, 55], [11508, 30], [16044, 30],
];
for (const [x, y] of vEnemies) {
  enemies.push({
    x, y,
    patrol: "vertical",
    boundStart: y,
    boundEnd: y + 2 * PATROL_HALF_RANGE,
  });
}

// ========== COINS ==========

function addCoins(startX: number, y: number, count: number, step: number) {
  for (let i = 0; i < count; i++) {
    coins.push({ x: startX + i * step, y });
  }
}

// From CoinsManager.java
addCoins(255, 360, 3, 60);
coins.push({ x: 445, y: 310 });
addCoins(550, 200, 3, 70);
addCoins(550, 90, 5, 50);
addCoins(1450, 130, 3, 50);
addCoins(1800, 350, 7, 50);
coins.push({ x: 1950, y: 220 }, { x: 2000, y: 220 });
addCoins(2200, 80, 3, 50);
// Stair-like singles
coins.push(
  { x: 2400, y: 130 }, { x: 2450, y: 180 }, { x: 2490, y: 230 },
  { x: 2530, y: 270 }, { x: 2570, y: 320 },
);
coins.push({ x: 3100, y: 270 }, { x: 3150, y: 270 }, { x: 3200, y: 270 });
coins.push({ x: 3550, y: 270 }, { x: 3600, y: 270 });
addCoins(4350, 220, 11, 50);
addCoins(4350, 90, 11, 50);
coins.push({ x: 5300, y: 50 });
addCoins(5985, 220, 5, 50);
addCoins(5985, 100, 5, 50);
addCoins(6157, 360, 6, 50);
// Double loop: i=80,120,160 j=0,50,100
for (const yy of [80, 120, 160]) {
  addCoins(6713, yy, 3, 50);
}
addCoins(7029, 230, 4, 50);
addCoins(7385, 120, 3, 50);
addCoins(7861, 90, 3, 50);
addCoins(8349, 200, 5, 50);
coins.push({ x: 9021, y: 200 }, { x: 9021, y: 240 });
addCoins(9577, 80, 8, 50);
coins.push({ x: 10377, y: 70 }, { x: 10477, y: 70 }, { x: 10577, y: 70 });
coins.push({ x: 11211, y: 130 });
addCoins(12479, 90, 3, 50);
addCoins(13561, 100, 5, 50);
addCoins(14341, 120, 10, 50);
addCoins(15529, 100, 4, 50);
// Double loop: i=120,160 j=0,50,100,150
for (const yy of [120, 160]) {
  addCoins(16741, yy, 4, 50);
}
addCoins(14131, 360, 11, 50);

// ========== ITEMS ==========

const itemData: [number, number, string][] = [
  [1350, 90, "poison"],
  [2150, 90, "poison"],
  [2900, 130, "poison"],
  [3580, 50, "health"],
  [4000, 100, "health"],
  [4600, 150, "health"],
  [4700, 150, "poison"],
  [5500, 50, "poison"],
  [6385, 140, "health"],
  [8055, 110, "poison"],
  [8753, 160, "health"],
  [11667, 110, "poison"],
  [14749, 360, "health"],
  [15525, 360, "poison"],
  [16353, 360, "health"],
  [16757, 360, "poison"],
  [16873, 360, "poison"],
  [17154, 200, "poison"],
];
for (const [x, y, type] of itemData) {
  items.push({ x, y, type });
}

// ========== WARP GATES ==========

warpGates.push(
  { x: 118, y: 200, kind: "start" },
  { x: 17500, y: 300, kind: "exit" },
);

// ========== HINTS ==========
// Arrow and key hints at the start of the level
hints.push(
  { x: 200, y: 370, image: "arrowRight" },
  { x: 300, y: 370, image: "arrowLeft" },
  { x: 250, y: 320, image: "arrowUp" },
  { x: 400, y: 370, image: "spacebar" },
  { x: 500, y: 370, image: "Z" },
);

// ========== OUTPUT ==========

const level = {
  name: "Level 1",
  worldWidth: 18200,
  worldHeight: 540,
  blocks,
  enemies,
  coins,
  items,
  warpGates,
  hints,
};

const json = JSON.stringify(level, null, 2);
writeFileSync("public/levels/level1.json", json);
console.log(`Generated level1.json:`);
console.log(`  Blocks: ${blocks.length}`);
console.log(`  Enemies: ${enemies.length}`);
console.log(`  Coins: ${coins.length}`);
console.log(`  Items: ${items.length}`);
console.log(`  Warp Gates: ${warpGates.length}`);
console.log(`  Hints: ${hints.length}`);
