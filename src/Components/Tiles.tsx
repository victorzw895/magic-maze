import Tile from './Tile';
import { DBHeroPawn, Room } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

const Tiles = () => {
  const { gameState } = useGame();
  const { playerState } = usePlayer();

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const { pawns, tiles, players }: Room = room || {}

  const getCurrentPlayer = () => {
    const currentPlayer = players.find(player => player.number === playerState.number)!
    return currentPlayer
  }
  
  const getPlayerHeldPawn = () => {
    const pawnHeld = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === playerState.number);
    return pawnHeld;
  }

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