import React, { useState, useEffect, useRef } from "react";
import styles from "./VersionHistory.module.css";
import { Container, Col, Row } from "react-bootstrap";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../../components/elements";
import { useTranslation } from "react-i18next";
import DefaultAvatar from "./../../../../../../MinutesNewFlow/Images/avatar.png";

const VersionHistory = ({ showVersionHistory, setShowVersionHistory }) => {
  const { t } = useTranslation();

  let currentLanguage = localStorage.getItem("i18nextLng");

  const [showComments, setShowComments] = useState(false);

  const moreComments = () => {
    if (showComments === false) {
      setShowComments(true);
    } else {
      setShowComments(false);
    }
  };

  return (
    <Modal
      onHide={() => setShowVersionHistory(false)}
      show={true}
      className={"FullScreenModal"}
      fullscreen={true}
      ModalBody={
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <div className={styles["gap-subcomments"]}>
                {/* First */}
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <p className={styles["Parent-title-heading"]}>
                      {t("Version-history")}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div
                      className={styles["version-control-wrapper-with-more"]}
                    >
                      <span className={styles["with-text"]}>V3.0</span>
                    </div>
                    <div className={styles["uploaded-details"]}>
                      <Row>
                        <Col lg={9} md={9} sm={12}>
                          <p className={styles["minutes-text"]}>
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            type a printer took a galley of type a to hold daily
                            check-ins for quicker progress Design phase
                            completed, moving to development, discussed resource
                            reallocation to address delays and decided unknown
                            unknown printer took a galley of type a printer took
                            a galley of type a to update.
                          </p>
                          <Row className="mt-1">
                            {/* {fileAttachments.length > 0
                        ? fileAttachments.map((data, index) => {
                            console.log(data, "datadatadata");
                            return (
                              <> */}
                            <Col lg={3} md={3} sm={3}>
                              <AttachmentViewer
                                // data={data}
                                id={0}
                                name={"DummyFile.pdf"}
                                fk_UID={"1233"}
                                // handleClickRemove={() => handleRemoveFile(data)}
                              />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <AttachmentViewer
                                // data={data}
                                id={0}
                                name={"DummyFile.xls"}
                                fk_UID={"1233"}
                                // handleClickRemove={() => handleRemoveFile(data)}
                              />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <AttachmentViewer
                                // data={data}
                                id={0}
                                name={"DummyFile.doc"}
                                fk_UID={"1233"}
                                // handleClickRemove={() => handleRemoveFile(data)}
                              />
                            </Col>
                            {/* </>
                            );
                          })
                        : null} */}
                          </Row>
                        </Col>
                        <Col
                          lg={3}
                          md={3}
                          sm={12}
                          className="position-relative"
                        >
                          <Row className="m-0">
                            <Col lg={12} md={12} sm={12} className="p-0">
                              <span className={styles["bar-line"]}></span>
                              <p className={styles["uploadedbyuser"]}>
                                Uploaded By
                              </p>
                              <div className={styles["gap-ti"]}>
                                <img
                                  src={DefaultAvatar}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Alex Rodriguez
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row className={`${styles["positioning-tb"]} m-0`}>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["time-uploader"]}>
                                4:00pm, 18th May, 2024
                              </p>
                              <Button
                                text={
                                  showComments
                                    ? t("Hide-comment")
                                    : t("Show-comment")
                                }
                                className={styles["Reject-comment"]}
                                onClick={moreComments}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
                {showComments ? (
                  <Row>
                    <Col lg={12} md={12} sm={12} className="position-relative">
                      <div className={styles["version-control-wrapper"]}>
                        <span></span>
                      </div>
                      <div className={styles["uploaded-details-rejected"]}>
                        <Row>
                          <Col lg={9} md={9} sm={12}>
                            <p className={styles["minutes-text"]}>
                              Task updates: Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to hold daily check-ins for quicker
                              progress Design phase completed, moving to
                              development, discussed resource reallocation to
                              address delays and decided unknown unknown printer
                              took a galley of type a printer took a galley of
                              type a to update.
                            </p>
                          </Col>
                          <Col
                            lg={3}
                            md={3}
                            sm={12}
                            className="position-relative"
                          >
                            <Row className="m-0">
                              <Col lg={12} md={12} sm={12} className="p-0">
                                <span className={styles["bar-line"]}></span>
                                <p className={styles["uploadedbyuser"]}>
                                  Uploaded By
                                </p>
                                <div className={styles["gap-ti"]}>
                                  <img
                                    src={DefaultAvatar}
                                    className={styles["Image"]}
                                    alt=""
                                    draggable={false}
                                  />
                                  <p className={styles["agendaCreater"]}>
                                    Alex Rodriguez
                                  </p>
                                </div>
                              </Col>
                            </Row>
                            <Row className={`${styles["positioning-tb"]} m-0`}>
                              <Col lg={12} md={12} sm={12}>
                                <p className={styles["time-uploader"]}>
                                  4:00pm, 18th May, 2024
                                </p>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </div>
                    </Col>
                  </Row>
                ) : null}

                <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div
                      className={styles["version-control-wrapper-with-more"]}
                    >
                      <span className={styles["with-text"]}>V2.0</span>
                    </div>
                    <div className={styles["uploaded-details"]}>
                      <Row>
                        <Col lg={9} md={9} sm={12}>
                          <p className={styles["minutes-text"]}>
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation to
                            address delays and decided unknown unknown printer
                            took a galley of type a printer took a galley of
                            type a to hold daily check-ins for quicker progress
                            Design phase completed, moving to development,
                            discussed resource reallocation to address delays
                            and decided unknown unknown printer took a galley of
                            type a printer took a galley of type a to hold daily
                            check-ins for quicker progress Design phase
                            completed, moving to development, discussed resource
                            reallocation to address delays and decided unknown
                            unknown printer took a galley of type a printer took
                            a galley of type a to update.
                          </p>
                        </Col>
                        <Col
                          lg={3}
                          md={3}
                          sm={12}
                          className="position-relative"
                        >
                          <Row className="m-0">
                            <Col lg={12} md={12} sm={12} className="p-0">
                              <span className={styles["bar-line"]}></span>
                              <p className={styles["uploadedbyuser"]}>
                                Uploaded By
                              </p>
                              <div className={styles["gap-ti"]}>
                                <img
                                  src={DefaultAvatar}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Alex Rodriguez
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row className={`${styles["positioning-tb"]} m-0`}>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["time-uploader"]}>
                                4:00pm, 18th May, 2024
                              </p>
                              {/* <Button
                                text={t("Hide-comment")}
                                className={styles["Reject-comment"]}
                              /> */}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col lg={12} md={12} sm={12} className="position-relative">
                    <div
                      className={
                        styles["version-control-wrapper-with-more-last"]
                      }
                    >
                      <span className={styles["with-text"]}>V1.0</span>
                    </div>
                    <div className={styles["uploaded-details"]}>
                      <Row>
                        <Col lg={9} md={9} sm={12}>
                          <p className={styles["minutes-text"]}>
                            Task updates: Design phase completed, moving to
                            development, discussed resource reallocation
                          </p>
                        </Col>
                        <Col
                          lg={3}
                          md={3}
                          sm={12}
                          className="position-relative"
                        >
                          <Row className="m-0">
                            <Col lg={12} md={12} sm={12} className="p-0">
                              <span className={styles["bar-line"]}></span>
                              <p className={styles["uploadedbyuser"]}>
                                Uploaded By
                              </p>
                              <div className={styles["gap-ti"]}>
                                <img
                                  src={DefaultAvatar}
                                  className={styles["Image"]}
                                  alt=""
                                  draggable={false}
                                />
                                <p className={styles["agendaCreater"]}>
                                  Alex Rodriguez
                                </p>
                              </div>
                            </Col>
                          </Row>
                          <Row className={`${styles["positioning-tb"]} m-0`}>
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["time-uploader"]}>
                                4:00pm, 18th May, 2024
                              </p>
                              {/* <Button
                                text={t("Hide-comment")}
                                className={styles["Reject-comment"]}
                              /> */}
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </>
      }
    />
  );
};

export default VersionHistory;
