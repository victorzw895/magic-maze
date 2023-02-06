import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore, gamesRef } from "../Firestore";

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
  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

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
    if (gameState.gameStarted && !isRunning) {
      start();
    }
  }, [gameState.gameStarted])

  // from db to Pause game
  // this toggles pause on timer, missing game pause.
  // for accuracy, best to move timer into firebase
  useEffect(() => {
    (async () => {
      if (!room) return;
      console.log('there is a room', room)
      console.log('room?.gamePaused !== gameState.gamePaused', room?.gamePaused, gameState.gamePaused)
      toggleTimer(room.gamePaused);
    })()
  }, [room?.gamePaused])

  return (
    <div className="timer">
      <span>{minutes}</span>:
      <span>{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
    </div>
  )
}

export default Timer