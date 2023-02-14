import React, { MouseEvent } from 'react';
import { DBTile } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { generateTile } from '../Contexts/TilesContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc, getDoc, useDocData } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';

interface NewTileAreaProps {
  tile: DBTile,
  clearHighlightAreas: (gridPosition: number[]) => void,
}

const areEqual = (prevProps: NewTileAreaProps, nextProps: NewTileAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const NewTileArea = React.memo(({tile, clearHighlightAreas}: NewTileAreaProps) => {
  const { gridPosition, placementDirection } = tile;
  const { gameState } = useGame();

  const [room] = useDocData(gameState.roomId);

  const addNewTile = async (newTile: DBTile) => {
    const docSnap = await getDoc(gameState.roomId);

    if (docSnap.exists()) {
      const tile = generateTile(newTile);
      await setDoc(
        gameState.roomId, 
        {tiles: [...docSnap.data().tiles, tile]},
      )
    }
  }

  const placeNewTile = (e: MouseEvent<HTMLDivElement>) => {
    if (placementDirection) {
      addNewTile({gridPosition, placementDirection} as DBTile);
    }

    clearHighlightAreas(gridPosition);
  }

  const getDisplacementValue = (positionValue: number) => {
    return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
  }

  return (
    <div className={`tile new-tile-area ${placementDirection ? placementDirection : "placeholder"}`}
      onClick={room?.gamePaused ? () => {} : (e) => placeNewTile(e)} // TODO: disable if game paused
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