import React from "react";
import { Accordion } from "react-bootstrap";

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
