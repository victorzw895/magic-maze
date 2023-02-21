import React, { Dispatch, useEffect, SetStateAction, useState, ReactNode } from 'react';
import { ExplorationSpace, DBTile, DBHeroPawn, DBPlayer, Room } from '../types';
import { getDoc } from './useFirestore';
import { usePlayerDispatch, usePlayerState } from '../Contexts/PlayerContext';
import isEqual from 'lodash/isEqual';

const useGamePaused = (room: Room): [DBPlayer, Dispatch<SetStateAction<DBPlayer>>, boolean] => {
  // const playerState = usePlayerState();
  const [player, setPlayer] = useState<DBPlayer>({} as DBPlayer);
  const [pinged, setPinged] = useState(false);

  useEffect(() => {
    console.log('setPinged from fiestore context', player.pinged)
    setPinged(player.pinged);
  }, [player.pinged])

  return [player, setPlayer, pinged];
};

export default useGamePaused;