import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";
import { ScoreManager } from "../systems/ScoreManager";

export class HighScoreScene extends Phaser.Scene {
  constructor() {
    super("HighScoreScene");
  }

  preload() {
    this.load.image("highScoreBg", "assets/Background/HighScore.png");
  }

  create() {
    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "highScoreBg").setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add
      .text(GAME_WIDTH / 2, 60, "High Scores", {
        fontSize: "32px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const scoreManager = new ScoreManager();
    const scores = scoreManager.getTopScores();

    if (scores.length === 0) {
      this.add
        .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "No scores yet", {
          fontSize: "20px",
          color: "#aaaaaa",
        })
        .setOrigin(0.5);
    } else {
      scores.forEach((entry, index) => {
        this.add
          .text(GAME_WIDTH / 2, 120 + index * 50, `${index + 1}. ${entry.name} - ${entry.score}`, {
            fontSize: "22px",
            color: "#ffffff",
          })
          .setOrigin(0.5);
      });
    }

    const backBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 60, "Back", {
        fontSize: "22px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 20, y: 10 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
