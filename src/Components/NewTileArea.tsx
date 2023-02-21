import React, { MouseEvent, memo } from 'react';
import { DBHeroPawn, DBTile } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { generateTile } from '../Contexts/TilesContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { useGamePausedDocState } from '../Contexts/FirestoreContext';

interface NewTileAreaProps {
  tile: DBTile,
  clearHighlightAreas: () => void,
  // disableAction: boolean,
}

const areEqual = (prevProps: NewTileAreaProps, nextProps: NewTileAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const NewTileArea = memo(({tile, clearHighlightAreas}: NewTileAreaProps) => {
  console.log('new tile area re render')
  const { gridPosition, placementDirection } = tile;
  const { gameState } = useGame();
  const gamePaused = useGamePausedDocState();

  const addNewTile = async (newTile: DBTile) => {
    const docSnap = await getDoc(gameState.roomId);

    if (docSnap.exists()) {
      const room = docSnap.data();
      const tile = generateTile(newTile);
      const newPawns = room.pawns;
      Object.values(room.pawns).forEach((pawn: any) => {
        const blockedDirections = {
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
        if (pawn.playerHeld) {
          pawn.blockedPositions = blockedDirections
          pawn.showMovableDirections = []
          pawn.showEscalatorSpaces = []
          pawn.showTeleportSpaces = null
        }
      })

      await setDoc(
        gameState.roomId, 
        {
          tiles: [...room.tiles, tile],
          pawns: newPawns
        },
      )
    }
  }

  const placeNewTile = () => {
    if (gamePaused) return
    if (placementDirection) {
      addNewTile({gridPosition, placementDirection} as DBTile);
    }

    clearHighlightAreas();
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <div className={`tile new-tile-area ${placementDirection ? placementDirection : "placeholder"}`}
      onClick={placeNewTile} // TODO: disable if game paused
      style={
        {
          gridColumnStart: gridPosition[0], 
          gridRowStart: gridPosition[1],
          marginTop: gridPosition[0] < 8 ? getDisplacementValue(gridPosition[0]) : tileWallSize,
          marginBottom: gridPosition[0] > 8 ? getDisplacementValue(gridPosition[0]) : tileWallSize,
          marginLeft: gridPosition[1] > 8 ? getDisplacementValue(gridPosition[1]) : tileWallSize,
          marginRight: gridPosition[1] < 8 ? getDisplacementValue(gridPosition[1]) : tileWallSize,
          placeSelf: "center"
        }
      }>
       <div></div> 
    </div>
  )
}, areEqual)

NewTileArea.whyDidYouRender = true

export default NewTileArea;