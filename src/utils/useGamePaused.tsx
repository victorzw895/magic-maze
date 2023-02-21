import { useEffect, useState } from 'react';
import { Room } from '../types';

const useGamePaused = (room: Room): [boolean] => {
  const [gamePaused, setGamePaused] = useState(false);
  
  useEffect(() => {
    setGamePaused(room.gamePaused);
  }, [room.gamePaused])

  return [gamePaused];
};

export default useGamePaused;