import React, { createContext, useContext, useReducer } from 'react';
import { heroColor, Player, playerNumber, direction, Escalator, DBPlayer, BasePlayer } from '../types';

export type Action = {type: 'playerHeld', value: number | null, color: heroColor} | 
              {type: 'showMovableSpaces', value: direction[]} | 
              {type: 'showEscalatorSpaces', value: Escalator[]} | 
              {type: 'showTeleportSpaces', color: heroColor | null} | 
              {type: 'setPlayer', value: Player} |
              {type: 'assignActions', value: BasePlayer} | undefined;
export type Dispatch = (action: Action) => void;

type PlayerProviderProps = {children: React.ReactNode}

export interface PlayerFactoryType {
  player: Player,
  dbPlayer: DBPlayer
}

export const PlayerFactory = (playerName: string, currentPlayers: number) => {
  const localPlayerState: Player = {
    number: currentPlayers + 1 as playerNumber,
    showMovableDirections: [],
    showTeleportSpaces: null,
    showEscalatorSpaces: [], // TODO revisit this (trim down data)
  }

  const dbPlayerState: DBPlayer = {
    name: playerName,
    number: currentPlayers + 1 as playerNumber,
    playerDirections: [], 
    playerAbilities: [],
    pinged: false
  }

  return {
    player: localPlayerState, 
    dbPlayer: dbPlayerState
  }
}

// assign random number

const playerInitialState: Player = {
  number: null,
  showMovableDirections: [],
  showTeleportSpaces: null,
  showEscalatorSpaces: [],
}

const PlayerStateContext = createContext<Player | undefined>(undefined);
const PlayerDispatchContext = createContext<Dispatch | undefined>(undefined);

const playerReducer = (playerState: Player, action: any) => {
  let newState = {...playerState};

  switch (action.type) {
    case 'playerHeld': {
      return newState;
    }
    case 'showMovableSpaces': {
      newState.showMovableDirections = action.value;
      return newState;
    }
    case 'showTeleportSpaces': {
      newState.showTeleportSpaces = action.color;
      return newState;
    }
    case 'showEscalatorSpaces': {
      newState.showEscalatorSpaces = action.value;
      return newState;
    }
    case 'setPlayer': {
      newState = action.value;
      return newState;
    }
    case 'assignActions': {
      // TODO, these are constant values that never change, should move to a seperate provider,
      // so components using these values do not re-render whenever playerContext value changes.
      // MINOR priority
      // newState.playerAbilities = action.value.playerAbilities;
      // newState.playerDirections = action.value.playerDirections;
      return newState;
    }
    case 'movePawn': {
      // newState[action.color as keyof Player].position = action.value;
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
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