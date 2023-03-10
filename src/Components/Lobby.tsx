import { useState, ChangeEvent, useEffect, SyntheticEvent } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame } from '../Contexts/GameContext';
import { usePlayerDispatch, PlayerFactory, PlayerFactoryType } from '../Contexts/PlayerContext';
import { Stack, Button, TextField, Paper, Alert, Snackbar } from '@mui/material';
import { Room } from '../types';
import { setDoc, getDoc, doc } from '../utils/useFirestore';
import WaitingRoom from './WaitingRoom';
import { roomDefaultValues } from '../constants';
import { query, where, getDocs, deleteDoc } from "firebase/firestore";
import { gamesRef } from '../Firestore';
import { useCurrentPlayerDocState } from '../Contexts/FirestoreContext';

const Lobby = () => {
  const { gameState, gameDispatch } = useGame();
  const playerDispatch = usePlayerDispatch();

  const [playerName, setPlayerName] = useState("");
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState<string>("");
  const [count, setCount] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const { updateCurrentPlayer } = useCurrentPlayerDocState();
  const [snapCollect, setSnapCollect] = useState<any>("");
  const [expiredDocsCount, setExpiredDocsCount] = useState<number>(0);
  const [showDocsFound, setShowDocsFound] = useState<boolean>(false);
  const [openToast, setOpenToast] = useState<boolean>(false);

  const _handleRoomCode = (e: ChangeEvent<HTMLInputElement>) => {
    setExistingRoomCode(e.target.value)
  }

  const _handleNameInput = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerName(e.target.value)
  }

  // Generate code ->
  // save room code (local) -> 
  // save player number/name (local) -> 
  // create new Document, save player (DB)
  const createNewGame = async () => {
    const newGameCode = cryptoRandomString({length: 5, type: 'distinguishable'});

    // save Room Code
    gameDispatch({type: "joinRoom", value: newGameCode});

    // create new player
    const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, 0)

    await setDoc(newGameCode, {
      ...roomDefaultValues,
      players: [dbPlayer],
    })

    // save player id Locally
    playerDispatch({type: "setPlayer", value: player});
    updateCurrentPlayer(dbPlayer);
  }

  const joinRoom = async () => {
    if (!existingRoomCode) return
    const docSnap = await getDoc(existingRoomCode);

    if (!docSnap.exists()) {
      setFailJoinRoomMessage("Room code not found");
      return 
    }

    const roomFound = docSnap.data() as Room;

    // if found
    if (roomFound && !roomFound.gameStarted && roomFound.players.length < 8) {
      // get current number of players in Lobby
      const playersCount = roomFound.players.length

      const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, playersCount);

      const playersInRoom = [
        ...roomFound.players, 
        dbPlayer
      ];

      gameDispatch({type: "joinRoom", value: existingRoomCode});
      
      await setDoc(existingRoomCode, 
        {
          ...roomFound,
          players: playersInRoom
        },
      )
      // save player id locally
      playerDispatch({type: "setPlayer", value: player});
      updateCurrentPlayer(dbPlayer);
    }
    else if (!roomFound) {
      setFailJoinRoomMessage("Room code not found");
    }
    else if (roomFound.gameStarted) {
      setFailJoinRoomMessage("Game has already started");
    }
    else if (roomFound.players.length >= 8) {
      setFailJoinRoomMessage("Game Lobby full");
    }
  }

  useEffect(() => {
    if (count === 3) {
      setShow(true);
    } else if (show && count > 3) {
      setCount(0);
      setShow(false);
    } else if (!show && count > 3) {
      setCount(0);
    }
  }, [failJoinRoomMessage, count])

  const getExpiredDocs = async () => {
    const timeNow = new Date().valueOf()
    const yesterday = timeNow - (24 * 60 * 60 * 1000)

    const snap = query(gamesRef, where("createdDateInSeconds","<", yesterday))

    const snapShot = await getDocs(snap)
    setSnapCollect(snapShot);
    const expiredGamesCount = snapShot.size
    setExpiredDocsCount(expiredGamesCount);
    setShowDocsFound(true);
  }

  const deleteExpiredDocs = () => {
    snapCollect.forEach((game:any) => {
      deleteDoc(doc(game.id));
    });
    setOpenToast(true);
    setShowDocsFound(false);
    setShow(false);
  }

  const handleToastClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpenToast(false);
    setExpiredDocsCount(0);
    setShow(false);
    setShowDocsFound(false);
  }

  return (
    <header className="App-header">
      <h3>
        Welcome to <span onClick={() => setCount(count +1)}> Magic Maze. </span>
      </h3>
      { show ? 
        <>
          {
            showDocsFound ?  
              <>
                <h4 style={{marginTop: "0"}}>{expiredDocsCount} games found</h4> 
                {
                  expiredDocsCount === 0 ? "" : <Button variant='contained' size='small' color='error' disableElevation style={{marginBottom: "20px"}} onClick={deleteExpiredDocs}>Delete Expired Documents</Button>
                }
              </>
              :
              <Button variant='contained' size='small' color='primary' disableElevation style={{marginBottom: "32px"}} onClick={getExpiredDocs}>Get Expired Documents</Button> 
          }
        </>
        : 
        ""
      }
        <Snackbar open={openToast} autoHideDuration={5000} onClose={handleToastClose}>
          <Alert onClose={handleToastClose} severity="success" sx={{ width: '100%' }}>
            Success! Deleted {expiredDocsCount} games. 
          </Alert>
        </Snackbar>        
      {gameState.roomId ?
        <WaitingRoom />
          :
        <Paper className="lobby-actions" sx={{ display: 'grid', gridTemplateRows: 'repeat(2, minmax(50px, auto))', width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
          {
            promptCode ? 
              <>
                <> { failJoinRoomMessage !== "" ? <Alert severity="warning" style={{marginTop: "20px"}}>{failJoinRoomMessage}</Alert> : "" }</>
                <TextField margin="normal" size="small" type="text" variant="filled" label="Enter Room Code" onChange={_handleRoomCode} value={existingRoomCode}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={joinRoom}>Join</Button>
                  <Button variant="contained" size="small" id="back" disableElevation onClick={() => {setPromptCode(false); setFailJoinRoomMessage("")}}>Back</Button>
                  
                </Stack>
              </>
                :
              <>
                <TextField margin="normal" label="Name" size="small" type="text" variant="filled" onChange={_handleNameInput} value={playerName}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation disabled={playerName.length < 2} onClick={createNewGame}>Create Lobby</Button>
                  <Button variant="contained" size="small" disableElevation disabled={playerName.length < 2} onClick={() => setPromptCode(true)}>Join Lobby</Button>
                </Stack>
              </>
          }
        </Paper>
      }
    </header>
  )
}

export default Lobby