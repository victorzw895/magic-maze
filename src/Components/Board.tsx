import { useEffect, useRef, ReactNode } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawns from './Pieces/Pawns';
import PlayerArea from './PlayerArea';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import Draggable from 'react-draggable';
import useHighlightArea from '../utils/useHighlightArea';
import Timer from './Timer';
import Pinged from './Pinged';
import { useGameStartedDocState } from '../Contexts/FirestoreContext';
import { usePlayerState } from '../Contexts/PlayerContext';
import { usePlayerDocState } from '../Contexts/FirestoreContext';
import { getDoc } from '../utils/useFirestore';
import { Room } from '../types';
import Objectives from './Objectives';

const BoardComponent = ({timer, pinged, children}: {timer: ReactNode, pinged: ReactNode, children: ReactNode}) => {
  console.log('*** Board Component re render')
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  const playerState = usePlayerState();
  const {setPlayer, setPlayers} = usePlayerDocState();

  useEffect(() => {
    (async () => {
      if (!gameStarted) return;

      const docSnap = await getDoc(gameState.roomId);
      if (!docSnap.exists()) return;
      const roomFound = docSnap.data() as Room;

      setPlayers(roomFound.players);
      const currentPlayer = roomFound.players.find((player) => player.number === playerState.number);
      if (!currentPlayer) return;
      setPlayer(currentPlayer);
    })()
  }, [gameStarted])

  return (
    <>
      {gameStarted ? timer : <></>}
      <Objectives /> {/* minimize when playing, can click to expand */}
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
        {/* TODO take pinged value from room as props*/}
        {pinged}
      </PlayerArea>
    </>
  );
};


const Board = () => {
  return (
    <div className="Board">
      {/* Loading board components use MUI Backdrop + Progress */}
      <BoardComponent
        timer={<Timer />}
        pinged={<Pinged />}
      >
        <Tiles />
        <Pawns />
      </BoardComponent>
      {/* IF WON Component use MUI Backdrop and Win message or modal*/}
    </div>
  );
};

// Board.whyDidYouRender = true
// BoardComponent.whyDidYouRender = true;

export default Board;