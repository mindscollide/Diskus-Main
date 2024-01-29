import React, { useEffect, useState } from "react";
import { Button, ResultMessage, Table } from "../../../components/elements";
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
import CreateModal from "../../modalmeeting/ModalMeeting";
import ViewModal from "../../modalView/ModalView";
import EditModal from "../../modalUpdate/ModalUpdate";
import { Col, Row, Tooltip } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";

import {
  getMeetingByCommitteeIDApi,
  meetingNotConductedMQTT,
  searchNewUserMeeting,
} from "../../../store/actions/NewMeetingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ViewMeeting,
  allAssignessList,
} from "../../../store/actions/Get_List_Of_Assignees";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";
import { truncateString } from "../../../commen/functions/regex";

const CommitteeMeetingTab = ({ committeeStatus }) => {
  const { t } = useTranslation();
  const getMeetingByCommitteeID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingByCommitteeID
  );
  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData
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
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  const [startMeetingData, setStartMeetingData] = useState({
    meetingID: null,
    showButton: false,
  });
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const handleViewMeeting = async (meetingID, isQuickMeeting) => {
    let Data = { MeetingID: Number(meetingID) };
    await dispatch(
      ViewMeeting(
        navigate,
        Data,
        t,
        setViewMeetingModal,
        setEditMeetingModal,
        setCalendarViewModal,
        setSceduleMeeting,
        1
      )
    );
    setViewMeetingModal(true);
  };
  const handleEditMeeting = async (meetingID, isQuickMeeting) => {
    let Data = { MeetingID: Number(meetingID) };
    await dispatch(
      ViewMeeting(
        navigate,
        Data,
        t,
        setViewMeetingModal,
        setEditMeetingModal,
        setCalendarViewModal,
        setSceduleMeeting,
        2
      )
    );
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

  const handleChangePagination = (current, pageSize) => {
    setPageSize(current);
    setCurrentPage(pageSize);
    let searchData = {
      CommitteeID: Number(ViewCommitteeID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(pageSize),
      PublishedMeetings: true,
    };
    dispatch(getMeetingByCommitteeIDApi(navigate, t, searchData));
  };

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

  // onClick to download Report Api on download Icon
  const onClickDownloadIcon = async (meetingID) => {
    let downloadData = {
      MeetingID: Number(meetingID),
    };
    dispatch(downloadAttendanceReportApi(navigate, t, downloadData));
  };

  const MeetingColoumns = [
    {
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "115px",
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
            }}
          >
            {truncateString(text, 30)}
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
        // {
        //   text: t("Start"),
        //   value: "2",
        // },
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
      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      render: (text, record) => {
        return <span className={styles["meeting-start"]}>{text}</span>;
      },
    },
    {
      title: t("Date-time"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "115px",
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className={styles["meeting-start"]}>
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
            <Row>
              <Col sm={12} md={12} lg={12}>
                {record.isAttachment ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }
                  >
                    <Tooltip placement="topRight" title={t("ClipIcon")}>
                      <img
                        src={ClipIcon}
                        className="cursor-pointer"
                        alt=""
                        draggable="false"
                      />
                    </Tooltip>
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
                    <Tooltip placement="topLeft" title={t("Chat")}>
                      <img
                        src={CommentIcon}
                        className="cursor-pointer"
                        // width="20.06px"
                        // height="15.95px"
                        alt=""
                        draggable="false"
                      />
                    </Tooltip>
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
                      onClick={() => onClickDownloadIcon(record.pK_MDID)}
                    />
                  </Tooltip>
                )}
              </Col>
            </Row>
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
        const startMeetingRequest = {
          MeetingID: Number(record.pK_MDID),
          StatusID: 10,
        };
        let meetingDateTime = record.dateOfMeeting + record.meetingStartTime;
        const currentDateObj = new Date(
          currentUTCDateTime.substring(0, 4), // Year
          parseInt(currentUTCDateTime.substring(4, 6)) - 1, // Month (0-based)
          currentUTCDateTime.substring(6, 8), // Day
          currentUTCDateTime.substring(8, 10), // Hours
          currentUTCDateTime.substring(10, 12), // Minutes
          currentUTCDateTime.substring(12, 14) // Seconds
        );

        const meetingDateObj = new Date(
          meetingDateTime.substring(0, 4), // Year
          parseInt(meetingDateTime.substring(4, 6)) - 1, // Month (0-based)
          meetingDateTime.substring(6, 8), // Day
          meetingDateTime.substring(8, 10), // Hours
          meetingDateTime.substring(10, 12), // Minutes
          meetingDateTime.substring(12, 14) // Seconds
        );

        // Calculate the time difference in milliseconds
        const timeDifference = meetingDateObj - currentDateObj;

        // Convert milliseconds to minutes
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));

        if (Number(record.status) === 1) {
          if (isParticipant) {
          } else if (isAgendaContributor) {
          } else {
            if (
              // startMeetingButton === true
              (record.isQuickMeeting === true && minutesDifference < 4) ||
              (record.isQuickMeeting === true &&
                record.pK_MDID === startMeetingData.meetingID &&
                startMeetingData.showButton)
              // &&
              // minutesDifference > 0
            ) {
              return (
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting"]}
                      onClick={() => {
                        dispatch(
                          UpdateOrganizersMeeting(
                            navigate,
                            t,
                            7,
                            startMeetingRequest
                            // setEdiorRole,
                            // setAdvanceMeetingModalID,
                            // setDataroomMapFolderId,
                            // setSceduleMeeting,
                            // setViewFlag,
                            // setEditFlag
                          )
                        );
                      }}
                    />
                  </Col>
                </Row>
              );
            }
          }
        } else if (Number(record.status) === 10) {
          if (isParticipant) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
                }}
              />
            );
          } else if (isAgendaContributor) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
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
                }}
              />
            );
          }
        } else if (Number(record.status) === 2) {
          if (isOrganiser) {
          } else if (isParticipant) {
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

        if (record.status === "8") {
          return null;
        } else {
          if (isQuickMeeting) {
            if (isOrganiser) {
              return (
                <>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      {/* <Tooltip placement="topRight" title={t("Edit")}> */}
                      {committeeStatus === 3 && (
                        <img
                          src={EditIcon}
                          className="cursor-pointer"
                          width="17.11px"
                          height="17.11px"
                          alt=""
                          draggable="false"
                          onClick={() =>
                            handleEditMeeting(
                              record.pK_MDID,
                              record.isQuickMeeting,
                              isAgendaContributor,
                              record
                            )
                          }
                        />
                      )}

                      {/* </Tooltip> */}
                    </Col>
                  </Row>
                </>
              );
            }
          }
        }
      },
    },
  ];

  const handelCreateMeeting = () => {
    setCreateMeetingModal(true);
  };
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

  useEffect(() => {
    if (
      meetingStatusNotConductedMqttData !== null &&
      meetingStatusNotConductedMqttData !== undefined &&
      meetingStatusNotConductedMqttData.length !== 0
    ) {
      let meetingDetailsMqtt = meetingStatusNotConductedMqttData.meetingDetails;
      const updatedRows = rows.map((row) => {
        if (row.pK_MDID === meetingDetailsMqtt.pK_MDID) {
          return {
            ...row,
            status: String(meetingDetailsMqtt.statusID),
          };
        }
        return row;
      });
      setRow(updatedRows);
      if (meetingDetailsMqtt.statusID === 1) {
        setStartMeetingData({
          ...startMeetingData,
          meetingID: meetingDetailsMqtt.pK_MDID,
          status: true,
        });
      } else {
        setStartMeetingData({
          ...startMeetingData,
          meetingID: null,
          status: false,
        });
      }
    }
    dispatch(meetingNotConductedMQTT(null));
  }, [meetingStatusNotConductedMqttData, rows]);
  return (
    <>
      {createMeetingModal && (
        <CreateModal
          show={createMeetingModal}
          setShow={setCreateMeetingModal}
          // this is check from where its called 6 is from committee create
          checkFlag={6}
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
          // this is check from where its called 6 is from committee create
          checkFlag={6}
        />
      )}
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-end">
          {committeeStatus === 3 && (
            <Button
              text={t("Create-Meeting")}
              icon={<img draggable={false} src={addmore} alt="" />}
              className={styles["Create_Meeting_Button"]}
              onClick={handelCreateMeeting}
            />
          )}
        </Col>
      </Row>
      <Row>
        <Col sm={12} md={12} lg={12}>
          <Table
            column={MeetingColoumns}
            scroll={{ y: "39vh", x: true }}
            rows={rows}
            pagination={false}
            size="small"
            className="newMeetingTable"
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
        {rows && rows.length > 0 ? (
          <Col
            sm={12}
            md={12}
            lg={12}
            className={
              "pagination-groups-table position-absolute bottom-20  d-flex justify-content-center"
            }
          >
            <span className="PaginationStyle-TodoList">
              <CustomPagination
                current={currentPage}
                showSizer={true}
                onChange={handleChangePagination}
                pageSizeOptionsValues={["30", "50", "100", "200"]}
                total={totalRecords}
                pageSize={pageSize}
              />
            </span>
          </Col>
        ) : null}
      </Row>
    </>
  );
};

export default CommitteeMeetingTab;
