import React from "react";
import styles from "./NewEndMeetingModal.module.css";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Button, Modal } from "../../../../components/elements";
import { showEndMeetingModal } from "../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";

const NewEndMeetingModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.endMeetingModal}
        setShow={dispatch(showEndMeetingModal)}
        modalHeaderClassName={"d-block"}
        modalFooterClassName={"d-block"}
        onHide={() => {
          dispatch(showEndMeetingModal(false));
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
                  {t("Are-you-sure-you-want-to-leave")}
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
                <span className={styles["EndMeetingTextStyles"]}>
                  {t("The-meeting")}
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
                />
                <Button
                  text={t("Yes")}
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

export default NewEndMeetingModal;
