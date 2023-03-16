import { roomDefaultValues } from '../constants';
import { useWeaponsStolenDocState, useLoadingDocState } from '../Contexts/FirestoreContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc } from '../utils/useFirestore';
import { useAssets } from '../Contexts/AssetsContext';
import { useAudio } from '../Contexts/AudioContext';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const StealWeapons = () => {
  const { gameState } = useGame();
  const { assets } = useAssets();
  const { onObjectivesLoaded } = useLoadingDocState();
  const { onWeapons } = useWeaponsStolenDocState();
  const { playAchievementSound } = useAudio();

  const stealWeaponsHandler = async () => {
    await setDoc(gameState.roomId, {
      weaponsStolen: true,
    })
    playAchievementSound();
  }

  return (
    <>
      {
        onWeapons.length < 4 ?
          objectives.map(color => {
            return (
              <img 
                onLoad={() => onObjectivesLoaded()}
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
            onClick={stealWeaponsHandler}
            className={`objective steal`}
            key={`steal-weapons`}
            draggable={false}
            src={assets['steal.png']} 
            alt={`steal-weapons`} 
          />
      }
    </>
  )
}

export default StealWeapons;