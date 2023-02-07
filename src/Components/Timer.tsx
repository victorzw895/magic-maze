import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { gamesRef } from "../Firestore";

interface TimerProps {
  expiryTimestamp: Date
}

const Timer = ({expiryTimestamp} : TimerProps) => {
  const { gameState, gameDispatch } = useGame();
  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const {
    seconds,
    minutes,
    start,
    pause,
    restart
  } = useTimer({ expiryTimestamp, onExpire: () => gameDispatch({type: "gameOver"}) });
  const startSeconds = 200;

  const toggleTimer = (pauseGame: boolean) => {
    if (pauseGame) {
      pause();
      // TODO: Game Paused at 'minutes' 'seconds', Time remaining when resuming: restart time
      console.log("toggle timer here", seconds, minutes)
    }
    else {
      const restartTime = startSeconds - ((minutes * 60) + seconds);
      if (restartTime === startSeconds) {
        start();
        console.log('start')
      } else {
        const time = new Date();
        time.setSeconds(time.getSeconds() + restartTime);
        console.log("restartTime", restartTime)
        restart(time)
      }
    }
  }

  // from db to Pause game
  // this toggles pause on timer, missing game pause.
  // for accuracy, best to move timer into firebase
  useEffect(() => {
    (async () => {
      if (!room) return;
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