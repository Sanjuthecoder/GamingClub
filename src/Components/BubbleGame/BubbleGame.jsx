import React, { useState, useEffect } from 'react';
import { FaRedo } from 'react-icons/fa';
import './BubbleGame.css';
import { playMoveSound, playWinSound } from '../../Helpers/SoundController'; // Reusing sounds

function BubbleGame() {
    const [timer, setTimer] = useState(60);
    const [score, setScore] = useState(0);
    const [hit, setHit] = useState(0);
    const [bubbles, setBubbles] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);

    // Initialize game
    useEffect(() => {
        startNewGame();
    }, []);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (!isGameOver && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsGameOver(true);
            playWinSound(); // Play sound on game over using existing helper
        }
        return () => clearInterval(interval);
    }, [timer, isGameOver]);

    const generateBubbles = () => {
        const newBubbles = [];
        for (let i = 0; i < 119; i++) { // Adjusted count for fit
            newBubbles.push(Math.floor(Math.random() * 10));
        }
        setBubbles(newBubbles);
    };

    const getNewHit = () => {
        setHit(Math.floor(Math.random() * 10));
    };

    const startNewGame = () => {
        setScore(0);
        setTimer(60);
        setIsGameOver(false);
        generateBubbles();
        getNewHit();
    };

    const handleBubbleClick = (value) => {
        if (value === hit) {
            playMoveSound("O"); // Reuse existing sound
            setScore((prev) => prev + 10);
            getNewHit();
            generateBubbles();
        } else {
            // Maybe play a different sound or visual feedback for wrong hit?
            // For now, doing nothing as per original logic
        }
    };

    return (
        <div className="bubble-game-wrapper fade-in">
            <div className="panel">
                <div className="panel-top">
                    <div className="panel-elem">
                        <h2>Hit</h2>
                        <div className="box">{hit}</div>
                    </div>
                    <div className="panel-elem">
                        <h2>Timer</h2>
                        <div className="box">{timer}</div>
                    </div>
                    <div className="panel-elem">
                        <h2>Score</h2>
                        <div className="box">{score}</div>
                    </div>
                </div>

                <div className="panel-btm">
                    {isGameOver ? (
                        <div className="game-over">
                            <h2>Game Over! <br /> Your Score: {score}</h2>
                            <button className="play-again-btn" onClick={startNewGame}>
                                <FaRedo /> Play Again
                            </button>
                        </div>
                    ) : (
                        bubbles.map((num, idx) => (
                            <div
                                key={idx}
                                className="bubble"
                                onClick={() => handleBubbleClick(num)}
                            >
                                {num}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default BubbleGame;
