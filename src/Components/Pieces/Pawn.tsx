import { MouseEvent, useEffect } from 'react';
import { heroColor, direction, Escalator, Room, DBHeroPawn, DBTile, Space } from '../../types';
import { tileWallSize, spaceSize } from '../../constants';
import { usePawn, BlockedPositions } from '../../Contexts/PawnContext';
import { usePlayer } from '../../Contexts/PlayerContext';
import { useGame } from '../../Contexts/GameContext';
import { setDoc } from "firebase/firestore"; 
import { gamesRef } from "../../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

interface pawnProps {
  color: heroColor,
}

const Pawn = ({color}: pawnProps) => {
  const { gameState } = useGame();
  const { playerState, playerDispatch } = usePlayer();
  const { pawnDispatch } = usePawn();

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const { pawns, players }: Room = room || {}

  // Recalculate blocked position and showMovable when other player moves pawns
  // NOTE: BUG: Need to recalculate when pawn held and add new tile
  useEffect(() => {
    (async() => {
      if (room && pawns) {
        const currentPlayer = players.find((player: any) => player.number === playerState.number)!
        const playerHeldPawn: any = Object.values(pawns).find((pawn: any) => pawn.playerHeld === currentPlayer.number)
        if (playerHeldPawn) {
          const newRoomValue = {...room};
  
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
  
          currentPlayer.playerDirections.forEach((direction: direction) => {
            const blockedSpace = getFirstBlockedSpace(playerHeldPawn, direction);
            blockedDirections[direction].position = blockedSpace.position
            blockedDirections[direction].gridPosition = blockedSpace.gridPosition
          })
  
          newRoomValue.pawns[playerHeldPawn.color].blockedPositions = blockedDirections;
  
          playerDispatch({type: "showMovableSpaces", value: currentPlayer.playerDirections})
          await setDoc(
            gamesRef.doc(gameState.roomId), 
            { 
              pawns: newRoomValue.pawns
            },
            {merge: true}
          )
        }
      }
    })()
  }, [room?.pawns[color].position[0], room?.pawns[color].position[1]])
  
  const directionPositionValue = {
    "up": -1,
    "right": 1,
    "down": 1,
    "left": -1
  }

  const getExtraDirectionalSpaces = (tileFound: DBTile, pawn: DBHeroPawn, direction: direction) => {
    let extraSpaces;
    if (direction === "up" || direction === "down") {
      extraSpaces = Object.values(tileFound.spaces!).map((row) => row.filter((col, colIndex) => colIndex === pawn.position[0] + directionPositionValue[direction])).flat(1)
    }
    else if (direction === "left" || direction === "right") {
      extraSpaces = Object.values(tileFound.spaces!).filter((row, rowIndex) => rowIndex === pawn.position[1] - directionPositionValue[direction]).flat(1)
    }
    return extraSpaces
  }

  const findDirectionAdjacentTile = (pawn: DBHeroPawn, alignmentPositionConstant: "row" | "col", direction: direction) => {
    const positionConstantValue = alignmentPositionConstant === "col" ? 0 : 1;
    const positionVariantValue = alignmentPositionConstant === "col" ? 1 : 0;
    if (room.tiles.length > 1) {
      const tileFound = room.tiles.find((tile: any) => 
        tile.gridPosition[positionConstantValue] === pawn.gridPosition[positionConstantValue] &&
        tile.gridPosition[positionVariantValue] - directionPositionValue[direction] === pawn.gridPosition[positionVariantValue]
      )
      return tileFound
    }
    return;
  }

  const filterRowsOfTargetDirection = (currentTile: DBTile, pawn: DBHeroPawn, direction: direction) => {
    let remainingRows

    if (direction === "left" || direction === "right") {
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex === pawn.position[1])
    }
    else if (direction === "up") {
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex < pawn.position[1])
    }
    else if (direction === "down") {
      remainingRows = Object.values(currentTile.spaces!).filter((row, rowIndex) => rowIndex > pawn.position[1])
    }
    
    if (remainingRows) {
      return remainingRows;
    }
  }

  const filterSpacesFromRows = (rows: Space[][], pawn: DBHeroPawn, direction: direction) => {
    if (!rows) return;

    let remainingSpaces

    if (direction === "up" || direction === "down") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex === pawn.position[0]))
    }
    else if (direction === "right") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex > pawn.position[0]))
    }
    else if (direction === "left") {
      remainingSpaces = rows.map((row, rowIndex) => row.filter((col, colIndex) => colIndex < pawn.position[0]))
    }
    
    if (remainingSpaces) {
      return remainingSpaces.flat(1);
    }
  }

  const getAllDirectionalSpaces = (pawn: DBHeroPawn, direction: direction) => {
    const directionalSpaces = [];
    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
    const rows = filterRowsOfTargetDirection(currentTile!, pawn, direction) || [];
    const spaces = filterSpacesFromRows(rows, pawn, direction) || [];

    let adjacentTileFound;
    let extraSpaces = [];
    
    if (
      (direction === "up" && pawn.position[0] === 2) ||
      (direction === "down" && pawn.position[0] === 1)
    ) {
      adjacentTileFound = findDirectionAdjacentTile(pawn, "col", direction);
    }
    else if (
      (direction === "left" && pawn.position[1] === 1) ||
      (direction === "right" && pawn.position[1] === 2)
    ) {
      adjacentTileFound = findDirectionAdjacentTile(pawn, "row", direction);
    }

    if (adjacentTileFound) {
      extraSpaces.push(...getExtraDirectionalSpaces(adjacentTileFound, pawn, direction) || []);
    }


    if (direction === "right" || direction === "down") {
      directionalSpaces.push(...spaces, ...extraSpaces);
    }
    else if (direction === "up" || direction === "left") {
      directionalSpaces.push(...spaces.reverse(), ...extraSpaces.reverse());
    }
    return directionalSpaces;
  }

  const isSpaceOccupied = (tileGridPosition: number[], colIndex: number, rowIndex: number) => {
    return Object.values(room.pawns).some((pawn: any) => {
      if (pawn.gridPosition[0] !== tileGridPosition[0] || pawn.gridPosition[1] !== tileGridPosition[1]) {
        return false;
      }
      return pawn.position[0] === colIndex && pawn.position[1] === rowIndex;
    })
  }

  // Alter so it doesnt show if has blocked
  const getEscalatorSpace = (pawn: DBHeroPawn, direction: direction) => {
    const pawnPosition = pawn.position;
    const startCol = pawnPosition[0];
    const startRow = pawnPosition[1];
    let escalatorSpacePosition = null;
    let escalatorGridPosition = null;
    let escalatorName = null;

    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
    if (currentTile) {
      const tileRow = Object.values(currentTile.spaces!).find((row, rowIndex) => rowIndex === startRow);
      const currentSpace = (tileRow as any).find((col: any, colIndex: number) => colIndex === startCol);
      if (currentSpace && currentSpace.details?.hasEscalator) {
        escalatorSpacePosition = [startCol, startRow];
        escalatorGridPosition = currentTile.gridPosition;
        escalatorName = currentSpace.details?.escalatorName;
      }
    }

    const allSpaces = getAllDirectionalSpaces(pawn, direction);
    const spacesInCurrentTile = allSpaces.length < 4 ? allSpaces.length : allSpaces.length - 4;
    
    let startIndexAlignment = 0;
    let changeInRow = false;
    let readArrayBackwards = false;
    let wallDirection: direction = "up"

    if (direction === "up") {
      startIndexAlignment = startRow - 1;
      readArrayBackwards = true;
      changeInRow = true;
      wallDirection = "down"
    }
    else if (direction === "down") {
      startIndexAlignment = startRow + 1;
      changeInRow = true;
      wallDirection = "up"
    }
    else if (direction === "right") {
      startIndexAlignment = startCol + 1;
      wallDirection = "left"
    }
    else if (direction === "left") {
      startIndexAlignment = startCol - 1;
      readArrayBackwards = true;
      wallDirection = "right"
    }

    for (let i = 0; i <= allSpaces.length - 1; i++) {
      const indexInCurrentTile = readArrayBackwards ? startIndexAlignment - i : startIndexAlignment + i;
      const indexInAdjacentTile = readArrayBackwards ? allSpaces.length - 1 - i : i - spacesInCurrentTile;

      const changeIndex = i < spacesInCurrentTile ? indexInCurrentTile : indexInAdjacentTile; // col for left
      let colIndex = changeInRow ? pawn.position[0] : changeIndex;
      let rowIndex = changeInRow ? changeIndex : pawn.position[1];

      let gridChangeIndex = 0 // 0 option for current tile
      let gridColIndex = pawn.gridPosition[0];
      let gridRowIndex = pawn.gridPosition[1];

      if (i >= spacesInCurrentTile) {
        gridChangeIndex = readArrayBackwards ? -1 : 1;        
        if (changeInRow) {
          colIndex = colIndex + gridChangeIndex;
          gridRowIndex = pawn.gridPosition[1] + gridChangeIndex;
        }
        else {
          rowIndex = rowIndex - gridChangeIndex;
          gridColIndex = pawn.gridPosition[0] + gridChangeIndex;
        }
      }
      
      if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
        break;
      }
      else if (isSpaceOccupied([gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
        break;
      }
      else if (allSpaces[i].details?.hasEscalator && !allSpaces[i].details?.sideWalls?.includes(wallDirection)) {
        escalatorSpacePosition = [colIndex , rowIndex];
        escalatorGridPosition = [gridColIndex, gridRowIndex];
        escalatorName = allSpaces[i].details?.escalatorName;
        break;
      }
    }

    const escalatorSpace = {
      position: escalatorSpacePosition,
      gridPosition: escalatorGridPosition,
      escalatorName
    }

    return escalatorSpace
  }

  const getFirstBlockedSpace = (pawn: DBHeroPawn, direction: direction) => {
    const pawnPosition = pawn.position;
    const startCol = pawnPosition[0];
    const startRow = pawnPosition[1];

    let firstBlockedSpacePosition = null;
    let blockedSpaceGridPosition = null;

    const currentTile = room.tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
    if (currentTile) {
      const tileRow = Object.values(currentTile.spaces!).find((row, rowIndex) => rowIndex === startRow);
      const currentSpace = (tileRow as any).find((col: any, colIndex: number) => colIndex === startCol);
      if (currentSpace && currentSpace.details?.sideWalls?.includes(direction)) {
        firstBlockedSpacePosition = [startCol, startRow];
        blockedSpaceGridPosition = currentTile.gridPosition;
      }
    }

    const allSpaces = getAllDirectionalSpaces(pawn, direction);

    const spacesInCurrentTile = allSpaces.length < 4 ? allSpaces.length : allSpaces.length - 4;
    
    let startIndexAlignment = 0;
    let changeInRow = false;
    let readArrayBackwards = false;
    let wallDirection: direction = "up"

    if (direction === "up") {
      startIndexAlignment = startRow - 1;
      readArrayBackwards = true;
      changeInRow = true;
      wallDirection = "down"
    }
    else if (direction === "down") {
      startIndexAlignment = startRow + 1;
      changeInRow = true;
      wallDirection = "up"
    }
    else if (direction === "right") {
      startIndexAlignment = startCol + 1;
      wallDirection = "left"
    }
    else if (direction === "left") {
      startIndexAlignment = startCol - 1;
      readArrayBackwards = true;
      wallDirection = "right"
    }

    for (let i = 0; i <= allSpaces.length - 1; i++) {
      const indexInCurrentTile = readArrayBackwards ? startIndexAlignment - i : startIndexAlignment + i;
      const indexInAdjacentTile = readArrayBackwards ? allSpaces.length - 1 - i : i - spacesInCurrentTile;

      const changeIndex = i < spacesInCurrentTile ? indexInCurrentTile : indexInAdjacentTile; // col for left
      let colIndex = changeInRow ? pawn.position[0] : changeIndex;
      let rowIndex = changeInRow ? changeIndex : pawn.position[1];

      let gridChangeIndex = 0 // 0 option for current tile
      let gridColIndex = pawn.gridPosition[0];
      let gridRowIndex = pawn.gridPosition[1];

      if (i >= spacesInCurrentTile) {
        gridChangeIndex = readArrayBackwards ? -1 : 1;        
        if (changeInRow) {
          colIndex = colIndex + gridChangeIndex;
          gridRowIndex = pawn.gridPosition[1] + gridChangeIndex;
        }
        else {
          rowIndex = rowIndex - gridChangeIndex;
          gridColIndex = pawn.gridPosition[0] + gridChangeIndex;
        }
      }
      
      if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
        firstBlockedSpacePosition = [colIndex , rowIndex];
        blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
        break;
      }
      else if (isSpaceOccupied([gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
        firstBlockedSpacePosition = [colIndex, rowIndex];
        blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
        break;
      }
    }

    const firstBlocked = {
      position: firstBlockedSpacePosition,
      gridPosition: blockedSpaceGridPosition
    }

    return firstBlocked;
  }

  const toggleMovableSpaces = async () => {
    const pawnColor = room.pawns[color];
    const newRoomValue = {...room}
    const pawnPosition = pawnColor.position;
    const currentPlayer = newRoomValue.players.find((player: any) => player.number === playerState.number)
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

    if (!pawnColor.playerHeld) {
      const newRoomValue = {...room};

      Object.values(newRoomValue.pawns).forEach((pawn: any) => {
        if (pawn.playerHeld === currentPlayer.number) {
          pawn.playerHeld = null;
          playerDispatch({type: "showMovableSpaces", value: []})
          // teleport
          if (currentPlayer.playerAbilities.includes("teleport")) {
            playerDispatch({type: "showTeleportSpaces", color: null})
          }
          // escalator
          if (currentPlayer.playerAbilities.includes("escalator")) {
            playerDispatch({type: "showEscalatorSpaces", value: []})
          }
        }
      })

      newRoomValue.pawns[color].playerHeld = currentPlayer.number;

      // get pawn position
      // get player direction
      // showArea for spaces in player direction from pawn position
      const escalatorSpaces: Escalator[] = [];
      playerDirections.forEach((direction: direction) => {
        const blockedSpace = getFirstBlockedSpace(pawnColor, direction);
        blockedDirections[direction].position = blockedSpace.position
        blockedDirections[direction].gridPosition = blockedSpace.gridPosition
        if (currentPlayer.playerAbilities.includes("escalator")) {
          const escalatorSpace = getEscalatorSpace(pawnColor, direction);
          escalatorSpaces.push(escalatorSpace);
        }
      })

      // NOT SAVING blockedPositions on DB
      // newRoomValue.pawns[color].blockedPositions = blockedDirections;

      pawnDispatch({type: "addBlockedPositions", value: blockedDirections, color});
      await setDoc(
        gamesRef.doc(gameState.roomId), 
        { 
          pawns: newRoomValue.pawns
        },
        {merge: true}
      )
      playerDispatch({type: "showMovableSpaces", value: playerDirections})
      // teleport
      if (currentPlayer.playerAbilities.includes("teleport")) {
        playerDispatch({type: "showTeleportSpaces", color})
      }
      // escalator
      if (escalatorSpaces.length) {
        playerDispatch({type: "showEscalatorSpaces", value: escalatorSpaces})
      }
    }
    else if (pawnColor.playerHeld && pawnColor.playerHeld === currentPlayer.number) {
      newRoomValue.pawns[color].playerHeld = null;
      // newRoomValue.pawns[color].blockedPositions = blockedDirections;
  
      await setDoc(
        gamesRef.doc(gameState.roomId), 
        { 
          pawns: newRoomValue.pawns
        },
        {merge: true}
      )

      playerDispatch({type: "showMovableSpaces", value: []})
      // teleport
      if (currentPlayer.playerAbilities.includes("teleport")) {
        playerDispatch({type: "showTeleportSpaces", color: null})
      }
      // escalator
      if (currentPlayer.playerAbilities.includes("escalator")) {
        playerDispatch({type: "showEscalatorSpaces", value: []})
      }
    }
  }

  const _handleClick = async (e: MouseEvent<HTMLDivElement>) => {
    toggleMovableSpaces();
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <>
      {
        room ? <div className="pawn-grid"
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
            onClick={gameState.gameOver || room.heroesEscaped.includes(color) ? () => {} : !gameState.gamePaused ? _handleClick : () => {}}
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
                border: `${pawns[color]?.playerHeld ? 
                            (pawns[color]?.playerHeld === playerState.number ?
                              "2px solid blue" 
                                : 
                              "2px solid grey")
                            :
                            ""}`
                }}/>
          </div>
        </div>
          :
        <>
        </>
      }
    </>
  )
}

export default Pawn;