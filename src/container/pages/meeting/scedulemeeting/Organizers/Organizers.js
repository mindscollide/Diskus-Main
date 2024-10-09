import React, { useState, useEffect } from "react";
import styles from "./Organizers.module.css";
import {
  Button,
  Table,
  TextField,
  Switch,
  Notification,
} from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import addmore from "../../../../../assets/images/addmore.png";
import greenMailIcon from "../../../../../assets/images/greenmail.svg";
import redMailIcon from "../../../../../assets/images/redmail.svg";
import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import CrossResolution from "../../../../../assets/images/resolutions/cross_icon_resolution.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAddUserModal,
  showCrossConfirmationModal,
  showNotifyOrganizors,
  sendRecentNotificationOrganizerModal,
  UpdateMeetingUserForOrganizers,
  showCancelModalOrganizers,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
} from "../../../../../store/actions/NewMeetingActions";
import ModalOrganizor from "./ModalAddUserOrganizer/ModalOrganizor";
import ModalCrossIcon from "./ModalCrossIconClick/ModalCrossIcon";
import NotifyOrganizers from "./NotifyOrganizers/NotifyOrganizers";
import SendNotificationOrganizer from "./NotifyOrganizers/SendRecentNotification";
import OrganizersViewPage from "./OrganizerViewPage/OrganizersViewPage";
import {
  clearResponseMessage,
  UpdateOrganizersMeeting,
  GetAllMeetingOrganizers,
  meetingOrganizers,
  selectedMeetingOrganizers,
  saveMeetingFlag,
  editMeetingFlag,
  notificationSendData,
} from "../../../../../store/actions/MeetingOrganizers_action";
import {
  getAgendaAndVotingInfo_success,
  GetCurrentAgendaDetails,
  getAgendaVotingDetails_success,
  saveFiles_success,
  saveAgendaVoting_success,
  addUpdateAdvanceMeetingAgenda_success,
  uploadDocument_success,
  getAllVotingResultDisplay_success,
} from "../../../../../store/actions/MeetingAgenda_action";
import CancelModalOrganizer from "./CancelModalOrganizer/CancelModalOrganizer";
import NextModal from "../meetingDetails/NextModal/NextModal";
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";

