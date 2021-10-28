import PlayerGraphicServer from "../graphics/PlayerGraphicServer";
import {config} from "../config/zombie_config";
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import NetLog from "../../../common/message/NetLog";
import EasyStar from "easystarjs";
import {Bots, Bot}  from "../graphics/BotGraphicServer";
import { PlayerSystem } from "./PlayerSystem";
import logger from "../util/logger"

export enum GAME_STATE {
    ENDED = "ended",
    WARMUP = "warmup",
    INTERMISSION = "intermission",
    RUNNING = "intermission",
}
export class BotSystem {

    currentWave = 1
    waveSize = 0
    spawnedInWave = 0
    zombiesKilled = 0

    waveType = "normal"
    gameState = GAME_STATE.ENDED
    currentDifficulty = 0

    spawnRate = config.zombies.spawnRate
    maxCount = config.zombies.maxCount
    finder: any;

    hudUpdateTimer: NodeJS.Timer
	private botGraphicGroup?: Phaser.GameObjects.Group
    bots: Bots

    // spawns = []
    constructor(
        private scene: Phaser.Scene,
        private map: Phaser.Tilemaps.Tilemap,
        private worldLayer: Phaser.Tilemaps.StaticTilemapLayer,
        private tileset: Phaser.Tilemaps.Tileset,

        private nengiInstance: ExtendedNengiTypes.Instance,
        private playerSystem:  PlayerSystem
    ) {

        logger.debug("Calling botsystem constructor")

        this.bots = this.scene.add.existing(
            new Bots(this.nengiInstance, this.onBotDeath, this.scene.physics.world, this.scene, { name: "bots" })
        ) as unknown as Bots;

        this.bots.createMultiple({
            key: "zombie",
            quantity: 1000,
            active: false,
            visible: false
          });

        this.scene.physics.add.collider(this.bots, this.worldLayer, (bot: Bot, enemy: any) => {
            // logger.debug("zombie hit another zombie")
            // bot.disableBody(true, true);
            // this.deleteBullet(bullet.associatedEntityId)
        });


        this.scene.physics.add.collider(this.bots, this.bots, (bot: Bot, enemy: any) => {
            // logger.debug("zombie hit another zombie")
            bot.setBounce(1)

            // bot.disableBody(true, true);
            // this.deleteBullet(bullet.associatedEntityId)
        });

        // this.scene.physics.add.collider(this.bots, this.bots, (b1: Bot, b2: Bot) => {
        //     // logger.debug("zombie hit a world layer object")
        //     // bot.disableBody(true, true);
        //     // this.deleteBullet(bullet.associatedEntityId)
        // });

    }

    beginGame = async () => {

        this.initialisePathing();

        switch (this.currentWave) {
            // TODO Add cool logic in future
            case 1: {
                this.waveType = "normal";
            }
            default: {
                this.waveType = "normal";
            }
        }

        // start the countdown
        await this.waveCountdown(GAME_STATE.WARMUP);

        this.startRegularWave();

    }

    private startRegularWave = async() => {

        this.playerSystem.respawnDeadPlayers()
        this.gameState = GAME_STATE.RUNNING;
        this.waveSize = this.getWaveSize(this.currentWave, this.waveType);

        // Spawn zombies according to config
        var zombieSpawnTimer = this.scene.time.addEvent({
            delay: config.zombies.spawnRate * 1000,
            callback: () => {

                // Round isn't over
                if (this.zombiesKilled + this.bots.countActive() < this.waveSize) {
                    // There's less bots that the max allowed
                    if (this.bots.countActive() < this.maxCount) {
                        // logger.debug("Trying to spawn zombie")
                        this.trySpawnZombie("normal", "spawn" );
                    }
                }
            },
            loop: true
        });

    }

    private trySpawnZombie = (zomType: string, spawnType: string) => {
        const spawnName = this.getSpawn()
        const spawnPoint: any = this.map.findObject("Objects", (obj: any) => obj.name === spawnName);

        this.bots.spawnBot(spawnPoint.x, spawnPoint.y, this.playerSystem, this.finder)
    }

