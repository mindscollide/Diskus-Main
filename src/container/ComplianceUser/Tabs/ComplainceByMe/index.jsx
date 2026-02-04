import React, { useMemo, useState, useEffect } from "react";
import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import styles from "./complianceByMe.module.css";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  GetComplianceAndTaskStatusesAPI,
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
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox } from "antd";

const ComplianceByMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isScroll, setIsScroll] = useState(false);
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const criticalityOptions = [
    { label: t("Low"), value: 1 },
    { label: t("Medium"), value: 2 },
    { label: t("High"), value: 3 },
  ];
  const getCompliancesForCreator = useSelector(
    (state) => state.ComplainceSettingReducerReducer.listOfComplianceByCreator,
  );

  // const [complianceList, setComplianceList] = useState([]);
  // const [totalRecords, setTotalRecords] = useState(0);

  // Sort State
  const [complianceTitleSort, setComplianceTitleSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState("ascend");
  const [authoritySort, setAuthority] = useState(null);

  // Status Filter
  const [statusFilter, setStatusFilter] = useState([]);

  const {
    setComplianceAddEditViewState,
    setCreateEditComplaince,
    setShowViewCompliance,
    complianceByMeList,
    setComplianceByMeList,
    setComplianceByMeTotal,
    complianceByMeTotal,
    searchCompliancePayload,
    setSearchCompliancePayload,
    allComplianceStatusForFilter,
  } = useComplianceContext();

  useEffect(() => {
    dispatch(
      listOfComplianceByCreatorApi(navigate, searchCompliancePayload, t),
    );
    dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
  }, []);

  useEffect(() => {
    // API not called yet
    if (getCompliancesForCreator === null) {
      if (!isScroll) {
        setComplianceByMeList([]);
        setComplianceByMeTotal(0);
      }
      return;
    }

    const list = getCompliancesForCreator?.complianceList || [];
    const total = getCompliancesForCreator?.totalCount || 0;

    setComplianceByMeTotal(total);

    if (isScroll) {
      // Lazy load → append
      setComplianceByMeList((prev) => [...prev, ...list]);
    } else {
      // Fresh load → replace
      setComplianceByMeList(list);
    }

    // reset scroll flag after handling
    setIsScroll(false);
  }, [getCompliancesForCreator]);

  useEffect(() => {
    if (allComplianceStatusForFilter?.length > 0) {
      setStatusFilter(allComplianceStatusForFilter.map((s) => s.statusTitle));
    }
  }, [allComplianceStatusForFilter]);

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
        setShowViewCompliance,
      ),
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

  const getStatusColumnProps = () => ({
    filteredValue: statusFilter,

    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      // default: select all
      if (selectedKeys.length === 0) {
        setSelectedKeys(allComplianceStatusForFilter.map((s) => s.statusTitle));
      }

      console.log(selectedKeys, "selectedKeys");

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

    onFilter: (value, record) => value === record.complianceStatusTitle,

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
      // {
      //   title: "Criticality",
      //   dataIndex: "criticality",
      //   key: "criticality",
      //   width: "10%",
      //   ellipsis: true,
      //   align: "center",

      //   render: (text, record) => {
      //     return (
      //       <span>
      //         {text === 1 ? t("High") : text === 2 ? t("Medium") : t("Low")}
      //       </span>
      //     );
      //   },
      // },

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
            {text === 1 ? t("Low") : text === 2 ? t("Medium") : t("High")}
          </span>
        ),
      },
      {
        title: t("Status"),
        dataIndex: "complianceStatusTitle",
        key: "complianceStatusTitle",
        width: "13%",
        ellipsis: true,
        align: "center",
        ...getStatusColumnProps(),
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
        width: "14%",
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
    [
      complianceByMeList,
      t,
      authoritySort,
      dueDateSort,
      complianceTitleSort,
      getCriticalityColumnProps,
      getStatusColumnProps,
    ],
  );
  useAntTableScrollBottomVirtual(() => {
    if (complianceByMeList.length < complianceByMeTotal) {
      const nextPayload = {
        ...searchCompliancePayload,
        pageNumber: searchCompliancePayload.pageNumber + 10,
      };
      setIsScroll(true);
      setSearchCompliancePayload(nextPayload);
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
