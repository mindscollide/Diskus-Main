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
  isComplianceTask = false,
}) => {
  const expanded = isExpand === notesID;

  return (
    <div
      className={`${
        isCompliance === true
          ? "accordion-customForChecklist"
          : isComplianceTask === true
          ? "accordion-customForTasks"
          : "accordion-custom"
      } ${expanded ? "expanded" : ""}`}
    >
      <div className={isCompliance ? "FirstRow_Checklist" : "FirstRow"}>
        <div
          className={isCompliance ? "title-cont_Checklist" : "title-cont"}
          onClick={handleClickTitleNotes}
        >
          {StartField}
        </div>
        <div className={isCompliance ? "dateTime_Checklist" : "dateTime"}>
          {centerField}
        </div>
        <div className={isCompliance ? "icons_Checklist" : "icons"}>
          {endField}
        </div>
      </div>

      <div
        className={`${
          isCompliance === true ? "SecondRowForChecklist" : "SecondRow"
        } ${expanded ? "show" : ""}`}
      >
        {attachmentsRow}
      </div>
    </div>
  );
};

export default CustomAccordion;
