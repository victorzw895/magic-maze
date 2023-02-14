import React, { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { useDocumentData, useDocument } from 'react-firebase-hooks/firestore'
import { Room } from '../types';
import { useGame } from '../Contexts/GameContext';
import { firestore, gamesRef } from "../Firestore";
import { setDoc, doc, getDoc, getFirestore, DocumentData, DocumentReference } from "firebase/firestore"; 

type Action = {type: 'update', value: string} | undefined;
// type Dispatch = (document: any, roomId?: string) => Promise<void>
type Dispatch = (action: Action) => void;

type DBProviderProps = {children: React.ReactNode}


const DocRefStateContext = createContext<DocumentReference<any> | null | undefined>(undefined);
const DocRefDispatchContext = createContext<Dispatch | undefined>(undefined);

export const getDocSnap = async (roomId: string) => {
  const gamesDocRef = doc(gamesRef, roomId);
  const docSnap = await getDoc(gamesDocRef);
  
  return docSnap;
}

const docRefReducer = (docRefState: DocumentReference<any> | null, action: any) => {
  let newState = docRefState;

  switch (action?.type) {
    case 'update': {
      if (!action.value) return newState;
      return doc(gamesRef, action.value);
    }
    default: {
      throw new Error(`Unhandled action type: ${action?.type}`)
    }
  }
}


const Provider = ({children}: DBProviderProps) => {
  const [docRef, setDocRef] = useReducer(docRefReducer, null);

  // const docRefProviderValue = { docRef, setDocRef };

  return (
    <DocRefStateContext.Provider value={docRef}>
      <DocRefDispatchContext.Provider value={setDocRef}>
        {children}
      </DocRefDispatchContext.Provider>
    </DocRefStateContext.Provider>
  )
}


const useDocRef = () => {
  const context = useContext(DocRefStateContext)
  if (context === undefined) {
    throw new Error('useDocRef must be used within a DocRefContext');
  }
  return context;
}

const useDocRefDispatch = () => {
  const context = useContext(DocRefDispatchContext)
  if (context === undefined) {
    throw new Error('useDocRef must be used within a DocRefContext');
  }
  return context;
}

export { Provider, useDocRef, useDocRefDispatch };