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
import CreateModal from "../../modalmeeting/ModalMeeting";
import ViewModal from "../../modalView/ModalView";
import EditModal from "../../modalUpdate/ModalUpdate";
import { Col, Row } from "react-bootstrap";
import { Checkbox, Dropdown, Menu, Tooltip } from "antd";
import { ChevronDown } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import styles from "./Meeting.module.css";
import { useSelector } from "react-redux";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import {
  JoinCurrentMeeting,
  getMeetingbyGroupApi,
  meetingNotConductedMQTT,
} from "../../../store/actions/NewMeetingActions";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ViewMeeting } from "../../../store/actions/Get_List_Of_Assignees";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";
import {
  createGroupMeeting,
  getMeetingStatusfromSocket,
} from "../../../store/actions/GetMeetingUserId";

const CommitteeMeetingTab = ({ groupStatus }) => {
  const { t } = useTranslation();
  const getMeetingbyGroupID = useSelector(
    (state) => state.NewMeetingreducer.getMeetingbyGroupID
  );
  const meetingStatusNotConductedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusNotConductedMqttData
  );
  const {
    GroupMeetingMQTT,
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
  const [pageSize, setPageSize] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [createMeetingModal, setCreateMeetingModal] = useState(false);
  const [viewMeetingModal, setViewMeetingModal] = useState(false);
  const [editMeetingModal, setEditMeetingModal] = useState(false);
  const [minutesAgo, setMinutesAgo] = useState(null);

  const [startMeetingData, setStartMeetingData] = useState({
    meetingID: null,
    showButton: false,
  });
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  let ViewGroupID = localStorage.getItem("ViewGroupID");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const handleViewMeeting = async (meetingID, isQuickMeeting, status) => {
    if (Number(status) === 10) {
      let joinMeetingData = {
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
          setSceduleMeeting,
          1
        )
      );
      setViewMeetingModal(true);
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
      GroupID: Number(ViewGroupID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: true,
    };
    dispatch(getMeetingbyGroupApi(navigate, t, searchData));
  }, []);

  const handleChangePagination = (current, pageSize) => {
    setPageSize(current);
    setCurrentPage(pageSize);
    let searchData = {
      GroupID: Number(ViewGroupID),
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(pageSize),
      PublishedMeetings: true,
    };
    dispatch(getMeetingbyGroupApi(navigate, t, searchData));
  };
  useEffect(() => {
    try {
      if (getMeetingbyGroupID !== null && getMeetingbyGroupID !== undefined) {
        setTotalRecords(getMeetingbyGroupID.totalRecords);
        setMinutesAgo(getMeetingbyGroupID.meetingStartedMinuteAgo);
        if (Object.keys(getMeetingbyGroupID.meetings).length > 0) {
          let newRowData = [];
          getMeetingbyGroupID.meetings.forEach((data, index) => {
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
  }, [getMeetingbyGroupID]);

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
          onClick={() => handleMenuClick(filter.value)}
        >
          <Checkbox checked={selectedValues.includes(filter.value)}>
            {filter.text}
          </Checkbox>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex  align-items-center justify-content-between p-1">
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
      title: <span>{t("Title")}</span>,
      dataIndex: "title",
      key: "title",
      width: "120px",
      ellipsis: true,
      render: (text, record) => {
        return (
          <span
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
              localStorage.setItem("meetingTitle", record.title);
              localStorage.setItem("videoCallURL", record.videoCallURL);
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
      width: "90px",
      align: "center",
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
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <ChevronDown
          className="filter-chevron-icon-todolist"
          onClick={handleClickChevron}
        />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}
        >
          <div />
        </Dropdown>
      ),
      render: (text, record) => {
        return StatusValue(t, record.status);
      },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      align: "center",
      width: "90px",
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
      ellipsis: true,
      align: "center",
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
      width: "70px",
      render: (text, record) => {
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        return (
          <>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className="d-flex justify-content-center gap-3"
              >
                <span className={styles["iconsWidth"]}>
                  {record.isAttachment ? (
                    <Tooltip placement="topRight" title={t("ClipIcon")}>
                      <img
                        src={ClipIcon}
                        className="cursor-pointer"
                        alt=""
                        draggable="false"
                      />
                    </Tooltip>
                  ) : null}
                </span>

                <span className={styles["iconsWidth"]}>
                  {record.isChat ? (
                    <img
                      src={CommentIcon}
                      className="cursor-pointer"
                      alt=""
                      draggable="false"
                    />
                  ) : null}
                </span>

                <span className={styles["iconsWidth"]}>
                  {record.isVideoCall ? (
                    <img
                      src={VideoIcon}
                      alt=""
                      title={t("Video")}
                      draggable="false"
                    />
                  ) : null}
                </span>
                <span className={styles["iconsWidth"]}>
                  {record.status === "9" && isOrganiser && (
                    <img
                      src={member}
                      className="cursor-pointer"
                      alt=""
                      title={t("Member")}
                      draggable="false"
                      onClick={() => onClickDownloadIcon(record.pK_MDID)}
                    />
                  )}
                </span>
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
              (record.isQuickMeeting === true &&
                minutesDifference < minutesAgo) ||
              (record.isQuickMeeting === true &&
                record.pK_MDID === startMeetingData.meetingID &&
                startMeetingData.showButton)
            ) {
              return (
                <Row>
                  <Col sm={12} md={12} lg={12}>
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
                            7,
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
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status
                  );
                  localStorage.setItem("meetingTitle", record.title);
                  localStorage.setItem("videoCallURL", record.videoCallURL);
                }}
              />
            );
          } else if (isAgendaContributor) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  localStorage.setItem("meetingTitle", record.title);
                  localStorage.setItem("videoCallURL", record.videoCallURL);
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status
                  );
                }}
              />
            );
          } else if (isOrganiser) {
            return (
              <Button
                text={t("Join-meeting")}
                className={styles["joining-Meeting"]}
                onClick={() => {
                  handleViewMeeting(
                    record.pK_MDID,
                    record.isQuickMeeting,
                    record.status,
                    record.status
                  );
                  localStorage.setItem("meetingTitle", record.title);
                  localStorage.setItem("videoCallURL", record.videoCallURL);
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
        console.log(record, "GroupMeetingTable");
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
          record.status === "9" ||
          record.status === "4"
        ) {
          return null;
        } else {
          if (isQuickMeeting) {
            if (isOrganiser) {
              if (
                record.status !== "10" ||
                record.status !== "9" ||
                record.status !== "4"
              ) {
                return (
                  <>
                    <Row>
                      <Col sm={12} md={12} lg={12}>
                        {groupStatus === 3 && (
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
                      </Col>
                    </Row>
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

  useEffect(() => {
    try {
      if (GroupMeetingMQTT !== null) {
        if (Number(ViewGroupID) === Number(GroupMeetingMQTT.groupID)) {
          let meetingData = GroupMeetingMQTT.meeting;
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
        dispatch(createGroupMeeting(null));
      }
    } catch (error) {
      console.log(error);
    }
  }, [GroupMeetingMQTT]);

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
  //  Update Meeting Status Cancelled and Start Meeting
  useEffect(() => {
    if (MeetingStatusSocket !== null) {
      console.log(
        MeetingStatusSocket,
        "MeetingStatusSocketMeetingStatusSocket"
      );
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
        let meetingID = MeetingStatusSocket?.meeting?.pK_MDID;
        setRow((meetingRow) => {
          return meetingRow.map((meetingData) => {
            if (Number(meetingData?.pK_MDID) === Number(meetingID)) {
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
      }

      dispatch(getMeetingStatusfromSocket(null));
    }
  }, [MeetingStatusSocket]);

  useEffect(() => {
    if (MeetingStatusEnded !== null) {
      console.log(MeetingStatusEnded, "MeetingStatusEndedMeetingStatusEnded");
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

  return (
    <>
      {createMeetingModal && (
        <CreateModal
          show={createMeetingModal}
          setShow={setCreateMeetingModal}
          // this is check from where its called 7 is from groupe create
          checkFlag={7}
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
          // this is check from where its called 7 is from groupe create
          checkFlag={7}
        />
      )}
      <Row>
        <Col sm={12} md={12} lg={12} className="d-flex justify-content-end">
          {groupStatus === 3 && (
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
            scroll={{ y: "39vh", x: "max-content" }}
            rows={rows}
            pagination={false}
            size="small"
            className="newMeetingTable"
            locale={{
              emptyText: emptyText(), // Set your custom empty text here
            }}
          />
        </Col>
        {rows && rows.length > 0 ? (
          <Col
            sm={12}
            md={12}
            lg={12}
            className={
              "pagination-groups-table position-absolute bottom-20 d-flex justify-content-center"
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
