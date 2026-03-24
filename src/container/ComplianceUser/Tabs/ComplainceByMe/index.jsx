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
import { Checkbox, Tooltip } from "antd";

const ComplianceByMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isScroll, setIsScroll] = useState(false);
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);
  const { criticalityOptions } = useComplianceContext();

  const getCompliancesForCreator = useSelector(
    (state) => state.ComplainceSettingReducerReducer.listOfComplianceByCreator,
  );

  // const [complianceList, setComplianceList] = useState([]);
  // const [totalRecords, setTotalRecords] = useState(0);

  // Sort State
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate", // default sort column (optional)
    order: "ascend", // default order (optional)
  });
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
    viewAllReopenDashboardButtonFlag,
    setViewAllReopenDashboardButtonFlag,
  } = useComplianceContext();

  console.log(complianceByMeList, "complianceByMeList");

  useEffect(() => {
    let payload = { ...searchCompliancePayload };

    if (viewAllReopenDashboardButtonFlag) {
      payload = {
        ...payload,
        statusIds: [6], // reopen
      };

      dispatch(listOfComplianceByCreatorApi(navigate, payload, t));

      // reset flag after using it
      setViewAllReopenDashboardButtonFlag(false);
    } else {
      dispatch(listOfComplianceByCreatorApi(navigate, payload, t));
      dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
    }
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

  const getCriticalityColumnProps = () => ({
    filteredValue: criticalityFilter, // controlled filter
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      // default: select all

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

  //Implemented Manual SOrting because ant design allow sorting on whole column width
  const sortedComplianceList = useMemo(() => {
    if (!sortConfig.key || !sortConfig.order) return complianceByMeList;

    const sorted = [...complianceByMeList].sort((a, b) => {
      switch (sortConfig.key) {
        case "complianceTitle":
          return a.complianceTitle
            ?.toLowerCase()
            .localeCompare(b.complianceTitle?.toLowerCase());

        case "authorityShortCode":
          return a.authorityShortCode
            ?.toLowerCase()
            .localeCompare(b.authorityShortCode?.toLowerCase());

        case "dueDate":
          return (
            getDueDateTimeNumber(a.dueDate, a.dueTime) -
            getDueDateTimeNumber(b.dueDate, b.dueTime)
          );

        default:
          return 0;
      }
    });

    return sortConfig.order === "ascend" ? sorted : sorted.reverse();
  }, [complianceByMeList, sortConfig]);

  const renderSortIcon = (columnKey) => {
    const isActive = sortConfig.key === columnKey;
    const order = isActive ? sortConfig.order : null;

    const icon =
      order === "descend"
        ? ArrowUpIcon
        : order === "ascend"
          ? ArrowDownIcon
          : ArrowDownIcon;

    return (
      <img
        src={icon}
        alt=""
        className="cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();

          setSortConfig((prev) => {
            if (prev.key !== columnKey) {
              return { key: columnKey, order: "ascend" };
            }

            if (prev.order === "ascend") {
              return { key: columnKey, order: "descend" };
            }

            if (prev.order === "descend") {
              return { key: null, order: null };
            }

            return { key: columnKey, order: "ascend" };
          });
        }}
      />
    );
  };

  const columns = useMemo(
    () => [
      {
        title: (
          <span className="d-flex gap-2 align-items-center">
            {t("Compliance-title")}
            {renderSortIcon("complianceTitle")}
          </span>
        ),
        dataIndex: "complianceTitle",
        key: "complianceTitle",
        width: "43%",
        ellipsis: true,
        align: "left",
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
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
              <Tooltip title={t("High")}>{t("High")}</Tooltip>
            ) : text === 2 ? (
              <Tooltip title={t("Medium")}>{t("Medium")}</Tooltip>
            ) : (
              <Tooltip title={t("Low")}>{t("Low")}</Tooltip>
            )}
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
            {renderSortIcon("dueDate")}
          </span>
        ),
        dataIndex: "DueDate",
        key: "DueDate",
        width: "10%",
        ellipsis: true,
        align: "center",
        render: (_, record) => (
          <Tooltip title={formatDateToYMD(record.dueDate)}>
            {formatDateToYMD(record.dueDate)}
          </Tooltip>
        ),
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-center">
            {t("Authority")}
            {renderSortIcon("authorityShortCode")}
          </span>
        ),
        dataIndex: "authorityShortCode",
        key: "authorityShortCode",
        width: "14%",
        ellipsis: true,
        align: "center",
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
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
        pageNumber: sortedComplianceList.length,
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
          rows={sortedComplianceList}
          column={columns}
          className={"Compliance_Table mt-3"}
          scroll={{ x: "scroll", y: 520 }}
          pagination={false}
          onChange={(pagination, filters) => {
            if (filters?.criticality) {
              setCriticalityFilter(filters.criticality || [1, 2, 3]);
            }

            if (filters?.complianceStatusTitle) {
              setStatusFilter(filters.complianceStatusTitle);
            }
          }}
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
