import React, { useEffect, useRef, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  InputfieldwithCount,
  TextAreafieldwithCount,
} from "../../../../../../components/elements/input_field/Input_field_withCount";
import styles from "./complianceDetails.module.css";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { Tag } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddComplianceAPI,
  AddReopenComplianceAPI,
  CheckComplianceTitleExistsAPI,
  clearAuthorityMessage,
  EditComplianceAPI,
  GetAllAuthoritiesWithoutPaginationAPI,
  GetAllTagsByOrganizationIDAPI,
  GetComplianceChecklistsByComplianceIdAPI,
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
  SaveComplianceDocumentsAndMappingsAPI,
  SaveComplianceFilesAPI,
  ViewComplianceDetailsByViewTypeAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import { Button, Notification } from "../../../../../../components/elements";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  createConvert,
  multiDatePickerDateChangIntoUTC,
} from "../../../../../../commen/functions/date_formater";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";
import { parseYYYYMMDDToEndOfDay } from "../../../../CommonComponents/commonFunctions";
import { Check2 } from "react-bootstrap-icons";
import AsyncCreatableSelect from "react-select/async-creatable";
import CompliaceStatusOnHoldModal from "../../../../CommonComponents/StatusChangeModals/ComplianceStatusOnHoldModal";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import ComplianceStatusCancelModal from "../../../../CommonComponents/StatusChangeModals/ComplianceStatusCancel";
import StatusSubmitForApprovalModal from "../../../../CommonComponents/StatusChangeModals/SubmitForApproval";
import ComplianceStatusCompleteExceptionModal from "../../../../CommonComponents/StatusChangeModals/ComplianceStatusCompleteModal";
import ComplianceStatusReopenedModal from "../../../../CommonComponents/StatusChangeModals/ComplianceStatusReopenedModal";
import { uploadDocumentsTaskApi } from "../../../../../../store/actions/ToDoList_action";

const ComplainceDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    complianceAddEditViewState,
    setCloseConfirmationModal,
    setComplianceInfo,
    checkListData,
    setChecklistTabs,
    complianceDetailsState,
    setComplianceDetailsState,
    complianceInfo,
    setChecklistCount,
    setTaskCount,
    setChecklistData,
    setAllowedComplianceStatusOptions,
    allowedComplianceStatusOptions,
    complianceOnHoldModal,
    setComplianceOnHoldModal,
    tempSelectComplianceStatus,
    setTempSelectedComplianceStatus,
    resetModalStates,
    complianceOnHoldReasonState,
    complianceOnHoldSelectOption,
    setComplianceCancelModal,
    complianceCancelSelectOption,
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    setShowViewCompliance,
    submitForApprovalModal,
    setSubmitForApprovalModal,
    setComlianceCompleteExceptionModal,
    setComlianceStatusReopenedModal,
    complianceReopenDetailsState,
    criticalityOptions,
    comlianceStatusReopenedModal,
  } = useComplianceContext();

  console.log(complianceDetailsState, "complianceDetailsState121212");
  const complianceDataroomFolderId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.ComplianceDataRoomMapFolderId,
  );
  const complianceReopenedDetail = useSelector(
    (state) => state.ComplainceSettingReducerReducer.addReopenComplianceDetails,
  );

  console.log(
    complianceDataroomFolderId,
    complianceReopenedDetail,
    "complianceReopenedDetail",
  );

  const { t } = useTranslation();
  const [tagsOptions, setTagsOptions] = useState([]);

  const [authorityOptions, setAuthorityOptions] = useState([]);
  const calendRef = useRef();

  const [errors, setErrors] = useState({
    complianceTitle: "",
  });
  const [isChecklistTitleExist, setIsChecklistTitleExist] = useState(null);
  const [tagInputActive, setTagInputActive] = useState(false);

  let currentLanguage = localStorage.getItem("i18nextLng");
  const getAllAuthorities = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllAuthoritiesDropdown,
  );
  const GetAllTagsByOrganizationIDData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAllTagsByOrganizationID,
  );
  const viewComplianceByMeDetails = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ViewComplianceByMeDetails,
  );

  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId,
  );

  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId,
  );
  const authorityRespnseMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage,
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity,
  );

  console.log(viewComplianceByMeDetails, "viewComplianceByMeDetails");

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [editComplianceData, setEditComplianceData] = useState(null);

  //   tags Selection
  const [tagsValue, setTagsValue] = useState("");

  const [checkAnyChecklistOnPendingState, setCheckAnyChecklistOnPendingState] =
    useState(false);
  const [checkAnyTaskOnPendingState, setCheckAnyTaskOnPendingState] =
    useState(false);

  const [checkAnyTaskInProgress, setCheckAnyTaskInProgress] = useState(false);

  const [hasIncompleteChecklistOrTask, setHasIncompleteChecklistOrTask] =
    useState(false);

  useEffect(() => {
    dispatch(GetAllAuthoritiesWithoutPaginationAPI(navigate, t));
    if (complianceInfo.complianceId !== 0) {
      const Data = {
        complianceId: complianceInfo.complianceId,
        viewType: 1,
      };
      dispatch(
        ViewComplianceDetailsByViewTypeAPI(
          navigate,
          Data,
          t,
          1,
          setComplianceAddEditViewState,
          setCreateEditComplaince,
          setShowViewCompliance,
        ),
      );
    }
  }, []);

  useEffect(() => {
    if (viewComplianceByMeDetails !== null) {
      try {
        const {
          allowedComplianceStatuses,
          authority,
          checklistTasks,
          checklists,
          completedTasks,
          complianceId,
          complianceStatus,
          complianceTitle,
          createdBy,
          criticalityLevel,
          description,
          dueDate,
          isExecuted,
          progressPercent,
          showProgressBar,
          tags,
          totalTasks,
        } = viewComplianceByMeDetails;
        setComplianceInfo({
          complianceId: complianceId,
          complianceName: complianceTitle,
        });

        const selectedCriticality = criticalityOptions.find(
          (item) => item.label === criticalityLevel,
        );
        setComplianceDetailsState((prev) => ({
          ...prev,
          complianceTitle: complianceTitle,
          complianceId: complianceId,
          description: description,
          authority: {
            ...authority,
            value: authority.authorityId,
            label: `${authority.authorityName} ${authority.authorityShortCode}`,
          },
          criticality: selectedCriticality,
          dueDate: prev.dueDate
            ? prev.dueDate
            : parseYYYYMMDDToEndOfDay(dueDate),
          tags: tags,
          status: {
            value: complianceStatus.statusId,
            label: complianceStatus.statusName,
          },
        }));

        if (allowedComplianceStatuses && allowedComplianceStatuses.length > 0) {
          const allowedStatuses = allowedComplianceStatuses.map(
            (data, index) => {
              return {
                ...data,
                value: data.statusId,
                label: data.statusName,
              };
            },
          );
          setAllowedComplianceStatusOptions(allowedStatuses);
        }
        if (complianceId !== 0) {
          let Data = {
            complianceId: complianceId,
          };
          dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
          dispatch(
            GetComplianceChecklistsWithTasksByComplianceIdAPI(
              navigate,
              Data,
              t,
            ),
          );
        }

        // check if any status is Pending to show confirmation modal on submit for approval & Complete
        if (Array.isArray(checklists) && checklists.length > 0) {
          const hasPendingChecklist = checklists.some(
            (checklist) => checklist?.status?.statusName === "Pending",
          );

          setCheckAnyChecklistOnPendingState(hasPendingChecklist);

          const checklistIncomplete =
            Array.isArray(checklists) &&
            checklists.some(
              (item) =>
                item?.status?.statusName === "Pending" ||
                item?.status?.statusName === "In Progress" ||
                item?.status?.statusName === "On Hold",
            );

          setHasIncompleteChecklistOrTask(checklistIncomplete);
        } else {
          setCheckAnyChecklistOnPendingState(false);
          setHasIncompleteChecklistOrTask(false);
        }

        // Check if any task status in pending the show confirmation modal on Complete
        if (Array.isArray(checklistTasks) && checklistTasks.length > 0) {
          const hasPendingTask = checklistTasks.some(
            (task) => task?.taskStatus?.statusName === "Pending",
          );

          setCheckAnyTaskOnPendingState(hasPendingTask);

          const taskIncomplete =
            Array.isArray(checklistTasks) &&
            checklistTasks.some(
              (item) =>
                item?.taskStatus?.statusName === "Pending" ||
                item?.taskStatus?.statusName === "In Progress" ||
                item?.taskStatus?.statusName === "On Hold",
            );

          setHasIncompleteChecklistOrTask(taskIncomplete);
        } else {
          setCheckAnyTaskOnPendingState(false);
          setHasIncompleteChecklistOrTask(false);
        }

        // // Check if any checklist or any task status is In Progress
        // if (
        //   (Array.isArray(checklists) && checklists.length > 0) ||
        //   (Array.isArray(checklistTasks) && checklistTasks.length > 0)
        // ) {
        //   const hasChecklistInProgress =
        //     Array.isArray(checklists) &&
        //     checklists.some(
        //       (checklist) => checklist?.status?.statusName === "In Progress"
        //     );

        //   const hasTaskInProgress =
        //     Array.isArray(checklistTasks) &&
        //     checklistTasks.some(
        //       (task) => task?.taskStatus?.statusName === "In Progress"
        //     );

        //   setCheckAnyChecklistOrTaskInProgress(
        //     hasChecklistInProgress ||

        //     hasTaskInProgress
        //   );
        // } else {
        //   setCheckAnyChecklistOrTaskInProgress(false);
        // }

        // Check if any checklist or any task status is In Progress
        if (Array.isArray(checklistTasks) && checklistTasks.length > 0) {
          const hasTaskInProgress =
            Array.isArray(checklistTasks) &&
            checklistTasks.some(
              (task) => task?.taskStatus?.statusName === "In Progress",
            );

          setCheckAnyTaskInProgress(hasTaskInProgress);
        } else {
          setCheckAnyTaskInProgress(false);
        }
      } catch (error) {}
    }
  }, [viewComplianceByMeDetails]);

  // setComplianceChecklistCount
  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId &&
      GetComplianceChecklistsByComplianceId !== null
    ) {
      setChecklistCount(
        GetComplianceChecklistsByComplianceId.checklistList.length,
      );
      // setGetCheckListData(GetComplianceChecklistsByComplianceId.checklistList);
      // 🔑 COLLAPSE ALL ACCORDIONS AFTER ADD
      // setExpandedCheckListIds([]);
    } else {
      setChecklistCount(0);
    }
  }, [GetComplianceChecklistsByComplianceId]);

  useEffect(() => {
    if (
      getAllComplianceChecklistTask &&
      getAllComplianceChecklistTask !== null
    ) {
      try {
        const checklistList = getAllComplianceChecklistTask.checklistList;
        const totalTaskCount = checklistList.reduce(
          (sum, checklist) => sum + (checklist.taskList?.length || 0),
          0,
        );
        setTaskCount(totalTaskCount);
      } catch (error) {}
    }
  }, [getAllComplianceChecklistTask]);

  // GetAllAuthority
  useEffect(() => {
    if (getAllAuthorities && getAllAuthorities !== null) {
      try {
        const { authorityList } = getAllAuthorities;

        let allAuthority = authorityList.map((data, index) => {
          return {
            ...data,
            value: data.authorityID,
            label: data.authorityName,
          };
        });
        setAuthorityOptions(allAuthority);
      } catch (error) {
        console.log(error);
      }
    }
  }, [getAllAuthorities]);

  useEffect(() => {
    if (
      GetAllTagsByOrganizationIDData !== null &&
      GetAllTagsByOrganizationIDData !== undefined
    ) {
      try {
        setTagsOptions(GetAllTagsByOrganizationIDData.tags);
      } catch (error) {
        setTagsOptions([]);
        console.log(error);
      }
    } else {
      setTagsOptions([]);
    }
  }, [GetAllTagsByOrganizationIDData]);

  useEffect(() => {
    if (
      authorityRespnseMessage !== null &&
      authorityRespnseMessage !== undefined &&
      authorityRespnseMessage !== "" &&
      authorityseverityMessage !== null
    ) {
      try {
        showMessage(authorityRespnseMessage, authorityseverityMessage, setOpen);
        setTimeout(() => {
          dispatch(clearAuthorityMessage());
        }, 4000);
      } catch (error) {}
    }
  }, [authorityRespnseMessage, authorityseverityMessage]);

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
            setChecklistTabs,
          ),
        );
      } else {
        console.log("complianceByMeList");
        dispatch(
          EditComplianceAPI(navigate, editComplianceData, t, setChecklistTabs),
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

  useEffect(() => {
    console.log("dueDate changed:", complianceDetailsState.dueDate);
  }, [complianceDetailsState.dueDate]);

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    let error = "";

    setComplianceDetailsState((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const MAX_TAG_LENGTH = 25;

  const handleInputChange = (newValue, actionMeta) => {
    if (actionMeta.action !== "input-change") return newValue;
    // remove leading spaces
    let trimmed = newValue.replace(/^\s+/, "");
    // enforce max length
    if (trimmed.length > MAX_TAG_LENGTH) {
      trimmed = trimmed.slice(0, MAX_TAG_LENGTH);
    }
    setTagsValue(trimmed);
    return trimmed;
  };

  const CharacterCountIndicator = ({ selectProps }) => {
    const length = selectProps.inputValue?.length || 0;

    return (
      <div
        style={{
          paddingRight: "8px",
          paddingTop: "20px",
          fontSize: "8px",
          fontFamily: "Montserrat",
          fontWeight: "600",
          color: length >= MAX_TAG_LENGTH ? "#f16b6b" : "#5a5a5a",
          whiteSpace: "nowrap",
        }}
      >
        {`${length} / ${MAX_TAG_LENGTH}`}
      </div>
    );
  };

  const handleCloseButton = () => {
    setCloseConfirmationModal(true);
  };

  const handleClickNextBtn = () => {
    if (complianceInfo.complianceId !== 0) {
      const tagsArr = complianceDetailsState.tags.map((data) => data.tagTitle);

      const Data = {
        complianceId: complianceInfo.complianceId,
        complianceTitle: complianceDetailsState.complianceTitle,
        description: complianceDetailsState.description,
        authorityId: complianceDetailsState.authority.value,
        criticality: complianceDetailsState.criticality.value,
        dueDate: multiDatePickerDateChangIntoUTC(
          complianceDetailsState.dueDate,
        ),
        newStatusId: complianceDetailsState.status.value,
        tags: tagsArr,
        ReasonToMakeComplianceOnHold:
          complianceDetailsState.status.value === 7 ||
          complianceDetailsState.status.value === 9
            ? complianceOnHoldReasonState
            : "", // On Hold Compliance
        OnHoldAlongWithComplianceCheckListAndTask:
          complianceDetailsState.status.value === 7
            ? complianceOnHoldSelectOption
            : complianceDetailsState.status.value === 9
              ? complianceCancelSelectOption
              : 0, // On Hold Compliance Including Checklist and Task
      };
      if (complianceDetailsState.status.value === 6) {
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
        console.log(
          "DataReOpenCompliance",
          reopenDataroomMap,
          complianceReopenDetailsState,
          DataReOpenCompliance,
        );
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
      console.log("complianceByMeList");
      dispatch(EditComplianceAPI(navigate, Data, t, setChecklistTabs));
      console.log("complianceReopenDetailsState", complianceReopenDetailsState);
      console.log(Data, "complianceReopenDetailsState");
      // dispatch(EditComplianceAPI(navigate, Data, t, setChecklistTabs));
    } else {
      const tagsArr = complianceDetailsState.tags.map((data) => data.tagTitle);
      const Data = {
        complianceTitle: complianceDetailsState.complianceTitle,
        description: complianceDetailsState.description,
        authorityId: complianceDetailsState.authority.value,
        criticality: complianceDetailsState.criticality.value,
        dueDate: complianceDetailsState.dueDate
          ? multiDatePickerDateChangIntoUTC(complianceDetailsState.dueDate)
          : null,
        tags: tagsArr,
      };
      dispatch(
        AddComplianceAPI(
          navigate,
          Data,
          t,
          setComplianceInfo,
          setChecklistTabs,
        ),
      );
    }
  };

  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);

    console.log(meetingDateValueFormat2, "meetingDateValueFormat2");

    setComplianceDetailsState((prev) => ({
      ...prev,
      dueDate: meetingDateValueFormat2,
    }));
  };

  const handleBlur = (event) => {
    if (complianceAddEditViewState === 3) return;
    const { name, value } = event.target;
    if (name !== "complianceTitle" || !value) return;
    const authorityId = complianceDetailsState.authority.value;
    if (!authorityId) return;
    const title = complianceDetailsState.complianceTitle;
    // 🆕 CREATE MODE → always check
    if (complianceAddEditViewState === 1) {
      const Data = {
        ComplianceTitle: title,
        AuthorityID: authorityId,
      };

      dispatch(
        CheckComplianceTitleExistsAPI(
          navigate,
          Data,
          t,
          setIsChecklistTitleExist,
          setErrors,
        ),
      );
      return;
    }

    // ✏️ EDIT MODE
    if (complianceAddEditViewState === 2 && viewComplianceByMeDetails) {
      const originalAuthorityId =
        viewComplianceByMeDetails.authority.authorityId;
      const originalTitle = viewComplianceByMeDetails.complianceTitle;

      const authorityChanged = authorityId !== originalAuthorityId;
      const titleChanged = title !== originalTitle;

      // ❌ nothing changed → don't hit API
      if (!authorityChanged && !titleChanged) return;

      const Data = {
        ComplianceTitle: title,
        AuthorityID: authorityId,
      };

      dispatch(
        CheckComplianceTitleExistsAPI(
          navigate,
          Data,
          t,
          setIsChecklistTitleExist,
          setErrors,
        ),
      );
    }
  };

  const handleSelectAuthority = (event) => {
    if (complianceDetailsState.complianceTitle === "") {
      setComplianceDetailsState((prev) => ({
        ...prev,
        authority: event,
      }));
    } else if (complianceDetailsState.complianceTitle !== "") {
      setErrors({
        complianceTitle: "",
      });
      setComplianceDetailsState((prev) => ({
        ...prev,
        authority: event,
      }));
      const Data = {
        ComplianceTitle: complianceDetailsState.complianceTitle,
        AuthorityID: event.value,
      };

      dispatch(
        CheckComplianceTitleExistsAPI(
          navigate,
          Data,
          t,
          setIsChecklistTitleExist,
          setErrors,
        ),
      );
    }
  };

  // Working for Tags
  const loadOptions = async (inputValue) => {
    if (inputValue.length < 3) return [];

    const tags = await dispatch(
      GetAllTagsByOrganizationIDAPI(navigate, inputValue, t),
    );

    return tags.map((tag) => ({
      label: tag.tagTitle,
      value: tag.tagID,
    }));
  };

  const handleSelectTag = (option) => {
    if (!option) return;
    if (complianceDetailsState.tags.length >= 5) return;

    const exists = complianceDetailsState.tags.some(
      (tag) => tag.tagTitle.toLowerCase() === option.label.toLowerCase(),
    );

    if (exists) return;

    setComplianceDetailsState((prev) => ({
      ...prev,
      tags: [
        ...prev.tags,
        {
          tagTitle: option.label,
          tagID: option.value || crypto.randomUUID(),
        },
      ],
    }));

    setTagsValue(""); // clear input
    setTagInputActive(false);
  };

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      borderColor:
        tagsValue.length >= MAX_TAG_LENGTH ? "#f16b6b" : base.borderColor,
      boxShadow:
        tagsValue.length >= MAX_TAG_LENGTH
          ? "#ff4d4f"
          : state.isFocused
            ? base.boxShadow
            : "none",
      "&:hover": {
        borderColor:
          tagsValue.length >= MAX_TAG_LENGTH ? "#f16b6b" : base.borderColor,
      },
    }),
  };

  // Status
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
          checkAnyTaskInProgress ||
          checkAnyChecklistOnPendingState
        ) {
          resetModalStates();
          setComlianceCompleteExceptionModal(true);
        } else {
          setComplianceDetailsState((prev) => ({
            ...prev,
            status: event,
          }));
        }
      }
    }

    // status change to Submit for Approval
    if (event.value === 5) {
      if (complianceDetailsState.status.value === 5) {
        // do nothing
      } else if (complianceDetailsState.status.value !== 5) {
        if (checkAnyChecklistOnPendingState || hasIncompleteChecklistOrTask) {
          console.log(
            checkAnyChecklistOnPendingState,
            checkAnyTaskInProgress,
            "CompliaceStatusOnHoldModal",
          );

          resetModalStates();
          setTempSelectedComplianceStatus(event);
          setSubmitForApprovalModal(true);
        } else {
          setComplianceDetailsState((prev) => ({
            ...prev,
            status: event,
          }));
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
      setComplianceDetailsState((prev) => ({
        ...prev,
        status: event,
      }));
    }
  };

  const isFormDisabled = isChecklistTitleExist === true;

  // Returns the min allowed Compliance Due Date based on active checklist due dates
  const getMinComplianceDueDate = () => {
    if (!GetComplianceChecklistsByComplianceId) return moment().toDate();

    const checklists =
      GetComplianceChecklistsByComplianceId.checklistList || [];

    // Only consider active checklists
    const activeChecklists = checklists.filter(
      (cl) => cl.status?.statusName !== "Inactive" && cl.dueDate,
    );

    if (activeChecklists.length === 0) return moment().toDate();

    // Get the latest due date among active checklists
    const maxChecklistDueDate = activeChecklists.reduce((max, cl) => {
      const clDate = parseYYYYMMDDToEndOfDay(cl.dueDate);
      return clDate > max ? clDate : max;
    }, parseYYYYMMDDToEndOfDay(activeChecklists[0].dueDate));

    // Add 1 day because Compliance due date must be after checklist due date
    return moment(maxChecklistDueDate).add(1, "days").toDate();
  };

  return (
    <>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Authority")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <Select
                isSearchable={true}
                isDisabled={isFormDisabled}
                options={authorityOptions}
                labelInValue={t("Authority")}
                onChange={handleSelectAuthority}
                value={complianceDetailsState.authority}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Authority") : ""
                }
                classNamePrefix="Select_country_Authoriy"
              />
            )}
          </div>
        </Col>
      </Row>
      <Row className="mt-2">
        <div className={styles["ConplianceTitleInput"]}>
          <InputfieldwithCount
            label={
              <>
                {t("Compliance-title")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            placeholder={
              complianceAddEditViewState !== 3 ? t("Compliance-title") : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={100}
            onChange={handleValueChange}
            name="complianceTitle"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_Name"
                : "AddEditAuthorityCounterInputField"
            }
            value={complianceDetailsState.complianceTitle}
            labelClass={styles["labelStyle"]}
            disabled={
              complianceDetailsState.authority.value === 0
                ? true
                : false || isFormDisabled
            }
            onBlur={handleBlur}
          />
          {console.log(errors, "COmplainceError")}
          <p
            className={
              errors.complianceTitle
                ? styles["errorMessage-inLogin"]
                : styles["errorMessage-inLogin_hidden"]
            }
          >
            {errors.complianceTitle}
          </p>
        </div>
        <div className={styles["ConplianceTitleInput_loading"]}>
          {isChecklistTitleExist === true ? (
            <Spinner size="md" className={styles["SpinnerClass"]} />
          ) : isChecklistTitleExist === false ? (
            <Check2 className={styles["CheckIcon"]} />
          ) : null}
        </div>
      </Row>
      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <TextAreafieldwithCount
            label={
              <>
                {t("compliance-description")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </>
            }
            labelClass={styles["labelStyle"]}
            placeholder={
              complianceAddEditViewState !== 3
                ? t("compliance-description")
                : ""
            }
            showCount={complianceAddEditViewState === 3 ? false : true}
            maxLength={500}
            onChange={handleValueChange}
            name="description"
            preFixClas={
              complianceAddEditViewState === 3
                ? "viewField_TextArea_Name"
                : "AddEditAuthorityCounterInputFieldTextArea"
            }
            value={complianceDetailsState.description}
            disabled={
              complianceDetailsState.authority.value === 0
                ? true
                : false || isFormDisabled
            }
          />
        </Col>
      </Row>

      <Row className="mt-2">
        <Col sm={12} md={6} lg={6}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Criticality")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <Select
                isSearchable={true}
                options={criticalityOptions}
                labelInValue={t("Criticality")}
                onChange={(event) =>
                  setComplianceDetailsState((prev) => ({
                    ...prev,
                    criticality: event,
                  }))
                }
                value={complianceDetailsState.criticality}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Criticality") : ""
                }
                classNamePrefix="Select_country_Authoriy"
                isDisabled={
                  complianceDetailsState.authority.value === 0
                    ? true
                    : false || isFormDisabled
                }
              />
            )}
          </div>
        </Col>
        <Col sm={12} md={6} lg={6}>
          <div className={`${styles["labelStyle"]} ${styles["Select_label"]}`}>
            {t("Due-date")}
            <span className={styles["sterick"]}>
              {complianceAddEditViewState !== 3 ? " *" : ""}
            </span>
          </div>
          <DatePicker
            value={complianceDetailsState?.dueDate}
            format={"DD/MM/YYYY"}
            minDate={getMinComplianceDueDate()}
            placeholder={t("Due-date")}
            render={
              <InputIcon
                placeholder={t("Due-date")}
                className={`${styles["datepicker_input"]} ${
                  complianceDetailsState?.authority?.value === 0 ||
                  complianceDetailsState?.status?.value === 6 ||
                  isFormDisabled
                    ? styles["disabledInput"]
                    : ""
                }`}
              />
            }
            editable={false}
            className="datePickerTodoCreate2"
            containerClassName={"Complaince_createEditDueDate"}
            onOpenPickNewDate={true}
            inputMode=""
            calendarPosition="bottom-center"
            calendar={gregorian}
            locale={currentLanguage === "en" ? gregorian_en : gregorian_ar}
            ref={calendRef}
            // onFocusedDateChange={changeComplainceDueDate}
            onChange={changeComplainceDueDate}
            disabled={
              complianceDetailsState.authority.value === 0 ||
              complianceDetailsState?.status?.value === 6
                ? true
                : false || isFormDisabled
            }
          />
        </Col>
      </Row>

      {complianceInfo.complianceId !== 0 && (
        <Row className="mt-2">
          <Col sm={12} md={4} lg={4}>
            <div
              className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
            >
              {t("Status")}
            </div>
            <div className={styles["Select_Authoriy_div"]}>
              <Select
                isSearchable={true}
                options={allowedComplianceStatusOptions}
                labelInValue={t("Status")}
                // onChange={(event) => setSelectCriticality(event)}

                onChange={handleChangeComplianceStatus}
                value={complianceDetailsState.status}
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Status") : ""
                }
                classNamePrefix="Select_country_Authoriy"
                isDisabled={
                  complianceDetailsState.authority.value === 0 ? true : false
                }
              />
            </div>
          </Col>
        </Row>
      )}

      <Row className="mt-2">
        <Col sm={12} md={12} lg={12}>
          <div className={styles["Select_Authoriy_div"]}>
            {complianceAddEditViewState === 3 ? (
              <span>{/* {selectCountry?.label} */}</span>
            ) : (
              <>
                <Row>
                  <Col sm={12} md={4} lg={4}>
                    <div
                      className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
                    >
                      {t("Tags")}
                    </div>
                    <div className="w-100 position-relative mt-1">
                      <AsyncCreatableSelect
                        cacheOptions
                        loadOptions={loadOptions}
                        value={null}
                        inputValue={tagsValue}
                        onInputChange={handleInputChange}
                        onChange={handleSelectTag}
                        styles={selectStyles}
                        classNamePrefix="tagInputBoxStyle"
                        isDisabled={
                          complianceDetailsState.tags.length >= 5 ||
                          complianceDetailsState.authority.value === 0 ||
                          isFormDisabled
                        }
                        maxMenuHeight={150}
                        placeholder="Type at least 3 characters..."
                        noOptionsMessage={({ inputValue }) =>
                          inputValue.length < 3
                            ? "No Tags"
                            : "No results, press Enter to add"
                        }
                        onFocus={() => setTagInputActive(true)}
                        onBlur={() => setTagInputActive(false)}
                        formatCreateLabel={(input) => `Add "${input}"`}
                        isOptionDisabled={(option) =>
                          complianceDetailsState.tags.some(
                            (tag) => tag.tagID === option.value,
                          )
                        }
                        components={{
                          DropdownIndicator: CharacterCountIndicator,
                          IndicatorSeparator: null,
                        }}
                      />
                    </div>
                  </Col>
                  <Col
                    sm={12}
                    md={8}
                    lg={8}
                    className="d-flex justify-content-start align-items-end flex-wrap"
                  >
                    {/* Selected Tags Outside */}
                    {complianceDetailsState.tags.length > 0 &&
                      complianceDetailsState.tags.map((tag) => (
                        <Tag
                          key={tag.tagID}
                          closable
                          className={styles["tagsStyle"]}
                          onClose={() =>
                            setComplianceDetailsState((prev) => ({
                              ...prev,
                              tags: prev.tags.filter(
                                (t) => t.tagID !== tag.tagID,
                              ),
                            }))
                          }
                        >
                          {tag.tagTitle}
                        </Tag>
                      ))}
                  </Col>
                </Row>
              </>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {!tagInputActive && (
          <div className={styles["limitLabel"]}>{t("Add-upto-5-tags")}</div>
        )}
      </Row>
      <div className={styles["buttonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleCloseButton}
        />
        <Button
          text={t("Next")}
          className={styles["Compliance_NextButton"]}
          onClick={handleClickNextBtn}
          disableBtn={
            isFormDisabled ||
            (complianceDetailsState.authority.value !== 0 &&
              complianceDetailsState.criticality.value !== 0 &&
              complianceDetailsState.dueDate !== "" &&
              complianceDetailsState.complianceTitle !== "" &&
              errors.complianceTitle === "")
              ? false
              : true
          }
        />
      </div>
      <Notification open={open} setOpen={setOpen} />
      <ComplianceCloseConfirmationModal />
      {complianceOnHoldModal && <CompliaceStatusOnHoldModal />}
      <ComplianceStatusCancelModal />
      <StatusSubmitForApprovalModal />
      <ComplianceStatusCompleteExceptionModal />
      {comlianceStatusReopenedModal && <ComplianceStatusReopenedModal />}
    </>
  );
};

export default ComplainceDetails;
