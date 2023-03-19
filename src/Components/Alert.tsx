import React, { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps, AlertColor } from '@mui/material/Alert';

interface AlertMsgProps {
  message: string,
  severity: AlertColor
}

const Alerts = ({message, severity}: AlertMsgProps) => {

  const [showAlert, setShowAlert] = useState(true);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
      props,
      ref,
    ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    return (
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
        <Alert severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    )
}

export default Alerts;