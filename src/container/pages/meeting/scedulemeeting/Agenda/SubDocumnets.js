import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import styles from "./Agenda.module.css";

const SubDocumnets = ({ subAgendaData, parentId }) => {
  return (
    <Row>
      <Col lg={12} md={12} sm={12} className={styles["SubAgendaDocScroller"]}>
        <Row>
          <div className="d-flex gap-2 flex-wrap  mt-2">
            {subAgendaData?.Subfiles?.length > 0
              ? subAgendaData?.Subfiles?.map(
                  (subAgendaFiles, subAgendaFilesIndex) => {
                    return (
                      <>
                        <Draggable
                          key={subAgendaFiles.FileID}
                          draggableId={`parent-attachments-${parentId}-subAgendaID-${subAgendaData.SubAgendaID}-attachments-${subAgendaFiles.FileID}`}
                          index={subAgendaFilesIndex}
                        >
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <Col
                                key={subAgendaFilesIndex}
                                lg={3}
                                md={3}
                                sm={3}
                                className="mt-2"
                              >
                                <section className={styles["cardSubAgenda"]}>
                                  <Row
                                    key={subAgendaFilesIndex}
                                    className="mt-2"
                                  >
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
                                      <span
                                        className={styles["SubagendaFilesName"]}
                                      >
                                        {subAgendaFiles.name}
                                      </span>
                                    </Col>
                                  </Row>
                                </section>
                              </Col>
                            </div>
                          )}
                        </Draggable>
                      </>
                    );
                  }
                )
              : null}
          </div>
          <Col lg={12} md={12} sm={12}></Col>
        </Row>
      </Col>
    </Row>
  );
};

export default SubDocumnets;
