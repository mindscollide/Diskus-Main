import React, { useState } from "react";
import styles from "./UnpublishedProposedMeeting.module.css";
import { Col, Row, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../../../../assets/images/No-Meetings.png";
import OrganizerViewModal from "../../../scedulemeeting/Organizers/OrganizerViewModal/OrganizerViewModal";

import { ChevronDown } from "react-bootstrap-icons";
import {
  Button,
  Notification,
  ResultMessage,
  Table,
} from "../../../../../../components/elements";
import rspvGreenIcon from "../../../../../../assets/images/rspvGreen.svg";
import DeleteMeetingModal from "./DeleteMeetingModal/DeleteMeetingModal";
import { useSelector } from "react-redux";
import {
  GetAllMeetingDetailsApiFunc,
  showDeleteMeetingModal,
  showSceduleProposedMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
  viewMeetingFlag,
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
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  GetAllUserChats,
  activeChat,
} from "../../../../../../store/actions/Talk_action";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SceduleProposedmeeting from "./SceduleProposedMeeting/SceduleProposedmeeting";
import { useEffect } from "react";
import { StatusValue } from "../../../statusJson";
import {
  convertDateinGMT,
  forRecentActivity,
  getDifferentisDateisPassed,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../../store/actions/MeetingOrganizers_action";
import moment from "moment";
import { truncateString } from "../../../../../../commen/functions/regex";
import { Tooltip } from "antd";
import { mqttMeetingData } from "../../../../../../hooks/meetingResponse/response";

const UnpublishedProposedMeeting = ({
  setViewProposeDatePoll,
  setViewProposeOrganizerPoll,
  viewProposeDatePoll,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModalUnpublish,
  setSceduleMeeting,
  setEdiorRole,
  setEditMeeting,
  setCurrentMeetingID,
  currentMeeting,
  editorRole,
  setDataroomMapFolderId,
  setResponseByDate,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings
  );
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting
  );
  const deleteMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.deleteMeetingModal
  );
  const allMeetingsSocketData = useSelector(
    (state) => state.meetingIdReducer.allMeetingsSocketData
  );

  const { NewMeetingreducer } = useSelector((state) => state);

  const [rows, setRow] = useState([]);
  const [publishState, setPublishState] = useState(null);
  const [organizerViewModal, setOrganizerViewModal] = useState(false);
  const handleDeleteMeetingModal = () => {
    dispatch(showDeleteMeetingModal(true));
  };

  const enableScedulePrposedMeetingModal = () => {
    dispatch(showSceduleProposedMeeting(true));
  };

  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={
          <img
            src={NoMeetingsIcon}
            alt=""
            draggable="false"
            className="nodata-table-icon"
          />
        }
        title={t("No-new-meetings")}
        subTitle={t("Anything-important-thats-needs-discussion")}
      />
    );
  };

  const viewProposeDatePollHandler = (
    isParticipant,
    isAgendaContributor,
    isOrganiser,
    id,
    responseDeadLine
  ) => {
    localStorage.setItem("viewProposeDatePollMeetingID", id);
    if (isParticipant) {
      setResponseByDate(responseDeadLine);
      setViewProposeDatePoll(true);
      dispatch(viewProposeDateMeetingPageFlag(true));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(agendaGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(true));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    } else if (isAgendaContributor) {
    } else if (isOrganiser) {
      setViewProposeOrganizerPoll(true);
      dispatch(viewProposeOrganizerMeetingPageFlag(true));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(agendaGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(true));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    }
  };

  const handleOpenViewModal = async (data) => {
    setAdvanceMeetingModalID(data.pK_MDID);
    setViewAdvanceMeetingModalUnpublish(true);
    dispatch(viewAdvanceMeetingUnpublishPageFlag(true));
  };

  const handleEditMeeting = async (id, record, role) => {
    if (role !== "Agenda Contributor") {
      let Data = {
        MeetingID: Number(id),
      };
      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          false,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          1
        )
      );
    }
    dispatch(scheduleMeetingPageFlag(true));
  };

  const changeDateStartHandler2 = (date) => {
    let newDate = moment(date).format("DD MMMM YYYY");
    return newDate;
  };

  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "115px",
      align: "left",
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle_view"]}
            onClick={() => {
              setEdiorRole({
                status: record.status,
                role: record.isParticipant
                  ? "Participant"
                  : record.isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
              });
              handleOpenViewModal(record);
              dispatch(viewMeetingFlag(true));
              dispatch(
                GetAllUserChats(
                  navigate,
                  parseInt(currentUserId),
                  parseInt(currentOrganizationId),
                  t
                )
              );
              let activeChatData = {
                id: record.talkGroupID,
                fullName: record.title,
                imgURL: "",
                messageBody: "",
                messageDate: "",
                notiCount: 0,
                messageType: "G",
                isOnline: false,
                companyName: "",
                sentDate: "",
                receivedDate: "",
                seenDate: "",
                attachmentLocation: "",
                senderID: 0,
                admin: 0,
                isBlock: 0,
              };
              dispatch(activeChat(activeChatData));
              dispatch(meetingDetailsGlobalFlag(true));
              dispatch(organizersGlobalFlag(false));
              dispatch(agendaContributorsGlobalFlag(false));
              dispatch(participantsGlobalFlag(false));
              dispatch(agendaGlobalFlag(false));
              dispatch(meetingMaterialGlobalFlag(false));
              dispatch(minutesGlobalFlag(false));
              dispatch(proposedMeetingDatesGlobalFlag(false));
              dispatch(actionsGlobalFlag(false));
              dispatch(pollsGlobalFlag(false));
              dispatch(attendanceGlobalFlag(false));
              dispatch(uploadGlobalFlag(false));
            }}
          >
            {truncateString(text, 35)}
          </span>
        );
      },
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "90px",
      filters: [
        {
          text: t("Proposed"),
          value: "12",
        },
        {
          text: t("Unpublished"),
          value: "11",
        },
      ],
      filterResetToDefaultFilteredValue: true,
      defaultFilteredValue: ["11", "12"],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
      onFilter: (value, record) =>
        record.status.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: <span> {t("Organizer")}</span>,
      dataIndex: "meetingAttendees",
      key: "meetingAttendees",
      width: "110px",
      ellipsis: true,

      align: "center",
      sorter: (a, b) => {
        const nameA = a.userDetails?.name || "";
        const nameB = b.userDetails?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (text, record) => {
        return <span className={styles["orgaizer_value"]}>{record.host}</span>;
      },
    },
    {
      title: t("Date-time"),
      dataIndex: "Date",
      key: "Date",
      width: "155px",
      ellipsis: true,

      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className="text-truncate d-block">
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime
              )}
            </span>
          );
        }
      },
      sorter: (a, b, sortOrder) => {
        const dateA = utcConvertintoGMT(
          `${a?.dateOfMeeting}${a?.meetingStartTime}`
        );
        const dateB = utcConvertintoGMT(
          `${b?.dateOfMeeting}${b?.meetingStartTime}`
        );
        return dateA - dateB;
      },
    },
    {
      title: t("Propose-date-poll"),
      dataIndex: "getAllMeetingDetails",
      key: "MeetingPoll",
      width: "115px",
      render: (text, record) => {
        let maxValue = record.meetingPoll?.totalNoOfDirectors;
        let value = record.meetingPoll?.totalNoOfDirectorsVoted;
        if (record.meetingPoll) {
          return (
            <>
              <Row>
                <Col lg={12} md={12} sm={12} className="text-center">
                  {value === maxValue &&
                  value === 0 &&
                  maxValue === 0 ? null : record.meetingPoll
                      ?.totalNoOfDirectors ===
                    record.meetingPoll?.totalNoOfDirectorsVoted ? (
                    <img
                      src={rspvGreenIcon}
                      height="17.06px"
                      width="17.06px"
                      alt=""
                      draggable="false"
                    />
                  ) : (
                    <>
                      <span className={styles["RatioClass"]}>
                        {record.meetingPoll?.totalNoOfDirectorsVoted}/
                        {record.meetingPoll?.totalNoOfDirectors}
                      </span>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={"newMeetingProgressbar"}
                        >
                          <ProgressBar
                            now={value}
                            max={maxValue}
                            className={"newMeetingProgressbar"}
                          />
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>
            </>
          );
        } else {
          return null;
        }
      },
    },
    {
      title: t("Send-reponse-by"),
      dataIndex: "responseDeadLine",
      key: "responseDeadLine",
      width: "115px",
      render: (text, record) => {
        return (
          <>
            {record.status === "12" ? (
              <span className="d-flex justify-content-center">
                {changeDateStartHandler2(record.responseDeadLine)}
              </span>
            ) : (
              ""
            )}
          </>
        );
      },
    },

    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        let apiData = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 1,
        };
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex  align-items-center justify-content-center gap-4"
              >
                {record.isAgendaContributor ? (
                  <Tooltip placement="bottomLeft" title={t("Edit")}>
                    <img
                      src={EditIcon}
                      className="cursor-pointer"
                      width="17.03px"
                      height="17.03px"
                      alt=""
                      draggable="false"
                      onClick={() => {
                        handleEditMeeting(
                          record.pK_MDID,
                          record.isQuickMeeting,
                          // record.isAgendaContributor,
                          record
                        );
                        setEdiorRole({
                          status: record.status,
                          role: "Agenda Contributor",
                        });
                        setEditMeeting(true);
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
                      }}
                    />
                  </Tooltip>
                ) : record.isOrganizer ? (
                  <>
                    <Tooltip placement="bottomLeft" title={t("Edit")}>
                      <img
                        src={EditIcon}
                        className="cursor-pointer"
                        width="17.03px"
                        height="17.03px"
                        alt=""
                        draggable="false"
                        onClick={() => {
                          handleEditMeeting(
                            record.pK_MDID,
                            record.isQuickMeeting,
                            // record.isAgendaContributor,
                            record
                          );

                          setEdiorRole({
                            status: record.status,
                            role: "Organizer",
                          });
                          setEditMeeting(true);
                          dispatch(meetingDetailsGlobalFlag(true));
                          dispatch(organizersGlobalFlag(false));
                          dispatch(agendaContributorsGlobalFlag(false));
                          dispatch(participantsGlobalFlag(false));
                          dispatch(agendaGlobalFlag(false));
                          dispatch(meetingMaterialGlobalFlag(false));
                          dispatch(minutesGlobalFlag(false));
                          dispatch(proposedMeetingDatesGlobalFlag(false));
                          dispatch(actionsGlobalFlag(false));
                          dispatch(pollsGlobalFlag(false));
                          dispatch(attendanceGlobalFlag(false));
                          dispatch(uploadGlobalFlag(false));
                        }}
                      />
                    </Tooltip>
                  </>
                ) : null}
              </Col>
            </Row>
          </>
        );
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "115px",
      align: "center",
      render: (text, record) => {
        const isResponseDateGone = forRecentActivity(
          `${record.responseDeadLine}000000`
        );
        const currentDateObj = new Date();

        const isViewPollShown = getDifferentisDateisPassed(
          currentDateObj,
          isResponseDateGone
        );

        let apiData = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 1,
        };
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex  align-items-center gap-4"
              >
                {record.status === "11" ? (
                  record.isParticipant ? null : record.isAgendaContributor ? null : (
                    <Button
                      text={t("Publish-meeting")}
                      className={styles["publish_meeting_btn"]}
                      onClick={() =>
                        dispatch(
                          UpdateOrganizersMeeting(navigate, t, 5, apiData)
                        )
                      }
                    />
                  )
                ) : record.status === "12" ? (
                  record.isParticipant ? (
                    <Button
                      text={t("Send-reply")}
                      className={styles["publish_meeting_btn_View_poll"]}
                      disableBtn={isViewPollShown ? true : false}
                      onClick={() =>
                        viewProposeDatePollHandler(
                          true,
                          false,
                          false,
                          record.pK_MDID,
                          record.responseDeadLine
                        )
                      }
                    />
                  ) : record.isAgendaContributor ? null : (
                    <Button
                      text={t("View-poll")}
                      className={styles["publish_meeting_btn_View_poll"]}
                      // disableBtn={isViewPollShown ? true : false}
                      onClick={() =>
                        viewProposeDatePollHandler(
                          false,
                          false,
                          true,
                          record.pK_MDID
                        )
                      }
                    />
                  )
                ) : null}
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (allMeetingsSocketData !== null) {
      let tableRowsData = [...rows];
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_MDID === allMeetingsSocketData.pK_MDID
      );
      if (foundIndex !== -1) {
        const newState = tableRowsData.map((obj, index) => {
          // 👇️ if id equals 2 replace object
          if (foundIndex === index) {
            return allMeetingsSocketData;
          }

          // 👇️ otherwise return object as is
          return obj;
        });
        setRow(newState);
      } else {
        setRow([allMeetingsSocketData, ...rows]);
      }
    }
  }, [allMeetingsSocketData]);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        if (
          searchMeetings.meetings !== null &&
          searchMeetings.meetings !== undefined &&
          searchMeetings.meetings.length > 0
        ) {
          setRow(searchMeetings.meetings);
        } else {
          setRow([]);
        }
      }
    } catch (error) {
      // Handle errors here
    }
  }, [searchMeetings]);

  useEffect(() => {
    if (publishState) {
      const filteredArray = rows.filter(
        (item) => item.pK_MDID !== publishState
      );
      setRow(filteredArray);
      setPublishState(null);
    }
  }, [publishState]);

  useEffect(() => {
    if (
      NewMeetingreducer.meetingStatusProposedMqttData !== null &&
      NewMeetingreducer.meetingStatusProposedMqttData !== undefined
    ) {
      let meetingData = NewMeetingreducer.meetingStatusProposedMqttData;
      const indexToUpdate = rows.findIndex(
        (obj) => obj.pK_MDID === meetingData.pK_MDID
      );
      if (indexToUpdate !== -1) {
        let updatedRows = [...rows];
        updatedRows[indexToUpdate] = meetingData;
        setRow(updatedRows);
      } else {
        let updatedRows = [...rows, meetingData];
        setRow(updatedRows);
      }
    }
  }, [NewMeetingreducer.meetingStatusProposedMqttData]);

  // useEffect(() => {
  //   if (
  //     NewMeetingreducer.meetingStatusProposedMqttData !== null &&
  //     NewMeetingreducer.meetingStatusProposedMqttData !== undefined
  //   ) {
  //     let meetingData = NewMeetingreducer.meetingStatusProposedMqttData;
  //     const indexToUpdate = rows.findIndex(
  //       (obj) => obj.pK_MDID === meetingData.pK_MDID
  //     );

  //     let updatedRows;
  //     if (indexToUpdate !== -1) {
  //       updatedRows = [...rows];
  //       updatedRows[indexToUpdate] = meetingData;
  //     } else {
  //       updatedRows = [...rows, meetingData];
  //     }

  //     // Sort the updated rows based on date and time
  //     updatedRows.sort((a, b) => {
  //       const dateA = new Date(
  //         newTimeFormaterAsPerUTCFullDate(a.dateOfMeeting + a.meetingStartTime)
  //       );
  //       const dateB = new Date(
  //         newTimeFormaterAsPerUTCFullDate(b.dateOfMeeting + b.meetingStartTime)
  //       );
  //       return dateA - dateB;
  //     });

  //     setRow(updatedRows);
  //   }
  // }, [NewMeetingreducer.meetingStatusProposedMqttData]);

  useEffect(() => {
    if (
      NewMeetingreducer.meetingStatusPublishedMqttData !== null &&
      NewMeetingreducer.meetingStatusPublishedMqttData !== undefined
    ) {
      let meetingData = NewMeetingreducer.meetingStatusPublishedMqttData;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );
        setRow(updatedRows);
      } catch {}
    }
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);

  useEffect(() => {
    try {
      const callAddAgendaContributor = async () => {
        if (
          NewMeetingreducer.mqttMeetingAcAdded !== null &&
          NewMeetingreducer.mqttMeetingAcAdded !== undefined
        ) {
          let newObj = NewMeetingreducer.mqttMeetingAcAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setRow([getData, ...rows]);
            console.log(getData, "getDatagetDatagetData");
          } catch (error) {
            console.log(error, "getDatagetDatagetData");
          }
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddAgendaContributor();
    } catch (error) {
      console.log(error);
    }
  }, [NewMeetingreducer.mqttMeetingAcAdded]);

  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingAcRemoved !== null &&
      NewMeetingreducer.mqttMeetingAcRemoved !== undefined
    ) {
      let meetingData = NewMeetingreducer.mqttMeetingAcRemoved;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );
        setRow(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [NewMeetingreducer.mqttMeetingAcRemoved]);

  useEffect(() => {
    try {
      const callAddOrganizer = async () => {
        if (
          NewMeetingreducer.mqttMeetingOrgAdded !== null &&
          NewMeetingreducer.mqttMeetingOrgAdded !== undefined
        ) {
          let newObj = NewMeetingreducer.mqttMeetingOrgAdded;
          try {
            let getData = await mqttMeetingData(newObj, 2);
            setRow([getData, ...rows]);
            console.log(getData, "getDatagetDatagetData");
          } catch (error) {
            console.log(error, "getDatagetDatagetData");
          }
          dispatch(meetingAgendaContributorAdded(null));
          dispatch(meetingAgendaContributorRemoved(null));
          dispatch(meetingOrganizerAdded(null));
          dispatch(meetingOrganizerRemoved(null));
        }
      };
      callAddOrganizer();
    } catch (error) {
      console.error(error);
    }
  }, [NewMeetingreducer.mqttMeetingOrgAdded]);

  useEffect(() => {
    if (
      NewMeetingreducer.mqttMeetingOrgRemoved !== null &&
      NewMeetingreducer.mqttMeetingOrgRemoved !== undefined
    ) {
      let meetingData = NewMeetingreducer.mqttMeetingOrgRemoved;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID
        );
        setRow(updatedRows);
        dispatch(meetingAgendaContributorAdded(null));
        dispatch(meetingAgendaContributorRemoved(null));
        dispatch(meetingOrganizerAdded(null));
        dispatch(meetingOrganizerRemoved(null));
      } catch {}
    }
  }, [NewMeetingreducer.mqttMeetingOrgRemoved]);

  console.log("rowsrowsrows", rows);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            column={MeetingColoumns}
            scroll={{ y: "54vh", x: false }}
            pagination={false}
            className="newMeetingTable"
            rows={rows}
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
            expandable={{
              expandedRowRender: (record) => {
                return (
                  record.meetingAgenda.length > 0 &&
                  record.meetingAgenda.map((data) => (
                    <p className={styles["meeting-expanded-row"]}>
                      {data.objMeetingAgenda.title}
                    </p>
                  ))
                );
              },
              rowExpandable: (record) =>
                record.meetingAgenda !== null && record.meetingAgenda.length > 0
                  ? true
                  : false,
            }}
          />
        </Col>
      </Row>
      {organizerViewModal && <OrganizerViewModal />}
      {sceduleproposedMeeting && <SceduleProposedmeeting />}
      {deleteMeetingModal && <DeleteMeetingModal />}
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </section>
  );
};

export default UnpublishedProposedMeeting;
