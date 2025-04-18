import React from "react";
import styles from "./UnsavedPollsMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { Modal, Button } from "../../../../../../../components/elements";
import { showUnsavedPollsMeeting } from "../../../../../../../store/actions/NewMeetingActions";

const UnsavedPollsMeeting = ({ setCreatepoll }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const unsavedPollsMeeting = useSelector(
    (state) => state.NewMeetingreducer.unsavedPollsMeeting
  );
  const handleNOFunctionality = () => {
    dispatch(showUnsavedPollsMeeting(false));
  };

  const handleYesFunctionality = () => {
    setCreatepoll(false);
  };

  return (
    <section>
      <Modal
        show={unsavedPollsMeeting}
        setShow={dispatch(showUnsavedPollsMeeting)}
        modalHeaderClassName={"d-block border-0"}
        modalFooterClassName={"d-block border-0"}
        onHide={() => {
          dispatch(showUnsavedPollsMeeting(false));
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

export default UnsavedPollsMeeting;
