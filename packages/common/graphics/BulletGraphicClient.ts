export default class BulletGraphicClient extends Phaser.GameObjects.Sprite  {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, "bullet")
        this.setDisplaySize(10, 20)
    }
}
