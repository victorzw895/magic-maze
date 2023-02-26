import { Room } from '../types';
import { setDoc as setDocument, doc as document, getDoc as getDocument } from "firebase/firestore"; 
import { getDownloadURL, ref } from "firebase/storage";
import { gamesRef, storage } from "../Firestore";
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { roomDefaultValues, jpgAssets, pngAssets, svgAssets } from '../constants';
import { allTiles } from '../Data/all-tiles-data';

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
  // const svgUrls = svgAssets.map(async (asset) => await downloadAsset(`${asset}.svg`))
  // const pngUrls = pngAssets.map(async (asset) => await downloadAsset(`${asset}.png`))
  // const jpgUrls = jpgAssets.map(async (asset) => await downloadAsset(`${asset}.jpg`))
  // const tilesUrls =  allTiles.map(async (tile) => await downloadAsset(`${tile.id}.png`))
  // const assets = await Promise.all([
  //   ...svgUrls, 
  //   ...pngUrls, 
  //   ...jpgUrls, 
  //   ...tilesUrls
  // ])

  // console.log(assets)
  // return assets
}