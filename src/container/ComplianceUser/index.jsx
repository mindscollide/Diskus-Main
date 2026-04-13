import React, { useCallback, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Button, Switch } from "../../components/elements";
import CustomButton from "../../components/elements/button/Button";
import FiscalYearCalendar_Icon from "../../assets/images/FiscalYearCalendar_Icon.svg";

import { useComplianceContext } from "../../context/ComplianceContext";
import { GetComplianceAndTaskStatusesAPI } from "../../store/actions/ComplainSettingActions";
import { useFiscalYearRange } from "./CommonComponents/FiscalYearComponent/FiscalYear";

import ComplianceDashboard from "./Tabs/Dashboard";
import ComplianceByMe from "./Tabs/ComplainceByMe";
import CreateEditCompliance from "./Tabs/ComplainceByMe/createEditCompliance";
import ViewCompliance from "./CommonComponents/viewCompliance";
import ComplianceForMe from "./Tabs/ComplainceForMe";
import Reports from "./Tabs/Reports";
import ComplianceStandingReport from "./Tabs/Reports/complianceStandingReport/ComplianceStandingReport";
import EndOfComplianceReport from "./Tabs/Reports/endOfComplianceReport/EndOfComplianceReport";
import EndOfQuarterReport from "./Tabs/Reports/endOfQuarterReport/EndOfQuarterReport";
import AccumulativeReport from "./Tabs/Reports/accumulativeReport/AccumulativeReport";
import SearchComplianceBoxModal from "./CommonComponents/searchComplianceBoxModal";
import SearchComplianceReportModal from "./CommonComponents/searchComplianceReportModal";

import styles from "./mainCompliance.module.css";

// ─── Constants ───────────────────────────────────────────────────────────────

/**
 * Tab index constants – avoids magic numbers throughout the component.
 * NOTE: These are tab indices, not viewType values.
 * viewType is a separate concern: 1 = Manager view, 2 = User view.
 */
const TAB = {
  DASHBOARD: 1,
  BY_ME: 2,
  FOR_ME: 3,
  REPORTS: 4,
};

/**
 * Default search payload applied when switching to the By-Me or For-Me tab.
 * Defined at module level so the reference is stable and never triggers
 * unnecessary re-renders when used as a dep.
 */
