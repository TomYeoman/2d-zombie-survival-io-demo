import EasyStar from "easystarjs";
import BotEntity from "../../../common/entity/BotEntity";
import PlayerEntity from "../../../common/entity/PlayerEntity";
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import {PlayerSystem} from "../systems/PlayerSystem";
import logger from "../util/logger"

type deathCallback = (killerEntityId: number, botEntityId: number) => {}

export class Bots extends Phaser.Physics.Arcade.Group {
    constructor(
        private nengiInstance: ExtendedNengiTypes.Instance,
        private deathCallback: deathCallback,
        world: any,
        scene: any,
        config: any
    ) {

        super(
            world,
            scene,
            Phaser.Utils.Objects.Merge(
                {
                    classType: Bot,
                    createCallback: Bots.prototype.onCreate
                },
                config
            )
        );

        console.assert(this.classType === Bots);
    }

    spawnBot(
        startX: number,
        startY: number,
        playerSystem: PlayerSystem,
        finder: EasyStar.js
    ) {

        const bot = this.getFirstDead(false);

        if (bot) {

            // logger.debug("Spawning bot as there's space")

            const entityBot = new BotEntity(startX, startY);
            this.nengiInstance.addEntity(entityBot);

            bot.spawnBot(
                entityBot.nid,
                startX,
                startY,
                playerSystem,
                finder
            );
        } else {
            logger.debug("No zombie dead in pool, unable to spawn")
        }

    }

    onCreate(
        bot: Bot
    ) {
        // logger.debug("Creating bot")
        bot.onCreate(
            this.deathCallback
        );
    }

    poolInfo() {
        return `${this.name} ${this.getLength()} (${this.countActive(
            true
        )}:${this.countActive(false)})`;
    }
}


export class Bot extends Phaser.Physics.Arcade.Sprite {
    speed: number
    associatedEntityId: number
    playerType = ""
    finder: EasyStar.js
    name: string
    type: string
    health = 100
    onDeathCallback: deathCallback
    playerSystem: PlayerSystem
    targetEntity: PlayerEntity

    spawnBot(
        associatedEntityId: number,
        startX: number,
        startY: number,
        playerSystem: PlayerSystem,
        finder: EasyStar.js
    ) {

        this.enableBody(true, startX, startY, true, true);
        this.associatedEntityId = associatedEntityId
        this.playerSystem = playerSystem

        this.setSize(50, 50);
        this.setDisplaySize(50, 50);
        // this.setCircle(15)
        this.speed = randomIntFromInterval(100, 100);
        this.type = "BOT";
        // this.body.bounce.set(0.2, 0.2);
        // this.body.setMass(0.1);

        function randomIntFromInterval(min: number, max: number) { // min and max included
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        this.finder = finder;
        this.speed = randomIntFromInterval(100, 100);
    }

    onCreate(
        deathCallback: deathCallback
    ) {
        this.disableBody(true, true);
        // this.body.immovable = true
        this.onDeathCallback = deathCallback

        this.setBounce(1)
    }

    public moveBot(nextPath: { x: number; y: number }) {

        // this.setVelocityX(0)
        // this.setVelocityX(0)

        const nextPathTileX = nextPath.x;
        const nextPathTileY = nextPath.y;
        const currBotTileX = Math.floor(this.x / 32);
        const currBotTileY = Math.floor(this.y / 32);

        // logger.debug(`Recieved path of X${nextPathTileX}, Y: ${nextPathTileX}, SpriteX: ${currBotTileX}, SpriteY: ${currBotTileY}`)
        if (nextPathTileX > currBotTileX) {
            this.setVelocityX(this.speed);
        }

        if (nextPathTileX < currBotTileX) {
            this.setVelocityX(-this.speed);
        }

        if (nextPathTileY > currBotTileY) {
            this.setVelocityY(this.speed);
        }

        if (nextPathTileY < currBotTileY) {
            this.setVelocityY(-this.speed);
        }
    }

    preUpdate() {

        // This is expensive - we shouldn't do this for every tick...
        if (!this.targetEntity) {
            // Find the nearest player
            let targetEntity = this.playerSystem.getClosestAliveClient(this.x, this.y)
            if (!targetEntity) {
                // logger.debug("Unable to find the closest player to bot")
            } else {
                this.targetEntity = targetEntity
            }
        } else {

            // Chance of finding a new closer target
            if (Math.random() < 0.1) {

            } else[
                // But most the time - just get the updated location of original target
                this.targetEntity = this.playerSystem.getEntityDetail(this.targetEntity.nid)
            ]
        }

        if (this.targetEntity) {
            this.moveToPlayer(this.targetEntity.x, this.targetEntity.y)
        } else {
            // logger.debug("Not moving to any player for this tick - as there is no target entity")
        }

    }

    public moveToPlayer(targetX: number, targetY: number) {

        const txcopy = targetX;
        const tycopy = targetY;
        const targetXDistance = Math.abs(txcopy - this.x);
        const targetYDistance = Math.abs(tycopy - this.y);

        // logger.debug(`Target X ${targetXDistance}, Target Y ${targetYDistance}`);
        // Turn off path finding when close enough
        if (targetXDistance < 100 && targetYDistance < 100) {

            // logger.debug("Zombie switching to brute find");
            if (targetX > this.x) {

                this.setVelocityX(this.speed);
            } else {

                this.setVelocityX(-this.speed);
            }

            if (targetY > this.y) {
                this.setVelocityY(this.speed);
            } else {
                this.setVelocityY(-this.speed);
            }

        } else {

            // 10% chance of actually re-calculating path per frame
            if (Math.random() < 0.2) {
                const fromX = Math.floor(this.x / 32);
                const fromY = Math.floor(this.y / 32);

                // logger.debug(`Bot ${index} Pathing to player at ${clientID} at X:${toX}, Y: ${toY}`)

                try {
                    this.finder.findPath(fromX, fromY, Math.floor(targetX / 32), Math.floor(targetY / 32), (path: any) => {
                        if (path === null) {
                            console.warn("Path was not found.");
                        } else {
                            // logger.debug(`Moving to X:${path[0].x}, Y:${path[0].y + 32}`)
                            if (path.length) {
                                // logger.debug(path)
                                this.moveBot(path[1]);
                            }

                        }
                    });

                    this.finder.calculate();
                } catch (e) {
                    // logger.debug(e)
                }

            }

        }

        this.rotation = Math.atan2(targetY - this.y, targetX - this.x);


    }


    public takeDamage(damagerEntityId: number) {
        this.health -= 25;


        // TODO create correct event system soon?
        if (this.health <= 0) {
            logger.debug("Bot killed")
            // return this.deathCallback(damagerEntityId, this.associatedEntityId);
            this.onDeathCallback(damagerEntityId, this.associatedEntityId)
            this.disableBody(true, true);
        }

        logger.debug(`bot ${this.name} new health ${this.health}`);

        // TODO clear movement timer?
    }

    public processDeath(damagerEntityId: number) {
        this.health -= 200;


        // TODO create correct event system soon?
        if (this.health <= 0) {
            logger.debug("Bot killed")
            // return this.deathCallback(damagerEntityId, this.associatedEntityId);
            this.disableBody(true, true);
        }

        logger.debug(`bot ${this.name} new health ${this.health}`);

        // TODO clear movement timer?
    }

}


