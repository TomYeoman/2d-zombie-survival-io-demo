export default class BotGraphicClient extends Phaser.GameObjects.Sprite  {

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
    ) {
        super(scene, x, y, "zombie")
        this.setDisplaySize(50,50)

    }
}
