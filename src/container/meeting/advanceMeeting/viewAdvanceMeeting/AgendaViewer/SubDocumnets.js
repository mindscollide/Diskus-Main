import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";

import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";
import styles from "./Agenda.module.css";

const SubDocumnets = ({
  subAgendaData,
  parentId,
  setRows,
  rows,
  index,
  subIndex,
}) => {
  const handlesubAgendaCrossFiles = (subAgendaFilesIndex) => {
    let optionscross = [...rows];
    optionscross[index].subAgenda[subIndex].subfiles.splice(
      subAgendaFilesIndex,
      1
    );
    setRows(optionscross);
  };
  return (
    <Row>
      <Col lg={12} md={12} sm={12} className={styles["SubAgendaDocScroller"]}>
        <Row>
          <div className="d-flex gap-2 flex-wrap  mt-2">
            {subAgendaData?.subfiles?.length > 0
              ? subAgendaData?.subfiles?.map(
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
                                    className="d-flex mt-2"
                                  >
                                    <Col
                                      lg={10}
                                      md={10}
                                      sm={10}
                                      className="d-flex gap-2 align-items-center"
                                    >
                                      <img
                                        draggable={false}
                                        alt=""
                                        src={getIconSource(
                                          getFileExtension(subAgendaFiles.name)
                                        )}
                                        height="25.57px"
                                        width="25.57px"
                                      />
                                      <span
                                        className={styles["SubagendaFilesName"]}
                                      >
                                        {subAgendaFiles.name}
                                      </span>
                                    </Col>
                                    <Col lg={2} md={2} sm={2}>
                                      <img
                                        src={redcrossIcon}
                                        alt=""
                                        height="19px"
                                        width="19px"
                                        className="cursor-pointer"
                                        onClick={() =>
                                          handlesubAgendaCrossFiles(
                                            subAgendaFilesIndex
                                          )
                                        }
                                      />
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
