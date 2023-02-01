import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';

interface TimerProps {
  expiryTimestamp: Date
}

// export const StartTimer = (expiryTimestamp: Date) => {
//   const {
//     seconds,
//     minutes,
//     isRunning,
//     start,
//     pause,
//     restart
//   } = useTimer({ expiryTimestamp, onExpire: () => console.warn('onExpire called') })

//   return {seconds,
//     minutes,
//     isRunning,
//     start,
//     pause,
//     restart}
// }

const Timer = ({expiryTimestamp} : TimerProps) => {
  const { gameState, gameDispatch } = useGame();
  const {
    seconds,
    minutes,
    isRunning,
    start,
    pause,
    restart
  } = useTimer({ expiryTimestamp, onExpire: () => gameDispatch({type: "gameOver"}) });
  const startSeconds = 200;

  const toggleTimer = (pauseGame: boolean) => {
    if (pauseGame) {
      pause();
      console.log("toggle timer here")
      gameDispatch({type: "timeLeft", minutes, seconds})
    }
    else {
      let restartTime = startSeconds - ((minutes * 60) + seconds)
      const time = new Date();
      time.setSeconds(time.getSeconds() + restartTime);
      console.log("restartTime")
      restart(time)
    }
  }

  useEffect(() => {
    toggleTimer(gameState.gamePaused)
  }, [gameState.gamePaused])

  useEffect(() => {
    if (gameState.gameStarted && !isRunning) {
      start();
    }
  }, [gameState.gameStarted])

  // from db to Pause game
  useEffect(() => {

  })


  return (
    <div className="timer">
      <span>{minutes}</span>:
      <span>{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
    </div>
  )
}

export default Timer