import React from "react";
import styles from "./CancelButtonModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
const CancelButtonModal = ({
  setCancelModalView,
  cancelModalView,
  setViewAdvanceMeetingModal,
  setMeetingDetails,
  setAgenda,
}) => {
  const { t } = useTranslation();

  const handleNOFunctionality = () => {
    setCancelModalView(false);
  };

  const handleYesFunctionality = () => {
    setMeetingDetails(false);
    setViewAdvanceMeetingModal(false);
    setCancelModalView(false);
    setAgenda(false);
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={cancelModalView}
          setShow={setCancelModalView(true)}
          modalHeaderClassName={"d-block"}
          modalFooterClassName={"d-block"}
          onHide={() => {
            setCancelModalView(false);
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
    </section>
  );
};

export default CancelButtonModal;
