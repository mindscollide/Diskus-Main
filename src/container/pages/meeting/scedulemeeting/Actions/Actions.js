import React from "react";
import styles from "./Actions.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Table } from "../../../../../components/elements";
import addmore from "../../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import { useState, useEffect } from "react";
import EmptyStates from "../../../../../assets/images/EmptystateAction.svg";
import CreateTask from "./CreateTask/CreateTask";
import RemoveTableModal from "./RemoveTableModal/RemoveTableModal";
import {
  showCancelActions,
  showUnsavedActionsModal,
} from "../../../../../store/actions/NewMeetingActions";
import {
  getMeetingTaskMainApi,
  saveMeetingActionsDocuments,
} from "../../../../../store/actions/Action_Meeting";
import CancelActions from "./CancelActions/CancelActions";
import { _justShowDateformatBilling } from "../../../../../commen/functions/date_formater";
import CustomPagination from "../../../../../commen/functions/customPagination/Paginations";

const Actions = ({
  setSceduleMeeting,
  setactionsPage,
  setPolls,
  currentMeeting,
  editorRole,
  setMinutes,
  setEditMeeting,
  isEditMeeting,
  dataroomMapFolderId,
  setMeetingMaterial,
  setDataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer, actionMeetingReducer } = useSelector(
    (state) => state
  );
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));

  const [createaTask, setCreateaTask] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const [actionState, setActionState] = useState({
    Title: "",
    Date: "",
    AssignedToName: "",
    TaskID: 0,
  });

  // dispatch Api in useEffect
  useEffect(() => {
    let meetingTaskData = {
      MeetingID: Number(currentMeeting),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
    };

    dispatch(getMeetingTaskMainApi(navigate, t, meetingTaskData));
  }, []);

  // Rows for table rendering in Action
  const [actionsRows, setActionsRows] = useState([]);

  const ActionsColoumn = [
    {
      title: t("Due-date"),
      dataIndex: "deadlineDate",
      key: "deadlineDate",
      width: "200px",
      render: (text, record) => {
        return (
          <span className={styles["Action-Date-title"]}>
            {_justShowDateformatBilling(record.deadlineDate + "000000")}
          </span>
        );
      },
    },
    {
      title: t("Action"),
      dataIndex: "title",
      key: "title",
      width: "250px",
      render: (text, record) => {
        return <span className={styles["Action-Date-title"]}>{text}</span>;
      },
    },
    {
      title: t("Assigned-to"),
      dataIndex: "taskAssignedTo",
      key: "taskAssignedTo",
      width: "200px",
      render: (text, record) => {
        return (
          <>
            <span className={styles["Action-Date-title"]}>
              {record.taskAssignedTo[0].name}
            </span>
          </>
        );
      },
    },
    {
      title: t("Status"),
      dataIndex: "status",
      key: "status",
      width: "150px",
      render: (text, record) => (
        <>
          <span className={styles["Action-Date-title"]}>
            {record.status.status}
          </span>
        </>
      ),
    },
    {
      dataIndex: "RedCrossIcon",
      key: "RedCrossIcon",
      width: "50px",
      render: (text, record) => {
        return (
          <i>
            <img
              alt={"Cross"}
              src={CrossIcon}
              className={styles["action-delete-cursor"]}
              onClick={() => deleteActionHandler(record)}
            />
          </i>
        );
      },
    },
  ];

  const deleteActionHandler = (record) => {
    let NewData = {
      ToDoID: Number(record.pK_TID),
      UpdateFileList: [],
    };
    let newData = {};
    dispatch(
      saveMeetingActionsDocuments(
        navigate,
        NewData,
        t,
        8,
        setCreateaTask,
        newData,
        0,
        currentMeeting
      )
    );
  };

  useEffect(() => {
    if (
      actionMeetingReducer.todoListMeetingTask !== null &&
      actionMeetingReducer.todoListMeetingTask !== undefined &&
      actionMeetingReducer.todoListMeetingTask.length > 0
    ) {
      setTotalRecords(actionMeetingReducer.todoListMeetingTask.totalRecords);
      setActionsRows(actionMeetingReducer.todoListMeetingTask);
    } else {
      setActionsRows([]);
    }
  }, [actionMeetingReducer.todoListMeetingTask]);

  // for pagination in Create Task
  const handleForPagination = (current, pageSize) => {
    let data = {
      MeetingID: Number(currentMeeting),
      Date: actionState.Date,
      Title: actionState.Title,
      AssignedToName: actionState.AssignedToName,
      UserID: Number(userID),
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    localStorage.setItem("MeetingPageRows", pageSize);
    localStorage.setItem("MeetingPageCurrent", current);
    dispatch(getMeetingTaskMainApi(navigate, t, data));
  };

  const handleCreateTaskButton = () => {
    setCreateaTask(true);
    dispatch(showUnsavedActionsModal(false));
  };

  const handleCancelActions = () => {
    dispatch(showCancelActions(true));
  };

  // to move in next to polls handler
  const nextTabToPolls = () => {
    setactionsPage(false);
    setPolls(true);
  };

  // To go on Previous tab
  const prevTabToMinutes = () => {
    if (
      Number(editorRole.status) === 10 &&
      editorRole.role === "Agenda Contributor"
    ) {
      setactionsPage(false);
      setMeetingMaterial(true);
    } else {
      setactionsPage(false);
      setMinutes(true);
    }
  };

  return (
    <section>
      {createaTask ? (
        <CreateTask
          setCreateaTask={setCreateaTask}
          currentMeeting={currentMeeting}
          setActionState={setActionState}
          actionState={actionState}
          dataroomMapFolderId={dataroomMapFolderId}
        />
      ) : (
        <>
          <>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end"
              >
                <Button
                  text={t("Create-task")}
                  className={styles["Create_Task_Button"]}
                  icon={<img draggable={false} src={addmore} alt="" />}
                  onClick={handleCreateTaskButton}
                />
              </Col>
            </Row>

            <Row>
              <Col lg={12} md={12} sm={12}>
                {actionsRows.length === 0 ? (
                  <>
                    <Row className="mt-0">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <img
                          draggable={false}
                          src={EmptyStates}
                          width="306.27px"
                          height="230px"
                          alt=""
                        />
                      </Col>
                    </Row>
                    <Row className="mt-2">
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <span className={styles["Empty-State_Heading"]}>
                          {t("Take-action")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex justify-content-center"
                      >
                        <span className={styles["EmptyState_SubHeading"]}>
                          {t(
                            "The-meeting-wrapped-up-lets-dive-into-some-action"
                          )}
                        </span>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
                    <section className={styles["HeightDefined"]}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Table
                            column={ActionsColoumn}
                            scroll={{ y: "40vh" }}
                            pagination={false}
                            className="Polling_table"
                            rows={actionsRows}
                          />
                        </Col>
                      </Row>

                      {actionsRows.length > 0 && (
                        <Row className="">
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex justify-content-center"
                          >
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={
                                  "ant-pagination-active-on-Action d-flex justify-content-center"
                                }
                              >
                                <span
                                  className={
                                    styles["PaginationStyle-Action-Page"]
                                  }
                                >
                                  <CustomPagination
                                    onChange={handleForPagination}
                                    current={
                                      meetingPageCurrent !== null &&
                                      meetingPageCurrent !== undefined
                                        ? Number(meetingPageCurrent)
                                        : 1
                                    }
                                    showSizer={true}
                                    total={totalRecords}
                                    pageSizeOptionsValues={[
                                      "30",
                                      "50",
                                      "100",
                                      "200",
                                    ]}
                                    pageSize={
                                      meetingpageRow !== null &&
                                      meetingpageRow !== undefined
                                        ? meetingpageRow
                                        : 50
                                    }
                                  />
                                </span>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </section>
                  </>
                )}
              </Col>
            </Row>
            <Row className="mt-5">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["CloneMeetingButton"]}
                  onClick={handleCancelActions}
                />
                <Button
                  text={t("Previous")}
                  className={styles["CloneMeetingButton"]}
                  onClick={prevTabToMinutes}
                />
                <Button
                  text={t("Next")}
                  className={styles["CloneMeetingButton"]}
                  onClick={nextTabToPolls}
                />

                {((Number(editorRole.status) === 1 ||
                  Number(editorRole.status) === 10 ||
                  Number(editorRole.status) === 11 ||
                  Number(editorRole.status) === 12) &&
                  editorRole.role === "Organizer" &&
                  isEditMeeting === true) ||
                ((Number(editorRole.status) === 9 ||
                  Number(editorRole.status) === 10) &&
                  (editorRole.role === "Participant" ||
                    editorRole.role === "Agenda Contributor") &&
                  isEditMeeting === true) ? (
                  <></>
                ) : null}
              </Col>
            </Row>
          </>
        </>
      )}

      {NewMeetingreducer.removeTableModal && <RemoveTableModal />}
      {NewMeetingreducer.cancelActions && (
        <CancelActions setSceduleMeeting={setSceduleMeeting} />
      )}
    </section>
  );
};

export default Actions;
