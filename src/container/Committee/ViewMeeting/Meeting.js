import React, { useEffect, useState } from "react";
import { Button, Table } from "../../../components/elements";
import { StatusValue } from "../../pages/meeting/statusJson";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import ClipIcon from "../../../assets/images/ClipIcon.png";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import member from "../../../assets/images/member.svg";
import addmore from "../../../assets/images/addmore.png";
import CreateModal from "./modalmeeting/ModalMeeting";
import ViewModal from "./modalView/ModalView";
import EditModal from "./modalUpdate/ModalUpdate";
import { Col, Row, Tooltip } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import {
  getMeetingByCommitteeIDApi,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
const CommitteeMeetingTab = () => {
  const { t } = useTranslation();
  const getMeetingByCommitteeID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingByCommitteeID
  );

  const [isOrganisers, setIsOrganisers] = useState(false);
  const [rows, setRow] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  let userID = localStorage.getItem("userID");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let currentUserId = localStorage.getItem("userID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [createMeetingModal, setCreateMeetingModal] = useState(false);
  const [viewMeetingModal, setViewMeetingModal] = useState(false);
  const [editMeetingModal, setEditMeetingModal] = useState(false);
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");

  const handleViewMeeting = (meetingID, isQuickMeeting) => {
    setViewMeetingModal(true);
  };
  const handleEditMeeting = (meetingID, isQuickMeeting) => {
    setEditMeetingModal(true);
  };

  useEffect(() => {
    let searchData = {
      CommitteeID: Number(ViewCommitteeID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: true,
    };
    dispatch(getMeetingByCommitteeIDApi(navigate, t, searchData));
    dispatch(allAssignessList(navigate, t));
  }, []);

  useEffect(() => {
    try {
      if (
        getMeetingByCommitteeID !== null &&
        getMeetingByCommitteeID !== undefined
      ) {
        setTotalRecords(getMeetingByCommitteeID.totalRecords);
        if (Object.keys(getMeetingByCommitteeID.meetings).length > 0) {
          let newRowData = [];
          getMeetingByCommitteeID.meetings.forEach((data, index) => {
            try {
              newRowData.push({
                dateOfMeeting: data.dateOfMeeting,
                host: data.host,
                isAttachment: data.isAttachment,
                isChat: data.isChat,
                isVideoCall: data.isVideoCall,
                isQuickMeeting: data.isQuickMeeting,
                meetingAgenda: data.meetingAgenda,
                meetingAttendees: data.meetingAttendees,
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
                talkGroupID: data.talkGroupID,
                key: index,
              });
            } catch {}
          });
          setRow(newRowData);
        }
      } else {
        setRow([]);
      }
    } catch {}
  }, [getMeetingByCommitteeID]);

  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "115px",
      render: (text, record) => {
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
              setIsOrganisers(isOrganiser);
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
      width: "50px",
      filters: [
        {
          text: t("Active"),
          value: "10",
        },
        {
          text: t("Start"),
          value: "2",
        },
        {
          text: t("Upcoming"),
          value: "1",
        },
        {
          text: t("Ended"),
          value: "9",
        },
        {
          text: t("Not-conducted"),
          value: "8",
        },
        {
          text: t("Cancelled"),
          value: "4",
        },
      ],
      defaultFilteredValue: ["10", "9", "8", "2", "1", "4"],
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
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      width: "60px",
      align: "center",
      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      render: (text, record) => {
        return <span className={styles["organizer-value"]}>{text}</span>;
      },
    },
    {
      title: <span className="text-center">{t("Date-time")}</span>,
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "125px",
      align: "center",
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className={styles["datetime-value"]}>
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
      dataIndex: "Chat",
      key: "Chat",
      width: "36px",
      render: (text, record) => {
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        return (
          <>
            {record.isAttachment ? (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-10"
                    : "margin-right-10"
                }
              >
                <img
                  src={ClipIcon}
                  className="cursor-pointer"
                  width="14.02px"
                  height="16.03px"
                  alt=""
                  draggable="false"
                />
              </span>
            ) : (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-20"
                    : "margin-right-20"
                }
              ></span>
            )}
            {record.isChat ? (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-10"
                    : "margin-right-10"
                }
                // onClick={(e) => groupChatInitiation(record)}
              >
                <img
                  src={CommentIcon}
                  className="cursor-pointer"
                  width="20.06px"
                  height="15.95px"
                  alt=""
                  draggable="false"
                />
              </span>
            ) : (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-20"
                    : "margin-right-20"
                }
              ></span>
            )}
            {record.isVideoCall ? (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-10"
                    : "margin-right-10"
                }
              >
                <img src={VideoIcon} alt="" draggable="false" />
              </span>
            ) : (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-20"
                    : "margin-right-20"
                }
              ></span>
            )}
            {record.status === "9" && isOrganiser && (
              <Tooltip placement="topLeft" title={t("member")}>
                <img
                  src={member}
                  className="cursor-pointer"
                  width="17.1px"
                  height="16.72px"
                  alt=""
                  draggable="false"
                />
              </Tooltip>
            )}
          </>
        );
      },
    },
    {
      dataIndex: "Join",
      key: "Join",
      width: "55px",
      render: (text, record) => {
        const isParticipant = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            (attendee.meetingAttendeeRole.role === "Participant" ||
              attendee.meetingAttendeeRole.role === "Agenda Contributor")
        );
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        const startMeetingRequest = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 10,
        };
        if (Number(record.status) === 1) {
          if (isParticipant) {
          } else {
            if (record.isQuickMeeting === true) {
              return (
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting"]}
                      onClick={() => {
                        // dispatch(
                        //   UpdateOrganizersMeeting(
                        //     navigate,
                        //     startMeetingRequest,
                        //     t,
                        //     4,
                        //     setViewFlag,
                        //     setAdvanceMeetingModalID,
                        //     setViewFlag,
                        //     setEditFlag,
                        //     setCalendarViewModal
                        //   )
                        // );
                        setIsOrganisers(isOrganiser);
                      }}
                    />
                  </Col>
                </Row>
              );
            } else {
              return (
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting"]}
                      onClick={() => {
                        // dispatch(
                        //   UpdateOrganizersMeeting(
                        //     navigate,
                        //     startMeetingRequest,
                        //     t,
                        //     3,
                        //     setViewAdvanceMeetingModal,
                        //     setAdvanceMeetingModalID
                        //   )
                        // );
                        setIsOrganisers(isOrganiser);
                      }}
                    />
                  </Col>
                </Row>
              );
            }
          }
        } else if (Number(record.status) === 10) {
          console.log("check status", record.status);

          if (isParticipant) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
                  setIsOrganisers(isOrganiser);
                }}
              />
            );
          } else if (isOrganiser) {
            return (
              <Button
                text={t("Start-join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
                  setIsOrganisers(isOrganiser);
                }}
              />
            );
          }
        } else if (Number(record.status) === 2) {
          console.log("check status", record.status);

          if (isOrganiser) {
            return (
              <Button
                text={t("End-Meeting")}
                className={styles["End-Meeting"]}
                // onClick={EndMeetingModal}
              />
            );
          } else if (isParticipant) {
            return (
              <Button
                text={t("Leave-meeting")}
                className={styles["End-Meeting"]}
                // onClick={EndMeetingModal}
              />
            );
          }
        } else {
        }
      },
    },
    {
      dataIndex: "Edit",
      key: "Edit",
      width: "33px",
      render: (text, record) => {
        console.log("recordrecordrecord", record);
        const isParticipant = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Participant"
        );

        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );

        const isAgendaContributor = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Agenda Contributor"
        );

        const isQuickMeeting = record.isQuickMeeting;

        if (isQuickMeeting) {
          if (isOrganiser) {
            return (
              <>
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <img
                      src={EditIcon}
                      className="cursor-pointer"
                      width="17.11px"
                      height="17.11px"
                      alt=""
                      draggable="false"
                      onClick={() =>
                        handleEditMeeting(record.pK_MDID, record.isQuickMeeting)
                      }
                    />
                  </Col>
                </Row>
              </>
            );
          } else {
          }
        }
      },
    },
  ];

  const handelCreateMeeting = () => {
    setCreateMeetingModal(true);
  };
  return (
    <>
      {createMeetingModal && (
        <CreateModal
          show={createMeetingModal}
          setShow={setCreateMeetingModal}
        />
      )}
      {viewMeetingModal && (
        <ViewModal
          viewFlag={viewMeetingModal}
          setViewFlag={setViewMeetingModal}
        />
      )}
      {editMeetingModal && (
        <EditModal
          editFlag={editMeetingModal}
          setEditFlag={setEditMeetingModal}
        />
      )}
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-end">
          <Button
            text={t("Create-Meeting")}
            icon={<img draggable={false} src={addmore} alt="" />}
            className={styles["Create_Meeting_Button"]}
            onClick={handelCreateMeeting}
          />
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Table
            column={MeetingColoumns}
            scroll={{ y: "52vh", x: true }}
            rows={rows}
            pagination={false}
            size="small"
            className="newMeetingTable"
          />
        </Col>
      </Row>
    </>
  );
};

export default CommitteeMeetingTab;
