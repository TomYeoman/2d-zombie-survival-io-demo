import { newGame } from "./game/main";
import nengiConfig from '../../common/config/nengiConfig'
import nengi from 'nengi'

class GameServer {
    private nengiInstance: any

    constructor() {
      this.nengiInstance = new nengi.Instance(nengiConfig, { port: 8079 })
      newGame(this.nengiInstance);
    }
  }

new GameServer()