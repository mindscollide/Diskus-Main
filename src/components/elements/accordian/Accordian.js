/**
 * @file Accordian.js
 * @description Simple single-item accordion wrapper around React-Bootstrap's Accordion component.
 */

import React from "react";
import { Accordion } from "react-bootstrap";

/**
 * Renders a single accordion item with a header and body supplied as props.
 * @param {{ AccordioonHeader: JSX.Element, AccordioonBody: JSX.Element, AccordioonItem: JSX.Element, defaultActiveKey: string, className: string }} props
 * @returns {JSX.Element}
 */
const Accordian = ({
  AccordioonHeader,
  AccordioonBody,
  AccordioonItem,
  defaultActiveKey,
  className,
}) => {
  return (
    <>
      <Accordion
        flush
        alwaysOpen={true}
        defaultActiveKey={defaultActiveKey}
        className={className}
      >
        <Accordion.Item eventKey="0">
          {AccordioonItem}
          <Accordion.Header>{AccordioonHeader}</Accordion.Header>
          <Accordion.Body>{AccordioonBody}</Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>
  );
};

export default Accordian;
