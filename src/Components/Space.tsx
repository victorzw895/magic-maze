import { useEffect, useState, memo } from 'react';
import { useGame } from '../Contexts/GameContext';
import { usePlayer } from '../Contexts/PlayerContext';
import { heroColor, TeleporterSpace, Escalator, TimerSpace, WeaponSpace, ExitSpace, Space as SpaceType } from '../types';
import { setDoc, doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../Firestore";

interface SpaceProps {
  spaceData: SpaceType,
  showMovableArea: boolean,
  spacePosition: number[],
  colorSelected: heroColor | null,
  gridPosition: number[],
  highlightTeleporter: heroColor | null,
  highlightEscalator: Escalator[],
  tileIndex: number
}

const areEqual = (prevProps: SpaceProps, nextProps: SpaceProps) => {
  if (prevProps.colorSelected !== nextProps.colorSelected) {
    if (prevProps.showMovableArea !== nextProps.showMovableArea) {
      // console.log("************************ showMovableArea")
      return false
    }
  }
  if (prevProps.highlightTeleporter !== nextProps.highlightTeleporter) {
    if (nextProps.spaceData.type === "teleporter") {
      // console.log("************************ highlightTeleporter")
      return false
    }
  }
  if (prevProps.highlightEscalator !== nextProps.highlightEscalator) {
    if (nextProps.spaceData.details?.hasEscalator) {
      // console.log("************************ highlightEscalator")
      return false
    }
  }

  
  // console.log("would have rendered Space")
  return true
}


const Space = memo(({spaceData, showMovableArea, spacePosition, colorSelected, gridPosition, highlightTeleporter, highlightEscalator, tileIndex}: SpaceProps) => {
  const { gameState, gameDispatch } = useGame();
  const { playerDispatch } = usePlayer();

  const gamesRef = firestore.collection('games')

  const isTeleporter = spaceData.type === "teleporter";
  const teleporterColor = isTeleporter ? (spaceData.details as TeleporterSpace).color : "";

  const isEscalator = spaceData.details?.hasEscalator;
  const escalatorName = isEscalator ? spaceData.details?.escalatorName : "";

  const isTimer = spaceData.type === "timer";

  const hasWeapon = spaceData.type === "weapon";

  const isExit = spaceData.type === "exit";

  const [showTeleport, setShowTeleport] = useState(false)
  const [showEscalator, setShowEscalator] = useState(false);

  // BUG: NEED TO FINE TUNE teleport and escalator
  useEffect(() => {
    (async () => {
      if (!isTeleporter) return;
      if (highlightTeleporter === teleporterColor) {
        let isOccupied = false;
        const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
        if (docSnap.exists()) {
          isOccupied = Object.values(docSnap.data().pawns).some((pawn: any) => {
            if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
              if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
                return true;
              }
            }
            return false
          })
        }
        console.log(docSnap.exists())
        console.log(spacePosition, gridPosition, isOccupied)
        setShowTeleport(!isOccupied)
      }
      else {
        setShowTeleport(false)
      }
    })()
  }, [highlightTeleporter])


  useEffect(() => {
    (async () => {
      if (!isEscalator) return;
      // console.log("should only be for spaces that are escalators", spaceData)
      if (highlightEscalator.length) {
        const escalator = highlightEscalator.find(escalator => escalator.escalatorName === escalatorName);
        if (escalator && escalator.gridPosition && escalator.position && escalator.escalatorName) {
          if (escalator.gridPosition[0] === gridPosition[0] && escalator.gridPosition[1] === gridPosition[1]) {
            if (escalator.position[0] !== spacePosition[0] || escalator.position[1] !== spacePosition[1]) {
              if (escalator.escalatorName === escalatorName) {
                let isOccupied = false;
                const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
                if (docSnap.exists()) {
                  isOccupied = Object.values(docSnap.data().pawns).some((pawn: any) => {
                    if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
                      if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
                        return true;
                      }
                    }
                    return false
                  })
                }
                setShowEscalator(!isOccupied)
              }
            }
          }
        }
      }
      else {
        setShowEscalator(false)
      }
    })()
  }, [highlightEscalator])

  // add into movePawn click, if space is timer, pause timer!
  const movePawn = async () => {
    const docSnap = await getDoc(doc(gamesRef, gameState.roomId));

    if (docSnap.exists()) {
      const newRoomValue = {...docSnap.data()}

      if (newRoomValue && newRoomValue.pawns) {
        if (!colorSelected) return;
        newRoomValue.pawns[colorSelected].position = spacePosition;
        newRoomValue.pawns[colorSelected].gridPosition = gridPosition;
        newRoomValue.pawns[colorSelected].playerHeld = null;
        newRoomValue.pawns[colorSelected].blockedPositions = {
          up: {position: null, gridPosition: null},
          down: {position: null, gridPosition: null},
          right: {position: null, gridPosition: null},
          left: {position: null, gridPosition: null},
        };
        if (isTimer && !(spaceData.details as TimerSpace).isDisabled) {
          // pause and update db with pause
          console.log('Stepping on timer', spaceData.details, gameState.timerRunning)
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.isDisabled = true;
          newRoomValue.gamePaused = true;
        }

        if (hasWeapon && !(spaceData.details as WeaponSpace).weaponStolen && (spaceData.details as WeaponSpace).color === colorSelected) {
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.weaponStolen = true;
          newRoomValue.weaponsStolen = [...newRoomValue.weaponsStolen, colorSelected]
        }

        if (isExit && !(spaceData.details as ExitSpace).color && (spaceData.details as ExitSpace).color === colorSelected) {
          if (newRoomValue.weaponsStolen.length === 4) {
            newRoomValue.heroesEscaped = [...newRoomValue.heroesEscaped, colorSelected]
          }
        }

        await setDoc(
          gamesRef.doc(gameState.roomId), 
          {
            gamePaused: newRoomValue.gamePaused,
            pawns: newRoomValue.pawns, 
            tiles: newRoomValue.tiles,
            weaponsStolen: newRoomValue.weaponsStolen,
            heroesEscaped: newRoomValue.heroesEscaped
          },
          {merge: true}
        )
        playerDispatch({type: "showMovableSpaces", value: []})
        playerDispatch({type: "showTeleportSpaces", color: null})
        playerDispatch({type: "showEscalatorSpaces", value: []})
      }
    }
  }

  // const isTeleporterOccupied = async () => {
  //   const docSnap = await getDoc(doc(gamesRef, gameState.roomId));
  //   let spaceOccupied = false;

  //   if (docSnap.exists()) {
  //     Object.values(docSnap.data().pawns).some((pawn: any) => {
  //       if (pawn.gridPosition[0] === gridPosition[0] && pawn.gridPosition[1] === gridPosition[1]) {
  //         if (pawn.position[0] === spacePosition[0] && pawn.position[1] === spacePosition[1]) {
  //           return true;
  //         }
  //       }
  //       return false;
  //     })
  //   }
  //   return spaceOccupied;
  // }

  return (
    <div 
      className={`space ${showMovableArea ? "active" : ""} ${showTeleport ? "teleporter" : ""} ${showEscalator ? "escalator" : ""}`}
      onClick={showMovableArea || showTeleport || showEscalator ? movePawn : () => {}}
    >
      <div className={teleporterColor}></div>
      {/* {console.log("re rendering space")} */}
    </div>
  )
}, areEqual)

export default Space