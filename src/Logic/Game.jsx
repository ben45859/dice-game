import React, { useReducer, useEffect, useState, useCallback } from 'react';
import { gameReducer } from './GameReducer';
import Dice from '../components/Dice';
import GameControls from '../components/GameControls';
import PlayerScore from '../components/PlayerScore';
import ScoreBoard from '../components/ScoreBoard';
import '../App.css';

const initialState = {
    status: "PLAYING",
    roundScore: 0,
    winningScore: 100,
    turn: "HUMAN",
    playerScore: { HUMAN: 0, AI: 0 },
    winCount: { HUMAN:0, AI: 0},
    lastRoll: [0, 0],
    doubleSix: false
};

export default function Game() {
    const [gameState, dispatch] = useReducer(gameReducer, initialState);
    const [winningScoreInput, setWinningScoreInput] = useState(100);
    const [audioContext, setAudioContext] = useState(null);
    const [isRolling, setIsRolling] = useState(false);

    useEffect(() => {
        const context = new (window.AudioContext || window.webkitAudioContext)();
        setAudioContext(context);

        // Load game state from local storage on component mount
        const savedGameState = localStorage.getItem('gameState');
        if(savedGameState) {
            const parsedData = JSON.parse(savedGameState);
            dispatch({ 
                type: 'newGame', 
                payload: parsedData
             });
        }

        return () => {
            if(context) {
                context.close();
            }
        };
    }, []);

    useEffect(() => {
        // Save game state to local storage whenever it changes
        localStorage.setItem('gameState', JSON.stringify(gameState));
    }, [gameState]);

    const rollDice = useCallback(() => {
        if(gameState.status !== "PLAYING") return;
        if(isRolling) return;

        const dice1 = Math.floor(Math.random() * 6) + 1;
        const dice2 = Math.floor(Math.random() * 6) + 1;
        setIsRolling(true);
        setTimeout(() => {
            dispatch({ type: 'roll', dices: [dice1, dice2] });
            playSound(audioContext, 'roll');
            setIsRolling(false);
        if(dice1 === 6 && dice2 === 6) {
            setTimeout(() => {
                alert('Double Six! You lose your round score!');
            }, 1000);
        }
        }, 1000);
    }, [audioContext, isRolling]);

    const hold = () => {
        if(gameState.status !== "PLAYING") return;
        dispatch({ type: 'hold' });
        playSound(audioContext, 'hold');
    };

    const startNewGame = () => {
        dispatch({ type: 'newGame', winningScore: winningScoreInput });
        playSound(audioContext, 'newGame');
    };

    const resetGame = () => {
        dispatch({ type: 'reset', winningScore: winningScoreInput });
        playSound(audioContext, 'reset');
    };

    const playAITurn = useCallback(() => {
        if(gameState.status !== "PLAYING" || gameState.turn !== "AI" || isRolling) return;

        if (gameState.roundScore >= 20) {
            hold();
        } else {
            rollDice();
        }
    }, [gameState.status, gameState.turn, gameState.roundScore, isRolling, rollDice, hold]);

    useEffect(() => {
        if(gameState.turn === "AI" && gameState.status === "PLAYING" && !isRolling) {
            const timerId = setTimeout(playAITurn, 1000);
            return () => clearTimeout(timerId);
        }
    }, [gameState.turn, gameState.status, isRolling, playAITurn]);

    const playSound = (context, type) => {
        if(!context) return;
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
    
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
    
        switch(type) {
            case 'roll':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(440, context.currentTime);
                break;
            case 'hold':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(660, context.currentTime);
                break;
            case 'newGame':
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(880, context.currentTime);
            case 'reset':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(523.25, context.currentTime);
                break;
            default:
                return;
        }
    
        gainNode.gain.setValueAtTime(1, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 1);
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 1);
    };
    

    return (
        <div className="game-container">
            <h1>Dice Game</h1>
            <ScoreBoard
                playerScore={gameState.playerScore}
                winCount={gameState.winCount}
                currentTurn={gameState.turn}
            />
            <div className="game-info">
                <p>Current Round Score: {gameState.roundScore}</p>
                <p>Current Turn: {gameState.turn}</p>
                <p>Game Status: {gameState.status}</p>
            </div>
            <Dice dice1={gameState.lastRoll[0]} dice2={gameState.lastRoll[1]} isRolling={isRolling} />
            {gameState.doubleSix && (
                <div className="double-six-message">
                    <p>Double Six! You lose your turn!</p>
                </div>
            )}
            <GameControls
                onRoll={rollDice}
                onHold={hold}
                disabled={gameState.status !== "PLAYING" || gameState.turn !== "HUMAN" || isRolling}
            />
            <div className="new-game">
                <input
                    type="number"
                    value={winningScoreInput}
                    onChange={(e) => setWinningScoreInput(parseInt(e.target.value, 10))}
                    min="1"
                />
                <button onClick={startNewGame}>New Game</button>
                <button onClick={resetGame}>Reset Game</button>
            </div>
            <PlayerScore
                player="HUMAN"
                score={gameState.playerScore.HUMAN}
                isCurrentTurn={gameState.turn === "HUMAN"}
            />
            <PlayerScore
                player="AI"
                score={gameState.playerScore.AI}
                isCurrentTurn={gameState.turn === "AI"}
            />
        </div>
    );
}