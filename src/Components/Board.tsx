import { useEffect, useRef, ReactNode } from 'react';
import Tiles from './Tiles';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { Room } from '../types';
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

  const { pawns, tiles, players, gamePaused }: Room = room

  const [availableArea, highlightNewTileArea, clearHighlightAreas] = useHighlightArea(tiles, pawns);


  // useEffect(() => {
  //   // IDEALLY on game start
  //   // maybe move timer to firestore ???
  //   console.log("start timer?")
  //   time.setSeconds(time.getSeconds() + 200);
  // }, [])

  return (
    <>
      {timer}
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
      <PlayerArea gamePaused={gamePaused} highlightNewTileArea={highlightNewTileArea} player={players?.find(player => player.number === playerState.number)!} />
    </>
  );
};

const time = new Date();


const Board = () => {

  useEffect(() => {
    // IDEALLY on game start
    // maybe move timer to firestore ???
    time.setSeconds(time.getSeconds() + 200);
  }, [])

  return (
    <div className="Board">
      <BoardComponent
        // boardPieces={
        //   <>
            
        //   </>
        // }
        timer={<Timer expiryTimestamp={time} />}
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