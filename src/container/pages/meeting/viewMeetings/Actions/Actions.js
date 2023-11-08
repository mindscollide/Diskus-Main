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
import { useState } from "react";
import EmptyStates from "../../../../../assets/images/EmptystateAction.svg";
import CreateTask from "./CreateTask/CreateTask";
import RemoveTableModal from "./RemoveTableModal/RemoveTableModal";
import {
  showCancelActions,
  showRemovedTableModal,
} from "../../../../../store/actions/NewMeetingActions";
import AfterSaveViewTable from "./AfterSaveViewTable/AfterSaveViewTable";
import CancelActions from "./CancelActions/CancelActions";

const Actions = ({
  setSceduleMeeting,
  setactionsPage,
  setPolls,
  advanceMeetingModalID,
  ediorRole,
  setEditMeeting,
  isEditMeeting,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [createaTask, setCreateaTask] = useState(false);
  const [afterViewActions, setAfterViewActions] = useState(false);

  const handleCrossIconModal = () => {
    dispatch(showRemovedTableModal(true));
  };

  const handleAfterViewActions = () => {
    setAfterViewActions(true);
  };

  const notificationData = [
    {
      key: "1",
      Name: <label className={styles["DateClass"]}>15 July 2023</label>,
      Action: (
        <label className={styles["ActionsClass"]}>
          Saifiiyousuf4002@gmail.com
        </label>
      ),
      AssignedTo: <label className="column-boldness">Muhammad Saif</label>,
      Status: <label className="column-boldness">Outstanding</label>,
      MeetingTitle: (
        <label className={styles["Meeting_Title"]}>
          IT Departmental Meetin… Introduction
        </label>
      ),
      MeetingDate: <label className="column-boldness">25 June 2023</label>,
      RedCrossIcon: (
        <>
          <Row>
            <Col lf={12} md={12} sm={12}>
              {/* <img
                draggable={false}
                src={CrossIcon}
                className="cursor-pointer"
                onClick={handleCrossIconModal}
              /> */}
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [actionsRows, setActionsRows] = useState(notificationData);
  const ActionsColoumn = [
    {
      title: t("Due-date"),
      dataIndex: "Name",
      key: "Name",
      width: "200px",
    },

    {
      title: t("Action"),
      dataIndex: "Action",
      key: "Action",
      width: "250px",
    },
    {
      title: t("Assigned-to"),
      dataIndex: "AssignedTo",
      key: "AssignedTo",
      width: "200px",
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      width: "150px",
    },

    {
      title: t("Meeting-title"),
      dataIndex: "MeetingTitle",
      width: "250px",
    },
    {
      title: t("Meeting-date"),
      dataIndex: "MeetingDate",
      width: "150px",
    },

    {
      dataIndex: "RedCrossIcon",
      key: "RedCrossIcon",
      width: "50px",
    },
  ];

  const handleCreateTaskButton = () => {
    setCreateaTask(true);
  };

  const handleCancelActions = () => {
    dispatch(showCancelActions(true));
  };

  const handleSaveAndnext = () => {
    setactionsPage(false);
    setPolls(true);
  };

  return (
    <section>
      {createaTask ? (
        <CreateTask setCreateaTask={setCreateaTask} />
      ) : (
        <>
          {afterViewActions ? (
            <AfterSaveViewTable />
          ) : (
            <>
              {(Number(ediorRole.status) === 1 ||
                Number(ediorRole.status) === 10 ||
                Number(ediorRole.status) === 11 ||
                Number(ediorRole.status) === 12) &&
              ediorRole.role === "Organizer" &&
              isEditMeeting === true ? (
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
                      icon={<img draggable={false} src={addmore} />}
                      onClick={handleCreateTaskButton}
                    />
                  </Col>
                </Row>
              ) : null}

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
                              scroll={{ y: "62vh" }}
                              pagination={false}
                              className="Polling_table"
                              rows={actionsRows}
                            />
                          </Col>
                        </Row>
                      </section>
                      <Row className="mt-5">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          {(Number(ediorRole.status) === 1 ||
                            Number(ediorRole.status) === 10 ||
                            Number(ediorRole.status) === 8) &&
                          ediorRole.role === "Organizer" &&
                          isEditMeeting === true ? (
                            <Button
                              text={t("Clone-meeting")}
                              className={styles["CloneMeetingButton"]}
                              onClick={handleAfterViewActions}
                            />
                          ) : null}

                          <Button
                            text={t("Cancel")}
                            className={styles["CloneMeetingButton"]}
                            onClick={handleCancelActions}
                          />

                          {((Number(ediorRole.status) === 1 ||
                            Number(ediorRole.status) === 10 ||
                            Number(ediorRole.status) === 11 ||
                            Number(ediorRole.status) === 12) &&
                            ediorRole.role === "Organizer" &&
                            isEditMeeting === true) ||
                          ((Number(ediorRole.status) === 9 ||
                            Number(ediorRole.status) === 10) &&
                            (ediorRole.role === "Participant" ||
                              ediorRole.role === "Agenda Contributor") &&
                            isEditMeeting === true) ? (
                            <>
                              <Button
                                text={t("Save")}
                                className={styles["CloneMeetingButton"]}
                              />
                              <Button
                                text={t("Save-and-publish")}
                                className={styles["CloneMeetingButton"]}
                              />

                              <Button
                                text={t("Save-and-next")}
                                className={styles["SaveButtonActions"]}
                                onClick={handleSaveAndnext}
                              />
                            </>
                          ) : null}
                        </Col>
                      </Row>
                    </>
                  )}
                </Col>
              </Row>
            </>
          )}
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
