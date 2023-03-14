import { useWeaponsStolenDocState } from '../Contexts/FirestoreContext';
import Escape from './Escape';
import StealWeapons from './StealWeapons';

const Objectives = () => {
  const { weaponsStolen } = useWeaponsStolenDocState();

  return (
    <div className='objectives'>
      {
        !weaponsStolen ?
          <StealWeapons />
            :
          <Escape />
      }
    </div>
  )
}

export default Objectives;