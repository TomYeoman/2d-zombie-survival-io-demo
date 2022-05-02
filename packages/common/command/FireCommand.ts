import nengi from 'nengi'

class FireCommand {
    constructor(public mouseX:number, public mouseY:number) {
        this.mouseX = mouseX
        this.mouseY = mouseY
    }
}

//@ts-ignore
FireCommand.protocol = {
    mouseX: nengi.Int32,
    mouseY: nengi.Int32
}

export default FireCommand
