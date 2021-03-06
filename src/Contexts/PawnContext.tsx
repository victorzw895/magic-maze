import React, { createContext, useContext, useReducer } from 'react';
import { HeroPawn, heroName, heroWeapon, heroColor } from '../types';
import { DBHeroPawn } from '../firestore-types';

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
    heroName: heroName as heroName,
    color,
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


type Action = 
              // {type: 'playerHeld', value: number | null, color: heroColor} | 
              // {type: 'movePawn', value: number[], color: heroColor} | 
              {type: 'addBlockedPositions', value: BlockedPositions, color: heroColor} | undefined;
type Dispatch = (action: Action) => void;
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

const PawnContext = createContext<{pawnState: PawnState; pawnDispatch: Dispatch} | undefined>(undefined);

const pawnReducer = (pawnState: PawnState, action: any) => {
  let newState = {...pawnState};

  switch (action.type) {
    // case 'playerHeld': 
    //   newState[action.color as keyof PawnState].playerHeld = action.value;
    //   return newState;
    // case 'movePawn': 
    //   newState[action.color as keyof PawnState].position = action.value;
    //   return newState;
    case 'addBlockedPositions': 
      newState[action.color as keyof PawnState].blockedPositions = action.value;
      return newState;
    default: 
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const PawnProvider = ({children}: PawnProviderProps) => {
  const [pawnState, pawnDispatch] = useReducer(pawnReducer, pawnsInitialState);
  const value = {pawnState, pawnDispatch};

  return <PawnContext.Provider value={value}>{children}</PawnContext.Provider>
}

const usePawn = () => {
  const context = useContext(PawnContext)
  if (context === undefined) {
    throw new Error('usePawn must be used within a PawnProvider');
  }
  return context;
}

export { PawnProvider, usePawn };