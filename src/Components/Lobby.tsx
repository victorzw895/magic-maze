import { useState, ChangeEvent, useEffect } from 'react';
import cryptoRandomString from 'crypto-random-string';
import { useDB } from '../Contexts/DBContext';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { usePlayer, PlayerFactory, PlayerFactoryType } from '../Contexts/PlayerContext';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { Stack, Button, TextField, List, ListItem, Paper } from '@mui/material';
import { Room, DBPlayer } from '../types';
import { getDoc, setDoc } from "firebase/firestore"; 
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { allTiles } from '../Data/all-tiles-data';

const Lobby = () => {
  const { dbState, dbDispatch } = useDB();
  const { gameState, gameDispatch } = useGame();
  const { playerDispatch } = usePlayer();
  const [playerName, setPlayerName] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [promptCode, setPromptCode] = useState(false);
  const [existingRoomCode, setExistingRoomCode] = useState("");
  const [failJoinRoomMessage, setFailJoinRoomMessage] = useState("");

  const [gameDoc, setGameDoc] = useState<any>(null);

  const [room] = useDocumentData(gameDoc);

  const { players } = room || {}

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
    await setDoc(gamesRef.doc(newGameCode), {
      players: [dbPlayer],
      gameStarted: false,
      weaponsStolen: [],
      heroesEscaped: []
      }
    )
    setGameDoc(gamesRef.doc(newGameCode))
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
    const gamesDocRef = gamesRef.doc(existingRoomCode)
    const docSnap = await getDoc(gamesDocRef);

    let roomFound: Room;

    if (docSnap.exists()) {
      roomFound = docSnap.data() as Room;
      setGameDoc(gamesDocRef)
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
      await setDoc(gamesDocRef, 
        {players: playersInRoom},
        {merge: true}
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

  // Assign actions to existing players ->
  // set initial tile ->
  // set pawn positions ->
  // save players, gameStarted, tiles, pawns (DB)
  // update player with actions (local)
  const startGame = async () => {
    // set player actions
    const dbPlayers: DBPlayer[] = assignRandomActions(players)
    // const currentPlayer = dbPlayers.find(dbPlayer => dbPlayer.number === playerState.number);
    // if (currentPlayer) {
    //   playerDispatch({type: "setPlayer", value: currentPlayer});
    // }
    // setInitialTile
    // setPawnPositions
    const firstTile = allTiles.find(tile => tile.id === "1a");
    const initTile = {
      ...firstTile,
      gridPosition: [8, 8]
    }
    // console.log(initTile);
    await setDoc(
      gamesRef.doc(gameState.roomId), 
      { 
        players: dbPlayers, 
        gameStarted: true,
        gamePaused: false,
        tiles: [initTile],
        pawns: pawnDBInitialState
      },
      {merge: true}
    )
    gameDispatch({type: "startGame"})
  }


  return (
    <header className="App-header">
      <h3>
        Welcome to Magic Maze.
      </h3>
      
      {gameState.roomId ?
        <>
          <h4 className="lobby-code">CODE: {gameState.roomId}</h4>
          {players && players.length && 
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
              {
                players.map((player: any) => {
                  return <ListItem key={player.number}>{`${player.number}  ${player.name}`}</ListItem>
                })
              }
              {isHost && 
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={startGame}>Start Game</Button>
                </Stack>
              }
            </List>
          }
        </>
          :
        <Paper className="lobby-actions" sx={{ width: '100%', maxWidth: 360, bgcolor: '#63B0CD' }}>
          {
            promptCode ? 
              <div>
                <TextField margin="normal" size="small" type="text" variant="filled" label="Enter Room Code" onChange={_handleRoomCode} value={existingRoomCode}></TextField>
                <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
                  <Button variant="contained" size="small" disableElevation onClick={joinRoom}>Join</Button>
                </Stack>
              </div>
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