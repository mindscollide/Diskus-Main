import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";

const Documents = ({ data, index, setRows, rows, parentId }) => {
  const [files, setfiles] = useState([]);

  const CrossDocument = (index) => {
    let optionscross = [...files];
    optionscross.splice(index, 1);
    setfiles(optionscross);
  };
  return (
    <>
      <Row key={index + 5}>
        <Col lg={12} md={12} sm={12} className={styles["Scroller_document"]}>
          <div className="d-flex gap-2 flex-wrap  mt-2">
            {data?.files?.length > 0
              ? data?.files?.map((filesData, Fileindex) => {
                  return (
                    <Draggable
                      key={filesData.FileID}
                      draggableId={`parent-attachments-${parentId}-${filesData.FileID}`}
                      index={Fileindex}
                    >
                      {(provided) => (
                        <div
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          <Row>
                            <Col sm={12} md={12} lg={12}>
                              <span className={styles["card"]}>
                                <Row>
                                  <Col
                                    lg={10}
                                    md={10}
                                    sm={12}
                                    className="d-flex gap-2"
                                  >
                                    <img draggable={false} src={PdfIcon} />
                                    <span className={styles["TitleFile"]}>
                                      {filesData.name}
                                    </span>
                                  </Col>
                                  <Col
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    className="d-flex justify-content-end align-items-center"
                                  >
                                    <img
                                      draggable={false}
                                      src={redcrossIcon}
                                      width="15px"
                                      height="15px"
                                      onClick={() => {
                                        CrossDocument(index);
                                      }}
                                    />
                                  </Col>
                                </Row>
                              </span>
                            </Col>
                          </Row>
                        </div>
                      )}
                    </Draggable>
                  );
                })
              : null}
          </div>
        </Col>
      </Row>
    </>
  );
};
export default Documents;
