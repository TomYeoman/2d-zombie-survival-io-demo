import PlayerEntity from '@io/common/entity/PlayerEntity'

import InputSystem from "./InputSystem"
import MoveCommand from '@io/common/command/MoveCommand'
import nengi from 'nengi'
import PhaserEntityRenderer from './PhaserEntityRenderer'
import { entityTypes, lobbyState, messageTypes, Sounds, UNASSIGNED_ENTITY_ID } from '@io/common/types/types'
import FireCommand from '@io/common/command/FireCommand'
import BotEntity from '@io/common/entity/BotEntity'
import BulletEntity from '@io/common/entity/BulletEntity'
import NetLog from '@io/common/message/NetLog'
import { store } from './app/store';
import { changeSlot } from './features/toolbar/toolbarSlice'
import { updatePlayerHUD } from './features/playerhud/playerHUDSlice'

class Simulator {
    input: InputSystem
    entities: Map<number, any>
    renderer: PhaserEntityRenderer

    entityIdSelf : number
    myEntity: PlayerEntity | null
    prevHealth = 0

    constructor(private nengiClient: nengi.Client, private scene: Phaser.Scene, sceneMap: Phaser.Tilemaps.Tilemap) {
        this.input = new InputSystem()
        this.entities = new Map()

        this.entityIdSelf = -1

        this.myEntity = null
        this.renderer = new PhaserEntityRenderer(scene, sceneMap)
    }

    createEntity(entity: any) {
        console.log(`creating new ${entity.protocol.name} entity (Simulator)`)

        if (entity.protocol.name === entityTypes.PlayerEntity) {
            let newEntity = new PlayerEntity(entity.x, entity.y)
            Object.assign(newEntity, entity)
            this.entities.set(newEntity.nid, newEntity)
            this.renderer.createEntity(entity)

            // If we know our own ID yet, then associate it to the entity we just created
            if (entity.nid === this.entityIdSelf) {
                console.log(`Discovered local version of my remote entity, with id ${entity.nid}`)
                this.myEntity = newEntity
            }
        }

        if (entity.protocol.name === entityTypes.BotEntity) {
            let newEntity = new BotEntity(entity.x, entity.y)
            Object.assign(newEntity, entity)
            this.entities.set(newEntity.nid, newEntity)
            this.renderer.createEntity(entity)
        }

        if (entity.protocol.name === entityTypes.BulletEntity) {
            // this.scene.sound.play(Sounds.BULLET);

            let newEntity = new BulletEntity(entity.x, entity.y, entity.rotation)
            Object.assign(newEntity, entity)
            this.entities.set(newEntity.nid, newEntity)
            this.renderer.createEntity(entity)
        }
    }

    updateEntity(update: any) {
        const entity = this.entities.get(update.nid)

        if (entity) {
            entity[update.prop] = update.value
            this.renderer.updateEntity(update)
        } else {
            console.log(`Tried to update entity ${update.nid} but it doesn't exist yet`)

        }
    }

    deleteEntity(id: number) {
        this.entities.delete(id)
        this.renderer.deleteEntity(id)
    }

    // deleteAllEntities() {
    //     this.entities.forEach(ent => {
    //         this.renderer.deleteEntity(ent.id)
    //     });
    //     this.entities = new Map()

    // }

    processMessage(message: any) {

        // if (message.protocol.name === messageTypes.HudUpdateMessage) {
        //     let {protocol, ...rest} = message;

        //     store.dispatch(updateGameInfo(rest))
        // }

        if (message.protocol.name === messageTypes.HudUpdateMessage) {
            console.log("Health was less")

            let {protocol, ...rest} = message;
            let currHealth = rest.health

            if (this.prevHealth > currHealth) {
                console.log("Health was less")
            }

            store.dispatch(updatePlayerHUD(rest))

            this.prevHealth = currHealth
        }

        if (message.protocol.name === messageTypes.NetLog) {
            const typedMessage: NetLog = message

            console.log("Recieved NetLog message")
            console.log(typedMessage)
        }

        if (message.protocol.name === messageTypes.Identity) {
            // be able to access self from simular
            console.log('Assigned my remote entity ID as ', message.entityId)

            if (message.entityId === UNASSIGNED_ENTITY_ID) {
                this.entityIdSelf = message.entityId
                this.myEntity = null
            } else {
                // Now we know our identity ID, create a graphic for now
                this.entityIdSelf = message.entityId
                this.renderer.processMessage(message)

                // If we had already created entities (I.E we recieved IDENTIFY after the entities were sent - happens on low FPS ) -
                // we should go and assign them to ourselves correctly now
                let existingEntity = this.entities.get(message.entityId)
                if (!existingEntity) {
                    console.log("Recieved identity before the entity, therefore no need to assign an entity at point of recieivng identity")
                    return
                } else {
                    this.myEntity = existingEntity
                    // Also setup rendereds reference to entity
                    this.renderer.assignClientEntity(message.entityId)
                }

            }

        }

        if (message.protocol.name === messageTypes.ToolbarUpdatedMessage) {
            store.dispatch(changeSlot(message.selectedSlot))
        }
    }

    update(delta: number) {

        // console.log("Calling update")
        const input = this.input.frameState

        if (this.myEntity) {
            let rotation = 0

            // calculate the direction our character is facing
            const { mouseX, mouseY } = this.renderer.getMouseCoords()

            const spriteX = this.renderer.myEntity.x
            const spriteY =  this.renderer.myEntity.y

            rotation = Math.atan2( mouseY - spriteY, mouseX - spriteX)

            // Send this frames movement info
            if (input.mouseDown) {
                this.nengiClient.addCommand(new FireCommand(mouseX, mouseY))
            }

            // console.log(rotation)
            this.nengiClient.addCommand(new MoveCommand(input.w, input.a, input.s, input.d, rotation, delta))

        } else {
            // console.log("No entity found for player to move")
        }

        this.input.releaseKeys()

    }


}

export default Simulator;