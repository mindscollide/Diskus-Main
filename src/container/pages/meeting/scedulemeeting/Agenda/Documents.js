import { Draggable } from "react-beautiful-dnd";
import { Col, Row } from "react-bootstrap";
import styles from "./Agenda.module.css";
import { AttachmentViewer } from "../../../../../components/elements";

const Documents = ({
  data,
  index,
  setRows,
  rows,
  parentId,
  setFileForSend,
  editorRole,
}) => {
  const CrossDocument = (fileDataProp) => {
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

  let currentUserID = Number(localStorage.getItem("userID"));

  return (
    <>
      <Row key={index + 5}>
        <Col lg={12} md={12} sm={12} className={styles["Scroller_document"]}>
          <div className="d-flex gap-2 flex-wrap  mt-2">
            {data?.files?.length > 0
              ? data?.files?.map((filesData, Fileindex) => {
                  return (
                    <Row>
                      <Draggable
                        key={filesData.agendaAttachmentsID}
                        draggableId={`parent-attachments-${parentId}-${filesData.agendaAttachmentsID}`}
                        index={Fileindex}
                        isDragDisabled={
                          editorRole.role === "Participant" ||
                          editorRole.role === "Agenda Contributor"
                            ? true
                            : editorRole.status === 9 ||
                              editorRole.status === "9"
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
                            <Col sm={4} md={4} lg={4}>
                              <AttachmentViewer
                                name={filesData.displayAttachmentName}
                                fk_UID={filesData.fK_UID}
                                id={0}
                                handleClickRemove={
                                  editorRole.role === "Participant" ||
                                  editorRole.status === 9 ||
                                  editorRole.status === "9" ||
                                  (editorRole.role === "Agenda Contributor" &&
                                    (filesData.fK_UID !== currentUserID ||
                                      data.canEdit === false))
                                    ? null
                                    : () => CrossDocument(index, filesData)
                                }
                                data={filesData}
                              />
                            </Col>
                          </div>
                        )}
                      </Draggable>
                    </Row>
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
