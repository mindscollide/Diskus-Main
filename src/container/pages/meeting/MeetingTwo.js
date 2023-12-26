import React, { useEffect, useState } from "react";
import styles from "./meetingTwo.module.css";
import searchicon from "../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import ClipIcon from "../../../assets/images/ClipIcon.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import {
  GetAllUsers,
  GetAllUsersGroupsRoomsList,
  GetGroupMessages,
  activeChat,
} from "../../../store/actions/Talk_action";
import {
  recentChatFlag,
  headerShowHideStatus,
  footerShowHideStatus,
  createShoutAllScreen,
  addNewChatScreen,
  footerActionStatus,
  createGroupScreen,
  chatBoxActiveFlag,
  activeChatBoxGS,
} from "../../../store/actions/Talk_Feature_actions";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import {
  normalizeVideoPanelFlag,
  minimizeVideoPanelFlag,
} from "../../../store/actions/VideoFeature_actions";
import member from "../../../assets/images/member.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
import {
  Button,
  Table,
  TextField,
  ResultMessage,
  Notification,
} from "../../../components/elements";
import { Paper } from "@material-ui/core";

import { Col, Dropdown, Row } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import SceduleMeeting from "./scedulemeeting/SceduleMeeting";
import UnpublishedProposedMeeting from "./scedulemeeting/meetingDetails/UnpublishedProposedMeeting/UnpublishedProposedMeeting";
import NewEndMeetingModal from "./NewEndMeetingModal/NewEndMeetingModal";
import { useSelector } from "react-redux";
import {
  clearResponseNewMeetingReducerMessage,
  dashboardCalendarEvent,
  GetAllMeetingDetailsApiFunc,
  searchNewUserMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  proposeNewMeetingPageFlag,
} from "../../../store/actions/NewMeetingActions";
import { mqttCurrentMeetingEnded } from "../../../store/actions/GetMeetingUserId";
import { downloadAttendanceReportApi } from "../../../store/actions/Download_action";
import { useDispatch } from "react-redux";
import NewEndLeaveMeeting from "./NewEndLeaveMeeting/NewEndLeaveMeeting";
import { useRef } from "react";

