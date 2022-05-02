import nengi from 'nengi'

class ModifyToolbarCommand {
    constructor(public selectedSlot:number) {
        this.selectedSlot = selectedSlot
    }
}

//@ts-ignore
ModifyToolbarCommand.protocol = {
    selectedSlot: nengi.Int6,
}

export default ModifyToolbarCommand
