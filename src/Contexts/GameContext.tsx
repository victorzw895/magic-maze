import React, { createContext, useContext, useReducer } from 'react';
import { Game, Player, playerNumber, direction, basicAbility } from '../types';
import { DBPlayer } from '../firestore-types';

type Action = {type: 'joinRoom', value: String} | 
              {type: 'toggleTimer', value: boolean} | 
              {type: 'timeLeft', minutes: number, seconds: number} | 
              {type: 'gameOver'} | 
              // {type: 'joinRoom', value: Game, playerName: string} | 
              {type: 'startGame'} | undefined;
type Dispatch = (action: Action) => void;

type GameProviderProps = {children: React.ReactNode}

const gameInitialState: Game = {
  roomId: "",
  // players: [],
  // gameStarted: false
  timerRunning: false,
  minutesLeft: 3,
  secondsLeft: 20,
  gameOver: false,
  // weaponsStolen: [],
  // heroesEscaped: []
}

const directions: direction[] = ["up", "right", "down", "left"];
const secondSetDirections: direction[] = ["left", "right", "down", "up"];
const players3Set = [["up", "right"], "down", "left"];
const abilities: basicAbility[] = ["escalator", "explore", "teleport"];

const randomize = (array: any[]) => {
  return array.sort(() => {
    return 0.5 - Math.random();
  })
}

export const assignRandomActions = (players: DBPlayer[]) => {
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
      // newState.players.push(PlayerFactory(0, action.playerName))
      return newState;
    }
    case 'joinRoom': {
      newState.roomId = action.value;
      // newState.players.push(PlayerFactory(newState.players.length, action.playerName))
      return newState;
    }
    case 'startGame': {
      // newState.players = assignRandomActions(newState.players);
      newState.timerRunning = true;
      return newState;
    }
    case 'timeLeft': {
      console.log("update time left")
      newState.minutesLeft = action.minutes;
      newState.secondsLeft = action.seconds;
      // newState.players.push(PlayerFactory(newState.players.length, action.playerName))
      return newState;
    }
    case 'toggleTimer': {
      newState.timerRunning = action.value;
      // newState.players.push(PlayerFactory(newState.players.length, action.playerName))
      return newState;
    }
    case 'gameOver': {
      // newState.players = assignRandomActions(newState.players);
      // newState.timerRunning = false;
      newState.minutesLeft = 0;
      newState.secondsLeft = 0;
      newState.gameOver = true;
      return newState;
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