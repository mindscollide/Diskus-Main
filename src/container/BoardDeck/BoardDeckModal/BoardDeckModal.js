import React, { useEffect, useState } from "react";
import styles from "./BoardDeckModal.module.css";
import { Button, Modal } from "../../../components/elements";
import blacktick from "../../../assets/images/BlacksmallTick.png";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  boardDeckModal,
  boardDeckShareModal,
} from "../../../store/actions/NewMeetingActions";
import { Checkbox, Radio } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import { BoardDeckPDFDownloadApi } from "../../../store/actions/UserManagementActions";
const BoardDeckModal = ({
  boarddeckOptions,
  setBoarddeckOptions,
  boardDeckMeetingID,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { NewMeetingreducer } = useSelector((state) => state);

  const [radioValue, setRadioValue] = useState(1);

  const onChangeSelectAll = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      selectall: value,
      Organizer: value,
      AgendaContributor: value,
      Participants: value,
      Minutes: value,
      Task: value,
      polls: value,
      attendeceReport: value,
      video: value,
      Agenda: value,
    });
  };

  const onChangeOrganizers = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Organizer: value,
    });
  };

  const onChangeAgenda = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Agenda: value,
    });
  };

  const onChangeAgendaContributor = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      AgendaContributor: value,
    });
  };

  const onChangeParticipants = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Participants: value,
    });
  };

  const onChangeMinutes = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Minutes: value,
    });
  };

  const onChangeTask = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Task: value,
    });
  };

  const onChangePolls = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      polls: value,
    });
  };

  const onChangeAttendenceReport = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      attendeceReport: value,
    });
  };

  const onChangeVideo = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      video: value,
    });
  };

  const handlesharebuttonModal = () => {
    dispatch(boardDeckShareModal(true));
    dispatch(boardDeckModal(false));
  };

  const handleRadioChange = (value) => {
    setRadioValue(value);
    console.log("valuevaluevalue", value);
  };

  const handleDownloadButton = () => {
    let data = {
      PK_MDID: Number(boardDeckMeetingID),
      fetchOrganizers: boarddeckOptions.Organizer,
      fetchAgendaContributors: boarddeckOptions.AgendaContributor,
      fetchParticipants: boarddeckOptions.Participants,
      fetchMinutes: boarddeckOptions.Minutes,
      fetchTasks: boarddeckOptions.Task,
      fetchPolls: boarddeckOptions.polls,
      fetchAttendance: boarddeckOptions.attendeceReport,
      fetchVideo: boarddeckOptions.video,
      fetchAgendaWithAttachments: boarddeckOptions.Agenda,
      fetchAgenda: boarddeckOptions.Agenda,
    };
    dispatch(BoardDeckPDFDownloadApi(navigate, t, data));
  };

  return (
    <>
      <Container>
        <Modal
          show={NewMeetingreducer.boardDeckModalData}
          setShow={dispatch(boardDeckModal)}
          modalFooterClassName={"d-block"}
          modalHeaderClassName={"d-block"}
          onHide={() => {
            dispatch(boardDeckModal(false));
          }}
          size={"lg"}
          ModalBody={
            <>
              <Row>
                <Col lg={9} md={9} sm={9}>
                  <span className={styles["BoardDeckHeading"]}>
                    {t("Board-deck")}
                  </span>
                </Col>
                <Col lg={3} md={3} sm={3} className={styles["checkbox"]}>
                  <Checkbox
                    onChange={onChangeSelectAll}
                    checked={boarddeckOptions.selectall}
                  >
                    <span className={styles["Class_CheckBox"]}>
                      {t("Select-all")}
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={4} md={4} sm={4}>
                  <div className="d-flex gap-3 align-items-center">
                    <img src={blacktick} alt="" />
                    <span className={styles["Box_options"]}>
                      {t("Meeting-details")}
                    </span>
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeOrganizers}
                    checked={boarddeckOptions.Organizer}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Organizers")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeAgendaContributor}
                    checked={boarddeckOptions.AgendaContributor}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Agenda-Contributor")}
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeParticipants}
                    checked={boarddeckOptions.Participants}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Participants")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeMinutes}
                    checked={boarddeckOptions.Minutes}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Minutes")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeTask}
                    checked={boarddeckOptions.Task}
                  >
                    <span className={styles["Box_options"]}>{t("Task")}</span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangePolls}
                    checked={boarddeckOptions.polls}
                  >
                    <span className={styles["Box_options"]}>{t("Polls")}</span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeAttendenceReport}
                    checked={boarddeckOptions.attendeceReport}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Attendence-report")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeVideo}
                    checked={boarddeckOptions.video}
                  >
                    <span className={styles["Box_options"]}>{t("Video")}</span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col lg={12} md={12} sm={12}>
                  <Checkbox
                    onChange={onChangeAgenda}
                    checked={boarddeckOptions.Agenda}
                  >
                    <span className={styles["Box_options_Agendaas"]}>
                      <Radio.Group
                        onChange={(e) => handleRadioChange(e.target.value)}
                        value={radioValue}
                        className="BoarddeckSelection"
                      >
                        <Radio value={1}>
                          <span>{t("Agenda-with-attachments")}</span>
                        </Radio>
                        <Radio value={2}>
                          <span>{t("Agenda-without-attachments")}</span>
                        </Radio>
                      </Radio.Group>
                    </span>
                  </Checkbox>
                </Col>
              </Row>
            </>
          }
          ModalFooter={
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex gap-2 justify-content-end"
                >
                  <Button
                    text={t("Cancel")}
                    className={styles["CancelButton"]}
                  />
                  <Button
                    text={t("Share")}
                    className={styles["ShareButton"]}
                    onClick={handlesharebuttonModal}
                  />
                  <Button
                    text={t("Download")}
                    className={styles["ShareButton"]}
                    onClick={handleDownloadButton}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </Container>
    </>
  );
};

export default BoardDeckModal;
