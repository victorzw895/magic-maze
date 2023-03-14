import { roomDefaultValues } from '../constants';
import { useHeroesEscapedDocState } from '../Contexts/FirestoreContext';
import { useAssets } from '../Contexts/AssetsContext';

const objectives = Object.values(roomDefaultValues.pawns).map((pawn) => pawn.color);

const Escape = () => {
  const { assets } = useAssets();
  const heroesEscaped = useHeroesEscapedDocState();

  return (
    <>
      <img 
        key={'teleport-disabled'}
        draggable={false}
        src={assets['teleport-disabled.png']}
        alt={'teleport-disabled'} 
        title={'teleport-disabled'}
        style={{
          width: '80px',
          margin: '0 10px',
          transform: 'scaleX(-1)'
        }}
      />
      {
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
      }
    </>
  )
}

export default Escape;