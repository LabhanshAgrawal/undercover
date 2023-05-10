import { useState } from "react";
import sampleSize from "lodash/sampleSize";
import AssignRoles from "./assignRoles";
import Vote from "./vote";

export type Player = {
  name: string;
  role: "white" | "black" | "civilian";
  word: string;
  isAlive: boolean;
};

type Props = {
  players: string[];
  infiltrators: {
    white: number;
    black: number;
  };
  endGame: () => void;
  words: string[];
};

export default function Game({
  players: _players,
  infiltrators,
  endGame,
  words,
}: Props) {
  const [[realWord, fakeWord]] = useState(() => {
    const rotateBy = Math.floor(Math.random() * words.length);
    return [...words.slice(rotateBy), ...words.slice(0, rotateBy)];
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    const white = sampleSize(_players, infiltrators.white);
    const black = sampleSize(
      _players.filter((player) => !white.includes(player)),
      infiltrators.black
    );
    const rotateBy = Math.floor(Math.random() * _players.length);
    return [..._players.slice(rotateBy), ..._players.slice(0, rotateBy)].map(
      (player) => {
        if (white.includes(player))
          return {
            name: player,
            role: "white",
            word: "You are Mr. White",
            isAlive: true,
          };
        if (black.includes(player))
          return { name: player, role: "black", word: fakeWord, isAlive: true };
        return {
          name: player,
          role: "civilian",
          word: realWord,
          isAlive: true,
        };
      }
    );
  });

  const [rolesAssigned, setRolesAssigned] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center">
      {!rolesAssigned ? (
        <AssignRoles players={players} setRolesAssigned={setRolesAssigned} />
      ) : (
        <Vote players={players} setPlayers={setPlayers} realWord={realWord} endGame={endGame}/>
      )}
    </div>
  );
}
