import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import {
  createConvert,
  multiDatePickerDateChangIntoUTC,
} from "../../../../../commen/functions/date_formater.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  AddReopenComplianceAPI,
  EditComplianceAPI,
  SaveComplianceDocumentsAndMappingsAPI,
  SaveComplianceFilesAPI,
} from "../../../../../store/actions/ComplainSettingActions.js";
import { uploadDocumentsTaskApi } from "../../../../../store/actions/ToDoList_action.js";
import ComplianceStatusChangeResonReasonModal from "../../StatusChangeModals/ComplianceStatusOnHoldReasonModal/index.jsx";

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
    tempSelectComplianceStatus,
    complianceReopenDetailsState,
    setComplianceStatusChangeReasonModal,
    complianceStatusChangeReasonModal,
    // complianceOnHoldReasonState,
  } = useComplianceContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(
    complianceDetailsState,
    "complianceReopenDetailsStatecomplianceReopenDetailsState",
  );

  const complianceReopenedDetail = useSelector(
    (state) => state.ComplainceSettingReducerReducer.addReopenComplianceDetails,
  );
  const complianceDataroomFolderId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.ComplianceDataRoomMapFolderId,
  );

  console.log(tempSelectComplianceStatus, "tempSelectComplianceStatus");

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
  const [editComplianceData, setEditComplianceData] = useState(null);

  const uploadReopenCompilanceDocuments = async (folderID) => {
    try {
      let saveFiles = [];
      let uploadedFiles;
      // 1️⃣ Upload individual documents
      if (complianceReopenDetailsState.attachments.length > 0) {
        await Promise.all(
          complianceReopenDetailsState.attachments.map((newData) =>
            dispatch(
              uploadDocumentsTaskApi(navigate, t, newData, folderID, saveFiles),
            ),
          ),
        );
        // 2️⃣ Save files & CAPTURE RETURNED FILE IDS
        uploadedFiles = await dispatch(
          SaveComplianceFilesAPI(navigate, saveFiles, t, folderID),
        );

        // 3️⃣ Build payload AFTER data exists
        const Data2 = {
          complianceId: editComplianceData.complianceId,
          complianceStatusChangeHistoryID: complianceReopenedDetail,
          fileIds: uploadedFiles
            ? uploadedFiles.map((file) => ({
                PK_FileID: file.pK_FileID,
              }))
            : [],
        };

        // 4️⃣ Final mapping API
        dispatch(
          SaveComplianceDocumentsAndMappingsAPI(
            navigate,
            Data2,
            t,
            editComplianceData,
            setEditComplianceData,
            // setChecklistTabs
          ),
        );
      } else {
        dispatch(
          EditComplianceAPI(
            navigate,
            editComplianceData,
            t,
            // setChecklistTabs
          ),
        );
      }

      console.log("uploadedFiles:", uploadedFiles); // ✅ DATA HERE
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (complianceDataroomFolderId !== 0 && complianceReopenedDetail !== null) {
      uploadReopenCompilanceDocuments(complianceDataroomFolderId);
    }
  }, [complianceDataroomFolderId, complianceReopenedDetail]);

  const updateCompliance = (selectedOption) => {
    const tagsArr = complianceDetailsViewState.tags.map(
      (data) => data.tagTitle,
    );
    const selectedStatusId =
      tempSelectComplianceStatus?.value || complianceDetailsState.status.value;
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
        selectedStatusId === 7 || selectedStatusId === 9
          ? complianceOnHoldReasonState?.trim()
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
    // For Reopen Compliance
    if (selectedOption.value === 6) {
      // There should we use update with repopend compliancere

      let DataReOpenCompliance = {
        complianceId: Data.complianceId,
        updatedDueDate: createConvert(complianceReopenDetailsState.dueDate),
        reason: complianceReopenDetailsState.reason,
      };
      let reopenDataroomMap = {
        complianceId: complianceInfo.complianceId,
        complianceTitle: complianceDetailsState.complianceTitle,
      };
      console.log("DataReOpenCompliance", complianceReopenDetailsState);
      setEditComplianceData(Data);
      dispatch(
        AddReopenComplianceAPI(
          navigate,
          DataReOpenCompliance,
          t,
          reopenDataroomMap,
        ),
      );
      return;
    }

    // console.log(Data, "DataDataData");
    dispatch(EditComplianceAPI(navigate, Data, t, null));
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
    if (event.value === 2) {
      console.log("herehrer");
      updateCompliance(event);
      resetModalStates();

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
    if (tempSelectComplianceStatus) {
      updateCompliance(tempSelectComplianceStatus);
    }
    setSubmitForApprovalModal(false);
    resetModalStates();
  }, [tempSelectComplianceStatus]);

  const handleClickOnHoldModal = useCallback(() => {
    console.log(complianceOnHoldReasonState, "complianceOnHoldReasonState");
    setComplianceOnHoldModal(false);
    setComplianceStatusChangeReasonModal(true);

    // if (tempSelectComplianceStatus) {
    //   updateCompliance(tempSelectComplianceStatus);
    // }
    // resetModalStates();
  }, [
    tempSelectComplianceStatus,
    complianceOnHoldSelectOption,
    complianceOnHoldReasonState,
  ]);

  const handleClickOnHoldOrCancelReasonModal = useCallback(() => {
    console.log(complianceOnHoldReasonState, "complianceOnHoldReasonState");
    // setComplianceOnHoldModal(false);
    setComplianceStatusChangeReasonModal(false);

    if (tempSelectComplianceStatus) {
      updateCompliance(tempSelectComplianceStatus);
    }
    resetModalStates();
  }, [
    tempSelectComplianceStatus,
    complianceOnHoldReasonState,
    complianceOnHoldSelectOption,
    complianceCancelSelectOption,
  ]);

  const handleClickCancelModal = useCallback(() => {
    // console.log(handleProceedButtonView, "handleProceedButtonView");
    setComplianceCancelModal(false);
    setComplianceStatusChangeReasonModal(true);
    // if (tempSelectComplianceStatus) {
    //   updateCompliance(tempSelectComplianceStatus);
    // }
    // resetModalStates();
  }, [
    tempSelectComplianceStatus,
    complianceCancelSelectOption,
    complianceOnHoldReasonState,
  ]);

  const handleClickReOpendModal = useCallback(() => {
    // console.log("DataReOpenCompliance", complianceReopenDetailsState);

    if (tempSelectComplianceStatus) {
      updateCompliance(tempSelectComplianceStatus);
    }
    setComlianceStatusReopenedModal(false);
    resetModalStates();
  }, [tempSelectComplianceStatus, complianceReopenDetailsState]);

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
                classNamePrefix={
                  complianceDetailsState.status?.value === 5
                    ? "customSelectOfComplianceView"
                    : ""
                }
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
      {submitForApprovalModal && (
        <StatusSubmitForApprovalModal
          view={true}
          handleProceedButtonView={handleClickSubmitApprovalModal}
        />
      )}

      {/* This is For On Hold Modal */}
      {complianceOnHoldModal && (
        <CompliaceStatusOnHoldModal
          view={true}
          handleProceedButtonView={handleClickOnHoldModal}
        />
      )}
      {complianceStatusChangeReasonModal && (
        <ComplianceStatusChangeResonReasonModal
          view={true}
          handleProceedButtonView={handleClickOnHoldOrCancelReasonModal}
        />
      )}

      {/* This is For Cancel Modal */}
      {complianceCancelModal && (
        <ComplianceStatusCancelModal
          view={true}
          handleProceedButtonView={handleClickCancelModal}
        />
      )}

      {/* This is For Re-opened Modal */}
      {comlianceStatusReopenedModal && (
        <ComplianceStatusReopenedModal
          view={true}
          handleProceedButtonView={handleClickReOpendModal}
        />
      )}
    </>
  );
};

export default ViewComplianceDetails;
