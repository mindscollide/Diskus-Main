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
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const handleOk = () => {
    const appLink = "thediskus://thediskus.com";
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

  const handleContinueWithBrowser = () => {
    dispatch(mobileAppPopModal(false));
  };

  return (
    <section>
      <Modal
        show={UserManagementModals.mobileAppPopUp}
        setShow={(show) => dispatch(mobileAppPopModal(show))}
        modalFooterClassName={"d-block"}
        className="MobilePopUpModal"
        keyboard={false}
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
                <span className={style["Experience_heading"]}>
                  {t("Upgrade-your-experience")}
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
                <span className={style["Experiecnce_subHeading"]}>
                  {t("Download-diskus-app-for-a-smoother")}
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
                <span className={style["Experiecnce_subHeading"]}>
                  {t("And-more-efficient-experience")}
                </span>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-center"
              >
                <Button
                  text={
                    isAndroid ? t("Go-to-play-store") : t("Go-to-App-store")
                  }
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
                <span
                  className={style["ContinueBrowser"]}
                  onClick={handleContinueWithBrowser}
                >
                  {t("Continue-with-browser")}
                </span>
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default MobileAppPopUpModal;
