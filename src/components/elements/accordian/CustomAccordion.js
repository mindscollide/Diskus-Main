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
  const expanded = isExpand === notesID;

  return (
    <div className={`accordion-custom ${!expanded ? "expanded" : ""}`}>
      <div className="FirstRow">
        <div className="title-cont" onClick={handleClickTitleNotes}>
          {StartField}
        </div>
        <div className="dateTime">{centerField}</div>
        <div className="icons">{endField}</div>
      </div>

      <div className={`SecondRow ${!expanded ? "show" : ""}`}>
        {attachmentsRow}
      </div>
    </div>
  );
};

export default CustomAccordion;
