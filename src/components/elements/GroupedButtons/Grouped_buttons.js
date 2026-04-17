import React from "react";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Button from "../button/Button";

/**
 * @component GroupedButtons
 * @description Renders a horizontal group of exactly three buttons using React-Bootstrap's
 * ButtonGroup. All three button labels are sourced from a single `data` prop, specifically
 * from the nested `data.primaryButton` object. The ButtonGroup is offset from surrounding
 * content via a top margin (mt-4 Bootstrap class).
 *
 * This component is intentionally simple and is typically used to render a fixed set of
 * primary action buttons (e.g. Save / Cancel / Reset) in forms or modal footers.
 *
 * @param {{
 *   primaryButton: {
 *     text: string,
 *     text2: string,
 *     text3: string
 *   }
 * }} data - Configuration object. The three button labels are read from
 *            `data.primaryButton.text`, `data.primaryButton.text2`, and
 *            `data.primaryButton.text3`.
 *
 * @example
 * <GroupedButtons
 *   data={{
 *     primaryButton: {
 *       text: "Save",
 *       text2: "Cancel",
 *       text3: "Reset",
 *     },
 *   }}
 * />
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
