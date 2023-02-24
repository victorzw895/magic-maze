import { ReactNode, useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import isEqual from 'lodash/isEqual';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import { useGamePausedDocState, usePlayerDocState, useFirestore } from '../Contexts/FirestoreContext';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  children: ReactNode
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const PlayerArea = ({highlightNewTileArea, children} : PlayerAreaProps) => {
  console.log('*** player area')
  const { gameState } = useGame();
  const { player } = usePlayerDocState();
  const [gamePaused] = useFirestore(({gamePaused}) => gamePaused)

  useEffect(() => {
    console.log('*** player area useEffect')
  }, [children, player])

  return (
    <div className="player-area">
      {
        player.number &&
        <>
          {
            player.playerDirections.map(direction => {
              return (
                <img 
                  key={direction}
                  draggable={false}
                  src={`/${direction}.png`} 
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
            player.playerAbilities.map(ability => {
              if (ability === "explore") {
                // DECISION: use button, or image?
                // return <button key={ability} onClick={() => highlightNewTileArea()}>Add Tile</button>
                return (
                  <img 
                    draggable={false}
                    key={ability}
                    onClick={gamePaused ? () => {} : highlightNewTileArea} // TODO: disable if game paused
                    src={`/${ability}.png`} 
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
                    src={`/${ability}.png`} 
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
