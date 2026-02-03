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
import ComplianceReportLiting from "../../../../assets/images/compliance-report-listing.png";
import ComplianceStatusReportCheckedIcon from "../../../../assets/images/ComplianceStatusReportCheckedIcon.png";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox } from "antd";
import {
  formatDateToYMD,
  getDueDateTimeNumber,
} from "../../CommonComponents/commonFunctions";
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";
import { ComplianceReportListingAPI } from "../../../../store/actions/ComplainSettingActions";

const reportsData = [
  {
    type: "End of Compliance",
    reportTitle: "Establishment of Robust Multi-Factor Authentication",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Quarterly",
    reportTitle: "End of Quarter 2 - 2025",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Accumulative",
    reportTitle: "Accumulative Quarter of Q1 - Q3 2025",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "End of Compliance",
    reportTitle: "Deployment of Advanced Threat Detection",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Quarterly",
    reportTitle: "End of Quarter 1 - 2025",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Accumulative",
    reportTitle: "Accumulative Quarter of Q1 - Q3 2024",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "End of Compliance",
    reportTitle: "Establishment of Robust Multi-Factor Authentication",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Quarterly",
    reportTitle: "End of Quarter 2 - 2025",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
  {
    type: "Accumulative",
    reportTitle: "Accumulative Quarter of Q1 - Q3 2025",
    generatedOn: "05 December 2025",
    startDate: "05 December 2025",
    endDate: "05 December 2025",
  },
];

const Reports = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [reportTypeFilter, setReportTypeFilter] = useState([1, 2, 3]);
  const reportTypeOptions = [
    { label: t("End-of-Compliance-Reports"), value: 1 },
    { label: t("Quarterly-reports"), value: 2 },
    { label: t("Accumulative-reports"), value: 3 },
  ];

  const [reportTitleSort, setReportTitleSort] = useState(null);
  // const [startDateSort, setStartDateSort] = useState("ascend");
  // const [endDateSort, setEndDateSort] = useState("ascend");
  const { reportList, setViewDetailComponent } = useComplianceContext();

  useEffect(() => {
    let data = {
      reportTitle: "",
      reportTypeIds: "",
      generatedOnStartDate: "2026-01-01",
      generatedOnEndDate: "2026-01-31",
    };
    dispatch(ComplianceReportListingAPI(navigate, data, t));
  }, []);

  const columns = useMemo(
    () => [
      {
        title: t("Type"),
        dataIndex: "type",
        key: "type",
        width: "12%",
        ellipsis: true,
        align: "left",
        // ...getReportTypeColumnProps(),
        render: (text) => (
          <span>
            {text === 1
              ? t("End-of-Compliance-Reports")
              : text === 2
                ? t("Quarterly-reports")
                : t("Accumulative-reports")}
          </span>
        ),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Report-Title")}
            {reportTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : reportTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "reportTitle",
        key: "reportTitle",
        width: "35%",
        ellipsis: true,
        align: "start",
      },

      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Generated-on")}
            {reportTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : reportTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "generatedOn",
        key: "generatedOn",
        width: "13%",
        ellipsis: true,
        align: "left",
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("due-Date-From")}
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
            {t("due-Date-To")}
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
      {
        title: "",
        dataIndex: "",
        key: "",
        width: "10%",
        ellipsis: true,
        align: "center",

        render: () => {
          return (
            <div className="d-flex align-item-center justify-content-center">
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"View Report"}
                onClick={() => setViewDetailComponent(true)}
              />
            </div>
          );
        },
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: "10%",
        ellipsis: true,
        align: "center",

        render: (_, record) => {
          return (
            <div className="d-flex align-item-center justify-content-center">
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"Download"}
                // onClick={() => handleViewCompliance(record)}
              />
            </div>
          );
        },
      },
    ],
    [reportList, t],
  );

  return (
    <>
      <section className={styles["ComplianceStatusReport_Section"]}>
        <Row className={styles["ComplianceReport"]}>
          <Col lg={2} ms={2} sm={2}>
            <img className="" src={ComplianceReportLiting} alt="" />
          </Col>
          <Col lg={6} ms={6} sm={6}>
            <h4 className={styles["ComplianceStatusReport_heading"]}>
              Organization’s compliance status report as of today.{" "}
              <span
                className={styles["ComplianceStatusReportGenerated_heading"]}
              >
                Generated <img src={ComplianceStatusReportCheckedIcon} alt="" />
              </span>
            </h4>
          </Col>
          <Col lg={4} ms={4} sm={4}>
            <div className="d-flex align-items-center justify-content-center mt-3">
              <CustomButton
                className={styles["actionButtons_complianceStatusReport"]}
                text={"View Report"}
              />
            </div>
          </Col>
        </Row>
      </section>

      {reportsData.length > 0 ? (
        <CustomTable
          rows={reportsData}
          column={columns}
          className={"Compliance_Table Report_Table  mt-3"}
          // scroll={{ x: "scroll", y: 550 }}
          pagination={false}
          // onChange={handleChangeReportSorter}
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
