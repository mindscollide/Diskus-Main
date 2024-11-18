import React from "react";
import styles from "./DeleteMeetingModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../../components/elements";
import { showDeleteMeetingModal } from "../../../../../../../store/actions/NewMeetingActions";
import { useSelector } from "react-redux";

const DeleteMeetingModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const deleteMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.deleteMeetingModal
  );
  const handleCancelEvent = () => {
    dispatch(showDeleteMeetingModal(false));
  };

  return (
    <section>
      <Modal
        show={deleteMeetingModal}
        setShow={dispatch(showDeleteMeetingModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showDeleteMeetingModal(false));
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
                <span className={styles["DeleteModalHeading"]}>
                  {t("Are-you-sure-to-delete-this-meeting")}
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
                  text={t("Cancel")}
                  className={styles["Yes_unsave_File_Upload"]}
                  onClick={handleCancelEvent}
                />
                <Button
                  text={t("Proceed")}
                  className={styles["No_unsave_File_Upload"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default DeleteMeetingModal;
