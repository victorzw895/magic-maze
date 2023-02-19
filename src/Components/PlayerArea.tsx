import { memo, ReactNode, useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import { DBPlayer } from '../types';
import isEqual from 'lodash/isEqual';
import { setDoc } from '../utils/useFirestore';
import { usePlayerState } from '../Contexts/PlayerContext';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import { useDocData, getDoc } from '../utils/useFirestore';
import { useGamePausedDocState, usePlayerDocState } from '../Contexts/FirestoreContext';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  // gamePaused: boolean,
  children: ReactNode
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

// TODO, this component only needs to re-render if highlightNewTileArea changes.
// player object is pretty much static. Should only update if pinged value is updated
// probably remove player from props.
const PlayerArea = ({highlightNewTileArea, children} : PlayerAreaProps) => {
  console.log('*** *** re render player area')
  const { gameState } = useGame();
  const { player }: { player: DBPlayer } = usePlayerDocState();
  // const playerState = usePlayerState(); // TODO causing extra re render, can fix through TODO in playercontext
  const gamePaused = useGamePausedDocState();

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