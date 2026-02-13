import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import CustomTable from "../../../../components/elements/table/Table";
import { useTranslation } from "react-i18next";
import styles from "./Report.module.css";
import CustomButton from "../../../../components/elements/button/Button";
import { Col, Row } from "react-bootstrap";
import NoReportImg from "../../../../assets/images/NoReportsImg.png";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/Arrow-up.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/Arrow-down.png";
import DefaultSortIcon from "../../../../assets/images/sortingIcons/Double Arrow2.svg";
import ComplianceReportLiting from "../../../../assets/images/compliance-report-listing.png";
import ComplianceStatusReportCheckedIcon from "../../../../assets/images/ComplianceStatusReportCheckedIcon.png";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox } from "antd";
import {
  formatDateToYMD,
  getDueDateTimeNumber,
} from "../../CommonComponents/commonFunctions";
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";
import {
  ComplianceReportListingAPI,
  GetAccumulativeReportAPI,
  GetComplianceStandingReportAPI,
  GetEndOfComplianceReportAPI,
  GetQuarterReportAPI,
} from "../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import { formatDateToYYYYMMDD } from "../../../../commen/functions/date_formater";

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GetReportListingData = useSelector(
    (state) => state.ComplainceSettingReducerReducer.GetReportListingData
  );

  const [reportTypeFilter, setReportTypeFilter] = useState([1, 2, 3]);
  const reportTypeOptions = [
    { label: t("End-of-Compliance-Reports"), value: 1 },
    { label: t("Quarterly-reports"), value: 2 },
    { label: t("Accumulative-reports"), value: 3 },
  ];

  const [reportTitleSort, setReportTitleSort] = useState(null);
  const [generatedOnSort, setGeneratedOnSort] = useState(null);
  // const [startDateSort, setStartDateSort] = useState("ascend");
  // const [endDateSort, setEndDateSort] = useState("ascend");
  const {
    reportList,
    setViewDetailComponent,
    setComplianceStandingReport,
    setEndOfComplianceReport,
    setEndOfQuarterReport,
    setAccumulativeReport,
  } = useComplianceContext();

  useEffect(() => {
    let data = {
      reportTitle: "",
      reportTypeIds: "",
      generatedOnStartDate: "",
      generatedOnEndDate: "",
      sRow: 0,
      length: 10,
    };
    dispatch(ComplianceReportListingAPI(navigate, data, t));
  }, []);

  // Function
  const resetAllSorts = () => {
    setReportTitleSort(null);
    setGeneratedOnSort(null);
  };

  const handleChangeComplianceSorter = (pagination, filters, sorter) => {
    resetAllSorts();

    if (sorter.columnKey === "reportTitle") {
      setReportTitleSort(sorter.order);
    } else if (sorter.columnKey === "generatedOn") {
      setGeneratedOnSort(sorter.order);
    } else if (filters?.type) {
      setReportTypeFilter(filters.type || [1, 2, 3]);
    }
  };

  const getReportTypeColumnProps = () => ({
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
    filterIcon: () => <ChevronDown className="filter-chevron-icon-todolist" />,
  });

  const fetchEndOfComplianceReportClick = (record) => {
    console.log(record, "Check Coming here");
    if (record?.reportTypeId === 1) {
      setEndOfComplianceReport(true);
      let data = {
        reportId: Number(record?.reportId),
        reportTypeId: 1,
      };
      dispatch(GetEndOfComplianceReportAPI(navigate, data, t));
    } else if (record?.reportTypeId === 2) {
      setEndOfQuarterReport(true);
      let data = {
        reportId: Number(record?.reportId),
        reportTypeId: 2,
      };
      dispatch(GetQuarterReportAPI(navigate, data, t));
    } else if (record?.reportTypeId === 3) {
      setAccumulativeReport(true);
      let data = {
        reportId: Number(record?.reportId),
        reportTypeId: 3,
      };
      dispatch(GetAccumulativeReportAPI(navigate, data, t));
    }
  };

  const onClickOfViewPort = () => {
    setComplianceStandingReport(true);
    let data = {
      startDate: "",
      endDate: "",
    };
    dispatch(GetComplianceStandingReportAPI(navigate, data, t));
  };

  const columns = useMemo(
    () => [
      {
        title: t("Type"),
        dataIndex: "reportTypeId",
        key: "reportTypeId",
        width: "20%",
        ellipsis: true,
        align: "left",
        ...getReportTypeColumnProps(),
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
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "reportTitle",
        key: "reportTitle",
        width: "35%",
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
          return <span>{text}</span>;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Generated-on")}
            {generatedOnSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : generatedOnSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "generatedOn",
        key: "generatedOn",
        width: "13%",
        ellipsis: true,
        align: "left",
        render: (_, record) => {
          return <span>{`${formatDateToYMD(record.generatedOn)}`}</span>;
        },
        sorter: (a, b) => {
          const aTime = getDueDateTimeNumber(a.generatedOn, a.generatedOnTime);
          const bTime = getDueDateTimeNumber(b.generatedOn, b.generatedOnTime);

          if (generatedOnSort === "descend") return bTime - aTime;
          if (generatedOnSort === "ascend") return aTime - bTime;

          return aTime - bTime;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Due-date-from")}
            {reportTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : reportTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "startDate",
        key: "startDate",
        width: "13%",
        ellipsis: true,
        align: "left",
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Due-date-to")}
            {reportTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : reportTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "endDate",
        key: "endDate",
        width: "13%",
        ellipsis: true,
        align: "left",
      },
      // {
      //   title: "",
      //   dataIndex: "",
      //   key: "",
      //   width: "10%",
      //   ellipsis: true,
      //   align: "center",

      //   render: (_, record) => {
      //     return (
      //       <div className="d-flex align-item-center justify-content-center">
      //         <CustomButton
      //           className={styles["actionButtons_complianceList"]}
      //           text={"View Report"}
      //           // setEndOfQuarterReport(true)
      //           onClick={() =>
      //             record.reportTypeId === 1
      //               ? fetchEndOfComplianceReportClick(record)
      //               : record.reportTypeId === 2
      //               ? fetchEndOfComplianceReportClick(record)
      //               : record.reportTypeId === 3
      //               ? fetchEndOfComplianceReportClick(record)
      //               : null
      //           }
      //         />
      //       </div>
      //     );
      //   },
      // },
      // {
      //   title: "",
      //   dataIndex: "",
      //   key: "",
      //   width: "10%",
      //   ellipsis: true,
      //   align: "center",

      //   render: (_, record) => {
      //     return (
      //       <div className="d-flex align-item-center justify-content-center">
      //         <CustomButton
      //           className={styles["actionButtons_complianceList"]}
      //           text={"Download"}
      //           // onClick={() => handleViewCompliance(record)}
      //         />
      //       </div>
      //     );
      //   },
      // },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: "20%",
        ellipsis: true,
        align: "center",

        render: (_, record) => {
          return (
            <div className="d-flex  gap-2">
              <div className="d-flex align-item-center justify-content-center">
                <CustomButton
                  className={styles["actionButtons_complianceList"]}
                  text={"View Report"}
                  // setEndOfQuarterReport(true)
                  onClick={() =>
                    record.reportTypeId === 1
                      ? fetchEndOfComplianceReportClick(record)
                      : record.reportTypeId === 2
                      ? fetchEndOfComplianceReportClick(record)
                      : record.reportTypeId === 3
                      ? fetchEndOfComplianceReportClick(record)
                      : null
                  }
                />
              </div>
              <div className="d-flex align-item-center justify-content-center">
                <CustomButton
                  className={styles["actionButtons_complianceList"]}
                  text={"Download"}
                  // onClick={() => handleViewCompliance(record)}
                />
              </div>
            </div>
          );
        },
      },
    ],
    [reportTitleSort, getReportTypeColumnProps, generatedOnSort, t]
  );

  return (
    <>
      {GetReportListingData?.reportsList.length > 0 ? (
        <>
          <section className={styles["ComplianceStatusReport_Section"]}>
            <Row className={styles["ComplianceReport"]}>
              <Col lg={2} ms={2} sm={2}>
                <img className="" src={ComplianceReportLiting} alt="" />
              </Col>
              <Col lg={7} ms={6} sm={6}>
                <h4 className={styles["ComplianceStatusReport_heading"]}>
                  Organization’s compliance status report as of today.{" "}
                  <span
                    className={
                      styles["ComplianceStatusReportGenerated_heading"]
                    }
                  >
                    Generated{" "}
                    <img src={ComplianceStatusReportCheckedIcon} alt="" />
                  </span>
                </h4>
              </Col>
              <Col lg={3} ms={4} sm={4}>
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <CustomButton
                    className={styles["actionButtons_complianceStatusReport"]}
                    text={"View Report"}
                    onClick={onClickOfViewPort}
                  />
                </div>
              </Col>
            </Row>
          </section>
          <CustomTable
            rows={GetReportListingData?.reportsList}
            column={columns}
            className={"Compliance_Table Report_Table  mt-3"}
            // scroll={{ x: "scroll", y: 550 }}
            pagination={false}
            onChange={handleChangeComplianceSorter}
          />
        </>
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
                  {/* } */}
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

                  {/* } */}
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
