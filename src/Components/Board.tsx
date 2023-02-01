import { useCallback, useEffect, useRef, useState } from 'react';
import Tile from './Tile';
import NewTileArea from './NewTileArea';
import Pawn from './Pieces/Pawn';
import PlayerArea from './PlayerArea';
import { ExplorationSpace, DBTile, DBHeroPawn, Room } from '../types';
import './Board.scss';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import Draggable from 'react-draggable';
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Timer from './Timer';

const startTiles = () => {
  const tiles = []
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      tiles.push({gridPosition: [i, j]})
    }
  }
  return tiles;
}

const time = new Date();

const Board = () => {
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const { playerState } = usePlayer();

  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const { pawns, tiles, players }: Room = room || {}

  const [availableArea, setAvailableArea] = useState<DBTile[]>(startTiles() as DBTile[]);

  useEffect(() => {
    // IDEALLY on game start
    // maybe move timer to firestore ???
    console.log("start timer?")
    time.setSeconds(time.getSeconds() + 200);
  }, [])


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

  const getCurrentPlayer = () => {
    const currentPlayer = players.find(player => player.number === playerState.number)!
    return currentPlayer
  }
  
  const getPlayerHeldPawn = () => {
    const pawnHeld = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === playerState.number);
    return pawnHeld;
  }

  return (
    <div className="Board">
      <Timer expiryTimestamp={time} />
      <Draggable
        nodeRef={draggableNodeRef}
        defaultPosition={{x: 0, y: 0}}
        >
        <div ref={draggableNodeRef} className="playable-area">
          {availableArea.length > 0 && availableArea.map(newTileArea => {
            return (
              <NewTileArea 
                key={`${newTileArea.gridPosition[0]}-${newTileArea.gridPosition[1]}`} 
                tile={newTileArea} 
                clearHighlightAreas={clearHighlightAreas} 
                />
            )
          })}
          {tiles && tiles.length > 0 && tiles.map((newTile, tileIndex) => {
            return (
              <Tile 
                key={tileIndex} 
                tileIndex={tileIndex} 
                tileData={newTile} 
                playerHeldPawn={getPlayerHeldPawn()}
                currentPlayer={getCurrentPlayer()}
                />
            )
          })}
          <Pawn color="yellow" />
          <Pawn color="orange"/>
          <Pawn color="green"/>
          <Pawn color="purple"/>
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={highlightNewTileArea} player={players?.find(player => player.number === playerState.number)!} />
    </div>
  )
}

// Board.whyDidYouRender = true

export default Board;