const EMPTY_SEARCH_PAYLOAD = {
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
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MainCompliance
 *
 * Root shell for the entire Compliance module. Responsibilities:
 *  - Fetch global compliance + task status lists once on mount.
 *  - Persist the Manager / User view-type toggle in localStorage.
 *  - Render the correct top-level tab content (Dashboard / By Me / For Me / Reports).
 *  - Yield to <CreateEditCompliance> or <ViewCompliance> when those
 *    full-page views are active, and to individual report pages when open.
 */
const MainCompliance = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Redux selectors ───────────────────────────────────────────────────────
  const AllComplianceStatus = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceAndTaskStatuses,
  );
  const MqttOrganizationSettingUpdated = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.MqttOrganizationSettingUpdated,
  );

  // ── Context ───────────────────────────────────────────────────────────────
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
    setIsComplianceCreateOrEdit,
  } = useComplianceContext();

  // ── Fiscal year (driven by MQTT org settings) ─────────────────────────────
  const fiscalYearRange = useFiscalYearRange({
    fiscalYearStartDay: MqttOrganizationSettingUpdated?.fiscalYearStartDay,
    fiscalStartMonth: MqttOrganizationSettingUpdated?.fiscalStartMonth,
  });

  console.log(fiscalYearRange, "fiscalYearRange");

  // ── Effects ───────────────────────────────────────────────────────────────

  /** Fetch compliance + task statuses once on mount. */
  useEffect(() => {
    dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Restore the persisted Manager/User toggle from localStorage on mount. */
  useEffect(() => {
    const saved = localStorage.getItem("viewType");
    if (saved !== null) setViewTypeDashboard(Number(saved));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Keep localStorage in sync whenever the view-type toggle changes. */
  useEffect(() => {
    localStorage.setItem("viewType", viewTypeDashboard);
  }, [viewTypeDashboard]);

  /**
   * Populate filter option arrays once status data arrives from the API.
   * Early-return guard prevents running with null data.
   */
  useEffect(() => {
    if (!AllComplianceStatus) return;
    const { complianceStatusesList, tasksStatusesList } = AllComplianceStatus;
    if (complianceStatusesList?.length)
      setAllComplianceStatusForFilter(complianceStatusesList);
    if (tasksStatusesList?.length)
      setAllTasksStatusForFilter(tasksStatusesList);
  }, [
    AllComplianceStatus,
    setAllComplianceStatusForFilter,
    setAllTasksStatusForFilter,
  ]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Toggle between Manager view (viewType 1) and User view (viewType 2).
   * IMPORTANT: viewType 1/2 is separate from tab index 1/2/3/4.
   * Resets all three dashboard filter states so tile counts are recalculated.
   * localStorage persistence is handled by the viewTypeDashboard effect above.
   */
  const handleSwitchToggle = useCallback(
    (checked) => {
      setViewTypeDashboard(checked ? 2 : 1);
      resetComplianceDashboardFilter();
      resetComplianceTaskDashboardFilter();
      resetReopenComplianceDashboardFilter();
    },
    [
      setViewTypeDashboard,
      resetComplianceDashboardFilter,
      resetComplianceTaskDashboardFilter,
      resetReopenComplianceDashboardFilter,
    ],
  );

  /** Opens the Create Compliance full-page form (state 1 = create mode). */
  const handleOpenCreateCompliance = useCallback(() => {
    setCreateEditComplaince(true);
    setComplianceAddEditViewState(1);
    setIsComplianceCreateOrEdit(1);
  }, [setCreateEditComplaince, setComplianceAddEditViewState]);

  /**
   * Switches to the By-Me (2) or For-Me (3) tab.
   * Resets the search payload and closes the search box so the list
   * always loads from page 0 without leftover filters.
   *
   * @param {number} tab      - TAB.BY_ME or TAB.FOR_ME
   * @param {string} viewMode - "byMe" or "forMe"
   */
  const handleTabWithReset = useCallback(
    (tab, viewMode) => {
      setSearchCompliancePayload(EMPTY_SEARCH_PAYLOAD);
      setMainComplianceTabs(tab);
      setComplianceViewMode(viewMode);
      setsearchbox(false);
    },
    [
      setSearchCompliancePayload,
      setMainComplianceTabs,
      setComplianceViewMode,
      setsearchbox,
    ],
  );

  // ── Early-exit: full-page views ───────────────────────────────────────────

  if (createEditCompliance) return <CreateEditCompliance />;
  if (showViewCompliance) return <ViewCompliance />;

  // Only one report page is active at a time — resolve which one (or null).
  const activeReport = complianceStatndingReport ? (
    <ComplianceStandingReport />
  ) : endOfComplianceReport ? (
    <EndOfComplianceReport />
  ) : endOfQuarterReport ? (
    <EndOfQuarterReport />
  ) : accumulativeReport ? (
    <AccumulativeReport />
  ) : null;

  if (activeReport) return <div>{activeReport}</div>;

  // ── Derived display values ────────────────────────────────────────────────

  const headingMap = {
    [TAB.BY_ME]: t("Compliances-by-me"),
    [TAB.FOR_ME]: t("Compliances-for-me"),
    [TAB.REPORTS]: t("Reports"),
  };
  const heading = headingMap[mainComplianceTabs] ?? "Compliance Dashboard";

  // Tab navigation data – keeps JSX clean; adding a new tab is one object.
  const tabItems = [
    {
      tab: TAB.DASHBOARD,
      label: t("Dashboard"),
      onClick: () => setMainComplianceTabs(TAB.DASHBOARD),
    },
    {
      tab: TAB.BY_ME,
      label: t("Compliances-by-me"),
      onClick: () => handleTabWithReset(TAB.BY_ME, "byMe"),
    },
    {
      tab: TAB.FOR_ME,
      label: t("Compliances-for-me"),
      onClick: () => handleTabWithReset(TAB.FOR_ME, "forMe"),
    },
    {
      tab: TAB.REPORTS,
      label: t("Reports"),
      onClick: () => setMainComplianceTabs(TAB.REPORTS),
    },
  ];

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <section className={styles["MainCompliance_Container"]}>
      {/* Top row: page heading + context action (create button / toggle / search) */}
      <Row>
        <Col
          sm={12}
          md={6}
          lg={6}
          className="d-flex justify-content-start align-items-center mb-2"
        >
          <span className={styles["Compliance_dashboard_heading"]}>
            {heading}
          </span>

          {mainComplianceTabs === TAB.BY_ME && (
            <Button
              text={t("Create-compliance")}
              className={styles["createComplianceButton"]}
              onClick={handleOpenCreateCompliance}
            />
          )}
        </Col>

        <Col
          sm={12}
          md={6}
          lg={6}
          className={
            mainComplianceTabs === TAB.DASHBOARD
              ? "d-flex justify-content-end align-items-center gap-2"
              : undefined
          }
        >
          {mainComplianceTabs === TAB.DASHBOARD && (
            <>
              <span className={styles["SwitchUserView_Text"]}>
                {t("Switch-to-user-view")}
              </span>
              <Switch
                checkedValue={viewTypeDashboard === 2}
                onChange={handleSwitchToggle}
              />
            </>
          )}

          {(mainComplianceTabs === TAB.BY_ME ||
            mainComplianceTabs === TAB.FOR_ME) && <SearchComplianceBoxModal />}

          {mainComplianceTabs === TAB.REPORTS && (
            <SearchComplianceReportModal />
          )}
        </Col>
      </Row>

      {/* Second row: tab navigation buttons + fiscal year display */}
      <Row>
        <Col
          sm={12}
          md={9}
          lg={9}
          className="d-flex justify-content-start flex-wrap gap-2 align-items-center"
        >
          {tabItems.map(({ tab, label, onClick }) => (
            <CustomButton
              key={tab}
              className={
                mainComplianceTabs === tab
                  ? styles["DashboardBtn_active"]
                  : styles["DashboardBtn"]
              }
              text={label}
              onClick={onClick}
            />
          ))}
        </Col>

        <Col
          sm={12}
          md={3}
          lg={3}
          className="d-flex justify-content-end gap-2 align-items-center"
        >
          <img src={FiscalYearCalendar_Icon} alt="Fiscal year calendar" />
          <span className={styles["Fiscalyear_text"]}>
            {`Fiscal Year: ${fiscalYearRange ?? t("No-fiscal-year")}`}
          </span>
        </Col>
      </Row>

      {/* Tab content panels – only the active tab mounts */}
      {mainComplianceTabs === TAB.DASHBOARD && <ComplianceDashboard />}
      {mainComplianceTabs === TAB.BY_ME && <ComplianceByMe />}
      {mainComplianceTabs === TAB.FOR_ME && <ComplianceForMe />}
      {mainComplianceTabs === TAB.REPORTS && <Reports />}
    </section>
  );
};

export default MainCompliance;
