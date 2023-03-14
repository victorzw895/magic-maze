import { useEffect, useState } from 'react';
import { DBTile, Room } from '../types';
import isEqual from 'lodash/isEqual';

const useTiles = (room: Room): [DBTile[]] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);

  // TODO May consider adding a useEffect for specific changes such as
  // isOccupied
  // isDisabled

  useEffect(() => {
    if (isEqual(tiles, room.tiles)) return;
    setTiles(room.tiles);
  }, [room.tiles])

  return [tiles];
};

export default useTiles;