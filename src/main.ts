import Phaser from "phaser";
import { GAME_WIDTH, GAME_HEIGHT } from "./config";
import { MenuScene } from "./scenes/MenuScene";
import { EnterNameScene } from "./scenes/EnterNameScene";
import { HowToPlayScene } from "./scenes/HowToPlayScene";
import { GameScene } from "./scenes/GameScene";
import { DeathScene } from "./scenes/DeathScene";
import { HighScoreScene } from "./scenes/HighScoreScene";

new Phaser.Game({
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { x: 0, y: 800 },
      debug: false,
    },
  },
  scene: [MenuScene, EnterNameScene, HowToPlayScene, GameScene, DeathScene, HighScoreScene],
});
