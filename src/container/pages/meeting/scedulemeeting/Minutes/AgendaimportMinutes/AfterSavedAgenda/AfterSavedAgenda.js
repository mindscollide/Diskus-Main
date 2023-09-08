import React, { useState } from "react";
import styles from "./AfterSavedAgenda.module.css";
import backDownArrow from "../../../../../../../assets/images/downDirect.png";
import upArrow from "../../../../../../../assets/images/UpperArrow.svg";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../../../../../components/elements";

const AfterSavedAgenda = ({ AgendaData }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [expandSubAgenda, setexpandSubAgenda] = useState(false);

  const HandleExpandOptions = () => {
    setexpandSubAgenda(!expandSubAgenda);
  };

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12}>
          {AgendaData.length > 0
            ? AgendaData.map((data, index) => {
                return (
                  <>
                    <Row className="mt-5">
                      <Col lg={8} md={8} sm={8}>
                        <span className={styles["MeetinMaterial_Heading"]}>
                          <span>{index + 1}.</span> {data.MainTitle}
                        </span>
                      </Col>
                      <Col lg={3} md={3} sm={3}>
                        <Button
                          text={"View-minutes"}
                          className={styles["ViewMinutesButton"]}
                        />
                      </Col>
                      <Col
                        lg={1}
                        md={1}
                        sm={1}
                        className="d-flex align-items-center"
                      >
                        <img
                          src={expandSubAgenda ? upArrow : backDownArrow}
                          className="cursor-pointer"
                          onClick={HandleExpandOptions}
                        />
                      </Col>
                      {/* Expandables Menu Insides */}
                      {expandSubAgenda ? (
                        <>
                          <Row className="mt-3">
                            {data.SubAgenda.map(
                              (SubagendaTitle, SubAgendaIndex) => {
                                return (
                                  <>
                                    <Col lg={1} md={1} sm={1}></Col>
                                    <Col lg={11} md={11} sm={11}>
                                      <Row>
                                        <Col lg={8} md={8} sm={8}>
                                          <span
                                            className={
                                              styles["MeetinMaterial_Heading"]
                                            }
                                          >
                                            1.1.
                                            <span>
                                              {SubagendaTitle.SubTitle}
                                            </span>
                                          </span>
                                        </Col>
                                        <Col
                                          lg={1}
                                          md={1}
                                          sm={1}
                                          className="m-0 p-0"
                                        >
                                          <Button
                                            text={"View-minutes"}
                                            className={
                                              styles[
                                                "ViewMinutesButtonSubAgendaViewButton"
                                              ]
                                            }
                                          />
                                        </Col>
                                      </Row>
                                    </Col>
                                  </>
                                );
                              }
                            )}
                          </Row>
                        </>
                      ) : null}

                      <Row>
                        <span className={styles["Bottom_Line"]}></span>
                      </Row>
                    </Row>
                  </>
                );
              })
            : null}
        </Col>
      </Row>
    </section>
  );
};

export default AfterSavedAgenda;
