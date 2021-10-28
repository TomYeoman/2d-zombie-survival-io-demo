// Communicate with other systems, and create a single message message to repesent all state
// can optimise by sending different messages, with different intervals in future.

import HudUpdateMessage from "../../../common/message/HudUpdateMessage";

import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import logger from "../util/logger"
import { BotSystem } from "./BotSystem";
import { PlayerSystem } from "./PlayerSystem";

export class HudSystem {
    constructor(
        private scene: Phaser.Scene,
        private nengiInstance: ExtendedNengiTypes.Instance,
        private playerSystem: PlayerSystem,
        private botSystem: BotSystem
    ) {

        this.scene.time.addEvent({
            delay: 500,                // ms
            callback: () => { this.sendWaveHudUpdateMessage();},
            loop: true
        });
    }

    private sendWaveHudUpdateMessage() {
        this.nengiInstance.clients.forEach(client => {

            const player = this.playerSystem.getPlayerGraphic(client)

            // Only send to alive clients
            this.nengiInstance.message(new HudUpdateMessage(
                player ? player.health : 0,
                "~",
                "Shredder",
                this.botSystem.currentWave,
                this.botSystem.waveSize,
                this.botSystem.waveSize - this.botSystem.zombiesKilled,
                this.botSystem.zombiesKilled,
                this.botSystem.bots.countActive(),
                this.playerSystem.getTotalAlivePlayerCount(),
                this.playerSystem.getTotalPlayerCount(),
                this.botSystem.gameState
            ), client);
        });
    }
}