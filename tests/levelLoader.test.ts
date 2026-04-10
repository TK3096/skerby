import { describe, it, expect } from "vitest";
import { parseLevelData } from "../src/levels/levelLoader";
import type { LevelData } from "../src/levels/types";

const validLevel: LevelData = {
  name: "Test Level",
  worldWidth: 3000,
  worldHeight: 540,
  blocks: [
    { x: 100, y: 400, tile: "floorUp" },
    { x: 145, y: 400, tile: "floorUp" },
  ],
  enemies: [
    { x: 500, y: 350, patrol: "horizontal", boundStart: 400, boundEnd: 600 },
    { x: 200, y: 100, patrol: "vertical", boundStart: 50, boundEnd: 200 },
  ],
  coins: [
    { x: 300, y: 350 },
    { x: 350, y: 350 },
  ],
  items: [
    { x: 600, y: 350, type: "health" },
    { x: 700, y: 350, type: "poison" },
  ],
  warpGates: [
    { x: 50, y: 400, kind: "start" },
    { x: 2900, y: 400, kind: "exit" },
  ],
  hints: [
    { x: 150, y: 380, image: "arrowRight" },
  ],
};

describe("parseLevelData", () => {
  it("parses valid level data and returns correct entity counts", () => {
    const result = parseLevelData(JSON.stringify(validLevel));
    expect(result.name).toBe("Test Level");
    expect(result.worldWidth).toBe(3000);
    expect(result.worldHeight).toBe(540);
    expect(result.blocks).toHaveLength(2);
    expect(result.enemies).toHaveLength(2);
    expect(result.coins).toHaveLength(2);
    expect(result.items).toHaveLength(2);
    expect(result.warpGates).toHaveLength(2);
    expect(result.hints).toHaveLength(1);
  });

  it("preserves block tile types", () => {
    const result = parseLevelData(JSON.stringify(validLevel));
    expect(result.blocks[0].tile).toBe("floorUp");
  });

  it("preserves enemy patrol types and bounds", () => {
    const result = parseLevelData(JSON.stringify(validLevel));
    expect(result.enemies[0].patrol).toBe("horizontal");
    expect(result.enemies[0].boundStart).toBe(400);
    expect(result.enemies[0].boundEnd).toBe(600);
    expect(result.enemies[1].patrol).toBe("vertical");
  });

  it("preserves item types", () => {
    const result = parseLevelData(JSON.stringify(validLevel));
    expect(result.items[0].type).toBe("health");
    expect(result.items[1].type).toBe("poison");
  });

  it("preserves warp gate kinds", () => {
    const result = parseLevelData(JSON.stringify(validLevel));
    const start = result.warpGates.find((w) => w.kind === "start");
    const exit = result.warpGates.find((w) => w.kind === "exit");
    expect(start).toBeDefined();
    expect(exit).toBeDefined();
  });

  it("throws on invalid JSON", () => {
    expect(() => parseLevelData("not json")).toThrow();
  });

  it("throws when required fields are missing", () => {
    expect(() => parseLevelData(JSON.stringify({ name: "incomplete" }))).toThrow();
  });

  it("defaults empty arrays for optional entity lists", () => {
    const minimal = {
      name: "Minimal",
      worldWidth: 1000,
      worldHeight: 540,
      blocks: [],
      enemies: [],
      coins: [],
      items: [],
      warpGates: [],
      hints: [],
    };
    const result = parseLevelData(JSON.stringify(minimal));
    expect(result.blocks).toHaveLength(0);
    expect(result.enemies).toHaveLength(0);
  });
});
