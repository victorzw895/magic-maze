import React, { createContext, useContext, useEffect, Dispatch, SetStateAction, useState, useMemo } from 'react';
import { DBPlayer, DBHeroPawn } from '../types';
import { useGame } from '../Contexts/GameContext';
import { useDocData } from '../utils/useFirestore';
import useGamePaused from '../utils/useGamePaused';
import useTiles from '../utils/useTiles';
import usePlayer from '../utils/usePlayer';
import usePawns from '../utils/usePawns';

// type Action = {type: 'update', value: string} | undefined;
// type Dispatch = (action: Action) => void;

type DBProviderProps = {children: React.ReactNode}


const GameStartedDocContext = createContext<any>(undefined);
const GamePausedDocContext = createContext<boolean>(false);
const GameOverDocContext = createContext<boolean>(false);
const GameWonDocContext = createContext<boolean>(false);
const WeaponsStolenDocContext = createContext<any>(undefined);
const HeroesEscapedDocContext = createContext<any>(undefined);
const PlayerHeldPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const GreenPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const YellowPawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const PurplePawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const OrangePawnDocContext = createContext<DBHeroPawn>({} as DBHeroPawn);
const TilesDocContext = createContext<any>(undefined);
const PlayerDocContext = createContext<{ 
  players: DBPlayer[],
  currentPlayer: DBPlayer
} | undefined>(undefined);
const PingedDocContext = createContext<boolean>(false);

const FirestoreProvider = ({children}: DBProviderProps) => {
  const { gameState } = useGame();
  const [room] = useDocData(gameState.roomId);

  const [gameStarted, setGameStarted] = useState(false);
  const [heroesEscaped, setHeroesEscaped] = useState([]);
  const [weaponsStolen, setWeaponsStolen] = useState([]);
  
  const [gamePaused, gameOver, gameWon] = useGamePaused(room);
  const [tiles] = useTiles(room);
  const [players, currentPlayer] = usePlayer(room);
  const pawns = usePawns(room, gameState.roomId);
  const {green, yellow, purple, orange, playerHeldPawn} = pawns;

  const [pinged, setPinged] = useState(false);

  useEffect(() => {
    if (room.pings.length && room.pings.includes(currentPlayer.number)) {
      setPinged(true);
    }
    else {
      setPinged(false);
    }
  }, [room.pings])

  useEffect(() => {
    setWeaponsStolen(room.weaponsStolen)
  }, [room.weaponsStolen.length])

  useEffect(() => {
    setHeroesEscaped(room.heroesEscaped)
  }, [room.heroesEscaped.length])

  useEffect(() => {
    setGameStarted(room.gameStarted)
  }, [room.gameStarted]);

  const playerProviderValue = useMemo(() => { // TODO figure out why need useMemo???
    return {players, currentPlayer}
  }, [currentPlayer, players]);

  return (
    <GameStartedDocContext.Provider value={gameStarted}>
      <GamePausedDocContext.Provider value={gamePaused}>
      <GameOverDocContext.Provider value={gameOver}>
      <GameWonDocContext.Provider value={gameWon}>
        <TilesDocContext.Provider value={tiles}>
          <PlayerDocContext.Provider value={playerProviderValue}>
            <GreenPawnDocContext.Provider value={green}>
            <YellowPawnDocContext.Provider value={yellow}>
            <PurplePawnDocContext.Provider value={purple}>
            <OrangePawnDocContext.Provider value={orange}>
              <PlayerHeldPawnDocContext.Provider value={playerHeldPawn}>
                <WeaponsStolenDocContext.Provider value={weaponsStolen}>
                  <HeroesEscapedDocContext.Provider value={heroesEscaped}>
                    <PingedDocContext.Provider value={pinged}>
                      {children}
                    </PingedDocContext.Provider>
                  </HeroesEscapedDocContext.Provider>
                </WeaponsStolenDocContext.Provider>
              </PlayerHeldPawnDocContext.Provider>
            </OrangePawnDocContext.Provider>
            </PurplePawnDocContext.Provider>
            </YellowPawnDocContext.Provider>
            </GreenPawnDocContext.Provider>
          </PlayerDocContext.Provider>
        </TilesDocContext.Provider>
      </GameWonDocContext.Provider>
      </GameOverDocContext.Provider>
      </GamePausedDocContext.Provider>
    </GameStartedDocContext.Provider>
  )
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

const useGameOverDocState = () => {
  const context = useContext(GameOverDocContext)
  if (context === undefined) {
    throw new Error('useGameOverDocState must be used within a GameOverDocContext');
  }
  return context;
}

const useGameWonDocState = () => {
  const context = useContext(GameWonDocContext)
  if (context === undefined) {
    throw new Error('useGameWonDocState must be used within a GameWonDocContext');
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

const useWeaponsStolenDocState = () => {
  const context = useContext(WeaponsStolenDocContext)
  if (context === undefined) {
    throw new Error('useWeaponsStolenDocState must be used within a WeaponsStolenDocContext');
  }
  return context;
}

const useHeroesEscapedDocState = () => {
  const context = useContext(HeroesEscapedDocContext)
  if (context === undefined) {
    throw new Error('useHeroesEscapedDocState must be used within a HeroesEscapedDocContext');
  }
  return context;
}

const usePingedDocState = () => {
  const context = useContext(PingedDocContext)
  if (context === undefined) {
    throw new Error('usePingedDocState must be used within a PingedDocContext');
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
  useWeaponsStolenDocState,
  useHeroesEscapedDocState,
  usePingedDocState,
  useGameOverDocState,
  useGameWonDocState,
};