import React, { useState } from "react";
import styles from "./Participants.module.css";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import { Col, Row } from "react-bootstrap";
import { Button, Table } from "../../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GetAllSavedparticipantsAPI } from "../../../../../store/actions/NewMeetingActions";
import { useEffect } from "react";
import NORSVP from "../../../../../assets/images/No-RSVP.png";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";

const Participants = ({
  setParticipants,
  setAgenda,
  setAgendaContributors,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [rowsData, setRowsData] = useState([]);

  //get all saved participants
  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAllSavedparticipantsAPI(Data, navigate, t));
  }, []);

  useEffect(() => {
    let getAllData = [];
    if (
      NewMeetingreducer.getAllSavedparticipants !== null &&
      NewMeetingreducer.getAllSavedparticipants !== undefined &&
      NewMeetingreducer.getAllSavedparticipants.length > 0
    ) {
      if (NewMeetingreducer.getAllSavedparticipants.length > 0) {
        NewMeetingreducer.getAllSavedparticipants.forEach((data, index) => {
          getAllData.push({
            IsOrganizerNotified: false,
            IsPrimaryOrganizer: false,
            Title: data.participantTitle,
            displayPicture: "",
            email: data.emailAddress,
            isRSVP: data.rsvp,
            participantRole: data.participantRole,
            userID: data.userID,
            userName: data.userName,
            isComingApi: true,
          });
        });
      } else {
        // IsParticipantsAddFlow;
      }

      setRowsData(getAllData);
    }
  }, [NewMeetingreducer.getAllSavedparticipants]);

  const handleCancelBtn = () => {
    setCancelModalView(true);
  };
  const handleNextBtn = () => {
    setAgenda(true);
    setParticipants(false);
  };
  const handlePreviousBtn = () => {
    setAgendaContributors(true);
    setParticipants(false);
  };

  const ParticipantsViewColoumn = [
    {
      title: t("Name"),
      dataIndex: "userName",
      key: "userName",
      width: "260px",
    },

    {
      title: t("Email"),
      dataIndex: "email",
      key: "email",
      width: "280px",
    },
    {
      title: t("Participant-title"),
      dataIndex: "Title",
      key: "Title",
      width: "300px",
    },

    {
      title: t("Role"),
      dataIndex: "participantRole",
      key: "participantRole",
      width: "249px",
      render: (text) => (
        <label className="column-boldness">{text.participantRole}</label>
      ),
    },
    {
      title: t("RSVP"),
      dataIndex: "rsvp",
      key: "rsvp",
      width: "120px",
      render: (text, record) => {
        if (record.isRSVP === true) {
          return (
            <img
              draggable={false}
              src={rspvGreenIcon}
              height="30px"
              width="30px"
              alt=""
            />
          );
        } else {
          return (
            <img
              draggable={false}
              src={NORSVP}
              height="30px"
              width="30px"
              alt=""
            />
          );
        }
      },
    },
  ];

  return (
    <>
      <section>
        <Row>
          <Col lg={12} md={12} sm={12} className={styles["FixedHeight"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Table
                  column={ParticipantsViewColoumn}
                  scroll={{ y: "62vh" }}
                  pagination={false}
                  className="Polling_table"
                  rows={rowsData}
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            {/* <Button
              text={t("Cancel")}
              className={styles["Cancel_Button_Organizers_view"]}
              onClick={handleCancelBtn}
            /> */}
            <Button
              text={t("Previous")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handlePreviousBtn}
            />
            <Button
              text={t("Next")}
              className={styles["Next_Button_Organizers_view"]}
              onClick={handleNextBtn}
            />
          </Col>
        </Row>
        {cancelModalView && (
          <CancelButtonModal
            setCancelModalView={setCancelModalView}
            cancelModalView={cancelModalView}
            setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
            setMeetingDetails={setParticipants}
          />
        )}
      </section>
    </>
  );
};

export default Participants;
