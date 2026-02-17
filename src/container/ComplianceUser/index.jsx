import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./mainCompliance.module.css";
import { Button, Switch } from "../../components/elements";
import CustomButton from "../../components/elements/button/Button";
import { useTranslation } from "react-i18next";
import FiscalYearCalendar_Icon from "../../assets/images/FiscalYearCalendar_Icon.svg";
import ComplianceDashboard from "./Tabs/Dashboard";
import ComplianceByMe from "./Tabs/ComplainceByMe";
import CreateEditCompliance from "./Tabs/ComplainceByMe/createEditCompliance";
import { useComplianceContext } from "../../context/ComplianceContext";
import ViewCompliance from "./CommonComponents/viewCompliance";
import ComplianceForMe from "./Tabs/ComplainceForMe";
import SearchComplianceBoxModal from "./CommonComponents/searchComplianceBoxModal";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceAndTaskStatusesAPI } from "../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import Reports from "./Tabs/Reports";
import ComplianceStandingReport from "./Tabs/Reports/complianceStandingReport/ComplianceStandingReport";
import EndOfComplianceReport from "./Tabs/Reports/endOfComplianceReport/EndOfComplianceReport";
import EndOfQuarterReport from "./Tabs/Reports/endOfQuarterReport/EndOfQuarterReport";
import AccumulativeReport from "./Tabs/Reports/accumulativeReport/AccumulativeReport";
import SearchComplianceReportModal from "./CommonComponents/searchComplianceReportModal";
import {
  getFiscalDateFromLocalStorage,
  getFiscalYearRange,
} from "./CommonComponents/commonFunctions";
import { useFiscalYearRange } from "./CommonComponents/FiscalYearComponent/FiscalYear";

