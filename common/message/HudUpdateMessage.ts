import nengi from 'nengi'

class HudUpdateMessage {
    constructor(
        // Player info
        public health: number,
        public ammo: string,
        public gunName: string,
        // Round info
        public currentWave: number,
        public waveSize: number,
        public zombiesRemaining: number,
        public zombiesKilled: number,
        public zombiesAlive: number,
        public playersAlive: number,
        public playersTotal: number,
        public gameStatus : string
    ) {}
}

//@ts-ignore
HudUpdateMessage.protocol = {
    health: nengi.UInt8,
    ammo: nengi.UInt16,
    gunName: nengi.UInt16,
    currentWave: nengi.UInt8,
    waveSize: nengi.UInt16,
    zombiesRemaining: nengi.UInt16,
    zombiesKilled: nengi.UInt16,
    zombiesAlive: nengi.UInt16,
    playersAlive: nengi.UInt8,
    playersTotal: nengi.UInt8,
    gameStatus: nengi.String,
}

export default HudUpdateMessage
