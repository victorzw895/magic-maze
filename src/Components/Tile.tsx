import { memo } from 'react';
import Space from './Space';
import { DBTile, TeleporterSpace, ExplorationSpace, WeaponSpace, ExitSpace, TimerSpace } from '../types';
import { tileWallSize } from '../constants';
import isEqual from 'lodash/isEqual';
import { 
  usePlayerDocState,
  usePlayerHeldPawnDocState,
  useWeaponsStolenDocState,
} from '../Contexts/FirestoreContext';
import { getDisplacementValue, shouldHighlightSpace } from '../Helpers/TileMethods';
import { useAssets } from '../Contexts/AssetsContext';

interface tileProps {
  tileData: DBTile,
  tileIndex: number,
}

const areEqual = (prevProps: tileProps, nextProps: tileProps) => {
  return isEqual(prevProps, nextProps);
}

// memo could be good
const Tile = ({tileIndex, tileData}: tileProps) => {
  const { assets } = useAssets();
  const { currentPlayer } = usePlayerDocState();
  const playerHeldPawn = usePlayerHeldPawnDocState()
  const weaponsStolen = useWeaponsStolenDocState();
  
  return (
    <>
      {tileData ?
        <div className={`tile ${tileData.id === '1a' ? "start-tile" : ""}`} 
          style={
            {
              gridColumnStart: tileData.gridPosition[0],
              gridRowStart: tileData.gridPosition[1],
              marginTop: tileData.gridPosition[0] < 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
              marginBottom: tileData.gridPosition[0] > 8 ? getDisplacementValue(tileData.gridPosition[0]) : tileWallSize,
              marginLeft: tileData.gridPosition[1] > 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
              marginRight: tileData.gridPosition[1] < 8 ? getDisplacementValue(tileData.gridPosition[1]) : tileWallSize,
              placeSelf: "center"
            }
          }>
          {tileData.spaces && Object.values(tileData.spaces).map((row, rowIndex) => {
            return (
              <div className="row" key={`row${rowIndex}`}>
                {row.map((space, colIndex) => {
                  const highlightSpace = shouldHighlightSpace(playerHeldPawn, currentPlayer, tileData, colIndex, rowIndex);
                  const {type, details} = space;
                  const playerHeldPawnColor = playerHeldPawn?.color;
                  const disableTeleporter = weaponsStolen.length === 4
                  const highlightTeleporter = 
                    type === 'teleporter' && 
                    !disableTeleporter &&
                    (details as TeleporterSpace).color === playerHeldPawnColor;
                  const highlightEscalator = details?.hasEscalator && playerHeldPawn?.showEscalatorSpaces.length;
                  
                  return (
                    <Space 
                      {
                        ...{
                          spaceType: type,
                          spaceColor: (details as TeleporterSpace | ExplorationSpace | WeaponSpace | ExitSpace)?.color,
                          spaceHasEscalator: details?.hasEscalator,
                          spaceEscalatorName: details?.escalatorName,
                          spaceIsDisabled: (details as TimerSpace)?.isDisabled,
                          spaceWeaponStolen: (details as WeaponSpace)?.weaponStolen,
                        }
                      }
                      key={`space${rowIndex}-${colIndex} ${highlightSpace ? "highlight" : ""}`} 
                      spacePosition={[colIndex, rowIndex]} 
                      gridPosition={tileData.gridPosition}
                      tileIndex={tileIndex}
                      showMovableArea={highlightSpace} 
                      colorSelected={(highlightSpace || highlightTeleporter || highlightEscalator) && playerHeldPawn ? playerHeldPawn.color : null}
                      disableTeleporter={type === 'teleporter' && disableTeleporter}
                      highlightTeleporter={highlightTeleporter ? playerHeldPawn.showTeleportSpaces: null}
                      highlightEscalator={highlightEscalator ? playerHeldPawn.showEscalatorSpaces: []}
                    />
                  )
                })}
              </div>
            )
          })}
          <img 
            key={tileData.id}
            draggable={false}
            src={assets[`${tileData.id}.jpg`]}
            alt={`tile-${tileData.id}`}
            style={{
              transform: `rotate(${tileData.rotation}deg)`,
            }}>
          </img>
        </div>
            :
        <>
        </>
      }
    </>
  )
}

// Tile.whyDidYouRender = true

export default Tile;
