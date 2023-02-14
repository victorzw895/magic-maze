import { memo } from 'react';
import { useGame } from '../Contexts/GameContext';
import { DBPlayer } from '../types';
import isEqual from 'lodash/isEqual';
import { setDoc } from '../utils/useFirestore';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  gamePaused: boolean,
  player: DBPlayer
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

// TODO memo this might not be necessary
const PlayerArea = memo(({highlightNewTileArea, gamePaused, player} : PlayerAreaProps) => {
  const { gameState } = useGame();

  const _handleContinueGame = async () => {
    await setDoc(gameState.roomId, 
      { 
        gamePaused: false,
      }
    )
  }

  return (
    <div className="player-area">
      {
        player &&
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
          {
            (gamePaused) &&
            <div className="game-paused">
              <p>Timer has been hit! Time left remaining:
                <span>{gameState.minutesLeft}</span>:
                <span>{gameState.secondsLeft.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
              </p>
              <button onClick={_handleContinueGame}>Continue</button> {/* TODO show only for player who paused game*/}
            </div>
          }
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

PlayerArea.whyDidYouRender = true

export default PlayerArea;