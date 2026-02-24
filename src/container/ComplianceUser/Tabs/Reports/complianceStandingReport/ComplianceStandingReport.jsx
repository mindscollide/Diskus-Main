import React, { useEffect, useMemo, useState } from "react";
import styles from "./ComplianceStandingReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Collapse, Progress, Spin, Tooltip, Checkbox } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined } from "@ant-design/icons";
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceStandingReportAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/Arrow-up.png";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/Arrow-down.png";
import DefaultSortIcon from "../../../../../assets/images/sortingIcons/Double Arrow2.svg";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";
const { Panel } = Collapse;

const ComplianceStandingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const criticalityOptions = [
    { label: t("Low"), value: 1 },
    { label: t("Medium"), value: 2 },
    { label: t("High"), value: 3 },
  ];

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
      if (selectedKeys.length === 0) {
        setSelectedKeys(criticalityOptions.map((c) => c.value));
      }

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

  const columns = useMemo(
    () => [
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Compliance-name")}
            {complianceNameSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : complianceNameSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "ComplianceName",
        key: "ComplianceName",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          complianceNameSort === "descend"
            ? b.ComplianceName?.toLowerCase().localeCompare(
                a.ComplianceName?.toLowerCase(),
              )
            : complianceNameSort === "ascend"
              ? a.ComplianceName?.toLowerCase().localeCompare(
                  b.ComplianceName?.toLowerCase(),
                )
              : a.ComplianceName?.toLowerCase().localeCompare(
                  b.ComplianceName?.toLowerCase(),
                ),
        align: "start",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Authority")}
            {authoritySort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : authoritySort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "Authority",
        key: "Authority",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          authoritySort === "descend"
            ? b.Authority?.toLowerCase().localeCompare(
                a.Authority?.toLowerCase(),
              )
            : authoritySort === "ascend"
              ? a.Authority?.toLowerCase().localeCompare(
                  b.Authority?.toLowerCase(),
                )
              : a.Authority?.toLowerCase().localeCompare(
                  b.Authority?.toLowerCase(),
                ),
        align: "start",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: t("Criticality"),
        dataIndex: "criticality",
        key: "criticality",
        width: "10%",
        ellipsis: true,
        align: "center",
        ...getCriticalityColumnProps(),
        render: (text) => (
          <span className="d-flex justify-content-center">
            {text === 1 ? (
              <Tooltip title={t("Low")}>{t("Low")}</Tooltip>
            ) : text === 2 ? (
              <Tooltip title={t("Medium")}>{t("Medium")}</Tooltip>
            ) : (
              <Tooltip title={t("High")}>{t("High")}</Tooltip>
            )}
          </span>
        ),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Due-date")}
            {dueDateSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : dueDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "dueDate",
        key: "dueDate",
        width: "13%",
        ellipsis: true,
        align: "left",
        render: (_, record) => <span>{formatDateToYMD(record.dueDate)}</span>,
        sorter: (a, b) => {
          const aTime = Number(a.dueDate);
          const bTime = Number(b.dueDate);

          if (dueDateSort === "descend") return bTime - aTime;
          if (dueDateSort === "ascend") return aTime - bTime;

          return aTime - bTime;
        },
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
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "totalChecklists",
        key: "totalChecklists",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          totalCheckListsSort === "descend"
            ? b.totalChecklists
                ?.toLowerCase()
                .localeCompare(a.totalChecklists?.toLowerCase())
            : totalCheckListsSort === "ascend"
              ? a.totalChecklists
                  ?.toLowerCase()
                  .localeCompare(b.totalChecklists?.toLowerCase())
              : a.totalChecklists
                  ?.toLowerCase()
                  .localeCompare(b.totalChecklists?.toLowerCase()),
        align: "start",
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
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "NoOfTasks",
        key: "NoOfTasks",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          totalCheckListsSort === "descend"
            ? b.NoOfTasks?.toLowerCase().localeCompare(
                a.NoOfTasks?.toLowerCase(),
              )
            : noOfTasksSort === "ascend"
              ? a.NoOfTasks?.toLowerCase().localeCompare(
                  b.NoOfTasks?.toLowerCase(),
                )
              : a.NoOfTasks?.toLowerCase().localeCompare(
                  b.NoOfTasks?.toLowerCase(),
                ),
        align: "start",
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
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "overdueTasks",
        key: "overdueTasks",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          overdueTasksSort === "descend"
            ? b.overdueTasks
                ?.toLowerCase()
                .localeCompare(a.overdueTasks?.toLowerCase())
            : overdueTasksSort === "ascend"
              ? a.overdueTasks
                  ?.toLowerCase()
                  .localeCompare(b.overdueTasks?.toLowerCase())
              : a.overdueTasks
                  ?.toLowerCase()
                  .localeCompare(b.overdueTasks?.toLowerCase()),
        align: "start",
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
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "Progress",
        key: "Progress",
        width: "35%",
        ellipsis: true,
        sorter: (a, b) =>
          progressSort === "descend"
            ? b.Progress?.toLowerCase().localeCompare(a.Progress?.toLowerCase())
            : progressSort === "ascend"
              ? a.Progress?.toLowerCase().localeCompare(
                  b.Progress?.toLowerCase(),
                )
              : a.Progress?.toLowerCase().localeCompare(
                  b.Progress?.toLowerCase(),
                ),
        align: "start",
        render: (text) => {
          return <span>{text}</span>;
        },
      },
    ],
    [
      complianceNameSort,
      authoritySort,
      dueDateSort,
      totalCheckListsSort,
      noOfTasksSort,
      overdueTasksSort,
      progressSort,
      t,
    ],
  );
  const mapTasksToRows = (tasks = []) =>
    tasks.map((task) => ({
      key: task.taskID,
      taskTitle: task.taskTitle,
      assignee: task.assigneeName,
      dueDate: formatDateToYMD(task.dueDate),
      completedOn: formatDateToYMD(task.completedOn),
      status: task.status,
      completion: task.completionStatus,
    }));

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
                <div className={styles.tableHeader}>
                  <div>{t("Compliance-name")}↓</div>
                  <div>{t("Authority")} ↓</div>
                  <div>{t("Criticalityy")}↓ </div>
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
                                                    checklisttask.dueDate,
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
                                      ),
                                    )
                                  )}
                                </div>
                              </div>
                            ))
                          )}
                        </Panel>
                      ),
                    )}
                </Collapse>
              </div>

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
                {!GetComplianceStandingReport?.complianceStandingReport
                  ?.complianceListData?.length ? (
                  <div className={styles.NoDataFoundTable}>
                    <div className={`${styles.nodatafound_subHeading}`}>
                      {t("No-data-Found")}
                    </div>
                  </div>
                ) : (
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
                        {!item?.checklistData?.length ? (
                          <div className={styles.NoDataFoundTable}>
                            <div className={`${styles.nodatafound_subHeading}`}>
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
                                        className={styles.insideAccordianTable}
                                        key={checklisttask.taskId}
                                      >
                                        <Row>
                                          <Col lg={12} xs="auto">
                                            <div
                                              className={
                                                styles.insideAccordianMainHeading
                                              }
                                            >
                                              <label>{t("Task-title")}:</label>
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
                                                  checklisttask.dueDate,
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
                                                {checklisttask.completionStatus}
                                              </p>
                                            </div>
                                          </Col>
                                        </Row>
                                      </div>
                                    ),
                                  )
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </Panel>
                    ),
                  )
                )}
              </Collapse>
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
