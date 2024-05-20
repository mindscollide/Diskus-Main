import React, { useState } from "react";
import styles from "./BoardDeckModal.module.css";
import { Button, Modal } from "../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { boardDeckModal } from "../../../store/actions/NewMeetingActions";
import { Checkbox } from "antd";
import { Col, Container, Row } from "react-bootstrap";
const BoardDeckModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { NewMeetingreducer } = useSelector((state) => state);

  const [boarddeckOptions, setBoarddeckOptions] = useState({
    selectall: false,
    Organizer: false,
    AgendaContributor: false,
    Participants: false,
    Minutes: false,
    Task: false,
    polls: false,
    attendeceReport: false,
    video: false,
  });

  const onChangeSelectAll = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      selectall: value,
    });
  };

  const onChangeOrganizers = (e) => {
    let value = e.target.checked;
    setBoarddeckOptions({
      ...boarddeckOptions,
      Organizer: value,
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
                  <Checkbox
                    onChange={onChangeSelectAll}
                    checked={boarddeckOptions.selectall}
                  >
                    <span className={styles["Box_options"]}>
                      {t("Meeting-details")}
                    </span>
                  </Checkbox>
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
                  <Button text={t("Share")} className={styles["ShareButton"]} />
                  <Button
                    text={t("Download")}
                    className={styles["ShareButton"]}
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
