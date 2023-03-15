import { useEffect, useState } from 'react';
import { DBTile, Room } from '../types';

const useTiles = (room: Room): [DBTile[], number] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);
  const [sandTimerCount, setSandTimerCount] = useState<number>(0);

  // TODO May consider adding a useEffect for specific changes such as
  // isOccupied
  // isDisabled

  useEffect(() => {
    setTiles(room.tiles);
  }, [room.tiles.length, room.timerDisabledCount])

  useEffect(() => {
    setSandTimerCount(room.timerDisabledCount)
  }, [room.timerDisabledCount])

  return [tiles, sandTimerCount];
};

export default useTiles;