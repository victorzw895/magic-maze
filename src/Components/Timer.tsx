import { useEffect } from 'react';
import { useTimer } from 'react-timer-hook';
import { useGame } from '../Contexts/GameContext';
import { useGameOverDocState, useWeaponsStolenDocState, useSandTimerState } from '../Contexts/FirestoreContext';
import { setDoc } from '../utils/useFirestore';
import { useAudio } from '../Contexts/AudioContext';

const Timer = () => {
  const { gameState, gameDispatch } = useGame();
  const gameOver = useGameOverDocState();
  const flipSandTimerCount = useSandTimerState();
  const { weaponsStolen } = useWeaponsStolenDocState();
  const time = new Date();
  const { gameAudio, loadEscapeSoundtrack, setGameAudio, playWarningSound, musicOn, loadGameSoundtrack } = useAudio();

  useEffect(() => {
    if (weaponsStolen) {
      gameAudio?.pause();
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
    restart
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
  }

  // from db to Pause game
  // this toggles pause on timer, missing game pause.
  // for accuracy, best to move timer into firebase
  useEffect(() => {
    toggleTimer();
  }, [flipSandTimerCount])

  return (
    <div className="timer">
      <span>{minutes}</span>:
      <span>{seconds.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
    </div>
  )
}

export default Timer