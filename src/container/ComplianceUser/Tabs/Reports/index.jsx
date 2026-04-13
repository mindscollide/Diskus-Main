import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import CustomTable from "../../../../components/elements/table/Table";
import { useTranslation } from "react-i18next";
import styles from "./Report.module.css";
import CustomButton from "../../../../components/elements/button/Button";
import { Col, Row } from "react-bootstrap";
import NoReportImg from "../../../../assets/images/NoReportsImg.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import DefaultSortIcon from "../../../../assets/images/sortingIcons/Double Arrow2.svg";
import ComplianceReportLiting from "../../../../assets/images/compliance-report-listing.png";
import ComplianceStatusReportCheckedIcon from "../../../../assets/images/ComplianceStatusReportCheckedIcon.png";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox } from "antd";
import {
  formatDateToYMD,
  formatGeneratedOnDateTime,
} from "../../CommonComponents/commonFunctions";
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";
import {
  ComplianceReportListingAPI,
  GetAccumulativeReportAPI,
  GetComplianceStandingReportAPI,
  GetEndOfComplianceReportAPI,
  GetQuarterReportAPI,
} from "../../../../store/actions/ComplainSettingActions";

/**
 * Reports component — renders the compliance report listing for end users.
 * Handles lazy-load scrolling, column sorting/filtering, and report fetch/download.
 */
