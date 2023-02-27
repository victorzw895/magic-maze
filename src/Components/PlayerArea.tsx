import { memo, ReactNode, useEffect, useState } from 'react';
import { useGame } from '../Contexts/GameContext';
import { DBPlayer, Room, playerNumber } from '../types';
import { setDoc, getDoc } from '../utils/useFirestore';
import isEqual from 'lodash/isEqual';
import PlayerAreaDisabled from './PlayerAreaDisabled';
import { useGamePausedDocState, usePlayerDocState, usePingedDocState } from '../Contexts/FirestoreContext';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';
interface PlayerAreaProps {
  highlightNewTileArea: () => void,
  children: ReactNode
}

const areEqual = (prevProps: PlayerAreaProps, nextProps: PlayerAreaProps) => {
  return isEqual(prevProps, nextProps);
}

const PlayerArea = ({highlightNewTileArea, children} : PlayerAreaProps) => {
  const [openPopover, setOpenPopover] = useState(false);
  const { gameState } = useGame();
  const { player, players } = usePlayerDocState();
  const gamePaused = useGamePausedDocState();
  const pinged = usePingedDocState();

  useEffect(() => {
    console.log('*** player area useEffect')
  }, [children, player])

  const handleClick = async (playerNumber: number) => {
    const docSnap = await getDoc(gameState.roomId);

    if (!docSnap.exists()) return;
    const room = docSnap.data() as Room;
    const pings = [...room.pings, playerNumber]

    await setDoc(gameState.roomId, {
      pings
    })
  }

  return (
    <div className="player-area">
      {
        player.number &&
        <>
          {
            player.playerDirections.map(direction => {
              return (
                <img 
                  key={direction}
                  draggable={false}
                  src={`/${direction}.png`} 
                  alt={direction} 
                  style={{
                    width: '80px',
                    margin: '0 30px'
                  }}
                    />
              )
            })
          }
          {
            player.playerAbilities.map(ability => {
              if (ability === "explore") {
                // DECISION: use button, or image?
                // return <button key={ability} onClick={() => highlightNewTileArea()}>Add Tile</button>
                return (
                  <img 
                    draggable={false}
                    key={ability}
                    onClick={gamePaused ? () => {} : highlightNewTileArea} // TODO: disable if game paused
                    src={`/${ability}.png`} 
                    alt={ability} 
                    style={{
                      width: '80px',
                      margin: '0 30px'
                    }}
                      />
                )
              }
              else {
                return (
                  <img 
                    key={ability}
                    draggable={false}
                    src={`/${ability}.png`} 
                    alt={ability} 
                    style={{
                      width: '80px',
                      margin: '0 30px'
                    }}
                      />
                )
              }
            })
          }
          {
            // players.length > 1 ? 
            true ? 
              pinged ? 
                <img 
                  key={'bell-shake'}
                  draggable={false}
                  src={'/bell-shake.png'} 
                  alt={'bell-shake'} 
                  style={{
                    width: '80px',
                    margin: '0 30px'
                  }}
                    />
                  :
                  <PopupState variant="popover" popupId="ping-popup">
                  {(popupState) => (
                      <div>
                        <img 
                          key={'bell'}
                          {...bindTrigger(popupState)}
                          draggable={false}
                          src={`/bell.png`} 
                          alt={'bell'} 
                          style={{
                            width: '80px',
                            margin: '0 30px'
                          }}
                            />
                        <Popover
                          {...bindPopover(popupState)}
                          anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                          }}
                          transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                          }}
                        >
                          <List dense={true}>
                            {
                              players.map((dbPlayer) => {
                                if (dbPlayer.number !== player.number) {
                                  return (
                                    <ListItemButton onClick={() => {
                                        popupState.close()
                                        handleClick(dbPlayer.number)
                                      }} >
                                      <ListItemIcon>
                                        <NotificationsIcon />
                                      </ListItemIcon>
                                      <ListItemText
                                        primary={dbPlayer.name}
                                        secondary={`${dbPlayer.playerDirections.join(', ')}, ${dbPlayer.playerAbilities.join(', ')}`}
                                      />
                                    </ListItemButton>
                                  )
                                }
                                return <></>
                              })
                            }
                          </List>
                        </Popover>
                      </div>
                    )}
                </PopupState>
                :
              <>
              </>
          }
          {/* TODO: when firestore gamePaused, update gameState */}
          {gamePaused && <PlayerAreaDisabled />}
          {
              gameState.gameOver && 
              <div className="game-paused">
              <p>Game Over</p>
            </div>
          }
        </>
      }
    </div>
  )
}

// PlayerArea.whyDidYouRender = true

export default PlayerArea;