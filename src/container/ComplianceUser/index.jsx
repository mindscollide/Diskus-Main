import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./mainCompliance.module.css";
import { Switch } from "../../components/elements";
import CustomButton from "../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import FiscalYearCalendar_Icon from "../../assets/images/FiscalYearCalendar_Icon.svg";

const MainCompliance = () => {
  const { t } = useTranslation();
  return (
    <>
      <section className={styles["MainCompliance_Container"]}>
        <Row>
          <Col
            sm={12}
            md={6}
            lg={6}
            className='d-flex justify-content-start align-items-center'>
            <span className={styles["Compliance_dashboard_heading"]}>
              Compliance Dashboard
            </span>
          </Col>
          <Col
            sm={12}
            md={6}
            lg={6}
            className='d-flex justify-content-end align-items-center gap-2'>
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
            className='d-flex justify-content-start gap-2 align-items-center'>
            <CustomButton
              className={styles["DashboardBtn_active"]}
              text={t("Dashboard")}
            />
            <CustomButton
              className={styles["DashboardBtn"]}
              text={t("Compliances-by-me")}
            />
            <CustomButton
              className={styles["DashboardBtn"]}
              text={t("Compliances-for-me")}
            />
            <CustomButton
              className={styles["DashboardBtn"]}
              text={t("Reports")}
            />
          </Col>
          <Col
            sm={12}
            md={3}
            lg={3}
            className='d-flex justify-content-end gap-2 align-items-center'>
            <img src={FiscalYearCalendar_Icon} alt='' /> 
            <span className={styles["Fiscalyear_text"]}>Fiscal Year: 01 July -
            30 June</span>
          </Col>
        </Row>
      </section>
    </>
  );
};

export default MainCompliance;
