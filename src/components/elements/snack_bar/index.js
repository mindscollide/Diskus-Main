import React from "react";
import PropTypes from "prop-types"; // For prop type validation
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
  return (
    <MuiAlert
      elevation={6}
      ref={ref}
      variant="filled"
      {...props}
    />
  );
});

const Notification = React.memo(({ setOpen, open, message, severity = "success" }) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar 
      open={open} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000} 
      onClose={handleClose}
       
    >
      <Alert 
        onClose={handleClose} 
        severity={severity} // Use dynamic severity
        sx={{ width: '100%', backgroundColor: severity === "success" ?  "#6172d6" : "#ce0000" }} // Customize background colors
      >
        {message}
      </Alert>
    </Snackbar>
  );
});

// Prop type validation
Notification.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["success", "error", "info", "warning"]), // Allow specific severity types
};

export default Notification;
