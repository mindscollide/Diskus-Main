import React, { useCallback, useEffect, useMemo } from "react";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import styles from "./viewComplianceDetails.module.css";
import { Tag } from "antd";
import ViewComplianceChecklistAccordian from "../../ViewComplianceChecklistAccordian/index.jsx.js";
import {
  formatDateToYMD,
  parseYYYYMMDDToEndOfDay,
} from "../../commonFunctions.js";
import StatusSubmitForApprovalModal from "../../StatusChangeModals/SubmitForApproval/index.jsx";
import ComplianceStatusCompleteExceptionModal from "../../StatusChangeModals/ComplianceStatusCompleteModal/index.jsx";
import CompliaceStatusOnHoldModal from "../../StatusChangeModals/ComplianceStatusOnHoldModal/index.jsx";
import ComplianceStatusCancelModal from "../../StatusChangeModals/ComplianceStatusCancel/index.jsx";
import ComplianceStatusReopenedModal from "../../StatusChangeModals/ComplianceStatusReopenedModal/index.jsx";
import { multiDatePickerDateChangIntoUTC } from "../../../../../commen/functions/date_formater.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EditComplianceAPI } from "../../../../../store/actions/ComplainSettingActions.js";

const ViewComplianceDetails = () => {
  const {
    complianceDetailsViewState,
    complianceDetailsState,
    allowedComplianceStatusOptions,
    setComplianceDetailsState,
    complianceViewMode,
    complianceOnHoldSelectOption,
    complianceCancelSelectOption,
    complianceInfo,
    setComplianceInfo,
    complianceOnHoldReasonState,
    submitForApprovalModal,
    setSubmitForApprovalModal,
    complianceOnHoldModal,
    setComplianceOnHoldModal,
    comlianceCompleteExceptionModal,
    setComlianceCompleteExceptionModal,
    complianceCancelModal,
    setComplianceCancelModal,
    comlianceStatusReopenedModal,
    setComlianceStatusReopenedModal,
    setComplianceDetailsViewState,
    resetModalStates,
    setTempSelectedComplianceStatus,
    checkAnyTaskOnPendingState,
    checkAnyChecklistOnPendingState,
    checkAnyTaskInProgress,
    setCheckAnyTaskInProgress,
    tempSelectedComplianceStatus,
  } = useComplianceContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const criticalityOptions = [
    {
      label: "Low",
      value: 1,
    },
    {
      label: "Medium",
      value: 2,
    },
    {
      label: "High",
      value: 3,
    },
  ];

  console.log(complianceDetailsViewState, "complianceDetailsState");

  /** Static Statuses (inside component) */
  const COMPLIANCE_STATUSES = useMemo(
    () => [
      { label: "Not Started", value: 1 },
      { label: "In Progress", value: 2 },
      { label: "Completed ", value: 3 },
      { label: "Overdue", value: 4 },
      { label: "Submitted for Approval", value: 5 },
      { label: "Re-Opened", value: 6 },
      { label: "On Hold", value: 7 },
      { label: "Submitted for Approval", value: 8 },
      { label: "Cancelled", value: 8 },
    ],
    [],
  );

  /**  Dropdown change */
  const handleStatusChange = useCallback(
    (selectedOption) => {
      const statusId = selectedOption.value;
      console.log(statusId, "ComplianceStatusChangedTo");
      switch (statusId) {
        case 1: //  Not Started
          setComlianceCompleteExceptionModal(true);
          break;

        case 2: // InProgress
          updateCompliance(selectedOption);
          // setComlianceCompleteExceptionModal(true);
          break;

        case 3: // Completed
          setComlianceCompleteExceptionModal(true);
          break;

        case 4: // Overdue
          // setComlianceCompleteExceptionModal(true);
          break;

        case 5: // On Submitted For Approval
          setSubmitForApprovalModal(true);
          break;

        case 6: // Re-opened Compliance
          setComlianceStatusReopenedModal(true);
          break;

        case 7: // On Hold Compliance
          setComplianceOnHoldModal(true);
          break;

        case 8: // Submitted for Approval
          setSubmitForApprovalModal(true);
          break;

        case 9: // On click Cancel
          setComplianceCancelModal(true);
          break;

        default:
          // Normal status update (no modal)
          // setComplianceDetailsState((prev) => ({
          //   ...prev,
          //   status: selectedOption,
          // }));
          break;
      }
    },
    [
      setSubmitForApprovalModal,
      setComplianceOnHoldModal,
      setComlianceCompleteExceptionModal,
      setComplianceDetailsState,
    ],
  );

  // styling for select:
  const getStatusColor = (status) => {
    switch (status) {
      case "Not Started":
        return "#9E9E9E";
      case "In Progress":
        return "#F5A623";
      case "Completed":
        return "#2ECC71";
      case "Overdue":
        return "#E74C3C";
      case "Submitted for Approval":
        return "#5B6EF5";
      case "Responded":
        return "#4FC3F7";
      case "On Hold":
        return "#26C6DA";
      case "Closed":
        return "#616161";
      default:
        return "#000";
    }
  };

  const statusSelectStyles = {
    option: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      backgroundColor: state.isFocused ? "#F5F7FF" : "#fff",
      fontWeight: 500,
      cursor: "pointer",
    }),

    menu: (provided, state) => ({
      ...provided,
      width: "160px",
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: getStatusColor(state.data.label),
      fontWeight: 600,
    }),

    control: (provided, state) => ({
      ...provided,
      width: "160px",
      minHeight: "36px",
      border: "none",
      borderColor: state.isFocused ? "#6172d6" : "#d9d9d9",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#6172d6",
      },
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const updateCompliance = (selectedOption) => {
    const tagsArr = complianceDetailsViewState.tags.map(
      (data) => data.tagTitle,
    );

    const Data = {
      complianceId: complianceInfo.complianceId,
      complianceTitle: complianceDetailsViewState.complianceTitle,
      description: complianceDetailsViewState.description,
      authorityId: complianceDetailsViewState.authority.value,
      criticality: complianceDetailsViewState.criticality.value,
      dueDate: complianceDetailsViewState.dueDate,
      newStatusId: selectedOption.value,
      tags: tagsArr,
      ReasonToMakeComplianceOnHold:
        complianceDetailsViewState.status.value === 7 ||
        complianceDetailsViewState.status.value === 9
          ? complianceOnHoldReasonState
          : "", // On Hold Compliance
      OnHoldAlongWithComplianceCheckListAndTask:
        complianceDetailsViewState.status.value === 7
          ? complianceOnHoldSelectOption
          : complianceDetailsViewState.status.value === 9
            ? complianceCancelSelectOption
            : 0, // On Hold Compliance Including Checklist and Task
    };

    setComplianceDetailsViewState((prev) => ({
      ...prev,
      status: selectedOption,
    }));
    dispatch(EditComplianceAPI(navigate, Data, t, null));

    console.log(Data, "DataDataData");
  };

  const handleChangeComplianceStatus = (event) => {
    console.log(event, "CompliaceStatusOnHoldModal");

    // if compliance status is changed to Complete check any task still in In Progress or Pending status
    if (event.value === 3) {
      if (complianceDetailsState.status.value === 3) {
        // do nothing
      } else if (complianceDetailsState.status.value !== 3) {
        if (
          // checkAnyChecklistOnPendingState ||
          checkAnyTaskOnPendingState ||
          checkAnyTaskInProgress
        ) {
          resetModalStates();
          setComlianceCompleteExceptionModal(true);
        } else {
          updateCompliance(event);
          // setComplianceDetailsState((prev) => ({
          //   ...prev,
          //   status: event,
          // }));
        }
      }
    }

    // status change to Submit for Approval
    if (event.value === 5) {
      if (complianceDetailsState.status.value === 5) {
        // do nothing
      } else if (complianceDetailsState.status.value !== 5) {
        if (checkAnyChecklistOnPendingState) {
          resetModalStates();
          setTempSelectedComplianceStatus(event);
          setSubmitForApprovalModal(true);
        } else {
          updateCompliance(event);

          // setComplianceDetailsState((prev) => ({
          //   ...prev,
          //   status: event,
          // }));
        }
      }
    }

    // status change to Reopen
    if (event.value === 6) {
      if (complianceDetailsState.status.value === 6) {
        // do nothing
      } else if (complianceDetailsState.status.value !== 6) {
        resetModalStates();
        setTempSelectedComplianceStatus(event);
        setComlianceStatusReopenedModal(true);
      }
    }
    // status change to On Hold
    if (event.value === 7) {
      if (complianceDetailsState.status.value === 7) {
        // setTempSelectedComplianceStatus(event);
        // setComplianceOnHoldModal(true);
      } else if (complianceDetailsState.status.value !== 7) {
        resetModalStates();
        setTempSelectedComplianceStatus(event);
        setComplianceOnHoldModal(true);
      }
    }

    // Status changed to Cancel
    if (event.value === 9) {
      if (complianceDetailsState.status.value === 9) {
        // setTempSelectedComplianceStatus(event);
        // setComplianceOnHoldModal(true);
      } else if (complianceDetailsState.status.value !== 9) {
        resetModalStates();
        setTempSelectedComplianceStatus(event);
        setComplianceCancelModal(true);
      }
    }
    // Status chnage to In Progress
    else if (event.value === 2) {
      resetModalStates();
      updateCompliance(event);

      // setComplianceDetailsState((prev) => ({
      //   ...prev,
      //   status: event,
      // }));
      // setComplianceDetailsState((prev) => ({
      //   ...prev,
      //   status: event,
      // }));
    }
  };

const handleClickSubmitApprovalModal = useCallback(() => {
  if (tempSelectedComplianceStatus) {
    updateCompliance(tempSelectedComplianceStatus);
  }
  setSubmitForApprovalModal(false);
  resetModalStates();
}, [tempSelectedComplianceStatus]);


const handleClickOnHoldModal = useCallback(() => {
  if (tempSelectedComplianceStatus) {
    updateCompliance(tempSelectedComplianceStatus);
  }
  setComplianceOnHoldModal(false);
  resetModalStates();
}, [tempSelectedComplianceStatus]);


const handleClickCancelModal = useCallback(() => {
  if (tempSelectedComplianceStatus) {
    updateCompliance(tempSelectedComplianceStatus);
  }
  setComplianceCancelModal(false);
  resetModalStates();
}, [tempSelectedComplianceStatus]);

const handleClickReOpendModal = useCallback(() => {
  if (tempSelectedComplianceStatus) {
    updateCompliance(tempSelectedComplianceStatus);
  }
  setComlianceStatusReopenedModal(false);
  resetModalStates();
}, [tempSelectedComplianceStatus]);



  return (
    <>
      <Row className="mt-3">
        <Col sm={12} md={12} lg={12}>
          <div className={styles["complianceViewLabel"]}>{`${t(
            "Description",
          )}`}</div>
          <div className={styles["complianceViewValue"]}>
            {complianceDetailsState.description}
          </div>
        </Col>
      </Row>
      <>
        <Row className="mt-3">
          <Col sm={12} md={8} lg={8}>
            <div className={styles["complianceViewLabel"]}>
              {t("Authority")}
            </div>
            <div className={styles["complianceViewValue"]}>
              {complianceDetailsState.authority.label}
            </div>
          </Col>

          <Col sm={12} md={2} lg={2}>
            <div className={styles["complianceViewLabel"]}>{t("Status")}</div>
            {complianceViewMode === "byMe" ? (
              <Select
                isSearchable={false}
                options={allowedComplianceStatusOptions}
                onChange={handleChangeComplianceStatus}
                styles={statusSelectStyles}
                value={complianceDetailsState.status}
                placeholder="Select"
                labelInValue={t("Status")}
                // isSearchable={false}
                // options={allowedComplianceStatusOptions}
                // onChange={handleChangeComplianceStatus}
                // styles={statusSelectStyles}
                // value={complianceDetailsState.status}
                // classNamePrefix="Select_status_compliance"
                className={styles.Select_status_compliance}
              />
            ) : (
              <div className={styles["complianceViewValue"]}>
                {complianceDetailsState?.status?.label}
              </div>
            )}
          </Col>
        </Row>
        <Row className="mt-3">
          <Col sm={12} md={2} lg={2}>
            <div className={styles["complianceViewLabel"]}>{`${t(
              "Criticality-level",
            )}:`}</div>
            <div className={styles["complianceViewValue"]}>
              {complianceDetailsState.criticality.label}
            </div>
          </Col>
          <Col sm={12} md={2} lg={2}>
            <div className={styles["complianceViewLabel"]}>{`${t(
              "Due-date",
            )}:`}</div>
            <div className={styles["complianceViewValue"]}>
              {formatDateToYMD(complianceDetailsState.dueDate)}
            </div>
          </Col>
          <Col sm={12} md={8} lg={8}>
            <div className={styles["complianceViewLabel"]}>{`${t(
              "Tags",
            )}:`}</div>
            {Array.isArray(complianceDetailsState.tags) &&
              complianceDetailsState.tags.length > 0 &&
              complianceDetailsState.tags.map((tag) => (
                <Tag key={tag.tagID} className={styles["tagsStyle"]}>
                  {tag.tagTitle}
                </Tag>
              ))}
          </Col>
        </Row>
      </>
      <ViewComplianceChecklistAccordian />

      {/* This is for completion Modal */}
      {comlianceCompleteExceptionModal && (
        <ComplianceStatusCompleteExceptionModal />
      )}

      {/* This is For Submit For Approval Modal */}
      {submitForApprovalModal && <StatusSubmitForApprovalModal view={true} handleProceedButtonView={handleClickSubmitApprovalModal} />}

      {/* This is For On Hold Modal */}
      {complianceOnHoldModal && <CompliaceStatusOnHoldModal view={true} handleProceedButtonView={handleClickOnHoldModal} />}

      {/* This is For Cancel Modal */}
      {complianceCancelModal && <ComplianceStatusCancelModal view={true} handleProceedButtonView={handleClickCancelModal} />}

      {/* This is For Re-opened Modal */}
      {comlianceStatusReopenedModal && (
        <ComplianceStatusReopenedModal view={true}  handleProceedButtonView={handleClickReOpendModal}/>
      )}
    </>
  );
};

export default ViewComplianceDetails;
