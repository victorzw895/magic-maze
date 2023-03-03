import React, { createContext, useContext, useReducer } from 'react';
import { heroColor, Player, playerNumber, direction, Escalator, DBPlayer } from '../types';
import cryptoRandomString from 'crypto-random-string';

export type Action = 
  {type: 'setPlayer', value: Player | null}
  | undefined;
export type Dispatch = (action: Action) => void;

type PlayerProviderProps = {children: React.ReactNode}

export interface PlayerFactoryType {
  player: Player,
  dbPlayer: DBPlayer
}

export const PlayerFactory = (playerName: string, playersInLobby: number) => {
  const id = cryptoRandomString({length: 10, type: 'alphanumeric'});

  const localPlayerState: Player = {
    id,
  }

  const dbPlayerState: DBPlayer = {
    id,
    name: playerName,
    number: playersInLobby + 1 as playerNumber,
    playerDirections: [], 
    playerAbilities: [],
  }

  return {
    player: localPlayerState, 
    dbPlayer: dbPlayerState
  }
}

const playerInitialState: Player | null = null;

const PlayerStateContext = createContext<Player | null | undefined>(undefined);
const PlayerDispatchContext = createContext<Dispatch | undefined>(undefined);

type PlayerState = Player | null;

const playerReducer = (playerState: PlayerState, action: Action) => {
  let newState = {...playerState} as PlayerState;

  switch (action?.type) {
    case 'setPlayer': { // ONLY THIS used
      newState = action.value;
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action?.type}`)
    }
  }
}

const PlayerProvider = ({children}: PlayerProviderProps) => {

  const [playerState, playerDispatch] = useReducer(playerReducer, playerInitialState);
  // TODO split player state, static values and dynamic values
  // eg
  // number, playerDirections, playerAbilities
  // showMovables ....

  return (
    <PlayerStateContext.Provider value={playerState}>
      <PlayerDispatchContext.Provider value={playerDispatch}>
        {children}
      </PlayerDispatchContext.Provider>
    </PlayerStateContext.Provider>
  )
}

const usePlayerState = () => {
  const context = useContext(PlayerStateContext)
  if (context === undefined) {
    throw new Error('usePlayerState must be used within a PlayerStateContext');
  }
  return context;
}

const usePlayerDispatch = () => {
  const context = useContext(PlayerDispatchContext)
  if (context === undefined) {
    throw new Error('usePlayerDispatch must be used within a PlayerDispatchContext');
  }
  return context;
}

export { PlayerProvider, usePlayerState, usePlayerDispatch };