import { useState, ChangeEvent } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useGame } from '../Contexts/GameContext';
import { usePlayerDispatch, PlayerFactory, PlayerFactoryType } from '../Contexts/PlayerContext';
import { Stack, Button, TextField, Paper } from '@mui/material';
import { Room } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import WaitingRoom from './WaitingRoom';

const Lobby = () => {
  console.log('re-render Lobby');
  const { gameState, gameDispatch } = useGame();
  const playerDispatch = usePlayerDispatch();

  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState("");

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
    setIsHost(true);
    // save Room Code
    gameDispatch({type: "joinRoom", value: newGameCode});
    // create new player
    const {player, dbPlayer}: PlayerFactoryType = PlayerFactory(playerName, 0)

    playerDispatch({type: "setPlayer", value: player});

    await setDoc(newGameCode, {
      players: [dbPlayer],
      gameStarted: false,
      gamePaused: false,
      weaponsStolen: [],
      heroesEscaped: [],
      // timeLeft: 200,
      tiles: [],
      pawns: {
        green: {
          color: "green",
          playerHeld: null,
          position: [],
          gridPosition: [],
          ability: "",
          canUseAbility: false,
        },
        yellow: {
          color: "yellow",
          playerHeld: null,
          position: [],
          gridPosition: [],
          ability: "",
          canUseAbility: false,
        },
        orange: {
          color: "orange",
          playerHeld: null,
          position: [],
          gridPosition: [],
          ability: "",
          canUseAbility: false,
        },
        purple: {
          color: "purple",
          playerHeld: null,
          position: [],
          gridPosition: [],
          ability: "",
          canUseAbility: false,
        }
      },
      }
    )
    // setGameDoc(doc(gamesRef, newGameCode))
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

    let roomFound: Room;

    if (docSnap.exists()) {
      roomFound = docSnap.data() as Room;
      // setGameDoc(gamesDocRef)
    }
    else {
      return
    }

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
        {players: playersInRoom},
      )
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
        <WaitingRoom isHost={isHost} />
          :
        <Paper className="lobby-actions" sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
          {
            promptCode ? 
              <>
                <TextField margin="normal" size="small" type="text" variant="filled" label="Enter Room Code" onChange={_handleRoomCode} value={existingRoomCode}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={joinRoom}>Join</Button>
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