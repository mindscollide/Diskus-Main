import React from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
import DikusGIF from "../../../assets/images/Loader.gif";

/**
 * @component LoaderPanel
 * @description Renders an animated loading overlay (the Diskus branded GIF) with an
 * optional descriptive message beneath it. Intended for use inside content panels
 * while asynchronous data is being fetched, keeping the loading state visually
 * contained within the panel rather than blocking the entire screen.
 *
 * @param {string} message - Text displayed below the loading GIF to describe the
 *                           in-progress operation (e.g. "Loading meetings…").
 *
 * @example
 * {isLoading && <LoaderPanel message="Fetching committee data..." />}
 */
const LoaderPanel = ({ message }) => {
  return (
    <Row className={styles["overlay-box"]}>
      <Col className={styles["overlay-content-panel"]}>
        <img
          src={DikusGIF}
          className={styles["LoadderImagePanelclass"]}
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

export default LoaderPanel;
