import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./EndOfComplianceReport.module.css";
import { Col, Row, Tooltip } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Spin } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";
import CustomTable from "../../../../../components/elements/table/Table";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useSelector } from "react-redux";
import {
  formatDateToYMD,
  getDynamicFileName,
} from "../../../CommonComponents/commonFunctions";
import { useTranslation } from "react-i18next";
import ReopenOrOnHoldDetailsModal from "../../../CommonComponents/ReopenOrOnHoldDetailsModal";
import ReopenOrOnHoldDetailsModalECR from "./ReopenOrOnHoldDetailsModalECR";

const { Panel } = Collapse;

/** Static donut chart data — values are fixed and do not depend on any state. */
const donutData = [
  ["Task Status", "Count"],
  ["Tasks Completed On Time", 100],
  ["Tasks Completed Late", 0],
];

/** Static donut chart display options hoisted to module level. */
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
  tooltip: { trigger: "none" },
  pieSliceBorderColor: "transparent",
  pieSliceTextStyle: { fontSize: 0 },
  slices: {
    0: { offset: 0 },
    1: { offset: 0 },
  },
};

/** Static PDF generation options hoisted to module level. */
const pdfOptions = {
  method: "save",
  filename: getDynamicFileName("End Of Compliance"),

  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: "A4",
    orientation: "landscape",
  },
  canvas: {
    mimeType: "image/png",
    qualityRatio: 1,
  },
  overrides: {
    pdf: {
      compress: true,
    },
    canvas: {
      useCORS: true,
    },
  },
};

/** Returns the DOM element used as the PDF render target. */
const getTargetElement = () => document.getElementById("content-id");

/**
 * EndOfComplianceReport component.
 * Renders a detailed end-of-compliance report with chart, checklist table,
 * and PDF download capability.
 */
