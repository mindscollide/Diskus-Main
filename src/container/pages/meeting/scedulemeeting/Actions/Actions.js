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

const Actions = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [createaTask, setCreateaTask] = useState(false);
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
              <img src={CrossIcon} />
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

  return (
    <section>
      {createaTask ? (
        <CreateTask />
      ) : (
        <>
          <Row className="mt-3">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={t("Create-task")}
                className={styles["Create_Task_Button"]}
                icon={<img src={addmore} />}
                onClick={handleCreateTaskButton}
              />
            </Col>
          </Row>
          <Row className="mt-5">
            <Col lg={12} md={12} sm={12}>
              {actionsRows.length <= 0 ? (
                <>
                  <Row className="mt-0">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <img src={EmptyStates} width="306.27px" height="230px" />
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
                        {t("The-meeting-wrapped-up-lets-dive-into-some-action")}
                      </span>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Table
                    column={ActionsColoumn}
                    scroll={{ y: "62vh" }}
                    pagination={false}
                    className="Polling_table"
                    rows={actionsRows}
                  />
                </>
              )}
            </Col>
          </Row>
        </>
      )}
    </section>
  );
};

export default Actions;
