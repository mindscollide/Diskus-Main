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
import { Checkbox, Radio, Tooltip } from "antd";
import { Col, Container, Row } from "react-bootstrap";
import {
  BoardDeckPDFDownloadApi,
  BoardDeckValidateIsMinutesPublishedAPI,
} from "../../../store/actions/UserManagementActions";
import warningImage from "../../../assets/images/warning.png";
import { useMeetingContext } from "../../../context/MeetingContext";
const BoardDeckModal = ({
  boarddeckOptions,
  setBoarddeckOptions,
  boardDeckMeetingID,
}) => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { editorRole } = useMeetingContext();
  const boardDeckModalData = useSelector(
    (state) => state.NewMeetingreducer.boardDeckModalData
  );
  const getMinutesPublishedData = useSelector(
    (state) => state.UserMangementReducer.getMinutesPublishedData
  );
  const [radioValue, setRadioValue] = useState(1);
  const [publishedMinutes, setPublishedMinutes] = useState(false);

  //Minutes Published API
  useEffect(() => {
    try {
      let data = { PK_mdid: Number(boardDeckMeetingID) };
      dispatch(BoardDeckValidateIsMinutesPublishedAPI(navigate, t, data));
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  //Minutes Published API Data
  useEffect(() => {
    try {
      if (
        getMinutesPublishedData !== null &&
        getMinutesPublishedData !== undefined
      ) {
        setPublishedMinutes(
          getMinutesPublishedData.minutesStatus.isMinutesPublished
        );
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [getMinutesPublishedData]);

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
    localStorage.setItem("meetingTitle", "");
  };

  const handleRadioChange = (value) => {
    setRadioValue(value);
    console.log("valuevaluevalue", value);
  };

  const handleCancelButton = () => {
    dispatch(boardDeckModal(false));
    localStorage.setItem("meetingTitle", "");
    setBoarddeckOptions({
      selectall: false,
      Organizer: false,
      AgendaContributor: false,
      Participants: false,
      Minutes: false,
      Task: false,
      polls: false,
      attendeceReport: false,
      video: false,
      Agenda: false,
    });
  };

  const handleDownloadButton = () => {
    let data = {
      PK_MDID: Number(boardDeckMeetingID),
      fetchOrganizers: boarddeckOptions.Organizer,
      fetchAgendaContributors: boarddeckOptions.AgendaContributor,
      fetchParticipants: boarddeckOptions.Participants,
      fetchMinutes: publishedMinutes ? boarddeckOptions.Minutes : false,
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
          show={boardDeckModalData}
          setShow={dispatch(boardDeckModal)}
          modalFooterClassName={"d-block"}
          modalHeaderClassName={"d-block"}
          onHide={() => {
            dispatch(boardDeckModal(false));
            localStorage.setItem("meetingTitle", "");
            setBoarddeckOptions({
              selectall: false,
              Organizer: false,
              AgendaContributor: false,
              Participants: false,
              Minutes: false,
              Task: false,
              polls: false,
              attendeceReport: false,
              video: false,
              Agenda: false,
            });
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
                    checked={boarddeckOptions.selectall}>
                    <span className={styles["Class_CheckBox"]}>
                      {t("Select-all")}
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col lg={4} md={4} sm={4}>
                  <div className='d-flex gap-3 align-items-center'>
                    <img src={blacktick} alt='' />
                    <span className={styles["Box_options"]}>
                      {t("Meeting-details")}
                    </span>
                  </div>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeOrganizers}
                    checked={boarddeckOptions.Organizer}>
                    <span className={styles["Box_options"]}>
                      {t("Organizers")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeAgendaContributor}
                    checked={boarddeckOptions.AgendaContributor}>
                    <span className={styles["Box_options"]}>
                      {t("Agenda-Contributor")}
                    </span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeParticipants}
                    checked={boarddeckOptions.Participants}>
                    <span className={styles["Box_options"]}>
                      {t("Participants")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  {publishedMinutes ? (
                    <>
                      {" "}
                      <Checkbox
                        onChange={onChangeMinutes}
                        checked={boarddeckOptions.Minutes}>
                        <span className={styles["Box_options"]}>
                          {t("Minutes")}
                        </span>
                      </Checkbox>
                    </>
                  ) : (
                    <>
                      <Col lg={4} md={4} sm={4}>
                        <Row>
                          <Col
                            lg={3}
                            md={3}
                            sm={3}
                            className='d-flex align-items-center'>
                            <Tooltip
                              placement='topLeft'
                              title={
                                <span className={styles["FontsizeToolTip"]}>
                                  {t(
                                    "Minutes-will-be-available-when-published"
                                  )}
                                </span>
                              }>
                              <img
                                src={warningImage}
                                alt=''
                                className='cursor-pointer'
                              />
                            </Tooltip>
                          </Col>
                          <Col lg={9} md={9} sm={9}>
                            <span
                              className={styles["Box_options_MinutesDisabled"]}>
                              {t("Minutes")}
                            </span>
                          </Col>
                        </Row>
                      </Col>
                    </>
                  )}
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeTask}
                    checked={boarddeckOptions.Task}>
                    <span className={styles["Box_options"]}>{t("Task")}</span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangePolls}
                    checked={boarddeckOptions.polls}>
                    <span className={styles["Box_options"]}>{t("Polls")}</span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeAttendenceReport}
                    checked={boarddeckOptions.attendeceReport}>
                    <span className={styles["Box_options"]}>
                      {t("Attendence-report")}
                    </span>
                  </Checkbox>
                </Col>
                <Col lg={4} md={4} sm={4}>
                  <Checkbox
                    onChange={onChangeVideo}
                    checked={boarddeckOptions.video}>
                    <span className={styles["Box_options"]}>{t("Video")}</span>
                  </Checkbox>
                </Col>
              </Row>
              <Row className='mt-4'>
                <Col lg={12} md={12} sm={12}>
                  <Checkbox
                    onChange={onChangeAgenda}
                    checked={boarddeckOptions.Agenda}>
                    <span className={styles["Box_options_Agendaas"]}>
                      <Radio.Group
                        onChange={(e) => handleRadioChange(e.target.value)}
                        value={radioValue}
                        className='BoarddeckSelection'>
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
                  className='d-flex gap-2 justify-content-end'>
                  <Button
                    text={t("Cancel")}
                    className={styles["CancelButton"]}
                    onClick={handleCancelButton}
                  />
                  <Button
                    text={t("Share")}
                    className={styles["ShareButton"]}
                    onClick={handlesharebuttonModal}
                  />
                  {editorRole.role === "Agenda Contributor" ? null : (
                    <Button
                      text={t("Download")}
                      className={styles["ShareButton"]}
                      onClick={handleDownloadButton}
                    />
                  )}
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
