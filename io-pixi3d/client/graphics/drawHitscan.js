import { Graphics } from 'pixi.js'

const drawHitscan = (layer, x, y, targetX, targetY, color) => {
    const graphics = new Graphics()
    graphics.lineStyle(1, color)
    graphics.moveTo(x, y)
    graphics.lineTo(targetX, targetY)
    layer.addChild(graphics)

    setTimeout(() => {
        layer.removeChild(graphics)
        graphics.destroy({
            children: true,
            texture: true,
            baseTexture: true
        })
    }, 64)
}

export default drawHitscan
