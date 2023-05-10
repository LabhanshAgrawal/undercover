import { useCallback, useMemo, useRef } from "react";

type Props = {
  players: string[];
  setPlayers: (players: string[]) => void;
  infiltrators: {
    white: number;
    black: number;
  };
  setInfiltrators: (infiltrators: { white: number; black: number }) => void;
  startGame: () => void;
};

export default function Players({
  players,
  setPlayers,
  infiltrators,
  setInfiltrators,
  startGame,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const addPlayer = useCallback(() => {
    const player = inputRef.current?.value;
    if (!player || players.includes(player)) return;
    setPlayers([...players, player]);
    inputRef.current.value = "";
  }, [players, setPlayers]);

  const removePlayer = useCallback(
    (player: string) => {
      setPlayers(players.filter((p) => p !== player));
    },
    [players, setPlayers]
  );

  const limit = useMemo(() => Math.floor(players.length / 2), [players.length]);

  const addInfiltrator = useCallback(
    (infiltrator: "white" | "black") => {
      let { white, black } = infiltrators;
      if (white + black < limit) {
        white = infiltrator === "white" ? white + 1 : white;
        black = infiltrator === "black" ? black + 1 : black;
      } else {
        white = infiltrator === "white" ? white + 1 : white - 1;
        black = infiltrator === "black" ? black + 1 : black - 1;
      }
      if (white < 0 || black < 0) return;
      setInfiltrators({ white, black });
    },
    [infiltrators, limit, setInfiltrators]
  );

  const removeInfiltrator = useCallback(
    (infiltrator: "white" | "black") => {
      let { white, black } = infiltrators;
      white = infiltrator === "white" ? white - 1 : white;
      black = infiltrator === "black" ? black - 1 : black;
      if (white < 0 || black < 0 || white + black < 1) return;
      setInfiltrators({ white, black });
    },
    [infiltrators, setInfiltrators]
  );

  return (
    <div className="min-w-[240px]">
      <div className="mb-8">
        <h1 className="w-full text-center mb-4">Players</h1>
        <ul className="space-y-4">
          {players.map((player) => (
            <li key={player}>
              <span className="mr-4">{player}</span>
              <button
                onClick={() => removePlayer(player)}
                className="bg-red-400 rounded-2xl w-8 h-8 font-bold"
              >
                ⤫
              </button>
            </li>
          ))}
          <li>
            <input
              type="text"
              className="w-40 mr-4 text-black p-2 rounded"
              ref={inputRef}
              spellCheck={false}
            />
            <button
              onClick={addPlayer}
              className="bg-green-400 rounded-2xl w-8 h-8 font-bold"
            >
              ＋
            </button>
          </li>
        </ul>
      </div>
      <div className="mb-8">
        <h1 className="w-full text-center mb-4">Infiltrators</h1>
        <ul className="space-y-4">
          <li className="flex justify-between">
            <span className="mr-4">Mr. White - {infiltrators.white}</span>
            <div className="space-x-4">
              <button
                onClick={() => removeInfiltrator("white")}
                className="text-white border-2 rounded-2xl w-8 h-8 font-bold"
              >
                -
              </button>
              <button
                onClick={() => addInfiltrator("white")}
                className="text-white border-2 rounded-2xl w-8 h-8 font-bold"
              >
                +
              </button>
            </div>
          </li>
          <li className="flex justify-between">
            <span className="mr-4">Undercover - {infiltrators.black}</span>
            <div className="space-x-4">
              <button
                onClick={() => removeInfiltrator("black")}
                className="text-white border-2 rounded-2xl w-8 h-8 font-bold"
              >
                -
              </button>
              <button
                onClick={() => addInfiltrator("black")}
                className="text-white border-2 rounded-2xl w-8 h-8 font-bold"
              >
                +
              </button>
            </div>
          </li>
        </ul>
      </div>
      <button
        onClick={() => players.length > 2 && startGame()}
        className="bg-green-400 rounded-2xl w-full font-bold px-8 py-2"
      >
        Start
      </button>
    </div>
  );
}
