import React from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
import { useTranslation } from "react-i18next";
import DikusGIF from "../../../assets/images/Loader.gif";

/**
 * @component LoaderPanelVideoScreen
 * @description Variant of the panel loader specifically sized and styled for
 * video/screen-sharing views. Displays the Diskus branded animated GIF with an
 * optional message, using a larger image class (`LoadderImageVideoScreenclass`)
 * compared to the standard `LoaderPanel`. Supports i18n via react-i18next.
 *
 * @param {string} message - Text displayed below the loading GIF to describe the
 *                           in-progress operation.
 *
 * @example
 * {isBuffering && <LoaderPanelVideoScreen message={t("Loading-video")} />}
 */
const LoaderPanelVideoScreen = ({ message }) => {
  const { t } = useTranslation();

  return (
    <Row className={styles["overlay-box"]}>
      <Col className={styles["overlay-content-panel"]}>
        <img
          src={DikusGIF}
          className={styles["LoadderImageVideoScreenclass"]}
          alt="My GIF Icon"
          draggable="false"
        />
        <Row>
          <Col lg={12} md={12} sm={12}>
            <p className={styles["Messeges_Styles_Panel"]}>{message}</p>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoaderPanelVideoScreen;
