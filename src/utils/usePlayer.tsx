import { Dispatch, useEffect, SetStateAction, useState } from 'react';
import { DBPlayer, Room } from '../types';

const usePlayer = (room: Room): [DBPlayer[], Dispatch<SetStateAction<DBPlayer[]>>, DBPlayer, Dispatch<SetStateAction<DBPlayer>>, boolean] => {
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  const [player, setPlayer] = useState<DBPlayer>({} as DBPlayer);
  const [pinged, setPinged] = useState(false);

  // useEffect(() => {
  //   console.log('setPinged from fiestore context', player.pinged)
  //   setPinged(player.pinged);
  // }, [room.players])

  useEffect(() => {
    if (room.pings.length && room.pings.includes(player.number)) {
      setPinged(true);
    }
    else {
      setPinged(false);
    }
  }, [room.pings])

  return [players, setPlayers, player, setPlayer, pinged];
};

export default usePlayer;