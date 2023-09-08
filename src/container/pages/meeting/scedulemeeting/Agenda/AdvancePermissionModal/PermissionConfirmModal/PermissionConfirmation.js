import React from "react";
import styles from "./PermissionConfirmation.module.css";
import { Modal, Button } from "../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  showAdvancePermissionConfirmation,
  showAdvancePermissionModal,
} from "../../../../../../../store/actions/NewMeetingActions";
import { Col, Row } from "react-bootstrap";
const PermissionConfirmation = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const noBtnFunctionality = () => {
    dispatch(showAdvancePermissionModal(true));
  };
  const yesBtnFunctionality = () => {
    dispatch(showAdvancePermissionConfirmation(false));
  };
  return (
    <section>
      <Modal
        show={NewMeetingreducer.advancePermissionConfirmation}
        setShow={dispatch(showAdvancePermissionConfirmation)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showAdvancePermissionConfirmation(false));
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
                  {t("Any-unsaved-changes-will")}
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
                  {t("Be-lost-continue")}
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

export default PermissionConfirmation;
