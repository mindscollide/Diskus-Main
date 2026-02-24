import React, { useCallback, useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import UpcomingComplianceDeadline from "./UpcomingComplianceDeadline";
import QuarterlyTask from "./QuarterlyTask";
import QuarterlySubmittedCompliance from "./QuarterlySubmittedCompliance";
import ComplianceBy from "./ComplianceBy";
import ComplianceTasks from "./Tasks";
import ReopenedCompliance from "./ReopenedCompliance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  GetComplianceByDashboardAPI,
  GetComplianceQuarterlyTasksDashboardAPI,
  GetComplianceReopenDashboardAPI,
  GetComplianceTasksDashboardAPI,
  GetComplianceUpcomingDeadlineAPI,
  GetQuarterlySubmittedComplianceAPI,
} from "../../../../store/actions/ComplainSettingActions";
import { useComplianceContext } from "../../../../context/ComplianceContext";

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

  const [isViewTypeReady, setIsViewTypeReady] = useState(false);

  console.log(
    {
      viewTypeDashboard,
      complianceDashboardFilter,
      complianceTaskDashboardFilter,
      reopendComplianceDashboardFilter,
    },
    "viewTypeDashboardviewTypeDashboard",
  );

  // Reset filters when component mounts (cleanup from previous visits)
  useEffect(() => {
    resetComplianceDashboardFilter();
    resetComplianceTaskDashboardFilter();
    resetReopenComplianceDashboardFilter();

    // Get viewType from localStorage on mount
    const savedViewType = localStorage.getItem("viewType");
    if (savedViewType) {
      setViewTypeDashboard(Number(savedViewType));
    }
    setIsViewTypeReady(true);

    // Cleanup function (optional)
    return () => {
      // You can reset filters here too if needed
    };
  }, []);

  /*  Fetch OTHER cards */
  const fetchStaticDashboardData = useCallback(async () => {
    try {
      const Data = { viewType: viewTypeDashboard };

      await dispatch(GetQuarterlySubmittedComplianceAPI(navigate, Data, t));
      await dispatch(GetComplianceUpcomingDeadlineAPI(navigate, Data, t));
      await dispatch(
        GetComplianceQuarterlyTasksDashboardAPI(navigate, Data, t),
      );
    } catch (err) {
      console.error("Static dashboard APIs failed:", err);
    }
  }, [viewTypeDashboard]);

  /* Fetch ComplianceBy ONLY */
  const fetchComplianceByData = useCallback(async () => {
    try {
      const data = {
        viewType: viewTypeDashboard,
        filterBy: complianceDashboardFilter,
      };

      await dispatch(GetComplianceByDashboardAPI(navigate, data, t));
    } catch (err) {
      console.error("ComplianceBy API failed:", err);
    }
  }, [viewTypeDashboard, complianceDashboardFilter]);

  /* Fetch Compliance Task Dashboard ONLY */
  const fetchComplianceTaskDashboardData = useCallback(async () => {
    try {
      const data = {
        viewType: viewTypeDashboard,
        filterBy: complianceTaskDashboardFilter,
      };

      await dispatch(GetComplianceTasksDashboardAPI(navigate, data, t));
    } catch (err) {
      console.error("ComplianceBy API failed:", err);
    }
  }, [viewTypeDashboard, complianceTaskDashboardFilter]);

  /* Fetch Reopened Compliance Dashboard ONLY */
  const fetchReopenedComplianceDashboardData = useCallback(async () => {
    try {
      const data = {
        viewType: viewTypeDashboard,
        filterBy: reopendComplianceDashboardFilter,
      };

      await dispatch(GetComplianceReopenDashboardAPI(navigate, data, t));
    } catch (err) {
      console.error("ComplianceBy API failed:", err);
    }
  }, [viewTypeDashboard, reopendComplianceDashboardFilter]);

  /*  Load main dashboard cards */
  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchStaticDashboardData();
  }, [fetchStaticDashboardData, isViewTypeReady]);

  /*  Reload ONLY ComplianceBy when filter changes */
  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchComplianceByData();
  }, [fetchComplianceByData, isViewTypeReady]);

  /*  Reload ONLY Compliance Task Dashboard when filter changes */
  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchComplianceTaskDashboardData();
  }, [fetchComplianceTaskDashboardData, isViewTypeReady]);

  /*  Reload ONLY Reopened Compliance Dashboard when filter changes */
  useEffect(() => {
    if (!isViewTypeReady) return;
    fetchReopenedComplianceDashboardData();
  }, [fetchReopenedComplianceDashboardData, isViewTypeReady]);

  return (
    <>
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
