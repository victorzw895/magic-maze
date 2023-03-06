import {createContext, useContext, ReactNode, useReducer} from 'react';
import useSounds from '../utils/useSounds';

// TODO KRIS: Create Context -> takes a initial value
const AudioContext = createContext<any>(undefined);


// TODO KRIS: Context Provider -> like a component with all states, useEffects and returns provider wrapping children
const AudioProvider = ({children}: {children: ReactNode}) => {

  // const [useSounds] = useReducer()
  return (
    <AudioContext.Provider value={useSounds}>
      {children}
    </AudioContext.Provider>
  )
}


// TODO KRIS: export useContext method
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