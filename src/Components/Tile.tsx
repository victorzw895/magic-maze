// import { memo } from 'react';
// import Space from './Space';
// import { DBTile, TeleporterSpace, ExplorationSpace, WeaponSpace, ExitSpace, TimerSpace } from '../types';
// import { tileWallSize } from '../constants';
// import isEqual from 'lodash/isEqual';
// import { 
//   usePlayerDocState,
//   usePlayerHeldPawnDocState 
// } from '../Contexts/FirestoreContext';
// import { getDisplacementValue, tileHasBlockedSpace } from '../Helpers/TileMethods';

// interface tileProps {
//   tileData: DBTile,
//   tileIndex: number,
// }

// const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
//   return isEqual(prevProps, nextProps);
// }

// // memo could be good
// const Tile = ({tileIndex, tileData}: tileProps) => {
//   console.log('tile re render')
//   const { player } = usePlayerDocState();
//   const playerHeldPawn = usePlayerHeldPawnDocState()
  
//   return (
//     <>
//       {tileData ?
//         <div className={`tile ${tileData.id === '1a' ? "start-tile" : ""}`} 
//           style={
//             {
//               gridColumnStart: tileData.gridPosition[0],
//               gridRowStart: tileData.gridPosition[1],
//               marginTop: tileData.gridPosition[0] < 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
//               marginBottom: tileData.gridPosition[0] > 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
//               marginLeft: tileData.gridPosition[1] > 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
//               marginRight: tileData.gridPosition[1] < 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
//               placeSelf: "center"
//             }
//           }>
//           {tileData.spaces && Object.values(tileData.spaces).map((row, rowIndex) => {
//             let highlightSpace = false;

//             return (
//               <div className="row" key={`row${rowIndex}`}>
//                 {row.map((space, colIndex) => {
//                   if (playerHeldPawn && playerHeldPawn.playerHeld === player.number) {
//                     if (playerHeldPawn.showMovableDirections.length) {
//                       if (tileData.gridPosition[0] !== playerHeldPawn.gridPosition[0] || tileData.gridPosition[1] !== playerHeldPawn.gridPosition[1]) {
//                         let rowBlocked = true;
//                         if (player.playerDirections.includes("up")) {
//                           if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
//                             tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] - 1) {
//                             if (tileHasBlockedSpace(tileData, "up", playerHeldPawn)) {
//                               if (colIndex === playerHeldPawn.blockedPositions.up.position![0]) {
//                                 if (rowIndex <= playerHeldPawn.blockedPositions.up.position![1]) {
//                                   rowBlocked = true;
//                                 }
//                                 else if (rowIndex > playerHeldPawn.blockedPositions.up.position![1]) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                             else {
//                               if (colIndex === playerHeldPawn.position[0] - 1 && playerHeldPawn.position[0] === 2) {
//                                 if (!playerHeldPawn.blockedPositions.up.gridPosition) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                           }
//                         }
  
//                         if (player.playerDirections.includes("left")) {
//                           if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] - 1 && 
//                             tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
//                             if (tileHasBlockedSpace(tileData, "left", playerHeldPawn) && player.playerDirections.includes("left")) {
//                               if (rowIndex === playerHeldPawn.blockedPositions.left.position![1]) {
//                                 if (colIndex <= playerHeldPawn.blockedPositions.left.position![0]) {
//                                   rowBlocked = true;
//                                 }
//                                 else if (colIndex > playerHeldPawn.blockedPositions.left.position![0]) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                             else {
//                               if (rowIndex === playerHeldPawn.position[1] + 1 && playerHeldPawn.position[1] === 1) {
//                                 if (!playerHeldPawn.blockedPositions.left.gridPosition) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                           }
//                         }
                        
//                         if (player.playerDirections.includes("right")) {
//                           if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] + 1 && 
//                             tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
//                             if (tileHasBlockedSpace(tileData, "right", playerHeldPawn) && player.playerDirections.includes("right")) {
//                               if (rowIndex === playerHeldPawn.blockedPositions.right.position![1]) {
//                                 if (colIndex >= playerHeldPawn.blockedPositions.right.position![0]) {
//                                   rowBlocked = true;
//                                 }
//                                 else if (colIndex < playerHeldPawn.blockedPositions.right.position![0]) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                             else {
//                               if (rowIndex === playerHeldPawn.position[1] - 1 && playerHeldPawn.position[1] === 2) {
//                                 if (!playerHeldPawn.blockedPositions.right.gridPosition) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                           }
//                         }
  
//                         if (player.playerDirections.includes("down")) {
//                           if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
//                             tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] + 1) {
//                             if (tileHasBlockedSpace(tileData, "down", playerHeldPawn) && player.playerDirections.includes("down")) {
//                               if (colIndex === playerHeldPawn.blockedPositions.down.position![0]) {
//                                 if (rowIndex >= playerHeldPawn.blockedPositions.down.position![1]) {
//                                   rowBlocked = true;
//                                 }
//                                 else if (rowIndex < playerHeldPawn.blockedPositions.down.position![1]) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                             else {
//                               if (colIndex === playerHeldPawn.position[0] + 1 && playerHeldPawn.position[0] === 1) {
//                                 if (!playerHeldPawn.blockedPositions.down.gridPosition) {
//                                   rowBlocked = false;
//                                 }
//                               }
//                             }
//                           }
//                         }
  
//                         highlightSpace = !rowBlocked
//                       }
//                       else if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
//                         let rowBlocked = true;
                        
