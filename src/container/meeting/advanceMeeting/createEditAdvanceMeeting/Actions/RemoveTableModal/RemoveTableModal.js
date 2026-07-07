import React from "react";
import styles from "./RemoveTableModal.module.css";
import { showRemovedTableModal } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
const RemoveTableModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const removeTableModal = useSelector(
    (state) => state.NewMeetingreducer.removeTableModal
  );
  const handleCancelFunctionality = () => {
    dispatch(showRemovedTableModal(false));
  };

  return (
    <section>
      <Modal
        show={removeTableModal}
        setShow={dispatch(showRemovedTableModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showRemovedTableModal(false));
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
                <span className={styles["Sure_Messege_Class"]}>
                  {t("Are-you-sure-you-want-to")}
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
                <span className={styles["Sure_Messege_Class"]}>
                  {t("Remove-the-action")}
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
                  className={styles["Cancel_Button_Remove_poll_meeting_Table"]}
                  onClick={handleCancelFunctionality}
                />
                <Button
                  text={t("Proceed")}
                  className={styles["Proceed_Button_Remove_poll_meeting_Table"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default RemoveTableModal;
