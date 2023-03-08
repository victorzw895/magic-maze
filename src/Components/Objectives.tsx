import React, { useEffect } from 'react';
import { roomDefaultValues } from '../constants';
import { useWeaponsStolenDocState, useHeroesEscapedDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const Objectives = () => {
  const { assets } = useAssets();
  const weaponsStolen = useWeaponsStolenDocState();
  const heroesEscaped = useHeroesEscapedDocState();

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
                src={assets[`exit-${color}.png`]} 
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
                src={assets[`objective-${color}.png`]} 
                alt={`objective-${color}`} 
              />
            )
          })
      }
    </div>
  )
}

export default Objectives;