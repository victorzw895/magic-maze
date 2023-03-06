
// import { usePawn } from '../Contexts/PawnContext';
import { useEffect } from 'react';
import { 
  usePlayerHeldPawnDocState 
} from '../Contexts/FirestoreContext';
import { downloadAssets } from '../utils/useFirestore';

const Test = () => {

  useEffect(() => {
    (async () => {
      await downloadAssets();
    })()
  }, [])
  // const { currentPlayer } = usePlayerDocState();
  
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