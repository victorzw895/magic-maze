import React, { useEffect } from 'react';
import { useAudio } from '../Contexts/AudioContext';
import { IconButton, Box, Stack, Slider } from '@mui/material';
import { VolumeUp, VolumeMute, MusicNote, MusicOff, Notifications, NotificationsOff, Settings } from '@mui/icons-material';

const AudioControls = () => {
  const { musicOn, setMusicOn, soundOn, setSoundOn, value, setValue, setVolume } = useAudio();

  useEffect(() => {
  }, [musicOn]);

  useEffect(() => {
  }, [soundOn]);

  useEffect(() => {

  }, [value]);

  const handleChange = (event: Event, newValue: number | number[]) => {
    const volumeValue: number = (newValue as number) / 100;
    setValue(newValue as number);
    setVolume(volumeValue);
  }

  return (
    <div className='controls'>
      { musicOn ? 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setMusicOn(false)} title="Game Soundtrack On"><MusicNote /> </IconButton> 
        : 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setMusicOn(true)} title="Game Soundtrack Off"><MusicOff /> </IconButton> 
      }
      {
        soundOn ?
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setSoundOn(false)} title="Sound Effects On"><Notifications /> </IconButton> 
        : 
        <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => setSoundOn(true)} title="Sound Effects Off"><NotificationsOff /> </IconButton> 
      }
      <Box sx={{ width: 200, verticalAlign: "middle", mr: "10px", display: "inline-block"}}>
        <Stack spacing={2} direction="row"  alignItems="center">
          {
            value === 0 ? <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => {setVolume(1); setValue(100)}}  title="Soundtrack and Music Off"><VolumeMute /> </IconButton> : <IconButton color="primary" aria-label="turn off sound" component="label" onClick={() => {setVolume(0); setValue(0)}} title="Soundtrack and Music On"><VolumeUp /> </IconButton> 
          }
          <Slider aria-label="Volume" value={value} title='Sound Effects and Music Volume Adjustment' onChange={handleChange} style={{margin: "0 10px"}} />
          
          </Stack>
      </Box>
    </div>
  )
}

export default AudioControls;