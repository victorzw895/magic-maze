import { useEffect, useState, memo } from 'react';
import { useGame } from '../Contexts/GameContext';
import { heroColor, Escalator, SpaceTypeName, DBPlayer, basicAbility, direction, DBHeroPawn } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import { useAudio } from '../Contexts/AudioContext';
import { ImCross } from 'react-icons/im'

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
  const { playSelectSound, playTeleporterSound, playExitSound, playWinSound } = useAudio();

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
          isOccupied = Object.values(docSnap.data().pawns as DBHeroPawn[]).some((pawn) => {
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
                  isOccupied = Object.values(docSnap.data().pawns as DBHeroPawn[]).some((pawn) => {
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
      const playersArray = newRoomValue.players

      if (newRoomValue && newRoomValue.pawns) {
        if (!colorSelected) return;
        newRoomValue.pawns[colorSelected].position = spacePosition;
        newRoomValue.pawns[colorSelected].gridPosition = gridPosition;
        newRoomValue.pawns[colorSelected].playerHeld = null;
        newRoomValue.pawns[colorSelected].showEscalatorSpaces = [];
        newRoomValue.pawns[colorSelected].showMovableDirections = [];
        newRoomValue.pawns[colorSelected].showTeleportSpaces = null;
        newRoomValue.pawns[colorSelected].onWeapon = false;
        newRoomValue.pawns[colorSelected].blockedPositions = {
          up: {position: null, gridPosition: null},
          down: {position: null, gridPosition: null},
          right: {position: null, gridPosition: null},
          left: {position: null, gridPosition: null},
        };
        if (isTeleporter && showTeleport) {
          playTeleporterSound();
        }
        else if (isTimer && !spaceIsDisabled) {
          // pause and update db with pause
          newRoomValue.tiles[tileIndex].spaces[spacePosition[1]][spacePosition[0]].details.isDisabled = true;
          newRoomValue.timerDisabledCount++ // I want the flipSandTimer to be a count
          rotateAbilities(playersArray, newRoomValue.updateAbilitiesCount)
        }
        // Might not require weaponStolen boolean on space, weaponStolen array may be enough
        else if (hasWeapon && !spaceWeaponStolen && spaceColor === colorSelected) {
          newRoomValue.pawns[colorSelected].onWeapon = true;
        }
        else if (isExit && spaceColor === colorSelected) {
          if (newRoomValue.weaponsStolen && !newRoomValue.heroesEscaped.includes(colorSelected)) {
            newRoomValue.heroesEscaped = [...newRoomValue.heroesEscaped, colorSelected]
            playExitSound();
            // if last exit, celebration soundtrack
            if (newRoomValue.heroesEscaped.length === 4) {
              playWinSound();
              await setDoc(gameState.roomId, {
                gameOver: true,
                gameWon: true,
              })
            }
          }
        } else {
          playSelectSound();
        }

        await setDoc(
          gameState.roomId, 
          {
            pawns: newRoomValue.pawns, 
            tiles: newRoomValue.tiles,
            weaponsStolen: newRoomValue.weaponsStolen,
            heroesEscaped: newRoomValue.heroesEscaped,
            timerDisabledCount: newRoomValue.timerDisabledCount
          },
        )
      }
    }
  }

  const rotateArray = (array: any[] ) => {
    const newArray = array.slice(1);
    newArray.push(array[0]);
    return newArray;
  }

  const rotateAbilities = async (players: DBPlayer[], count: number) => {

    if (players.length === 1) return;
    else {
      const updatedPlayers = [...players]
      const abilitiesArray = players.map(player => player.playerAbilities);
      const directionsArray = players.map(player => player.playerDirections);

      const rotatedAbilitiesArray = rotateArray(abilitiesArray);
      const rotatedDirectionsArray = rotateArray(directionsArray);

      updatedPlayers.forEach((player, i) => {
        player.playerAbilities = rotatedAbilitiesArray[i];
        player.playerDirections = rotatedDirectionsArray[i];
      })

      await setDoc(gameState.roomId, {
        players: updatedPlayers,
        updateAbilitiesCount: count + 1
      })
    }
  }

  return (
    <div 
      className={`space${showMovableArea ? " active" : ""}${showTeleport ? " teleporter" : ""}${showEscalator ? " escalator" : ""}${showEscalator ? " escalator" : ""}`}
      onClick={showMovableArea || showTeleport || showEscalator ? movePawn : () => {}}
    >
      {
        (isTimer && spaceIsDisabled) ?
          <div style={{
            position: "absolute",
            zIndex: "2",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: "100%",
            height: "100%"
          }}>
            <ImCross style={{ fontSize: "30px", color: "#795548" }} /> 
          </div>
            :
          <></>
      }
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