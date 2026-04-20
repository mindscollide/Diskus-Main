/**
 * @file Grouped_buttons.js
 * @description Reusable grouped button component that renders a Bootstrap ButtonGroup from a data object.
 */

import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "../button/Button";

/**
 * Renders a horizontal group of three buttons using labels from the data prop.
 * @param {{ data: { primaryButton: { text: string, text2: string, text3: string } } }} props
 * @returns {JSX.Element}
 */
const GroupedButtons = ({ data }) => {
  return (
    <>
      <ButtonGroup className="mt-4">
        <Button text={data.primaryButton.text} />
        <Button text={data.primaryButton.text2} />
        <Button text={data.primaryButton.text3} />
      </ButtonGroup>
    </>
  );
};

export default GroupedButtons;
