import React, { createContext, useContext, useReducer } from 'react';
import { Game, direction, basicAbility, DBPlayer } from '../types';

type Action = {type: 'joinRoom', value: string} |
              {type: 'exitRoom'};
type Dispatch = (action: Action) => void;

type GameProviderProps = {children: React.ReactNode}

const gameInitialState: Game = {
  roomId: "",
}

const randomize = (array: any[]) => {
  return array.sort(() => {
    return 0.5 - Math.random();
  })
}

export const assignRandomActions = (players: DBPlayer[]): DBPlayer[] => {
  // Set up player actions according to rule book
  const directions: direction[] = ["up", "right", "down", "left"];
  const secondSetDirections: direction[] = ["left", "right", "down", "up"];
  const players3Set = [["up", "right"], "down", "left"];
  const abilities: basicAbility[] = ["escalator", "explore", "teleport"];
  
  const randomPlayerOrder = randomize(players);
  
  return randomPlayerOrder.map(player => {
    console.log('player before reset', player)
    player.playerDirections = [];
    player.playerAbilities = [];
    console.log('player after reset', player)
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
    console.log('player after assigning actions', player)
    return player
  })  
}

const GameContext = createContext<{gameState: Game; gameDispatch: Dispatch} | undefined>(undefined);

const gameReducer = (gameState: Game, action: Action) => {
  let newState = {...gameState};

  switch (action.type) {
    case 'joinRoom': {
      newState.roomId = action.value;
      return newState;
    }
    case 'exitRoom': {
      newState.roomId = ""
      return newState
    }
    default: {
      throw new Error(`Unhandled action type`)
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