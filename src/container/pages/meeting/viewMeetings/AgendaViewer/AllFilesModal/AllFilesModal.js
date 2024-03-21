import React, { useState } from "react";
import { Modal, Button } from "../../../../../../components/elements";
import styles from "./AllFilesModal.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { DataRoomDownloadFileApiFunc } from "../../../../../../store/actions/DataRoom_actions";
import { Col, Row } from "react-bootstrap";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";
import DownloadIcon from "./../AV-Images/Frame_Download.png";

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

  const dispatch = useDispatch();

  const { t } = useTranslation();

  const downloadDocument = (record) => {
    console.log("filesDatafilesData", record);

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
    if (
      ext === "pdf" ||
      ext === "doc" ||
      ext === "docx" ||
      ext === "xlx" ||
      ext === "xlxs"
    ) {
      window.open(
        `/#/DisKus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
    // else {
    //   let data = {
    //     FileID: Number(record.originalAttachmentName),
    //   };
    //   dispatch(
    //     DataRoomDownloadFileApiFunc(
    //       navigate,
    //       data,
    //       t,
    //       record.displayAttachmentName
    //     )
    //   );
    // }
  };

  console.log("File Data", agendaName, fileDataAgenda);

  return (
    <section>
      <Modal
        show={true}
        // setShow={dispatch(showVoteAgendaModal)}
        modalFooterClassName={"d-block"}
        modalHeaderClassName={"d-block"}
        onHide={() => setShowMoreFilesView(false)}
        size="md"
        className="allFileModalClass"
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
            <Row key={Math.random()}>
              <Col lg={2} md={2} sm={12}></Col>
              <Col
                lg={8}
                md={8}
                sm={12}
                className={styles["FileSectionHeight"]}
              >
                {fileDataAgenda?.map((filesData, fileIndex) => (
                  <div
                    onClick={() => downloadDocument(filesData)}
                    className={styles["allFileUI"]}
                  >
                    <Row className="m-0 text-center align-items-center">
                      <Col
                        lg={10}
                        md={10}
                        sm={12}
                        className="d-flex align-items-center justify-content-start p-0"
                      >
                        <div className={styles["fileNameTruncateStyle"]}>
                          <img
                            draggable={false}
                            src={getIconSource(
                              getFileExtension(filesData?.displayAttachmentName)
                            )}
                            alt=""
                            width={25}
                          />
                          <span
                            onClick={() =>
                              pdfData(
                                filesData,
                                getFileExtension(
                                  filesData?.displayAttachmentName
                                )
                              )
                            }
                            className={
                              ["pdf", "doc", "docx", "xls", "xlsx"].includes(
                                getFileExtension(
                                  filesData?.displayAttachmentName
                                )
                              )
                                ? styles["fileNameAttachment"]
                                : styles["fileNameAttachmentNotOpened"]
                            }
                          >
                            {filesData?.displayAttachmentName}
                          </span>
                        </div>
                      </Col>
                      <Col lg={2} md={2} sm={12} className="p-0">
                        <img
                          onClick={() => downloadDocument(filesData)}
                          draggable={false}
                          src={DownloadIcon}
                          alt=""
                        />
                      </Col>
                    </Row>
                  </div>
                ))}
              </Col>
              <Col lg={2} md={2} sm={12}></Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
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