    private initialisePathing = () => {

        logger.debug("Setting up pathfinding for level one");
        try {

            // SETUP PATHFINDING
            this.finder = new EasyStar.js();
            // this.finder.enableDiagonals();
            this.finder.enableCornerCutting();

            const getTileID = (x: number, y: number) => {
                // logger.debug(`${x}, ${y}`);
                const tile = this.map.getTileAt(x, y);
                return tile.index;
            };

            const grid = [];
            for (let y = 0; y < this.map.height; y++) {
                const col = [];
                for (let x = 0; x < this.map.width; x++) {
                    // In each cell we store the ID of the tile, which corresponds
                    // to its index in the tileset of the map (`ID" field in Tiled)`
                    col.push(getTileID(x, y));
                }
                grid.push(col);
            }

            this.finder.setGrid(grid);
            // this.finder.setIterati.onsPerCalculation(1000);

            const tilepaths = this.map.tilesets[0];
            const properties: any = this.tileset.tileProperties;

            const acceptableTiles = [];

            for (let i = tilepaths.firstgid - 1; i < this.tileset.total; i++) { // firstgid and total are fields from Tiled that indicate the range of IDs that the tiles can take in that tileset
                // acceptableTiles.push(i + 1);

                if (!properties.hasOwnProperty(i)) {
                    // If there is no property indicated at all, it means it's a walkable tile
                    acceptableTiles.push(i+1);
                    continue;
                }

                // logger.debug(properties[i]);
                if(!properties[i].collides) acceptableTiles.push(i+1);
                // if(properties[i].cost) Game.finder.setTileCost(i+1, properties[i].cost); // If there is a cost attached to the tile, let's register it
            }

            this.finder.setAcceptableTiles(acceptableTiles);
        } catch (e) {
            logger.debug(e);
        }
    }

    private getSpawn() {

        const possibleSpawns = ["zombie_spawn_1", "zombie_spawn_2"];
        let chosenSpawn = "zombie_spawn_1";
        // 70% chance to pick priority spawn, otherwise just pick any other random
        if (Math.random() * 100 < 70) {
            chosenSpawn = possibleSpawns[0];
        } else {
            chosenSpawn= possibleSpawns[1];
        }

        // logger.debug(`Using spawn ${chosenSpawn}`);
        return chosenSpawn;

        // if (prioritySpawn) {
        //     // Spawn from priority point
        // }

        // // Else choose random
    }

    // TODO every so often we'll set a "priority spawn" to create hordes
    private rotatePrioritySpawn() {
        const possibleSpawns = ["zombie_spawn_1", "zombie_spawn_2"];
    }

    private getWaveSize(currentWave: number, waveType: string) {

        // return 1
        return (config.zombies.initialAmount + this.playerSystem.getTotalPlayerCount()) *
            ((this.currentWave * config.zombies.perWave) + config.zombies.perPlayer);

            // 1 = (10 + 10) * ((1 * 5) + 5) = 200
            // 2 = (10 + 10) * ((2 * 5) + 5) = 200
            // 3 = (10 + 10) * ((3 * 5) + 5) = 200

    }

    private async waveCountdown(breakType: GAME_STATE) {
        this.gameState = breakType
        return new Promise((resolve, reject) => {
            // TODO add fancy countdown
            switch (this.waveType) {
                case "normal": {

                }

                default: {}
            }

            // Just send log and start game a few seconds after for now
            this.nengiInstance.clients.forEach(client => {
                this.nengiInstance.message(new NetLog(`Starting wave in ${config.zombies.timeoutBetweenWave} seconds`), client);
            });

            logger.debug("Starting wave countdown");

            setTimeout(() => {
                logger.debug("Starting wave now");
                resolve("");
                this.gameState = GAME_STATE.RUNNING
            }, config.zombies.timeoutBetweenWave * 1000);

        });

    }

    onBotDeath = (killerEntityId: number, botEntityId: number): any => {
        // logger.debug(`Bot ${botEntityId} was killed by ${killerEntityId} , removing from level`);
        // Remove nengi entity
        const botEntity = this.nengiInstance.getEntity(botEntityId);
        this.nengiInstance.removeEntity(botEntity);

        this.zombiesKilled++

        if (this.zombiesKilled == this.waveSize) {
            this.endRound()
        }
    }

    endRound = async() => {

        // Clear down all wave based times
        this.spawnedInWave = 0;
        this.zombiesKilled = 0
        this.waveSize = 0;

        if (this.currentWave === config.zombies.maxRounds) {
            // Todo implement
        }

        // Run intermission
        await this.waveCountdown(GAME_STATE.INTERMISSION);

        // Setup ready for next game
        // clearTimeout(this.hudUpdateTimer)
        this.currentWave++

        this.startRegularWave()
    }

    // Emit a message every X time, containing information on the current game state
    // survivorsHUD() {

    // }

    // updateWaveHud(killed:number, total: number) {
    //     return level.waveHUD_Killed + "/" +  level.waveHUD_Total, "ui_waveprogress", level.waveHUD_Killed / level.waveHUD_Total)
    // }


    updateBots = () => {

        this.bots.getChildren().forEach((bot: Bot) => {

            if (bot.active) {
                // logger.debug(`Updating position for ${bullet.associatedEntityId}`)

                const associatedEntity = this.nengiInstance.getEntity(bot.associatedEntityId);

                if (!associatedEntity) {
                    // logger.debug("Trying to update positions of a bot entity, but cannot find an entity");
                    return;
                }

                associatedEntity.x = bot.x;
                associatedEntity.y = bot.y;
                associatedEntity.rotation = bot.rotation;
            }

        })
    }

}