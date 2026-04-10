import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class DeathScene extends Phaser.Scene {
  constructor() {
    super("DeathScene");
  }

  preload() {
    this.load.image("deathBg", "assets/Background/YouDie.png");
  }

  create(data: { score?: number; playerName?: string; won?: boolean }) {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "deathBg").setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    const score = data.score ?? 0;
    const name = data.playerName ?? "Player";

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 80, data.won ? "Stage Clear!" : "You Died!", {
        fontSize: "36px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 30, `${name} - Score: ${score}`, {
        fontSize: "24px",
        color: "#ffff00",
      })
      .setOrigin(0.5);

    const buttonStyle = {
      fontSize: "22px",
      color: "#ffffff",
      backgroundColor: "#333333",
      padding: { x: 20, y: 10 },
    };

    const playAgainBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 40, "Play Again", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const menuBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 100, "Main Menu", buttonStyle)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    playAgainBtn.on("pointerdown", () => {
      this.scene.start("EnterNameScene");
    });

    menuBtn.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
