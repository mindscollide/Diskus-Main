import React, { useEffect, useRef, useState } from "react";
import styles from "./quarterlySubmittedCompliance.module.css";
import { ComplianceEmptyState } from "../../../../../components/elements";
import { useSelector } from "react-redux";
import { Progress } from "antd";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useTranslation } from "react-i18next";
import { formatNumber } from "../../../../../commen/functions/utils";

const QuarterlySubmittedCompliance = () => {
  const { setMainComplianceTabs } = useComplianceContext();
  const { t } = useTranslation();

  const progressContainerRef = useRef(null);
  const [progressSize, setProgressSize] = useState(150);

  const GetQuarterlySubmittedDashboard = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetQuarterlySubmittedDashboard
  );

  const hasData =
    GetQuarterlySubmittedDashboard?.completionPercentage !== undefined &&
    GetQuarterlySubmittedDashboard?.completionPercentage !== null;

  useEffect(() => {
    const container = progressContainerRef.current;

    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      const availableWidth = entry.contentRect.width;

      // Keep the circle responsive to its container.
      setProgressSize(Math.max(0, Math.floor(availableWidth)));
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [hasData]);

  return (
    <>
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

      {hasData && (
        <div
          className={styles.quarterlySubmittedCard}
          onClick={() => setMainComplianceTabs(2)}
        >
          <Row >
            <Col sm={12} md={12} lg={12} xs={12}>
              <h2 className={styles.cardHeading}>
                {t("Quarterly-submitted-compliances")}
              </h2>
            </Col>
            </Row>
            <Row>

            <Col
       sm={12} md={12} lg={12} xs={12}
              className="d-flex justify-content-center align-items-center"
            >
              <div
                ref={progressContainerRef}
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                <Progress
                  type="circle"
                  percent={
                    GetQuarterlySubmittedDashboard.completionPercentage
                  }
                  size={progressSize}
                  strokeWidth={10}
                  strokeColor="#6172D6"
                  trailColor="#E1E1E1"
                  format={(percent) => (
                    <>
                      <div className={styles.quarterlyPercentageClass}>
                        {formatNumber(percent)}%
                      </div>
                      <div className={styles.quarterlyCompletedClass}>
                        {t("Completed")}
                      </div>
                    </>
                  )}
                />
              </div>
            </Col>

          </Row>
        </div>
      )}
    </>
  );
};

export default QuarterlySubmittedCompliance;