import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./AccumulativeReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import dairaStudioLogo from "./../../../../../assets/images/Daira-Logo.png";
import { DatePicker, Collapse, Progress, Tooltip, Spin } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  formatDateToYMD,
  getDynamicFileName,
} from "../../../CommonComponents/commonFunctions";
import generatePDF, { Margin, Resolution } from "react-to-pdf";

const { Panel } = Collapse;

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
  colors: ["#6172D6", "#FFC300", "#f16b6b"],
  tooltip: { trigger: "none" },
};

// const getDynamicFileName = () => {
//   const now = new Date();

//   const date = now.toISOString().slice(0, 10); // YYYY-MM-DD
//   const time = now.toTimeString().slice(0, 8).replace(/:/g, "-"); // HH-MM-SS

//   return `Accumulative Report ${date} ${time}.pdf`;
// };

/** Static PDF generation options hoisted to module level. */
const pdfOptions = {
  method: "save",
  // filename: "Accumulative Report.pdf",
  filename: getDynamicFileName("Accumulative Report"),
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
 * AccumulativeReport component.
 * Renders an accumulative compliance report with chart, compliance table,
 * and PDF download capability.
 */
const AccumulativeReport = () => {
  const { t } = useTranslation();
  const {
    accumulativeReport,
    setAccumulativeReport,
    autoPdfDownload,
    setAutoPdfDownload,
  } = useComplianceContext();
  const GetAccumulativeReport = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetAccumulativeReport
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  useEffect(() => {
    if (autoPdfDownload && GetAccumulativeReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetAccumulativeReport]);

  /**
   * Donut chart data derived from the accumulative report API response.
   */
  const donutData = useMemo(
    () => [
      ["Task Status", "Count"],
      [
        "Tasks Completed On Time",
        GetAccumulativeReport?.header?.tasksCompletedOnTime || 0,
      ],
      [
        "Tasks Completed Late",
        GetAccumulativeReport?.header?.tasksCompletedLate || 0,
      ],
      [
        "Pending or Overdue Tasks",
        GetAccumulativeReport?.header?.tasksPending || 0,
      ],
    ],
    [
      GetAccumulativeReport?.header?.tasksCompletedOnTime,
      GetAccumulativeReport?.header?.tasksCompletedLate,
      GetAccumulativeReport?.header?.tasksPending,
    ]
  );

  const handleAutoDownload = async () => {
    try {
      setIsGenerating(true);
      setShowPdfLayout(true);

      await new Promise((r) => setTimeout(r, 300));
      await document.fonts.ready;

      await generatePDF(getTargetElement, pdfOptions);

      // After Download Close Report
      setAccumulativeReport(false);
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
                    className={styles.goBackButton}
                    onClick={() => setAccumulativeReport(false)}
                  />
                </Col>

                {/* Report Type */}
                <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type")}:</label>
                    <p>
                      {GetAccumulativeReport?.header?.reportTypeName ||
                        "Accumulative"}
                    </p>
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
                    <label>{t("Generated-date")}:</label>
                    <p>
                      {formatDateToYMD(
                        GetAccumulativeReport?.header?.generatedOn
                      ) || "-"}
                    </p>
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
                    <label>{t("Quarter")}:</label>
                    <p className={styles.longTitle}>
                      {GetAccumulativeReport?.header?.reportTitle ||
                        "No Accumulative Title"}
                    </p>
                    <div className={styles.metaRow}>
                      <div>
                        <span>{t("Start-dates")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetAccumulativeReport?.header?.quarterStartDate
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("End-dates")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetAccumulativeReport?.header?.quarterEndDate
                          ) || "-"}
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
                          {GetAccumulativeReport?.header
                            ?.overallCompletionPercent || 0}
                          %
                        </h2>
                        <p>{t("Complete ")}</p>
                      </div>
                    </div>

                    {/* Custom Legend (VERTICALLY CENTERED) */}
                    <div className={styles.customLegend}>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotBlue}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-on-time")} (
                          {GetAccumulativeReport?.header
                            ?.tasksCompletedOnTime || 0}
                          )
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotYellow}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-late")} (
                          {GetAccumulativeReport?.header?.tasksCompletedLate ||
                            0}
                          )
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendOrange}></span>
                        <span className={styles.legendText}>
                          {t("Pending-or-overdue-tasks")} (
                          {GetAccumulativeReport?.header?.tasksPending || 0})
                        </span>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}</div>
                  <div className="text-center">{t("Due-date")}</div>
                  <div className="text-center">{t("Total-checklists")}</div>
                  <div className="text-center">{t("No-of-tasks")}</div>
                  <div className="text-center">{t("Completed-tasks")}</div>
                  <div className="text-center">{t("Overdue-tasks")} </div>
                  <div className="text-center">{t("Progress")}</div>
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
                  {!GetAccumulativeReport?.compliances?.length ? (
                    <div className={styles.NoDataFoundTable}>
                      <div className={`${styles.nodatafound_subHeading}`}>
                        {t("No-data-Found")}
                      </div>
                    </div>
                  ) : (
                    GetAccumulativeReport?.compliances?.map((item) => (
                      <Panel
                        key={item.complianceID}
                        header={
                          <div className={styles.tableRow}>
                            <div className={styles.nameCol}>
                              <Tooltip title={item.complianceTitle}>
                                {item.complianceTitle}
                              </Tooltip>
                            </div>

                            <div className="text-center">
                              {formatDateToYMD(item.complianceDueDate)}
                            </div>
                            <div className="text-center">
                              {item.totalChecklists}
                            </div>
                            <div className="text-center">{item.totalTasks}</div>
                            <div className="text-center">
                              {item.completedTasks}
                            </div>
                            <div className="text-center">
                              {item.tasksOverdue}
                            </div>
                            <div className="text-center">
                              {`${item.progressPercent}${"%"}`}
                            </div>
                          </div>
                        }
                      >
                        {/* EXPANDED CONTENT */}

                        <div className={styles.MainAccordianTable}>
                          {!item?.checklists?.length ? (
                            <div className={styles.NoDataFoundTable}>
                              <div
                                className={`${styles.nodatafound_subHeading}`}
                              >
                                {t("No-Checklist-Found")}
                              </div>
                            </div>
                          ) : (
                            item?.checklists?.map((checklistItem) => (
                              <div
                                key={checklistItem.checklistID}
                                className={styles.panelContent}
                              >
                                <div className={styles.titleSection}>
                                  <label className={styles.ChecklistTitle}>
                                    {t("Checklists-title")}:
                                  </label>
                                  <p className={styles.longTitle}>
                                    {checklistItem.checklistTitle || "-"}
                                  </p>
                                </div>
                                {!checklistItem?.tasks?.length ? (
                                  <div className={styles.NoDataFoundTable}>
                                    <div
                                      className={`${styles.nodatafound_subHeading}`}
                                    >
                                      {t("No-Checklist-Task")}
                                    </div>
                                  </div>
                                ) : (
                                  checklistItem?.tasks?.map((taskItem) => (
                                    <div
                                      key={taskItem.taskID}
                                      className={styles.insideAccordianTable}
                                    >
                                      <Row>
                                        <Col lg={12} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianMainHeading
                                            }
                                          >
                                            {" "}
                                            <label>{t("Task-title")}:</label>
                                            <Tooltip title={taskItem.taskTitle}>
                                              <p>{taskItem.taskTitle || "-"}</p>
                                            </Tooltip>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col lg={4} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Assignee")}:</label>
                                            <p>
                                              {" "}
                                              {taskItem.assigneeName || "-"}
                                            </p>
                                          </div>
                                        </Col>{" "}
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Due-date")}:</label>
                                            <p>
                                              {" "}
                                              {formatDateToYMD(
                                                taskItem.taskDueDate
                                              ) || "-"}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Completed-on")}:</label>
                                            <p>
                                              {" "}
                                              {formatDateToYMD(
                                                taskItem.taskCompletedOn
                                              ) || "-"}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Status")}:</label>
                                            <p> {taskItem.taskStatus || ""}</p>
                                          </div>
                                        </Col>
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Completed")}:</label>
                                            <p>
                                              {" "}
                                              {taskItem.completionStatus || "-"}
                                            </p>
                                          </div>
                                        </Col>
                                      </Row>
                                    </div>
                                  ))
                                )}
                              </div>
                            ))
                          )}
                        </div>
                      </Panel>
                    ))
                  )}
                </Collapse>
              </div>
            </div>
          )}

          {/*Accumulative Report Download     */}
          {showPdfLayout && (
            <div id="content-id">
              <div className={styles.reportWrapper}>
                <div className={styles.reportHeader}>
                  <div className={styles.headerLeft}>
                    <img src={dairaStudioLogo} alt="" />
                  </div>

                  <div className={styles.headerRight}>
                    <p>123 Elm Street</p>
                    <p>Springfield, Anytown 98765</p>
                    <p>United States</p>
                  </div>
                </div>

                <div className={styles.headerLine}></div>
                <Row>
                  <Col
                    lg={12}
                    xs="auto"
                    className={`${styles.ComplianceMainHeading} mt-4`}
                  >
                    <div>
                      <label>{t("Quarter")}:</label>
                      <p className={styles.longTitleDownload}>
                        {GetAccumulativeReport?.header?.reportTitle}
                      </p>
                    </div>
                  </Col>
                </Row>

                <Row className={`${styles.ComplianceSection} mt-4 `}>
                  <Col lg={8}>
                    <Row className="align-items-center justify-content-between mx-2 ">
                      <Col
                        lg={6}
                        xs="auto"
                        className={`${styles.iconTextWrapperDownload}   `}
                      >
                        <img src={Verification} alt="Verification" />
                        <div>
                          <label>{t("Report-type")}:</label>
                          <p>{GetAccumulativeReport?.header?.reportTypeName}</p>
                        </div>
                      </Col>

                      <Col
                        lg={5}
                        xs="auto"
                        className={`${styles.iconTextWrapperDownload}  `}
                      >
                        <img
                          src={ComplianceCalendar}
                          alt="ComplianceCalendar"
                        />
                        <div>
                          <label>{t("Generated-date")}:</label>
                          <p>
                            {formatDateToYMD(
                              GetAccumulativeReport?.header?.generatedOn
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                    <Row
                      className={`${styles.iconTextWrapperDownload}   mx-2 mt-4`}
                    >
                      <Col
                        lg={5}
                        xs="auto"
                        className={`${styles.iconTextWrapperDownload} d-flex gap-2  `}
                      >
                        <img
                          src={ComplianceCalendar}
                          alt="ComplianceCalendar"
                        />
                        <div>
                          <label>{t("Start-dates")}:</label>
                          <p>
                            {formatDateToYMD(
                              GetAccumulativeReport?.header?.quarterStartDate
                            )}
                          </p>
                        </div>
                      </Col>
                      <Col lg={5} xs="auto">
                        <div>
                          <label>{t("End-dates")}:</label>
                          <p>
                            {formatDateToYMD(
                              GetAccumulativeReport?.header?.quarterEndDate
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={4} className={styles.chartCol}>
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
                            {
                              GetAccumulativeReport?.header
                                ?.overallCompletionPercent
                            }
                            %
                          </h2>
                          <p>{t("Complete ")}</p>
                        </div>
                      </div>

                      {/* Custom Legend (VERTICALLY CENTERED) */}
                      <div className={styles.customLegend}>
                        <div className={styles.legendItem}>
                          <span className={styles.legendDotBlue}></span>
                          <span className={styles.legendItem}>
                            {t("Tasks-completed-on-time")} (
                            {
                              GetAccumulativeReport?.header
                                ?.tasksCompletedOnTime
                            }
                            )
                          </span>
                        </div>
                        <div className={styles.legendItem}>
                          <span className={styles.legendDotYellow}></span>{" "}
                          <span className={styles.legendItem}>
                            {t("Tasks-completed-late")} (
                            {GetAccumulativeReport?.header?.tasksCompletedLate})
                          </span>
                        </div>
                        <div className={styles.legendItem}>
                          <span className={styles.legendOrange}></span>
                          <span className={styles.legendItem}>
                            {t("Pending-or-overdue-tasks")} (
                            {GetAccumulativeReport?.header?.tasksPending})
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
                    <p>{t("Compliances-in-this-report")}</p>
                  </Col>
                  <Col
                    lg={12}
                    xs="auto"
                    className={`${styles.ComplianceMainHeading} mt-3`}
                  >
                    {GetAccumulativeReport?.compliances?.map((comp, index) => (
                      <p className={styles.complianceTitleList}>
                        {index + 1 + "."} {comp.complianceTitle}
                      </p>
                    ))}
                  </Col>
                  {GetAccumulativeReport?.compliances?.map(
                    (compliance, index) => (
                      <Col
                        key={compliance.complianceID}
                        lg={12}
                        xs="auto"
                        className={styles.checklist_report}
                      >
                        <div className={styles.titleSectionDownload}>
                          <label>{t("Compliance-title")}:</label>
                          <p className={styles.longTitle}>
                            {`${index + 1}. ${
                              compliance.complianceTitle ||
                              "No Compliance Title"
                            }`}
                          </p>
                        </div>

                        <div>
                          {!compliance?.checklists?.length ? (
                            <div className={styles.NoDataFoundTable}>
                              <div
                                className={`${styles.nodatafound_subHeading}`}
                              >
                                {t("No-Checklist-Found")}
                              </div>
                            </div>
                          ) : (
                            compliance?.checklists.map((checklist) => (
                              <div className={styles.panelContent}>
                                <div className={styles.titleSectionDownload}>
                                  <label
                                    className={styles.ChecklistTitleDownload}
                                  >
                                    {t("Checklists-title")}:
                                  </label>
                                  <p className={styles.longTitleHeading}>
                                    {checklist.checklistTitle}
                                  </p>
                                </div>
                                <div key={checklist.checklistID}>
                                  {!checklist?.tasks?.length ? (
                                    <div className={styles.NoDataFoundTable}>
                                      <div
                                        className={`${styles.nodatafound_subHeading}`}
                                      >
                                        {t("No-Checklist-Task")}
                                      </div>
                                    </div>
                                  ) : (
                                    checklist?.tasks?.map((task) => (
                                      <div key={task.taskID}>
                                        <div
                                          className={
                                            styles.insideAccordianTable
                                          }
                                        >
                                          <Row>
                                            <Col lg={12} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>
                                                  {t("Task-title")}:
                                                </label>
                                                <Tooltip title={task.taskTitle}>
                                                  <p>{task.taskTitle}</p>
                                                </Tooltip>
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={4} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>{t("Assignee")}:</label>
                                                <p>
                                                  {task.assigneeName || "-"}
                                                </p>
                                              </div>
                                            </Col>{" "}
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>{t("Due-date")}:</label>
                                                <p>
                                                  {formatDateToYMD(
                                                    task.taskDueDate
                                                  )}
                                                </p>
                                              </div>
                                            </Col>
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>
                                                  {t("Completed-on")}:
                                                </label>
                                                <p>
                                                  {formatDateToYMD(
                                                    task.taskCompletedOn
                                                  ) || "-"}
                                                </p>
                                              </div>
                                            </Col>
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>{t("Completed")}:</label>
                                                <p>{task.taskStatus}</p>
                                              </div>
                                            </Col>
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianMainHeading
                                                }
                                              >
                                                <label>{t("Status")}:</label>
                                                <p>{task.taskStatus}</p>
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </Col>
                    )
                  )}
                </Row>
                <div className={styles.reportFooter}>
                  <div>Accumulative Report</div>
                  <div>01</div>
                </div>
              </div>
            </div>
          )}

          {/*Accumulative Report Download     */}
        </Spin>
      </div>
    </>
  );
};

export default AccumulativeReport;
