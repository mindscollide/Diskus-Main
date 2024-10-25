import React from "react";
import styles from "./PreviousAgenda.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { previousTabAgenda } from "../../../../../../store/actions/MeetingAgenda_action";
import { Col, Row } from "react-bootstrap";
import { Button, Modal } from "../../../../../../components/elements";

const PreviousAgenda = ({ setAgenda, setParticipants }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { MeetingAgendaReducer } = useSelector((state) => state);
  const handleNOFunctionality = () => {
    dispatch(previousTabAgenda(false));
  };

  const handleYesFunctionality = async () => {
    setAgenda(false);
    setParticipants(true);
    dispatch(previousTabAgenda(false));
  };
  return (
    <section>
      <Modal
        show={MeetingAgendaReducer.PreviousTabAgenda}
        setShow={dispatch(previousTabAgenda)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(previousTabAgenda(false));
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

export default PreviousAgenda;
