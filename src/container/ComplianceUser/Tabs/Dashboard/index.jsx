import React, { useCallback, useEffect, useState } from "react";
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

  const { viewTypeDashboard, setViewTypeDashboard, complianceDashboardFilter } =
    useComplianceContext();

  console.log({viewTypeDashboard,complianceDashboardFilter}, "viewTypeDashboardviewTypeDashboard");

  useEffect(() => {
    // Get viewType from localStorage on mount
    const savedViewType = localStorage.getItem("viewType");
    if (savedViewType) {
      setViewTypeDashboard(Number(savedViewType));
    }
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
      await dispatch(GetComplianceTasksDashboardAPI(navigate, Data, t));
      await dispatch(GetComplianceReopenDashboardAPI(navigate, Data, t));
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

  /*  Load main dashboard cards */
  useEffect(() => {
    fetchStaticDashboardData();
  }, [fetchStaticDashboardData]);

  /*  Reload ONLY ComplianceBy when filter changes */
  useEffect(() => {
    fetchComplianceByData();
  }, [fetchComplianceByData]);

 
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
