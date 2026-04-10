import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class HowToPlayScene extends Phaser.Scene {
  private page = 1;
  private pageImage!: Phaser.GameObjects.Image;

  constructor() {
    super("HowToPlayScene");
  }

  preload() {
    this.load.image("howToPlay1", "assets/Background/HowToPlay.png");
    this.load.image("howToPlay2", "assets/Background/HowToPlayTwo.png");
  }

  create() {
    this.page = 1;

    this.pageImage = this.add
      .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "howToPlay1")
      .setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const buttonStyle = {
      fontSize: "20px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 16, y: 8 },
    };

    const backBtn = this.add
      .text(80, GAME_HEIGHT - 40, "Back", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const nextBtn = this.add
      .text(GAME_WIDTH - 80, GAME_HEIGHT - 40, "Next", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerdown", () => {
      if (this.page === 2) {
        this.page = 1;
        this.pageImage.setTexture("howToPlay1");
      } else {
        this.scene.start("MenuScene");
      }
    });

    nextBtn.on("pointerdown", () => {
      if (this.page === 1) {
        this.page = 2;
        this.pageImage.setTexture("howToPlay2");
      } else {
        this.scene.start("MenuScene");
      }
    });
  }
}
