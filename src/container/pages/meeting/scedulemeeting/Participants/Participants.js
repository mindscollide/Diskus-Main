import React, { useState } from "react";
import styles from "./Participants.module.css";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import addmore from "../../../../../assets/images/addmore.png";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import rspvGreenIcon from "../../../../../assets/images/rspvGreen.svg";
import rspvAbstainIcon from "../../../../../assets/images/rspvAbstain.svg";
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
import ParticipantsView from "./ParticpantsView/ParticipantsView";

const Participants = ({
  setParticipants,
  setAgenda,
  setProposedMeetingDates,
}) => {
  const [proposeMeeting, setPropseMeeting] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [rspvTable, setrspvTable] = useState(false);
  const [particiapntsView, setParticiapntsView] = useState(false);
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
                draggable={false}
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

  const rspvData = [
    {
      key: "1",
      Name: <label className={styles["Title_desc"]}>Muahmmad Saif</label>,
      Email: (
        <label className="column-boldness">Saifiiyousuf4002@gmail.com</label>
      ),
      Participanttitle: <label>Content Writer</label>,
      Role: <label>Participants</label>,

      rspv: (
        <>
          <img
            draggable={false}
            src={rspvGreenIcon}
            height="30px"
            width="30px "
          />
          {/* <img draggable = {false} src={rspvAbstainIcon} height="30px" width="30px " /> */}
        </>
      ),
    },
  ];

  const [rspvRows, setrspvRows] = useState(rspvData);

  const rspvColoumns = [
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
      width: "349px",
    },

    {
      title: t("RSPV"),
      dataIndex: "rspv",
      key: "rspv",
      width: "249px",
    },
  ];

  const enableRspvTable = () => {
    setrspvTable(!rspvTable);
  };

  const handleProposedmeetingDates = () => {
    setParticipants(false);
    setProposedMeetingDates(true);
  };

  const EnableParticipantsViewPage = () => {
    setParticiapntsView(true);
  };

  return (
    <>
      {particiapntsView ? (
        <ParticipantsView />
      ) : (
        <>
          <section className="position-relative">
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
                  icon={
                    <img
                      draggable={false}
                      src={EditIcon}
                      width="11.75px"
                      height="11.75px"
                    />
                  }
                  onClick={enableRspvTable}
                />

                <Button
                  text={t("Add-more")}
                  icon={<img draggable={false} src={addmore} />}
                  className={styles["AddMoreBtn"]}
                  onClick={openAddPartcipantModal}
                />
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                {rspvTable ? (
                  <>
                    <Table
                      column={rspvColoumns}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      className="Polling_table"
                      rows={rspvRows}
                    />
                  </>
                ) : (
                  <>
                    <Table
                      column={ParticipantsColoumn}
                      scroll={{ y: "62vh" }}
                      pagination={false}
                      className="Polling_table"
                      rows={rowsData}
                    />
                  </>
                )}
              </Col>
            </Row>
          </section>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <section className={styles["Footer_Class"]}>
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Organization"]}
                />
                <Button
                  text={t("Propose-meeting-dates")}
                  className={styles["Cancel_Organization"]}
                  onClick={handleProposedmeetingDates}
                />
                <Button
                  text={t("Publish")}
                  className={styles["Cancel_Organization"]}
                  onClick={EnableParticipantsViewPage}
                />

                <Button
                  text={t("Next")}
                  className={styles["Next_Organization"]}
                  onClick={handleNextButton}
                />
              </section>
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.crossConfirmation && <ModalCrossIcon />}
      {NewMeetingreducer.participantModal && <AddParticipantModal />}
      {/* {proposeMeeting && } */}
    </>
  );
};

export default Participants;
