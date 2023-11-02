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
import member from "../../../assets/images/member.svg";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useTranslation } from "react-i18next";
import { Pagination, Tooltip } from "antd";
import Select from "react-select";
import {
  Button,
  Table,
  TextField,
  ResultMessage,
} from "../../../components/elements";
import { Paper } from "@material-ui/core";

import { Col, Dropdown, Row } from "react-bootstrap";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import SceduleMeeting from "./scedulemeeting/SceduleMeeting";
import UnpublishedProposedMeeting from "./scedulemeeting/meetingDetails/UnpublishedProposedMeeting/UnpublishedProposedMeeting";
import NewEndMeetingModal from "./NewEndMeetingModal/NewEndMeetingModal";
import { useSelector } from "react-redux";
import {
  clearMeetingState,
  searchNewUserMeeting,
  showEndMeetingForAll,
  showEndMeetingModal,
} from "../../../store/actions/NewMeetingActions";
import { useDispatch } from "react-redux";
import NewEndLeaveMeeting from "./NewEndLeaveMeeting/NewEndLeaveMeeting";
import PublishedMeeting from "./scedulemeeting/meetingDetails/PublishedMeeting/PublishedMeeting";
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
// import ViewMeetingModal from "./viewMeetings/ViewMeeting";

const NewMeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  const { talkStateData, talkFeatureStates } = useSelector((state) => state);
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings
  );
  const endForAllMeeting = useSelector(
    (state) => state.NewMeetingreducer.endForAllMeeting
  );
  const endMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.endMeetingModal
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
  let OrganizerName = localStorage.getItem("name");

  const [quickMeeting, setQuickMeeting] = useState(false);
  // const [unPublishedMeeting, setUnPublishedMeeting] = useState(false);
  // const [allPublishedMeetings, setAllPublishedMeetings] = useState(false);
  const [sceduleMeeting, setSceduleMeeting] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);
  //For Search Field Only
  const [searchText, setSearchText] = useState("");
  const [entereventIcon, setentereventIcon] = useState(false);
  const [editFlag, setEditFlag] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [publishedMeeting, setpublishedMeeting] = useState(false);
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
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [viewProposeDatePoll, setViewProposeDatePoll] = useState(false);
  const [viewAdvanceMeetingModal, setViewAdvanceMeetingModal] = useState(false);
  const [advanceMeetingModalID, setAdvanceMeetingModalID] = useState(null);

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
    return () => {
      // localStorage.removeItem("MeetingPageRows");
      // localStorage.removeItem("MeetingPageCurrent");
      dispatch(clearMeetingState());
    };
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
  };

  const groupChatInitiation = (data) => {
    if (data.talkGroupID !== 0) {
      console.log("discussionGroupChat", data);
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

  //Modal For LEave Meeting
  const EndMeetingModal = () => {
    dispatch(showEndMeetingModal(true));
  };

  //Modal For End Meeting
  const EndForAllModal = () => {
    dispatch(showEndMeetingForAll(true));
  };

  const eventClickHandler = () => {};

  //Published Meeting Page
  const handlePublishedMeeting = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingpageRow !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings: true,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 1);
  };

  //UnPublished Meeting Page
  const handleUnPublishedMeeting = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingpageRow !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings: false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    localStorage.setItem("MeetingCurrentView", 2);
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
          setCalendarViewModal,
          1
        )
      );
    } else {
      setAdvanceMeetingModalID(id);
      setViewAdvanceMeetingModal(true);
    }
  };

  const handleEditMeeting = async (id, isQuick, isAgendaContributor) => {
    console.log("handleEditMeeting", id, isQuick);
    let Data = { MeetingID: id };
    if (isQuick) {
      await dispatch(
        ViewMeeting(
          navigate,
          Data,
          t,
          setViewFlag,
          setEditFlag,
          setCalendarViewModal,
          2
        )
      );
    } else if (isAgendaContributor) {
    } else {
    }
  };

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(arabic);
        setLocalValue(arabic_ar);
      }
    }
  }, [currentLanguage]);

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
            onClick={() =>
              handleViewMeeting(record.pK_MDID, record.isQuickMeeting)
            }
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
      ],
      defaultFilteredValue: ["10", "9", "8", "1"],
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
                        // width="14.02px"
                        // height="16.03px"
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
            (Number(attendee.user.pK_UID) === Number(currentUserId) &&
              attendee.meetingAttendeeRole.role === "Participant") ||
            attendee.meetingAttendeeRole.role === "Agenda Contributor"
        );
        const isOrganiser = record.meetingAttendees.some(
          (attendee) =>
            Number(attendee.user.pK_UID) === Number(currentUserId) &&
            attendee.meetingAttendeeRole.role === "Organizer"
        );
        if (record.status === "1") {
          if (isParticipant) {
          } else {
            return (
              <Row>
                <Col sm={12} md={12} lg={12}>
                  <Button
                    text={t("Start-meeting")}
                    className={styles["Start-Meeting"]}
                  />
                </Col>
              </Row>
            );
          }
        } else if (record.status === "2") {
          if (isParticipant) {
            <Button
              text={t("Join-meeting")}
              className={styles["joining-Meeting"]}
            />;
          } else if (isOrganiser) {
            <Button
              text={t("Join-meeting")}
              className={styles["joining-Meeting"]}
            />;
          }
        } else if (record.status === "10") {
          if (isOrganiser) {
            return (
              <Button
                text={t("End-Meeting")}
                className={styles["End-Meeting"]}
                onClick={EndMeetingModal}
              />
            );
          } else if (isParticipant) {
            return (
              <Button
                text={t("Leave-meeting")}
                className={styles["End-Meeting"]}
                onClick={EndMeetingModal}
              />
            );
          }
        }
        // return (
        //   <>
        //     {/* <Row>
        //       <Col sm={12} md={12} lg={12}>
        //         <Button
        //           text={t("Join-meeting")}
        //           className={styles["joining-Meeting"]}
        //         />
        //       </Col>
        //     </Row> */}
        //     {/* <Row>
        //       <Col sm={12} md={12} lg={12}>
        //         <Button
        //           text={t("Start-meeting")}
        //           className={styles["Start-Meeting"]}
        //         />
        //       </Col>
        //     </Row> */}
        //     {/* <Row>
        //       <Col sm={12} md={12} lg={12}>
        //         <Button
        //           text={t("Leave-meeting")}
        //           className={styles["End-Meeting"]}
        //           onClick={EndMeetingModal}
        //         />
        //       </Col>
        //     </Row> */}

        //     {/* <Row>
        //       <Col sm={12} md={12} lg={12}>
        //         <Button
        //           text={t("End-meeting")}
        //           className={styles["End-Meeting"]}
        //           onClick={EndForAllModal}
        //         />
        //       </Col>
        //     </Row> */}

        //   </>
        // );
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
        console.log("isQuickMeeting", isQuickMeeting);
        console.log("isQuickMeeting", record);

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
                            isAgendaContributor
                          )
                        }
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </>
            );
          } else {
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
                        onClick={() =>
                          handleEditMeeting(
                            record.pK_MDID,
                            record.isQuickMeeting,
                            isAgendaContributor
                          )
                        }
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
                        onClick={() =>
                          handleEditMeeting(
                            record.pK_MDID,
                            record.isQuickMeeting,
                            isAgendaContributor
                          )
                        }
                      />
                    </Tooltip>
                  </Col>
                </Row>
              </>
            );
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

  // Time Picker of the Search
  // const changeDateStartHandler = (date) => {
  //   let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
  //   let DateDate = new Date(date);
  //   setMeetingDate(meetingDateValueFormat);
  //   setPollsData({
  //     ...pollsData,
  //     date: DateDate,
  //   });
  // };

  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        setTotalRecords(searchMeetings.totalRecords);
        if (
          searchMeetings.meetings !== null &&
          searchMeetings.meetings !== undefined &&
          searchMeetings.meetings.length > 0
        ) {
          let newRowData = [];
          searchMeetings.meetings.map((data, index) => {
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
                totalNoOfDirectors: data.meetingPoll.totalNoOfDirectors,
                totalNoOfDirectorsVoted:
                  data.meetingPoll.totalNoOfDirectorsVoted,
              },
              responseDeadLine: data.responseDeadLine,
              status: data.status,
              title: data.title,
              talkGroupID: data.talkGroupID,
              key: index,
            });
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

  return (
    <section className={styles["NewMeeting_container"]}>
      {sceduleMeeting ? (
        <SceduleMeeting setSceduleMeeting={setSceduleMeeting} />
      ) : viewProposeDatePoll ? (
        <ViewParticipantsDates
          setViewProposeDatePoll={setViewProposeDatePoll}
        />
      ) : viewAdvanceMeetingModal ? (
        <></>
        // <ViewMeetingModal
        //   advanceMeetingModalID={advanceMeetingModalID}
        //   setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
        // />
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
                  />
                ) : Number(currentView) === 1 ? (
                  <Row className="mt-2">
                    <Col lg={12} md={12} sm={12}>
                      <>
                        <Table
                          column={MeetingColoumns}
                          scroll={{ y: "62vh", x: true }}
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
                      </>
                    </Col>
                  </Row>
                ) : null}
                {rows.length > 0 ? (
                  <>
                    <Row className="mt-5">
                      <Col lg={4} md={4} sm={4}></Col>
                      <Col
                        lg={4}
                        md={4}
                        sm={4}
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
      {endForAllMeeting && <NewEndLeaveMeeting />}
      {endMeetingModal && <NewEndMeetingModal />}
      {quickMeeting && (
        <ModalMeeting setShow={setQuickMeeting} show={quickMeeting} />
      )}
      {viewFlag ? (
        <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      ) : null}
      {editFlag ? (
        <ModalUpdate editFlag={editFlag} setEditFlag={setEditFlag} />
      ) : null}
    </section>
  );
};

export default NewMeeting;
