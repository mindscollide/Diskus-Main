import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import PdfIcon from "../../../../../assets/images/pdf_icon.svg";
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
  fileForSend,
  setFileForSend,
  subIndex,
  editorRole,
}) => {
  const handlesubAgendaCrossFiles = (subAgendaFilesIndex, subAgendaFiles) => {
    console.log(subAgendaFiles, "fileDataPropfileDataProp");
    let optionscross = [...rows];

    // Find the correct subAgenda and update its subfiles array
    const updatedOptionsCross = optionscross.map((option) => {
      if (option.subAgenda) {
        option.subAgenda = option.subAgenda.map((subAgenda) => {
          if (subAgenda.subfiles) {
            subAgenda.subfiles = subAgenda.subfiles.filter(
              (file) =>
                file.displayAttachmentName !==
                subAgendaFiles.displayAttachmentName
            );
          }
          return subAgenda;
        });
      }
      return option;
    });

    // Update the state with the modified array
    setRows(updatedOptionsCross);

    // Remove the file from the `fileForSend` state (if needed)
    setFileForSend((prevFiles) =>
      prevFiles.filter(
        (fileSend) => fileSend.name !== subAgendaFiles.displayAttachmentName
      )
    );
  };

  // const handlesubAgendaCrossFiles = (subAgendaFilesIndex) => {
  //   let optionscross = [...rows];
  //   optionscross[index].subAgenda[subIndex].subfiles.splice(
  //     subAgendaFilesIndex,
  //     1
  //   );
  //   setRows(optionscross);
  // };

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
                          key={subAgendaFiles.agendaAttachmentsID}
                          draggableId={`parent-attachments-${parentId}-subAgendaID-${subAgendaData.subAgendaID}-attachments-${subAgendaFiles.agendaAttachmentsID}`}
                          index={subAgendaFilesIndex}
                          isDragDisabled={
                            editorRole.role === "Participant" ||
                            editorRole.role === "Agenda Contributor" ||
                            editorRole.status === "9" ||
                            editorRole.status === 9
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
                                        alt=""
                                        draggable={false}
                                        src={getIconSource(
                                          getFileExtension(
                                            subAgendaFiles.displayAttachmentName
                                          )
                                        )}
                                        height="25.57px"
                                        width="25.57px"
                                      />
                                      <span
                                        className={styles["SubagendaFilesName"]}
                                      >
                                        {subAgendaFiles.displayAttachmentName}
                                      </span>
                                    </Col>
                                    <Col lg={2} md={2} sm={2}>
                                      {editorRole.role === "Participant" ||
                                      editorRole.status === "9" ||
                                      editorRole.status === 9 ? null : (
                                        <img
                                          alt=""
                                          src={redcrossIcon}
                                          height="19px"
                                          width="19px"
                                          className="cursor-pointer"
                                          onClick={() =>
                                            handlesubAgendaCrossFiles(
                                              subAgendaFilesIndex,
                                              subAgendaFiles
                                            )
                                          }
                                        />
                                      )}
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
