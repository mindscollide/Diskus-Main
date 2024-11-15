import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Switch,
  TextField,
  Table,
  TableToDo,
} from "../../../../../../components/elements";
import { convertAndFormatDateTimeGMT } from "../../../../../../commen/functions/date_formater";
import { GetMeetingParticipantsAgenda } from "../../../../../../store/actions/MeetingAgenda_action";
import { Checkbox } from "antd";
import CrossIcon from "./../AV-Images/Cross_Icon.png";
import styles from "./ParticipantInfoModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";

const ParticipantInfoModal = ({
  setParticipantInfoView,
  advanceMeetingModalID,
}) => {
  const { MeetingAgendaReducer } = useSelector((state) => state);

  const { t } = useTranslation();

  const navigate = useNavigate();

  const [rowsParticipants, setRowsParticipants] = useState([]);

  const dispatch = useDispatch();

  // const rowsParticipants = [
  //   {
  //     key: "1",
  //     name: "John Doe",
  //     userEmail: "john.doe@example.com",
  //     designation: "Software Engineer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:00 AM",
  //     leaveTime: "11-01-2024 | 05:00 PM",
  //     minutes: 480,
  //   },
  //   {
  //     key: "1",
  //     name: "John Doe",
  //     userEmail: "john.doe@example.com",
  //     designation: "Software Engineer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:00 AM",
  //     leaveTime: "11-01-2024 | 05:00 PM",
  //     minutes: 480,
  //   },
  //   {
  //     key: "1",
  //     name: "John Doe",
  //     userEmail: "john.doe@example.com",
  //     designation: "Software Engineer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:00 AM",
  //     leaveTime: "11-01-2024 | 05:00 PM",
  //     minutes: 480,
  //   },
  //   {
  //     key: "2",
  //     name: "Jane Smith",
  //     userEmail: "jane.smith@example.com",
  //     designation: "Product Manager",
  //     status: "Absent",
  //     joinTime: "11-01-2024 | 10:30 AM",
  //     leaveTime: "11-01-2024 | 04:30 PM",
  //     minutes: 360,
  //   },
  //   {
  //     key: "3",
  //     name: "Michael Johnson",
  //     userEmail: "michael.johnson@example.com",
  //     designation: "Data Analyst",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 08:45 AM",
  //     leaveTime: "11-01-2024 | 05:15 PM",
  //     minutes: 510,
  //   },
  //   {
  //     key: "4",
  //     name: "Emily Brown",
  //     userEmail: "emily.brown@example.com",
  //     designation: "UX Designer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:15 AM",
  //     leaveTime: "11-01-2024 | 05:45 PM",
  //     minutes: 510,
  //   },
  //   {
  //     key: "5",
  //     name: "David Wilson",
  //     userEmail: "david.wilson@example.com",
  //     designation: "Project Manager",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:30 AM",
  //     leaveTime: "11-01-2024 | 06:00 PM",
  //     minutes: 510,
  //   },
  //   {
  //     key: "6",
  //     name: "Sophia Lee",
  //     userEmail: "sophia.lee@example.com",
  //     designation: "Frontend Developer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:15 AM",
  //     leaveTime: "11-01-2024 | 06:15 PM",
  //     minutes: 540,
  //   },
  //   {
  //     key: "7",
  //     name: "William Taylor",
  //     userEmail: "william.taylor@example.com",
  //     designation: "QA Engineer",
  //     status: "Absent",
  //     joinTime: "11-01-2024 | 09:45 AM",
  //     leaveTime: "11-01-2024 | 05:30 PM",
  //     minutes: 405,
  //   },
  //   {
  //     key: "8",
  //     name: "Olivia Martinez",
  //     userEmail: "olivia.martinez@example.com",
  //     designation: "UI Designer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 10:00 AM",
  //     leaveTime: "11-01-2024 | 06:30 PM",
  //     minutes: 510,
  //   },
  //   {
  //     key: "9",
  //     name: "Daniel Anderson",
  //     userEmail: "daniel.anderson@example.com",
  //     designation: "Backend Developer",
  //     status: "Present",
  //     joinTime: "11-01-2024 | 09:00 AM",
  //     leaveTime: "11-01-2024 | 06:00 PM",
  //     minutes: 540,
  //   },
  //   {
  //     key: "10",
  //     name: "Ava Harris",
  //     userEmail: "ava.harris@example.com",
  //     designation: "System Administrator",
  //     status: "Remote",
  //     joinTime: "11-01-2024 | 09:30 AM",
  //     leaveTime: "11-01-2024 | 06:15 PM",
  //     minutes: 525,
  //   },
  //   // Add more data as needed
  // ];

  useEffect(() => {
    let data = {
      PK_MDID: advanceMeetingModalID,
    };
    dispatch(GetMeetingParticipantsAgenda(data, navigate, t));
  }, []);

  useEffect(() => {
    if (
      MeetingAgendaReducer.MeetingAgendaParticipants !== null &&
      MeetingAgendaReducer.MeetingAgendaParticipants !== undefined &&
      MeetingAgendaReducer.MeetingAgendaParticipants.length !== 0
    ) {
      let participantsInfo =
        MeetingAgendaReducer.MeetingAgendaParticipants.listOfParticipantsInfo;
      setRowsParticipants(participantsInfo);
    } else {
      setRowsParticipants([]);
    }
  }, [MeetingAgendaReducer.MeetingAgendaParticipants]);

  const participantColumns = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      className: "nameParticipant",
      width: "150px",
      ellipsis: true,
    },
    {
      title: t("User-email"),
      dataIndex: "emailAddress",
      key: "emailAddress",
      className: "emailParticipant",
      width: "200px",
      ellipsis: true,
    },
    {
      title: t("Designation"),
      dataIndex: "designation",
      key: "designation",
      className: "designationParticipant",
      width: "150px",
      ellipsis: true,
    },
    {
      title: t("Status"),
      dataIndex: "attendenceStatus",
      key: "attendenceStatus",
      align: "center",
      className: "statusParticipant",
      render: (text, record) => (
        <p
          className={
            text === "Absent"
              ? styles["absentStatus"]
              : text === "Present"
              ? styles["presentStatus"]
              : styles["remoteStatus"]
          }
        >
          {text}
        </p>
      ),
    },
    {
      title: t("Join-time"),
      dataIndex: "joinTime",
      key: "joinTime",
      align: "center",
      className: "joinTimeParticipant",
      width: "200px",
      ellipsis: true,
      render: (text, record) => convertAndFormatDateTimeGMT(text),
    },
    {
      title: t("Leave-time"),
      dataIndex: "leaveTime",
      key: "leaveTime",
      className: "leaveTimeParticipant",
      width: "200px",
      ellipsis: true,
      render: (text, record) => convertAndFormatDateTimeGMT(text),
    },
    {
      title: t("Minutes"),
      dataIndex: "totalDuration",
      key: "totalDuration",
      className: "minutesParticipant",
    },
  ];

  return (
    <section>
      <Modal
        show={true}
        // setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setParticipantInfoView(false)}
        size={"xl"}
        className="ParticipantAVModal"
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="position-relative">
                <p className={styles["participantInfoHeading"]}>
                  {t("Participant-info")}
                </p>
                <img
                  onClick={() => setParticipantInfoView(false)}
                  className={styles["image-close"]}
                  src={CrossIcon}
                  alt=""
                />
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <TableToDo
              sortDirections={["descend", "ascend"]}
              column={participantColumns}
              className={"ParticipantAV"}
              rows={rowsParticipants}
              // scroll={scroll}
              pagination={false}
              scroll={rowsParticipants.length > 10 ? { y: 385 } : undefined}
            />
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  onClick={() => setParticipantInfoView(false)}
                  text={t("Close")}
                  className={styles["Send_Notify"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default ParticipantInfoModal;
