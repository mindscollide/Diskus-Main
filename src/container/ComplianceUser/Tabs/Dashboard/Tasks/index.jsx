import React from "react";
import styles from "./complianceTasks.module.css";
import {
  ComplianceCard,
  ComplianceEmptyState,
} from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import Select from "react-select";
import CustomButton from "../../../../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";

const ComplianceTasks = () => {
  const { t } = useTranslation();
  const GetComplianceTasksDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceTasksDashboardData,
  );

  const complianceTaskList =
    GetComplianceTasksDashboardData?.taskList?.slice(0, 3) || [];

  console.log(
    GetComplianceTasksDashboardData,
    "GetComplianceTasksDashboardData",
  );

  return (
    <div className={styles["complianceTasksBox"]}>
      <div className={styles.Header}>
        <Row>
          <Col
            md={12}
            lg={12}
            sm={12}
            className="d-flex align-items-center justify-content-start gap-4"
          >
            <h3 className={styles.cardHeading}>Tasks</h3>
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
        {complianceTaskList.length === 0 ? (
          <ComplianceEmptyState text="No compliances found" />
        ) : (
          complianceTaskList?.map((item) => (
            <ComplianceCard
              key={item.taskId}
              title={item.taskTitle}
              dueDate={formatDateToYMD(`${item.dueDate}`)}
              criticalityId={item.criticality} // 1=High, 2=Medium, 3=Low
              authority={item.authorityShortCode}
            />
          ))
        )}
      </div>

      <CustomButton
        text={t("View All Tasks")}
        className={styles.ViewAllTaskButton}
      />
    </div>
  );
};

export default ComplianceTasks;
