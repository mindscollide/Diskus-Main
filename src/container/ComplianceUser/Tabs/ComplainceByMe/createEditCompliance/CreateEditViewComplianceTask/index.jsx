import React, { useEffect, useRef, useState } from "react";
import styles from "./createEditViewComplianceTask.module.css";
import CustomAccordion from "../../../../../../components/elements/accordian/CustomAccordion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  ChangeTaskStatusAPI,
  clearAuthorityMessage,
  GetComplianceChecklistsByComplianceIdAPI,
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import IconAttachment from "../../../../../../assets/images/Icon-Attachment.png";
import deleteIcon from "../../../../../../assets/images/Icon material-delete.png";
import Accordion_Arrow from "../../../../../../assets/images/Accordion_Arrow.png";
import { formatDateToYMD } from "../../../../CommonComponents/commonFunctions";
import { Button, Notification } from "../../../../../../components/elements";
import DeleteIcon from "../../../../../../assets/images/del.png";
import ModalToDoListChecklist from "../../../../CommonComponents/CreateTodoChecklist/ModalToDoListChecklist";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";
import { multiDatePickerDateChangIntoUTC } from "../../../../../../commen/functions/date_formater";
import { ViewToDoList } from "../../../../../../store/actions/ToDoList_action";
import TaskViewDetailsModal from "../../../../../taskViewDetailsModal";

const CreateEditViewComplianceTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const isFirstLoad = useRef(true);
  const lastUpdatedChecklistId = useRef(null);
  const [show, setShow] = useState(false);

  const {
    complianceAddEditViewState,
    complianceInfo,
    setChecklistCount,
    setChecklistTabs,
    setTaskCount,
    emptyComplianceState,
    setCreateEditComplaince,
    setCloseConfirmationModal,
    complianceDetailsState,
    newChecklistIds,
  } = useComplianceContext();

  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  const [ComplianceChecklistData, setComplianceCheckListData] = useState([]);
  const [taskView, setTaskView] = useState(false);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const [checkListData, setCheckListData] = useState(0);

  const authorityRespnseMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage,
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity,
  );

  const handleClickExpandCheckList = (data) => {
    setExpandedCheckListIds((prev) => {
      if (prev.includes(data.checklistId)) {
        // collapse
        return prev.filter((id) => id !== data.checklistId);
      } else {
        // expand
        return [...prev, data.checklistId];
      }
    });
  };

  console.log(newChecklistIds, "newChecklistIds");
  console.log(complianceAddEditViewState, "complianceAddEditViewState");

  useEffect(() => {
    if (complianceInfo.complianceId !== 0) {
      let Data = {
        complianceId: complianceInfo.complianceId,
      };
      dispatch(
        GetComplianceChecklistsWithTasksByComplianceIdAPI(navigate, Data, t),
      );
    }
  }, [complianceInfo]);
  console.log(
    ComplianceChecklistData,
    "ComplianceChecklistDataComplianceChecklistData",
  );
  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId,
  );

  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId,
  );

  console.log(getAllComplianceChecklistTask, "getAllComplianceChecklistTask");

  useEffect(() => {
    if (
      authorityRespnseMessage !== null &&
      authorityRespnseMessage !== undefined &&
      authorityRespnseMessage !== "" &&
      authorityseverityMessage !== null
    ) {
      try {
        showMessage(authorityRespnseMessage, authorityseverityMessage, setOpen);
        setTimeout(() => {
          dispatch(clearAuthorityMessage());
        }, 4000);
      } catch (error) {}
    }
  }, [authorityRespnseMessage, authorityseverityMessage]);

  useEffect(() => {
    if (getAllComplianceChecklistTask === null) {
      // 🔥 CLEAR UI when API returns null
      setComplianceCheckListData([]);
      setTaskCount(0);
      return;
    }

    if (getAllComplianceChecklistTask) {
      try {
        const checklistList = getAllComplianceChecklistTask.checklistList || [];

        setComplianceCheckListData(checklistList);

        // expand logic
        if (isFirstLoad.current) {
          setExpandedCheckListIds(
            checklistList.map((data) => data.checklistId),
          );
          isFirstLoad.current = false;
        }

        const totalTaskCount = checklistList.reduce(
          (sum, checklist) => sum + (checklist.taskList?.length || 0),
          0,
        );

        setTaskCount(totalTaskCount);
      } catch (error) {
        console.log(error);
      }
    }
  }, [getAllComplianceChecklistTask]);

  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId",
  );
  const handleDeleteTask = (TaskId) => {
    console.log(TaskId, "TaskId");

    let complianceId = complianceInfo?.complianceId;
    const Data = {
      TaskID: TaskId,
      NewStatusID: 6,
    };
    dispatch(ChangeTaskStatusAPI(navigate, Data, complianceId, t));
  };

  const handleCloseButton = () => {
    // emptyComplianceState();
    // setChecklistTabs(1);
    // setCreateEditComplaince(false);
    setCloseConfirmationModal(true);
  };

  const handleClickPrevBtn = () => {
    // setChecklistData({
    //   checklistTitle: "",
    //   checklistDescription: "",
    //   checklistDueDate: "",
    // });
    setChecklistTabs(2);
  };

  const handleAddTaskInCheckList = (checkListData) => {
    //  store which checklist is being updated
    lastUpdatedChecklistId.current = checkListData?.checklistId;

    setCheckListData(checkListData);
    setShow(true);
  };

  const handleClickTitle = (id) => {
    console.log(id, "CheckID resolved");
    let Data = { ToDoListID: id };
    dispatch(ViewToDoList(navigate, Data, t, setTaskView));
  };

  // Helper function to check if add task button should be enabled
  const isAddTaskEnabled = (checklistId) => {
    const isNewChecklist = newChecklistIds?.includes(checklistId);

    // If it's a newly created checklist, always enable
    if (isNewChecklist) return true;

    // Otherwise, check compliance status
    const disabledStatuses = [7, 9, 6, 5, 3, 4]; // Closed, Cancelled, etc.
    return !disabledStatuses.includes(complianceDetailsState?.status?.value);
  };

  return (
    <>
      <div className={styles["checklistAccordian"]}>
        {ComplianceChecklistData && ComplianceChecklistData?.length > 0
          ? ComplianceChecklistData.map((data, index) => {
              console.log(data, "Cajhsaksbhab");
              const isExpanded = expandedCheckListIds.find(
                (data2, index) => data2 === data.checklistId,
              );

              const isAddEnabled = isAddTaskEnabled(data.checklistId);

              return (
                <div key={data.checklistId}>
                  <CustomAccordion
                    isExpand={isExpanded}
                    isCompliance={true}
                    isComplianceTask={false}
                    notesID={data.checklistId}
                    StartField={
                      <div className={styles["checkListTitle"]}>
                        {data.checklistTitle}
                      </div>
                    }
                    attachmentsRow={
                      <>
                        <div className={styles["TaskList"]}>
                          {data.taskList.length > 0 &&
                            data.taskList.map((data2, index) => {
                              console.log(data2, "data2data2");
                              return (
                                <div
                                  className={styles["TaskStyle"]}
                                  // onClick={handleOpenAddChecklist}
                                >
                                  <Row>
                                    <Col sm={12} md={10} lg={10}>
                                      <div
                                        className={styles["TaskTitle"]}
                                        onClick={() =>
                                          handleClickTitle(data2?.taskId)
                                        }
                                      >
                                        {data2.taskTitle}
                                      </div>
                                    </Col>
                                    <Col
                                      sm={12}
                                      md={2}
                                      lg={2}
                                      className="d-flex justify-content-end align-items-center gap-4"
                                    >
                                      {data2.hasAttachments > 0 && (
                                        <img
                                          draggable="false"
                                          width={"13px"}
                                          height={"13px"}
                                          alt=""
                                          src={IconAttachment}
                                          // onClick={() => handleDeleteTaskModal(record.authorityId)}
                                        />
                                      )}

                                      <img
                                        src={DeleteIcon}
                                        alt=""
                                        className="me-2 cursor-pointer"
                                        onClick={() =>
                                          handleDeleteTask(data2.taskId)
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                        </div>

                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            <div
                              className={
                                !isAddEnabled //  Use the new condition
                                  ? styles["createNewTaskBtnStyleDisabled"]
                                  : styles["createNewTaskBtnStyle"]
                              }
                              onClick={
                                !isAddEnabled //  Use the new condition
                                  ? undefined
                                  : () => handleAddTaskInCheckList(data)
                              }
                            >
                              {t("Add-task")}
                            </div>
                          </Col>
                        </Row>
                      </>
                    }
                    endField={
                      <>
                        <Row>
                          <Col
                            sm={12}
                            md={12}
                            lg={12}
                            className="d-flex justify-content-end gap-3 align-items-center"
                          >
                            <span className={styles["dueDateStyle"]}>
                              {`${t("Due-date")}: ${formatDateToYMD(
                                data.dueDate,
                              )}`}{" "}
                              {}
                            </span>

                            <img
                              src={Accordion_Arrow}
                              onClick={() => handleClickExpandCheckList(data)}
                              alt=""
                              className={`cursor-pointer
                                ${
                                  isExpanded
                                    ? null
                                    : styles["AccordionArrowDown"]
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
          : null}
      </div>
      <div className={styles["mainButtonPosition"]}>
        <Button
          text={t("Close")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleCloseButton}
        />
        <Button
          text={t("Previous")}
          className={styles["Compliance_CloseButton"]}
          onClick={handleClickPrevBtn}
          // disableBtn={
          //   complianceDetails.complianceTitle !== "" &&
          //   complianceDetails.complianceDescription !== "" &&
          //   selectAuthority !== "" &&
          //   selectCriticality !== "" &&
          //   complianceDueDate !== ""
          //     ? false
          //     : true
          // }
        />
      </div>
      {show && (
        <ModalToDoListChecklist
          checkListData={checkListData}
          show={show}
          setShow={setShow}
        />
      )}

      {taskView && (
        <TaskViewDetailsModal
          viewFlagToDo={taskView}
          setViewFlagToDo={setTaskView}
        />
      )}

      <Notification open={open} setOpen={setOpen} />
      <ComplianceCloseConfirmationModal />
    </>
  );
};

export default CreateEditViewComplianceTask;
