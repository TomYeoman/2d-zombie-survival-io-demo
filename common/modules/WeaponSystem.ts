class WeaponSystem {

    onCooldown: boolean;
    cooldown: number;
    acc: number;


    constructor() {
        this.onCooldown = false
        this.cooldown = 0.05
        this.acc = 0
    }

    update(delta:number) {
        if (this.onCooldown) {
            this.acc += delta
            if (this.acc >= this.cooldown) {
                this.acc = 0
                this.onCooldown = false
            }
        }
    }

    fire() {
        if (!this.onCooldown) {
            this.onCooldown = true
            return true
        }
        return false
    }
}

export default WeaponSystem;