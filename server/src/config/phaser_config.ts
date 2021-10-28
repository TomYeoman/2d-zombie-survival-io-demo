require("@geckos.io/phaser-on-nodejs");
import Phaser from "phaser";

// @ts-ignore
import {phaserGameConfig, serverFPS} from "../../../common/config/phaserConfig";
global.phaserOnNodeFPS = serverFPS; // default is 60

// prepare the config for Phaser
const config = {
  ...phaserGameConfig,
  type: Phaser.HEADLESS,
  audio: false,
  fps: {
    target: serverFPS,
    forceSetTimeOut: true,
  }
};

export default config;