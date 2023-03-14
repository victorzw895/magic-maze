import { useEffect, useState } from 'react';
import { DBTile, Room } from '../types';

const useTiles = (room: Room): [DBTile[]] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);

  // TODO May consider adding a useEffect for specific changes such as
  // isOccupied
  // isDisabled

  useEffect(() => {
    setTiles(room.tiles);
  }, [room.tiles.length, room.timerDisabledCount])

  return [tiles];
};

export default useTiles;