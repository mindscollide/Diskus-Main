import React from "react";
import styles from "./quarterlySubmittedCompliance.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { Progress } from "antd";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useTranslation } from "react-i18next";

const QuarterlySubmittedCompliance = () => {
  const { setMainComplianceTabs } = useComplianceContext();
  const {t} = useTranslation();

  const GetQuarterlySubmittedDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetQuarterlySubmittedDashboard,
  );

  // Check if data is null or undefined
  const hasData =
    GetQuarterlySubmittedDashboard &&
    GetQuarterlySubmittedDashboard.completionPercentage !== undefined &&
    GetQuarterlySubmittedDashboard.completionPercentage !== null;

  return (
    <>
      {/* Show empty state when no data */}
      {!hasData && (
        <div className={styles.NoDataQuarterlySubmittedCard}>
          <h2 className={styles.NoDataCardHeading}>
            {t("Quarterly-submitted-compliances")}
          </h2>
          <ComplianceEmptyState
            type="noQuarterlySubmittedCompliance"
            title={t("Quarterly-compliances-not-submitted")}
            layout="imageRight"
            imgWidth="100%"
          />
        </div>
      )}

      {/* Show progress when data exists */}
      {hasData && (
        <div
          className={styles.quarterlySubmittedCard}
          onClick={() => setMainComplianceTabs(2)}
        >
          <Row className={styles.fullHeightRow}>
            <Col xs={8}>
              <h2 className={styles.cardHeading}>
                {t("Quarterly-submitted-compliances")}
              </h2>
            </Col>

            <Col
              xs={4}
              className={`d-flex justify-content-center align-items-center`}
            >
              <Progress
                type="circle"
                percent={GetQuarterlySubmittedDashboard.completionPercentage}
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
                      {t("Completed")}
                    </div>
                  </>
                )}
              />
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default QuarterlySubmittedCompliance;
