import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, PLAYER_JUMP_VELOCITY, FIREBALL_SPEED } from "../config";
import { parseLevelData } from "../levels/levelLoader";
import { PlayerState } from "../entities/PlayerState";
import { EnemyState, ENEMY_CONTACT_DAMAGE } from "../entities/EnemyState";
import { applyCollectibleEffect } from "../entities/collectibles";
import type { LevelData, ItemType } from "../levels/types";

interface EnemySprite extends Phaser.Physics.Arcade.Sprite {
  enemyState: EnemyState;
}

interface CollectibleSprite extends Phaser.Physics.Arcade.Sprite {
  itemType: ItemType;
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private facingRight = true;
  private levelData!: LevelData;
  private playerState!: PlayerState;
  private nameText!: Phaser.GameObjects.Text;
  private scoreText!: Phaser.GameObjects.Text;
  private hpBarBg!: Phaser.GameObjects.Rectangle;
  private hpBarFill!: Phaser.GameObjects.Rectangle;
  private playerName = "Player";
  private jumpKeyReleased = true;
  private attackKey!: Phaser.Input.Keyboard.Key;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private enemies!: Phaser.Physics.Arcade.Group;
  private attackKeyReleased = true;
  private isAttacking = false;
  private coins!: Phaser.Physics.Arcade.Group;
  private items!: Phaser.Physics.Arcade.Group;
  private exitGate: { x: number; y: number } | null = null;

  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("player", "assets/Player/playerR.png");
    this.load.image("floorUp", "assets/StateLV1/FloorUp.png");
    this.load.image("floorDown", "assets/StateLV1/FloorDown.png");
    this.load.image("floorLeft", "assets/StateLV1/FloorLeft.png");
    this.load.image("floorRight", "assets/StateLV1/FloorRight.png");
    this.load.image("floorTopLeft", "assets/StateLV1/FloorTopLeft.png");
    this.load.image("floorTopRight", "assets/StateLV1/FloorTopRight.png");
    this.load.image("floorDownLeft", "assets/StateLV1/FloorDownLeft.png");
    this.load.image("floorDownRight", "assets/StateLV1/FloorDownRight.png");
    this.load.image("floorInside", "assets/StateLV1/FloorInside.png");

    this.load.image("fireball", "assets/Player/fireball.png");
    this.load.image("enemyL", "assets/Enemy/EnemyL.png");
    this.load.image("enemyR", "assets/Enemy/EnemyR.png");
    this.load.image("enemyY", "assets/Enemy/EnemyY.png");

    this.load.image("donut", "assets/Items/donut.png");
    this.load.image("health", "assets/Items/health.png");
    this.load.image("poison", "assets/Items/poison.png");

    this.load.image("warpGate", "assets/StateLV1/WarpGate.png");
    this.load.image("arrowLeft", "assets/StateLV1/arrowLeft.png");
    this.load.image("arrowRight", "assets/StateLV1/arrowRight.png");
    this.load.image("arrowUp", "assets/StateLV1/arrowUp.png");
    this.load.image("spacebar", "assets/StateLV1/spacebar.png");
    this.load.image("Z", "assets/StateLV1/Z.png");
    this.load.image("background", "assets/Background/bglevel1.png");

