import React, { createContext, useContext, useReducer } from 'react';
import { HeroPawn, heroName, heroWeapon, heroColor, TileInterface, direction, Space } from '../types';

import { allTiles } from '../Data/all-tiles-data';


type Action = {type: 'initTile', value: TileInterface} | 
              {type: 'addTile', value: TileInterface} | undefined;
type Dispatch = (action: Action) => void;

type TilesProviderProps = {children: React.ReactNode}

const tilesInitialState: TileInterface[] = []

const TilesContext = createContext<{tilesState: TileInterface[]; tilesDispatch: Dispatch} | undefined>(undefined);

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

const availableTiles = [2,3,4,5,6,7,8,9,10,11,12];

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
        row.map((val: any, j: any) => matrix[N - j][i])
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
  // console.log("updating sidewalls");
  const newSpaces = [...spaces];
  return newSpaces.map((row, rowIndex) => row.map((col: any, colIndex) => 
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

// const updateTileDirections = (newTile: TileInterface, rotationValue: number) => {
//   if (newTile.entryDirection) {
//     newTile.entryDirection = getUpdatedDirectionValue(newTile.entryDirection, rotationValue)
//   }
//   if (newTile.entrySide) {
//     newTile.entrySide = getUpdatedDirectionValue(newTile.entrySide, rotationValue)
//   }
//   return newTile;
// }

export const generateTile = (newTileState: TileInterface) => {
  const newId = availableTiles.pop();
  const tile = allTiles.find(tile => tile.id === newId?.toString()) as TileInterface;
  if (!tile) return;
  const { gridPosition, placementDirection} = newTileState
  const newTile: TileInterface = {...tile, gridPosition, placementDirection};
  const tileSpaces = Object.values(newTile.spaces!)
  const rotationValue = calculateRotation(newTile.placementDirection!, newTile.entryDirection!);

  switch (rotationValue) {
    case 90:
      // updateTileDirections(newTile, rotationValue)
      rotateTileSpaces(tileSpaces);
      updateSpaceDirections(tileSpaces, rotationValue);
      break; 
    case 180:
      // updateTileDirections(newTile, rotationValue)
      rotateTileSpaces(tileSpaces);
      rotateTileSpaces(tileSpaces);
      updateSpaceDirections(tileSpaces, rotationValue);
      break;
    case 270:
      // updateTileDirections(newTile, rotationValue)
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

const tilesReducer = (tilesState: TileInterface[], action: any) => {

  switch (action.type) {
    case 'initTile': {
      return [...tilesState, {...action.value, gridPosition: [8, 8]}];
    }
    case 'addTile': {
      const newId = availableTiles.pop();
      const tile = allTiles.find(tile => tile.id === newId?.toString()) as TileInterface;
      if (!tile) return [...tilesState];
      const { gridPosition, placementDirection} = action.value
      const newTile: TileInterface = {...tile, gridPosition, placementDirection};
      const tileSpaces = Object.values(newTile.spaces!)
      const rotationValue = calculateRotation(newTile.placementDirection!, newTile.entryDirection!);

      switch (rotationValue) {
        case 90:
          // updateTileDirections(newTile, rotationValue)
          rotateTileSpaces(tileSpaces);
          updateSpaceDirections(tileSpaces, rotationValue);
          break; 
        case 180:
          // updateTileDirections(newTile, rotationValue)
          rotateTileSpaces(tileSpaces);
          rotateTileSpaces(tileSpaces);
          updateSpaceDirections(tileSpaces, rotationValue);
          break;
        case 270:
          // updateTileDirections(newTile, rotationValue)
          rotateTileSpaces(tileSpaces);
          rotateTileSpaces(tileSpaces);
          rotateTileSpaces(tileSpaces);
          updateSpaceDirections(tileSpaces, rotationValue);
          break;
        default:
          break;
      }
      
      return [...tilesState, {...newTile, rotation: rotationValue, spaces: tileSpaces}];
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const TilesProvider = ({children}: TilesProviderProps) => {

  const [tilesState, tilesDispatch] = useReducer(tilesReducer, tilesInitialState);
  const value = {tilesState, tilesDispatch};

  return <TilesContext.Provider value={value}>{children}</TilesContext.Provider>
}

const useTiles = () => {
  const context = useContext(TilesContext)
  if (context === undefined) {
    throw new Error('useTiles must be used within a TilesProvider');
  }
  return context;
}

export { TilesProvider, useTiles };