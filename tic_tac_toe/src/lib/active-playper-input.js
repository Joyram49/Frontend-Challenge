export const activePlayerInput = (selectedPlayer, currentStep) => {
  let activePlayer;
  if (selectedPlayer === "playerA" && currentStep % 2 === 0) {
    activePlayer = "A";
  } else if (selectedPlayer === "playerA" && currentStep % 2 !== 0) {
    activePlayer = "B";
  } else if (selectedPlayer === "playerB" && currentStep % 2 === 0) {
    activePlayer = "B";
  } else {
    activePlayer = "A";
  }
  return activePlayer;
};
