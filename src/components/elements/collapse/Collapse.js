/**
 * @file Collapse.js
 * @description Toggle-able collapse component that shows/hides arbitrary text content on button click.
 */

import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

/**
 * Renders a labelled button that toggles visibility of a collapsible text block.
 * @param {{ width: string|number, text: JSX.Element, label: string }} props
 * @returns {JSX.Element}
 */
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
