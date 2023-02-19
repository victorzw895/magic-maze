import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBHeroPawn, DBPawns, Room } from '../types';
import { getDoc } from '../utils/useFirestore';

const useGamePaused = (room: Room): [boolean] => {
  const [gamePaused, setGamePaused] = useState(false);
  
  useEffect(() => {
    console.log('gamePaused from fiestore context')
    setGamePaused(room.gamePaused);
  }, [room.gamePaused])

  return [gamePaused];
};

export default useGamePaused;