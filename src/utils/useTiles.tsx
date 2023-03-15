import { useEffect, useState } from 'react';
import { DBTile, Room } from '../types';

const useTiles = (room: Room): [DBTile[], number] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);
  const [flipSandTimerCount, setFlipSandTimerCount] = useState<number>(0);

  // TODO May consider adding a useEffect for specific changes such as
  // isOccupied
  // isDisabled

  useEffect(() => {
    setTiles(room.tiles);
  }, [room.tiles.length, room.timerDisabledCount])

  useEffect(() => {
    setFlipSandTimerCount(room.timerDisabledCount)
  }, [room.timerDisabledCount])

  return [tiles, flipSandTimerCount];
};

export default useTiles;