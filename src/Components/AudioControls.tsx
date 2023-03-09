import React, { useEffect } from 'react';
import { useAudio } from '../Contexts/AudioContext';
import { IconButton, Box, Stack, Slider } from '@mui/material';
import { VolumeUp, VolumeMute, MusicNote, MusicOff, VolumeDown } from '@mui/icons-material';

const AudioControls = () => {
  const { musicOn, setMusicOn, soundOn, setSoundOn, value, setValue, setVolume } = useAudio();

  useEffect(() => {
  }, [musicOn]);

  useEffect(() => {
  }, [soundOn]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    // const volumeValue: number = newValue / 100;
    setValue(newValue as number);
    setVolume(0.2);
  }

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
      <Box sx={{ width: 200}}>
        <Stack spacing={2} direction="row" sx={{ mb: 1 }} alignItems="center">
          <VolumeDown color="primary" />
          <Slider aria-label="Volume" value={value} onChange={handleChange} />
          <VolumeUp color="primary" />
        </Stack>
      </Box>
    </div>
  )
}

export default AudioControls;