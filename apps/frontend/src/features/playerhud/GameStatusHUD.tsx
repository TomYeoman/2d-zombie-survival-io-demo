
import { useAppSelector } from "../../app/hooks";

export function GameStatusHUD() {
  const gameInfo = useAppSelector((state) => state.playerHUD);

  return (
    <div className="text-white flex-col p-2 fixed top-2 left-2 w-80 select-none bg-opacity-50 border-grey bg-gray-600 m-1 border-2">
      {/* {gameInfo.currentWave} */}
      <div className="p-2 border-bottom border-gray-600">
        Game State : {gameInfo.gameStatus}
      </div>
      <div className="p-2 border-bottom border-gray-600">
        Zombies Remaining : {gameInfo.zombiesRemaining}
      </div>
      <div className="p-2 border-bottom border-gray-600">
        Zombies Killed : {gameInfo.zombiesKilled}
      </div>
      <div className="p-2 border-bottom border-gray-600">
        Zombies Alive : {gameInfo.zombiesAlive}
      </div>
      <div className="p-2 border-bottom border-gray-600">
        Players : {gameInfo.playersAlive}
      </div>
    </div>
  );
}
