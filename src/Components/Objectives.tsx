import { roomDefaultValues } from '../constants';
import { useWeaponsStolenDocState, useHeroesEscapedDocState, useLoadingDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';
import after from 'lodash/after';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const Objectives = () => {
  const { assets } = useAssets();
  const { setObjectivesLoaded } = useLoadingDocState();
  const weaponsStolen = useWeaponsStolenDocState();
  const heroesEscaped = useHeroesEscapedDocState();

  const onImagesLoaded = after(objectives.length, () => setObjectivesLoaded(true));

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
                onLoad={() => onImagesLoaded()}
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