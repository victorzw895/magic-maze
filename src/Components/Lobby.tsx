import { useState, ChangeEvent, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame } from '../Contexts/GameContext';
import { usePlayerDispatch, PlayerFactory, PlayerFactoryType } from '../Contexts/PlayerContext';
import { Stack, Button, TextField, Paper, Alert } from '@mui/material';
import { playerNumber, Room } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import WaitingRoom from './WaitingRoom';
import { roomDefaultValues } from '../constants';
import { usePlayerDocState } from '../Contexts/FirestoreContext';

const Lobby = () => {
  console.log('re-render Lobby');

  const { gameState, gameDispatch } = useGame();
  const playerDispatch = usePlayerDispatch();

  const [playerName, setPlayerName] = useState("");
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState<string>("");
  const [currentPlayer, setCurrentPlayer] = useState({})
  const { players, setPlayers, player, setPlayer } = usePlayerDocState()

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

    console.log("dbPlayer", dbPlayer);
    console.log("player", player.number)
    setPlayer(dbPlayer)
    playerDispatch({type: "setPlayer", value: player}); // TODO most likely needs id / or same change

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
      setFailJoinRoomMessage("Room code not found");
      return 
    }

    const roomFound = docSnap.data() as Room;

    // if found
    if (roomFound && !roomFound.gameStarted && roomFound.players.length <= 8) {
      // add player Number
      const playerInLobby = roomFound.players.length

      const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, playerInLobby);
      const playersInRoom = [
        ...roomFound.players, 
        dbPlayer
      ];
      gameDispatch({type: "joinRoom", value: existingRoomCode});
      playerDispatch({type: "setPlayer", value: player});  // TODO most likely needs id / or same change
      await setDoc(existingRoomCode, 
        {
          ...roomFound,
          players: playersInRoom
        },
      )
      console.log("setting current player in join room", dbPlayer)
      setPlayer(dbPlayer)

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

  useEffect(() => {

  }, [failJoinRoomMessage])

  return (
    <header className="App-header">
      <h3>
        Welcome to Magic Maze.
      </h3>
      
      {gameState.roomId ?
        <WaitingRoom />
          :
        <Paper className="lobby-actions" sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
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