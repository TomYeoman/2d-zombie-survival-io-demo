import nengi from 'nengi'

class BulletEntity {

    // Automatically assigned when added to nengi
    nid!: number
    ntype!: string

    constructor(private x:number, private y:number, private rotation:number ) {
        this.x = x
        this.y = y
        this.rotation = rotation
    }

}

//@ts-ignore
BulletEntity.protocol = {
    x: { type: nengi.Float32, interp: true },
    y: { type: nengi.Float32, interp: true },
    rotation: { type: nengi.Float32, interp: true },
}

export default BulletEntity
