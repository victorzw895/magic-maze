import { useCallback, useEffect } from 'react';
import Tile from './Tile';
import { DBHeroPawn, Room, DBTile } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayerState } from '../Contexts/PlayerContext';
import { useDocData } from '../utils/useFirestore';
import { 
  useTilesDocState,
  usePlayerDocState,
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
} from '../Contexts/FirestoreContext';

const Tiles = () => {
  console.log('### re rendering tiles')
  const { player } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();
  const green = useGreenDocState();
  const yellow = useYellowDocState();
  const purple = usePurpleDocState();
  const orange = useOrangeDocState();
  
  // const playerHeldPawn = usePawnHeldDocState();
  // const { playerHeldPawn } = usePawnHeldDocState();
  // const playerState = usePlayerState();

  // const [room] = useDocData(gameState.roomId);

  // const { pawns }: Room = room

  // const getCurrentPlayer = useCallback(() => {
  //   const currentPlayer = players.find(player => player.number === playerState.number)!
  //   return currentPlayer
  // }, [players])
  
  const getPlayerHeldPawn = () => {
    const pawnHeld = Object.values({green, yellow, orange, purple}).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === player.number);
    return pawnHeld as DBHeroPawn;
  }

  // useEffect(() => {
  //   console.count('### rerender tiles player')
  // }, [player]) // fine

  // useEffect(() => {
  //   console.count('### rerender tiles green')
  // }, [green])

  // useEffect(() => {
  //   console.log('### rerender tiles tiles', tiles)
  // }, [tiles])

  // useEffect(() => {
  //   console.count('### rerender tiles getCurrentPlayer')
  // }, [getCurrentPlayer])
  // return(<div>Test</div>)
  return (
    <>
      {tiles && tiles.length > 0 && tiles.map((newTile, tileIndex) => {
        return (
          <Tile 
            key={tileIndex} 
            tileIndex={tileIndex} 
            tileData={newTile} 
            playerHeldPawn={getPlayerHeldPawn()}
            // currentPlayer={player}
          />
        )
      })}
    </>
  );
};

// Tiles.whyDidYouRender = true

export default Tiles;