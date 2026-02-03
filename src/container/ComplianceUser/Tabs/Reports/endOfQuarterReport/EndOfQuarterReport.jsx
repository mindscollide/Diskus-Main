import React from "react";
import styles from "./EndOfQuarterReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";

const { Panel } = Collapse;

const EndOfQuarterReport = () => {
  const { endOfQuarterReport, setEndOfQuarterReport } = useComplianceContext();

  const donutData = [
    ["Task Status", "Count"],
    ["Tasks Completed On Time", 45],
    ["Tasks Completed Late", 33],
    ["Pending or Overdue Tasks", 22],
  ];

  const donutOptions = {
    pieHole: 0.7,
    legend: {
      position: "right",
      textStyle: { fontSize: 12 },
    },
    pieSliceText: "none",
    backgroundColor: "transparent",
    chartArea: { width: "100%", height: "100%" },
    colors: ["#6172D6", "#FFC300", "#f16b6b"],
    tooltip: { text: "percentage" },
  };

  const complianceData = [
    {
      id: 1,
      name: "Detailed Data Handling Audit for Security",
      authority: "PCI DSS",
      criticality: "Medium",
      dueDate: "30 November 2024",
      totalChecklist: 7,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "85%",
    },
    {
      id: 2,
      name: "User Access Review",
      authority: "SOX",
      criticality: "Medium",
      dueDate: "20 December 2024",
      totalChecklist: 5,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "65%",
    },
    {
      id: 3,
      name: "User Access Review",
      authority: "SOX",
      criticality: "Medium",
      dueDate: "20 December 2024",
      totalChecklist: 5,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "45%",
    },
    {
      id: 4,
      name: "User Access Review",
      authority: "SOX",
      criticality: "Medium",
      dueDate: "20 December 2024",
      totalChecklist: 5,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "35%",
    },
    {
      id: 5,
      name: "User Access Review",
      authority: "SOX",
      criticality: "Medium",
      dueDate: "20 December 2024",
      totalChecklist: 5,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "25%",
    },
    {
      id: 6,
      name: "User Access Review",
      authority: "SOX",
      criticality: "Medium",
      dueDate: "20 December 2024",
      totalChecklist: 5,
      totalTasks: 10,
      overdueTasks: 10,
      progress: "25%",
    },
  ];

  return (
    <>
      <div className={styles.mainDivComplianceStanding}>
        <Row className="align-items-center">
          {/* Back Button */}
          <Col xs="auto">
            <img
              src={BackButton}
              alt="BackButton"
              onClick={() => setEndOfQuarterReport(false)}
            />
          </Col>

          {/* Report Type */}
          <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
            <img src={Verification} alt="Verification" />
            <div>
              <label>Report Type:</label>
              <p>Quarterly</p>
            </div>
          </Col>

          {/* Generated Date */}
          <Col
            lg={8}
            xs="auto"
            className={`${styles.iconTextWrapper} d-flex justify-content-center`}
          >
            <img src={ComplianceCalendar} alt="ComplianceCalendar" />
            <div>
              <label>Generated Date:</label>
              <p>15 January 2025</p>
            </div>
          </Col>

          {/* Download Button */}
          <Col lg={1} xs="auto">
            <CustomButton
              text="Download"
              className={styles.complianceDownloadBtn}
            />
          </Col>
        </Row>

        <Row className={`${styles.reportTitleRow} mt-4`}>
          {/* LEFT SIDE — TITLE + META */}
          <Col lg={8} md={7} sm={12}>
            <div className={styles.titleSection}>
              <label>Quarter:</label>
              <p className={styles.longTitle}>End of 2nd Quarter - 2025F</p>

              <div className={styles.metaRow}>
                <div>
                  <span>Start Date</span>
                  <p>1 June 2025</p>
                </div>
                <div>
                  <span>End date</span>
                  <p>13 July 2025</p>
                </div>
              </div>
            </div>
          </Col>

          {/* RIGHT SIDE — DONUT CHART */}
          <Col lg={4} md={5} sm={12} className={styles.chartCol}>
            <div className={styles.chartFlex}>
              {/* Donut */}
              <div className={styles.chartBox}>
                <Chart
                  chartType="PieChart"
                  width="100%"
                  height="200px"
                  data={donutData}
                  options={{ ...donutOptions, legend: "none" }} // ❌ hide default legend
                />

                {/* Center Label */}
                <div className={styles.centerLabel}>
                  <h2>33%</h2>
                  <p>Complete</p>
                </div>
              </div>

              {/* Custom Legend (VERTICALLY CENTERED) */}
              <div className={styles.customLegend}>
                <div>
                  <span className={styles.legendDotBlue}></span>
                  Tasks Completed On Time (45)
                </div>
                <div>
                  <span className={styles.legendDotYellow}></span>
                  Tasks Completed Late (33)
                </div>
                <div>
                  <span className={styles.legendOrange}></span>
                  Pending or Overdue Tasks (22)
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Compliance Table */}
        <div className={styles.tableWrapper}>
          {/* 🔹 STATIC HEADER */}
          <div className={styles.tableHeader}>
            <div>Compliance Name ↓</div>
            <div>Authority ↓</div>
            <div>Criticality</div>
            <div>Due Date ↓</div>
            <div>Total Checklists ↓</div>
            <div>No. of Tasks ↓</div>
            <div>Overdue Tasks ↓</div>
            <div>Progress % ↓</div>
          </div>

          {/* 🔹 COLLAPSE ROWS */}
          <Collapse
            bordered={false}
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <DownOutlined rotate={isActive ? 180 : 0} />
            )}
            className={styles.collapseWrapper}
          >
            {complianceData.map((item) => (
              <Panel
                key={item.id}
                header={
                  <div className={styles.tableRow}>
                    <div className={styles.nameCol}>{item.name}</div>
                    <div>
                      <span className={styles.badge}>{item.authority}</span>
                    </div>
                    <div>
                      <span className={styles.criticality}>
                        {item.criticality}
                      </span>
                    </div>
                    <div>{item.dueDate}</div>
                    <div>{item.totalChecklist}</div>
                    <div>{item.totalTasks}</div>
                    <div>{item.overdueTasks}</div>
                    <div>{item.progress}</div>
                  </div>
                }
              >
                {/* EXPANDED CONTENT */}
                <div className={styles.panelContent}>
                  <div className={styles.insideAccordianTable}>
                    <Row>
                      <Col lg={12} xs="auto">
                        <div className={styles.insideAccordianMainHeading}>
                          <label>Task Title:</label>
                          <p>
                            Apply End-to-End Data Encryption Across All Internal
                            Systems
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={4} xs="auto">
                        <div className={styles.insideAccordianSubHeading}>
                          <label>Assignee:</label>
                          <p>Ali Khan</p>
                        </div>
                      </Col>{" "}
                      <Col lg={2} xs="auto">
                        <div className={styles.insideAccordianSubHeading}>
                          <label>Due Date:</label>
                          <p>10 June 2025</p>
                        </div>
                      </Col>
                      <Col lg={2} xs="auto">
                        <div className={styles.insideAccordianSubHeading}>
                          <label>Completed on:</label>
                          <p>10 June 2025</p>
                        </div>
                      </Col>
                      <Col lg={2} xs="auto">
                        <div className={styles.insideAccordianSubHeading}>
                          <label>Status:</label>
                          <p>Completed</p>
                        </div>
                      </Col>
                      <Col lg={2} xs="auto">
                        <div className={styles.insideAccordianSubHeading}>
                          <label>Completed:</label>
                          <p>On Time</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </>
  );
};

export default EndOfQuarterReport;
