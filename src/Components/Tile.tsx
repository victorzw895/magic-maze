import { memo } from 'react';
import Space from './Space';
import { direction, HeroPawn, DBTile, DBHeroPawn, DBPlayer, TeleporterSpace, ExplorationSpace, WeaponSpace, ExitSpace, TimerSpace } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn, usePawnDispatch } from '../Contexts/PawnContext';
import { usePlayerState, usePlayerDispatch } from '../Contexts/PlayerContext';
import isEqual from 'lodash/isEqual';
import { 
  usePlayerDocState,
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
  usePlayerHeldPawnDocState 
} from '../Contexts/FirestoreContext';

interface tileProps {
  tileData: DBTile,
  tileIndex: number,
  // playerHeldPawn: DBHeroPawn,
  // currentPlayer: DBPlayer,
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  // console.log(prevProps, nextProps)
  // TODO FIX
  // if (!prevProps.playerHeldPawn || !nextProps.playerHeldPawn) {
  //   return false;
  // }
  // if (prevProps.playerHeldPawn.gridPosition[0] !== nextProps.playerHeldPawn.gridPosition[0] ||
  //     prevProps.playerHeldPawn.gridPosition[1] !== nextProps.playerHeldPawn.gridPosition[1]) {
  //       return false;
  //     }
  // else {
  //   if (prevProps.playerHeldPawn.position[0] !== nextProps.playerHeldPawn.position[0] ||
  //       prevProps.playerHeldPawn.position[1] !== nextProps.playerHeldPawn.position[1]) {
  //       return false
  //     }
  // }
  
  // return true

  return isEqual(prevProps, nextProps);
}

// const usePlayerHeldPawn = () => {
//   const { player } = usePlayerDocState();

//   const green = useGreenDocState();
//   const yellow = useYellowDocState();
//   const purple = usePurpleDocState();
//   const orange = useOrangeDocState();

//   const getPlayerHeldPawn = () => {
//     const pawnHeld = Object.values({green, yellow, orange, purple}).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === player.number);
//     return pawnHeld as DBHeroPawn;
//   }

//   return getPlayerHeldPawn()
// }

const Tile = memo(({tileIndex, tileData}: tileProps) => {
  // const playerState = usePlayerState(); // fixed
  const { player } = usePlayerDocState();
  
  // const pawnState = usePawn(); // 2x extra re render

  const playerHeldPawn = usePlayerHeldPawnDocState()
  console.log('$$$ re rendering tile', {tileIndex, tileData, playerHeldPawn, player})
  // const pawnDispatch = usePawnDispatch();

  const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: DBHeroPawn) => {
    // console.log("tilehas blocked space")
    if (pawnHeld.showMovableDirections?.includes(direction)) {
      if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
        if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
            tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
              // console.log('true')
              return true;
            }
      }
    }
    return false;
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }
  
  return (
    <>
      {tileData ?
        <div className={`tile ${tileData.id === '1a' ? "start-tile" : ""}`} 
          style={
            {
              gridColumnStart: tileData.gridPosition[0],
              gridRowStart: tileData.gridPosition[1],
              marginTop: tileData.gridPosition[0] < 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
              marginBottom: tileData.gridPosition[0] > 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
              marginLeft: tileData.gridPosition[1] > 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
              marginRight: tileData.gridPosition[1] < 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
              placeSelf: "center"
            }
          }>
          {tileData.spaces && Object.values(tileData.spaces).map((row, rowIndex) => {
            // let rowBlocked = true;
            let highlightSpace = false;

            return (
              <div className="row" key={`row${rowIndex}`}>
                {/* {console.log("re rendering tile ******")} */}
                {row.map((space, colIndex) => {
                  if (playerHeldPawn && playerHeldPawn.playerHeld === player.number) {
                    // const localPawn = pawnState[playerHeldPawn.color]
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

                  const {type, details} = space;
                  const playerHeldPawnColor = playerHeldPawn?.color;
                  const highlightTeleporter = type === 'teleporter' && (details as TeleporterSpace).color === playerHeldPawnColor;
                  const highlightEscalator = details?.hasEscalator && playerHeldPawn?.showEscalatorSpaces.length;
                  
                  return (
                    <Space 
                      {
                        ...{
                          spaceType: type,
                          spaceColor: (details as TeleporterSpace | ExplorationSpace | WeaponSpace | ExitSpace)?.color,
                          spaceHasEscalator: details?.hasEscalator,
                          spaceEscalatorName: details?.escalatorName,
                          spaceIsDisabled: (details as TimerSpace)?.isDisabled,
                          spaceWeaponStolen: (details as WeaponSpace)?.weaponStolen,
                        }
                      }
                      // playerDispatch={playerDispatch}
                      // pawnDispatch={pawnDispatch}
                      key={`space${rowIndex}-${colIndex} ${highlightSpace ? "highlight" : ""}`} 
                      spacePosition={[colIndex, rowIndex]} 
                      gridPosition={tileData.gridPosition}
                      tileIndex={tileIndex}
                      showMovableArea={highlightSpace} 
                      colorSelected={(highlightSpace || highlightTeleporter || highlightEscalator) && playerHeldPawn ? playerHeldPawn.color : null}
                      highlightTeleporter={highlightTeleporter ? playerHeldPawn.showTeleportSpaces: null}
                      highlightEscalator={highlightEscalator ? playerHeldPawn.showEscalatorSpaces: []}
                    />
                  )
                })}
              </div>
            )
          })}
          <img 
            key={tileData.id}
            draggable={false}
            src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}
            style={{
              transform: `rotate(${tileData.rotation}deg)`,
            }}>
          </img>
          {console.log("rendering tile")}
        </div>
            :
        <>
        </>
      }
    </>
  )
}, areEqual)

Tile.whyDidYouRender = true

export default Tile;
