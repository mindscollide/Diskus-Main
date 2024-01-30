import React, { Fragment, useEffect, useState } from "react";
import styles from "./Reports.module.css";
import { Col, Container, Row } from "react-bootstrap";
import { Paper, Table, TextField } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userLoginHistory_Api } from "../../../store/actions/UserReport_actions";
import { useSelector } from "react-redux";
const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const UserLoginHistoryData = useSelector(
    (state) => state.UserReportReducer.userLoginHistoryData
  );
  const [loginHistoyRows, setLoginHistoryRows] = useState([]);
  console.log(
    UserLoginHistoryData,
    "UserLoginHistoryDataUserLoginHistoryDataUserLoginHistoryData"
  );
  useEffect(() => {
    let Data = {
      OrganizationID: 415,
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
  }, []);

  useEffect(() => {
    try {
      if (UserLoginHistoryData !== null) {
        if (
          UserLoginHistoryData.userLoginHistoryModel?.length > 0 &&
          UserLoginHistoryData.totalCount > 0
        ) {
          setLoginHistoryRows(UserLoginHistoryData.userLoginHistoryModel);
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
  return (
    <Fragment>
      <Container>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={4} lg={4}>
            <h2 className={styles["user-login-history-heading"]}>
              {t("User-login-history")}
            </h2>
          </Col>
          <Col
            sm={12}
            md={8}
            lg={8}
            className="d-flex justify-content-end align-items-center"
          >
            <span className={styles["export-to-excel-btn"]}>
              {t("Export-to-excel")}
            </span>
            <span>
              <TextField
                applyClass={"user-login-history-searchbar"}
                labelClass={"d-none"}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Paper className={styles["user-login-history-table-paper"]}>
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
          </Paper>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Reports;
