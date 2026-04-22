import React, { useMemo, useState } from "react";
import styles from "./ComplianceStandingReport.module.css";
import { Col, Row } from "react-bootstrap";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import BackButton from "./../../../../../assets/images/backbutton.svg";
import Verification from "./../../../../../assets/images/Verification.png";
import ComplianceCalendar from "./../../../../../assets/images/ComplianceCalendar.png";
import { DatePicker, Spin, Tooltip, Checkbox } from "antd";
import CustomButton from "../../../../../components/elements/button/Button";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceStandingReportAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useTranslation } from "react-i18next";
import {
  formatDateToYMD,
  generatePdfHtml,
  getDynamicFileName,
} from "../../../CommonComponents/commonFunctions";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";
import { getFiscalQuarterDetails } from "../../../../../commen/functions/validations";

// Criticality style map
const CRITICALITY_STYLE = {
  1: {
    fontSize: "13px",
    color: "#F16B6B",
    fontWeight: 600,
    backgroundColor: "#FFDEDE",
    padding: "3px 6px",
    borderRadius: "4px",
    display: "inline-block",
    minWidth: "60px",
    textAlign: "center",
  },
  2: {
    fontSize: "13px",
    color: "#D8A709",
    fontWeight: 600,
    backgroundColor: "#FFF8E1",
    padding: "3px 6px",
    borderRadius: "4px",
    display: "inline-block",
    minWidth: "60px",
    textAlign: "center",
  },
  3: {
    fontSize: "13px",
    color: "#6172D6",
    fontWeight: 600,
    backgroundColor: "#ECEFFF",
    padding: "3px 6px",
    borderRadius: "4px",
    display: "inline-block",
    minWidth: "60px",
    textAlign: "center",
  },
};

