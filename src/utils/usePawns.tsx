import { useEffect, useState } from 'react';
import { DBHeroPawn, Room } from '../types';
import { pawnDefaultValues } from '../constants';
import { usePlayerState } from '../Contexts/PlayerContext';

const initPlayerHeldPawn = {
  ...pawnDefaultValues,
  color: null,
  gridPosition: [8, 8],
}

const usePawns = (room: Room): any => {
  const player = usePlayerState();
  const [playerHeldPawn, setPlayerHeldPawn] = useState({});
  const [green, setGreen] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [yellow, setYellow] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [purple, setPurple] = useState<DBHeroPawn>({} as DBHeroPawn);
  const [orange, setOrange] = useState<DBHeroPawn>({} as DBHeroPawn);

  const { pawns } = room;
  const { green: greenPawn, yellow: yellowPawn, orange: orangePawn, purple: purplePawn } = pawns;

  useEffect(() => {
    const currentHeldPawn = Object.values(pawns).find(pawn => pawn.playerHeld === player.number);
    setPlayerHeldPawn(currentHeldPawn || initPlayerHeldPawn);
  }, [pawns])

  useEffect(() => {
    console.log('from fiestore useeffect green pawn', greenPawn)
    setGreen(greenPawn)
    if (greenPawn.playerHeld === player.number){
      setPlayerHeldPawn(greenPawn)
    }
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
    if (yellowPawn.playerHeld === player.number){
      setPlayerHeldPawn(yellowPawn)
    }
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
    if (purplePawn.playerHeld === player.number){
      setPlayerHeldPawn(purplePawn)
    }
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
    if (orangePawn.playerHeld === player.number){
      setPlayerHeldPawn(orangePawn)
    }
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