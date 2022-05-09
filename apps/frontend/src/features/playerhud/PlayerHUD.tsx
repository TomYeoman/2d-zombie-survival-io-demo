import { useAppSelector } from "../../app/hooks";

export function PlayerHUD() {
  const playerHud = useAppSelector((state) => state.playerHUD);

  let className = "bg-green-500 bg-opacity-30 ";

  if (playerHud.health > 30 && playerHud.health < 70) {
    className = "bg-yellow-500 bg-opacity-30 ";
  }

  if (playerHud.health < 30) {
    className = "bg-red-500 bg-opacity-30 ";
  }

  return (
    <div className="text-white fixed bottom-2 right-2 w-80 select-none bg-opacity-50 border-grey bg-gray-600 m-1 border-2">
      <span className="text-xs font-semibold py-1 px-2 uppercase rounded-full text-amber-600 bg-amber-200">
        Health
      </span>
      <div
        style={{ width: playerHud.health + "%" }}
        className={`${className} text-xs leading-none py-1 text-center text-white`}
      >
        {playerHud.health}
      </div>
    </div>
  );
}
