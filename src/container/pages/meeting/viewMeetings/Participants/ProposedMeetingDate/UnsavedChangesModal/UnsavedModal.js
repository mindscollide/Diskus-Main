import React from "react";
import styles from "./UnsavedModal.module.css";
import { Modal, Button } from "../../../../../../../components/elements";

import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showPrposedMeetingUnsavedModal } from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
const UnsavedModal = ({ setProposedMeetingDates, setParticipants }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleNo = () => {
    dispatch(showPrposedMeetingUnsavedModal(false));
  };

  const handleYes = () => {
    setProposedMeetingDates(false);
    dispatch(showPrposedMeetingUnsavedModal(false));
    setParticipants(true);
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.prposedMeetingUnsavedModal}
        setShow={dispatch(showPrposedMeetingUnsavedModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showPrposedMeetingUnsavedModal(false));
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
                <span className={styles["UnsavedChanges_heading"]}>
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
                <span className={styles["UnsavedChanges_heading"]}>
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
                  className={styles["Unsaved_No-btn"]}
                  onClick={handleNo}
                />
                <Button
                  text={t("Yes")}
                  className={styles["Unsaved_Yes-btn"]}
                  onClick={handleYes}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default UnsavedModal;
