import React, { useState } from "react";
import styles from "./Participants.module.css";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import addmore from "../../../../../assets/images/addmore.png";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import { Col, Row, Tab } from "react-bootstrap";
import {
  Button,
  Table,
  TextField,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ModalCrossIcon from "../Organizers/ModalCrossIconClick/ModalCrossIcon";
import {
  showAddParticipantsModal,
  showCrossConfirmationModal,
} from "../../../../../store/actions/NewMeetingActions";
import AddParticipantModal from "./AddParticipantModal/AddParticipantModal";
const Participants = ({ setParticipants, setAgenda }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const openCrossIconModal = () => {
    dispatch(showCrossConfirmationModal(true));
  };

  const openAddPartcipantModal = () => {
    dispatch(showAddParticipantsModal(true));
  };

  const handleNextButton = () => {
    setParticipants(false);
    setAgenda(true);
  };

  const options = [
    { value: "Particpants", label: t("Particpants") },
    { value: "Chairperson", label: t("Chairperson") },
    { value: "Secretary", label: t("Secretary") },
  ];

  const data = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      Participanttitle: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <TextField
                disable={true}
                placeholder={t("Content-title")}
                labelClass={"d-none"}
                applyClass={"Organizer_table"}
              />
            </Col>
          </Row>
        </>
      ),
      Role: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Select options={options} />
            </Col>
          </Row>
        </>
      ),
      Close: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <img
                src={redcrossIcon}
                width="21.79px"
                height="21.79px"
                onClick={openCrossIconModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [rowsData, setRowsData] = useState(data);
  const ParticipantsColoumn = [
    {
      title: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span>{t("Name")}</span>
            </Col>
          </Row>
        </>
      ),
      dataIndex: "Name",
      key: "Name",
      width: "260px",
    },

    {
      title: t("Email"),
      dataIndex: "Email",
      key: "Email",
      width: "280px",
    },
    {
      title: t("Participant-title"),
      dataIndex: "Participanttitle",
      key: "Participanttitle",
      width: "300px",
    },

    {
      title: t("Role"),
      dataIndex: "Role",
      key: "Role",
      width: "249px",
    },

    {
      dataIndex: "Close",
      key: "Close",
      width: "20px",
    },
  ];

  return (
    <>
      <section>
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
            <Button
              text={t("Edit")}
              className={styles["Edit_Button_Organizers"]}
              icon={<img src={EditIcon} width="11.75px" height="11.75px" />}
            />

            <Button
              text={t("Add-more")}
              icon={<img src={addmore} />}
              className={styles["AddMoreBtn"]}
              onClick={openAddPartcipantModal}
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Table
              column={ParticipantsColoumn}
              scroll={{ y: "62vh" }}
              pagination={false}
              className="Polling_table"
              rows={rowsData}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex gap-2 justify-content-end"
          >
            <Button
              text={t("Cancel")}
              className={styles["Cancel_Organization"]}
            />
            <Button
              text={t("Propose-meeting-dates")}
              className={styles["Cancel_Organization"]}
            />
            <Button
              text={t("Publish")}
              className={styles["Cancel_Organization"]}
            />

            <Button
              text={t("Next")}
              className={styles["Next_Organization"]}
              onClick={handleNextButton}
            />
          </Col>
        </Row>
      </section>
      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.participantModal && <AddParticipantModal />}
    </>
  );
};

export default Participants;
