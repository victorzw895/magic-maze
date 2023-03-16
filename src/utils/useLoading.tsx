import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Room } from '../types';
import { updateDoc } from '../utils/useFirestore';
import { arrayUnion } from 'firebase/firestore';
import { useAssets } from '../Contexts/AssetsContext';
import { usePlayerState } from '../Contexts/PlayerContext';
import { downloadAssets } from '../utils/useFirestore';
import after from 'lodash/after';

const useLoading = 
  (room: Room, roomId: string): 
  [
    roomLoaded: boolean, 
    loadBoard: boolean, 
    onPawnsLoaded: () => void, 
    onObjectivesLoaded: () => void, 
    ...rest: Dispatch<SetStateAction<boolean>>[]
  ] => {
  const playerState = usePlayerState();
  const [loadBoard, setLoadBoard] = useState(false);
  const [tileLoaded, setTileLoaded] = useState<boolean>(false);
  const [pawnsLoaded, setPawnsLoaded] = useState<boolean>(false);
  const [objectivesLoaded, setObjectivesLoaded] = useState<boolean>(false);
  const [abilitiesLoaded, setAbilitiesLoaded] = useState<boolean>(false);
  const [pingLoaded, setPingLoaded] = useState<boolean>(false);
  const [roomLoaded, setRoomLoaded] = useState(false);
  const { setAssets } = useAssets();

  const onPawnsLoaded = after(4, () => setPawnsLoaded(true));
  const onObjectivesLoaded = after(4, () => setObjectivesLoaded(true));

  useEffect(() => {
    (async () => {
      if (!room.loadBoard) return;
      
      setLoadBoard(room.loadBoard);
      const assets = await downloadAssets();
      setAssets(assets);
    })()
  }, [room.loadBoard]);

  useEffect(() => {
    (async () => {
      if (!tileLoaded || !pawnsLoaded || !objectivesLoaded || !abilitiesLoaded) return;
      if (room.players.length > 1 && !pingLoaded) return;
      
      await updateDoc(roomId, 
        { 
          playersReady: arrayUnion(playerState?.id),
        }
      )
      setRoomLoaded(true)
    })()
  }, [tileLoaded, pawnsLoaded, objectivesLoaded, abilitiesLoaded, pingLoaded])

  return [roomLoaded, loadBoard, onPawnsLoaded, onObjectivesLoaded, setTileLoaded, setAbilitiesLoaded, setPingLoaded];
};

export default useLoading;
