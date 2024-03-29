import { useEffect } from 'react';
import { Room } from '../types';
import { usePlayersDocState, useCurrentPlayerDocState, usePingedDocState, useLoadingDocState } from '../Contexts/FirestoreContext';
import { useGame } from '../Contexts/GameContext';
import { setDoc, getDoc } from '../utils/useFirestore';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useAssets } from '../Contexts/AssetsContext';

import alertSound from '../assets/alert.wav'; // download file from firestore storage instead

const playAlert = () => {
  const audio = new Audio(alertSound);
  audio.loop = true;
  audio.play();
  return audio;
}

const Pinged = () => {
  const { assets } = useAssets();
  const { setPingLoaded } = useLoadingDocState();
  const { gameState } = useGame();
  const players = usePlayersDocState();
  const currentPlayer = useCurrentPlayerDocState();
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
            pings: room.pings.filter(ping => ping !== currentPlayer.number)
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
                      src={assets['bell-shake.png']} 
                      alt={'bell-shake'} 
                      style={{
                        width: '80px',
                        margin: '0 30px'
                      }}
                        />
                      :
                    <img 
                      onLoad={() => setPingLoaded(true)}
                      key={'bell'}
                      {...bindTrigger(popupState)}
                      draggable={false}
                      src={assets['bell.png']}
                      alt={'bell'} 
                      style={{
                        width: '80px',
                        margin: '0 30px'
                      }}
                        />
                  }
                <Popover
                  key={`popover-${popupState.popupId}`}
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
                  <List 
                    key={`list-${popupState.popupId}`}
                    dense={true}>
                    {
                      players.map((dbPlayer) => {
                        return (
                          <ListItemButton 
                            key={`ListItemButton-${dbPlayer.id}`}
                            disabled={dbPlayer.number === currentPlayer.number}
                            onClick={() => {
                              popupState.close()
                              handleClick(dbPlayer.number)
                            }} >
                            <ListItemIcon key={`ListItemIcon-${dbPlayer.id}`}>
                              <NotificationsIcon key={`NotificationsIcon-${dbPlayer.id}`}/>
                            </ListItemIcon>
                            <ListItemText
                              key={`ListItemText-${dbPlayer.id}`}
                              primary={dbPlayer.name}
                              secondary={`${dbPlayer.playerDirections.join(', ')}, ${dbPlayer.playerAbilities.join(', ')}`}
                            />
                          </ListItemButton>
                        )
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