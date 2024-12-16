import { useState } from "react";
import ChoosePlayer from "./components/ChoosePlayer";
import GameBoard from "./components/GameBoard";
import History from "./components/History";
import Portal from "./components/Portal";
import ShowResult from "./components/ShowResult";
import { activePlayerInput } from "./lib/active-playper-input";
import { checkWinner } from "./lib/check-winner";

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [result, setResult] = useState(null);
  const [winningLines, setWinningLines] = useState(null);

  const currentBoard = history[currentStep];

  const handleInput = (index) => {
    if (!selectedPlayer) {
      alert("please select a player first!!");
      return;
    }
    if (typeof currentBoard[index] === "string") {
      alert("this field already selected");
      return;
    }

    const newBoard = [...currentBoard];
    newBoard[index] = activePlayerInput(selectedPlayer, currentStep);

    // update history  and steps
    const newHistory = [...history.slice(0, currentStep + 1), newBoard];
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);

    // find the winner or is a draw!!
    let { winner, lines } = checkWinner(newBoard);
    if (winner) {
      setWinningLines(lines);
      setTimeout(
        () => setResult(winner === "A" ? "Player A" : "Player B"),
        1000
      ); // Delay result announcement
    } else {
      setResult(null);
    }
  };

  const jumpToStep = (step) => {
    if (result) return;
    setCurrentStep(step);
    activePlayerInput(selectedPlayer, currentStep);
    setResult(null);
  };

  const resetGame = () => {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
    setSelectedPlayer(null);
    setResult(null);
    setWinningLines(null);
  };

  return (
    <>
      <div className='w-full max-w-[1280px] flex flex-col justify-center items-center '>
        <h1 className='text-3xl xl:text-5xl font-bold  text-center'>
          Tic Tac Toe
        </h1>
        <div className='w-full h-1 bg-white mt-2'></div>
        <ChoosePlayer
          currentStep={currentStep}
          selectedPlayer={selectedPlayer}
          setSelectedPlayer={setSelectedPlayer}
        />

        <div className='justify-self-center grid gap-y-10 lg:flex lg:items-center lg:gap-x-20 lg:divide-x-2 divide-y-2 lg:divide-y-0'>
          {/* game board */}
          <GameBoard
            selectedPlayer={selectedPlayer}
            currentBoard={currentBoard}
            handleInput={handleInput}
            winningLines={winningLines}
          />
          <History
            currentStep={currentStep}
            history={history}
            jumpToStep={jumpToStep}
          />
        </div>
      </div>
      {result && (
        <Portal>
          <ShowResult result={result} resetGame={resetGame} />
        </Portal>
      )}
      {!result && currentBoard.every((cell) => cell) && (
        <Portal>
          <ShowResult resetGame={resetGame} />
        </Portal>
      )}
    </>
  );
}
