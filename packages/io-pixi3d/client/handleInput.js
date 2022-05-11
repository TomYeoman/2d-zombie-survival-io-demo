import MoveCommand from '../common/command/MoveCommand.js'
import FireCommand from '../common/command/FireCommand.js'
import applyCommand from '../common/applyCommand.js'
import { fire } from '../common/weapon.js'
import handleShot from './handleShot.js'

const handleInput = (inputSystem, state, client, renderer, delta) => {
    const input = inputSystem.frameState
    inputSystem.releaseKeys()

    const { myRawEntity, obstacles } = state

    /* all of this is just for our own entity */
    if (myRawEntity) {
        // which way are we pointing?
        const worldCoord = renderer.toWorldCoordinates(
            inputSystem.currentState.mx, 
            inputSystem.currentState.my
        )
        const dx = worldCoord.x - myRawEntity.x
        const dy = worldCoord.y - myRawEntity.y
        const rotation = Math.atan2(dy, dx)

        /* begin movement */
        // the command!
        const moveCommand = new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta)
        // send moveCommand to the server
        client.addCommand(moveCommand)

        // apply moveCommand  to our local entity
        applyCommand(myRawEntity, moveCommand, obstacles)

        // save the result of applying the command as a prediction
        const prediction = {
            nid: myRawEntity.nid,
            x: myRawEntity.x,
            y: myRawEntity.y,
            protocol: myRawEntity.protocol
        }
        client.addCustomPrediction(client.tick, prediction, ['x', 'y'])

        // also apply the result of the prediction to the graphical entity
        const graphics = client.graphicalEntities.get(prediction.nid)
        graphics.x = prediction.x
        graphics.y = prediction.y
        graphics.rotation = rotation

        // make the camera look at our entity
        renderer.centerCamera(graphics)
        /* end movement */

        /* shooting */
        if (input.mouseDown) {
            if (fire(myRawEntity)) {
                // send shot to the server
                client.addCommand(new FireCommand(worldCoord.x, worldCoord.y))
                // draw a predicted shot locally
                handleShot(myRawEntity.x, myRawEntity.y, worldCoord.x, worldCoord.y, state.obstacles, renderer)
            }
        }
    }
}

export default handleInput