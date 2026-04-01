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
import generatePDF, { Resolution, Margin } from "react-to-pdf";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceStandingReportAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useTranslation } from "react-i18next";
import { formatDateToYMD } from "../../../CommonComponents/commonFunctions";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";

// ---------------------------------------------------------------------------
// Module-level constants (no component-state dependency → never recreated)
// ---------------------------------------------------------------------------

/** react-to-pdf options for a high-resolution landscape A4 PDF. */
const PDF_OPTIONS = {
  method: "save",
  filename: "Compliance Standing Report.pdf",
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.SMALL,
    format: "A4",
    orientation: "landscape",
  },
  canvas: { mimeType: "image/png", qualityRatio: 1 },
  overrides: {
    pdf: { compress: true },
    canvas: { useCORS: true },
  },
};

/** Returns the DOM node captured by react-to-pdf. */
const getTargetElement = () => document.getElementById("content-id");

// ---------------------------------------------------------------------------
// Criticality style map (static — defined once at module level)
// ---------------------------------------------------------------------------

/** Inline-style map keyed by criticality value (1 = High, 2 = Medium, 3 = Low). */
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * ComplianceStandingReport
 *
 * Displays a sortable, filterable compliance standing report with:
 *  - A header bar (back button, report metadata, date-range picker, PDF download).
 *  - An Ant Design table with expandable rows showing checklist / task detail.
 *  - A hidden print layout (`#content-id`) mounted only during PDF generation.
 *
 * @returns {JSX.Element}
 */
