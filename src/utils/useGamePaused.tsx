import { useEffect, useState } from 'react';
import { Room } from '../types';

const useGamePaused = (room: Room): [boolean, boolean, boolean] => {
  const [gamePaused, setGamePaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  
  useEffect(() => {
    setGameOver(room.gameOver);
  }, [room.gameOver])

  useEffect(() => {
    setGameWon(room.gameWon);
  }, [room.gameWon])

  useEffect(() => {
    setGamePaused(room.gamePaused);
  }, [room.gamePaused])

  return [gamePaused, gameOver, gameWon];
};

export default useGamePaused;