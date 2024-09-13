import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import style from "./MobileAppPopUpModal.module.css";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal } from "../../../../../components/elements";
import { mobileAppPopModal } from "../../../../../store/actions/UserMangementModalActions";
import { Col, Row } from "react-bootstrap";
import DiskusIcon from "../../../../../assets/images/Diskus Icon.svg";

const MobileAppPopUpModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { UserManagementModals } = useSelector((state) => state);

  const handleOk = () => {
    const appLink = "com.axiswork.diskus://home";
    // Determine the fallback URL based on the user's device
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    const fallbackLink = isAndroid
      ? "https://play.google.com/store/apps/details?id=com.axiswork.diskus" // Android Play Store link
      : isIOS
      ? "https://apps.apple.com/us/app/diskus/id6475817410" // iOS App Store link
      : "";

    window.location.href = appLink;

    setTimeout(() => {
      window.location.href = fallbackLink;
    }, 2500);

    dispatch(mobileAppPopModal(false));
  };

  return (
    <section>
      <Modal
        show={UserManagementModals.mobileAppPopUp}
        setShow={(show) => dispatch(mobileAppPopModal(show))}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => {
          dispatch(mobileAppPopModal(false));
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
                <img alt="" src={DiskusIcon} />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={style["Heading"]}>
                  {t("Keep-watching-in-app")}
                </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <Button
                  text={t("Open-diskus-app")}
                  onClick={handleOk}
                  className={style["ButtonClass"]}
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <Button text={t("Log-in")} className={style["Login_button"]} />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default MobileAppPopUpModal;