const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GetReportListingData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetReportListingData
  );

  const [isScroll, setIsScroll] = useState(false);
  const [reportTypeFilter, setReportTypeFilter] = useState([1, 2, 3]);
  const reportTypeOptions = [
    { label: t("End-of-Compliance-Reports"), value: 1 },
    { label: t("Quarterly-reports"), value: 2 },
    { label: t("Accumulative-reports"), value: 3 },
  ];

  const [reportTitleSort, setReportTitleSort] = useState(null);
  const [generatedOnSort, setGeneratedOnSort] = useState(null);
  const [startDateSort, setStartDateSort] = useState(null);
  const [endDateSort, setEndDateSort] = useState(null);

  const {
    complianceReportList,
    setComplianceReportList,
    complianceReportTotal,
    setComplianceReportTotal,
    searchComplianceReportPayload,
    setSearchComplianceReportPayload,
    setComplianceStandingReport,
    setEndOfComplianceReport,
    setEndOfQuarterReport,
    setAccumulativeReport,
    setAutoPdfDownload,
    emptyComplianceState,
  } = useComplianceContext();

  //  Initial Load
  useEffect(() => {
    dispatch(
      ComplianceReportListingAPI(navigate, searchComplianceReportPayload, t)
    );
  }, []);

  useEffect(() => {
    setSearchComplianceReportPayload({
      reportTitle: "",
      reportTitleOutside: "",
      reportType: "",
      dueDateFrom: "",
      dueDateTo: "",
      sRow: 0,
      length: 10,
    });
  }, []);

  //  Append / Replace Logic
  useEffect(() => {
    if (GetReportListingData === null) {
      if (!isScroll) {
        setComplianceReportList([]);
        setComplianceReportTotal(0);
      }
      return;
    }

    const list = GetReportListingData?.reportsList || [];
    const total = GetReportListingData?.totalCount || 0;

    setComplianceReportTotal(total);

    if (isScroll) {
      setComplianceReportList((prev) => [...prev, ...list]);
    } else {
      setComplianceReportList(list);
    }

    setIsScroll(false);
  }, [GetReportListingData]);

  // Lazy Load Scroll
  const handleScrollBottom = useCallback(() => {
    if (complianceReportList.length < complianceReportTotal) {
      const nextPayload = {
        ...searchComplianceReportPayload,
        sRow: searchComplianceReportPayload.sRow + 10,
      };

      setIsScroll(true);
      setSearchComplianceReportPayload(nextPayload);

      dispatch(ComplianceReportListingAPI(navigate, nextPayload, t));
    }
  }, [
    complianceReportList.length,
    complianceReportTotal,
    searchComplianceReportPayload,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  useAntTableScrollBottomVirtual(handleScrollBottom, 10);

  /**
   * Handles Ant Design table change events for sorting and filtering.
   * Resets all sort states before applying the new sort, and updates
   * reportTypeFilter when a filter is applied.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeComplianceSorter = useCallback(
    (pagination, filters, sorter) => {
      setReportTitleSort(null);
      setGeneratedOnSort(null);
      setStartDateSort(null);
      setEndDateSort(null);

      if (sorter.columnKey === "reportTitle") {
        setReportTitleSort(sorter.order);
      } else if (sorter.columnKey === "generatedOn") {
        setGeneratedOnSort(sorter.order);
      } else if (sorter.columnKey === "startDate") {
        setStartDateSort(sorter.order);
      } else if (sorter.columnKey === "endDate") {
        setEndDateSort(sorter.order);
      }

      if (filters?.type) {
        setReportTypeFilter(filters.type || [1, 2, 3]);
      }
    },
    []
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Returns the Ant Design column props for the report type filter column.
   * Memoized to avoid unnecessary recomputation of the columns array.
   */
  const reportTypeColumnProps = useMemo(
    () => ({
      filteredValue: reportTypeFilter,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={reportTypeOptions}
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
                const all = reportTypeOptions.map((c) => c.value);
                setSelectedKeys(all);
                setReportTypeFilter(all);
                confirm();
              }}
            />

            {/* OK */}
            <CustomButton
              text={t("Ok")}
              className={styles["ResetButtonFilter"]}
              onClick={() => {
                setReportTypeFilter(selectedKeys);
                confirm();
              }}
            />
          </div>
        </div>
      ),
      onFilter: (value, record) => value === record.reportTypeId,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    }),
    [reportTypeFilter]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Fetches or downloads a compliance report.
   * @param {object} record - The report row record from the table.
   * @param {boolean} isDownload - Whether to trigger a PDF download (true) or view (false).
   */
  const fetchReport = useCallback(
    (record, isDownload = false) => {
      const data = {
        reportId: Number(record?.reportId),
        reportTypeId: record?.reportTypeId,
      };

      if (isDownload) {
        setAutoPdfDownload(true);

        // Store old payload
        const oldPayload = { ...searchComplianceReportPayload };

        // Reset sRow temporarily
        setSearchComplianceReportPayload({ ...oldPayload, sRow: 0 });

        if (record?.reportTypeId === 1) {
          setEndOfComplianceReport(true);
          dispatch(GetEndOfComplianceReportAPI(navigate, data, t, false));
        } else if (record?.reportTypeId === 2) {
          setEndOfQuarterReport(true);
          dispatch(GetQuarterReportAPI(navigate, data, t, false));
        } else if (record?.reportTypeId === 3) {
          setAccumulativeReport(true);
          dispatch(GetAccumulativeReportAPI(navigate, data, t, false));
        }

        // Restore the original payload immediately after dispatch
        setSearchComplianceReportPayload(oldPayload);
      } else {
        // Normal View Report
        setAutoPdfDownload(false);

        if (record?.reportTypeId === 1) {
          setEndOfComplianceReport(true);
          dispatch(GetEndOfComplianceReportAPI(navigate, data, t, true));
        } else if (record?.reportTypeId === 2) {
          setEndOfQuarterReport(true);
          dispatch(GetQuarterReportAPI(navigate, data, t, true));
        } else if (record?.reportTypeId === 3) {
          setAccumulativeReport(true);
          dispatch(GetAccumulativeReportAPI(navigate, data, t, true));
        }
      }
    },
    [
      searchComplianceReportPayload,
      setAutoPdfDownload,
      setEndOfComplianceReport,
      setEndOfQuarterReport,
      setAccumulativeReport,
      setSearchComplianceReportPayload,
    ]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Opens the organisation-wide compliance standing report view.
   */
  const onClickOfViewPort = useCallback(() => {
    setComplianceStandingReport(true);
    dispatch(
      GetComplianceStandingReportAPI(
        navigate,
        { startDate: "", endDate: "" },
        t
      )
    );
  }, [setComplianceStandingReport]); // eslint-disable-line react-hooks/exhaustive-deps

  const columns = useMemo(
    () => [
      {
        title: t("Type"),
        dataIndex: "reportTypeId",
        key: "reportTypeId",
        width: "20%",
        ellipsis: true,
        align: "left",
        ...reportTypeColumnProps,
        render: (_, record) => {
          return (
            <span>
              {record.reportTypeId === 1
                ? t("End-of-Compliance-Reports")
                : record.reportTypeId === 2
                ? t("Quarterly-reports")
                : t("Accumulative-reports")}
            </span>
          );
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Report-title")}
            {reportTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : reportTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "reportTitle",
        key: "reportTitle",
        width: "27%",
        ellipsis: true,
        sorter: (a, b) =>
          reportTitleSort === "descend"
            ? b.reportTitle
                ?.toLowerCase()
                .localeCompare(a.reportTitle?.toLowerCase())
            : reportTitleSort === "ascend"
            ? a.reportTitle
                ?.toLowerCase()
                .localeCompare(b.reportTitle?.toLowerCase())
            : a.reportTitle
                ?.toLowerCase()
                .localeCompare(b.reportTitle?.toLowerCase()),
        align: "start",
        render: (text) => {
          const complianceTitle = text?.includes(" - ")
            ? text.split(" - ")[1]
            : text;

          return <span>{complianceTitle}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Generated-on")}
            {generatedOnSort === "descend" ? (
              <img src={ArrowDownIcon} alt="" />
            ) : generatedOnSort === "ascend" ? (
              <img src={ArrowUpIcon} alt="" />
            ) : (
              <img src={ArrowDownIcon} alt="" />
            )}
          </span>
        ),
        dataIndex: "generatedOn",
        key: "generatedOn",
        width: "15%",
        ellipsis: true,
        align: "left",
        sortDirections: ["descend", "ascend"],
        onHeaderCell: () => ({
          onClick: () => {
            setGeneratedOnSort((order) => {
              if (order === "descend") return "ascend";
              if (order === "ascend") return null;
              return "descend";
            });
          },
        }),
        sorter: (a, b) => {
          const parseDateTime = (d, t) =>
            Date.parse(
              `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}, ${t.slice(
                0,
                2
              )}:${t.slice(2, 4)}:${t.slice(4, 6)}`
            );
          const diff =
            parseDateTime(a.generatedOn, a.generatedOnTime) -
            parseDateTime(b.generatedOn, b.generatedOnTime);
          return generatedOnSort === "descend"
            ? -diff
            : generatedOnSort === "ascend"
            ? diff
            : 0;
        },
        render: (_, record) => (
          <span>
            {formatGeneratedOnDateTime(
              record.generatedOn,
              record.generatedOnTime
            )}
          </span>
        ),
        generatedOnSort,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Starts-dates")}
            {startDateSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : startDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "startDate",
        key: "startDate",
        width: "12%",
        ellipsis: true,
        align: "left",
        render: (_, record) => <span>{formatDateToYMD(record.startDate)}</span>,
        sorter: (a, b) => {
          const aTime = Number(a.startDate);
          const bTime = Number(b.startDate);

          if (startDateSort === "descend") return bTime - aTime;
          if (startDateSort === "ascend") return aTime - bTime;

          return aTime - bTime;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Due-date-to")}
            {endDateSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : endDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "endDate",
        key: "endDate",
        width: "12%",
        ellipsis: true,
        align: "left",
        render: (_, record) => <span>{formatDateToYMD(record.endDate)}</span>,
        sorter: (a, b) => {
          const aTime = Number(a.endDate);
          const bTime = Number(b.endDate);

          if (endDateSort === "descend") return bTime - aTime;
          if (endDateSort === "ascend") return aTime - bTime;

          return aTime - bTime;
        },
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: "250px",
        ellipsis: true,
        align: "center",

        render: (_, record) => {
          return (
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                alignItems: "center",
                whiteSpace: "nowrap",
                minWidth: "220px",
              }}
            >
              <div className="d-flex align-item-center justify-content-center">
                <CustomButton
                  className={styles["actionButtons_complianceList"]}
                  text={"View Report"}
                  onClick={() => fetchReport(record, false)}
                />
              </div>
              <div className="d-flex align-item-center justify-content-center">
                <CustomButton
                  className={styles["actionButtons_complianceList"]}
                  text={"Download"}
                  onClick={() => fetchReport(record, true)}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [
      reportTitleSort,
      reportTypeColumnProps,
      generatedOnSort,
      startDateSort,
      endDateSort,
      fetchReport,
      t,
    ]
  );

  return (
    <>
      <section className={styles["ComplianceStatusReport_Section"]}>
        <Row className={styles["ComplianceReport"]}>
          <Col lg={2} md={2} sm={2}>
            <img className=" " src={ComplianceReportLiting} alt="" />
          </Col>
          <Col lg={7} md={6} sm={6}>
            <h4 className={styles["ComplianceStatusReport_heading"]}>
              {t("Organizations-compliance-status-report-as-of-today.")}

              {/* <span
                className={styles["ComplianceStatusReportGenerated_heading"]}
              >
                {t("Generated")}
                <img src={ComplianceStatusReportCheckedIcon} alt="" />
              </span> */}
            </h4>
          </Col>
          <Col lg={3} md={4} sm={4}>
            <div className="d-flex align-items-center justify-content-center  mt-3">
              <CustomButton
                className={styles["actionButtons_complianceStatusReport"]}
                text={"View Report"}
                onClick={onClickOfViewPort}
              />
            </div>
          </Col>
        </Row>
      </section>
      {complianceReportList?.length > 0 ? (
        <CustomTable
          rows={complianceReportList}
          column={columns}
          className={"Compliance_Table Report_Table  mt-3"}
          scroll={{ y: 400 }}
          pagination={false}
          onChange={handleChangeComplianceSorter}
        />
      ) : (
        <>
          <section
            style={{
              minHeight: "500px",
            }}
            className="w-100  d-flex justify-content-center align-items-center flex-column"
          >
            <Row className="mt-3 ">
              <Col
                lg={12}
                ms={12}
                sm={12}
                className="d-flex justify-content-center align-items-center"
              >
                <img draggable={false} src={NoReportImg} alt="" />
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["EmptyComplianceState_heading"]}>
                  {t("No-reports-available")}
                </span>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["EmptyAuthorityState_subHeading"]}>
                  {t("You-don't-have-any-report-at-the-moment")}
                </span>
              </Col>
            </Row>
          </section>
        </>
      )}
    </>
  );
};

export default Reports;
