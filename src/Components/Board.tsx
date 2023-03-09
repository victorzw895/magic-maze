import { ReactNode, FunctionComponent } from 'react';
import './Board.scss';

import Loading from './Loading';
import Tiles from './Tiles';
import Pawns from './Pieces/Pawns';
import Timer from './Timer';
import GameOver from './GameOver';
import GameTable from './GameTable';

import { useLoadingDocState, useGameStartedDocState } from '../Contexts/FirestoreContext';

const Board = () => {
  console.log('re rendering Board');
  const gameStarted = useGameStartedDocState();
  const { loadBoard, roomLoaded } = useLoadingDocState();

  return (
    <div className="Board">
      {
        loadBoard && !gameStarted ?
          <Loading />
            :
          <></>
      }
      {
        roomLoaded &&
          <>
            <GameTable
              timer={<Timer />}
            >
              <Tiles />
              <Pawns />
            </GameTable>
            <GameOver />
          </>
      }
    </div>
  );
};

export default Board;