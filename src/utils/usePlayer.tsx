import { Dispatch, useEffect, SetStateAction, useState } from 'react';
import { DBPlayer, Room } from '../types';

const useGamePaused = (room: Room): [DBPlayer, Dispatch<SetStateAction<DBPlayer>>, boolean] => {
  const [player, setPlayer] = useState<DBPlayer>({} as DBPlayer);
  const [pinged, setPinged] = useState(false);

  useEffect(() => {
    // TODO need to get pinged from room value
    console.log('setPinged from fiestore context', player.pinged)
    setPinged(player.pinged);
  }, [player.pinged])

  return [player, setPlayer, pinged];
};

export default useGamePaused;