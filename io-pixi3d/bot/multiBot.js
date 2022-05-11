const { fork } = require('child_process')

// connects this many bots, unique process per bot
for (let j = 0; j < 40; j++) {
    const forked = fork('./childBot.js')
    forked.send({
        address: `ws://localhost:8079/`,
        start: true
    })
}
process.on('SIGINT', () => {
    console.log("multiBot caught interrupt signal")
    process.exit()
})
