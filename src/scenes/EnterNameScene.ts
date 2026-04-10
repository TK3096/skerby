import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "../config";

export class EnterNameScene extends Phaser.Scene {
  private playerName = "";
  private nameDisplay!: Phaser.GameObjects.Text;

  constructor() {
    super("EnterNameScene");
  }

  preload() {
    this.load.image("enterNameBg", "assets/Background/EnterYourName.png");
  }

  create() {
    this.playerName = "";

    this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, "enterNameBg").setDisplaySize(GAME_WIDTH, GAME_HEIGHT);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 60, "Enter Your Name", {
        fontSize: "28px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.nameDisplay = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2, "", {
        fontSize: "32px",
        color: "#ffff00",
        backgroundColor: "#222222",
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 60, "Press ENTER to start", {
        fontSize: "18px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.input.keyboard!.on("keydown", (event: KeyboardEvent) => {
      if (event.key === "Enter" && this.playerName.length > 0) {
        this.scene.start("GameScene", { playerName: this.playerName });
      } else if (event.key === "Backspace") {
        this.playerName = this.playerName.slice(0, -1);
      } else if (event.key.length === 1 && this.playerName.length < 12) {
        this.playerName += event.key;
      }
      this.nameDisplay.setText(this.playerName);
    });
  }
}
