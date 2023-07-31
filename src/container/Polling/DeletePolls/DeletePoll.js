import React from "react";
import styles from "./DeletePoll.module.css";
import { Modal, Button } from "../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSSR, useTranslation } from "react-i18next";
import { Col, Container, Row } from "react-bootstrap";
import { setDeltePollModal } from "../../../store/actions/Polls_actions";

const DeletePoll = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { PollsReducer } = useSelector((state) => state);

  const handleNofunction = () => {
    dispatch(setDeltePollModal(false));
  };
  return (
    <Container>
      <Modal
        show={PollsReducer.deletePollsModal}
        setShow={dispatch(setDeltePollModal)}
        onHide={() => {
          dispatch(setDeltePollModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                sm={12}
                md={12}
                className="d-flex justify-content-center align-items-center"
              >
                <span className={styles["Confirmation_delete"]}>
                  {t("Are-you-sure-you-want-to-continue?")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center gap-2 m-0 p-0"
              >
                <Button text={t("Yes")} className={styles["Yes_Button"]} />
                <Button
                  text={t("No")}
                  className={styles["No_Button"]}
                  onClick={handleNofunction}
                />
              </Col>
            </Row>
          </>
        }
        ModalFooter={<></>}
      />
    </Container>
  );
};

export default DeletePoll;
