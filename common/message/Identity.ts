import nengi from 'nengi'

class Identity {
    entityId:number

    constructor(entityId: number) {
        // When sent as -1, this will unassign the client on the front-end (therefore stopping movement updates
        this.entityId = entityId
    }
}

//@ts-ignore
Identity.protocol = {
    entityId: nengi.Int32,
}

export default Identity
