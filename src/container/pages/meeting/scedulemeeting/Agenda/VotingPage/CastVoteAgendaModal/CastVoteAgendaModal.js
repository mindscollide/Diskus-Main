import React from "react";
import styles from "./CastVoteAgendaModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../../../components/elements";
import { showCastVoteAgendaModal } from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
import { Radio } from "antd";

const CastVoteAgendaModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  return (
    <section>
      <Modal
        show={NewMeetingreducer.castVoteAgendaPage}
        setShow={dispatch(showCastVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showCastVoteAgendaModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["IntroHeading"]}>
                  {t("Introduction")}
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <span className={styles["MainHeading"]}>
                  {t("Was-the-introduction-satisfactory")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex jusitfy-content-center align-items-center"
              >
                <Radio />
              </Col>
              <Col lg={11} md={11} sm={11}>
                <section className={styles["outerboxForOptions"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["AnswerStyles"]}>{t("YES")}</span>
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex jusitfy-content-center align-items-center"
              >
                <Radio />
              </Col>
              <Col lg={11} md={11} sm={11}>
                <section className={styles["outerboxForOptions"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["AnswerStyles"]}>{t("NO")}</span>
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={1}
                md={1}
                sm={1}
                className="d-flex jusitfy-content-center align-items-center"
              >
                <Radio />
              </Col>
              <Col lg={11} md={11} sm={11}>
                <section className={styles["outerboxForOptions"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12}>
                      <span className={styles["AnswerStyles"]}>
                        {t("Abstain")}
                      </span>
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cast_vote_CancelButton"]}
                  onClick={() => {
                    dispatch(showCastVoteAgendaModal(false));
                  }}
                />
                <Button
                  text={t("Save")}
                  className={styles["Cast_vote_SaveButton"]}
                />
              </Col>
            </Row>
          </>
        }
        size={"md"}
      />
    </section>
  );
};

export default CastVoteAgendaModal;
