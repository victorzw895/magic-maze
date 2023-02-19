import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBPawns, DBHeroPawn, DBPlayer, Room } from '../types';
import { getDoc } from './useFirestore';
import { usePlayerDispatch, usePlayerState } from '../Contexts/PlayerContext';

const useGreen = (room: Room): [DBHeroPawn] => {
  // const [pawns, setPawns] = useState({});
  const [green, setGreen] = useState<DBHeroPawn>({} as DBHeroPawn);
  const { pawns } = room;

  const { green: greenPawn } = pawns;

  useEffect(() => {
    console.log('from fiestore useeffect green pawn')
    setGreen(greenPawn)
  },
  [
    greenPawn.playerHeld, 
    greenPawn.position[0], 
    greenPawn.position[1], 
    greenPawn.gridPosition[0], 
    greenPawn.gridPosition[1]
  ])
  
  // useEffect(() => {
  //   (() => {
  //     console.log('setPawns from fiestore context')
  //     // setPawns(room.pawns);
  //   })()
  // }, [room.pawns.green.gridPosition[0], room.pawns.green.gridPosition[1]])

  // useEffect(() => {
  //   (() => {
  //     console.log('setPawns from fiestore context')
  //     // setPawns(room.pawns);
  //   })()
  // }, [room.pawns.green.position[0], room.pawns.green.position[1]]) // Must be non-array or objects so its not checking for referential equality
  
  // useEffect(() => {
  //   (() => {
  //     console.log('setPawns from fiestore context')
  //     // setPawns(room.pawns);
  //   })()
  // }, [room.pawns.green.playerHeld]) // Must be non-array or objects so its not checking for referential equality


  return [green];
};

export default useGreen;