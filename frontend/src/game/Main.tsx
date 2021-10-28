import nengi from "nengi";
import { clientFPS, phaserGameConfig } from "../../../common/config/phaserConfig";
import { installScenes } from ".";
import {SCENE_NAMES} from "../../../common/types/types"
import nengiConfig from "../../../common/config/nengiConfig";
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import { store } from '../app/store';

export const newGame = () => {

    const gameConfig: Phaser.Types.Core.GameConfig = {
        ...phaserGameConfig,
        type: Phaser.AUTO,
        width: window.innerWidth,
        height: window.innerHeight,
        // fps: {
        //     target: clientFPS,
        //     forceSetTimeOut: true,
        // },
        parent: "game-here",
        // scene: MainScene,
    };

        // a very hackie trick to pass some custom data
    // but it work well :)
    const nengiClient = new nengi.Client(
        nengiConfig,
        100
    ) as ExtendedNengiTypes.Client;

    // gameConfig.callbacks = {
    //     preBoot: () => {
    //     return { nengiClient };
    //     }
    // };

    const phaserGame = new Phaser.Game(gameConfig);

    // Add scenes to our game for later (loading, menu, main, and settings)
    installScenes(phaserGame);

    phaserGame.scene.start(SCENE_NAMES.LEVEL_ONE, {nengiClient, storeRef: store})
    return phaserGame
};

const phaserGame = newGame()

const Main = () => {
    return <div id="game-here"></div>;
};

export {phaserGame}
export default Main;
