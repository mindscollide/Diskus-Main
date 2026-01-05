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
  isCompliance = false,
}) => {
  const expanded = isExpand === notesID;

  return (
    <div
      className={`${
        isCompliance === true
          ? "accordion-customForChecklist"
          : "accordion-custom"
      } ${!expanded ? "expanded" : ""}`}
    >
      <div className="FirstRow">
        <div className="title-cont" onClick={handleClickTitleNotes}>
          {StartField}
        </div>
        <div className="dateTime">{centerField}</div>
        <div className="icons">{endField}</div>
      </div>

      <div
        className={`${
          isCompliance === true ? "SecondRowForChecklist" : "SecondRow"
        } ${!expanded ? "show" : ""}`}
      >
        {attachmentsRow}
      </div>
    </div>
  );
};

export default CustomAccordion;
