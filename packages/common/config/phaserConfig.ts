import Phaser from "phaser";

// The following need to be defined in client / server
// - Scene
// - Parent
// - type
// _ FPS


// TODO - There's a bug here, where we recieve identity AFTER our entities
// and bug out if doing so, when we drop this FPS to 5 - we should fix this ASAP
export const serverFPS = 60
export const clientFPS = 60
export const phaserGameConfig: Phaser.Types.Core.GameConfig = {
    title: "Game",

    width: 1200,
    height: 800,
    physics: {
      default: "arcade",
      arcade: {
        // debug: true,
        gravity: { y: 0 } // Top down game, so no gravity
      },
    },
  };


