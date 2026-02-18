import React, { useContext } from "react";
import styles from "./EndMeetingConfirmationModal.module.css";
import { Col, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { MeetingContext } from "../../../../context/MeetingContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
const EndMeetingConfirmationModal = ({
  handleClickDiscard,
  handleClickContinue,
}) => {
  const { endMeetingConfirmationModal, setEndMeetingConfirmationModal } =
    useContext(MeetingContext);
  const { t } = useTranslation();
  return (
    <CustomModal
      backdrop={true}
      size={"md"}
      className={styles["endMeetingModal"]}
      show={endMeetingConfirmationModal}
      setShow={setEndMeetingConfirmationModal}
      modalFooterClassName={"d-block"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyheading"]}>
                {t("End-meeting")}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyText"]}>
                {t(
                  "Are-you-sure-you-want-to-end-the-meeting-once-the-meeting-ends-all-the-participants-will-be-disconnected"
                )}
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
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("End-meeting")}
                className={styles["EndMeetingBtn"]}
                onClick={handleClickContinue}
              />

              <Button
                text={t("Cancel")}
                className={styles["CancelBtn"]}
                onClick={handleClickDiscard}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default EndMeetingConfirmationModal;
