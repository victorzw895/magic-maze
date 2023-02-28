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

import alertSound from '../assets/alert.wav'; // download file from firestore storage instead

const playAlert = () => {
  const audio = new Audio(alertSound);
  audio.loop = true;
  audio.play();
  return audio;
}

const Pinged = () => {
  const { gameState } = useGame();
  const { player, players } = usePlayerDocState();
  const pinged = usePingedDocState();

  useEffect(() => {
    if (pinged) {
      const alertAudio = playAlert();
      const alertTimer = setTimeout(() => {
        alertAudio.pause();
      }, 4000);
      const timer = setTimeout(async () => {
        const docSnap = await getDoc(gameState.roomId);
        if (!docSnap.exists()) return;
        const room = docSnap.data() as Room;
        
        await setDoc(
          gameState.roomId, 
          {
            pings: room.pings.filter(ping => ping !== player.number)
          },
        )
      }, 6000);

      return () => {
        clearTimeout(timer)
        clearTimeout(alertTimer);
      };
    }
  }, [pinged])

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
          <PopupState variant="popover" popupId="ping-popup">
          {(popupState) => (
              <>
                {
                  pinged ? 
                    <img
                      className='shake'
                      {...bindTrigger(popupState)}
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
                  }
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
              </>
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