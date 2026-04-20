/**
 * @file CustomAccordion.js
 * @description Custom CSS-driven accordion row used in notes, compliance checklist, and task views; expands an attachments section on click.
 */

import React from "react";
import "./Accordian.css";

/**
 * Expandable row component that shows a start, center, and end field; toggles an attachment row on click.
 * @param {{ StartField: JSX.Element, centerField: JSX.Element, endField: JSX.Element, attachmentsRow: JSX.Element, isExpand: any, notesID: any, handleClickTitleNotes: Function, isCompliance: boolean, isComplianceTask: boolean, isComplianceTaskView: boolean }} props
 * @returns {JSX.Element}
 */
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
