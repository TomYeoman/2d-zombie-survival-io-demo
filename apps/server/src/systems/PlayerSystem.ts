import PlayerGraphicServer from "../graphics/PlayerGraphicServer";
import { ExtendedNengiTypes } from "@io/common/types/custom-nengi-types";
import PlayerEntity from "@io/common/entity/PlayerEntity";
import Identity from "@io/common/message/Identity";
import { BotSystem } from "./BotSystem";
import logger from "../util/logger"


export class PlayerSystem {
    playerGraphics: Map<number, PlayerGraphicServer> = new Map()

    public botSystem: BotSystem

    // spawns = []
    constructor(
        private scene: Phaser.Scene,
        private map: Phaser.Tilemaps.Tilemap,
        private worldLayer: Phaser.Tilemaps.StaticTilemapLayer,
        private nengiInstance: ExtendedNengiTypes.Instance,
    ) {


    }

    respawnDeadPlayers() {
        this.nengiInstance.clients.forEach((client: ExtendedNengiTypes.Client) => {
            if (!client.isAlive) {
                this.createPlayer(client)
            }
        })
    }

    reviveAllDeadPlayers() {
        this.nengiInstance.clients.forEach((client:  ExtendedNengiTypes.Client) => {
            if (!client.isAlive) {
                this.createPlayer(client)
            }
        })

        // Give bonus points to survivers?
    }

    // Spawn individual client
    createPlayer(client: ExtendedNengiTypes.Client) {
        // Re-create the new player entity
        const spawnPoint: any = this.map.findObject("Objects", (obj: any) => obj.name === "human_spawn_point");

        const entitySelf = new PlayerEntity(spawnPoint.x, spawnPoint.y);
        this.nengiInstance.addEntity(entitySelf);

        // Create a new phaser bot and link to entity, we'll apply physics to for each path check
        const playerGraphic = new PlayerGraphicServer(this.scene, this.worldLayer, this.nengiInstance, client, entitySelf.x, entitySelf.y, entitySelf.nid, this.deathCallback, this.botSystem);
        this.playerGraphics.set(entitySelf.nid, playerGraphic);

        // Tell the client about the new entity ID they now control for this level
        this.nengiInstance.message(new Identity(entitySelf.nid), client);

        // Update self, to be new version in level
        entitySelf.client = client;
        client.entitySelf = entitySelf;
        client.entityPhaser = playerGraphic;
        client.isAlive = true

        // define the view (the area of the game visible to this client, all else is culled)
        client.view = {
            x: entitySelf.x,
            y: entitySelf.y,
            halfWidth: 99999,
            halfHeight: 99999
        };
    }

    deletePlayer(client: ExtendedNengiTypes.Client) {

        if (client.entitySelf && client.entityPhaser) {
            logger.debug(`Player ${client.entitySelf.nid} disconnected from level-one, clearing down entities`);
            this.nengiInstance.removeEntity(client.entitySelf);

            // Delete server copy
            const player = this.playerGraphics.get(client.entityPhaser.associatedEntityId);
            player.destroy();
            this.playerGraphics.delete(client.entityPhaser.associatedEntityId);

            // Delete client information
            client.entitySelf = null
            client.entityPhaser = null
            client.isAlive = false

            // Disasocciate the client from the entity
            this.nengiInstance.message(new Identity(-1), client);


        } else {
            logger.warn("Player disconnected from level one, but was unable to find either the entity, or the entity phaser");
        }
    }

    getPlayerGraphic(client: ExtendedNengiTypes.Client) {
        if (client.entitySelf && client.entityPhaser) {
            return this.playerGraphics.get(client.entityPhaser.associatedEntityId);
        } else {
            logger.warn("Unable to find a player graphic - they have likely already died");
            return false
        }
    }

    deathCallback = (playerEntityId: number, damagerEntityId: number): any => {

        let killedPlayer = false;
        this.nengiInstance.clients.forEach((client) => {
            // Ignore dead players
            if (client.entitySelf && client.entitySelf.nid === playerEntityId ) {
                logger.debug("Killed player ", +playerEntityId)
                this.deletePlayer(client)
                killedPlayer = true
            }
        })

        if (killedPlayer) {
            logger.debug("Killed player ", +playerEntityId)

            return true
        } else {}
        console.warn("Unable to find player to kill ", +playerEntityId)

        return false
    }

    getTotalAlivePlayerCount = (): any => {
        let totalAlive = 0
        this.nengiInstance.clients.forEach((client) => {
            if (client.isAlive) {
                totalAlive++
            }
        })
        return totalAlive
    }

    getTotalDeadPlayerCount = ():any => {
        let totalDead = 0
        this.nengiInstance.clients.forEach((client) => {
            if (!client.isAlive) {
                totalDead++
            }
        })
        return totalDead
    }

    getTotalPlayerCount = ():any => {
        let total = 25
        this.nengiInstance.clients.forEach((client) => {
            if (!client.isAlive) {
                total++
            }
        })
        return total
    }

    getClosestAliveClient = (posX: number, posY: number)  => {

        let currClosestDistance = +Infinity
        let currClosestClient = undefined as ExtendedNengiTypes.Client

        this.nengiInstance.clients.forEach((client) => {
            if (client.entitySelf && client.isAlive ) {
                let entity = client.entitySelf
                let diffX = Math.abs(posX - entity.x)
                let diffY = Math.abs(posY - entity.y)

                // logger.debug({diffX, diffY, currClosestDistance})
                if (diffX + diffY < currClosestDistance) {
                    currClosestClient = client
                }
            }
        })

        if (currClosestClient) {
            // logger.debug("Found a matching client")
            return currClosestClient.entitySelf
        } else {
            // logger.debug("Unable to find a closest client")
            return null
        }
    }

    getEntityDetail = (entityNumber: number) => {
        // TODO return a COPY
        return this.nengiInstance.getEntity(entityNumber)
    }

    movePlayer(command:any, client: ExtendedNengiTypes.Client) {
        if (client.entitySelf && client.entityPhaser) {

            const clientEntityPhaser = client.entityPhaser;
            const clientEntitySelf = client.entitySelf;

            // Process move on phaser, and sync with entity
            clientEntityPhaser.processMove(command);
            clientEntitySelf.x = clientEntityPhaser.x;
            clientEntitySelf.y = clientEntityPhaser.y;
            clientEntitySelf.rotation = clientEntityPhaser.rotation;
            clientEntityPhaser.weaponSystem.update(command.delta)

            // Update player views
            this.nengiInstance.clients.forEach((client: ExtendedNengiTypes.Client, index) => {
                client.view.x = clientEntityPhaser.x;
                client.view.y = clientEntityPhaser.y;
            });
        } else {
            logger.debug("level one - Trying to process commands on a player entity, which doesn't exist");
        }
    }
}