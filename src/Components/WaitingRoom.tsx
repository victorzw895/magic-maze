import { useEffect, useState } from 'react';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { Paper, Stack, Button, List, ListItem, Alert, Box, Modal, Typography } from '@mui/material';
import { DBPlayer } from '../types';
import { setDoc, useDocData, getDoc } from "../utils/useFirestore"; 
import { allTiles } from '../Data/all-tiles-data';
import { doc } from '../utils/useFirestore'
import {deleteDoc, updateDoc} from "firebase/firestore";
import CloseIcon from '@mui/icons-material/Close';

const WaitingRoom = ({isHost, currentPlayer}: {isHost: boolean; currentPlayer: any}) => {
  const { gameState, gameDispatch } = useGame();

  const [open, setOpen] = useState<boolean>(false)
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [room] = useDocData(gameState.roomId);
  const { players } = room;
  
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
    // TODO: need to prompt user to delete player for, firestore and reassign host

    console.log("current player", currentPlayer, gameState.roomId)
    console.log("all players", players)


    // * remove current player from player list
    const currentPlayerIndex: number = players.findIndex((player: any) => player.number === currentPlayer.number)
    console.log("current player index",currentPlayerIndex)

    const updatePlayers = [...players]
    updatePlayers.splice(currentPlayerIndex, 1)
    console.log("updated players", updatePlayers)
    
    // todo: reassign host

    // const docSnap = await getDoc(gameState.roomId);

    // if (docSnap.exists()) {
    //   const info = docSnap.data()
    //   console.log("Document data:", info.players);
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
     
    // gameDispatch({ type: "exitRoom" })
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
            players && players.map((player: any) => {
              return <ListItem key={player.number}>{`${player.number}  ${player.name}`}</ListItem>
              // TODO: back button for non-host players
            })
            
          }
          {isHost && 
            <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
              <Button variant="contained" size="small" disableElevation onClick={startGame}>Start Game</Button>
              <Button variant="contained" size="small" id="back" disableElevation onClick={handleOpen}>Exit Room</Button>
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
                  <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    You are about to exit the room. You must reassign the host or end game for all
                  </Typography>
                  <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0", display: "block"}}>
                    <Button variant="contained" size="small" id="back" disableElevation onClick={exitRoom}>Confirm Exit</Button>
                    <Button variant="contained" size="small" color="error" disableElevation onClick={deleteRoom}>Delete Room for all</Button>
                  </Stack>
                </Box>
              </Modal>              
              <Button variant="contained" size="small" color="error" disableElevation onClick={deleteRoom}>Delete Room</Button>
            </Stack>
          }
          {!isHost && players.length == 0 && 
            <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0", display: "block"}}>
              <Alert severity="info" style={{margin: "20px"}}>This game has been deleted. Please click "back" to return to the Lobby area</Alert>
              <Box textAlign='center'>
                <Button variant="contained" size="small" id="back" disableElevation onClick={exitRoom}>Back</Button>
              </Box>
            </Stack>
          }
        </List>
 
      </Paper>
    </>
  )
}

export default WaitingRoom