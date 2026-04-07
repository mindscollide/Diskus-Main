import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Checkbox, Tooltip } from "antd";
import { ChevronDown } from "react-bootstrap-icons";

import CustomTable from "../../../../components/elements/table/Table";
import CustomButton from "../../../../components/elements/button/Button";
import { useComplianceContext } from "../../../../context/ComplianceContext";
import {
  GetComplianceAndTaskStatusesAPI,
  listOfComplianceByCreatorApi,
  ViewComplianceDetailsByViewTypeAPI,
} from "../../../../store/actions/ComplainSettingActions";
import {
  formatDateToYMD,
  getDueDateTimeNumber,
} from "../../CommonComponents/commonFunctions";
import { useAntTableScrollBottomVirtual } from "../../../Admin/Compliance/CommonFunctions/reusableFunctions";

import ArrowUpIcon from "../../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../../assets/images/sortingIcons/SorterIconAscend.png";
import DefaultSortIcon from "../../../../assets/images/sortingIcons/Double Arrow2.svg";
import NoComplianceImg from "../../../../assets/images/NoComplianceImg.png";
import styles from "./complianceByMe.module.css";
import { getFiscalQuarterDetails } from "../../../../commen/functions/validations";
import { dateConverterIntoUTCForDataroom } from "../../../../commen/functions/date_formater";
import moment from "moment";

/**
 * ComplianceByMe
 *
 * Displays the list of compliances created by the current user (Manager view).
 * Features:
 *  - Infinite scroll via useAntTableScrollBottomVirtual (appends on scroll bottom)
 *  - Manual client-side sorting on title, due date, and authority columns
 *  - Client-side filtering on criticality and status columns via Ant Design
 *    filter dropdowns (data is already fully loaded page-by-page)
 *  - Launches Create / Edit / View full-page flows via context flags
 */
