// import { useEffect } from 'react';
// import { Room, DBHeroPawn, DBTile } from '../../types';
// import { setDoc, getDoc } from '../../utils/useFirestore';
// import { 
//   useTilesDocState,
//   usePlayerDocState,
//   useGreenDocState,
//   useYellowDocState,
//   useOrangeDocState,
//   usePurpleDocState,
//   useFirestore,
// } from '../../Contexts/FirestoreContext';
// import { useGame } from '../../Contexts/GameContext';
// import { getPlayerPawnActions } from '../../Helpers/PawnMethods';
// import Pawn from './Pawn';

// const Pawns = () => {
//   return (
//     <>
//       <GreenPawn />
//       <YellowPawn />
//       <OrangePawn />
//       <PurplePawn />
//     </>
//   )
// }

// const GreenPawn = () => {
//   const [green] = useFirestore(
//     ({ pawns: { green: greenPawn }}) => greenPawn,
//     ({ pawns: { green: greenPawn }}) => [
//       greenPawn.playerHeld, 
//       greenPawn.position[0], 
//       greenPawn.position[1], 
//       greenPawn.gridPosition[0], 
//       greenPawn.gridPosition[1]
//     ]
//   )

//   return <Pawn pawnData={green} />;
// }

// const YellowPawn = () => {
//   const [yellow] = useFirestore(
//     ({ pawns: { yellow: yellowPawn }}) => yellowPawn,
//     ({ pawns: { yellow: yellowPawn }}) => [
//       yellowPawn.playerHeld, 
//       yellowPawn.position[0], 
//       yellowPawn.position[1], 
//       yellowPawn.gridPosition[0], 
//       yellowPawn.gridPosition[1]
//     ]
//   )

//   return <Pawn pawnData={yellow} />;
// }

// const PurplePawn = () => {
//   const [purple] = useFirestore(
//     ({ pawns: { purple: purplePawn }}) => purplePawn,
//     ({ pawns: { purple: purplePawn }}) => [
//       purplePawn.playerHeld, 
//       purplePawn.position[0], 
//       purplePawn.position[1], 
//       purplePawn.gridPosition[0], 
//       purplePawn.gridPosition[1]
//     ]
//   )

//   return <Pawn pawnData={purple} />;
// }

// const OrangePawn = () => {
//   const [orange] = useFirestore(
//     ({ pawns: { orange: orangePawn }}) => orangePawn,
//     ({ pawns: { orange: orangePawn }}) => [
//       orangePawn.playerHeld, 
//       orangePawn.position[0], 
//       orangePawn.position[1], 
//       orangePawn.gridPosition[0], 
//       orangePawn.gridPosition[1]
//     ]
//   )

//   return <Pawn pawnData={orange} />;
// }

// export default Pawns;

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
  const { gameState } = useGame();
  const { player } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();

  useEffect(() => {
    (async () => {
      if (tiles.length <= 1) return;

      const docSnap = await getDoc(gameState.roomId);
      if (!docSnap.exists()) return;

      const roomFound: Room = docSnap.data() as Room;
      const newPawns = roomFound.pawns;

      Object.values(newPawns).forEach((pawn: DBHeroPawn) => {
        const playerPawnActions = getPlayerPawnActions(player, tiles, newPawns, pawn);
        if (pawn.playerHeld === player.number) {
          pawn.blockedPositions = playerPawnActions.blockedPositions
          pawn.showMovableDirections = playerPawnActions.showMovableDirections
          pawn.showEscalatorSpaces = playerPawnActions.showEscalatorSpaces
          pawn.showTeleportSpaces = playerPawnActions.showTeleportSpaces
        }
        console.log('newPawns', {playerPawnActions, pawn, blockedPositions: playerPawnActions.blockedPositions})
      })

      console.log('newPawns', newPawns)

      await setDoc(
        gameState.roomId, 
        { 
          pawns: {
            ...newPawns,
          }
        },
      )
    })()
  }, [tiles])

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