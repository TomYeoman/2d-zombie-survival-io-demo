import nengi from 'nengi'

class ToolbarUpdatedMessage {

    constructor(private selectedSlot:number, private name: string) {
        // this.selectedSlot = selectedSlot
        // this.name = name
        // optional int32 ammo_clip = 4;
        // optional int32 ammo_clip_max = 5;
        // optional int32 ammo_reserve = 6;
    }
}

//@ts-ignoress
ToolbarUpdatedMessage.protocol = {
    selectedSlot: nengi.Int6,
    name: nengi.String
}

export default ToolbarUpdatedMessage
