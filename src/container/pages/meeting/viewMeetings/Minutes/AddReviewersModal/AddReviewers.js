import React, { useState, useEffect, useRef } from "react";
import styles from "./AddReviewers.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import {
  Button,
  Modal,
  Checkbox,
} from "./../../../../../../components/elements";
import { useTranslation } from "react-i18next";

const AddReviewers = ({ addReviewers, setAddReviewers }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { MinutesReducer } = useSelector((state) => state);

  const [minutesDataAgenda, setMinutesDataAgenda] = useState([]);

  const [minutesDataGeneral, setMinutesDataGeneral] = useState([]);

  const [checkAllMinutes, setCheckAllMinutes] = useState(false);

  const textRef = useRef(null);
  const [isTruncated, setIsTruncated] = useState(false);

  function onChange(e) {
    setCheckAllMinutes(!checkAllMinutes);
  }

  useEffect(() => {
    if (
      MinutesReducer.allMinutesAG !== undefined &&
      MinutesReducer.allMinutesAG !== null &&
      MinutesReducer.allMinutesAG.length !== 0
    ) {
      setMinutesDataAgenda(MinutesReducer.allMinutesAG.agendaWise);
      setMinutesDataGeneral(MinutesReducer.allMinutesAG.general);
    } else {
      setMinutesDataAgenda([]);
      setMinutesDataGeneral([]);
    }
    return () => {
      setMinutesDataAgenda([]);
      setMinutesDataGeneral([]);
    };
  }, [MinutesReducer.minutesDataAgendaWise]);

  useEffect(() => {
    const checkIfTruncated = () => {
      const element = textRef.current;
      if (element) {
        setIsTruncated(element.scrollWidth > element.clientWidth);
      }
    };

    checkIfTruncated();
    window.addEventListener("resize", checkIfTruncated);

    return () => {
      window.removeEventListener("resize", checkIfTruncated);
    };
  }, []);

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  return (
    <Modal
      show={true}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-block"}
      onHide={() => setAddReviewers(false)}
      fullscreen={true}
      className={"FullScreenModal"}
      ModalTitle={
        <>
          <Row className="mx-50">
            <Col
              lg={12}
              md={12}
              sm={12}
              className={`${styles["agendaViewerHeader"]} text-end `}
            >
              <Checkbox
                label2Class={styles["SelectAll"]}
                label2={t("Select-all-minutes")}
                className="SearchCheckbox "
                name="IsChat"
                checked={checkAllMinutes}
                onChange={onChange}
                classNameDiv={styles["addReviewersCheckbox"]}
              />
            </Col>
          </Row>
        </>
      }
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <Checkbox
                label2Class={styles["agenda-title"]}
                label2="1.1. A brief overview of the main subject or theme."
                className="SearchCheckbox "
                name="IsChat"
                checked={checkAllMinutes}
                onChange={onChange}
                classNameDiv={styles["agendaTitleCheckbox"]}
              />
              <Checkbox
                label2Class={styles["minuteParentLabel"]}
                label2={
                  <>
                    <div className={styles["minuteWrapper"]}>
                      A brief overview of the main subject or theme.
                    </div>
                  </>
                }
                className="SearchCheckbox "
                name="IsChat"
                checked={checkAllMinutes}
                onChange={onChange}
                classNameDiv={styles["agendaTitleCheckbox"]}
              />
              <Checkbox
                label2Class={styles["minuteParentLabel"]}
                label2={
                  <>
                    <div className={styles["minuteWrapper"]}>
                      <p ref={textRef} className="m-0 w-95 text-truncate">
                        Task updates: Design phase completed, moving to
                        development, discussed resource reallocation to address
                        delays and decided unknown unknown printer took a galley
                        of type a printer took a galley of type a to hold daily
                        check-ins for quicker progress Design phase completed,
                        moving to development, discussed resource reallocation
                        to address delays and decided unknown unknown printer
                        took a galley of to hold daily check-ins for quicker
                        progress
                      </p>
                      {isTruncated ? (
                        <>
                          <span>{t("View-details")}</span>
                        </>
                      ) : null}
                    </div>
                  </>
                }
                className="SearchCheckbox "
                name="IsChat"
                checked={checkAllMinutes}
                onChange={onChange}
                classNameDiv={styles["agendaTitleCheckbox"]}
              />
            </Col>
          </Row>
        </>
      }
      ModalFooter={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-3 justify-content-end"
            >
              <Button className={styles["Cancel-Button"]} text={t("Cancel")} />
              <Button
                className={styles["Add-Button"]}
                text={t("Add-reviewers")}
              />
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default AddReviewers;
