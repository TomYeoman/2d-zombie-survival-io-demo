/* eslint-disable @typescript-eslint/no-var-requires */
// require('@geckos.io/phaser-on-nodejs')
import Phaser from "phaser";
const path = require("path");
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import { commandTypes, lobbyState, SCENE_NAMES } from "../../../common/types/types";
import nengiConfig from "../../../common/config/nengiConfig";
import FireCommand from "../../../common/command/FireCommand";
import PlayerGraphicServer from "../graphics/PlayerGraphicServer";
import { BotSystem, GAME_STATE } from "../systems/BotSystem";
import ToolbarUpdatedMessage from "../../../common/message/ToolbarUpdatedMessage";
import { PlayerSystem } from "../systems/PlayerSystem";
import ModifyToolbarCommand from "../../../common/command/ModifyToolbarCommand";
import RequestRunDebugCommand from "../../../common/command/RequestRunDebugCommand";

import logger from "../util/logger";
import { HudSystem } from "../systems/HudSystem";

export default class LevelOne extends Phaser.Scene {

  // Server
    private nengiInstance: ExtendedNengiTypes.Instance;
    worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    // AI
    finder: any;
    lobbyMinimum = 1;

    playerGraphics: Map<number, PlayerGraphicServer>
    // botGraphics: Map<number, BotGraphicServer>

    botSystem: BotSystem
    playerSystem: PlayerSystem
    HudSystem: HudSystem
    gameEnded = false

    // ------------ SETUP ------------//
    levelName = "zm_castle";

    init() {
      logger.debug("LEVEL_ONE INIT");
      try {
        // @ts-ignore
        const { nengiInstance } = this.game.config.preBoot();
        this.nengiInstance = nengiInstance;

      } catch (e) {
        logger.debug("Error extracting preBoot data", e);
      }

    }

    preload() {
      logger.debug("LEVEL_ONE PRELOAD");

      const imgPath = path.join("", __dirname, "..", "assets", "tuxmon-sample-32px-extruded.png");
      const mapPath = path.join(__dirname, "..", "assets", `${this.levelName}.json`);

      const survivorShotgunPath = path.join(__dirname, "..", "assets", "survivor-shotgun.png");
      const bulletPath = path.join(__dirname, "..", "assets", "bullet.png");
      const zombiePath = path.join(__dirname, "..", "assets", "zombie.png");

      this.load.image("zombie", zombiePath);
      this.load.image("player", survivorShotgunPath);
      this.load.image("bullet", bulletPath);

      this.load.image("tiles", imgPath);
      this.load.tilemapTiledJSON(this.levelName, mapPath);
    }

    create() {
      logger.debug("LEVEL_ONE CREATE");

      this.map = this.make.tilemap({ key: this.levelName });

      // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
      // Phaser's cache (i.e. the name you used in preload)
      this.tileset = this.map.addTilesetImage("tuxmon-sample-32px-extruded", "tiles");

      // Parameters: layer name (or index) from Tiled, tileset, x, y
      // const belowLayer = this.map.createStaticLayer("Below Player", tileset, 0, 0);

      this.worldLayer = this.map.createStaticLayer("LevelOneWorld", this.tileset, 0, 0);
      this.worldLayer.setCollisionByProperty({ collides: true });

      // Nengi - Perhaps extract?
      this.nengiInstance.onConnect((client, data, callback) => {
        callback({ accepted: true, text: "Welcome!" });
      });

      this.nengiInstance.onDisconnect((client: any) => {
        logger.debug("disconnected in level-one", client.id);
        this.playerSystem.deletePlayer(client);
      });

      const checkClientUpdateLoop = this.scene.scene.time.addEvent({
        delay: 1000 / nengiConfig.UPDATE_RATE,
        callback: () => {
          // Spawn first set
          this.handleInputs();
        },
        loop: true
      });

      this.initGame();

    }

    initGame = () => {
      logger.debug("LEVEL_ONE INIT");

      this.playerGraphics = new Map();

      // Initialise player system
      this.playerSystem = new PlayerSystem(this, this.map, this.worldLayer, this.nengiInstance);

      // Initialise bot system
      this.botSystem = new BotSystem(this, this.map, this.worldLayer, this.tileset, this.nengiInstance, this.playerSystem);

      // Tell player system about the bot sprite pool
      this.playerSystem.botSystem = this.botSystem;

      this.HudSystem = new HudSystem(
        this,
        this.nengiInstance,
        this.playerSystem,
        this.botSystem
      );
    }

