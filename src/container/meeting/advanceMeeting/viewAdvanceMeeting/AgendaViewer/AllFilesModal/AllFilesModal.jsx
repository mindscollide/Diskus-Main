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
import {
  DataRoomDownloadFileApiFunc,
  DataRoomDownloadFileWithFooterApiFunc,
} from "../../../../../../store/actions/DataRoom_actions";
import { Col, Row } from "react-bootstrap";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";
import { fileFormatforSignatureFlow } from "../../../../../../commen/functions/utils";
import { useMeetingContext } from "../../../../../../context/MeetingContext";
import DownloadImg from "../../../../../../assets/images/download.png";
import EyeIcon from "../../../../../../assets/images/newElements/eyeIcon.svg";
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
    let data2 = {
      FileID: Number(record.originalAttachmentName),
    };
    if (record.displayAttachmentName?.split(".")[1] === "pdf") {
      dispatch(
        DataRoomDownloadFileWithFooterApiFunc(
          navigate,
          data2,
          t,
          record.displayAttachmentName,
        ),
      );
      return;
    }
    dispatch(
      DataRoomDownloadFileApiFunc(
        navigate,
        data2,
        t,
        record.displayAttachmentName,
      ),
    );
    // let data = {
    //   FileID: Number(record.originalAttachmentName),
    // };
    // dispatch(
    //   DataRoomDownloadFileWithFooterApiFunc(
    //     navigate,
    //     data,
    //     t,
    //     record.displayAttachmentName
    //   )
    // );
  };

  const closeAllFileModal = () => {
    setFileDataAgenda([]);
    setAgendaName("");
    setAgendaIndex(-1);
    setSubAgendaIndex(-1);
    setShowMoreFilesView(false);
  };

  const pdfData = (record, ext) => {
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
            pdfDataJson,
          )}`,
          "_blank",
          "noopener noreferrer",
        );
      } else {
        window.open(
          `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
          "_blank",
          "noopener noreferrer",
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
        contentClassName={"p-3"}
        size='md'
        // className='allFileModalClass'
        ModalTitle={
          <>
            <Row>
              <Col lg={12} md={12} sm={12}>
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
              <Row className='m-0 p-0'>
                {fileDataAgenda?.map((filesData, fileIndex) => {
                  let getfileExtensionName = getFileExtension(
                    filesData?.displayAttachmentName,
                  );
                  return (
                    <Col sm={12} md={12} lg={12} className={styles.FilesList}>
                      <Row>
                        <Col
                          sm={12}
                          md={10}
                          lg={10}
                          className='d-flex align-items-center gap-2'>
                          <span>
                            {" "}
                            <img
                              draggable={false}
                              src={getIconSource(
                                getFileExtension(
                                  filesData?.displayAttachmentName,
                                ),
                              )}
                              alt=''
                              width={28}
                              height={28}
                            />
                          </span>
                          <span className={styles.fileName}>
                            {filesData?.displayAttachmentName}
                          </span>
                        </Col>
                        <Col
                          sm={12}
                          md={2}
                          lg={2}
                          className='d-flex align-items-center gap-3'>
                          <img
                            src={DownloadImg}
                            onClick={() => downloadDocument(filesData)}
                            alt=''
                            width={14}
                            className='cursor-pointer'
                          />{" "}
                          <img
                            width={22}
                            alt=''
                            onClick={() =>
                              pdfData(filesData, getfileExtensionName)
                            }
                            src={EyeIcon}
                            className='cursor-pointer'
                          />
                        </Col>
                      </Row>
                      {/* <AttachmentViewer
                        handleClickDownload={() => downloadDocument(filesData)}
                        data={filesData}
                        name={filesData?.displayAttachmentName}
                        id={Number(filesData.originalAttachmentName)}
                        handleEyeIcon={() =>
                          pdfData(
                            filesData,
                            getFileExtension(filesData?.displayAttachmentName),
                          )
                        }
                      /> */}
                    </Col>
                  );
                })}
              </Row>
              {/* <Row key={Math.random()}>
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
                            getFileExtension(filesData?.displayAttachmentName),
                          )
                        }
                      />
                    </Col>
                  );
                })}
              </Row> */}
            </section>
          </>
        }
        ModalFooter={
          <>
            <Row>
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
