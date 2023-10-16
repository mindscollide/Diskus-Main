import React, { useEffect, useState } from "react";
import styles from "./meetingTwo.module.css";
import searchicon from "../../../assets/images/searchicon.svg";
import BlackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import ClipIcon from "../../../assets/images/ClipIcon.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";

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
import moment from "moment";
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
const NewMeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  let currentLanguage = localStorage.getItem("i18nextLng");
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
  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });

  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  let userID = localStorage.getItem("userID");
  let OrganizerName = localStorage.getItem("name");

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
    console.log(
      { meetingPageCurrent, meetingpageRow },
      "handleSearchhandleSearch"
    );
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
  console.log({ searchFields }, "searchFieldssearchFieldssearchFields");
  const openSceduleMeetingPage = () => {
    setSceduleMeeting(true);
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

  const [calendarViewModal, setCalendarViewModal] = useState(false);

  const handleViewMeeting = async (id) => {
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
  };
  const handleEditMeeting = async (id, isQuick) => {
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
      width: "30px",
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
                  >
                    <Tooltip placement="topLeft" title={t("Chat")}>
                      <img
                        src={CommentIcon}
                        className="cursor-pointer"
                        // width="20.06px"
                        // height="15.95px"
                        alt=""
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
                    <img src={VideoIcon} alt="" />
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
                {record.status === "9" && (
                  <Tooltip placement="topLeft" title={t("member")}>
                    <img
                      src={member}
                      className="cursor-pointer"
                      width="17.1px"
                      height="16.72px"
                      alt=""
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
        if (record.status === "1") {
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
        } else if (record.status === "2") {
          return (
            <Button
              text={t("Join-meeting")}
              className={styles["joining-Meeting"]}
            />
          );
        } else if (record.status === "3") {
        } else if (record.status === "4") {
        } else if (record.status === "5") {
        } else if (record.status === "6") {
        } else if (record.status === "7") {
        } else if (record.status === "8") {
        } else if (record.status === "9") {
        } else if (record.status === "10") {
          if (record.host.toLowerCase().includes("OrganizerName".toLowerCase)) {
            return (
              <Button
                text={t("End-Meeting")}
                className={styles["End-Meeting"]}
                onClick={EndMeetingModal}
              />
            );
          } else {
            return (
              <Button
                text={t("Leave-meeting")}
                className={styles["End-Meeting"]}
                onClick={EndMeetingModal}
              />
            );
          }
        } else if (record.status === "11") {
        } else if (record.status === "12") {
        } else if (record.status === "13") {
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
                    onClick={() =>
                      handleEditMeeting(record.pK_MDID, record.isQuickMeeting)
                    }
                  />
                </Tooltip>
              </Col>
            </Row>
          </>
        );
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
      if (
        NewMeetingreducer.searchMeetings !== null &&
        NewMeetingreducer.searchMeetings !== undefined
      ) {
        setTotalRecords(NewMeetingreducer.searchMeetings.totalRecords);
        if (
          NewMeetingreducer.searchMeetings.meetings !== null &&
          NewMeetingreducer.searchMeetings.meetings !== undefined &&
          NewMeetingreducer.searchMeetings.meetings.length > 0
        ) {
          let newRowData = [];
          NewMeetingreducer.searchMeetings.meetings.map((data, index) => {
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
              key: index,
            });
          });
          setRow(newRowData);
        }
      } else {
        setRow([]);
      }
    } catch {}
  }, [NewMeetingreducer.searchMeetings]);

  // Empty text data
  const emptyText = () => {
    return (
      <ResultMessage
        icon={<img src={NoMeetingsIcon} alt="" className="nodata-table-icon" />}
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
              {/* <Button
                text={t("Schedule-a-meeting")}
                className={styles["Newmeeting_Scehedule_meet"]}
                icon={<Plus width={20} height={20} fontWeight={800} />}
                onClick={openSceduleMeetingPage}
              /> */}
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
                          />
                        ) : null}
                        <img
                          src={searchicon}
                          className={styles["Search_Bar_icon_class"]}
                          onClick={HandleShowSearch} // Add click functionality here
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
                    {/* <Button
                      text={t("Quick-meeting")}
                      className={styles["UnpublishedMeetingButton"]}
                      onClick={CreateQuickMeeting}
                    /> */}
                  </Col>
                </Row>
                {Number(currentView) === 2 ? (
                  <UnpublishedProposedMeeting />
                ) : publishedMeeting ? (
                  <PublishedMeeting />
                ) : Number(currentView) === 1 ? (
                  <>
                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        {rows.length > 0 ? (
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
                                  record.meetingAgenda.length > 0
                                    ? true
                                    : false,
                              }}
                            />
                          </>
                        ) : null}
                      </Col>
                    </Row>
                  </>
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
                            <Pagination
                              showSizeChanger
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
                              locale={{
                                items_per_page: t("items_per_page"),
                                page: t("page"),
                              }}
                              onChange={handelChangePagination}
                              total={totalRecords}
                              pageSizeOptions={["30", "50", "100", "200"]}
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
      {NewMeetingreducer.endForAllMeeting && <NewEndLeaveMeeting />}
      {NewMeetingreducer.endMeetingModal && <NewEndMeetingModal />}
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
