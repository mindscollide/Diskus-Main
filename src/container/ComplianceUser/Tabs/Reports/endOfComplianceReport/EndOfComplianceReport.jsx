import React, { useMemo, useState } from "react";
import styles from "./EndOfComplianceReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Spin } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";
import { t } from "i18next";
import CustomTable from "../../../../../components/elements/table/Table";
import generatePDF, { Resolution, Margin } from "react-to-pdf";

const { Panel } = Collapse;

const EndOfComplianceReport = () => {
  const { endOfComplianceReport, setEndOfComplianceReport, reportList } =
    useComplianceContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  const checkListsReport = [
    {
      id: 1,
      list: "Strengthening Ethical Practices and Upholding Regulatory Compliance Standards Across All Business",
    },
    {
      id: 2,
      list: "Upholding Ethical Standards and Regulatory Compliance Across All Business Operations",
    },
    {
      id: 3,
      list: "Promoting Ethical Conduct and Ensuring Regulatory Compliance in All Business Functions",
    },
    {
      id: 4,
      list: "Strengthening Business Integrity Through Ethical Practices and Compliance",
    },
    {
      id: 5,
      list: "Ensuring Transparency and Accountability Across All Business Practices",
    },
    {
      id: 6,
      list: "Embedding Ethical Responsibility and Regulatory Compliance Across Operations",
    },
    {
      id: 7,
      list: "Fostering Ethical Leadership and Compliance-Driven Culture",
    },
    { id: 8, list: "Implementing Robust Policies for Regulatory Adherence" },
  ];

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

  const options = {
    // default is `save`
    method: "save",
    filename: "End-Of-Compliance.pdf",
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
    try {
      setIsGenerating(true); // spinner ON
      setShowPdfLayout(true); // show PDF layout
      await new Promise((r) => setTimeout(r, 100)); // allow DOM render

      await document.fonts.ready;
      await generatePDF(getTargetElement, options);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setShowPdfLayout(false); // hide PDF layout
      setIsGenerating(false); // spinner OFF
    }
  };

  return (
    <>
      <div className={styles.mainDivComplianceStanding}>
        <Spin
          spinning={isGenerating}
          size="large"
          tip="Generating PDF..."
          className="d-flex justify-content-center align-items-center"
        >
          {!showPdfLayout && (
            <div>
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
                    loading={isGenerating}
                    onClick={handleClickGenerateODF}
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
                      Implementation of End-to-End Data Encryption Across All
                      Internal Systems, External Communication
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
                          <div className={styles.nameCol}>
                            {item.checklistName}
                          </div>
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
          )}

          {showPdfLayout && (
            <div id="content-id">
              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <div>
                    <label>Compliance Title:</label>
                    <p>
                      Implementation of End-to-End Data Encryption Across All
                      Internal Systems, External Communication
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className={`${styles.ComplianceSection} mt-4`}>
                <Col lg={8}>
                  <Row className="align-items-center">
                    <Col lg={4} xs="auto">
                      <label className={styles.ComplianceReportHeadings}>
                        Criticality: Medium
                      </label>
                      <div className={styles.iconTextWrapperPDFDownload}>
                        <img src={Verification} alt="Verification" />
                        <div>
                          <label>Report Type:</label>
                          <p>End of Compliance</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={5} xs="auto">
                      <label className={styles.ComplianceReportHeadings}>
                        Authority: PCI DSS
                      </label>
                      <div
                        className={`${styles.iconTextWrapperPDFDownload} d-flex `}
                      >
                        <img
                          src={ComplianceCalendar}
                          alt="ComplianceCalendar"
                        />
                        <div>
                          <label>Generated Date:</label>
                          <p>15 november 2025</p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={3}>
                      {" "}
                      <label className={styles.ComplianceReportHeadings}>
                        Reopen: 06 Times
                      </label>
                      <div
                        className={`${styles.iconTextWrapperPDFDownload} d-flex `}
                      >
                        <div>
                          <label>Total Checklists:</label>
                          <p>14</p>
                        </div>
                        <div>
                          <label>Total Tasks:</label>
                          <p>216</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row
                    className={`${styles.iconTextWrapperPDFDownload} mx-1 mt-4`}
                  >
                    <Col
                      lg={4}
                      xs="auto"
                      className={`${styles.iconTextWrapperPDFDownload} d-flex gap-2 `}
                    >
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />

                      <div>
                        <label>Created on:</label>
                        <p>15 November 2024</p>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <label>Completion Date:</label>
                      <p>05 December 2024</p>
                    </Col>
                    <Col lg={3}>
                      <label>Due Date:</label>
                      <p>15 December 2024</p>
                    </Col>
                  </Row>
                </Col>
                <Col lg={4}>
                  <div className={styles.chartFlexDownloadedPdf}>
                    <div className={styles.chartBoxDownloadedPdf}>
                      <Chart
                        chartType="PieChart"
                        width="100%"
                        height="200px"
                        data={donutData}
                        options={{ ...donutOptions, legend: "none" }}
                      />

                      <div className={styles.centerLabel}>
                        <h2>58%</h2>
                        <p>
                          Complete
                          <br />
                          On Time
                        </p>
                      </div>
                    </div>

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

              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <p>Checklists in this report:</p>
                </Col>
                {checkListsReport.map((item, index) => (
                  <Col
                    key={item.id}
                    lg={12}
                    xs="auto"
                    className={`${styles.checklist_report}  `}
                  >
                    {index + 1}.{item.list}
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default EndOfComplianceReport;
