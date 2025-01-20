import React from "react";
import styles from "./PresenterLeaveModal.module.css";
import { Col, Row, Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Button } from "../../../../../components/elements";
import {
  presenterModalLeave,
  startPresenterGlobal,
  stopPresenterGlobal,
} from "../../../../../store/actions/VideoFeature_actions";

const PresenterLeaveModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const leavePresenterModal = useSelector(
    (state) => state.videoFeatureReducer.leavePresenterModal
  );

  const onClickYesPresenterLeaveModal = () => {
    dispatch(startPresenterGlobal(false));
    dispatch(stopPresenterGlobal(true));
    dispatch(presenterModalLeave(false));
    localStorage.setItem("CheckNet", false);
  };

  const onClickNoPresenterLeaveModal = () => {
    dispatch(presenterModalLeave(false));
  };

  return (
    <>
      <section>
        <Modal
          show={leavePresenterModal}
          setShow={dispatch(presenterModalLeave)}
          modalFooterClassName={"d-block"}
          modalHeaderClassName={"d-block"}
          className={styles["Presenter-background-modal"]}
          onHide={() => {
            dispatch(presenterModalLeave(false));
          }}
          size={"md"}
          ModalBody={
            <>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <span className={styles["PresenterLeave-Message"]}>
                    {t("Do-you-want-to-leave-presentation")}
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
                    text={"Yes"}
                    className={styles["Yes-Presenter-leaveModal"]}
                    onClick={onClickYesPresenterLeaveModal}
                  />
                  <Button
                    text={"No"}
                    className={styles["No-Presenter-leaveModal"]}
                    onClick={onClickNoPresenterLeaveModal}
                  />
                </Col>
              </Row>
            </>
          }
        />
      </section>
    </>
  );
};

export default PresenterLeaveModal;
