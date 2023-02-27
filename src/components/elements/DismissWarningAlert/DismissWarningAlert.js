// import { render } from '@testing-library/react';
import React, { useState } from "react";
import styles from "./DissmissWarningAlert.module.css";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import img1 from "./../../../assets/images/newElements/exclamation.png";
import img2 from "./../../../assets/images/newElements/Line.png";

const DismissWarningAlert = () => {
  const [show, setShow] = useState(true);
  if (show) {
    return (
      <Alert
        className={styles["Alert"]}
        variant="danger"
        onClose={() => setShow(false)}
        dismissible
      >
        <Alert.Heading className={styles["MainAlert"]}>
          <img src={img1} width={"18px"} className={styles["image1"]}></img>
          <strong 
          className={styles["AlertHeading"]}
          >
            Your Subscription will Expire soon
          </strong>
          <a className={styles["revoke"]}>Revoke Cancellation</a>
          <img className={styles["image2"]}  src={img2}></img>
        </Alert.Heading>
      </Alert>
    );
  }
};

export default DismissWarningAlert;
