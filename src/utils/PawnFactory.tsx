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

  const dbPawnState: DBHeroPawn = {
    ...pawnDefaultValues,
    color,
    position: startPosition || [],
    gridPosition: [8, 8],
  }

  return dbPawnState
}

export type DBPawnState = {
  yellow: DBHeroPawn,
  green: DBHeroPawn,
  purple: DBHeroPawn,
  orange: DBHeroPawn,
}

export const pawnDBInitialState: DBPawnState = {
  yellow: PawnFactory("yellow", takePosition()),
  green: PawnFactory("green", takePosition()),
  purple: PawnFactory("purple", takePosition()),
  orange: PawnFactory("orange", takePosition()),
}
