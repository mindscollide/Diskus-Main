import React, { useEffect, useState } from "react";
import styles from "./AccumulativeReport.module.css";
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
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import generatePDF, { Margin, Resolution } from "react-to-pdf";
const { Panel } = Collapse;

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

  console.log(
    GetAccumulativeReport,
    "GetAccumulativeReportGetAccumulativeReport"
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  useEffect(() => {
    if (autoPdfDownload && GetAccumulativeReport) {
      handleAutoDownload();
    }
  }, [autoPdfDownload, GetAccumulativeReport]);

  const donutData = [
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
    tooltip: { trigger: "none" },
  };
  const options = {
    // default is `save`
    method: "save",
    filename: "Accumulative Report.pdf",
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
      setIsGenerating(true);
      setShowPdfLayout(true);

      await new Promise((r) => setTimeout(r, 300));
      await document.fonts.ready;

      await generatePDF(getTargetElement, options);

      // 👇 After Download Close Report
      setAccumulativeReport(false);
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
                        options={{ ...donutOptions, legend: "none" }} // ❌ hide default legend
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
                {/* 🔹 STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}</div>
                  <div className="text-center">{t("Due-date")}</div>
                  <div className="text-center">{t("Total-checklists")}</div>
                  <div className="text-center">{t("No-of-tasks")}</div>
                  <div className="text-center">{t("Completed-tasks")}</div>
                  <div className="text-center">{t("Overdue-tasks")} </div>
                  <div className="text-center">{t("Progress")}</div>
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
                                              ) || 0}
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
                                              {taskItem.completedTasks || 0}
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
              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <div>
                    <label>{t("Quarter")}:</label>
                    <p className={styles.longTitle}>
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
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />
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
                      <img src={ComplianceCalendar} alt="ComplianceCalendar" />
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
                        options={{ ...donutOptions, legend: "none" }} // ❌ hide default legend
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
                          {GetAccumulativeReport?.header?.tasksCompletedOnTime})
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
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <p>{t("Compliances-in-this-report")}:</p>
                </Col>
                {GetAccumulativeReport?.compliances?.map(
                  (compliance, index) => (
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
                  )
                )}
              </Row>
            </div>
          )}

          {/*Accumulative Report Download     */}
        </Spin>
      </div>
    </>
  );
};

export default AccumulativeReport;
