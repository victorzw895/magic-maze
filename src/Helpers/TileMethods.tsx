import { tileWallSize, spaceSize } from '../constants';
import { direction, DBTile, DBHeroPawn, DBPawns, DBPlayer } from '../types';
import { setDoc } from '../utils/useFirestore';
import { getPlayerPawnActions } from '../Helpers/PawnMethods';
import { getDefaultBlockedPositions } from '../constants';

export const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: DBHeroPawn) => {
  if (pawnHeld?.showMovableDirections?.includes(direction)) {
    if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
      if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
          tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
            return true;
          }
    }
  }
  return false;
}

export const getDisplacementValue = (positionValue: number) => {
  return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
}

export const showMovableSpaces = async (
  roomId: string,
  pawns: DBPawns,
  player: DBPlayer,
  pawnData: DBHeroPawn,
  tiles: DBTile[]
) => {
    const { color } = pawnData;
    const newPawns = {...pawns}
    
    if (!player) return;

    Object.values(newPawns).forEach((pawn: DBHeroPawn) => {
      if (pawn.color === color && !pawnData.playerHeld) {
        const playerPawnActions = getPlayerPawnActions(player, tiles, newPawns, pawn);
        
        pawn.playerHeld = player.number
        pawn.blockedPositions = playerPawnActions.blockedPositions
        pawn.showMovableDirections = playerPawnActions.showMovableDirections
        pawn.showEscalatorSpaces = playerPawnActions.showEscalatorSpaces
        pawn.showTeleportSpaces = playerPawnActions.showTeleportSpaces
      } 
      else if (pawn.playerHeld === player.number) {
        pawn.playerHeld = null;
        pawn.blockedPositions = getDefaultBlockedPositions();
        pawn.showMovableDirections = [];
        pawn.showEscalatorSpaces = [];
        pawn.showTeleportSpaces = null;
      }
    })

    await setDoc(
      roomId, 
      { 
        pawns: newPawns
      },
    )
}