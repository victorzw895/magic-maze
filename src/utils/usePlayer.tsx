import { useMemo, Dispatch, useEffect, SetStateAction, useState } from 'react';
import { usePlayerState, usePlayerDispatch } from '../Contexts/PlayerContext';
import { DBPlayer, Room } from '../types';

const usePlayer = (room: Room): [DBPlayer[], DBPlayer] => {
  // const playerDispatch = usePlayerDispatch();
  const playerState = usePlayerState();
  // Players array should be firestore real time values, only updated by firestore changes
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  // player object should be local
  const [currentPlayer, setCurrentPlayer] = useState<DBPlayer>({} as DBPlayer);

  useEffect(() => {
    // TODO not working correctly
    console.log('room players update useEffect', room.players)
    setPlayers(room.players);

    const currentPlayer = players.find(dbPlayer => dbPlayer.id === playerState?.id)
    if (!currentPlayer) return;
    setCurrentPlayer(currentPlayer)
  }, [room.players.length, playerState])

  // useEffect(() => {
  //   const currentPlayer = players.find(dbPlayer => dbPlayer.id === playerState?.id)
  //   if (!currentPlayer) return;
  //   setCurrentPlayer(currentPlayer)
  // }, [players])

  return [players, currentPlayer];
};

export default usePlayer;