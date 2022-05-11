import PIXIRenderer from './graphics/PIXIRenderer'
import InputSystem from './InputSystem'
import MoveCommand from '../common/command/MoveCommand'
import FireCommand from '../common/command/FireCommand'
import createFactories from './factories/createFactories'
import CollisionSystem from '../common/CollisionSystem'
import reconcilePlayer from './reconcilePlayer'
import applyCommand from '../common/applyCommand'
import { fire } from '../common/weapon'

// ignoring certain data from the sever b/c we will be predicting these properties on the client
const ignoreProps = ['x', 'y', 'rotation']
const shouldIgnore = (myId, update) => {
    if (update.nid === myId) {
        if (ignoreProps.indexOf(update.prop) !== -1) {
            return true
        }
    }
    return false
}

class Simulator {
    constructor(client) {
        this.client = client
        this.renderer = new PIXIRenderer()
        this.input = new InputSystem()
        this.obstacles = new Map()

        this.myRawId = -1
        this.mySmoothId = -1

        this.myRawEntity = null
        this.mySmoothEntity = null

        client.factory = createFactories({
            /* dependency injection */
            simulator: this,
            obstacles: this.obstacles,
            renderer: this.renderer
        })

        client.entityUpdateFilter = (update) => {
            return shouldIgnore(this.myRawId, update)
        }

        client.on('message::Identity', message => {
            this.myRawId = message.rawId
            this.mySmoothId = message.smoothId
            console.log('identified as', message)
        })

        client.on('message::WeaponFired', message => {
            //console.log('server says a weapon was fired', message)
            if (message.sourceId === this.mySmoothEntity.nid) {
                return
            }
            this.renderer.drawHitscan(message.x, message.y, message.tx, message.ty, 0xff0000)
        })

        client.on('predictionErrorFrame', predictionErrorFrame => {
            reconcilePlayer(predictionErrorFrame, this.client, this.myRawEntity, this.obstacles)
        })
    }

    simulateShot(x, y, tx, ty) {
        // TODO: simulate impact against entities/terrain
        let endX = tx
        let endY = ty
        this.obstacles.forEach(obstacle => {
            const hitObstacle = CollisionSystem.checkLinePolygon(x, y, tx, ty, obstacle.collider.polygon)
            if (hitObstacle) {
                endX = hitObstacle.x
                endY = hitObstacle.y
            }
        })

        this.renderer.drawHitscan(x, y, endX, endY, 0xffffff)
    }

    update(delta) {
        const input = this.input.frameState
        this.input.releaseKeys()

        /* all of this is just for our own entity */
        if (this.myRawEntity) {
            // which way are we pointing?
            const worldCoord = this.renderer.toWorldCoordinates(this.input.currentState.mx, this.input.currentState.my)
            const dx = worldCoord.x - this.myRawEntity.x
            const dy = worldCoord.y - this.myRawEntity.y
            const rotation = Math.atan2(dy, dx)

            /* begin movement */
            // the command!
            const moveCommand = new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta)
            // send moveCommand to the server
            this.client.addCommand(moveCommand)

            // apply moveCommand  to our local entity
            applyCommand(this.myRawEntity, moveCommand, this.obstacles)

            // save the result of applying the command as a prediction
            const prediction = {
                nid: this.myRawEntity.nid,
                x: this.myRawEntity.x,
                y: this.myRawEntity.y
            }
            this.client.addCustomPrediction(this.client.tick, prediction, ['x', 'y'])

            // also apply the result of the prediction to the graphical entity
            const entity = this.client.entities.get(prediction.nid)
            entity.x = prediction.x
            entity.y = prediction.y
            entity.rotation = rotation

            // make the camera look at our entity
            this.renderer.centerCamera(entity)
            /* end movement */

            /* shooting */
            if (input.mouseDown) {
                if (fire(this.myRawEntity)) {
                    // send shot to the server
                    this.client.addCommand(new FireCommand(worldCoord.x, worldCoord.y))
                    // draw a predicted shot locally
                    this.simulateShot(this.myRawEntity.x, this.myRawEntity.y, worldCoord.x, worldCoord.y)
                }
            }
        }

        this.renderer.update()
    }
}

export default Simulator