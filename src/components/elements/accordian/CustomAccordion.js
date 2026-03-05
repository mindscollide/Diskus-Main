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
  isComplianceTaskView = false,
}) => {
  const expanded = isExpand === notesID;

  return (
    <div
      className={`${
        isCompliance === true
          ? "accordion-customForChecklist"
          : isComplianceTask === true || isComplianceTaskView
            ? "accordion-customForTasks"
            : "accordion-custom"
      } ${expanded ? "expanded" : ""}`}
    >
      <div className={isCompliance ? "FirstRow_Checklist" : "FirstRow"}>
        <div
          className={
            isCompliance
              ? "title-cont_Checklist"
              : isComplianceTask
                ? "titleForTask"
                : isComplianceTaskView
                  ? "titleForTaskView"
                  : "title-cont"
          }
          onClick={handleClickTitleNotes}
        >
          {StartField}
        </div>
        <div
          className={
            isCompliance
              ? "dateTime_Checklist"
              : isComplianceTask || isComplianceTaskView
                ? "NodateTime_Task"
                : "dateTime"
          }
        >
          {centerField}
        </div>
        <div
          className={
            isCompliance
              ? "icons_Checklist"
              : isComplianceTask || isComplianceTaskView
                ? "icons_Task"
                : "icons"
          }
        >
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
