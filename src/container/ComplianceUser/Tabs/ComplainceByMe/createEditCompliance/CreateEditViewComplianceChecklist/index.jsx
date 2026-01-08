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
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AddComplianceChecklistAPI,
  CheckChecklistTitleExistsAPI,
  clearAuthorityMessage,
  EditComplianceChecklistAPI,
  GetComplianceChecklistsByComplianceIdAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import deleteIcon from "../../../../../../assets/images/Icon material-delete.png";
import editIcon from "../../../../../../assets/images/Icon material-edit.png";
import Accordion_Arrow from "../../../../../../assets/images/Accordion_Arrow.png";
import CustomAccordion from "../../../../../../components/elements/accordian/CustomAccordion";
import { formatDateToYMD } from "../../../../CommonComponents/commonFunctions";
import { Check2 } from "react-bootstrap-icons";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
// import ChecklistAccordion from "../../../../CommonComponents/ChecklistAccordian/CustomAccordion";
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
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity
  );
  // const [isCloseBtnClicked, setIsCloseBtnClicked] = useState(false);
  const [errors, setErrors] = useState({
    checklistTitle: "",
  });
  const [isChecklistTitleExist, setIsChecklistTitleExist] = useState(null);
  const [addChecklistCloseState, setAddChecklistCloseState] = useState(false);

  const [isEditTrue, setIsEditTrue] = useState(false);
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
  } = useComplianceContext();

  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId
  );
  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId"
  );
  let currentLanguage = localStorage.getItem("i18nextLng");
  // const [checkListData, setChecklistData] = useState({
  //   checklistTitle: "",
  //   checklistDescription: "",
  //   checklistDueDate: "",
  // });
  const changeComplainceDueDate = (date) => {
    let meetingDateValueFormat2 = new Date(date);
    meetingDateValueFormat2.setHours(23);
    meetingDateValueFormat2.setMinutes(59);
    meetingDateValueFormat2.setSeconds(58);
    setChecklistData((prev) => ({
      ...prev,
      checklistDueDate: meetingDateValueFormat2,
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
            checkListData.checklistDueDate
          ),
        };
        console.log(Data, "handleClickSaveBtn");
        dispatch(
          EditComplianceChecklistAPI(
            navigate,
            Data,
            t,
            complianceInfo,
            setChecklistData,
            setIsEditTrue
          )
        );
      } else {
        // Add
        const Data = {
          checkListTitle: checkListData.checklistTitle,
          description: checkListData.checklistDescription,
          complianceId: complianceInfo.complianceId,
          dueDate: multiDatePickerDateChangIntoUTC(
            checkListData.checklistDueDate
          ),
        };
        console.log(Data, "handleClickSaveBtn");
        dispatch(
          AddComplianceChecklistAPI(
            navigate,
            Data,
            t,
            complianceInfo,
            setChecklistData
          )
        );
      }
    }
  };

  const handleDeleteChecklist = (checklistID) => {
    // dispatch(showDeleteAuthorityModal(true));
    // setAuthorityId(authorityID);
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
          checklistDueDate: checklistData.dueDate
            ? moment(checklistData.dueDate, "YYYYMMDD").toDate()
            : null,
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
    // const complianceId = { complianceId: complianceInfo.complianceId };
    // dispatch(
    //   GetComplianceChecklistsByComplianceIdAPI(navigate, complianceId, t)
    // );
    return () => {
      dispatch(clearAuthorityMessage());
    };
  }, []);

  const [getCheckListData, setGetCheckListData] = useState([]);

  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId &&
      GetComplianceChecklistsByComplianceId !== null
    ) {
      setChecklistCount(
        GetComplianceChecklistsByComplianceId.checklistList.length
      );
      setGetCheckListData(GetComplianceChecklistsByComplianceId.checklistList);
      // 🔑 COLLAPSE ALL ACCORDIONS AFTER ADD
      setExpandedCheckListIds([]);
    } else {
      setChecklistCount(0);
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

  const handleClickPrevBtn = () => {
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
  };

  const handleBlur = (event) => {
    setIsChecklistTitleExist(null);
    setErrors({
      checklistTitle: "",
    });
    const { name, value } = event.target;

    if (complianceAddEditViewState === 3) return;
    if (complianceAddEditViewState === 2 || isEditTrue) {
      let getCheckObj = getCheckListData.find(
        (data, index) => data.checklistId === checkListData.checklistId
      );
      if (getCheckObj !== undefined) {
        if (getCheckObj.checklistTitle !== checkListData.checklistTitle) {
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
                setIsChecklistTitleExist
              )
            );
          }
        }
      }
      console.log(
        { getCheckObj, getCheckListData, checkListData },
        "handleBlur"
      );
      return;
    }

    // Checklist uniqueness (API placeholder)
    if (name === "checklistTitle" && value) {
      try {
        // if (complianceAddEditViewState === 2) {
        if (
          checkListData.checklistTitle !== null &&
          complianceInfo.complianceId !== 0
        ) {
          const Data = {
            ComplianceID: complianceInfo.complianceId,
            ChecklistTitle: checkListData.checklistTitle,
          };
          // call API here
          dispatch(
            CheckChecklistTitleExistsAPI(
              navigate,
              Data,
              t,
              setErrors,
              setIsChecklistTitleExist
            )
          );
        }
        // }
      } catch (error) {}
    }
  };

  const handleCloseButton = () => {
    emptyComplianceState();
    // take user back to ComplianceByMe screen
    setChecklistData({
      checklistTitle: "",
      checklistDescription: "",
      checklistDueDate: "",
    });
    setComplianceDetailsState({
      complianceTitle: "",
      description: "",
      authorityId: 0,
      criticality: 0,
      dueDate: "",
      complianceDueDateForChecklist: "",
      tags: [],
    });
    setChecklistTabs(1);
    setCreateEditComplaince(false);
  };
  return (
    <>
      {!addChecklistCloseState ? (
        <div ref={addChecklistRef}>
          <Row className="mt-2 d-flex flex-row">
            <div className={styles["checklistTitle"]}>
              <InputfieldwithCount
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
                value={checkListData.checklistDueDate}
                format={"DD/MM/YYYY"}
                minDate={moment().toDate()}
                placeholder={t("Due-date")}
                maxDate={complianceDetailsState.complianceDueDateForChecklist}
                render={
                  <InputIcon
                    placeholder={t("Due-date")}
                    className={styles["datepicker_input"]}
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
                onFocusedDateChange={changeComplainceDueDate}
                onChange={changeComplainceDueDate}
              />
            </div>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <TextAreafieldwithCount
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
        {getCheckListData?.length > 0
          ? getCheckListData.map((data, index) => {
              const isExpanded = expandedCheckListIds.find(
                (data2, index) => data2 === data.checklistId
              );

              console.log(isExpanded, "isExpandedisExpanded");
              return (
                <div key={index}>
                  <CustomAccordion
                    isExpand={isExpanded}
                    notesID={data.checklistId}
                    isCompliance={true}
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
                              {formatDateToYMD(data.dueDate)}
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
                      <>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="d-flex justify-content-end gap-3 align-items-center"
                          >
                            <img
                              className="cursor-pointer"
                              draggable="false"
                              alt=""
                              src={deleteIcon}
                              onClick={() =>
                                handleDeleteChecklist(data?.checklistId)
                              }
                            />
                            {/* Edit Checklist */}
                            <img
                              className="cursor-pointer"
                              draggable="false"
                              alt=""
                              src={editIcon}
                              onClick={() => handleEditChecklist(data)}
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
                    }
                  />
                </div>
              );
            })
          : null}
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
    </>
  );
};

export default CreateEditViewComplianceChecklist;
