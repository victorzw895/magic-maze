import { useRef, ReactNode } from 'react';
import NewTileArea from './NewTileArea';
import PlayerArea from './PlayerArea';
import { useGame } from '../Contexts/GameContext';
import Draggable from 'react-draggable';
import useHighlightArea from '../utils/useHighlightArea';
import { useGameStartedDocState } from '../Contexts/FirestoreContext';
import Objectives from './Objectives';
import AudioControls from './AudioControls';

const GameTable = ({timer, children}: {timer: ReactNode, children: ReactNode}) => {
  console.log('game table re render')
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  return (
    <>
      <Objectives /> {/* minimize when playing, can click to expand */}
      <AudioControls />
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
      <PlayerArea highlightNewTileArea={highlightNewTileArea} />
    </>
  );
};

export default GameTable;