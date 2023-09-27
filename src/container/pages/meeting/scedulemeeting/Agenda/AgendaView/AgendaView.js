import React from "react";
import styles from "./AgendaView.module.css";
import { Col, Row } from "react-bootstrap";
import dropmdownblack from "../../../../../../assets/images/whitedown.png";
import blackArrowUpper from "../../../../../../assets/images/whiteupper.png";
const AgendaView = () => {
  return (
    <section>
      <Row className="mt-4">
        <Col lg={12} md={12} sm={12}>
          <section className={styles["SectionViewAgenda"]}>
            <Row>
              <Col
                lg={1}
                md={1}
                sm={1}
                className={styles["Expand_Class_ViewAgenda"]}
              >
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center align-items-center"
                  >
                    <img
                      draggable={false}
                      src={dropmdownblack}
                      width="18.71px"
                      height="9.36px"
                      className={styles["Arrow"]}
                    />
                  </Col>
                </Row>
              </Col>
              <Col lg={11} md={11} sm={11}></Col>
            </Row>
          </section>
        </Col>
      </Row>
    </section>
  );
};

export default AgendaView;
