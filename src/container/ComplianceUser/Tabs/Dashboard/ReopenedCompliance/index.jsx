import React from "react";
import styles from "./reopenedCompliance.module.css";
import {
  ComplianceCard,
  ComplianceEmptyState,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../../../../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import { useSelector } from "react-redux";

const ReopenedCompliance = () => {
  const { t } = useTranslation();
  const GetComplianceReopenDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceReopenDashboardData,
  );

  const complianceListReopen =
    GetComplianceReopenDashboardData?.reopenComplianceList?.slice(0, 3) || [];

  console.log(
    GetComplianceReopenDashboardData,
    "GetComplianceReopenDashboardData",
  );

  return (
    <div className={styles["reopenedComplianceCard"]}>
      <div className={styles.Header}>
        <Row>
          <Col
            md={12}
            lg={12}
            sm={12}
            className="d-flex align-items-center justify-content-start gap-4"
          >
            <h3 className={styles.cardHeading}>Reopened Compliances</h3>
            <Select
              classNamePrefix="DashbaordSelectDropdown"
              isSearchable={false}
              options={[
                {
                  label: "Due Date",
                  value: 1,
                },
                {
                  label: "Upcoming",
                  value: 2,
                },
                {
                  label: "Criticality",
                  value: 3,
                },
                {
                  label: "Progress",
                  value: 4,
                },
                {
                  label: "Athority",
                  value: 5,
                },
              ]}
            />
          </Col>
        </Row>
      </div>

      {/* Dynamic Rendering */}
      <div className={styles.CardInsideHeight}>
        {complianceListReopen.length === 0 ? (
          <ComplianceEmptyState
            type="noComplianceReopenDashboard"
            title="No compliances have been reopened"
            layout="imageTop"
          />
        ) : (
          complianceListReopen.map((item) => (
            <ComplianceCard
              title={item.complianceTitle}
              dueDate={formatDateToYMD(`${item.dueDate}`)}
              description={item.reopenReason}
              criticalityId={item.criticality} // 1=High, 2=Medium, 3=Low
              authority={item.authorityShortCode}
            />
          ))
        )}
      </div>

      <CustomButton
        text={t("View All Reopened Compliances")}
        className={styles.ViewAllComplianceButton}
      />
    </div>
  );
};

export default ReopenedCompliance;
