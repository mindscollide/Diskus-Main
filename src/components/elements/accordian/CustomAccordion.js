import React from "react";
import "./Accordian.css";

const CustomAccordion = ({
  StartField,
  centerField,
  endField,
  attachmentsRow,
  isExpand,
  notesID,
  handleClickTitleNotes,
}) => {
  return (
    <div className={"accordion-custom"}>
      <div className="FirstRow">
        <div className="title-cont" onClick={handleClickTitleNotes}>
          {StartField}
        </div>
        <div className="dateTime">{centerField}</div>
        <div className="icons">{endField}</div>
      </div>
      <div className={isExpand === notesID ? "SecondRow" : "d-none"}>
        {attachmentsRow}
      </div>
    </div>
  );
};

export default CustomAccordion;
