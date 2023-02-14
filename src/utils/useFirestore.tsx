// utils/usePageBottom.js
import { Room } from '../types';
import { setDoc as setDocument, doc as document, getDoc as getDocument } from "firebase/firestore"; 
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'

const dbInitialState: Room = {
  gameStarted: false,
  gamePaused: false,
  timeLeft: 200,
  weaponsStolen: [],
  heroesEscaped: [],
  players: [],
  tiles: [],
  pawns: {
    green: {
      color: "green",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    yellow: {
      color: "yellow",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    orange: {
      color: "orange",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    purple: {
      color: "purple",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    }
  },
}

const doc = (roomId: string) => document(gamesRef, roomId);

export const useDocData = (roomId: string): [...rest: any] => {
  return useDocumentData(roomId ? doc(roomId) : null, {initialValue: dbInitialState});
};

export const setDoc = async (roomId: string, data: any) => {
  await setDocument(
    doc(roomId), 
    data,
    {merge: true}
  )
};

export const getDoc = async (roomId: string) => {
  return await getDocument(doc(roomId));
}