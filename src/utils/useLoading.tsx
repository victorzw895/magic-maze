import { useEffect, useState } from 'react';
import { Room } from '../types';
import { setDoc } from '../utils/useFirestore';
import { useAssets } from '../Contexts/AssetsContext';
import { downloadAssets } from '../utils/useFirestore';

const useLoading = (room: Room, roomId: string): [boolean, boolean] => {
  const [loadBoard, setLoadBoard] = useState(false);
  const [roomLoaded, setRoomLoaded] = useState(false);
  const { setAssets } = useAssets();

  useEffect(() => {
    (async () => {
      if (!room.loadBoard) return;
      
      setLoadBoard(room.loadBoard);
      const assets = await downloadAssets();
      setAssets(assets);

      await setDoc(roomId, 
        { 
          playersReady: room.playersReady + 1,
        }
      )
      setRoomLoaded(true)
    })()
  }, [room.loadBoard]);

  return [roomLoaded, loadBoard];
};

export default useLoading;
