import React, { useState } from "react";
import styles from "./Participants.module.css";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";
import addmore from "../../../../../assets/images/addmore.png";

import AwaitingResponse from "../../../../../assets/images/Awaiting-response.svg";
import TentativelyAccepted from "../../../../../assets/images/Tentatively-accepted.svg";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import thumbsup from "../../../../../assets/images/thumbsup.svg";
import thumbsdown from "../../../../../assets/images/thumbsdown.svg";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Notification,
  Table,
  TextField,
} from "../../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import {
  GetAllParticipantsRoleNew,
  GetAllSavedparticipantsAPI,
  UpdateMeetingUserApiFunc,
  showAddParticipantsModal,
  showCancelModalPartipants,
  showCrossConfirmationModal,
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
import AddParticipantModal from "./AddParticipantModal/AddParticipantModal";
import { CancelParticipants } from "./CancelParticipants/CancelParticipants";
import ProposedMeetingDate from "./ProposedMeetingDate/ProposedMeetingDate";
import { useEffect } from "react";
import NextModal from "../meetingDetails/NextModal/NextModal";
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";
import { Tooltip } from "antd";
import { checkFeatureIDAvailability } from "../../../../../commen/functions/utils";

const Participants = ({
  setParticipants,
  setAgenda,
  setProposedMeetingDates,
  proposedMeetingDates,
  setSceduleMeeting,
  currentMeeting,
  setAgendaContributors,
  editorRole,
  setEditMeeting,
  isEditMeeting,
  setPublishState,
  setAdvanceMeetingModalID,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  setDataroomMapFolderId,
  setCurrentMeetingID,
  setEdiorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [particpantsRole, setParticpantsRole] = useState([]);
  const [editableSave, setEditableSave] = useState(0);
  const [isPublishedState, setIsPublishedState] = useState(false);

  const [flag, setFlag] = useState(4);
  const [prevFlag, setprevFlag] = useState(4);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [rspvRows, setrspvRows] = useState([]);

  const callApiOnComponentMount = async () => {
    await dispatch(GetAllParticipantsRoleNew(navigate, t));
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    await dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
  };

  //For participants Role
  useEffect(() => {
    callApiOnComponentMount();
  }, []);

  //open row icon cross modal
  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };

  //Opens Add more modal
  const openAddPartcipantModal = () => {
    setEditableSave(2);
    dispatch(showAddParticipantsModal(true));
  };

  // handling save and next button
  const handleNextButton = () => {
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
    // setParticipants(false);
    // setAgenda(true);
  };

  //For menu Portal of the React select
  const customStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  //Roles Drop Down Data
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles !== null &&
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles !== undefined
      ) {
        let Newdata = [];
        NewMeetingreducer.getAllPartiicpantsRoles.participantRoles.map(
          (data, index) => {
            Newdata.push({
              value: data.participantRoleID,
              label: data.participantRole,
            });
          }
        );
        setParticpantsRole(Newdata);
      }
    } catch (error) {}
  }, [NewMeetingreducer.getAllPartiicpantsRoles]);

  useEffect(() => {
    let getAllData = [];
    if (
      NewMeetingreducer.getAllSavedparticipants !== null &&
      NewMeetingreducer.getAllSavedparticipants !== undefined &&
      NewMeetingreducer.getAllSavedparticipants.length > 0
    ) {
      if (NewMeetingreducer.getAllSavedparticipants.length > 0) {
        NewMeetingreducer.getAllSavedparticipants.forEach((data, index) => {
          getAllData.push({
            IsOrganizerNotified: false,
            IsPrimaryOrganizer: false,
            Title: data.participantTitle,
            displayPicture: "",
            email: data.emailAddress,
            isRSVP: data.rsvp,
            participantRole: data.participantRole,
            userID: data.userID,
            userName: data.userName,
            isComingApi: true,
            attendeeAvailability: data.attendeeAvailability,
          });
        });
      } else {
        // IsParticipantsAddFlow;
      }
      setIsPublishedState(NewMeetingreducer.getAllSavedparticipantsIsPublished);
      setrspvRows(getAllData);
    } else {
      setrspvRows([]);
    }
  }, [NewMeetingreducer.getAllSavedparticipants]);

  const handleSelectChange = (userID, selectedOption) => {
    setrspvRows((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            participantRole: {
              participantRole: selectedOption.label,
              participantRoleID: selectedOption.value,
            },
          };
        }
        return row;
      });
    });
  };

  const handleCancelingRow = (record) => {
    let removingfromrow = rspvRows.filter(
      (data, index) => data.userID !== record.userID
    );
    setrspvRows(removingfromrow);
    if (rspvRows.length === 1) {
      setIsEditClicked(true);
    }
  };

  let allowRSVPValue = NewMeetingreducer?.getAllSavedparticipantsAllowrsvp;
  let ParticipantsColoumn = [];
  if (allowRSVPValue === true) {
    ParticipantsColoumn = [
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
        align: "left",
        ellipsis: true,
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Participant-title"),
        dataIndex: "participantTitle",
        key: "participantTitle",
        ellipsis: true,

        align: "left",
        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
            return <p>{record.Title}</p>;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <>
                    <TextField
                      disable={record.isComingApi === true ? true : false}
                      placeholder={t("Participant-title")}
                      labelClass={"d-none"}
                      applyClass={"Organizer_table"}
                      maxLength={140}
                      value={
                        record.isComingApi === true
                          ? record.Title
                          : record.Title || ""
                      }
                      change={(e) =>
                        handleInputChange(record.userID, e.target.value)
                      } // Update the inputValues when the user types
                    />
                  </>
                </Col>
              </Row>
            );
          }
        },
      },

      {
        title: t("Role"),
        dataIndex: "participantRole",
        key: "participantRole",
        align: "left",
        ellipsis: true,

        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
            return <p>{record?.participantRole?.participantRole}</p>;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <>
                    <Select
                      isDisabled={record.isComingApi === true ? true : false}
                      options={particpantsRole}
                      menuPortalTarget={document.body}
                      styles={customStyles}
                      classNamePrefix={"ParticipantRole"}
                      value={
                        record.isComingApi === true
                          ? {
                              value: record?.participantRole?.participantRoleID,
                              label: record?.participantRole?.participantRole,
                            }
                          : {
                              value: record?.participantRole?.participantRoleID,
                              label: record?.participantRole?.participantRole,
                            }
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange(record.userID, selectedOption)
                      }
                      isSearchable={false}
                    />
                  </>
                </Col>
              </Row>
            );
          }
        },
      },

      {
        title: t("RSVP"),
        dataIndex: "attendeeAvailability",
        key: "attendeeAvailability",
        align: "left",
        ellipsis: true,

        render: (text, record) => {
          if (record.attendeeAvailability === 1) {
            return (
              <Tooltip placement="bottomLeft" title={t("Response-awaited")}>
                <img
                  draggable={false}
                  src={AwaitingResponse}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
            );
          } else if (record.attendeeAvailability === 2) {
            return (
              <Tooltip placement="bottomLeft" title={t("Accepted")}>
                <img
                  draggable={false}
                  src={thumbsup}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
            );
          } else if (record.attendeeAvailability === 3) {
            return (
              <Tooltip placement="bottomLeft" title={t("Rejected")}>
                <img
                  draggable={false}
                  src={thumbsdown}
                  height="30px"
                  width="30px"
                  alt=""
                />
              </Tooltip>
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
        // render: (text, record) => {
        //   if (record.isRSVP === true) {
        //     return (
        //       <img
        //         draggable={false}
        //         src={thumbsup}
        //         height="30px"
        //         width="30px"
        //         alt=""
        //       />
        //     );
        //   } else {
        //     return (
        //       <img
        //         draggable={false}
        //         src={thumbsdown}
        //         height="30px"
        //         width="30px"
        //         alt=""
        //       />
        //     );
        //   }
        // },
      },

      {
        dataIndex: "Close",
        key: "Close",
        ellipsis: true,

        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
          } else {
            return (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    {record.isComingApi === true ? (
                      ""
                    ) : (
                      <>
                        <img
                          src={redcrossIcon}
                          className="cursor-pointer "
                          height="21px"
                          width="21px"
                          onClick={() => handleCancelingRow(record)}
                          alt=""
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </>
            );
          }
        },
      },
    ];
  } else {
    ParticipantsColoumn = [
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
        align: "left",
        ellipsis: true,
      },

      {
        title: t("Email"),
        dataIndex: "email",
        key: "email",
        align: "left",
        ellipsis: true,
      },
      {
        title: t("Participant-title"),
        dataIndex: "participantTitle",
        key: "participantTitle",
        ellipsis: true,

        align: "left",
        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
            return <p>{record.Title}</p>;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <>
                    <TextField
                      disable={record.isComingApi === true ? true : false}
                      placeholder={t("Participant-title")}
                      labelClass={"d-none"}
                      applyClass={"Organizer_table"}
                      maxLength={140}
                      value={
                        record.isComingApi === true
                          ? record.Title
                          : record.Title || ""
                      }
                      change={(e) =>
                        handleInputChange(record.userID, e.target.value)
                      } // Update the inputValues when the user types
                    />
                  </>
                </Col>
              </Row>
            );
          }
        },
      },

      {
        title: t("Role"),
        dataIndex: "participantRole",
        key: "participantRole",
        align: "left",
        ellipsis: true,

        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
            return <p>{record?.participantRole?.participantRole}</p>;
          } else {
            return (
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <>
                    <Select
                      isDisabled={record.isComingApi === true ? true : false}
                      options={particpantsRole}
                      menuPortalTarget={document.body}
                      styles={customStyles}
                      classNamePrefix={"ParticipantRole"}
                      value={
                        record.isComingApi === true
                          ? {
                              value: record?.participantRole?.participantRoleID,
                              label: record?.participantRole?.participantRole,
                            }
                          : {
                              value: record?.participantRole?.participantRoleID,
                              label: record?.participantRole?.participantRole,
                            }
                      }
                      onChange={(selectedOption) =>
                        handleSelectChange(record.userID, selectedOption)
                      }
                      isSearchable={false}
                    />
                  </>
                </Col>
              </Row>
            );
          }
        },
      },
      {
        dataIndex: "Close",
        key: "Close",
        ellipsis: true,

        render: (text, record) => {
          if (
            ((Number(editorRole.status) === 9 ||
              Number(editorRole.status) === 8 ||
              Number(editorRole.status) === 10) &&
              editorRole.role === "Organizer" &&
              isEditMeeting === true) ||
            (editorRole.role === "Agenda Contributor" && isEditMeeting === true)
          ) {
          } else {
            return (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    {record.isComingApi === true ? (
                      ""
                    ) : (
                      <>
                        <img
                          src={redcrossIcon}
                          className="cursor-pointer "
                          height="21px"
                          width="21px"
                          onClick={() => handleCancelingRow(record)}
                          alt=""
                        />
                      </>
                    )}
                  </Col>
                </Row>
              </>
            );
          }
        },
      },
    ];
  }

  // Filter columns based on the RSVP Condition
  // const finalColumns =
  //   Number(editorRole.status) === 1
  //     ? ParticipantsColoumn.filter((column) => column.key !== "rsvp")
  //     : ParticipantsColoumn;

  //Proposed meeting Page Opens
  const handleProposedmeetingDates = () => {
    setProposedMeetingDates(true);
  };

  const nextTabOrganizer = () => {
    // dispatch(ShowNextConfirmationModal(true));
    setAgenda(true);
    setParticipants(false);
    dispatch(meetingDetailsGlobalFlag(false));
    dispatch(organizersGlobalFlag(false));
    dispatch(agendaContributorsGlobalFlag(false));
    dispatch(participantsGlobalFlag(false));
    dispatch(agendaGlobalFlag(true));
    dispatch(meetingMaterialGlobalFlag(false));
    dispatch(minutesGlobalFlag(false));
    dispatch(proposedMeetingDatesGlobalFlag(false));
    dispatch(actionsGlobalFlag(false));
    dispatch(pollsGlobalFlag(false));
    dispatch(attendanceGlobalFlag(false));
    dispatch(uploadGlobalFlag(false));
  };

  const previousTabOrganizer = () => {
    // dispatch(showPreviousConfirmationModal(true));
    setAgendaContributors(true);
    setParticipants(false);
  };

  //canceling the participants page
  const handleCancelParticipants = () => {
    dispatch(showCancelModalPartipants(true));
  };

  //Clearing the non saved  participant
  const handleCancelButtonForClearingParticipants = () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
    setIsEditClicked(false);
  };

  //state management For textfield
  const handleInputChange = (userID, newValue) => {
    setrspvRows((prevRowsData) => {
      return prevRowsData.map((row) => {
        if (row.userID === userID) {
          return {
            ...row,
            Title: newValue,
          };
        }
        return row;
      });
    });
  };

  const handleEditFunction = () => {
    setEditableSave(1);
    setrspvRows((prevRows) => {
      return prevRows.map((data) => ({
        ...data,
        isComingApi: false,
      }));
    });
  };

  //Intiating Add Flow Particiapnt from Empty State
  const handleParticipantEmptyStateIntiate = () => {
    setEditableSave(2);
    dispatch(showAddParticipantsModal(true));
  };

  const handleSaveparticpants = () => {
    let findshouldnotempty = rspvRows.every(
      (newData, index) => Object.keys(newData.participantRole).length > 0
    );
    let newarry = [];
    let copyData = [...rspvRows];
    copyData.forEach((data, index) => {
      newarry.push(data.userID);
    });
    //Upadte Meeting Organizer
    let Data = {
      MeetingID: currentMeeting,
      MeetingAttendeRoleID: 2,
      UpdatedUsers: newarry,
    };

    if (findshouldnotempty) {
      dispatch(
        UpdateMeetingUserApiFunc(
          navigate,
          Data,
          t,
          rspvRows,
          editableSave,
          currentMeeting,
          true,
          true,
          false
        )
      );
    } else {
      setOpen({
        message: t("Role-is-required"),
        open: true,
      });
    }
    setIsEditClicked(false);
  };

  useEffect(() => {
    if (rspvRows.length > 0) {
      let removedublicates = rspvRows.some(
        (data, index) => data.isComingApi === false
      );
      setIsEditable(removedublicates);
    } else {
      setIsEditable(false);
    }
  }, [rspvRows]);

  // useEffect(() => {
  //   dispatch(getAgendaAndVotingInfo_success([], ""));
  //   dispatch(GetCurrentAgendaDetails([]));
  //   dispatch(getAgendaVotingDetails_success([], ""));
  //   dispatch(saveFiles_success(null, ""));
  //   dispatch(saveAgendaVoting_success([], ""));
  //   dispatch(addUpdateAdvanceMeetingAgenda_success([], ""));
  //   dispatch(uploadDocument_success(null, ""));
  //   dispatch(getAllVotingResultDisplay_success([], ""));
  // }, []);

  return (
    <>
      {proposedMeetingDates ? (
        <ProposedMeetingDate
          currentMeeting={currentMeeting}
          setProposedMeetingDates={setProposedMeetingDates}
          setCurrentMeetingID={setCurrentMeetingID}
          setSceduleMeeting={setSceduleMeeting}
          setDataroomMapFolderId={setDataroomMapFolderId}
        />
      ) : (
        <>
          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              {((Number(editorRole.status) === 9 ||
                Number(editorRole.status) === 8 ||
                Number(editorRole.status) === 10) &&
                editorRole.role === "Organizer" &&
                isEditMeeting === true) ||
              (editorRole.role === "Agenda Contributor" &&
                isEditMeeting === true) ? null : isEditable || isEditClicked ? (
                <>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                      <Button
                        text={t("Cancel")}
                        className={styles["Cancel_Organization"]}
                        onClick={handleCancelButtonForClearingParticipants}
                      />

                      <Button
                        text={t("Save")}
                        className={styles["Next_Organization"]}
                        onClick={handleSaveparticpants}
                      />
                    </Col>
                  </Row>
                </>
              ) : (
                // ) : Number(editorRole.status) === 1 ? null : (
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
                    onClick={handleEditFunction}
                  />

                  <Button
                    text={t("Add-more")}
                    icon={<img draggable={false} src={addmore} alt="" />}
                    className={styles["AddMoreBtn"]}
                    onClick={openAddPartcipantModal}
                  />
                </>
              )}
            </Col>
          </Row>
          <section className={styles["height2"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={ParticipantsColoumn}
                  scroll={{ y: rspvRows.length === 0 ? "55vh" : "42vh" }}
                  pagination={false}
                  locale={{
                    emptyText: (
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <img
                              draggable={false}
                              src={emptyContributorState}
                              width="274.05px"
                              className="cursor-pointer"
                              alt=""
                              height="230.96px"
                              onClick={handleParticipantEmptyStateIntiate}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["Empty_state_heading"]}>
                              {t("No-Participant")}
                            </span>
                          </Col>
                        </Row>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <span className={styles["Empty_state_Subheading"]}>
                              {t("There-are-no-agenda-contributors")}
                            </span>
                          </Col>
                        </Row>
                      </>
                    ),
                  }}
                  className="Polling_table"
                  rows={rspvRows}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                {isEditable ? (
                  <>
                    <div className={styles["definedHeight"]}></div>
                  </>
                ) : (
                  <>
                    {((Number(editorRole.status) === 9 ||
                      Number(editorRole.status) === 8 ||
                      Number(editorRole.status) === 10) &&
                      editorRole.role === "Organizer" &&
                      isEditMeeting === true) ||
                    (editorRole.role === "Agenda Contributor" &&
                      isEditMeeting === true) ? (
                      <>
                        {Number(editorRole.status) ===
                        10 ? null : checkFeatureIDAvailability(12) ? (
                          <>
                            <Button
                              text={t("Propose-meeting-dates")}
                              className={styles["Next_Organization"]}
                              onClick={handleProposedmeetingDates}
                            />
                          </>
                        ) : null}

                        <Button
                          text={t("Cancel")}
                          className={styles["Cancel_Organization"]}
                          onClick={handleCancelParticipants}
                        />

                        {/* <Button
                        text={t("Previous")}
                        className={styles["publish_button_participant"]}
                        onClick={previousTabOrganizer}
                      /> */}

                        <Button
                          text={t("Next")}
                          className={styles["publish_button_participant"]}
                          onClick={nextTabOrganizer}
                        />
                      </>
                    ) : Number(editorRole.status) === 1 ? (
                      <>
                        {" "}
                        <Button
                          text={t("Cancel")}
                          className={styles["Cancel_Organization"]}
                          onClick={handleCancelParticipants}
                        />
                        {/* <Button
                  text={t("Previous")}
                  className={styles["publish_button_participant"]}
                  onClick={previousTabOrganizer}
                /> */}
                        <Button
                          text={t("Next")}
                          className={styles["publish_button_participant"]}
                          onClick={nextTabOrganizer}
                        />{" "}
                      </>
                    ) : isEditClicked ? null : (
                      <>
                        <Button
                          text={t("Propose-meeting-dates")}
                          className={styles["Next_Organization"]}
                          onClick={handleProposedmeetingDates}
                        />

                        <Button
                          text={t("Cancel")}
                          className={styles["Cancel_Organization"]}
                          onClick={handleCancelParticipants}
                        />

                        {/* <Button
                        text={t("Previous")}
                        className={styles["publish_button_participant"]}
                        onClick={previousTabOrganizer}
                      /> */}

                        <Button
                          text={t("Next")}
                          className={styles["publish_button_participant"]}
                          onClick={nextTabOrganizer}
                        />
                      </>
                    )}

                    {/* {((Number(editorRole.status) === 9 ||
                    Number(editorRole.status) === 8 ||
                    Number(editorRole.status) === 10) &&
                    editorRole.role === "Organizer" &&
                    isEditMeeting === true) ||
                  (editorRole.role === "Agenda Contributor" &&
                    isEditMeeting === true) ? null : (
                    <Button
                      text={t("Publish")}
                      className={styles["Next_Organization"]}
                      onClick={handleNextButton}
                    />
                  )} */}
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
                        onClick={handleNextButton}
                      />
                    ) : isEditMeeting === true || isEditClicked ? null : (
                      <Button
                        disableBtn={
                          Number(currentMeeting) === 0 ||
                          isPublishedState === false
                            ? true
                            : false
                        }
                        text={t("Publish")}
                        className={styles["Next_Organization"]}
                        onClick={handleNextButton}
                      />
                    )}
                  </>
                )}
              </Col>
            </Row>
          </section>

          {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
          {NewMeetingreducer.participantModal && (
            <AddParticipantModal
              setrspvRows={setrspvRows}
              rspvRows={rspvRows}
              currentMeeting={currentMeeting}
            />
          )}
          {NewMeetingreducer.cancelPartipants && (
            <CancelParticipants
              setSceduleMeeting={setSceduleMeeting}
              setrspvRows={setrspvRows}
            />
          )}
          {NewMeetingreducer.nextConfirmModal && (
            <NextModal
              setAgenda={setAgenda}
              setParticipants={setParticipants}
              flag={flag}
            />
          )}

          {NewMeetingreducer.ShowPreviousModal && (
            <PreviousModal
              setAgendaContributors={setAgendaContributors}
              setParticipants={setParticipants}
              prevFlag={prevFlag}
            />
          )}
          <Notification
            message={open.message}
            setOpen={setOpen}
            open={open.open}
          />
        </>
      )}
    </>
  );
};

export default Participants;
