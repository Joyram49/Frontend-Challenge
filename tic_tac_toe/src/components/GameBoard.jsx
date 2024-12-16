function GameBoard({
  currentBoard = [],
  selectedPlayer,
  handleInput,
  winningLines = [],
}) {
  return (
    <div className='w-full   h-auto '>
      <div className='w-full h-full grid grid-cols-3 gap-0'>
        {currentBoard.map((value, index) => {
          const isWinningSquare = winningLines?.includes(index);
          return (
            <div
              key={index}
              className={`w-22 h-20 md:w-32 md:h-32 text-3xl font-bold ring-[1px] ring-slate-300 flex justify-center items-center
                ${isWinningSquare ? "bg-red-500" : ""}  ${
                value === "A"
                  ? selectedPlayer === "playerA"
                    ? "bg-[#4ed46b] cursor-not-allowed"
                    : "bg-[#f3f3f3] cursor-not-allowed text-slate-950"
                  : value === "B"
                  ? selectedPlayer === "playerB"
                    ? "bg-[#4ed46b] cursor-not-allowed "
                    : "bg-[#f3f3f3] cursor-not-allowed  text-slate-950"
                  : "hover:bg-[#353434] cursor-pointer"
              } transition ease-linear duration-150 `}
              onClick={() => handleInput(index)}
            >
              <p>{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default GameBoard;
