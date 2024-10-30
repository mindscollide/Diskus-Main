import React from "react";
import styles from "./InternetModalConnectivity.module.css";
import { useTranslation } from "react-i18next";
import FailedIcon from "../../../../../assets/images/failed.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Modal } from "../../../../../components/elements";
import { InsternetDisconnectModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
const InternetConnectivityModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const UserManagementModalsinternetDisconnectModalData = useSelector(
    (state) => state.UserManagementModals.internetDisconnectModal
  );

  return (
    <section>
      <Modal
        show={UserManagementModalsinternetDisconnectModalData}
        setShow={dispatch(InsternetDisconnectModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(InsternetDisconnectModal(false));
        }}
        size={"sm"}
        ModalBody={
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <img src={FailedIcon} alt="" width={44} />
              </Col>
            </Row>
            <Row className="mt-1">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Offline"]}>
                  {t("You-are-offline")}
                </span>
              </Col>
            </Row>
            <Row className="mt-1">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["Messege"]}>
                  {t("Changes-made-now-will-not-be-saved")}
                </span>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default InternetConnectivityModal;
