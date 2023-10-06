import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ChatDotsFill,
  Search,
  ArrowRight,
  ChevronDown,
  ArrowLeft,
  Plus,
  ArrowCounterclockwise,
} from "react-bootstrap-icons";
import moment from "moment";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import IconAttachment from "../../../assets/images/Icon-Attachment.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import UserImageInTable from "../../../assets/images/newElements/meetingtableuserIcon.png";
import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./Meeting.css";

import {
  Table,
  Loader,
  ResultMessage,
  Paper,
  Button,
  Notification,
  TextField,
  CustomDatePicker,
} from "../../../components/elements";
import ModalMeeting from "../../modalmeeting/ModalMeeting";
import {
  getMeetingUserId,
  HideNotificationMeetings,
  searchMeetingUserId,
  searchUserMeeting,
} from "../.../../../../store/actions/GetMeetingUserId";
import {
  ViewMeeting,
  StartMeeting,
  EndMeeting,
  GetAllReminders,
  clearResponseMessage,
  allAssignessList,
} from "../.../../../../store/actions/Get_List_Of_Assignees";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import ModalView from "../../modalView/ModalView";
import ModalUpdate from "../../modalUpdate/ModalUpdate";
import { HideMinuteMeetingMessage } from "../../../store/actions/AddMinutesofMeeting_action";
import { uploadResponseEmpty } from "../../../store/actions/Upload_action";
import { registerLocale } from "react-datepicker";
// import * as ar from "date-fns/locale/ar/index.js";
// import * as en from "date-fns/locale/en-GB/index.js";
import { enGB, ar } from "date-fns/locale";
import {
  newTimeFormaterAsPerUTC,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";
import { Pagination, Select } from "antd";
const { Option } = Select;
const Meeting = () => {
  //For Localization
  const { t } = useTranslation();
  registerLocale("ar", ar);
  registerLocale("en", enGB);
  let currentLanguage = localStorage.getItem("i18nextLng");
  moment.locale(currentLanguage);
  const state = useSelector((state) => state);
  const [rows, setRow] = useState([]);
  const [tableFilterValue, setTableFilterValue] = useState([]);
  const [editFlag, setEditFlag] = useState(false);
  const [calendarViewModal, setCalendarViewModal] = useState(false);
  const [viewFlag, setViewFlag] = useState(false);
  const [modalsflag, setModalsflag] = useState(false);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const [isExpand, setExpand] = useState(false);
  const navigate = useNavigate();
  const UserID = localStorage.getItem("userID");
  const [show, setShow] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));

  //import meetingReducer and gettodolistreducer from reducers
  const {
    meetingIdReducer,
    assignees,
    minuteofMeetingReducer,
    uploadReducer,
    LanguageReducer,
  } = state;
  const {
    allMeetingsSocketData,
    MeetingStatusSocket,
    AllMeetingIdData,
    SearchMeetingData,
  } = meetingIdReducer;

  const dispatch = useDispatch();
  const [flag, setFlag] = useState(true);
  const [searchData, setSearchData] = useState({
    Date: "",
    Title: "",
    HostName: "",
    // UserID: 0,
  });
  useEffect(() => {
    if (meetingpageRow !== null && meetingPageCurrent !== null) {
      dispatch(searchUserMeeting(navigate, searchData, t));
      dispatch(allAssignessList(navigate, t));
    } else {
      localStorage.setItem("MeetingPageRows", 50);
      localStorage.setItem("MeetingPageCurrent", 1);
      dispatch(searchUserMeeting(navigate, searchData, t));
      dispatch(allAssignessList(navigate, t));
    }
    return () => {
      localStorage.removeItem("MeetingPageRows");
      localStorage.removeItem("MeetingPageCurrent");
    };
  }, []);

  useEffect(() => {
    let organzier = [];
    if (assignees.user !== null && assignees.user !== undefined) {
      assignees.user.map((data, index) => {
        return organzier.push({
          text: data.name,
          value: data.name,
        });
      });
      setTableFilterValue(organzier);
    }
  }, [assignees.user]);

  // for Socket Update meeting and edit meeting
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

  // for Socket Update meeting status update
  useEffect(() => {
    if (Object.keys(MeetingStatusSocket).length > 0) {
      let tableRowsData = [...rows];
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_MDID === MeetingStatusSocket.meetingID
      );
      if (foundIndex !== -1) {
        let newArr = tableRowsData.map((rowObj, index) => {
          if (index === foundIndex) {
            const newData = {
              ...rowObj,
              status: MeetingStatusSocket.meetingStatusID.toString(),
            };
            return newData;
          }
          return rowObj;
        });
        setRow(newArr);
      }
    }
  }, [MeetingStatusSocket]);

  useEffect(() => {
    if (
      assignees.SearchMeetingData !== null &&
      assignees.SearchMeetingData !== undefined
    ) {
      setTotalRecords(assignees.SearchMeetingData.totalRecords);
      if (
        assignees.SearchMeetingData.meetings !== null &&
        assignees.SearchMeetingData.meetings !== undefined &&
        assignees.SearchMeetingData.meetings.length > 0
      ) {
        let newRowData = [];
        assignees.SearchMeetingData.meetings.map((data, index) => {
          newRowData.push({
            dateOfMeeting: data.dateOfMeeting,
            host: data.host,
            isAttachment: data.isAttachment,
            isChat: data.isChat,
            isVideoCall: data.isVideoCall,
            meetingAgenda: data.meetingAgenda,
            meetingAttendees: data.meetingAttendees,
            meetingEndTime: data.meetingEndTime,
            meetingStartTime: data.meetingStartTime,
            meetingURL: data.meetingURL,
            orignalProfilePictureName: data.orignalProfilePictureName,
            pK_MDID: data.pK_MDID,
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
  }, [assignees.SearchMeetingData]);

  // for modal create  handler
  const modalHandler = async (e) => {
    await setShow(true);
  };

  // for view modal  handler
  const viewModalHandler = async (id) => {
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
    // setViewFlag(true);
  };

  // for edit modal  handler
  const editModalHandler = async (id) => {
    let Data = { MeetingID: id };

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
    // setModalsflag(true);
  };

  // colums for meatings table
  const startMeeting = (record) => {
    let meetingID = record.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(UserID),
    };

    dispatch(StartMeeting(navigate, Data, t, searchData));
  };

  const endMeeting = (record) => {
    let meetingID = record.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(UserID),
    };
    dispatch(EndMeeting(navigate, Data, t, searchData));
  };

  const checkForEdit = (record) => {
    try {
      return record.meetingAttendees.map((data) => {
        if (data.user.pK_UID === parseInt(UserID)) {
          if (
            data.meetingAttendeeRole.pK_MARID === 1 ||
            data.meetingAttendeeRole.pK_MARID === 3
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } catch (e) {}
  };

  const columns = [
    {
      title: t("Title"),
      dataIndex: "title",
      width: "200px",
      align: "left",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => (
        <span
          className="meeting-title"
          onClick={(e) => viewModalHandler(record.pK_MDID)}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => {
        return a?.title.toLowerCase().localeCompare(b?.title.toLowerCase());
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      align: "center",
      width: "10rem",
      filters: [
        {
          text: t("Upcoming"),
          value: "1",
        },
        {
          text: t("Start"),
          value: "2",
        },
        {
          text: t("End"),
          value: "3",
        },
        {
          text: t("Cancelled"),
          value: "4",
        },
        {
          text: t("Reschedule"),
          value: "5",
        },
        {
          text: t("Close"),
          value: "6",
        },
        {
          text: t("Delete"),
          value: "7",
        },
        {
          text: t("Not-conducted"),
          value: "8",
        },
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-meeting" />
      ),
      onFilter: (value, record) =>
        record.status.toLowerCase().includes(value.toLowerCase()),
      render: (text, record) => {
        if (text === "1") {
          return (
            <div className="activebtn  ">
              <span className="activebtnp">{t("Upcoming")}</span>
            </div>
          );
        } else if (text === "2") {
          return (
            <div className="activebtn active-start text-center ">
              <span className="activebtn">{t("Started")}</span>
            </div>
          );
        } else if (text === "3") {
          return (
            <div className="activebtn ">
              <span className="activebtnp">{t("End")}</span>
            </div>
          );
        } else if (text === "4") {
          return (
            <div className="activebtn ">
              <span className="activebtn">{t("Cancelled")}</span>
            </div>
          );
        } else if (text === "5") {
          return (
            <div className="activebtn ">
              <span className="activebtn">{t("Reschedule")}</span>
            </div>
          );
        } else if (text === "6") {
          return (
            <div className="activebtn ">
              <span className="activebtn">{t("Close")}</span>
            </div>
          );
        } else if (text === "7") {
          return (
            <div className="activebtn ">
              <span className="activebtn">{t("Delete")}</span>
            </div>
          );
        } else if (text === "8") {
          return (
            <div className="activebtn ">
              <span className="activebtn">{t("Not-conducted")}</span>
            </div>
          );
        }
      },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      width: "10rem",
      filters: tableFilterValue,
      onFilter: (value, record) =>
        record.host.toLowerCase().includes(value.toLowerCase()),
      filterIcon: (filtered) => (
        <ChevronDown
          className={filtered ? "filter-chevron-icon-meeting" : null}
        />
      ),
    },
    {
      title: t("Date-or-time"),
      dataIndex: "dateOfMeeting",
      width: "13rem",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          return newTimeFormaterAsPerUTCFullDate(
            record.dateOfMeeting + record.meetingStartTime
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
      title: "",
      dataIndex: "attach",
      width: "7rem",
      render: (text, record) => {
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
                  src={IconAttachment}
                  className="meeting-table-attachment-icon"
                  alt=""
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
                <img src={VideoIcon} className="" alt="" />
              </span>
            ) : (
              <span
                className={
                  currentLanguage === "ar"
                    ? "margin-left-10"
                    : "margin-right-10"
                }
              >
                <img src={UserImageInTable} />
              </span>
            )}
            {record.isChat ? (
              <span>
                <img src={CommentIcon} className="" alt="" />
                {/* <CameraVideo /> */}
              </span>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: "",
      dataIndex: "status",
      width: "10rem",
      render: (text, record) => {
        console.log("recordrecord", text, record);
        let check = checkForEdit(record);
        console.log("recordrecord", check);
        const found =
          check !== null && check !== undefined
            ? check.find((element) => element === true)
            : undefined;
        if (found !== undefined) {
          if (text === "1") {
            return (
              <Button
                text={t("Start-meeting")}
                size="small"
                // className="btn btn-primary meetingStart meeting-startbutton-width"
                className={"start-meeting-btn"}
                onClick={() => startMeeting(record)}
              >
                {t("Start-meeting")}
              </Button>
            );
          } else if (text === "2") {
            return (
              <Button
                text={t("End-meeting")}
                size="small"
                // className="btn btn-danger meetingEnd"
                className={"End-meeting-btn"}
                onClick={() => endMeeting(record)}
              ></Button>
            );
          } else {
            return "";
          }
        }
      },
    },
    {
      title: "",
      dataIndex: "pK_MDID",
      width: "4rem",
      render: (text, record) => {
        let check = checkForEdit(record);
        const found =
          check !== null && check !== undefined
            ? check.find((element) => element === true)
            : undefined;
        if (found !== undefined && record.status !== "4") {
          return (
            <i
              className="meeting-editbutton"
              onClick={(e) => editModalHandler(text)}
            >
              <img src={EditIcon} alt="" />
            </i>
          );
        } else {
          return "";
        }
      },
    },
  ];

  // useEffect(() => {
  //   if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
  //     if (modalsflag === true) {
  //       setEditFlag(true);
  //       setModalsflag(false);
  //     } else {
  //       // setViewFlag(true);
  //     }
  //   } else {
  //     setViewFlag(false);
  //   }
  // }, [assignees.ViewMeetingDetails]);

  useEffect(() => {
    if (
      meetingIdReducer.ResponseMessage !== "" &&
      meetingIdReducer.ResponseMessage !== t("Record-found") &&
      meetingIdReducer.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: meetingIdReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(HideNotificationMeetings());
    } else if (
      assignees.ResponseMessage !== "" &&
      assignees.ResponseMessage !== t("Record-found") &&
      assignees.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: assignees.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(clearResponseMessage());
    } else {
      console.log("ResponseMessage Meeting");
      dispatch(HideNotificationMeetings());
      dispatch(clearResponseMessage());
    }
  }, [meetingIdReducer.ResponseMessage, assignees.ResponseMessage]);
  console.log(
    meetingIdReducer.ResponseMessage,
    "ResponseMessageResponseMessageResponseMessage"
  );
  console.log(
    assignees.ResponseMessage,
    "ResponseMessageResponseMessageResponseMessage"
  );
  useEffect(() => {
    if (
      minuteofMeetingReducer.AddMeetingofMinutesMessage != "" &&
      minuteofMeetingReducer.AddMeetingofMinutesMessage !=
        t("The-record-has-been-saved-successfully") &&
      minuteofMeetingReducer.AddMeetingofMinutesMessage !==
        t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: minuteofMeetingReducer.AddMeetingofMinutesMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(HideMinuteMeetingMessage());
    } else if (
      minuteofMeetingReducer.UpdateMeetingofMinutesMessage != "" &&
      minuteofMeetingReducer.UpdateMeetingofMinutesMessage !=
        t("The-record-has-been-saved-successfully") &&
      minuteofMeetingReducer.UpdateMeetingofMinutesMessage !==
        t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: minuteofMeetingReducer.UpdateMeetingofMinutesMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(HideMinuteMeetingMessage());
    } else if (
      minuteofMeetingReducer.ResponseMessage != "" &&
      assignees.ResponseMessage !=
        t("The-record-has-been-saved-successfully") &&
      minuteofMeetingReducer.ResponseMessage !== t("No-records-found") &&
      assignees.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: minuteofMeetingReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(HideMinuteMeetingMessage());
    } else {
      console.log("ResponseMessage Meeting");
      dispatch(HideMinuteMeetingMessage());
    }
  }, [
    minuteofMeetingReducer.AddMeetingofMinutesMessage,
    minuteofMeetingReducer.ResponseMessage,
    minuteofMeetingReducer.UpdateMeetingofMinutesMessage,
  ]);

  useEffect(() => {
    if (
      uploadReducer.ResponseMessage != "" &&
      uploadReducer.ResponseMessage != t("valid-data") &&
      uploadReducer.ResponseMessage !== t("No-records-found")
    ) {
      setOpen({
        ...open,
        open: true,
        message: uploadReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          open: false,
          message: "",
        });
      }, 3000);

      dispatch(uploadResponseEmpty());
    } else {
      console.log("ResponseMessage uploadReducer");
      dispatch(uploadResponseEmpty());
    }
  }, [uploadReducer.ResponseMessage]);

  const ShowHide = () => {
    setExpand(!isExpand);
    setSearchData({
      Date: "",
      Title: "",
      HostName: "",
      UserID: parseInt(0),
    });
  };

  // for search Date handler
  const searchHandlerDate = (e) => {
    setSearchData({
      ...searchData,
      Date: e.target.value,
      UserID: parseInt(UserID),
    });
  };

  // for search handler
  const searchHandler = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "Title") {
      setSearchData({
        ...searchData,
        [name]: value.trimStart(),
        UserID: parseInt(UserID),
      });
    } else if (name === "HostName") {
      setSearchData({
        ...searchData,
        [name]: value.trimStart(),
        UserID: parseInt(UserID),
      });
    }
  };

  // for search
  const search = async (e) => {
    e.preventDefault();

    if (
      searchData.Date === "" &&
      searchData.Title === "" &&
      searchData.HostName === ""
    ) {
      let newData = {
        Date: "",
        Title: "",
        HostName: "",
      };
      await localStorage.setItem("MeetingPageCurrent", 1);
      dispatch(searchUserMeeting(navigate, newData, t));
      // setSearchData({
      //   ...searchData,
      //   Date: "",
      //   Title: "",
      //   HostName: "",
      //   UserID: parseInt(0),
      // });
    } else {
      let newData = {
        Date: searchData.Date,
        Title: searchData.Title,
        HostName: searchData.HostName,
      };
      await localStorage.setItem("MeetingPageCurrent", 1);
      dispatch(searchUserMeeting(navigate, newData, t));
      console.log(newData, "newDatanewDatanewData");
      // make notification for if input fields is empty here
      // dispatch(searchMeetingUserId(navigate, searchData, t));
      // setSearchData({
      //   Date: "",
      //   Title: "",
      //   HostName: "",
      //   UserID: parseInt(0),
      // });
    }
  };

  // const tableChangeHandler = (pagination, organizerfilter) => {
  //   let newArray = [];
  //   let { status, host } = organizerfilter;
  //   if (status != null && status.length > 0 && host === null) {
  //     status.map((statusData, index) => {
  //       AllMeetingIdData.map((data, index) => {
  //         if (data.status === statusData) {
  //           newArray.push(data);
  //         }
  //       });
  //     });
  //   } else if (host != null && host.length > 1 && status === null) {
  //     host.map((hostData, index) => {
  //       AllMeetingIdData.map((data, index) => {
  //         if (hostData === data.host) {
  //           newArray.push(data);
  //         }
  //       });
  //     });
  //   } else if (
  //     host != null &&
  //     host.length > 0 &&
  //     status != null &&
  //     status.length > 0
  //   ) {
  //     let newData = [];
  //     status.map((statusData, index) => {
  //       AllMeetingIdData.map((data, index) => {
  //         if (data.status === statusData) {
  //           newData.push(data);
  //         }
  //       });
  //     });
  //     host.map((hostData, index) => {
  //       AllMeetingIdData.map((data, index) => {
  //         if (hostData === data.host) {
  //           newData.push(data);
  //         }
  //       });
  //     });
  //     newArray = newData;
  //   } else {
  //     newArray = AllMeetingIdData;
  //   }
  //   setRow(newArray);
  // };

  const paginationChangeHandlerMeeting = (current, pageSize) => {
    localStorage.setItem("MeetingPageRows", pageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    let newData = {
      Date: searchData.Date,
      Title: searchData.Title,
      HostName: searchData.HostName,
    };
    dispatch(searchUserMeeting(navigate, newData, t));
  };

  const resetSearchBar = async (e) => {
    e.preventDefault();
    let newData = {
      Date: "",
      Title: "",
      HostName: "",
    };
    await localStorage.setItem("MeetingPageCurrent", 1);
    dispatch(searchUserMeeting(navigate, newData, t));
    setSearchData({
      ...searchData,
      Date: "",
      HostName: "",
      Title: "",
    });
  };

  const handleNavigationToAdnvanceMeeting = () => {
    navigate("/DisKus/Meeting2");
  };

  return (
    <>
      <div className="meeting_container">
        <Row className="d-flex justify-content-around align-items-center margin-bottom-15 ">
          <Col lg={2} md={2} sm={2} className="meeting-heading mt-1">
            {t("Meetings")}
          </Col>
          <Col lg={2} md={2} sm={12} className="meeting-schedulenewmeeting-btn">
            <Button
              className={"ScheduleAMeeting"}
              variant={"Primary"}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              // className={"Meeting-schedule-btn"}
              text={t("Quick-meeting")}
              onClick={modalHandler}
            />
          </Col>
          <Col
            md={6}
            lg={6}
            sm={6}
            // xs={12}
            className="meeting-fields p-0 "
          >
            <Search
              className="search-Icon toExpandSearch Meeting"
              onClick={ShowHide}
            />
            {isExpand && (
              <>
                {currentLanguage === "ar" ? (
                  <div className="expandableMenuSearch_Meeting">
                    <Form className="d-flex">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                          className="meetingtablesearchDatePicker"
                          selected={searchData.Date}
                          flag={flag}
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
                          className="meetingtablesearchDatePicker"
                          selected={searchData.Date}
                          flag={flag}
                        />
                      )}
                      <TextField
                        applyClass="form-control2"
                        width="250px"
                        className=" mx-2"
                        placeholder={t("Title-name")}
                        labelClass="textFieldSearch"
                        name="Title"
                        value={searchData.Title}
                        change={searchHandler}
                      />
                      <TextField
                        applyClass="form-control2"
                        width="120px"
                        className="mx-2"
                        placeholder={t("Host-name")}
                        labelClass="textFieldSearch"
                        name="HostName"
                        value={searchData.HostName}
                        change={searchHandler}
                      />

                      <Button
                        className="btn  btn-primary meeting search"
                        variant={"Primary"}
                        text={<ArrowLeft />}
                        onClick={search}
                      />
                      <Button
                        className="btn  btn-primary meeting search"
                        variant={"Primary"}
                        type="reset"
                        text={<ArrowCounterclockwise />}
                        onClick={resetSearchBar}
                      />
                    </Form>
                  </div>
                ) : (
                  <div className="expandableMenuSearch_Meeting">
                    <Form className="d-flex gap-2 ">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                          flag={flag}
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
                          flag={flag}
                        />
                      )}

                      <TextField
                        applyClass="form-control2"
                        width="250px"
                        className="mx-2"
                        placeholder={t("Title-name")}
                        labelClass="textFieldSearch"
                        name="Title"
                        value={searchData.Title}
                        change={searchHandler}
                      />
                      <TextField
                        applyClass="form-control2"
                        width="120px"
                        className="mx-2"
                        placeholder={t("Host-name")}
                        labelClass="textFieldSearch"
                        name="HostName"
                        value={searchData.HostName}
                        change={searchHandler}
                      />
                      <Button
                        className="btn btn-primary meeting search"
                        variant={"Primary"}
                        text={<ArrowRight />}
                        onClick={search}
                      />
                      <Button
                        className="btn btn-primary  meeting search"
                        variant={"Primary"}
                        text={<ArrowCounterclockwise />}
                        onClick={resetSearchBar}
                      />
                    </Form>
                  </div>
                )}
              </>
            )}
          </Col>
          <Col
            lg={2}
            md={2}
            sm={2}
            className="d-flex justify-content-center  p-0 m-0 align-items-center"
          >
            <Button
              text={t("Advance-meeting")}
              className={"ScheduleAMeeting"}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              variant={"Primary"}
              onClick={handleNavigationToAdnvanceMeeting}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            {rows.length > 0 && rows !== undefined && rows !== null ? (
              <>
                <Row className="mx-1 meeting-table-row">
                  <Col lg={12} md={12} sm={12}>
                    <Table
                      column={columns}
                      className="hello"
                      // onChange={tableChangeHandler}
                      rows={rows}
                      scroll={{ y: "50vh" }}
                      pagination={false}
                      // key={flag}
                      labelTitle={t("Meetings")}
                      expandable={{
                        rowExpandable: (record) => true,
                        expandedRowRender: (record) => {
                          return (
                            <p className="meeting-expanded-row">
                              {
                                record?.meetingAgenda[0]?.objMeetingAgenda
                                  ?.title
                              }
                            </p>
                          );
                        },
                      }}
                    />
                  </Col>
                </Row>
              </>
            ) : (
              <>
                <Row>
                  <Col lg={4} md={4} sm={4}></Col>
                  <Col lg={4} md={4} sm={4} className="Empty_State_styles">
                    <ResultMessage
                      icon={
                        <img
                          src={NoMeetingsIcon}
                          className="nodata-table-icon"
                          alt=""
                        />
                      }
                      title={
                        meetingIdReducer.searchRecordFound === true
                          ? t("No-records-found")
                          : t("No-new-meetings")
                      }
                      subTitle={t("Anything-important-thats-needs-discussion")}
                    />
                    <Row>
                      <Col className="d-flex justify-content-center">
                        <Button
                          className={"ScheduleAMeeting"}
                          variant={"Primary"}
                          // className={"Meeting-schedule-btn"}
                          text={"+ " + t("Schedule-a-meeting")}
                          onClick={modalHandler}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} md={4} sm={4}></Col>
                </Row>
              </>
            )}
          </Col>
        </Row>
        {rows.length > 0 && (
          <Row className="mb-3">
            <Col
              className="pagination-groups-table d-flex justify-content-center"
              sm={12}
              md={12}
              lg={12}
            >
              <Pagination
                className="PaginationStyle-Meeting"
                onChange={paginationChangeHandlerMeeting}
                current={
                  meetingPageCurrent !== null &&
                  meetingPageCurrent !== undefined
                    ? meetingPageCurrent
                    : 1
                }
                pageSize={
                  meetingpageRow !== null && meetingpageRow !== undefined
                    ? meetingpageRow
                    : 50
                }
                showSizeChanger
                locale={{
                  items_per_page: t("items_per_page"),
                  page: t("page"),
                }}
                pageSizeOptions={["30", "50", "100", "200"]}
                total={totalRecords}
              />
            </Col>
          </Row>
        )}
      </div>
      {show ? <ModalMeeting show={show} setShow={setShow} /> : null}

      {viewFlag ? (
        <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      ) : null}
      {editFlag ? (
        <ModalUpdate editFlag={editFlag} setEditFlag={setEditFlag} />
      ) : null}

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {meetingIdReducer.Loading ||
      assignees.Loading ||
      uploadReducer.Loading ||
      minuteofMeetingReducer.Loading ||
      LanguageReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default Meeting;
