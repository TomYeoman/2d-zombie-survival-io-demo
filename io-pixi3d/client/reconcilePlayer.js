import applyCommand from '../common/applyCommand.js'

export default (predictionErrorFrame, client, entity, obstacles) => {
    predictionErrorFrame.entities.forEach(predictionErrorEntity => {
        const name = entity.protocol.name

        // rewind state for frame that was incorrect
        Object.assign(entity, predictionErrorEntity.proxy)

        // correct any state that was incorrect, using the server values
        predictionErrorEntity.errors.forEach(predictionError => {
            //console.log('prediciton error', predictionError)
            entity[predictionError.prop] = predictionError.actualValue
        })

        // TODO: clientHook api should fire hook if any of the properties are changed here

        // and then re-apply any commands issued since the frame that had the prediction error
        const commandSets = client.getUnconfirmedCommands() // client knows which commands need redone
        commandSets.forEach((commandSet, clientTick) => {
            commandSet.forEach(command => {
                // reapply movements
                if (command.protocol.name === 'MoveCommand') {
                    applyCommand(entity, command, obstacles)
                    const prediction = {
                        nid: entity.nid,
                        x: entity.x,
                        y: entity.y,
                        protocol: entity.protocol
                    }
                    // these reconciled positions are now our new predictions, going forward
                    client.addCustomPrediction(clientTick, prediction, ['x', 'y']) 
                }
            })
        })
    })
}
