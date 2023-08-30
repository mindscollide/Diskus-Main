import React, { useState } from "react";
import styles from "./Minutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/elements";
import download from "../../../../../assets/images/Download.svg";
import scratch from "../../../../../assets/images/Scratch.svg";
import AgendaIcon from "../../../../../assets/images/AgendaIcon.svg";
import { Col, Row } from "react-bootstrap";
import ImportMinutesModal from "./ImportPreviousMinutesModal/ImportMinutesModal";
import { showImportPreviousMinutes } from "../../../../../store/actions/NewMeetingActions";
import Clip from "../../../../../assets/images/ClipTurned.svg";
import profile from "../../../../../assets/images/newprofile.png";
import RedCroseeIcon from "../../../../../assets/images/CrossIcon.svg";
const Minutes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);
  const [docsName, setDocsName] = useState([
    {
      name: "teams_Collaboration.PDF",
    },
    {
      name: "teams_Collaboration.PDF",
    },
    {
      name: "teams_Collaboration.PDF",
    },
    {
      name: "teams_Collaboration.PDF",
    },
  ]);
  const handleImportPreviousModal = () => {
    dispatch(showImportPreviousMinutes(true));
  };

  return (
    <section>
      {NewMeetingreducer.afterImportState === true ? (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className={styles["Scroller_Minutes"]}>
              <Row className="mt-3 gap-3">
                {docsName.length > 0
                  ? docsName.map((data, index) => {
                      return (
                        <>
                          <Col
                            lg={6}
                            md={6}
                            sm={6}
                            className={styles["Box_Minutes"]}
                          >
                            <Row>
                              <Col lg={8} md={8} sm={8}>
                                <Row className="mt-3">
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex align-items-center gap-3"
                                  >
                                    <img src={Clip} />
                                    <span className={styles["Title_File"]}>
                                      {data.name}
                                    </span>
                                  </Col>
                                </Row>
                                <Row className="mt-1">
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={
                                        styles["Date_Minutes_And_time"]
                                      }
                                    >
                                      4:00pm, 18th May, 2020
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                              <Col lg={4} md={4} sm={4} className="">
                                <Row className="mt-3">
                                  <Col lg={12} md={12} sm={12}>
                                    <span
                                      className={styles["Uploaded_heading"]}
                                    >
                                      {t("Uploaded-by")}
                                    </span>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex gap-2 align-items-center"
                                  >
                                    <img
                                      src={profile}
                                      height="27px"
                                      width="27px"
                                      className={styles["Profile_minutes"]}
                                    />
                                    <span className={styles["Name"]}>
                                      Saaf Fudda
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <img
                              src={RedCroseeIcon}
                              height="20.76px"
                              width="20.76px"
                              className={styles["RedCrossClass"]}
                            />
                          </Col>
                        </>
                      );
                    })
                  : null}
              </Row>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row className="m-0 p-0 mt-3">
            <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
              <Button
                text={t("Import-previous-minutes")}
                className={styles["Minustes_Buttons_Import"]}
                onClick={handleImportPreviousModal}
              />
            </Col>
          </Row>
          <Row className="d-flex justify-content-center gap-4 mt-5">
            <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["BackGround_Image"]}
                    >
                      <Row>
                        <Col lg={12} md={12} sm={12} className="mt-4">
                          <img
                            src={download}
                            width="91.28px"
                            height="85.94px"
                            className={styles["Download_Icon"]}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Upload")}
                    className={styles["Upload_Btn_Styles"]}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["BackGround_Image"]}
                    >
                      <Row className="mt-4">
                        <Col lg={12} md={12} sm={12}>
                          <img
                            src={scratch}
                            width="107.59px"
                            height="107.59px"
                            className={styles["Scratch_Icon"]}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Create-from-scratch")}
                    className={styles["Upload_Btn_Styles"]}
                  />
                </Col>
              </Row>
            </Col>
            <Col lg={4} md={4} sm={4} className={styles["Box_For_Options"]}>
              <Row className="mt-5">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["BackGround_Image"]}
                    >
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <img
                            src={AgendaIcon}
                            width="85.44px"
                            height="128.68px"
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="d-flex justify-content-center"
                >
                  <Button
                    text={t("Agenda")}
                    className={styles["Upload_Btn_Styles"]}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      )}

      {NewMeetingreducer.ImportPreviousMinutes && <ImportMinutesModal />}
    </section>
  );
};

export default Minutes;
