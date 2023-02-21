import { useEffect, useState, memo, useRef } from 'react';
import { heroColor, direction, Escalator, Room, DBHeroPawn, DBTile } from '../../types';
import { tileWallSize, spaceSize } from '../../constants';
import { usePawn, BlockedPositions, usePawnDispatch } from '../../Contexts/PawnContext';
import { usePlayerState, usePlayerDispatch } from '../../Contexts/PlayerContext';
import { useGame } from '../../Contexts/GameContext';
import { useDocData, setDoc, getDoc } from '../../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { 
  getEscalatorSpace,
  getFirstBlockedSpace
} from '../../Helpers/PawnMethods';
import { showMovableSpaces } from '../../Helpers/TileMethods';
import { 
  useTilesDocState,
  usePlayerDocState,
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
  useGamePausedDocState,
} from '../../Contexts/FirestoreContext';

interface pawnProps {
  pawnData: DBHeroPawn,
}

const Pawn = ({pawnData}: pawnProps) => {
  const { color } = pawnData;
  const { gameState } = useGame();
  const gamePaused = useGamePausedDocState();

  const { player } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();

  // const showAvailableActions = async () => {
    

  //   const docSnap = await getDoc(gameState.roomId);
  //   if (!docSnap.exists()) return;
  //   const roomFound: Room = docSnap.data() as Room;
  //   const { pawns } = roomFound;
    
  //   if (!pawnData.playerHeld) {
  //     // pawnDispatch({
  //     //   type: 'showActions',
  //     //   blockedPositions: blockedDirections, // TODO rename blockedDirections ??
  //     //   color,
  //     //   playerDirections: [],
  //     //   escalatorSpaces: [],
  //     //   teleporterSpaces: null
  //     // })
  //     await setDoc(
  //       gameState.roomId, 
  //       { 
  //         pawns: {
  //           ...pawns,
  //           [color]: {
  //             ...pawns[color],
  //             blockedPositions: blockedDirections,
  //             showMovableDirections: [],
  //             showEscalatorSpaces: [],
  //             showTeleportSpaces: null,
  //           }
  //         }
  //       },
  //     )
  //   }
  //   else if (pawnData.playerHeld === player.number) {
  //     const playerDirections = player.playerDirections;

  //     // get pawn position
  //     // get player direction
  //     // showArea for spaces in player direction from pawn position
  //     const escalatorSpaces: Escalator[] = [];
  //     playerDirections.forEach((direction: direction) => {
  //       const blockedSpace = getFirstBlockedSpace(tiles, pawns, pawnData, direction);
  //       blockedDirections[direction].position = blockedSpace.position
  //       blockedDirections[direction].gridPosition = blockedSpace.gridPosition
  //       if (player.playerAbilities.includes("escalator")) {
  //         const escalatorSpace = getEscalatorSpace(tiles, pawns, pawnData, direction);
  //         if (
  //           escalatorSpace &&
  //           isEqual(escalatorSpace.gridPosition, pawnData.gridPosition) && 
  //           isEqual(escalatorSpace.position, pawnData.position)
  //         ) {
  //         escalatorSpaces.push(escalatorSpace);
  //         }
  //       }
  //     })

  //     await setDoc(
  //       gameState.roomId, 
  //       { 
  //         pawns: {
  //           ...pawns,
  //           [color]: {
  //             ...pawns[color],
  //             blockedPositions: blockedDirections,
  //             showMovableDirections: playerDirections,
  //             showEscalatorSpaces: escalatorSpaces,
  //             showTeleportSpaces: player.playerAbilities.includes("teleport") ? color : null,
  //           }
  //         }
  //       },
  //     )
  //     // pawnDispatch({
  //     //   type: 'showActions',
  //     //   blockedPositions: blockedDirections, // TODO rename blockedDirections ??
  //     //   color,
  //     //   playerDirections,
  //     //   escalatorSpaces: escalatorSpaces,
  //     //   teleporterSpaces: player.playerAbilities.includes("teleport") ? color : null
  //     // })
  //   }
  // }

  useEffect(() => {
    (async () => {
      if (player.number === pawnData.playerHeld) {
        const docSnap = await getDoc(gameState.roomId);
        if (!docSnap.exists()) return;
        const roomFound: Room = docSnap.data() as Room;
        const { pawns } = roomFound;
      
        const playerDirections = player.playerDirections;
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
        // get pawn position
        // get player direction
        // showArea for spaces in player direction from pawn position
        const escalatorSpaces: Escalator[] = [];
        playerDirections.forEach((direction: direction) => {
          const blockedSpace = getFirstBlockedSpace(tiles, pawns, pawnData, direction);
          blockedDirections[direction].position = blockedSpace.position
          blockedDirections[direction].gridPosition = blockedSpace.gridPosition
          if (player.playerAbilities.includes("escalator")) {
            const escalatorSpace = getEscalatorSpace(tiles, pawns, pawnData, direction);
            if (
              escalatorSpace &&
              isEqual(escalatorSpace.gridPosition, pawnData.gridPosition) && 
              isEqual(escalatorSpace.position, pawnData.position)
            ) {
            escalatorSpaces.push(escalatorSpace);
            }
          }
        })

        await setDoc(
          gameState.roomId, 
          { 
            pawns: {
              ...pawns,
              [pawnData.color]: {
                ...pawnData,
                blockedPositions: blockedDirections,
                showMovableDirections: playerDirections,
                showEscalatorSpaces: escalatorSpaces,
                showTeleportSpaces: player.playerAbilities.includes("teleport") ? color : null,
              }
            }
          },
        )
      
        // pawn.playerHeld = player.number
        // pawn.blockedPositions = blockedDirections
        // pawn.showMovableDirections = playerDirections
        // pawn.showEscalatorSpaces = escalatorSpaces
        // pawn.showTeleportSpaces = player.playerAbilities.includes("teleport") ? color : null
      }
      // await toggleMovableSpaces() // TODO either toggle off all movable actions, or recalculate
    })()
  }, [tiles]) // + re-run useEffect when new tile added to room.tiles

  const toggleMovableSpaces = async () => {
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns } = roomFound;

    await showMovableSpaces(gameState.roomId, pawns, player, pawnData, tiles)

    // const blockedDirections: BlockedPositions = {
    //   up: {
    //     position: null,
    //     gridPosition: null
    //   },
    //   right: {
    //     position: null,
    //     gridPosition: null
    //   },
    //   left: {
    //     position: null,
    //     gridPosition: null
    //   },
    //   down: {
    //     position: null,
    //     gridPosition: null
    //   },
    // }
    
    // if (!player) return;
    // if (!pawnData.playerHeld) {

    //   Object.values(pawns).forEach((pawn: any) => {
    //     if (pawn.color === color) {

    //     const playerDirections = player.playerDirections;

    //     // get pawn position
    //     // get player direction
    //     // showArea for spaces in player direction from pawn position
    //     const escalatorSpaces: Escalator[] = [];
    //     playerDirections.forEach((direction: direction) => {
    //       const blockedSpace = getFirstBlockedSpace(tiles, pawns, pawnData, direction);
    //       blockedDirections[direction].position = blockedSpace.position
    //       blockedDirections[direction].gridPosition = blockedSpace.gridPosition
    //       if (player.playerAbilities.includes("escalator")) {
    //         const escalatorSpace = getEscalatorSpace(tiles, pawns, pawnData, direction);
    //         if (
    //           escalatorSpace &&
    //           isEqual(escalatorSpace.gridPosition, pawnData.gridPosition) && 
    //           isEqual(escalatorSpace.position, pawnData.position)
    //         ) {
    //         escalatorSpaces.push(escalatorSpace);
    //         }
    //       }
    //     })
    //       pawn.playerHeld = player.number
    //       pawn.blockedPositions = blockedDirections
    //       pawn.showMovableDirections = playerDirections
    //       pawn.showEscalatorSpaces = escalatorSpaces
    //       pawn.showTeleportSpaces = player.playerAbilities.includes("teleport") ? color : null
    //     } 
    //     else if (pawn.playerHeld === player.number) {
    //       pawn.playerHeld = null;
    //       pawn.blockedPositions = blockedDirections
    //       pawn.showMovableDirections = []
    //       pawn.showEscalatorSpaces = []
    //       pawn.showTeleportSpaces = null
    //     }
    //   })
    //   // pawnData.playerHeld = player.number

    //   await setDoc(
    //     gameState.roomId, 
    //     { 
    //       pawns: pawns
    //     },
    //   )
    // }
    // else if (pawnData.playerHeld === player.number) {
    //   console.log('pawn test fsaldjfs', {pawnData, pawns, color})
    //   pawns[color].playerHeld = null;
    //   pawns[color].blockedPositions = blockedDirections
    //   pawns[color].showMovableDirections = []
    //   pawns[color].showEscalatorSpaces = []
    //   pawns[color].showTeleportSpaces = null
  
    //   await setDoc(
    //     gameState.roomId, 
    //     { 
    //       pawns: pawns
    //     },
    //   )
    // }
    // forceRerender(state + 1)
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  // console.count(`Pawn ReRender ${color}`)
 
  return (
    <>
      {
        <div className="pawn-grid"
          style={{
            gridColumnStart: pawnData?.gridPosition[0],
            gridRowStart: pawnData?.gridPosition[1],
            marginTop: pawnData?.gridPosition[0] < 8 ? getDisplacementValue(pawnData?.gridPosition[0]) : tileWallSize,
            marginBottom: pawnData?.gridPosition[0] > 8 ? getDisplacementValue(pawnData?.gridPosition[0]) : tileWallSize,
            marginLeft: pawnData?.gridPosition[1] > 8 ? getDisplacementValue(pawnData?.gridPosition[1]) : tileWallSize,
            marginRight: pawnData?.gridPosition[1] < 8 ? getDisplacementValue(pawnData?.gridPosition[1]) : tileWallSize,
            placeSelf: "center",
            position: "static"
          }}>
            {/* {console.log('rendering pawn')} */}
          <div 
            className={`pawn ${color}`} 
             // TODO: disable if game paused  double check
            onClick={gameState.gameOver ? () => {} : !gamePaused ? toggleMovableSpaces : () => {}}
            // onClick={gameState.gameOver || room.heroesEscaped.includes(color) ? () => {} : !room.gamePaused ? toggleMovableSpaces : () => {}}
            style={{
              gridColumnStart: pawnData?.position[0] + 1,
              gridRowStart: pawnData?.position[1] + 1,
              position: "relative"
            }}
          >
            <img 
              key={`${color}-pawn`}
              draggable={false}
              src={`/${color}-pawn.svg`} 
              alt={`${color}-piece`} 
              style={{
                border: 
                  `${pawnData?.playerHeld ? 
                    (pawnData?.playerHeld === player.number ?
                      "2px solid blue" 
                        : 
                      "2px solid grey")
                    :
                    ""}`
                }}/>
          </div>
        </div>
      }
    </>
  )
};

// Pawn.whyDidYouRender = true;

export default Pawn;
