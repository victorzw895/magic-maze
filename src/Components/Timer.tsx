import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { useGamePausedDocState } from '../Contexts/FirestoreContext';


const Timer = () => {
  console.count('Render timer') // 28 times
  const { gameDispatch } = useGame();
  const gamePaused = useGamePausedDocState();
  const time = new Date();

  useEffect(() => {
    // IDEALLY on game start
    // maybe move timer to firestore ???
    console.log("start timer?")
    time.setSeconds(time.getSeconds() + 200);
  }, [])

  const {
    seconds,
    minutes,
    start,
    pause,
    restart
  // } = useTimer({ expiryTimestamp: time, onExpire: () => gameDispatch({type: "gameOver"}) });
  // autoStart: false after attaching start() to waiting room start
  } = useTimer({ expiryTimestamp: time, autoStart: false, onExpire: () => gameDispatch({type: "gameOver"}) });
  const startSeconds = 200;


  const toggleTimer = (pauseGame: boolean) => {
    if (pauseGame) {
      pause();
      // TODO: Notification Game Paused at 'minutes' 'seconds', Time remaining when resuming: restart time
      console.log("toggle timer here", seconds, minutes)
    }
    else {
      const restartTime = startSeconds - ((minutes * 60) + seconds);
      // if (restartTime === startSeconds) {
      //   start();
      //   console.log('start')
      // } else {
      //   const time = new Date();
      //   time.setSeconds(time.getSeconds() + restartTime);
      //   console.log("restartTime", restartTime)
      //   restart(time)
      // }
    }
  }

  // from db to Pause game
  // this toggles pause on timer, missing game pause.
  // for accuracy, best to move timer into firebase
  useEffect(() => {
    toggleTimer(gamePaused);
  }, [gamePaused])

  return (
    <div className="timer">
      <span>{minutes}</span>:
      <span>{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
    </div>
  )
}

export default Timer