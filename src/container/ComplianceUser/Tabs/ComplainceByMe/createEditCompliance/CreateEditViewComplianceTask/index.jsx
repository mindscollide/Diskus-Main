import React, { useEffect, useState } from "react";
import styles from "./createEditViewComplianceTask.module.css";
import CustomAccordion from "../../../../../../components/elements/accordian/CustomAccordion";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  clearAuthorityMessage,
  GetComplianceChecklistsByComplianceIdAPI,
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

const CreateEditViewComplianceTask = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [expandedCheckListIds, setExpandedCheckListIds] = useState([]);
  const [ComplianceChecklistData, setComplianceCheckListData] = useState(null);
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
  } = useComplianceContext();

  console.log(
    ComplianceChecklistData,
    "ComplianceChecklistDataComplianceChecklistData"
  );
  const GetComplianceChecklistsByComplianceId = useSelector(
    (state) =>
      state.ComplainceSettingReducerReducer
        .GetComplianceChecklistsByComplianceId
  );

  useEffect(() => {
    if (
      GetComplianceChecklistsByComplianceId !== null &&
      GetComplianceChecklistsByComplianceId !== undefined
    ) {
      try {
        let modifyData = [
          ...GetComplianceChecklistsByComplianceId.checklistList,
        ].map((data2, index) => {
          return {
            ...data2,
            checkListTasks: [],
          };
        });
        setComplianceCheckListData(modifyData);
      } catch (error) {
        console.log(error);
      }
    }
  }, [GetComplianceChecklistsByComplianceId]);
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

  console.log(
    GetComplianceChecklistsByComplianceId,
    "GetComplianceChecklistsByComplianceId"
  );
  const handleDeleteTask = () => {};
  const handleCloseButton = () => {
    // take user back to ComplianceByMe screen
    // setChecklistData({
    //   checklistTitle: "",
    //   checklistDescription: "",
    //   checklistDueDate: "",
    // });
    // setCreateEditComplaince(false);
  };

  const handleClickPrevBtn = () => {
    setChecklistTabs(1);
  };

  // const handleAddTaskInCheckList = (checkListId) => {
  //   const updatedChecklistData = ComplianceChecklistData.map((item) => {
  //     if (item.checklistId === checkListId) {
  //       return {
  //         ...item,
  //         checkListTasks: [
  //           ...(item.checkListTasks || []),
  //           {
  //             TaskTitle: "Hello",
  //             taskId: Math.random().toString(36).slice(2),
  //           },
  //         ],
  //       };
  //     }
  //     return item;
  //   });

  //   setComplianceCheckListData(updatedChecklistData);
  // };

  const [checkListId, setCheckListId] = useState(0);
  const handleAddTaskInCheckList = (checklistId) => {
    setCheckListId(checklistId);
    console.log(checklistId, "checklistIdchecklistId");
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
                    notesID={data.checklistId}
                    StartField={
                      <div className={styles["checkListTitle"]}>
                        {data.checklistTitle}
                      </div>
                    }
                    attachmentsRow={
                      <>
                        <div className={styles["TaskList"]}>
                          {data.checkListTasks.length > 0 &&
                            data.checkListTasks.map((data2, index) => {
                              return (
                                <div
                                  className={styles["TaskStyle"]}
                                  // onClick={handleOpenAddChecklist}
                                >
                                  <Row>
                                    <Col sm={12} md={8} lg={8}>
                                      <span className={styles["TaskTitle"]}>
                                        {data2.TaskTitle}
                                      </span>
                                    </Col>
                                    <Col
                                      sm={12}
                                      md={4}
                                      lg={4}
                                      className="d-flex justify-content-end align-items-center "
                                    >
                                      <img src={DeleteIcon} className="me-2" />
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                        </div>
                        <Row>
                          <Col sm={12} md={12} lg={12}>
                            <div
                              className={styles["createNewTaskBtnStyle"]}
                              onClick={() =>
                                handleAddTaskInCheckList(data.checklistId)
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
                                    ? styles["AccordionArrowDown"]
                                    : null
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
          checkListId={checkListId}
          show={show}
          setShow={setShow}
        />
      )}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateEditViewComplianceTask;
