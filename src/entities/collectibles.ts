import type { ItemType } from "../levels/types";
import type { PlayerState } from "./PlayerState";

export const DONUT_SCORE = 10;
export const HEALTH_AMOUNT = 15;
export const POISON_AMOUNT = 10;

export function applyCollectibleEffect(type: ItemType, player: PlayerState) {
  switch (type) {
    case "donut":
      player.addScore(DONUT_SCORE);
      break;
    case "health":
      player.heal(HEALTH_AMOUNT);
      break;
    case "poison":
      player.takeDamage(POISON_AMOUNT);
      break;
  }
}
