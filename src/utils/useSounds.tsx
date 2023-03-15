import { useEffect, useState } from 'react';
import gameSound from '../assets/game.mp3'; // download file from firestore storage instead
import escapeSound from '../assets/escape.wav'; // download file from firestore storage instead
import warningSound from '../assets/warning.wav'; // download file from firestore storage instead
import achievementSound from '../assets/achievement.mp3'; // download file from firestore storage instead
import teleporterSound from '../assets/teleporter.mp3'; // download file from firestore storage instead
import exitSound from '../assets/exit.mp3'; // download file from firestore storage instead
import selectSound from '../assets/select.mp3'; // download file from firestore storage instead
import winSound from '../assets/win.wav'; // download file from firestore storage instead
import cheeringSound from '../assets/cheering.wav'; // download file from firestore storage instead
import loseSound from '../assets/lose.wav'; // download file from firestore storage instead

const warningAudio = new Audio(warningSound);
const selectAudio = new Audio(selectSound);
const achievementAudio = new Audio(achievementSound);
const teleporterAudio = new Audio(teleporterSound);
const exitAudio = new Audio(exitSound);
const winAudio = new Audio(winSound)
const cheeringAudio = new Audio(cheeringSound);
const loseAudio = new Audio(loseSound);

const loadGameSoundtrack = () => {
  const gameSoundtrack = new Audio(gameSound);
  gameSoundtrack.loop = true;
  return gameSoundtrack;
}

const loadEscapeSoundtrack = () => {
  const escapeSoundtrack = new Audio(escapeSound);
  escapeSoundtrack.loop = true;
  return escapeSoundtrack;
};
// ? Do we want to include Ping here?

const useSounds = () => {
  const [musicOn, setMusicOn] = useState<boolean>(true);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [value, setValue] = useState<number>(100);
  const [gameAudio, setGameAudio] = useState<HTMLAudioElement | null>(null);

  // Game Music soundtrack useEffects
  useEffect(() => {
    if (!gameAudio) return;

    if (musicOn) gameAudio.play();
    else gameAudio.pause();
  }, [musicOn])

  // Sounds methods
  const playWarningSound = () => {
    if (musicOn) warningAudio.play();
    else warningAudio.pause();
  };

  const playSelectSound = () => {
    if (soundOn) selectAudio.play();
    else selectAudio.pause();
  };

  const playAchievementSound = () => {
    if (soundOn) achievementAudio.play();
    else achievementAudio.pause();
  };

  const playTeleporterSound = () => {
    if (soundOn) teleporterAudio.play();
    else teleporterAudio.pause();
  };

  const playExitSound = () => {
    if (soundOn) exitAudio.play();
    else exitAudio.pause();
  };

  const playWinSound = () => {
    if (soundOn) winAudio.play();
    else winAudio.pause();
  };

  const playLoseSound = () => {
    if (soundOn) loseAudio.play();
    else loseAudio.pause();
  };

  const playCheeringSound = () => {
    if (soundOn) cheeringAudio.play();
    else cheeringAudio.pause();
  }

  const setVolume = (num: number) => {
    
    if (num === 0 && soundOn && musicOn) {
      setSoundOn(false);
      setMusicOn(false);
    }
    else if (!soundOn && !musicOn){
      setSoundOn(true);
      setMusicOn(true);
    };

    if (gameAudio !== null) {
      gameAudio.volume = num;
    }
    
    warningAudio.volume = num;
    selectAudio.volume = num;
    achievementAudio.volume = num;
    teleporterAudio.volume = num;
    exitAudio.volume = num;
    winAudio.volume = num;
    loseAudio.volume = num;
    cheeringAudio.volume = num;
  }

  return {
    musicOn, // Might not be necessary to export
    setMusicOn,
    soundOn, // Might not be necessary to export
    setSoundOn, 
    gameAudio,
    loadGameSoundtrack,
    loadEscapeSoundtrack,
    setGameAudio,
    playWarningSound,
    playSelectSound,
    playAchievementSound,
    playTeleporterSound,
    playExitSound,
    playWinSound,
    playLoseSound,
    playCheeringSound, 
    value,
    setValue,
    setVolume
  }
} 

export default useSounds;