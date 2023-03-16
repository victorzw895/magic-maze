import { Room } from '../types';
import { 
  setDoc as setDocument,
  doc as document,
  getDoc as getDocument,
  updateDoc as updateDocument,
} from "firebase/firestore"; 
import { getDownloadURL, ref } from "firebase/storage";
import { gamesRef, storage } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { roomDefaultValues, pngAssets, svgAssets } from '../constants';
import { allTiles } from '../Data/all-tiles-data';

const dbInitialState: Room = {
  ...roomDefaultValues,
}

export const doc = (roomId: string) => document(gamesRef, roomId);

export const useDocData = (roomId: string): [...rest: any] => {
  return useDocumentData(roomId ? doc(roomId) : null, {initialValue: dbInitialState});
};

export const updateDoc = async (roomId: string, data: any) => {
  await updateDocument(
    doc(roomId), 
    data,
  )
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

const downloadAsset = (file: string) => {
  const assetRef = ref(storage, file);
  return new Promise((resolve, reject) => {
    getDownloadURL(assetRef).then((url) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = (event) => {
        const blob = xhr.response;
      };
      xhr.open('GET', url);
      xhr.send();
      resolve(url)
    })
  });
}

export const downloadAssets = async () => {
  const svgUrls = svgAssets.map(async (asset) => await downloadAsset(`${asset}.svg`))
  const pngUrls = pngAssets.map(async (asset) => await downloadAsset(`${asset}.png`))
  const tilesUrls =  allTiles.map(async (tile) => await downloadAsset(`${tile.id}.jpg`))
  const res = await Promise.all([
    ...svgUrls, 
    ...pngUrls, 
    ...tilesUrls
  ])

  const assets = res.reduce((acc: any, value: any) => {
    const url = new URL(value);
    const assetName = url.pathname.split('/').pop() as string;
    return {...acc, [assetName]: value};
  }, {})
  
  return assets
}
