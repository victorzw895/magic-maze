import { useGame } from '../Contexts/GameContext';
import { useLoadingDocState, useCurrentPlayerDocState } from '../Contexts/FirestoreContext';
import { setDoc } from '../utils/useFirestore';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

const Loading = () => {
  const { gameState } = useGame();
  const { roomLoaded, allPlayersReady } = useLoadingDocState();
  const { currentPlayer } = useCurrentPlayerDocState();

  const startGame = async () => {
    await setDoc(gameState.roomId, 
      { 
        gameStarted: true,
      }
    )
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={true}
      >
        {!roomLoaded ? 
          <CircularProgress color="inherit" />
            : 
          currentPlayer.number === 1 ?
            <Button 
              variant='contained' 
              onClick={!allPlayersReady ? () => {} : startGame}
              color={!allPlayersReady ? 'warning': 'primary'}
            >
              {!allPlayersReady ? 'Waiting for all players to be ready...' : 'Start'}
            </Button>
              :
            <Button 
              variant='contained' 
              color={!roomLoaded ? 'warning': 'success'}
            >
              Waiting for Host to start...
            </Button>
        }
      </Backdrop>
    </>
  )
}

export default Loading