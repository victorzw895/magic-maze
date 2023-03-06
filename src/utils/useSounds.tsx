import { useEffect, useState } from 'react';
import gameSound from '../assets/game.mp3'; // download file from firestore storage instead
import escapeSound from '../assets/escape.wav'; // download file from firestore storage instead
import warningSound from '../assets/warning.wav'; // download file from firestore storage instead
import achievementSound from '../assets/achievement.mp3'; // download file from firestore storage instead
import teleporterSound from '../assets/teleporter.mp3'; // download file from firestore storage instead
import exitSound from '../assets/exit.mp3'; // download file from firestore storage instead
import selectSound from '../assets/select.mp3'; // download file from firestore storage instead
import winSound from '../assets/win.wav'; // download file from firestore storage instead

const warningAudio = new Audio(warningSound);
const selectAudio = new Audio(selectSound);
const achievementAudio = new Audio(achievementSound);
const teleporterAudio = new Audio(teleporterSound);
const exitAudio = new Audio(exitSound);
const winAudio = new Audio(winSound)

// ? Do we want to include Ping here?

const useSounds = () => {
  const [musicOn, setMusicOn] = useState<boolean>(true)
  const [soundOn, setSoundOn] = useState<boolean>(true)
  // gameAudio can play, pause. SetGameAudio is to change tracks
  const [gameAudio, setGameAudio] = useState<HTMLAudioElement>(new Audio(gameSound))

  // Game Music soundtrack useEffects
  useEffect(() => {
    gameAudio.play();
  }, [gameAudio])

  useEffect(() => {
    if (musicOn) gameAudio.play();
    else gameAudio.pause();
  }, [musicOn])

  const loadAndPlayEscapeSoundtrack = () => {
    const escapeSoundtrack = new Audio(escapeSound)
    
    if (musicOn) escapeSoundtrack.play()
    
    setGameAudio(escapeSoundtrack)
  }

  // Sounds methods
  const playWarningSound = () => {
    if (soundOn) warningAudio.play()
    else warningAudio.pause()
  }

  const playSelectSound = () => {
    if (soundOn) selectAudio.play()
    else selectAudio.pause()
  }

  const playAchievementSound = () => {
    if (soundOn) achievementAudio.play()
    else achievementAudio.pause()
  }

  const playTeleporterSound = () => {
    if (soundOn) teleporterAudio.play()
    else teleporterAudio.pause()
  }

  const playExitSound = () => {
    if (soundOn) exitAudio.play()
    else exitAudio.pause()
  }

  const playWinSound = () => {
    if (soundOn) winAudio.play()
    else winAudio.pause()
  }

  return {
    musicOn, // Might not be necessary to export
    setMusicOn,
    soundOn, // Might not be necessary to export
    setSoundOn, 
    gameAudio,
    loadAndPlayEscapeSoundtrack,
    playWarningSound,
    playSelectSound,
    playAchievementSound,
    playTeleporterSound,
    playExitSound,
    playWinSound
  }
} 

export default useSounds;