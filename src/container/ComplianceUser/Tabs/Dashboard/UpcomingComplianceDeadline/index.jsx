import React from "react";
import styles from "./upcomingComplianceDeadline.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
const UpcomingComplianceDeadline = () => {
  const GetUpcomingDealineComplianceDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetUpcomingDealineComplianceDashboard,
  );

  console.log(
    GetUpcomingDealineComplianceDashboard,
    "GetUpcomingDealineComplianceDashboard",
  );
  return (
    <div className={styles.upcomingComplianceCard}>
      <Row>
        <Col xs={12}>
          <h2 className={styles.cardHeading}>Upcoming Compliance Deadlines</h2>
        </Col>
      </Row>

      <Row>
        <Col xs={12} className={styles.deadlineRow}>
          <span className={styles.checkUpcomingCenter}>
            <span className={styles.boldNumber}>
              {GetUpcomingDealineComplianceDashboard?.dueThisQuarter}
            </span>{" "}
            <span className={styles.normalText}>Due this quarter</span>
          </span>

          <span className={styles.checkUpcomingCenter}>
            <span className={styles.boldNumber}>
              {GetUpcomingDealineComplianceDashboard?.dueThisWeek}
            </span>{" "}
            <span className={styles.normalText}>Due this Week</span>
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default UpcomingComplianceDeadline;
