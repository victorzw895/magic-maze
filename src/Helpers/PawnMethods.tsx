import { direction, DBHeroPawn, DBTile, DBPawns, Space, DBPlayer, Escalator, PawnActions } from '../types';
import { getDefaultBlockedPositions } from '../constants';
import isEqual from 'lodash/isEqual';

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

const findDirectionAdjacentTile = (tiles: DBTile[], pawn: DBHeroPawn, alignmentPositionConstant: "row" | "col", direction: direction) => {
  const positionConstantValue = alignmentPositionConstant === "col" ? 0 : 1;
  const positionVariantValue = alignmentPositionConstant === "col" ? 1 : 0;
  if (tiles.length > 1) {
    const tileFound = tiles.find((tile: any) => 
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

const getAllDirectionalSpaces = (tiles: DBTile[], pawn: DBHeroPawn, direction: direction) => {
  const directionalSpaces = [];
  const currentTile = tiles.find((tile) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);

  let adjacentTileFound;
  let extraSpaces = [];
  
  if (
    (direction === "up" && pawn.position[0] === 2 ) ||
    (direction === "down" && pawn.position[0] === 1)
  ) {
    adjacentTileFound = findDirectionAdjacentTile(tiles, pawn, "col", direction);
  }
  else if (
    (direction === "left" && pawn.position[1] === 1) ||
    (direction === "right" && pawn.position[1] === 2) 
  ) {
    adjacentTileFound = findDirectionAdjacentTile(tiles, pawn, "row", direction);
  }

  if (adjacentTileFound) {
    extraSpaces.push(...getExtraDirectionalSpaces(adjacentTileFound, pawn, direction) || []);
  }
  const rows = filterRowsOfTargetDirection(currentTile!, pawn, direction) || [];
  const spaces = filterSpacesFromRows(rows, pawn, direction) || [];

  if (direction === "right" || direction === "down") {
    directionalSpaces.push(...spaces, ...extraSpaces);
  }
  else if (direction === "up" || direction === "left") {
    directionalSpaces.push(...spaces.reverse(), ...extraSpaces.reverse());
  }
  return directionalSpaces;
}

const isSpaceOccupied = (pawns: DBPawns, tileGridPosition: number[], colIndex: number, rowIndex: number) => {
  return Object.values(pawns).some((pawn: any) => {
    if (pawn.gridPosition[0] !== tileGridPosition[0] || pawn.gridPosition[1] !== tileGridPosition[1]) {
      return false;
    }
    return pawn.position[0] === colIndex && pawn.position[1] === rowIndex;
  })
}

// Alter so it doesnt show if has blocked
export const getEscalatorSpace = (tiles: DBTile[], pawns: DBPawns, pawn: DBHeroPawn, direction: direction) => {
  const pawnPosition = pawn.position;
  const startCol = pawnPosition[0];
  const startRow = pawnPosition[1];
  let escalatorSpacePosition = null;
  let escalatorGridPosition = null;
  let escalatorName = null;

  const currentTile = tiles.find((tile: any) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
  if (currentTile) {
    const tileRow = Object.values(currentTile.spaces!).find((row, rowIndex) => rowIndex === startRow);
    const currentSpace = (tileRow as any).find((col: any, colIndex: number) => colIndex === startCol);
    if (currentSpace && currentSpace.details?.hasEscalator) {
      escalatorSpacePosition = [startCol, startRow];
      escalatorGridPosition = currentTile.gridPosition;
      escalatorName = currentSpace.details?.escalatorName;
    }
  }

  const allSpaces = getAllDirectionalSpaces(tiles, pawn, direction);
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
    else if (isSpaceOccupied(pawns, [gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
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

  return escalatorName && escalatorSpace
}

export const getFirstBlockedSpace = (tiles: DBTile[], pawns: DBPawns,  pawn: DBHeroPawn, direction: direction) => {
  const pawnPosition = pawn.position;
  const startCol = pawnPosition[0];
  const startRow = pawnPosition[1];

  let firstBlockedSpacePosition = null;
  let blockedSpaceGridPosition = null;

  const currentTile = tiles.find((tile) => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1]);
  if (currentTile) {
    const tileRow = Object.values(currentTile.spaces).find((row, rowIndex) => rowIndex === startRow);
    const currentSpace = (tileRow as any).find((col: any, colIndex: number) => colIndex === startCol);
    if (currentSpace && currentSpace.details?.sideWalls?.includes(direction)) {
      return {
        position: [startCol, startRow],
        gridPosition: currentTile.gridPosition
      }
    }
  }

  const allSpaces = getAllDirectionalSpaces(tiles, pawn, direction);

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

  let blockNextSpace = false;

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

    if (blockNextSpace) {
      firstBlockedSpacePosition = [colIndex , rowIndex];
      blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
      break;
    }
    if (allSpaces[i].details?.sideWalls?.includes(wallDirection) || allSpaces[i].type === "barrier") {
      firstBlockedSpacePosition = [colIndex , rowIndex];
      blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
      break;
    }
    else if (isSpaceOccupied(pawns, [gridColIndex, gridRowIndex], colIndex, rowIndex)) { // NOTE colIndex and rowIndex need to change
      firstBlockedSpacePosition = [colIndex, rowIndex];
      blockedSpaceGridPosition = [gridColIndex, gridRowIndex];
      break;
    }
    else if (allSpaces[i].details?.sideWalls?.includes(direction)) {
      blockNextSpace = true;
    }
  }

  const firstBlocked = {
    position: firstBlockedSpacePosition,
    gridPosition: blockedSpaceGridPosition
  }

  return firstBlocked;
}

export const getPlayerPawnActions = (player: DBPlayer, tiles: DBTile[], pawns: DBPawns, pawnData: DBHeroPawn): PawnActions => {
  const playerDirections = player.playerDirections;
  const blockedPositions = getDefaultBlockedPositions();
  const escalatorSpaces: Escalator[] = [];
  playerDirections.forEach((direction: direction) => {
    const blockedSpace = getFirstBlockedSpace(tiles, pawns, pawnData, direction);
    blockedPositions[direction].position = blockedSpace.position
    blockedPositions[direction].gridPosition = blockedSpace.gridPosition
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

  return {
    blockedPositions,
    showMovableDirections: playerDirections,
    showEscalatorSpaces: escalatorSpaces,
    showTeleportSpaces: player.playerAbilities.includes("teleport") ? pawnData.color : null,
  }
}