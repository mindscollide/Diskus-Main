import React from "react";
import styles from "./VoteModalConfirm.module.css";
import { Modal, Button } from "../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import {
  showVoteAgendaModal,
  showVoteConfirmationModal,
} from "../../../../../../../store/actions/NewMeetingActions";
const VoteModalConfirm = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);

  const noBtnFunctionality = () => {
    dispatch(showVoteAgendaModal(true));
    dispatch(showVoteConfirmationModal(false));
  };

  const yesBtnFunctionality = () => {
    dispatch(showVoteConfirmationModal(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.voteConfirmationModal}
        setShow={dispatch(showVoteConfirmationModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showVoteConfirmationModal(false));
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
                <span className={styles["Advance_permission_Confirmation"]}>
                  {"Any-unsaved-changes-will"}
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
                <span className={styles["Advance_permission_Confirmation"]}>
                  {"Be-lost-continue"}
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
                  className={styles["No_confirmation"]}
                  onClick={noBtnFunctionality}
                />
                <Button
                  text={t("Yes")}
                  className={styles["Yes_confirmation"]}
                  onClick={yesBtnFunctionality}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default VoteModalConfirm;
