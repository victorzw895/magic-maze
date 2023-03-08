import { memo, ReactNode, useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import isEqual from 'lodash/isEqual';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import Pinged from './Pinged';
import { useGamePausedDocState, usePlayerDocState, useWeaponsStolenDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  children: ReactNode
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const PlayerArea = ({highlightNewTileArea, children} : PlayerAreaProps) => {
  const { assets } = useAssets();
  const { gameState } = useGame();
  const { currentPlayer } = usePlayerDocState();
  const gamePaused = useGamePausedDocState();
  const weaponsStolen = useWeaponsStolenDocState();

  return (
    <div className="player-area">
      {
        currentPlayer.number &&
        <>
          {
            currentPlayer.playerDirections.map(direction => {
              return (
                <img 
                  key={direction}
                  draggable={false}
                  src={assets[`${direction}.png`]}
                  alt={direction} 
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
                    key={ability}
                    draggable={false}
                    onClick={gamePaused ? () => {} : highlightNewTileArea} // TODO: disable if game paused
                    src={assets[`${ability}.png`]}
                    alt={ability} 
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
                    key={ability}
                    draggable={false}
                    src={assets[`${ability}.png`]}
                    alt={ability} 
                    style={{
                      width: '80px',
                      margin: '0 30px'
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

// PlayerArea.whyDidYouRender = true

export default PlayerArea;