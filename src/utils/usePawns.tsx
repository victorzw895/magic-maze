import React, { useCallback, useEffect, useRef, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBPawns, DBHeroPawn, DBPlayer, Room } from '../types';
import { getDoc } from './useFirestore';
import { usePlayerDispatch, usePlayerState } from '../Contexts/PlayerContext';

const usePawns = (room: Room): DBPawns => {
  const player = usePlayerState();
  // const [pawns, setPawns] = useState({});
  const [green, setGreen] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [yellow, setYellow] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [purple, setPurple] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [orange, setOrange] = useState<DBHeroPawn>({} as DBHeroPawn);

  const { pawns } = room;

  const { green: greenPawn, yellow: yellowPawn, orange: orangePawn, purple: purplePawn } = pawns;

  // useEffect(() => {
  //   const pawnHeld = Object.values(pawns).find((pawn: DBHeroPawn) => pawn.playerHeld && pawn.playerHeld === player.number);
  //   setPlayerHeldPawn(pawnHeld);
  // }, [pawns])

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

  useEffect(() => {
    console.log('from fiestore useeffect yellow pawn')
    setYellow(yellowPawn)
  },
  [
    yellowPawn.playerHeld, 
    yellowPawn.position[0], 
    yellowPawn.position[1], 
    yellowPawn.gridPosition[0], 
    yellowPawn.gridPosition[1]
  ])

  useEffect(() => {
    console.log('from fiestore useeffect purple pawn')
    setPurple(purplePawn)
  },
  [
    purplePawn.playerHeld, 
    purplePawn.position[0], 
    purplePawn.position[1], 
    purplePawn.gridPosition[0], 
    purplePawn.gridPosition[1]
  ])

  useEffect(() => {
    console.log('from fiestore useeffect orange pawn')
    setOrange(orangePawn)
  },
  [
    orangePawn.playerHeld, 
    orangePawn.position[0], 
    orangePawn.position[1], 
    orangePawn.gridPosition[0], 
    orangePawn.gridPosition[1]
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


  return {
    green,
    yellow,
    purple,
    orange
  } as DBPawns;
};

export default usePawns;