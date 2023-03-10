import { useEffect, useState } from 'react';
import { useGame } from '../Contexts/GameContext';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import Pinged from './Pinged';
import { useGamePausedDocState, useCurrentPlayerDocState, useWeaponsStolenDocState, useLoadingDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';
import { availableTiles } from '../Contexts/TilesContext';
import after from 'lodash/after';

interface PlayerAreaProps {
  highlightNewTileArea: () => void
}

const PlayerArea = ({highlightNewTileArea} : PlayerAreaProps) => {
  const { assets } = useAssets();
  const { setAbilitiesLoaded } = useLoadingDocState();
  const { gameState } = useGame();
  const { currentPlayer } = useCurrentPlayerDocState();
  const gamePaused = useGamePausedDocState();
  const weaponsStolen = useWeaponsStolenDocState();
  const [assetLodedCount, setAssetLodedCount] = useState(0);

  useEffect(() => {
    if (assetLodedCount !== currentPlayer.playerDirections.length + currentPlayer.playerAbilities.length) return;
    setAbilitiesLoaded(true)
  }, [assetLodedCount])
  
  return (
    <div className="player-area">
      {
        currentPlayer.number &&
        <>
          {
            currentPlayer.playerDirections.map(direction => {
              return (
                <img 
                  onLoad={() => setAssetLodedCount((prev) => prev + 1)}
                  key={direction}
                  draggable={false}
                  src={assets[`${direction}.png`]}
                  alt={direction} 
                  title={direction}
                  style={{
                    width: '80px',
                    margin: '0 30px'
                  }}
                    />
              )
            })
          }
          {
            currentPlayer.playerAbilities.map(ability => {
              if (ability === "explore") {
                // DECISION: use button, or image?
                // return <button key={ability} onClick={() => highlightNewTileArea()}>Add Tile</button>
                return (
                  <img 
                    onLoad={() => setAssetLodedCount((prev) => prev + 1)}
                    key={ability}
                    draggable={false}
                    onClick={gamePaused || availableTiles.length === 0 ? () => {} : highlightNewTileArea} // TODO: disable if game paused
                    src={availableTiles.length === 0 ? assets[`${ability}-disabled.png`] : assets[`${ability}.png`]}
                    alt={ability} 
                    title={ability}
                    style={{
                      width: '80px',
                      margin: '0 30px'
                    }}
                      />
                )
              }
              else {
                return (
                  <img 
                    onLoad={() => setAssetLodedCount((prev) => prev + 1)}
                    key={ability}
                    draggable={false}
                    src={ability === 'teleport' && weaponsStolen.length === 4 ? assets[`${ability}-disabled.png`] : assets[`${ability}.png`]}
                    alt={ability} 
                    title={ability}
                    style={{
                      width: '80px',
                      margin: '0 30px',
                    }}
                      />
                )
              }
            })
          }
          <Pinged />
          {/* TODO: when firestore gamePaused, update gameState */}
          {gamePaused && <PlayerAreaDisabled />}
          {
              gameState.gameOver && 
              <div className="game-paused">
              <p>Game Over</p>
            </div>
          }
        </>
      }
    </div>
  )
}

export default PlayerArea;