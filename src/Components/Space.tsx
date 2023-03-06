import { useEffect, useState, memo } from 'react';
import { useGame } from '../Contexts/GameContext';
import { heroColor, Escalator, SpaceTypeName } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';

import achievementSound from '../assets/achievement.mp3'; // download file from firestore storage instead
import teleporterSound from '../assets/teleporter.mp3'; // download file from firestore storage instead
import exitSound from '../assets/exit.mp3'; // download file from firestore storage instead
import selectSound from '../assets/select.mp3'; // download file from firestore storage instead
import winSound from '../assets/win.wav'; // download file from firestore storage instead

const playWin = () => {
  const audio = new Audio(winSound);
  audio.play();
}

const playSelect = () => {
  const audio = new Audio(selectSound);
  audio.play();
}

const playTeleporter = () => {
  const audio = new Audio(teleporterSound);
  audio.play();
}

const playExit = () => {
  const audio = new Audio(exitSound);
  audio.play();
}

const playAchievement = () => {
  const audio = new Audio(achievementSound);
  audio.play();
}

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
  disableTeleporter: boolean,
  highlightEscalator: Escalator[],
  tileIndex: number,
}

const areEqual = (prevProps: SpaceProps, nextProps: SpaceProps) => {
  return isEqual(prevProps, nextProps);
}


const Space = memo(({
  spaceType,
  spaceColor,
  spaceHasEscalator,
  spaceEscalatorName,
  spaceIsDisabled,
  spaceWeaponStolen,
  showMovableArea,
  spacePosition,
  colorSelected,
  gridPosition,
  highlightTeleporter,
  disableTeleporter,
  highlightEscalator,
  tileIndex
}: SpaceProps) => {
  
  // console.log('Re-render space', {
  //   spaceType,
  //   spaceColor,
  //   spaceHasEscalator,
  //   spaceEscalatorName,
  //   spaceIsDisabled,
  //   spaceWeaponStolen,
  //   showMovableArea,
  //   spacePosition,
  //   colorSelected,
  //   gridPosition,
  //   highlightTeleporter,
  //   highlightEscalator,
  //   tileIndex
  // });
  const { gameState } = useGame();
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
      if (disableTeleporter) {
        setShowTeleport(false);
        return;
      }
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
  }, [highlightTeleporter, colorSelected, disableTeleporter])


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
        newRoomValue.pawns[colorSelected].showEscalatorSpaces = [];
        newRoomValue.pawns[colorSelected].showMovableDirections = [];
        newRoomValue.pawns[colorSelected].showTeleportSpaces = null;
        newRoomValue.pawns[colorSelected].blockedPositions = {
          up: {position: null, gridPosition: null},
          down: {position: null, gridPosition: null},
          right: {position: null, gridPosition: null},
          left: {position: null, gridPosition: null},
        };
        if (isTeleporter && showTeleport) {
          // playWarp();
          playTeleporter();
        }
        else if (isTimer && !spaceIsDisabled) {
          // pause and update db with pause
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.isDisabled = true;
          newRoomValue.gamePaused = true;
        }
        // Might not require weaponStolen boolean on space, weaponStolen array may be enough
        else if (hasWeapon && !spaceWeaponStolen && spaceColor === colorSelected) {
          playAchievement();
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.weaponStolen = true;
          newRoomValue.weaponsStolen = [...newRoomValue.weaponsStolen, colorSelected]
        }
        else if (isExit && spaceColor === colorSelected) {
          if (newRoomValue.weaponsStolen.length === 4 && !newRoomValue.heroesEscaped.includes(colorSelected)) {
            newRoomValue.heroesEscaped = [...newRoomValue.heroesEscaped, colorSelected]
            playExit();
            // if last exit, celebration soundtrack
            if (newRoomValue.heroesEscaped.length === 4) {
              playWin();
              await setDoc(gameState.roomId, {
                gameOver: true,
                gameWon: true,
              })
            }
          }
        }
        else {
          playSelect();
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
      }
    }
  }


  return (
    <div 
      className={`space${showMovableArea ? " active" : ""}${showTeleport ? " teleporter" : ""}${showEscalator ? " escalator" : ""}${showEscalator ? " escalator" : ""}${disableTeleporter ? " disabled-teleporter" : ""}`}
      onClick={showMovableArea || showTeleport || showEscalator ? movePawn : () => {}}
       // TODO: disable if game paused
    >
      <div className={`${teleporterColor}${showTeleport? ' circle-multiple' : ''}`}>
        {
          showTeleport ?
            <>
              <div className={`circle ${teleporterColor}`}></div>
              <div className={`circle ${teleporterColor}`}></div>
              <div className={`circle ${teleporterColor}`}></div>  
            </>
              :
            <></>
        }
      </div>
    </div>
  )
}, areEqual)

export default Space