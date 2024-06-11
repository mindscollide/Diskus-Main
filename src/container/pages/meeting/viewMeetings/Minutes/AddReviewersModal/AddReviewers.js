import React, { useState, useEffect, useRef } from "react";
import styles from "./AddReviewers.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Container, Col, Row } from "react-bootstrap";
import {
  Button,
  Modal,
  Checkbox,
  AttachmentViewer,
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
  const [isTruncated, setIsTruncated] = useState(true);

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

  const showHideDetails = () => {
    if (isTruncated === true) {
      setIsTruncated(false);
    } else {
      setIsTruncated(true);
    }
  };

  console.log("Minutes Data Agenda Wise", minutesDataAgenda);
  console.log("Minutes Data General", minutesDataGeneral);

  return (
    <Modal
      show={true}
      modalBodyClassName={"scrollStyle mr-20"}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"mr-20 d-block"}
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
          {/* Agenda Wise Minutes */}
          <Row className="mb-25">
            <Col lg={12} md={12} sm={12}>
              <Checkbox
                label2Class={styles["agenda-title"]}
                label2="1. A brief overview of the main subject or theme."
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>

                          {isTruncated ? null : (
                            <Row>
                              <Col lg={2} md={2} sm={12}>
                                <AttachmentViewer
                                  id={0}
                                  name={"Dummy File.pdf"}
                                />
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
          {/* SubAgenda Wise Minute OF Parent Agenda */}
          <Row className="mb-25 ml-25">
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>

                          {isTruncated ? null : (
                            <Row>
                              <Col lg={2} md={2} sm={12}>
                                <AttachmentViewer
                                  id={0}
                                  name={"Dummy File.pdf"}
                                />
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
          {/* General Mintues */}
          <Row className="mb-25">
            <Col lg={12} md={12} sm={12}>
              <Checkbox
                label2Class={styles["agenda-title"]}
                label2={t("General-minutes")}
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
                      <Row>
                        <Col className="pr-0" lg={11} md={11} sm={12}>
                          <p
                            ref={textRef}
                            className={
                              isTruncated ? "m-0 text-truncate" : "m-0"
                            }
                          >
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            to hold daily check-ins for quicker progress
                          </p>

                          {isTruncated ? null : (
                            <Row>
                              <Col lg={2} md={2} sm={12}>
                                <AttachmentViewer
                                  id={0}
                                  name={"Dummy File.pdf"}
                                />
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col className="d-flex pr-0" lg={1} md={1} sm={12}>
                          {isTruncated ? (
                            <>
                              <span
                                onClick={showHideDetails}
                                className={styles["view-details"]}
                              >
                                {t("View-details")}
                              </span>
                            </>
                          ) : (
                            <span
                              onClick={showHideDetails}
                              className={styles["view-details"]}
                            >
                              {t("Hide-details")}
                            </span>
                          )}
                        </Col>
                      </Row>
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
