import React from "react";
import { Col, Row } from "react-bootstrap";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import styles from "./Agenda.module.css";

const SubDocumnets = ({ subAgendaData }) => {
  return (
    <Row>
      <Col lg={12} md={12} sm={12} className={styles["SubAgendaDocScroller"]}>
        <Row>
          {subAgendaData?.Subfiles?.length > 0
            ? subAgendaData?.Subfiles?.map(
                (subAgendaFiles, subAgendaFilesIndex) => {
                  return (
                    <>
                      <Col
                        key={subAgendaFilesIndex}
                        lg={3}
                        md={3}
                        sm={3}
                        className="mt-2"
                      >
                        <section className={styles["cardSubAgenda"]}>
                          <Row key={subAgendaFilesIndex} className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex gap-2 align-items-center"
                            >
                              <img
                                draggable={false}
                                src={PdfIcon}
                                height="25.57px"
                                width="25.57px"
                              />
                              <span className={styles["SubagendaFilesName"]}>
                                {subAgendaFiles.name}
                              </span>
                            </Col>
                          </Row>
                        </section>
                      </Col>
                    </>
                  );
                }
              )
            : null}
          <Col lg={12} md={12} sm={12}></Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SubDocumnets;
