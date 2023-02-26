import React, { useEffect } from 'react';
import { roomDefaultValues } from '../constants';
import { useWeaponsStolenDocState, useHeroesEscapedDocState } from '../Contexts/FirestoreContext';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const Objectives = () => {
  const weaponsStolen = useWeaponsStolenDocState();
  const heroesEscaped = useHeroesEscapedDocState();
  console.log('heroesEscaped', heroesEscaped)

  return (
    <div className='objectives'>
      {
        weaponsStolen.length === 4 ?
          objectives.map(color => {
            return (
              <img 
                className={`exit ${color}${heroesEscaped.includes(color) ? ' escaped' : ''}`}
                key={`exit-${color}`}
                draggable={false}
                src={`/exit-${color}.png`} 
                alt={`exit-${color}`} 
              />
            )
          })
            :
          objectives.map(color => {
            return (
              <img 
                className={`objective ${color}${weaponsStolen.includes(color) ? ' stolen' : ''}`}
                key={`objective-${color}`}
                draggable={false}
                src={`/objective-${color}.png`} 
                alt={`objective-${color}`} 
              />
            )
          })
      }
    </div>
  )
}

export default Objectives;