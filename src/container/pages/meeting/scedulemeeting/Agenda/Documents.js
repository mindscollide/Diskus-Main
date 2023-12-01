import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
import redcrossIcon from "../../../../../assets/images/Artboard 9.png";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";

const Documents = ({
  data,
  index,
  setRows,
  rows,
  parentId,
  setFileForSend,
  fileForSend,
  editorRole,
}) => {
  const [files, setfiles] = useState([]);

  const CrossDocument = (fileIndex, fileDataProp) => {
    console.log(fileDataProp, "fileDataPropfileDataProp");
    let optionscross = [...rows];
    const updatedOptionsCross = optionscross.map((option) => {
      if (option.files) {
        option.files = option.files.filter(
          (file) =>
            file.displayAttachmentName !== fileDataProp.displayAttachmentName
        );
      }
      return option;
    });
    setRows(updatedOptionsCross);
    setFileForSend((prevFiles) =>
      prevFiles.filter(
        (fileSend) => fileSend.name !== fileDataProp.displayAttachmentName
      )
    );
  };

  console.log("fileDataPropfileDataProp", fileForSend);

  return (
    <>
      <Row key={index + 5}>
        <Col lg={12} md={12} sm={12} className={styles["Scroller_document"]}>
          <div className="d-flex gap-2 flex-wrap  mt-2">
            {data?.files?.length > 0
              ? data?.files?.map((filesData, Fileindex) => {
                  return (
                    <Draggable
                      key={filesData.agendaAttachmentsID}
                      draggableId={`parent-attachments-${parentId}-${filesData.agendaAttachmentsID}`}
                      index={Fileindex}
                      isDragDisabled={
                        editorRole.role === "Participant" ||
                        editorRole.role === "Agenda Contributor"
                          ? true
                          : false
                      }
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
                                    <img
                                      draggable={false}
                                      src={getIconSource(
                                        getFileExtension(
                                          filesData.displayAttachmentName
                                        )
                                      )}
                                      alt=""
                                    />
                                    <span className={styles["TitleFile"]}>
                                      {filesData.displayAttachmentName}
                                    </span>
                                  </Col>
                                  <Col
                                    lg={2}
                                    md={2}
                                    sm={12}
                                    className="d-flex justify-content-end align-items-center"
                                  >
                                    {editorRole.role ===
                                    "Participant" ? null : (
                                      <img
                                        draggable={false}
                                        src={redcrossIcon}
                                        width="15px"
                                        height="15px"
                                        className="cursor-pointer"
                                        onClick={() => {
                                          CrossDocument(index, filesData);
                                        }}
                                        alt=""
                                      />
                                    )}
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
