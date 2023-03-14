import { roomDefaultValues } from '../constants';
import { useWeaponsStolenDocState, useHeroesEscapedDocState, useLoadingDocState } from '../Contexts/FirestoreContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc } from '../utils/useFirestore';
import { useAssets } from '../Contexts/AssetsContext';
import { useAudio } from '../Contexts/AudioContext';
import after from 'lodash/after';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const Objectives = () => {
  const { gameState } = useGame();
  const { assets } = useAssets();
  const { setObjectivesLoaded } = useLoadingDocState();
  const { weaponsStolen, onWeapons } = useWeaponsStolenDocState();
  const heroesEscaped = useHeroesEscapedDocState();
  const { playAchievementSound } = useAudio();

  const onImagesLoaded = after(objectives.length, () => setObjectivesLoaded(true));

  const stealWeaponsHandler = async () => {
    await setDoc(gameState.roomId, {
      weaponsStolen: true,
    })
    playAchievementSound();
  }

  return (
    <div className='objectives'>
      {
        weaponsStolen ?
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
          onWeapons.length < 4 ?
            objectives.map(color => {
              return (
                <img 
                  onLoad={() => onImagesLoaded()}
                  className={`objective ${onWeapons.includes(color) ? ' on-weapon' : ''}`}
                  key={`objective-${color}`}
                  draggable={false}
                  src={assets[`objective-${color}.png`]} 
                  alt={`objective-${color}`} 
                />
              )
            })
              :
            <img 
              onClick={weaponsStolen ? () => {} : stealWeaponsHandler}
              className={`objective steal`}
              key={`steal-weapons`}
              draggable={false}
              src={assets['steal.png']} 
              alt={`steal-weapons`} 
            />
      }
    </div>
  )
}

export default Objectives;