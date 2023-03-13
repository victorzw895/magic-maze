import { useEffect, useState, useMemo } from 'react';
import { usePlayerState } from '../Contexts/PlayerContext';
import { DBPlayer, Room } from '../types';

const usePlayer = (room: Room): [DBPlayer[], DBPlayer, boolean] => {
  const playerState = usePlayerState();
  // Players array should be firestore real time values, only updated by firestore changes
  const [players, setPlayers] = useState<DBPlayer[]>([{} as DBPlayer]);
  // player object should be local
  const [currentPlayer, setCurrentPlayer] = useState<DBPlayer>({} as DBPlayer);

  const [allPlayersReady, setAllPlayersReady] = useState<boolean>(false);

  useEffect(() => {
    if (room.players.length === 0) return;
    if (room.playersReady.length === room.players.length) setAllPlayersReady(true);
  }, [room.playersReady.length])

  useEffect(() => {
    setPlayers(room.players);

    const updatedPlayer = room.players.find(dbPlayer => dbPlayer.id === playerState?.id)
    if (!updatedPlayer) return;

    updateCurrentPlayer(updatedPlayer);
  }, [room.players.length, room.updateAbilitiesCount, playerState?.id])

  const updateCurrentPlayer = (player?: DBPlayer) => {
    if (!currentPlayer.number && !player) return;
  
    setCurrentPlayer(player || {} as DBPlayer)
  }

  return [players, currentPlayer, allPlayersReady];
};

export default usePlayer;