const ComplianceByMe = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ── Redux ─────────────────────────────────────────────────────────────────
  const getCompliancesForCreator = useSelector(
    (state) => state.ComplainceSettingReducerReducer.listOfComplianceByCreator,
  );

  // ── Context ───────────────────────────────────────────────────────────────
  const {
    criticalityOptions,
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
    upcomingDeadlineFilterFlag,
    setUpcomingDeadlineFilterFlag,
    setIsComplianceCreateOrEdit,
  } = useComplianceContext();

  // ── Local state ───────────────────────────────────────────────────────────

  /** True while the next page is being appended (infinite scroll). */
  const [isScroll, setIsScroll] = useState(false);

  /** Active sort column and direction. Null key/order means unsorted. */
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    order: "descend",
  });

  /** Controlled filter values for the Criticality column (1=High, 2=Med, 3=Low). */
  const [criticalityFilter, setCriticalityFilter] = useState([1, 2, 3]);

  /** Controlled filter values for the Status column (array of statusTitle strings). */
  const [statusFilter, setStatusFilter] = useState([]);

  // ── Mount effect ──────────────────────────────────────────────────────────

  /**
   * On mount: fetch the initial compliance list.
   * If the "View All Reopened" dashboard button was clicked, pre-filter by
   * statusId 6 (Reopened) and then clear the flag so subsequent visits are clean.
   */
  useEffect(() => {
    const payload = { ...searchCompliancePayload };

    // ✅ UPCOMING DEADLINE FLOW
    if (upcomingDeadlineFilterFlag) {
      let startFiscalMonth = localStorage.getItem("fiscalStartMonth");
      let startFiscalDay = localStorage.getItem("fiscalYearStartDay");

      const { startDate, endDate } = getFiscalQuarterDetails({
        fiscalStartMonth: Number(startFiscalMonth),
        fiscalStartDay: Number(startFiscalDay),
      });

      const upcomingPayload = {
        ...payload,
        statusIds: [2, 6, 7], // ✅ KEEP FILTERS
        dueDateFrom: moment(startDate).format("YYYYMMDD"),
        dueDateTo: moment(endDate).format("YYYYMMDD"),
        pageNumber: 0,
      };

      // ✅ IMPORTANT: SAVE FILTERED PAYLOAD (DO NOT RESET)
      setSearchCompliancePayload(upcomingPayload);

      // ✅ API CALL
      dispatch(listOfComplianceByCreatorApi(navigate, upcomingPayload, t));

      setUpcomingDeadlineFilterFlag(false);
      return;
    }

    // ✅ REOPEN FLOW
    if (viewAllReopenDashboardButtonFlag) {
      const reopenPayload = {
        ...payload,
        statusIds: [6],
        pageNumber: 0,
      };

      // ✅ SAVE PAYLOAD
      setSearchCompliancePayload(reopenPayload);

      dispatch(listOfComplianceByCreatorApi(navigate, reopenPayload, t));

      setViewAllReopenDashboardButtonFlag(false);
    } else {
      // ✅ NORMAL FLOW
      setSearchCompliancePayload(payload);

      dispatch(listOfComplianceByCreatorApi(navigate, payload, t));
      dispatch(GetComplianceAndTaskStatusesAPI(navigate, t));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Data sync effects ─────────────────────────────────────────────────────

  /**
   * Sync Redux response into context list.
   * isScroll intentionally omitted from deps — including it would cause an
   * infinite loop since this effect resets it to false.
   */
  useEffect(() => {
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
      setComplianceByMeList((prev) => [...prev, ...list]); // append (lazy load)
    } else {
      setComplianceByMeList(list); // replace (fresh load)
    }

    setIsScroll(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCompliancesForCreator]);

  /**
   * Initialise the status filter dropdown.
   * If upcomingDeadlineFilterFlag is true (user arrived from the Upcoming
   * Deadline dashboard card), pre-select only active statuses and reset
   * the flag. Otherwise select all statuses (default behaviour).
   */
  useEffect(() => {
    if (allComplianceStatusForFilter?.length > 0 && statusFilter.length === 0) {
      setStatusFilter(allComplianceStatusForFilter.map((s) => s.statusTitle));
    }
  }, [allComplianceStatusForFilter]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  /** Opens the Edit flow (mode 1) for the given compliance record. */
  const handleEditCompliance = useCallback(
    (record) => {
      setIsComplianceCreateOrEdit(2);
      const data = { complianceId: record.complianceId, viewType: 1 };
      dispatch(
        ViewComplianceDetailsByViewTypeAPI(
          navigate,
          data,
          t,
          1,
          setComplianceAddEditViewState,
          setCreateEditComplaince,
          setShowViewCompliance,
        ),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      setComplianceAddEditViewState,
      setCreateEditComplaince,
      setShowViewCompliance,
    ],
  );

  /** Opens the View-only flow (mode 2) for the given compliance record. */
  const handleViewCompliance = useCallback(
    (record) => {
      const data = { complianceId: record.complianceId, viewType: 1 };
      dispatch(
        ViewComplianceDetailsByViewTypeAPI(
          navigate,
          data,
          t,
          2,
          setComplianceAddEditViewState,
          setCreateEditComplaince,
          setShowViewCompliance,
        ),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      setComplianceAddEditViewState,
      setCreateEditComplaince,
      setShowViewCompliance,
    ],
  );

  /**
   * Handles Ant Design table filter/sort change events.
   * We do not use Ant Design's built-in sort (manual sort is applied via
   * sortedComplianceList), so only filter state is updated here.
   */
  const handleTableChange = useCallback((_, filters) => {
    if (filters?.criticality)
      setCriticalityFilter(filters.criticality || [1, 2, 3]);
    if (filters?.complianceStatusTitle)
      setStatusFilter(filters.complianceStatusTitle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Infinite scroll ───────────────────────────────────────────────────────

  /**
   * Called by useAntTableScrollBottomVirtual when the user scrolls to the
   * bottom of the table. Loads the next page and appends it to the list.
   */
  const handleScrollBottom = useCallback(() => {
    if (complianceByMeList.length < complianceByMeTotal) {
      const nextPayload = {
        ...searchCompliancePayload,
        pageNumber: sortedComplianceList.length,
      };
      setIsScroll(true);
      setSearchCompliancePayload(nextPayload);
      dispatch(listOfComplianceByCreatorApi(navigate, nextPayload, t));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complianceByMeList.length, complianceByMeTotal, searchCompliancePayload]);

  useAntTableScrollBottomVirtual(handleScrollBottom, 10);

  // ── Sorting ───────────────────────────────────────────────────────────────

  /**
   * Client-side sort applied over the full loaded list.
   * Manual sort is used instead of Ant Design's built-in sorter because the
   * built-in sorter only activates on the header text, not the sort icon area.
   */
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

        case "dueDate": {
          const dateA = getDueDateTimeNumber(a.dueDate, a.dueTime);
          const dateB = getDueDateTimeNumber(b.dueDate, b.dueTime);

          // Primary: Due Date
          if (dateA !== dateB) {
            return sortConfig.order === "ascend"
              ? dateA - dateB
              : dateB - dateA;
          }

          // Secondary: Criticality (High → Medium → Low)
          return sortConfig.order === "ascend"
            ? a.criticality - b.criticality
            : b.criticality - a.criticality;
        }

        default:
          return 0;
      }
    });
    return sorted;
  }, [complianceByMeList, sortConfig]);

  /**
   * Renders the sort icon for a column header.
   * Clicking cycles: unsorted → ascend → descend → unsorted.
   */
  const renderSortIcon = useCallback(
    (columnKey) => {
      const isActive = sortConfig.key === columnKey;
      const order = isActive ? sortConfig.order : null;
      const icon =
        order === "ascend"
          ? ArrowUpIcon
          : order === "descend"
            ? ArrowDownIcon
            : DefaultSortIcon;

      return (
        <img
          src={icon}
          alt=""
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setSortConfig((prev) => {
              if (prev.key !== columnKey)
                return { key: columnKey, order: "ascend" };
              if (prev.order === "ascend")
                return { key: columnKey, order: "descend" };
              if (prev.order === "descend") return { key: null, order: null };
              return { key: columnKey, order: "ascend" };
            });
          }}
        />
      );
    },
    [sortConfig],
  );

  // ── Column filter props ───────────────────────────────────────────────────

  /**
   * Ant Design column props for the Criticality filter dropdown.
   * All criticality values are selected by default (Reset restores all).
   */
  const criticalityColumnProps = useMemo(
    () => ({
      filteredValue: criticalityFilter,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
        <div style={{ padding: 8 }}>
          <Checkbox.Group
            options={criticalityOptions}
            value={selectedKeys}
            onChange={(values) => setSelectedKeys(values)}
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
   * Ant Design column props for the Status filter dropdown.
   * Options are built from allComplianceStatusForFilter (loaded from API).
   */
  const statusColumnProps = useMemo(
    () => ({
      filteredValue: statusFilter,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => (
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
      ),
      onFilter: (value, record) => value === record.complianceStatusTitle,
      filterIcon: () => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    }),
    [statusFilter, allComplianceStatusForFilter, t],
  );

  // ── Columns ───────────────────────────────────────────────────────────────

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
        render: (text, record) => (
          <span onClick={() => handleViewCompliance(record)}>
            <Tooltip className="cursor-pointer" title={text}>
              {text}
            </Tooltip>
          </span>
        ),
      },
      {
        title: t("Criticality"),
        dataIndex: "criticality",
        key: "criticality",
        width: "10%",
        ellipsis: true,
        align: "center",
        ...criticalityColumnProps,
        render: (text) => (
          <span className="d-flex justify-content-center">
            <Tooltip
              title={
                text === 1 ? t("High") : text === 2 ? t("Medium") : t("Low")
              }
            >
              {text === 1 ? t("High") : text === 2 ? t("Medium") : t("Low")}
            </Tooltip>
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
        ...statusColumnProps,
        render: (text) => <Tooltip title={text}>{text}</Tooltip>,
      },
      {
        title: (
          <span className="d-flex gap-2 align-items-center justify-content-center">
            {t("Due-date")}
            {renderSortIcon("dueDate")}
          </span>
        ),
        dataIndex: "dueDate",
        key: "dueDate",
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
        key: "actions",
        width: "20%",
        ellipsis: true,
        align: "center",
        render: (_, record) => (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <CustomButton
              className={styles["actionButtons_complianceList"]}
              text="Edit"
              onClick={() => handleEditCompliance(record)}
            />
            <CustomButton
              className={styles["actionButtons_complianceList"]}
              text="View Details"
              onClick={() => handleViewCompliance(record)}
            />
          </div>
        ),
      },
    ],
    [
      t,
      renderSortIcon,
      criticalityColumnProps,
      statusColumnProps,
      handleViewCompliance,
      handleEditCompliance,
    ],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  if (complianceByMeList.length > 0) {
    return (
      <CustomTable
        rows={sortedComplianceList}
        column={columns}
        className="Compliance_Table mt-3"
        scroll={{ x: "scroll", y: 520 }}
        pagination={false}
        onChange={handleTableChange}
      />
    );
  }

  return (
    <section
      style={{ minHeight: "500px" }}
      className="w-100 d-flex justify-content-center align-items-center flex-column"
    >
      <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-center align-items-center"
        >
          <img draggable={false} src={NoComplianceImg} alt="" />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["EmptyComplianceState_heading"]}>
            {t("No-compliance-records")}
          </span>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-center">
          <span className={styles["EmptyAuthorityState_subHeading"]}>
            {t("You-haven't-created-any-compliance-items")}
          </span>
        </Col>
      </Row>
    </section>
  );
};

export default ComplianceByMe;
