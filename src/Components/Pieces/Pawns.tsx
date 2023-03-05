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
  useHeroesEscapedDocState,
} from '../../Contexts/FirestoreContext';
import { useGame } from '../../Contexts/GameContext';
import { getPlayerPawnActions } from '../../Helpers/PawnMethods';
import Pawn from './Pawn';

const Pawns = () => {
  const { gameState } = useGame();
  const { currentPlayer } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();
  const heroesEscaped = useHeroesEscapedDocState();

  useEffect(() => {
    (async () => {
      if (tiles.length <= 1) return;

      const docSnap = await getDoc(gameState.roomId);
      if (!docSnap.exists()) return;

      const roomFound: Room = docSnap.data() as Room;
      const newPawns = roomFound.pawns;

      Object.values(newPawns).forEach((pawn: DBHeroPawn) => {
        const playerPawnActions = getPlayerPawnActions(currentPlayer, tiles, newPawns, pawn);
        if (pawn.playerHeld === currentPlayer.number) {
          pawn.blockedPositions = playerPawnActions.blockedPositions
          pawn.showMovableDirections = playerPawnActions.showMovableDirections
          pawn.showEscalatorSpaces = playerPawnActions.showEscalatorSpaces
          pawn.showTeleportSpaces = playerPawnActions.showTeleportSpaces
        }
      })

      await setDoc(
        gameState.roomId, 
        { 
          pawns: {
            ...newPawns,
          }
        },
      )
    })()
  }, [tiles.length])

  return (
    <>
      {!heroesEscaped.includes('green') ? <GreenPawn /> : <></>}
      {!heroesEscaped.includes('yellow') ? <YellowPawn /> : <></>}
      {!heroesEscaped.includes('orange') ? <OrangePawn /> : <></>}
      {!heroesEscaped.includes('purple') ? <PurplePawn /> : <></>}
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