    this.load.text("level1", "levels/level1.json");
  }

  init(data: { playerName?: string }) {
    this.playerName = data.playerName ?? "Player";
  }

  create() {
    this.levelData = parseLevelData(this.cache.text.get("level1"));
    this.playerState = new PlayerState();
    this.facingRight = true;
    this.jumpKeyReleased = true;
    this.attackKeyReleased = true;
    this.isAttacking = false;
    this.exitGate = null;

    // Background (tiled)
    const bg1 = this.add.image(0, -30, "background").setOrigin(0, 0).setDepth(-10);
    this.add.image(bg1.width, -30, "background").setOrigin(0, 0).setDepth(-10);
    this.add.image(bg1.width * 2, -30, "background").setOrigin(0, 0).setDepth(-10);

    // Warp gates
    for (const gate of this.levelData.warpGates) {
      this.add.image(gate.x, gate.y, "warpGate").setDepth(-5);
      if (gate.kind === "exit") {
        this.exitGate = { x: gate.x, y: gate.y };
      }
    }

    // Hint graphics
    for (const hint of this.levelData.hints) {
      this.add.image(hint.x, hint.y, hint.image).setDepth(-5);
    }

    this.platforms = this.physics.add.staticGroup();

    for (const block of this.levelData.blocks) {
      this.platforms.create(block.x, block.y, block.tile);
    }

    this.player = this.physics.add.sprite(100, 300, "player");
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0);

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.attackKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

    this.fireballs = this.physics.add.group({ allowGravity: false });

    // Enemies
    this.enemies = this.physics.add.group({ allowGravity: false });
    for (const enemyData of this.levelData.enemies) {
      const texture = enemyData.patrol === "vertical" ? "enemyY" : "enemyR";
      const sprite = this.enemies.create(enemyData.x, enemyData.y, texture) as EnemySprite;
      sprite.enemyState = new EnemyState(
        enemyData.x,
        enemyData.y,
        enemyData.patrol,
        enemyData.boundStart,
        enemyData.boundEnd
      );
      (sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Player-enemy overlap (continuous damage)
    this.physics.add.overlap(this.player, this.enemies, (_player, enemy) => {
      const e = enemy as EnemySprite;
      if (!e.enemyState.alive) return;

      if (this.isAttacking) {
        const score = e.enemyState.kill();
        this.playerState.addScore(score);
        e.destroy();
      } else {
        this.playerState.takeDamage(ENEMY_CONTACT_DAMAGE);
      }
    });

    // Coins
    this.coins = this.physics.add.group({ allowGravity: false });
    for (const coinData of this.levelData.coins) {
      const sprite = this.coins.create(coinData.x, coinData.y, "donut") as CollectibleSprite;
      sprite.itemType = "donut";
      (sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Items
    this.items = this.physics.add.group({ allowGravity: false });
    for (const itemData of this.levelData.items) {
      const sprite = this.items.create(itemData.x, itemData.y, itemData.type) as CollectibleSprite;
      sprite.itemType = itemData.type;
      (sprite.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    // Player-coin overlap
    this.physics.add.overlap(this.player, this.coins, (_player, coin) => {
      const c = coin as CollectibleSprite;
      applyCollectibleEffect(c.itemType, this.playerState);
      c.destroy();
    });

    // Player-item overlap
    this.physics.add.overlap(this.player, this.items, (_player, item) => {
      const i = item as CollectibleSprite;
      applyCollectibleEffect(i.itemType, this.playerState);
      i.destroy();
    });

    // Fireball-enemy overlap
    this.physics.add.overlap(this.fireballs, this.enemies, (fireball, enemy) => {
      const e = enemy as EnemySprite;
      if (!e.enemyState.alive) return;
      const score = e.enemyState.kill();
      this.playerState.addScore(score);
      e.destroy();
      (fireball as Phaser.Physics.Arcade.Sprite).destroy();
    });

    this.cameras.main.startFollow(this.player, false, 1, 0);
    this.cameras.main.setDeadzone(100, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.levelData.worldWidth, GAME_HEIGHT);

    this.physics.world.setBounds(0, 0, this.levelData.worldWidth, GAME_HEIGHT + 200);

    // HUD
    const hudDepth = 100;

    this.nameText = this.add
      .text(16, 12, this.playerName, { fontSize: "18px", color: "#ffffff", fontStyle: "bold" })
      .setScrollFactor(0)
      .setDepth(hudDepth);

    this.scoreText = this.add
      .text(GAME_WIDTH - 16, 12, "Score: 0", { fontSize: "18px", color: "#ffffff", fontStyle: "bold", align: "right" })
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(hudDepth);

    // HP bar
    const hpBarX = 16;
    const hpBarY = 38;
    const hpBarWidth = 200;
    const hpBarHeight = 16;

    this.hpBarBg = this.add
      .rectangle(hpBarX, hpBarY, hpBarWidth, hpBarHeight, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(hudDepth);

    this.hpBarFill = this.add
      .rectangle(hpBarX, hpBarY, hpBarWidth, hpBarHeight, 0xff69b4)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(hudDepth);
  }

  update() {
    if (this.playerState.isDead) {
      this.scene.start("DeathScene", { score: this.playerState.score, playerName: this.playerName });
      return;
    }

    // Fall death
    if (this.player.y > GAME_HEIGHT + 50) {
      this.playerState.fallDeath();
      this.scene.start("DeathScene", { score: this.playerState.score, playerName: this.playerName });
      return;
    }

    // Win condition: reach exit warp gate
    if (this.exitGate) {
      const dx = Math.abs(this.player.x - this.exitGate.x);
      const dy = Math.abs(this.player.y - this.exitGate.y);
      if (dx < 40 && dy < 40) {
        this.scene.start("DeathScene", { score: this.playerState.score, playerName: this.playerName, won: true });
        return;
      }
    }

    // Movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-PLAYER_SPEED);
      if (this.facingRight) {
        this.player.setFlipX(true);
        this.facingRight = false;
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(PLAYER_SPEED);
      if (!this.facingRight) {
        this.player.setFlipX(false);
        this.facingRight = true;
      }
    } else {
      this.player.setVelocityX(0);
    }

    // Landing detection
    const onFloor = this.player.body!.blocked.down;
    if (onFloor) {
      this.playerState.land();
    }

    // Jump
    const jumpPressed = this.cursors.space.isDown || this.cursors.up.isDown;
    if (jumpPressed && this.jumpKeyReleased && this.playerState.canJump()) {
      this.playerState.jump();
      this.player.setVelocityY(PLAYER_JUMP_VELOCITY);
      this.jumpKeyReleased = false;
    }
    if (!jumpPressed) {
      this.jumpKeyReleased = true;
    }

    // Attack / fireball
    this.isAttacking = this.attackKey.isDown;
    if (this.attackKey.isDown && this.attackKeyReleased) {
      this.shootFireball();
      this.attackKeyReleased = false;
    }
    if (this.attackKey.isUp) {
      this.attackKeyReleased = true;
    }

    // Update enemy patrol
    for (const enemy of this.enemies.getChildren() as EnemySprite[]) {
      if (!enemy.active || !enemy.enemyState.alive) continue;
      const state = enemy.enemyState;
      if (state.patrol === "horizontal") {
        const vel = state.update(enemy.x);
        enemy.setVelocityX(vel);
        enemy.setTexture(vel > 0 ? "enemyR" : "enemyL");
      } else {
        const vel = state.update(enemy.y);
        enemy.setVelocityY(vel);
      }
    }

    // Despawn fireballs out of camera bounds
    const cam = this.cameras.main;
    for (const fb of this.fireballs.getChildren() as Phaser.Physics.Arcade.Sprite[]) {
      if (fb.active && (fb.x < cam.scrollX - 50 || fb.x > cam.scrollX + GAME_WIDTH + 50)) {
        fb.destroy();
      }
    }

    // Update HUD
    this.scoreText.setText(`Score: ${this.playerState.score}`);
    this.hpBarFill.width = (this.playerState.hp / 100) * 200;
  }

  private shootFireball() {
    const speed = this.facingRight ? FIREBALL_SPEED : -FIREBALL_SPEED;
    const offsetX = this.facingRight ? 30 : -30;
    const fb = this.fireballs.create(
      this.player.x + offsetX,
      this.player.y,
      "fireball"
    ) as Phaser.Physics.Arcade.Sprite;
    fb.setVelocityX(speed);
    if (!this.facingRight) {
      fb.setFlipX(true);
    }
  }
}
