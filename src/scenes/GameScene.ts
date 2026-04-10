import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT, TILE_SIZE, PLAYER_SPEED, PLAYER_JUMP_VELOCITY } from "../config";

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private facingRight = true;

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
  }

  create() {
    this.platforms = this.physics.add.staticGroup();

    this.createTestLevel();

    this.player = this.physics.add.sprite(100, 300, "player");
    this.player.setCollideWorldBounds(false);
    this.player.setBounce(0);

    this.physics.add.collider(this.player, this.platforms);

    this.cursors = this.input.keyboard!.createCursorKeys();

    // Camera follows player horizontally
    this.cameras.main.startFollow(this.player, false, 1, 0);
    this.cameras.main.setDeadzone(100, GAME_HEIGHT);
    this.cameras.main.setBounds(0, 0, 3000, GAME_HEIGHT);

    this.physics.world.setBounds(0, 0, 3000, GAME_HEIGHT + 200);
  }

  update() {
    const onFloor = this.player.body!.blocked.down;

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

    if ((this.cursors.space.isDown || this.cursors.up.isDown) && onFloor) {
      this.player.setVelocityY(PLAYER_JUMP_VELOCITY);
    }
  }

  private createTestLevel() {
    const groundY = GAME_HEIGHT - TILE_SIZE;

    // Ground platform - a row of floor tiles
    for (let x = 0; x < 2000; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, groundY + TILE_SIZE / 2, "floorUp");
    }

    // Fill below ground
    for (let x = 0; x < 2000; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, groundY + TILE_SIZE + TILE_SIZE / 2, "floorInside");
    }

    // Elevated platform
    for (let x = 400; x < 700; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, 350 + TILE_SIZE / 2, "floorUp");
    }

    // Higher platform
    for (let x = 800; x < 1000; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, 250 + TILE_SIZE / 2, "floorUp");
    }

    // Gap in ground (stop ground at 2000, resume at 2200)
    for (let x = 2200; x < 3000; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, groundY + TILE_SIZE / 2, "floorUp");
    }
    for (let x = 2200; x < 3000; x += TILE_SIZE) {
      this.platforms.create(x + TILE_SIZE / 2, groundY + TILE_SIZE + TILE_SIZE / 2, "floorInside");
    }
  }
}
