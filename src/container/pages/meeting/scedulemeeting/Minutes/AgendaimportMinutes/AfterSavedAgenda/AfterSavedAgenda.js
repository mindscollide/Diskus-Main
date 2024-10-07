import React, { useState } from "react";
import styles from "./AfterSavedAgenda.module.css";
import backDownArrow from "../../../../../../../assets/images/downDirect.png";
import upArrow from "../../../../../../../assets/images/UpperArrow.svg";
import { useTranslation } from "react-i18next";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../../../../../components/elements";
import Editicon from "../../../../../../../assets/images/Edit-Icon.png";
import ViewMinutes from "../ViewMinutes/ViewMinutes";
import EditAgenda from "../EditAgenda/EditAgenda";

const AfterSavedAgenda = ({ AgendaData }) => {
  const { t } = useTranslation();
  const [expandSubAgenda, setexpandSubAgenda] = useState(false);
  const [expandIndex, setexpandIndex] = useState(0);
  const [viewMinutesPage, setviewMinutesPage] = useState(false);
  const [showEditPage, setShowEditPage] = useState(false);

  const HandleExpandOptions = (index) => {
    setexpandIndex(index);
    setexpandSubAgenda(!expandSubAgenda);
  };

  const handleViewMinutesButton = () => {
    setviewMinutesPage(true);
  };

  const handleEditAgendaPage = () => {
    setShowEditPage(true);
  };

  return (
    <section>
      {viewMinutesPage ? (
        <ViewMinutes AgendaData={AgendaData} />
      ) : showEditPage ? (
        <EditAgenda AgendaData={AgendaData} />
      ) : (
        <>
          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <Button
                text={t("Invite-to-contribute")}
                className={styles["ButtonsAftersaved"]}
              />
              <Button
                text={t("Publish-minutes")}
                className={styles["ButtonsAftersaved"]}
              />
              <Button
                text={t("Edit")}
                className={styles["ButtonsAftersavedEdit"]}
                icon={
                  <img src={Editicon} height="11.75px" width="11.75px" alt="" />
                }
                onClick={handleEditAgendaPage}
              />
            </Col>
          </Row>
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
                              text={t("View-minutes")}
                              className={styles["ViewMinutesButton"]}
                              onClick={handleViewMinutesButton}
                            />
                          </Col>
                          <Col
                            lg={1}
                            md={1}
                            sm={1}
                            className="d-flex align-items-center"
                          >
                            <img
                              src={
                                expandIndex === index &&
                                expandSubAgenda === true
                                  ? upArrow
                                  : backDownArrow
                              }
                              alt=""
                              className="cursor-pointer"
                              onClick={() => {
                                HandleExpandOptions(index);
                              }}
                            />
                          </Col>
                          {/* Expandables Menu Insides */}
                          {expandIndex === index && expandSubAgenda === true ? (
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
                                                  styles[
                                                    "MeetinMaterial_Heading"
                                                  ]
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
        </>
      )}
    </section>
  );
};

export default AfterSavedAgenda;
