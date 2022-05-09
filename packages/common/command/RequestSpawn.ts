import nengi from 'nengi'

class RequestSpawn {
    name: string

    constructor(name: string) {
        this.name = "User X"
    }
}

//@ts-ignore
RequestSpawn.protocol = {
    name: nengi.String,
}

export default RequestSpawn
