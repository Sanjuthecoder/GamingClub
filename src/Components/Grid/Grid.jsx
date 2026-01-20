import { useState } from "react";
import Card from "../Cards/Card";
import "./Grid.css"
import isWinner from "../../Helpers/checkWinner";
import { FaRedo } from 'react-icons/fa';
import { playMoveSound, playWinSound, playResetSound } from "../../Helpers/SoundController";

function Grid({ numberOfCards }) {
    const [board, setBoard] = useState(Array(numberOfCards).fill(""));
    const [turn, setTurn] = useState(true); // true = O, false = X
    const [winner, setWinner] = useState(null);
    const [isDraw, setIsDraw] = useState(false);

    function play(index) {
        if (winner || board[index]) return; // Prevent play if won or cell taken

        const newBoard = [...board];
        newBoard[index] = turn ? "O" : "X";

        // Play sound for the move
        playMoveSound(turn ? "O" : "X");

        const win = isWinner({ board: newBoard, symbol: turn ? "O" : "X" });

        if (win) {
            setWinner(win);
            playWinSound(); // Play victory sound
        } else if (!newBoard.includes("")) {
            setIsDraw(true);
        }

        setBoard(newBoard);
        setTurn(!turn);
    }

    function reset() {
        playResetSound();
        setTurn(true);
        setWinner(null);
        setIsDraw(false);
        setBoard(Array(numberOfCards).fill(""))
    }

    return (
        <div className="grid-wrapper fade-in">
            <div className="game-info">
                <div className={`player-turn ${turn ? 'active' : ''} player-o`}>
                    <span>Player O</span>
                </div>
                <div className={`player-turn ${!turn ? 'active' : ''} player-x`}>
                    <span>Player X</span>
                </div>
            </div>

            <div className={`grid-container ${turn ? 'turn-o' : 'turn-x'}`}>
                <div className="grid">
                    {board.map((el, idx) => (
                        <Card
                            gameEnd={!!winner}
                            key={idx}
                            player={el}
                            onPlay={play}
                            index={idx}
                        />
                    ))}
                </div>

                {(winner || isDraw) && (
                    <div className="winner-overlay">
                        <div className="winner-content">
                            <h2 className="winner-text">
                                {winner ? `${winner} Wins!` : "Match Draw!"}
                            </h2>
                            <button className="reset-btn" onClick={reset}>
                                <FaRedo /> Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {!winner && !isDraw && (
                <button className="reset-btn-small" onClick={reset}>
                    Reset Board
                </button>
            )}
        </div>
    );
}

export default Grid;