import React, { useState } from "react";
import styles from "./ComplianceStandingReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

const { Panel } = Collapse;

const ComplianceStandingReport = () => {
  const { complianceStatndingReport, setComplianceStandingReport } =
    useComplianceContext();
  const [isHidden, setIsHidden] = useState(true);
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

  const options = {
    // default is `save`
    method: "save",
    // default is Resolution.MEDIUM = 3, which should be enough, higher values
    // increases the image quality but also the size of the PDF, so be careful
    // using values higher than 10 when having multiple pages generated, it
    // might cause the page to crash or hang.
    resolution: Resolution.HIGH,
    page: {
      // margin is in MM, default is Margin.NONE = 0
      margin: Margin.SMALL,
      // default is 'A4'
      format: "A4",
      // default is 'portrait'
      orientation: "landscape",
    },
    canvas: {
      // default is 'image/jpeg' for better size performance
      mimeType: "image/png",
      qualityRatio: 1,
    },
    // Customize any value passed to the jsPDF instance and html2canvas
    // function. You probably will not need this and things can break,
    // so use with caution.
    overrides: {
      // see https://artskydj.github.io/jsPDF/docs/jsPDF.html for more options
      pdf: {
        compress: true,
      },
      // see https://html2canvas.hertzen.com/configuration for more options
      canvas: {
        useCORS: true,
      },
    },
  };
  const getTargetElement = () => document.getElementById("content-id");

  const handleClickGenerateODF = async () => {
    setIsHidden(false);
    await document.fonts.ready; // ensures fonts render
    await generatePDF(getTargetElement, options);
    setTimeout(() => {
      setIsHidden(true);
    }, 300);
  };

  return (
    <>
      <div id="content-id" className={styles.mainDivComplianceStanding}>
        <Row className="align-items-center">
          {/* Back Button */}
          <Col xs="auto">
            <img
              src={BackButton}
              alt="BackButton"
              onClick={() => setComplianceStandingReport(false)}
            />
          </Col>

          {/* Report Type */}
          <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
            <img src={Verification} alt="Verification" />
            <div>
              <label>Report Type:</label>
              <p>Compliance Standing</p>
            </div>
          </Col>

          {/* Generated Date */}
          <Col
            lg={5}
            xs="auto"
            className={`${styles.iconTextWrapper} d-flex justify-content-center`}
          >
            <img src={ComplianceCalendar} alt="ComplianceCalendar" />
            <div>
              <label>Generated Date:</label>
              <p>15 January 2025</p>
            </div>
          </Col>

          {/* Date Range Picker */}
          <Col lg={3} xs={4}>
            <label className={styles.dueDateRange}>Due Date Range</label>
            <DatePicker.RangePicker
              format="DD/MM/YYYY"
              placeholder={["Start Date", "End Date"]}
              className="custom-range-picker"
              separator="-"
              inputReadOnly
            />
          </Col>

          {/* Download Button */}
          <Col lg={1} xs="auto">
            <CustomButton
              text="Download"
              onClick={() => handleClickGenerateODF()}
              className={styles.complianceDownloadBtn}
            />
          </Col>
        </Row>
        <div hidden={isHidden}>Content to be generated to PDF</div>
        <Row>
          <Col
            lg={12}
            xs="auto"
            className={`${styles.ComplianceMainHeading} mt-4`}
          >
            <div>
              <label>Report Title:</label>
              <p>Compliance Standing Report</p>
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
              <DownOutlined
                rotate={isActive ? 180 : 0}
                style={{
                  fontSize: "15px",
                  color: "#5a5a5a",
                }}
              />
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
                  <Row>
                    <Col
                      lg={12}
                      xs="auto"
                      className={`${styles.ComplianceMainHeading}`}
                    >
                      <div>
                        <label>Checklist Title:</label>
                        <p>
                          Implementation of End-to-End Data Encryption Across
                          All Internal Systems, External Communication{" "}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <div className={styles.insideAccordianTable}>
                    <Row>
                      <Col lg={12} xs="auto">
                        <div className={styles.insideAccordianMainHeading}>
                          <label>Task Title:</label>
                          <p>
                            Implementation of End-to-End Data Encryption Across
                            All Internal Systems
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

export default ComplianceStandingReport;
