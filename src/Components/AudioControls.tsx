import React, { useEffect } from 'react';
import { useAudio } from '../Contexts/AudioContext';
import { IconButton } from '@mui/material';
import { VolumeUp, VolumeMute, MusicNote, MusicOff } from '@mui/icons-material';

const AudioControls = () => {
  const { musicOn, setMusicOn, soundOn, setSoundOn } = useAudio();

  useEffect(() => {
    console.log("music on?", musicOn)
  }, [musicOn])

  useEffect(() => {
    console.log("sound on?", soundOn)
  }, [soundOn])

  return (
    <div className='controls'>
      { musicOn ? 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setMusicOn(false)} title="Sound Effects On"><MusicNote /> </IconButton> 
        : 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setMusicOn(true)} title="Sound Effects Off"><MusicOff /> </IconButton> 
      }
      {
        soundOn ?
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setSoundOn(false)} title="Music On"><VolumeUp /> </IconButton> 
        : 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setSoundOn(true)} title="Music Off"><VolumeMute /> </IconButton> 
      }
    </div>
  )
}

export default AudioControls;