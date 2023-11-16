import React, { useState } from "react";
import styles from "./UnpublishedProposedMeeting.module.css";
import { Col, Row, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../../../../assets/images/No-Meetings.png";
import deleteIcon from "../../../../../../assets/images/delete_dataroom.svg";
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
} from "../../../../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import SceduleProposedmeeting from "./SceduleProposedMeeting/SceduleProposedmeeting";
import { useEffect } from "react";
import { StatusValue } from "../../../statusJson";
import {
  convertDateinGMT,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../../../../commen/functions/date_formater";
import { UpdateOrganizersMeeting } from "../../../../../../store/actions/MeetingOrganizers_action";

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
  ediorRole,
  setDataroomMapFolderId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  let currentUserId = localStorage.getItem("userID");
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
    id
  ) => {
    if (isParticipant) {
      setViewProposeDatePoll(true);
      localStorage.setItem("viewProposeDatePollMeetingID", id);
    } else if (isAgendaContributor) {
    } else if (isOrganiser) {
      console.log("viewProposeDatePollHandlerviewProposeDatePollHandler");
      // setOpen({
      //   ...open,
      //   flag: true,
      //   message: t("View-not-available"),
      // });
      setViewProposeOrganizerPoll(true);
    }
  };

  const handleOpenViewModal = async (data) => {
    setAdvanceMeetingModalID(data.pK_MDID);
    // let Data = {
    //   MeetingID: Number(data.pK_MDID),
    // };
    // await dispatch(GetAllMeetingDetailsApiFunc(Data, navigate, t));
    setViewAdvanceMeetingModalUnpublish(true);
  };

  const handleEditMeeting = async (id, record) => {
    let Data = {
      MeetingID: Number(id),
    };
    await dispatch(
      GetAllMeetingDetailsApiFunc(
        Data,
        navigate,
        t,
        setCurrentMeetingID,
        setSceduleMeeting,
        setDataroomMapFolderId
      )
    );
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
            }}
          >
            {text}
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
      width: "125px",
      align: "center",
      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      render: (text, record) => {
        return <span>{text}</span>;
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
      width: "110px",
      render: (text, record) => {
        let maxValue = record.meetingPoll?.totalNoOfDirectors;
        let value = +record.meetingPoll?.totalNoOfDirectorsVoted;
        if (record.meetingPoll) {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  {value === maxValue ? (
                    <img
                      src={rspvGreenIcon}
                      height="17.06px"
                      width="17.06px"
                      alt=""
                      draggable="false"
                    />
                  ) : (
                    <span className={styles["RatioClass"]}>
                      {record.meetingPoll?.totalNoOfDirectorsVoted}/
                      {record.meetingPoll?.totalNoOfDirectors}
                    </span>
                  )}
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={"newMeetingProgressbar"}
                >
                  {value === maxValue ? null : (
                    <>
                      {/* // <ProgressBar
                    //   variant=""
                    //   className="custom-progress"
                    //   now={100}
                    // /> */}
                      <ProgressBar
                        now={value}
                        max={maxValue}
                        className={"newMeetingProgressbar"}
                      />
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
      width: "120px",
      render: (text, record) => {
        return (
          <span className="d-flex justify-content-center">
            {convertDateinGMT(text)}
          </span>
        );
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "90px",
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
                    }}
                  />
                ) : isOrganiser ? (
                  <>
                    {/* this function will add later */}
                    {/* <img
                      src={deleteIcon}
                      className="cursor-pointer"
                      width="17.03px"
                      height="17.03px"
                      alt=""
                      draggable="false"
                    /> */}
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
                          UpdateOrganizersMeeting(
                            navigate,
                            apiData,
                            t,
                            2,
                            setPublishState
                          )
                        )
                      }
                    />
                  )
                ) : record.status === "12" ? (
                  isParticipant ? (
                    <Button
                      text={t("View-poll")}
                      className={styles["publish_meeting_btn_View_poll"]}
                      onClick={() =>
                        viewProposeDatePollHandler(
                          true,
                          false,
                          false,
                          record.pK_MDID
                        )
                      }
                    />
                  ) : isAgendaContributor ? null : (
                    <Button
                      text={t("View-poll")}
                      className={styles["publish_meeting_btn_View_poll"]}
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

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            column={MeetingColoumns}
            scroll={{ y: "64vh", x: "auto" }}
            pagination={false}
            className="newMeetingTable"
            rows={rows}
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
            expandable={{
              expandedRowRender: (record) => {
                return record.meetingAgenda.map((data) => (
                  <p className="meeting-expanded-row">
                    {data.objMeetingAgenda.title}
                  </p>
                ));
              },
              rowExpandable: (record) =>
                record.meetingAgenda.length > 0 ? true : false,
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
