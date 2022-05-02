import WeaponSystem from "@io/common/modules/WeaponSystem";
import { ExtendedNengiTypes } from "@io/common/types/custom-nengi-types";
import Phaser from "phaser";
import { Bullet, Bullets } from "./BulletsGraphicServer";
import { BotSystem } from "../systems/BotSystem";
import { Bot } from "./BotGraphicServer";
import logger from "../util/logger"

type deathCallback = (playerEntityId: number, damagerEntityId: number) => {}

export default class PlayerGraphicServer extends Phaser.Physics.Arcade.Sprite{

    weaponSystem: WeaponSystem
    rotation = 0
    speed: number
    health = 100
    totalBullets = 0

    bullets: Bullets

    constructor(
        scene: Phaser.Scene,
        private worldLayer: Phaser.Tilemaps.StaticTilemapLayer,
        private nengiInstance: ExtendedNengiTypes.Instance,
        private client: ExtendedNengiTypes.Client,
        xStart: number,
        yStart: number,
        public associatedEntityId: number,
        private deathCallback: deathCallback,
        private botSystem?: BotSystem,
    ) {

        super(scene, xStart, yStart, "player");

        this.bullets = this.scene.add.existing(
            new Bullets(this.nengiInstance, this.scene.physics.world, this.scene, { name: "bullets" })
        ) as unknown as Bullets;

        this.bullets.createMultiple({
            key: "bullet",
            quantity: 500,
            active: false,
            visible: false,
          });

        this.scene.physics.add.collider(this.bullets, this.worldLayer, (bullet: Bullet, enemy: Bullet) => {
            logger.debug("bullet hit a world layer object")
            this.deleteBullet(bullet.associatedEntityId)
            bullet.disableBody(true, true);
        });

        if (this.botSystem) {
              this.scene.physics.add.overlap(this.bullets, this.botSystem.bots, (bullet: Bullet, zombie: Bot) => {
                logger.debug("bullet hit a zombie")
                this.deleteBullet(bullet.associatedEntityId)
                bullet.disableBody(true, true);

                zombie.takeDamage(bullet.associatedEntityId);

              });

              this.scene.physics.add.overlap(this, this.botSystem.bots, (player: PlayerGraphicServer, zombie: Bot) => {
                // logger.debug("zombie hit a player")

                player.takeDamage(zombie.associatedEntityId)

            });

        }

        this.speed = 1000;

        this.weaponSystem = new WeaponSystem();
        this.associatedEntityId = associatedEntityId;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setSize(50,50)
        this.setDisplaySize(50, 50)

        logger.debug("Setting up collision with world");
        scene.physics.add.collider(this, worldLayer);
        this.body.immovable = true

    }

    fire() {
        if (this.weaponSystem.fire()) {
            this.bullets.fire(this.x, this.y, Phaser.Math.RadToDeg(this.rotation));
        }
    }

    deleteBullet = (entityId: number) => {

        // logger.debug(`Deleting bullet with ID ${entityId}`)

        const bulletEntity = this.nengiInstance.getEntity(entityId);

        if (!bulletEntity) {
            // logger.debug("Trying to delete a bullet which doesn't exist any longer (may have already been cleared after collission)");
            return;
        }

        this.nengiInstance.removeEntity(bulletEntity);
    }


    processMove = (command: any) => {

        this.rotation = command.rotation;

        const speed = this.speed * command.delta * 30;
        // const prevVelocity = this.body.velocity.clone();

        // Stop any previous movement from the last frame
        this.setVelocity(0);

        // Horizontal movement
        if (command.left) {
            this.setVelocityX(-speed);
        } else if (command.right) {
            this.setVelocityX(speed);
        }

        // Vertical movement
        if (command.forward) {
            this.setVelocityY(-speed);
        }
        if (command.backward) {
            this.setVelocityY(speed);
        }

        // Normalize and scale the velocity so that player can't move faster along a diagonal
        // this.body.velocity.normalize().scale(speed);
    }

    // Update the entity, with the local positions of all bullets this player has
    preUpdate() {

        // logger.debug(this.bullets.poolInfo())

        this.bullets.getChildren().forEach((bullet: any) => {

            if (bullet.active) {
                // logger.debug(`Updating position for ${bullet.associatedEntityId}`)

                const associatedEntity = this.nengiInstance.getEntity(bullet.associatedEntityId);

                if (!associatedEntity) {
                    // logger.debug("Trying to update positions of bullet graphic, but cannot find an entity");
                    return;
                }

                associatedEntity.x = bullet.x;
                associatedEntity.y = bullet.y;
                associatedEntity.rotation = bullet.rotation;
            }

        })

    }


    private takeDamage = (damagerEntityId: number) => {
        this.health -= 0.1;

        // TODO create correct event system soon?
        if (this.health <= 0) {
            logger.debug("Human killed :(")
            return this.deathCallback(this.associatedEntityId, damagerEntityId);
        }
    }
}
