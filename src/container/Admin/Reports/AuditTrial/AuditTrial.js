import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import styles from "./AuditTrial.module.css";
import { useTranslation } from "react-i18next";
import { Button, Table } from "../../../../components/elements";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import ViewActionModal from "./ViewActionModal/ViewActionModal";
import {
  AuditTrialViewActionModal,
  GetAuditListingAPI,
} from "../../../../store/actions/Admin_Organization";
import { useNavigate } from "react-router-dom";

const AuditTrial = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Extracting the Audit listing Data

  useEffect(() => {
    try {
      if (
        GetAuditListingReducerGlobalState &&
        GetAuditListingReducerGlobalState !== null
      ) {
        setAuditTrialListingTableData(
          GetAuditListingReducerGlobalState.userAuditListingModel
        );
      }
    } catch (error) {
      console.log(error, "errorerrorerrorerror");
    }
  }, [GetAuditListingReducerGlobalState]);

  console.log(auditTrialListingTableData, "GetAuditListingReducerGlobalState");

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
              {record.dateLogin}
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
              {record.dateLogOut}
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
              onClick={handleViewActionModal}
            />
          </>
        );
      },
    },
  ];

  //handle View ActionModal

  const handleViewActionModal = () => {
    dispatch(AuditTrialViewActionModal(true));
  };

  return (
    <Container>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["AuditTrialHeading"]}>
            {t("Audit-trial")}
          </span>
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
                  scroll={{
                    x: false,
                  }}
                />
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
