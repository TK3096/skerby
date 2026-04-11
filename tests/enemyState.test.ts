import { describe, it, expect, beforeEach } from "vitest";
import { EnemyState, ENEMY_SPEED, ENEMY_KILL_SCORE } from "../src/entities/EnemyState";

describe("EnemyState", () => {
  describe("horizontal patrol", () => {
    let enemy: EnemyState;

    beforeEach(() => {
      // Spawn at 500, midpoint is (400+600)/2=500, so direction=1 (toward boundEnd)
      enemy = new EnemyState(500, 400, "horizontal", 400, 600);
    });

    it("reverses direction at left bound", () => {
      const velocity = enemy.update(400);
      expect(velocity).toBe(ENEMY_SPEED);
    });

    it("reverses direction at right bound", () => {
      const velocity = enemy.update(600);
      expect(velocity).toBe(-ENEMY_SPEED);
    });

    it("continues in current direction when within bounds", () => {
      // Enemy spawned at mid (500), direction=1 (positive), so moves right
      const velocity = enemy.update(500);
      expect(velocity).toBe(ENEMY_SPEED);
    });

    it("direction persists between updates within bounds", () => {
      // Set direction to -1 by hitting right bound
      enemy.update(600);
      // Now within bounds — should still be -1
      const velocity = enemy.update(500);
      expect(velocity).toBe(-ENEMY_SPEED);
    });
  });

  describe("vertical patrol", () => {
    let enemy: EnemyState;

    beforeEach(() => {
      // Spawn at 100, midpoint is (50+200)/2=125, spawn < mid so direction=1
      enemy = new EnemyState(200, 100, "vertical", 50, 200);
    });

    it("reverses at top bound", () => {
      const velocity = enemy.update(50);
      expect(velocity).toBe(ENEMY_SPEED);
    });

    it("reverses at bottom bound", () => {
      const velocity = enemy.update(200);
      expect(velocity).toBe(-ENEMY_SPEED);
    });
  });

  describe("initial direction from spawn position", () => {
    it("spawned near boundStart moves toward boundEnd (positive)", () => {
      const enemy = new EnemyState(410, 400, "horizontal", 400, 600);
      const velocity = enemy.update(410);
      expect(velocity).toBe(ENEMY_SPEED);
    });

    it("spawned near boundEnd moves toward boundStart (negative)", () => {
      const enemy = new EnemyState(590, 400, "horizontal", 400, 600);
      const velocity = enemy.update(590);
      expect(velocity).toBe(-ENEMY_SPEED);
    });

    it("spawned at midpoint defaults to positive direction", () => {
      const enemy = new EnemyState(500, 400, "horizontal", 400, 600);
      const velocity = enemy.update(500);
      expect(velocity).toBe(ENEMY_SPEED);
    });

    it("vertical enemy spawned near boundEnd moves toward boundStart (negative)", () => {
      const enemy = new EnemyState(200, 180, "vertical", 50, 200);
      const velocity = enemy.update(180);
      expect(velocity).toBe(-ENEMY_SPEED);
    });
  });

  describe("full patrol cycle", () => {
    it("bounces correctly across sequential updates", () => {
      const enemy = new EnemyState(400, 400, "horizontal", 400, 600);
      // At boundStart — should move positive
      expect(enemy.update(400)).toBe(ENEMY_SPEED);
      // Within bounds — continues positive
      expect(enemy.update(500)).toBe(ENEMY_SPEED);
      // At boundEnd — reverses to negative
      expect(enemy.update(600)).toBe(-ENEMY_SPEED);
      // Within bounds — continues negative
      expect(enemy.update(500)).toBe(-ENEMY_SPEED);
      // Back at boundStart — reverses to positive
      expect(enemy.update(400)).toBe(ENEMY_SPEED);
    });
  });

  describe("kill", () => {
    let enemy: EnemyState;

    beforeEach(() => {
      enemy = new EnemyState(500, 400, "horizontal", 400, 600);
    });

    it("returns kill score on first kill", () => {
      const score = enemy.kill();
      expect(score).toBe(ENEMY_KILL_SCORE);
    });

    it("marks enemy as dead", () => {
      enemy.kill();
      expect(enemy.alive).toBe(false);
    });

    it("returns 0 score if already dead", () => {
      enemy.kill();
      const score = enemy.kill();
      expect(score).toBe(0);
    });

    it("returns 0 velocity when dead", () => {
      enemy.kill();
      const velocity = enemy.update(500);
      expect(velocity).toBe(0);
    });
  });
});
