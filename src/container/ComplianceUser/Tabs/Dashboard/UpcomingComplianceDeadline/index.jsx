import React from "react";
import styles from "./upcomingComplianceDeadline.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useTranslation } from "react-i18next";
const UpcomingComplianceDeadline = () => {
  const { t } = useTranslation();

  const { setMainComplianceTabs } = useComplianceContext();

  const GetUpcomingDealineComplianceDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetUpcomingDealineComplianceDashboard,
  );

  console.log(
    GetUpcomingDealineComplianceDashboard,
    "GetUpcomingDealineComplianceDashboard",
  );

  // Check if data is null or undefined
  const hasData =
    GetUpcomingDealineComplianceDashboard &&
    GetUpcomingDealineComplianceDashboard !== undefined &&
    GetUpcomingDealineComplianceDashboard !== null;

  return (
    <>
      {/* Show empty state when no data */}
      {!hasData && (
        <div className={styles.NoUpcomingDeadlineCard}>
          <h2 className={styles.NoDataCardHeading}>
            {t("Upcoming-compliance-deadlines")}
          </h2>
          <ComplianceEmptyState
            type="noUpcomingCompliance"
            title="No upcoming deadlines"
            layout="imageRight"
          />
        </div>
      )}

      {hasData && (
        <div
          className={styles.upcomingComplianceCard}
          onClick={() => setMainComplianceTabs(2)}
        >
          <Row>
            <Col xs={12}>
              <h2 className={styles.cardHeading}>
                {t("Upcoming-compliance-deadlines")}
              </h2>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className={styles.deadlineRow}>
              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {GetUpcomingDealineComplianceDashboard?.dueThisQuarter}
                </span>{" "}
                <span className={styles.normalText}>
                  {t("Due-this-quarter")}
                </span>
              </span>

              <span className={styles.checkUpcomingCenter}>
                <span className={styles.boldNumber}>
                  {GetUpcomingDealineComplianceDashboard?.dueThisWeek}
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

export default UpcomingComplianceDeadline;
