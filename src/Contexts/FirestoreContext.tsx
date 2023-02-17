import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useDocumentData, useDocument } from 'react-firebase-hooks/firestore'
import { Room } from '../types';
import { useGame } from '../Contexts/GameContext';
import { firestore, gamesRef } from "../Firestore";
import { useDocData, getDoc } from '../utils/useFirestore';

type Action = {type: 'update', value: string} | undefined;
// type Dispatch = (document: any, roomId?: string) => Promise<void>
type Dispatch = (action: Action) => void;

type DBProviderProps = {children: React.ReactNode}


const DocRefStateContext = createContext<any>(undefined);
const DocRefDispatchContext = createContext<Dispatch | undefined>(undefined);


// const docRefReducer = (docRefState: DocumentReference<any> | null, action: any) => {
//   let newState = docRefState;

//   switch (action?.type) {
//     case 'update': {
//       if (!action.value) return newState;
//       return doc(gamesRef, action.value);
//     }
//     default: {
//       throw new Error(`Unhandled action type: ${action?.type}`)
//     }
//   }
// }


const FirestoreProvider = ({children}: DBProviderProps) => {
  const { gameState } = useGame();
  // const [docRef, setDocRef] = useReducer(docRefReducer, null);
  const [room] = useDocData(gameState.roomId);
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    (() => {
      console.log('gamePaused from fiestore context')
      setGamePaused(room.gamePaused);
    })()
  }, [room.gamePaused])

  // const docRefProviderValue = { docRef, setDocRef };

  return (
    <DocRefStateContext.Provider value={gamePaused}>
      {/* <DocRefDispatchContext.Provider value={setDocRef}> */}
        {children}
      {/* </DocRefDispatchContext.Provider> */}
    </DocRefStateContext.Provider>
  )
}


const useFirestoreState = () => {
  const context = useContext(DocRefStateContext)
  if (context === undefined) {
    throw new Error('useDocRef must be used within a DocRefContext');
  }
  return context;
}

const useFirestoreDispatch = () => {
  const context = useContext(DocRefDispatchContext)
  if (context === undefined) {
    throw new Error('useDocRef must be used within a DocRefContext');
  }
  return context;
}

export { FirestoreProvider, useFirestoreState, useFirestoreDispatch };