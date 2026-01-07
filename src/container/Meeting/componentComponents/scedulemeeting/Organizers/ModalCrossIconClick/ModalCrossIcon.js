import React from "react";
import styles from "./ModalCrossIcon.module.css";
import { Modal, Button } from "../../../../../../components/elements";
import { showCrossConfirmationModal } from "../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const ModalCrossIcon = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);
  const handleYesFunction = () => {
    dispatch(showCrossConfirmationModal(false));
  };

  const handleNoFunction = () => {
    dispatch(showCrossConfirmationModal(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.crossConfirmation}
        setShow={dispatch(showCrossConfirmationModal)}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showCrossConfirmationModal(false));
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
                <span className={styles["Heading_unsaved_modal"]}>
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
                <span className={styles["Heading_unsaved_modal"]}>
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
                  className={styles["No_Button"]}
                  onClick={handleNoFunction}
                />
                <Button
                  text={t("Yes")}
                  className={styles["Yes_Button"]}
                  onClick={handleYesFunction}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default ModalCrossIcon;
