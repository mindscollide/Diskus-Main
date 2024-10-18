import React, { useContext } from "react";
import styles from "./EndMeetingConfirmationModal.module.css";
import { Col, Modal, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { MeetingContext } from "../../../../context/MeetingContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
const EndMeetingConfirmationModal = ({
  handleClickDiscard,
  handleClickContinue,
}) => {
  const { canceConfirmationModal, setConfirmationModal } =
    useContext(MeetingContext);
  const { t } = useTranslation();
  return (
    <CustomModal
      show={canceConfirmationModal}
      setShow={setConfirmationModal}
      modalFooterClassName={"d-block"}
      ModalBody={
        <>
          <Row>
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyheading"]}>
                {t(
                  "Unsave-changes"
                )}
              </span>
            </Col>
          </Row>
          <Row className="mt-2">
            <Col sm={12} md={12} lg={12}>
              <span className={styles["modalBodyText"]}>
                {t(
                  "You-have-unsaved-changes-if-you-leave-this-page-your-changes-will-be-lost-do-you-want-to-continue-without-saving"
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
              className='d-flex justify-content-end gap-2'>
              <Button
                text={t("End-meeting")}
                className={styles["EndMeetingBtn"]}
                onClick={handleClickDiscard}
              />

              <Button
                text={t("Cancel")}
                className={styles["CancelBtn"]}
                onClick={handleClickContinue}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default EndMeetingConfirmationModal;
