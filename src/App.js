import Board from './Components/Board';
import './App.css';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { useLoadingDocState } from './Contexts/FirestoreContext';

function App() {
  const { gameState } = useGame();
  const { loadBoard } = useLoadingDocState();

  return (
    <div className="MMApp">
      {
        gameState.roomId && loadBoard ? 
        <Board />
          : 
        <Lobby />
      }
    </div>
  );
}

// App.whyDidYouRender = true;

export default App;
