import {createContext, useContext, ReactNode} from 'react';
import useSounds, { useSoundsType } from '../utils/useSounds';

const AudioContext = createContext<useSoundsType | undefined>(undefined);

const AudioProvider = ({children}: {children: ReactNode}) => {

  return (
    <AudioContext.Provider value={useSounds()}>
      {children}
    </AudioContext.Provider>
  )
}

const useAudio = () => {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error('useAudio must be used within a AudioProvider');
  }
  return context
}

export {
  AudioProvider, useAudio
}