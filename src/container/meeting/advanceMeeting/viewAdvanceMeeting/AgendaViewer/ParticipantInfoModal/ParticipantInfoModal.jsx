import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  TableToDo,
} from "../../../../../../components/elements";
import { convertAndFormatDateTimeGMT } from "../../../../../../commen/functions/date_formater";
import { GetMeetingParticipantsAgenda } from "../../../../../../store/actions/MeetingAgenda_action";
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
      render: (text) => (
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
