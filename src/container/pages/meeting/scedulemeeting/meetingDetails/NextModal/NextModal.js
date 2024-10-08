import React, { useState } from "react";
import styles from "./NextModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { ShowNextConfirmationModal } from "../../../../../../store/actions/NewMeetingActions";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import {
  editMeetingFlag,
  saveMeetingFlag,
} from "../../../../../../store/actions/MeetingOrganizers_action";
const NextModal = ({
  setmeetingDetails,
  setorganizers,
  setAgendaContributors,
  setParticipants,
  setAgenda,
  setMinutes,
  setactionsPage,
  setAttendance,
  setPolls,
  setMeetingMaterial,
  setRowsData,
  flag,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const handleNOFunctionality = () => {
    dispatch(ShowNextConfirmationModal(false));
  };

  const handleYesFunctionality = () => {
    dispatch(ShowNextConfirmationModal(false));
    if (flag === 1) {
      setmeetingDetails(false);
      setorganizers(true);
    } else if (flag === 2) {
      setAgendaContributors(true);
      setmeetingDetails(false);
      setorganizers(false);
      setParticipants(false);
      setAgenda(false);
      setMinutes(false);
      setactionsPage(false);
      setAttendance(false);
      setPolls(false);
      setMeetingMaterial(false);
      setRowsData([]);
      dispatch(saveMeetingFlag(false));
      dispatch(editMeetingFlag(false));
    } else if (flag === 3) {
      setAgendaContributors(false);
      setParticipants(true);
    } else if (flag === 4) {
      setAgenda(true);
      setParticipants(false);
    } else if (flag === 5) {
      setMeetingMaterial(false);
      setMinutes(true);
    }
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.nextConfirmModal}
        setShow={dispatch(ShowNextConfirmationModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(ShowNextConfirmationModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t("Any-unsaved-changes-will-be")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t("Lost-continue")}
                </span>
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
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("No")}
                  className={styles["Yes_unsave_File_Upload"]}
                  onClick={handleNOFunctionality}
                />
                <Button
                  text={t("Yes")}
                  className={styles["No_unsave_File_Upload"]}
                  onClick={handleYesFunctionality}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default NextModal;
