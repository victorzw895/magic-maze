import React, { createContext, useContext, useReducer } from 'react';
import { HeroPawn, heroName, heroWeapon, heroColor, DBHeroPawn } from '../types';
import { pawnStartPositions, spaceSize, pawnDefaultValues } from '../constants';

const randomPosition = pawnStartPositions.sort(() => {
  return 0.5 - Math.random();
})

const takePosition = () => {
  return randomPosition.splice(0, 1).flat(1);
}

export const PawnFactory = (color: heroColor, startPosition?: number[]) => {
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

  const localPawnState: HeroPawn = { // TODO currently unused
    heroName: heroName as heroName, // TODO: unnecessary? 
    color, // TODO remove, can use values straight from DB
    height: spaceSize,
    width: spaceSize,
    weapon: weapon as heroWeapon, 
  }

  const dbPawnState: DBHeroPawn = {
    ...pawnDefaultValues,
    color,
    position: startPosition || [],
    gridPosition: [8, 8],
  }

  return {
    pawn: localPawnState, // TODO unused
    dbPawn: dbPawnState
  }
}



// type Action = 
//               // {type: 'playerHeld', value: number | null, color: heroColor} | 
//               {
//                 type: 'showActions',
//                 blockedPositions: BlockedPositions,
//                 playerDirections: direction[],
//                 escalatorSpaces: Escalator[],
//                 teleporterSpaces: heroColor | null,
//                 color: heroColor | null
//               } | 
//               {type: 'addBlockedPositions', value: BlockedPositions, color: heroColor} | undefined;
// export type Dispatch = (action: Action) => void;
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

  switch (action.type) {
    case 'showActions': 
      console.log('show actions', {newState, action})
      // newState[action.color as keyof PawnState].blockedPositions = action.blockedPositions;
      // newState[action.color as keyof PawnState].showMovableDirections = action.playerDirections;
      // newState[action.color as keyof PawnState].showTeleportSpaces = action.teleporterSpaces;
      // newState[action.color as keyof PawnState].showEscalatorSpaces = action.escalatorSpaces;
      return newState;
    case 'addBlockedPositions': 
      // newState[action.color as keyof PawnState].blockedPositions = action.value;
      return newState;
    default: 
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

const PawnProvider = ({children}: PawnProviderProps) => {
  const [pawnState, pawnDispatch] = useReducer(pawnReducer, pawnsInitialState);

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