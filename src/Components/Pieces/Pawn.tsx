import { useEffect } from 'react';
import { Room, DBHeroPawn, DBTile } from '../../types';
import { tileWallSize } from '../../constants';
import { useGame } from '../../Contexts/GameContext';
import { getDoc, setDoc } from '../../utils/useFirestore';
import { showMovableSpaces } from '../../Helpers/TileMethods';
import { 
  useTilesDocState,
  usePlayerDocState,
  useGamePausedDocState,
  useFirestore,
} from '../../Contexts/FirestoreContext';
import { getDisplacementValue } from '../../Helpers/TileMethods';
import { getPlayerPawnActions } from '../../Helpers/PawnMethods';

interface pawnProps {
  pawnData: DBHeroPawn,
}

const Pawn = ({pawnData}: pawnProps) => {
  const { color } = pawnData;
  console.log('pawn re render')
  // console.log('re render pawns', {pawnData}, color)

  const { gameState } = useGame();
  const [gamePaused] = useFirestore(({gamePaused}) => gamePaused)
  const { player } = usePlayerDocState();
  const [tiles] = useFirestore(({tiles}) => tiles, ({tiles}) => [tiles.length])

  // TODO: HOC on a pawn component, modify logic for single pawn re render
  useEffect(() => {
    (async () => {
      if (tiles.length <= 1) return;

      const docSnap = await getDoc(gameState.roomId);
      if (!docSnap.exists()) return;

      const roomFound: Room = docSnap.data() as Room;
      const newPawns = roomFound.pawns;

      if (!player) return;
      if (pawnData.playerHeld === player.number) {
        const playerPawnActions = getPlayerPawnActions(player, tiles, newPawns, pawnData);
          newPawns[color].blockedPositions = playerPawnActions.blockedPositions
          newPawns[color].showMovableDirections = playerPawnActions.showMovableDirections
          newPawns[color].showEscalatorSpaces = playerPawnActions.showEscalatorSpaces
          newPawns[color].showTeleportSpaces = playerPawnActions.showTeleportSpaces
      }
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
  }, [tiles.length])

  const toggleMovableSpaces = async () => {
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns } = roomFound;

    await showMovableSpaces(gameState.roomId, pawns, player, pawnData, tiles)
  }

  return (
    <>
      {
        <div className="pawn-grid"
          style={{
            gridColumnStart: pawnData?.gridPosition[0],
            gridRowStart: pawnData?.gridPosition[1],
            marginTop: pawnData?.gridPosition[0] < 8 ? getDisplacementValue(pawnData?.gridPosition[0]) : tileWallSize,
            marginBottom: pawnData?.gridPosition[0] > 8 ? getDisplacementValue(pawnData?.gridPosition[0]) : tileWallSize,
            marginLeft: pawnData?.gridPosition[1] > 8 ? getDisplacementValue(pawnData?.gridPosition[1]) : tileWallSize,
            marginRight: pawnData?.gridPosition[1] < 8 ? getDisplacementValue(pawnData?.gridPosition[1]) : tileWallSize,
            placeSelf: "center",
            position: "static"
          }}>
          <div 
            className={`pawn ${color}`} 
             // TODO: disable pawn for escapedHeroes || or just remove component
            onClick={gameState.gameOver ? () => {} : !gamePaused ? toggleMovableSpaces : () => {}}
            // onClick={gameState.gameOver || room.heroesEscaped.includes(color) ? () => {} : !room.gamePaused ? toggleMovableSpaces : () => {}}
            style={{
              gridColumnStart: pawnData?.position[0] + 1,
              gridRowStart: pawnData?.position[1] + 1,
              position: "relative"
            }}
          >
            <img 
              key={`${color}-pawn`}
              draggable={false}
              src={`/${color}-pawn.svg`} 
              alt={`${color}-piece`} 
              style={{
                border: 
                  `${pawnData?.playerHeld ? 
                    (pawnData?.playerHeld === player.number ?
                      "2px solid blue" 
                        : 
                      "2px solid grey")
                    :
                    ""}`
                }}/>
          </div>
        </div>
      }
    </>
  )
};

export default Pawn;

