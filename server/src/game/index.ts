import { SCENE_NAMES } from "../../../common/types/types";
import LevelOne from "../scenes/level_one";

/**
 * Register the scene classes to the given game using the SCENE_NAME enum values.
 *
 * @param game
 */
function installScenes(game: Phaser.Game) {
  game.scene.add(SCENE_NAMES.LEVEL_ONE, LevelOne, true);
}

export { installScenes, SCENE_NAMES };
