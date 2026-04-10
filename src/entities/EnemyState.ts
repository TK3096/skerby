import type { EnemyPatrolType } from "../levels/types";

export const ENEMY_SPEED = 80;
export const ENEMY_CONTACT_DAMAGE = 1;
export const ENEMY_KILL_SCORE = 15;

export class EnemyState {
  x: number;
  y: number;
  patrol: EnemyPatrolType;
  boundStart: number;
  boundEnd: number;
  speed: number;
  alive: boolean;

  constructor(
    x: number,
    y: number,
    patrol: EnemyPatrolType,
    boundStart: number,
    boundEnd: number
  ) {
    this.x = x;
    this.y = y;
    this.patrol = patrol;
    this.boundStart = boundStart;
    this.boundEnd = boundEnd;
    this.speed = ENEMY_SPEED;
    this.alive = true;
  }

  update(currentPos: number): number {
    if (!this.alive) return 0;

    if (this.patrol === "horizontal") {
      if (currentPos <= this.boundStart) return this.speed;
      if (currentPos >= this.boundEnd) return -this.speed;
    } else {
      if (currentPos <= this.boundStart) return this.speed;
      if (currentPos >= this.boundEnd) return -this.speed;
    }

    return this.speed; // keep current direction as default
  }

  kill(): number {
    if (!this.alive) return 0;
    this.alive = false;
    return ENEMY_KILL_SCORE;
  }
}
