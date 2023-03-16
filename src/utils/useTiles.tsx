import { useEffect, useState } from 'react';
import { DBTile, Room } from '../types';

const useTiles = (room: Room): [DBTile[], number[], number] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);
  const [availableTiles, setAvailableTiles] = useState<number[]>([]);
  const [flipSandTimerCount, setFlipSandTimerCount] = useState<number>(0);

  useEffect(() => {
    setAvailableTiles(room.availableTiles);
  }, [room.availableTiles.length])

  useEffect(() => {
    setTiles(room.tiles);
  }, [room.tiles.length, room.timerDisabledCount])

  useEffect(() => {
    setFlipSandTimerCount(room.timerDisabledCount)
  }, [room.timerDisabledCount])

  return [tiles, availableTiles, flipSandTimerCount];
};

export default useTiles;