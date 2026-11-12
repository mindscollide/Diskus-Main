import React from "react";
import styles from "./CancelPollsModal.module.css";
import { showCancelPolls } from "../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal } from "../../../components/elements";
import { Col, Row } from "react-bootstrap";

// "Any unsaved changes will be lost, continue?" modal shared by the polls of
// Group, Committee and Meeting. "No" closes the modal; what "Yes" does depends on
// the context, so the caller passes it as onConfirm.
const CancelPollsModal = ({ onConfirm }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cancelPolls = useSelector(
    (state) => state.NewMeetingreducer.cancelPolls,
  );

  const handleNo = () => {
    dispatch(showCancelPolls(false));
  };

  return (
    <section>
      <Modal
        show={cancelPolls}
        setShow={dispatch(showCancelPolls)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={handleNo}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center">
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
                className="d-flex justify-content-center">
                <span className={styles["UnsaveheadingFileUpload"]}>
                  {t("Lost-continue")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center gap-2">
              <Button
                text={t("No")}
                className={styles["Yes_unsave_File_Upload"]}
                onClick={handleNo}
              />
              <Button
                text={t("Yes")}
                className={styles["No_unsave_File_Upload"]}
                onClick={onConfirm}
              />
            </Col>
          </Row>
        }
      />
    </section>
  );
};

export default CancelPollsModal;
