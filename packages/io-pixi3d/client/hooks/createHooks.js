import obstacleHooks from './obstacleHooks.js'
import playerHooks from './playerHooks.js'

export default (state, renderer) => {
    return {
        'PlayerCharacter': playerHooks(state, renderer),
        'Obstacle': obstacleHooks(state, renderer)
    }
}
