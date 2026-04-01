import React from "react";
import Dropdown from "react-bootstrap/Dropdown";

/**
 * @component CustomDropdown
 * @description A generic dropdown menu built on React-Bootstrap's Dropdown component.
 * The toggle button displays an arbitrary icon element rather than text, keeping the
 * trigger area fully customisable. Each option in the menu is rendered from the
 * `options` array using its `label` property. Null/undefined-safe: the menu is only
 * populated when `options` is a valid, non-null array.
 *
 * @param {React.ReactNode} [Icon]     - The icon (or any React node) shown inside the
 *                                       dropdown toggle button.
 * @param {Array<{label: string}>} [options] - Array of option objects. Each object must
 *                                       have a `label` string which is displayed as the
 *                                       menu item text.
 * @param {Function} [onChange]        - onChange handler attached to the outer Dropdown
 *                                       wrapper (fires on value change).
 * @param {Function} [onClick]         - onClick handler attached to every Dropdown.Item;
 *                                       receives the click event for the selected item.
 *
 * @example
 * <CustomDropdown
 *   Icon={<ThreeDots />}
 *   options={[{ label: "Edit" }, { label: "Delete" }]}
 *   onClick={(e) => handleMenuAction(e)}
 * />
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
