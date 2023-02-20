import Board from './Components/Board';
import './App.css';
import { PawnProvider } from './Contexts/PawnContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import { TilesProvider } from './Contexts/TilesContext';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { useGameStartedDocState } from './Contexts/FirestoreContext';

function App() {
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState()

  return (
    <div className="MMApp">
      {/* <PlayerProvider> */}
        {/* <TilesProvider>
          <PawnProvider> */}
            {
              gameState.roomId && gameStarted ? 
              <Board />
                : 
              <Lobby />
            }
          {/* </PawnProvider>
        </TilesProvider> */}
      {/* </PlayerProvider> */}
    </div>
  );
}

App.whyDidYouRender = true;

export default App;