const ComplianceStandingReport = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Context ───────────────────────────────────────────────────────────────
  const { criticalityOptions, setComplianceStandingReport } =
    useComplianceContext();

  // ── Redux ─────────────────────────────────────────────────────────────────
  /** Full API response: `{ complianceStandingReport: { reportTitle, generatedDate, complianceListData[] } }` */
  const GetComplianceStandingReport = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer.GetComplianceStandingReport,
  );

  // ── Local state ───────────────────────────────────────────────────────────

  /** Active criticality filter values; defaults to all three levels selected. */
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);

  // Per-column sort direction: null | "ascend" | "descend"
  const [complianceNameSort, setComplianceNameSort] = useState(null);
  const [authoritySort, setAuthoritySort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState(null);
  const [totalCheckListsSort, setTotalCheckListsSort] = useState(null);
  const [noOfTasksSort, setNoOfTasksSort] = useState(null);
  const [overdueTasksSort, setOverdueTasksSort] = useState(null);
  const [progressSort, setProgressSort] = useState(null);

  /** True while PDF generation is in progress — shows the Spin overlay. */
  const [isGenerating, setIsGenerating] = useState(false);

  /**
   * When true the interactive layout is replaced by the PDF print layout
   * (`#content-id`) so react-to-pdf can capture it.
   */
  const [showPdfLayout, setShowPdfLayout] = useState(false);

  /** Currently selected RangePicker value (pair of dayjs objects or null). */
  const [dateRange, setDateRange] = useState(null);

  /** Keys of currently expanded table rows. */
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /**
   * Generates and saves the compliance standing report as a PDF.
   *
   * Flow: show print layout → wait for DOM + fonts → generate → restore layout.
   */
  const handleClickGenerateODF = async () => {
    try {
      setIsGenerating(true);
      setShowPdfLayout(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
      await document.fonts.ready;
      await generatePDF(getTargetElement, PDF_OPTIONS);
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setShowPdfLayout(false);
      setIsGenerating(false);
    }
  };

  /**
   * Handles RangePicker changes.
   *
   * Clears the filter when `dates` is null; otherwise stores the selection and
   * dispatches the API call with the formatted start/end dates.
   *
   * @param {import("dayjs").Dayjs[] | null} dates
   */
  const handleDateRangeChange = (dates) => {
    if (!dates) {
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
      GetComplianceStandingReportAPI(navigate, { startDate, endDate }, t),
    );
  };

  /**
   * Resets every column's sort direction to null.
   * Always called before applying a new sort so only one column is active.
   */
  const resetAllSorts = () => {
    setComplianceNameSort(null);
    setAuthoritySort(null);
    setDueDateSort(null);
    setTotalCheckListsSort(null);
    setNoOfTasksSort(null);
    setOverdueTasksSort(null);
    setProgressSort(null);
  };

  /**
   * Ant Design Table `onChange` handler.
   *
   * Resets all column sorts, activates the clicked column's sort, and syncs
   * the criticality filter when the user confirms a filter selection.
   *
   * @param {object} _pagination - Unused; present to match the Table signature.
   * @param {object} filters     - Active filter values keyed by column key.
   * @param {object} sorter      - Active sorter `{ columnKey, order }`.
   */
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

  /**
   * Toggles the expanded/collapsed state of a single table row.
   *
   * @param {string | number} key - The row `key` to toggle.
   */
  const toggleRowExpand = (key) => {
    setExpandedRowKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // ── Memoised values ───────────────────────────────────────────────────────

  /**
   * Stable criticality filter-dropdown column props.
   *
   * FIX: Previously `getCriticalityColumnProps` was a plain function referenced
   * in the `columns` useMemo dependency array.  A new function reference was
   * created on every render, causing `columns` to rebuild unnecessarily.
   * Now inlined as a stable memoised object.
   */
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

  /**
   * Table data derived from the Redux API response.
   * Falls back to an empty array while data is loading.
   */
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

  /**
   * Column definitions for the Ant Design Table.
   *
   * FIX 1: `expandedRowKeys` was missing from deps — arrow icon showed stale state.
   * FIX 2: Progress sorter used `a.progressSort` (undefined) — corrected to `a.Progress`.
   * FIX 3: Criticality column had two `render` functions — duplicate removed;
   *        kept the correct one (1=High, 2=Medium, 3=Low).
   */
  const columns = useMemo(() => {
    /**
     * Returns the correct sort-arrow icon for a given sort state.
     * @param {"ascend"|"descend"|null} sortState
     * @returns {string} image src
     */
    const sortIcon = (sortState) =>
      sortState === "descend" ? ArrowUpIcon : ArrowDownIcon;

    return [
      // ── Compliance Name ──────────────────────────────────────────────────
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Compliance-name")}
            <img src={sortIcon(complianceNameSort)} alt="" />
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
        render: (text) => <span>{text}</span>,
      },

      // ── Authority ────────────────────────────────────────────────────────
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

      // ── Criticality ──────────────────────────────────────────────────────
      // FIX: removed duplicate render; correct label order: 1=High, 2=Medium, 3=Low
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

      // ── Due Date ─────────────────────────────────────────────────────────
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

      // ── Total Checklists ─────────────────────────────────────────────────
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

      // ── No. of Tasks ─────────────────────────────────────────────────────
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

      // ── Overdue Tasks ────────────────────────────────────────────────────
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

      // ── Progress ─────────────────────────────────────────────────────────
      // FIX: sorter was `a.progressSort` (always undefined) → corrected to `a.Progress`
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

      // ── Expand / Collapse toggle ─────────────────────────────────────────
      // FIX: expandedRowKeys added to deps so arrow icon re-renders on toggle
      {
        title: "",
        key: "arrow",
        align: "right",
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
    expandedRowKeys, // FIX: was missing
    t,
  ]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className={styles.mainDivComplianceStanding}>
      <Spin
        spinning={isGenerating}
        size="large"
        tip="Generating PDF..."
        className="d-flex justify-content-center align-items-center"
      >
        {/* ==================================================================
            INTERACTIVE LAYOUT — visible during normal usage
        ================================================================== */}
        {!showPdfLayout && (
          <>
            {/* ── Header row ─────────────────────────────────────────────── */}
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
                  onClick={handleClickGenerateODF}
                  className={styles.complianceDownloadBtn}
                />
              </Col>
            </Row>

            {/* ── Report title ───────────────────────────────────────────── */}
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

            {/* ── Compliance table ───────────────────────────────────────── */}
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
                              {/* Checklist title */}
                              <Row>
                                <Col
                                  lg={12}
                                  className={styles.ComplianceMainHeading}
                                >
                                  <div className={styles.titleBlueColor}>
                                    <label>{t("Checklist-title")}:</label>
                                    <p>{checklist.checklistTitle}</p>
                                  </div>
                                </Col>
                              </Row>

                              {/* Task list */}
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

        {/* ==================================================================
            PDF PRINT LAYOUT — mounted only while generating the PDF
        ================================================================== */}
        {showPdfLayout && (
          <div id="content-id">
            {/* Report title */}
            <Row>
              <Col
                lg={12}
                xs="auto"
                className={`${styles.ComplianceMainHeading} mt-4`}
              >
                <div>
                  <label>{t("Report-title")}:</label>
                  <p>
                    {GetComplianceStandingReport?.complianceStandingReport
                      ?.reportTitle || "-"}
                  </p>
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
                    {formatDateToYMD(
                      GetComplianceStandingReport?.complianceStandingReport
                        ?.generatedDate,
                    ) || "-"}
                  </p>
                </div>
              </Col>
              {/* FIX: was hardcoded "-"; now reflects the actual selected date range */}
              <Col className={styles.iconTextWrapperPDF}>
                <img src={ComplianceCalendar} alt="ComplianceCalendar" />
                <div>
                  <label>{t("Date-range")}:</label>
                  <p>
                    {dateRange
                      ? `${dateRange[0].format("DD/MM/YYYY")} - ${dateRange[1].format("DD/MM/YYYY")}`
                      : "-"}
                  </p>
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
                <p>{t("Compliances-in-this-report")}:</p>
              </Col>

              {GetComplianceStandingReport?.complianceStandingReport?.complianceListData?.map(
                (compliance, index) => (
                  <Col
                    key={compliance.complianceId} // FIX: was complianceID (wrong casing)
                    lg={12}
                    xs="auto"
                    className={styles.checklist_report}
                  >
                    {/* Compliance title */}
                    <div className={styles.titleSection}>
                      <label>{t("Compliance-title")}:</label>
                      <p className={styles.longTitle}>
                        {`${index + 1}. ${
                          compliance.complianceTitle || "No Compliance Title"
                        }`}
                      </p>
                    </div>

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
                          className={styles.panelContent}
                          key={checklist.checklistId} // FIX: was checklistID (wrong casing)
                        >
                          {/* Checklist title */}
                          <div className={styles.titleSection}>
                            <label className={styles.ChecklistTitle}>
                              {t("Checklists-title")}:
                            </label>
                            <p className={styles.longTitleHeading}>
                              {checklist.checklistTitle}
                            </p>
                          </div>

                          {/* Tasks */}
                          {!checklist?.checklistTasks?.length ? (
                            <div className={styles.NoDataFoundTable}>
                              <div className={styles.nodatafound_subHeading}>
                                {t("No-Checklist-Task")}
                              </div>
                            </div>
                          ) : (
                            checklist.checklistTasks.map((task) => (
                              <div
                                key={task.taskId} // FIX: was taskID (wrong casing)
                                className={styles.insideAccordianTable}
                              >
                                {/* Task title */}
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

                                {/* Task metadata */}
                                <Row>
                                  <Col lg={4} xs="auto">
                                    <div
                                      className={
                                        styles.insideAccordianSubHeading
                                      }
                                    >
                                      <label>{t("Assignee")}:</label>
                                      <p>{task.taskAssignee || "-"}</p>
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
                                        {formatDateToYMD(task.dueDate) || "-"}
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
                                          task.completedOnDate,
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
                                      <p>{task.completionStatus || "-"}</p>
                                    </div>
                                  </Col>
                                  <Col lg={2} xs="auto">
                                    <div
                                      className={
                                        styles.insideAccordianSubHeading
                                      }
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
                  </Col>
                ),
              )}
            </Row>
          </div>
        )}
      </Spin>
    </div>
  );
};

export default ComplianceStandingReport;
