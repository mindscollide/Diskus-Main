import React from "react";
import styles from "./DeletePoll.module.css";
import { Modal, Button } from "../../../components/elements";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Col, Container, Row } from "react-bootstrap";
import {
  UpdatePollStatusByPollIdApi,
  setDeltePollModal,
} from "../../../store/actions/Polls_actions";

const DeletePoll = ({ id }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const PollsReducerdeletePollsModal = useSelector(
    (state) => state.PollsReducer.deletePollsModal
  );
  const handleNofunction = () => {
    dispatch(setDeltePollModal(false));
  };

  const deletePollFunction = () => {
    let data = {
      PollID: parseInt(id),
      PollStatusID: 4,
    };
    dispatch(UpdatePollStatusByPollIdApi(navigate, t, data));
  };
  return (
    <Container>
      <Modal
        show={PollsReducerdeletePollsModal}
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
                className="d-flex justify-content-center gap-1"
              >
                <Button
                  text={t("Yes")}
                  className={styles["Yes_Button"]}
                  onClick={deletePollFunction}
                />
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
