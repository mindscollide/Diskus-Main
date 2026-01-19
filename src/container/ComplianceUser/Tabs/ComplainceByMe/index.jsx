import React, { useMemo, useState, useEffect } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./complianceByMe.module.css";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  listOfComplianceByCreatorApi,
  // ViewComplianceByMeDetailsAPI,
  ViewComplianceDetailsByViewTypeAPI,
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
import {
  useAntTableScrollBottomVirtual,
  useTableScrollBottom,
} from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";

const ComplianceByMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getCompliancesForCreator = useSelector(
    (state) => state.ComplainceSettingReducerReducer.listOfComplianceByCreator
  );
  // const [complianceList, setComplianceList] = useState([]);
  // const [totalRecords, setTotalRecords] = useState(0);

  // Sort State
  const [complianceTitleSort, setComplianceTitleSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState("ascend");
  const [authoritySort, setAuthority] = useState(null);

  const {
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    showViewCompliance,
    setShowViewCompliance,
    compliancebyMePayload,
    complianceByMeList,
    setComplianceByMeList,
    setComplianceByMeTotal,
    setComplianceByMePayload,
    complianceByMeTotal,
  } = useComplianceContext();

  useEffect(() => {
    dispatch(listOfComplianceByCreatorApi(navigate, compliancebyMePayload, t));
  }, []);

  useEffect(() => {
    if (!getCompliancesForCreator) return;

    if (compliancebyMePayload.pageNumber === 0) {
      // fresh search
      setComplianceByMeList(getCompliancesForCreator.complianceList || []);
    } else {
      // lazy load
      setComplianceByMeList((prev) => [
        ...prev,
        ...(getCompliancesForCreator.complianceList || []),
      ]);
    }

    setComplianceByMeTotal(getCompliancesForCreator.totalCount || 0);
  }, [getCompliancesForCreator]);

  const handleEditCompliance = (record) => {
    const Data = {
      complianceId: record.complianceId,
      viewType: 1,
    };
    dispatch(
      ViewComplianceDetailsByViewTypeAPI(
        navigate,
        Data,
        t,
        1,
        setComplianceAddEditViewState,
        setCreateEditComplaince,
        setShowViewCompliance
      )
    );
  };

  const handleViewCompliance = (record) => {
    console.log("reached here");
    const Data = {
      complianceId: record.complianceId,
      viewType: 1,
    };
    dispatch(
      ViewComplianceDetailsByViewTypeAPI(
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
        dataIndex: "complianceStatusTitle",
        key: "complianceStatusTitle",
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
            <div className="d-flex align-item-center justify-content-center gap-2">
              <CustomButton
                className={styles["actionButtons_complianceList"]}
                text={"Edit"}
                onClick={() => handleEditCompliance(record)}
              />
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
    [complianceByMeList, t, authoritySort, dueDateSort, complianceTitleSort]
  );
  useAntTableScrollBottomVirtual(() => {
    if (complianceByMeList.length < complianceByMeTotal) {
      const nextPayload = {
        ...compliancebyMePayload,
        pageNumber: compliancebyMePayload.pageNumber + 10,
      };

      setComplianceByMePayload(nextPayload);
      dispatch(listOfComplianceByCreatorApi(navigate, nextPayload, t));
    }
  }, 10);
  return (
    <>
      {complianceByMeList.length > 0 ? (
        <CustomTable
          rows={complianceByMeList}
          column={columns}
          className={"Compliance_Table mt-3"}
          scroll={{ x: "scroll", y: 520 }}
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
                  {t("You-haven't-created-any-compliance-items")}

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

export default ComplianceByMe;
