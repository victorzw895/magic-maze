import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBHeroPawn, DBPawns, Room } from '../types';
import { getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual'

const useGamePaused = (room: Room): [DBTile[]] => {
  const [tiles, setTiles] = useState<DBTile[]>([]);

  // TODO May consider adding a useEffect for specific changes such as
  // isOccupied
  // isDisabled

  useEffect(() => {
    if (isEqual(tiles, room.tiles)) return; // TODO, may not best solution
    console.log('setTiles from fiestore context', room.tiles)
    setTiles(room.tiles);
  }, [room.tiles])

  return [tiles];
};

export default useGamePaused;