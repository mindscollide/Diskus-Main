import React, { useCallback, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useComplianceContext } from "../../../../context/ComplianceContext";
import {
  GetComplianceByDashboardAPI,
  GetComplianceQuarterlyTasksDashboardAPI,
  GetComplianceReopenDashboardAPI,
  GetComplianceTasksDashboardAPI,
  GetComplianceUpcomingDeadlineAPI,
  GetQuarterlySubmittedComplianceAPI,
} from "../../../../store/actions/ComplainSettingActions";

import UpcomingComplianceDeadline from "./UpcomingComplianceDeadline";
import QuarterlyTask from "./QuarterlyTask";
import QuarterlySubmittedCompliance from "./QuarterlySubmittedCompliance";
import ComplianceBy from "./ComplianceBy";
import ComplianceTasks from "./Tasks";
import ReopenedCompliance from "./ReopenedCompliance";

/**
 * ComplianceDashboard
 *
 * Renders six dashboard tiles (3 static + 3 filter-driven) and manages their
 * individual data fetches so each tile can reload independently without
 * triggering a full-dashboard refresh.
 *
 * Fetch strategy:
 *  - Static tiles (QuarterlySubmitted, UpcomingDeadline, QuarterlyTasks) share
 *    one fetch and reload only when viewType changes.
 *  - Filter-driven tiles (ComplianceBy, ComplianceTasks, ReopenedCompliance)
 *    each have a dedicated fetch that fires only when their own filter changes.
 *
 * viewType guard:
 *  React runs child effects before parent effects. The parent (MainCompliance)
 *  restores viewType from localStorage in its own mount effect — which runs
 *  AFTER this component's mount effect. To avoid firing APIs with a stale
 *  initial viewType, we read localStorage here too and set isViewTypeReady=true
 *  only after the correct value is in context, gating all API effects on it.
 */
const ComplianceDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const {
    viewTypeDashboard,
    setViewTypeDashboard,
    complianceDashboardFilter,
    complianceTaskDashboardFilter,
    reopendComplianceDashboardFilter,
    resetComplianceDashboardFilter,
    resetComplianceTaskDashboardFilter,
    resetReopenComplianceDashboardFilter,
  } = useComplianceContext();

  /**
   * Guards all API effects until viewType has been restored from localStorage.
   * Without this, the initial render would dispatch requests with the wrong
   * default viewType before the localStorage restore completes.
   */
  const [isViewTypeReady, setIsViewTypeReady] = useState(false);

  // ── Mount effect ──────────────────────────────────────────────────────────

  useEffect(() => {
    // Reset all three dashboard filters so tile counts are fresh on each visit.
    resetComplianceDashboardFilter();
    resetComplianceTaskDashboardFilter();
    resetReopenComplianceDashboardFilter();

    // Restore viewType before any API effects fire (see component JSDoc above).
    const saved = localStorage.getItem("viewType");
    if (saved !== null) setViewTypeDashboard(Number(saved));

    setIsViewTypeReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch callbacks ───────────────────────────────────────────────────────

  /**
   * Fetches the three static tiles (QuarterlySubmitted, UpcomingDeadline,
   * QuarterlyTasks). Reruns whenever viewType changes.
   */
  const fetchStaticDashboardData = useCallback(async () => {
    try {
      const payload = { viewType: viewTypeDashboard };
      await dispatch(GetQuarterlySubmittedComplianceAPI(navigate, payload, t));
      await dispatch(GetComplianceUpcomingDeadlineAPI(navigate, payload, t));
      await dispatch(
        GetComplianceQuarterlyTasksDashboardAPI(navigate, payload, t),
      );
    } catch (err) {
      console.error("Static dashboard fetch failed:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewTypeDashboard]);

  /**
   * Fetches the ComplianceBy tile.
   * Reruns when viewType or its specific filter changes.
   */
  const fetchComplianceByData = useCallback(async () => {
    try {
      const payload = {
        viewType: viewTypeDashboard,
        filterBy: complianceDashboardFilter,
      };
      await dispatch(GetComplianceByDashboardAPI(navigate, payload, t));
    } catch (err) {
      console.error("ComplianceBy dashboard fetch failed:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewTypeDashboard, complianceDashboardFilter]);

  /**
   * Fetches the ComplianceTasks tile.
   * Reruns when viewType or its specific filter changes.
   */
  const fetchComplianceTaskDashboardData = useCallback(async () => {
    try {
      const payload = {
        viewType: viewTypeDashboard,
        filterBy: complianceTaskDashboardFilter,
      };
      await dispatch(GetComplianceTasksDashboardAPI(navigate, payload, t));
    } catch (err) {
      console.error("ComplianceTasks dashboard fetch failed:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewTypeDashboard, complianceTaskDashboardFilter]);

  /**
   * Fetches the ReopenedCompliance tile.
   * Reruns when viewType or its specific filter changes.
   */
  const fetchReopenedComplianceDashboardData = useCallback(async () => {
    try {
      const payload = {
        viewType: viewTypeDashboard,
        filterBy: reopendComplianceDashboardFilter,
      };
      await dispatch(GetComplianceReopenDashboardAPI(navigate, payload, t));
    } catch (err) {
      console.error("ReopenedCompliance dashboard fetch failed:", err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewTypeDashboard, reopendComplianceDashboardFilter]);

  // ── API trigger effects ───────────────────────────────────────────────────

  // All four effects are guarded by isViewTypeReady so they only fire once
  // the correct viewType is in context (see component JSDoc).

  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchStaticDashboardData();
  }, [fetchStaticDashboardData, isViewTypeReady]);

  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchComplianceByData();
  }, [fetchComplianceByData, isViewTypeReady]);

  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchComplianceTaskDashboardData();
  }, [fetchComplianceTaskDashboardData, isViewTypeReady]);

  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchReopenedComplianceDashboardData();
  }, [fetchReopenedComplianceDashboardData, isViewTypeReady]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Static tiles: data changes only on viewType toggle */}
      <Row className="mt-3">
        <Col sm={12} md={4} lg={4}>
          <QuarterlySubmittedCompliance />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <UpcomingComplianceDeadline />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <QuarterlyTask />
        </Col>
      </Row>

      {/* Filter-driven tiles: each reloads independently on its own filter */}
      <Row className="mt-3">
        <Col sm={12} md={4} lg={4}>
          <ComplianceBy />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <ComplianceTasks />
        </Col>
        <Col sm={12} md={4} lg={4}>
          <ReopenedCompliance />
        </Col>
      </Row>
    </>
  );
};

export default ComplianceDashboard;
