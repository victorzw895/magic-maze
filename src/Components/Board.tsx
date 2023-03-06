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
import Objectives from './Objectives';
import GameOver from './GameOver';

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
      <GameOver />
    </div>
  );
};

// Board.whyDidYouRender = true
// BoardComponent.whyDidYouRender = true;

export default Board;