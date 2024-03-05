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
} from "../../../../../../store/actions/NewMeetingActions";
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

  const handleEditMeeting = async (id, record) => {
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
      width: "130px",
      align: "left",
      render: (text, record) => {
        const isParticipant = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Participant"
        );
        const isAgendaContributor = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Agenda Contributor"
        );
        return (
          <span
            className={styles["meetingTitle_view"]}
            onClick={() => {
              setEdiorRole({
                status: record.status,
                role: isParticipant
                  ? "Participant"
                  : isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
              });
              handleOpenViewModal(record);
              dispatch(viewMeetingFlag(true));
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
      width: "100px",
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
      dataIndex: "host",
      key: "host",
      width: "120px",
      align: "center",
      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      render: (text, record) => {
        return <span className={styles["align-organizer-col"]}>{text}</span>;
      },
    },
    {
      title: t("Date-time"),
      dataIndex: "Date",
      key: "Date",
      width: "165px",

      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span>
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
      width: "120px",
      render: (text, record) => {
        console.log(record, "maxValuemaxValuemaxValue");
        let maxValue = record.meetingPoll?.totalNoOfDirectors;
        let value = record.meetingPoll?.totalNoOfDirectorsVoted;
        if (record.meetingPoll) {
          console.log(record.meetingPoll, "meetingPollmeetingPoll");
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
      width: "129px",
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
      width: "90px",
      render: (text, record) => {
        console.log(record.status, "fjaanajdkamenmf");
        const isParticipant = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Participant"
        );
        const isAgendaContributor = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Agenda Contributor"
        );
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
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
                className="d-flex  align-items-center justify-content-center gap-4"
              >
                {isAgendaContributor ? (
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
                        isAgendaContributor,
                        record
                      );
                      setEdiorRole({
                        status: record.status,
                        role: "Agenda Contributor",
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
                ) : isOrganiser ? (
                  <>
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
                          isAgendaContributor,
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
      width: "90px",
      align: "center",
      render: (text, record) => {
        const isParticipant = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Participant"
        );
        const isAgendaContributor = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Agenda Contributor"
        );
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        const isResponseDateGone = forRecentActivity(
          `${record.responseDeadLine}000000`
        );
        const currentDateObj = new Date();

        const isViewPollShown = getDifferentisDateisPassed(
          currentDateObj,
          isResponseDateGone
        );

        console.log(
          isViewPollShown,
          "currentDateObjcurrentDateObjcurrentDateObj"
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
                  isParticipant ? null : isAgendaContributor ? null : (
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
                  isParticipant ? (
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
                  ) : isAgendaContributor ? null : (
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
    if (Object.keys(allMeetingsSocketData).length > 0) {
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
          let newRowData = [];
          searchMeetings.meetings.forEach((data, index) => {
            // Filter and map meeting attendees based on your conditions
            const filteredAttendees = data.meetingAttendees.filter(
              (attendee) => {
                if (
                  (data.status === "11" &&
                    Number(attendee.user.pK_UID) === Number(currentUserId) &&
                    (attendee.meetingAttendeeRole.role === "Organizer" ||
                      attendee.meetingAttendeeRole.role ===
                        "Agenda Contributor")) ||
                  (data.status === "12" &&
                    Number(attendee.user.pK_UID) === Number(currentUserId))
                ) {
                  return true;
                }
                return false;
              }
            );

            // If there are attendees that meet the criteria, include the meeting
            if (filteredAttendees.length > 0) {
              newRowData.push({
                dateOfMeeting: data.dateOfMeeting,
                host: data.host,
                isAttachment: data.isAttachment,
                isChat: data.isChat,
                isVideoCall: data.isVideoCall,
                isQuickMeeting: data.isQuickMeeting,
                meetingAgenda: data.meetingAgenda,
                meetingAttendees: filteredAttendees, // Use filtered attendees here
                meetingEndTime: data.meetingEndTime,
                meetingStartTime: data.meetingStartTime,
                meetingURL: data.meetingURL,
                orignalProfilePictureName: data.orignalProfilePictureName,
                pK_MDID: data.pK_MDID,
                meetingPoll: {
                  totalNoOfDirectors:
                    data.proposedMeetingDetail.totalNoOfDirectors,
                  totalNoOfDirectorsVoted:
                    data.proposedMeetingDetail.totalNoOfDirectorsVoted,
                },
                responseDeadLine: data.responseDeadLine,
                status: data.status,
                title: data.title,
                key: index,
              });
            }
          });
          setRow(newRowData);
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
      } catch {
        console.log("Error");
      }
    }
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            column={MeetingColoumns}
            scroll={{ y: "54vh", x: "auto" }}
            pagination={false}
            className="newMeetingTable"
            rows={rows}
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
            expandable={{
              expandedRowRender: (record) => {
                return record.meetingAgenda.map((data) => (
                  <p className={styles["meeting-expanded-row"]}>
                    {data.objMeetingAgenda.title}
                  </p>
                ));
              },
              rowExpandable: (record) =>
                record.meetingAgenda.length > 0 && record.meetingAgenda !== null
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
