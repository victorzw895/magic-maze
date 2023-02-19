import { useEffect, useState, memo } from 'react';
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
  console.log('pawn re render', pawnData)
  const { color } = pawnData;
  const { gameState } = useGame();
  const gamePaused = useGamePausedDocState();
  const playerDispatch = usePlayerDispatch();
  const pawnDispatch = usePawnDispatch();

  const { player } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();

  // // Recalculate blocked position and showMovable when other player moves pawns
  // // NOTE: BUG: Need to recalculate when pawn held and add new tile
  // // useEffect(() => {
  // //   (async() => {
  // //     if (room && pawns) {
  // //       const player = players.find((player: any) => player.number === playerState.number)!
  // //       const playerHeldPawn: DBHeroPawn = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld === player.number)
  // //       if (playerHeldPawn) {
  // //         const roomPawns = pawns;
  
  // //         // const blockedDirections: BlockedPositions = {
  // //         //   up: {
  // //         //     position: null,
  // //         //     gridPosition: null
  // //         //   },
  // //         //   right: {
  // //         //     position: null,
  // //         //     gridPosition: null
  // //         //   },
  // //         //   left: {
  // //         //     position: null,
  // //         //     gridPosition: null
  // //         //   },
  // //         //   down: {
  // //         //     position: null,
  // //         //     gridPosition: null
  // //         //   },
  // //         // }
  
  // //         // player.playerDirections.forEach((direction: direction) => {
  // //         //   const blockedSpace = getFirstBlockedSpace(playerHeldPawn, direction);
  // //         //   blockedDirections[direction].position = blockedSpace.position
  // //         //   blockedDirections[direction].gridPosition = blockedSpace.gridPosition
  // //         // })
  
  // //         // roomPawns[playerHeldPawn.color].blockedPositions = blockedDirections;
  
  // //         // await setDoc(
  // //         //   gameState.roomId, 
  // //         //   { 
  // //         //     pawns: roomPawns
  // //         //   },
  // //         // )
  // //       }
  // //     }
  // //   })()
  // // }, [room?.pawns[color].position[0], room?.pawns[color].position[1]])
  

  const showAvailableActions = async () => {
    // const pawnData = pawns[color];
    // const player = players.find((player: any) => player.number === playerState.number)
    // if (!player) return;
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

    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns } = roomFound;

    if (pawnData.playerHeld && pawnData.playerHeld === player.number) {
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

      
      console.log('escalator spaces', escalatorSpaces)

      pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color});
      // TODO move all player dispatch to single dispatch
      // ??? can i combine pawnDispatch + playerDispatch?
      playerDispatch({type: "showMovableSpaces", value: playerDirections})
      // teleport
      if (player.playerAbilities.includes("teleport")) {
        playerDispatch({type: "showTeleportSpaces", color})
      }
      // escalator
      if (escalatorSpaces.length) {
        console.log('dispatch escalator', escalatorSpaces)
        playerDispatch({type: "showEscalatorSpaces", value: escalatorSpaces})
      }
    }
  }

  useEffect(() => {
    showAvailableActions()
  }, [pawnData.playerHeld, tiles]) // + re-run useEffect when new tile added to room.tiles


  const toggleMovableSpaces = async () => {
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns } = roomFound;
    
    if (!player) return;
    if (!pawnData.playerHeld) {

      Object.values(pawns).forEach((pawn: any) => {
        if (pawn.color === color) {
          pawn.playerHeld = player.number
        } 
        else if (pawn.playerHeld === player.number) {
          pawn.playerHeld = null;
        }
      })
      // pawnData.playerHeld = player.number

      await setDoc(
        gameState.roomId, 
        { 
          pawns: pawns
        },
      )
    }
    else if (pawnData.playerHeld === player.number) {
      pawns[color].playerHeld = null;
  
      await setDoc(
        gameState.roomId, 
        { 
          pawns: pawns
        },
      )
    }
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
