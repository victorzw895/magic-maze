import { Dispatch, useEffect, SetStateAction, useState } from 'react';
import { DBPlayer, Room } from '../types';

const usePlayer = (): [DBPlayer[], Dispatch<SetStateAction<DBPlayer[]>>, DBPlayer, Dispatch<SetStateAction<DBPlayer>>] => {
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  const [player, setPlayer] = useState<DBPlayer>({} as DBPlayer);

  return [players, setPlayers, player, setPlayer];
};

export default usePlayer;