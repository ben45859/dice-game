import React from 'react';

const PlayerScore = ({ player, score, isCurrentTurn }) => {
  return (
    <div className={`player-score ${isCurrentTurn ? 'active' : ''}`} style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
      <h3>{player === 'HUMAN' ? 'Human Player' : 'AI Player'}</h3>
      <div>
        <p>Score: {score}</p>
      </div>
    </div>
  );
};

export default PlayerScore;
