import { 
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
} from '../../Contexts/FirestoreContext';
import Pawn from './Pawn';

const Pawns = () => {
  return (
    <>
      <GreenPawn />
      <YellowPawn />
      <OrangePawn />
      <PurplePawn />
    </>
  )
}

const GreenPawn = () => {
  const green = useGreenDocState();
  return <Pawn pawnData={green} />;
}

const YellowPawn = () => {
  const yellow = useYellowDocState();
  return <Pawn pawnData={yellow} />;
}

const PurplePawn = () => {
  const purple = usePurpleDocState();
  return <Pawn pawnData={purple} />;
}

const OrangePawn = () => {
  const orange = useOrangeDocState();
  return <Pawn pawnData={orange} />;
}

export default Pawns;