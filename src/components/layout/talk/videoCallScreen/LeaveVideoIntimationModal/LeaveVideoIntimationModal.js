import React from "react";
import styles from "./LeaveVideoIntimationModal.module.css";
import { Button, Modal } from "../../../../elements";
import { useSelector } from "react-redux";
import { LeaveInitmationMessegeVideoMeetAction } from "../../../../../store/actions/VideoMain_actions";
import { useDispatch } from "react-redux";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
const LeaveVideoIntimationModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const showVideoIntimationMessegeModal = useSelector(
    (state) => state.VideoMainReducer.LeaveVideoIntimationMessegeGlobalState
  );
  return (
    <section>
      <Modal
        show={showVideoIntimationMessegeModal}
        setShow={dispatch(LeaveInitmationMessegeVideoMeetAction)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(LeaveInitmationMessegeVideoMeetAction(false));
        }}
        size={"sm"}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["IntimationMessegeLeaveVideo"]}>
                  {t("Meeting-leave-confirmation")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Button
                  text={"Yes"}
                  className={
                    styles["YesButtonLeaveIntimationMessegeMeetingModal"]
                  }
                />
                <Button
                  text={"No"}
                  className={
                    styles["NoButtonLeaveIntimationMessegeMeetingModal"]
                  }
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default LeaveVideoIntimationModal;
