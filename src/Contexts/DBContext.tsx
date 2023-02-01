import React, { createContext, useContext, useReducer } from 'react';
import { Room } from '../types';

type Action = {type: 'update', value: String} | undefined;
type Dispatch = (action: Action) => void;

type DBProviderProps = {children: React.ReactNode}

const dbInitialState: Room = {
  gameStarted: false,
  gamePaused: false,
  timeLeft: 200,
  weaponsStolen: [],
  heroesEscaped: [],
  players: [],
  tiles: [],
  pawns: {
    green: {
      color: "green",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    yellow: {
      color: "yellow",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    orange: {
      color: "orange",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    },
    purple: {
      color: "purple",
      playerHeld: null,
      position: [],
      gridPosition: [],
      ability: "",
      canUseAbility: false,
    }
  },
}

const DBContext = createContext<{dbState: Room; dbDispatch: Dispatch} | undefined>(undefined);

const dbReducer = (dbState: Room, action: any) => {
  // let newState = {...dbState};

  switch (action.type) {
    case 'update': {
      if (!action.value) return dbState;
      const { gameStarted, timeLeft, weaponsStolen, heroesEscaped, players, tiles, pawns } = action.value;
      const newState = {...dbState, gameStarted, timeLeft, weaponsStolen, heroesEscaped, players, tiles, pawns}
      return newState;
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const DBProvider = ({children}: DBProviderProps) => {
  const [dbState, dbDispatch] = useReducer(dbReducer, dbInitialState);
  const value = {dbState, dbDispatch};

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>
}

const useDB = () => {
  const context = useContext(DBContext)
  if (context === undefined) {
    throw new Error('useDB must be used within a DBProvider');
  }
  return context;
}

export { DBProvider, useDB };