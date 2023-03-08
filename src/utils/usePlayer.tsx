import { useMemo, Dispatch, useEffect, SetStateAction, useState } from 'react';
import { usePlayerState, usePlayerDispatch } from '../Contexts/PlayerContext';
import { DBPlayer, Room } from '../types';

const usePlayer = (room: Room): [DBPlayer[], DBPlayer, boolean] => {
  // const playerDispatch = usePlayerDispatch();
  const playerState = usePlayerState();
  // Players array should be firestore real time values, only updated by firestore changes
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  // player object should be local
  const [currentPlayer, setCurrentPlayer] = useState<DBPlayer>({} as DBPlayer);

  const [allPlayersReady, setAllPlayersReady] = useState<boolean>(false);

  useEffect(() => {
    if (room.playersReady.length === room.players.length) setAllPlayersReady(true);
  }, [room.playersReady.length])

  useEffect(() => {
    setPlayers(room.players);
  }, [room.players.length])

  useEffect(() => {
    const player = room.players.find(dbPlayer => dbPlayer.id === playerState?.id)
    
    if (!currentPlayer.number && !player) {
        return;
    }
    console.log('useEffect usePlayer', {
      roomPlayers: room.players,
      players: players,
      player,
      currentPlayer
    })
  
    setCurrentPlayer(player || {} as DBPlayer)
  }, [room.players])

  useEffect(() => {
    console.log('room Players', room.players)
  }, [room.players])

  return [players, currentPlayer, allPlayersReady];
};

export default usePlayer;