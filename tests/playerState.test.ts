import { describe, it, expect, beforeEach } from "vitest";
import { PlayerState, MAX_HP, MAX_JUMPS } from "../src/entities/PlayerState";

describe("PlayerState", () => {
  let player: PlayerState;

  beforeEach(() => {
    player = new PlayerState();
  });

  describe("initialization", () => {
    it("starts with max HP", () => {
      expect(player.hp).toBe(MAX_HP);
    });

    it("starts with 0 score", () => {
      expect(player.score).toBe(0);
    });

    it("starts alive", () => {
      expect(player.isDead).toBe(false);
    });
  });

  describe("damage and healing", () => {
    it("reduces HP on damage", () => {
      player.takeDamage(25);
      expect(player.hp).toBe(75);
    });

    it("clamps HP to 0", () => {
      player.takeDamage(150);
      expect(player.hp).toBe(0);
    });

    it("triggers death when HP reaches 0", () => {
      player.takeDamage(100);
      expect(player.isDead).toBe(true);
    });

    it("heals HP", () => {
      player.takeDamage(50);
      player.heal(15);
      expect(player.hp).toBe(65);
    });

    it("caps HP at max", () => {
      player.takeDamage(10);
      player.heal(50);
      expect(player.hp).toBe(MAX_HP);
    });

    it("ignores damage when dead", () => {
      player.takeDamage(100);
      player.takeDamage(10);
      expect(player.hp).toBe(0);
    });

    it("ignores healing when dead", () => {
      player.takeDamage(100);
      player.heal(50);
      expect(player.hp).toBe(0);
    });
  });

  describe("score", () => {
    it("adds score", () => {
      player.addScore(10);
      expect(player.score).toBe(10);
    });

    it("accumulates score", () => {
      player.addScore(10);
      player.addScore(15);
      expect(player.score).toBe(25);
    });
  });

  describe("jumping", () => {
    it("allows first jump", () => {
      expect(player.canJump()).toBe(true);
    });

    it("allows double jump", () => {
      player.jump();
      expect(player.canJump()).toBe(true);
    });

    it("blocks third jump", () => {
      player.jump();
      player.jump();
      expect(player.canJump()).toBe(false);
    });

    it("resets jump count on land", () => {
      player.jump();
      player.jump();
      player.land();
      expect(player.canJump()).toBe(true);
      expect(player.jumpCount).toBe(0);
    });

    it("does not allow jump when dead", () => {
      player.takeDamage(100);
      expect(player.canJump()).toBe(false);
    });
  });

  describe("fall death", () => {
    it("kills player on fall", () => {
      player.fallDeath();
      expect(player.isDead).toBe(true);
      expect(player.hp).toBe(0);
    });

    it("ignores fall death if already dead", () => {
      player.takeDamage(100);
      player.fallDeath();
      expect(player.hp).toBe(0);
    });
  });
});
