export function gameReducer(gameState, action) {
  switch (action.type) {
    case "roll":
      return handleRoll(gameState, action.dices);
    case "hold":
      return handleHold(gameState);
    case "newGame":
      return handleNewGame(gameState, action.winningScore);
    case "reset":
      return handleReset(action.winningScore);
    default:
      throw new Error("Unknown action");
  }
}

function handleRoll(gameState, dices) {
  const [dice1, dice2] = dices;

  if (gameState.status !== "PLAYING") {
    return gameState;
  }

  if (dice1 == 6 && dice2 == 6) {
    return {
      ...gameState,
      roundScore: 0,
      lastRoll: [dice1, dice2],
      doubleSix: true,
      turn: gameState.turn === "HUMAN" ? "AI" : "HUMAN"
    };
  }

  return {
    ...gameState,
    roundScore: gameState.roundScore + dice1 + dice2,
    lastRoll: [dice1, dice2],
    doubleSix: false
  };
}

function handleHold(gameState) {
  if (gameState.status !== "PLAYING") {
    return gameState;
  }

  const { turn, roundScore, winningScore, playerScore } = gameState;
  const newScore = playerScore[turn] + roundScore;

  const newState = {
    ...gameState,
    playerScore: {
      ...gameState.playerScore,
      [turn]: newScore
    },
    roundScore: 0,
    turn: nextTurn(turn)
  };

  if (newScore >= winningScore) {
    newState.status = "OVER";
    newState.winCount = {
      ...gameState.winCount,
      [turn]: gameState.winCount[turn] + 1
    };
  }
  return newState;
}

function handleNewGame(gameState, winningScore) {
    return {
        ...gameState,
        status: "PLAYING",
        roundScore: 0,
        winningScore: winningScore || gameState.winningScore,
        turn: "HUMAN",
        playerScore: { HUMAN: 0, AI:0 },
        lastRoll: [0,0],
        doubleSix: false
    };
}

function handleReset(winningScore) {
    return {
        status: "PLAYING",
        roundScore: 0,
        winningScore: winningScore || 100,
        turn: "HUMAN",
        playerScore: { HUMAN: 0, AI: 0 },
        winCount: { HUMAN: 0, AI: 0},
        lastRoll: [0, 0],
        doubleSix: false
    };
}
function nextTurn(turn) {
  return turn === "HUMAN" ? "AI" : "HUMAN";
}
