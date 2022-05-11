export default (client, hooks) => {
    client.hooks = hooks
    client.entities = new Map()
    client.graphicalEntities = new Map()

    client.onConnect(res => {
        client.emit('connected', res)
    })

    client.onClose(() => {
        client.emit('disconnected')
    })

    client.readNetworkAndEmit = () => {
        const network = client.readNetwork()

        network.messages.forEach(message => {
            client.emit(`message::${message.protocol.name}`, message)
        })

        network.localMessages.forEach(localMessage => {
            client.emit(`message::${localMessage.protocol.name}`, localMessage)
        })

        network.entities.forEach(snapshot => {
            snapshot.createEntities.forEach(entity => {
                client.emit(`create::${entity.protocol.name}`, entity)
                client.emit(`create`, entity)
            })

            snapshot.updateEntities.forEach(update => {
                client.emit(`update`, update)
            })

            snapshot.deleteEntities.forEach(id => {
                client.emit(`delete`, id)
            })
        })

        network.predictionErrors.forEach(predictionErrorFrame => {
            client.emit(`predictionErrorFrame`, predictionErrorFrame)
        })
    }

    // gather constructors from nengiConfig
    const constructors = {}
    client.config.protocols.entities.forEach(ep => {
        constructors[ep[0]] = ep[1]
    })

    client.on('create', data => {
        // construct the entity (nengiConfig constructor)
        const name = data.protocol.name
        const constructor = constructors[name]
        if (!constructor) {
            console.log(`No constructor found for ${name}`)
        }
        const entity = new constructor(data)
        Object.assign(entity, data)
        client.entities.set(entity.nid, entity)

        // construct the client entity (from hooks)
        if (client.hooks) {
            const hooks = client.hooks[name]
            if (hooks) {
                const graphics = hooks.create({ data, entity })
                if (graphics) {
                    Object.assign(graphics, data)
                    if (hooks.watch) {
                        data.protocol.keys.forEach(prop => {
                            if (hooks.watch[prop]) {
                                hooks.watch[prop]({ value: data[prop], graphics, entity })
                            }
                        })
                    }
                    client.graphicalEntities.set(graphics.nid, graphics)
                }
            }
        }
    })

    client.on('update', update => {
        if (client.entityUpdateFilter(update)) {
            //console.log('ignore', update)
            return
        }
        const entity = client.entities.get(update.nid)
        if (entity) {
            entity[update.prop] = update.value
        } else {
            console.log('tried to update a sim that did not exist')
        }
        const graphics = client.graphicalEntities.get(update.nid)
        if (graphics) {
            graphics[update.prop] = update.value

            const name = graphics.protocol.name
            const hooks = client.hooks[name]

            if (hooks.watch && hooks.watch[update.prop]) {
                hooks.watch[update.prop]({ id: update.id, value: update.value, entity, graphics })
            }

        } else {
            console.log('tried to update an entity that did not exist')
        }
    })


    client.on('delete', nid => {
        const entity = client.entities.get(nid)
        const graphics = client.graphicalEntities.get(nid)
        const name = graphics.protocol.name
        const hooks = client.hooks[name]

        if (client.entities.has(nid)) {
            client.entities.delete(nid)
        } else {
            console.log('tried to delete an entity that did not exist')
        }

        if (client.graphicalEntities.has(nid)) {
            client.graphicalEntities.delete(nid)
            hooks.delete({ nid, entity, graphics })
        } else {
            console.log('tried to delete an entity that did not exist')
        }
    })
}
