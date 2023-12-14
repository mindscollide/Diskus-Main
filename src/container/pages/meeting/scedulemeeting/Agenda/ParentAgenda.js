import React, { useEffect, useRef, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useDispatch } from "react-redux";
import {
  getMeetingMaterialAPI,
  showAdvancePermissionModal,
  showMainAgendaItemRemovedModal,
  GetAllMeetingUserApiFunc,
  showVoteAgendaModal,
  UpateMeetingStatusLockApiFunc,
} from "../../../../../store/actions/NewMeetingActions";
import { resolutionResultTable } from "../../../../../commen/functions/date_formater";
import styles from "./Agenda.module.css";
import Cast from "../../../../../assets/images/CAST.svg";
import profile from "../../../../../assets/images/newprofile.png";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import Select from "react-select";
import DatePicker from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { Radio } from "antd";
import desh from "../../../../../assets/images/desh.svg";
import {
  Button,
  TextField,
  Notification,
} from "../../../../../components/elements";
import Documents from "./Documents";
import Urls from "./Urls";
import RequestContributor from "./RequestContributor";
import DefaultDragger from "./DefaultDragger";
import SubAgendaMappingDragging from "./SubAgendaMappingDragging";
import dropmdownblack from "../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../assets/images/whiteupper.png";
import Lock from "../../../../../assets/images/LOCK.svg";
import DarkLock from "../../../../../assets/images/BlackLock.svg";
import Key from "../../../../../assets/images/KEY.svg";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import { getRandomUniqueNumber } from "./drageFunction";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { async } from "q";
import {
  GetAgendaAndVotingInfo,
  GetCurrentAgendaDetails,
  GetAgendaVotingDetails,
  GetAdvanceMeetingAgendabyMeetingID,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";

const ParentAgenda = ({
  data,
  index,
  rows,
  setRows,
  setMainAgendaRemovalIndex,
  agendaItemRemovedIndex,
  setAgendaItemRemovedIndex,
  setSubajendaRemoval,
  currentMeeting,
  fileForSend,
  setFileForSend,
  setAllSavedPresenters,
  allSavedPresenters,
  allUsersRC,
  setAllUsersRC,
  editorRole,
  setSelectedID,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );
  let currentMeetingIDLS = Number(localStorage.getItem("currentMeetingLS"));
  let currentLanguage = localStorage.getItem("i18nextLng");
  const dispatch = useDispatch();
  const [mainLock, setmainLock] = useState([]);
  const [subLockArry, setSubLockArray] = useState([]);
  const [expandSubIndex, setExpandSubIndex] = useState(0);
  const [expandIndex, setExpandIndex] = useState(-1);
  const [subexpandIndex, setsubexpandIndex] = useState(-1);
  const [expand, setExpand] = useState(true);
  const [subExpand, setSubExpand] = useState([]);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [flag, setFlag] = useState(0);
  //Timepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  const options = [
    {
      value: "chocolate",
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img
                draggable={false}
                src={profile}
                width="17px"
                height="17px"
                className={styles["Image_class_Agenda"]}
                alt=""
              />
              <span className={styles["Name_Class"]}>Oliver Davis</span>
            </Col>
          </Row>
        </>
      ),
    },
  ];
  // Function For Expanding Main Agenda See More Options
  const handleExpandedBtn = (index) => {
    setExpandIndex((prevIndex) => (prevIndex === index ? -1 : index));
  };
  //Add Function To Add SubAgendas
  const addSubAjendaRows = (rowAgendaIndex) => {
    const updatedRows = [...rows];
    const nextSubAgendaID = updatedRows[0].subAgenda.length.toString();
    const newSubAgenda = {
      subAgendaID: getRandomUniqueNumber().toString() + "A",
      agendaVotingID: 0,
      subTitle: "",
      description: "",
      agendaVotingID: 0,
      presenterID: allSavedPresenters[0]?.value,
      presenterName: allSavedPresenters[0]?.label,
      startDate: "",
      endDate: "",
      subSelectRadio: 1,
      subAgendaUrlFieldRadio: "",
      subAgendarequestContributorUrlName: "",
      subAgendarequestContributorEnterNotes: "",
      subfiles: [],
      isLocked: false,
      voteOwner: null,
      isAttachment: false,
      userID: 0,
    };
    updatedRows[rowAgendaIndex].subAgenda.push(newSubAgenda);
    setRows(updatedRows);
  };

  const handleCrossIcon = (index) => {
    dispatch(showMainAgendaItemRemovedModal(true));
    setMainAgendaRemovalIndex(index);
  };

  const openAdvancePermissionModal = async (id, flag) => {
    setSelectedID(id);
    let meetingMaterialData = {
      MeetingID: currentMeetingIDLS,
    };
    // await dispatch(
    //   getMeetingMaterialAPI(navigate, t, meetingMaterialData, rows, id)
    // );
    dispatch(
      GetAdvanceMeetingAgendabyMeetingID(
        meetingMaterialData,
        navigate,
        t,
        rows,
        id,
        flag
      )
    );
    dispatch(showAdvancePermissionModal(true));
  };

  const openVoteMOdal = async (AgendaID, agendaVotingID, agendaDetails) => {
    let Data = {
      AgendaID: AgendaID,
      MeetingID: currentMeetingIDLS,
      AgendaVotingID: agendaVotingID,
    };
    let dataForAgendaDetails = {
      AgendaVotingID: agendaVotingID,
      MeetingID: currentMeetingIDLS,
    };
    if (Data.AgendaVotingID !== 0) {
      await dispatch(GetAgendaAndVotingInfo(Data, navigate, t));
      dispatch(showVoteAgendaModal(true));
      dispatch(GetCurrentAgendaDetails(agendaDetails));
      dispatch(GetAgendaVotingDetails(dataForAgendaDetails, navigate, t));
      localStorage.setItem("currentAgendaVotingID", Data.AgendaVotingID);
    } else {
      dispatch(GetCurrentAgendaDetails(agendaDetails));
      dispatch(showVoteAgendaModal(true));
      localStorage.setItem("currentAgendaVotingID", 0);
    }
  };

  //Lock Functionality For SubAgendas Only
  const lockFunctionActive = async (id, isLocked) => {
    let Data = {
      AgendaID: id,
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
        // Find the index of the row with the given id
        const rowIndex = prevRows.findIndex((row) => row.iD === id);

        // If the row is found, update its isLocked value
        if (rowIndex !== -1) {
          const newRows = [...prevRows];
          newRows[rowIndex].isLocked = !newRows[rowIndex].isLocked;
          return newRows;
        }

        // If the row is not found, return the original state
        return prevRows;
      });
    } else {
      console.log("UpateMeetingStatusLockApiFunc");
    }
  };

  //Lock For Main Agenda Will Locks Its childs Also
  const apllyLockOnParentAgenda = (parentIndex) => {
    const exists = mainLock.some((item) => {
      if (item === parentIndex) {
        //Agenda Lock Api Applied
        // let Data = {
        //   AgendaID: "1223",
        //   Islocked: true,
        // };
        // dispatch(UpateMeetingStatusLockApiFunc(navigate, t, Data));
        return true;
      }
      return false;
    });

    return exists;
  };

  // StateManagement of Components
  const handleAgendaItemChange = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedAgendaItems = [...rows];
    if (name === "title") {
      updatedAgendaItems[index][name] = value;
    }
    setRows(updatedAgendaItems);
  };

  const handleSelectChange = (index, value) => {
    const updatedAgendaItems = [...rows];
    let SelectValue = {
      value: value.value,
      label: value.label,
    };
    updatedAgendaItems[index].presenterID = SelectValue.value;
    updatedAgendaItems[index].presenterName = SelectValue.label;
    setRows(updatedAgendaItems);
  };

  // Function to update the startDate for a specific row
  const handleStartDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const formattedDateTimeString =
        newDate.toDateString() + " " + newDate.toTimeString();
      const dateObject = new Date(formattedDateTimeString);
      const updatedRows = [...rows];
      updatedRows[index].startDate = dateObject;
      setRows(updatedRows);
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  // Function to update the endDate for a specific row
  const handleEndDateChange = (index, date) => {
    let newDate = new Date(date);
    if (newDate instanceof Date && !isNaN(newDate)) {
      const formattedDateTimeString =
        newDate.toDateString() + " " + newDate.toTimeString();
      const dateObject = new Date(formattedDateTimeString);
      const updatedRows = [...rows];
      updatedRows[index].endDate = dateObject;
      setRows(updatedRows);
      // You can use 'formattedTime' as needed.
    } else {
      console.error("Invalid date and time object:", date);
    }
  };

  // Function to update the selected radio option for a specific row
  const handleRadioChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].selectedRadio = value;
    if (updatedRows[index].selectedRadio === 1) {
      updatedRows[index].urlFieldMain = "";
      updatedRows[index].mainNote = "";
      updatedRows[index].requestContributorURlName = "";
      updatedRows[index].userID = 0;
    } else if (updatedRows[index].selectedRadio === 2) {
      updatedRows[index].files = [];
      updatedRows[index].mainNote = "";
      updatedRows[index].requestContributorURlName = "";
      updatedRows[index].userID = 0;
    } else if (updatedRows[index].selectedRadio === 3) {
      updatedRows[index].files = [];
      updatedRows[index].urlFieldMain = "";
    }
    setRows(updatedRows);
  };

  const handleAgendaDescription = (index, e) => {
    let name = e.target.name;
    let value = e.target.value;
    const updatedAgendaItems = [...rows];
    if (name === "Description") {
      updatedAgendaItems[index].description = value;
    }
    setRows(updatedAgendaItems);
  };

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
      NewMeetingreducer.getMeetingusers !== undefined &&
      NewMeetingreducer.getMeetingusers !== null &&
      NewMeetingreducer.getMeetingusers.length !== 0
    ) {
      const newData = {
        meetingOrganizers: NewMeetingreducer.getMeetingusers.meetingOrganizers,
        meetingParticipants:
          NewMeetingreducer.getMeetingusers.meetingParticipants,
        meetingAgendaContributors:
          NewMeetingreducer.getMeetingusers.meetingAgendaContributors,
      };
      setAllPresenters(newData);
    }
  }, [NewMeetingreducer?.getMeetingusers]);

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

  useEffect(() => {
    if (presenters.lenth > 0 || Object.keys(presenters).length > 0) {
      const mappedPresenters = presenters.map((presenter) => ({
        value: presenter.userID,
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
                <span className={styles["Name_Class"]}>
                  {presenter.userName}
                </span>
              </Col>
            </Row>
          </>
        ),
      }));
      setAllSavedPresenters((prevPresenters) => {
        if (
          JSON.stringify(prevPresenters) !== JSON.stringify(mappedPresenters)
        ) {
          return mappedPresenters;
        }
        return prevPresenters; // No change, return the current state
      });
    }
    const updatedAgendaItems = [...rows];
    updatedAgendaItems[index].presenterID = allSavedPresenters[0]?.value;
    updatedAgendaItems[index].presenterName = allSavedPresenters[0]?.label;
    setRows(updatedAgendaItems);
    console.log("presenterspresenters", presenters);
  }, [presenters]);

  return (
    <>
      <Draggable
        key={data.iD}
        draggableId={data.iD}
        index={index}
        isDragDisabled={
          editorRole.role === "Participant" ||
          editorRole.role === "Agenda Contributor"
            ? true
            : false
        }
      >
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            {/* Main Agenda Items Mapping */}
            <span className="position-relative">
              <Row key={data.iD} className="mt-4 m-0 p-0">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  key={index + 1}
                  className={
                    // apllyLockOnParentAgenda(index)
                    data.isLocked
                      ? styles["BackGround_Agenda_InActive"]
                      : styles["BackGround_Agenda"]
                  }
                >
                  <Row>
                    <Col
                      lg={1}
                      md={1}
                      sm={1}
                      className={styles["BackGroundNewImplemented"]}
                    >
                      <Row className="mt-4" isDragging={snapshot.isDragging}>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center align-items-center"
                          isDragging={snapshot.isDragging}
                          {...provided.dragHandleProps}
                        >
                          <img
                            draggable={false}
                            src={
                              expandIndex === index && expand
                                ? blackArrowUpper
                                : dropmdownblack
                            }
                            width="18.71px"
                            height="9.36px"
                            className={
                              expandIndex === index && expand
                                ? styles["Arrow_Expanded"]
                                : styles["Arrow"]
                            }
                            alt=""
                            onClick={() => {
                              handleExpandedBtn(index);
                            }}
                          />
                        </Col>
                      </Row>
                    </Col>

                    <Col lg={11} md={11} sm={11}>
                      <section className={styles["SectionInnerClass"]}>
                        <Row key={index + 2} className="mt-4">
                          <Col lg={5} md={5} sm={12}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Meeting_title_heading"]}
                                >
                                  <span>{index + 1}.</span> {t("Agenda-title")}{" "}
                                  <span>{index + 1}</span>
                                </span>
                              </Col>
                            </Row>
                            <TextField
                              applyClass={"AgendaTextField"}
                              name={"title"}
                              labelClass={"d-none"}
                              placeholder={t("Agenda-title")}
                              value={data.title}
                              change={(e) => handleAgendaItemChange(index, e)}
                              disable={
                                data.isLocked
                                  ? data.isLocked
                                  : editorRole.role === "Participant" ||
                                    editorRole.role === "Agenda Contributor"
                                  ? true
                                  : false
                              }
                            />
                          </Col>
                          <Col lg={3} md={3} sm={12}>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Meeting_title_heading"]}
                                >
                                  {t("Presenter")}
                                </span>
                              </Col>
                            </Row>
                            <Select
                              options={allSavedPresenters}
                              value={{
                                value: data.presenterID,
                                label: data.presenterName,
                              }}
                              onChange={(value) =>
                                handleSelectChange(index, value)
                              }
                              isDisabled={
                                data.isLocked
                                  ? data.isLocked
                                  : editorRole.role === "Participant" ||
                                    editorRole.role === "Agenda Contributor"
                                  ? true
                                  : false
                              }
                              classNamePrefix={"SelectOrganizersSelect_active"}
                              isSearchable={false}
                            />
                          </Col>
                          <Col
                            sm={12}
                            md={4}
                            lg={4}
                            className="d-flex gap-4 justify-content-start align-items-center"
                          >
                            <Row>
                              <Col lg={5} md={5} sm={5}>
                                <Row>
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles["Meeting_title_heading"]
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
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  calendar={calendarValue}
                                  locale={localValue}
                                  format="hh:mm A"
                                  selected={data.startDate}
                                  value={data.startDate}
                                  plugins={[<TimePicker hideSeconds />]}
                                  onChange={(date) =>
                                    handleStartDateChange(index, date)
                                  }
                                  disabled={
                                    data.isLocked
                                      ? data.isLocked
                                      : editorRole.role === "Participant" ||
                                        editorRole.role === "Agenda Contributor"
                                      ? true
                                      : false
                                  }
                                  editable={false}
                                />
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={2}
                                className="d-flex justify-content-center align-items-center"
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
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles["Meeting_title_heading"]
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
                                  disableDayPicker
                                  inputClass="inputTImeMeeting"
                                  format="hh:mm A"
                                  calendar={calendarValue}
                                  locale={localValue}
                                  value={data.endDate}
                                  selected={data.endDate}
                                  plugins={[<TimePicker hideSeconds />]}
                                  onChange={(date) =>
                                    handleEndDateChange(index, date)
                                  } // Update end date
                                  disabled={
                                    data.isLocked
                                      ? data.isLocked
                                      : editorRole.role === "Participant" ||
                                        editorRole.role === "Agenda Contributor"
                                      ? true
                                      : false
                                  }
                                  editable={false}
                                />
                              </Col>
                            </Row>
                            {index !== 0 &&
                              (editorRole.role === "Participant" ||
                              editorRole.role ===
                                "Agenda Contributor" ? null : (
                                <img
                                  alt=""
                                  draggable={false}
                                  src={redcrossIcon}
                                  height="25px"
                                  width="25px"
                                  className={
                                    styles["RedCross_Icon_class_Main_agenda"]
                                  }
                                  onClick={() => {
                                    handleCrossIcon(index);
                                  }}
                                />
                              ))}
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col lg={12} md={12} sm={12}>
                            <span
                              className={styles["Show_Details_Tag"]}
                              onClick={() => {
                                handleExpandedBtn(index);
                              }}
                            >
                              {expandIndex === index && expand
                                ? t("Hide-details")
                                : t("Show-details")}
                            </span>
                          </Col>
                        </Row>
                        {expandIndex === index && expand ? (
                          <>
                            <Row className="mb-2">
                              <Col lg={12} md={12} sm={12}>
                                <TextField
                                  applyClass="text-area-create-resolution"
                                  type="text"
                                  as={"textarea"}
                                  name={"Description"}
                                  value={data.description}
                                  change={(e) =>
                                    handleAgendaDescription(index, e)
                                  }
                                  rows="4"
                                  placeholder={t("Enter-description")}
                                  required={true}
                                  maxLength={500}
                                  disable={
                                    data.isLocked
                                      ? data.isLocked
                                      : editorRole.role === "Participant" ||
                                        editorRole.role === "Agenda Contributor"
                                      ? true
                                      : false
                                  }
                                />
                              </Col>
                            </Row>
                            <Row key={index + 3} className="mt-3">
                              <Col lg={12} md={12} sm={12}>
                                <span className={styles["Agenda_Heading"]}>
                                  {t("Attachments")}
                                </span>
                              </Col>
                            </Row>
                            <Row key={index + 4} className="mt-3">
                              <Col lg={6} md={6} sm={6}>
                                <Radio.Group
                                  onChange={(e) =>
                                    handleRadioChange(index, e.target.value)
                                  }
                                  value={data.selectedRadio}
                                  disabled={data.isLocked}
                                >
                                  <Radio value={1}>
                                    <span
                                      className={styles["Radio_Button_options"]}
                                    >
                                      {t("Document")}
                                    </span>
                                  </Radio>
                                  <Radio value={2}>
                                    <span
                                      className={styles["Radio_Button_options"]}
                                    >
                                      {t("URL")}
                                    </span>
                                  </Radio>
                                  <Radio value={3}>
                                    <span
                                      className={styles["Radio_Button_options"]}
                                    >
                                      {t("Request from contributor")}
                                    </span>
                                  </Radio>
                                </Radio.Group>
                              </Col>
                              <Col
                                lg={6}
                                md={6}
                                sm={6}
                                className="d-flex justify-content-end gap-4 align-items-center"
                              >
                                {editorRole.role === "Participant" ||
                                editorRole.role ===
                                  "Agenda Contributor" ? null : (
                                  <>
                                    {data.iD.includes("A") ? null : (
                                      <>
                                        <img
                                          draggable={false}
                                          src={Key}
                                          alt=""
                                          width="24.07px"
                                          height="24.09px"
                                          className={`cursor-pointer ${
                                            data.isLocked ? "locked-cursor" : ""
                                          }`}
                                          role="button"
                                          onClick={() => {
                                            if (!data.isLocked) {
                                              openAdvancePermissionModal(
                                                data.iD,
                                                1
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
                                          className="cursor-pointer"
                                          onClick={() =>
                                            data.isLocked
                                              ? ""
                                              : openVoteMOdal(
                                                  data.iD,
                                                  data.agendaVotingID,
                                                  data
                                                )
                                          }
                                        />
                                        <img
                                          alt=""
                                          draggable={false}
                                          src={data.isLocked ? DarkLock : Lock}
                                          width="18.87px"
                                          className={
                                            data.isLocked
                                              ? styles["lockBtn_inActive"]
                                              : styles["lockBtn"]
                                          }
                                          height="26.72px"
                                          onClick={() =>
                                            lockFunctionActive(
                                              data.iD,
                                              data.isLocked
                                            )
                                          }
                                        />
                                      </>
                                    )}
                                  </>
                                )}
                              </Col>
                            </Row>
                            <Droppable
                              droppableId={`parent-${data.iD}-parent-attachments`}
                              type="attachment"
                            >
                              {(provided) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  {data.selectedRadio === 1 ? (
                                    <>
                                      {data.files.length > 0 ? (
                                        <>
                                          <Documents
                                            data={data}
                                            index={index}
                                            setRows={setRows}
                                            rows={rows}
                                            parentId={`parent-${data.iD}`}
                                            setFileForSend={setFileForSend}
                                            fileForSend={fileForSend}
                                            editorRole={editorRole}
                                          />
                                          {editorRole.role ===
                                          "Participant" ? null : (
                                            <DefaultDragger
                                              setRows={setRows}
                                              rows={rows}
                                              index={index}
                                              fileForSend={fileForSend}
                                              setFileForSend={setFileForSend}
                                              editorRole={editorRole}
                                            />
                                          )}
                                        </>
                                      ) : editorRole.role ===
                                        "Participant" ? null : (
                                        <DefaultDragger
                                          setRows={setRows}
                                          rows={rows}
                                          index={index}
                                          fileForSend={fileForSend}
                                          setFileForSend={setFileForSend}
                                          editorRole={editorRole}
                                        />
                                      )}
                                    </>
                                  ) : data.selectedRadio === 2 ? (
                                    <Urls
                                      data={data}
                                      index={index}
                                      setRows={setRows}
                                      rows={rows}
                                      editorRole={editorRole}
                                    />
                                  ) : data.selectedRadio === 3 ? (
                                    <RequestContributor
                                      data={data}
                                      index={index}
                                      setRows={setRows}
                                      rows={rows}
                                      allUsersRC={allUsersRC}
                                      setAllUsersRC={setAllUsersRC}
                                      editorRole={editorRole}
                                    />
                                  ) : (
                                    <></>
                                    //
                                  )}
                                </div>
                              )}
                            </Droppable>
                          </>
                        ) : null}
                      </section>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </span>
            {/* SubAgenda Mapping */}
            {
              <SubAgendaMappingDragging
                data={data}
                index={index}
                setRows={setRows}
                fileForSend={fileForSend}
                setFileForSend={setFileForSend}
                rows={rows}
                subexpandIndex={subexpandIndex}
                expandSubIndex={expandSubIndex}
                subExpand={subExpand}
                parentIslockedCheck={data.isLocked}
                subLockArry={subLockArry}
                setSubLockArray={setSubLockArray}
                agendaItemRemovedIndex={agendaItemRemovedIndex}
                setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
                setSubajendaRemoval={setSubajendaRemoval}
                setsubexpandIndex={setsubexpandIndex}
                setExpandSubIndex={setExpandSubIndex}
                setSubExpand={setSubExpand}
                openAdvancePermissionModal={openAdvancePermissionModal}
                openVoteMOdal={openVoteMOdal}
                allUsersRC={allUsersRC}
                setAllUsersRC={setAllUsersRC}
                editorRole={editorRole}
              />
            }
            {/* sub Ajenda Button */}
            {editorRole.role === "Participant" ||
            editorRole.role === "Agenda Contributor" ? null : (
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <Button
                    text={
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center gap-2 align-items-center"
                          >
                            <img
                              alt=""
                              draggable={false}
                              src={plusFaddes}
                              height="10.77px"
                              width="10.77px"
                            />
                            <span className={styles["Add_Agen_Heading"]}>
                              {t("Add-sub-agenda")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    }
                    className={styles["AddMoreBtnAgenda"]}
                    onClick={() => {
                      addSubAjendaRows(index);
                    }}
                  />
                </Col>
              </Row>
            )}
          </div>
        )}
      </Draggable>
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
    </>
  );
};

export default ParentAgenda;
