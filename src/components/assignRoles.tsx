import { useState } from "react";
import { Player } from "./game";

type Props = {
  setRolesAssigned: (rolesAssigned: boolean) => void;
  players: Player[];
};

export default function RevealRoles({ players, setRolesAssigned }: Props) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="space-y-4">
      <div className="text-2xl font-bold w-full text-center">{players[index].name}</div>
      {!revealed ? (
        <button
          className="bg-green-400 rounded-2xl w-full font-bold px-8 py-2"
          onClick={() => setRevealed(true)}
        >
          Reveal
        </button>
      ) : (
        <>
          <div className="text-xl w-full text-center">{players[index].word}</div>
          <button
            className="bg-green-400 rounded-2xl w-full font-bold px-8 py-2"
            onClick={() => {
              if (index === players.length - 1) {
                setRolesAssigned(true);
              } else {
                setRevealed(false);
                setIndex(index + 1);
              }
            }}
          >
            {index === players.length - 1 ? "Start Game" : "Next"}
          </button>
        </>
      )}
    </div>
  );
}
