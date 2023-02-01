import React, { createContext, useContext, useReducer } from 'react';
import { heroColor, Player, playerNumber, direction, Escalator, DBPlayer } from '../types';

type Action = {type: 'playerHeld', value: number | null, color: heroColor} | 
              {type: 'showMovableSpaces', value: direction[]} | 
              {type: 'showEscalatorSpaces', value: Escalator[]} | 
              {type: 'showTeleportSpaces', color: heroColor | null} | 
              {type: 'setPlayer', value: Player} | undefined;
type Dispatch = (action: Action) => void;

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
    showEscalatorSpaces: [],
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
  showEscalatorSpaces: []
}

const PlayerContext = createContext<{playerState: Player; playerDispatch: Dispatch} | undefined>(undefined);

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
  const value = {playerState, playerDispatch};

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>
}

const usePlayer = () => {
  const context = useContext(PlayerContext)
  if (context === undefined) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

export { PlayerProvider, usePlayer };