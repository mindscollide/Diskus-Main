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
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useNavigate } from "react-router-dom";

const ComplianceTasks = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { complianceTaskDashboardFilter, setComplianceTaskDashboardFilter } =
    useComplianceContext();

  const GetComplianceTasksDashboardData = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceTasksDashboardData,
  );

  console.log(
    GetComplianceTasksDashboardData,
    "GetComplianceTasksDashboardData",
  );

  const complianceTaskList =
    GetComplianceTasksDashboardData?.taskList?.slice(0, 3) || [];

  const filterOptions = [
    { label: "Overdue", value: 1 },
    { label: "Upcoming", value: 2 },
  ];

  const onClickToTask = () => {
    navigate("/Diskus/todolist");
  };

  const hasDataComplianceTask = GetComplianceTasksDashboardData !== null;

  return (
    <>
      {!hasDataComplianceTask && (
        <div className={styles["complianceTasksBox"]}>
          <div className={styles.Header}>
            <Row>
              <Col
                md={12}
                lg={12}
                sm={12}
                className="d-flex align-items-center justify-content-start gap-2"
              >
                <h3 className={styles.cardHeading}>Task</h3>
                <Select
                  classNamePrefix="DashbaordSelectDropdown"
                  isSearchable={false}
                  options={filterOptions}
                  value={filterOptions.find(
                    (o) => o.value === complianceTaskDashboardFilter,
                  )}
                  onChange={(selected) =>
                    setComplianceTaskDashboardFilter(selected.value)
                  }
                />
              </Col>
            </Row>
          </div>
          <ComplianceEmptyState
            type="noComplianceTaskDashboard"
            title="No tasks available"
            layout="imageTop"
            imgMarginTop="105px"
          />
        </div>
      )}

      {hasDataComplianceTask && (
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
                  options={filterOptions}
                  value={filterOptions.find(
                    (o) => o.value === complianceTaskDashboardFilter,
                  )}
                  onChange={(selected) =>
                    setComplianceTaskDashboardFilter(selected.value)
                  }
                />
              </Col>
            </Row>
          </div>

          {/* Dynamic Rendering */}
          <div className={styles.CardInsideHeight}>
            {complianceTaskList?.map((item) => (
              <ComplianceCard
                key={item.taskId}
                title={item.taskTitle}
                dueDate={formatDateToYMD(`${item.dueDate}`)}
                criticalityId={item.criticality} // 1=High, 2=Medium, 3=Low
                authority={item.authorityShortCode}
                showHoverIcon={true}
              />
            ))}
          </div>

          <CustomButton
            text={t("View All Tasks")}
            className={styles.ViewAllTaskButton}
            onClick={onClickToTask}
          />
        </div>
      )}
    </>
  );
};

export default ComplianceTasks;
