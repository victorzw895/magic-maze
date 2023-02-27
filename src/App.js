import Board from './Components/Board';
import './App.css';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { useGameStartedDocState } from './Contexts/FirestoreContext';

function App() {
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState()

  return (
    <div className="MMApp">
      {
        gameState.roomId && gameStarted ? 
        <Board />
          : 
        <Lobby />
      }
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
