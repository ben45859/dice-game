import React from 'react';

const ScoreBoard = ({ playerScore, winCount, currentTurn }) => {
  return (
    <div className="score-board">
      <div className={`player ${currentTurn === 'HUMAN' ? 'active' : ''}`}>
        <h2>Human Player</h2>
        <p>Score: {playerScore.HUMAN}</p>
        <p>Wins: {winCount.HUMAN}</p>
      </div>
      <div className={`player ${currentTurn === 'AI' ? 'active' : ''}`}>
        <h2>AI Player</h2>
        <p>Score: {playerScore.AI}</p>
        <p>Wins: {winCount.AI}</p>
      </div>
    </div>
  );
};

export default ScoreBoard;