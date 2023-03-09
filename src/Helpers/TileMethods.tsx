import { tileWallSize, spaceSize } from '../constants';
import { direction, DBTile, DBHeroPawn, DBPawns, DBPlayer, PlayerHeldPawn } from '../types';
import { setDoc } from '../utils/useFirestore';
import { getPlayerPawnActions } from '../Helpers/PawnMethods';
import { getDefaultBlockedPositions } from '../constants';

export const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: PlayerHeldPawn) => {
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
  tiles: DBTile[],
  disableTeleport: boolean
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
        if (!disableTeleport) {
          pawn.showTeleportSpaces = playerPawnActions.showTeleportSpaces
        }
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

export const shouldHighlightSpace = (
  playerHeldPawn: PlayerHeldPawn,
  player: DBPlayer,
  tileData: DBTile,
  colIndex: number,
  rowIndex: number
): boolean => {
  let highlightSpace = false;
  
  if (playerHeldPawn && playerHeldPawn.playerHeld === player.number) {
    if (playerHeldPawn.showMovableDirections.length) {
      if (tileData.gridPosition[0] !== playerHeldPawn.gridPosition[0] || tileData.gridPosition[1] !== playerHeldPawn.gridPosition[1]) {
        let rowBlocked = true;
        if (player.playerDirections.includes("up")) {
          if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
            tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] - 1) {
            if (tileHasBlockedSpace(tileData, "up", playerHeldPawn)) {
              if (colIndex === playerHeldPawn.blockedPositions.up.position![0]) {
                if (rowIndex <= playerHeldPawn.blockedPositions.up.position![1]) {
                  rowBlocked = true;
                }
                else if (rowIndex > playerHeldPawn.blockedPositions.up.position![1]) {
                  rowBlocked = false;
                }
              }
            }
            else {
              if (colIndex === playerHeldPawn.position[0] - 1 && playerHeldPawn.position[0] === 2) {
                if (!playerHeldPawn.blockedPositions.up.gridPosition) {
                  rowBlocked = false;
                }
              }
            }
          }
        }

        if (player.playerDirections.includes("left")) {
          if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] - 1 && 
            tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
            if (tileHasBlockedSpace(tileData, "left", playerHeldPawn) && player.playerDirections.includes("left")) {
              if (rowIndex === playerHeldPawn.blockedPositions.left.position![1]) {
                if (colIndex <= playerHeldPawn.blockedPositions.left.position![0]) {
                  rowBlocked = true;
                }
                else if (colIndex > playerHeldPawn.blockedPositions.left.position![0]) {
                  rowBlocked = false;
                }
              }
            }
            else {
              if (rowIndex === playerHeldPawn.position[1] + 1 && playerHeldPawn.position[1] === 1) {
                if (!playerHeldPawn.blockedPositions.left.gridPosition) {
                  rowBlocked = false;
                }
              }
            }
          }
        }
        
        if (player.playerDirections.includes("right")) {
          if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] + 1 && 
            tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
            if (tileHasBlockedSpace(tileData, "right", playerHeldPawn) && player.playerDirections.includes("right")) {
              if (rowIndex === playerHeldPawn.blockedPositions.right.position![1]) {
                if (colIndex >= playerHeldPawn.blockedPositions.right.position![0]) {
                  rowBlocked = true;
                }
                else if (colIndex < playerHeldPawn.blockedPositions.right.position![0]) {
                  rowBlocked = false;
                }
              }
            }
            else {
              if (rowIndex === playerHeldPawn.position[1] - 1 && playerHeldPawn.position[1] === 2) {
                if (!playerHeldPawn.blockedPositions.right.gridPosition) {
                  rowBlocked = false;
                }
              }
            }
          }
        }

        if (player.playerDirections.includes("down")) {
          if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
            tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] + 1) {
            if (tileHasBlockedSpace(tileData, "down", playerHeldPawn) && player.playerDirections.includes("down")) {
              if (colIndex === playerHeldPawn.blockedPositions.down.position![0]) {
                if (rowIndex >= playerHeldPawn.blockedPositions.down.position![1]) {
                  rowBlocked = true;
                }
                else if (rowIndex < playerHeldPawn.blockedPositions.down.position![1]) {
                  rowBlocked = false;
                }
              }
            }
            else {
              if (colIndex === playerHeldPawn.position[0] + 1 && playerHeldPawn.position[0] === 1) {
                if (!playerHeldPawn.blockedPositions.down.gridPosition) {
                  rowBlocked = false;
                }
              }
            }
          }
        }

        highlightSpace = !rowBlocked
      }
      else if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
        let rowBlocked = true;
        
        // column directly above from pawn (up movement)
        if (rowIndex < playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && player.playerDirections.includes("up")) {
          if (tileHasBlockedSpace(tileData, "up", playerHeldPawn)) {
            if (colIndex === playerHeldPawn.blockedPositions.up.position![0]) {
              if (rowIndex <= playerHeldPawn.blockedPositions.up.position![1]) {
                rowBlocked = true;
              }
              else if (rowIndex > playerHeldPawn.blockedPositions.up.position![1]) {
                rowBlocked = false;
              }
            }
          }
          else {
            rowBlocked = false;
          }
        }
        else if (colIndex < playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && player.playerDirections.includes("left")) {
          if (tileHasBlockedSpace(tileData, "left", playerHeldPawn)) {
            if (rowIndex === playerHeldPawn.blockedPositions.left.position![1]) {
              if (colIndex <= playerHeldPawn.blockedPositions.left.position![0]) {
                rowBlocked = true;
              }
              else if (colIndex > playerHeldPawn.blockedPositions.left.position![0]) {
                
                rowBlocked = false;
              }
            }
          }
          else {
            
            rowBlocked = false;
          }
        }
        else if (colIndex > playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && player.playerDirections.includes("right")) {
          if (tileHasBlockedSpace(tileData, "right", playerHeldPawn)) {
            if (rowIndex === playerHeldPawn.blockedPositions.right.position![1]) {
              if (colIndex >= playerHeldPawn.blockedPositions.right.position![0]) {
                rowBlocked = true;
              }
              else if (colIndex < playerHeldPawn.blockedPositions.right.position![0]) {
                rowBlocked = false;
              }
            }
          }
          else {
            rowBlocked = false;
          }
        }
        else if (rowIndex > playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && player.playerDirections.includes("down")) {
          if (tileHasBlockedSpace(tileData, "down", playerHeldPawn)) {
            if (colIndex === playerHeldPawn.blockedPositions.down.position![0]) {
              if (rowIndex >= playerHeldPawn.blockedPositions.down.position![1]) {
                rowBlocked = true;
              }
              else if (rowIndex < playerHeldPawn.blockedPositions.down.position![1]) {
                rowBlocked = false;
              }
            }
          }
          else {
            rowBlocked = false;
          }
        }


        highlightSpace = !rowBlocked
      }
    }
  }

  return highlightSpace;
}