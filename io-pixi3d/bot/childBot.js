const glue = require('./glue')
const nengi = glue.nengi.default
const nengiConfig = glue.nengiConfig.default
const MoveCommand = glue.MoveCommand.default

const protocolMap = new nengi.ProtocolMap(nengiConfig, nengi.metaConfig)
const bots = new Map()

process.on('message', msg => {
    let address

    if (msg.address) {
        address = msg.address
    }

    if (msg.start) {
        for (var i = 0; i < 10; i++) {
            connectNewBot(address)
        }

    }

    if (msg.stop) {
        bots.forEach(bot => {
            if (bot.websocket) {
                bot.websocket.terminate()
            }
        })
    }

    /*
    if (msg.reconnect) {
        connectNewBot(address)
        setInterval(() => {
            bots.forEach(bot => {
                if (bot.websocket) {
                    bot.websocket.terminate()
                    setTimeout(() => {
                        connectNewBot(address)
                    }, 500)
                }
            })
        }, 5000 + Math.random() * 10000)
    }
    */
})

process.on('SIGINT', function () {
    console.log("childBot caught interrupt signal, cleaning up websockets")
    bots.forEach(bot => {
        if (bot.websocket) {
            bot.websocket.terminate()
        }
    })
    process.exit()
})


let id = 1
function connectNewBot(address) {
    console.log('connecting', id)
    const bot = new nengi.Bot(nengiConfig, protocolMap)
    bot.id = id
    id++

    bot.controls = {
        forward: false,
        left: false,
        backward: false,
        right: false,
        rotation: 0,
        delta: 1 / 60,
    }

    bot.onConnect(response => {
        console.log('Bot attempted connection, response:', response)
        bot.tick = 0
    })

    bot.onClose(() => {
        bots.delete(bot.id)
    })

    bots.set(bot.id, bot)
    bot.connect(address, {})
}

function randomBool() {
    return Math.random() > 0.5
}

let previous = Date.now()

const loop = () => {
    const now = Date.now()
    const delta = (now - previous) / 1000
    previous = now

    bots.forEach(function botLoop(bot) {
        if (bot.websocket) {
            bot.readNetwork()

            if (Math.random() > 0.95) {
                bot.controls.forward = randomBool()
                bot.controls.left = randomBool()
                bot.controls.backward = randomBool()
                bot.controls.right = randomBool()
            }
            bot.controls.rotation += Math.PI * 2 * delta

            const input = new MoveCommand(
                bot.controls.forward,
                bot.controls.left,
                bot.controls.backward,
                bot.controls.right,
                bot.controls.rotation,
                delta,
            )
            bot.addCommand(input)
            bot.update()
            bot.tick++
        }
    })
}

setTimeout(() => {
    setInterval(loop, 1000 / 60)
}, 100)
