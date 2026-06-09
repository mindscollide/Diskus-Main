import React from "react";
import {
  Modal,
  Button,
  AttachmentViewer,
} from "../../../../../../components/elements";
import styles from "./AllFilesModal.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { DataRoomDownloadFileApiFunc } from "../../../../../../store/actions/DataRoom_actions";
import { Col, Row } from "react-bootstrap";
import { getFileExtension } from "../../../../../DataRoom/SearchFunctionality/option";
import { fileFormatforSignatureFlow } from "../../../../../../commen/functions/utils";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

const AllFilesModal = ({
  setShowMoreFilesView,
  agendaName,
  fileDataAgenda,
  agendaIndex,
  subAgendaIndex,
  setFileDataAgenda,
  setAgendaName,
  setAgendaIndex,
  setSubAgendaIndex,
}) => {
  const navigate = useNavigate();
  const { editorRole } = useMeetingContext();

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const downloadDocument = (record) => {
    let data = {
      FileID: Number(record.originalAttachmentName),
    };
    dispatch(
      DataRoomDownloadFileApiFunc(
        navigate,
        data,
        t,
        record.displayAttachmentName
      )
    );
  };

  const closeAllFileModal = () => {
    setFileDataAgenda([]);
    setAgendaName("");
    setAgendaIndex(-1);
    setSubAgendaIndex(-1);
    setShowMoreFilesView(false);
  };

  const pdfData = (record, ext) => {
    console.log("PDFDATAPDFDATA", record);
    let Data = {
      taskId: Number(record.originalAttachmentName),
      commingFrom: 4,
      fileName: record.displayAttachmentName,
      attachmentID: Number(record.originalAttachmentName),
    };
    let pdfDataJson = JSON.stringify(Data);
    if (fileFormatforSignatureFlow.includes(ext)) {
      if (Number(editorRole.status) === 10) {
        window.open(
          `/Diskus/meetingDocumentViewer?pdfData=${encodeURIComponent(
            pdfDataJson
          )}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        window.open(
          `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
          "_blank",
          "noopener noreferrer"
        );
      }
    }
    // if (fileFormatforSignatureFlow.includes(ext)) {
    //   window.open(
    //     `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
    //     "_blank",
    //     "noopener noreferrer"
    //   );
    // }
  };

  return (
    <section>
      <Modal
        show={true}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setShowMoreFilesView(false)}
        size='md'
        className='allFileModalClass'
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["OVer_padding"]}>
                <p className={styles["FileModalTitle"]}>
                  {agendaIndex !== -1 && subAgendaIndex === -1
                    ? agendaIndex + 1 + ". " + agendaName
                    : agendaIndex !== -1 && subAgendaIndex !== -1
                    ? agendaIndex +
                      1 +
                      "." +
                      (subAgendaIndex + 1) +
                      ". " +
                      agendaName
                    : null}
                </p>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <section className={styles["FileSectionHeight"]}>
              <Row key={Math.random()}>
                {fileDataAgenda?.map((filesData, fileIndex) => {
                  return (
                    <Col lg={4} md={4} sm={4}>
                      <AttachmentViewer
                        handleClickDownload={() => downloadDocument(filesData)}
                        data={filesData}
                        name={filesData?.displayAttachmentName}
                        id={Number(filesData.originalAttachmentName)}
                        handleEyeIcon={() =>
                          pdfData(
                            filesData,
                            getFileExtension(filesData?.displayAttachmentName)
                          )
                        }
                      />
                    </Col>
                  );
                })}
              </Row>
            </section>
          </>
        }
        ModalFooter={
          <>
            <Row className='mt-4'>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end gap-2'>
                <Button
                  onClick={closeAllFileModal}
                  text={t("Close")}
                  className={styles["Cancel_Vote_Modal"]}
                />
              </Col>
            </Row>
          </>
        }
      />
    </section>
  );
};

export default AllFilesModal;
