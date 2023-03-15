import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { useGamePausedDocState, useGameOverDocState, useWeaponsStolenDocState, useSandTimerState } from '../Contexts/FirestoreContext';
import { setDoc } from '../utils/useFirestore';
import { useAudio } from '../Contexts/AudioContext';


const Timer = () => {
  console.log('Render timer') // 28 times
  const { gameState, gameDispatch } = useGame();
  const gameOver = useGameOverDocState();
  const sandTimerCount = useSandTimerState();
  const weaponsStolen = useWeaponsStolenDocState();
  const time = new Date();
  const { gameAudio, loadEscapeSoundtrack, setGameAudio, playWarningSound, musicOn, loadGameSoundtrack } = useAudio();

  useEffect(() => {
    if (weaponsStolen.length === 4) {
      gameAudio.pause();
      const escapeSoundtrack = loadEscapeSoundtrack();
      setGameAudio(escapeSoundtrack)
      
      if (musicOn) { 
        playWarningSound(); 
        
        const warningTimer = setTimeout(async () => {
          escapeSoundtrack.play();
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

    const gameSoundtrack = loadGameSoundtrack();
    gameSoundtrack.play();
    setGameAudio(gameSoundtrack);
  }, [])

  const {
    seconds,
    minutes,
    start,
    pause,
    resume,
    restart
  // } = useTimer({ expiryTimestamp: time, onExpire: () => gameDispatch({type: "gameOver"}) });
  // autoStart: false after attaching start() to waiting room start
  } = useTimer({ expiryTimestamp: time, onExpire: async () => {
    gameDispatch({type: "gameOver"})
    await setDoc(gameState.roomId, {
      gameOver: true,
      gameWon: false,
    })
  } });
  const startSeconds = 200;

  useEffect(() => {
    if (gameOver) {
      pause();
    }
  }, [gameOver])

  const toggleTimer = () => {
    // if (pauseGame) {
    //   pause();
    //   gameAudio.pause();
    //   // TODO: Notification Game Paused at 'minutes' 'seconds', Time remaining when resuming: restart time
    //   console.log("toggle timer here", seconds, minutes)
    // }
    // else {
      // await setDoc(gameState.roomId, 
      //   { 
      //     gamePaused: false,
      //   }
      // )

      const restartTime = startSeconds - ((minutes * 60) + seconds);
      console.log("restart time", restartTime)
      if (restartTime === startSeconds) {
        start();
      } else {
        const time = new Date();
        time.setSeconds(time.getSeconds() + restartTime);
        restart(time)
      }
      if (musicOn && gameAudio) {
        gameAudio.play();
      }
    // }
  }

  // from db to Pause game
  // this toggles pause on timer, missing game pause.
  // for accuracy, best to move timer into firebase
  useEffect(() => {
    toggleTimer();
  }, [sandTimerCount])

  return (
    <div className="timer">
      <span>{minutes}</span>:
      <span>{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
    </div>
  )
}

export default Timer