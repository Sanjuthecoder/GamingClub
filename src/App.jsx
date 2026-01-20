import { useState } from 'react';
import GameSelection from './Components/GameSelection/GameSelection';
import Grid from './Components/Grid/Grid';
import BubbleGame from './Components/BubbleGame/BubbleGame';
import GuessMyNumber from './Components/GuessMyNumber/GuessMyNumber';
import GameContainer from './Components/Layout/GameContainer';
import './App.css';

function App() {
  const [activeGame, setActiveGame] = useState(null);

  const handleGameSelect = (gameId) => {
    setActiveGame(gameId);
  };

  const handleBack = () => {
    setActiveGame(null);
  };

  return (
    <div className="app">
      {!activeGame ? (
        <GameSelection onSelectGame={handleGameSelect} />
      ) : (
        <GameContainer
          title={activeGame === 'tic-tac-toe' ? 'Tic Tac Toe' : 'Game'}
          onBack={handleBack}
        >
          {activeGame === 'tic-tac-toe' && <Grid numberOfCards={9} />}
          {activeGame === 'bubble-game' && <BubbleGame />}
          {activeGame === 'guess-my-number' && <GuessMyNumber />}
        </GameContainer>
      )}
    </div>
  );
}

export default App;
