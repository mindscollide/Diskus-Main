import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import { AttachmentViewer } from "../../../../../components/elements";

const SubDocumnets = ({
  subAgendaData,
  parentId,
  setRows,
  rows,
  setFileForSend,
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

  let currentUserID = Number(localStorage.getItem("userID"));

  return (
    <Row>
      <Col lg={12} md={12} sm={12} className={styles["SubAgendaDocScroller"]}>
        <div className="d-flex gap-2 flex-wrap  mt-2">
          {subAgendaData?.subfiles?.length > 0
            ? subAgendaData?.subfiles?.map(
                (subAgendaFiles, subAgendaFilesIndex) => {
                  return (
                    <>
                      <Row>
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
                                sm={4}
                                md={4}
                                lg={4}
                                key={subAgendaFilesIndex}
                              >
                                <AttachmentViewer
                                  name={subAgendaFiles.displayAttachmentName}
                                  fk_UID={subAgendaFiles.fK_UID}
                                  id={0}
                                  handleClickRemove={
                                    editorRole.role === "Participant" ||
                                    editorRole.status === 9 ||
                                    editorRole.status === "9" ||
                                    (editorRole.role === "Agenda Contributor" &&
                                      (subAgendaFiles.fK_UID !==
                                        currentUserID ||
                                        subAgendaData.canEdit === false))
                                      ? null
                                      : () =>
                                          handlesubAgendaCrossFiles(
                                            subAgendaFilesIndex,
                                            subAgendaFiles
                                          )
                                  }
                                  data={subAgendaFiles}
                                />
                              </Col>
                            </div>
                          )}
                        </Draggable>
                      </Row>
                    </>
                  );
                }
              )
            : null}
        </div>
        <Col lg={12} md={12} sm={12}></Col>
      </Col>
    </Row>
  );
};

export default SubDocumnets;
