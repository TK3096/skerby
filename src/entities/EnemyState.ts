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
  private direction: 1 | -1;

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
    const spawnPos = patrol === "horizontal" ? x : y;
    const mid = (boundStart + boundEnd) / 2;
    this.direction = spawnPos > mid ? -1 : 1;
  }

  update(currentPos: number): number {
    if (!this.alive) return 0;

    if (currentPos <= this.boundStart) this.direction = 1;
    else if (currentPos >= this.boundEnd) this.direction = -1;

    return this.speed * this.direction;
  }

  kill(): number {
    if (!this.alive) return 0;
    this.alive = false;
    return ENEMY_KILL_SCORE;
  }
}
