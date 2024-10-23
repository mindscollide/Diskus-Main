import React, { useState, useEffect } from "react";
import "../modalView/ModalView.css";
import FileIcon, { defaultStyles } from "react-file-icon";
import {
  EditmeetingDateFormat,
  newTimeFormaterAsPerUTCFullDate,
  RemoveTimeDashes,
} from "../../commen/functions/date_formater";
import {
  TextField,
  Button,
  Modal,
  EmployeeCard,
} from "../../components/elements";
import { Row, Col, Container } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { Check2 } from "react-bootstrap-icons";
import {
  allAssignessList,
  cleareAssigneesState,
  StartMeeting,
  EndMeeting,
} from "../../store/actions/Get_List_Of_Assignees";
import { DownloadFile } from "../../store/actions/Download_action";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const MeetingViewModalCalendar = ({
  viewFlag,
  setViewFlag,
  ModalTitle,
  data,
}) => {
  //For Localization
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { assignees } = useSelector((state) => state);
  const [isDetails, setIsDetails] = useState(true);
  const [isAttendees, setIsAttendees] = useState(false);
  const [isAgenda, setIsAgenda] = useState(false);
  const [isMinutes, setIsMinutes] = useState(false);
  const [isAttachments, setIsAttachments] = useState(false);
  const [meetingReminderID, setMeetingReminderID] = useState([]);
  const [meetingReminderValue, setMeetingReminderValue] = useState("");
  const [objMeetingAgenda, setObjMeetingAgenda] = useState({
    Title: "",
    PresenterName: "",
    URLs: "",
    FK_MDID: 0,
  });

  // for upload documents
  const [meetingAgendaAttachments, setMeetingAgendaAttachments] = useState({
    MeetingAgendaAttachments: [],
  });
  // for Meeting  Attendees
  const [meetingAttendees, setMeetingAttendees] = useState({
    User: {
      PK_UID: 0,
    },
    MeetingAttendeeRole: {
      PK_MARID: 0,
    },
    AttendeeAvailability: {
      PK_AAID: 1,
    },
  });

  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);

  //Get Current User ID
  let createrID = localStorage.getItem("userID");

  // for   dropdown Attendees List
  const [optiosnMeetingAttendeesList, setOptiosnMeetingAttendeesList] =
    useState([]);

  // for   selected Attendees Name
  const [selectedAttendeesName, setSelectedAttendeesName] = useState("");

  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");

  // for   List Of Attachments
  const [attachmentsList, setattachmentsList] = useState([]);

  let currentLanguage = localStorage.getItem("i18nextLng");

  // for   added participant  Name list
  const [addedParticipantNameList, setAddedParticipantNameList] = useState([]);
  const [startMeetingStatus, setStartMeetingStatus] = useState(false);
  const [endMeetingStatus, setEndMeetingStatus] = useState(false);
  const [isOrganizer, setOrganizer] = useState(false);
  const [minutesOftheMeatingStatus, setMinutesOftheMeatingStatus] =
    useState(false);
  // for main json for create meating
  const [createMeeting, setCreateMeeting] = useState({
    MeetingTitle: "",
    MeetingDescription: "",
    MeetingTypeID: 0,
    MeetingDate: "",
    MeetingStartTime: "",
    MeetingEndTime: "",
    MeetingLocation: "",
    MeetingReminderID: [],
    MeetingAgendas: [],
    MeetingAttendees: [],
    ExternalMeetingAttendees: [],
    MinutesOfMeeting: [],
  });

  const changeSelectDetails = () => {
    setIsDetails(true);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const changeSelectAgenda = () => {
    setIsDetails(false);
    setIsAgenda(true);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const changeSelectAttendees = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(true);
    setIsMinutes(false);
    setIsAttachments(false);
  };

  const navigateToMinutes = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(true);
    setIsAttachments(false);
  };
  const changeSelectAttachments = () => {
    setIsDetails(false);
    setIsAgenda(false);
    setIsAttendees(false);
    setIsMinutes(false);
    setIsAttachments(true);
  };
  // for reminder id's
  const optionsWithIDs = [
    { label: "On starting of meeting", id: 1 },
    { label: "10 minutes before", id: 2 },
    { label: "30 minutes before", id: 3 },
    { label: "1 hour before", id: 4 },
    { label: "5 hours before", id: 5 },
    { label: "1 day before", id: 6 },
    { label: "3 days before", id: 7 },
    { label: "7 days before", id: 8 },
  ];

  // for all details handler
  const detailsHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "MeetingStartTime") {
      setCreateMeeting({
        ...createMeeting,
        [name]: RemoveTimeDashes(value),
        "MeetingEndTime": RemoveTimeDashes(value),
      });
    } else if (name === "MeetingDate") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingLocation") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingTitle") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingDescription") {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    } else if (name === "MeetingTypeID" && (value === "" || value === 0)) {
      setCreateMeeting({
        ...createMeeting,
        [name]: parseInt(0),
      });
    } else {
      setCreateMeeting({
        ...createMeeting,
        [name]: value,
      });
    }
  };

  // for view data
  useEffect(() => {
    try {
      if (data !== null && data !== undefined) {
        let viewData = data;
        let reminder = [];
        let meetingAgenAtc = [];
        let minutesOfMeeting = [];
        let externalMeetingAttendiesList = [];
        let meetingAgenAtclis = [];
        let rightsButtons = viewData.meetingAttendees;
        let meetingStatus = viewData.meetingStatus.status;
        const found = rightsButtons.find(
          (element) => element.user.pK_UID === parseInt(createrID)
        );

        if (Object.keys(found).length > 0) {
          const found2 = found.meetingAttendeeRole.pK_MARID;
          if (parseInt(found2) === 1 || parseInt(found2) === 3) {
            setOrganizer(true);
          } else {
            setOrganizer(false);
          }
        } else {
          setOrganizer(false);
        }
        if (meetingStatus === "1") {
          setStartMeetingStatus(false);
          setEndMeetingStatus(true);
          setMinutesOftheMeatingStatus(false);
        } else if (meetingStatus === "2") {
          setStartMeetingStatus(true);
          setEndMeetingStatus(false);
          setMinutesOftheMeatingStatus(true);
        } else if (meetingStatus === "3") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else if (meetingStatus === "4") {
          setMinutesOftheMeatingStatus(true);
          setEndMeetingStatus(true);
          setStartMeetingStatus(true);
        } else {
          setEndMeetingStatus(false);
          setStartMeetingStatus(false);
        }
        viewData.meetingReminders.map((rdata) => {
          let pkid = rdata.pK_MRID;
          reminder.push(pkid);
        });
        let reminderoptionvalue = "";
        optionsWithIDs.map((opData) => {
          if (opData.id === reminder[0]) {
            reminderoptionvalue = opData.label;
          }
        });
        setMeetingReminderValue(reminderoptionvalue);
        // for meeting attendies
        let List = [];
        let emptyList = [];
        try {
          if (viewData.meetingAttendees != undefined) {
            if (viewData.meetingAttendees.length > 0) {
              viewData.meetingAttendees.map((meetingdata, index) => {
                List.push({
                  name: meetingdata.user.name,
                  designation: meetingdata.user.designation,
                  profilePicture: meetingdata.user.profilePicture,
                  organization: meetingdata.user.organization,
                  role: meetingdata.meetingAttendeeRole.pK_MARID,
                  displayProfilePic: meetingdata.user.displayProfilePictureName,
                });
                emptyList.push({
                  User: {
                    PK_UID: meetingdata.user.pK_UID,
                  },
                  MeetingAttendeeRole: {
                    PK_MARID: meetingdata.meetingAttendeeRole.pK_MARID,
                  },
                  AttendeeAvailability: {
                    PK_AAID: meetingdata.attendeeAvailability.pK_AAID,
                  },
                });
              });

              setAddedParticipantNameList(List);
            }
          }
          if (viewData.externalMeetingAttendees != undefined) {
            if (viewData.externalMeetingAttendees.length > 0) {
              viewData.externalMeetingAttendees.map(
                (externalMeetingAttendeesMeetingdata) => {
                  List.push({
                    name: externalMeetingAttendeesMeetingdata.emailAddress,
                    designation: "Default",
                    profilePicture: "Default",
                    organization: "Default",
                    role: 2,
                  });
                }
              );
            }
          }
          setAddedParticipantNameList(List);
        } catch (error) {
          console.log("error");
        }

        try {
          viewData.meetingAgendas.map((atchmenData) => {
            let opData = {
              Title: atchmenData.objMeetingAgenda.title,
              PresenterName: atchmenData.objMeetingAgenda.presenterName,
              URLs: atchmenData.objMeetingAgenda.urLs,
              FK_MDID: atchmenData.objMeetingAgenda.fK_MDID,
            };
            let file = [];
            if (atchmenData.meetingAgendaAttachments !== null) {
              atchmenData.meetingAgendaAttachments.map((atchmenDataaa) => {
                file.push({
                  PK_MAAID: atchmenDataaa.pK_MAAID,
                  DisplayAttachmentName: atchmenDataaa.displayAttachmentName,
                  OriginalAttachmentName: atchmenDataaa.originalAttachmentName,
                  CreationDateTime: atchmenDataaa.creationDateTime,
                  FK_MAID: atchmenDataaa.fK_MAID,
                });
                meetingAgenAtclis.push({
                  PK_MAAID: atchmenDataaa.pK_MAAID,
                  DisplayAttachmentName: atchmenDataaa.displayAttachmentName,
                  OriginalAttachmentName: atchmenDataaa.originalAttachmentName,
                  CreationDateTime: atchmenDataaa.creationDateTime,
                  FK_MAID: atchmenDataaa.fK_MAID,
                });
              });
            }
            meetingAgenAtc.push({
              ObjMeetingAgenda: opData,
              MeetingAgendaAttachments: file,
            });
          });
        } catch (error) {
          console.log("error", error);
        }
        try {
          viewData.minutesOfMeeting.map((minutesOfMeetingData) => {
            minutesOfMeeting.push({
              PK_MOMID: minutesOfMeetingData.pK_MOMID,
              Description: minutesOfMeetingData.description,
              CreationDate: minutesOfMeetingData.creationDate,
              CreationTime: minutesOfMeetingData.creationTime,
              FK_MDID: minutesOfMeetingData.fK_MDID,
            });
          });
        } catch (error) {
          //  Block of code to handle errors
          console.log("error");
        }
        try {
          viewData.externalMeetingAttendees.map(
            (externalMeetingAttendeesData) => {
              externalMeetingAttendiesList.push({
                PK_EMAID: externalMeetingAttendeesData.pK_EMAID,
                EmailAddress: externalMeetingAttendeesData.emailAddress,
                FK_MDID: externalMeetingAttendeesData.fK_MDID,
              });
            }
          );
        } catch (error) {
          //  Block of code to handle errors
          console.log("error");
        }
        setattachmentsList(meetingAgenAtclis);
        setCreateMeeting({
          MeetingID: viewData.meetingDetails.pK_MDID,
          MeetingTitle: viewData.meetingDetails.title,
          MeetingDescription: viewData.meetingDetails.description,
          MeetingTypeID: viewData.meetingDetails.fK_MTID,
          MeetingDate: newTimeFormaterAsPerUTCFullDate(
            viewData.meetingEvent.meetingDate + viewData.meetingEvent.startTime
          ),
          MeetingStartTime: moment(
            EditmeetingDateFormat(
              viewData.meetingEvent.meetingDate +
                viewData.meetingEvent.startTime
            )
          ).format("HH:mm:ss"),
          MeetingEndTime: viewData.meetingEvent.endTime,
          MeetingLocation: viewData.meetingEvent.location,
          MeetingReminderID: reminder,
          MeetingAgendas: meetingAgenAtc,
          MeetingAttendees: emptyList,
          ExternalMeetingAttendees: externalMeetingAttendiesList,
          MinutesOfMeeting: minutesOfMeeting,
        });
        console.log("data filter from api responce error", List);
      }
    } catch (error) {
      console.log("data filter from api responce error");
    }
  }, [data]);

  // for list of all assignees
  useEffect(() => {
    try {
      if (viewFlag) {
        dispatch(allAssignessList(navigate, t, false));
      } else {
        setViewFlag(false);
        dispatch(cleareAssigneesState());
        setIsDetails(true);
        setIsMinutes(false);
        setIsAttachments(false);
        setIsAgenda(false);
        setIsAttendees(false);
        setObjMeetingAgenda({
          Title: "",
          PresenterName: "",
          URLs: "",
          FK_MDID: 0,
        });
        setMeetingAgendaAttachments({
          MeetingAgendaAttachments: [],
        });
        setParticipantRoleName("");
        setSelectedAttendeesName("");
        setCreateMeeting({
          MeetingTitle: "",
          MeetingDescription: "",
          MeetingTypeID: 0,
          MeetingDate: "",
          MeetingStartTime: "",
          MeetingEndTime: "",
          MeetingLocation: "",
          MeetingReminderID: [],
          MeetingAgendas: [],
          MeetingAttendees: [],
          ExternalMeetingAttendees: [],
          MinutesOfMeeting: [],
        });
        setMeetingAttendees({
          User: {
            PK_UID: 0,
          },
          MeetingAttendeeRole: {
            PK_MARID: 0,
          },
          AttendeeAvailability: {
            PK_AAID: 1,
          },
        });
        setMeetingReminderValue("");
        setMeetingReminderID([]);
      }
    } catch (error) {
      console.log("viewFlag error");
    }
  }, [viewFlag]);

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {
      console.log("assignees user error");
    }
  }, [assignees.user]);

  // for  list of all assignees  drop down
  useEffect(() => {
    try {
      let user = meetingAttendeesList;
      if (user != undefined) {
        if (meetingAttendeesList.length > 0) {
          setOptiosnMeetingAttendeesList(
            meetingAttendeesList.map((data, index) => {
              return data.name;
            })
          );
        }
      }
    } catch (error) {
      console.log("meetingAttendeesList error");
    }
  }, [meetingAttendeesList]);

  // for  list of all assignees  drop down
  useEffect(() => {
    try {
      if (addedParticipantNameList != undefined) {
        if (addedParticipantNameList.length > 0) {
        }
      }
    } catch (error) {
      console.log("addedParticipantNameList error");
    }
  }, [addedParticipantNameList]);

  const startMeeting = async () => {
    await setViewFlag(false);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(createrID),
    };
    await dispatch(StartMeeting(navigate, Data, t));
    localStorage.setItem(
      "meetingTitle",
      assignees.ViewMeetingDetails.meetingDetails.title
    );
  };

  const endMeeting = async () => {
    await setViewFlag(false);
    let meetingID = assignees.ViewMeetingDetails.meetingDetails.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(createrID),
    };
    await dispatch(EndMeeting(navigate, Data, t));
  };

  const downloadClick = (e, record) => {
    let data = {
      OriginalFileName: record.OriginalAttachmentName,
      DisplayFileName: record.DisplayAttachmentName,
    };
    dispatch(DownloadFile(navigate, data, t));
  };

  return (
    <>
      <Container>
        <Modal
          onHide={() => {
            setViewFlag(false);
          }}
          show={viewFlag}
          size="lg"
          setShow={setViewFlag}
          modalParentClass="modaldialog MeetingView"
          className="MeetingView"
          ButtonTitle={ModalTitle}
          modalBodyClassName="modalMeetingViewBody"
          modalFooterClassName="modalMeetingViewFooter"
          modalHeaderClassName="modalMeetingViewHeader"
          ModalBody={
            <>
              <Row>
                <Col lg={3} md={3} sm={2} xs={12} className="isDetailBtn">
                  <Button
                    className={
                      isDetails
                        ? " btn btn-primary isDetail-View-top-btn"
                        : " btn btn-outline-primary isDetail-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Details")}
                    onClick={changeSelectDetails}
                  />
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={2}
                  xs={12}
                  className={"AgendaShowBtn" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAgenda
                        ? " btn btn-primary isAgenda-View-top-btn"
                        : " btn btn-outline-primary isAgenda-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Agendas")}
                    onClick={changeSelectAgenda}
                    datatut="show-agenda"
                  />
                </Col>
                <Col
                  lg={3}
                  md={3}
                  sm={2}
                  xs={12}
                  className={" AttendeeShowBtn" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAttendees
                        ? " btn btn-primary isAttendee-View-top-btn"
                        : " btn btn-outline-primary isAttendee-View-top-btn-Outline"
                    }
                    variant={"Primary"}
                    text={t("Attendees")}
                    datatut="show-meeting-attendees"
                    onClick={changeSelectAttendees}
                  ></Button>
                </Col>
                {minutesOftheMeatingStatus ? (
                  <Col
                    lg={2}
                    md={2}
                    sm={2}
                    xs={12}
                    className={" minutes-upper-btn" + " " + currentLanguage}
                  >
                    <Button
                      className={
                        isMinutes
                          ? " btn btn-primary isMinutes-View-top-btn"
                          : " btn btn-outline-primary isMinutes-View-top-btn-Outline"
                      }
                      variant={"Primary"}
                      text={t("Minutes")}
                      datatut="show-minutes"
                      onClick={navigateToMinutes}
                    ></Button>
                  </Col>
                ) : null}

                <Col
                  lg={2}
                  md={2}
                  sm={2}
                  xs={12}
                  className={" DataRoomShowBtn" + " " + currentLanguage}
                >
                  <Button
                    className={
                      isAttachments
                        ? " btn btn-primary isDataRoom-View-top-btn" +
                          " " +
                          currentLanguage
                        : " btn btn-outline-primary isDataRoom-View-top-btn-Outline" +
                          " " +
                          currentLanguage
                    }
                    variant={"Primary"}
                    text={t("Data-room")}
                    onClick={changeSelectAttachments}
                  />
                </Col>
                <Col lg={2} md={2} sm={2} xs={12}></Col>
              </Row>
              {isDetails ? (
                <>
                  <Row className="my-4">
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="MontserratRegular d-flex flex-column lh-sm my-3"
                    >
                      <span className="MeetingViewDateTimeTextField">
                        {createMeeting.MeetingDate}
                      </span>
                      <span className="MeetingViewLocationText_Field">
                        {createMeeting.MeetingLocation}
                      </span>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=" MeetingViewTitleTextField p-0"
                    >
                      <p className="viewModalTitle">
                        {createMeeting.MeetingTitle.length < 100
                          ? `${createMeeting.MeetingTitle}`
                          : `${createMeeting.MeetingTitle.substring(
                              0,
                              110
                            )}...`}
                      </p>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="MontserratRegular textAreaDivView p-0"
                    >
                      <TextField
                        change={detailsHandler}
                        name="MeetingDescription"
                        applyClass="form-control2 textbox-height-details-view"
                        type="text"
                        disable={true}
                        as={"textarea"}
                        rows="7"
                        value={createMeeting.MeetingDescription}
                        required
                      />
                    </Col>
                  </Row>
                </>
              ) : isAgenda ? (
                <>
                  <div className="agendaList">
                    {createMeeting.MeetingAgendas.length > 0
                      ? createMeeting.MeetingAgendas.map((data, index) => {
                          return (
                            <div className="margin-top-20">
                              <>
                                <Row className="mt-4">
                                  <Col lg={1} md={1} xs={12}>
                                    <span className=" agendaIndex">
                                      {index + 1}
                                    </span>
                                  </Col>
                                  <Col
                                    lg={7}
                                    md={7}
                                    xs={12}
                                    className="MeetingAgendaView p-0"
                                  >
                                    <p className=" agendaTitle">
                                      {data.ObjMeetingAgenda.Title}
                                    </p>

                                    {data.MeetingAgendaAttachments.length > 0
                                      ? data.MeetingAgendaAttachments.map(
                                          (
                                            MeetingAgendaAttachmentsData,
                                            index
                                          ) => {
                                            var ext =
                                              MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                "."
                                              ).pop();
                                            const first =
                                              MeetingAgendaAttachmentsData.DisplayAttachmentName.split(
                                                " "
                                              )[0];
                                            return (
                                              <Col
                                                sm={12}
                                                lg={3}
                                                md={3}
                                                className="meeting-view-file-icon"
                                                onClick={(e) =>
                                                  downloadClick(
                                                    e,
                                                    MeetingAgendaAttachmentsData
                                                  )
                                                }
                                              >
                                                {ext === "doc" ? (
                                                  <FileIcon
                                                    extension={"docx"}
                                                    size={78}
                                                    type={"document"}
                                                    labelColor={
                                                      "rgba(44, 88, 152)"
                                                    }
                                                  />
                                                ) : ext === "docx" ? (
                                                  <FileIcon
                                                    extension={"docx"}
                                                    size={78}
                                                    type={"font"}
                                                    labelColor={
                                                      "rgba(44, 88, 152)"
                                                    }
                                                  />
                                                ) : ext === "xls" ? (
                                                  <FileIcon
                                                    extension={"xls"}
                                                    type={"spreadsheet"}
                                                    size={78}
                                                    labelColor={
                                                      "rgba(16, 121, 63)"
                                                    }
                                                  />
                                                ) : ext === "xlsx" ? (
                                                  <FileIcon
                                                    extension={"xls"}
                                                    type={"spreadsheet"}
                                                    size={78}
                                                    labelColor={
                                                      "rgba(16, 121, 63)"
                                                    }
                                                  />
                                                ) : ext === "pdf" ? (
                                                  <FileIcon
                                                    extension={"pdf"}
                                                    size={78}
                                                    {...defaultStyles.pdf}
                                                  />
                                                ) : ext === "png" ? (
                                                  <FileIcon
                                                    extension={"png"}
                                                    size={78}
                                                    type={"image"}
                                                    labelColor={
                                                      "rgba(102, 102, 224)"
                                                    }
                                                  />
                                                ) : ext === "txt" ? (
                                                  <FileIcon
                                                    extension={"txt"}
                                                    size={78}
                                                    type={"document"}
                                                    labelColor={
                                                      "rgba(52, 120, 199)"
                                                    }
                                                  />
                                                ) : ext === "jpg" ? (
                                                  <FileIcon
                                                    extension={"jpg"}
                                                    size={78}
                                                    type={"image"}
                                                    labelColor={
                                                      "rgba(102, 102, 224)"
                                                    }
                                                  />
                                                ) : ext === "jpeg" ? (
                                                  <FileIcon
                                                    extension={"jpeg"}
                                                    size={78}
                                                    type={"image"}
                                                    labelColor={
                                                      "rgba(102, 102, 224)"
                                                    }
                                                  />
                                                ) : ext === "gif" ? (
                                                  <FileIcon
                                                    extension={"gif"}
                                                    size={78}
                                                    {...defaultStyles.gif}
                                                  />
                                                ) : (
                                                  <FileIcon
                                                    extension={ext}
                                                    size={78}
                                                    {...defaultStyles.ext}
                                                  />
                                                )}
                                                <p className="fileUploadLabel">
                                                  {first}
                                                </p>
                                              </Col>
                                            );
                                          }
                                        )
                                      : null}
                                  </Col>
                                  <Col
                                    lg={4}
                                    md={4}
                                    xs={12}
                                    className="MeetingAgendaPresented MeetingAgendaURL"
                                  >
                                    <TextField
                                      disable={true}
                                      name={"PresenterName"}
                                      value={
                                        data.ObjMeetingAgenda.PresenterName
                                      }
                                      applyClass="form-control2"
                                      type="text"
                                      label={t("Presented-by")}
                                    />
                                    <p className="url">
                                      {data.ObjMeetingAgenda.URLs}
                                    </p>
                                  </Col>
                                </Row>
                              </>
                            </div>
                          );
                        })
                      : null}
                  </div>
                </>
              ) : isAttendees ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=" meeting-view-attendee-organizer-tab"
                    >
                      <label>{t("Organizer")}</label>
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="meeting-view-attendee-organizer-list"
                    >
                      {addedParticipantNameList ? (
                        <>
                          <span>
                            {addedParticipantNameList.map((atList) => {
                              if (atList.role === 1 || atList.role === 3) {
                                return (
                                  <EmployeeCard
                                    employeeName={atList.name}
                                    employeeDesignation={atList.designation}
                                    cardIcon={<Check2 />}
                                    UserProfilePic={atList.displayProfilePic}
                                  />
                                );
                              }
                            })}
                          </span>
                        </>
                      ) : null}
                    </Col>
                  </Row>

                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className=" meeting-view-attendee-participant-tab"
                    >
                      <label>{t("Participants")}</label>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      xs={12}
                      className="meeting-view-attendee-participant-list"
                    >
                      {addedParticipantNameList ? (
                        <>
                          <span>
                            {addedParticipantNameList.map((atList) => {
                              if (atList.role === 2) {
                                return (
                                  <EmployeeCard
                                    employeeName={atList.name}
                                    employeeDesignation={atList.designation}
                                    cardIcon={<Check2 />}
                                    UserProfilePic={atList.displayProfilePic}
                                  />
                                );
                              }
                            })}
                          </span>
                        </>
                      ) : null}
                    </Col>
                  </Row>
                </>
              ) : isMinutes && minutesOftheMeatingStatus ? (
                <>
                  <Row>
                    <Col sm={12}>
                      <Row className="my-3 minutes-view px-3 d-flex flex-row ">
                        {createMeeting.MinutesOfMeeting.length > 0 ? (
                          createMeeting.MinutesOfMeeting.map(
                            (minutesOfMeetingLdata, index) => {
                              return (
                                <Col
                                  className="border p-2 minutes-box rounded my-2"
                                  sm={12}
                                  md={12}
                                  lg={12}
                                >
                                  <Row>
                                    <Col sm={12}>
                                      <Row>
                                        <Col sm={1}>
                                          <span className="agendaIndex">
                                            {index + 1}
                                          </span>
                                        </Col>
                                        <Col sm={11} className="fs-6">
                                          <p className="agendaTitle meeting-view-minutes-title">
                                            {minutesOfMeetingLdata.Description}
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                              );
                            }
                          )
                        ) : (
                          <Row className="meeting-view-minutes-tab">
                            <Col
                              lg={12}
                              md={12}
                              xs={12}
                              className="d-flex justify-content-center align-items-center"
                            >
                              <h3>{t("There-is-no-minutes-of-meeting")}</h3>
                            </Col>
                          </Row>
                        )}
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : isAttachments ? (
                <>
                  <Row className="mt-4">
                    {attachmentsList.length > 0
                      ? attachmentsList.map((data, index) => {
                          var ext = data.DisplayAttachmentName.split(".").pop();
                          const first =
                            data.DisplayAttachmentName.split(" ")[0];
                          return (
                            <Col
                              sm={6}
                              lg={3}
                              md={3}
                              className="meeting-view-dataroom-attachment"
                              onClick={(e) => downloadClick(e, data)}
                            >
                              <FileIcon
                                extension={ext}
                                {...defaultStyles.ext}
                              />
                              <p className="fileUploadLabel">{first}</p>
                            </Col>
                          );
                        })
                      : null}
                  </Row>
                </>
              ) : null}
            </>
          }
          ModalFooter={
            <>
              {isDetails ? (
                <>
                  {isOrganizer ? (
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        xs={12}
                        className="d-flex justify-content-end"
                      >
                        <Button
                          onClick={startMeeting}
                          className={
                            " btn btn-primary start-meeting-button" +
                            " " +
                            currentLanguage
                          }
                          text={t("Start-meeting")}
                          disableBtn={startMeetingStatus}
                        />
                        <Button
                          onClick={endMeeting}
                          className={
                            " btn btn-primary end-meeting-btn" +
                            " " +
                            currentLanguage
                          }
                          text={t("End-meeting")}
                          disableBtn={endMeetingStatus}
                        />
                      </Col>
                    </Row>
                  ) : null}
                </>
              ) : null}
            </>
          }
        />
      </Container>
    </>
  );
};

export default MeetingViewModalCalendar;
