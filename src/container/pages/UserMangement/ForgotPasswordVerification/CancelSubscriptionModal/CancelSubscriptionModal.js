import React from "react";
import styles from "./CancelSubscriptionModal.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import {
  showCancelSubscriptionModal,
  showReasonForLeavingModal,
} from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
const CancelSubscriptionModal = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const UserManagementModalscancelSubscriptionModalData = useSelector(
    (state) => state.UserManagementModals.cancelSubscriptionModal
  );

  const handleyesButton = () => {
    dispatch(showCancelSubscriptionModal(false));
    dispatch(showReasonForLeavingModal(true));
  };

  const handleClose = () => {
    dispatch(showCancelSubscriptionModal(false));
  };

  return (
    <section>
      <Modal
        show={UserManagementModalscancelSubscriptionModalData}
        setShow={dispatch(showCancelSubscriptionModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        size={"lg"}
        onHide={() => {
          dispatch(showCancelSubscriptionModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["CancelMessegeHeading"]}>
                  {t("Need-to-cancel-your-subscription?")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["messegeStyles"]}>
                  {t(
                    "We-know-circumstances-can-sometimes-change-We-are-sorry-to"
                  )}
                  <br />
                  <span className={styles["messegeStyles"]}>
                    {t(
                      "see-you-g-but-before-you-go-have-you-tried-our-technical-Help."
                    )}
                  </span>
                  <br />
                  <span className={styles["messegeStyles"]}>
                    {t("Are-you-sure-you-want-to-cancel?")}
                  </span>
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
                xs={12}
                className="d-flex justify-content-center gap-2"
              >
                <Button
                  text={t("No")}
                  onClick={handleClose}
                  className={styles["NoButtonStyles"]}
                />
                <Button
                  text={t("Yes")}
                  className={styles["YesButtonStyles"]}
                  onClick={handleyesButton}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default CancelSubscriptionModal;
