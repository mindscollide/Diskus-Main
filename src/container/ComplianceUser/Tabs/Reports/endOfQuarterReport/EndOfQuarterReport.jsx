import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./EndOfQuarterReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Tooltip, Spin } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import { Chart } from "react-google-charts";
import { useSelector } from "react-redux";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import { useTranslation } from "react-i18next";
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
  colors: ["#4F7CFE", "#F5C542", "#F16B6B"],
  tooltip: { trigger: "none" },
};

/** Static PDF generation options hoisted to module level. */
const pdfOptions = {
  method: "save",
  filename: "End of Quarter Report.pdf",
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
 * EndOfQuarterReport component.
 * Renders a quarterly compliance report with chart, compliance table,
 * and PDF download capability.
 */
const EndOfQuarterReport = () => {
  const { t } = useTranslation();
  const {
    endOfQuarterReport,
    setEndOfQuarterReport,
    autoPdfDownload,
    setAutoPdfDownload,
  } = useComplianceContext();
  const GetQuarterReport = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetQuarterReport
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  useEffect(() => {
    if (autoPdfDownload && GetQuarterReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetQuarterReport]);

  /**
   * Donut chart data derived from the quarter report API response.
   */
  const donutData = useMemo(
    () => [
      ["Task Status", "Count"],
      [
        "Tasks Completed On Time",
        GetQuarterReport?.header?.tasksCompletedOnTime || 0,
      ],
      ["Tasks Completed Late", GetQuarterReport?.header?.tasksCompletedLate || 0],
      ["Pending or Overdue Tasks", GetQuarterReport?.header?.tasksPending || 0],
    ],
    [
      GetQuarterReport?.header?.tasksCompletedOnTime,
      GetQuarterReport?.header?.tasksCompletedLate,
      GetQuarterReport?.header?.tasksPending,
    ],
  );

  const handleAutoDownload = async () => {
    try {
      setIsGenerating(true);
      setShowPdfLayout(true);

      await new Promise((r) => setTimeout(r, 300));
      await document.fonts.ready;

      await generatePDF(getTargetElement, pdfOptions);

      // After Download Close Report
      setEndOfQuarterReport(false);
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
          tip={autoPdfDownload ? "Downloading PDF..." : "Generating PDF..."}
          className="d-flex justify-content-center align-items-center"
        >
          {showPdfLayout && (
            <div>
              <Row className="align-items-center">
                {/* Back Button */}
                <Col xs="auto">
                  <img
                    src={BackButton}
                    alt="BackButton"
                    className={styles.goBackButton}
                    onClick={() => setEndOfQuarterReport(false)}
                  />
                </Col>

                {/* Report Type */}
                <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type")}:</label>
                    <p>
                      {GetQuarterReport?.header?.reportTypeName || "Quarterly"}
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
                      {formatDateToYMD(GetQuarterReport?.header?.generatedOn) ||
                        "-"}
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
                      {GetQuarterReport?.header?.reportTitle ||
                        "No Quarterly Title"}
                    </p>

                    <div className={styles.metaRow}>
                      <div>
                        <span>{t("Start-dates")}</span>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.quarterStartDate
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("End-dates")}</span>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.quarterEndDate
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
                          {GetQuarterReport?.header?.overallCompletionPercent ||
                            0}
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
                          {GetQuarterReport?.header?.tasksCompletedOnTime || 0})
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotYellow}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-late")} (
                          {GetQuarterReport?.header?.tasksCompletedLate || 0})
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendOrange}></span>
                        <span className={styles.legendText}>
                          {t("Pending-or-overdue-tasks")} (
                          {GetQuarterReport?.header?.tasksPending || 0})
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
                  <div className="text-center">{t("Progress")} </div>
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
                  {!GetQuarterReport?.compliances?.length ? (
                    <div className={styles.NoDataFoundTable}>
                      <div className={`${styles.nodatafound_subHeading}`}>
                        {t("No-data-Found")}
                      </div>
                    </div>
                  ) : (
                    GetQuarterReport?.compliances.map((item) => (
                      <Panel
                        key={item.id}
                        header={
                          <div className={styles.tableRow}>
                            <div className={styles.nameCol}>
                              <Tooltip title={item.complianceTitle}>
                                {item.complianceTitle}{" "}
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
                              {item.progressPercent}
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
                            item.checklists.map((checklist) => (
                              <div className={styles.panelContent}>
                                <div className={styles.titleSection}>
                                  <label className={styles.ChecklistTitle}>
                                    {t("Checklists-title")}:
                                  </label>
                                  <p className={styles.longTitle}>
                                    {checklist.checklistTitle}
                                  </p>
                                </div>
                                {!checklist?.tasks?.length ? (
                                  <div className={styles.NoDataFoundTable}>
                                    <div
                                      className={`${styles.nodatafound_subHeading}`}
                                    >
                                      {t("No-Checklist-Task")}
                                    </div>
                                  </div>
                                ) : (
                                  <div key={checklist.checklistID}>
                                    {checklist?.tasks?.map((task) => (
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
                                                  styles.insideAccordianSubHeading
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
                                                  styles.insideAccordianSubHeading
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
                                                  styles.insideAccordianSubHeading
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
                                                  styles.insideAccordianSubHeading
                                                }
                                              >
                                                <label>{t("Status")}:</label>
                                                <p>{task.taskStatus}</p>
                                              </div>
                                            </Col>
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianSubHeading
                                                }
                                              >
                                                <label>{t("Completed")}:</label>
                                                <p>{task.taskStatus}</p>
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
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

          {/*End of quarter Report Download     */}
          {!showPdfLayout && (
            <div id="content-id">
              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <div>
                    <label>{t("Quarter")}:</label>
                    <p className={styles.longTitle}>
                      {GetQuarterReport?.header?.reportTitle}
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
                        <p>{GetQuarterReport?.header?.reportTypeName}</p>
                      </div>
                    </Col>

                    <Col
                      lg={5}
                      xs="auto"
                      className={`${styles.iconTextWrapperDownload}  `}
                    >
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                      <div>
                        <label>{t("Generated-date")}: </label>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.generatedOn
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
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                      <div>
                        <label>{t("Start-dates")}:</label>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.quarterStartDate
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col lg={5} xs="auto">
                      <div>
                        <label>{t("End-dates")}:</label>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.quarterEndDate
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
                          {GetQuarterReport?.header?.overallCompletionPercent}%
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
                          {GetQuarterReport?.header?.tasksCompletedOnTime})
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendDotYellow}></span>
                        <span className={styles.legendText}>
                          {t("Tasks-completed-late")} (
                          {GetQuarterReport?.header?.tasksCompletedLate})
                        </span>
                      </div>
                      <div className={styles.legendItem}>
                        <span className={styles.legendOrange}></span>
                        <span className={styles.legendText}>
                          {t("Pending-or-overdue-tasks")} (
                          {GetQuarterReport?.header?.tasksPending})
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
                  className={`${styles.ComplianceMainHeading} mt-4 mb-2`}
                >
                  <p>{t("Compliances-in-this-report")}:</p>
                </Col>
                {GetQuarterReport?.compliances?.map((compliance, index) => (
                  <Col
                    key={compliance.complianceID}
                    lg={12}
                    xs="auto"
                    className={styles.checklist_report}
                  >
                    <div className={styles.titleSection}>
                      <label>{t("Compliance-title")}:</label>
                      <p className={styles.longTitle}>
                        {`${index + 1}. ${
                          compliance.complianceTitle || "No Compliance Title"
                        }`}
                      </p>
                    </div>

                    {/* <div className={`${styles.dueDate} `}>
                      <label>{t("Due-date")}:</label>
                      <p>
                        {formatDateToYMD(compliance?.complianceDueDate) || "-"}
                      </p>
                    </div> */}

                    {/* <Row className={styles.TextDownloadWrapper}>
                      <Col className={styles.TextDownload}>
                        <div>
                          <p>{compliance?.progressPercent || "0"}%</p>
                          <label>{t("Completed")}</label>
                        </div>
                      </Col>
                      <Col className={styles.TextDownload}>
                        <div>
                          <p>{compliance?.totalChecklists}</p>
                          <label>{t("Total-checklists")}</label>
                        </div>
                      </Col>
                      <Col className={`${styles.TextDownload} `}>
                        <div>
                          <p>{compliance?.totalTasks}</p>
                          <label>{t("Total-tasks")}</label>
                        </div>
                      </Col>
                      <Col className={styles.TextDownload}>
                        <div>
                          <p>{compliance?.completedTasks}</p>
                          <label>{t("Completed-tasks")}</label>
                        </div>
                      </Col>
                      <Col className={styles.TextDownload}>
                        <div>
                          <p>{compliance?.tasksOverdue}</p>
                          <label>{t("Overdue-tasks")}</label>
                        </div>
                      </Col>
                    </Row> */}

                    <div>
                      {!compliance?.checklists?.length ? (
                        <div className={styles.NoDataFoundTable}>
                          <div className={`${styles.nodatafound_subHeading}`}>
                            {t("No-Checklist-Found")}
                          </div>
                        </div>
                      ) : (
                        compliance?.checklists.map((checklist) => (
                          <div className={styles.panelContent}>
                            <div className={styles.titleSection}>
                              <label className={styles.ChecklistTitle}>
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
                                      className={styles.insideAccordianTable}
                                    >
                                      <Row>
                                        <Col lg={12} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianMainHeading
                                            }
                                          >
                                            <label>{t("Task-title")}:</label>
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
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Assignee")}:</label>
                                            <p>{task.assigneeName || "-"}</p>
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
                                              {formatDateToYMD(
                                                task.taskDueDate
                                              )}
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
                                              {formatDateToYMD(
                                                task.taskCompletedOn
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
                                            <label>{t("Completed")}:</label>
                                            <p>{task.taskStatus}</p>
                                          </div>
                                        </Col>
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
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
                ))}
              </Row>
            </div>
          )}
          {/*End of quarter Report Download     */}
        </Spin>
      </div>
    </>
  );
};

export default EndOfQuarterReport;
