import { useState, useEffect, useRef, ReactNode, memo, useCallback } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
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
import { useFirestoreState } from '../Contexts/FirestoreContext';

const BoardComponent = ({timer, children}: {timer: ReactNode, children: ReactNode}) => {
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const [room] = useDocData(gameState.roomId);
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const { players, gameStarted }: Room = room

  const gamePaused = useFirestoreState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(gameState.roomId);

  useEffect(() => {
    (() => {
      const currentPlayer = players.find(player => player.number === playerState.number);
      if (!currentPlayer) return;
      playerDispatch({type: 'assignActions', value: {
        number: currentPlayer.number,
        playerDirections: currentPlayer.playerDirections,
        playerAbilities: currentPlayer.playerAbilities,
      }})
    })()
  }, [gameStarted])

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
                disableAction={!newTileArea.placementDirection ? true : gamePaused}
                />
            )
          })}
          {children}
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={gamePaused ? () => {} : highlightNewTileArea}>
        {/* TODO take pinged value from room as props*/}
        <Pinged />
      </PlayerArea>
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