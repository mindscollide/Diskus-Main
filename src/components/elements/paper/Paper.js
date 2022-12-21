import React from "react";
import Paper from "@material-ui/core/Paper";

const CustomPaper = ({
  children,
  variant,
  className 
}) => { 
  return (
    <>
      <div >
        <Paper variant={variant && "outlined"} elevation={0} className={className}>
          {children}
        </Paper>
      </div>
    </>
  );
};

export default CustomPaper;
