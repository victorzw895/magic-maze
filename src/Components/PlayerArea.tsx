import { memo, useEffect, useState } from 'react';
import { useGame } from '../Contexts/GameContext';
// import { usePlayer } from '../Contexts/PlayerContext';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { useDocumentData } from 'react-firebase-hooks/firestore'
import { firestore, gamesRef } from "../Firestore";
import { DBPlayer } from '../types';

interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  player: DBPlayer
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  if (JSON.stringify(prevProps.player) === JSON.stringify(nextProps.player)) {
    return true
  }
  else if (prevProps.highlightNewTileArea === nextProps.highlightNewTileArea) {
    return true
  }
  return false
}

// memo this might not be necessary
const PlayerArea = memo(({highlightNewTileArea, player} : PlayerAreaProps) => {
  const { gameState, gameDispatch } = useGame();
  const [gamePaused, setGamePaused] = useState(false);
  const [room] = useDocumentData(gamesRef.doc(gameState.roomId));

  const _handleContinueGame = async () => {
    await setDoc(
      gamesRef.doc(gameState.roomId), 
      { 
        gamePaused: false,
      },
      {merge: true}
    )
    setGamePaused(false);
  }

  useEffect(() => {
    (async () => {
      if (!room) return;
      console.log('there is a room', room)
      if (room?.gamePaused !== gamePaused) {
        setGamePaused(true);
      }
    })()
  }, [room?.gamePaused])

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
                    onClick={() => highlightNewTileArea()}
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
              <button onClick={_handleContinueGame}>Continue</button>
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