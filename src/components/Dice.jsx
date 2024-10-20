import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

const DiceIcon = ({ value }) => {
  switch (value) {
    case 1: return <Dice1 size={48} />;
    case 2: return <Dice2 size={48} />;
    case 3: return <Dice3 size={48} />;
    case 4: return <Dice4 size={48} />;
    case 5: return <Dice5 size={48} />;
    case 6: return <Dice6 size={48} />;
    default: return null;
  }
};

const Dice = ({ dice1, dice2, isRolling }) => {
  return (
    <div className={`dice-container ${isRolling ? 'rolling' : ''}`}>
      <DiceIcon value={dice1} />
      <DiceIcon value={dice2} />
    </div>
  );
};

export default Dice;