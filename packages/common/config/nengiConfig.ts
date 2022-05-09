import nengi from 'nengi'
import Identity from '../message/Identity'
import NetLog from '../message/NetLog'
import HudUpdateMessage from '../message/HudUpdateMessage'
import PlayerEntity from '../entity/PlayerEntity'
import BotEntity from '../entity/BotEntity'
import BulletEntity from '../entity/BulletEntity'
import MoveCommand from '../command/MoveCommand'
import FireCommand from '../command/FireCommand'

import {commandTypes, messageTypes, entityTypes} from '../types/types'
import RequestSpawn from '../command/RequestSpawn'
import RequestRunDebugCommand from '../command/RequestRunDebugCommand'
import ModifyToolbarCommand from '../command/ModifyToolbarCommand'
import ToolbarUpdatedMessage from '../message/ToolbarUpdatedMessage'

const config:any = {
    UPDATE_RATE: 30,

    ID_BINARY_TYPE: nengi.UInt16,
    TYPE_BINARY_TYPE: nengi.UInt8,

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype',

    USE_HISTORIAN: false,
    HISTORIAN_TICKS: 0,

    protocols: {
        entities: [
            [entityTypes.PlayerEntity, PlayerEntity],
            [entityTypes.BulletEntity, BulletEntity],
            [entityTypes.BotEntity, BotEntity],
        ],
        localMessages: [],
        messages: [
            [messageTypes.NetLog, NetLog],
            [messageTypes.Identity, Identity],
            [messageTypes.HudUpdateMessage, HudUpdateMessage],
            [messageTypes.ToolbarUpdatedMessage, ToolbarUpdatedMessage]
        ],
        commands: [
            [commandTypes.MoveCommand, MoveCommand],
            [commandTypes.RequestSpawn, RequestSpawn],
            [commandTypes.RequestRunDebugCommand, RequestRunDebugCommand],
            [commandTypes.FireCommand, FireCommand],
            [commandTypes.ModifyToolbarCommand, ModifyToolbarCommand],
        ],
        basics: []
    }
}

export default config
