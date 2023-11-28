import React from "react";
import styles from "./NextAgenda.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showCancelModalAgenda } from "../../../../../../store/actions/NewMeetingActions";
import { nextTabAgenda } from "../../../../../../store/actions/MeetingAgenda_action";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "../../../../../../components/elements";

const NextAgenda = ({ setMeetingMaterial, setAgenda }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { MeetingAgendaReducer } = useSelector((state) => state);
  const handleNOFunctionality = () => {
    dispatch(nextTabAgenda(false));
  };

  const handleYesFunctionality = async () => {
    setMeetingMaterial(true);
    setAgenda(false);
    dispatch(nextTabAgenda(false));
  };
  return (
    <section>
      <Modal
        show={MeetingAgendaReducer.NextTabAgenda}
        setShow={dispatch(nextTabAgenda)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(nextTabAgenda(false));
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

export default NextAgenda;
