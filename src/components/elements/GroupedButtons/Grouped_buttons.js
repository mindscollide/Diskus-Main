import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "../button/Button";
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
