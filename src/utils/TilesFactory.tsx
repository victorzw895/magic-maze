import { direction, DBTile, Space } from '../types';

import { allTiles } from '../Data/all-tiles-data';

type directionValuesType = {
  up: number,
  right: number,
  down: number,
  left: number
}

const directionValue: directionValuesType = {
  up: 0,
  right: 90,
  down: 180,
  left: 270
}

// TODO need to make into state
export const availableTiles = [2,3,4,5,6,7,8,9,10,11,12];

availableTiles.sort(() => 0.5 - Math.random());

const calculateRotation = (placementDirection: direction, entryDirection: direction) => {
  let placementDirectionValue = directionValue[placementDirection];
  let entrySideValue = directionValue[entryDirection];

  const rotationValue = placementDirectionValue - entrySideValue;
  if (rotationValue === -90) {
    return 270;
  }
  else if (rotationValue === -270) {
    return 90;
  }
  else return Math.abs(placementDirectionValue - entrySideValue);
}

const rotateTileSpaces = (matrix: any) => {          // function statement
  const N = matrix.length - 1;   // use a constant
  // use arrow functions and nested map;
  const result = matrix.map((row: any, i: any) => 
        row.map((_: any, j: any) => matrix[N - j][i])
  );
  matrix.length = 0;       // hold original array reference
  matrix.push(...result);  // Spread operator
  return matrix;
}

const getUpdatedDirectionValue = (direction: direction, rotationValue: number) => {
  let updatedValue = directionValue[direction] + rotationValue;
  if (updatedValue >= 360) {
    updatedValue = updatedValue - 360;
  }
  return Object.keys(directionValue).find(key => directionValue[key as direction] === updatedValue) as direction;
}

const updateSpaceDirections = (spaces: Space[][], rotationValue: number) => {
  const newSpaces = [...spaces];
  return newSpaces.map((row) => row.map((col: any) => 
    {
      if (col.details) {
        if (col.details.sideWalls) {
          let updatedSideWalls = col.details.sideWalls.map(
            (sideWall: any) => {
              return getUpdatedDirectionValue(sideWall, rotationValue)
            }
          )
          col.details.sideWalls = updatedSideWalls;
        }
        if (col.details.exploreDirection) {
          col.details.exploreDirection = getUpdatedDirectionValue(col.details.exploreDirection, rotationValue)
        }
      }
      return col;
    }
  ))
}

export const generateTile = (newTileState: DBTile) => {
  const newId = availableTiles.pop();
  const tile = allTiles.find(tile => tile.id === newId?.toString()) as DBTile;
  if (!tile) return;
  const { gridPosition, placementDirection} = newTileState
  const newTile: DBTile = {...tile, gridPosition, placementDirection};
  const tileSpaces = Object.values(newTile.spaces!)
  const rotationValue = calculateRotation(newTile.placementDirection!, newTile.entryDirection!);

  switch (rotationValue) {
    case 90:
      rotateTileSpaces(tileSpaces);
      updateSpaceDirections(tileSpaces, rotationValue);
      break; 
    case 180:
      rotateTileSpaces(tileSpaces);
      rotateTileSpaces(tileSpaces);
      updateSpaceDirections(tileSpaces, rotationValue);
      break;
    case 270:
      rotateTileSpaces(tileSpaces);
      rotateTileSpaces(tileSpaces);
      rotateTileSpaces(tileSpaces);
      updateSpaceDirections(tileSpaces, rotationValue);
      break;
    default:
      break;
  }
  
  return {...newTile, rotation: rotationValue, spaces: {
    0: tileSpaces[0],
    1: tileSpaces[1],
    2: tileSpaces[2],
    3: tileSpaces[3]
  }};
}
