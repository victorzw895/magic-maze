import React, { createContext, useContext, useReducer, useMemo } from 'react';
import { HeroPawn, heroName, heroWeapon, heroColor, DBHeroPawn, direction, Escalator } from '../types';

const startPositions = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2]
]

const randomPosition = startPositions.sort(() => {
  return 0.5 - Math.random();
})

const takePosition = () => {
  return randomPosition.splice(0, 1).flat(1);
}

export const PawnFactory = (color: heroColor, startPosition?: number[]) => {
  // console.log('pawn factory', color, startPosition);
  let heroName, weapon;
  switch (color) {
    case 'yellow':
      heroName = 'Barbarian'
      weapon = 'sword'
      break;
    case 'purple':
      heroName = 'Mage'
      weapon = 'vial'
      break;
    case 'green':
      heroName = 'Elf'
      weapon = 'bow'
      break;
    case 'orange':
      heroName = 'Dwarf'
      weapon = 'axe'
      break;
    default:
      break;
  }

  const localPawnState: HeroPawn = {
    heroName: heroName as heroName, // TODO: unnecessary? 
    color, // TODO remove, can use values straight from DB
    height: 46.25,
    width: 46.25,
    weapon: weapon as heroWeapon, 
    blockedPositions: {
      up: {
        position: null,
        gridPosition: null
      },
      left: {
        position: null,
        gridPosition: null
      },
      right: {
        position: null,
        gridPosition: null
      },
      down: {
        position: null,
        gridPosition: null
      }
    },
    showMovableDirections: [],
    showTeleportSpaces: null,
    showEscalatorSpaces: [],
  }

  const dbPawnState: DBHeroPawn = {
    color,
    playerHeld: null,
    position: startPosition || [],
    gridPosition: [8, 8],
    ability: '',
    canUseAbility: false,
  }

  return {
    pawn: localPawnState,
    dbPawn: dbPawnState
  }
}

type BlockedPosition = {
  position: number[] | null;
  gridPosition: number[] | null;
}

export type BlockedPositions = {
  up: BlockedPosition,
  down: BlockedPosition,
  left: BlockedPosition,
  right: BlockedPosition
}

// {type: 'showMovableSpaces', value: direction[]} | 
// {type: 'showEscalatorSpaces', value: Escalator[]} | 
// {type: 'showTeleportSpaces', color: heroColor | null}
type Action = 
              // {type: 'playerHeld', value: number | null, color: heroColor} | 
              {
                type: 'showActions',
                blockedPositions: BlockedPositions,
                playerDirections: direction[],
                escalatorSpaces: Escalator[],
                teleporterSpaces: heroColor | null,
                color: heroColor | null
              } | 
              {type: 'addBlockedPositions', value: BlockedPositions, color: heroColor} | undefined;
export type Dispatch = (action: Action) => void;
export type PawnState = {
  yellow: HeroPawn,
  green: HeroPawn,
  purple: HeroPawn,
  orange: HeroPawn,
}

export type DBPawnState = {
  yellow: DBHeroPawn,
  green: DBHeroPawn,
  purple: DBHeroPawn,
  orange: DBHeroPawn,
}

type PawnProviderProps = {children: React.ReactNode}

export const pawnsInitialState: PawnState = {
  yellow: PawnFactory("yellow").pawn,
  green: PawnFactory("green").pawn,
  purple: PawnFactory("purple").pawn,
  orange: PawnFactory("orange").pawn,
}

export const pawnDBInitialState: DBPawnState = {
  yellow: PawnFactory("yellow", takePosition()).dbPawn,
  green: PawnFactory("green", takePosition()).dbPawn,
  purple: PawnFactory("purple", takePosition()).dbPawn,
  orange: PawnFactory("orange", takePosition()).dbPawn,
}

const PawnContext = createContext<PawnState | undefined>(undefined);
const PawnDispatchContext = createContext<any>(undefined);

const pawnReducer = (pawnState: PawnState, action: any) => {
  let newState = {...pawnState};

// case 'showMovableSpaces': {
    //   newState.showMovableDirections = action.value;
    //   return newState;
    // }
    // case 'showTeleportSpaces': {
    //   newState.showTeleportSpaces = action.color;
    //   return newState;
    // }
    // case 'showEscalatorSpaces': {
    //   newState.showEscalatorSpaces = action.value;
    //   return newState;
    // }

  switch (action.type) {
    // case 'playerHeld': 
    //   newState[action.color as keyof PawnState].playerHeld = action.value;
    //   return newState;
    case 'showActions': 
      console.log('show actions', {newState, action})
      newState[action.color as keyof PawnState].blockedPositions = action.blockedPositions;
      newState[action.color as keyof PawnState].showMovableDirections = action.playerDirections;
      newState[action.color as keyof PawnState].showTeleportSpaces = action.teleporterSpaces;
      newState[action.color as keyof PawnState].showEscalatorSpaces = action.escalatorSpaces;
      return newState;
    case 'addBlockedPositions': 
      newState[action.color as keyof PawnState].blockedPositions = action.value;
      return newState;
    default: 
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const PawnProvider = ({children}: PawnProviderProps) => {
  const [pawnState, pawnDispatch] = useReducer(pawnReducer, pawnsInitialState);
  // const value = {pawnState, pawnDispatch};

  return (
    <PawnContext.Provider value={pawnState}>
      <PawnDispatchContext.Provider value={pawnDispatch}>
        {children}
      </PawnDispatchContext.Provider>
    </PawnContext.Provider>)
}

const usePawn = () => {
  const context = useContext(PawnContext)
  if (context === undefined) {
    throw new Error('usePawn must be used within a PawnProvider');
  }
  return context;
}

const usePawnDispatch = () => {
  const context = useContext(PawnDispatchContext)
  if (context === undefined) {
    throw new Error('usePawnDispatch must be used within a PawnDispatchContext');
  }
  return context;
}

export { PawnProvider, usePawn, usePawnDispatch };