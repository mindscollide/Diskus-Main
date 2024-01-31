import React, { Fragment, useEffect, useState } from "react";
import styles from "./Reports.module.css";
import { Col, Container, Row } from "react-bootstrap";
import {
  Button,
  Notification,
  Paper,
  Table,
  TextField,
} from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoginHistory_Api } from "../../../store/actions/UserReport_actions";
import { useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import { Spin } from "antd";
import PDFIcon from "../../../assets/images/AttachmentIcons/pdf.svg";
import searchicon from "../../../assets/images/searchicon.svg";
// Cross-Chat-Icon
import CrossIcon from "../../../assets/images/Cross-Chat-Icon.png";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Select from "react-select";
import { validateIP } from "../../../commen/functions/regex";
import {
  validateEmail,
  validateEmailEnglishAndArabicFormat,
  validationEmail,
} from "../../../commen/functions/validations";

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserLoginHistoryData = useSelector(
    (state) => state.UserReportReducer.userLoginHistoryData
  );
  const [loginHistoyRows, setLoginHistoryRows] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isRowsData, setSRowsData] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const [searchBoxExpand, setSearchBoxExpand] = useState(false);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  let OrganizationID = localStorage.getItem("organizationID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [searchText, setSearchText] = useState([]);
  const [notificationMessage, setNotificationMessage] = useState({
    show: false,
    message: "",
  });
  const [isEmailValid, SetIsEmailValid] = useState(false);
  const [isIpAddressValid, setIsIpAddressValid] = useState(false);
  const [userLoginHistorySearch, setUserLoginHistorySearch] = useState({
    userName: "",
    userEmail: "",
    DateFrom: "",
    DateForView: "",
    DateTo: "",
    DateToView: "",
    IpAddress: "",
    InterFaceType: {
      value: 0,
      label: "",
    },
    Title: "",
  });

  console.log(
    { userLoginHistorySearch },
    "userLoginHistorySearchuserLoginHistorySearch"
  );
  const DeviceIdType = [
    {
      label: "Browser",
      value: 1,
    },
    {
      label: "Tablet",
      value: 2,
    },
    ,
    {
      label: "Mobile",
      value: 3,
    },
  ];

  useEffect(() => {
    let Data = {
      OrganizationID: Number(OrganizationID),
      Username: "",
      UserEmail: "",
      IpAddress: "",
      DeviceID: "",
      DateLogin: "",
      DateLogOut: "",
      sRow: 0,
      Length: 10,
    };
    dispatch(userLoginHistory_Api(navigate, t, Data));
    return () => {
      setIsScroll(false);
      setTotalRecords(0);
      setSRowsData(0);
      setLoginHistoryRows([]);
    };
  }, []);

  useEffect(() => {
    if (currentLanguage !== null && currentLanguage !== undefined) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  useEffect(() => {
    try {
      if (UserLoginHistoryData !== null) {
        if (
          UserLoginHistoryData.userLoginHistoryModel?.length > 0 &&
          UserLoginHistoryData.totalCount > 0
        ) {
          // if (isScroll) {
          //   let copyData = [...loginHistoyRows];

          //   UserLoginHistoryData.userLoginHistoryModel.forEach(
          //     (data, index) => {
          //       copyData.push(data);
          //     }
          //   );
          //   setLoginHistoryRows(copyData);
          //   setSRowsData(
          //     (prev) => prev + UserLoginHistoryData.userLoginHistoryModel.length
          //   );
          //   setTotalRecords(UserLoginHistoryData.totalCount);
          //   setIsScroll(false);
          // } else {
          setLoginHistoryRows(UserLoginHistoryData.userLoginHistoryModel);
          setTotalRecords(UserLoginHistoryData.totalCount);
          setSRowsData(UserLoginHistoryData.userLoginHistoryModel.length);
          // }
        } else {
          setLoginHistoryRows([]);
          setTotalRecords(0);
          setSRowsData(0);
        }
      }
    } catch {}
  }, [UserLoginHistoryData]);
  const userloginColumns = [
    {
      title: t("User-name"),
      dataIndex: "userName",
      key: "userName",
      align: "left",
      ellipsis: true,
      width: 300,
    },
    {
      title: t("User-email"),
      dataIndex: "emailAddress",
      key: "emailAddress",
      align: "center",
      ellipsis: true,
      width: 200,
    },
    {
      title: t("Login-date-time"),
      dataIndex: "dateLogin",
      key: "dateLogin",
      align: "center",
      width: 200,
    },
    {
      title: t("Logout-date-time"),
      dataIndex: "dateLogOut",
      key: "dateLogOut",
      align: "center",
      width: 150,
    },
    {
      title: t("Session-duration"),
      dataIndex: "decision",
      key: "decision",
      align: "center",
      width: 150,
    },
    {
      title: t("Interface"),
      dataIndex: "deviceID",
      align: "center",
      key: "deviceID",
      width: 100,

      render: (text, data) => (
        <span className={styles["voterCountStyle"]}>{text}</span>
      ),
    },
    {
      title: t("Ip-address"),
      dataIndex: "Result",
      align: "center",
      key: "Result",
      width: 100,
    },
  ];

  const handleScroll = async (e) => {
    if (isRowsData <= totalRecords) {
      setIsScroll(true);
      let Data = {
        OrganizationID: Number(OrganizationID),
        Username: "",
        UserEmail: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        sRow: Number(isRowsData),
        Length: 10,
      };
      dispatch(userLoginHistory_Api(navigate, t, Data));
    } else {
      setIsScroll(false);
    }
  };

  const handleChangeSearchBoxValues = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log({ name, value }, "handleChangeSearchBoxValues");

    // For userName or Title, ensure only letters and whitespace are allowed
    if (name === "userName" || name === "Title") {
      if (value !== "") {
        let valueCheck = /^[A-Za-z\s]*$/i.test(value);
        if (valueCheck) {
          setUserLoginHistorySearch((prevState) => ({
            ...prevState,
            [name]: value.trim(),
          }));
        }
      } else {
        setUserLoginHistorySearch((prevState) => ({
          ...prevState,
          userName: "",
          Title: "",
        }));
      }
    } else if (name === "userEmail") {
      setUserLoginHistorySearch((prevState) => ({
        ...prevState,
        userEmail: value.trim(),
      }));
    }

    // For IpAddress, validate the input and update the state accordingly
    if (name === "IpAddress") {
      if (value !== "") {
        if (validateIPInput(value)) {
          setUserLoginHistorySearch((prevState) => ({
            ...prevState,
            IpAddress: value.trim(),
          }));
          setIsIpAddressValid(true);
        } else {
          setIsIpAddressValid(false);
        }
      } else {
        setUserLoginHistorySearch((prevState) => ({
          ...prevState,
          IpAddress: "",
        }));
        setIsIpAddressValid(true);
      }
    }
  };

  const validateIPInput = (value) => {
    const ipRegex = /^(\d{1,3}\.){0,3}\d{0,3}$/;
    return ipRegex.test(value);
  };

  const handleChangeFromDate = (date) => {
    let getDate = new Date(date);
    let utcDate = getDate.toISOString().slice(0, 10).replace(/-/g, "");
    setUserLoginHistorySearch({
      ...userLoginHistorySearch,
      DateFrom: utcDate,
      DateForView: getDate,
    });
  };

  const handleChangeToDate = (date) => {
    let getDate = new Date(date);
    let utcDate = getDate.toISOString().slice(0, 10).replace(/-/g, "");
    setUserLoginHistorySearch({
      ...userLoginHistorySearch,
      DateTo: utcDate,
      DateToView: getDate,
    });
  };

  const handleChangeInterfaceType = (event) => {
    setUserLoginHistorySearch({
      ...userLoginHistorySearch,
      InterFaceType: {
        label: event.label,
        value: event.value,
      },
    });
  };

  const handleSearh = () => {
    try {
      if (
        userLoginHistorySearch.userName !== "" ||
        userLoginHistorySearch.Title !== "" ||
        userLoginHistorySearch.userEmail !== "" ||
        userLoginHistorySearch.IpAddress !== "" ||
        userLoginHistorySearch.InterFaceType.value !== 0 ||
        userLoginHistorySearch.DateFrom !== "" ||
        userLoginHistorySearch.DateTo !== "" ||
        validateEmailEnglishAndArabicFormat(userLoginHistorySearch.userEmail)
      ) {
        let Data = {
          OrganizationID: Number(OrganizationID),
          Username: userLoginHistorySearch.userName,
          UserEmail: userLoginHistorySearch.userEmail,
          IpAddress: userLoginHistorySearch.IpAddress,
          DeviceID:
            userLoginHistorySearch.InterFaceType.value === 0
              ? ""
              : userLoginHistorySearch.InterFaceType.value,
          DateLogin: userLoginHistorySearch.DateFrom,
          DateLogOut: userLoginHistorySearch.DateTo,
          sRow: 0,
          Length: 10,
        };
        dispatch(userLoginHistory_Api(navigate, t, Data));
      } else {
      }
    } catch {}
  };
  const handleReset = () => {
    let Data = {
      OrganizationID: Number(OrganizationID),
      Username: "",
      UserEmail: "",
      IpAddress: "",
      DeviceID: "",
      DateLogin: "",
      DateLogOut: "",
      sRow: 0,
      Length: 10,
    };
    dispatch(userLoginHistory_Api(navigate, t, Data));
    setUserLoginHistorySearch({
      ...userLoginHistorySearch,
      userName: "",
      userEmail: "",
      DateFrom: "",
      DateForView: "",
      DateTo: "",
      DateToView: "",
      IpAddress: "",
      InterFaceType: {
        value: 0,
        label: "",
      },
      Title: "",
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      let Data = {
        OrganizationID: Number(OrganizationID),
        Username: userLoginHistorySearch.Title,
        UserEmail: userLoginHistorySearch.userEmail,
        IpAddress: userLoginHistorySearch.IpAddress,
        DeviceID:
          userLoginHistorySearch.InterFaceType.value === 0
            ? ""
            : userLoginHistorySearch.InterFaceType.value,
        DateLogin: userLoginHistorySearch.DateFrom,
        DateLogOut: userLoginHistorySearch.DateTo,
        sRow: 0,
        Length: 10,
      };
      dispatch(userLoginHistory_Api(navigate, t, Data));
      setSearchText([...searchText, userLoginHistorySearch.Title]);
    }
  };

  const handleCloseSearcbBox = () => {
    // setUserLoginHistorySearch({
    //   ...userLoginHistorySearch,
    //   userName: "",
    //   userEmail: "",
    //   DateFrom: "",
    //   DateForView: "",
    //   DateTo: "",
    //   DateToView: "",
    //   IpAddress: "",
    //   InterFaceType: {
    //     value: 0,
    //     label: "",
    //   },
    //   Title: "",
    // });
    setSearchBoxExpand(false);
  };

  const handleValidateEmail = () => {
    if (
      !validateEmailEnglishAndArabicFormat(userLoginHistorySearch.userEmail)
    ) {
      setNotificationMessage({
        ...notificationMessage,
        message: t("Email-is-not-valid"),
        show: true,
      });
    } else {
      // alert("Email format is valid");
    }
  };

  return (
    <Fragment>
      <Container>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={4} lg={4}>
            <h2 className={styles["user-login-history-heading"]}>
              {t("User-login-history")}
            </h2>
          </Col>
          <Col sm={12} md={8} lg={8}>
            <Row>
              <Col
                sm={12}
                md={4}
                lg={4}
                className="d-flex justify-content-end align-items-center"
              >
                <span className={styles["export-to-excel-btn"]}>
                  <img src={PDFIcon} alt="" /> {t("Export-to-excel")}
                </span>
              </Col>
              <Col sm={12} md={8} lg={8}>
                <section className={styles["report_search_Box"]}>
                  <TextField
                    applyClass={"user-login-history-searchbar"}
                    labelClass={"d-none"}
                    width={"100%"}
                    iconClassName={"d-block"}
                    placeholder={`${t("Title")}...`}
                    onKeyDown={handleKeyDown}
                    name={"Title"}
                    change={handleChangeSearchBoxValues}
                    value={userLoginHistorySearch.Title}
                    inputicon={
                      <img
                        draggable="false"
                        src={searchicon}
                        alt=""
                        className={styles["searchbox_icon_userhistoryLogin"]}
                        onClick={() => setSearchBoxExpand(!searchBoxExpand)}
                      />
                    }
                  />
                  {searchBoxExpand && (
                    <section className={styles["userLoginHistory_Box"]}>
                      <Row>
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-end"
                        >
                          <img
                            src={CrossIcon}
                            width={14}
                            height={14}
                            className="cursor-pointer"
                            onClick={handleCloseSearcbBox}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12} md={6} lg={6}>
                          <TextField
                            placeholder={t("User-name")}
                            name={"userName"}
                            type="text"
                            value={userLoginHistorySearch.userName}
                            change={handleChangeSearchBoxValues}
                          />
                        </Col>
                        <Col sm={12} md={6} lg={6}>
                          <TextField
                            placeholder={t("User-email")}
                            name={"userEmail"}
                            type="email"
                            onBlur={() => handleValidateEmail()}
                            change={handleChangeSearchBoxValues}
                            value={userLoginHistorySearch.userEmail}
                          />
                        </Col>
                      </Row>
                      <Row className="my-3">
                        <Col sm={12} md={6} lg={6}>
                          {/* <TextField /> */}
                          <DatePicker
                            format={"DD/MM/YYYY"}
                            placeholder={t("Date-From")}
                            value={userLoginHistorySearch.DateForView}
                            render={
                              <InputIcon
                                placeholder={t("Date-from")}
                                className={
                                  styles["UserLoginHistory_datePicker"]
                                }
                              />
                            }
                            editable={false}
                            className="datePickerTodoCreate2"
                            onOpenPickNewDate={true}
                            containerClassName={styles["datePicker_Container"]}
                            inputMode=""
                            // name="decision"
                            // value={decisionDateTime.dateValue}
                            calendar={calendarValue}
                            locale={localValue}
                            onChange={handleChangeFromDate}
                          />
                        </Col>
                        <Col sm={12} md={6} lg={6}>
                          {/* <TextField /> */}
                          <DatePicker
                            format={"DD/MM/YYYY"}
                            placeholder={t("Date-to")}
                            value={userLoginHistorySearch.DateToView}
                            render={
                              <InputIcon
                                placeholder={t("Date-to")}
                                className={
                                  styles["UserLoginHistory_datePicker"]
                                }
                              />
                            }
                            editable={false}
                            className="datePickerTodoCreate2"
                            onOpenPickNewDate={true}
                            containerClassName={styles["datePicker_Container"]}
                            inputMode=""
                            // name="decision"
                            // value={decisionDateTime.dateValue}
                            calendar={calendarValue}
                            locale={localValue}
                            onChange={handleChangeToDate}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col sm={12} md={6} lg={6}>
                          <TextField
                            change={handleChangeSearchBoxValues}
                            name={"IpAddress"}
                            placeholder={t("Ip-address")}
                            labelClass={"d-none"}
                            value={userLoginHistorySearch.IpAddress}
                          />
                        </Col>
                        <Col sm={12} md={6} lg={6}>
                          {/* <TextField labelClass={"d-none"} /> */}
                          <Select
                            placeholder={t("Inteface-type")}
                            options={DeviceIdType}
                            onChange={handleChangeInterfaceType}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          sm={12}
                          md={12}
                          lg={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          <Button
                            className={styles["ResetBtn"]}
                            text={t("Reset")}
                            onClick={handleReset}
                          />
                          <Button
                            className={styles["SearchBtn"]}
                            text={t("Search")}
                            onClick={handleSearh}
                          />
                        </Col>
                      </Row>
                    </section>
                  )}
                  {/* {userLoginHistorySearch.userName !== "" &&
                    userLoginHistorySearch.userName} */}
                </section>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Paper className={styles["user-login-history-table-paper"]}>
            {/* <InfiniteScroll
              dataLength={loginHistoyRows.length}
              next={handleScroll}
              hasMore={loginHistoyRows.length === totalRecords ? false : true}
              loader={
                isRowsData <= totalRecords ? (
                  <>
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className="d-flex justify-content-center mt-2"
                      >
                        <Spin />
                      </Col>
                    </Row>
                  </>
                ) : null
              }
              scrollableTarget="scrollableDiv"
            > */}
            <Table
              column={userloginColumns}
              rows={loginHistoyRows}
              pagination={false}
              footer={false}
              className={"userlogin_history_tableP"}
              size={"small"}
              scroll={{
                x: false,
                y: "50vh",
              }}
            />
            {/* </InfiniteScroll> */}
          </Paper>
        </Row>
      </Container>
      <Notification
        message={notificationMessage.message}
        open={notificationMessage.show}
        setOpen={setNotificationMessage}
      />
    </Fragment>
  );
};

export default Reports;
