import * as PIXI from 'pixi.js'

class ObstacleGraphics extends PIXI.Container {
    constructor(state) {
        super()
        this.nid = state.nid
        this.x = state.x
        this.y = state.y
        this.width = state.width
        this.height = state.height

        this.body = new PIXI.Graphics()
        this.body.beginFill(0xffffff)
        this.body.drawRect(0, 0, state.width, state.height)
        this.body.endFill()
        this.body.tint = 0xff0000
        this.addChild(this.body)
    }

    update(delta) {

    }
}

export default ObstacleGraphics