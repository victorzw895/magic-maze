import { tileWallSize, spaceSize } from '../constants';
import { direction, Escalator, DBTile, Player, DBHeroPawn, DBPawns, DBPlayer } from '../types';
import { usePawn, BlockedPositions, usePawnDispatch } from '../Contexts/PawnContext';
import { 
  getEscalatorSpace,
  getFirstBlockedSpace
} from '../Helpers/PawnMethods';
import { useDocData, setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';

export const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: DBHeroPawn, playerState: Player) => {
  // console.log("tilehas blocked space")
  if (pawnHeld?.showMovableDirections?.includes(direction)) {
    if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
      if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
          tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
            // console.log('true')
            return true;
          }
    }
  }
  // console.log('false', pawnHeld)
  return false;
}

export const getDisplacementValue = (positionValue: number) => {
  return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
}

export const showMovableSpaces = async (roomId: string, pawns: DBPawns, player: DBPlayer, pawnData: DBHeroPawn, tiles: DBTile[]
  ) => {
    const { color } = pawnData;
    console.log('show movable space by pawn color: ', color)
    const newPawns = {...pawns}
    
    if (!player) return;
    console.log('here fsdlf')

    Object.values(newPawns).forEach((pawn: any) => {
      console.log('fsdjfljs d', pawnData, pawn)
      const blockedDirections: BlockedPositions = {
        up: {
          position: null,
          gridPosition: null
        },
        right: {
          position: null,
          gridPosition: null
        },
        left: {
          position: null,
          gridPosition: null
        },
        down: {
          position: null,
          gridPosition: null
        },
      }
      
      if (pawn.color === color && !pawnData.playerHeld) {
        const playerDirections = player.playerDirections;

        // get pawn position
        // get player direction
        // showArea for spaces in player direction from pawn position
        const escalatorSpaces: Escalator[] = [];
        playerDirections.forEach((direction: direction) => {
          const blockedSpace = getFirstBlockedSpace(tiles, newPawns, pawnData, direction);
          blockedDirections[direction].position = blockedSpace.position
          blockedDirections[direction].gridPosition = blockedSpace.gridPosition
          if (player.playerAbilities.includes("escalator")) {
            const escalatorSpace = getEscalatorSpace(tiles, newPawns, pawnData, direction);
            if (
              escalatorSpace &&
              isEqual(escalatorSpace.gridPosition, pawnData.gridPosition) && 
              isEqual(escalatorSpace.position, pawnData.position)
            ) {
            escalatorSpaces.push(escalatorSpace);
            }
          }
        })
      
        pawn.playerHeld = player.number
        pawn.blockedPositions = blockedDirections
        pawn.showMovableDirections = playerDirections
        pawn.showEscalatorSpaces = escalatorSpaces
        pawn.showTeleportSpaces = player.playerAbilities.includes("teleport") ? color : null
      } 
      else if (pawn.playerHeld === player.number) {
        pawn.playerHeld = null;
        pawn.blockedPositions = blockedDirections;
        pawn.showMovableDirections = [];
        pawn.showEscalatorSpaces = [];
        pawn.showTeleportSpaces = null;
      }
    })

    // if (pawnData.playerHeld === player.number) {
    //   console.log('pawn test fsaldjfs', {pawnData, pawns, color})
    //   newPawns[color].playerHeld = null;
    //   newPawns[color].blockedPositions = blockedDirections
    //   newPawns[color].showMovableDirections = []
    //   newPawns[color].showEscalatorSpaces = []
    //   newPawns[color].showTeleportSpaces = null
  
    //   // await setDoc(
    //   //   roomId, 
    //   //   { 
    //   //     pawns: newPawns
    //   //   },
    //   // )
    // }
    // else if (!pawnData.playerHeld) {
    //   console.log('pawn test fsaldjfs', {pawnData, pawns, color})

    //   const playerDirections = player.playerDirections;

    //     // get pawn position
    //     // get player direction
    //     // showArea for spaces in player direction from pawn position
    //     const escalatorSpaces: Escalator[] = [];
    //     playerDirections.forEach((direction: direction) => {
    //       const blockedSpace = getFirstBlockedSpace(tiles, newPawns, pawnData, direction);
    //       blockedDirections[direction].position = blockedSpace.position
    //       blockedDirections[direction].gridPosition = blockedSpace.gridPosition
    //       if (player.playerAbilities.includes("escalator")) {
    //         const escalatorSpace = getEscalatorSpace(tiles, newPawns, pawnData, direction);
    //         if (
    //           escalatorSpace &&
    //           isEqual(escalatorSpace.gridPosition, pawnData.gridPosition) && 
    //           isEqual(escalatorSpace.position, pawnData.position)
    //         ) {
    //         escalatorSpaces.push(escalatorSpace);
    //         }
    //       }
    //     })
    //   newPawns[color].playerHeld = player.number
    //   newPawns[color].blockedPositions = blockedDirections
    //   newPawns[color].showMovableDirections = playerDirections
    //   newPawns[color].showEscalatorSpaces = escalatorSpaces
    //   newPawns[color].showTeleportSpaces = player.playerAbilities.includes("teleport") ? color : null
      // Object.values(newPawns).forEach((pawn: any) => {
      //   console.log('fsdjfljs d', pawnData, pawn)
      //   if (pawn.color === color) {

        
      //     pawn.playerHeld = player.number
      //     pawn.blockedPositions = blockedDirections
      //     pawn.showMovableDirections = playerDirections
      //     pawn.showEscalatorSpaces = escalatorSpaces
      //     pawn.showTeleportSpaces = player.playerAbilities.includes("teleport") ? color : null
      //   } 
      //   else if (pawn.playerHeld === player.number) {
      //     // pawn.playerHeld = null;
      //     // pawn.blockedPositions = blockedDirections
      //     // pawn.showMovableDirections = []
      //     // pawn.showEscalatorSpaces = []
      //     // pawn.showTeleportSpaces = null
      //   }
      // })
      // // pawnData.playerHeld = player.number

      // await setDoc(
      //   roomId, 
      //   { 
      //     pawns: pawns
      //   },
      // )
    // }
    // else if (pawnData.playerHeld === player.number) {
    //   console.log('pawn test fsaldjfs', {pawnData, pawns, color})
    //   // pawns[color].playerHeld = null;
    //   // pawns[color].blockedPositions = blockedDirections
    //   // pawns[color].showMovableDirections = []
    //   // pawns[color].showEscalatorSpaces = []
    //   // pawns[color].showTeleportSpaces = null
      console.log('f jslajti gsang sd', {newPawns, pawnData})
      await setDoc(
        roomId, 
        { 
          pawns: newPawns
        },
      )
    // }
}