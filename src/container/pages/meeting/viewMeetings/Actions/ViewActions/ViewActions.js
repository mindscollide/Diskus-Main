import React from "react";
import styles from "./ViewActions.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import RedCrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import PDFIcon from "../../../../../../assets/images/pdf_icon.svg";

const ViewActions = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { NewMeetingreducer } = useSelector((state) => state);

  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Heading_View"]}>
            Implement a Knowledge Sharing InitiativeImplement
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <p className={styles["Details"]}>
            Initiate a comprehensive knowledge sharing initiative within the
            office to enhance collaboration, improve efficiency, and foster a
            culture of continuous learning. This action involves creating a
            structured plan to facilitate the exchange of information, ideas,
            and best practices among team members.
          </p>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <span lg={12} md={12} sm={12} className={styles["Meeting_Styles"]}>
            {t("Meeing")}
          </span>
        </Col>
      </Row>
      <Row className="mt-1">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Meeting-Details"]}>
            IT Departmental Meeting lorem. Aenean posuere libero vel ipsum.
          </span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col lg={4} md={4} sm={4}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span
                lg={12}
                md={12}
                sm={12}
                className={styles["Meeting_Styles"]}
              >
                {t("Assignd-to")}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Partipant_name"]}>Jackson Parker</span>
            </Col>
          </Row>
        </Col>
        <Col lg={4} md={4} sm={4}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span
                lg={12}
                md={12}
                sm={12}
                className={styles["Meeting_Styles"]}
              >
                {t("Agenda")}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Partipant_name"]}>Introduction</span>
            </Col>
          </Row>
        </Col>
        <Col lg={4} md={4} sm={4}>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span
                lg={12}
                md={12}
                sm={12}
                className={styles["Meeting_Styles"]}
              >
                {t("Due-date")}
              </span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Partipant_name"]}>25 March 2023</span>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <section className={styles["box_For_File"]}>
            <Row>
              <Col lg={12} md={12} sm={12}>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-2 align-items-center"
                  >
                    <img
                      draggable={false}
                      src={PDFIcon}
                      height="31.57px"
                      width="31.57px"
                    />
                    <span className={styles["FileName"]}>
                      Meetings Agenda.pdf
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </section>
        </Col>
      </Row>
    </section>
  );
};

export default ViewActions;
