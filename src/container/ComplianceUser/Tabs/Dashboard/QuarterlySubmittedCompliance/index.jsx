import React from "react";
import styles from "./quarterlySubmittedCompliance.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { Progress } from "antd";
import { Col, Row } from "react-bootstrap";

const QuarterlySubmittedCompliance = () => {
  const GetQuarterlySubmittedDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetQuarterlySubmittedDashboard,
  );

  return (
    <>
      <div className={styles.quarterlySubmittedCard}>
        <Row className={styles.fullHeightRow}>
          <Col xs={8}>
            <h2 className={styles.cardHeading}>
              Quarterly Submitted Compliances
            </h2>
          </Col>

          <Col
            xs={4}
            className={`d-flex justify-content-center align-items-center`}
          >
            <Progress
              type="circle"
              percent={GetQuarterlySubmittedDashboard?.completionPercentage}
              strokeWidth={10}
              width={140}
              strokeColor="#6172D6"
              trailColor="#E1E1E1"
              format={(percent) => (
                <>
                  <div className={styles.quarterlyPercentageClass}>
                    {percent}%
                  </div>
                  <div className={styles.quarterlyCompletedClass}>
                    Completed
                  </div>
                </>
              )}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};

export default QuarterlySubmittedCompliance;
