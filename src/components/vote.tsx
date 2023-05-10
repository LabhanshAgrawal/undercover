import clsx from "clsx";
import { Player } from "./game";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  players: Player[];
  setPlayers: (players: Player[]) => void;
  realWord: string;
  endGame: () => void;
};

export default function Vote({
  players,
  setPlayers,
  realWord,
  endGame,
}: Props) {
  const [mrWhite, setMrWhite] = useState<Player | null>(null);
  const [guessing, setGuessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const killPlayer = useCallback(
    (player: Player) => {
      setPlayers(
        players.map((p) => {
          if (p.name === player.name) {
            return { ...p, isAlive: false };
          }
          return p;
        })
      );
    },
    [players, setPlayers]
  );

  const eliminatePlayer = useCallback(
    (player: Player) => {
      if (player.role === "white") {
        setMrWhite(player);
        setGuessing(true);
      } else {
        killPlayer(player);
      }
    },
    [killPlayer]
  );

  const checkGuess = useCallback(() => {
    const guess = inputRef.current?.value;
    if (!guess || !mrWhite) return;
    if (
      guess.replace(/[^a-zA-Z0-9]/g, "").toLowerCase() ===
      realWord.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    ) {
      alert("You guessed correctly! You win!");
      endGame();
    } else {
      alert("Incorrect guess!");
      killPlayer(mrWhite);
      setGuessing(false);
      setMrWhite(null);
    }
  }, [endGame, killPlayer, mrWhite, realWord]);

  useEffect(() => {
    const undercover = players.filter(
      (player) => player.role === "black" && player.isAlive
    );
    const civilians = players.filter(
      (player) => player.role === "civilian" && player.isAlive
    );
    const whites = players.filter(
      (player) => player.role === "white" && player.isAlive
    );

    if (civilians.length === 1) {
      alert(
        `The infiltrators win!${
          undercover.length > 0
            ? `\nUndercover: ${undercover
                .map((player) => player.name)
                .join(", ")}`
            : ""
        }${
          whites.length > 0
            ? `\nMr. White: ${whites.map((player) => player.name).join(", ")}`
            : ""
        }`
      );
      endGame();
    }
    if (undercover.length === 0 && whites.length === 0) {
      alert(
        `The civilians win!${
          civilians.length > 0 &&
          `\nCivilians: ${civilians.map((player) => player.name).join(", ")}`
        }`
      );
      endGame();
    }
  }, [endGame, players]);

  return (
    <div className="space-y-4 min-w-[240px] relative">
      <h1 className="w-full text-center">Vote</h1>
      <ul className="space-y-4">
        {players.map((player, i) => (
          <li
            key={player.name}
            className="w-full flex justify-between items-center h-10 font-bold"
          >
            <span>
              {`${i + 1}.)`}
              <span
                className={clsx(
                  "ml-4",
                  { "line-through": !player.isAlive },
                  player.isAlive ? "text-green-400" : "text-gray-400"
                )}
              >
                {player.name}
              </span>
            </span>
            {player.isAlive ? (
              <button
                className="bg-red-400 rounded-2xl font-bold px-8 py-2"
                onClick={() => eliminatePlayer(player)}
              >
                Eliminate
              </button>
            ) : (
              <span>
                {
                  {
                    white: "Mr. White",
                    black: "Undercover",
                    civilian: "Civilian",
                  }[player.role]
                }
              </span>
            )}
          </li>
        ))}
      </ul>
      <div>
        {guessing && mrWhite && (
          <div className="absolute inset-0 border-white border-2 bg-black flex flex-col items-center space-y-4">
            <h1 className="w-full text-center">{mrWhite.name} is Mr. White</h1>
            <h2>Guess the word</h2>
            <input
              type="text"
              className="w-40 text-black p-2 rounded"
              ref={inputRef}
            />
            <button
              className="bg-green-400 rounded-2xl max-w-fit font-bold px-8 py-2"
              onClick={checkGuess}
            >
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
