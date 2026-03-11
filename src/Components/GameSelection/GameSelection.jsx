import React from 'react';
import { FaGamepad, FaChess, FaPuzzlePiece, FaChartPie, FaQuestionCircle, FaSkullCrossbones } from 'react-icons/fa';
import './GameSelection.css';

function GameSelection({ onSelectGame }) {
    const games = [
        {
            id: 'tic-tac-toe',
            name: 'Tic Tac Toe',
            icon: <FaGamepad />,
            description: 'Classic strategy game for 2 players',
            active: true,
            color: 'var(--primary)'
        },
        {
            id: 'executioner',
            name: 'Executioner',
            icon: <FaSkullCrossbones />,
            description: 'Save a life by solving the 5-letter word puzzle before time runs out!',
            active: true,
            color: '#ff4d4d'
        },
        {
            id: 'bubble-game',
            name: 'Bubble Game',
            icon: <FaChartPie />, // Using a chart icon as a placeholder for bubbles or similar
            description: 'Click matching bubbles before time runs out!',
            active: true,
            color: 'var(--accent-neon)' // Using existing variable
        },
        {
            id: 'guess-my-number',
            name: 'Guess My Number',
            icon: <FaQuestionCircle />,
            description: 'Find the secret number between 1 and 20!',
            active: true,
            color: 'var(--accent-pink)' // Reusing pink accent
        },
        {
            id: 'coming-soon-1',
            name: 'Chess',
            icon: <FaChess />,
            description: 'Coming Soon',
            active: false,
            color: 'var(--text-muted)'
        }
    ];

    return (
        <div className="selection-container fade-in">
            <header className="selection-header">
                <h1 className="main-title">Sanjay's <span className="title-highlight">Gaming Club</span></h1>
                <p className="subtitle">Choose your challenge</p>
            </header>

            <div className="games-grid">
                {games.map((game) => (
                    <div
                        key={game.id}
                        className={`game-card ${!game.active ? 'disabled' : ''}`}
                        onClick={() => game.active && onSelectGame(game.id)}
                        style={{ '--card-color': game.color }}
                    >
                        <div className="card-bg-glow"></div>
                        <div className="card-icon">
                            {game.icon}
                        </div>
                        <h3 className="card-title">{game.name}</h3>
                        <p className="card-description">{game.description}</p>
                        {game.active && <button className="play-btn">Play Now</button>}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameSelection;
