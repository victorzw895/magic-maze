import { useEffect, useState, memo } from 'react';
import { useGame } from '../Contexts/GameContext';
// import { usePlayerDispatch } from '../Contexts/PlayerContext';
import { heroColor, Escalator, SpaceTypeName } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { Dispatch } from '../Contexts/PlayerContext';

interface SpaceProps {
  spaceType: SpaceTypeName,
  spaceColor: heroColor | undefined,
  spaceHasEscalator: boolean | undefined,
  spaceEscalatorName: string | undefined,
  spaceIsDisabled: boolean | undefined,
  spaceWeaponStolen: boolean | undefined,
  showMovableArea: boolean,
  spacePosition: number[],
  colorSelected: heroColor | null,
  gridPosition: number[],
  highlightTeleporter: heroColor | null,
  highlightEscalator: Escalator[],
  tileIndex: number,
  playerDispatch: Dispatch
}

const areEqual = (prevProps: SpaceProps, nextProps: SpaceProps) => {
  // const {spaceData, showMovableArea, spacePosition, colorSelected, gridPosition, highlightTeleporter, highlightEscalator, tileIndex} = prevProps;
  // const {nextSpaceData, nextShowMovableArea, nextSpacePosition, nextColorSelected, nextGridPosition, nextHighlightTeleporter, nextHighlightEscalator, nextTileIndex} = nextProps;
  // if (!isEqual(prevProps.spaceData, nextProps.spaceData)) {
  //   return false
  // }
  // if (!isEqual(prevProps.spacePosition, nextProps.spacePosition)) {
  //   return false
  // }
  // if (prevProps.showMovableArea !== nextProps.showMovableArea) {
  //   return false
  // }
  // if (prevProps.highlightTeleporter !== nextProps.highlightTeleporter) {
  //     return false
  // }
  // if (!isEqual(prevProps.highlightEscalator, nextProps.highlightEscalator)) {
  //     return false
  // }
  // if (prevProps.colorSelected !== nextProps.colorSelected) {
  //     return false
  // }
  // console.count('Space re-render');
  // return true
  // console.log(prevProps, nextProps, isEqual(prevProps, nextProps))
  return isEqual(prevProps, nextProps);
}


const Space = memo(({spaceType, spaceColor, spaceHasEscalator, spaceEscalatorName, spaceIsDisabled, spaceWeaponStolen, showMovableArea, spacePosition, colorSelected, gridPosition, highlightTeleporter, highlightEscalator, tileIndex, playerDispatch}: SpaceProps) => {
  console.count('Re-render space');
  console.log('Space render', {spaceType, spaceColor, spaceHasEscalator, spaceEscalatorName, spaceIsDisabled, spaceWeaponStolen, showMovableArea, spacePosition, colorSelected, gridPosition, highlightTeleporter, highlightEscalator, tileIndex, playerDispatch})
  const { gameState } = useGame();
  // const playerDispatch = usePlayerDispatch(); // TODO this causing re-render

  const isTeleporter = spaceType === "teleporter";
  const teleporterColor = isTeleporter ? spaceColor : "";

  const isEscalator = spaceHasEscalator;
  const escalatorName = isEscalator ? spaceEscalatorName : "";

  const isTimer = spaceType === "timer";

  const hasWeapon = spaceType === "weapon";

  const isExit = spaceType === "exit";

  const [showTeleport, setShowTeleport] = useState(false)
  const [showEscalator, setShowEscalator] = useState(false);

  // BUG: NEED TO FINE TUNE teleport and escalator
  useEffect(() => {
    (async () => {
      if (!isTeleporter) return;
      if (highlightTeleporter === teleporterColor) {
        let isOccupied = false;
        const docSnap = await getDoc(gameState.roomId);
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
        setShowTeleport(!!colorSelected && !isOccupied)
      }
      else {
        setShowTeleport(false)
      }
    })()
  }, [highlightTeleporter, colorSelected])


  useEffect(() => {
    (async () => {
      if (!isEscalator) return;
      if (highlightEscalator.length) {
        const escalator = highlightEscalator.find(escalator => escalator.escalatorName === escalatorName);
        if (escalator && escalator.gridPosition && escalator.position && escalator.escalatorName) {
          if (escalator.gridPosition[0] === gridPosition[0] && escalator.gridPosition[1] === gridPosition[1]) {
            if (escalator.position[0] !== spacePosition[0] || escalator.position[1] !== spacePosition[1]) {
              if (escalator.escalatorName === escalatorName) {
                let isOccupied = false;
                const docSnap = await getDoc(gameState.roomId);
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
                setShowEscalator(!!colorSelected && !isOccupied)
              }
            }
          }
        }
      }
      else {
        setShowEscalator(false)
      }
    })()
  }, [highlightEscalator, colorSelected])

  // add into movePawn click, if space is timer, pause timer!
  const movePawn = async () => {
    const docSnap = await getDoc(gameState.roomId);

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
        if (isTimer && !spaceIsDisabled) {
          // pause and update db with pause
          // console.log('Stepping on timer', spaceData.details, gameState.timerRunning)
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.isDisabled = true;
          newRoomValue.gamePaused = true;
        }

        if (hasWeapon && !spaceWeaponStolen && spaceColor === colorSelected) {
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.weaponStolen = true;
          newRoomValue.weaponsStolen = [...newRoomValue.weaponsStolen, colorSelected]
        }

        if (isExit && !spaceColor && spaceColor === colorSelected) {
          if (newRoomValue.weaponsStolen.length === 4) {
            newRoomValue.heroesEscaped = [...newRoomValue.heroesEscaped, colorSelected]
          }
        }

        await setDoc(
          gameState.roomId, 
          {
            gamePaused: newRoomValue.gamePaused,
            pawns: newRoomValue.pawns, 
            tiles: newRoomValue.tiles,
            weaponsStolen: newRoomValue.weaponsStolen,
            heroesEscaped: newRoomValue.heroesEscaped
          },
        )
        playerDispatch({type: "showMovableSpaces", value: []})
        playerDispatch({type: "showTeleportSpaces", color: null})
        playerDispatch({type: "showEscalatorSpaces", value: []})
      }
    }
  }


  return (
    <div 
      className={`space${showMovableArea ? " active" : ""}${showTeleport ? " teleporter" : ""}${showEscalator ? " escalator" : ""}`}
      onClick={showMovableArea || showTeleport || showEscalator ? movePawn : () => {}}
       // TODO: disable if game paused
    >
      <div className={teleporterColor}></div>
      {/* {console.log("re rendering space")} */}
    </div>
  )
}, areEqual)

export default Space