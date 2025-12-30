import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./mainCompliance.module.css";
import { Button, Switch } from "../../components/elements";
import CustomButton from "../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import FiscalYearCalendar_Icon from "../../assets/images/FiscalYearCalendar_Icon.svg";
import ComplianceDashboard from "./Tabs/Dashboard";
import ComplianceByMe from "./Tabs/ComplainceByMe";

const MainCompliance = () => {
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(1);
  return (
    <>
      <section className={styles["MainCompliance_Container"]}>
        <Row>
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex justify-content-start align-items-center mb-2"
          >
            <span className={styles["Compliance_dashboard_heading"]}>
              {tabs === 2 ? t("Compliances-by-me") : "Compliance Dashboard"}
            </span>
            {tabs === 2 && (
              <Button
                text={t("Create-compliance")}
                className={styles["createComplianceButton"]}
                // onClick={handleAddAuthority}
              />
            )}
          </Col>
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex justify-content-end align-items-center gap-2"
          >
            <span className={styles["SwitchUserView_Text"]}>
              Switch to User View
            </span>{" "}
            <Switch />
          </Col>
        </Row>
        <Row>
          <Col
            sm={12}
            md={9}
            lg={9}
            className="d-flex justify-content-start flex-wrap gap-2 align-items-center"
          >
            <CustomButton
              className={
                tabs === 1
                  ? styles["DashboardBtn_active"]
                  : styles["DashboardBtn"]
              }
              text={t("Dashboard")}
              onClick={() => setTabs(1)}
            />
            <CustomButton
              className={
                tabs === 2
                  ? styles["DashboardBtn_active"]
                  : styles["DashboardBtn"]
              }
              onClick={() => setTabs(2)}
              text={t("Compliances-by-me")}
            />
            <CustomButton
              className={
                tabs === 3
                  ? styles["DashboardBtn_active"]
                  : styles["DashboardBtn"]
              }
              onClick={() => setTabs(3)}
              text={t("Compliances-for-me")}
            />
            <CustomButton
              className={
                tabs === 4
                  ? styles["DashboardBtn_active"]
                  : styles["DashboardBtn"]
              }
              onClick={() => setTabs(4)}
              text={t("Reports")}
            />
          </Col>
          <Col
            sm={12}
            md={3}
            lg={3}
            className="d-flex justify-content-end gap-2 align-items-center"
          >
            <img src={FiscalYearCalendar_Icon} alt="" />
            <span className={styles["Fiscalyear_text"]}>
              Fiscal Year: 01 July - 30 June
            </span>
          </Col>
        </Row>
        {tabs === 1 && <ComplianceDashboard />}
        {tabs === 2 && <ComplianceByMe />}
      </section>
    </>
  );
};

export default MainCompliance;
