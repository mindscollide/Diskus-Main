import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  ChatDotsFill,
  Search,
  ArrowRight,
  ChevronDown,
  ArrowLeft,
  Plus,
} from "react-bootstrap-icons";
import moment from "moment";
import EditIcon from "../../../assets/images/Edit-Icon.png";
import NoMeetingsIcon from "../../../assets/images/No-Meetings.png";
import CommentIcon from "../../../assets/images/Comment-Icon.png";
import IconAttachment from "../../../assets/images/Icon-Attachment.png";
import VideoIcon from "../../../assets/images/Video-Icon.png";
import UserImageInTable from "../../../assets/images/newElements/meetingtableuserIcon.png";
import { useLocation, useNavigate } from "react-router-dom";
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
} from "../.../../../../store/actions/GetMeetingUserId";
import {
  ViewMeeting,
  StartMeeting,
  EndMeeting,
  GetAllReminders,
  clearResponseMessage,
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
import { newDateFormaterAsPerUTC, newTimeFormaterAsPerUTC, newTimeFormaterAsPerUTCFullDate } from "../../../commen/functions/date_formater";

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
  //import meetingReducer and gettodolistreducer from reducers
  const { meetingIdReducer, assignees, minuteofMeetingReducer, uploadReducer } =
    state;
  const { allMeetingsSocketData, MeetingStatusSocket, AllMeetingIdData } =
    meetingIdReducer;
  const dispatch = useDispatch();
  const [searchData, setSearchData] = useState({
    Date: "",
    Title: "",
    HostName: "",
    UserID: 0,
  });
  useEffect(() => {
    let data = { UserID: JSON.parse(UserID), NumberOfRecords: 300 };
    dispatch(getMeetingUserId(data, t));
  }, []);
  useEffect(() => {
    let organzier = [];
    if (assignees !== null && assignees !== undefined) {
      assignees.user.map((data, index) => {
        return organzier.push({
          text: data.name,
          value: data.name,
        });
      });
      setTableFilterValue(organzier);
    }
  }, [assignees]);

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
        tableRowsData.unshift(allMeetingsSocketData);
        setRow(tableRowsData);
      }
    }
  }, [allMeetingsSocketData]);

  // for Socket Update meeting status update
  useEffect(() => {
    if (Object.keys(MeetingStatusSocket).length > 0) {
      console.log(MeetingStatusSocket, "MeetingStatusSocketMeetingStatusSocket")
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
        console.log("newArrnewArrnewArr", newArr);
        setRow(newArr);
      }
    }
  }, [MeetingStatusSocket]);

  useEffect(() => { }, [rows]);

  useEffect(() => {
    if (Object.keys(AllMeetingIdData).length > 0) {
      setRow(AllMeetingIdData);
    }
  }, [AllMeetingIdData]);

  // for modal create  handler
  const modalHandler = async (e) => {
    await setShow(true);
  };

  // for view modal  handler
  const viewModalHandler = async (id) => {
    let Data = { MeetingID: id };
    await dispatch(ViewMeeting(Data, t, setViewFlag, setModalsflag, 1));
    setViewFlag(true);
  };

  // for edit modal  handler
  const editModalHandler = async (id) => {
    let Data = { MeetingID: id };

    await dispatch(ViewMeeting(Data, t, setViewFlag, setModalsflag, 2));
    await dispatch(GetAllReminders());
    setModalsflag(true);
  };

  // colums for meatings table
  const startMeeting = (record) => {
    let meetingID = record.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(UserID),
    };
    dispatch(StartMeeting(Data, navigate, t));
  };

  const endMeeting = (record) => {
    let meetingID = record.pK_MDID;
    let Data = {
      MeetingID: meetingID,
      UserID: parseInt(UserID),
    };
    dispatch(EndMeeting(Data, t));
  };
  const checkForEdit = (record) => {
    try {
      return record.meetingAttendees.map((data) => {
        if (data.user.pK_UID === parseInt(UserID)) {
          if (data.meetingAttendeeRole.pK_MARID === 1) {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      });
    } catch (e) { }
  };

  const columns = [
    {
      title: t("Title"),
      dataIndex: "title",
      key: "title",
      width: "200px",
      align: "left",
      className: "titleClassMeeting",
      sorter: (a, b) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      render: (text, record) => (
        <i
          className="meeting-title"
          onClick={(e) => viewModalHandler(record.pK_MDID)}
        >
          {text}
        </i>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
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
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-meeting" />
      ),
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
        }
      },
    },
    {
      title: t("Organizer"),
      dataIndex: "host",
      key: "host",
      width: "10rem",
      filters: tableFilterValue,
      filterIcon: (filtered) => (
        <ChevronDown
          className={filtered ? "filter-chevron-icon-meeting" : null}
        />
      ),
    },
    {
      title: t("Date-or-time"),
      dataIndex: "dateOfMeeting",
      key: "dateOfMeeting",
      width: "13rem",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {

        if (record.meetingStartTime !== null && record.dateOfMeeting !== null) {
          console.log("newDateFormaterAsPerUTCnewDateFormaterAsPerUTC", newDateFormaterAsPerUTC(record.dateOfMeeting))
          console.log("newTimeFormaterAsPerUTCnewTimeFormaterAsPerUTC", newTimeFormaterAsPerUTC(record.meetingStartTime))
          return (
            newTimeFormaterAsPerUTCFullDate(record.dateOfMeeting + record.meetingStartTime));
        }
      },
      sorter: (a, b, sortOrder) => {
        if (a !== null && b !== null) {
          return moment(a.dateOfMeeting, "YYYYMMDD")
            .format("Do MMM, YYYY")
            .localeCompare(
              moment(b.dateOfMeeting, "YYYYMMDD").format("Do MMM, YYYY")
            );
        }
        if (a.dateOfMeeting) {
          return sortOrder === "ascend" ? 1 : -1;
        }
        if (b.dateOfMeeting) {
          return sortOrder === "ascend" ? -1 : 1;
        }
        return 0;
      },
    },
    {
      title: "",
      dataIndex: "attach",
      key: "attach",
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
      key: "status",
      width: "10rem",
      render: (text, record) => {
        console.log("recordrecord", text, record)
        let check = checkForEdit(record);
        console.log("recordrecord", check)
        const found = check !== null && check !== undefined ? check.find((element) => element === true) : undefined;
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
      key: "pK_MDID",
      width: "4rem",
      render: (text, record) => {
        let check = checkForEdit(record);
        const found = check !== null && check !== undefined ? check.find((element) => element === true) : undefined;
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

  useEffect(() => {
    if (Object.keys(assignees.ViewMeetingDetails).length > 0) {
      if (modalsflag === true) {
        setEditFlag(true);
        setModalsflag(false);
      } else {
        // setViewFlag(true);
      }
    } else {
      setViewFlag(false);
    }
  }, [assignees.ViewMeetingDetails]);

  useEffect(() => {
    if (
      meetingIdReducer.ResponseMessage != "" &&
      meetingIdReducer.ResponseMessage != t("Record-found")
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
      assignees.ResponseMessage != "" &&
      assignees.ResponseMessage != t("Record-found")
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

  useEffect(() => {
    if (
      minuteofMeetingReducer.AddMeetingofMinutesMessage != "" &&
      minuteofMeetingReducer.AddMeetingofMinutesMessage !=
      t("The-record-has-been-saved-successfully")
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
      t("The-record-has-been-saved-successfully")
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
      assignees.ResponseMessage != t("The-record-has-been-saved-successfully")
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
      uploadReducer.ResponseMessage != t("valid-data")
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
  const search = (e) => {
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
        UserID: parseInt(UserID),
      };
      dispatch(searchMeetingUserId(newData, t));
      setSearchData({
        ...searchData,
        Date: "",
        Title: "",
        HostName: "",
        UserID: parseInt(0),
      });
    } else {
      // make notification for if input fields is empty here
      dispatch(searchMeetingUserId(searchData, t));
      setSearchData({
        Date: "",
        Title: "",
        HostName: "",
        UserID: parseInt(0),
      });
    }
  };

  console.log("searchData.Date", searchData.Date);

  const tableChangeHandler = (pagination, organizerfilter) => {
    let newArray = [];
    let { status, host } = organizerfilter;
    if (status != null && status.length > 0 && host === null) {
      status.map((statusData, index) => {
        AllMeetingIdData.map((data, index) => {
          if (data.status === statusData) {
            newArray.push(data);
          }
        });
      });
    } else if (host != null && host.length > 1 && status === null) {
      host.map((hostData, index) => {
        AllMeetingIdData.map((data, index) => {
          if (hostData === data.host) {
            newArray.push(data);
          }
        });
      });
    } else if (
      host != null &&
      host.length > 0 &&
      status != null &&
      status.length > 0
    ) {
      let newData = [];
      status.map((statusData, index) => {
        AllMeetingIdData.map((data, index) => {
          if (data.status === statusData) {
            newData.push(data);
          }
        });
      });
      host.map((hostData, index) => {
        AllMeetingIdData.map((data, index) => {
          if (hostData === data.host) {
            newData.push(data);
          }
        });
      });
      newArray = newData;
    } else {
      newArray = AllMeetingIdData;
    }
    setRow(newArray);
  };

  return (
    <>
      <Container className="p-0">
        <Row className="d-flex justify-content-start align-items-center margin-bottom-15 mt-2">
          <Col lg={2} md={2} sm={4} xs={12} className="meeting-heading mt-1">
            {t("Meetings")}
          </Col>
          <Col
            lg={3}
            md={3}
            sm={4}
            xs={12}
            className="meeting-schedulenewmeeting-btn"
          >
            <Button
              className={"ScheduleAMeeting"}
              variant={"Primary"}
              // className={"Meeting-schedule-btn"}
              text={"+ " + t("Schedule-a-meeting")}
              onClick={modalHandler}
            />
          </Col>
          <Col
            md={7}
            lg={7}
            sm={12}
            xs={12}
            className="p-0 meeting-searchfileds"
          >
            <Search
              className="search-Icon toExpandSearch Meeting"
              onClick={ShowHide}
            />
            {isExpand && (
              <>
                {currentLanguage === "ar" ? (
                  <div className="expandableMenuSearch">
                    <Form onSubmit={search} className="d-flex">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                          className="meetingtablesearchDatePicker"
                          selected={searchData.Date}
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
                          className="meetingtablesearchDatePicker"
                          selected={searchData.Date}
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
                        text={<ArrowLeft />}
                      // onClick={search}
                      />
                    </Form>
                  </div>
                ) : (
                  <div className="expandableMenuSearch">
                    <Form onSubmit={search} className="d-flex ">
                      {currentLanguage === "ar" ? (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="ar"
                        />
                      ) : (
                        <CustomDatePicker
                          value={searchData.Date}
                          change={searchHandlerDate}
                          locale="en"
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
                      // onClick={search}
                      />
                    </Form>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
        <Row className="mx-1 meeting-table-row">
          <Col>
            {rows.length > 0 && rows !== undefined && rows !== null ? (
              <Table
                column={columns}
                className="hello"
                onChange={tableChangeHandler}
                rows={rows}
                pagination={{
                  pageSize: 50,
                  defaultPageSize: 50,
                  showSizeChanger: true,
                  pageSizeOptions: ["100 ", "150", "200"],
                }}
                // key={flag}
                labelTitle={t("Meetings")}
                expandable={{
                  expandedRowRender: (record) => {
                    return record.meetingAgenda.map((data) => (
                      <p className="meeting-expanded-row">
                        {data.objMeetingAgenda.title}
                      </p>
                    ));
                  },
                  rowExpandable: (record) => record.host !== "Test",
                }}
              />
            ) : (
              <Paper className="No-Meeting-Table">
                <ResultMessage
                  icon={
                    <img src={NoMeetingsIcon} className="nodata-table-icon" />
                  }
                  title={
                    meetingIdReducer.searchRecordFound === true
                      ? t("No-record-found")
                      : t("No-new-meetings")
                  }
                  subTitle={t("Anything-important-thats-needs-discussion")}
                />
                <Row>
                  <Col className="text-center">
                    <Button
                      className={"ScheduleAMeeting"}
                      variant={"Primary"}
                      // className={"Meeting-schedule-btn"}
                      text={"+ " + t("Schedule-a-meeting")}
                      onClick={modalHandler}
                    />
                  </Col>
                </Row>
              </Paper>
            )}
          </Col>
        </Row>
      </Container>
      {show ? (
        <ModalMeeting
          show={show}
          setShow={setShow}
          editFlag={editFlag}
          setEditFlag={setEditFlag}
        />
      ) : null}

      {viewFlag ? (
        <ModalView viewFlag={viewFlag} setViewFlag={setViewFlag} />
      ) : null}
      {editFlag ? (
        <ModalUpdate
          editFlag={editFlag}
          setEditFlag={setEditFlag}
          setModalsflag={setModalsflag}
        />
      ) : null}

      <Notification setOpen={setOpen} open={open.open} message={open.message} />

      {meetingIdReducer.Loading ? (
        <Loader />
      ) : assignees.Loading ? (
        <Loader />
      ) : uploadReducer.Loading ? (
        <Loader />
      ) : minuteofMeetingReducer.Loading ? (
        <Loader />
      ) : null}
    </>
  );
};

export default Meeting;
