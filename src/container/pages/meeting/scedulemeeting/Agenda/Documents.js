import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";

const Documents = ({ data, index, setRows ,rows }) => {
  const [files, setfiles] = useState([]);
  const handleFilesDrag = (result) => {
    if (!result.destination) return; // Item dropped outside the list

    const { source, destination, draggableId } = result;
    const updatedRows = [...rows];

    const sourceRowIndex = rows.findIndex(
      (row) => row.ID === source.droppableId
    );
    const destinationRowIndex = rows.findIndex(
      (row) => row.ID === destination.droppableId
    );

    // Find the source file and destination file
    const sourceFile = updatedRows[sourceRowIndex].files.find(
      (file) => file.FileID === draggableId
    );
    const destinationFile =
      updatedRows[destinationRowIndex].files[destination.index];

    // Remove the source file from the source files array
    updatedRows[sourceRowIndex].files = updatedRows[
      sourceRowIndex
    ].files.filter((file) => file.FileID !== draggableId);

    // Insert the source file at the destination position
    updatedRows[destinationRowIndex].files.splice(
      destination.index,
      0,
      sourceFile
    );

    setRows(updatedRows);
  };
  const CrossDocument = (index) => {
    let optionscross = [...files];
    optionscross.splice(index, 1);
    setfiles(optionscross);
  };
  return (
    <>
      <Row key={index + 5}>
        <Col lg={12} md={12} sm={12} className={styles["Scroller_document"]}>
          <DragDropContext onDragEnd={handleFilesDrag}>
            <Droppable droppableId={data.ID} type="file" direction="horizontal">
              {(innerProvided) => (
                <div
                  {...innerProvided.droppableProps}
                  ref={innerProvided.innerRef}
                >
                  <div className="d-flex gap-2 flex-wrap  mt-2">
                    {data?.files?.length > 0
                      ? data?.files?.map((filesData, Fileindex) => {
                          return (
                            <>
                              <Draggable
                                key={filesData.FileID}
                                draggableId={filesData.FileID}
                                index={Fileindex}
                              >
                                {(innerProvided) => (
                                  <div
                                    {...innerProvided.draggableProps}
                                    {...innerProvided.dragHandleProps}
                                    ref={innerProvided.innerRef}
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
                                              <img
                                                draggable={false}
                                                src={PdfIcon}
                                              />
                                              <span
                                                className={styles["TitleFile"]}
                                              >
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
                            </>
                          );
                        })
                      : null}
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Col>
      </Row>
    </>
  );
};
export default Documents;
