import React, { useMemo, useState, useEffect } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./complianceForMe.module.css";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SearchComplianceForMeApi,
  viewComplianceForMeByIdAPI,
} from "../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import {
  formatDateToYMD,
  getDueDateTimeNumber,
} from "../../CommonComponents/commonFunctions";
import ArrowUpIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import NoComplianceImg from "../../../../assets/images/NoComplianceImg.png";
import DefaultSortIcon from "../../../../assets/images/sortingIcons/Double Arrow2.svg";
import { Col, Row } from "react-bootstrap";

const ComplianceForMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const SearchComplianceForMe = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SearchComplianceForMe
  );
  const [complianceList, setComplianceList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  console.log("SearchComplianceForMe", SearchComplianceForMe, complianceList);

  // Sort State
  const [complianceTitleSort, setComplianceTitleSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState("ascend");
  const [authoritySort, setAuthority] = useState(null);

  const {
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    showViewCompliance,
    setShowViewCompliance,
  } = useComplianceContext();

  useEffect(() => {
    let Data = {
      complianceTitle: "",
      dueDateFrom: "",
      dueDateTo: "",
      authorityShortCode: "",
      //   tagsCSV: "",
      //   criticalityIds: [],
      //   statusIds: [],
      sRow: 0,
      length: 100,
    };

    dispatch(SearchComplianceForMeApi(navigate, Data, t));
  }, []);

  useEffect(() => {
    if (!SearchComplianceForMe) return;
    try {
      if (SearchComplianceForMe.complianceList.length > 0) {
        setComplianceList(SearchComplianceForMe.complianceList);
        setTotalRecords(SearchComplianceForMe.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
  }, [SearchComplianceForMe]);

  //   const handleEditCompliance = (record) => {
  //     const Data = {
  //       complianceId: record.complianceId,
  //     };
  //     dispatch(
  //       ViewComplianceByMeDetailsAPI(
  //         navigate,
  //         Data,
  //         t,
  //         1,
  //         setComplianceAddEditViewState,
  //         setCreateEditComplaince,
  //         setShowViewCompliance
  //       )
  //     );
  //   };

  const handleViewCompliance = (record) => {
    console.log("reached here");
    const Data = {
      complianceId: record.complianceId,
    };
    dispatch(
      viewComplianceForMeByIdAPI(
        navigate,
        Data,
        t,
        2,
        setComplianceAddEditViewState,
        setCreateEditComplaince,
        setShowViewCompliance
      )
    );
  };

  // Function
  const resetAllSorts = () => {
    setComplianceTitleSort(null);
    setDueDateSort(null);
    setAuthority(null);
  };

  const handleChangeComplianceSorter = (pagination, filters, sorter) => {
    resetAllSorts();

    if (sorter.columnKey === "complianceTitle") {
      setComplianceTitleSort(sorter.order);
    }

    if (sorter.columnKey === "DueDate") {
      setDueDateSort(sorter.order);
    }
    if (sorter.columnKey === "authorityShortCode") {
      setAuthority(sorter.order);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-start">
            {t("Compliance-title")}
            {complianceTitleSort === "descend" ? (
              <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
            ) : complianceTitleSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
            ) : (
              <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
            )}
          </span>
        ),
        dataIndex: "complianceTitle",
        key: "complianceTitle",
        width: "43%",
        ellipsis: true,
        align: "left",
        render: (text) => {
          return <span>{text}</span>;
        },
        sorter: (a, b) =>
          complianceTitleSort === "descend"
            ? b.complianceTitle
                ?.toLowerCase()
                .localeCompare(a.complianceTitle?.toLowerCase())
            : complianceTitleSort === "ascend"
            ? a.complianceTitle
                ?.toLowerCase()
                .localeCompare(b.complianceTitle?.toLowerCase())
            : a.complianceTitle
                ?.toLowerCase()
                .localeCompare(b.complianceTitle?.toLowerCase()),
      },
      {
        title: "Criticality",
        dataIndex: "criticality",
        key: "criticality",
        width: "10%",
        ellipsis: true,
        align: "center",

        render: (text, record) => {
          return (
            <span>
              {text === 1 ? t("High") : text === 2 ? t("Medium") : t("Low")}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        width: "10%",
        ellipsis: true,
        align: "center",
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-center">
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
        dataIndex: "DueDate",
        key: "DueDate",
        width: "10%",
        ellipsis: true,
        align: "center",
        render: (_, record) => {
          return <span>{`${formatDateToYMD(record.dueDate)}`}</span>;
        },
        sorter: (a, b) => {
          const aTime = getDueDateTimeNumber(a.dueDate, a.dueTime);
          const bTime = getDueDateTimeNumber(b.dueDate, b.dueTime);

          if (dueDateSort === "descend") return bTime - aTime;
          if (dueDateSort === "ascend") return aTime - bTime;

          return aTime - bTime;
        },
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-center">
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
        dataIndex: "authorityShortCode",
        key: "authorityShortCode",
        width: "17%",
        ellipsis: true,
        align: "center",
        sorter: (a, b) =>
          authoritySort === "descend"
            ? b.authorityShortCode
                ?.toLowerCase()
                .localeCompare(a.authorityShortCode?.toLowerCase())
            : authoritySort === "ascend"
            ? a.authorityShortCode
                ?.toLowerCase()
                .localeCompare(b.authorityShortCode?.toLowerCase())
            : a.authorityShortCode
                ?.toLowerCase()
                .localeCompare(b.authorityShortCode?.toLowerCase()),
      },
      {
        title: "",
        dataIndex: "",
        key: "",
        width: "20%",
        ellipsis: true,
        align: "center",

        render: (_, record) => {
          return (
            <div className="d-flex align-item-center justify-content-center">
              {/* <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"Edit"}
                onClick={() => handleEditCompliance(record)}
              /> */}
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"View Details"}
                onClick={() => handleViewCompliance(record)}
              />
            </div>
          );
        },
      },
    ],
    [complianceList, t, authoritySort, dueDateSort, complianceTitleSort]
  );
  return (
    <>
      {complianceList.length > 0 ? (
        <CustomTable
          rows={complianceList}
          column={columns}
          className={"Compliance_Table mt-3"}
          scroll={{ x: "scroll", y: 550 }}
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
                <img draggable={false} src={NoComplianceImg} alt="" />
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
                  {/* {searchPayload.shortCode !== "" ||
                  searchPayload.authorityName !== "" ||
                  searchPayload.countryId !== 0 ||
                  searchPayload.sector !== "" ||
                  searchPayload.authorityTitle !== "" */}
                  {/* ? t("No-matching-records") */}
                  {/* :  */}
                  {t("No-compliance-records")}
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
                  {/* {searchPayload.shortCode !== "" ||
                  searchPayload.authorityName !== "" ||
                  searchPayload.countryId !== 0 ||
                  searchPayload.sector !== "" ||
                  searchPayload.authorityTitle !== ""
                    ? 
                    null */}
                  {/* :  */}
                  {t("You-don't-have-any-compliance-yet")}

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

export default ComplianceForMe;
