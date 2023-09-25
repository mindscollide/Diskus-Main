import React, { useState } from "react";
import styles from "./Polls.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import addmore from "../../../../../assets/images/addmore.png";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import { ChevronDown } from "react-bootstrap-icons";
import emtystate from "../../../../../assets/images/EmptyStatesMeetingPolls.svg";
import Createpolls from "./CreatePolls/Createpolls";
import CastVotePollsMeeting from "./CastVotePollsMeeting/CastVotePollsMeeting";
import { showUnsavedPollsMeeting } from "../../../../../store/actions/NewMeetingActions";
import EditPollsMeeting from "./EditPollsMeeting/EditPollsMeeting";
const Polls = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [votePolls, setvotePolls] = useState(false);
  const [createpoll, setCreatepoll] = useState(false);
  const [editPolls, setEditPolls] = useState(false);

  const handleCastVotePollMeeting = () => {
    setvotePolls(true);
  };

  const handleEditPollsMeeting = () => {
    setEditPolls(true);
  };

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
      Vote: (
        <>
          <Row>
            <Col lf={12} md={12} sm={12}>
              {/* <Button
                text={t("Voted")}
                className={styles["Vote_Button_Polls"]}
              /> */}
              <Button
                text={t("Vote")}
                className={styles["Not_Vote_Button_Polls"]}
                onClick={handleCastVotePollMeeting}
              />
            </Col>
          </Row>
        </>
      ),
      Edit: (
        <>
          <Row>
            <Col lf={12} md={12} sm={12}>
              <img
                src={EditIcon}
                className="cursor-pointer"
                onClick={handleEditPollsMeeting}
              />
            </Col>
          </Row>
        </>
      ),
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
    {
      title: t("Vote"),
      dataIndex: "Vote",
      width: "70px",
    },
    {
      title: t("Edit"),
      dataIndex: "Edit",
      width: "50px",
    },
  ];

  const handleCreatepolls = () => {
    dispatch(showUnsavedPollsMeeting(false));
    setCreatepoll(true);
  };

  return (
    <section>
      {createpoll ? (
        <Createpolls setCreatepoll={setCreatepoll} />
      ) : votePolls ? (
        <CastVotePollsMeeting setvotePolls={setvotePolls} />
      ) : editPolls ? (
        <EditPollsMeeting setEditPolls={setEditPolls} />
      ) : (
        <>
          <Row className="mt-4">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end "
            >
              <Button
                text={t("Create-polls")}
                icon={<img src={addmore} draggable="false" alt="" />}
                className={styles["Create_polls_Button"]}
                onClick={handleCreatepolls}
              />
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              {pollsRows.length <= 0 ? (
                <>
                  <Row className="mt-3">
                    <Col
                      lg={12}
                      ms={12}
                      sm={12}
                      className="d-flex justify-content-center"
                    >
                      <img
                        src={emtystate}
                        height="230px"
                        width="293.93px"
                        draggable="false"
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
                      <span className={styles["EmptyState_heading"]}>
                        {t("No-polls")}
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
                      <span className={styles["EmptyState_subHeading"]}>
                        {t(
                          "Be-the-first-to-create-a-poll-and-spark-the-conversation"
                        )}
                      </span>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Table
                    column={PollsColoumn}
                    scroll={{ y: "62vh" }}
                    pagination={false}
                    className="Polling_table"
                    rows={pollsRows}
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

export default Polls;
