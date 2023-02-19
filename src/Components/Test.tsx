import { useGamePausedDocState, useGreenDocState, useTilesDocState, usePlayerDocState } from '../Contexts/FirestoreContext';

const Test =() => {
  console.log('Test re render (((((')
  const gamePaused = useGamePausedDocState();
  const green = useGreenDocState();
  const { player } = usePlayerDocState();

  console.log('Test component re render')
  return (<div>Test {green.color}</div>)
}

export default Test;