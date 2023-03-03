import { Timestamp } from 'firebase/firestore';
import { useEffect } from 'react';
import { useGame } from '../Contexts/GameContext';
import { setDoc, useDocData } from "../utils/useFirestore"; 

const PurgeGame = (roomCode: string ): void => {
    const { gameState, gameDispatch } = useGame();
    const [room] = useDocData(gameState.roomId);

    useEffect(() => {
        const currentTime = Timestamp.now()
        const deleteTime = currentTime.toMillis() + 24 * 60 * 60 * 1000; // add 24 hours in milli
        const deleteTimeStamp = new Timestamp(deleteTime/1000,0);

        setDoc(room, {
            deleteAt: deleteTimeStamp
        })
        
        console.log("set deleting time")
    })
}


export default PurgeGame;