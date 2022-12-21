import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

const CustomCollapse = ({ width, text, label }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        width={width}
      >
        {label}
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">{text}</div>
      </Collapse>
    </>
  );
};

export default CustomCollapse;
