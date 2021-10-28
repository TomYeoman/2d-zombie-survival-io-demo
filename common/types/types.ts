export enum Sounds {
    BULLET = "bullet",
    ZOMBIE_BITE_ONE = "zombie_bite_one"
}

export enum lobbyState {
    WAITING_FOR_PLAYERS = "WAITING_FOR_PLAYERS",
    IN_LOBBY = "IN_LOBBY",
    IN_PROGRESS = "IN_PROGRESS",
    ROUND_END = "ROUND_END",
}

export enum gameState {
    WAITING_TO_CONNECT = "WAITING_TO_CONNECT"
}

export enum commandTypes {
    REQUEST_GAME_INFO = "REQUEST_GAME_INFO",
    RequestSpawn = "RequestSpawn",
    RequestRunDebugCommand = "RequestRunDebugCommand",
    MoveCommand = "MoveCommand",
    FireCommand = "FireCommand",
    ModifyToolbarCommand = "ModifyToolbarCommand"
}

export enum messageTypes {
    CLIENT_STATE_MESSAGE = "CLIENT_STATE_MESSAGE",
    HudUpdateMessage = "HudUpdateMessage",
    NetLog = "NetLog",
    Identity = "Identity",
    ToolbarUpdatedMessage = "ToolbarUpdatedMessage",
}

export enum entityTypes {
    PlayerEntity = "PlayerEntity",
    BulletEntity = "BulletEntity",
    BotEntity = "BotEntity",
}

export enum SCENE_NAMES {
    MAIN = "MAIN",
    LEVEL_ONE = "LEVEL_ONE",
}

export enum CLIENT_SCENE_STATE {
    ALIVE = "ALIVE",
    DEAD = "DEAD",
    SPECTATING = "ALIVE",
}

export enum REQUEST_DEBUG_COMMAND_TYPES {
    KILL = "KILL",
}


// Constants

export const UNASSIGNED_ENTITY_ID = -1