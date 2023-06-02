import React, { useState } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import { Button, Table } from "../../components/elements";

const Polling = () => {
  const [isCreatePoll, setIsCreatePoll] = useState(false);
  const PollTableColumns = [
    {
      title: "Post Title",
      dataIndex: "",
      key: "",
    },
    {
      title: "Status",
      dataIndex: "",
      key: "",
    },
    {
      title: "Due Date",
      dataIndex: "",
      key: "",
    },
    {
      title: "Created By",
      dataIndex: "",
      key: "",
    },
    {
      title: "Vote",
      dataIndex: "",
      key: "",
    },
    {
      title: "Edit",
      dataIndex: "",
      key: "",
    },
  ];
  return (
    <>
      <section className={styles["Poll_Container"]}>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={2} lg={2}>
            <span className={styles["Poll_Container__heading"]}>Polls</span>
          </Col>
          <Col sm={12} md={2} lg={2}>
            <Button text="+ New" className={styles["new_Poll_Button"]} />
          </Col>
          <Col sm={12} md={8} lg={8}></Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Table column={PollTableColumns} />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default Polling;
