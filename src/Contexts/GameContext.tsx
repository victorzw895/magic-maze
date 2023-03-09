import React, { createContext, useContext, useReducer } from 'react';
import { Game, direction, basicAbility, DBPlayer } from '../types';

type Action = {type: 'joinRoom', value: String} | // USED
              {type: 'toggleTimer', value: boolean} | 
              {type: 'timeLeft', minutes: number, seconds: number} | 
              {type: 'gameOver'} |  // USED
              {type: 'startGame'} | // USED
              {type: 'exitRoom'} | undefined;
type Dispatch = (action: Action) => void;

type GameProviderProps = {children: React.ReactNode}

const gameInitialState: Game = {
  // roomId: "PKHRP",
  roomId: "",
  gameStarted: false, // TODO remove, can use values straight from DB
  gamePaused: false, // TODO remove, can use values straight from DB
  timerRunning: false, // TODO maybe not necessary
  minutesLeft: 3,
  secondsLeft: 20,
  gameOver: false,
  // weaponsStolen: [],
  // heroesEscaped: []
}

// Set up player actions according to rule book
const directions: direction[] = ["up", "right", "down", "left"];
const secondSetDirections: direction[] = ["left", "right", "down", "up"];
const players3Set = [["up", "right"], "down", "left"];
const abilities: basicAbility[] = ["escalator", "explore", "teleport"];

const randomize = (array: any[]) => {
  return array.sort(() => {
    return 0.5 - Math.random();
  })
}

export const assignRandomActions = (players: DBPlayer[]): DBPlayer[] => {
  const randomPlayerOrder = randomize(players);
  
  return randomPlayerOrder.map(player => {
    if (randomPlayerOrder.length < 4) {
      if (randomPlayerOrder.length === 3) {
        player.playerDirections.push(...players3Set.splice(0, 1).flat(1))
        if (player.playerDirections.includes("left")) {
          player.playerAbilities.push("teleport")
        }
        else if (player.playerDirections.includes("down")) {
          player.playerAbilities.push(...["explore", "escalator"])
        }
      }
      else if (randomPlayerOrder.length === 2) {
        player.playerDirections.push(...directions.splice(0, 2))
        if (player.playerDirections.includes("up")) {
          player.playerAbilities.push("teleport")
        }
        else if (player.playerDirections.includes("down")) {
          player.playerAbilities.push(...["explore", "escalator"])
        }
      }
      else {
        player.playerDirections.push(...directions);
        player.playerAbilities.push(...abilities)
      }
    }
    else if (directions.length) {
      player.playerDirections.push(...directions.splice(0, 1))

      if (player.playerDirections.includes("left")) {
        player.playerAbilities.push("teleport")
      }
      else if (player.playerDirections.includes("down")) {
        player.playerAbilities.push("explore")
      }
      else if (player.playerDirections.includes("right")) {
        player.playerAbilities.push("escalator")
      }
    }
    else {
      player.playerDirections.push(...secondSetDirections.splice(0, 1))
    }
    return player
  })  
}

const GameContext = createContext<{gameState: Game; gameDispatch: Dispatch} | undefined>(undefined);

const gameReducer = (gameState: Game, action: any) => {
  let newState = {...gameState};

  switch (action.type) {
    case 'createRoom': {
      // TESTING MORE PLAYERS
      // const players: Player[] = [
      //   {
      //     name: "victor",
      //     number: 1,
      //     playerDirections: [],
      //     playerPawnHeld: null,
      //     playerAbilities: [],
      //     pingPlayer: null,
      //   },
      //   {
      //     name: "bob",
      //     number: 2,
      //     playerDirections: [],
      //     playerPawnHeld: null,
      //     playerAbilities: [],
      //     pingPlayer: null,
      //   },
      //   {
      //     name: "Yue",
      //     number: 3,
      //     playerDirections: [],
      //     playerPawnHeld: null,
      //     playerAbilities: [],
      //     pingPlayer: null,
      //   },
      // ]
      // newState.players = players;
      newState.roomId = action.value;
      return newState;
    }
    case 'joinRoom': {
      newState.roomId = action.value;
      return newState;
    }
    case 'play': {
      newState.timerRunning = true;
      return newState;
    }
    case 'startGame': {
      newState.gameStarted = true;
      return newState;
    }
    case 'timeLeft': {
      newState.minutesLeft = action.minutes;
      newState.secondsLeft = action.seconds;
      return newState;
    }
    case 'toggleTimer': {
      newState.timerRunning = action.value;
      newState.gamePaused = !newState.gamePaused;
      return newState;
    }
    case 'gameOver': {
      newState.minutesLeft = 0;
      newState.secondsLeft = 0;
      newState.gameOver = true;
      return newState;
    }
    case 'exitRoom': {
      newState.roomId = ""
      return newState
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

const GameProvider = ({children}: GameProviderProps) => {

  const [gameState, gameDispatch] = useReducer(gameReducer, gameInitialState);
  const value = {gameState, gameDispatch};

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

const useGame = () => {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { GameProvider, useGame };