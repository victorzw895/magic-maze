import { useState, useEffect, useRef, ReactNode } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawns from './Pieces/Pawns';
import PlayerArea from './PlayerArea';
import './Board.scss';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import Draggable from 'react-draggable';
import useHighlightArea from '../utils/useHighlightArea';
import Timer from './Timer';
import Pinged from './Pinged';
import { useGameStartedDocState } from '../Contexts/FirestoreContext';
import { getDoc, setDoc } from '../utils/useFirestore';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { allTiles } from '../Data/all-tiles-data';
import { Room, DBPlayer } from '../types';
import Objectives from './Objectives';
import GameOver from './GameOver';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const BoardComponent = ({timer, pinged, children}: {timer: ReactNode, pinged: ReactNode, children: ReactNode}) => {
  console.log('*** Board Component re render')
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  return (
    <>
      <Objectives /> {/* minimize when playing, can click to expand */}
      {gameStarted ? timer : <></>}
      <Draggable
        nodeRef={draggableNodeRef}
        defaultPosition={{x: 0, y: 0}}
        >
        <div ref={draggableNodeRef} className="playable-area">
          {availableArea.length > 0 && availableArea.map(newTileArea => {
            return (
              <NewTileArea 
                key={`${newTileArea.gridPosition[0]}-${newTileArea.gridPosition[1]}`} 
                tile={newTileArea} 
                clearHighlightAreas={clearHighlightAreas} 
                />
            )
          })}
          {children}
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={highlightNewTileArea}>
        {pinged}
      </PlayerArea>
    </>
  );
};


const Board = () => {
  const { gameState, gameDispatch } = useGame();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {

    // load stuff
    // once loaded add undisable start game button
    // countdown to start or just start
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound = docSnap.data() as Room;
    
    // set player actions
    const dbPlayers = assignRandomActions(roomFound.players)
    const firstTile = allTiles.find(tile => tile.id === "1a");
    const initTile = {
      ...firstTile,
      gridPosition: [8, 8]
    }

    await setDoc(gameState.roomId, 
      { 
        players: dbPlayers, 
        tiles: [initTile],
        pawns: pawnDBInitialState
      }
    )
    setLoading(false);
    })()
  }, [gameState.gameStarted])

  const startGame = async () => {
    await setDoc(gameState.roomId, 
      { 
        gameStarted: true,
      }
    )
  }

  return (
    <div className="Board">
      {/* Loading board components use MUI Backdrop + Progress */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        {loading ? 'Loading Assets' : 
          <Button variant='contained' onClick={startGame}>Start</Button>
        }
      </Backdrop>
      <BoardComponent
        timer={<Timer />}
        pinged={<Pinged />}
      >
        <Tiles />
        {!loading && <Pawns />}
      </BoardComponent>
      {/* IF WON Component use MUI Backdrop and Win message or modal*/}
      <GameOver />
    </div>
  );
};

// Board.whyDidYouRender = true
// BoardComponent.whyDidYouRender = true;

export default Board;