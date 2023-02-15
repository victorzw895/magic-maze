import { useEffect, useState } from 'react';
import { heroColor, direction, Escalator, Room } from '../../types';
import { tileWallSize, spaceSize } from '../../constants';
import { usePawn, BlockedPositions } from '../../Contexts/PawnContext';
import { usePlayerState, usePlayerDispatch } from '../../Contexts/PlayerContext';
import { useGame } from '../../Contexts/GameContext';
import { useDocData, setDoc } from '../../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { 
  getEscalatorSpace,
  getFirstBlockedSpace
} from '../../Helpers/PawnMethods';

interface pawnProps {
  color: heroColor,
}

const Pawn = ({color}: pawnProps) => {
  // const [state, forceRerender] = useState(0); // TODO remove for testing re-render
  const { gameState } = useGame();
  const playerState = usePlayerState();
  const playerDispatch = usePlayerDispatch();
  const { pawnDispatch } = usePawn();

  const [room, loading] = useDocData(gameState.roomId);

  const { pawns, players, tiles }: Room = room

  // // Recalculate blocked position and showMovable when other player moves pawns
  // // NOTE: BUG: Need to recalculate when pawn held and add new tile
  // // useEffect(() => {
  // //   (async() => {
  // //     if (room && pawns) {
  // //       const currentPlayer = players.find((player: any) => player.number === playerState.number)!
  // //       const playerHeldPawn: DBHeroPawn = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld === currentPlayer.number)
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
  
  // //         // currentPlayer.playerDirections.forEach((direction: direction) => {
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
  

  const showAvailableActions = () => {
    const pawnColor = pawns[color];
    const currentPlayer = players.find((player: any) => player.number === playerState.number)
    if (!currentPlayer) return;
    const playerDirections = currentPlayer.playerDirections;

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

    if (pawnColor.playerHeld && pawnColor.playerHeld === currentPlayer.number) {
      // get pawn position
      // get player direction
      // showArea for spaces in player direction from pawn position
      const escalatorSpaces: Escalator[] = [];
      playerDirections.forEach((direction: direction) => {
        const blockedSpace = getFirstBlockedSpace(tiles, pawns, pawnColor, direction);
        blockedDirections[direction].position = blockedSpace.position
        blockedDirections[direction].gridPosition = blockedSpace.gridPosition
        if (currentPlayer.playerAbilities.includes("escalator")) {
          const escalatorSpace = getEscalatorSpace(tiles, pawns, pawnColor, direction);
          if (
            escalatorSpace &&
            isEqual(escalatorSpace.gridPosition, pawnColor.gridPosition) && 
            isEqual(escalatorSpace.position, pawnColor.position)
          ) {
          escalatorSpaces.push(escalatorSpace);
          }
        }
      })

      
      console.log('escalator spaces', escalatorSpaces)

      pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color});
      playerDispatch({type: "showMovableSpaces", value: playerDirections})
      // teleport
      if (currentPlayer.playerAbilities.includes("teleport")) {
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
    (() => {
      if (!room) return;
      showAvailableActions()
    })()
  }, [room?.pawns[color].playerHeld, room?.tiles]) // + re-run useEffect when new tile added to room.tiles


  const toggleMovableSpaces = async () => {
    if (!room) return;
    const roomPawns = pawns;
    const pawnColor = roomPawns[color];
    const currentPlayer = players.find((player: any) => player.number === playerState.number)

    if (!currentPlayer) return;
    if (!pawnColor.playerHeld) {

      Object.values(roomPawns).forEach((pawn: any) => {
        if (pawn.color === color) {
          pawn.playerHeld = currentPlayer.number
        } 
        else if (pawn.playerHeld === currentPlayer.number) {
          pawn.playerHeld = null;
        }
      })

      await setDoc(
        gameState.roomId, 
        { 
          pawns: roomPawns
        },
      )
    }
    else if (pawnColor.playerHeld === currentPlayer.number) {
      roomPawns[color].playerHeld = null;
  
      await setDoc(
        gameState.roomId, 
        { 
          pawns: roomPawns
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
        !loading && <div className="pawn-grid"
          style={{
            gridColumnStart: pawns[color]?.gridPosition[0],
            gridRowStart: pawns[color]?.gridPosition[1],
            marginTop: pawns[color]?.gridPosition[0] < 8 ? getDisplacementValue(pawns[color]?.gridPosition[0]) : tileWallSize,
            marginBottom: pawns[color]?.gridPosition[0] > 8 ? getDisplacementValue(pawns[color]?.gridPosition[0]) : tileWallSize,
            marginLeft: pawns[color]?.gridPosition[1] > 8 ? getDisplacementValue(pawns[color]?.gridPosition[1]) : tileWallSize,
            marginRight: pawns[color]?.gridPosition[1] < 8 ? getDisplacementValue(pawns[color]?.gridPosition[1]) : tileWallSize,
            placeSelf: "center",
            position: "static"
          }}>
            {/* {console.log('rendering pawn')} */}
          <div 
            className={`pawn ${color}`} 
             // TODO: disable if game paused  double check
            onClick={gameState.gameOver || room.heroesEscaped.includes(color) ? () => {} : !room.gamePaused ? toggleMovableSpaces : () => {}}
            style={{
              gridColumnStart: pawns[color]?.position[0] + 1,
              gridRowStart: pawns[color]?.position[1] + 1,
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
                  `${pawns[color]?.playerHeld ? 
                    (pawns[color]?.playerHeld === playerState.number ?
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
}

Pawn.whyDidYouRender = true;

export default Pawn;
