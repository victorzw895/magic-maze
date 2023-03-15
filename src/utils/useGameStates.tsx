import { useEffect, useState } from 'react';
import { Room } from '../types';

const useGameStates = (room: Room): [boolean, boolean] => {
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  useEffect(() => {
    setGameOver(room.gameOver);
  }, [room.gameOver])

  useEffect(() => {
    setGameWon(room.gameWon);
  }, [room.gameWon])

  return [gameOver, gameWon];
};

export default useGameStates;