import { useState, ChangeEvent, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame } from '../Contexts/GameContext';
import { usePlayerDispatch, PlayerFactory, PlayerFactoryType } from '../Contexts/PlayerContext';
import { Stack, Button, TextField, Paper, Alert } from '@mui/material';
import { playerNumber, Room } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import WaitingRoom from './WaitingRoom';
import { roomDefaultValues } from '../constants';

const Lobby = () => {
  console.log('re-render Lobby');
  // const gameStarted = useGameStartedDocState()
  // console.log('gameStarted', gameStarted)

  const { gameState, gameDispatch } = useGame();
  const playerDispatch = usePlayerDispatch();

  const [playerName, setPlayerName] = useState("");
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState("");
  const [alert, setAlert] = useState<boolean>(false)
  const [currentPlayer, setCurrentPlayer] = useState({})

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
    // setIsHost(true);
    // save Room Code
    gameDispatch({type: "joinRoom", value: newGameCode});
    // create new player
    const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, 0)

    setCurrentPlayer(player)
    playerDispatch({type: "setPlayer", value: player});

    await setDoc(newGameCode, {
      ...roomDefaultValues,
      players: [dbPlayer],
      // host: player.number
    })
  }

  // check room code typed
  // if document with room code exists
  // save to local room state (live)
  // if room found & not started & players < 8
  // create factory new player
  // save room code (local)
  // save player number/name (local)
  // save players + newPlayer (DB)
  const joinRoom = async () => {
    if (!existingRoomCode) return
    const docSnap = await getDoc(existingRoomCode);


    if (!docSnap.exists()) {
      setAlert(true)
      return // TODO error message
      
      // setFailJoinRoomMessage("Room code not found");
    }

    const roomFound = docSnap.data() as Room;

    // if found
    if (roomFound && !roomFound.gameStarted && roomFound.players.length <= 8) {
      const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, roomFound.players.length);
      const playersInRoom = [
        ...roomFound.players, 
        dbPlayer
      ];
      gameDispatch({type: "joinRoom", value: existingRoomCode});
      playerDispatch({type: "setPlayer", value: player});
      await setDoc(existingRoomCode, 
        {
          ...roomFound,
          players: playersInRoom
        },
      )
      console.log("setting current player in join room", player)
      setCurrentPlayer(player)   
    }
    else if (!roomFound) {
      setFailJoinRoomMessage("Room code not found");
    }
    else if (roomFound.gameStarted) {
      setFailJoinRoomMessage("Game has already started");
    }
    else if (roomFound.players.length > 8) {
      setFailJoinRoomMessage("Game Lobby full");
    }
  }

  return (
    <header className="App-header">
      <h3>
        Welcome to Magic Maze.
      </h3>
      
      {gameState.roomId ?
        <WaitingRoom currentPlayer={currentPlayer}/>
          :
        <Paper className="lobby-actions" sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
          {
            promptCode ? 
              <>
                <> { alert ? <Alert severity="warning" style={{marginTop: "20px"}}>Room code not found</Alert> : "" }</>
                <TextField margin="normal" size="small" type="text" variant="filled" label="Enter Room Code" onChange={_handleRoomCode} value={existingRoomCode}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={joinRoom}>Join</Button>
                  <Button variant="contained" size="small" id="back" disableElevation onClick={() => {setPromptCode(false); setAlert(false)}}>Back</Button>
                  
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