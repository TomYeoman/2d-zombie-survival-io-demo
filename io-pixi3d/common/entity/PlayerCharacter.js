import nengi from 'nengi'
import CollisionSystem from '../CollisionSystem.js'

class PlayerCharacter {
    constructor() {
        // x & y are getters
        //this.x = 0
        //this.y = 0
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = true
        this.speed = 400

        // weapon cooldown!
        // example of a plain data-only component
        this.weapon = {
            onCooldown: false,
            cooldown: 0.5,
            acc: 0
        }

        // collider!
        // example of a component that involves fancy stuff from another libary
        this.collider = CollisionSystem.createCircleCollider(0, 0, 25)
    }

    get x() {
        return this.collider.x
    }
    set x(value) {
        this.collider.x = value
    }

    get y() {
        return this.collider.y
    }
    set y(value) {
        this.collider.y = value
    }
}

PlayerCharacter.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8
}

export default PlayerCharacter
