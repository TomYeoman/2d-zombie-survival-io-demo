/* weapon system */

// advances the weapon cooldown timer
export const update = (entity, delta) => {
    const weapon = entity.weapon
    if (weapon.onCooldown) {
        weapon.acc += delta
        if (weapon.acc >= weapon.cooldown) {
            weapon.acc = 0
            weapon.onCooldown = false
        }
    }
}

// returns true if the enemy is alive and the weapon is off cooldown
export const fire = (entity) => {
    if (entity.isAlive && !entity.weapon.onCooldown) {
        entity.weapon.onCooldown = true
        return true
    }
    return false
}