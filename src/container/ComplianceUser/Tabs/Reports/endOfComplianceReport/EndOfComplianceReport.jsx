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
import { useSelector } from "react-redux";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import { useTranslation } from "react-i18next";

const { Panel } = Collapse;

const EndOfComplianceReport = () => {
  const { t } = useTranslation();
  const { endOfComplianceReport, setEndOfComplianceReport, reportList } =
    useComplianceContext();

  const GetEndOfComplianceReport = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetEndOfComplianceReport
  );

  console.log(
    GetEndOfComplianceReport,
    "GetEndOfComplianceReportGetEndOfComplianceReport"
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  const donutData = [
    ["Task Status", "Count"],
    ["Tasks Completed On Time", 100],
    ["Tasks Completed Late", 0],
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
    colors: ["#6272D6"],
    tooltip: { text: "percentage" },
  };

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
    [reportList, t]
  );

  const mapTasksToRows = (tasks = []) => {
    return tasks.map((task) => ({
      taskName: task.taskTitle,
      assignee: task.assigneeName,
      dueDate: formatDateToYMD(task.taskDueDate),
      completedOn: formatDateToYMD(task.taskCompletedOn),
      completed: task.completionStatus,
    }));
  };

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
                    <label>{t("Report-type")}:</label>
                    <p>{GetEndOfComplianceReport?.header?.reportType}</p>
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
                    <label>{t("Generated-date")}:</label>
                    <p>
                      {formatDateToYMD(
                        GetEndOfComplianceReport?.header?.generatedOn
                      )}
                    </p>
                  </div>
                </Col>

                {/* ReportDetail Bar */}
                <Col lg={4} xs={4}>
                  <div className={styles.reportDetailsBar}>
                    <span>
                      {t("This-compliance-was-Re-opened-1-times")}
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
                    <label> {t("Compliance-title")}:</label>

                    <p className={styles.longTitle}>
                      {
                        GetEndOfComplianceReport?.complianceSummary
                          ?.complianceTitle
                      }
                    </p>

                    <div className={styles.metaRow}>
                      <div>
                        <span>{t("Created-on")}</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceCreatedDate
                          )}
                        </p>
                      </div>
                      <div>
                        <span>{t("Completion-date")}</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceCompletionDate
                          )}
                        </p>
                      </div>
                      <div>
                        <span>{t("Due-date")}</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceDueDate
                          )}
                        </p>
                      </div>
                      <div>
                        <span>{t("Total-checklists")} </span>
                        <p>
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.totalChecklists
                          }
                        </p>
                      </div>
                      <div>
                        <span>{t("Total-tasks")}</span>
                        <p>
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.totalTasks
                          }
                        </p>
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
                        <h2>
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.completedOnTimePercent
                          }
                          %
                        </h2>
                        <p>
                          {t("Complete ")}
                          <br />
                          {t("On-time")}
                        </p>
                      </div>
                    </div>

                    {/* Custom Legend (VERTICALLY CENTERED) */}
                    <div className={styles.customLegend}>
                      <div>
                        <span className={styles.legendDotBlue}></span>
                        {t("Tasks-completed-on-time")} (
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedOnTime
                        }
                        )
                      </div>
                      <div>
                        <span className={styles.legendDotYellow}></span>
                        {t("Tasks-completed-late")} (
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedLate
                        }
                        )
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* 🔹 STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Checklist-name")}</div>
                  <div> {t("Due-date")}</div>
                  <div> {t("No-of-tasks")}</div>
                  <div> {t("Overdue-tasks")}</div>
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
                  {GetEndOfComplianceReport?.checklists?.map((item) => (
                    <Panel
                      key={item.checklistID}
                      header={
                        <div className={styles.tableRow}>
                          <div className={styles.nameCol}>
                            {item.checklistTitle}
                          </div>
                          <div>{formatDateToYMD(item.checklistDueDate)}</div>
                          <div>{item.completedTasks}</div>
                          <div>{item.overdueTasks}</div>
                        </div>
                      }
                    >
                      {/* EXPANDED CONTENT */}
                      <div className={styles.panelContent}>
                        <div className={styles.insideAccordianTable}>
                          <CustomTable
                            rows={mapTasksToRows(item?.tasks)}
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
                    <label>{t("Compliance-title")}:</label>
                    <p>
                      {
                        GetEndOfComplianceReport?.complianceSummary
                          ?.complianceTitle
                      }
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className={`${styles.ComplianceSection} mt-4`}>
                <Col lg={8}>
                  <Row className="align-items-center">
                    <Col lg={4} xs="auto">
                      <label className={styles.ComplianceReportHeadings}>
                        {t("Criticalityy")}:
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.criticality
                        }
                      </label>
                      <div className={styles.iconTextWrapperPDFDownload}>
                        <img src={Verification} alt="Verification" />
                        <div>
                          <label>{t("Report-type")}:</label>
                          <p>{GetEndOfComplianceReport?.header?.reportType}</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={5} xs="auto">
                      <label className={styles.ComplianceReportHeadings}>
                        {t("Authority")}:{" "}
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.authorityName
                        }
                      </label>
                      <div
                        className={`${styles.iconTextWrapperPDFDownload} d-flex `}
                      >
                        <img
                          src={ComplianceCalendar}
                          alt="ComplianceCalendar"
                        />
                        <div>
                          <label>{t("Generated-date")}:</label>
                          <p>
                            {formatDateToYMD(
                              GetEndOfComplianceReport?.header?.generatedOn
                            )}
                          </p>
                        </div>
                      </div>
                    </Col>
                    <Col lg={3}>
                      {" "}
                      <label className={styles.ComplianceReportHeadings}>
                        {t("Reopen")}:{" "}
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.reopenCount
                        }{" "}
                        {t("Times")}
                      </label>
                      <div
                        className={`${styles.iconTextWrapperPDFDownload} d-flex `}
                      >
                        <div>
                          <label>{t("Total-checklists")}:</label>
                          <p>
                            {
                              GetEndOfComplianceReport?.complianceSummary
                                ?.totalChecklists
                            }
                          </p>
                        </div>
                        <div>
                          <label>{t("Total-tasks")}:</label>
                          <p>
                            {
                              GetEndOfComplianceReport?.complianceSummary
                                ?.totalTasks
                            }
                          </p>
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
                        <label>{t("Created-on")}:</label>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceCreatedDate
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col lg={3}>
                      <label>{t("Completion-date")}:</label>
                      <p>
                        {formatDateToYMD(
                          GetEndOfComplianceReport?.complianceSummary
                            ?.complianceCompletionDate
                        )}
                      </p>
                    </Col>
                    <Col lg={3}>
                      <label>{t("Due-date")}:</label>
                      <p>
                        {" "}
                        {formatDateToYMD(
                          GetEndOfComplianceReport?.complianceSummary
                            ?.complianceDueDate
                        )}
                      </p>
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
                        <h2>
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.completedOnTimePercent
                          }
                          %
                        </h2>
                        <p>
                          {t("Complete ")}
                          <br />
                          {t("On-time")}
                        </p>
                      </div>
                    </div>

                    <div className={styles.customLegend}>
                      <div>
                        <span className={styles.legendDotBlue}></span>
                        {t("Tasks-completed-on-time")} (
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedOnTime
                        }
                        )
                      </div>
                      <div>
                        <span className={styles.legendDotYellow}></span>
                        {t("Tasks-completed-late")} (
                        {
                          GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedLate
                        }
                        )
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
                  <p>{t("Checklists-in-this-report")}:</p>
                </Col>

                {GetEndOfComplianceReport?.checklists.map((checklist) => (
                  <div key={checklist.checklistID}>
                    {checklist?.tasks?.map((task, index) => (
                      <Col
                        key={task.taskID}
                        lg={12}
                        xs="auto"
                        className={`${styles.checklist_report}  `}
                      >
                        {index + 1}.{task.taskDescription}
                      </Col>
                    ))}
                  </div>
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
