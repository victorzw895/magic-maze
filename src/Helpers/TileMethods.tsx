import { tileWallSize, spaceSize } from '../constants';
import { direction, HeroPawn, DBTile, Player } from '../types';

export const tileHasBlockedSpace = (tileData: DBTile, direction: direction, pawnHeld: HeroPawn, playerState: Player) => {
  // console.log("tilehas blocked space")
  if (playerState?.showMovableDirections?.includes(direction)) {
    if (pawnHeld.blockedPositions[direction].gridPosition && pawnHeld.blockedPositions[direction].position) {
      if (tileData.gridPosition[0] === pawnHeld.blockedPositions[direction].gridPosition![0] &&
          tileData.gridPosition[1] === pawnHeld.blockedPositions[direction].gridPosition![1]) {
            // console.log('true')
            return true;
          }
    }
  }
  // console.log('false', pawnHeld)
  return false;
}

export const getDisplacementValue = (positionValue: number) => {
  return tileWallSize - ((Math.abs(8 - positionValue) * 2) * spaceSize)
}