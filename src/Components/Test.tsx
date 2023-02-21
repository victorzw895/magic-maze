
// import { usePawn } from '../Contexts/PawnContext';
import { 
  usePlayerHeldPawnDocState 
} from '../Contexts/FirestoreContext';

const Test = () => {
  // const { player } = usePlayerDocState();
  
  // const pawnState = usePawn(); // 2x extra re render
  
  const playerHeldPawn = usePlayerHeldPawnDocState()
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