
// import { usePawn } from '../Contexts/PawnContext';
import { useEffect, useRef } from 'react';
import { 
  usePlayerHeldPawnDocState,
  useGreenDocState,
  useGamePausedDocState,
  useFirestore,
  useGameStartedDocState
} from '../Contexts/FirestoreContext';
import { RoomKeys } from '../types';
import { useGame } from '../Contexts/GameContext';
import { useDocData } from '../utils/useFirestore';

const Test = () => {

  const { gameState } = useGame();
  // const gameStarted = useGameStartedDocState()
  const [gameStarted] = useFirestore((room) => room.gameStarted)
  // const [room] = useDocData(gameState.roomId);

  // const roomRef = useRef(room);

  // useEffect(() => {
  //   // console.log('roomRef.current', roomRef.current);
  // })

  // const { gameStarted } = room;
  // const [value] = useFirestore(
  //   (state) => state.pawns.green,
  //   (state) => [
  //     state.pawns.green.playerHeld, 
  //     state.pawns.green.position[0], 
  //     state.pawns.green.position[1], 
  //     state.pawns.green.gridPosition[0], 
  //     state.pawns.green.gridPosition[1]
  //   ]
  // )
  console.log('Running test')

  // const [purple] = useFirestore(
  //   ({ pawns: { purple: purplePawn }}) => purplePawn, // object, arrays problem, shallow check? referential equality?, maybe the new Set
  //   ({ pawns: { purple: purplePawn }}) => [
  //     purplePawn.playerHeld, 
  //     purplePawn.position[0], 
  //     purplePawn.position[1], 
  //     purplePawn.gridPosition[0], 
  //     purplePawn.gridPosition[1]
  //   ]
  // )

  // const [yellow] = useFirestore(
  //   (state) => state.pawns.yellow, // object, arrays problem, shallow check? referential equality?, maybe the new Set
  //   (state) => [
  //     state.pawns.yellow.playerHeld, 
  //     state.pawns.yellow.position[0], 
  //     state.pawns.yellow.position[1], 
  //     state.pawns.yellow.gridPosition[0], 
  //     state.pawns.yellow.gridPosition[1]
  //   ]
  // )
  // // const gamePaused = useGamePausedDocState();
  // const green = useGreenDocState();

  // useEffect(() => {
  //   console.log('TEST **** yellow', yellow);
  // }, [yellow])

  // useEffect(() => {
  //   console.log('TEST **** purple', purple);
  // }, [purple])

  // useEffect(() => {
  //   console.log('TEST **** green', green);
  // }, [green])
  // const { player } = usePlayerDocState();
  
  // const pawnState = usePawn(); // 2x extra re render
  
  // const playerHeldPawn = usePlayerHeldPawnDocState()
  // console.log('Test re render (((((', {pawnState, playerHeldPawn})
  // console.log('$$$ re rendering tile', {tileIndex, tileData, pawnState, playerHeldPawn, player})

  console.log('Test component re render')
  return (
    <>
      Test
    </>
  );
}

export default Test;