import type { LevelData } from "./types";

const REQUIRED_FIELDS = [
  "name",
  "worldWidth",
  "worldHeight",
  "blocks",
  "enemies",
  "coins",
  "items",
  "warpGates",
  "hints",
] as const;

export function parseLevelData(json: string): LevelData {
  const data = JSON.parse(json);

  for (const field of REQUIRED_FIELDS) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  return {
    name: data.name,
    worldWidth: data.worldWidth,
    worldHeight: data.worldHeight,
    blocks: data.blocks ?? [],
    enemies: data.enemies ?? [],
    coins: data.coins ?? [],
    items: data.items ?? [],
    warpGates: data.warpGates ?? [],
    hints: data.hints ?? [],
  };
}
