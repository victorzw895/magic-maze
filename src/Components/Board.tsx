import './Board.scss';

import Loading from './Loading';
import Tiles from './Tiles';
import Pawns from './Pieces/Pawns';
import Timer from './Timer';
import GameOver from './GameOver';
import GameTable from './GameTable';

import { useLoadingDocState, useGameStartedDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';

const Board = () => {
  const gameStarted = useGameStartedDocState();
  const { loadBoard } = useLoadingDocState();
  const { assets } = useAssets();

  return (
    <div className="Board">
      {
        loadBoard && !gameStarted ?
          <Loading />
            :
          <></>
      }
      {
        assets &&
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