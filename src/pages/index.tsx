import Players from "@/components/players";
import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import data from './api/data.json';
import Game from "@/components/game";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [words, setWords] = useState<string[]>(data.words[0]);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState<string[]>([]);
  const [infiltrators, setInfiltrators] = useState({
    white: 0,
    black: 1,
  });
  const [cookies, setCookie] = useCookies(["players", "infiltrators"]);

  useEffect(() => {
    if (cookies.players) {
      setPlayers(cookies.players);
    }
    if (cookies.infiltrators) {
      setInfiltrators(cookies.infiltrators);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setCookie("players", players, { path: "/" });
    setCookie("infiltrators", infiltrators, { path: "/" });
  }, [infiltrators, players, setCookie]);

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white ${inter.className}`}
    >
      {!gameStarted ? <Players
        players={players}
        setPlayers={setPlayers}
        infiltrators={infiltrators}
        setInfiltrators={setInfiltrators}
        startGame={()=>{
          setGameStarted(true);
          setWords(data.words[Math.floor(Math.random() * data.words.length)]);
        }}
      />:
      <Game
        players={players}
        infiltrators={infiltrators}
        endGame={()=>setGameStarted(false)}
        words={words}
      />
      }
    </main>
  );
}
