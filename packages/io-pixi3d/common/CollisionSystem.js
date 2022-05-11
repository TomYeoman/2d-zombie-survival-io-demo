import SAT from 'sat'

const lineLine = (x1, y1, x2, y2, x3, y3, x4, y4) => {
    //console.log('yo', x1, y1, x2, y2, x3, y3, x4, y4) 
    const axd = x2 - x1
    const ayd = y2 - y1
    const bxd = x4 - x3
    const byd = y4 - y3
    const cyd = y1 - y3
    const cxd = x1 - x3
    const de = byd * axd - bxd * ayd

    const rangeA = (bxd * cyd - byd * cxd) / de
    const rangeB = (axd * cyd - ayd * cxd) / de

    if (rangeA >= 0 && rangeA <= 1 && rangeB >= 0 && rangeB <= 1) {
        return {
            x: x1 + (rangeA * axd),
            y: y1 + (rangeA * ayd)
        }
    }
    return false
}

const distanceSquared = (x, y) => {
    return x * x + y * y
}

const response = new SAT.Response()

class CollisionSystem {
    constructor() {

    }
}

CollisionSystem.createCircleCollider = (x, y, radius) => {
    return {
        baseType: 'sat-circle',
        circle: new SAT.Circle(new SAT.Vector(x, y), radius),

        get x() {
            return this.circle.pos.x
        },
        set x(value) {
            this.circle.pos.x = value
        },

        get y() {
            return this.circle.pos.y
        },
        set y(value) {
            this.circle.pos.y = value
        }
    }
}

CollisionSystem.createRectangleCollider = (x, y, width, height) => {
    return {
        baseType: 'sat-polygon',
        polygon: new SAT.Box(new SAT.Vector(x, y), width, height).toPolygon(),

        get x() {
            return this.polygon.pos.x
        },
        set x(value) {
            this.polygon.pos.x = value
            this.polygon._recalc()
        },

        get y() {
            return this.polygon.pos.y
        },
        set y(value) {
            this.polygon.pos.y = value
        }
    }
}

CollisionSystem.moveWithCollisions = (entity, obstacles) => {
    obstacles.forEach(obstacle => {
        if (SAT.testCirclePolygon(entity.collider.circle, obstacle.collider.polygon, response)) {
            //console.log('res', response)
            entity.x -= response.overlapV.x
            entity.y -= response.overlapV.y
        }
        response.clear()
    })
}


CollisionSystem.checkCirclePolygon = (circleCollider, polygonCollider, response) => {
    return SAT.testCirclePolygon(circleCollider, polygonCollider, response)
}

CollisionSystem.checkLineCircle = (x1, y1, x2, y2, circleCollider) => {
    const line = new SAT.Polygon(new SAT.Vector(), [
        new SAT.Vector(x1, y1),
        new SAT.Vector(x2, y2)
    ])
    return SAT.testCirclePolygon(circleCollider, line)
}

// not SAT!
// returns false or { x, y } of the first intersection point w/ the polygon
// if pierce is true returns an array of [{ x, y}, etc] of all intersections
CollisionSystem.checkLinePolygon = (x1, y1, x2, y2, polygonCollider, pierce = false) => {
    const intersections = []
    for (let i = 0; i < polygonCollider.points.length; i++) {
        const nextIndex = (i + 1 >= polygonCollider.points.length) ? 0 : i + 1

        const x3 = polygonCollider.points[i].x + polygonCollider.pos.x
        const y3 = polygonCollider.points[i].y + polygonCollider.pos.y
        const x4 = polygonCollider.points[nextIndex].x + polygonCollider.pos.x
        const y4 = polygonCollider.points[nextIndex].y + polygonCollider.pos.y

        const result = lineLine(x1, y1, x2, y2, x3, y3, x4, y4)
        if (result) {
            intersections.push(result)
        }
    }

    if (pierce && intersections.length > 0) {
        return intersections
    } else if (pierce && intersections.length === 0) {
        return -1
    }

    let index = -1
    let previousDistance = Number.MAX_SAFE_INTEGER
    for (let i = 0; i < intersections.length; i++) {
        const dist = distanceSquared(x1 - intersections[i].x, y1 - intersections[i].y)
        if (dist < previousDistance) {
            previousDistance = dist
            index = i
        }
    }

    if (index === -1) {
        return false
    } else {
        return intersections[index]
    }
}

export default CollisionSystem
