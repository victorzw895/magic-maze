import { Room, DBHeroPawn, DBTile } from '../../types';
import { tileWallSize } from '../../constants';
import { useGame } from '../../Contexts/GameContext';
import { getDoc } from '../../utils/useFirestore';
import { showMovableSpaces } from '../../Helpers/TileMethods';
import { 
  useTilesDocState,
  usePlayerDocState,
  useGamePausedDocState,
} from '../../Contexts/FirestoreContext';
import { getDisplacementValue } from '../../Helpers/TileMethods';

interface pawnProps {
  pawnData: DBHeroPawn,
}

const Pawn = ({pawnData}: pawnProps) => {
  const { color } = pawnData;

  const { gameState } = useGame();
  const gamePaused = useGamePausedDocState();

  const { player } = usePlayerDocState();
  const tiles: DBTile[] = useTilesDocState();

  const toggleMovableSpaces = async () => {
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns, weaponsStolen } = roomFound;

    const disableTeleport = weaponsStolen.length === 4;

    await showMovableSpaces(gameState.roomId, pawns, player, pawnData, tiles, disableTeleport)
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
