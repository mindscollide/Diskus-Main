import React from "react";
import styles from "./Minutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../../components/elements";
import download from "../../../../../assets/images/Download.svg";
import scratch from "../../../../../assets/images/Scratch.svg";
import AgendaIcon from "../../../../../assets/images/AgendaIcon.svg";
import { Col, Row } from "react-bootstrap";
const Minutes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <section>
      <Row className="m-0 p-0 mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex justify-content-end">
          <Button
            text={t("Import-previous-minutes")}
            className={styles["Minustes_Buttons_Import"]}
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
                      <img src={AgendaIcon} width="85.44px" height="128.68px" />
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
    </section>
  );
};

export default Minutes;