import {
  ViewMeeting,
  allAssignessList,
} from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import {
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { StatusValue } from "./statusJson";
import ModalMeeting from "../../modalmeeting/ModalMeeting";
import ModalUpdate from "../../modalUpdate/ModalUpdate";
import ModalView from "../../modalView/ModalView";
import CustomPagination from "../../../commen/functions/customPagination/Paginations";
import ViewParticipantsDates from "./scedulemeeting/Participants/ViewParticipantsDates/ViewParticipantsDates";
import ViewMeetingModal from "./viewMeetings/ViewMeetingModal";
import OrganizerViewModal from "./scedulemeeting/Organizers/OrganizerViewModal/OrganizerViewModal";
import {
  UpdateOrganizersMeeting,
  clearResponseMessage,
} from "../../../store/actions/MeetingOrganizers_action";
import ProposedNewMeeting from "./scedulemeeting/ProposedNewMeeting/ProposedNewMeeting";

const NewMeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();

  const { talkStateData, NewMeetingreducer, meetingIdReducer } = useSelector(
    (state) => state
  );

  const { searchMeetings, endForAllMeeting, endMeetingModal } = useSelector(
    (state) => state.NewMeetingreducer
  );

  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );

  const ResponseMessages = useSelector(
    (state) => state.MeetingOrganizersReducer.ResponseMessage
  );

  let currentLanguage = localStorage.getItem("i18nextLng");
  //Current User ID
  let currentUserId = localStorage.getItem("userID");
  //Current Organization
  let currentOrganizationId = localStorage.getItem("organizationID");
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");
  let now = new Date();
  let year = now.getUTCFullYear();
  let month = (now.getUTCMonth() + 1).toString().padStart(2, "0");
  let day = now.getUTCDate().toString().padStart(2, "0");
  let hours = now.getUTCHours().toString().padStart(2, "0");
  let minutes = now.getUTCMinutes().toString().padStart(2, "0");
  let seconds = now.getUTCSeconds().toString().padStart(2, "0");
  let currentUTCDateTime = `${year}${month}${day}${hours}${minutes}${seconds}`;
  const [quickMeeting, setQuickMeeting] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  const [proposedNewMeeting, setProposedNewMeeting] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);
  const [dataroomMapFolderId, setDataroomMapFolderId] = useState(0);
  //For Search Field Only
  const [searchText, setSearchText] = useState("");
  const [entereventIcon, setentereventIcon] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [currentMeetingID, setCurrentMeetingID] = useState(0);
  const [isEditMeeting, setEditMeeting] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [rows, setRow] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [viewProposeDatePoll, setViewProposeDatePoll] = useState(false);
  const [viewProposeOrganizerPoll, setViewProposeOrganizerPoll] =
    useState(false);
  const [viewAdvanceMeetingModal, setViewAdvanceMeetingModal] = useState(false);
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(null);
  const [editorRole, setEdiorRole] = useState({ status: null, role: null });
  const [
    viewAdvanceMeetingModalUnpublish,
    setViewAdvanceMeetingModalUnpublish,
  ] = useState(false);

  const [dashboardEventData, setDashboardEventData] = useState(null);

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);
  //  Call all search meetings api
  useEffect(() => {
    if (meetingpageRow !== null && meetingPageCurrent !== null) {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: Number(meetingPageCurrent),
        Length: Number(meetingpageRow),
        PublishedMeetings: true,
      };
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      dispatch(allAssignessList(navigate, t));
      localStorage.setItem("MeetingCurrentView", 1);
    } else {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber: 1,
        Length: 50,
        PublishedMeetings: true,
      };
      localStorage.setItem("MeetingPageRows", 50);
      localStorage.setItem("MeetingPageCurrent", 1);
      dispatch(searchNewUserMeeting(navigate, searchData, t));
      dispatch(allAssignessList(navigate, t));
      localStorage.setItem("MeetingCurrentView", 1);
    }
    setEditFlag(false);
    setViewFlag(false);
    dispatch(scheduleMeetingPageFlag(false));
    dispatch(viewProposeDateMeetingPageFlag(false));
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    dispatch(viewProposeOrganizerMeetingPageFlag(false));
    dispatch(proposeNewMeetingPageFlag(false));
  }, []);

  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
    setSearchText("");
  };

  const handleReset = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  const handleSearch = async () => {
    let searchData = {
      Date: searchFields.Date,
      Title: searchFields.MeetingTitle,
      HostName: searchFields.OrganizerName,
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  const HandleCloseSearchModalMeeting = () => {
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  const meetingDateChangeHandler = (date) => {
    let DateFormat = new DateObject(date).format("YYYYMMDD");
    let DateFormatView = new DateObject(date).format("DD/MM/YYYY");
    setSearchFeilds({
      ...searchFields,
      Date: DateFormat,
      DateView: DateFormatView,
    });
  };

  const searchMeetingChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "MeetingTitle") {
      setSearchFeilds({
        ...searchFields,
        MeetingTitle: value,
      });
    } else if (name === "OrganizerName") {
      setSearchFeilds({
        ...searchFields,
        OrganizerName: value,
      });
    }
  };

  const openSceduleMeetingPage = () => {
    setSceduleMeeting(true);
    dispatch(scheduleMeetingPageFlag(true));
    setCurrentMeetingID(0);
  };

  const openProposedNewMeetingPage = () => {
    setProposedNewMeeting(true);
  };

  const groupChatInitiation = (data) => {
    if (data.talkGroupID !== 0) {
      dispatch(createShoutAllScreen(false));
      dispatch(addNewChatScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(createGroupScreen(false));
      dispatch(chatBoxActiveFlag(false));
      dispatch(recentChatFlag(true));
      dispatch(activeChatBoxGS(true));
      dispatch(chatBoxActiveFlag(true));
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      let chatGroupData = {
        UserID: parseInt(currentUserId),
        ChannelID: currentOrganizationId,
        GroupID: data.talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(
        GetAllUsers(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      dispatch(
        GetAllUsersGroupsRoomsList(
          navigate,
          parseInt(currentUserId),
          parseInt(currentOrganizationId),
          t
        )
      );
      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === data.talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", data.talkGroupID);
    }
  };

  const CreateQuickMeeting = async () => {
    setQuickMeeting(true);
  };

  const eventClickHandler = () => {};

  //Published Meeting Page
  const handlePublishedMeeting = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: true,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 1);
    localStorage.setItem("MeetingPageRows", 50);
    localStorage.setItem("MeetingPageCurrent", 1);
  };

  //UnPublished Meeting Page
  const handleUnPublishedMeeting = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: 1,
      Length: 50,
      PublishedMeetings: false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 2);
    localStorage.setItem("MeetingPageRows", 50);
    localStorage.setItem("MeetingPageCurrent", 1);
  };

  const handleViewMeeting = async (id, isQuickMeeting) => {
    if (isQuickMeeting) {
      let Data = { MeetingID: id };
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewFlag,
          setEditFlag,
          setSceduleMeeting,
          1
        )
      );
      // setViewFlag(true);
    } else {
      setAdvanceMeetingModalID(id);
      setViewAdvanceMeetingModal(true);
      dispatch(viewAdvanceMeetingPublishPageFlag(true));
      dispatch(scheduleMeetingPageFlag(false));
      localStorage.setItem("currentMeetingID", id);
    }
  };

  const handleEditMeeting = async (
    id,
    isQuick,
    isAgendaContributor,
    record
  ) => {
    let Data = { MeetingID: Number(id) };

    if (isQuick) {
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewFlag,
          setEditFlag,
          setSceduleMeeting,
          2
        )
      );
    } else if (isQuick === false) {
      let Data = {
        MeetingID: Number(id),
      };
      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          true,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          1
        )
      );
      dispatch(scheduleMeetingPageFlag(true));
    } else {
    }
  };

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
            className={styles["meetingTitle"]}
            onClick={() => {
              handleViewMeeting(record.pK_MDID, record.isQuickMeeting);
              setEdiorRole({
                status: record.status,
                role: isParticipant
                  ? "Participant"
                  : isAgendaContributor
                  ? "Agenda Contributor"
                  : "Organizer",
              });
              // setIsOrganisers(isOrganiser);
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
        return <span>{text}</span>;
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
                    onClick={(e) => groupChatInitiation(record)}
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
              record.isQuickMeeting === true &&
              minutesDifference <= 5 &&
              minutesDifference > 0
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
                            4,
                            startMeetingRequest,
                            setEdiorRole,
                            setAdvanceMeetingModalID,
                            setDataroomMapFolderId,
                            setSceduleMeeting,
                            setViewFlag,
                            setEditFlag
                          )
                        );
                      }}
                    />
                  </Col>
                </Row>
              );
            } else if (
              record.isQuickMeeting === false &&
              minutesDifference <= 5 &&
              minutesDifference > 0
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
                            3,
                            startMeetingRequest,
                            setEdiorRole,
                            setAdvanceMeetingModalID,
                            setDataroomMapFolderId,
                            setViewAdvanceMeetingModal
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
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Participant",
                  });
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
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Agenda Contributor",
                  });
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
                  // setIsOrganisers(isOrganiser);
                  setEdiorRole({
                    status: record.status,
                    role: "Organizer",
                  });
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
        if (record.status === "8") {
          return null;
        } else {
          if (isQuickMeeting) {
            if (isOrganiser) {
              return (
                <>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <Tooltip placement="topRight" title={t("Edit")}>
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
                      </Tooltip>
                    </Col>
                  </Row>
                </>
              );
            }
          } else {
            if (isParticipant) {
            } else if (isOrganiser) {
              return (
                <>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <Tooltip placement="topRight" title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className="cursor-pointer"
                          width="17.11px"
                          height="17.11px"
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
                      </Tooltip>
                    </Col>
                  </Row>
                </>
              );
            } else if (isAgendaContributor) {
              return (
                <>
                  <Row>
                    <Col sm={12} md={12} lg={12}>
                      <Tooltip placement="topRight" title={t("Edit")}>
                        <img
                          src={EditIcon}
                          className="cursor-pointer"
                          width="17.11px"
                          height="17.11px"
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
                      </Tooltip>
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

  //For searching Filed Only
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  // Clear Search Input Value with reset all settings
  const handleClearSearch = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchText("");
    setentereventIcon(false);
  };

  // Enter Press click handler on input field
  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && searchText !== "") {
      let searchData = {
        Date: "",
        Title: searchText,
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        PublishedMeetings: Number(currentView) === 1 ? true : false,
      };
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      setentereventIcon(true);
    }
  };

  useEffect(() => {
    if (
      NewMeetingreducer.CalendarDashboardEventData !== null &&
      NewMeetingreducer.CalendarDashboardEventData !== undefined
    ) {
      setDashboardEventData(NewMeetingreducer.CalendarDashboardEventData);
    }
  }, [NewMeetingreducer.CalendarDashboardEventData]);

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setTotalRecords(searchMeetings.totalRecords);
        if (Object.keys(searchMeetings.meetings).length > 0) {
          let newRowData = [];
          searchMeetings.meetings.map((data, index) => {
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
  }, [searchMeetings]);

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

  const handelChangePagination = async (current, PageSize) => {
    let searchData = {
      Date: searchFields.Date,
      Title: searchFields.MeetingTitle,
      HostName: searchFields.OrganizerName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(PageSize),
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    localStorage.setItem("MeetingPageRows", PageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
  };

  useEffect(() => {
    if (
      NewMeetingreducer.meetingStatusPublishedMqttData !== null &&
      NewMeetingreducer.meetingStatusPublishedMqttData !== undefined
    ) {
      let meetingData = NewMeetingreducer.meetingStatusPublishedMqttData;
      try {
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
      } catch {
        console.log("Error");
      }
    }
  }, [NewMeetingreducer.meetingStatusPublishedMqttData]);

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusSocket !== null &&
      meetingIdReducer.MeetingStatusSocket !== undefined &&
      meetingIdReducer.MeetingStatusSocket.length !== 0
    ) {
      let startMeetingData = meetingIdReducer.MeetingStatusSocket.meeting;
      const indexToUpdate = rows.findIndex(
        (obj) => obj.pK_MDID === startMeetingData.pK_MDID
      );
      if (indexToUpdate !== -1) {
        let updatedRows = [...rows];
        updatedRows[indexToUpdate] = startMeetingData;
        setRow(updatedRows);
      } else {
        let updatedRows = [...rows, startMeetingData];
        setRow(updatedRows);
      }
    }
  }, [meetingIdReducer.MeetingStatusSocket]);

  useEffect(() => {
    if (
      meetingIdReducer.MeetingStatusEnded !== null &&
      meetingIdReducer.MeetingStatusEnded !== undefined &&
      meetingIdReducer.MeetingStatusEnded.length !== 0
    ) {
      let endMeetingData = meetingIdReducer.MeetingStatusEnded.meeting;
      const indexToUpdate = rows.findIndex(
        (obj) => obj.pK_MDID === endMeetingData.pK_MDID
      );
      let roomId;
      if (
        NewMeetingreducer.CurrentMeetingURL !== "" &&
        NewMeetingreducer.CurrentMeetingURL !== null &&
        NewMeetingreducer.CurrentMeetingURL !== undefined
      ) {
        let url = NewMeetingreducer.CurrentMeetingURL;
        let urlObject = new URL(url);
        let searchParams = new URLSearchParams(urlObject.search);
        roomId = Number(searchParams.get("RoomID"));
      } else {
        roomId = 0;
      }
      let acceptedRoomID = Number(localStorage.getItem("acceptedRoomID"));

      if (indexToUpdate !== -1) {
        let updatedRows = [...rows];
        updatedRows[indexToUpdate] = endMeetingData;
        setRow(updatedRows);
        if (
          advanceMeetingModalID === endMeetingData.pK_MDID &&
          endMeetingData.status === "9"
        ) {
          setEdiorRole({ status: null, role: null });
          setViewAdvanceMeetingModal(false);
          dispatch(viewAdvanceMeetingPublishPageFlag(false));
          dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
          setCurrentMeetingID(0);
          setAdvanceMeetingModalID(null);
          setDataroomMapFolderId(0);
          if (acceptedRoomID === roomId) {
            dispatch(normalizeVideoPanelFlag(false));
            dispatch(minimizeVideoPanelFlag(false));
            localStorage.setItem("activeCall", false);
            localStorage.setItem("activeRoomID", 0);
            localStorage.setItem("acceptedRoomID", 0);
            localStorage.setItem("isMeeting", false);
          }
        }
        dispatch(mqttCurrentMeetingEnded(null));
      } else {
        let updatedRows = [...rows, endMeetingData];
        setRow(updatedRows);
      }
    }
  }, [meetingIdReducer.MeetingStatusEnded, NewMeetingreducer]);

  useEffect(() => {
    if (
      ResponseMessages !== "" &&
      ResponseMessages !== undefined &&
      ResponseMessages !== t("Record-found") &&
      ResponseMessages !== t("No-records-found") &&
      ResponseMessages !== t("No-record-found")
    ) {
      setOpen({
        message: ResponseMessages,
        open: true,
      });
      setTimeout(() => {
        setOpen({
          message: "",
          open: false,
        });
        dispatch(clearResponseMessage(""));
      }, 4000);
    } else {
    }
  }, [ResponseMessages]);

  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== t("Record-found") &&
      ResponseMessage !== t("List-updated-successfully")
    ) {
      setOpen({
        message: ResponseMessage,
        open: true,
      });
      setTimeout(() => {
        setOpen({
          message: "",
          open: false,
        });
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }, 4000);
    } else {
      setTimeout(() => {
        setOpen({
          message: "",
          open: false,
        });
        dispatch(clearResponseNewMeetingReducerMessage(""));
      }, 4000);
    }
  }, [ResponseMessage]);

  useEffect(() => {
    if (dashboardEventData !== null && dashboardEventData !== undefined) {
      let startMeetingRequest = {
        MeetingID: Number(dashboardEventData.pK_MDID),
        StatusID: 10,
      };
      console.log("USE EFFECT DASHBOARD ROUTE");
      for (const meeting of rows) {
        if (Number(meeting.pK_MDID) === dashboardEventData.pK_MDID) {
          if (
            meeting.status === "10" &&
            dashboardEventData.participantRoleID === 2
          ) {
            handleViewMeeting(meeting.pK_MDID, meeting.isQuickMeeting);
            setEdiorRole({
              status: meeting.status,
              role: "Participant",
            });
          } else if (
            meeting.status === "10" &&
            dashboardEventData.participantRoleID === 4
          ) {
            handleViewMeeting(meeting.pK_MDID, meeting.isQuickMeeting);
            setEdiorRole({
              status: meeting.status,
              role: "Agenda Contributor",
            });
          } else if (
            meeting.status === "10" &&
            dashboardEventData.participantRoleID === 1
          ) {
            handleViewMeeting(meeting.pK_MDID, meeting.isQuickMeeting);
            // setIsOrganisers(isOrganiser);
            setEdiorRole({
              status: meeting.status,
              role: "Organizer",
            });
          } else if (meeting.status === "1") {
            if (meeting.isQuickMeeting === true) {
              dispatch(
                UpdateOrganizersMeeting(
                  navigate,
                  t,
                  4,
                  startMeetingRequest,
                  setEdiorRole,
                  setAdvanceMeetingModalID,
                  setDataroomMapFolderId,
                  setSceduleMeeting,
                  setViewFlag,
                  setEditFlag
                )
              );
            } else if (meeting.isQuickMeeting === false) {
              dispatch(
                UpdateOrganizersMeeting(
                  navigate,
                  t,
                  3,
                  startMeetingRequest,
                  setEdiorRole,
                  setAdvanceMeetingModalID,
                  setDataroomMapFolderId,
                  setViewAdvanceMeetingModal
                )
              );
            }
          }
          break;
        }
      }
      dispatch(dashboardCalendarEvent(null));
      setDashboardEventData(null);
    }
  }, [dashboardEventData, rows]);

  console.log("Meeting Table Data", rows);

  console.log("dashboardEventDatadashboardEventData", dashboardEventData);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);

  return (
    <section className={styles["NewMeeting_container"]}>
      {endForAllMeeting && <NewEndLeaveMeeting />}
      {endMeetingModal && <NewEndMeetingModal />}
      {quickMeeting && (
        <ModalMeeting
          setShow={setQuickMeeting}
          show={quickMeeting}
          // this is check from where its called 4 is from Meeting
          checkFlag={4}
        />
      )}
      {viewFlag ? (
        <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      ) : null}
      {editFlag ? (
        <ModalUpdate
          editFlag={editFlag}
          setEditFlag={setEditFlag}
          // this is check from where its called 4 is from Meeting
          checkFlag={4}
        />
      ) : null}
      <Notification message={open.message} open={open.open} setOpen={setOpen} />
      {sceduleMeeting && NewMeetingreducer.scheduleMeetingPageFlag === true ? (
        <SceduleMeeting
          setSceduleMeeting={setSceduleMeeting}
          setCurrentMeetingID={setCurrentMeetingID}
          currentMeeting={currentMeetingID}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          setEditMeeting={setEditMeeting}
          isEditMeeting={isEditMeeting}
          setDataroomMapFolderId={setDataroomMapFolderId}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : viewProposeDatePoll &&
        NewMeetingreducer.viewProposeDateMeetingPageFlag === true ? (
        <ViewParticipantsDates
          setViewProposeDatePoll={setViewProposeDatePoll}
          setCurrentMeetingID={setCurrentMeetingID}
          setSceduleMeeting={setViewProposeDatePoll}
          setDataroomMapFolderId={setDataroomMapFolderId}
        />
      ) : viewAdvanceMeetingModal &&
        NewMeetingreducer.viewAdvanceMeetingPublishPageFlag === true ? (
        <ViewMeetingModal
          advanceMeetingModalID={advanceMeetingModalID}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          unPublish={false}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          dataroomMapFolderId={dataroomMapFolderId}
          setDataroomMapFolderId={setDataroomMapFolderId}
          setCurrentMeetingID={setCurrentMeetingID}
        />
      ) : viewAdvanceMeetingModalUnpublish &&
        NewMeetingreducer.viewAdvanceMeetingUnpublishPageFlag === true ? (
        <ViewMeetingModal
          advanceMeetingModalID={advanceMeetingModalID}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModalUnpublish}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          unPublish={true}
          editorRole={editorRole}
          setEdiorRole={setEdiorRole}
          dataroomMapFolderId={dataroomMapFolderId}
          setDataroomMapFolderId={setDataroomMapFolderId}
        />
      ) : viewProposeOrganizerPoll &&
        NewMeetingreducer.viewProposeOrganizerMeetingPageFlag === true ? (
        <OrganizerViewModal
          setViewProposeOrganizerPoll={setViewProposeOrganizerPoll}
          currentMeeting={currentMeetingID}
        />
      ) : proposedNewMeeting &&
        NewMeetingreducer.proposeNewMeetingPageFlag === true ? (
        <ProposedNewMeeting setProposedNewMeeting={setProposedNewMeeting} />
      ) : (
        <>
          <Row className="mt-2">
            <Col
              sm={12}
              md={8}
              lg={8}
              className="d-flex gap-3 align-items-center"
            >
              <span className={styles["NewMeetinHeading"]}>
                {t("Meetings")}
              </span>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Dropdown
                    className="SceduleMeetingButton"
                    onClick={eventClickHandler}
                  >
                    <Dropdown.Toggle title={t("Create")}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["schedule_button"]}
                        >
                          <Plus width={20} height={20} fontWeight={800} />
                          <span> {t("Schedule-a-meeting")}</span>
                        </Col>
                      </Row>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item
                        className="dropdown-item"
                        onClick={CreateQuickMeeting}
                      >
                        {t("Quick-meeting")}
                      </Dropdown.Item>

                      <Dropdown.Item
                        className="dropdown-item"
                        onClick={openSceduleMeetingPage}
                      >
                        {t("Advance-meeting")}
                      </Dropdown.Item>
                      {/* Proposed New Meeting For the Time Being Committed */}
                      {/* <Dropdown.Item
                        className="dropdown-item"
                        onClick={openProposedNewMeetingPage}
                      >
                        {t("Propose-new-meeting")}
                      </Dropdown.Item> */}
                    </Dropdown.Menu>
                  </Dropdown>
                </Col>
              </Row>
            </Col>
            <Col
              sm={12}
              md={4}
              lg={4}
              className="d-flex justify-content-end align-items-center"
            >
              <span className="position-relative">
                <TextField
                  width={"502px"}
                  placeholder={t("Search")}
                  applyClass={"meetingSearch"}
                  name={"SearchVal"}
                  labelClass="d-none"
                  value={searchText}
                  change={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  inputicon={
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        {entereventIcon === true ? (
                          <img
                            src={BlackCrossIcon}
                            className="cursor-pointer"
                            onClick={handleClearSearch}
                            alt=""
                            draggable="false"
                          />
                        ) : null}
                        <img
                          src={searchicon}
                          className={styles["Search_Bar_icon_class"]}
                          onClick={HandleShowSearch} // Add click functionality here
                          alt=""
                          draggable="false"
                        />
                      </Col>
                    </Row>
                  }
                  iconClassName={styles["polling_searchinput"]}
                />
                {searchMeeting ? (
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Search-Box_meeting"]}
                      >
                        <Row className="mt-2">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end"
                          >
                            <img
                              src={BlackCrossIcon}
                              className={styles["Cross_Icon_Styling"]}
                              width="16px"
                              height="16px"
                              onClick={HandleCloseSearchModalMeeting}
                              alt=""
                              draggable="false"
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col lg={12} md={12} sm={12}>
                            <TextField
                              placeholder={t("Meeting-title")}
                              applyClass={"meetinInnerSearch"}
                              labelClass="d-none"
                              name="MeetingTitle"
                              value={searchFields.MeetingTitle}
                              change={searchMeetingChangeHandler}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col lg={6} md={6} sm={12}>
                            <DatePicker
                              value={searchFields.DateView}
                              format={"DD/MM/YYYY"}
                              placeholder="DD/MM/YYYY"
                              render={
                                <InputIcon
                                  placeholder="DD/MM/YYYY"
                                  className="datepicker_input"
                                />
                              }
                              editable={false}
                              className="datePickerTodoCreate2"
                              onOpenPickNewDate={false}
                              inputMode=""
                              calendar={calendarValue}
                              locale={localValue}
                              ref={calendRef}
                              onChange={meetingDateChangeHandler}
                            />
                          </Col>
                          <Col lg={6} md={6} sm={12}>
                            <TextField
                              placeholder={t("Organizer-name")}
                              labelClass="d-none"
                              name="OrganizerName"
                              applyClass={"meetinInnerSearch"}
                              value={searchFields.OrganizerName}
                              change={searchMeetingChangeHandler}
                            />
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-end gap-2"
                          >
                            <Button
                              text={t("Reset")}
                              className={styles["ResetButtonMeeting"]}
                              onClick={handleReset}
                            />
                            <Button
                              text={t("Search")}
                              className={styles["SearchButtonMeetings"]}
                              onClick={handleSearch}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12}>
              <Paper className={styles["PaperStylesMeetingTwoPage"]}>
                <Row>
                  <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                    <Button
                      text={t("Published-meeting")}
                      className={
                        Number(currentView) === 1
                          ? styles["publishedMeetingButton-active"]
                          : styles["publishedMeetingButton"]
                      }
                      onClick={handlePublishedMeeting}
                    />
                    <Button
                      text={t("Unpublished-proposed-meetings")}
                      className={
                        Number(currentView) === 2
                          ? styles["UnpublishedMeetingButton-active"]
                          : styles["UnpublishedMeetingButton"]
                      }
                      onClick={handleUnPublishedMeeting}
                    />
                  </Col>
                </Row>
                {Number(currentView) === 2 ? (
                  <UnpublishedProposedMeeting
                    viewProposeDatePoll={viewProposeDatePoll}
                    setViewProposeDatePoll={setViewProposeDatePoll}
                    setViewProposeOrganizerPoll={setViewProposeOrganizerPoll}
                    setAdvanceMeetingModalID={setAdvanceMeetingModalID}
                    setViewAdvanceMeetingModalUnpublish={
                      setViewAdvanceMeetingModalUnpublish
                    }
                    setSceduleMeeting={setSceduleMeeting}
                    setEdiorRole={setEdiorRole}
                    setEditMeeting={setEditMeeting}
                    setCurrentMeetingID={setCurrentMeetingID}
                    currentMeeting={currentMeetingID}
                    editorRole={editorRole}
                    setDataroomMapFolderId={setDataroomMapFolderId}
                  />
                ) : Number(currentView) === 1 ? (
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <>
                        <Table
                          column={MeetingColoumns}
                          scroll={{ y: "54vh", x: true }}
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
                              record.meetingAgenda !== null &&
                              record.meetingAgenda.length > 0
                                ? true
                                : false,
                          }}
                        />
                      </>
                    </Col>
                  </Row>
                ) : null}
                {rows.length > 0 ? (
                  <>
                    <Row className="mt-5">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center "
                      >
                        <Row className={styles["PaginationStyle-Committee"]}>
                          <Col
                            className={"pagination-groups-table"}
                            sm={12}
                            md={12}
                            lg={12}
                          >
                            <CustomPagination
                              current={
                                meetingPageCurrent !== null &&
                                meetingPageCurrent !== undefined
                                  ? meetingPageCurrent
                                  : 1
                              }
                              pageSize={
                                meetingpageRow !== null &&
                                meetingpageRow !== undefined
                                  ? meetingpageRow
                                  : 50
                              }
                              onChange={handelChangePagination}
                              total={totalRecords}
                              showSizer={true}
                              pageSizeOptionsValues={["30", "50", "100", "200"]}
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </>
                ) : null}
              </Paper>
            </Col>
          </Row>
        </>
      )}
    </section>
  );
};

export default NewMeeting;
