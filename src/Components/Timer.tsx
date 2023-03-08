import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { useGamePausedDocState, useGameOverDocState, useWeaponsStolenDocState } from '../Contexts/FirestoreContext';
import { setDoc } from '../utils/useFirestore';
import { useAudio } from '../Contexts/AudioContext';


const Timer = () => {
  console.count('Render timer') // 28 times
  const { gameState, gameDispatch } = useGame();
  const gameOver = useGameOverDocState();
  const gamePaused = useGamePausedDocState();
  const weaponsStolen = useWeaponsStolenDocState();
  const time = new Date();
  const { gameAudio, loadEscapeSoundtrack, playWarningSound, musicOn, soundOn } = useAudio();

  useEffect(() => {

    if (weaponsStolen.length === 4) {
      gameAudio.pause();
      loadEscapeSoundtrack();

      if (musicOn) { 
        playWarningSound(); 
      
        const warningTimer = setTimeout(async () => {
          loadEscapeSoundtrack();
        }, 5100);
        return () => clearTimeout(warningTimer);
      }
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
  } = useTimer({ expiryTimestamp: time, autoStart: false, onExpire: async () => {
    gameDispatch({type: "gameOver"})
    gameAudio.pause();
    await setDoc(gameState.roomId, {
      gameOver: true,
      gameWon: false,
    })
  } });
  const startSeconds = 200;

  useEffect(() => {
    if (gameOver) {
      pause();
      gameAudio.pause();
    }
  }, [gameOver])

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