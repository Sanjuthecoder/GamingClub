import React, { useState, useEffect, useRef } from 'react';
import { FaRedo, FaTrophy, FaStar, FaMusic } from 'react-icons/fa';
import './GuessMyNumber.css';

function GuessMyNumber() {
    const [secretNumber, setSecretNumber] = useState(generateSecretNumber());
    const [score, setScore] = useState(20); // Standard starting score is usually 20 in this game
    const [highscore, setHighscore] = useState(0);
    const [guess, setGuess] = useState('');
    const [message, setMessage] = useState('Start guessing...');
    const [isWon, setIsWon] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const audioRef = useRef(null);
    const inputRef = useRef(null);

    function generateSecretNumber() {
        return Math.trunc(Math.random() * 20) + 1;
    }

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            // Attempt autoplay
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    setIsPlaying(true);
                }).catch(() => {
                    setIsPlaying(false);
                });
            }
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        };
    }, []);

    const toggleAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleCheck = () => {
        const guessNum = Number(guess);

        if (!guess) {
            setMessage('⛔️ No number!');
            return;
        }

        if (guessNum === secretNumber) {
            setMessage('🎉 Correct Number!');
            setIsWon(true);
            if (score > highscore) setHighscore(score);
        } else {
            if (score > 1) {
                setMessage(guessNum > secretNumber ? '📈 Too high!' : '📉 Too low!');
                setScore(score - 1);
            } else {
                setMessage('💥 You lost the game!');
                setScore(0);
            }
        }
        setGuess('');
        inputRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    const handleReset = () => {
        setScore(20);
        setSecretNumber(generateSecretNumber());
        setMessage('Start guessing...');
        setGuess('');
        setIsWon(false);
        setTimeout(() => inputRef.current?.focus(), 10);
    };

    return (
        <div className="guess-game-wrapper fade-in">
            <div className="guess-card">
                <header className="guess-header">
                    <div className="guess-title-group">
                        <h1 className="guess-title">Guess My Number</h1>
                        <p className="guess-subtitle">Between 1 and 20</p>
                    </div>
                    <button className="again-btn" onClick={handleReset}>
                        <FaRedo /> Again
                    </button>
                </header>

                <div className="guess-content">
                    <section className="guess-section-left">
                        <div className={`secret-box ${isWon ? 'revealed' : ''}`}>
                            {isWon ? secretNumber : '?'}
                        </div>
                        <div className="input-group">
                            <input
                                ref={inputRef}
                                type="number"
                                className="guess-input"
                                value={guess}
                                onChange={(e) => setGuess(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="#"
                                disabled={isWon || score === 0}
                            />
                            <button
                                className="check-btn"
                                onClick={handleCheck}
                                disabled={isWon || score === 0}
                            >
                                Check!
                            </button>
                        </div>
                    </section>

                    <section className="guess-section-right">
                        <p className="message" style={{ color: isWon ? 'var(--accent-neon)' : 'inherit' }}>
                            {message}
                        </p>
                        <div className="stat-item">
                            <FaStar color="var(--accent-pink)" />
                            <span>Score:</span>
                            <span className="stat-value">{score}</span>
                        </div>
                        <div className="stat-item">
                            <FaTrophy color="gold" />
                            <span>Highscore:</span>
                            <span className="stat-value">{highscore}</span>
                        </div>
                    </section>
                </div>

                <div
                    className={`audio-control-mini ${isPlaying ? 'playing' : ''}`}
                    onClick={toggleAudio}
                    title={isPlaying ? "Pause Music" : "Play Music"}
                >
                    <FaMusic />
                    <audio ref={audioRef} src="/music/calmdown.mpeg" loop />
                </div>
            </div>
        </div>
    );
}

export default GuessMyNumber;
