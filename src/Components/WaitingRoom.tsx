import { useEffect, useState } from 'react';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { Paper, Stack, Button, List, ListItem, Alert, Box, Modal, Typography } from '@mui/material';
import { DBPlayer, playerNumber } from '../types';
import { setDoc, useDocData } from "../utils/useFirestore"; 
import { allTiles } from '../Data/all-tiles-data';
import { doc } from '../utils/useFirestore'
import { deleteDoc } from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';
import { useRoomHostDocState } from '../Contexts/FirestoreContext';
import { usePlayerDocState } from '../Contexts/FirestoreContext';

const WaitingRoom = () => {
  const { gameState, gameDispatch } = useGame();
  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [room] = useDocData(gameState.roomId);
  const { players } = room;
  const host = useRoomHostDocState()
  const { player: currentPlayer } = usePlayerDocState()

  useEffect(() => {
   
  }, [host, players])
  
  // Assign actions to existing players ->
  // set initial tile ->
  // set pawn positions ->
  // save players, gameStarted, tiles, pawns (DB)
  // update player with actions (local)
  const startGame = async () => {
    // set player actions
    const dbPlayers: DBPlayer[] = assignRandomActions(players)
    const firstTile = allTiles.find(tile => tile.id === "1a");
    const initTile = {
      ...firstTile,
      gridPosition: [8, 8]
    }
    await setDoc(gameState.roomId, 
      { 
        players: dbPlayers, 
        gameStarted: true,
        tiles: [initTile],
        pawns: pawnDBInitialState
      }
    )
    gameDispatch({type: "startGame"})
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const exitRoom = async () => {
    if (players.length === 1) {
      deleteRoom()
    } else {
      // ! Feel like there could be async issues below but need revision
      // * remove current player from player list 
      const updatePlayers = players.filter((dbPlayer: any) => dbPlayer.id !== currentPlayer.id)
      
      // changing host number
      if (currentPlayer.number === host) {
        await setDoc(gameState.roomId, {
          host: updatePlayers[0].number,
          players: updatePlayers
        })
      } else {
        await setDoc(gameState.roomId, {
          players: updatePlayers
        })
      }
      gameDispatch({ type: "exitRoom" })
    }
  }

  const deleteRoom = () => {
    deleteDoc(doc(gameState.roomId))
    gameDispatch({ type: "exitRoom" })
  }


  return (
    <>
      <h4 className="lobby-code">CODE: {gameState.roomId}</h4>
      <Paper sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', minHeight: '135px', maxWidth: '360px', bgcolor: '#63B0CD' }}>
        <List>
          {
            players && players.map((player: any) => 
              <ListItem key={player.number}>{`${player.number}  ${player.name}`}</ListItem>
            )
          }
          {
            <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Box sx={{ display: "flex", justifyContent: 'space-between' }}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Exit Room: {gameState.roomId}
                </Typography>
                <Button aria-label="close" onClick={handleClose} sx={{padding: "0px"}}><CloseIcon /></Button>
              </Box>
              { (host === currentPlayer.number) &&
                <Stack>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You are about to exit the room. You must reassign the host or end game for all.
                  </Typography>
                  {
                    (players.length > 1) &&
                      <Stack spacing={2} direction="row" justifyContent="space-between" style={{margin: "20px 0", display: "flex"}}>
                        <Button variant="contained" size="small" id="back" disableElevation onClick={exitRoom}>Re-assign Host and Exit</Button>
                        <Button variant="contained" size="small" color="error" disableElevation onClick={deleteRoom}>Delete Room for all</Button>
                      </Stack>
                  }
                  {
                    (players.length === 1) &&
                      <Stack spacing={2} direction="row" justifyContent="space-between" style={{margin: "20px 0", display: "flex"}}>
                        <Button variant="contained" size="small" color="error" disableElevation onClick={deleteRoom}>Delete Room</Button>
                      </Stack>
                  }
                </Stack>
              }
              { (host !== currentPlayer.number) &&
                <Stack>
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                  You are about to exit the room. Confirm?
                  </Typography>
                  <Button variant="contained" size="small" id="back" disableElevation onClick={exitRoom}>Exit Room</Button>
                </Stack>
              }
              
            </Box>
          </Modal>    
          }
          {(host === currentPlayer.number) && 
            <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
              <Button variant="contained" size="small" disableElevation onClick={startGame}>Start Game</Button>
              <Button variant="contained" size="small" id="back" disableElevation onClick={handleOpen}>Exit Room</Button>          
              <Button variant="contained" size="small" color="error" disableElevation onClick={deleteRoom}>Delete Room</Button>
            </Stack>
          }
          {(host !== currentPlayer.number) && players.length === 0 && 
            <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0", display: "block"}}>
              <Alert severity="info" style={{margin: "20px"}}>This game has been deleted. Please click "back" to return to the Lobby area</Alert>
            </Stack>
          }
          {(host !== currentPlayer.number) &&
            <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0", display: "block"}}>
              <Box textAlign='center'>
                <Button variant="contained" size="small" id="back" disableElevation onClick={handleOpen}>Back</Button>
              </Box>
            </Stack>
          }
        </List>
 
      </Paper>
    </>
  )
}

export default WaitingRoom