//                         // column directly above from pawn (up movement)
//                         if (rowIndex < playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && player.playerDirections.includes("up")) {
//                           if (tileHasBlockedSpace(tileData, "up", playerHeldPawn)) {
//                             if (colIndex === playerHeldPawn.blockedPositions.up.position![0]) {
//                               if (rowIndex <= playerHeldPawn.blockedPositions.up.position![1]) {
//                                 rowBlocked = true;
//                               }
//                               else if (rowIndex > playerHeldPawn.blockedPositions.up.position![1]) {
//                                 rowBlocked = false;
//                               }
//                             }
//                           }
//                           else {
//                             rowBlocked = false;
//                           }
//                         }
//                         else if (colIndex < playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && player.playerDirections.includes("left")) {
//                           if (tileHasBlockedSpace(tileData, "left", playerHeldPawn)) {
//                             if (rowIndex === playerHeldPawn.blockedPositions.left.position![1]) {
//                               if (colIndex <= playerHeldPawn.blockedPositions.left.position![0]) {
//                                 rowBlocked = true;
//                               }
//                               else if (colIndex > playerHeldPawn.blockedPositions.left.position![0]) {
                                
//                                 rowBlocked = false;
//                               }
//                             }
//                           }
//                           else {
                            
//                             rowBlocked = false;
//                           }
//                         }
//                         else if (colIndex > playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && player.playerDirections.includes("right")) {
//                           if (tileHasBlockedSpace(tileData, "right", playerHeldPawn)) {
//                             if (rowIndex === playerHeldPawn.blockedPositions.right.position![1]) {
//                               if (colIndex >= playerHeldPawn.blockedPositions.right.position![0]) {
//                                 rowBlocked = true;
//                               }
//                               else if (colIndex < playerHeldPawn.blockedPositions.right.position![0]) {
//                                 rowBlocked = false;
//                               }
//                             }
//                           }
//                           else {
//                             rowBlocked = false;
//                           }
//                         }
//                         else if (rowIndex > playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && player.playerDirections.includes("down")) {
//                           if (tileHasBlockedSpace(tileData, "down", playerHeldPawn)) {
//                             if (colIndex === playerHeldPawn.blockedPositions.down.position![0]) {
//                               if (rowIndex >= playerHeldPawn.blockedPositions.down.position![1]) {
//                                 rowBlocked = true;
//                               }
//                               else if (rowIndex < playerHeldPawn.blockedPositions.down.position![1]) {
//                                 rowBlocked = false;
//                               }
//                             }
//                           }
//                           else {
//                             rowBlocked = false;
//                           }
//                         }
  
  
//                         highlightSpace = !rowBlocked
//                       }
//                     }
//                   }

//                   const {type, details} = space;
//                   const playerHeldPawnColor = playerHeldPawn?.color;
//                   const highlightTeleporter = type === 'teleporter' && (details as TeleporterSpace).color === playerHeldPawnColor;
//                   const highlightEscalator = details?.hasEscalator && playerHeldPawn?.showEscalatorSpaces.length;
                  
//                   return (
//                     <Space 
//                       {
//                         ...{
//                           spaceType: type,
//                           spaceColor: (details as TeleporterSpace | ExplorationSpace | WeaponSpace | ExitSpace)?.color,
//                           spaceHasEscalator: details?.hasEscalator,
//                           spaceEscalatorName: details?.escalatorName,
//                           spaceIsDisabled: (details as TimerSpace)?.isDisabled,
//                           spaceWeaponStolen: (details as WeaponSpace)?.weaponStolen,
//                         }
//                       }
//                       key={`space${rowIndex}-${colIndex} ${highlightSpace ? "highlight" : ""}`} 
//                       spacePosition={[colIndex, rowIndex]} 
//                       gridPosition={tileData.gridPosition}
//                       tileIndex={tileIndex}
//                       showMovableArea={highlightSpace} 
//                       colorSelected={(highlightSpace || highlightTeleporter || highlightEscalator) && playerHeldPawn ? playerHeldPawn.color : null}
//                       highlightTeleporter={highlightTeleporter ? playerHeldPawn.showTeleportSpaces: null}
//                       highlightEscalator={highlightEscalator ? playerHeldPawn.showEscalatorSpaces: []}
//                     />
//                   )
//                 })}
//               </div>
//             )
//           })}
//           <img 
//             key={tileData.id}
//             draggable={false}
//             src={`/${tileData.id}.jpg`} alt={`tile-${tileData.id}`}
//             style={{
//               transform: `rotate(${tileData.rotation}deg)`,
//             }}>
//           </img>
//         </div>
//             :
//         <>
//         </>
//       }
//     </>
//   )
// }

// // Tile.whyDidYouRender = true

// export default Tile;


import { memo } from 'react';
import Space from './Space';
import { DBTile, TeleporterSpace, ExplorationSpace, WeaponSpace, ExitSpace, TimerSpace } from '../types';
import { tileWallSize } from '../constants';
import isEqual from 'lodash/isEqual';
import { 
  usePlayerDocState,
  usePlayerHeldPawnDocState 
} from '../Contexts/FirestoreContext';
import { getDisplacementValue, tileHasBlockedSpace } from '../Helpers/TileMethods';

interface tileProps {
  tileData: DBTile,
  tileIndex: number,
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  return isEqual(prevProps, nextProps);
}

const Tile = ({tileIndex, tileData}: tileProps) => {
  console.log('tile re render')
  const { player } = usePlayerDocState();
  const playerHeldPawn = usePlayerHeldPawnDocState()
  
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
            let highlightSpace = false;

            return (
              <div className="row" key={`row${rowIndex}`}>
                {row.map((space, colIndex) => {
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
        </div>
            :
        <>
        </>
      }
    </>
  )
}

// Tile.whyDidYouRender = true

export default Tile;
