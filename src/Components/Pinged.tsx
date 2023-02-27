import { memo, ReactNode, useEffect, useState } from 'react';
import { DBPlayer, Room, playerNumber } from '../types';
import { useGamePausedDocState, usePlayerDocState, usePingedDocState } from '../Contexts/FirestoreContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc, getDoc } from '../utils/useFirestore';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Pinged = () => {
  const { gameState } = useGame();
  const { player, players } = usePlayerDocState();
  const pinged = usePingedDocState();


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
    <>
      {
        players.length > 1 ? 
          pinged ? 
            <img
              className='shake'
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
    </>
  )
}

export default Pinged;