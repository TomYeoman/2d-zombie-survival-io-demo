import BulletEntity from "../../../common/entity/BulletEntity";
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import logger from "../util/logger"

export class Bullets extends Phaser.Physics.Arcade.Group {
    constructor(private nengiInstance: ExtendedNengiTypes.Instance, world: any, scene: any, config: any) {
      super(
        world,
        scene,
        Phaser.Utils.Objects.Merge(
          {
            classType: Bullet,
            createCallback: Bullets.prototype.onCreate
          },
          config
        )
      );

      console.assert(this.classType === Bullet);

    }

    fire(
        startX: number,
        startY: number,
        angle: number,
    ) {

      const bullet = this.getFirstDead(false);

      if (bullet) {

        logger.debug("Firing bullets")

        const bulletEntity = new BulletEntity(startX, startY, Phaser.Math.DegToRad(angle) +  1.57079633);
        this.nengiInstance.addEntity(bulletEntity);

          bullet.fire(
            bulletEntity.nid,
            startX,
            startY,
            angle,
        );
      }

    }

  onCreate(bullet: Bullet) {

    // logger.debug("Creating bullets")

      bullet.onCreate();
    }

    poolInfo() {
      return `${this.name} ${this.getLength()} (${this.countActive(
        true
      )}:${this.countActive(false)})`;
    }
}


export class Bullet extends Phaser.Physics.Arcade.Sprite {

    public worldLayer: Phaser.Tilemaps.StaticTilemapLayer
    public associatedEntityId: number
    public startX: number
    public startY: number
    public angle: number

    fire(
        associatedEntityId: number,
        startX: number,
        startY: number,
        angle: number,
    ) {

      this.associatedEntityId = associatedEntityId

      this.enableBody(true, startX, startY, true, true);

      this.setSize(10, 20)
      this.setDisplaySize(10, 20)

      const vec = this.scene.physics.velocityFromAngle(angle, 250);
      this.setVelocity(vec.x, vec.y);
      this.rotation = Phaser.Math.DegToRad(angle) + 1.57079633

    }

    onCreate() {
      this.disableBody(true, true);
      this.body.immovable = true
    }

    // onWorldBounds() {
    //   this.disableBody(true, true);
    // }
}

