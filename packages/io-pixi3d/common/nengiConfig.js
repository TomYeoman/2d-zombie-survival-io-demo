import nengi from 'nengi'
import PlayerCharacter from './entity/PlayerCharacter.js'
import Identity from './message/Identity.js'
import WeaponFired from './message/WeaponFired.js'
import Notification from './message/Notification.js'
import MoveCommand from './command/MoveCommand.js'
import FireCommand from './command/FireCommand.js'
import Obstacle from './entity/Obstacle.js'

const config = {
    UPDATE_RATE: 20, 

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 

    USE_HISTORIAN: true,
    HISTORIAN_TICKS: 40,

    protocols: {
        entities: [
            ['PlayerCharacter', PlayerCharacter],
            ['Obstacle', Obstacle]
        ],
        localMessages: [],
        messages: [
            ['Identity', Identity],
            ['WeaponFired', WeaponFired],
            ['Notification', Notification]
        ],
        commands: [
            ['MoveCommand', MoveCommand],
            ['FireCommand', FireCommand]
        ],
        basics: []
    }
}

export default config