import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord, shuffleLetters } from './words';
import { generateMathProblem } from './math';
import './Executioner.css';

const Executioner = () => {
    // Flow states
    const [gameState, setGameState] = useState('start'); // start, type_select, length_select, op_select, digit_select, playing, won, lost
    const [gameType, setGameType] = useState('letters'); // 'letters' or 'numbers'

    // Letters Mode States
    const [wordLength, setWordLength] = useState(4);
    const [currentWord, setCurrentWord] = useState('');
    const [scrambledLetters, setScrambledLetters] = useState([]);
    const [selectedLetters, setSelectedLetters] = useState([]);

    // Numbers Mode States
    const [operator, setOperator] = useState('+');
    const [digits, setDigits] = useState(1);
    const [mathAnswer, setMathAnswer] = useState('');
    const [mathProblemStr, setMathProblemStr] = useState('');
    const [selectedNumbers, setSelectedNumbers] = useState([]);

    // Shared States
    const [timeLeft, setTimeLeft] = useState(30);
    const [showInstructions, setShowInstructions] = useState(false);
    const [score, setScore] = useState(0);

    const audioCtxRef = useRef(null);

    const initAudio = () => {
        if (!audioCtxRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtxRef.current = new AudioContext();
            }
        }
        if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
    };

    const playWarningBeep = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.5);
    }, []);

    const yellPhrase = useCallback((text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.volume = 1;
            utterance.rate = 1.2;
            utterance.pitch = 1.5;
            window.speechSynthesis.speak(utterance);
        }
    }, []);

    const playThud = useCallback(() => {
        if (!audioCtxRef.current) return;
        const ctx = audioCtxRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(100, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    }, []);

    const startNewRound = () => {
        if (gameType === 'letters') {
            const word = getRandomWord(wordLength);
            setCurrentWord(word);
            const shuffled = shuffleLetters(word).map((char, index) => ({ id: `L${index}`, char }));
            setScrambledLetters(shuffled);
            setSelectedLetters([]);
        } else if (gameType === 'numbers') {
            const problem = generateMathProblem(operator, digits);
            setMathProblemStr(problem.equationString);
            setMathAnswer(problem.mathAnswer);
            setSelectedNumbers([]);
        }
        setTimeLeft(30);
    };

    const startGameLetters = (length) => {
        initAudio();
        setWordLength(length);
        setScore(0);

        const word = getRandomWord(length);
        setCurrentWord(word);
        const shuffled = shuffleLetters(word).map((char, index) => ({ id: `L${index}`, char }));
        setScrambledLetters(shuffled);
        setSelectedLetters([]);
        setTimeLeft(30);

        // Let game start last so state is fully prepared
        setGameState('playing');
    };

    const startGameNumbers = (numDigits) => {
        initAudio();
        setDigits(numDigits);
        setScore(0);

        const problem = generateMathProblem(operator, numDigits);
        setMathProblemStr(problem.equationString);
        setMathAnswer(problem.mathAnswer);
        setSelectedNumbers([]);
        setTimeLeft(30);

        setGameState('playing');
    };

    const handleNextLevel = () => {
        setGameState('playing');
        startNewRound();
    };

    const handleBackToMenu = () => {
        setGameState('start');
        setScore(0);
        setTimeLeft(30);
    };

    // Timer logic
    useEffect(() => {
        let timer;
        if (gameState === 'playing' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => {
                    const newTime = prev - 1;
                    if (newTime <= 0) {
                        setGameState('animating_lost');
                        playThud();
                        yellPhrase("god i am coming");
                        setTimeout(() => setGameState('lost'), 2500);
                        return 0;
                    }
                    if (newTime % 5 === 0 && newTime > 0) yellPhrase("Save me!");
                    if (newTime <= 5 && newTime > 0) playWarningBeep();
                    return newTime;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [gameState, timeLeft, yellPhrase, playWarningBeep, playThud]);

    // Letter verification logic
    useEffect(() => {
        if (gameType === 'letters' && selectedLetters.length === wordLength && gameState === 'playing') {
            const userWord = selectedLetters.map(l => l.char).join('');
            if (userWord === currentWord) {
                setScore(s => s + 1);
                setGameState('animating_won');
                yellPhrase("Bhaago re baba");
                setTimeout(() => setGameState('won'), 2500);
            } else {
                setTimeout(() => setSelectedLetters([]), 500);
            }
        }
    }, [selectedLetters, currentWord, gameState, wordLength, gameType, yellPhrase]);

    // Number verification logic
    useEffect(() => {
        if (gameType === 'numbers' && selectedNumbers.length === mathAnswer.length && gameState === 'playing') {
            const userAnswer = selectedNumbers.join('');
            if (userAnswer === mathAnswer) {
                setScore(s => s + 1);
                setGameState('animating_won');
                yellPhrase("Bhaago re baba");
                setTimeout(() => setGameState('won'), 2500);
            } else {
                setTimeout(() => setSelectedNumbers([]), 500);
            }
        }
    }, [selectedNumbers, mathAnswer, gameState, gameType, yellPhrase]);

    // Letter Handlers
    const handleLetterClick = (letterObj) => {
        if (gameState !== 'playing' || selectedLetters.find(l => l.id === letterObj.id)) return;
        setSelectedLetters(prev => [...prev, letterObj]);
    };
    const handleDeselect = (letterObj) => {
        if (gameState !== 'playing') return;
        setSelectedLetters(prev => prev.filter(l => l.id !== letterObj.id));
    };

    // Number Handlers
    const handleNumberClick = (numStr) => {
        if (gameState !== 'playing' || selectedNumbers.length >= mathAnswer.length) return;
        setSelectedNumbers(prev => [...prev, numStr]);
    };
    const handleNumberDelete = () => {
        if (gameState !== 'playing' || selectedNumbers.length === 0) return;
        setSelectedNumbers(prev => prev.slice(0, -1));
    };


    const executionerProgress = Math.max(0, Math.min(100, ((30 - timeLeft) / 30) * 100));

    // Dynamic slots logic
    const letterSlots = Array.from({ length: wordLength }).map((_, i) => i);
    const mathSlots = Array.from({ length: mathAnswer.length || 1 }).map((_, i) => i);

    return (
        <div className="executioner-container fade-in">
            {/* Header / Score / Timer */}
            <div className="exc-header">
                <div className="exc-score">Saved: <span>{score}</span></div>
                <div className={`exc-timer ${timeLeft <= 5 ? 'danger-pulse' : ''}`}>
                    {timeLeft}s
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    {gameState !== 'start' && gameState !== 'type_select' && gameState !== 'op_select' && gameState !== 'digit_select' && gameState !== 'length_select' && (
                        <button className="exc-btn small-btn" onClick={handleBackToMenu}>Menu</button>
                    )}
                    <button className="exc-btn small-btn" onClick={() => setShowInstructions(true)}>Help</button>
                </div>
            </div>

            {/* Visual Scene */}
            <div className="exc-scene">
                <div className="platform"></div>
                <div className="gallows">
                    <div className="g-base"></div>
                    <div className="g-pole"></div>
                    <div className="g-top"></div>
                    <div className="g-rope" style={{ height: (gameState === 'lost' || gameState === 'animating_lost') ? '60px' : '40px' }}></div>
                </div>
                <div className={`victim ${(gameState === 'lost' || gameState === 'animating_lost') ? 'hanged' : ''} ${(gameState === 'won' || gameState === 'animating_won') ? 'running-away' : ''}`}>
                    <div className="v-head">{(gameState === 'lost' || gameState === 'animating_lost') ? '😵' : (timeLeft <= 10 ? '😨' : '😬')}</div>
                    <div className="v-body"></div>
                    <div className="v-arms"></div>
                    <div className="v-legs"></div>
                </div>
                <div className={`trapdoor ${(gameState === 'lost' || gameState === 'animating_lost') ? 'open' : ''}`}></div>
                <div className="lever-container">
                    <div className={`lever ${(gameState === 'lost' || gameState === 'animating_lost') ? 'pulled' : ''}`}></div>
                </div>
                <div className="executioner-figure" style={{ transform: `translateX(calc(-${100 - executionerProgress}% * 3))` }}>
                    <div className="e-head">🥷</div>
                    <div className="e-body"></div>
                </div>
            </div>

            {/* Gameplay Area (Letters or Numbers) */}
            {(gameState === 'playing' || gameState === 'animating_won' || gameState === 'animating_lost') && gameType === 'letters' && (
                <>
                    <div className="exc-slots">
                        {letterSlots.map(idx => {
                            const sel = selectedLetters[idx];
                            return (
                                <div key={`slot-${idx}`}
                                    className={`exc-slot ${sel ? 'filled' : ''}`}
                                    onClick={() => sel && handleDeselect(sel)}>
                                    {sel ? sel.char : ''}
                                </div>
                            );
                        })}
                    </div>
                    <div className="exc-letters">
                        {scrambledLetters.map((l) => {
                            const isSelected = selectedLetters.find(sl => sl.id === l.id);
                            return (
                                <button
                                    key={l.id}
                                    className={`exc-letter-btn ${isSelected ? 'hidden-letter' : ''}`}
                                    onClick={() => handleLetterClick(l)}
                                    disabled={isSelected || gameState !== 'playing'}
                                >
                                    {l.char}
                                </button>
                            )
                        })}
                    </div>
                </>
            )}

            {(gameState === 'playing' || gameState === 'animating_won' || gameState === 'animating_lost') && gameType === 'numbers' && (
                <>
                    <div className="exc-math-problem">{mathProblemStr}</div>
                    <div className="exc-slots">
                        {mathSlots.map(idx => {
                            const sel = selectedNumbers[idx];
                            return (
                                <div key={`mslot-${idx}`} className={`exc-slot ${sel ? 'filled' : ''}`}>
                                    {sel ? sel : ''}
                                </div>
                            );
                        })}
                    </div>
                    <div className="exc-num-pad">
                        {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'DEL', '0', 'CLR'].map(btn => (
                            <button
                                key={btn}
                                className={`exc-num-btn ${btn === 'DEL' || btn === 'CLR' ? 'action-btn' : ''}`}
                                onClick={() => {
                                    if (btn === 'DEL') handleNumberDelete();
                                    else if (btn === 'CLR') setSelectedNumbers([]);
                                    else handleNumberClick(btn);
                                }}
                            >
                                {btn}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Selection Menus */}
            {gameState === 'start' && (
                <div className="exc-overlay">
                    <div className="exc-modal">
                        <h2>The Executioner</h2>
                        <p>A life is on the line. You have 30 seconds to solve the puzzle.</p>
                        <h3>Choose Category:</h3>
                        <div className="exc-actions row-actions" style={{ marginTop: '20px' }}>
                            <button className="exc-btn primary-btn" onClick={() => { setGameType('letters'); setGameState('length_select'); }}>🔤 Play with Letters</button>
                            <button className="exc-btn primary-btn" onClick={() => { setGameType('numbers'); setGameState('op_select'); }}>🔢 Play with Numbers</button>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'length_select' && (
                <div className="exc-overlay">
                    <div className="exc-modal">
                        <h2>Letters Mode</h2>
                        <h3>Choose Word Size:</h3>
                        <div className="exc-actions row-actions" style={{ marginTop: '20px' }}>
                            <button className="exc-btn primary-btn" onClick={() => startGameLetters(3)}>3 Letters</button>
                            <button className="exc-btn primary-btn" onClick={() => startGameLetters(4)}>4 Letters</button>
                            <button className="exc-btn primary-btn" onClick={() => startGameLetters(5)}>5 Letters</button>
                        </div>
                        <button className="exc-btn" style={{ marginTop: '20px' }} onClick={() => setGameState('start')}>Back</button>
                    </div>
                </div>
            )}

            {gameState === 'op_select' && (
                <div className="exc-overlay">
                    <div className="exc-modal">
                        <h2>Numbers Mode</h2>
                        <h3>Choose Operator:</h3>
                        <div className="exc-actions row-actions" style={{ marginTop: '20px' }}>
                            <button className="exc-btn primary-btn" style={{ fontSize: '1.5rem', width: '60px' }} onClick={() => { setOperator('+'); setGameState('digit_select'); }}>➕</button>
                            <button className="exc-btn primary-btn" style={{ fontSize: '1.5rem', width: '60px' }} onClick={() => { setOperator('-'); setGameState('digit_select'); }}>➖</button>
                            <button className="exc-btn primary-btn" style={{ fontSize: '1.5rem', width: '60px' }} onClick={() => { setOperator('*'); setGameState('digit_select'); }}>✖️</button>
                            <button className="exc-btn primary-btn" style={{ fontSize: '1.5rem', width: '60px' }} onClick={() => { setOperator('/'); setGameState('digit_select'); }}>➗</button>
                        </div>
                        <button className="exc-btn" style={{ marginTop: '20px' }} onClick={() => setGameState('start')}>Back</button>
                    </div>
                </div>
            )}

            {gameState === 'digit_select' && (
                <div className="exc-overlay">
                    <div className="exc-modal">
                        <h2>Complexity</h2>
                        <h3>Choose Number of Digits:</h3>
                        <div className="exc-actions row-actions" style={{ marginTop: '20px' }}>
                            {[1, 2, 3, 4].map(num => (
                                <button key={num} className="exc-btn primary-btn" onClick={() => startGameNumbers(num)}>{num} Digit</button>
                            ))}
                        </div>
                        <button className="exc-btn" style={{ marginTop: '20px' }} onClick={() => setGameState('op_select')}>Back</button>
                    </div>
                </div>
            )}

            {/* Results Modals */}
            {gameState === 'won' && (
                <div className="exc-overlay">
                    <div className="exc-modal victory">
                        <h2>Solved!</h2>
                        <p className="exc-word-reveal">{gameType === 'letters' ? currentWord : mathAnswer}</p>
                        <p>You bought them some time...</p>
                        <div className="exc-actions">
                            <button className="exc-btn primary-btn" onClick={handleNextLevel}>Next (Continue 30s)</button>
                            <button className="exc-btn" onClick={handleBackToMenu}>Main Menu</button>
                        </div>
                    </div>
                </div>
            )}

            {gameState === 'lost' && (
                <div className="exc-overlay">
                    <div className="exc-modal defeat">
                        <h2>Execution Complete</h2>
                        <p>The correct answer was: <br /> <strong>{gameType === 'letters' ? currentWord : `${mathProblemStr} ${mathAnswer}`}</strong></p>
                        <p>You lost.</p>
                        <div className="exc-actions row-actions" style={{ marginTop: '20px' }}>
                            <button className="exc-btn primary-btn" onClick={() => {
                                if (gameType === 'letters') startGameLetters(wordLength);
                                else startGameNumbers(digits);
                            }}>Try Again</button>
                            <button className="exc-btn" onClick={handleBackToMenu}>Menu</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Help / Instructions */}
            {showInstructions && (
                <div className="exc-overlay instructions-overlay">
                    <div className="exc-modal">
                        <h2>Instructions</h2>
                        <ul className="exc-rules">
                            <li><strong>Letters:</strong> Click the letters to form a meaningful word.</li>
                            <li><strong>Numbers:</strong> Solve the math problem using the number pad.</li>
                            <li>You have 30 seconds before the Executioner pulls the lever!</li>
                            <li>Make a correct guess to save the victim and start a fresh timer!</li>
                        </ul>
                        <button className="exc-btn" onClick={() => setShowInstructions(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Executioner;
