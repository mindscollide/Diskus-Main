import React from "react";
import { Row, Col } from "react-bootstrap";
import UpcomingComplianceDeadline from "./UpcomingComplianceDeadline";
import QuarterlyTask from "./QuarterlyTask";
import QuarterlySubmittedCompliance from "./QuarterlySubmittedCompliance";
import ComplianceBy from "./ComplianceBy";
import ComplianceTasks from "./Tasks";
import ReopenedCompliance from "./ReopenedCompliance";

const ComplianceDashboard = () => {
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
