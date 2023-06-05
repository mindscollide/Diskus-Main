import React, { useState } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import { Button, Table, TextField } from "../../components/elements";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import CreatePolling from "./CreatePolling/CreatePollingModal";

const Polling = () => {
  const [isCreatePoll, setIsCreatePoll] = useState(false);
  const { t } = useTranslation();
  const PollTableColumns = [
    {
      title: "Post Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        if (text === 1) {
          return <span className="text-success">{t("Published")}</span>
        } else if (text === 2) {
          return <span className="text-success">{t("Unpublished")}</span>
        }
      }
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
    },
    {
      title: "Created By",
      dataIndex: "createBy",
      key: "createBy",
    },
    {
      title: "Vote",
      dataIndex: "vote",
      key: "vote",
    },
    {
      title: "Edit",
      dataIndex: "",
      key: "",
    },
  ];
  const RowsData = [{
    title: "test title",
    status: 1,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 3
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 4
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 2
  },
  {
    title: "test title",
    status: 1,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 1,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 1,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  },
  {
    title: "test title",
    status: 2,
    dueDate: "2023-06-28",
    createBy: "Ali Raza",
    vote: 1
  }
  ]
  return (
    <>
      <section className={styles["Poll_Container"]}>
        <Row className="my-3 d-flex align-items-center">
          <Col sm={12} md={1} lg={1}>
            <span className={styles["Poll_Container__heading"]}>Polls</span>
          </Col>
          <Col sm={12} md={2} lg={2}>
            <Button
              text={`+ ${t("New")}`}
              className={styles["new_Poll_Button"]}
              onClick={() => setIsCreatePoll(true)}
            />
          </Col>
          <Col
            sm={12}
            md={9}
            lg={9}
            className="position-relative justify-content-end d-flex"
          >
            {/* <TextField width={"500px"} placeholder={"Search"} /> */}
            <TextField
              // value={filterVal}
              // change={handleFilter}
              placeholder={t("Search")}
              applyClass={"PollingSearchInput"}
              labelClass="d-none"
              // onDoubleClick={searchbardropdownShow}
              inputicon={<img src={searchicon} />}
              // clickIcon={SearchiconClickOptions}
              iconClassName={styles["polling_searchinput"]}
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12}>
            <Table column={PollTableColumns} rows={RowsData} />
          </Col>
        </Row>
      </section>
      {isCreatePoll && (
        <CreatePolling
          setShowPollingModal={setIsCreatePoll}
          showPollingModal={isCreatePoll}
        />
      )}
    </>
  );
};

export default Polling;
