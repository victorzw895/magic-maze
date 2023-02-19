import { memo, ReactNode } from 'react';
import { useGame } from '../Contexts/GameContext';
import { DBPlayer } from '../types';
import isEqual from 'lodash/isEqual';
import { setDoc } from '../utils/useFirestore';
import { usePlayerState } from '../Contexts/PlayerContext';

const PlayerAreaDisabled = () => {
  // console.log('re render player area')

  const { gameState } = useGame();

  const _handleContinueGame = async () => {
    await setDoc(gameState.roomId, 
      { 
        gamePaused: false,
      }
    )
  }

  return (
    <div className="game-paused">
      <p>Timer has been hit! Time left remaining:
        <span>{gameState.minutesLeft}</span>:
        <span>{gameState.secondsLeft.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})}</span>
      </p>
      <button onClick={_handleContinueGame}>Continue</button> {/* TODO show only for player who paused game*/}
    </div>
  )
}

export default PlayerAreaDisabled;