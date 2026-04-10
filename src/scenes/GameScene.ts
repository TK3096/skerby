import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, PLAYER_SPEED, PLAYER_JUMP_VELOCITY, FIREBALL_SPEED } from "../config";
import { parseLevelData } from "../levels/levelLoader";
import { PlayerState } from "../entities/PlayerState";
import type { LevelData } from "../levels/types";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private facingRight = true;
  private levelData!: LevelData;
  private playerState!: PlayerState;
  private debugText!: Phaser.GameObjects.Text;
  private jumpKeyReleased = true;
  private attackKey!: Phaser.Input.Keyboard.Key;
  private fireballs!: Phaser.Physics.Arcade.Group;
  private attackKeyReleased = true;

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

    this.load.text("level1", "levels/level1.json");
  }

  create() {
    this.levelData = parseLevelData(this.cache.text.get("level1"));
    this.playerState = new PlayerState();

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

    this.fireballs = this.physics.add.group({
      allowGravity: false,
    });

    this.cameras.main.startFollow(this.player, false, 1, 0);
    this.cameras.main.setDeadzone(100, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, this.levelData.worldWidth, GAME_HEIGHT);

    this.physics.world.setBounds(0, 0, this.levelData.worldWidth, GAME_HEIGHT + 200);

    // Debug HUD (fixed to camera)
    this.debugText = this.add
      .text(10, 10, "", { fontSize: "16px", color: "#ffffff" })
      .setScrollFactor(0)
      .setDepth(100);
  }

  update() {
    if (this.playerState.isDead) return;

    // Fall death
    if (this.player.y > GAME_HEIGHT + 50) {
      this.playerState.fallDeath();
      return;
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

    // Jump (with key release check to prevent holding)
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
    if (this.attackKey.isDown && this.attackKeyReleased) {
      this.shootFireball();
      this.attackKeyReleased = false;
    }
    if (this.attackKey.isUp) {
      this.attackKeyReleased = true;
    }

    // Despawn fireballs out of camera bounds
    const cam = this.cameras.main;
    for (const fb of this.fireballs.getChildren() as Phaser.Physics.Arcade.Sprite[]) {
      if (fb.active && (fb.x < cam.scrollX - 50 || fb.x > cam.scrollX + GAME_WIDTH + 50)) {
        fb.destroy();
      }
    }

    // Debug HUD
    this.debugText.setText(`HP: ${this.playerState.hp} | Score: ${this.playerState.score}`);
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
