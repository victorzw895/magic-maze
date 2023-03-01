import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { useGamePausedDocState, useWeaponsStolenDocState } from '../Contexts/FirestoreContext';
import gameSound from '../assets/game.mp3'; // download file from firestore storage instead
import escapeSound from '../assets/escape.wav'; // download file from firestore storage instead
import warningSound from '../assets/warning.wav'; // download file from firestore storage instead

const playWarning = () => {
  const audio = new Audio(warningSound);
  audio.play();
}
const loadGameSoundtrack = () => {
  const audio = new Audio(gameSound);
  audio.loop = true;
  return audio;
}

const loadEscapeSoundtrack = () => {
  const audio = new Audio(escapeSound);
  audio.loop = true;
  return audio;
}

let gameAudio = loadGameSoundtrack()

const Timer = () => {
  console.count('Render timer') // 28 times
  const { gameDispatch } = useGame();
  const gamePaused = useGamePausedDocState();
  const weaponsStolen = useWeaponsStolenDocState();
  const time = new Date();

  useEffect(() => {
    if (weaponsStolen.length === 4) {
      gameAudio.pause();
      playWarning()

      const warningTimer = setTimeout(async () => {
        gameAudio = loadEscapeSoundtrack()
        gameAudio.play();
      }, 5100);

      return () => clearTimeout(warningTimer);
    }
  }, [weaponsStolen])

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
      gameAudio.pause();
      // TODO: Notification Game Paused at 'minutes' 'seconds', Time remaining when resuming: restart time
      console.log("toggle timer here", seconds, minutes)
    }
    else {
      const restartTime = startSeconds - ((minutes * 60) + seconds);
      if (restartTime === startSeconds) {
        // start();
      } else {
        // const time = new Date();
        // time.setSeconds(time.getSeconds() + restartTime);
        // restart(time)
      }
      gameAudio.play();
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