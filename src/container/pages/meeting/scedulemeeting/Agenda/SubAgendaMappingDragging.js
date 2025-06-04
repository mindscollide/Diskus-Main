import React, { useContext, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { TextField, Button } from "../../../../../components/elements";
import styles from "./Agenda.module.css";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import { useTranslation } from "react-i18next";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import {
  showAgenItemsRemovedModal,
  UpateMeetingStatusLockApiFunc,
} from "../../../../../store/actions/NewMeetingActions";
// import { resolutionResultTable } from "../../../../../commen/functions/date_formater";
import { useDispatch } from "react-redux";
import desh from "../../../../../assets/images/desh.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import { Radio } from "antd";
import Key from "../../../../../assets/images/KEY.svg";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import AttachmentIcon from "../../../../../assets/images/Attachment.svg";
import closedLocked from "../../../../../assets/images/CloseLocked.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import Lock from "../../../../../assets/images/LOCK.svg";
import Cast from "../../../../../assets/images/CAST.svg";
import SubDocumnets from "./SubDocumnets";
import SubUrls from "./SubUrls";
import SubRequestContributor from "./SubRequestContributor";
import SubDedaultDragger from "./SubDedaultDragger";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import { useEffect } from "react";
import { MeetingContext, useMeetingContext } from "../../../../../context/MeetingContext";

const SubAgendaMappingDragging = ({
  data,
  index,
  setRows,
  rows,
  subexpandIndex,
  expandSubIndex,
  subExpand,
  parentIslockedCheck,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  setsubexpandIndex,
  setExpandSubIndex,
  setSubExpand,
  openAdvancePermissionModal,
  openVoteMOdal,
  fileForSend,
  setFileForSend,
  allUsersRC,
  setAllUsersRC,
}) => {
  const { t } = useTranslation();
  //Timepicker
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { editorRole } = useMeetingContext();

  const { isAgendaUpdateWhenMeetingActive } = useContext(MeetingContext);
  const getMeetingusers = useSelector(
    (state) => state.NewMeetingreducer.getMeetingusers
  );
  // const getAllMeetingDetails = useSelector(
  //   (state) => state.NewMeetingreducer.getAllMeetingDetails
  // );

  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const dispatch = useDispatch();
  // const { Dragger } = Upload;

  const navigate = useNavigate();
  // function getCurrentUTCDate() {
  //   const currentDate = new Date();
  //   const year = currentDate.getUTCFullYear();
  //   const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
  //   const day = String(currentDate.getUTCDate()).padStart(2, "0");

  //   return `${year}${month}${day}`;
  // }

  // Function to handle changes in sub-agenda title
  const handleSubAgendaTitleChange = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedRows = [...rows];
    if (name === "subTitle") {
      updatedRows[index].subAgenda[subIndex].subTitle = value;
    }
    setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda select
  // const handleSubAgendaSelectChange = (index, subIndex, value) => {
  //   const updatedRows = [...rows];
  //   let SelectValue = {
  //     value: value.value,
  //     label: value.label,
  //   };
  //   updatedRows[index].subAgenda[subIndex].selectedOption = SelectValue;
  //   console.log(updatedRows, "SubagendaSelectSubagendaSelect");
  //   setRows(updatedRows);
  // };

  const handleSelectChange = (index, subIndex, value) => {
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedAgendaItems[index].subAgenda[subIndex].presenterID =
      SelectValue.value;
    updatedAgendaItems[index].subAgenda[subIndex].presenterName =
      SelectValue.label;
    setRows(updatedAgendaItems);
  };

  // Function to handle changes in sub-agenda start date
  const handleSubAgendaStartDateChange = (index, subIndex, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const formattedDateTimeString =
        newDate.toDateString() + " " + newDate.toTimeString();
      const dateObject = new Date(formattedDateTimeString);
      const updatedRows = [...rows];
      updatedRows[index].subAgenda[subIndex].startDate = dateObject;
      setRows(updatedRows);
      // You can use 'formattedTime' as needed.
    } else {
      console.error("Invalid date and time object:", date);
    }
    // const updatedRows = [...rows];
    // updatedRows[index].subAgenda[subIndex].startDate = date;
    // console.log(updatedRows, "startCasestartCasestartCase");
    // setRows(updatedRows);
  };

  // Function to handle changes in sub-agenda end date
  const handleSubAgendaEndDateChange = (index, subIndex, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const formattedDateTimeString =
        newDate.toDateString() + " " + newDate.toTimeString();
      const dateObject = new Date(formattedDateTimeString);
      const updatedRows = [...rows];
      updatedRows[index].subAgenda[subIndex].endDate = dateObject;
      setRows(updatedRows);
      // You can use 'formattedTime' as needed.
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  //Function For removing Subagendas
  const handleCrossSubAjenda = (index, subIndex) => {
    dispatch(showAgenItemsRemovedModal(true));
    setAgendaItemRemovedIndex(index);
    setSubajendaRemoval(subIndex);
  };

  // Initialize the subExpand state based on the number of rows and subAgendas
  useEffect(() => {
    const initialState = rows.map((row) =>
      Array(row.subAgenda.length).fill(false)
    );
    setSubExpand(initialState);
  }, [rows]);

  //Function For Handling See More For Subagendas
  const handleSubMenuExpand = (index, subIndex) => {
    // Close all subAgendas in the current row except the one you're expanding
    // const updatedSubExpand = Array(rows[index].subAgenda.length).fill(false);
    // updatedSubExpand[subIndex] = true;

    // setsubexpandIndex(index);
    // setExpandSubIndex(subIndex);
    // setSubExpand(updatedSubExpand);
    // Close all subAgendas in the current row except the one you're expanding
    // If the clicked subAgenda is already open, close it
    const isAlreadyExpanded = subExpand[index][subIndex];

    // Close the clicked subAgenda if it's already expanded
    if (isAlreadyExpanded) {
      setSubExpand((prevSubExpand) => {
        const updatedSubExpand = [...prevSubExpand];
        updatedSubExpand[index][subIndex] = false;
        return updatedSubExpand;
      });
      setsubexpandIndex(-1);
      setExpandSubIndex(-1);
    } else {
      // Close all other subAgendas in the current row except the one you're expanding
      const updatedSubExpand = rows.map((row, i) =>
        i === index ? Array(row.subAgenda.length).fill(false) : subExpand[i]
      );
      updatedSubExpand[index][subIndex] = true;

      setSubExpand(updatedSubExpand);
      setsubexpandIndex(index);
      setExpandSubIndex(subIndex);
    }
  };

  // Function to handle changes in sub-agenda radio group
  const handleSubAgendaRadioChange = (index, subIndex, e) => {
    let value = e.target.value;
    const updatedRows = [...rows];
    updatedRows[index].subAgenda[subIndex].subSelectRadio = value;
    if (updatedRows[index].subAgenda[subIndex].subSelectRadio === 1) {
      updatedRows[index].subAgenda[
        subIndex
      ].subAgendarequestContributorUrlName = "";
      updatedRows[index].subAgenda[
        subIndex
      ].subAgendarequestContributorEnterNotes = "";
      updatedRows[index].subAgenda[subIndex].subAgendaUrlFieldRadio = "";
      updatedRows[index].subAgenda[subIndex].userID = 0;
    } else if (updatedRows[index].subAgenda[subIndex].subSelectRadio === 2) {
      updatedRows[index].subAgenda[subIndex].subfiles = [];
      updatedRows[index].subAgenda[subIndex].mainNote = "";
      updatedRows[index].subAgenda[subIndex].requestContributorURlName = "";
      updatedRows[index].subAgenda[subIndex].userID = 0;
    } else if (updatedRows[index].subAgenda[subIndex].subSelectRadio === 3) {
      updatedRows[index].subAgenda[subIndex].subfiles = [];
      updatedRows[index].subAgenda[subIndex].subAgendaUrlFieldRadio = "";
    }
    setRows(updatedRows);
  };

  const handleAgendaDescription = (index, subIndex, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedAgendaItems = [...rows];
    if (name === "Description") {
      updatedAgendaItems[index].subAgenda[subIndex].description = value;
    }
    setRows(updatedAgendaItems);
  };

  const lockFunctionActiveSubMenus = async (
    parentIndex,
    subAgendaID,
    isLocked
  ) => {
    let Data = {
      AgendaID: subAgendaID,
      Islocked: !isLocked,
    };
    let flag = await new Promise((resolve) => {
      dispatch(
        UpateMeetingStatusLockApiFunc(navigate, t, Data, 1, (updatedFlag) =>
          resolve(updatedFlag)
        )
      );
    });
    if (flag) {
      setRows((prevRows) => {
        // Find the parent row using parentIndex
        const parentRow = prevRows[parentIndex];
        // Find the index of the subMenu in the subAgenda array
        const subMenuIndex = parentRow.subAgenda.findIndex(
          (subMenu) => subMenu.subAgendaID === subAgendaID
        );

        // If the subMenu is found, update its isLocked value
        if (subMenuIndex !== -1) {
          const newRows = [...prevRows];
          newRows[parentIndex].subAgenda[subMenuIndex].isLocked =
            !newRows[parentIndex].subAgenda[subMenuIndex].isLocked;
          return newRows;
        }

        // If the subMenu is not found, return the original state
        return prevRows;
      });
    } else {
    }
  };

  // useEffect(() => {
  //   if (
  //     getAllMeetingDetails !== null &&
  //     getAllMeetingDetails !== undefined &&
  //     getAllMeetingDetails.length !== 0 &&
  //     Object.keys(getAllMeetingDetails) !== 0
  //   ) {
  //     const updatedAgendaItems = [...rows];

  //     let meetingStartTime =
  //       getAllMeetingDetails.advanceMeetingDetails.meetingDates[0].meetingDate +
  //       getAllMeetingDetails.advanceMeetingDetails.meetingDates[0].startTime;
  //     let meetingEndTime =
  //       getAllMeetingDetails.advanceMeetingDetails.meetingDates[0].meetingDate +
  //       getAllMeetingDetails.advanceMeetingDetails.meetingDates[0].endTime;

  //     if (updatedAgendaItems[index].subAgenda.length > 0) {
  //       updatedAgendaItems[index].subAgenda[expandSubIndex].startDate =
  //         resolutionResultTable(meetingStartTime);
  //       updatedAgendaItems[index].subAgenda[expandSubIndex].endDate =
  //         resolutionResultTable(meetingEndTime);

  //       setRows(updatedAgendaItems);
  //     }
  //   }
  // }, [getAllMeetingDetails]);

  // useEffect(() => {
  //   if (
  //     getAllMeetingDetails !== null &&
  //     getAllMeetingDetails !== undefined &&
  //     getAllMeetingDetails.length !== 0 &&
  //     Object.keys(getAllMeetingDetails) !== 0
  //   ) {
  //     const updatedAgendaItems = [...rows];

  //     if (updatedAgendaItems[index].subAgenda.length > 0) {
  //       updatedAgendaItems[index].subAgenda.forEach((subAgenda, subIndex) => {
  //         let meetingStartTime =
  //           getAllMeetingDetails.advanceMeetingDetails.meetingDates[0]
  //             .meetingDate +
  //           getAllMeetingDetails.advanceMeetingDetails.meetingDates[0]
  //             .startTime;
  //         let meetingEndTime =
  //           getAllMeetingDetails.advanceMeetingDetails.meetingDates[0]
  //             .meetingDate +
  //           getAllMeetingDetails.advanceMeetingDetails.meetingDates[0].endTime;

  //         updatedAgendaItems[index].subAgenda[subIndex].startDate =
  //           resolutionResultTable(meetingStartTime);
  //         updatedAgendaItems[index].subAgenda[subIndex].endDate =
  //           resolutionResultTable(meetingEndTime);
  //       });
  //     }

  //     setRows(updatedAgendaItems);
  //   }
  // }, [getAllMeetingDetails]);

  useEffect(() => {
    if (currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (
      getMeetingusers  !== null
    ) {
      const newData = {
        meetingOrganizers: getMeetingusers.meetingOrganizers,
        meetingParticipants: getMeetingusers.meetingParticipants,
        meetingAgendaContributors: getMeetingusers.meetingAgendaContributors,
      };
      setAllPresenters(newData);
    }
  }, [getMeetingusers]);

  useEffect(() => {
    if (allPresenters.lenth > 0 || Object.keys(allPresenters).length > 0) {
      const allPresentersReducer = [
        ...allPresenters.meetingOrganizers,
        ...allPresenters.meetingAgendaContributors,
        ...allPresenters.meetingParticipants,
      ];
      setPresenters(allPresentersReducer);
    }
  }, [allPresenters]);

  const allSavedPresenters = presenters.map((presenter) => ({
    value: presenter.userID,
    name: presenter.userName,
    label: (
      <>
        <Row>
          <Col lg={12} md={12} sm={12} className="d-flex gap-2">
            <img
              alt=""
              src={`data:image/jpeg;base64,${presenter.userProfilePicture.displayProfilePictureName}`}
              width="17px"
              height="17px"
              className={styles["Image_class_Agenda"]}
            />
            <span className={styles["Name_Class"]}>{presenter.userName}</span>
          </Col>
        </Row>
      </>
    ),
  }));
  // console.log(allSavedPresenters, "allSavedPresentersallSaved");

  const filterSubAgendaFunc = (options, searchText) => {
    // console.log(options, "filterFuncfilterFunc");
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      {data.subAgenda.length > 0 ? (
        data.subAgenda.map((subAgendaData, subIndex) => {
          return (
            <>
              <div
                className={
                  subAgendaData.canView === false &&
                  editorRole.role === "Agenda Contributor"
                    ? "d-none"
                    : ""
                }
              >
                <Droppable
                  key={`sub-agenda-${index}-${subIndex}`}
                  droppableId={`sub-agenda-${index}-${subIndex}`}
                  type="SUB_AGENDA"
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Draggable
                        key={subAgendaData.subAgendaID}
                        draggableId={`subAgenda-${subAgendaData.subAgendaID}`}
                        index={subIndex}
                        isDragDisabled={
                          editorRole.role === "Participant" ||
                          editorRole.role === "Agenda Contributor" ||
                          editorRole.status === "9" ||
                          editorRole.status === 9
                            ? true
                            : Number(editorRole.status) === 10 &&
                              !isAgendaUpdateWhenMeetingActive
                            ? true
                            : false
                        }
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["Subagenda_Scroller"]}
                              >
                                <section
                                  className={styles["Padding_SubAgenda"]}
                                >
                                  <Row
                                    key={subAgendaData.subAgendaID}
                                    className="mt-3"
                                  >
                                    <Col lg={1} md={1} sm={1}></Col>
                                    <Col
                                      lg={11}
                                      md={11}
                                      sm={11}
                                      className={
                                        parentIslockedCheck ||
                                        subAgendaData.isLocked ||
                                        editorRole.status === "9" ||
                                        editorRole.status === 9
                                          ? styles["SubajendaBox_Inactive"]
                                          : styles["SubajendaBox"]
                                      }
                                    >
                                      <Row isDragging={snapshot.isDragging}>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={1}
                                          isDragging={snapshot.isDragging}
                                          {...provided.dragHandleProps}
                                        >
                                          <section
                                            className={styles["backGorund"]}
                                          >
                                            <img
                                              alt=""
                                              width="18.71px"
                                              height="9.36px"
                                              src={
                                                subexpandIndex === index &&
                                                expandSubIndex === subIndex &&
                                                subExpand
                                                  ? blackArrowUpper
                                                  : dropmdownblack
                                              }
                                              className={
                                                subexpandIndex === index &&
                                                expandSubIndex === subIndex &&
                                                subExpand
                                                  ? styles[
                                                      "subAgendaArrowExpand"
                                                    ]
                                                  : styles["SubAgendaArrow"]
                                              }
                                              onClick={() => {
                                                parentIslockedCheck ||
                                                  handleSubMenuExpand(
                                                    index,
                                                    subIndex
                                                  );
                                              }}
                                            />
                                          </section>
                                        </Col>
                                        <Col
                                          lg={11}
                                          md={11}
                                          sm={11}
                                          className={styles["SubAgendaSection"]}
                                        >
                                          <Row className="mt-2 mb-2">
                                            <Col lg={6} md={6} sm={12}>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Meeting_subAgenda"
                                                      ]
                                                    }
                                                  >
                                                    <span>{index + 1}.</span>
                                                    <span>
                                                      {subIndex + 1}
                                                    </span>{" "}
                                                    {t("Sub-agenda-title")}{" "}
                                                    <span>{subIndex + 1}</span>
                                                  </span>
                                                </Col>
                                              </Row>
                                              <TextField
                                                applyClass={"AgendaTextField"}
                                                labelclass={"d-none"}
                                                name={"subTitle"}
                                                maxLength={290}
                                                disable={
                                                  parentIslockedCheck ||
                                                  subAgendaData.isLocked ||
                                                  editorRole.status === "9" ||
                                                  editorRole.status === 9
                                                    ? true
                                                    : editorRole.role ===
                                                        "Participant" ||
                                                      editorRole.role ===
                                                        "Agenda Contributor" ||
                                                      editorRole.status ===
                                                        "9" ||
                                                      editorRole.status === 9
                                                    ? true
                                                    : Number(
                                                        editorRole.status
                                                      ) === 10 &&
                                                      !isAgendaUpdateWhenMeetingActive
                                                    ? true
                                                    : false
                                                }
                                                placeholder={t(
                                                  "Sub-Agenda-title"
                                                )}
                                                value={subAgendaData.subTitle}
                                                change={(e) =>
                                                  handleSubAgendaTitleChange(
                                                    index,
                                                    subIndex,
                                                    e
                                                  )
                                                }
                                              />
                                            </Col>
                                            <Col lg={6} md={6} sm={12}>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Meeting_subAgenda"
                                                      ]
                                                    }
                                                  >
                                                    {t("Presenter")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Select
                                                options={allSavedPresenters}
                                                value={{
                                                  value:
                                                    subAgendaData.presenterID,
                                                  label:
                                                    subAgendaData.presenterName,
                                                }}
                                                onChange={(value) =>
                                                  handleSelectChange(
                                                    index,
                                                    subIndex,
                                                    value
                                                  )
                                                }
                                                isDisabled={
                                                  parentIslockedCheck ||
                                                  subAgendaData.isLocked ||
                                                  editorRole.status === "9" ||
                                                  editorRole.status === 9
                                                    ? true
                                                    : editorRole.role ===
                                                        "Participant" ||
                                                      editorRole.role ===
                                                        "Agenda Contributor" ||
                                                      editorRole.status ===
                                                        "9" ||
                                                      editorRole.status === 9
                                                    ? true
                                                    : Number(
                                                        editorRole.status
                                                      ) === 10 &&
                                                      !isAgendaUpdateWhenMeetingActive
                                                    ? true
                                                    : false
                                                }
                                                classNamePrefix={
                                                  "SelectOrganizersSelect_active"
                                                }
                                                filterOption={
                                                  filterSubAgendaFunc
                                                }
                                                menuPortalTarget={document.body}
                                                isSearchable={true}
                                              />
                                            </Col>
                                            <Col
                                              sm={12}
                                              md={4}
                                              lg={4}
                                              className="d-flex gap-4 justify-content-start align-items-center"
                                            >
                                              {/* <Row>
                                                <Col lg={5} md={5} sm={5}>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Meeting_subAgenda"
                                                          ]
                                                        }
                                                      >
                                                        {t("Start-date")}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <DatePicker
                                                    arrowClassName="arrowClass"
                                                    containerClassName="containerClassTimePicker"
                                                    className="timePicker"
                                                    calendar={calendarValue}
                                                    locale={localValue}
                                                    disableDayPicker
                                                    inputClass="inputTImeMeeting"
                                                    disabled={
                                                      parentIslockedCheck ||
                                                      subAgendaData.isLocked ||
                                                      editorRole.status ===
                                                        "9" ||
                                                      editorRole.status === 9
                                                        ? true
                                                        : editorRole.role ===
                                                            "Participant" ||
                                                          editorRole.role ===
                                                            "Agenda Contributor" ||
                                                          editorRole.status ===
                                                            "9" ||
                                                          editorRole.status ===
                                                            9
                                                        ? true
                                                        : Number(
                                                            editorRole.status
                                                          ) === 10 &&
                                                          !isAgendaUpdateWhenMeetingActive
                                                        ? true
                                                        : false
                                                    }
                                                    format="hh:mm A"
                                                    selected={
                                                      subAgendaData.startDate
                                                    }
                                                    value={
                                                      subAgendaData.startDate
                                                    }
                                                    onChange={(date) =>
                                                      handleSubAgendaStartDateChange(
                                                        index,
                                                        subIndex,
                                                        date
                                                      )
                                                    }
                                                    plugins={[
                                                      <TimePicker
                                                        hideSeconds
                                                      />,
                                                    ]}
                                                    editable={false}
                                                  />
                                                </Col>
                                                <Col
                                                  lg={2}
                                                  md={2}
                                                  sm={2}
                                                  className="d-flex justify-content-center align-items-center marginTop20"
                                                >
                                                  <img
                                                    alt=""
                                                    draggable={false}
                                                    src={desh}
                                                    width="19.02px"
                                                  />
                                                </Col>
                                                <Col lg={5} md={5} sm={5}>
                                                  <Row>
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    >
                                                      <span
                                                        className={
                                                          styles[
                                                            "Meeting_subAgenda"
                                                          ]
                                                        }
                                                      >
                                                        {t("End-date")}
                                                      </span>
                                                    </Col>
                                                  </Row>
                                                  <DatePicker
                                                    arrowClassName="arrowClass"
                                                    containerClassName="containerClassTimePicker"
                                                    className="timePicker"
                                                    calendar={calendarValue}
                                                    locale={localValue}
                                                    disableDayPicker
                                                    inputClass="inputTImeMeeting"
                                                    disabled={
                                                      parentIslockedCheck ||
                                                      subAgendaData.isLocked ||
                                                      editorRole.status ===
                                                        "9" ||
                                                      editorRole.status === 9
                                                        ? true
                                                        : editorRole.role ===
                                                            "Participant" ||
                                                          editorRole.role ===
                                                            "Agenda Contributor" ||
                                                          editorRole.status ===
                                                            "9" ||
                                                          editorRole.status ===
                                                            9
                                                        ? true
                                                        : Number(
                                                            editorRole.status
                                                          ) === 10 &&
                                                          !isAgendaUpdateWhenMeetingActive
                                                        ? true
                                                        : false
                                                    }
                                                    format="hh:mm A"
                                                    selected={
                                                      subAgendaData.endDate
                                                    }
                                                    value={
                                                      subAgendaData.endDate
                                                    }
                                                    onChange={(date) =>
                                                      handleSubAgendaEndDateChange(
                                                        index,
                                                        subIndex,
                                                        date
                                                      )
                                                    }
                                                    plugins={[
                                                      <TimePicker
                                                        hideSeconds
                                                      />,
                                                    ]}
                                                    editable={false}
                                                  />
                                                </Col>
                                              </Row> */}
                                              {editorRole.role ===
                                                "Participant" ||
                                              editorRole.role ===
                                                "Agenda Contributor" ||
                                              editorRole.status === "9" ||
                                              editorRole.status === 9 ||
                                              (!isAgendaUpdateWhenMeetingActive &&
                                                Number(editorRole.status) ===
                                                  10) ? null : (
                                                <img
                                                  alt=""
                                                  draggable={false}
                                                  src={redcrossIcon}
                                                  height="25px"
                                                  width="25px"
                                                  className={
                                                    styles[
                                                      "RedCross_Icon_class_SubAgenda"
                                                    ]
                                                  }
                                                  onClick={() => {
                                                    parentIslockedCheck ||
                                                      handleCrossSubAjenda(
                                                        index,
                                                        subIndex
                                                      );
                                                  }}
                                                />
                                              )}
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              {/* <span
                                                className={
                                                  styles["Show_More_Styles"]
                                                }
                                                onClick={() => {
                                                  parentIslockedCheck ||
                                                    handleSubMenuExpand(
                                                      index,
                                                      subIndex
                                                    );
                                                }}
                                              > */}
                                              {subexpandIndex === index &&
                                              expandSubIndex === subIndex &&
                                              subExpand ? (
                                                // t("Hide-details")
                                                <Button
                                                  text={t(
                                                    "Description-and-attachement"
                                                  )}
                                                  className={
                                                    styles[
                                                      "show-attachments-button-hide-subagenda"
                                                    ]
                                                  }
                                                  onClick={() => {
                                                    parentIslockedCheck ||
                                                      handleSubMenuExpand(
                                                        index,
                                                        subIndex
                                                      );
                                                  }}
                                                />
                                              ) : (
                                                // t("Show-more")
                                                <Button
                                                  text={t(
                                                    "Description-and-attachement"
                                                  )}
                                                  disableBtn={
                                                    Number(
                                                      editorRole.status
                                                    ) === 10 &&
                                                    !isAgendaUpdateWhenMeetingActive
                                                      ? true
                                                      : false
                                                  }
                                                  className={
                                                    styles[
                                                      "show-attachments-button-show-subagenda"
                                                    ]
                                                  }
                                                  onClick={() => {
                                                    parentIslockedCheck ||
                                                      handleSubMenuExpand(
                                                        index,
                                                        subIndex
                                                      );
                                                  }}
                                                />
                                              )}
                                              {/* </span> */}
                                              {subAgendaData.subfiles.length >
                                              0 ? (
                                                <img
                                                  className={
                                                    styles[
                                                      "AttachmentIconImage"
                                                    ]
                                                  }
                                                  src={AttachmentIcon}
                                                  alt=""
                                                />
                                              ) : null}
                                            </Col>
                                          </Row>
                                          {/* Condition for Subajencda */}
                                          {subexpandIndex === index &&
                                            expandSubIndex === subIndex &&
                                            subExpand && (
                                              <>
                                                <Row className="mb-2">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <TextField
                                                      applyClass="text-area-create-resolution"
                                                      type="text"
                                                      as={"textarea"}
                                                      name={"Description"}
                                                      value={
                                                        subAgendaData.description
                                                      }
                                                      disable={
                                                        parentIslockedCheck ||
                                                        subAgendaData.isLocked ||
                                                        editorRole.status ===
                                                          "9" ||
                                                        editorRole.status === 9
                                                          ? true
                                                          : editorRole.role ===
                                                              "Participant" ||
                                                            editorRole.role ===
                                                              "Agenda Contributor" ||
                                                            editorRole.status ===
                                                              "9" ||
                                                            editorRole.status ===
                                                              9
                                                          ? true
                                                          : Number(
                                                              editorRole.status
                                                            ) === 10 &&
                                                            !isAgendaUpdateWhenMeetingActive
                                                          ? true
                                                          : false
                                                      }
                                                      change={(e) =>
                                                        handleAgendaDescription(
                                                          index,
                                                          subIndex,
                                                          e
                                                        )
                                                      }
                                                      rows="4"
                                                      placeholder={t(
                                                        "Agenda-description"
                                                      )}
                                                      required={true}
                                                    />
                                                  </Col>
                                                </Row>
                                                {/* <Row
                                                  key={index + Math.random()}
                                                  className="mt-3"
                                                >
                                                  <Col lg={12} md={12} sm={12}>
                                                    <Button
                                                      text={t(
                                                        "Add-attachments"
                                                      )}
                                                      className={
                                                        styles[
                                                          "show-attachments-button"
                                                        ]
                                                      }
                                                    />
                                                  </Col>
                                                </Row> */}
                                                <Row className="mt-3">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles["Agenda_Heading"]
                                                      }
                                                    >
                                                      {t("Attachments")}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row className="mt-3">
                                                  <Col lg={6} md={6} sm={6}>
                                                    <Radio.Group
                                                      value={
                                                        subAgendaData.subSelectRadio
                                                      }
                                                      onChange={(e) =>
                                                        handleSubAgendaRadioChange(
                                                          index,
                                                          subIndex,
                                                          e
                                                        )
                                                      }
                                                      disabled={
                                                        parentIslockedCheck ||
                                                        subAgendaData.isLocked ||
                                                        editorRole.status ===
                                                          "9" ||
                                                        editorRole.status ===
                                                          9 ||
                                                        editorRole.role ===
                                                          "Participant" ||
                                                        editorRole.role ===
                                                          "Agenda Contributor"
                                                          ? true
                                                          : Number(
                                                              editorRole.status
                                                            ) === 10 &&
                                                            !isAgendaUpdateWhenMeetingActive
                                                          ? true
                                                          : false
                                                      }
                                                    >
                                                      <Radio value={1}>
                                                        <span
                                                          className={
                                                            styles[
                                                              "Radio_Button_options"
                                                            ]
                                                          }
                                                        >
                                                          {t("Document")}
                                                        </span>
                                                      </Radio>
                                                      <Radio value={2}>
                                                        <span
                                                          className={
                                                            styles[
                                                              "Radio_Button_options"
                                                            ]
                                                          }
                                                        >
                                                          {t("URL")}
                                                        </span>
                                                      </Radio>
                                                      {/* <Radio value={3}>
                                                      <span
                                                        className={
                                                          styles[
                                                            "Radio_Button_options"
                                                          ]
                                                        }
                                                      >
                                                        {t(
                                                          "Request from contributor"
                                                        )}
                                                      </span>
                                                    </Radio> */}
                                                    </Radio.Group>
                                                  </Col>
                                                  <Col
                                                    lg={6}
                                                    md={6}
                                                    sm={6}
                                                    className="d-flex justify-content-end gap-4 align-items-center"
                                                  >
                                                    {editorRole.role ===
                                                      "Participant" ||
                                                    editorRole.role ===
                                                      "Agenda Contributor" ||
                                                    editorRole.status === "9" ||
                                                    editorRole.status ===
                                                      9 ? null : (
                                                      <>
                                                        {subAgendaData.subAgendaID.includes(
                                                          "A"
                                                        ) ? null : (
                                                          <>
                                                            <img
                                                              draggable={false}
                                                              src={Key}
                                                              alt=""
                                                              width="24.07px"
                                                              height="24.09px"
                                                              className={`cursor-pointer ${
                                                                parentIslockedCheck ||
                                                                subAgendaData.isLocked ||
                                                                editorRole.status ===
                                                                  "9" ||
                                                                editorRole.status ===
                                                                  9
                                                                  ? "disabled"
                                                                  : Number(
                                                                      editorRole.status
                                                                    ) === 10 &&
                                                                    !isAgendaUpdateWhenMeetingActive
                                                                  ? "pe-none"
                                                                  : ""
                                                              }`}
                                                              onClick={() => {
                                                                if (
                                                                  !(
                                                                    parentIslockedCheck ||
                                                                    subAgendaData.isLocked ||
                                                                    editorRole.status ===
                                                                      "9" ||
                                                                    editorRole.status ===
                                                                      9
                                                                  )
                                                                ) {
                                                                  openAdvancePermissionModal(
                                                                    subAgendaData.subAgendaID
                                                                  );
                                                                }
                                                              }}
                                                            />
                                                            <img
                                                              alt=""
                                                              draggable={false}
                                                              src={Cast}
                                                              width="25.85px"
                                                              height="25.89px"
                                                              className={
                                                                Number(
                                                                  editorRole.status
                                                                ) === 10 &&
                                                                !isAgendaUpdateWhenMeetingActive
                                                                  ? "pe-none"
                                                                  : "cursor-pointer"
                                                              }
                                                              onClick={() =>
                                                                parentIslockedCheck ||
                                                                subAgendaData.isLocked ||
                                                                editorRole.status ===
                                                                  "9" ||
                                                                editorRole.status ===
                                                                  9
                                                                  ? ""
                                                                  : Number(
                                                                      editorRole.status
                                                                    ) === 10 &&
                                                                    !isAgendaUpdateWhenMeetingActive
                                                                  ? null
                                                                  : openVoteMOdal(
                                                                      subAgendaData.subAgendaID,
                                                                      subAgendaData.agendaVotingID,
                                                                      subAgendaData.subTitle
                                                                    )
                                                              }
                                                            />
                                                            <img
                                                              draggable={false}
                                                              src={
                                                                parentIslockedCheck
                                                                  ? closedLocked
                                                                  : subAgendaData.isLocked
                                                                  ? DarkLock
                                                                  : Lock
                                                              }
                                                              alt=""
                                                              width="18.87px"
                                                              height="26.72px"
                                                              className={
                                                                parentIslockedCheck ||
                                                                editorRole.status ===
                                                                  "9" ||
                                                                editorRole.status ===
                                                                  9
                                                                  ? styles[
                                                                      "lockBtn_inActive"
                                                                    ]
                                                                  : subAgendaData.isLocked ||
                                                                    editorRole.status ===
                                                                      "9" ||
                                                                    editorRole.status ===
                                                                      9
                                                                  ? styles[
                                                                      "lockBtn_inActive_coursor"
                                                                    ]
                                                                  : Number(
                                                                      editorRole.status
                                                                    ) === 10 &&
                                                                    !isAgendaUpdateWhenMeetingActive
                                                                  ? "pe-none"
                                                                  : styles[
                                                                      "lockBtn"
                                                                    ]
                                                              }
                                                              onClick={() => {
                                                                if (
                                                                  parentIslockedCheck ||
                                                                  editorRole.status ===
                                                                    "9" ||
                                                                  editorRole.status ===
                                                                    9
                                                                ) {
                                                                } else {
                                                                  lockFunctionActiveSubMenus(
                                                                    index,
                                                                    subAgendaData.subAgendaID,
                                                                    subAgendaData.isLocked
                                                                  );
                                                                }
                                                              }}
                                                            />
                                                          </>
                                                        )}
                                                      </>
                                                    )}
                                                  </Col>
                                                </Row>
                                                <Droppable
                                                  droppableId={`subAgendaID-${subAgendaData.subAgendaID}-parent-${data.iD}-attachments`}
                                                  type="attachment"
                                                >
                                                  {(provided) => (
                                                    <div
                                                      {...provided.droppableProps}
                                                      ref={provided.innerRef}
                                                    >
                                                      {subAgendaData.subSelectRadio ===
                                                      1 ? (
                                                        <>
                                                          {subAgendaData
                                                            .subfiles.length >
                                                          0 ? (
                                                            <>
                                                              <SubDocumnets
                                                                subAgendaData={
                                                                  subAgendaData
                                                                }
                                                                setRows={
                                                                  setRows
                                                                }
                                                                rows={rows}
                                                                index={index}
                                                                subIndex={
                                                                  subIndex
                                                                }
                                                                parentId={`parent-${data.iD}`}
                                                                fileForSend={
                                                                  fileForSend
                                                                }
                                                                setFileForSend={
                                                                  setFileForSend
                                                                }
                                                                editorRole={
                                                                  editorRole
                                                                }
                                                              />
                                                              {editorRole.role ===
                                                                "Participant" ||
                                                              editorRole.status ===
                                                                "9" ||
                                                              editorRole.status ===
                                                                9 ? null : (
                                                                <SubDedaultDragger
                                                                  setRows={
                                                                    setRows
                                                                  }
                                                                  rows={rows}
                                                                  index={index}
                                                                  subIndex={
                                                                    subIndex
                                                                  }
                                                                  fileForSend={
                                                                    fileForSend
                                                                  }
                                                                  setFileForSend={
                                                                    setFileForSend
                                                                  }
                                                                  editorRole={
                                                                    editorRole
                                                                  }
                                                                />
                                                              )}
                                                            </>
                                                          ) : editorRole.role ===
                                                              "Participant" ||
                                                            editorRole.status ===
                                                              "9" ||
                                                            editorRole.status ===
                                                              9 ? null : (
                                                            <SubDedaultDragger
                                                              setRows={setRows}
                                                              rows={rows}
                                                              index={index}
                                                              subIndex={
                                                                subIndex
                                                              }
                                                              fileForSend={
                                                                fileForSend
                                                              }
                                                              setFileForSend={
                                                                setFileForSend
                                                              }
                                                              editorRole={
                                                                editorRole
                                                              }
                                                            />
                                                          )}
                                                        </>
                                                      ) : subAgendaData.subSelectRadio ===
                                                        2 ? (
                                                        <SubUrls
                                                          subAgendaData={
                                                            subAgendaData
                                                          }
                                                          rows={rows}
                                                          setRows={setRows}
                                                          index={index}
                                                          subIndex={subIndex}
                                                          editorRole={
                                                            editorRole
                                                          }
                                                        />
                                                      ) : subAgendaData.subSelectRadio ===
                                                        3 ? (
                                                        <SubRequestContributor
                                                          subAgendaData={
                                                            subAgendaData
                                                          }
                                                          rows={rows}
                                                          setRows={setRows}
                                                          index={index}
                                                          subIndex={subIndex}
                                                          allUsersRC={
                                                            allUsersRC
                                                          }
                                                          setAllUsersRC={
                                                            setAllUsersRC
                                                          }
                                                          editorRole={
                                                            editorRole
                                                          }
                                                        />
                                                      ) : (
                                                        <></>
                                                      )}
                                                    </div>
                                                  )}
                                                </Droppable>
                                              </>
                                            )}
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </section>
                              </Col>
                            </Row>
                          </div>
                        )}
                      </Draggable>
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </>
          );
        })
      ) : (
        <Droppable
          key={`sub-agenda-${index}-${0}`}
          droppableId={`sub-agenda-${index}-${0}`}
          type="SUB_AGENDA"
        >
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Row style={{ height: "12px" }}></Row>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </>
  );
};

export default SubAgendaMappingDragging;
