import React, { useEffect, useState } from "react";
import { Button, ResultMessage, Table } from "../../../components/elements";
import { StatusValue } from "../../pages/meeting/statusJson";
import {
  getCurrentDateTimeUTC,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import ClipIcon from "../../../assets/images/ClipIcon.png";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import member from "../../../assets/images/member.svg";
import addmore from "../../../assets/images/addmore.png";
import ViewModal from "../../modalView/ModalView";
import { Col, Row } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import {
  JoinCurrentMeeting,
  getMeetingByCommitteeIDApi,
  meetingNotConductedMQTT,
} from "../../../store/actions/NewMeetingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";
import { truncateString } from "../../../commen/functions/regex";
import {
  createCommitteeMeeting,
  getMeetingStatusfromSocket,
} from "../../../store/actions/GetMeetingUserId";
import { Checkbox, Dropdown, Menu } from "antd";
import DescendIcon from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import UpdateQuickMeeting from "../../QuickMeeting/UpdateQuickMeeting/UpdateQuickMeeting";
import CreateQuickMeeting from "../../QuickMeeting/CreateQuickMeeting/CreateQuickMeeting";

const CommitteeMeetingTab = ({ committeeStatus }) => {
  const { t } = useTranslation();
  let CurrentLanguage = localStorage.getItem("i18nextLng");
  const getMeetingByCommitteeID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingByCommitteeID
  );
  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData
  );
  const {
    CommitteeMeetingMQTT,
    MeetingStatusSocket,
    allMeetingsSocketData,
    MeetingStatusEnded,
  } = useSelector((state) => state.meetingIdReducer);
  const [rows, setRow] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
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
  const [minutesAgo, setMinutesAgo] = useState(null);
  const [meetingTitleSort, setMeetingTitleSort] = useState(null);
  const [meetingOrganizerSort, setMeetingOrganizerSort] = useState(null);
  const [meetingDateTimeSort, setMeetingDateTimeSort] = useState(null);
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  let ViewCommitteeID = localStorage.getItem("ViewCommitteeID");
  const [startMeetingData, setStartMeetingData] = useState({
    meetingID: null,
    showButton: false,
  });
  console.log({ startMeetingData, rows }, "startMeetingDatastartMeetingData");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const handleViewMeeting = async (
    videoCallURL,
    meetingID,
    isQuickMeeting,
    status
  ) => {
    // console.log(record, "recordrecord")
    if (Number(status) === 10) {
      let joinMeetingData = {
        VideoCallURL: videoCallURL,
        FK_MDID: Number(meetingID),
        DateTime: getCurrentDateTimeUTC(),
      };
      dispatch(
        JoinCurrentMeeting(
          isQuickMeeting,
          navigate,
          t,
          joinMeetingData,
          setViewMeetingModal,
          setEditMeetingModal,
          setSceduleMeeting,
          1,
          "",
          ""
        )
      );
    } else {
      let Data = { MeetingID: Number(meetingID) };
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewMeetingModal,
          setEditMeetingModal,
          setCalendarViewModal,
          // setSceduleMeeting,
          6
        )
      );
      // setEditMeetingModal(true);
    }
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
        setMinutesAgo(getMeetingByCommitteeID.meetingStartedMinuteAgo);
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
                videoCallURL: data.videoCallURL,
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
          setDublicatedrows(newRowData);
        }
      } else {
        setRow([]);
        setDublicatedrows([]);
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

  //Filteration Work Meeting

  const [visible, setVisible] = useState(false);
  const [selectedValues, setSelectedValues] = useState([
    "10",
    "1",
    "9",
    "8",
    "4",
  ]);

  const filters = [
    {
      value: "10",
      text: t("Active"),
    },

    {
      value: "1",
      text: t("Upcoming"),
    },
    {
      value: "9",
      text: t("Ended"),
    },
    {
      value: "8",
      text: t("Not-conducted"),
    },
    {
      value: "4",
      text: t("Cancelled"),
    },
  ];

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectedValues((prevValues) =>
      prevValues.includes(filterValue)
        ? prevValues.filter((value) => String(value) !== String(filterValue))
        : [...prevValues, String(filterValue)]
    );
  };

  const handleApplyFilter = () => {
    const filteredData = dublicatedrows.filter((item) =>
      selectedValues.includes(item.status.toString())
    );
    setRow(filteredData);
    setVisible(false);
  };

  const resetFilter = () => {
    setSelectedValues(["10", "1", "9", "8", "4"]);
    setRow(dublicatedrows);
    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => handleMenuClick(filter.value)}>
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex  align-items-center justify-content-between p-1'>
        <Button
          text={"Reset"}
          className={"FilterResetBtn"}
          onClick={resetFilter}
        />
        <Button
          text={"Ok"}
          disableBtn={selectedValues.length === 0}
          className={"ResetOkBtn"}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );

  const MeetingColoumns = [
    {
      title: (
        <span className='d-flex gap-2 align-items-center'>
          {" "}
          {t("Title")}{" "}
          {meetingTitleSort === "descend" ? (
            <img src={DescendIcon} alt='' />
          ) : (
            <img src={AscendIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "title",
      key: "title",
      width: "115px",
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(
                record.videoCallURL,
                record.pK_MDID,
                record.isQuickMeeting,
                record.status
              );
              localStorage.setItem("meetingTitle", record.title);
              localStorage.setItem("videoCallURL", record.videoCallURL);
            }}>
            {truncateString(text, 30)}
          </span>
        );
      },
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingTitleSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "50px",
      align: "center",

      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className='filter-chevron-icon-todolist'
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: (
        <span className='d-flex gap-2 align-items-center justify-content-center'>
          {t("Organizer")}
          {meetingOrganizerSort === "descend" ? (
            <img src={DescendIcon} alt='' />
          ) : (
            <img src={AscendIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "host",
      key: "host",
      width: "60px",
      align: "center",
      ecllipse: "true",
      sorter: (a, b) => {
        return a?.host.toLowerCase().localeCompare(b?.host.toLowerCase());
      },
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingOrganizerSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        return <span className={styles["meeting-start"]}>{text}</span>;
      },
    },
    {
      title: (
        <span className='d-flex gap-2 align-items-center justify-content-center'>
          {t("Date-time")}
          {meetingDateTimeSort === "descend" ? (
            <img src={ArrowDownIcon} alt='' />
          ) : (
            <img src={ArrowUpIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "115px",
      align: "center",
      onHeaderCell: () => ({
        onClick: () => {
          setMeetingDateTimeSort((order) => {
            if (order === "descend") return "ascend";
            if (order === "ascend") return null;
            return "descend";
          });
        },
      }),
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return (
            <span className={styles["meeting-start"]}>
              {newTimeFormaterAsPerUTCFullDate(
                record.dateOfMeeting + record.meetingStartTime,
                CurrentLanguage
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
      width: "45px",
      render: (text, record) => {
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        console.log(record, "recordrecordrecordrecord");
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='d-flex align-items-center'>
                {record.isAttachment ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }>
                    <img
                      src={ClipIcon}
                      className='cursor-pointer'
                      alt=''
                      draggable='false'
                      title={t("ClipIcon")}
                    />
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }></span>
                )}
                {record.isChat ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }>
                    <img
                      src={CommentIcon}
                      className='cursor-pointer'
                      alt=''
                      draggable='false'
                      title={t("Chat")}
                    />
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }></span>
                )}
                {record.isVideoCall ? (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-10"
                        : "margin-right-10"
                    }>
                    <img
                      src={VideoIcon}
                      alt=''
                      title={t("Video")}
                      draggable='false'
                    />
                  </span>
                ) : (
                  <span
                    className={
                      currentLanguage === "ar"
                        ? "margin-left-20"
                        : "margin-right-20"
                    }></span>
                )}
                {record.status === "9" && isOrganiser && (
                  <img
                    src={member}
                    className='cursor-pointer'
                    width='17.1px'
                    height='16.72px'
                    alt=''
                    title={t("Member")}
                    draggable='false'
                    onClick={() => onClickDownloadIcon(record.pK_MDID)}
                  />
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
              (record.isQuickMeeting === true &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === true &&
                record.pK_MDID === startMeetingData.meetingID &&
                startMeetingData.showButton)
            ) {
              return (
                <Row>
                  <Col
                    sm={12}
                    md={12}
                    lg={12}
                    className='d-flex justify-content-center'>
                    <Button
                      text={t("Start-meeting")}
                      className={styles["Start-Meeting"]}
                      onClick={() => {
                        console.log("end meeting chaek");
                        dispatch(
                          UpdateOrganizersMeeting(
                            true,
                            navigate,
                            t,
                            6,
                            startMeetingRequest,
                            "",
                            "",
                            "",
                            "",
                            setViewMeetingModal,
                            setEditMeetingModal
                          )
                        );
                        localStorage.setItem("meetingTitle", record.title);
                        localStorage.setItem(
                          "videoCallURL",
                          record.videoCallURL
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
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-center'>
                  <Button
                    text={t("Join-meeting")}
                    className={styles["joining-Meeting"]}
                    onClick={() => {
                      handleViewMeeting(
                        record.videoCallURL,
                        record.pK_MDID,
                        record.isQuickMeeting,
                        record.status
                      );
                      localStorage.setItem("meetingTitle", record.title);
                      localStorage.setItem("videoCallURL", record.videoCallURL);
                    }}
                  />
                </Col>
              </Row>
            );
          } else if (isAgendaContributor) {
            return (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-center'>
                  <Button
                    text={t("Join-meeting")}
                    className={styles["joining-Meeting"]}
                    onClick={() => {
                      handleViewMeeting(
                        record.videoCallURL,
                        record.pK_MDID,
                        record.isQuickMeeting,
                        record.status
                      );
                      localStorage.setItem("meetingTitle", record.title);
                      localStorage.setItem("videoCallURL", record.videoCallURL);
                    }}
                  />
                </Col>
              </Row>
            );
          } else if (isOrganiser) {
            return (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-center'>
                  <Button
                    text={t("Join-meeting")}
                    className={styles["joining-Meeting"]}
                    onClick={() => {
                      handleViewMeeting(
                        record.videoCallURL,
                        record.pK_MDID,
                        record.isQuickMeeting,
                        record.status
                      );
                      localStorage.setItem("meetingTitle", record.title);
                      localStorage.setItem("videoCallURL", record.videoCallURL);
                    }}
                  />
                </Col>
              </Row>
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
      align: "center",

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

        if (
          record.status === "8" ||
          record.status === "4" ||
          record.status === "9"
        ) {
          return null;
        } else {
          if (isQuickMeeting) {
            if (isOrganiser) {
              if (record.status !== "10") {
                return (
                  <>
                    {committeeStatus === 3 && (
                      <img
                        src={EditIcon}
                        className='cursor-pointer'
                        width='17.11px'
                        height='17.11px'
                        alt=''
                        draggable='false'
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
                  </>
                );
              }
            }
          }
        }
      },
    },
  ];

  useEffect(() => {
    try {
      if (CommitteeMeetingMQTT !== null) {
        if (
          Number(ViewCommitteeID) === Number(CommitteeMeetingMQTT.committeeID)
        ) {
          let meetingData = CommitteeMeetingMQTT.meeting;
          let findIsExist = rows.findIndex(
            (data, index) => data.pK_MDID === meetingData.pK_MDID
          );
          if (findIsExist !== -1) {
            setRow((rowsData) => {
              return rowsData.map((newData, index) => {
                if (newData.pK_MDID === meetingData.pK_MDID) {
                  return meetingData;
                } else {
                  return newData;
                }
              });
            });
          } else {
            setRow([meetingData, ...rows]);
          }
        }
        dispatch(createCommitteeMeeting(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [CommitteeMeetingMQTT]);

  useEffect(() => {
    if (MeetingStatusEnded !== null) {
      try {
        if (
          MeetingStatusEnded.message.toLowerCase() ===
          "MEETING_STATUS_EDITED_END".toLowerCase()
        ) {
          let meetingID = MeetingStatusEnded.meeting.pK_MDID;

          setRow((meetingRow) => {
            return meetingRow.map((meetingData) => {
              if (Number(meetingData.pK_MDID) === Number(meetingID)) {
                return {
                  ...meetingData,
                  status: "9",
                };
              } else {
                // If the condition isn't met, return the original value
                return meetingData;
              }
            });
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [MeetingStatusEnded]);

  useEffect(() => {
    if (allMeetingsSocketData !== null) {
      try {
        const updateMeeting = async () => {
          let meetingID = allMeetingsSocketData.pK_MDID;
          let meetingData = allMeetingsSocketData;
          setRow((rowsData) => {
            return rowsData.map((item) => {
              if (item.pK_MDID === meetingID) {
                return meetingData;
              } else {
                return item; // Return the original item if the condition is not met
              }
            });
          });
        };
        updateMeeting();
      } catch (error) {
        console.log(error, "error");
      }
    }
  }, [allMeetingsSocketData]);

  const handelCreateMeeting = () => {
    setCreateMeetingModal(true);
  };
  const emptyText = () => {
    return (
      <ResultMessage
        icon={
          <img
            src={NoMeetingsIcon}
            alt=''
            draggable='false'
            className='nodata-table-icon'
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

  //  Update Meeting Status Cancelled and Start Meeting
  useEffect(() => {
    try {
      if (MeetingStatusSocket !== null) {
        if (
          MeetingStatusSocket.message
            .toLowerCase()
            .includes("MEETING_STATUS_EDITED_CANCELLED".toLowerCase())
        ) {
          let meetingID = MeetingStatusSocket.meetingID;
          setRow((meetingRow) => {
            return meetingRow.map((meetingData) => {
              if (Number(meetingData.pK_MDID) === Number(meetingID)) {
                return {
                  ...meetingData,
                  status: "4",
                };
              } else {
                // If the condition isn't met, return the original value
                return meetingData;
              }
            });
          });
        } else if (
          MeetingStatusSocket.message
            .toLowerCase()
            .includes("MEETING_STATUS_EDITED_STARTED".toLowerCase())
        ) {
          let meetingID =
            MeetingStatusSocket?.meeting?.pK_MDID ||
            MeetingStatusSocket?.meetingID;
          setRow((meetingRow) => {
            return meetingRow.map((meetingData) => {
              if (Number(meetingData.pK_MDID) === Number(meetingID)) {
                return {
                  ...meetingData,
                  status: "10",
                };
              } else {
                // If the condition isn't met, return the original value
                return meetingData;
              }
            });
          });
          dispatch(getMeetingStatusfromSocket(null));
        }

        // if (meetingStatusID === 4) {
        //   updateCalendarData(true, meetingID);
        // }
      }
    } catch (error) {}
  }, [MeetingStatusSocket]);

  const scroll = {
    y: "39vh",
    scrollbar: {
      verticalWidth: 20, // Width of the vertical scrollbar
      handleSize: 10, // Distance between data and scrollbar
    },
  };
  return (
    <>
      {createMeetingModal && (
        <CreateQuickMeeting
          show={createMeetingModal}
          setShow={setCreateMeetingModal}
          // this is check from where its called 6 is from committee create
          checkFlag={5}
        />
      )}
      {viewMeetingModal && (
        <ViewModal
          viewFlag={viewMeetingModal}
          setViewFlag={setViewMeetingModal}
        />
      )}
      {editMeetingModal && (
        <UpdateQuickMeeting
          editFlag={editMeetingModal}
          setEditFlag={setEditMeetingModal}
          // this is check from where its called 6 is from committee create
          checkFlag={6}
        />
      )}
      <Row>
        <Col sm={12} md={12} lg={12} className='d-flex justify-content-end'>
          {committeeStatus === 3 && (
            <Button
              text={t("Create-Meeting")}
              icon={<img draggable={false} src={addmore} alt='' />}
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
            scroll={scroll}
            rows={rows}
            pagination={false}
            size='small'
            className='newMeetingTable'
            locale={{
              emptyText: emptyText(),
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
            }>
            <span className='PaginationStyle-TodoList'>
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
