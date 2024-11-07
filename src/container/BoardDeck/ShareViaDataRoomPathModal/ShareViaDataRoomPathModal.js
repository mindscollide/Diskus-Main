import React from "react";
import styles from "./ShareViaDataRoomPathModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { showShareViaDataRoomPathConfirmation } from "../../../store/actions/NewMeetingActions";
import { Button, Modal } from "../../../components/elements";
import { Col, Row } from "react-bootstrap";
const ShareViaDataRoomPathModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const shareViaBoardDeckModalConfirmation = useSelector(
    (state) => state.NewMeetingreducer.shareViaDataRoomPathConfirmation
  );

  const handleCloseBtn = () => {
    dispatch(showShareViaDataRoomPathConfirmation(false));
  };

  return (
    <section>
      <Modal
        show={shareViaBoardDeckModalConfirmation}
        setShow={dispatch(showShareViaDataRoomPathConfirmation)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showShareViaDataRoomPathConfirmation(false));
        }}
        size={"md"}
        ModalBody={
          <>
            <section className={styles["PaddingForSection"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["FileShareModalHeading"]}>
                    {t("File-shared-successfully")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["YourFileSharedHeading"]}>
                    {t("Your-file-has-been-shared")}
                  </span>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["PathBoxStyles"]}>
                    <span className={styles["PathColor"]}>
                      <span>Dataroom</span> <span>{">"}</span>{" "}
                      <span>Meetings</span> <span>{">"}</span>{" "}
                      <span>Board Deck</span> <span>{">"}</span>{" "}
                      <span>Boarddeck</span>
                    </span>
                  </span>
                </Col>
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <section className={styles["PaddingForSection"]}>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-end gap-2"
                >
                  <Button
                    text={t("View-in-dataroom")}
                    className={styles["ViewDataRoomBtn"]}
                  />
                  <Button
                    text={t("Close")}
                    className={styles["CloseBtn"]}
                    onClick={handleCloseBtn}
                  />
                </Col>
              </Row>
            </section>
          </>
        }
      />
    </section>
  );
};

export default ShareViaDataRoomPathModal;
