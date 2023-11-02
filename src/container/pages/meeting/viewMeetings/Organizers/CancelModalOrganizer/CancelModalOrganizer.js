import React from "react";
import styles from "./CancelModalOrganizer.module.css";
import { showCancelModalOrganizers } from "../../../../../../store/actions/NewMeetingActions";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../components/elements";
import { Col, Row } from "react-bootstrap";

const CancelModalOrganizer = ({ setSceduleMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  const handleNOFunctionality = () => {
    dispatch(showCancelModalOrganizers(false));
  };

  const handleYesFunctionality = () => {
    setSceduleMeeting(false);
  };

  return (
    <section>
      {" "}
      <section>
        <Modal
          show={NewMeetingreducer.cancelModalOrganizer}
          setShow={dispatch(showCancelModalOrganizers)}
          modalHeaderClassName={"d-block"}
          modalFooterClassName={"d-block"}
          onHide={() => {
            dispatch(showCancelModalOrganizers(false));
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

export default CancelModalOrganizer;
