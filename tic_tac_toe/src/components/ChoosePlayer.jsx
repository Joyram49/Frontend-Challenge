// eslint-disable-next-line react/prop-types
function ChoosePlayer({ selectedPlayer, currentStep, setSelectedPlayer }) {
  const handlePlayerSelection = (player) => {
    if (currentStep === 0) {
      if (selectedPlayer) {
        if (selectedPlayer === player) {
          setSelectedPlayer(null);
        } else {
          setSelectedPlayer(player);
        }
      } else {
        setSelectedPlayer(player);
      }
    }
  };
  return (
    <div className='my-10 flex flex-col items-center md:flex-row gap-4 '>
      <p>Choose the first player:</p>
      <button
        className={`border-[1px]  border-slate-50/10 drop-shadow-sm px-3 py-1 rounded-sm hover:bg-[#e6e4e4] transition ease-linear duration-150  hover:text-slate-950 disabled:cursor-auto ${
          selectedPlayer === "playerA"
            ? "bg-[#4ed46b]"
            : "bg-[#f3f3f3] text-slate-950"
        }`}
        onClick={() => handlePlayerSelection("playerA")}
        disabled={currentStep > 0}
      >
        Player A
      </button>
      <button
        className={`border-[1px]  border-slate-50/10 drop-shadow-sm px-3 py-1 rounded-sm hover:bg-[#e6e4e4] transition ease-linear duration-150  hover:text-slate-950 disabled:hover:bg-inherit ${
          selectedPlayer === "playerB"
            ? "bg-[#4ed46b]"
            : "bg-[#f3f3f3] text-slate-950"
        }`}
        onClick={() => handlePlayerSelection("playerB")}
        disabled={currentStep > 0}
      >
        Player B
      </button>
    </div>
  );
}

export default ChoosePlayer;
