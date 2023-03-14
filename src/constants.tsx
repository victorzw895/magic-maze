import { BlockedPositions, heroColor, Room } from './types';
import { Timestamp } from 'firebase/firestore';

export const pngAssets = [
  'down',
  'up',
  'left',
  'right',
  'emergency-exit',
  'escalator',
  'explore',
  'explore-disabled',
  'hour-glass',
  'teleport-disabled',
  'teleport',
  'bell',
  'bell-shake',
  'exit-green',
  'exit-yellow',
  'exit-purple',
  'exit-orange',
  'objective-green',
  'objective-yellow',
  'objective-purple',
  'objective-orange',
  'steal',
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
  gridPosition: [8, 8],
  ability: '',
  canUseAbility: false,
  blockedPositions: getDefaultBlockedPositions(),
  onWeapon: false,
  showMovableDirections: [],
  showTeleportSpaces: null,
  showEscalatorSpaces: [],
}

export const roomDefaultValues: Room = {
  playersReady: [],
  players: [],
  updateAbilitiesCount: 0,
  host: 1,
  pings: [],
  loadBoard: false,
  gameStarted: false,
  gamePaused: false,
  gameOver: false,
  gameWon: false,
  weaponsStolen: false,
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
  createdDateInSeconds: Timestamp.fromDate(new Date()).toMillis(),
  createdDate: new Date()
}
