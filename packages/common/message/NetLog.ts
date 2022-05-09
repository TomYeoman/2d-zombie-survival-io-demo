import nengi from 'nengi'

class NetLog {
    text: string

    constructor(text:string) {
        this.text = text
    }
}

//@ts-ignore
NetLog.protocol = {
    text: nengi.String
}

export default NetLog
