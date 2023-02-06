import { useEffect, useState } from 'react';
import Board from './Components/Board';
import './App.css';
import { PawnProvider } from './Contexts/PawnContext';
import { PlayerProvider } from './Contexts/PlayerContext';
import { TilesProvider } from './Contexts/TilesContext';
import { useGame } from './Contexts/GameContext';
import Lobby from './Components/Lobby';
import { firestore } from "./Firestore";
import { onSnapshot } from "firebase/firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { Stack, Button, TextField, List, ListItem, Paper } from '@mui/material';
import { useDB } from './Contexts/DBContext';

function App() {
  const { dbState, dbDispatch } = useDB();
  const { gameState } = useGame();
  const gamesRef = firestore.collection('games')

  const [gameDoc, setGameDoc] = useState(null);

  const [currentGame] = useDocumentData(gameDoc);

  useEffect(() => {
    if (gameState.roomId) {
      setGameDoc(gamesRef.doc(gameState.roomId))
    }
  }, [gameState.roomId])

  // is this causing device to crash?
  // what was this for again??
  // useEffect(() => {
  //   if (gameDoc) {
  //     onSnapshot(gameDoc, doc => {
  //       dbDispatch({type: "update", value: doc.data()})
  //     })
  //   }
  // }, [gameDoc])

  return (
    <div className="MMApp">
      <PlayerProvider>
        <TilesProvider>
          <PawnProvider>
            {
              gameState.roomId && currentGame && currentGame.gameStarted ? 
              <Board />
                : 
              <Lobby />
            }
          </PawnProvider>
        </TilesProvider>
      </PlayerProvider>
    </div>
  );
}

export default App;
