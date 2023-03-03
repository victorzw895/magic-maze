import { DocumentReference } from "firebase/firestore"; 

export type heroColor = "yellow" | "purple" | "green" | "orange"
export type heroName = "Barbarian" | "Mage" | "Elf" | "Dwarf"
export type heroWeapon = "sword" | "vial" | "bow" | "axe"
export type heroAbility = "disableSecurityCamera" | "revealExtraTile" | "weCanTalkAgain" | "iAmTiny"

export type playerNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type direction = "up" | "right" | "down" | "left"
export type basicAbility = "explore" | "teleport" | "escalator"



export interface SandTimer {
  timeLimit: number,
  pause: boolean,
  flip: () => void,
  swapActions: () => void
}

export interface Game {
  roomId: string,
  timerRunning: boolean
  minutesLeft: number,
  secondsLeft: number,
  gameOver: boolean,
  docRef: DocumentReference<any> | null,
  // weaponsStolen: heroColor[],
  // heroesEscaped: heroColor[]
  // players: Player[],
  gameStarted: boolean
  gamePaused: boolean
}

export interface Escalator {
  position: number[] | null,
  gridPosition: number[] | null,
  escalatorName: string | null
}

export interface Player {
  number: playerNumber,  // TODO remove, can use values straight from DB
}


type BlockedPosition = {
  position: number[] | null;
  gridPosition: number[] | null;
}

export type BlockedPositions = {
  up: BlockedPosition,
  down: BlockedPosition,
  left: BlockedPosition,
  right: BlockedPosition
}

export interface HeroPawn {
  heroName: heroName,
  color: heroColor,
  weapon: heroWeapon,
  width: number,
  height: number,
}

// DB Types ///////////////////////////////////////////

// export interface SandTimer {
//   timeLimit: number,
//   pause: boolean,
//   flip: () => void,
//   swapActions: () => void
// }

export interface DBPawns {
  green: DBHeroPawn,
  yellow: DBHeroPawn,
  orange: DBHeroPawn,
  purple: DBHeroPawn,
}

export interface Room {
  // timerRunning: boolean
  // minutesLeft: number,
  gameOver: boolean,
  gameWon: boolean,
  gamePaused: boolean,
  gameStarted: boolean,
  timeLeft: number,
  weaponsStolen: heroColor[],
  heroesEscaped: heroColor[],
  players: DBPlayer[],
  host: playerNumber,
  tiles: DBTile[],
  pawns: DBPawns,
  pings: playerNumber[], // ?? add debouncer or throttle, or batch update/consume from firestore
  createdDate: Date,
  createdDateInSeconds: number
}


export interface DBPlayer extends Player {
  name: string,
  // pinged: boolean,
  playerDirections: direction[],
  playerAbilities: basicAbility[],
}

interface HeroPawnState<T> extends PawnActions {
  color: T,
  playerHeld: playerNumber | null,
  position: number[],
  gridPosition: number[],
  ability: string,
  canUseAbility: boolean,
}

export interface DBHeroPawn extends HeroPawnState<heroColor> {}

export interface PlayerHeldPawn extends HeroPawnState<heroColor | null> {}

export interface PawnActions {
  blockedPositions: BlockedPositions,
  showMovableDirections: direction[],
  showTeleportSpaces: heroColor | null,
  showEscalatorSpaces: Escalator[],
}

export interface DBTile {
  id: string,
  gridPosition: number[],
  spaces: {
    0: Space[],
    1: Space[],
    2: Space[],
    3: Space[]
  },
  rotation?: number,
  placementDirection?: direction,
  entryDirection?: direction,
  entrySide?: direction
}

export type SpaceTypeName = "timer" | "teleporter" | "exploration" | "special" | "weapon" | "exit" | "blank" | "barrier"

export interface Space {
  type: SpaceTypeName,
  details?: (SpaceDetails | TimerSpace | TeleporterSpace | ExplorationSpace | SpecialSpace | WeaponSpace | ExitSpace),
}

interface SpaceDetails {
  // isOccupied?: boolean,
  sideWalls?: direction[],
  hasEscalator?: boolean,
  escalatorName?: string,
  isEntry?: boolean
}

export interface TimerSpace extends SpaceDetails {
  isDisabled: boolean
}

export interface TeleporterSpace extends SpaceDetails {
  color: heroColor,
}

export interface ExplorationSpace extends SpaceDetails {
  color: heroColor,
  hasLoudspeaker: boolean,
  exploreDirection: direction
}

interface SpecialSpace extends SpaceDetails {
  specialAbility: heroAbility,
}

export interface WeaponSpace extends SpaceDetails {
  name: heroWeapon,
  weaponStolen: boolean,
  color: heroColor
}

export interface ExitSpace extends SpaceDetails {
  color: heroColor
}
