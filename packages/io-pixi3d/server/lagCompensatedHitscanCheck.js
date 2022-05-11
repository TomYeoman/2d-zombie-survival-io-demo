import CollisionSystem from '../common/CollisionSystem'

const lagCompensatedHitscanCheck = (instance, x1, y1, x2, y2, timeAgo) => {
    const hits = []

    const area = {
        x: ((x1 + x2) / 2) - 30,
        y: ((y1 + y2) / 2) - 30,
        halfWidth: Math.abs(x2 - x1) + 30,
        halfHeight: Math.abs(y2 - y1) + 30
    }

    const compensatedEntityPositions = instance.historian.getLagCompensatedArea(timeAgo, area)
    compensatedEntityPositions.forEach(entityProxy => {
        // look up the real entity
        const realEntity = instance.entities.get(entityProxy.nid)

        if (realEntity && realEntity.collidable) {
            const tempX = realEntity.x
            const tempY = realEntity.y

            // rewind
            realEntity.x = entityProxy.x
            realEntity.y = entityProxy.y

            const hit = CollisionSystem.checkLineCircle(x1, y1, x2, y2, realEntity.collider.circle)

            // restore
            realEntity.x = tempX
            realEntity.y = tempY

            if (hit) {
                hits.push(realEntity)
            }
        }
    })
    return hits
}

export default lagCompensatedHitscanCheck
