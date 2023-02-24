import { useEffect } from 'react';
import { Room, DBHeroPawn, DBTile } from '../../types';
import { setDoc, getDoc } from '../../utils/useFirestore';
import { 
  useTilesDocState,
  usePlayerDocState,
  useGreenDocState,
  useYellowDocState,
  useOrangeDocState,
  usePurpleDocState,
} from '../../Contexts/FirestoreContext';
import { useGame } from '../../Contexts/GameContext';
import { getPlayerPawnActions } from '../../Helpers/PawnMethods';
import Pawn from './Pawn';

const Pawns = () => {
  // const { gameState } = useGame();
  // const { player } = usePlayerDocState();
  // const tiles: DBTile[] = useTilesDocState();

  // useEffect(() => {
  //   (async () => {
  //     if (tiles.length <= 1) return;

  //     const docSnap = await getDoc(gameState.roomId);
  //     if (!docSnap.exists()) return;

  //     const roomFound: Room = docSnap.data() as Room;
  //     const newPawns = roomFound.pawns;

  //     Object.values(newPawns).forEach((pawn: DBHeroPawn) => {
  //       const playerPawnActions = getPlayerPawnActions(player, tiles, newPawns, pawn);
  //       if (pawn.playerHeld === player.number) {
  //         pawn.blockedPositions = playerPawnActions.blockedPositions
  //         pawn.showMovableDirections = playerPawnActions.showMovableDirections
  //         pawn.showEscalatorSpaces = playerPawnActions.showEscalatorSpaces
  //         pawn.showTeleportSpaces = playerPawnActions.showTeleportSpaces
  //       }
  //       console.log('newPawns', {playerPawnActions, pawn, blockedPositions: playerPawnActions.blockedPositions})
  //     })

  //     console.log('newPawns', newPawns)

  //     await setDoc(
  //       gameState.roomId, 
  //       { 
  //         pawns: {
  //           ...newPawns,
  //         }
  //       },
  //     )
  //   })()
  // }, [tiles])

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