import Board from './Components/Board';
import './App.css';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';

function App() {
  const { gameState } = useGame();

  return (
    <div className="MMApp">
      {
        gameState.roomId && gameState.gameStarted ? 
        <Board />
          : 
        <Lobby />
      }
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
