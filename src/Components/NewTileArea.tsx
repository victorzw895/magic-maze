import React, { MouseEvent } from 'react';
import { DBTile } from '../types';
import { tileWallSize, spaceSize } from '../constants';
import { generateTile } from '../Contexts/TilesContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../Firestore";


interface NewTileAreaProps {
  tile: DBTile,
  clearHighlightAreas: (gridPosition: number[]) => void,
}

const areEqual = (prevProps: NewTileAreaProps, nextProps: NewTileAreaProps) => {
  if (prevProps.tile.placementDirection === nextProps.tile.placementDirection) {
        return true
      }
  return false
}

const NewTileArea = React.memo(({tile, clearHighlightAreas}: NewTileAreaProps) => {
  const { gridPosition, placementDirection } = tile;
  const { gameState } = useGame();

  const addNewTile = async (newTile: DBTile) => {
    const docRef = doc(firestore, "games", gameState.roomId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const tile = generateTile(newTile);
      await setDoc(
        docRef, 
        {tiles: [...docSnap.data().tiles, tile]},
        {merge: true}
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
      onClick={(e) => placeNewTile(e)}
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