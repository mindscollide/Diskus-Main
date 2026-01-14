import React from "react";
import "./Accordian.css";

const ChecklistAccordion = ({
  notesID,
  isExpanded, // pass true/false to control expansion
  onToggle, // callback when header is clicked
  StartField,
  centerField,
  endField,
  attachmentsRow,
}) => {
  return (
    <div
      className={`accordion-customForChecklist ${isExpanded ? "expanded" : ""}`}
    >
      {/* Header Row */}
      <div className="FirstRow" onClick={onToggle}>
        <div className="title-cont">{StartField}</div>
        <div className="dateTime">{centerField}</div>
        <div className="icons">{endField}</div>
      </div>

      {/* Expandable Content */}
      <div className={`SecondRowForChecklist ${isExpanded ? "show" : ""}`}>
        {attachmentsRow}
      </div>
    </div>
  );
};

export default ChecklistAccordion;
