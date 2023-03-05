import { useEffect, useState } from 'react';
import { DBHeroPawn, Room, PlayerHeldPawn } from '../types';
import { pawnDefaultValues } from '../constants';
import { usePlayerState } from '../Contexts/PlayerContext';
import { setDoc } from '../utils/useFirestore';

const initPlayerHeldPawn = {
  ...pawnDefaultValues,
  color: null,
  gridPosition: [8, 8],
}

const usePawns = (room: Room, roomId: string): any => {
  const playerState = usePlayerState();
  const [playerHeldPawn, setPlayerHeldPawn] = useState<PlayerHeldPawn>(initPlayerHeldPawn);
  const [green, setGreen] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [yellow, setYellow] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [purple, setPurple] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [orange, setOrange] = useState<DBHeroPawn>({} as DBHeroPawn);

  const { pawns } = room;
  const { green: greenPawn, yellow: yellowPawn, orange: orangePawn, purple: purplePawn } = pawns;

  useEffect(() => {
    setPlayerHeldPawn(() => initPlayerHeldPawn);
    const currentPlayer = room.players.find(player => player.id === playerState?.id)
    if (!currentPlayer) return;
    const currentHeldPawn = Object.values(pawns).find(pawn => pawn.playerHeld === currentPlayer.number);
    if (!currentHeldPawn) return;
    setPlayerHeldPawn(() => currentHeldPawn || initPlayerHeldPawn);

    if (!currentHeldPawn) return;
    const timer = setTimeout(async() => {
      await setDoc(roomId, {
        pawns: {
          ...pawns,
          [currentHeldPawn.color]: {
            ...currentHeldPawn,
            playerHeld: null,
          }
        }
      })
    }, 8000);
    return () => clearTimeout(timer);
  }, [pawns])

  useEffect(() => {
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
    setOrange(orangePawn)
  },
  [
    orangePawn.playerHeld, 
    orangePawn.position[0], 
    orangePawn.position[1], 
    orangePawn.gridPosition[0], 
    orangePawn.gridPosition[1]
  ])


  return {
    green,
    yellow,
    purple,
    orange,
    playerHeldPawn
  };
};

export default usePawns;