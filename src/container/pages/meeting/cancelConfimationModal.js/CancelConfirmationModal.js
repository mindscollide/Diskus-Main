import React, { useContext } from "react";
import styles from "./CancelConfirmationModal.module.css";
import { Col, Modal, Row } from "react-bootstrap";
import CustomModal from "../../../../components/elements/modal/Modal";
import { MeetingContext } from "../../../../context/MeetingContext";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../components/elements";
const CancelConfirmationModal = ({
  handleClickDiscard,
  handleClickContinue,
}) => {
  const { cancelConfirmationModal, setCancelConfirmationModal } =
    useContext(MeetingContext);
  const { t } = useTranslation();
  return (
    <CustomModal
      show={cancelConfirmationModal}
      setShow={setCancelConfirmationModal}
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
                text={t("Discard")}
                className={styles["No_unsave_File_Upload"]}
                onClick={handleClickDiscard}
              />

              <Button
                text={t("Save-and-continue")}
                className={styles["Yes_unsave_File_Upload"]}
                onClick={handleClickContinue}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default CancelConfirmationModal;
