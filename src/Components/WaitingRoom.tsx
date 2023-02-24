import { useEffect } from 'react';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { Stack, Button, List, ListItem } from '@mui/material';
import { DBPlayer } from '../types';
import { setDoc, useDocData } from "../utils/useFirestore"; 
import { allTiles } from '../Data/all-tiles-data';
import { usePlayerState } from '../Contexts/PlayerContext';
import { usePlayerDocState } from '../Contexts/FirestoreContext';

const WaitingRoom = ({isHost}: {isHost: boolean}) => {
  const { gameState, gameDispatch } = useGame();

  console.log("gameState room id,", gameState.roomId)
  const playerState = usePlayerState();
  const {setPlayer} = usePlayerDocState();

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

  const backToLobby = () => {
    gameDispatch({ type: "exitRoom" })
  }


  useEffect(() => {
    (async () => {
      if (!room.gameStarted) return;
      
      const currentPlayer = room.players.find((player: DBPlayer) => player.number === playerState.number);
      if (!currentPlayer) return;
      setPlayer(currentPlayer);
    })()
  }, [room.gameStarted])

  return (
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
              <Button variant="contained" size="small" disableElevation onClick={backToLobby}>Back</Button>
            </Stack>
          }
        </List>
      }
    </>
  )
}

export default WaitingRoom