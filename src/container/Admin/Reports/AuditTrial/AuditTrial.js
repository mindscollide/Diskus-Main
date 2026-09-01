import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./AuditTrial.module.css";
import { useTranslation } from "react-i18next";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { Button, Table, TextField } from "../../../../components/elements";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import InputIcon from "react-multi-date-picker/components/input_icon";
import DatePicker from "react-multi-date-picker";
import ViewActionModal from "./ViewActionModal/ViewActionModal";
import searchicon from "../../../../assets/images/searchicon.svg";
import CrossIcon from "../../../../assets/images/BlackCrossIconModals.svg";
import {
  GetAuditActionsAPI,
  GetAuditListingAPI,
} from "../../../../store/actions/Admin_Organization";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import {
  AuditTrialDateTimeFunction,
  createConvert,
} from "../../../../commen/functions/date_formater";
import { useScrollerAuditBottom } from "../../../../commen/functions/useScrollerAuditBottom";
import useSnackbar from "../../../../components/elements/snack_bar/useSnackbar";

const AuditTrial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locale = localStorage.getItem("i18nextLng");
  const [show, SnackBar] = useSnackbar();

  //View Action Modal Globla State
  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal,
  );

  //View Action Modal Globla State

  //Calling Get Audit Listing
  const GetAuditListingReducerGlobalState = useSelector(
    (state) => state.adminReducer.getAuditListingData,
  );

  // Local States
  const [auditTrialListingTableData, setAuditTrialListingTableData] = useState(
    [],
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [isScroll, setIsScroll] = useState(false);
  const [isRowsData, setSRowsData] = useState(0);
  const [searchBar, setSearchBar] = useState(false);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [enterPressedSearch, setEnterPressedSearch] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true); // ✅ true initially

  const [viewActionModalDataState, setViewActionModalDataState] = useState([]);
  const [auditTrialSearch, setAuditTrialSearch] = useState({
    title: "",
    userName: "",
    IpAddress: "",
    LoginDate: "",
    LoginDateView: "",
    LogoutDate: "",
    LogoutDateView: "",
    LogoutTime: "",
    LogoutTimeView: "",
    LoginTime: "",
    LoginTimeView: "",
    Interface: {
      value: 0,
      label: "",
    },
  });

  //Calling Get Audit Listing API
  useEffect(() => {
    try {
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        OrganizationID: Number(localStorage.getItem("organizationID")),
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
    } catch (error) {}
    return () => {
      setAuditTrialSearch({
        userName: "",
        IpAddress: "",
        LoginDate: "",
        LoginDateView: "",
        LogoutDate: "",
        LogoutDateView: "",
        LogoutTime: "",
        LogoutTimeView: "",
        LoginTime: "",
        LoginTimeView: "",
        Interface: {
          value: 0,
          label: "",
        },
      });
    };
  }, []);

  // Extracting the Audit listing Data
  useEffect(() => {
    const result = GetAuditListingReducerGlobalState;

    if (
      result &&
      Array.isArray(result.userAuditListingModel) &&
      result.userAuditListingModel.length > 0 &&
      result.totalCount > 0
    ) {
      const newData = result.userAuditListingModel;

      setAuditTrialListingTableData((prev) =>
        isScroll ? [...prev, ...newData] : newData,
      );

      const newTotalRows =
        (isScroll ? auditTrialListingTableData.length : 0) + newData.length;

      setSRowsData(newTotalRows);
      setTotalRecords(result.totalCount);
      setIsScroll(false);

      if (newTotalRows >= result.totalCount) {
        setHasMoreData(false); // ✅ end reached
      } else {
        setHasMoreData(true); // ✅ still has more
      }
    } else {
      if (!isScroll) {
        setAuditTrialListingTableData([]);
        setSRowsData(0);
        setTotalRecords(0);
      }
      setHasMoreData(false); // ✅ No data
    }
  }, [GetAuditListingReducerGlobalState]);

  //Handling the Arabic
  useEffect(() => {
    if (locale !== null && locale !== undefined) {
      if (locale === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (locale === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [locale]);

  //handle View ActionModal
  const handleViewActionModal = (record) => {
    setViewActionModalDataState(record);
    let Data = { UserLoginHistoryID: Number(record.userLoginHistoryID) };
    dispatch(GetAuditActionsAPI(navigate, Data, t));
  };

  // columns Audit Trial
  const AuditTrialColumns = [
    {
      title: t("User"),
      dataIndex: "userName",
      key: "userName",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>{record.userName}</span>
          </>
        );
      },
    },

    {
      title: t("IP"),
      dataIndex: "loggedInFromIP",
      key: "loggedInFromIP",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>
              {record.loggedInFromIP}
            </span>
          </>
        );
      },
    },

    {
      title: t("Interface"),
      dataIndex: "deviceID",
      key: "deviceID",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        const deviceType =
          record.deviceID === "1"
            ? "Web"
            : record.deviceID === "2"
              ? "Mobile"
              : "Tablet";
        return <span className={styles["NameStylesTable"]}>{deviceType}</span>;
      },
    },

    {
      title: t("Login"),
      dataIndex: "dateLogin",
      key: "dateLogin",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>
              {AuditTrialDateTimeFunction(record.dateLogin, locale)}
            </span>
          </>
        );
      },
    },

    {
      title: t("Action"),
      dataIndex: "Action",
      key: "Action",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>
              {record.actionCount} Actions taken
            </span>
          </>
        );
      },
    },

    {
      title: t("Logout"),
      dataIndex: "dateLogOut",
      key: "dateLogOut",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <span className={styles["NameStylesTable"]}>
              {AuditTrialDateTimeFunction(record.dateLogOut, locale)}
            </span>
          </>
        );
      },
    },
    {
      title: t("View-Action"),
      dataIndex: "viewAction",
      key: "viewAction",
      align: "center",
      ellipsis: true,
      render: (text, record) => {
        return (
          <>
            <Button
              text={t("View-Action")}
              className={styles["ViewActions"]}
              onClick={() => handleViewActionModal(record)}
            />
          </>
        );
      },
    },
  ];

  //Handle Search icon
  const handleSearchIcon = () => {
    setSearchBar(!searchBar);
  };

  //Validation IP
  const validateIPInput = (value) => {
    const ipRegex = /^(\d{1,3}\.){0,3}\d{0,3}$/;
    return ipRegex.test(value);
  };

  //Devices
  const DeviceIdType = [
    {
      label: "Browser",
      value: 1,
    },
    {
      label: "Mobile",
      value: 2,
    },
    {
      label: "Tablet",
      value: 3,
    },
  ];

  // Helper function to convert date string to Date object for min/max props
  const getDateFromString = (dateStr) => {
    if (!dateStr) return null;
    try {
      const year = parseInt(dateStr.substring(0, 4));
      const month = parseInt(dateStr.substring(4, 6)) - 1;
      const day = parseInt(dateStr.substring(6, 8));
      return new Date(year, month, day);
    } catch {
      return null;
    }
  };

  // CRITICAL FIX: Get adjusted date for min/max props
  const getAdjustedDate = (dateStr, type) => {
    if (!dateStr) return null;

    const date = getDateFromString(dateStr);
    if (!date) return null;

    // For maxDate (Login Date), we want to allow the selected Logout date
    // So we add 1 day to include the selected date
    if (type === "max") {
      date.setDate(date.getDate() - 1);
    }
    // For minDate (Logout Date), we want to allow the selected Login date
    // So we subtract 1 day to include the selected date
    else if (type === "min") {
      date.setDate(date.getDate() + 1);
    }

    return date;
  };

  //Handle Search Box entities
  const handeSearchBoxTextField = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    // Normalize the key to match state
    const key = name.charAt(0).toLowerCase() + name.slice(1);

    if (name === "UserName" || name === "Title") {
      if (value !== "") {
        let valueCheck = /^[A-Za-z\s]*$/i.test(value);
        if (valueCheck) {
          setAuditTrialSearch((prevState) => ({
            ...prevState,
            [key]: value.trim(),
          }));
        } else {
          setAuditTrialSearch((prevState) => ({
            ...prevState,
            userName: "",
            title: "",
          }));
        }
      } else {
        setAuditTrialSearch((prevState) => ({
          ...prevState,
          userName: "",
          title: "",
        }));
      }
    }

    if (name === "IPAddress") {
      if (value !== "") {
        if (validateIPInput(value)) {
          setAuditTrialSearch((prevState) => ({
            ...prevState,
            IpAddress: value.trim(),
          }));
        }
      } else {
        setAuditTrialSearch((prevState) => ({
          ...prevState,
          IpAddress: "",
        }));
      }
    }
  };

  //Handle Change React Select logout Time
  const handleChangeInterface = (event) => {
    setAuditTrialSearch({
      ...auditTrialSearch,
      Interface: {
        label: event.label,
        value: event.value,
      },
    });
  };

  //handle Login Date Change with validation
  const handleChangeLoginDate = (date) => {
    if (!date) {
      setAuditTrialSearch({
        ...auditTrialSearch,
        LoginDate: "",
        LoginDateView: "",
      });
      return;
    }

    const getDate = new Date(date);
    const updateDate = new Date(getDate);
    updateDate.setHours(0, 0, 0, 0);

    // Validate: LoginDate should be less than LogoutDate
    // if (auditTrialSearch.LogoutDate && utcDate > auditTrialSearch.LogoutDate) {
    //   show(t("Login-date-cannot-be-greater-than-logout-date"), "error");
    //   return;
    // }

    setAuditTrialSearch({
      ...auditTrialSearch,
      LoginDate: createConvert(getDate),
      LoginDateView: getDate,
    });
  };

  //Handle Logout Date Change with validation
  const handleChangeLogoutDate = (date) => {
    if (!date) {
      setAuditTrialSearch({
        ...auditTrialSearch,
        LogoutDate: "",
        LogoutDateView: "",
      });
      return;
    }

    const getDate = new Date(date);
    const updateDate = new Date(getDate);
    updateDate.setHours(23, 59, 59, 999);

    // Validate: LogoutDate should be greater than LoginDate
    // if (auditTrialSearch.LoginDate && utcDate < auditTrialSearch.LoginDate) {
    //   show(t("Logout-date-cannot-be-less-than-login-date"), "error");
    //   return;
    // }

    setAuditTrialSearch({
      ...auditTrialSearch,
      LogoutDate: createConvert(getDate),
      LogoutDateView: getDate,
    });
  };

  //Handle Search Popup Button
  const handleSearchAuditTrialListing = () => {
    // Validate date range before searching
    if (auditTrialSearch.LoginDate && auditTrialSearch.LogoutDate) {
      if (auditTrialSearch.LoginDate > auditTrialSearch.LogoutDate) {
        show(t("Login-date-cannot-be-greater-than-logout-date"), "error");
        return;
      }
    }

    let Data2 = {
      Username: auditTrialSearch.userName || "",
      IpAddress: auditTrialSearch.IpAddress || "",
      DeviceID: auditTrialSearch.Interface?.value
        ? String(auditTrialSearch.Interface.value)
        : "",
      DateLogin: auditTrialSearch.LoginDate || "",
      DateLogOut: auditTrialSearch.LogoutDate || "",
      OrganizationID: Number(localStorage.getItem("organizationID")),
      sRow: 0,
      Length: 10,
    };
    dispatch(GetAuditListingAPI(navigate, Data2, t));
    setSearchBar(false);
  };

  //Handle Reset Button
  const handleResetButton = () => {
    try {
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        OrganizationID: Number(localStorage.getItem("organizationID")),
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
      setSearchBar(false);
      setEnterPressedSearch(false);
      setAuditTrialSearch({
        ...auditTrialSearch,
        userName: "",
        IpAddress: "",
        LoginDate: "",
        LoginDateView: "",
        LogoutDate: "",
        LogoutDateView: "",
        LogoutTime: "",
        LogoutTimeView: "",
        LoginTime: "",
        LoginTimeView: "",
        Interface: {
          value: 0,
          label: "",
        },
      });
    } catch (error) {}
  };

  //handle Cross Icon Pressed Enter
  const handlePressedEnterSearch = () => {
    try {
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        OrganizationID: Number(localStorage.getItem("organizationID")),
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
      setSearchBar(false);
      setEnterPressedSearch(false);
      setAuditTrialSearch({
        ...auditTrialSearch,
        title: "",
        userName: "",
        IpAddress: "",
        LoginDate: "",
        LoginDateView: "",
        LogoutDate: "",
        LogoutDateView: "",
        LogoutTime: "",
        LogoutTimeView: "",
        LoginTime: "",
        LoginTimeView: "",
        Interface: {
          value: 0,
          label: "",
        },
      });
    } catch (error) {}
  };

  //handle  Pressed Enter TextField
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Validate date range before searching
      if (auditTrialSearch.LoginDate && auditTrialSearch.LogoutDate) {
        if (auditTrialSearch.LoginDate > auditTrialSearch.LogoutDate) {
          show(t("Login-date-cannot-be-greater-than-logout-date"), "error");
          return;
        }
      }

      let Data = {
        Username: auditTrialSearch.title,
        IpAddress: auditTrialSearch.IpAddress,
        DeviceID: auditTrialSearch.Interface?.value
          ? String(auditTrialSearch.Interface.value)
          : "",
        DateLogin: auditTrialSearch.LoginDate,
        DateLogOut: auditTrialSearch.LogoutDate,
        OrganizationID: Number(localStorage.getItem("organizationID")),
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
      setEnterPressedSearch(true);
    }
  };

  //Search bar cross icon
  const handleCrossIcon = () => {
    try {
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        OrganizationID: Number(localStorage.getItem("organizationID")),
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
      setSearchBar(false);
      setEnterPressedSearch(false);
      setAuditTrialSearch({
        ...auditTrialSearch,
        userName: "",
        IpAddress: "",
        LoginDate: "",
        LoginDateView: "",
        LogoutDate: "",
        LogoutDateView: "",
        LogoutTime: "",
        LogoutTimeView: "",
        LoginTime: "",
        LoginTimeView: "",
        Interface: {
          value: 0,
          label: "",
        },
      });
    } catch (error) {}
  };

  //Handle Scroll Function
  useScrollerAuditBottom(async () => {
    if (!hasMoreData) return; // ✅ Now this works correctly

    setIsScroll(true);

    const Data = {
      Username: auditTrialSearch.userName || auditTrialSearch.title || "",
      IpAddress: auditTrialSearch.IpAddress || "",
      DeviceID: auditTrialSearch.Interface?.value
        ? String(auditTrialSearch.Interface.value)
        : "",
      DateLogin: auditTrialSearch.LoginDate || "",
      DateLogOut: auditTrialSearch.LogoutDate || "",
      OrganizationID: Number(localStorage.getItem("organizationID")),
      sRow: Number(isRowsData),
      Length: 10,
    };

    await dispatch(GetAuditListingAPI(navigate, Data, t));
  }, 50);

  return (
    <section className={styles["AuditMainSection"]}>
      <Row className="mt-5">
        <Col lg={8} md={8} sm={8}>
          <span className={styles["AuditTrialHeading"]}>
            {t("Audit-trial")}
          </span>
        </Col>
        <Col lg={4} md={4} sm={4}>
          <section className={styles["report_search_Box"]}>
            <TextField
              applyClass={"user-login-history-searchbar"}
              labelclass={"d-none"}
              width={"100%"}
              iconclassname={"d-block"}
              value={auditTrialSearch.title}
              onKeyDown={handleKeyDown}
              change={handeSearchBoxTextField}
              placeholder={`${t("Search")}...`}
              name={"Title"}
              inputicon={
                <img
                  draggable="false"
                  src={searchicon}
                  alt=""
                  className={styles["searchbox_icon_userhistoryLogin"]}
                  onClick={handleSearchIcon}
                />
              }
            />
            {enterPressedSearch && (
              <img
                src={CrossIcon}
                className={styles["SearchFieldCrossIcon"]}
                onClick={handlePressedEnterSearch}
                alt=""
              />
            )}
            {searchBar && (
              <>
                <span className={styles["SearchBoxAuditTrial"]}>
                  <Row className="mt-2">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-end align-items-center"
                    >
                      <img
                        src={CrossIcon}
                        className="cursor-pointer"
                        alt=""
                        onClick={handleCrossIcon}
                      />
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6}>
                      <div className="d-flex flex-column flex-wrap">
                        <span className={styles["SearchBoxEntities"]}>
                          {t("User")}
                        </span>
                        <TextField
                          labelclass={"d-none"}
                          width={"100%"}
                          value={auditTrialSearch.userName}
                          iconclassname={"d-block"}
                          placeholder={`${t("UserName")}...`}
                          name={"UserName"}
                          change={handeSearchBoxTextField}
                        />
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <div className="d-flex flex-column flex-wrap">
                        <span className={styles["SearchBoxEntities"]}>
                          {t("IP")}
                        </span>
                        <TextField
                          labelclass={"d-none"}
                          width={"100%"}
                          value={auditTrialSearch.IpAddress}
                          iconclassname={"d-block"}
                          placeholder={`${t("IP")}`}
                          name={"IPAddress"}
                          change={handeSearchBoxTextField}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6}>
                      <div className="d-flex flex-column flex-wrap">
                        <span className={styles["SearchBoxEntities"]}>
                          {t("Login-date")}
                        </span>

                        <DatePicker
                          format={"DD/MM/YYYY"}
                          placeholder={t("Login-date")}
                          value={auditTrialSearch.LoginDateView}
                          render={
                            <InputIcon
                              placeholder={t("Date-from")}
                              className={styles["UserLoginHistory_datePicker"]}
                            />
                          }
                          editable={false}
                          className="datePickerTodoCreate2"
                          onOpenPickNewDate={true}
                          containerClassName={styles["datePicker_Container"]}
                          inputMode=""
                          calendar={calendarValue}
                          locale={localValue}
                          onChange={handleChangeLoginDate}
                          // FIX: Login Date - Disable dates AFTER Logout Date (including Logout Date)
                          // We add 1 day to Logout Date so that Logout Date is also disabled
                          maxDate={
                            auditTrialSearch.LogoutDate
                              ? getAdjustedDate(
                                  auditTrialSearch.LogoutDate,
                                  "max",
                                )
                              : undefined
                          }
                        />
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <div className="d-flex flex-column flex-wrap">
                        <span className={styles["SearchBoxEntities"]}>
                          {t("Logout-date")}
                        </span>

                        <DatePicker
                          format={"DD/MM/YYYY"}
                          placeholder={t("Logout-date")}
                          value={auditTrialSearch.LogoutDateView}
                          render={
                            <InputIcon
                              placeholder={t("Logout-date")}
                              className={styles["UserLoginHistory_datePicker"]}
                            />
                          }
                          editable={false}
                          className="datePickerTodoCreate2"
                          onOpenPickNewDate={true}
                          containerClassName={styles["datePicker_Container"]}
                          inputMode=""
                          calendar={calendarValue}
                          locale={localValue}
                          onChange={handleChangeLogoutDate}
                          // FIX: Logout Date - Disable dates BEFORE Login Date (including Login Date)
                          // We subtract 1 day from Login Date so that Login Date is also disabled
                          minDate={
                            auditTrialSearch.LoginDate
                              ? getAdjustedDate(
                                  auditTrialSearch.LoginDate,
                                  "min",
                                )
                              : undefined
                          }
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-2">
                    <Col lg={6} md={6} sm={6}></Col>
                  </Row>
                  <Row className="mt-3">
                    <Col lg={6} md={6} sm={6}>
                      <div className="d-flex flex-column flex-wrap">
                        <span className={styles["SearchBoxEntities"]}>
                          {t("Interface")}
                        </span>
                        <Select
                          placeholder={t("Interface")}
                          options={DeviceIdType}
                          onChange={handleChangeInterface}
                        />
                      </div>
                    </Col>
                    <Col lg={6} md={6} sm={6}></Col>
                  </Row>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-end gap-2 align-items-center"
                    >
                      <Button
                        text={t("Reset")}
                        className={styles["ResetBtn"]}
                        onClick={handleResetButton}
                      />
                      <Button
                        text={t("Search")}
                        className={styles["SearchBtn"]}
                        onClick={handleSearchAuditTrialListing}
                      />
                    </Col>
                  </Row>
                </span>
              </>
            )}
          </section>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["AuditTrial_Box"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={AuditTrialColumns}
                  rows={auditTrialListingTableData}
                  pagination={false}
                  footer={false}
                  className={"userlogin_history_tableP"}
                  size={"small"}
                  scroll={{ y: "49vh", x: "100%" }}
                />
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
      {ViewActionModalGlobalState && (
        <ViewActionModal viewActionModalDataState={viewActionModalDataState} />
      )}
      {SnackBar}
    </section>
  );
};

export default AuditTrial;
