import nengi from 'nengi'

class PlayerEntity {
    x: number
    y: number
    rotation: number
    hitpoints: number
    isAlive: boolean

    // Automatically assigned when added to nengi
    // Automatically assigned when added to nengi
    nid!: number
    ntype!: string

    // Added ourself, not sent over wire?
    client: any

    constructor(x:number, y:number ) {
        this.x = x;
        this.y = y
        this.rotation = 0
        this.hitpoints = 100
        this.isAlive = false
    }
}

//@ts-ignore
PlayerEntity.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.RotationFloat32, interp: true },
    isAlive: nengi.Boolean,
    hitpoints: nengi.UInt8
}

export default PlayerEntity
