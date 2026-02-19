import React, { useEffect, useState } from "react";
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

  console.log(GetQuarterReport, "GetQuarterReportGetQuarterReport");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  useEffect(() => {
    if (autoPdfDownload && GetQuarterReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetQuarterReport]);

  const donutData = [
    ["Task Status", "Count"],
    [
      "Tasks Completed On Time",
      GetQuarterReport?.header?.tasksCompletedOnTime || 0,
    ],
    ["Tasks Completed Late", GetQuarterReport?.header?.tasksCompletedLate || 0],
    ["Pending or Overdue Tasks", GetQuarterReport?.header?.tasksPending || 0],
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
    colors: ["#4F7CFE", "#F5C542", "#F16B6B"],
    tooltip: { text: "percentage" },
  };

  const options = {
    // default is `save`
    method: "save",
    filename: "End of Quarter Report.pdf",
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

  const handleAutoDownload = async () => {
    try {
      setIsGenerating(false);
      setShowPdfLayout(true);

      await new Promise((r) => setTimeout(r, 300));
      await document.fonts.ready;

      await generatePDF(getTargetElement, options);

      // 👇 After Download Close Report
      setEndOfQuarterReport(false);
      setAutoPdfDownload(false);
    } catch (error) {
      console.error(error);
    } finally {
      setShowPdfLayout(false);
      setIsGenerating(false);
    }
  };

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
                    className={styles.goBackButton}
                    onClick={() => setEndOfQuarterReport(false)}
                  />
                </Col>

                {/* Report Type */}
                <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type ")}:</label>
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
                        options={{ ...donutOptions, legend: "none" }} // ❌ hide default legend
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
                      <div>
                        <span className={styles.legendDotBlue}></span>
                        {t("Tasks-completed-on-time")} (
                        {GetQuarterReport?.header?.tasksCompletedOnTime || 0})
                      </div>
                      <div>
                        <span className={styles.legendDotYellow}></span>
                        {t("Tasks-completed-late")} (
                        {GetQuarterReport?.header?.tasksCompletedLate || 0})
                      </div>
                      <div>
                        <span className={styles.legendOrange}></span>
                        {t("Pending-or-overdue-tasks")} (
                        {GetQuarterReport?.header?.tasksPending || 0})
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>

              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* 🔹 STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}</div>
                  <div className="text-center">{t("Due-date")}</div>
                  <div className="text-center">{t("Total-checklists")}</div>
                  <div className="text-center">{t("No-of-tasks")}</div>
                  <div className="text-center">{t("Completed-tasks")}</div>
                  <div className="text-center">{t("Overdue-tasks")} </div>
                  <div className="text-center">{t("Progress")} % </div>
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
                                                {" "}
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
                                                <p>{task.assigneeName}</p>
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
                                                <p>{task.taskCompletedOn}</p>
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
          {showPdfLayout && (
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
                        <label className={styles.ComplianceReportHeadings}>
                          {t("Generated-date")}:{" "}
                        </label>
                        <p>
                          {" "}
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
                        <label>{t("Start-dates")}</label>
                        <p>
                          {formatDateToYMD(
                            GetQuarterReport?.header?.quarterStartDate
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col lg={5} xs="auto">
                      <div>
                        <label>{t("End-dates")}</label>
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
                        options={{ ...donutOptions, legend: "none" }} // ❌ hide default legend
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
                      <div>
                        <span className={styles.legendDotBlue}></span>
                        {t("Tasks-completed-on-time")} (
                        {GetQuarterReport?.header?.tasksCompletedOnTime})
                      </div>
                      <div>
                        <span className={styles.legendDotYellow}></span>
                        {t("Tasks-completed-late")} (
                        {GetQuarterReport?.header?.tasksCompletedLate})
                      </div>
                      <div>
                        <span className={styles.legendOrange}></span>
                        {t("Pending-or-overdue-tasks")} (
                        {GetQuarterReport?.header?.tasksPending})
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
                  <p>{t("Compliances-in-this-report")}:</p>
                </Col>

                {GetQuarterReport?.compliances?.map((compliance) =>
                  compliance?.checklists?.map((checklist, index) => (
                    <Col
                      key={checklist.checklistID}
                      lg={12}
                      xs="auto"
                      className={styles.checklist_report}
                    >
                      <Tooltip title={checklist.checklistDescription}>
                        {checklist.checklistDescription}
                      </Tooltip>
                    </Col>
                  ))
                )}
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
