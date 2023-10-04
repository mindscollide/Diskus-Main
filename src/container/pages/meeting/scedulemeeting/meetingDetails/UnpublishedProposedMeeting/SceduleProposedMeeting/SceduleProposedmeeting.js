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
          <img src={BlueTick} width="20.7px" height="14.21px" />
        </>
      ),
    },
  ];
  const [tablerowsData, setTablerowsData] = useState(data);
  const MeetingColoumns = [
    {
      dataIndex: "Title",
      key: "Title",
      width: "215px",
    },
    {
      title: (
        <>
          <Row>
            <Col lg={2} md={2} sm={2}></Col>
            <Col lg={10} md={10} sm={10}>
              <span className={styles["DateObject"]}>22-2-2023</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Tick",
      key: "Tick",
      width: "215px",
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
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={MeetingColoumns}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={tablerowsData}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default SceduleProposedmeeting;
