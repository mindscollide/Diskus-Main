import React, { useEffect, useRef, useState } from "react";
import styles from "./createEditViewComplianceChecklist.module.css";
import { Col, Row, Spinner } from "react-bootstrap";
import {
  InputfieldwithCount,
  TextAreafieldwithCount,
} from "../../../../../../components/elements/input_field/Input_field_withCount";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePicker from "react-multi-date-picker";
import moment from "moment";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { Button, Notification } from "../../../../../../components/elements";
import {
  _justShowDateformatBilling,
  forRecentActivity,
  multiDatePickerDateChangIntoUTC,
} from "../../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddComplianceChecklistAPI,
  CheckChecklistTitleExistsAPI,
  clearAuthorityMessage,
  clearComplianceDetailsData,
  DeleteCheckListAPI,
  EditComplianceChecklistAPI,
  GetComplianceChecklistsByComplianceIdAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import deleteIcon from "../../../../../../assets/images/Icon material-delete.png";
import editIcon from "../../../../../../assets/images/Icon material-edit.png";
import Accordion_Arrow from "../../../../../../assets/images/Accordion_Arrow.png";
import CustomAccordion from "../../../../../../components/elements/accordian/CustomAccordion";
import {
  formatDateToYMD,
  parseUTCDateString,
} from "../../../../CommonComponents/commonFunctions";
import { Check2 } from "react-bootstrap-icons";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";
import DeleteChecklistConfirmationModal from "../../../../CommonComponents/DeleteChecklistConfirmationModal";
const CreateEditViewComplianceChecklist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const checklistTitleRef = useRef(null);
  const addChecklistRef = useRef(null);
  const cancelBtnRef = useRef(null);
  const accordionContainerRef = useRef(null);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const authorityRespnseMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage,
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity,
  );

  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId,
  );
  // const [isCloseBtnClicked, setIsCloseBtnClicked] = useState(false);
  const [errors, setErrors] = useState({
    checklistTitle: "",
  });
  const [isChecklistTitleExist, setIsChecklistTitleExist] = useState(null);
  const [addChecklistCloseState, setAddChecklistCloseState] = useState(false);

  const [isEditTrue, setIsEditTrue] = useState(false);

  const [getCheckListData, setGetCheckListData] = useState([]);

  const {
    complianceAddEditViewState,
    complianceInfo,
    setChecklistCount,
    setChecklistTabs,
    setCreateEditComplaince,
    complianceDetailsState,
    setComplianceDetailsState,
    checkListData,
    emptyComplianceState,
    setChecklistData,
    setCloseConfirmationModal,
    setDeleteChecklistConfirmationModalState,
    setDeleteChecklistId,
    newChecklistIds,
    setNewChecklistIds,
    setTaskCount,
  } = useComplianceContext();
  console.log(checkListData, "checkListData");
  console.log(newChecklistIds, "newChecklistIds");
  console.log(complianceDetailsState, "complianceDetailsState");
  console.log(complianceAddEditViewState, "complianceAddEditViewState");
  console.log(isChecklistTitleExist, "isChecklistTitleExist");

  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId,
  );

  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId",
  );

  let currentLanguage = localStorage.getItem("i18nextLng");

  const changeComplainceDueDate = (date) => {
    setChecklistData((prev) => ({
      ...prev,
      checklistDueDate: new Date(date), // keep the date object as is
    }));
  };

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    console.log("handleValueChange", name, value);
    let error = "";

    switch (name) {
      case "checklistTitle":
        setIsChecklistTitleExist(null);
        if (!value.trim()) {
          setErrors({
            checklistTitle: "Checklist Title is required",
          });
        }
        break;

      default:
        break;
    }
    setChecklistData((prev) => ({
      ...prev,
      [name]: value.trimStart(),
    }));
  };

  const handleClickSaveBtn = () => {
    if (complianceInfo.complianceId !== 0) {
      setIsChecklistTitleExist(null);
      if (isEditTrue) {
        // Update;
        const Data = {
          checklistId: isEditTrue ? checkListData.checklistId : 0,
          checkListTitle: checkListData.checklistTitle,
          description: checkListData.checklistDescription,
          complianceId: complianceInfo.complianceId,
          dueDate: multiDatePickerDateChangIntoUTC(
            checkListData.checklistDueDate,
          ),
        };
        dispatch(
          EditComplianceChecklistAPI(
            navigate,
            Data,
            t,
            complianceInfo,
            setChecklistData,
            setIsEditTrue,
          ),
        );
      } else {
        // Add
        const Data = {
          checkListTitle: checkListData.checklistTitle,
          description: checkListData.checklistDescription,
          complianceId: complianceInfo.complianceId,
          dueDate: multiDatePickerDateChangIntoUTC(
            checkListData.checklistDueDate,
          ),
        };
        console.log(Data, "handleClickSaveBtn");
        dispatch(
          AddComplianceChecklistAPI(
            navigate,
            Data,
            t,
            complianceInfo,
            setChecklistData,
            setNewChecklistIds,
          ),
        );
      }
    }
  };

  const handleDeleteChecklist = (checklistID) => {
    console.log(checklistID, "checklistID");
    if (checklistID) {
      setDeleteChecklistId(checklistID);
      setDeleteChecklistConfirmationModalState(true);
    }
  };

  const handleEditChecklist = (checklistData) => {
    console.log(checklistData, "checklistData");
    if (checklistData)
      try {
        setAddChecklistCloseState(false);
        setIsEditTrue(true);
        setChecklistData({
          checklistId: checklistData.checklistId,
          checklistTitle: checklistData.checklistTitle,
          checklistDescription: checklistData.checklistDescription,
          checklistDueDate: checklistData.checklistDueDate,
        });
      } catch (error) {}
  };

  useEffect(() => {
    if (complianceAddEditViewState !== 3) {
      checklistTitleRef.current &&
        checklistTitleRef.current.focus({
          cursor: "start",
        });
    }
    return () => {
      setChecklistData({
        checklistId: 0,
        checklistTitle: "",
        checklistDescription: "",
        checklistDueDate: "",
      });
    };
  }, []);

  useEffect(() => {
    if (complianceInfo.complianceId !== 0) {
      let Data = {
        complianceId: complianceInfo.complianceId,
      };
      dispatch(GetComplianceChecklistsByComplianceIdAPI(navigate, Data, t));
    }
  }, [complianceInfo]);

  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId &&
      GetComplianceChecklistsByComplianceId !== null
    ) {
      setChecklistCount(
        GetComplianceChecklistsByComplianceId?.checklistList?.length,
      );
      let updateTIme = GetComplianceChecklistsByComplianceId?.checklistList.map(
        (data, index) => {
          return {
            ...data,
            checklistDueDate: forRecentActivity(data.dueDate + data.dueTime),
          };
        },
      );

      console.log(updateTIme, "updateTIme");
      setGetCheckListData(updateTIme);
      // 🔑 COLLAPSE ALL ACCORDIONS AFTER ADD
      setExpandedCheckListIds([]);
    } else {
      setChecklistCount(0);
      setGetCheckListData([]); // ✅ IMPORTANT FIX
      setExpandedCheckListIds([]); // optional but clean
      setTaskCount(0);
    }
  }, [GetComplianceChecklistsByComplianceId]);

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

  const parseComplianceDueDate = (dueDate) => {
    if (!dueDate) return null;

    const dateStr = String(dueDate);

    // ISO format
    if (dateStr.includes("T")) {
      return new Date(dateStr);
    }

    // YYYYMMDDHHMMSS format
    if (dateStr.length === 14) {
      const year = dateStr.slice(0, 4);
      const month = dateStr.slice(4, 6) - 1;
      const day = dateStr.slice(6, 8);
      const hour = dateStr.slice(8, 10);
      const minute = dateStr.slice(10, 12);
      const second = dateStr.slice(12, 14);

      return new Date(year, month, day, hour, minute, second);
    }

    return null;
  };

  const maxChecklistDate = React.useMemo(() => {
    const parsedDate = parseComplianceDueDate(complianceDetailsState?.dueDate);

    if (!parsedDate) return null;

    parsedDate.setHours(0, 0, 0, 0);
    parsedDate.setDate(parsedDate.getDate() - 1);

    return parsedDate;
  }, [complianceDetailsState?.dueDate]);

  const handleClickPrevBtn = () => {
    setChecklistData({
      checklistTitle: "",
      checklistDescription: "",
      checklistDueDate: "",
    });
    setChecklistTabs(1);
    // if (complianceInfo.complianceId !== 0) {
    //   const Data = {
    //     complianceId: complianceInfo.complianceId,
    //   };

    //   dispatch(ViewComplianceByIdAPI(navigate, Data, t));
    // }
  };

  const handleClickExpandCheckList = (data) => {
    setExpandedCheckListIds((prev) => {
      if (prev.includes(data.checklistId)) {
        // collapse

        return prev.filter((id) => id !== data.checklistId);
      } else {
        setAddChecklistCloseState(true);
        // expand
        return [...prev, data.checklistId];
      }
    });
  };

  const handleCloseAddChecklistButton = () => {
    setIsEditTrue(false);
    setErrors({
      checklistTitle: "",
    });
    setIsChecklistTitleExist(null);
    setChecklistData({
      checklistTitle: "",
      checklistDescription: "",
      checklistDueDate: "",
    });
  };

  const handleOpenAddChecklist = () => {
    setAddChecklistCloseState(false);
    setIsEditTrue(false); // make sure we are in create mode
    setChecklistData({
      checklistId: 0,
      checklistTitle: "",
      checklistDescription: "",
      checklistDueDate: "", // set to today by default
    });
  };

  const handleBlur = (event) => {
    setIsChecklistTitleExist(null);
    setErrors({ checklistTitle: "" });

    const { name, value } = event.target;

    // View mode: do nothing
    if (complianceAddEditViewState === 3) return;

    if (name === "checklistTitle" && value) {
      // Always run uniqueness check in edit or add mode
      if (complianceInfo.complianceId !== 0) {
        const Data = {
          ComplianceID: complianceInfo.complianceId,
          ChecklistTitle: checkListData.checklistTitle,
        };
        dispatch(
          CheckChecklistTitleExistsAPI(
            navigate,
            Data,
            t,
            setErrors,
            setIsChecklistTitleExist,
          ),
        );
      }
    }
  };

  const handleCloseButton = () => {
    // emptyComplianceState();
    // setChecklistTabs(1);
    // setCreateEditComplaince(false);
    setNewChecklistIds([]);
    setCloseConfirmationModal(true);
  };

  const today = React.useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isLockedStatus =
    complianceDetailsState?.status?.value === 9 ||
    complianceDetailsState?.status?.value === 5 ||
    complianceDetailsState?.status?.value === 3;

  console.log({ isLockedStatus, complianceDetailsState }, "isLockedStatus");

  const isReopendCompliance = complianceDetailsState?.status?.value === 6;

  const getMinChecklistDueDateFromTasks = () => {
    if (!getAllComplianceChecklistTask?.checklistList) return today;

    let tasks = [];

    if (checkListData.checklistId !== 0) {
      // EDIT FLOW: current checklist ke tasks
      const checklist = getAllComplianceChecklistTask.checklistList.find(
        (cl) => cl.checklistId === checkListData.checklistId,
      );
      tasks = checklist?.taskList || [];
    } else {
      // CREATE FLOW: new checklist ke tasks
      tasks = checkListData?.taskList || [];
    }

    // Sirf active tasks
    const activeTasks = tasks.filter((task) => task.taskStatusId !== 5);

    if (activeTasks.length === 0) return today;

    // Maximum due date among active tasks
    const maxTaskDate = activeTasks.reduce((max, task) => {
      const taskDate = new Date(
        task.deadLineDate.slice(0, 4),
        task.deadLineDate.slice(4, 6) - 1,
        task.deadLineDate.slice(6, 8),
      );
      return taskDate > max ? taskDate : max;
    }, new Date(0));

    return maxTaskDate;
  };

  const editableStatuses = new Set([1, 2, 4, 7]);

  const statusValue = complianceDetailsState?.status?.value;

  const isComplianceEditable =
    statusValue !== undefined && editableStatuses.has(statusValue);

  console.log(
    { isComplianceEditable, editableStatuses, statusValue },
    "isComplianceEditable",
  );

  return (
    <>
      {!addChecklistCloseState ? (
        <div ref={addChecklistRef}>
          <Row className="mt-2 d-flex flex-row">
            <div className={styles["checklistTitle"]}>
              <InputfieldwithCount
                disabled={isLockedStatus && !isEditTrue}
                ref={checklistTitleRef}
                label={
                  <>
                    {t("Checklist-title")}
                    <span className={styles["sterick"]}>
                      {complianceAddEditViewState !== 3 ? " *" : ""}
                    </span>
                  </>
                }
                placeholder={
                  complianceAddEditViewState !== 3 ? t("Checklist-title") : ""
                }
                showCount={complianceAddEditViewState === 3 ? false : true}
                maxLength={100}
                onChange={handleValueChange}
                name="checklistTitle"
                onBlur={handleBlur}
                preFixClas={
                  complianceAddEditViewState === 3
                    ? "viewField_Name"
                    : "AddEditAuthorityCounterInputField"
                }
                value={checkListData.checklistTitle}
                labelClass={styles["labelStyle"]}
              />
              <p
                className={
                  errors.checklistTitle
                    ? styles["errorMessage-inLogin"]
                    : styles["errorMessage-inLogin_hidden"]
                }
              >
                {errors.checklistTitle}
              </p>
            </div>
            <div className={styles["checklistTitle_Loader"]}>
              {/* <Spinner size="md" className={styles["SpinnerClass"]} /> */}
              {isChecklistTitleExist === true ? (
                <Spinner size="md" className={styles["SpinnerClass"]} />
              ) : isChecklistTitleExist === false ? (
                <Check2 className={styles["CheckIcon"]} />
              ) : null}
            </div>
            <div className={styles["checklistDueDate"]}>
              <div
                className={`${styles["labelStyle"]} ${styles["Select_label"]}`}
              >
                {t("Due-date")}
                <span className={styles["sterick"]}>
                  {complianceAddEditViewState !== 3 ? " *" : ""}
                </span>
              </div>
              <DatePicker
                disabled={isLockedStatus && !isEditTrue}
                value={checkListData.checklistDueDate || ""}
                format={"DD/MM/YYYY"}
                placeholder={t("Due-date")}
                render={
                  <InputIcon
                    placeholder={t("Due-date")}
                    className={`${styles["datepicker_input"]} ${
                      (isLockedStatus && !isEditTrue) || isChecklistTitleExist
                        ? styles["disabledInput"]
                        : ""
                    }`}
                  />
                }
                editable={false}
                className="datePickerTodoCreate2"
                containerClassName={"Complaince_createEditDueDate"}
                onFocusedDateChange={changeComplainceDueDate}
                onChange={changeComplainceDueDate}
                maxDate={maxChecklistDate}
                calendar={gregorian}
                locale={currentLanguage === "en" ? gregorian_en : gregorian_ar}
                calendarPosition="bottom-center"
                minDate={getMinChecklistDueDateFromTasks()}
              />
            </div>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <TextAreafieldwithCount
                disabled={
                  (isLockedStatus && !isEditTrue) || isChecklistTitleExist
                }
                label={
                  <>
                    {t("Checklist-description")}
                    <span className={styles["sterick"]}>
                      {complianceAddEditViewState !== 3 ? " *" : ""}
                    </span>
                  </>
                }
                labelClass={styles["labelStyle"]}
                placeholder={
                  complianceAddEditViewState !== 3
                    ? t("Checklist-description")
                    : ""
                }
                showCount={complianceAddEditViewState === 3 ? false : true}
                maxLength={500}
                onChange={handleValueChange}
                name="checklistDescription"
                preFixClas={
                  complianceAddEditViewState === 3
                    ? "viewField_TextArea_Name"
                    : "AddEditAuthorityCounterInputFieldTextArea"
                }
                value={checkListData.checklistDescription}
              />
            </Col>
          </Row>

          <div ref={cancelBtnRef} className={styles["ChecklistButtonPosition"]}>
            <Button
              text={t("Cancel")}
              className={styles["Compliance_CloseButton"]}
              onClick={handleCloseAddChecklistButton}
              disableBtn={isLockedStatus && !isEditTrue}
            />
            <Button
              text={isEditTrue ? t("Update") : t("Add")}
              className={styles["Compliance_NextButton"]}
              onClick={handleClickSaveBtn}
              disableBtn={
                checkListData.checklistDescription !== "" &&
                checkListData.checklistDueDate !== "" &&
                checkListData.checklistTitle !== "" &&
                errors.checklistTitle === ""
                  ? false
                  : true
              }
            />
          </div>
        </div>
      ) : (
        <Row className="mt-2">
          <Col sm={12} md={12} lg={12}>
            <div
              className={styles["createNewChecklistStyle"]}
              onClick={handleOpenAddChecklist}
            >
              {t("Create-new-checklist")}
            </div>
          </Col>
        </Row>
      )}

      <Row className="mt-2">
        <Col sm={12} md={12} lg={12} className={styles["labelStyle"]}>
          {t("Checklists")}
        </Col>
      </Row>

      <div
        ref={accordionContainerRef}
        className={
          addChecklistCloseState
            ? styles["checklistAccordian_closed"]
            : styles["checklistAccordian"]
        }
      >
        {getCheckListData?.length > 0 ? (
          getCheckListData.map((data, index) => {
            const isExpanded = expandedCheckListIds.find(
              (data2, index) => data2 === data.checklistId,
            );

            return (
              <div key={index}>
                <CustomAccordion
                  isExpand={isExpanded}
                  notesID={data.checklistId}
                  isCompliance={true}
                  isComplianceTask={false}
                  StartField={
                    <>
                      {isExpanded ? (
                        <div>
                          <p className={styles["labelStyle"]}>
                            {t("Checklist-title")}
                          </p>
                          <p
                            className={`m-0 ${styles["ViewChecklistDetailStyles"]} ${styles["truncateTitle"]}`}
                          >
                            {data.checklistTitle}
                          </p>
                        </div>
                      ) : (
                        <p
                          className={`m-0 ${styles["ViewChecklistDetailStyles_notexpanded"]} ${styles["truncateTitle"]}`}
                        >
                          {data.checklistTitle}
                        </p>
                      )}
                    </>
                  }
                  centerField={
                    <>
                      {isExpanded ? (
                        <div>
                          <p className={styles["labelStyle"]}>
                            {t("Due-date")}
                          </p>
                          <p className={styles["ViewChecklistDetailStyles"]}>
                            {moment(
                              forRecentActivity(data.dueDate + data.dueTime),
                            ).format("DD MMM YYYY")}
                          </p>
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  }
                  attachmentsRow={
                    <>
                      <div>
                        <p className={styles["labelStyle"]}>
                          {t("Description")}
                        </p>{" "}
                        <p className={styles["ViewChecklistDetailStyles"]}>
                          {data.checklistDescription}
                        </p>
                      </div>
                    </>
                  }
                  endField={
                    (isComplianceEditable ||
                      newChecklistIds?.includes(data?.checklistId)) && (
                      <>
                        <Row key={data.checklistId}>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="d-flex justify-content-end gap-3 align-items-center"
                          >
                            <img
                              className={`${!isLockedStatus ? "cursor-pointer" : styles["NoCursorAlign"]}`}
                              draggable="false"
                              alt=""
                              src={deleteIcon}
                              disabled={isLockedStatus}
                              onClick={() =>
                                !isLockedStatus &&
                                handleDeleteChecklist(data?.checklistId)
                              }
                            />
                            {/* Edit Checklist */}
                            <img
                              className={`${!isLockedStatus ? "cursor-pointer" : styles["NoCursorAlign"]}`}
                              draggable="false"
                              alt=""
                              src={editIcon}
                              disabled={isLockedStatus}
                              onClick={() =>
                                !isLockedStatus && handleEditChecklist(data)
                              }
                            />
                            <img
                              src={Accordion_Arrow}
                              onClick={() => handleClickExpandCheckList(data)}
                              alt=""
                              className={`cursor-pointer
                                  ${
                                    isExpanded
                                      ? null
                                      : styles["AccordionArrowDown"]
                                  }`}
                            />
                          </Col>
                        </Row>
                      </>
                    )
                  }
                />
              </div>
            );
          })
        ) : (
          <div className={styles["noChecklistMsg"]}>
            {t("No-checklist-available")}
          </div>
        )}
      </div>

      {/* Main Button */}
      <div className={styles["mainButtonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleCloseButton}
        />
        <Button
          text={t("Previous")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleClickPrevBtn}
          // disableBtn={
          //   complianceDetails.complianceTitle !== "" &&
          //   complianceDetails.complianceDescription !== "" &&
          //   selectAuthority !== "" &&
          //   selectCriticality !== "" &&
          //   complianceDueDate !== ""
          //     ? false
          //     : true
          // }
        />
      </div>
      <Notification open={open} setOpen={setOpen} />
      <ComplianceCloseConfirmationModal />
      <DeleteChecklistConfirmationModal />
    </>
  );
};

export default CreateEditViewComplianceChecklist;
