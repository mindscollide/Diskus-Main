import React, { useState } from "react";
import styles from "./AfterSaveViewTable.module.css";
import { Button, Table } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
const AfterSaveViewTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      RedCrossIcon: <label></label>,
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
  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["FixedHeigh"]}>
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
        </Col>
      </Row>
      <Row>
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button
            text={t("Cancel")}
            className={styles["Cancel_Button_Polls_meeting"]}
          />
          <Button
            text={t("Next")}
            className={styles["Save_Button_Polls_meeting"]}
          />
        </Col>
      </Row>
    </section>
  );
};

export default AfterSaveViewTable;
