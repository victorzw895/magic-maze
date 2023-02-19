import { useState, useEffect, useRef, ReactNode, memo, useCallback } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawns from './Pieces/Pawns';
// import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { Room, DBTile, DBPlayer } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayerDispatch, usePlayerState } from '../Contexts/PlayerContext';
import Draggable from 'react-draggable';
import { useDocData, getDoc } from '../utils/useFirestore';
import useHighlightArea from '../utils/useHighlightArea';
import Timer from './Timer';
import Pinged from './Pinged';
import { useGamePausedDocState, useGameStartedDocState, usePlayerDocState } from '../Contexts/FirestoreContext';
import PlayerAreaDisabled from './PlayerAreaDisabled';

const BoardComponent = ({timer, pinged, children}: {timer: ReactNode, pinged: ReactNode, children: ReactNode}) => {
  console.log('*** Board Component re render')
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  // const playerDispatch = usePlayerDispatch();

  // const {player} = usePlayerDocState();
  const gameStarted = useGameStartedDocState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  // useEffect(() => {
  //   (() => {
  //     if (!player) return;
  //     playerDispatch({type: 'assignActions', value: {
  //       number: player.number,
  //       playerDirections: player.playerDirections,
  //       playerAbilities: player.playerAbilities,
  //     }})
  //   })()
  // }, [gameStarted])

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
  console.log('BOARD!!!!')
  return (
    <div className="Board">
      <BoardComponent
        timer={<Timer />}
        pinged={<Pinged />}
      >
        <Tiles />
        <Pawns />
      </BoardComponent>
    </div>
  );
};

// Board.whyDidYouRender = true
// BoardComponent.whyDidYouRender = true;

export default Board;