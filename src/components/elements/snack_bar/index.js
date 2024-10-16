import React from "react";
import PropTypes from "prop-types"; // For prop type validation
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { ExclamationDiamond, Airplane } from "react-bootstrap-icons";

const Notification = React.memo(
  ({ setOpen, open, message, severity = "success" }) => {
    const handleClose = (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    return (
      <Snackbar
        open={true}
        // className={severity === "success"? "success_snackbar": "error_snackbar"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={handleClose}>
        <MuiAlert
          elevation={6}
          icon={severity === "success" ? <Airplane /> : <ExclamationDiamond />}
          style={{ alignItems: "center" }}
          sx={{
            width: "100%",
            backgroundColor: severity === "success" ? "#6172d6" : "#ce0000",
          }} // Customize background colors
          variant='filled'>
          {message}
        </MuiAlert>

        {/* <Alert 
        onClose={handleClose} 
        c
        severity={severity} // Use dynamic severity
        
      >
        {message}
      </Alert> */}
      </Snackbar>
    );
  }
);

// Prop type validation
Notification.propTypes = {
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  severity: PropTypes.oneOf(["success", "error", "info", "warning"]), // Allow specific severity types
};

export default Notification;
