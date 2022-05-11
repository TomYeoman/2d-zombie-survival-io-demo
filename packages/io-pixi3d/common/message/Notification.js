import nengi from 'nengi'

class Notification {
    constructor(text) {
        this.text = text
    }
}

Notification.protocol = {
    text: nengi.String
}

export default Notification
