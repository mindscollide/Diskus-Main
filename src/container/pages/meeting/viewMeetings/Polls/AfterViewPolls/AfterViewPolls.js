import React, { useState } from "react";
import styles from "./AfterViewPolls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import { ChevronDown } from "react-bootstrap-icons";
import ta from "date-fns/locale/ta";

const AfterViewPolls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const PollsData = [
    {
      key: "1",
      PollTitle: (
        <label className={styles["DateClass"]}>
          Did you receive the material In a sufficient time for meet... Did you
          receive the material In a sufficient time for meet...{" "}
        </label>
      ),
      Status: <label className={styles["ActionsClass"]}>Published</label>,
      Duedate: <label className="column-boldness">15 July 2023</label>,
      Status: <label className="column-boldness">Published</label>,
      PollType: <label className={styles["Meeting_Title"]}>Meeting</label>,
      CreatedBy: <label className="column-boldness">Salman Memon</label>,
    },
  ];

  const [pollsRows, setPollsRows] = useState(PollsData);

  const PollsColoumn = [
    {
      title: t("Poll-title"),
      dataIndex: "PollTitle",
      key: "PollTitle",
      width: "300px",
    },

    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      width: "70px",
      filters: [
        {
          text: t("Published"),
          value: "Published", // Use the actual status value
        },
        {
          text: t("UnPublished"),
          value: "UnPublished", // Use the actual status value
        },
      ],
      defaultFilteredValue: ["Published", "UnPublished"], // Use the actual status values here
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    },
    {
      title: t("Due-date"),
      dataIndex: "Duedate",
      key: "Duedate",
      width: "90px",
    },

    {
      title: t("Poll-type"),
      dataIndex: "PollType",
      width: "90px",
    },
    {
      title: t("Created-by"),
      dataIndex: "CreatedBy",
      width: "110px",
    },
  ];

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
          <Table
            column={PollsColoumn}
            scroll={{ y: "62vh" }}
            pagination={false}
            className="Polling_table"
            rows={pollsRows}
          />
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

export default AfterViewPolls;
