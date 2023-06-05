import React, { useState } from "react";
import styles from "./Polling.module.css";
import { Row, Col } from "react-bootstrap";
import { Button, Table, TextField } from "../../components/elements";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import CreatePolling from "./CreatePolling/CreatePollingModal";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";

const Polling = () => {
  const [isCreatePoll, setIsCreatePoll] = useState(false);
  const [searchpoll, setSearchpoll] = useState(false);
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
          return <span className="text-success">{t("Published")}</span>;
        } else if (text === 2) {
          return <span className="text-success">{t("Unpublished")}</span>;
        }
      },
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
  const RowsData = [
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 3,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 4,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 2,
    },
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 1,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
    {
      title: "test title",
      status: 2,
      dueDate: "2023-06-28",
      createBy: "Ali Raza",
      vote: 1,
    },
  ];

  const HandleShowSearch = () => {
    setSearchpoll(true);
  };

  const HandleCloseSearchModal = () => {
    setSearchpoll(false);
  };
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
          <Col sm={12} md={9} lg={9} className="justify-content-end d-flex ">
            <span className="position-relative">
              <TextField
                // value={filterVal}
                width={"502px"}
                // change={handleFilter}
                placeholder={t("Search")}
                applyClass={"PollingSearchInput"}
                labelClass="d-none"
                // onDoubleClick={searchbardropdownShow}
                inputicon={<img src={searchicon} onClick={HandleShowSearch} />}
                // clickIcon={SearchiconClickOptions}
                iconClassName={styles["polling_searchinput"]}
              />
              {searchpoll ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["SearhBar_Polls"]}
                    >
                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end"
                        >
                          <img
                            src={BlackCrossIcon}
                            className={styles["Cross_Icon_Styling"]}
                            width="16px"
                            height="16px"
                            onClick={HandleCloseSearchModal}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-Title")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
                          <TextField
                            placeholder={t("Search-by-name")}
                            applyClass={"Search_Modal_Fields"}
                            labelClass="d-none"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          <Button
                            text={t("Reset")}
                            className={styles["Reset_Button_polls_SearchModal"]}
                          />
                          <Button
                            text={t("Search")}
                            className={
                              styles["Search_Button_polls_SearchModal"]
                            }
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </span>
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
