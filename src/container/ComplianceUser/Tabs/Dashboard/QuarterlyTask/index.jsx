import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./quarterlyTask.module.css";
import { Progress } from "antd";
import { useSelector } from "react-redux";
import { ComplianceEmptyState } from "../../../../../components/elements";

const QuarterlyTask = () => {
  const GetComlianceQuarterlyTasksDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComlianceQuarterlyTasksDashboardData,
  );

  console.log(
    GetComlianceQuarterlyTasksDashboardData,
    "GetComlianceQuarterlyTasksDashboardData",
  );

  // Check if data is null or undefined
  const hasData =
    GetComlianceQuarterlyTasksDashboardData &&
    GetComlianceQuarterlyTasksDashboardData !== undefined &&
    GetComlianceQuarterlyTasksDashboardData !== null;

  return (
    <>
      {/* Show empty state when no data */}
      {!hasData && (
        <div className={styles.NoDataQuarterlyTaskCard}>
          <h2 className={styles.NoDataCardHeading}>Quarterly Tasks</h2>
          <ComplianceEmptyState
            type="noQuarterlyTaskCompliance"
            title="No upcoming Quarterly Tasks"
            layout="imageRight"
            imgWidth="100%"
          />
        </div>
      )}

      {hasData && (
        <div className={styles.upcomingComplianceCard}>
          <Row>
            <Col xs={12}>
              <h2 className={styles.cardHeading}>Quarterly Tasks</h2>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className={styles.progressWrapper}>
                <div className={styles.progressLabel}>
                  {GetComlianceQuarterlyTasksDashboardData?.completedTasks ??
                    "0"}
                  %
                </div>
                <Progress
                  percent={
                    GetComlianceQuarterlyTasksDashboardData?.percentCompleted
                  }
                  className="complianceProgressBarColor"
                  trailColor="#E1E1E1"
                  showInfo={false}
                />

                {/* Overlay Text */}
                <div className={styles.progressText}>
                  <span className={styles.leftText}>
                    {GetComlianceQuarterlyTasksDashboardData?.completedOutOfTotalText ??
                      "0/0 Completed"}
                  </span>
                  <span className={styles.rightText}>
                    {`${GetComlianceQuarterlyTasksDashboardData?.remainingTasks} ${"remaining"}` ??
                      "0 remaining"}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className={styles.deadlineRow}>
              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {GetComlianceQuarterlyTasksDashboardData?.dueThisMonth ?? "0"}
                </span>{" "}
                <span className={styles.normalText}>Due This Month</span>
              </span>

              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {GetComlianceQuarterlyTasksDashboardData?.dueThisWeek ?? "0"}
                </span>{" "}
                <span className={styles.normalText}>Due This Week</span>
              </span>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default QuarterlyTask;
