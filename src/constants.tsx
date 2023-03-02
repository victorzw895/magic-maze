import { BlockedPositions, heroColor, Room } from './types';

export const jpgAssets = ['objective_a', 'objective_b'];
export const pngAssets = [
  'down',
  'up',
  'left',
  'right',
  'emergency-exit',
  'escalator',
  'explore',
  'hour-glass',
  'teleport-disabled',
  'teleport',
]

export const svgAssets = [
  'green-pawn',
  'yellow-pawn',
  'purple-pawn',
  'orange-pawn',
]

export const tileWallSize: number = 14;
export const spaceSize: number = 46.25;

export const pawnStartPositions = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2]
]


export const getDefaultBlockedPositions = (): BlockedPositions => {
  return {
    up: {
      position: null,
      gridPosition: null
    },
    left: {
      position: null,
      gridPosition: null
    },
    right: {
      position: null,
      gridPosition: null
    },
    down: {
      position: null,
      gridPosition: null
    }
  }
}

export const pawnDefaultValues = {
  playerHeld: null,
  position: [],
  gridPosition: [],
  ability: '',
  canUseAbility: false,
  blockedPositions: getDefaultBlockedPositions(),
  showMovableDirections: [],
  showTeleportSpaces: null,
  showEscalatorSpaces: [],
}

export const roomDefaultValues: Room = {
  players: [],
  host: 1,
  pings: [],
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
  gameWon: false,
  weaponsStolen: [],
  heroesEscaped: [],
  timeLeft: 200,
  tiles: [],
  pawns: {
    green: {
      ...pawnDefaultValues,
      color: "green",
    },
    yellow: {
      ...pawnDefaultValues,
      color: "yellow",
    },
    orange: {
      ...pawnDefaultValues,
      color: "orange",
    },
    purple: {
      ...pawnDefaultValues,
      color: "purple",
    }
  },
  createdDate: new Date()
}
