import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./AuditTrial.module.css";
import { useTranslation } from "react-i18next";
import { Button, Table, TextField } from "../../../../components/elements";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import CrossIcon from "../../../../assets/images/Cross-Chat-Icon.png";
import Select from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";
//import Crossicon from "../../../assets/images/WhiteCrossIcon.svg";
import ViewActionModal from "./ViewActionModal/ViewActionModal";
import searchicon from "../../../../assets/images/searchicon.svg";
import {
  AuditTrialViewActionModal,
  GetAuditActionsAPI,
  GetAuditListingAPI,
} from "../../../../store/actions/Admin_Organization";
import { useNavigate } from "react-router-dom";
import { AuditTrialDateTimeFunction } from "../../../../commen/functions/date_formater";
import { Spin } from "antd";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";

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

  useEffect(() => {
    try {
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        sRow: 0,
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
    } catch (error) {
      console.log(error, "errorerrorerror");
    }
  }, []);

  console.log(auditTrialListingTableData, "GetAuditListingReducerGlobalState");

  // Extracting the Audit listing Data
  useEffect(() => {
    try {
      if (GetAuditListingReducerGlobalState !== null) {
        if (
          GetAuditListingReducerGlobalState.userAuditListingModel?.length > 0 &&
          GetAuditListingReducerGlobalState.totalCount > 0
        ) {
          if (isScroll) {
            setIsScroll(false);

            let copyData = [...auditTrialListingTableData];

            GetAuditListingReducerGlobalState.userAuditListingModel.forEach(
              (data, index) => {
                copyData.push(data);
              }
            );
            setAuditTrialListingTableData(copyData);
            setSRowsData(
              (prev) =>
                prev +
                GetAuditListingReducerGlobalState.userAuditListingModel.length
            );
            setTotalRecords(GetAuditListingReducerGlobalState.totalCount);
          } else {
            setAuditTrialListingTableData(
              GetAuditListingReducerGlobalState.userAuditListingModel
            );
            setTotalRecords(GetAuditListingReducerGlobalState.totalCount);
            setSRowsData(
              GetAuditListingReducerGlobalState.userAuditListingModel.length
            );
          }
        } else {
          setAuditTrialListingTableData([]);
          setTotalRecords(0);
          setSRowsData(0);
        }
      }
    } catch {}
  }, [GetAuditListingReducerGlobalState]);

  //handle View ActionModal
  const handleViewActionModal = (UserRoleID) => {
    let Data = { UserLoginHistoryID: Number(UserRoleID) };
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
        const deviceType = record.deviceID === "1" ? "Web" : "Tablet";
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
              onClick={() => handleViewActionModal(record.userLoginHistoryID)}
            />
          </>
        );
      },
    },
  ];

  //Handle Scroll Function
  const handleScroll = async (e) => {
    if (isRowsData <= totalRecords) {
      setIsScroll(true);
      let Data = {
        Username: "",
        IpAddress: "",
        DeviceID: "",
        DateLogin: "",
        DateLogOut: "",
        sRow: Number(isRowsData),
        Length: 10,
      };
      dispatch(GetAuditListingAPI(navigate, Data, t));
    } else {
      setIsScroll(false);
    }
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={7} md={7} sm={7}>
          <span className={styles["AuditTrialHeading"]}>
            {t("Audit-trial")}
          </span>
        </Col>
        <Col lg={5} md={5} sm={5}>
          <section className={styles["report_search_Box"]}>
            <TextField
              applyClass={"user-login-history-searchbar"}
              labelclass={"d-none"}
              width={"100%"}
              iconclassname={"d-block"}
              placeholder={`${t("Search")}...`}
              name={"Title"}
              inputicon={
                <img
                  draggable="false"
                  src={searchicon}
                  alt=""
                  className={styles["searchbox_icon_userhistoryLogin"]}
                />
              }
            />
          </section>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["AuditTrial_Box"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <InfiniteScroll
                  dataLength={auditTrialListingTableData.length}
                  next={handleScroll}
                  height={"60vh"}
                  hasMore={
                    auditTrialListingTableData.length === totalRecords
                      ? false
                      : true
                  }
                  loader={
                    isRowsData <= totalRecords && isScroll ? (
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
                >
                  <Table
                    column={AuditTrialColumns}
                    rows={auditTrialListingTableData}
                    pagination={false}
                    footer={false}
                    className={"userlogin_history_tableP"}
                    size={"small"}
                    scroll={{
                      x: false,
                    }}
                  />
                </InfiniteScroll>
              </Col>
            </Row>
          </span>
        </Col>
      </Row>
      {ViewActionModalGlobalState && <ViewActionModal />}
    </Container>
  );
};

export default AuditTrial;
