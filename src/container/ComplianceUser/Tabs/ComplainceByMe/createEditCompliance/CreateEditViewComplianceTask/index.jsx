import React, { useEffect, useState } from "react";
import styles from "./createEditViewComplianceTask.module.css";
import CustomAccordion from "../../../../../../components/elements/accordian/CustomAccordion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  clearAuthorityMessage,
  GetComplianceChecklistsByComplianceIdAPI,
  GetComplianceChecklistsWithTasksByComplianceIdAPI,
} from "../../../../../../store/actions/ComplainSettingActions";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useComplianceContext } from "../../../../../../context/ComplianceContext";
import { Col, Row } from "react-bootstrap";
import deleteIcon from "../../../../../../assets/images/Icon material-delete.png";
import Accordion_Arrow from "../../../../../../assets/images/Accordion_Arrow.png";
import { formatDateToYMD } from "../../../../CommonComponents/commonFunctions";
import { Button, Notification } from "../../../../../../components/elements";
import DeleteIcon from "../../../../../../assets/images/del.png";
import ModalToDoListChecklist from "../../../../CommonComponents/CreateTodoChecklist/ModalToDoListChecklist";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import ComplianceCloseConfirmationModal from "../../../../CommonComponents/ComplianceCloseConfirmationModal";

const CreateEditViewComplianceTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  const [ComplianceChecklistData, setComplianceCheckListData] = useState([]);
  console.log(expandedCheckListIds, "ComplianceChecklistData");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const authorityRespnseMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.ResponseMessage
  );
  const authorityseverityMessage = useSelector(
    (state) => state.ComplainceSettingReducerReducer.severity
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
  } = useComplianceContext();

  useEffect(() => {
    if (complianceInfo.complianceId !== 0) {
      let Data = {
        complianceId: complianceInfo.complianceId,
      };
      dispatch(
        GetComplianceChecklistsWithTasksByComplianceIdAPI(navigate, Data, t)
      );
    }
  }, [complianceInfo]);
  console.log(
    ComplianceChecklistData,
    "ComplianceChecklistDataComplianceChecklistData"
  );
  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId
  );

  const getAllComplianceChecklistTask = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsWithTasksByComplianceId
  );

  // useEffect(() => {
  //   if (
  //     GetComplianceChecklistsByComplianceId !== null &&
  //     GetComplianceChecklistsByComplianceId !== undefined
  //   ) {
  //     try {
  //       let modifyData = [
  //         ...GetComplianceChecklistsByComplianceId.checklistList,
  //       ].map((data2, index) => {
  //         return {
  //           ...data2,
  //           checkListTasks: [],
  //         };
  //       });
  //       setComplianceCheckListData(modifyData);
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // }, [GetComplianceChecklistsByComplianceId]);

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
    if (
      getAllComplianceChecklistTask &&
      getAllComplianceChecklistTask !== null
    ) {
      try {
        console.log(
          getAllComplianceChecklistTask,
          "getAllComplianceChecklistTask"
        );

        setComplianceCheckListData(getAllComplianceChecklistTask.checklistList);

        const checklistList = getAllComplianceChecklistTask.checklistList;

        setExpandedCheckListIds(
          getAllComplianceChecklistTask.checklistList.map(
            (data, index) => data.checklistId
          )
        );

        const totalTaskCount = checklistList.reduce(
          (sum, checklist) => sum + (checklist.taskList?.length || 0),
          0
        );
        setTaskCount(totalTaskCount);
      } catch (error) {}
    }
  }, [getAllComplianceChecklistTask]);

  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId"
  );
  const handleDeleteTask = () => {};

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

  const [checkListData, setCheckListData] = useState(0);

  const handleAddTaskInCheckList = (checkListData) => {
    setCheckListData(checkListData);
    console.log(checkListData, "checklistIdchecklistId");
    setShow(true);
  };

  return (
    <>
      <div className={styles["checklistAccordian"]}>
        {ComplianceChecklistData && ComplianceChecklistData?.length > 0
          ? ComplianceChecklistData.map((data, index) => {
              const isExpanded = expandedCheckListIds.find(
                (data2, index) => data2 === data.checklistId
              );
              return (
                <div key={index}>
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
                              return (
                                <div
                                  className={styles["TaskStyle"]}
                                  // onClick={handleOpenAddChecklist}
                                >
                                  <Row>
                                    <Col sm={12} md={11} lg={11}>
                                      <div className={styles["TaskTitle"]}>
                                        {data2.taskTitle}
                                      </div>
                                    </Col>
                                    <Col
                                      sm={12}
                                      md={1}
                                      lg={1}
                                      className="d-flex justify-content-end align-items-center "
                                    >
                                      <img
                                        src={DeleteIcon}
                                        alt=""
                                        className="me-2 cursor-pointer"
                                      />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                        </div>
                        {/* {complianceDetailsState.status.value !== 7 && ( */}
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            <div
                              className={
                                complianceDetailsState.status.value !== 7
                                  ? styles["createNewTaskBtnStyle"]
                                  : styles["createNewTaskBtnStyleDisabled"]
                              }
                              onClick={
                                complianceDetailsState.status.value !== 7
                                  ? () => handleAddTaskInCheckList(data)
                                  : undefined
                              }
                            >
                              {t("Add-task")}
                            </div>
                          </Col>
                        </Row>
                        {/* )} */}
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
                                data.dueDate
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
      <Notification open={open} setOpen={setOpen} />
      <ComplianceCloseConfirmationModal />
    </>
  );
};

export default CreateEditViewComplianceTask;
