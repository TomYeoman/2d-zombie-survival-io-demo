import CollisionSystem from '../common/CollisionSystem.js'
import drawHitscan from './graphics/drawHitscan.js'

const handleShot = (x, y, tx, ty, obstacles, renderer) => {
    let endX = tx
    let endY = ty

    obstacles.forEach(obstacle => {
        const hitObstacle = CollisionSystem.checkLinePolygon(
            x, y, tx, ty, 
            obstacle.collider.polygon
        )

        if (hitObstacle) {
            endX = hitObstacle.x
            endY = hitObstacle.y
        }
    })
    
    drawHitscan(renderer.middleground, x, y, endX, endY, 0xffffff)
}

export default handleShot