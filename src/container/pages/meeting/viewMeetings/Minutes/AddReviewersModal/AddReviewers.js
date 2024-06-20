import React, { useState, useEffect, useRef } from "react";
import styles from "./AddReviewers.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import SelectMinutes from "./SelectMinutes/SelectMinutes";
import SelectReviewers from "./SelectReviewers/SelectReviewers";
import SendReviewers from "./SendReviewers/SendReviewers";

const AddReviewers = ({ addReviewers, setAddReviewers }) => {
  const { t } = useTranslation();

  const [selectMinutes, setSelectMinutes] = useState(true);
  const [selectReviewers, setSelectReviewers] = useState(false);
  const [sendReviewers, setSendReviewers] = useState(false);

  const addReviewerScreen = () => {
    if (selectMinutes) {
      setSelectMinutes(false);
      setSelectReviewers(true);
      setSendReviewers(false);
    } else if (selectReviewers) {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(true);
    } else {
      setSelectMinutes(false);
      setSelectReviewers(false);
      setSendReviewers(false);
      setAddReviewers(false);
    }
  };

  return (
    <Modal
      show={true}
      modalBodyClassName={
        selectMinutes ? "scrollStyle mr-20 mt-16p" : "scrollStyle mr-20 "
      }
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-none"}
      onHide={() => setAddReviewers(false)}
      fullscreen={true}
      className={"FullScreenModal"}
      ModalBody={
        selectMinutes === true &&
        selectReviewers === false &&
        sendReviewers === false ? (
          <SelectMinutes
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
          />
        ) : selectMinutes === false &&
          selectReviewers === true &&
          sendReviewers === false ? (
          <SelectReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
          />
        ) : selectMinutes === false &&
          selectReviewers === false &&
          sendReviewers === true ? (
          <SendReviewers
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
            setSelectReviewers={setSelectReviewers}
            selectReviewers={selectReviewers}
            sendReviewers={sendReviewers}
            setSendReviewers={setSendReviewers}
          />
        ) : null
      }
      ModalFooter={
        <>
          {selectMinutes === true &&
          selectReviewers === false &&
          sendReviewers === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button"]}
                  text={t("Add-reviewers")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === true &&
            sendReviewers === false ? (
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Add")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : selectMinutes === false &&
            selectReviewers === false &&
            sendReviewers === true ? (
            <Row>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex gap-3 justify-content-start"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex gap-3 justify-content-end"
              >
                <Button
                  onClick={() => setAddReviewers(false)}
                  className={styles["Cancel-Button"]}
                  text={t("Cancel")}
                />
                <Button
                  className={styles["Add-Button-Reviewerss"]}
                  text={t("Add-reviewers")}
                  onClick={addReviewerScreen}
                  disableBtn={true}
                />
                <Button
                  className={styles["Add-Button-Reviewers"]}
                  text={t("Send")}
                  onClick={addReviewerScreen}
                />
              </Col>
            </Row>
          ) : null}
        </>
      }
    />
  );
};

export default AddReviewers;
