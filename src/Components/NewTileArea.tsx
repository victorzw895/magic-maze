import { memo } from 'react';
import { DBHeroPawn, DBTile, Room } from '../types';
import { tileWallSize } from '../constants';
import { generateTile } from '../utils/TilesFactory';
import { useGame } from '../Contexts/GameContext';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { getDisplacementValue } from '../Helpers/TileMethods';
import { getDefaultBlockedPositions } from '../constants';

interface NewTileAreaProps {
  tile: DBTile,
  clearHighlightAreas: () => void,
}

const areEqual = (prevProps: NewTileAreaProps, nextProps: NewTileAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const NewTileArea = memo(({tile, clearHighlightAreas}: NewTileAreaProps) => {
  const { gridPosition, placementDirection } = tile;
  
  const { gameState } = useGame();

  const addNewTile = async (newTile: DBTile) => {
    const docSnap = await getDoc(gameState.roomId);

    if (docSnap.exists()) {
      const room = docSnap.data() as Room;

      const newTileId = room.availableTiles.pop();
      const tile = generateTile(newTile, newTileId);

      const newPawns = room.pawns;
      Object.values(newPawns).forEach((pawn: DBHeroPawn) => {
        if (pawn.playerHeld) {
          pawn.blockedPositions = getDefaultBlockedPositions()
          pawn.showMovableDirections = []
          pawn.showEscalatorSpaces = []
          pawn.showTeleportSpaces = null
        }
      })

      await setDoc(
        gameState.roomId, 
        {
          availableTiles: room.availableTiles,
          tiles: tile ? [...room.tiles, tile] : [room.tiles],
          pawns: newPawns
        },
      )
    }
  }

  const placeNewTile = () => {
    if (placementDirection) {
      addNewTile({gridPosition, placementDirection} as DBTile);
    }

    clearHighlightAreas();
  }

  return (
    <div className={`tile new-tile-area ${placementDirection ? placementDirection : "placeholder"}`}
      onClick={placeNewTile}
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

// NewTileArea.whyDidYouRender = true

export default NewTileArea;