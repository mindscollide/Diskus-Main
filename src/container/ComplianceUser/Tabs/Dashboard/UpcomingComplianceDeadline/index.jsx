import React, { useCallback } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ComplianceEmptyState } from "../../../../../components/elements";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import styles from "./upcomingComplianceDeadline.module.css";

/**
 * UpcomingComplianceDeadline
 *
 * Dashboard tile showing how many compliances are due this week and this
 * quarter. Clicking the card navigates to the Compliances-By-Me tab (tab 2).
 * Renders an empty state when no data has loaded yet.
 */
const UpcomingComplianceDeadline = () => {
  const { t } = useTranslation();
  const { setMainComplianceTabs } = useComplianceContext();

  const upcomingData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetUpcomingDealineComplianceDashboard,
  );

  /** Navigate to the Compliances-By-Me tab when the card is clicked. */
  const handleCardClick = useCallback(() => {
    setMainComplianceTabs(2);
  }, [setMainComplianceTabs]);

  if (!upcomingData) {
    return (
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
    );
  }

  return (
    <div className={styles.upcomingComplianceCard} onClick={handleCardClick}>
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
              {upcomingData.dueThisQuarter}
            </span>{" "}
            <span className={styles.normalText}>{t("Due-this-quarter")}</span>
          </span>

          <span className={styles.checkUpcomingCenter}>
            <span className={styles.boldNumber}>
              {upcomingData.dueThisWeek}
            </span>{" "}
            <span className={styles.normalText}>{t("Due-this-week")}</span>
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default UpcomingComplianceDeadline;
