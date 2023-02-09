import { memo, useEffect } from 'react';
import Space from './Space';
import { direction, HeroPawn, Room, DBTile, DBHeroPawn, DBPlayer } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { usePawn } from '../Contexts/PawnContext';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
// import { useTiles } from '../Contexts/TilesContext';
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'


interface tileProps {
  startTile?: boolean | undefined,
  id?: string,
  tileData: DBTile,
  tileIndex: number,
  playerHeldPawn: DBHeroPawn,
  currentPlayer: DBPlayer
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  if (!prevProps.playerHeldPawn || !nextProps.playerHeldPawn) {
    return false;
  }
  if (prevProps.playerHeldPawn.gridPosition[0] !== nextProps.playerHeldPawn.gridPosition[0] ||
      prevProps.playerHeldPawn.gridPosition[1] !== nextProps.playerHeldPawn.gridPosition[1]) {
        return false;
      }
  else {
    if (prevProps.playerHeldPawn.position[0] !== nextProps.playerHeldPawn.position[0] ||
        prevProps.playerHeldPawn.position[1] !== nextProps.playerHeldPawn.position[1]) {
        return false
      }
  }
  
  return true
}

const Tile = memo(({startTile, id, tileIndex, tileData, playerHeldPawn, currentPlayer}: tileProps) => {
  // console.count("would have rendered Tile") // 26 on show, 16

  const { playerState } = usePlayer();

  const { pawnState } = usePawn();

  const { gameState } = useGame();

  // const gamesRef = firestore.collection('games')

  const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: HeroPawn) => {
    // console.log("tilehas blocked space")
    if (playerState?.showMovableDirections?.includes(direction)) {
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

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }
  
  return (
    <>
      {tileData ?
        <div className={`tile ${id === '1a' ? "start-tile" : ""}`} 
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
                  if (playerHeldPawn && playerHeldPawn.playerHeld === currentPlayer.number && playerState.showMovableDirections.length) {
                    const localPawn = pawnState[playerHeldPawn.color]
                    if (tileData.gridPosition[0] !== playerHeldPawn.gridPosition[0] || tileData.gridPosition[1] !== playerHeldPawn.gridPosition[1]) {
                      let rowBlocked = true;
                      if (currentPlayer.playerDirections.includes("up")) {
                        if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
                          tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] - 1) {
                          if (tileHasBlockedSpace(tileData, "up", localPawn)) {
                            if (colIndex === localPawn.blockedPositions.up.position![0]) {
                              if (rowIndex <= localPawn.blockedPositions.up.position![1]) {
                                rowBlocked = true;
                              }
                              else if (rowIndex > localPawn.blockedPositions.up.position![1]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (colIndex === playerHeldPawn.position[0] - 1 && playerHeldPawn.position[0] === 2) {
                              if (!localPawn.blockedPositions.up.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      if (currentPlayer.playerDirections.includes("left")) {
                        if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] - 1 && 
                          tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
                          if (tileHasBlockedSpace(tileData, "left", localPawn) && currentPlayer.playerDirections.includes("left")) {
                            if (rowIndex === localPawn.blockedPositions.left.position![1]) {
                              if (colIndex <= localPawn.blockedPositions.left.position![0]) {
                                rowBlocked = true;
                              }
                              else if (colIndex > localPawn.blockedPositions.left.position![0]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (rowIndex === playerHeldPawn.position[1] + 1 && playerHeldPawn.position[1] === 1) {
                              if (!localPawn.blockedPositions.left.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }
                      
                      if (currentPlayer.playerDirections.includes("right")) {
                        if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] + 1 && 
                          tileData.gridPosition[1] === playerHeldPawn.gridPosition[1]) {
                          if (tileHasBlockedSpace(tileData, "right", localPawn) && currentPlayer.playerDirections.includes("right")) {
                            if (rowIndex === localPawn.blockedPositions.right.position![1]) {
                              if (colIndex >= localPawn.blockedPositions.right.position![0]) {
                                rowBlocked = true;
                              }
                              else if (colIndex < localPawn.blockedPositions.right.position![0]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (rowIndex === playerHeldPawn.position[1] - 1 && playerHeldPawn.position[1] === 2) {
                              if (!localPawn.blockedPositions.right.gridPosition) {
                                rowBlocked = false;
                              }
                            }
                          }
                        }
                      }

                      if (currentPlayer.playerDirections.includes("down")) {
                        if (tileData.gridPosition[0] === playerHeldPawn.gridPosition[0] && 
                          tileData.gridPosition[1] === playerHeldPawn.gridPosition[1] + 1) {
                          if (tileHasBlockedSpace(tileData, "down", localPawn) && currentPlayer.playerDirections.includes("down")) {
                            if (colIndex === localPawn.blockedPositions.down.position![0]) {
                              if (rowIndex >= localPawn.blockedPositions.down.position![1]) {
                                rowBlocked = true;
                              }
                              else if (rowIndex < localPawn.blockedPositions.down.position![1]) {
                                rowBlocked = false;
                              }
                            }
                          }
                          else {
                            if (colIndex === playerHeldPawn.position[0] + 1 && playerHeldPawn.position[0] === 1) {
                              if (!localPawn.blockedPositions.down.gridPosition) {
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
                      if (rowIndex < playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && currentPlayer.playerDirections.includes("up")) {
                        if (tileHasBlockedSpace(tileData, "up", localPawn)) {
                          if (colIndex === localPawn.blockedPositions.up.position![0]) {
                            if (rowIndex <= localPawn.blockedPositions.up.position![1]) {
                              rowBlocked = true;
                            }
                            else if (rowIndex > localPawn.blockedPositions.up.position![1]) {
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          rowBlocked = false;
                        }
                      }
                      else if (colIndex < playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && currentPlayer.playerDirections.includes("left")) {
                        if (tileHasBlockedSpace(tileData, "left", localPawn)) {
                          if (rowIndex === localPawn.blockedPositions.left.position![1]) {
                            if (colIndex <= localPawn.blockedPositions.left.position![0]) {
                              rowBlocked = true;
                            }
                            else if (colIndex > localPawn.blockedPositions.left.position![0]) {
                              
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          
                          rowBlocked = false;
                        }
                      }
                      else if (colIndex > playerHeldPawn.position[0] && rowIndex === playerHeldPawn.position[1] && currentPlayer.playerDirections.includes("right")) {
                        if (tileHasBlockedSpace(tileData, "right", localPawn)) {
                          if (rowIndex === localPawn.blockedPositions.right.position![1]) {
                            if (colIndex >= localPawn.blockedPositions.right.position![0]) {
                              rowBlocked = true;
                            }
                            else if (colIndex < localPawn.blockedPositions.right.position![0]) {
                              rowBlocked = false;
                            }
                          }
                        }
                        else {
                          rowBlocked = false;
                        }
                      }
                      else if (rowIndex > playerHeldPawn.position[1] && colIndex === playerHeldPawn.position[0] && currentPlayer.playerDirections.includes("down")) {
                        if (tileHasBlockedSpace(tileData, "down", localPawn)) {
                          if (colIndex === localPawn.blockedPositions.down.position![0]) {
                            if (rowIndex >= localPawn.blockedPositions.down.position![1]) {
                              rowBlocked = true;
                            }
                            else if (rowIndex < localPawn.blockedPositions.down.position![1]) {
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

                  return (
                    <Space 
                      key={`space${rowIndex}-${colIndex} ${highlightSpace ? "highlight" : ""}`} 
                      spaceData={space} 
                      showMovableArea={highlightSpace} 
                      colorSelected={playerHeldPawn ? playerHeldPawn.color : null}
                      spacePosition={[colIndex, rowIndex]} 
                      gridPosition={[...tileData.gridPosition]}
                      highlightTeleporter={space.type === 'teleporter' ? playerState.showTeleportSpaces: null}
                      highlightEscalator={space.details?.hasEscalator ? playerState.showEscalatorSpaces: []}
                      tileIndex={tileIndex}
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