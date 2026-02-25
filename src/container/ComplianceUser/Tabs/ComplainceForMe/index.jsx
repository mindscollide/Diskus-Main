import React, { useMemo, useState, useEffect } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./complianceForMe.module.css";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  GetComplianceAndTaskStatusesAPI,
  SearchComplianceForMeApi,
  ViewComplianceDetailsByViewTypeAPI,
  // viewComplianceForMeByIdAPI,
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
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox, Tooltip } from "antd";
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";

const ComplianceForMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const { criticalityOptions } = useComplianceContext();

  const SearchComplianceForMe = useSelector(
    (state) => state.ComplainceSettingReducerReducer.SearchComplianceForMe,
  );
  // const [totalRecords, setTotalRecords] = useState(0);

  // Sort State
  const [complianceTitleSort, setComplianceTitleSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState("ascend");
  const [authoritySort, setAuthority] = useState(null);
  const [isScroll, setIsScroll] = useState(false);
  const [statusFilter, setStatusFilter] = useState([]);
  const {
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    setShowViewCompliance,
    setComplianceForMeList,
    complianceForMeList,
    complianceForMeTotal,
    setComplianceForMeTotal,
    searchCompliancePayload,
    setSearchCompliancePayload,
    allComplianceStatusForFilter,
  } = useComplianceContext();
  console.log(
    { statusFilter, allComplianceStatusForFilter, complianceForMeList },
    "setComplianceForMeList",
  );

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
      length: 10,
    };

    dispatch(SearchComplianceForMeApi(navigate, Data, t));
    dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
  }, []);

  useEffect(() => {
    // API not called yet
    if (SearchComplianceForMe === null) {
      if (!isScroll) {
        setComplianceForMeList([]);
        setComplianceForMeTotal(0);
      }
      return;
    }

    const list = SearchComplianceForMe.complianceList || [];
    const total = SearchComplianceForMe.totalCount || 0;

    setComplianceForMeTotal(total);

    if (isScroll) {
      // Lazy load → append
      setComplianceForMeList((prev) => [...prev, ...list]);
    } else {
      // Fresh load → replace
      setComplianceForMeList(list);
    }

    // reset scroll flag after handling
    setIsScroll(false);
  }, [SearchComplianceForMe]);

  // useEffect(() => {
  //   if (allComplianceStatusForFilter?.length > 0) {
  //     setStatusFilter(allComplianceStatusForFilter.map((s) => s.statusTitle));
  //   }
  // }, [allComplianceStatusForFilter]);

  const handleViewCompliance = (record) => {
    console.log("reached here");
    const Data = {
      complianceId: record.complianceId,
      viewType: 2,
    };
    dispatch(
      ViewComplianceDetailsByViewTypeAPI(
        navigate,
        Data,
        t,
        2,
        setComplianceAddEditViewState,
        setCreateEditComplaince,
        setShowViewCompliance,
      ),
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
    // ✅ Criticality filter
    if (filters?.criticality) {
      setCriticalityFilter(filters.criticality || [1, 2, 3]);
    }

    // ✅ Status filter
    if (filters?.complianceStatusTitle) {
      setStatusFilter(filters.complianceStatusTitle);
    }
  };

  const getCriticalityColumnProps = () => ({
    filteredValue: criticalityFilter, // controlled filter
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
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

  const getStatusColumnProps = () => ({
    filteredValue: statusFilter,

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      return (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={allComplianceStatusForFilter.map((s) => ({
              label: s.statusTitle,
              value: s.statusTitle,
            }))}
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values)}
            style={{ display: "flex", flexDirection: "column" }}
          />

          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            {/* Reset */}
            <CustomButton
              text={t("Reset")}
              className={styles["ResetButtonFilter"]}
              onClick={() => {
                const all = allComplianceStatusForFilter.map(
                  (s) => s.statusTitle,
                );
                setSelectedKeys(all);
                setStatusFilter(all);
                confirm();
              }}
            />

            {/* OK */}
            <CustomButton
              text={t("Ok")}
              className={styles["ResetButtonFilter"]}
              onClick={() => {
                setStatusFilter(selectedKeys);
                confirm();
              }}
            />
          </div>
        </div>
      );
    },

    onFilter: (value, record) => value === record.status,

    filterIcon: () => <ChevronDown className="filter-chevron-icon-todolist" />,
  });

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
          return (
            <span>
              <Tooltip title={text}>{text}</Tooltip>
            </span>
          );
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
        title: t("Status"),
        dataIndex: "status",
        key: "status",
        width: "13%",
        ellipsis: true,
        align: "center",
        ...getStatusColumnProps(),
        render: (text) => {
          return (
            <span>
              <Tooltip title={text}>{text}</Tooltip>
            </span>
          );
        },
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
          return (
            <span>
              <Tooltip
                title={`${formatDateToYMD(record.dueDate)}`}
              >{`${formatDateToYMD(record.dueDate)}`}</Tooltip>
            </span>
          );
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
        width: "14%",
        ellipsis: true,
        align: "center",
        render: (text) => {
          return (
            <span>
              <Tooltip title={text}>{text}</Tooltip>
            </span>
          );
        },
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
        width: "10%",
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
    [
      complianceForMeList,
      t,
      authoritySort,
      dueDateSort,
      complianceTitleSort,
      getCriticalityColumnProps,
      getStatusColumnProps,
    ],
  );

  useAntTableScrollBottomVirtual(() => {
    if (complianceForMeList.length < complianceForMeTotal) {
      const nextPayload = {
        ...searchCompliancePayload,
        pageNumber: searchCompliancePayload.pageNumber + 10,
      };
      setIsScroll(true);
      setSearchCompliancePayload(nextPayload);
      dispatch(SearchComplianceForMeApi(navigate, nextPayload, t));
    }
  }, 10);
  return (
    <>
      {complianceForMeList.length > 0 ? (
        <CustomTable
          rows={complianceForMeList}
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
