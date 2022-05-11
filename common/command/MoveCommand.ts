import nengi from 'nengi'

class MoveCommand {
    forward: boolean
    left: boolean
    backward: boolean
    right: boolean
    rotation: boolean
    delta: boolean

    constructor(forward: any, left: any, backward: any, right: any, rotation: any, delta: any) {
        this.forward = forward
        this.left = left
        this.backward = backward
        this.right = right
        this.rotation = rotation
        this.delta = delta
    }
}

//@ts-ignore
MoveCommand.protocol = {
    forward: nengi.Boolean,
    left: nengi.Boolean,
    backward: nengi.Boolean,
    right: nengi.Boolean,
    rotation: nengi.Float32,
    delta: nengi.Float32
}

export default MoveCommand
