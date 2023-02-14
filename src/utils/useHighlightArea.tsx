import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBHeroPawn, DBPawns, Room } from '../types';

const startTiles = () => {
  const tiles = []
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      tiles.push({gridPosition: [i, j]})
    }
  }
  return tiles;
}

const useHighlightArea = (tiles:  DBTile[], pawns: DBPawns): [ DBTile[], () => void, (gridPosition: number[]) => void] => {
  const [availableArea, setAvailableArea] = useState<DBTile[]>(startTiles() as DBTile[]);

  const getExplorationTile = (pawn: DBHeroPawn, pawnColIndex: number, pawnRowIndex: number) => {
    const currentTile = tiles.find(tile => tile.gridPosition[0] === pawn.gridPosition[0] && tile.gridPosition[1] === pawn.gridPosition[1])
    if (currentTile) {
      const pawnRow = Object.values(currentTile.spaces).filter((row, rowIndex) => rowIndex === pawnRowIndex).flat(1)
      const explorationSpace = pawnRow.find((col, colIndex) => colIndex === pawnColIndex && col.type === "exploration")!
      if (explorationSpace) {
        const spaceDetails = explorationSpace.details as ExplorationSpace
        if (spaceDetails.color === pawn.color) {
          if (spaceDetails.exploreDirection === "up") {
            const tileExists = tiles.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] - 1)
            if (tileExists) return
            return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] - 1], placementDirection: spaceDetails.exploreDirection}
          }
          if (spaceDetails.exploreDirection === "down") {
            const tileExists = tiles.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] && tile.gridPosition[1] === currentTile.gridPosition[1] + 1)
            if (tileExists) return
            return {gridPosition: [currentTile.gridPosition[0], currentTile.gridPosition[1] + 1], placementDirection: spaceDetails.exploreDirection}
          }
          if (spaceDetails.exploreDirection === "left") {
            const tileExists = tiles.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] - 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
            if (tileExists) return
            return {gridPosition: [currentTile.gridPosition[0] - 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
          }
          if (spaceDetails.exploreDirection === "right") {
            const tileExists = tiles.find(tile => tile.gridPosition[0] === currentTile.gridPosition[0] + 1 && tile.gridPosition[1] === currentTile.gridPosition[1])
            if (tileExists) return
            return {gridPosition: [currentTile.gridPosition[0] + 1, currentTile.gridPosition[1]], placementDirection: spaceDetails.exploreDirection}
          }
        }
      }
    }
  }

  const highlightNewTileArea = () => {
    const placeholderTiles = [...availableArea];

    const highlightAreas = Object.values(pawns).map(pawn => {
      return getExplorationTile(pawn, pawn.position[0], pawn.position[1]) 
    }).filter(gridPos => gridPos) as DBTile[]

    // adding placementDirection value to tiles that need to be highlighted
    highlightAreas.forEach(newArea => {
      const tileIndex = placeholderTiles.findIndex(tile => tile.gridPosition[0] === newArea.gridPosition[0] && tile.gridPosition[1] === newArea.gridPosition[1]);
      if (tileIndex >= 0) {
        placeholderTiles[tileIndex] = newArea
      }
    })

    setAvailableArea(placeholderTiles);
  }

  const clearHighlightAreas = useCallback((gridPosition: number[]) => {
    const remainingAvailable = availableArea.filter(area => area.gridPosition[0] !== gridPosition[0] || area.gridPosition[1] !== gridPosition[1]);
    
    const resetAreas = remainingAvailable.map(area => {
      return {gridPosition: area.gridPosition}
    })

    setAvailableArea(resetAreas as DBTile[]);
  }, [availableArea])

  return [availableArea, highlightNewTileArea, clearHighlightAreas];
};

export default useHighlightArea;