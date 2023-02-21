import { Room } from '../types';
import { setDoc as setDocument, doc as document, getDoc as getDocument } from "firebase/firestore"; 
import { gamesRef } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { roomDefaultValues } from '../constants';

const dbInitialState: Room = {
  ...roomDefaultValues,
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