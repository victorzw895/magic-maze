import {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { usePlayerDispatch } from '../Contexts/PlayerContext';
import { useGameOverDocState, useGameWonDocState } from '../Contexts/FirestoreContext';
import { useGame } from '../Contexts/GameContext';
import cheeringSound from '../assets/cheering.wav'; // download file from firestore storage instead
import loseSound from '../assets/lose.wav'; // download file from firestore storage instead

const playLose = () => {
  const audio = new Audio(loseSound);
  audio.play();
}

const playCheering = () => {
  const audio = new Audio(cheeringSound);
  audio.play();
}

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
  const playerDispatch = usePlayerDispatch();
  const {gameDispatch} = useGame();
  const gameOver = useGameOverDocState();
  const gameWon = useGameWonDocState();

  useEffect(() => {
    if (gameOver && gameWon) playCheering();
    else if (gameOver && !gameWon) playLose();
  }, [gameOver, gameWon])

  const handleClick = async () => {
    playerDispatch({type: 'setPlayer', value: null});
    gameDispatch({type: "exitRoom"});
    // delete doc or reset doc
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
                <Button style={{marginTop: '20px'}} onClick={handleClick}>Play Again</Button>
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
                <Button style={{marginTop: '20px'}} onClick={handleClick}>Play Again</Button>
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