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
  formatDateToYMDLong,
  generatePdfHtml,
  getDynamicFileName,
} from "../../../CommonComponents/commonFunctions";

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

// Separate PDF Layout Component for Accumulative Report
const AccumulativePdfLayout = ({ data, reportData, t }) => {
  const donutData = [
    ["Task Status", "Count"],
    ["Tasks Completed On Time", reportData?.tasksCompletedOnTime || 0],
    ["Tasks Completed Late", reportData?.tasksCompletedLate || 0],
    ["Pending or Overdue Tasks", reportData?.tasksPending || 0],
  ];

  console.log(
    formatDateToYMDLong(reportData?.generatedOn).split(""),
    "Formatedd date",
  );

  return (
    <div id="content-id">
      <Row>
        <Col
          lg={12}
          xs="auto"
          className={`${styles.ComplianceMainHeading} mt-4`}
        >
          <div>
            <label>{t("Quarter")}:</label>
            <p className={styles.longTitleDownload}>
              {reportData?.reportTitle}
            </p>
          </div>
        </Col>
      </Row>

      <Row className={`${styles.ComplianceSection} mt-4`}>
        <Col lg={8}>
          <Row className="align-items-center justify-content-between mx-2">
            <Col
              lg={6}
              xs="auto"
              className={`${styles.iconTextWrapperDownload}`}
            >
              <img src={Verification} alt="Verification" />
              <div>
                <label>{t("Report-type")}:</label>
                <p>{reportData?.reportTypeName}</p>
              </div>
            </Col>
            <Col
              lg={5}
              xs="auto"
              className={`${styles.iconTextWrapperDownload}`}
            >
              <img src={ComplianceCalendar} alt="ComplianceCalendar" />
              <div>
                <label>{t("Generated-date")}:</label>
                <p>
                  <span className={styles.dateText}>
                    {formatDateToYMDLong(reportData?.generatedOn)}
                  </span>
                </p>
              </div>
            </Col>
          </Row>
          <Row className={`${styles.iconTextWrapperDownload} mx-2 mt-4`}>
            <Col
              lg={5}
              xs="auto"
              className={`${styles.iconTextWrapperDownload} d-flex gap-2`}
            >
              <img src={ComplianceCalendar} alt="ComplianceCalendar" />
              <div>
                <label>{t("Start-dates")}:</label>
                <p>
                  <span className={styles.dateText}>
                    {formatDateToYMDLong(reportData?.quarterStartDate)}
                  </span>
                </p>
              </div>
            </Col>
            <Col lg={5} xs="auto">
              <div>
                <label>{t("End-dates")}:</label>
                <p>
                  <span className={styles.dateText}>
                    {formatDateToYMDLong(reportData?.quarterEndDate)}
                  </span>
                </p>
              </div>
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
                <h2>{reportData?.overallCompletionPercent || 0}%</h2>
                <p>{t("Complete ")}</p>
              </div>
            </div>
            <div className={styles.customLegend}>
              <div className={styles.legendItem}>
                <span className={styles.legendDotBlue}></span>
                <span className={styles.legendText}>
                  {t("Tasks-completed-on-time")} (
                  {reportData?.tasksCompletedOnTime || 0})
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendDotYellow}></span>
                <span className={styles.legendText}>
                  {t("Tasks-completed-late")} (
                  {reportData?.tasksCompletedLate || 0})
                </span>
              </div>
              <div className={styles.legendItem}>
                <span className={styles.legendOrange}></span>
                <span className={styles.legendText}>
                  {t("Pending-or-overdue-tasks")} (
                  {reportData?.tasksPending || 0})
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
          {data?.map((comp, index) => (
            <p
              key={comp.complianceID}
              className={styles.complianceTitleListDownload}
            >
              {index + 1 + "."} {comp.complianceTitle}
            </p>
          ))}
        </Col>

        {data?.map((compliance, index) => (
          <Col
            key={compliance.complianceID}
            lg={12}
            xs="auto"
            className={styles.checklist_report}
          >
            <div className={styles.titleSectionDownload}>
              <label>{t("Compliance-title")}:</label>
              <p className={styles.longTitle}>
                {`${index + 1}. ${compliance.complianceTitle || "No Compliance Title"}`}
              </p>
            </div>

            <div className={`${styles.dueDateScenario}`}>
              <label className={`${styles.dueDateScenariolabel}`}>
                {t("Due-date")}:
              </label>
              <p className={`${styles.dueDateScenariolabel}`}>
                {formatDateToYMD(compliance?.complianceDueDate) || "-"}
              </p>
            </div>

            <Row className={styles.TextDownloadWrapper}>
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
              <Col className={`${styles.TextDownload}`}>
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
            </Row>

            <div>
              {!compliance?.checklists?.length ? (
                <div className={styles.NoDataFoundTable}>
                  <div className={`${styles.nodatafound_subHeading}`}>
                    {t("No-Checklist-Found")}
                  </div>
                </div>
              ) : (
                compliance?.checklists.map((checklist) => (
                  <div
                    key={checklist.checklistID}
                    className={styles.panelContentDownload}
                  >
                    <div className={styles.titleSectionDownload}>
                      <label className={styles.ChecklistTitleDownload}>
                        {t("Checklists-title")}:
                      </label>
                      <p className={styles.longTitleHeadingDownload}>
                        {checklist.checklistTitle}
                      </p>
                    </div>

                    {!checklist?.tasks?.length ? (
                      <div className={styles.NoDataFoundTable}>
                        <div className={`${styles.nodatafound_subHeading}`}>
                          {t("No-Checklist-Task")}
                        </div>
                      </div>
                    ) : (
                      checklist?.tasks?.map((task) => (
                        <div
                          key={task.taskID}
                          className={styles.insideAccordianTableDownload}
                        >
                          <Row>
                            <Col lg={12} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
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
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Assignee")}:</label>
                                <p>{task.assigneeName || "-"}</p>
                              </div>
                            </Col>
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
                                  {formatDateToYMD(task.taskCompletedOn) || "-"}
                                </p>
                              </div>
                            </Col>
                            <Col lg={2} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Completed")}:</label>
                                <p>{task.completionStatus}</p>
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
                      ))
                    )}
                  </div>
                ))
              )}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

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
    (state) => state.ComplainceSettingReducerReducer.GetAccumulativeReport,
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);
  const [pdfKey, setPdfKey] = useState(0);

  // Chunk array function for handling large data
  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const ITEMS_PER_PDF = 15;

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
    ],
  );

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const fullData = GetAccumulativeReport?.compliances || [];

      if (!fullData.length) {
        console.error("No data to generate PDF");
        setIsGenerating(false);
        return;
      }

      const chunks = chunkArray(fullData, ITEMS_PER_PDF);

      for (let i = 0; i < chunks.length; i++) {
        // Store current chunk data in window
        window.__PDF_CHUNK_DATA__ = chunks[i];

        // Force re-render with new key
        setPdfKey((prev) => prev + 1);

        // Show PDF layout
        setShowPdfLayout(true);

        // Wait for DOM to render
        await new Promise((resolve) => setTimeout(resolve, 500));
        await document.fonts.ready;

        const element = document.getElementById("content-id");

        if (element) {
          const pageNumber = i + 1;
          await generatePdfHtml({
            element,
            fileName: getDynamicFileName("Accumalative Report"),
            reportTitle: "Accumalative Report",
          });
        }

        // Hide PDF layout after generation
        setShowPdfLayout(false);

        // Clear chunk data
        await new Promise((resolve) => setTimeout(resolve, 100));
        window.__PDF_CHUNK_DATA__ = null;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setShowPdfLayout(false);
      setIsGenerating(false);
      window.__PDF_CHUNK_DATA__ = null;
    }
  };

  const handleAutoDownload = async () => {
    try {
      setIsGenerating(true);
      await handleDownloadPDF();
      setAccumulativeReport(false);
      setAutoPdfDownload(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (autoPdfDownload && GetAccumulativeReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetAccumulativeReport]);

  // Get current PDF data
  const currentPdfData =
    window.__PDF_CHUNK_DATA__ || GetAccumulativeReport?.compliances;

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
                        GetAccumulativeReport?.header?.generatedOn,
                      ) || "-"}
                    </p>
                  </div>
                </Col>

                {/* Download Button */}
                <Col lg={1} xs="auto">
                  <CustomButton
                    text="Download"
                    loading={isGenerating}
                    onClick={handleDownloadPDF}
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
                            GetAccumulativeReport?.header?.reportStartDate,
                          ) || "-"}
                        </p>
                      </div>
                      <div>
                        <span>{t("End-dates")}:</span>
                        <p>
                          {formatDateToYMD(
                            GetAccumulativeReport?.header?.reportEndDate,
                          ) || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                </Col>

                {/* RIGHT SIDE — DONUT CHART */}
                <Col lg={4} md={5} sm={12} className={styles.chartCol}>
                  <div className={styles.chartFlex}>
                    <div className={styles.chartBox}>
                      <Chart
                        chartType="PieChart"
                        width="100%"
                        height="200px"
                        data={donutData}
                        options={{ ...donutOptions, legend: "none" }}
                      />
                      <div className={styles.centerLabel}>
                        <h2>
                          {GetAccumulativeReport?.header
                            ?.overallCompletionPercent || 0}
                          %
                        </h2>
                        <p>{t("Complete ")}</p>
                      </div>
                    </div>

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
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}</div>
                  <div className="text-center">{t("Due-date")}</div>
                  <div className="text-center">{t("Total-checklists")}</div>
                  <div className="text-center">{t("No-of-tasks")}</div>
                  <div className="text-center">{t("Completed-tasks")}</div>
                  <div className="text-center">{t("Overdue-tasks")}</div>
                  <div className="text-center">{t("Progress")}</div>
                </div>

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
                              {item.tasksCompletedOnTime}
                            </div>
                            <div className="text-center">
                              {item.tasksOverdue}
                            </div>
                            <div className="text-center">{`${item.progressPercent}%`}</div>
                          </div>
                        }
                      >
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
                                              {taskItem.assigneeName || "-"}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col lg={2} xs="auto">
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Due-date")}:</label>
                                            <p>
                                              {formatDateToYMD(
                                                taskItem.taskDueDate,
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
                                              {formatDateToYMD(
                                                taskItem.taskCompletedOn,
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
                                            <p>{taskItem.taskStatus || ""}</p>
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

          {/* PDF Layout */}
          {showPdfLayout && currentPdfData && (
            <div key={pdfKey}>
              <AccumulativePdfLayout
                data={currentPdfData}
                reportData={GetAccumulativeReport?.header}
                t={t}
              />
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default AccumulativeReport;
