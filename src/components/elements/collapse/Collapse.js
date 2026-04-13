import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";

/**
 * @component CustomCollapse
 * @description A simple toggle-able content panel built on React-Bootstrap's Collapse
 * component. Maintains its own open/closed state internally — no external state
 * management is required. Clicking the button toggles the visibility of the
 * associated content section with an animated expand/collapse transition.
 *
 * Accessibility attributes (aria-controls and aria-expanded) are applied to the
 * toggle button automatically.
 *
 * @param {string}         [width] - Width forwarded as a prop to the Button element.
 * @param {React.ReactNode} [text] - Content rendered inside the collapsible panel.
 * @param {string}         [label] - Text displayed on the toggle button.
 *
 * @example
 * <CustomCollapse
 *   label="Show Details"
 *   text={<p>Detailed information goes here.</p>}
 * />
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
