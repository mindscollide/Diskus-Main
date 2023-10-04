import React, { useState } from "react";
import styles from "./SceduleProposedMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Modal, Button, Table } from "../../../../../../../components/elements";
import { useSelector } from "react-redux";
import { showSceduleProposedMeeting } from "../../../../../../../store/actions/NewMeetingActions";
import BlueTick from "../../../../../../../assets/images/BlueTick.svg";
const SceduleProposedmeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [sceduleProposedmeetingData, setSceduleProposedmeetingData] = useState([
    {
      Dates: [
        {
          dataFormeeting: "22-2-2023",
        },
        {
          dataFormeeting: "25-3-2023",
        },
        {
          dataFormeeting: "28-3-2023",
        },
        {
          dataFormeeting: "25-3-2023",
        },
        {
          dataFormeeting: "28-3-2023",
        },
      ],
      members: [
        {
          name: "Mr Abdul Qadir",
          designation: "CFO",
          isTick: true,
        },
        {
          name: "Mr Huzaeifa Jahangir",
          designation: "Team Lead",
          isTick: true,
        },
        {
          name: "Mr Saif Ul Islam",
          designation: "Software Engineer",
          isTick: true,
        },
      ],

      Votes: [
        {
          amount: 0,
        },
        {
          amount: 2,
        },
        {
          amount: 3,
        },
      ],

      Selected: true,
    },
  ]);

  const data = [
    {
      key: "1",
      Title: (
        <>
          <span className={styles["WidthOFSpan"]}>
            <span className={styles["ParticipantName"]}>Mr Abdul Qadir</span>
            <span className={styles["Designation"]}>CFO</span>
          </span>
        </>
      ),
      Tick: (
        <>
          <img
            src={BlueTick}
            className={styles["TickIconClass"]}
            width="20.7px"
            height="14.21px"
          />
        </>
      ),
    },
    {
      key: "1",
      Title: (
        <>
          <span className={styles["WidthOFSpan"]}>
            <span className={styles["ParticipantName"]}>
              Mr Huzaeifa Jahangir
            </span>
            <span className={styles["Designation"]}>Team Lead</span>
          </span>
        </>
      ),
      Tick: (
        <>
          <img
            src={BlueTick}
            className={styles["TickIconClass"]}
            width="20.7px"
            height="14.21px"
          />
        </>
      ),
    },
    {
      key: "1",
      Title: (
        <>
          <span className={styles["WidthOFSpan"]}>
            <span className={styles["ParticipantName"]}>Mr Owais Wajid</span>
            <span className={styles["Designation"]}>Sr Software Engineer</span>
          </span>
        </>
      ),
      Tick: (
        <>
          <img
            src={BlueTick}
            className={styles["TickIconClass"]}
            width="20.7px"
            height="14.21px"
          />
        </>
      ),
    },
    {
      key: "1",
      Title: (
        <>
          <span className={styles["WidthOFSpan"]}>
            <span className={styles["ParticipantName"]}>Mr Saif Ul Islam</span>
            <span className={styles["Designation"]}>Software Engineer</span>
          </span>
        </>
      ),
      Tick: (
        <>
          <img
            src={BlueTick}
            className={styles["TickIconClass"]}
            width="20.7px"
            height="14.21px"
          />
        </>
      ),
    },
    {
      key: "1",
      Title: (
        <>
          <span className={styles["TotalCount_HEading"]}>{t("Total")}</span>
        </>
      ),
      Tick: (
        <>
          <Row>
            <Col lg={3} md={3} sm={3}></Col>
            <Col lg={9} md={9} sm={9} className="d-flex gap-4">
              <span className={styles["TotalCount"]}>0</span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "1",
      Title: <></>,
      Tick: (
        <>
          <Button text={t("Scedule")} className={styles["SceduleButton"]} />
        </>
      ),
    },
  ];
  const [tablerowsData, setTablerowsData] = useState(data);
  const MeetingColoumns = [
    {
      dataIndex: "Title",
      key: "Title",
      width: "150px",
    },
    {
      title: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["ColoumnOuterBorderBox"]}
            >
              <span className={styles["DateObject"]}>22-2-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["DateObject"]}>24-4-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["DateObject"]}>26-6-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["DateObject"]}>29-9-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["DateObject"]}>29-9-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["DateObject"]}>29-9-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "100px",
    },
  ];

  return (
    <section>
      <Modal
        show={NewMeetingreducer.sceduleproposedMeeting}
        setShow={dispatch(showSceduleProposedMeeting)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showSceduleProposedMeeting(false));
        }}
        size={"lg"}
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Scedule_Proposed_meeting_heading"]}>
                  {t("Schedule-proposed-meetings")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <section className={styles["OverAll_Padding"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Table
                    column={MeetingColoumns}
                    scroll={{ x: "22vh", display: "none" }}
                    pagination={false}
                    className="SceduleProposedMeeting"
                    rows={tablerowsData}
                    // prefixClassName={"SceduleProposedTable"}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
