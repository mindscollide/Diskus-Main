import React, { useEffect, useMemo, useRef, useState } from "react";
import { Col, Row } from "react-bootstrap";
import styles from "./viewComplianceTasks.module.css";
import { Button } from "../../../../../components/elements";
import CustomAccordion from "../../../../../components/elements/accordian/CustomAccordion";
import { useTranslation } from "react-i18next";
// import Accordion_Arrow from "../../../../assets/images/Accordion_Arrow.png";
import Accordion_Arrow from "../../../../../assets/images/Accordion_Arrow.png";
import NoChecklistImg from "../../../../../assets/images/NoChecklistImg.png";
import { useComplianceContext } from "../../../../../context/ComplianceContext";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetComplianceChecklistsWithTasksByComplianceIdAPI } from "../../../../../store/actions/ComplainSettingActions";
import { useSelector } from "react-redux";
import ArrowDownIcon from "../../../../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowUpIcon from "../../../../../assets/images/sortingIcons/SorterIconDescend.png";
import DefaultSortIcon from "../../../../../assets/images/sortingIcons/Double Arrow2.svg";
import deleteIcon from "../../../../../assets/images/Icon material-delete.png";
import IconAttachment from "../../../../../assets/images/Icon-Attachment.png";
import { ChevronDown } from "react-bootstrap-icons";
import CustomTable from "../../../../../components/elements/table/Table";
import { formatDateToYMD } from "../../commonFunctions";

const ViewComplianceTasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [viewComplianceTasksData, setViewComplianceTasksData] = useState([]);
  const accordionContainerRef = useRef();
  const { t } = useTranslation();
  const [addChecklistCloseState, setAddChecklistCloseState] = useState(false);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);

  // Sort States
  const [taskTitleSort, setTaskTitleSort] = useState("ascend");
  const [assignedToSort, setAssignedToSort] = useState(null);
  const [dueDateSort, setDueDateSort] = useState(null);
  const [statusFilter, setStatusFilter] = useState(["Active", "In Progress"]);

  // context
  const { allCheckListByComplianceId, complianceDetailsState } =
    useComplianceContext();
  console.log(
    complianceDetailsState,
    "complianceDetailsStatecomplianceDetailsState"
  );
  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId
  );

  // global State Response

  useEffect(() => {
    if (complianceDetailsState.complianceId !== 0) {
      let Data = {
        complianceId: complianceDetailsState.complianceId,
      };
      dispatch(
        GetComplianceChecklistsWithTasksByComplianceIdAPI(navigate, Data, t)
      );
    }
  }, [complianceDetailsState]);

  useEffect(() => {
    if (
      getAllComplianceChecklistTask &&
      getAllComplianceChecklistTask !== null
    ) {
      try {
        const { checklistList } = getAllComplianceChecklistTask;
        setViewComplianceTasksData(checklistList);
      } catch (error) {}
    }
  }, [getAllComplianceChecklistTask]);

  // functions
  const handleClickExpandCheckList = (data) => {
    setExpandedCheckListIds((prev) => {
      if (prev.includes(data.checklistId)) {
        // collapse

        return prev.filter((id) => id !== data.checklistId);
      } else {
        setAddChecklistCloseState(true);
        // expand
        return [...prev, data.checklistId];
      }
    });
  };

  // TABLES
  // Column
  const columnsTasks = [
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
          {t("Task-title")}
          {taskTitleSort === "descend" ? (
            <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
          ) : taskTitleSort === "ascend" ? (
            <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
          ) : (
            <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
          )}
        </span>
      ),
      dataIndex: "taskTitle",
      key: "taskTitle",
      width: "25%",
      ellipsis: true,
      align: "left",
      render: (text) => <span className="text-truncate">{text}</span>,
      sorter: (a, b) =>
        taskTitleSort === "descend"
          ? b.taskTitle?.toLowerCase().localeCompare(a.taskTitle?.toLowerCase())
          : taskTitleSort === "ascend"
          ? a.taskTitle?.toLowerCase().localeCompare(b.taskTitle?.toLowerCase())
          : a.taskTitle
              ?.toLowerCase()
              .localeCompare(b.taskTitle?.toLowerCase()),
    },

    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
          {t("Assigned-to")}
          {assignedToSort === "descend" ? (
            <img src={ArrowUpIcon} alt="" className="cursor-pointer" />
          ) : assignedToSort === "ascend" ? (
            <img src={ArrowDownIcon} alt="" className="cursor-pointer" />
          ) : (
            <img src={DefaultSortIcon} alt="" className="cursor-pointer" />
          )}
        </span>
      ),

      dataIndex: "shortCode",
      key: "shortCode",
      width: "15%",
      align: "left",
      ellipsis: true,
      sorter: (a, b) =>
        assignedToSort === "descend"
          ? b.shortCode?.toLowerCase().localeCompare(a.shortCode?.toLowerCase())
          : assignedToSort === "ascend"
          ? a.shortCode?.toLowerCase().localeCompare(b.shortCode?.toLowerCase())
          : a.shortCode
              ?.toLowerCase()
              .localeCompare(b.shortCode?.toLowerCase()),
    },
    {
      title: (
        <span className="d-flex gap-2 align-items-center justify-content-start">
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
      sorter: (a, b) =>
        dueDateSort === "descend"
          ? b.deadLineDate
              ?.toLowerCase()
              .localeCompare(a.deadLineDate?.toLowerCase())
          : dueDateSort === "ascend"
          ? a.deadLineDate
              ?.toLowerCase()
              .localeCompare(b.deadLineDate?.toLowerCase())
          : a.deadLineDate
              ?.toLowerCase()
              .localeCompare(b.deadLineDate?.toLowerCase()),

      dataIndex: "deadLineDate",
      key: "deadLineDate",
      width: "12%",
      align: "left",
      ellipsis: true,
      render: (text) => (
        <span className="text-truncate">{formatDateToYMD(text)}</span>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "taskStatus",
      key: "taskStatus",
      width: "10%",
      align: "center",
      ellipsis: true,
      // filters: [
      //   { text: "Active", value: "In Progress" },
      //   { text: "In Active", value: "Inactive" },
      // ],
      // filteredValue: statusFilter,

      // onFilter: (value, record) => {
      //   return record.taskStatus === value; // ✅ FIX
      // },

      // filterIcon: () => (
      //   <ChevronDown className="filter-chevron-icon-todolist" />
      // ),
    },

    {
      title: t(""),
      dataIndex: "Delete",
      key: "Delete",
      width: "20%",

      // Action buttons column
      render: (text, record) => {
        return (
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex justify-content-end align-items-center gap-4"
            >
              {/* Delete Authority */}
              <img
                className="cursor-pointer"
                draggable="false"
                alt=""
                src={IconAttachment}
                // onClick={() => handleDeleteTaskModal(record.authorityId)}
              />

              {/* View Authority */}
              {/* <Button
                  text={t("View-details")}
                  className={styles["viewAuthorityBtn"]}
                  onClick={() => handleViewAuthority(record.authorityId)}
                /> */}
            </Col>
          </Row>
        );
      },
    },
  ];

  // Row
  return (
    <Row className="mt-3">
      <div
        ref={accordionContainerRef}
        className={
          addChecklistCloseState
            ? styles["taskAccordian_closed"]
            : styles["taskAccordian"]
        }
      >
        {viewComplianceTasksData?.length > 0 ? (
          viewComplianceTasksData.map((data, index) => {
            const isExpanded = expandedCheckListIds.find(
              (data2, index) => data2 === data.checklistId
            );

            // const taskData = data.taskList;
            const taskData = (data.taskList || []).map((task, index) => ({
              ...task,
              key: task.taskId || `${data.checklistId}-${index}`,
            }));
            console.log(taskData, "isExpandedisExpanded");

            return (
              <div key={data.checklistId}>
                <CustomAccordion
                  isExpand={isExpanded}
                  notesID={data.checklistId}
                  isCompliance={false}
                  isComplianceTask={true}
                  StartField={
                    <Row>
                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={styles.checklistTitleLabel}
                      >
                        {t("Checklist-title")}
                      </Col>

                      <Col
                        sm={12}
                        md={12}
                        lg={12}
                        className={`m-0 ${styles.checklistTitleValue}`}
                      >
                        {data.checklistTitle}
                      </Col>
                    </Row>
                  }
                  attachmentsRow={
                    taskData.length > 0 && (
                      <>
                        <CustomTable
                          column={columnsTasks}
                          className="Authority_Table mt-2"
                          rows={taskData}
                          // scroll={{ x: "scroll", y: 500 }}
                          pagination={false}
                          // onChange={handleChangeAuthorityFilerSorter}
                        />
                      </>
                    )
                  }
                  endField={
                    <>
                      <Row>
                        <Col
                          sm={11}
                          md={11}
                          lg={11}
                          className="d-flex justify-content-end align-items-center"
                        >
                          <img
                            src={Accordion_Arrow}
                            onClick={() => handleClickExpandCheckList(data)}
                            alt=""
                            className={`cursor-pointer ${
                              isExpanded ? "" : styles["AccordionArrowDown"]
                            }`}
                          />
                        </Col>
                      </Row>
                    </>
                  }
                />
              </div>
            );
          })
        ) : (
          <>
            <Row className="mt-3 ">
              <Col
                lg={12}
                ms={12}
                sm={12}
                className="d-flex justify-content-center align-items-center"
              >
                <img draggable={false} src={NoChecklistImg} alt="" />
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                ms={12}
                sm={12}
                className={`${styles["noChecklistMsg"]} d-flex justify-content-center`}
              >
                {t("No-checklist-found")}
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={`${styles["noChecklistMsg_subMsg"]} d-flex justify-content-center`}
              >
                {t("No-checklist-has-been-assigned-yet.")}
              </Col>
            </Row>
          </>
        )}
      </div>
    </Row>
  );
};

export default ViewComplianceTasks;
