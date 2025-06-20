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
import { AuditTrialDateTimeFunction } from "../../../../commen/functions/date_formater";
import { useScrollerAuditBottom } from "../../../../commen/functions/useScrollerAuditBottom";

const AuditTrial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const locale = localStorage.getItem("i18nextLng");
  //View Action Modal Globla State
  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  //View Action Modal Globla State

  //Calling Get Audit Listing
  const GetAuditListingReducerGlobalState = useSelector(
    (state) => state.adminReducer.getAuditListingData
  );

  // Local States
  const [auditTrialListingTableData, setAuditTrialListingTableData] = useState(
    []
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
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
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
        isScroll ? [...prev, ...newData] : newData
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
        console.log(record, "recordrecordrecord");
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
        console.log(record, "recordrecordrecord");
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
        console.log(record, "recordrecordrecord");
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
        console.log(record, "recordrecordrecord");
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
        console.log(record, "recordrecordrecord");
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

  //Handle Search Box entities
  const handeSearchBoxTextField = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log({ name, value }, "handleChangeSearchBoxValues");

    // Normalize the key to match state
    const key = name.charAt(0).toLowerCase() + name.slice(1);

    if (name === "UserName" || name === "Title") {
      if (value !== "") {
        console.log("saif");
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
        console.log("saif");
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

  //handle Login Date Change
  const handleChangeLoginDate = (date) => {
    let getDate = new Date(date);
    let utcDate = getDate.toISOString().slice(0, 10).replace(/-/g, "");
    setAuditTrialSearch({
      ...auditTrialSearch,
      LoginDate: utcDate,
      LoginDateView: getDate,
    });
  };

  //Handle Logout Date Change
  const handleChangeLogoutDate = (date) => {
    let getDate = new Date(date);
    let utcDate = getDate.toISOString().slice(0, 10).replace(/-/g, "");
    setAuditTrialSearch({
      ...auditTrialSearch,
      LogoutDate: utcDate,
      LogoutDateView: getDate,
    });
  };

  //Handle Search Popup Button
  const handleSearchAuditTrialListing = () => {
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
    } catch (error) {
      console.log(error, "errorerror");
    }
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
    } catch (error) {
      console.log(error, "errorerror");
    }
  };

  //handle  Pressed Enter TextField
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
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
    } catch (error) {
      console.log(error, "errorerror");
    }
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
                          onFocusedDateChange={handleChangeLoginDate}
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
                          onFocusedDateChange={handleChangeLogoutDate}
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
    </section>
  );
};

export default AuditTrial;
