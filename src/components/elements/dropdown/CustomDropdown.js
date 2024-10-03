import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
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
