import Obstacle from '../common/entity/Obstacle.js'

// setup a few obstacles
export default (instance) => {

    const obstacles = new Map()

    const obsA = new Obstacle({ x: 150, y: 150, width: 250, height: 150 })
    instance.addEntity(obsA)
    obstacles.set(obsA.nid, obsA)

    const obsB = new Obstacle({ x: 450, y: 600, width: 60, height: 150 })
    instance.addEntity(obsB)
    obstacles.set(obsB.nid, obsB)

    return obstacles
}