import React from "react";
import styles from "./ThankForPayment.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { showThankYouPaymentModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
const ThankForPayment = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const UserManagementModalsthanksForPaymentModalData = useSelector(
    (state) => state.UserManagementModals.thanksForPaymentModal
  );
  return (
    <section>
      <Modal
        show={UserManagementModalsthanksForPaymentModalData}
        setShow={dispatch(showThankYouPaymentModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(showThankYouPaymentModal(false));
        }}
        ModalBody={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12} className="text-center">
                <span className={styles["thankyouheading"]}>
                  <span>{t("Thank-you-for-your-payment.")}</span>
                  <br />
                  <span>{t("Proceed-to-diskus-portal")}</span>
                </span>
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className="mt-1">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Go-to-portal")}
                  className={styles["GotoportalButton"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default ThankForPayment;
