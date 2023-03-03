import { useEffect, useState } from 'react';
import { Room, playerNumber } from '../types';

const useRoomHost = (room: Room): [playerNumber | null] => {
    const [roomHost, setRoomHost] = useState<playerNumber | null>(null);

    useEffect(() => {
        setRoomHost(room.host)
    }, [room.host])

    return [roomHost];
};

export default useRoomHost;