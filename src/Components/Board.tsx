import { useState, useEffect, useRef, ReactNode, memo, useCallback } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { Room, DBTile, DBPlayer } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayerState } from '../Contexts/PlayerContext';
import Draggable from 'react-draggable';
import { useDocData } from '../utils/useFirestore';
import useHighlightArea from '../utils/useHighlightArea';
import Timer from './Timer';

const BoardComponent = ({timer, children}: {timer: ReactNode, children: ReactNode}) => {
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const playerState = usePlayerState();
  const [room] = useDocData(gameState.roomId);
  
  const { players, gamePaused, gameStarted }: Room = room
  const [player, setPlayer] = useState<DBPlayer | undefined>(undefined);

  useEffect(() => {
    const player = players?.find(player => player.number === playerState.number);
    setPlayer(player);
  }, [players])

  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  return (
    <>
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
                gamePaused={gamePaused}
                />
            )
          })}
          {children}
        </div>
      </Draggable>
      <PlayerArea gamePaused={gamePaused} highlightNewTileArea={highlightNewTileArea} player={player} />
    </>
  );
};


const Board = () => {
  return (
    <div className="Board">
      <BoardComponent
        timer={<Timer />}
      >
        <Tiles />
        <Pawn color="yellow" />
        <Pawn color="orange"/>
        <Pawn color="green"/>
        <Pawn color="purple"/>
      </BoardComponent>
    </div>
  );
};

// Board.whyDidYouRender = true
// BoardComponent.whyDidYouRender = true;

export default Board;