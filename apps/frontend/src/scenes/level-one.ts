import nengi from "nengi";
import Phaser from "phaser";
import RequestSpawn from "../../../common/command/RequestSpawn";
import { ExtendedNengiTypes } from "../../../common/types/custom-nengi-types";
import { Sounds } from "../../../common/types/types";
import Simulator from "../Simulator";
import { store } from '../app/store'
import ModifyToolbarCommand from '../../../common/command/ModifyToolbarCommand'
import RequestRunDebugCommand from '../../../common/command/RequestRunDebugCommand'
import { REQUEST_DEBUG_COMMAND_TYPES } from "../../../common/types/types";

export class LevelOne extends Phaser.Scene {
  map: Phaser.Tilemaps.Tilemap;
  worldLayer: Phaser.Tilemaps.StaticTilemapLayer;
  nengiClient: ExtendedNengiTypes.Client;
  simulator: Simulator;
  last_ts: number
  levelName = "zm_castle";
  store: typeof store
  oldState:  ReturnType<typeof store.getState>

  init = ({ nengiClient, storeRef }: { nengiClient: any, storeRef: typeof store }) => {
    console.log("RUNNING INIT LEVEL_ONE")

    this.nengiClient = nengiClient;
    this.store = storeRef
    this.store.subscribe(() => this.stateUpdated())
  }

  public preload = () => {
    console.log("Pre-load level one")

    this.load.image("player", "survivor-shotgun.png");
    this.load.image("zombie", "zombie.png");
    this.load.image("bullet", "bullet.png");

    this.load.image("tiles", "tuxmon-sample-32px-extruded.png");
    this.load.tilemapTiledJSON(this.levelName, "zm_castle.json");

    this.load.audio(Sounds.BULLET, 'bullet.mp3');
    this.load.audio(Sounds.ZOMBIE_BITE_ONE, 'zombie_bite_one.mp3');

  }

  stateUpdated = () => {
    // console.log("stat eupdated")
    const newState = this.store.getState()
    console.log(newState)

    if (this.oldState?.toolbar?.selectedSlot && this.oldState.toolbar.selectedSlot !== newState.toolbar.selectedSlot) {
      const ModToolbarCommand = new ModifyToolbarCommand(newState.toolbar.selectedSlot)
      this.nengiClient.addCommand(ModToolbarCommand)
    }
    if (this.oldState?.debugBar?.killFlag && this.oldState?.debugBar?.killFlag  !== newState.debugBar.killFlag) {
      const requestRunDebugCommand = new RequestRunDebugCommand(REQUEST_DEBUG_COMMAND_TYPES.KILL)
      this.nengiClient.addCommand(requestRunDebugCommand)
    }

    this.oldState = newState
  }

  create = () => {

    // this.load.audio(Sounds.BULLET);
    // var music = this.scene.sound.add(Sounds.BULLET);

    console.log("Create level one")

    this.map = this.make.tilemap({ key: this.levelName });

    const tileset = this.map.addTilesetImage(
      "tuxmon-sample-32px-extruded",
      "tiles"
    );

    //@ts-ignore
    this.map.createStaticLayer(
      "Below Player",
      tileset,
      0,
      0
    );

    //@ts-ignore
    this.worldLayer = this.map.createStaticLayer("LevelOneWorld", tileset, 0, 0);
    // this.worldLayer.setCollisionByProperty({ collides: true });
    this.simulator = new Simulator(this.nengiClient, this, this.map);


    this.nengiClient.onConnect((res) => {
      console.log("onConnect response:", res);
    });

    this.nengiClient.onClose(() => {
      console.log("connection closed");
    });

    this.nengiClient.connect("ws://localhost:8079");

    console.log("Requesting to join game")
    const RequestSpawnCommand = new RequestSpawn("")
    console.log(RequestSpawnCommand)
    this.nengiClient.addCommand(RequestSpawnCommand)
  }

  public update = () => {
    // console.log("Running level one update")
    // console.log(this.map)
    // Compute delta time since last update.
    const now_ts = +new Date();
    const last_ts = this.last_ts || now_ts;
    const dt_sec = (now_ts - last_ts) / 1000.0;
    this.last_ts = now_ts;

    const network = this.nengiClient.readNetwork();

    network.entities.forEach((snapshot: any) => {
      snapshot.createEntities.forEach((entity: any) => {
        // console.log(`creating new ${entity.protocol.name} entity `, entity)
        this.simulator.createEntity(entity)
      })

      snapshot.updateEntities.forEach((update: any) => {
        // console.log(`Updating entity ${update.nid}`)
        this.simulator.updateEntity(update)
      })

      snapshot.deleteEntities.forEach((id: number) => {
        // console.log(`Deleting entity `, id)
        this.simulator.deleteEntity(id)
      })
    })

    network.messages.forEach((message: any) => {
      // console.log(`Recieved ${message.protocol.name} message:`, message);
      this.simulator.processMessage(message)
    });

    // console.log(dt_sec)
    this.simulator.update(dt_sec);
    this.nengiClient.update();
  }
}
