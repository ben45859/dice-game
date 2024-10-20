import React from 'react';

const GameControls = ({ onRoll, onHold, disabled }) => {
  return (
    <div className="game-controls">
      <button onClick={onRoll} disabled={disabled}>
        Roll Dice
      </button>
      <button onClick={onHold} disabled={disabled}>
        Hold
      </button>
    </div>
  );
};

export default GameControls;