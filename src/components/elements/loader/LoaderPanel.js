import React, { useState, useEffect } from "react";
import Logo from "../../../assets/images/newElements/Diskus_newLogo.svg";
import { Container, Row, Col } from "react-bootstrap";
import styles from "./Loader.module.css";
// import newlogo from "../../../assets/images/Newlogo.svg";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import DikusGIF from "../../../assets/images/Loader.gif";

const LoaderPanel = ({ message }) => {
  const { t } = useTranslation();

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
        {/* <img src={newlogo} widt="269.97px" height="259.69px" />
          {localStorage.getItem("deleteContent") && (
            <p className={styles["deleteOrganizationContent"]}>
              {t("Please-wait-loader")}
            </p>
          )}
          <div className={styles["loader-line"]}></div> */}
      </Col>
    </Row>
  );
};

export default LoaderPanel;
