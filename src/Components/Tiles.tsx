import { useCallback } from 'react';
import Tile from './Tile';
import { DBHeroPawn, Room } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayerState } from '../Contexts/PlayerContext';
import { useDocData } from '../utils/useFirestore';

const Tiles = () => {
  const { gameState } = useGame();
  const playerState = usePlayerState();

  const [room] = useDocData(gameState.roomId);

  const { pawns, tiles, players }: Room = room

  const getCurrentPlayer = useCallback(() => {
    const currentPlayer = players.find(player => player.number === playerState.number)!
    return currentPlayer
  }, [players])
  
  const getPlayerHeldPawn = useCallback(() => {
    const pawnHeld = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === playerState.number);
    return pawnHeld;
  }, [pawns])

  return (
    <>
      {tiles && tiles.length > 0 && tiles.map((newTile, tileIndex) => {
        return (
          <Tile 
            key={tileIndex} 
            tileIndex={tileIndex} 
            tileData={newTile} 
            playerHeldPawn={getPlayerHeldPawn()}
            currentPlayer={getCurrentPlayer()}
          />
        )
      })}
    </>
  );
};

// Tiles.whyDidYouRender = true

export default Tiles;