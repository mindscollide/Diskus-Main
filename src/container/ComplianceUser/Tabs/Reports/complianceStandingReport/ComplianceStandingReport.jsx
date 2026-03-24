import React, { useEffect, useMemo, useState } from "react";
import styles from "./ComplianceStandingReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Spin, Tooltip, Checkbox } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceStandingReportAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import DefaultSortIcon from "../../../../../assets/images/sortingIcons/Double Arrow2.svg";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";
const { Panel } = Collapse;

const ComplianceStandingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const { criticalityOptions } = useComplianceContext();

  //Sorting Table
  const [complianceNameSort, setComplianceNameSort] = useState(null);
  const [authoritySort, setAuthoritySort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState(null);
  const [totalCheckListsSort, setTotalCheckListsSort] = useState(null);
  const [noOfTasksSort, setNoOfTasksSort] = useState(null);
  const [overdueTasksSort, setOverdueTasksSort] = useState(null);
  const [progressSort, setProgressSort] = useState(null);

  const { complianceStatndingReport, setComplianceStandingReport } =
    useComplianceContext();

  const GetComplianceStandingReport = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceStandingReport,
  );
  console.log(GetComplianceStandingReport, "GetComplianceStandingReport");

  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  const [dateRange, setDateRange] = useState(null);

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

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

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      // 🔹 Clear clicked
      setDateRange(null);

      dispatch(
        GetComplianceStandingReportAPI(
          navigate,
          { startDate: "", endDate: null },
          t,
        ),
      );
      return;
    }

    const startDate = dates[0].format("YYYYMMDD");
    const endDate = dates[1].format("YYYYMMDD");

    setDateRange(dates);

    dispatch(
      GetComplianceStandingReportAPI(navigate, { startDate, endDate: null }, t),
    );
  };

  // Sort Reset Function
  const resetAllSorts = () => {
    setComplianceNameSort(null);
    setAuthoritySort(null);
    setDueDateSort(null);
    setTotalCheckListsSort(null);
    setNoOfTasksSort(null);
    setOverdueTasksSort(null);
    setProgressSort(null);
  };

  const handleChangeStandingReportSorter = (pagination, filters, sorter) => {
    resetAllSorts();

    if (sorter.columnKey === "ComplianceName") {
      setComplianceNameSort(sorter.order);
    } else if (sorter.columnKey === "Authority") {
      setAuthoritySort(sorter.order);
    } else if (sorter.columnKey === "dueDate") {
      setDueDateSort(sorter.order);
    } else if (sorter.columnKey === "totalChecklists") {
      setTotalCheckListsSort(sorter.order);
    } else if (sorter.columnKey === "NoOfTasks") {
      setNoOfTasksSort(sorter.order);
    } else if (sorter.columnKey === "overdueTasks") {
      setOverdueTasksSort(sorter.order);
    } else if (sorter.columnKey === "Progress") {
      setProgressSort(sorter.order);
    }

    // ✅ Criticality filter
    if (filters?.criticality) {
      setCriticalityFilter(filters.criticality || [1, 2, 3]);
    }
  };

  const getCriticalityColumnProps = () => ({
    filteredValue: criticalityFilter, // controlled filter
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      // default: select all
      // if (selectedKeys.length === 0) {
      //   setSelectedKeys(criticalityOptions.map((c) => c.value));
      // }

      return (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={criticalityOptions}
            value={selectedKeys}
            onChange={(checkedValues) => setSelectedKeys(checkedValues)}
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: 8,
            }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {/* Reset */}
            <CustomButton
              text={t("Reset")}
              className={styles["ResetButtonFilter"]}
              onClick={() => {
                const all = criticalityOptions.map((c) => c.value);
                setSelectedKeys(all);
                setCriticalityFilter(all);
                confirm();
              }}
            />

            {/* OK */}
            <CustomButton
              text={t("Ok")}
              className={styles["ResetButtonFilter"]}
              onClick={() => {
                setCriticalityFilter(selectedKeys);
                confirm();
              }}
            />
          </div>
        </div>
      );
    },
    onFilter: (value, record) => value === record.criticality,
    filterIcon: () => <ChevronDown className="filter-chevron-icon-todolist" />,
  });

  const tableData =
    GetComplianceStandingReport?.complianceStandingReport?.complianceListData?.map(
      (item) => ({
        key: item.complianceId,
        ComplianceName: item.complianceTitle,
        Authority: item.authorityShortCode,
        criticality: item.criticality.value,
        dueDate: item.dueDate,
        totalChecklists: item.totalChecklists,
        NoOfTasks: item.totalTasks,
        overdueTasks: item.overdueTasks,
        Progress: item.progressPercentage,
        originalData: item, // keep full object for collapse usage
      }),
    ) || [];

  // 2️⃣ Toggle function
  const toggleRowExpand = (key) => {
    setExpandedRowKeys(
      (prev) =>
        prev.includes(key)
          ? prev.filter((k) => k !== key) // collapse
          : [...prev, key], // expand
    );
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Compliance-name")}
            <img
              src={
                complianceNameSort === "descend"
                  ? ArrowUpIcon
                  : complianceNameSort === "ascend"
                    ? ArrowDownIcon
                    : ArrowDownIcon
              }
              alt=""
            />
          </span>
        ),
        dataIndex: "ComplianceName",
        key: "ComplianceName",
        width: "25%",
        sorter: (a, b) =>
          a.ComplianceName?.toLowerCase().localeCompare(
            b.ComplianceName?.toLowerCase(),
          ),
        sortOrder: complianceNameSort,
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Authority")}
            <img
              src={
                authoritySort === "descend"
                  ? ArrowUpIcon
                  : authoritySort === "ascend"
                    ? ArrowDownIcon
                    : ArrowDownIcon
              }
              alt=""
            />
          </span>
        ),
        dataIndex: "Authority",
        key: "Authority",
        sorter: (a, b) =>
          a.Authority?.toLowerCase().localeCompare(b.Authority?.toLowerCase()),
        sortOrder: authoritySort,
        render: (text) => {
          return <span className={styles.badge}>{text}</span>;
        },
      },
      {
        title: t("Criticality"),
        dataIndex: "criticality",
        key: "criticality",
        ellipsis: true,
        align: "center",
        ...getCriticalityColumnProps(),
        render: (text) => {
          let style = {};

          if (text === 3) {
            // High
            style = {
              fontSize: "13px",
              color: "#F16B6B",
              fontWeight: 600,
              backgroundColor: "#FFDEDE",
              padding: "3px 6px",
              borderRadius: "4px",
              display: "inline-block",
              minWidth: "60px",
              textAlign: "center",
            };
          } else if (text === 2) {
            // Medium
            style = {
              fontSize: "13px",
              color: "#D8A709",
              fontWeight: 600,
              backgroundColor: "#FFF8E1",
              padding: "3px 6px",
              borderRadius: "4px",
              display: "inline-block",
              minWidth: "60px",
              textAlign: "center",
            };
          } else if (text === 1) {
            // Low
            style = {
              fontSize: "13px",
              color: "#6172D6",
              fontWeight: 600,
              backgroundColor: "#ECEFFF",
              padding: "3px 6px",
              borderRadius: "4px",
              display: "inline-block",
              minWidth: "60px",
              textAlign: "center",
            };
          }

          const label =
            text === 1 ? t("Low") : text === 2 ? t("Medium") : t("High");

          return <span style={style}>{label}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Due-date")}
            <img
              src={
                dueDateSort === "descend"
                  ? ArrowUpIcon
                  : dueDateSort === "ascend"
                    ? ArrowDownIcon
                    : ArrowDownIcon
              }
              alt=""
            />
          </span>
        ),
        dataIndex: "dueDate",
        key: "dueDate",
        sorter: (a, b) => Number(a.dueDate) - Number(b.dueDate),
        sortOrder: dueDateSort,
        render: (value) => formatDateToYMD(value),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Total-checklists")}
            {totalCheckListsSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : totalCheckListsSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "totalChecklists",
        key: "totalChecklists",
        width: "12%",
        ellipsis: true,
        sorter: (a, b) => (a.totalChecklists || 0) - (b.totalChecklists || 0),
        sortOrder: totalCheckListsSort,
        align: "center",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("No-of-tasks")}
            {noOfTasksSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : noOfTasksSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "NoOfTasks",
        key: "NoOfTasks",
        width: "10%",
        ellipsis: true,
        sorter: (a, b) => (a.NoOfTasks || 0) - (b.NoOfTasks || 0),
        sortOrder: noOfTasksSort,
        align: "center",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Overdue-tasks")}
            {overdueTasksSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : overdueTasksSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "overdueTasks",
        key: "overdueTasks",
        width: "11%",
        ellipsis: true,
        sorter: (a, b) => (a.overdueTasks || 0) - (b.overdueTasks || 0),
        sortOrder: overdueTasksSort,
        align: "center",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Progress")}
            {progressSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : progressSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "Progress",
        key: "Progress",
        width: "8%",
        align: "center",
        ellipsis: true,
        sorter: (a, b) => (a.progressSort || 0) - (b.progressSort || 0),
        sortOrder: progressSort,
        render: (text) => {
          return <span>{text}%</span>;
        },
      },
      {
        title: "",
        key: "arrow",
        align: "right",
        render: (_, record) => {
          const isExpanded = expandedRowKeys.includes(record.key);

          return (
            <span
              onClick={(e) => {
                e.stopPropagation(); // prevent row click from toggling
                toggleRowExpand(record.key);
              }}
              style={{ cursor: "pointer", fontSize: "16px" }}
            >
              {isExpanded ? <UpOutlined /> : <DownOutlined />}
            </span>
          );
        },
      },
    ],
    [
      complianceNameSort,
      authoritySort,
      dueDateSort,
      totalCheckListsSort,
      noOfTasksSort,
      getCriticalityColumnProps,
      overdueTasksSort,
      progressSort,
      t,
    ],
  );

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
                    className={styles.goBackButton}
                    onClick={() => setComplianceStandingReport(false)}
                  />
                </Col>

                {/* Report Type */}
                <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                  <img src={Verification} alt="Verification" />
                  <div>
                    <label>{t("Report-type")}:</label>
                    <p>{t("Compliance-standing")}</p>
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
                          ?.generatedDate,
                      ) || "-"}
                    </p>
                  </div>
                </Col>

                {/* Date Range Picker */}
                <Col lg={3} xs={4}>
                  <label className={styles.dueDateRange}>
                    {t("due-date-range")}
                  </label>
                  <DatePicker.RangePicker
                    format="DD/MM/YYYY"
                    placeholder={["Start Date", "End Date"]}
                    className="custom-range-picker"
                    separator="-"
                    inputReadOnly
                    allowClear
                    value={dateRange}
                    onChange={handleDateRangeChange}
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
                      {GetComplianceStandingReport?.complianceStandingReport
                        ?.reportTitle || "No Compliance Standing Report Title"}
                    </p>
                  </div>
                </Col>
              </Row>
              {/* Compliance Table */}
              <div className={styles.tableWrapper}>
                {/* 🔹 STATIC HEADER */}
                {/* <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}↓</div>
                  <div>{t("Authority")} ↓</div>
                  <div>{t("Criticalityy")}↓ </div>
                  <div>{t("Due-date")} ↓</div>
                  <div>{t("Total-checklists")} ↓</div>
                  <div>{t("No-of-tasks")} ↓</div>
                  <div>{t("Overdue-tasks")} ↓</div>
                  <div>{t("Progress")} % ↓</div>
                </div> */}

                <CustomTable
                  rows={tableData}
                  column={columns}
                  pagination={false}
                  rowKey="key"
                  onChange={handleChangeStandingReportSorter}
                  expandable={{
                    showExpandColumn: false,
                    expandedRowKeys: expandedRowKeys,
                    onExpandedRowsChange: setExpandedRowKeys,
                    expandedRowRender: (record) => {
                      const item = record.originalData;

                      if (!item) return null;

                      return (
                        <div className="p-3">
                          {!item?.checklistData?.length ? (
                            <div className={styles.NoDataFoundTable}>
                              <div className={styles.nodatafound_subHeading}>
                                {t("No-Checklist-Found")}
                              </div>
                            </div>
                          ) : (
                            item.checklistData.map((checklist) => (
                              <div
                                className={styles.panelContent}
                                key={checklist.checklistId}
                              >
                                {/* Checklist Title */}
                                <Row>
                                  <Col lg={12}>
                                    <div
                                      className={styles.ComplianceMainHeading}
                                    >
                                      <label>{t("Checklist-title")}:</label>
                                      <p>{checklist.checklistTitle}</p>
                                    </div>
                                  </Col>
                                </Row>

                                {/* Checklist Tasks */}
                                <div className={styles.MainAccordianTable}>
                                  {!checklist?.checklistTasks?.length ? (
                                    <div className={styles.NoDataFoundTable}>
                                      <div
                                        className={
                                          styles.nodatafound_subHeading
                                        }
                                      >
                                        {t("No-Checklist-Task")}
                                      </div>
                                    </div>
                                  ) : (
                                    checklist.checklistTasks.map((task) => (
                                      <div
                                        className={styles.insideAccordianTable}
                                        key={task.taskId}
                                      >
                                        <Row>
                                          <Col lg={12}>
                                            <div
                                              className={
                                                styles.insideAccordianMainHeading
                                              }
                                            >
                                              <label>{t("Task-title")}:</label>
                                              <p>{task.taskTitle}</p>
                                            </div>
                                          </Col>
                                        </Row>

                                        <Row>
                                          <Col lg={4}>
                                            <div
                                              className={
                                                styles.insideAccordianSubHeading
                                              }
                                            >
                                              <label>{t("Assignee")}:</label>
                                              <p>{task.taskAssignee}</p>
                                            </div>
                                          </Col>

                                          <Col lg={2}>
                                            <div
                                              className={
                                                styles.insideAccordianSubHeading
                                              }
                                            >
                                              <label>{t("Due-date")}:</label>
                                              <p>
                                                {formatDateToYMD(
                                                  task.dueDate,
                                                ) || "-"}
                                              </p>
                                            </div>
                                          </Col>

                                          <Col lg={2}>
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
                                                  task.completedOnDate,
                                                ) || "-"}
                                              </p>
                                            </div>
                                          </Col>

                                          <Col lg={2}>
                                            <div
                                              className={
                                                styles.insideAccordianSubHeading
                                              }
                                            >
                                              <label>{t("Status")}:</label>
                                              <p>{task.status}</p>
                                            </div>
                                          </Col>

                                          <Col lg={2}>
                                            <div
                                              className={
                                                styles.insideAccordianSubHeading
                                              }
                                            >
                                              <label>{t("Completed")}:</label>
                                              <p>{task.completionStatus}</p>
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      );
                    },
                    rowExpandable: () => true,
                  }}
                  className={"Compliance_Table Report_Table  mt-3"}
                />
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
                    <p>{t("Compliance-standing")}</p>
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
                          ?.generatedDate,
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
                {GetComplianceStandingReport?.complianceStandingReport?.complianceListData?.map(
                  (item, index) => (
                    <Col
                      key={item?.complianceId}
                      lg={12}
                      xs="auto"
                      className={`${styles.checklist_report}  `}
                    >
                      {index + 1}.{item?.complianceTitle}
                    </Col>
                  ),
                )}
              </Row>
            </div>
          )}
        </Spin>
      </div>
    </>
  );
};

export default ComplianceStandingReport;