const MainCompliance = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AllComplianceStatus = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceAndTaskStatuses,
  );

  const MqttOrganizationSettingUpdated = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.MqttOrganizationSettingUpdated,
  );

  console.log(MqttOrganizationSettingUpdated, "MqttOrganizationSettingUpdated");

  const {
    createEditCompliance,
    setCreateEditComplaince,
    mainComplianceTabs,
    setMainComplianceTabs,
    setComplianceAddEditViewState,
    showViewCompliance,
    setComplianceViewMode,
    setSearchCompliancePayload,
    setsearchbox,
    setAllComplianceStatusForFilter,
    setAllTasksStatusForFilter,
    viewTypeDashboard,
    setViewTypeDashboard,
    resetComplianceDashboardFilter,
    resetComplianceTaskDashboardFilter,
    resetReopenComplianceDashboardFilter,
    complianceStatndingReport,
    endOfComplianceReport,
    endOfQuarterReport,
    accumulativeReport,
  } = useComplianceContext();
  // Pass the fiscal info from the MQTT payload to the hook
  const fiscalYearRange = useFiscalYearRange({
    fiscalYearStartDay: MqttOrganizationSettingUpdated?.fiscalYearStartDay,
    fiscalStartMonth: MqttOrganizationSettingUpdated?.fiscalStartMonth,
  });

  console.log(fiscalYearRange, "fiscalYearRangefiscalYearRange");

  useEffect(() => {
    dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
  }, []);

  console.log(showViewCompliance, "showViewComplianceshowViewCompliance");

  console.log(viewTypeDashboard, "viewTypeDashboardviewTypeDashboard");

  // Restore from localStorage on mount
  useEffect(() => {
    const savedViewType = localStorage.getItem("viewType");
    if (savedViewType) setViewTypeDashboard(Number(savedViewType));
  }, []);

  // Save to localStorage whenever viewTypeDashboard changes
  useEffect(() => {
    localStorage.setItem("viewType", viewTypeDashboard);
  }, [viewTypeDashboard]);

  useEffect(() => {
    if (AllComplianceStatus && AllComplianceStatus !== null) {
      const { complianceStatusesList, tasksStatusesList } = AllComplianceStatus;
      if (complianceStatusesList.length > 0) {
        setAllComplianceStatusForFilter(complianceStatusesList);
        console.log(complianceStatusesList, "complianceStatusesList");
      }
      if (tasksStatusesList.length > 0) {
        setAllTasksStatusForFilter(tasksStatusesList);
      }
    }
  }, [AllComplianceStatus]);

  // Toggle switch handler
  const handleSwitchToggle = (checked) => {
    const newViewType = checked ? 2 : 1;

    setViewTypeDashboard(newViewType);
    localStorage.setItem("viewType", newViewType);

    // For Compliance By Dashboard Filter Reset State
    resetComplianceDashboardFilter();

    // For Compliance Task Dashboard Filter Reset State
    resetComplianceTaskDashboardFilter();

    // For Reopened Compliance Dashboard Filter Reset State
    resetReopenComplianceDashboardFilter();
  };

  const handleOpenCreateEditCompliance = () => {
    setCreateEditComplaince(true);
    setComplianceAddEditViewState(1);
  };
  const handleClickComplianceMode = (mode) => {
    if (mode === 2) {
      setSearchCompliancePayload({
        complianceTitle: "",
        complianceTitleOutside: "",
        dueDateFrom: "",
        dueDateTo: "",
        authorityShortCode: "",
        tagsCSV: "",
        criticalityIds: [],
        statusIds: [],
        pageNumber: 0,
        length: 10,
      });
      setMainComplianceTabs(2);
      setComplianceViewMode("byMe");
      setsearchbox(false);
      return;
    } else if (mode === 3) {
      setSearchCompliancePayload({
        complianceTitle: "",
        complianceTitleOutside: "",
        dueDateFrom: "",
        dueDateTo: "",
        authorityShortCode: "",
        tagsCSV: "",
        criticalityIds: [],
        statusIds: [],
        pageNumber: 0,
        length: 10,
      });
      setMainComplianceTabs(3);
      setComplianceViewMode("forMe");
      setsearchbox(false);
      return;
    }
  };

  if (createEditCompliance) {
    return <CreateEditCompliance />;
  }
  if (showViewCompliance) {
    return <ViewCompliance />;
  }

  return (
    <>
      {complianceStatndingReport ||
      endOfComplianceReport ||
      endOfQuarterReport ||
      accumulativeReport ? (
        <div>
          {complianceStatndingReport ? (
            <ComplianceStandingReport />
          ) : endOfComplianceReport ? (
            <EndOfComplianceReport />
          ) : endOfQuarterReport ? (
            <EndOfQuarterReport />
          ) : accumulativeReport ? (
            <AccumulativeReport />
          ) : null}
        </div>
      ) : (
        <section className={styles["MainCompliance_Container"]}>
          <Row>
            <Col
              sm={12}
              md={6}
              lg={6}
              className="d-flex justify-content-start align-items-center mb-2"
            >
              <span className={styles["Compliance_dashboard_heading"]}>
                {mainComplianceTabs === 2
                  ? t("Compliances-by-me")
                  : mainComplianceTabs === 4
                    ? t("Reports")
                    : "Compliance Dashboard"}
              </span>
              {mainComplianceTabs === 2 && (
                <Button
                  text={t("Create-compliance")}
                  className={styles["createComplianceButton"]}
                  onClick={handleOpenCreateEditCompliance}
                />
              )}
            </Col>
            {mainComplianceTabs === 1 ? (
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-end align-items-center gap-2"
              >
                <span className={styles["SwitchUserView_Text"]}>
                  {t("Switch-to-user-view")}
                </span>{" "}
                <Switch
                  checkedValue={viewTypeDashboard === 2}
                  onChange={handleSwitchToggle}
                />
              </Col>
            ) : mainComplianceTabs === 2 || mainComplianceTabs === 3 ? (
              <Col sm={12} md={6} lg={6}>
                <SearchComplianceBoxModal />
              </Col>
            ) : mainComplianceTabs === 4 ? (
              <Col sm={12} md={6} lg={6}>
                <SearchComplianceReportModal />
              </Col>
            ) : null}
          </Row>
          <Row>
            <Col
              sm={12}
              md={9}
              lg={9}
              className="d-flex justify-content-start flex-wrap gap-2 align-items-center"
            >
              <CustomButton
                className={
                  mainComplianceTabs === 1
                    ? styles["DashboardBtn_active"]
                    : styles["DashboardBtn"]
                }
                text={t("Dashboard")}
                onClick={() => setMainComplianceTabs(1)}
              />
              <CustomButton
                className={
                  mainComplianceTabs === 2
                    ? styles["DashboardBtn_active"]
                    : styles["DashboardBtn"]
                }
                onClick={() => handleClickComplianceMode(2)}
                text={t("Compliances-by-me")}
              />
              <CustomButton
                className={
                  mainComplianceTabs === 3
                    ? styles["DashboardBtn_active"]
                    : styles["DashboardBtn"]
                }
                onClick={() => handleClickComplianceMode(3)}
                text={t("Compliances-for-me")}
              />
              <CustomButton
                className={
                  mainComplianceTabs === 4
                    ? styles["DashboardBtn_active"]
                    : styles["DashboardBtn"]
                }
                onClick={() => setMainComplianceTabs(4)}
                text={t("Reports")}
              />
            </Col>
            {mainComplianceTabs === 1 && (
              <Col
                sm={12}
                md={3}
                lg={3}
                className="d-flex justify-content-end gap-2 align-items-center"
              >
                <img src={FiscalYearCalendar_Icon} alt="" />
                <span className={styles["Fiscalyear_text"]}>
                  {`Fiscal Year: ${fiscalYearRange}`}
                </span>
              </Col>
            )}
          </Row>
          {mainComplianceTabs === 1 && <ComplianceDashboard />}
          {mainComplianceTabs === 2 && <ComplianceByMe />}
          {mainComplianceTabs === 3 && <ComplianceForMe />}
          {mainComplianceTabs === 4 && <Reports />}
        </section>
      )}
    </>
  );
};

export default MainCompliance;