const Organizers = ({
  setAgendaContributors,
  setmeetingDetails,
  setorganizers,
  setParticipants,
  setAgenda,
  setMinutes,
  setactionsPage,
  setAttendance,
  setPolls,
  setMeetingMaterial,
  setSceduleMeeting,
  currentMeeting,
  editorRole,
  isEditMeeting,
  setPublishState,
  setAdvanceMeetingModalID,
  setCalendarViewModal,
  setDataroomMapFolderId,
  setEdiorRole,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentUserEmail = localStorage.getItem("userEmail");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentUserName = localStorage.getItem("name");
  const [isEdit, setIsEdit] = useState(false);
  const [isEditValue, setEditValue] = useState(1);
  const [viewOrganizers, setviewOrganizers] = useState(false);
  const [flag, setFlag] = useState(2);
  const [prevFlag, setprevFlag] = useState(2);
  const [editState, setEditState] = useState(false);
  const [isPublishedState, setIsPublishedState] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const { NewMeetingreducer, MeetingOrganizersReducer } = useSelector(
    (state) => state
  );

  const handleCancelOrganizer = () => {
    dispatch(showCancelModalOrganizers(true));
  };

  const [inputValues, setInputValues] = useState({});

  const currentOrganizerData = {
    displayPicture: "",
    email: currentUserEmail,
    isChecked: true,
    isPrimaryOrganizer: true,
    isOrganizerNotified: true,
    isRSVP: true,
    organizerTitle: "",
    userID: currentUserID,
    userName: currentUserName,
    isDeletable: false,
  };

  const [rowsData, setRowsData] = useState([currentOrganizerData]);

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    let Data = { MeetingID: currentMeeting };
    dispatch(GetAllMeetingOrganizers(Data, navigate, t));
    return () => {
      setInputValues({});
      setRowsData([currentOrganizerData]);
      setOpen({
        open: false,
        message: "",
      });
    };
  }, []);

  const handleInputChange = (userID, newValue) => {
    setInputValues((prevInputValues) => ({
      ...prevInputValues,
      [userID]: newValue,
    }));
    setRowsData((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            organizerTitle: newValue,
          };
        }
        return row;
      });
    });
  };

  const handleSwitchChange = (checked, rowIndex) => {
    const updatedRowsData = rowsData.map((row, index) => {
      if (index === rowIndex) {
        return {
          ...row,
          isPrimaryOrganizer: checked,
        };
      }
      return {
        ...row,
        isPrimaryOrganizer: false,
      };
    });
    setRowsData(updatedRowsData);
  };

  let allowRSVPValue =
    MeetingOrganizersReducer?.AllMeetingOrganizersData?.allowRSVP;
  let MeetingColoumns = [];
  if (allowRSVPValue === true) {
    MeetingColoumns = [
      {
        title: (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span>{t("Name")}</span>
              </Col>
            </Row>
          </>
        ),
        dataIndex: "userName",
        key: "userName",
        ellipsis: true,
        align: "left",
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Organizer-title"),
        dataIndex: "organizerTitle",
        key: "organizerTitle",
        ellipsis: true,
        align: "left",
        render: (text, record) => {
          if (
            (Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
            editorRole.role === "Organizer" &&
            isEditMeeting === true
          ) {
            return text;
          } else if (
            editorRole.role === "Agenda Contributor" &&
            isEditMeeting === true
          ) {
            return text;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    placeholder={t("Organizer-title")}
                    labelclass={"d-none"}
                    applyClass={"Organizer_table"}
                    maxLength={140}
                    value={text} // Use the controlled value
                    change={(e) =>
                      handleInputChange(record.userID, e.target.value)
                    } // Update the inputValues when the user types
                    disable={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : record.disabledTitle === true
                        ? true
                        : false
                    }
                  />
                </Col>
              </Row>
            );
          }
        },
      },

      {
        dataIndex: "isPrimaryOrganizer",
        key: "isPrimaryOrganizer",
        align: "center",
        ellipsis: "120px",
        render: (text, record, rowIndex) => (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 align-items-center"
            >
              <Switch
                checkedValue={text}
                onChange={(checked) => handleSwitchChange(checked, rowIndex)}
                disabled={record.disabledSwitch === true ? true : false}
              />
              <label className="column-boldness w-100">{t("Primary")}</label>
            </Col>
          </Row>
        ),
      },

      {
        title: "RSVP",
        dataIndex: "attendeeAvailability",
        key: "attendeeAvailability",
        ellipsis: true,
        align: "left",

        render: (text, record) => {
          if (record.attendeeAvailability === 1) {
            return (
              <img
                draggable={false}
                src={AwaitingResponse}
                height="30px"
                width="30px"
                alt=""
              />
            );
          } else if (record.attendeeAvailability === 2) {
            return (
              <img
                draggable={false}
                src={thumbsup}
                height="30px"
                width="30px"
                alt=""
              />
            );
          } else if (record.attendeeAvailability === 3) {
            return (
              <img
                draggable={false}
                src={thumbsdown}
                height="30px"
                width="30px"
                alt=""
              />
            );
          } else if (record.attendeeAvailability === 4) {
            return (
              <img
                draggable={false}
                src={TentativelyAccepted}
                height="30px"
                width="30px"
                alt=""
              />
            );
          }
        },
      },

      {
        title: t("Notification"),
        dataIndex: "isOrganizerNotified",
        key: "isOrganizerNotified",
        ellipsis: true,
        align: "left",
        render: (text, record) => {
          if (record.isOrganizerNotified === true) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  {record.disabledNotification === true ? (
                    <img
                      draggable={false}
                      src={greenMailIcon}
                      height="30px"
                      width="30px"
                      alt=""
                    />
                  ) : (
                    <img
                      draggable={false}
                      src={greenMailIcon}
                      height="30px"
                      width="30px"
                      onClick={() => sendRecentNotification(record)}
                      className="cursor-pointer"
                      alt=""
                    />
                  )}
                </Col>
              </Row>
            );
          } else if (record.isOrganizerNotified === false) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  {record.disabledNotification === true ? (
                    <img
                      draggable={false}
                      src={redMailIcon}
                      height="30px"
                      width="30px"
                      alt=""
                    />
                  ) : (
                    <img
                      draggable={false}
                      src={redMailIcon}
                      height="30px"
                      width="30px"
                      onClick={() => sendRecentNotification(record)}
                      className="cursor-pointer"
                      alt=""
                    />
                  )}
                </Col>
              </Row>
            );
          }
        },
      },
      {
        dataIndex: "isDeletable",
        key: "isDeletable",
        ellipsis: true,
        align: "left",

        render: (text, record) => {
          if (record.isDeletable === true) {
            return (
              <img
                draggable={false}
                src={CrossResolution}
                height="30px"
                alt=""
                width="30px"
                className="cursor-pointer"
                onClick={() => deleteRow(record)}
              />
            );
          } else {
            return null;
          }
        },
      },
    ];
  } else {
    MeetingColoumns = [
      {
        title: (
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span>{t("Name")}</span>
              </Col>
            </Row>
          </>
        ),
        dataIndex: "userName",
        key: "userName",
        ellipsis: true,
        align: "left",
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Organizer-title"),
        dataIndex: "organizerTitle",
        key: "organizerTitle",
        ellipsis: true,
        align: "left",
        render: (text, record) => {
          if (
            (Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
            editorRole.role === "Organizer" &&
            isEditMeeting === true
          ) {
            return text;
          } else if (
            editorRole.role === "Agenda Contributor" &&
            isEditMeeting === true
          ) {
            return text;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    placeholder={t("Organizer-title")}
                    labelclass={"d-none"}
                    applyClass={"Organizer_table"}
                    maxLength={140}
                    value={text} // Use the controlled value
                    change={(e) =>
                      handleInputChange(record.userID, e.target.value)
                    } // Update the inputValues when the user types
                    disable={
                      (Number(editorRole.status) === 9 ||
                        Number(editorRole.status) === 8 ||
                        Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true
                        ? true
                        : editorRole.role === "Agenda Contributor" &&
                          isEditMeeting === true
                        ? true
                        : record.disabledTitle === true
                        ? true
                        : false
                    }
                  />
                </Col>
              </Row>
            );
          }
        },
      },

      {
        dataIndex: "isPrimaryOrganizer",
        key: "isPrimaryOrganizer",
        align: "left",
        ellipsis: "190px",
        render: (text, record, rowIndex) => (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 align-items-center"
            >
              <Switch
                checkedValue={text}
                onChange={(checked) => handleSwitchChange(checked, rowIndex)}
                disabled={record.disabledSwitch === true ? true : false}
              />
              <label className="column-boldness w-100">{t("Primary")}</label>
            </Col>
          </Row>
        ),
      },

      {
        title: t("Notification"),
        dataIndex: "isOrganizerNotified",
        key: "isOrganizerNotified",
        ellipsis: true,
        align: "left",
        render: (text, record) => {
          if (record.isOrganizerNotified === true) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  {record.disabledNotification === true ? (
                    <img
                      draggable={false}
                      src={greenMailIcon}
                      height="30px"
                      width="30px"
                      alt=""
                    />
                  ) : (
                    <img
                      draggable={false}
                      src={greenMailIcon}
                      height="30px"
                      width="30px"
                      onClick={() => sendRecentNotification(record)}
                      className="cursor-pointer"
                      alt=""
                    />
                  )}
                </Col>
              </Row>
            );
          } else if (record.isOrganizerNotified === false) {
            return (
              <Row>
                <Col
                  lg={7}
                  md={7}
                  sm={7}
                  className="d-flex justify-content-center"
                >
                  {record.disabledNotification === true ? (
                    <img
                      draggable={false}
                      src={redMailIcon}
                      height="30px"
                      width="30px"
                      alt=""
                    />
                  ) : (
                    <img
                      draggable={false}
                      src={redMailIcon}
                      height="30px"
                      width="30px"
                      onClick={() => sendRecentNotification(record)}
                      className="cursor-pointer"
                      alt=""
                    />
                  )}
                </Col>
              </Row>
            );
          }
        },
      },
      {
        // title: t('RSVP'),
        dataIndex: "isDeletable",
        key: "isDeletable",
        ellipsis: true,
        align: "left",
        render: (text, record) => {
          if (record.isDeletable === true) {
            return (
              <img
                draggable={false}
                src={CrossResolution}
                height="30px"
                alt=""
                width="30px"
                className="cursor-pointer"
                onClick={() => deleteRow(record)}
              />
            );
          } else {
            return null;
          }
        },
      },
    ];
  }

  const sendRecentNotification = (record) => {
    if (
      (Number(editorRole.status) === 9 ||
        Number(editorRole.status) === 8 ||
        Number(editorRole.status) === 10) &&
      editorRole.role === "Organizer" &&
      isEditMeeting === true
    ) {
    } else if (
      editorRole.role === "Agenda Contributor" &&
      isEditMeeting === true
    ) {
    } else {
      dispatch(sendRecentNotificationOrganizerModal(true));
      dispatch(notificationSendData([record]));
    }
  };

  const deleteRow = (recordToDelete) => {
    let findisPrimary = rowsData.filter(
      (rowData, index) => rowData.isPrimaryOrganizer === true
    );
    if (recordToDelete.isPrimaryOrganizer) {
      if (findisPrimary.length === 1) {
        setOpen({
          message: t("Primary-organizer-doesn't-deleted"),
          open: true,
        });
      } else {
      }
    } else {
      setRowsData((prevRowsData) =>
        prevRowsData.filter((record) => record !== recordToDelete)
      );
    }
  };

  const openAddUserModal = () => {
    setEditValue(1);
    dispatch(showAddUserModal(true));
    dispatch(saveMeetingFlag(true));
  };

  const previousTabOrganizer = () => {
    setmeetingDetails(true);
    setAgendaContributors(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
  };

  const handlePublishButton = () => {
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    let Data = { MeetingID: currentMeeting, StatusID: 1 };
    dispatch(
      UpdateOrganizersMeeting(
        false,
        navigate,
        t,
        5,
        Data,
        setEdiorRole,
        setAdvanceMeetingModalID,
        setDataroomMapFolderId,
        setSceduleMeeting,
        setPublishState,
        setCalendarViewModal
      )
    );

    setRowsData([]);
  };

  const nextTabOrganizer = () => {
    setviewOrganizers(!viewOrganizers);
    setRowsData([]);
    setAgendaContributors(true);
    setmeetingDetails(false);
    setorganizers(false);
    setParticipants(false);
    setAgenda(false);
    setMinutes(false);
    setactionsPage(false);
    setAttendance(false);
    setPolls(false);
    setMeetingMaterial(false);
    setRowsData([]);
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(true));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(false));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };

  const enableEditButton = () => {
    setIsEdit(true);
    const updatedRowsData = rowsData.map((row) => ({
      ...row,
      disabledNotification: true,
      disabledRSVP: true,
      disabledSwitch: false,
      disabledTitle: false,
      isDeletable: true,
      isEdit: false,
    }));
    // dispatch(editMeetingFlag(true));
    setEditValue(2);
    setRowsData(updatedRowsData);
  };

  const handleEditDone = () => {
    setEditState(false);
  };

  const handleCancelEdit = () => {
    setIsEdit(false);
    setEditState(false);
    dispatch(meetingOrganizers([]));
    dispatch(selectedMeetingOrganizers([]));
    dispatch(saveMeetingFlag(false));
    dispatch(editMeetingFlag(false));
    const allMeetingOrganizers =
      MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers;
    setIsPublishedState(
      MeetingOrganizersReducer.AllMeetingOrganizersData.isPublished
    );
    const updatedMeetingOrganizers = allMeetingOrganizers.map((organizer) => ({
      ...organizer,
      disabledNotification: false,
      disabledTitle: true,
      disabledSwitch: true,
      disabledRSVP: false,
      isDeletable: false,
    }));

    setRowsData(updatedMeetingOrganizers);
  };

  const saveMeetingOrganizers = () => {
    let newarry = [];
    rowsData.forEach((organizerData, organizerIndex) => {
      newarry.push(organizerData.userID);
    });
    let findisOrganizerisExist = rowsData.some(
      (data, index) => data.isPrimaryOrganizer === true
    );
    let Data = {
      MeetingID: currentMeeting,
      MeetingAttendeRoleID: 1,
      UpdatedUsers: newarry,
    };
    if (findisOrganizerisExist) {
      dispatch(
        UpdateMeetingUserForOrganizers(
          navigate,
          Data,
          t,
          saveMeetingFlag,
          editMeetingFlag,
          rowsData,
          currentMeeting,
          isEditValue,
          notificationMessage,
          setIsEdit
        )
      );
      setIsEdit(false);
    } else {
      setOpen({
        message: t("At-least-one-primary-organizer-is-required"),
        open: true,
      });
    }
  };

  useEffect(() => {
    if (
      MeetingOrganizersReducer.AllMeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.AllMeetingOrganizersData !== null &&
      MeetingOrganizersReducer.AllMeetingOrganizersData.length !== 0
    ) {
      const allMeetingOrganizers =
        MeetingOrganizersReducer.AllMeetingOrganizersData.meetingOrganizers;

      const updatedMeetingOrganizers = allMeetingOrganizers.map(
        (organizer) => ({
          ...organizer,
          disabledNotification: false,
          disabledTitle: true,
          disabledSwitch: true,
          disabledRSVP: false,
          isDeletable: false,
          NotificationMessage: "",
          isEdit: true,
        })
      );

      setRowsData(updatedMeetingOrganizers);
    }
    setIsPublishedState(
      MeetingOrganizersReducer.AllMeetingOrganizersData.isPublished
    );
  }, [MeetingOrganizersReducer.AllMeetingOrganizersData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.MeetingOrganizersData !== undefined &&
      MeetingOrganizersReducer.MeetingOrganizersData !== null &&
      MeetingOrganizersReducer.MeetingOrganizersData.length !== 0
    ) {
      const updatedRowsData = rowsData.map((organizer) => {
        const matchingOrganizer =
          MeetingOrganizersReducer.MeetingOrganizersData.find(
            (user) => user.userID === organizer.userID
          );

        if (matchingOrganizer) {
          // If a matching organizer is found in the global state, update the properties
          return {
            ...organizer,
            disabledTitle: matchingOrganizer.disabledTitle,
            disabledNotification: matchingOrganizer.disabledNotification,
            disabledSwitch: matchingOrganizer.disabledSwitch,
            disabledRSVP: matchingOrganizer.disabledRSVP,
            email: matchingOrganizer.email,
            isDeletable: matchingOrganizer.isDeletable,
            isOrganizerNotified: matchingOrganizer.isOrganizerNotified,
            isPrimaryOrganizer: matchingOrganizer.isPrimaryOrganizer,
            meetingID: currentMeeting,
            organizerTitle: matchingOrganizer.organizerTitle,
            rsvp: matchingOrganizer.rsvp,
            userName: matchingOrganizer.userName,
            NotificationMessage: matchingOrganizer.NotificationMessage,
            isEdit: false,
          };
        }

        return organizer;
      });

      // Check for any new organizers in MeetingOrganizersData that are not in rowsData
      MeetingOrganizersReducer.MeetingOrganizersData.forEach((organizer) => {
        if (!updatedRowsData.some((user) => user.userID === organizer.userID)) {
          updatedRowsData.push({
            ...organizer,
            disabledTitle: organizer.disabledTitle,
            disabledNotification: organizer.disabledNotification,
            disabledSwitch: organizer.disabledSwitch,
            disabledRSVP: organizer.disabledRSVP,
            email: organizer.email,
            isDeletable: organizer.isDeletable,
            isOrganizerNotified: organizer.isOrganizerNotified,
            isPrimaryOrganizer: organizer.isPrimaryOrganizer,
            meetingID: currentMeeting,
            organizerTitle: organizer.organizerTitle,
            rsvp: organizer.rsvp,
            userName: organizer.userName,
            NotificationMessage: organizer.NotificationMessage,
            isEdit: true,
          });
        }
      });

      // Set the updated rowsData
      setRowsData(updatedRowsData);
    }
  }, [MeetingOrganizersReducer.MeetingOrganizersData]);

  useEffect(() => {
    const updatedRowsData = [...rowsData];

    MeetingOrganizersReducer.NotificationUpdateData.forEach((data) => {
      const index = updatedRowsData.findIndex(
        (rowData) => rowData.userID === data.userID
      );

      if (index !== -1) {
        updatedRowsData[index] = {
          ...updatedRowsData[index],
          isOrganizerNotified: true,
        };
      }
    });

    // Update the rowsData state with the modified data
    setRowsData(updatedRowsData);
  }, [MeetingOrganizersReducer.NotificationUpdateData]);

  useEffect(() => {
    if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Organizers-saved-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Organizers-saved-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-sent-successfully"),
        }),
        3000
      );
    } else if (
      MeetingOrganizersReducer.ResponseMessage ===
      "Notification-not-sent-successfully"
    ) {
      setTimeout(
        setOpen({
          open: true,
          message: t("Notification-not-sent-successfully"),
        }),
        3000
      );
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingOrganizersReducer.ResponseMessage]);

  console.log(
    "MeetingOrganizersReducerMeetingOrganizersReducer",
    MeetingOrganizersReducer
  );

  useEffect(() => {
    dispatch(getAgendaAndVotingInfo_success([], ""));
    dispatch(GetCurrentAgendaDetails([]));
    dispatch(getAgendaVotingDetails_success([], ""));
    dispatch(saveFiles_success(null, ""));
    dispatch(saveAgendaVoting_success([], ""));
    dispatch(addUpdateAdvanceMeetingAgenda_success([], ""));
    dispatch(uploadDocument_success(null, ""));
    dispatch(getAllVotingResultDisplay_success([], ""));
    return () => {
      dispatch(saveMeetingFlag(false));
      dispatch(editMeetingFlag(false));
    };
  }, []);

  return (
    <>
      {viewOrganizers ? (
        <OrganizersViewPage />
      ) : (
        <>
          <section className="position-relative">
            <Row className="mt-4 m-0 p-0">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-4"
              >
                {isEdit ? (
                  <>
                    <Row className="d-flex align-items-center gap-2">
                      <Col lg={12} md={12} sm={12}>
                        <Button
                          text={t("Cancel")}
                          className={styles["publish_button_Organization"]}
                          style={{ marginRight: "10px" }}
                          onClick={handleCancelEdit}
                        />

                        <Button
                          text={t("Save")}
                          className={styles["Next_Organization"]}
                          onClick={() => saveMeetingOrganizers(1)}
                        />
                      </Col>
                    </Row>
                  </>
                ) : (Number(editorRole.status) === 9 ||
                    Number(editorRole.status) === 8 ||
                    Number(editorRole.status) === 10) &&
                  editorRole.role === "Organizer" &&
                  isEditMeeting === true ? null : editorRole.role ===
                    "Agenda Contributor" && isEditMeeting === true ? null : (
                  <>
                    <Button
                      text={t("Edit")}
                      className={styles["Edit_Button_Organizers"]}
                      icon={
                        <img
                          draggable={false}
                          src={EditIcon}
                          width="11.75px"
                          height="11.75px"
                          alt=""
                        />
                      }
                      onClick={enableEditButton}
                    />
                    <Button
                      text={t("Add-more")}
                      icon={<img draggable={false} src={addmore} alt="" />}
                      className={styles["AddMoreBtn"]}
                      onClick={openAddUserModal}
                    />
                  </>
                )}
              </Col>
            </Row>
            <section className={styles["height2"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Table
                    column={MeetingColoumns}
                    scroll={{ y: "62vh" }}
                    pagination={false}
                    className="Polling_table"
                    rows={rowsData}
                  />
                </Col>
              </Row>

              {!isEdit ? (
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <section className={styles["Footer_button"]}>
                      <Button
                        text={t("Cancel")}
                        className={styles["Cancel_Organization"]}
                        onClick={handleCancelOrganizer}
                      />

                      <Button
                        text={t("Next")}
                        className={styles["publish_button_Organization"]}
                        onClick={nextTabOrganizer}
                      />

                      {Number(editorRole.status) === 11 ||
                      Number(editorRole.status) === 12 ? (
                        <Button
                          disableBtn={
                            Number(currentMeeting) === 0 ||
                            isPublishedState === false
                              ? true
                              : false
                          }
                          text={t("Publish")}
                          className={styles["Next_Organization"]}
                          onClick={handlePublishButton}
                        />
                      ) : isEditMeeting === true ? null : (
                        <Button
                          disableBtn={
                            Number(currentMeeting) === 0 ||
                            isPublishedState === false
                              ? true
                              : false
                          }
                          text={t("Publish")}
                          className={styles["Next_Organization"]}
                          onClick={handlePublishButton}
                        />
                      )}
                    </section>
                  </Col>
                </Row>
              ) : null}
            </section>
          </section>
        </>
      )}
      <Notification setOpen={setOpen} open={open.open} message={open.message} />
      {NewMeetingreducer.adduserModal && (
        <ModalOrganizor currentMeeting={currentMeeting} />
      )}
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.notifyOrganizors && (
        <NotifyOrganizers
          notificationMessage={notificationMessage}
          setNotificationMessage={setNotificationMessage}
          setIsEdit={setIsEdit}
        />
      )}
      {NewMeetingreducer.sendNotificationOrganizerModal === true ? (
        <SendNotificationOrganizer currentMeeting={currentMeeting} />
      ) : null}
      {NewMeetingreducer.cancelModalOrganizer && (
        <CancelModalOrganizer setSceduleMeeting={setSceduleMeeting} />
      )}
      {NewMeetingreducer.nextConfirmModal && (
        <NextModal
          setAgendaContributors={setAgendaContributors}
          setmeetingDetails={setmeetingDetails}
          setorganizers={setorganizers}
          setParticipants={setParticipants}
          setAgenda={setAgenda}
          setMinutes={setMinutes}
          setactionsPage={setactionsPage}
          setAttendance={setAttendance}
          setPolls={setPolls}
          setMeetingMaterial={setMeetingMaterial}
          setRowsData={setRowsData}
          flag={flag}
        />
      )}
      {NewMeetingreducer.ShowPreviousModal && (
        <PreviousModal
          setAgendaContributors={setAgendaContributors}
          setmeetingDetails={setmeetingDetails}
          setorganizers={setorganizers}
          setParticipants={setParticipants}
          setAgenda={setAgenda}
          setMinutes={setMinutes}
          setactionsPage={setactionsPage}
          setAttendance={setAttendance}
          setPolls={setPolls}
          setMeetingMaterial={setMeetingMaterial}
          setRowsData={setRowsData}
          prevFlag={prevFlag}
        />
      )}
    </>
  );
};

export default Organizers;
