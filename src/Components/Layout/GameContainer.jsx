import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import './GameContainer.css';

function GameContainer({ title, onBack, children }) {
    return (
        <div className="game-container fade-in">
            <header className="game-header">
                <button className="back-btn" onClick={onBack}>
                    <FaArrowLeft /> Back
                </button>
                <h1 className="game-title">{title}</h1>
                <div className="header-spacer"></div> {/* For centering title */}
            </header>
            <main className="game-content">
                {children}
            </main>
        </div>
    );
}

export default GameContainer;
