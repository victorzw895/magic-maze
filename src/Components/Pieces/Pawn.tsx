import { Room, DBHeroPawn } from '../../types';
import { tileWallSize } from '../../constants';
import { useGame } from '../../Contexts/GameContext';
import { getDoc } from '../../utils/useFirestore';
import { showMovableSpaces } from '../../Helpers/TileMethods';
import { 
  useTilesDocState,
  useCurrentPlayerDocState,
  useLoadingDocState,
  useGameOverDocState
} from '../../Contexts/FirestoreContext';
import { getDisplacementValue } from '../../Helpers/TileMethods';
import { useAssets } from '../../Contexts/AssetsContext';

interface pawnProps {
  pawnData: DBHeroPawn,
}

const Pawn = ({pawnData}: pawnProps) => {
  const { assets } = useAssets();
  const { onPawnsLoaded } = useLoadingDocState();
  const { color } = pawnData;
  const gameOver = useGameOverDocState();
  const { gameState } = useGame();

  const currentPlayer = useCurrentPlayerDocState();
  const tiles = useTilesDocState();

  const toggleMovableSpaces = async () => {
    const docSnap = await getDoc(gameState.roomId);
    if (!docSnap.exists()) return;
    const roomFound: Room = docSnap.data() as Room;
    const { pawns, weaponsStolen } = roomFound;

    const disableTeleport = weaponsStolen;

    await showMovableSpaces(gameState.roomId, pawns, currentPlayer, pawnData, tiles, disableTeleport)
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
            onClick={gameOver ? () => {} : toggleMovableSpaces}
            style={{
              gridColumnStart: pawnData?.position[0] + 1,
              gridRowStart: pawnData?.position[1] + 1,
              position: "relative",
              cursor: 'pointer',
            }}
          >
            <img 
              onLoad={() => onPawnsLoaded()}
              key={`${color}-pawn`}
              draggable={false}
              src={assets[`${color}-pawn.svg`]} 
              alt={`${color}-piece`} 
              style={{
                border: 
                  `${pawnData?.playerHeld ? 
                    (pawnData?.playerHeld === currentPlayer.number ?
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