const EndOfComplianceReport = () => {
  const { t } = useTranslation();
  const {
    setShowViewCompliance,
    endOfComplianceReport,
    isViewDetailsOpen,
    setIsViewDetailsOpen,
    setEndOfComplianceReport,
    autoPdfDownload,
    setAutoPdfDownload,
  } = useComplianceContext();

  const GetEndOfComplianceReport = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetEndOfComplianceReport
  );
  const count = GetEndOfComplianceReport?.complianceSummary?.reopenCount || 0;

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  useEffect(() => {
    if (autoPdfDownload && GetEndOfComplianceReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetEndOfComplianceReport]);

  const columns = useMemo(
    () => [
      {
        title: t("Task-name"),
        dataIndex: "taskName",
        key: "taskName",
        width: "30%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("Assignee"),
        dataIndex: "assignee",
        key: "assignee",
        width: "20%",
        ellipsis: true,
        align: "left",
        render: (text) => <span>{text}</span>,
      },

      {
        title: t("Due-date"),
        dataIndex: "dueDate",
        key: "dueDate",
        width: "15%",
        ellipsis: true,
        align: "center",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("Completed-on"),
        dataIndex: "completedOn",
        key: "completedOn",
        width: "15%",
        ellipsis: true,
        align: "center",
        render: (text) => <span>{text}</span>,
      },
      {
        title: t("Completed"),
        dataIndex: "completed",
        key: "completed",
        width: "10%",
        ellipsis: true,
        align: "center",
        render: (text) => <span>{text}</span>,
      },
    ],
    [t]
  );

  /**
   * Maps raw task objects from the API into table row shape.
   * @param {Array} tasks - Array of task objects from the compliance report.
   * @returns {Array} Rows formatted for CustomTable.
   */
  const mapTasksToRows = useCallback((tasks = []) => {
    return tasks.map((task) => ({
      taskName: task.taskTitle,
      assignee: task.assigneeName,
      dueDate: formatDateToYMD(task.taskDueDate),
      completedOn: formatDateToYMD(task.taskCompletedOn),
      completed: task.completionStatus,
    }));
  }, []);

  const handleAutoDownload = async () => {
    try {
      setIsGenerating(true);
      setShowPdfLayout(true);

      await new Promise((r) => setTimeout(r, 300));
      await document.fonts.ready;

      await generatePDF(getTargetElement, pdfOptions);

      // After Download Close Report
      setEndOfComplianceReport(false);
      setAutoPdfDownload(false);
    } catch (error) {
      console.error(error);
    } finally {
      setShowPdfLayout(false);
      setIsGenerating(false);
    }
  };

  /**
   * Triggers PDF generation and download when the user clicks the Download button.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleClickGenerateODF = useCallback(async () => {
    try {
      setIsGenerating(true); // spinner ON
      setShowPdfLayout(true); // show PDF layout
      await new Promise((r) => setTimeout(r, 100)); // allow DOM render

      await document.fonts.ready;
      await generatePDF(getTargetElement, pdfOptions);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setShowPdfLayout(false); // hide PDF layout
      setIsGenerating(false); // spinner OFF
    }
  }, []);

  // To Show Reopen View Detail Bar when Reopen or Hold status coming
  const shouldShowReopenSection = useMemo(() => {
    const history = GetEndOfComplianceReport?.complianceStatusChangeHistory;

    if (!Array.isArray(history) || history.length === 0) return false;

    return history.some(
      (item) => item?.toStatus?.statusId === 6 || item?.toStatus?.statusId === 7
    );
  }, [GetEndOfComplianceReport?.complianceStatusChangeHistory]);

  /**
   * Opens the reopen/on-hold details modal.
   */
  const handleOpenReopenModal = useCallback(() => {
    setIsViewDetailsOpen(true);
  }, [setIsViewDetailsOpen]);

  return (
    <>
      <div className={styles.mainDivComplianceStanding}>
        <Spin
          spinning={isGenerating}
          size="large"
          tip={autoPdfDownload ? "Downloading PDF..." : "Generating PDF..."}
          className="d-flex justify-content-center align-items-center"
        >
          {!showPdfLayout && (
            <div>
              <Row className="align-items-center">
                {/* Back Button */}
                <Col xs="auto">
                  <img
                    src={BackButton}
                    className={styles.goBackButton}
                    alt="BackButton"
                    onClick={() => setEndOfComplianceReport(false)}
                  />
                </Col>

                {/* Report Type */}
                <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type")}:</label>
                    <p>
                      {GetEndOfComplianceReport?.header?.reportType ||
                        "End of Compliance"}
                    </p>
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
                      ) || "-"}
                    </p>
                  </div>
                </Col>

                {/* ReportDetail Bar */}
                <Col lg={4} xs={4}>
                  {shouldShowReopenSection && (
                    <div className={styles.reportDetailsBar}>
                      <span>
                        {t("This-compliance-was-Re-opened", { count })}
                        <CustomButton
                          text="Reopen Details"
                          className={styles.reportDetailButton}
                          onClick={handleOpenReopenModal}
                        />
                      </span>
                    </div>
                  )}
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
                      {GetEndOfComplianceReport?.complianceSummary
                        ?.complianceTitle || "No Compliance Title"}
                    </p>

                    <div className={styles.metaRow}>
                      <div>
                        <span>{t("Created-on")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceCreatedDate
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("Completion-date")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceCompletionDate
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("Due-date")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetEndOfComplianceReport?.complianceSummary
                              ?.complianceDueDate
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("Total-checklists")}:</span>
                        <p className={styles["AlignCenterChecklist"]}>
                          {GetEndOfComplianceReport?.complianceSummary
                            ?.totalChecklists || 0}
                        </p>
                      </div>
                      <div>
                        <span>{t("Total-tasks")}:</span>
                        <p className={styles["AlignCenterChecklist"]}>
                          {GetEndOfComplianceReport?.complianceSummary
                            ?.totalTasks || 0}
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
                        options={{ ...donutOptions, legend: "none" }}
                      />

                      {/* Center Label */}
                      <div className={styles.centerLabel}>
                        <h2>
                          {GetEndOfComplianceReport?.complianceSummary
                            ?.completedOnTimePercent || 0}
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
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotBlue}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-on-time")} (
                          {GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedOnTime || 0}
                          )
                        </span>{" "}
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotYellow}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-late")} (
                          {GetEndOfComplianceReport?.complianceSummary
                            ?.tasksCompletedLate || 0}
                          )
                        </span>{" "}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Checklist-name")}</div>
                  <div>{t("Due-date")}</div>
                  <div>{t("No-of-tasks")}</div>
                  <div>{t("Overdue-tasks")}</div>
                </div>

                {/* COLLAPSE ROWS */}
                <Collapse
                  bordered={false}
                  expandIconPosition="end"
                  expandIcon={({ isActive }) => (
                    <DownOutlined rotate={isActive ? 180 : 0} />
                  )}
                  className={styles.collapseWrapper}
                >
                  {!GetEndOfComplianceReport?.checklists?.length ? (
                    <div className={styles.NoDataFoundTable}>
                      <div className={`${styles.nodatafound_subHeading}`}>
                        {t("No-Checklist-Found")}
                      </div>
                    </div>
                  ) : (
                    GetEndOfComplianceReport?.checklists?.map((item) => (
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
                              pagination={false}
                              // className={"Compliance_Table Report_Table  mt-3"}
                              className={
                                "End_of_compliance_table  End_of_compliance_Report   mt-3"
                              }
                            />
                          </div>
                        </div>
                      </Panel>
                    ))
                  )}
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
              <Row className={`${styles.ComplianceSection} mt-4 `}>
                <Col lg={8} className="d-flex flex-column h-100">
                  <Row className="align-items-stretch">
                    <Col lg={5} xs="auto" className="d-flex flex-column ">
                      <div className={styles.topLabel}>
                        <label className={styles.ComplianceReportHeadings}>
                          {t("Criticalityy")}: {""}
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.criticality
                          }
                        </label>
                      </div>

                      <div className={styles.iconTextWrapperPDFDownload}>
                        <img src={Verification} alt="Verification" />
                        <div>
                          <label>{t("Report-type")}:</label>
                          <p>{GetEndOfComplianceReport?.header?.reportType}</p>
                        </div>
                      </div>
                    </Col>

                    <Col lg={4} xs="auto" className="d-flex flex-column ">
                      <div className="d-flex flex-column h-100">
                        <div className={styles.topLabel}>
                          <label className={styles.ComplianceReportHeadings}>
                            {t("Authority")}:{" "}
                            {
                              GetEndOfComplianceReport?.complianceSummary
                                ?.authorityName
                            }
                          </label>
                        </div>
                        <div
                          className={`${styles.iconTextWrapperPDFDownload} `}
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
                      </div>
                    </Col>
                    <Col lg={3} className="d-flex flex-column ">
                      {" "}
                      <div className={styles.topLabel}>
                        <label className={styles.ComplianceReportHeadings}>
                          {t("Reopen")}:{" "}
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.reopenCount
                          }{" "}
                          {t("Times")}
                        </label>
                      </div>
                      <div className={`${styles.iconTextWrapperPDFDownload} `}>
                        <div>
                          <label>{t("Total-checklists")}:</label>
                          <p className={styles["AlignCenterChecklist"]}>
                            {
                              GetEndOfComplianceReport?.complianceSummary
                                ?.totalChecklists
                            }
                          </p>
                        </div>
                        <div>
                          <label>{t("Total-tasks")}:</label>
                          <p className={styles["AlignCenterChecklist"]}>
                            {
                              GetEndOfComplianceReport?.complianceSummary
                                ?.totalTasks
                            }
                          </p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  {/*  */}
                  <Row
                    className={`${styles.iconTextWrapperPDFDownloadRowTwo} mx-1  mt-4`}
                  >
                    <Col xs="auto" lg={1}>
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                    </Col>
                    <Col lg={3} xs="auto" className={` `}>
                      <label>{t("Created-on")}:</label>
                      <p>
                        {formatDateToYMD(
                          GetEndOfComplianceReport?.complianceSummary
                            ?.complianceCreatedDate
                        )}
                      </p>
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
                  {/*  */}
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
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotBlue}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-on-time")} (
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.tasksCompletedOnTime
                          }
                          )
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotYellow}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-late")} (
                          {
                            GetEndOfComplianceReport?.complianceSummary
                              ?.tasksCompletedLate
                          }
                          )
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-3`}
                >
                  <p className={styles.complianceInThisReportTitleDownload}>
                    {t("Checklists-in-this-report")}
                  </p>
                </Col>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-3`}
                >
                  <p className={styles.checklistTitleList}>
                    {GetEndOfComplianceReport?.checklists.map(
                      (check, index) => (
                        <p>
                          {index + 1}. {check.checklistTitle}
                        </p>
                      )
                    )}
                  </p>
                </Col>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-3`}
                >
                  <div className={styles.titleSectionDownload}>
                    <label>{t("Compliance-title")}:</label>
                    <p className={styles.longTitleDownload}>
                      {`1.${
                        GetEndOfComplianceReport?.complianceSummary
                          ?.complianceTitle || "No Compliance Title"
                      }`}
                    </p>
                  </div>
                </Col>

                {GetEndOfComplianceReport?.checklists.map((checklist) => (
                  <Col
                    key={checklist.checklistID}
                    lg={12}
                    xs="auto"
                    className={styles.checklist_report}
                  >
                    <div className={styles.panelContent}>
                      <div className={styles.titleSectionDownload}>
                        <label className={styles.ChecklistTitle}>
                          {t("Checklists-title")}:
                        </label>
                        <p className={styles.longTitleHeading}>
                          {checklist.checklistTitle}
                        </p>
                      </div>

                      {checklist?.tasks?.map((task) => (
                        <div key={task.taskID}>
                          <div className={styles.insideAccordianTable}>
                            <Row>
                              <Col lg={12} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Task-title")}:</label>

                                  <p>{task.taskTitle}</p>
                                </div>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={4} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Assignee")}:</label>
                                  <p>{task.assigneeName || "-"}</p>
                                </div>
                              </Col>{" "}
                              <Col lg={2} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Due-date")}:</label>
                                  <p>{formatDateToYMD(task.taskDueDate)}</p>
                                </div>
                              </Col>
                              <Col lg={2} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Completed-on")}:</label>
                                  <p>
                                    {formatDateToYMD(task.taskCompletedOn) ||
                                      "-"}
                                  </p>
                                </div>
                              </Col>
                              <Col lg={2} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Completed")}:</label>
                                  <p>{task.taskStatus}</p>
                                </div>
                              </Col>
                              <Col lg={2} xs="auto">
                                <div
                                  className={styles.insideAccordianMainHeading}
                                >
                                  <label>{t("Status")}:</label>
                                  <p>{task.taskStatus}</p>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Spin>
      </div>

      {isViewDetailsOpen && <ReopenOrOnHoldDetailsModalECR />}
    </>
  );
};

export default EndOfComplianceReport;
