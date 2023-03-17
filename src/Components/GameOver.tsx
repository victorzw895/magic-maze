import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { 
  useGameOverDocState,
  useGameWonDocState,
  usePlayersDocState,
  useCurrentPlayerDocState,
 } from '../Contexts/FirestoreContext';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { useAudio } from '../Contexts/AudioContext';
import { setDoc } from 'firebase/firestore'
import { doc } from '../utils/useFirestore';
import { roomDefaultValues } from '../constants';
import { allTiles } from '../Data/all-tiles-data';
import { pawnDBInitialState } from '../utils/PawnFactory';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  textAlign: 'center',
};

const GameOver = () => {
  const {gameState} = useGame();
  const gameOver = useGameOverDocState();
  const gameWon = useGameWonDocState();
  const players = usePlayersDocState()
  const currentPlayer = useCurrentPlayerDocState();
  const { setMusicOn, soundOn, playCheeringSound, playLoseSound } = useAudio();

  useEffect(() => {
    if (!soundOn) return;
    if (!gameOver) return;

    if (gameWon) playCheeringSound()
    else playLoseSound()

    setMusicOn(false);
  }, [gameOver, gameWon])

  const handleClick = async () => {
    const dbPlayers = assignRandomActions(players)
    const firstTile = allTiles.find(tile => tile.id === "1a");
    const initTile = {
      ...firstTile,
      gridPosition: [8, 8]
    }

    setDoc(doc(gameState.roomId), {
      ...roomDefaultValues,
      players: dbPlayers, 
      tiles: [initTile],
      pawns: pawnDBInitialState,
      loadBoard: true,
      updateAbilitiesCount: 1,
    })
  }

  return (
    <>
      {
        gameOver ? 
          gameWon ? 
            <Modal
              open={gameOver && gameWon}
              aria-labelledby="modal-won"
              aria-describedby="modal-won-description"
            >
              <Box sx={style}>
                <Typography id="modal-won" variant="h6" component="h2">
                  Game Won!
                </Typography>
                <Typography id="modal-won-description" sx={{ mt: 2 }}>
                  You did it! You and your teammates managed to successfully steal all the weapons and escape!
                </Typography>
                {currentPlayer.number === 1 ? 
                  <Button style={{marginTop: '20px'}} onClick={handleClick}>Play Again</Button>
                    :
                  <Typography id="modal-play-again" sx={{ mt: 2 }}>
                    Wait for Game Host to press Play Again, to try again.
                  </Typography>
                }
              </Box>
            </Modal>
              :
            <Modal
              open={gameOver && !gameWon}
              aria-labelledby="modal-lost-title"
              aria-describedby="modal-lost-description"
            >
              <Box sx={style}>
                <Typography id="modal-lost-title" variant="h6" component="h2">
                  Game Over! You all lose!
                </Typography>
                <Typography id="modal-lost-description" sx={{ mt: 2 }}>
                  You and your teammates failed to steal all the weapons and escape in time.
                  Try again!
                </Typography>
                {currentPlayer.number === 1 ? 
                  <Button style={{marginTop: '20px'}} onClick={handleClick}>Play Again</Button>
                    :
                  <Typography id="modal-play-again" sx={{ mt: 2 }}>
                    Wait for Game Host to press Play Again, to try again.
                  </Typography>
                }
              </Box>
            </Modal>
          :
        <>
        </>
      }
    </>
  )
}

export default GameOver;