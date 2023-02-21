import { memo, ReactNode } from 'react';
import { useGame } from '../Contexts/GameContext';
import { setDoc } from '../utils/useFirestore';

const PlayerAreaDisabled = () => {
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