    checkGameIsReadyToBegin = () => {
      const playerCount = this.nengiInstance.clients.toArray().length;

      if (playerCount >= this.lobbyMinimum && this.botSystem.gameState === GAME_STATE.ENDED) {
        logger.debug("Lobby now full, starting game in 5 seconds");
        // Lets start the game
        // this.initGame()
        return this.botSystem.beginGame();

      }

      logger.debug(`Waiting for more players (${playerCount} / ${this.lobbyMinimum} players)`);
    }

    // ------------ MAIN LOOP ------------//
    update() {

      // Should I be starting a new game?
      if (this.botSystem.gameState === GAME_STATE.ENDED) {
        return this.checkGameIsReadyToBegin();
      }

      // If I shouldn't, I should be rendering a game
      this.botSystem.updateBots();

      // Check for game end
      if (this.botSystem.gameState !== GAME_STATE.WARMUP && this.playerSystem.getTotalAlivePlayerCount() === 0 ) {
        logger.debug("Killing game");

        this.botSystem.gameState = GAME_STATE.ENDED;
        this.scene.restart();

        // Delete all our entities
        const nengiEntities = [...this.nengiInstance._entities.toArray()];
        logger.debug(`Entity count = ${nengiEntities.length}`);
        nengiEntities.forEach((entity, index) => {
          logger.debug(`Removing entity ${index}, with nid ${entity.nid}`);
          this.nengiInstance.removeEntity(entity);
        });

      }
    }

    // ------------ INPUT HANDLING ------------//
    handleInputs() {

      if (this.gameEnded) {
        logger.debug("Trying to handle an input after game ended!");
        return;
      }
      // this.nengiInstance.emitCommands()
      /* serverside logic can go here */

      let cmd = null;
      while (cmd = this.nengiInstance.getNextCommand()) {
        const tick = cmd.tick;
        const client = cmd.client;

        for (let i = 0; i < cmd.commands.length; i++) {
          const command = cmd.commands[i];

          // logger.debug(`Level one - Processing command ${command.protocol.name}`)
          switch (command.protocol.name) {
          // Once client has loaded the level, they will request to join current game
          case commandTypes.RequestSpawn:
            logger.debug("Creating initial client information - lobby will spawn player when needed");
            this.commandRequestSpawn(client.name, client);
            break;

          case commandTypes.MoveCommand:
            // logger.debug("Player trying to move")
            this.commandMove(command, client);
            break;
          case commandTypes.FireCommand:
            this.commandFire(command, client);
            break;
          case commandTypes.ModifyToolbarCommand:
            this.commandModifyToolbar(command, client);
            break;
          case commandTypes.RequestRunDebugCommand:
            // logger.debug("Requesting run debug")
            this.commandRunDebugCommand(command, client);
            break;
          default:
            logger.debug(`Unrecognised command ${command.protocol.name} for ${client.name}`);
          }

        }

      }
      this.nengiInstance.update();
    }

    commandRequestSpawn(clientName: string, client: ExtendedNengiTypes.Client) {

      client.name = clientName;
      client.isAlive = false;
      this.playerSystem.createPlayer(client);
    }

    commandMove(command: any, client: ExtendedNengiTypes.Client) {
      // logger.debug("Recieved command to move")
      this.playerSystem.movePlayer(command, client);
    }


    commandFire(command: FireCommand, client: any) {

      if (client.entitySelf && client.entityPhaser) {
        // Whilst we send ID@s of entity over the wire, we need to call phaser on the server
        const clientEntityPhaser: PlayerGraphicServer = client.entityPhaser;
        clientEntityPhaser.fire();
      }
    }

    commandRunDebugCommand(command: RequestRunDebugCommand, client: any) {
      logger.debug(`running debug request ${command.debugCommand}`);
      this.playerSystem.deletePlayer(client);
    }

    commandModifyToolbar(command: ModifyToolbarCommand, client: ExtendedNengiTypes.Client) {

      if (client.entitySelf && client.entityPhaser) {
        logger.debug({ selectedSlot: command.selectedSlot });
        client.selectedSlot = command.selectedSlot;

        this.nengiInstance.message(new ToolbarUpdatedMessage(command.selectedSlot, ""), client);

      }
    }


}