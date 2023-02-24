import Board from './Components/Board';
import './App.css';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { useFirestore, useGameStartedDocState } from './Contexts/FirestoreContext';
import { useDocData } from './utils/useFirestore';

function App() {
  console.log('running app')
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState()
  // const [gameStarted] = useFirestore((room) => room.gameStarted)
  // const [room] = useDocData(gameState.roomId);

  // const { gameStarted } = room;

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


// import Board from './Components/Board';
// import './App.css';
// import { useGame } from './Contexts/GameContext';
// import Lobby from './Components/Lobby';
// import { useGameStartedDocState } from './Contexts/FirestoreContext';

// function App() {
//   console.log('running app')
//   const { gameState } = useGame();
//   const gameStarted = useGameStartedDocState()

//   return (
//     <div className="MMApp">
//       {
//         gameState.roomId && gameStarted ? 
//         <Board />
//           : 
//         <Lobby />
//       }
//     </div>
//   );
// }

// App.whyDidYouRender = true;

// export default App;
