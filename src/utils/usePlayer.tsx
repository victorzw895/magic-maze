import { Dispatch, useEffect, SetStateAction, useState } from 'react';
import { usePlayerState, usePlayerDispatch } from '../Contexts/PlayerContext';
import { DBPlayer, Room } from '../types';

const usePlayer = (room: Room): [DBPlayer[], DBPlayer, Dispatch<SetStateAction<DBPlayer>>] => {
  // const playerDispatch = usePlayerDispatch();
  const playerState = usePlayerState();
  // Players array should be firestore real time values, only updated by firestore changes
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  // player object should be local
  const [player, setPlayer] = useState<DBPlayer>({} as DBPlayer);


  useEffect(() => {
    // TODO not working correctly
    console.log('room players update useEffect', room.players)
    setPlayers(room.players);
  }, [room.players])

  useEffect(() => {
    const currentPlayer = players.find(dbPlayer => dbPlayer.id === playerState?.id)
    if (!currentPlayer) return;
    setPlayer(currentPlayer)
  }, [players])

  return [players, player, setPlayer];
};

export default usePlayer;