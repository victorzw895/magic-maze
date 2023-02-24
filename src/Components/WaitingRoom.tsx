import { useEffect } from 'react';
import { useGame, assignRandomActions } from '../Contexts/GameContext';
import { pawnDBInitialState } from '../Contexts/PawnContext';
import { Paper, Stack, Button, List, ListItem } from '@mui/material';
import { DBPlayer } from '../types';
import { setDoc, useDocData } from "../utils/useFirestore"; 
import { allTiles } from '../Data/all-tiles-data';

const WaitingRoom = ({isHost}: {isHost: boolean}) => {
  const { gameState, gameDispatch } = useGame();

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

  return (
    <>
      <h4 className="lobby-code">CODE: {gameState.roomId}</h4>
      <Paper sx={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%', minHeight: '135px', maxWidth: '360px', bgcolor: '#63B0CD' }}>
        <List>
          {
            players && players.map((player: any) => {
              return <ListItem key={player.number}>{`${player.number}  ${player.name}`}</ListItem>
            })
          }
        </List>
        {isHost && 
          <Stack spacing={2} direction="row" justifyContent="center" style={{margin: "20px 0"}}>
            <Button variant="contained" size="small" disableElevation onClick={startGame}>Start Game</Button>
          </Stack>
        }
      </Paper>
    </>
  )
}

export default WaitingRoom