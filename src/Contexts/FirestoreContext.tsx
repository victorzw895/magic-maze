import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { DBPlayer, DBHeroPawn, PlayerHeldPawn, heroColor, DBTile } from '../types';
import { useGame } from '../Contexts/GameContext';
import { useDocData } from '../utils/useFirestore';
import useGamePaused from '../utils/useGamePaused';
import useTiles from '../utils/useTiles';
import usePlayer from '../utils/usePlayer';
import usePawns from '../utils/usePawns';
import useLoading from '../utils/useLoading';

type DBProviderProps = {children: React.ReactNode}

const LoadingDocContext = createContext<any>(undefined);
const GameStartedDocContext = createContext<boolean>(false);
const GamePausedDocContext = createContext<boolean>(false);
const GameOverDocContext = createContext<boolean>(false);
const GameWonDocContext = createContext<boolean>(false);
const WeaponsStolenDocContext = createContext<{
  weaponsStolen: boolean,
  onWeapons: heroColor[],
} | undefined>(undefined);
const HeroesEscapedDocContext = createContext<heroColor[]>([]);
const PlayerHeldPawnDocContext = createContext<PlayerHeldPawn>({} as PlayerHeldPawn);
const GreenPawnDocContext = createContext<DBHeroPawn | undefined>(undefined);
const YellowPawnDocContext = createContext<DBHeroPawn | undefined>(undefined);
const PurplePawnDocContext = createContext<DBHeroPawn | undefined>(undefined);
const OrangePawnDocContext = createContext<DBHeroPawn | undefined>(undefined);
const TilesDocContext = createContext<DBTile[] | undefined>(undefined);
const PlayersDocContext = createContext<DBPlayer[] | undefined>(undefined);
const CurrentPlayerDocContext = createContext<DBPlayer | undefined>(undefined);
const PingedDocContext = createContext<boolean>(false);
const SandTimerContext = createContext<number>(0);

const FirestoreProvider = ({children}: DBProviderProps) => {
  const { gameState } = useGame();
  const [room] = useDocData(gameState.roomId);

  const [gameStarted, setGameStarted] = useState(false);
  const [heroesEscaped, setHeroesEscaped] = useState([]);
  const [weaponsStolen, setWeaponsStolen] = useState(false);
  const [gamePaused, gameOver, gameWon] = useGamePaused(room);
  const [roomLoaded, loadBoard, onPawnsLoaded, onObjectivesLoaded, setTileLoaded, setAbilitiesLoaded, setPingLoaded] = useLoading(room, gameState.roomId);
  const [tiles, flipSandTimerCount] = useTiles(room);
  const [players, currentPlayer, allPlayersReady] = usePlayer(room);
  const pawns = usePawns(room, gameState.roomId);
  const {green, yellow, purple, orange, playerHeldPawn, onWeapons} = pawns;
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
  }, [room.weaponsStolen])

  useEffect(() => {
    setHeroesEscaped(room.heroesEscaped)
  }, [room.heroesEscaped.length])

  useEffect(() => {
    setGameStarted(room.gameStarted)
  }, [room.gameStarted]);

  const loadingProviderValue = useMemo(() => {
    return {loadBoard, roomLoaded, allPlayersReady, onPawnsLoaded, onObjectivesLoaded, setTileLoaded, setAbilitiesLoaded, setPingLoaded}
  }, [loadBoard, roomLoaded, allPlayersReady])

  return (
    <LoadingDocContext.Provider value={loadingProviderValue}>
    <GameStartedDocContext.Provider value={gameStarted}>
      <SandTimerContext.Provider value={flipSandTimerCount}>
      <GamePausedDocContext.Provider value={gamePaused}>
      <GameOverDocContext.Provider value={gameOver}>
      <GameWonDocContext.Provider value={gameWon}>
        <TilesDocContext.Provider value={tiles}>
          <PlayersDocContext.Provider value={players}>
            <CurrentPlayerDocContext.Provider value={currentPlayer}>
            <GreenPawnDocContext.Provider value={green}>
            <YellowPawnDocContext.Provider value={yellow}>
            <PurplePawnDocContext.Provider value={purple}>
            <OrangePawnDocContext.Provider value={orange}>
              <PlayerHeldPawnDocContext.Provider value={playerHeldPawn}>
                <WeaponsStolenDocContext.Provider value={{weaponsStolen, onWeapons}}>
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
            </CurrentPlayerDocContext.Provider>
          </PlayersDocContext.Provider>
        </TilesDocContext.Provider>
      </GameWonDocContext.Provider>
      </GameOverDocContext.Provider>
      </GamePausedDocContext.Provider>
      </SandTimerContext.Provider>
    </GameStartedDocContext.Provider>
    </LoadingDocContext.Provider>
  )
}


const useLoadingDocState = () => {
  const context = useContext(LoadingDocContext)
  if (context === undefined) {
    throw new Error('useLoadingDocState must be used within a LoadingDocContext');
  }
  return context;
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

const usePlayersDocState = () => {
  const context = useContext(PlayersDocContext)
  if (context === undefined) {
    throw new Error('usePlayersDocState must be used within a PlayersDocContext');
  }
  return context;
}

const useCurrentPlayerDocState = () => {
  const context = useContext(CurrentPlayerDocContext)
  if (context === undefined) {
    throw new Error('useCurrentPlayerDocState must be used within a CurrentPlayerDocContext');
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

const useSandTimerState = () => {
  const context = useContext(SandTimerContext)
  if (context === undefined) {
    throw new Error('useSandTimerState must be used within a SandTimerContext');
  }
  return context;
}

export { 
  FirestoreProvider,
  useLoadingDocState,
  useGameStartedDocState,
  useGamePausedDocState,
  useGreenDocState,
  useYellowDocState,
  usePurpleDocState,
  useOrangeDocState,
  useTilesDocState,
  usePlayersDocState,
  useCurrentPlayerDocState,
  usePlayerHeldPawnDocState,
  useWeaponsStolenDocState,
  useHeroesEscapedDocState,
  usePingedDocState,
  useGameOverDocState,
  useGameWonDocState,
  useSandTimerState
};