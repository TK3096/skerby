import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  preload() {
    this.load.image("menuBg", "assets/Background/Interface.png");
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "menuBg").setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const buttonStyle = {
      fontSize: "24px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 20, y: 10 },
    };

    const playBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40, "Play", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const howToPlayBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 30, "How To Play", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const highScoreBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, "High Score", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playBtn.on("pointerdown", () => {
      this.scene.start("EnterNameScene");
    });

    howToPlayBtn.on("pointerdown", () => {
      this.scene.start("HowToPlayScene");
    });

    highScoreBtn.on("pointerdown", () => {
      this.scene.start("HighScoreScene");
    });
  }
}
