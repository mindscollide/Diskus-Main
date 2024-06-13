import React, { useState, useEffect, useRef } from "react";
import styles from "./AddReviewers.module.css";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import SelectMinutes from "./SelectMinutes/SelectMinutes";
import SelectReviewers from "./SelectReviewers/SelectReviewers";

const AddReviewers = ({ addReviewers, setAddReviewers }) => {
  const { t } = useTranslation();

  const [selectMinutes, setSelectMinutes] = useState(true);
  const [selectReviewers, setSelectReviewers] = useState(false);

  const addReviewerScreen = () => {
    setSelectMinutes(false);
    setSelectReviewers(true);
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
        selectMinutes === true && selectReviewers === false ? (
          <SelectMinutes
            selectMinutes={selectMinutes}
            setSelectMinutes={setSelectMinutes}
          />
        ) : selectMinutes === false && selectReviewers === true ? (
          <SelectReviewers
            selectReviewers={selectReviewers}
            setSelectReviewers={setSelectReviewers}
          />
        ) : null
      }
      ModalFooter={
        <>
          {selectMinutes === true && selectReviewers === false ? (
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
          ) : selectMinutes === false && selectReviewers === true ? (
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
          ) : null}
        </>
      }
    />
  );
};

export default AddReviewers;
