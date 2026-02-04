import React, { useMemo } from "react";
import styles from "./EndOfComplianceReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";
import { t } from "i18next";
import CustomTable from "../../../../../components/elements/table/Table";

const { Panel } = Collapse;

const EndOfComplianceReport = () => {
  const { endOfComplianceReport, setEndOfComplianceReport, reportList } =
    useComplianceContext();

  const donutData = [
    ["Task Status", "Count"],
    ["Tasks Completed On Time", 45],
    ["Tasks Completed Late", 33],
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
    colors: ["#6172D6", "#FFC300"],
    tooltip: { text: "percentage" },
  };

  const complianceData = [
    {
      id: 1,
      checklistName: "GDPR Policy Review",
      dueDate: "30 November 2024",
      totalTasks: 10,
      overdueTasks: 10,
    },
    {
      id: 2,
      checklistName: "Data Handling Audit",
      dueDate: "20 December 2024",
      totalTasks: 10,
      overdueTasks: 10,
    },
    {
      id: 3,
      checklistName: "Incident Response Plan",
      dueDate: "15 March 2025",
      totalTasks: 20,
      overdueTasks: 10,
    },
  ];

  const reportsData = [
    {
      taskName: "Draft Policy Update",
      assignee: "Ali Khan",
      dueDate: "05 December 2025",
      completedOn: "05 December 2025",
      completed: "On Time",
    },
    {
      taskName: "Stakeholder Sign-Off",
      assignee: "Sara Ahmed",
      dueDate: "05 December 2025",
      completedOn: "05 December 2025",
      completed: "Overdue",
    },
    {
      taskName: "Stakeholder Sign-Off",
      assignee: "Sara Ahmed",
      dueDate: "05 December 2025",
      completedOn: "05 December 2025",
      completed: "Overdue",
    },
    {
      taskName: "Stakeholder Sign-Off",
      assignee: "Sara Ahmed",
      dueDate: "05 December 2025",
      completedOn: "05 December 2025",
      completed: "Overdue",
    },
    {
      taskName: "Stakeholder Sign-Off",
      assignee: "Sara Ahmed",
      dueDate: "05 December 2025",
      completedOn: "05 December 2025",
      completed: "Overdue",
    },
  ];
  const columns = useMemo(
    () => [
      {
        title: t("Task-Name"),
        dataIndex: "taskName",
        key: "taskName",
        width: "12%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("assignee"),
        dataIndex: "assignee",
        key: "assignee",
        width: "35%",
        ellipsis: true,
        align: "start",
        render: (text) => <span>{text}</span>,
      },

      {
        title: t("Due-date"),
        dataIndex: "dueDate",
        key: "dueDate",
        width: "13%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("completed-on"),
        dataIndex: "completedOn",
        key: "completedOn",
        width: "13%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("completed"),
        dataIndex: "completed",
        key: "completed",
        width: "13%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },
    ],
    [reportList, t],
  );
  return (
    <>
      <div className={styles.mainDivComplianceStanding}>
        <Row className="align-items-center">
          {/* Back Button */}
          <Col xs="auto">
            <img
              src={BackButton}
              alt="BackButton"
              onClick={() => setEndOfComplianceReport(false)}
            />
          </Col>

          {/* Report Type */}
          <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
            <img src={Verification} alt="Verification" />
            <div>
              <label>Report Type:</label>
              <p>End of Compliance</p>
            </div>
          </Col>

          {/* Generated Date */}
          <Col
            lg={4}
            xs="auto"
            className={`${styles.iconTextWrapper} d-flex justify-content-center`}
          >
            <img src={ComplianceCalendar} alt="ComplianceCalendar" />
            <div>
              <label>Generated Date:</label>
              <p>15 January 2025</p>
            </div>
          </Col>

          {/* ReportDetail Bar */}
          <Col lg={4} xs={4}>
            <div className={styles.reportDetailsBar}>
              <span>
                This compliance was Re-opened 1 times
                <CustomButton
                  text="Reopen Details"
                  className={styles.reportDetailButton}
                />
              </span>
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
              <label>Compliance Title:</label>
              <p className={styles.longTitle}>
                Implementation of End-to-End Data Encryption Across All Internal
                Systems, External Communication
              </p>

              <div className={styles.metaRow}>
                <div>
                  <span>Created on</span>
                  <p>13 June 2025</p>
                </div>
                <div>
                  <span>Completion date</span>
                  <p>13 July 2025</p>
                </div>
                <div>
                  <span>Due Date</span>
                  <p>12 July 2025</p>
                </div>
                <div>
                  <span>Total Checklists</span>
                  <p>14</p>
                </div>
                <div>
                  <span>Total Tasks</span>
                  <p>216</p>
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
                  <h2>58%</h2>
                  <p>
                    Complete
                    <br />
                    On Time
                  </p>
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
              </div>
            </div>
          </Col>
        </Row>

        {/* Compliance Table */}
        <div className={styles.tableWrapper}>
          {/* 🔹 STATIC HEADER */}
          <div className={styles.tableHeader}>
            <div>Checklist Name</div>
            <div>Due Date</div>
            <div>No. of Tasks</div>
            <div>Overdue Tasks</div>
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
                    <div className={styles.nameCol}>{item.checklistName}</div>
                    <div>{item.dueDate}</div>
                    <div>{item.totalTasks}</div>
                    <div>{item.overdueTasks}</div>
                  </div>
                }
              >
                {/* EXPANDED CONTENT */}
                <div className={styles.panelContent}>
                  <div className={styles.insideAccordianTable}>
                    <CustomTable
                      rows={reportsData}
                      column={columns}
                      // scroll={{ x: "scroll", y: 550 }}
                      pagination={false}
                      // onChange={handleChangeReportSorter}
                    />
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

export default EndOfComplianceReport;
