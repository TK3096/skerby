import { describe, it, expect, beforeEach } from "vitest";
import { EnemyState, ENEMY_SPEED, ENEMY_KILL_SCORE } from "../src/entities/EnemyState";

describe("EnemyState", () => {
  describe("horizontal patrol", () => {
    let enemy: EnemyState;

    beforeEach(() => {
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

    it("continues at default speed when within bounds", () => {
      const velocity = enemy.update(500);
      expect(velocity).toBe(ENEMY_SPEED);
    });
  });

  describe("vertical patrol", () => {
    let enemy: EnemyState;

    beforeEach(() => {
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
