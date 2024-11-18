import React from "react";
import styles from "./CancelActions.module.css";
import { showCancelActions } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
const CancelActions = ({ setSceduleMeeting, setViewAdvanceMeetingModal }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleNOFunctionality = () => {
    dispatch(showCancelActions(false));
  };

  const handleYesFunctionality = () => {
    setSceduleMeeting(false);
  };

  return (
    <section>
      <Modal
        show={NewMeetingreducer.cancelActions}
        setShow={dispatch(showCancelActions)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showCancelActions(false));
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

export default CancelActions;
