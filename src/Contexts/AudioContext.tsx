import {createContext, useContext, ReactNode} from 'react';
import useSounds from '../utils/useSounds';

// TODO KRIS: Create Context -> takes a initial value
const AudioContext = createContext<any>(undefined);


// TODO KRIS: Context Provider -> like a component with all states, useEffects and returns provider wrapping children
const AudioProvider = ({children}: {children: ReactNode}) => {
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
    throw new Error('usePingedDocState must be used within a PingedDocContext');
  }
  return context
}


export {
  AudioProvider,
}