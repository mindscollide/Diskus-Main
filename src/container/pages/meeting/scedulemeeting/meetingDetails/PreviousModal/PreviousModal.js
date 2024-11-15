import React, { useState } from "react";
import styles from "./PreviousModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import {
  ShowNextConfirmationModal,
  showPreviousConfirmationModal,
} from "../../../../../../store/actions/NewMeetingActions";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import {
  editMeetingFlag,
  saveMeetingFlag,
} from "../../../../../../store/actions/MeetingOrganizers_action";

const PreviousModal = ({
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
  prevFlag,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleYesFunctionality = () => {
    dispatch(showPreviousConfirmationModal(false));
    if (prevFlag === 3) {
      console.log("hello i am coming");
      setorganizers(true);
      setAgendaContributors(false);
    }

    if (prevFlag === 4) {
      console.log("hello i am coming");
      setAgendaContributors(true);
      setParticipants(false);
    }

    if (prevFlag === 5) {
      setAgenda(true);
      setMeetingMaterial(false);
    }

    if (prevFlag === 6) {
      setMeetingMaterial(true);
      setMinutes(false);
    }

    if (prevFlag === 2) {
      setmeetingDetails(true);
      setAgendaContributors(false);
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
    }
  };

  const handleNOFunctionality = () => {
    dispatch(showPreviousConfirmationModal(false));
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.ShowPreviousModal}
        setShow={dispatch(showPreviousConfirmationModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showPreviousConfirmationModal(false));
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

export default PreviousModal;
