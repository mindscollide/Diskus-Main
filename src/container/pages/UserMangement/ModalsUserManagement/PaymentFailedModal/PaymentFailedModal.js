import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { showFailedPaymentModal } from "../../../../../store/actions/UserMangementModalActions";
import { Button, Modal } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import styles from "./PaymentFailedModal.module.css";
const PaymentFailedModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const UserManagementModalspaymentProceedFailedData = useSelector(
    (state) => state.UserManagementModals.paymentProceedFailed
  );

  return (
    <section>
      <Modal
        show={UserManagementModalspaymentProceedFailedData}
        setShow={dispatch(showFailedPaymentModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showFailedPaymentModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["PaymentFailedHeading"]}>
                  {t("We-couldn't-process-your-payment-at-this")}
                  <br />
                  <span>
                    {t("time-please-review-your-details-and-try-again.")}
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
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Go-to-payment-detail-page")}
                  className={styles["PaymentDetailspage"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default PaymentFailedModal;
