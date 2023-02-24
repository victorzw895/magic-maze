import React, { useRef, createContext, useContext, useEffect, Dispatch, SetStateAction, useState, useMemo } from 'react';
import { DBPlayer, DBHeroPawn, Room, RoomKeys } from '../types';
import { useGame } from '../Contexts/GameContext';
import { useDocData } from '../utils/useFirestore';
import useGamePaused from '../utils/useGamePaused';
import useTiles from '../utils/useTiles';
import usePlayer from '../utils/usePlayer';
import usePawns from '../utils/usePawns';
import { roomDefaultValues } from '../constants';

// type Action = {type: 'update', value: string} | undefined;
// type Dispatch = (action: Action) => void;

type DBProviderProps = {children: React.ReactNode}



type RoomValue = ReturnType<typeof useRoomValue>;

const FirestoreContext = createContext<RoomValue | null>(null);
const GameStartedDocContext = createContext<any>(undefined);
const GamePausedDocContext = createContext<any>(undefined);
const PlayerHeldPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const GreenPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const YellowPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const PurplePawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const OrangePawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const TilesDocContext = createContext<any>(undefined);
const PlayerDocContext = createContext<{ player: DBPlayer, setPlayer: Dispatch<SetStateAction<DBPlayer>>} | undefined>(undefined);

const FirestoreProvider = ({children}: DBProviderProps) => {
  const { gameState } = useGame();
  const [room] = useDocData(gameState.roomId);

  // remove
  const [gameStarted, setGameStarted] = useState(false);
  const [heroesEscaped, setHeroesEscaped] = useState([]);
  const [weaponsStolen, setWeaponsStolen] = useState([]);
  
  const [gamePaused] = useGamePaused(room);
  // ^ remove

  const [tiles] = useTiles(room);

  const [player, setPlayer, pinged] = usePlayer(room);
  const pawns = usePawns(room);
  const {green, yellow, purple, orange, playerHeldPawn} = pawns;

  useEffect(() => {
    setGameStarted(room.gameStarted)
  }, [room.gameStarted]);

  const playerProviderValue = useMemo(() => { // TODO figure out why need useMemo???
    return {player, setPlayer}
  }, [player]);

  const roomRef = useRoomValue(room);

  return (
    
    <FirestoreContext.Provider value={roomRef}>
      <GameStartedDocContext.Provider value={gameStarted}>
        <GamePausedDocContext.Provider value={gamePaused}>
          <TilesDocContext.Provider value={tiles}>
            <PlayerDocContext.Provider value={playerProviderValue}>
              <GreenPawnDocContext.Provider value={green}>
              <YellowPawnDocContext.Provider value={yellow}>
              <PurplePawnDocContext.Provider value={purple}>
              <OrangePawnDocContext.Provider value={orange}>
                <PlayerHeldPawnDocContext.Provider value={playerHeldPawn}>
                  {children}
                </PlayerHeldPawnDocContext.Provider>
              </OrangePawnDocContext.Provider>
              </PurplePawnDocContext.Provider>
              </YellowPawnDocContext.Provider>
              </GreenPawnDocContext.Provider>
            </PlayerDocContext.Provider>
          </TilesDocContext.Provider>
        </GamePausedDocContext.Provider>
      </GameStartedDocContext.Provider>
    </FirestoreContext.Provider>
  )
}

const subscribers = new Set<(value: Room) => void>();

const useRoomValue = (initialValue: Room) => {
  const stateRef = useRef(initialValue);

  const setState = (newName: Partial<Room>) => {
    stateRef.current = { ...stateRef.current, ...newName };
    subscribers.forEach((listener) => {
      listener(stateRef.current);
    });
  };

  const getState = () => stateRef.current;

  const subscribe = (listener: (value: Room) => void) => {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
  };

  return { getState, setState, subscribe };
};

const useFirestore = <T,>(
  selector: (state: Room) => T,
  dependencies?: (state: Room) => any[] // TODO fix type
): [T] => {
  const context = useContext(FirestoreContext);

  if (!context) {
    throw new Error('useFirestore must be used within a FirestoreContext');
  }

  const [localState, setLocalState] = useState(selector(context.getState()));

  useEffect(() => {
    context.subscribe((value) => setLocalState(selector(value)));
  }, dependencies ? [...dependencies(context.getState())] : [selector(context.getState())]);

  return [localState];
}

const useGameStartedDocState = () => {
  const context = useContext(GameStartedDocContext)
  if (context === undefined) {
    throw new Error('useGameStartedDocState must be used within a GameStartedDocContext');
  }
  return context;
}

const useGamePausedDocState = () => {
  const context = useContext(GamePausedDocContext)
  if (context === undefined) {
    throw new Error('useGamePausedDocState must be used within a GamePausedDocContext');
  }
  return context;
}

const useGreenDocState = () => {
  const context = useContext(GreenPawnDocContext)
  if (context === undefined) {
    throw new Error('useGreenDocState must be used within a GreenPawnDocContext');
  }
  return context;
}

const useYellowDocState = () => {
  const context = useContext(YellowPawnDocContext)
  if (context === undefined) {
    throw new Error('useYellowDocState must be used within a YellowPawnDocContext');
  }
  return context;
}

const usePurpleDocState = () => {
  const context = useContext(PurplePawnDocContext)
  if (context === undefined) {
    throw new Error('usePurpleDocState must be used within a PurplePawnDocContext');
  }
  return context;
}

const useOrangeDocState = () => {
  const context = useContext(OrangePawnDocContext)
  if (context === undefined) {
    throw new Error('useOrangeDocState must be used within a OrangePawnDocContext');
  }
  return context;
}

const usePlayerHeldPawnDocState = () => {
  const context = useContext(PlayerHeldPawnDocContext)
  if (context === undefined) {
    throw new Error('usePlayerHeldPawnDocState must be used within a PlayerHeldPawnDocContext');
  }
  return context;
}

const useTilesDocState = () => {
  const context = useContext(TilesDocContext)
  if (context === undefined) {
    throw new Error('useTilesDocState must be used within a TilesDocContext');
  }
  return context;
}
const usePlayerDocState = () => {
  const context = useContext(PlayerDocContext)
  if (context === undefined) {
    throw new Error('usePlayerDocState must be used within a PlayerDocContext');
  }
  return context;
}

export { 
  FirestoreProvider,
  useGameStartedDocState,
  useGamePausedDocState,
  useGreenDocState,
  useYellowDocState,
  usePurpleDocState,
  useOrangeDocState,
  useTilesDocState,
  usePlayerDocState,
  usePlayerHeldPawnDocState,
  useFirestore,
};