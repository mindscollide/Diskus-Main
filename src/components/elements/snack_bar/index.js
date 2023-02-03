import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useStyles } from "./NotificationStyle";
import { useSelector } from "react-redux";
const Message = {
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
};

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const Notification = ({ setOpen, open, message }) => {
  const state = useSelector((state) => state);
  const classes = useStyles();
  const vertical = "top";
  const horizontal = "right";
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    // setOpen(!open);
    setOpen({
      flag: false,
      message: "",
    });
  };
  return (
    <>
      {message != "" ? (
        <div className={classes.root}>
          <Snackbar
            autoHideDuration={3000}
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message={message}
            key={vertical + horizontal}
          >
            <Alert
              onClose={handleClose}
              severity={"error"}
              className={classes.BackGroundSucces}
            >
              {message}
            </Alert>
          </Snackbar>
        </div>
      ) : null}
    </>
  );
};
export { Notification, Message };
