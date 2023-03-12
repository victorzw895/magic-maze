import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { Room } from '../types';
import { setDoc } from '../utils/useFirestore';
import { useAssets } from '../Contexts/AssetsContext';
import { downloadAssets } from '../utils/useFirestore';
import after from 'lodash/after';

const useLoading = (room: Room, roomId: string): [roomLoaded: boolean, loadBoard: boolean, onPawnsLoaded: () => void, ...rest: Dispatch<SetStateAction<boolean>>[]] => {
  const [loadBoard, setLoadBoard] = useState(false);
  const [tileLoaded, setTileLoaded] = useState<boolean>(false);
  const [pawnsLoaded, setPawnsLoaded] = useState<boolean>(false);
  const [objectivesLoaded, setObjectivesLoaded] = useState<boolean>(false);
  const [abilitiesLoaded, setAbilitiesLoaded] = useState<boolean>(false);
  const [pingLoaded, setPingLoaded] = useState<boolean>(false);
  const [roomLoaded, setRoomLoaded] = useState(false);
  const { setAssets } = useAssets();

  const onPawnsLoaded = after(4, () => setPawnsLoaded(true));

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
      console.log('should set room loaded to true', {tileLoaded, pawnsLoaded, objectivesLoaded, abilitiesLoaded, pingLoaded})
      if (!tileLoaded || !pawnsLoaded || !objectivesLoaded || !abilitiesLoaded) return;
      if (room.players.length > 1 && !pingLoaded) return;
      
      await setDoc(roomId, 
        { 
          playersReady: room.playersReady + 1,
        }
      )
      setRoomLoaded(true)
    })()
  }, [tileLoaded, pawnsLoaded, objectivesLoaded, abilitiesLoaded, pingLoaded])

  return [roomLoaded, loadBoard, onPawnsLoaded, setTileLoaded, setObjectivesLoaded, setAbilitiesLoaded, setPingLoaded];
};

export default useLoading;
