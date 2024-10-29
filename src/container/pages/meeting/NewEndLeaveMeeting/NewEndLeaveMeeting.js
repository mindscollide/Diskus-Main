import React from "react";
import styles from "./NewEndLeaveMeeting.module.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../components/elements";
import { showEndMeetingForAll } from "../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";

const NewEndLeaveMeeting = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const endForAllMeeting = useSelector(
    (state) => state.NewMeetingreducer.endForAllMeeting
  );
  return (
    <section>
      <Modal
        show={endForAllMeeting}
        setShow={dispatch(showEndMeetingForAll)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showEndMeetingForAll(false));
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
                <span className={styles["EndMeetingTextStyles"]}>
                  {t("End-meeting")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className="mb-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("End-for-all")}
                  className={styles["Yes_unsave_File_Upload"]}
                />
                <Button
                  text={t("End-for-me")}
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

export default NewEndLeaveMeeting;
