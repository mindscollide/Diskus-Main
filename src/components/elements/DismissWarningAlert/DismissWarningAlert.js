// import { render } from '@testing-library/react';
import React, { useState } from "react";
import styles from "./DissmissWarningAlert.module.css";
import Alert from "react-bootstrap/Alert";
import img1 from "./../../../assets/images/limit-exceed.png";
import img2 from "./../../../assets/images/newElements/Line.png";
import { useTranslation } from "react-i18next";

/**
 * @component DismissWarningAlert
 * @description A dismissible subscription-expiry warning banner displayed at the top of
 * relevant pages. Built on React-Bootstrap's Alert component with the "danger" variant.
 * The alert is visible by default (show=true) and disappears permanently when the user
 * clicks the close (X) button, using internal component state — the dismissed state is
 * not persisted across page loads.
 *
 * The heading message ("Your-subscription-will-expire-soon") is internationalised via
 * react-i18next so it adapts to the user's selected language. A "Revoke Cancellation"
 * action link is also shown, though its handler is not yet wired up.
 *
 * This component accepts no props — all content and behaviour is self-contained.
 *
 * @example
 * // Render the banner at the top of a page or layout component:
 * <DismissWarningAlert />
 */
const DismissWarningAlert = () => {
  const [show, setShow] = useState(true);
  const { t } = useTranslation();
  if (show) {
    return (
      <Alert
        className={styles["Alert"]}
        variant="danger"
        onClose={() => setShow(false)}
        dismissible
      >
        <Alert.Heading className={styles["MainAlert"]}>
          <img
            src={img1}
            width={"18px"}
            alt=""
            className={styles["image1"]}
            draggable="false"
          ></img>
          <strong className={styles["AlertHeading"]}>
            {t("Your-subscription-will-expire-soon")}
          </strong>
          <a className={styles["revoke"]}>Revoke Cancellation</a>
          <img
            className={styles["image2"]}
            alt=""
            src={img2}
            draggable="false"
          ></img>
        </Alert.Heading>
      </Alert>
    );
  }
};

export default DismissWarningAlert;
