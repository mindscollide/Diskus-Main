import React from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./quarterlyTask.module.css";
import { Progress } from "antd";
import { useSelector } from "react-redux";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../../../../commen/functions/utils";

const QuarterlyTask = () => {
  const { t } = useTranslation();
  const GetComlianceQuarterlyTasksDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComlianceQuarterlyTasksDashboardData,
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
          <h2 className={styles.NoDataCardHeading}>{t("Quarterly-tasks")}</h2>
          <ComplianceEmptyState
            type='noQuarterlyTaskCompliance'
            title={t("No-upcoming-quarterly-tasks")}
            layout='imageRight'
            imgWidth='100%'
          />
        </div>
      )}

      {hasData && (
        <div className={styles.upcomingComplianceCard}>
          <Row>
            <Col xs={12}>
              <h2 className={styles.cardHeading}>{t("Quarterly-tasks")}</h2>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <div className={styles.progressWrapper}>
                <div className={styles.progressLabel}>
                  {formatNumber(
                    GetComlianceQuarterlyTasksDashboardData?.percentCompleted ??
                      0,
                  )}
                  %
                </div>
                <Progress
                  percent={
                    (GetComlianceQuarterlyTasksDashboardData?.percentCompleted)
                  }
                  className='complianceProgressBarColor'
                  trailColor='#E1E1E1'
                  showInfo={false}
                  
                />

                {/* Overlay Text */}
                <div className={styles.progressText}>
                  <span className={styles.leftText}>
                    {(() => {
                      // completedOutOfTotalText comes from the API as plain
                      // English (e.g. "0/2 Completed") — the trailing word
                      // never goes through t(), so it stays English even in
                      // Arabic. Pull out just the "completed/total" numbers
                      // and rebuild the label with our own translated word.
                      const [, completedCount, totalCount] =
                        GetComlianceQuarterlyTasksDashboardData?.completedOutOfTotalText?.match(
                          /^(\d+)\/(\d+)/,
                        ) ?? [];
                      return `${formatNumber(
                        Number(completedCount ?? 0),
                      )}/${formatNumber(Number(totalCount ?? 0))} ${t(
                        "Completed",
                      )}`;
                    })()}
                  </span>
                  <span className={styles.rightText}>
                    {`${formatNumber(
                      GetComlianceQuarterlyTasksDashboardData?.remainingTasks ??
                        0,
                    )} ${t("Remaining")}`}
                  </span>
                </div>
              </div>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className={styles.deadlineRow}>
              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {formatNumber(
                    GetComlianceQuarterlyTasksDashboardData?.dueThisMonth ?? 0,
                  )}
                </span>{" "}
                <span className={styles.normalText}>{t("Due-this-month")}</span>
              </span>

              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {formatNumber(
                    GetComlianceQuarterlyTasksDashboardData?.dueThisWeek ?? 0,
                  )}
                </span>{" "}
                <span className={styles.normalText}>{t("Due-this-week")}</span>
              </span>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default QuarterlyTask;
