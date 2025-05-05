import React, { useEffect } from "react";
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
  const ViewActionModalGlobalState = useSelector(
    (state) => state.adminReducer.auditTrialViewActionModal
  );

  //Calling Get Audit Listing

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

  // columns Audit Trial
  const AuditTrialColumns = [
    {
      title: t("User"),
      dataIndex: "User",
      key: "User",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("IP"),
      dataIndex: "IP",
      key: "IP",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("Interface"),
      dataIndex: "Interface",
      key: "Interface",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("Login"),
      dataIndex: "Login",
      key: "Login",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("Action"),
      dataIndex: "Action",
      key: "Action",
      align: "center",
      ellipsis: true,
    },

    {
      title: t("Logout"),
      dataIndex: "Logout",
      key: "Logout",
      align: "center",
      ellipsis: true,
    },
    {
      title: t("View-Action"),
      dataIndex: "viewAction",
      key: "viewAction",
      align: "center",
      ellipsis: true,
    },
  ];

  //handle View ActionModal

  const handleViewActionModal = () => {
    dispatch(AuditTrialViewActionModal(true));
  };

  //Dummy Data source

  const auditTrialData = [
    {
      key: "1",
      User: "John Doe",
      IP: "192.168.0.1",
      Interface: "Web",
      Login: "2025-05-05 09:15:00",
      Action: "Viewed Report",
      Logout: "2025-05-05 09:45:00",
      viewAction: (
        <>
          <Button
            text={t("View-Action")}
            className={styles["ViewActions"]}
            onClick={handleViewActionModal}
          />
        </>
      ),
    },
  ];

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
                  rows={auditTrialData}
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
