import React, { useRef, ReactNode, useState } from 'react';
import NewTileArea from './NewTileArea';
import PlayerArea from './PlayerArea';
import { useGame } from '../Contexts/GameContext';
import Draggable from 'react-draggable';
import useHighlightArea from '../utils/useHighlightArea';
import { useGameStartedDocState } from '../Contexts/FirestoreContext';
import Objectives from './Objectives';
import AudioControls from './AudioControls';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const GameTable = ({timer, children}: {timer: ReactNode, children: ReactNode}) => {
  console.log('game table re render')
  const draggableNodeRef = useRef(null);
  const { gameState } = useGame();
  const gameStarted = useGameStartedDocState();
  const [availableArea, highlightNewTileArea, clearHighlightAreas, showAlert, setShowAlert] = useHighlightArea(gameState.roomId);
  const [alertMessage, setAlertMessage] = useState("")

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      <Objectives /> {/* minimize when playing, can click to expand */}
      <AudioControls />
      {gameStarted ? timer : <></>}
      <Draggable
        nodeRef={draggableNodeRef}
        defaultPosition={{x: 0, y: 0}}
        >
        <div ref={draggableNodeRef} className="playable-area">
          {availableArea.length > 0 && availableArea.map(newTileArea => {
            return (
              <NewTileArea 
                key={`${newTileArea.gridPosition[0]}-${newTileArea.gridPosition[1]}`} 
                tile={newTileArea} 
                clearHighlightAreas={clearHighlightAreas} 
                />
            )
          })}
          {children}
        </div>
      </Draggable>
      <PlayerArea highlightNewTileArea={highlightNewTileArea} />
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        onClose={() => setShowAlert(false)}
        autoHideDuration={5000}
        key='alert'
        ClickAwayListenerProps={{
          mouseEvent: false,
          touchEvent: false,
        }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          "The colour of the pawn does not match the exploration space"
        </Alert>
      </Snackbar>
    </>
  );
};

export default GameTable;