import React, { useEffect, useState } from "react";
import styles from "./ComplianceStandingReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Spin, Tooltip } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceStandingReportAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
const { Panel } = Collapse;

const ComplianceStandingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { complianceStatndingReport, setComplianceStandingReport } =
    useComplianceContext();

  const GetComplianceStandingReport = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetComplianceStandingReport
  );
  console.log(GetComplianceStandingReport, "GetComplianceStandingReport");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  const compliancesReport = [
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
      list: "Embedding Ethical Responsibility and Regulatory Compliance Across Operations",
    },
    {
      id: 6,
      list: "Driving Ethical Governance and Compliance Across the Organization",
    },
    {
      id: 7,
      list: "Embedding Ethical Responsibility and Regulatory Compliance Across Operations",
    },
  ];

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
    filename: "Compliance-Standing-Report.pdf",
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
            <>
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
                    <label>{t("Report-type ")}:</label>
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
                    <label>{t("Generated-date")}:</label>
                    <p>
                      {" "}
                      {formatDateToYMD(
                        GetComplianceStandingReport?.complianceStandingReport
                          ?.generatedDate
                      )}
                    </p>
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
                    loading={isGenerating}
                    onClick={handleClickGenerateODF}
                    className={styles.complianceDownloadBtn}
                  />
                </Col>
              </Row>
              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <div>
                    <label>{t("Report-title")}:</label>
                    <p>
                      {" "}
                      {
                        GetComplianceStandingReport?.complianceStandingReport
                          ?.reportTitle
                      }
                    </p>
                  </div>
                </Col>
              </Row>

              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* 🔹 STATIC HEADER */}
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}↓</div>
                  <div>{t("Authority")} ↓</div>
                  <div>{t("Criticalityy")} </div>
                  <div>{t("Due-date")} ↓</div>
                  <div>{t("Total-checklists")} ↓</div>
                  <div>{t("No-of-tasks")} ↓</div>
                  <div>{t("Overdue-tasks")} ↓</div>
                  <div>{t("Progress")} % ↓</div>
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
                  {GetComplianceStandingReport?.complianceStandingReport
                    ?.complianceListData?.length > 0 &&
                    GetComplianceStandingReport.complianceStandingReport.complianceListData.map(
                      (item) => (
                        <Panel
                          key={item.complianceId}
                          header={
                            <div className={styles.tableRow}>
                              <div className={styles.nameCol}>
                                <Tooltip title={item.complianceTitle}>
                                  <p> {item.complianceTitle}</p>
                                </Tooltip>
                              </div>
                              <div>
                                <span className={styles.badge}>
                                  {item.authorityShortCode}
                                </span>
                              </div>
                              <div>
                                <span className={styles.criticality}>
                                  {item.criticality.label}
                                </span>
                              </div>
                              <div>{formatDateToYMD(item.dueDate)}</div>
                              <div>{item.totalChecklists}</div>
                              <div>{item.totalTasks}</div>
                              <div>{item.overdueTasks}</div>
                              <div>{item.progressPercentage}</div>
                            </div>
                          }
                        >
                          {" "}
                          {/* EXPANDED CONTENT */}
                          {!item?.checklistData?.length ? (
                            <div className={styles.NoDataFoundTable}>
                              <div
                                className={`${styles.nodatafound_subHeading}`}
                              >
                                {t("No-Checklist-Found")}
                              </div>
                            </div>
                          ) : (
                            item?.checklistData?.map((checklist) => (
                              <div
                                className={styles.panelContent}
                                key={checklist.checklistId}
                              >
                                <Row>
                                  <Col
                                    lg={12}
                                    xs="auto"
                                    className={`${styles.ComplianceMainHeading}`}
                                  >
                                    <div>
                                      <label>{t("Checklist-title")}:</label>
                                      <p>{checklist.checklistTitle}</p>
                                    </div>
                                  </Col>
                                </Row>
                                <div className={styles.MainAccordianTable}>
                                  {!checklist?.checklistTasks?.length ? (
                                    <div className={styles.NoDataFoundTable}>
                                      <div
                                        className={`${styles.nodatafound_subHeading}`}
                                      >
                                        {t("No-Checklist-Task")}
                                      </div>
                                    </div>
                                  ) : (
                                    checklist.checklistTasks.map(
                                      (checklisttask) => (
                                        <div
                                          className={
                                            styles.insideAccordianTable
                                          }
                                          key={checklisttask.taskId}
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
                                                <p>{checklisttask.taskTitle}</p>
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
                                                  {checklisttask.taskAssignee}
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
                                                    checklisttask.dueDate
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
                                                  {checklisttask.completedOnDate ??
                                                    "-"}
                                                </p>
                                              </div>
                                            </Col>
                                            <Col lg={2} xs="auto">
                                              <div
                                                className={
                                                  styles.insideAccordianSubHeading
                                                }
                                              >
                                                <label> {t("Status")}:</label>
                                                <p>{checklisttask.status}</p>
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
                                                  {
                                                    checklisttask.completionStatus
                                                  }
                                                </p>
                                              </div>
                                            </Col>
                                          </Row>
                                        </div>
                                      )
                                    )
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </Panel>
                      )
                    )}
                </Collapse>
              </div>
            </>
          )}

          {showPdfLayout && (
            <div id="content-id">
              {/* Compliance Standing report */}
              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-4`}
                >
                  <div>
                    <label>{t("Report-title")}:</label>
                    <p>
                      {" "}
                      {
                        GetComplianceStandingReport?.complianceStandingReport
                          ?.reportTitle
                      }
                    </p>
                  </div>
                </Col>
              </Row>
              <Row className={`${styles.ComplianceSection} gap-3 mx-1 mt-4`}>
                <Col className={styles.iconTextWrapperPDF}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type ")}:</label>
                    <p>Compliance Standing</p>
                  </div>
                </Col>
                <Col className={styles.iconTextWrapperPDF}>
                  <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                  <div>
                    <label>{t("Generated-date")}:</label>
                    <p>
                      {" "}
                      {formatDateToYMD(
                        GetComplianceStandingReport?.complianceStandingReport
                          ?.generatedDate
                      )}
                    </p>
                  </div>
                </Col>
                <Col className={styles.iconTextWrapperPDF}>
                  <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                  <div>
                    <label>{t("Date-range")}:</label>
                    <p>1 January 2025 - 31 March 2025</p>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col
                  lg={12}
                  xs="auto"
                  className={`${styles.ComplianceMainHeading} mt-3`}
                >
                  <p>{t("Compliances-in-this-report")}:</p>
                </Col>
                {compliancesReport.map((item, index) => (
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

export default ComplianceStandingReport;
