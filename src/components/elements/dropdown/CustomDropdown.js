/**
 * @file CustomDropdown.js
 * @description Generic dropdown component wrapping React-Bootstrap's Dropdown with dynamic option items.
 */

import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * Renders a dropdown toggle with dynamically mapped option items.
 * @param {{ Icon: JSX.Element, options: Array<{ label: string }>, onChange: Function, onClick: Function }} props
 * @returns {JSX.Element}
 */
const CustomDropdown = ({ Icon, options, onChange, onClick }) => {
  return (
    <Dropdown className="d-inline mx-2" onChange={onChange}>
      <Dropdown.Toggle id="dropdown-autoclose-true">{Icon}</Dropdown.Toggle>

      <Dropdown.Menu>
        {options !== null &&
          options !== undefined &&
          options.map((data, index) => {
            return (
              <Dropdown.Item onClick={onClick}>{data.label}</Dropdown.Item>
            );
          })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDropdown;
