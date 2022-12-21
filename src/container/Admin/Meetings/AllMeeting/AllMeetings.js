import React from "react";
import styles from "./AllMeeting.module.css";
import {
  Button,
  FilterBar,
  SearchInput,
  Table,
} from "../../../../components/elements";
import { Container, Row, Col } from "react-bootstrap";


const AllMeetings = () => {
  const options = [
    { value: 1, title: "Select Roles" },
    { value: 2, title: "Title" },
    { value: 3, title: "Agenda" },
    { value: 4, title: "Status" },
    { value: 5, title: "Host" },
    { value: 6, title: "Attendee" },
    { value: 7, title: "Date To & From" },
  ];

  const AllMeetingColumn = [
    {
      title: "Title",
      dataIndex: "Title",
      key: "Title",
      align: "center",
    },
    {
      title: "Agenda",
      dataIndex: "Agenda",
      key: "Agenda",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "Status",
      key: "Status",
      align: "center",
    },
    {
      title: "Host",
      dataIndex: "Host",
      key: "Host",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "Date",
      key: "Date",
      align: "center",
    },
    {
      title: "Edit",
      dataIndex: "Edit",
      key: "Edit",
      align: "center",
    },
    {
      title: "Delete",
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
          <SearchInput  />
        </Col>
        <Col lg={1} md={1} sm={12} className="d-flex justify-content-end">
          <Button className={styles["btnAllmeeting-Reset"]} text="Reset" />
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
