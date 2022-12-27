import React from "react";
import styles from "./AllMeeting.module.css";
import {
  Button,
  FilterBar,
  SearchInput,
  Table,
} from "../../../../components/elements";
import "./../../../../i18n";
import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";

const AllMeetings = () => {
  //for translation
  const { t } = useTranslation();

  const options = [
    { value: 1, title: t("Select-Roles") },
    { value: 2, title: t("Title") },
    { value: 3, title: t("Agenda") },
    { value: 4, title: t("Status") },
    { value: 5, title: t("Host") },
    { value: 6, title: t("Attendee") },
    { value: 7, title: t("Date-To-From") },
  ];

  const AllMeetingColumn = [
    {
      title: t("Title"),
      dataIndex: "Title",
      key: "Title",
      align: "center",
    },
    {
      title: t("Agenda"),
      dataIndex: "Agenda",
      key: "Agenda",
      align: "center",
    },
    {
      title: t("Status"),
      dataIndex: "Status",
      key: "Status",
      align: "center",
    },
    {
      title: t("Host"),
      dataIndex: "Host",
      key: "Host",
      align: "center",
    },
    {
      title: t("Date"),
      dataIndex: "Date",
      key: "Date",
      align: "center",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
    {
      title: t("Delete"),
      dataIndex: "Delete",
      key: "Delete",
      align: "center",
    },
  ];

  return (
    <Container>
      <Row className={styles["allMeeting-filter-row"]}>
        <Col lg={6} md={6} sm={12}>
          <FilterBar Options={options} defaultValue={options[0].title} />
        </Col>
        <Col lg={5} md={5} sm={12} className="d-flex justify-content-end">
          <SearchInput />
        </Col>
        <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button className={styles["btnAllmeeting-Reset"]} text={t("Reset")} />
        </Col>
      </Row>

      <Row className={styles["allMeeting-cloumn-row"]}>
        <Col lg={12} md={12} sm={12}>
          <Table
            column={AllMeetingColumn}
            scroll={{ x: "max-content" }}
            pagination={{
              defaultPageSize: 20,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "30"],
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default AllMeetings;
