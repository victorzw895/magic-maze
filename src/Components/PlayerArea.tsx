import { memo, ReactNode } from 'react';
import { useGame } from '../Contexts/GameContext';
import { DBPlayer } from '../types';
import isEqual from 'lodash/isEqual';
import { setDoc } from '../utils/useFirestore';
import { usePlayerState } from '../Contexts/PlayerContext';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import { useDocData, getDoc } from '../utils/useFirestore';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  // gamePaused: boolean,
  children: ReactNode
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

// TODO, this component only needs to re-render if highlightNewTileArea or gamePaused changes.
// player object is pretty much static. Should only update if pinged value is updated
// probably remove player from props.
// get docSnap and 
const PlayerArea = memo(({highlightNewTileArea} : PlayerAreaProps) => {
  console.log('re render player area', {highlightNewTileArea})
  const { gameState } = useGame();
  const playerState = usePlayerState();
  // const [room] = useDocData(gameState.roomId);

  // const {gamePaused} = room;

  return (
    <div className="player-area">
      {
        playerState.number &&
        <>
          {
            playerState.playerDirections.map(direction => {
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
            playerState.playerAbilities.map(ability => {
              if (ability === "explore") {
                // DECISION: use button, or image?
                // return <button key={ability} onClick={() => highlightNewTileArea()}>Add Tile</button>
                return (
                  <img 
                    draggable={false}
                    key={ability}
                    onClick={highlightNewTileArea} // TODO: disable if game paused
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
          {/* {
            (gamePaused) && <PlayerAreaDisabled />
          } */}
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
}, areEqual)

// PlayerArea.whyDidYouRender = true

export default PlayerArea;