// Separate PDF Layout Component
const PdfLayout = ({ data, reportData, dateRange, t }) => {
  let startFiscalMonth = localStorage.getItem("fiscalStartMonth");
  let startFiscalDay = localStorage.getItem("fiscalYearStartDay");

  const { startDate } = getFiscalQuarterDetails({
    fiscalStartMonth: Number(startFiscalMonth),
    fiscalStartDay: Number(startFiscalDay),
  });

  const today = new Date();

  const displayDateRange = dateRange
    ? `${dateRange[0].format("DD MMM YYYY")} - ${dateRange[1].format("DD MMM YYYY")}`
    : `${formatDateToYMD(startDate)} - ${formatDateToYMD(today)}`;

  return (
    <div id="content-id" className={styles.pdfContainer}>
      {/* Report title */}
      <Row>
        <Col
          lg={12}
          xs="auto"
          className={`${styles.ComplianceMainHeading} mt-4`}
        >
          <div>
            <label>{t("Report-title")}:</label>
            <p>{reportData?.reportTitle || "-"}</p>
          </div>
        </Col>
      </Row>

      {/* Metadata row */}
      <Row className={`${styles.ComplianceSection} gap-4 mx-1 mt-4`}>
        <Col className={styles.iconTextWrapperPDF}>
          <img src={Verification} alt="Verification" />
          <div>
            <label>{t("Report-type")}:</label>
            <p>{t("Compliance-standing")}</p>
          </div>
        </Col>
        <Col className={styles.iconTextWrapperPDF}>
          <img src={ComplianceCalendar} alt="ComplianceCalendar" />
          <div>
            <label>{t("Generated-date")}:</label>
            <p>
              <span className={styles.dateText}>
                {formatDateToYMD(reportData?.generatedDate) || "-"}
              </span>
            </p>
          </div>
        </Col>
        <Col className={styles.iconTextWrapperPDF}>
          <img src={ComplianceCalendar} alt="ComplianceCalendar" />
          <div>
            <label>{t("Date-range")}:</label>
            <p>{displayDateRange}</p>
          </div>
        </Col>
      </Row>

      {/* Compliance list */}
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
              key={comp.complianceId}
              className={styles.complianceTitleListDownload}
            >
              {index + 1 + "."} {comp.complianceTitle}
            </p>
          ))}
        </Col>

        {data?.map((compliance, index) => (
          <Col
            key={compliance.complianceId}
            lg={12}
            xs="auto"
            className={styles.checklist_report}
          >
            {/* Compliance title */}
            <div className={styles.titleSection}>
              <label>{t("Compliance-title")}:</label>
              <p className={styles.complianceTitle}>
                {`${index + 1}. ${compliance.complianceTitle || "No Compliance Title"}`}
              </p>
            </div>

            <Row>
              <Col lg={12} xs="auto" className={`${styles.titleAboveBoxRow}`}>
                <div className={styles.dueDateComStanding}>
                  <label className={styles.dueDateComStandinglabel}>
                    {t("Due-date")}:
                  </label>
                  <p className={styles.dueDateComStandinglabel}>
                    {formatDateToYMD(compliance?.dueDate) || "-"}
                  </p>
                </div>
                <div className={styles.dueDate}>
                  <label>{t("Criticalityy")}:</label>
                  <p>{compliance?.criticality?.label || "-"}</p>
                </div>
                <div className={styles.dueDate}>
                  <label>{t("Authority")}:</label>
                  <p>{compliance?.authorityShortCode || "-"}</p>
                </div>
              </Col>
            </Row>

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
                  <p>{compliance?.overdueTasks}</p>
                  <label>{t("Overdue-tasks")}</label>
                </div>
              </Col>
            </Row>

            <div>
              {/* Checklists */}
              {!compliance?.checklistData?.length ? (
                <div className={styles.NoDataFoundTable}>
                  <div className={styles.nodatafound_subHeading}>
                    {t("No-Checklist-Found")}
                  </div>
                </div>
              ) : (
                compliance.checklistData.map((checklist) => (
                  <div
                    className={styles.panelContentDownload}
                    key={checklist.checklistId}
                  >
                    <div className={styles.titleSection}>
                      <label className={styles.ChecklistTitle}>
                        {t("Checklists-title")}:
                      </label>
                      <p className={styles.longTitleHeading}>
                        {checklist.checklistTitle}
                      </p>
                    </div>

                    {!checklist?.checklistTasks?.length ? (
                      <div className={styles.NoDataFoundTable}>
                        <div className={styles.nodatafound_subHeading}>
                          {t("No-Checklist-Task")}
                        </div>
                      </div>
                    ) : (
                      checklist.checklistTasks.map((task) => (
                        <div
                          key={task.taskId}
                          className={styles.insideAccordianTableTasks}
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
                                <p>{task.taskAssignee || "-"}</p>
                              </div>
                            </Col>
                            <Col lg={2} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Due-date")}:</label>
                                <p>{formatDateToYMD(task.dueDate) || "-"}</p>
                              </div>
                            </Col>
                            <Col lg={2} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Completed-on")}:</label>
                                <p>
                                  {formatDateToYMD(task.completedOnDate) || "-"}
                                </p>
                              </div>
                            </Col>
                            <Col lg={2} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Completed")}:</label>
                                <p>{task.completionStatus || "-"}</p>
                              </div>
                            </Col>
                            <Col lg={2} xs="auto">
                              <div
                                className={styles.insideAccordianMainHeading}
                              >
                                <label>{t("Status")}:</label>
                                <p>{task.status || "-"}</p>
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

const ComplianceStandingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { criticalityOptions, setComplianceStandingReport } =
    useComplianceContext();

  const GetComplianceStandingReport = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceStandingReport,
  );

  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const [complianceNameSort, setComplianceNameSort] = useState(null);
  const [authoritySort, setAuthoritySort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState(null);
  const [totalCheckListsSort, setTotalCheckListsSort] = useState(null);
  const [noOfTasksSort, setNoOfTasksSort] = useState(null);
  const [overdueTasksSort, setOverdueTasksSort] = useState(null);
  const [progressSort, setProgressSort] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPdfLayout, setShowPdfLayout] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [pdfKey, setPdfKey] = useState(0);

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const ITEMS_PER_PDF = 20; // Reduced to prevent footer cutting

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);

      const fullData =
        GetComplianceStandingReport?.complianceStandingReport
          ?.complianceListData || [];

      if (!fullData.length) {
        setIsGenerating(false);
        return;
      }

      const chunks = chunkArray(fullData, ITEMS_PER_PDF);

      for (let i = 0; i < chunks.length; i++) {
        // Store current chunk data
        window.__PDF_CHUNK_DATA__ = chunks[i];

        // Force re-render with new key
        setPdfKey((prev) => prev + 1);

        // Show PDF layout
        setShowPdfLayout(true);

        // Wait for re-render and DOM update
        await new Promise((resolve) => setTimeout(resolve, 300));
        await document.fonts.ready;

        const element = document.getElementById("content-id");

        if (element) {
          await generatePdfHtml({
            element,
            fileName: getDynamicFileName("Compliance Standing Report"),
            reportTitle: "Compliance Standing Report",
          });
        }

        setShowPdfLayout(false);
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

  const handleDateRangeChange = (dates) => {
    if (!dates) {
      setDateRange(null);
      dispatch(
        GetComplianceStandingReportAPI(
          navigate,
          { startDate: "", endDate: "" },
          t,
        ),
      );
      return;
    }

    const startDate = dates[0].format("YYYYMMDD");
    const endDate = dates[1].format("YYYYMMDD");
    setDateRange(dates);
    dispatch(
      GetComplianceStandingReportAPI(navigate, { startDate, endDate }, t),
    );
  };

  const resetAllSorts = () => {
    setComplianceNameSort(null);
    setAuthoritySort(null);
    setDueDateSort(null);
    setTotalCheckListsSort(null);
    setNoOfTasksSort(null);
    setOverdueTasksSort(null);
    setProgressSort(null);
  };

  const handleChangeStandingReportSorter = (_pagination, filters, sorter) => {
    resetAllSorts();

    const sortSetters = {
      ComplianceName: setComplianceNameSort,
      Authority: setAuthoritySort,
      dueDate: setDueDateSort,
      totalChecklists: setTotalCheckListsSort,
      NoOfTasks: setNoOfTasksSort,
      overdueTasks: setOverdueTasksSort,
      Progress: setProgressSort,
    };

    if (sorter.columnKey && sortSetters[sorter.columnKey]) {
      sortSetters[sorter.columnKey](sorter.order);
    }

    if (filters?.criticality) {
      setCriticalityFilter(filters.criticality ?? [1, 2, 3]);
    }
  };

  const toggleRowExpand = (key) => {
    setExpandedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const criticalityColumnProps = useMemo(
    () => ({
      filteredValue: criticalityFilter,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
      ),
      onFilter: (value, record) => value === record.criticality,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    }),
    [criticalityFilter, criticalityOptions, t],
  );

  const tableData = useMemo(
    () =>
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
          originalData: item,
        }),
      ) ?? [],
    [GetComplianceStandingReport],
  );

  const columns = useMemo(() => {
    const sortIcon = (sortState) =>
      sortState === "descend" ? ArrowUpIcon : ArrowDownIcon;

    return [
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Compliance-name")}
            <img src={sortIcon(complianceNameSort)} alt="" />
          </span>
        ),
        dataIndex: "ComplianceName",
        key: "ComplianceName",
        width: "27%",
        sorter: (a, b) =>
          a.ComplianceName?.toLowerCase().localeCompare(
            b.ComplianceName?.toLowerCase(),
          ),
        sortOrder: complianceNameSort,
        render: (text) => <span>{text}</span>,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Authority")}
            <img src={sortIcon(authoritySort)} alt="" />
          </span>
        ),
        dataIndex: "Authority",
        key: "Authority",
        sorter: (a, b) =>
          a.Authority?.toLowerCase().localeCompare(b.Authority?.toLowerCase()),
        sortOrder: authoritySort,
        render: (text) => <span className={styles.badge}>{text}</span>,
      },
      {
        title: t("Criticality"),
        dataIndex: "criticality",
        key: "criticality",
        ellipsis: true,
        align: "center",
        ...criticalityColumnProps,
        render: (value) => (
          <span style={CRITICALITY_STYLE[value] ?? {}}>
            {value === 1 ? t("High") : value === 2 ? t("Medium") : t("Low")}
          </span>
        ),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Due-date")}
            <img src={sortIcon(dueDateSort)} alt="" />
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
            <img
              src={sortIcon(totalCheckListsSort)}
              alt=""
              className="cursor-pointer"
            />
          </span>
        ),
        dataIndex: "totalChecklists",
        key: "totalChecklists",
        width: "12%",
        ellipsis: true,
        align: "center",
        sorter: (a, b) => (a.totalChecklists || 0) - (b.totalChecklists || 0),
        sortOrder: totalCheckListsSort,
        render: (text) => <span>{text}</span>,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("No-of-tasks")}
            <img
              src={sortIcon(noOfTasksSort)}
              alt=""
              className="cursor-pointer"
            />
          </span>
        ),
        dataIndex: "NoOfTasks",
        key: "NoOfTasks",
        width: "10%",
        ellipsis: true,
        align: "center",
        sorter: (a, b) => (a.NoOfTasks || 0) - (b.NoOfTasks || 0),
        sortOrder: noOfTasksSort,
        render: (text) => <span>{text}</span>,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Overdue-tasks")}
            <img
              src={sortIcon(overdueTasksSort)}
              alt=""
              className="cursor-pointer"
            />
          </span>
        ),
        dataIndex: "overdueTasks",
        key: "overdueTasks",
        width: "11%",
        ellipsis: true,
        align: "center",
        sorter: (a, b) => (a.overdueTasks || 0) - (b.overdueTasks || 0),
        sortOrder: overdueTasksSort,
        render: (text) => <span>{text}</span>,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Progress")}
            <img
              src={sortIcon(progressSort)}
              alt=""
              className="cursor-pointer"
            />
          </span>
        ),
        dataIndex: "Progress",
        key: "Progress",
        width: "8%",
        align: "center",
        ellipsis: true,
        sorter: (a, b) => (a.Progress || 0) - (b.Progress || 0),
        sortOrder: progressSort,
        render: (text) => <span>{text}%</span>,
      },
      {
        title: "",
        key: "arrow",
        align: "right",
        width: "5%",
        render: (_, record) => {
          const isExpanded = expandedRowKeys.includes(record.key);
          return (
            <span
              onClick={(e) => {
                e.stopPropagation();
                toggleRowExpand(record.key);
              }}
              style={{ cursor: "pointer", fontSize: "16px" }}
            >
              {isExpanded ? <UpOutlined /> : <DownOutlined />}
            </span>
          );
        },
      },
    ];
  }, [
    complianceNameSort,
    authoritySort,
    dueDateSort,
    totalCheckListsSort,
    noOfTasksSort,
    overdueTasksSort,
    progressSort,
    criticalityColumnProps,
    expandedRowKeys,
    t,
  ]);

  // Get current PDF data
  const currentPdfData =
    window.__PDF_CHUNK_DATA__ ||
    GetComplianceStandingReport?.complianceStandingReport?.complianceListData;

  return (
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
              <Col xs="auto">
                <img
                  src={BackButton}
                  alt="BackButton"
                  className={styles.goBackButton}
                  onClick={() => setComplianceStandingReport(false)}
                />
              </Col>
              <Col lg={2} xs="auto" className={styles.iconTextWrapper}>
                <img src={Verification} alt="Verification" />
                <div>
                  <label>{t("Report-type")}:</label>
                  <p>{t("Compliance-standing")}</p>
                </div>
              </Col>
              <Col
                lg={5}
                xs="auto"
                className={`${styles.iconTextWrapper} d-flex justify-content-center`}
              >
                <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                <div>
                  <label>{t("Generated-date")}:</label>
                  <p>
                    {formatDateToYMD(
                      GetComplianceStandingReport?.complianceStandingReport
                        ?.generatedDate,
                    ) || "-"}
                  </p>
                </div>
              </Col>
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
              <Col lg={1} xs="auto">
                <CustomButton
                  text="Download"
                  loading={isGenerating}
                  onClick={handleDownloadPDF}
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
                <div className={styles.titleBlueColor}>
                  <label>{t("Report-title")}:</label>
                  <p>
                    {GetComplianceStandingReport?.complianceStandingReport
                      ?.reportTitle || "No Compliance Standing Report Title"}
                  </p>
                </div>
              </Col>
            </Row>

            <div className={styles.tableWrapper}>
              <CustomTable
                rows={tableData}
                column={columns}
                pagination={false}
                rowKey="key"
                onChange={handleChangeStandingReportSorter}
                expandable={{
                  showExpandColumn: false,
                  expandedRowKeys,
                  onExpandedRowsChange: setExpandedRowKeys,
                  expandedRowRender: (record) => {
                    const item = record.originalData;
                    if (!item) return null;
                    return (
                      <div className="">
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
                              <Row>
                                <Col
                                  lg={12}
                                  className={styles.ChecklistMainHeading}
                                >
                                  <div className={styles.titleBlueColor}>
                                    <label>{t("Checklist-title")}:</label>
                                    <p>{checklist.checklistTitle}</p>
                                  </div>
                                </Col>
                              </Row>
                              <div className={styles.MainAccordianTable}>
                                {!checklist?.checklistTasks?.length ? (
                                  <div className={styles.NoDataFoundTable}>
                                    <div
                                      className={styles.nodatafound_subHeading}
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
                                              styles.insideAccordianMain
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
                                            <p>{task.taskAssignee || "-"}</p>
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
                                              {formatDateToYMD(task.dueDate) ||
                                                "-"}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col lg={2}>
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Completed-on")}:</label>
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
                                            <p>{task.status || "-"}</p>
                                          </div>
                                        </Col>
                                        <Col lg={2}>
                                          <div
                                            className={
                                              styles.insideAccordianSubHeading
                                            }
                                          >
                                            <label>{t("Completed")}:</label>
                                            <p>
                                              {task.completionStatus || "-"}
                                            </p>
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
                className="Compliance_Table Report_Table mt-3"
              />
            </div>
          </>
        )}

        {showPdfLayout && currentPdfData && (
          <div key={pdfKey}>
            <PdfLayout
              data={currentPdfData}
              reportData={GetComplianceStandingReport?.complianceStandingReport}
              dateRange={dateRange}
              t={t}
            />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ComplianceStandingReport;
