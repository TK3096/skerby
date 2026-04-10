import { describe, it, expect, beforeEach } from "vitest";
import { PlayerState, MAX_HP } from "../src/entities/PlayerState";
import { applyCollectibleEffect, DONUT_SCORE, HEALTH_AMOUNT, POISON_AMOUNT } from "../src/entities/collectibles";

describe("collectibles", () => {
  let player: PlayerState;

  beforeEach(() => {
    player = new PlayerState();
  });

  describe("donut", () => {
    it("adds score", () => {
      applyCollectibleEffect("donut", player);
      expect(player.score).toBe(DONUT_SCORE);
    });

    it("does not affect HP", () => {
      applyCollectibleEffect("donut", player);
      expect(player.hp).toBe(MAX_HP);
    });
  });

  describe("health", () => {
    it("heals the player", () => {
      player.takeDamage(50);
      applyCollectibleEffect("health", player);
      expect(player.hp).toBe(50 + HEALTH_AMOUNT);
    });

    it("caps HP at max", () => {
      player.takeDamage(5);
      applyCollectibleEffect("health", player);
      expect(player.hp).toBe(MAX_HP);
    });
  });

  describe("poison", () => {
    it("damages the player", () => {
      applyCollectibleEffect("poison", player);
      expect(player.hp).toBe(MAX_HP - POISON_AMOUNT);
    });

    it("can kill the player", () => {
      player.takeDamage(95);
      applyCollectibleEffect("poison", player);
      expect(player.isDead).toBe(true);
    });
  });
});
