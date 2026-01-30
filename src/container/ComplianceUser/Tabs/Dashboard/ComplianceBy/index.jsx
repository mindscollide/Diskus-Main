import React, { useMemo } from "react";
import styles from "./complianceby.module.css";
import {
  ComplianceCard,
  ComplianceEmptyState,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import { useTranslation } from "react-i18next";
import CustomButton from "../../../../../components/elements/button/Button";
import { useSelector } from "react-redux";
import {
  formatDateToYMD,
  parseUTCDateString,
} from "../../../CommonComponents/commonFunctions";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
const ComplianceBy = () => {
  const { t } = useTranslation();
  const { complianceDashboardFilter, setComplianceDashboardFilter } =
    useComplianceContext();

  console.log(complianceDashboardFilter, "complianceDashboardFilter");

  const GetComplianceByDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceByDashboardData,
  );

  const filterOptions = [
    { label: "Progress", value: 1 },
    { label: "Due Date", value: 2 },
    { label: "Criticality", value: 3 },
    { label: "Authority", value: 4 },
  ];

  const complianceList =
    GetComplianceByDashboardData?.complianceByList?.slice(0, 3) || [];

  console.log(GetComplianceByDashboardData, "GetComplianceByDashboardData");

  return (
    <>
      <div className={styles["complianceByCard"]}>
        <div className={styles.Header}>
          <Row>
            <Col
              md={12}
              lg={12}
              sm={12}
              className="d-flex align-items-center justify-content-start gap-4"
            >
              <h3 className={styles.cardHeading}>Compliance By</h3>
              <Select
                classNamePrefix="DashbaordSelectDropdown"
                isSearchable={false}
                options={filterOptions}
                value={filterOptions.find(
                  (o) => o.value === complianceDashboardFilter,
                )}
                onChange={(selected) =>
                  setComplianceDashboardFilter(selected.value)
                }
              />
            </Col>
          </Row>
        </div>
        <p className={styles.subText}>
          Your progress across different compliance criteria
        </p>

        {/* Dynamic Rendering */}
        <div className={styles.CardInsideHeight}>
          {complianceList.length === 0 ? (
            <ComplianceEmptyState text="No compliances found" />
          ) : (
            complianceList.map((item) => (
              <ComplianceCard
                key={item.complianceId}
                title={item.complianceTitle}
                dueDate={formatDateToYMD(`${item.dueDate}`)}
                progress={item.progressPercentage}
                criticalityId={item.criticality}
                authority={item.authorityShortCode}
              />
            ))
          )}
        </div>

        <CustomButton
          text={t("View All Compliances")}
          className={styles.ViewAllCompliancesButton}
        />
      </div>
    </>
  );
};

export default ComplianceBy;
