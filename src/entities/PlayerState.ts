export const MAX_HP = 100;
export const MAX_JUMPS = 2;

export class PlayerState {
  hp: number;
  score: number;
  jumpCount: number;
  isDead: boolean;

  constructor() {
    this.hp = MAX_HP;
    this.score = 0;
    this.jumpCount = 0;
    this.isDead = false;
  }

  takeDamage(amount: number) {
    if (this.isDead) return;
    this.hp = Math.max(0, this.hp - amount);
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  heal(amount: number) {
    if (this.isDead) return;
    this.hp = Math.min(MAX_HP, this.hp + amount);
  }

  addScore(amount: number) {
    this.score += amount;
  }

  canJump(): boolean {
    return !this.isDead && this.jumpCount < MAX_JUMPS;
  }

  jump() {
    if (this.canJump()) {
      this.jumpCount++;
    }
  }

  land() {
    this.jumpCount = 0;
  }

  fallDeath() {
    if (this.isDead) return;
    this.hp = 0;
    this.isDead = true;
  }
}
