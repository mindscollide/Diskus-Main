import React, { useEffect, useState } from "react";
import { Button, Modal, TextField } from "../../components/elements";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "react-bootstrap";
import CustomUpload from "../../components/elements/upload/Upload";
import styles from "./MeetingAttachmentModal.module.css";
import {
  getMeetingAgendas,
  meetingModalAttachment,
  updateAgendaAttachment,
} from "../../store/actions/VideoChat_actions";
import FileIcon, { defaultStyles } from "react-file-icon";
import { XLg, XCircle } from "react-bootstrap-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MeetingAttachmentModal = ({ setShow }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [meetingAgendas, setMeetingAgendas] = useState([]);
  const [agendaAttachments, setAgendaAttachment] = useState([
    {
      pK_MAAID: 0,
      displayAttachmentName: "",
      originalAttachmentName: "",
      creationDate: "",
      fK_MAID: 0,
      creationTime: "",
    },
  ]);
  const dispatch = useDispatch();
  const { VideoChatReducer } = useSelector((state) => state);

  const closeModal = () => {
    dispatch(meetingModalAttachment(false));
  };
  const fileChangeHandler = (data) => {
    let newFile = [];
    const uploadedFile = data.target.files[0];
    newFile.push({
      pK_MAAID: 0,
      displayAttachmentName: uploadedFile.name,
      originalAttachmentName: uploadedFile.name,
      creationDate: "",
      fK_MAID: 0,
      creationTime: "",
    });
    setAgendaAttachment([...agendaAttachments, ...newFile]);
  };

  useEffect(() => {
    let MeetingAgendas = VideoChatReducer.MeetingAgendasResponse;
    let AgendasArr = [];
    let AgendaAttachments = [];
    MeetingAgendas.length > 0 &&
      MeetingAgendas.map((agendaData, index) => {
        AgendasArr.push({
          fK_MDID: agendaData.objMeetingAgenda.fK_MDID,
          pK_MAID: agendaData.objMeetingAgenda.pK_MAID,
          presenterName: agendaData.objMeetingAgenda.presenterName,
          title: agendaData.objMeetingAgenda.title,
          UrLs: agendaData.objMeetingAgenda.urLs,
        });
        setMeetingAgendas([...AgendasArr]);
        if (
          agendaData.meetingAgendaAttachments.length > 0 &&
          agendaData.meetingAgendaAttachments !== null
        ) {
          agendaData.meetingAgendaAttachments.map((data, index) => {
            AgendaAttachments.push({
              pK_MAAID: data.pK_MAAID,
              displayAttachmentName: data.displayAttachmentName,
              originalAttachmentName: data.originalAttachmentName,
              creationDate: data.creationDate,
              fK_MAID: data.fK_MAID,
              creationTime: data.creationTime,
            });
            setAgendaAttachment([...AgendaAttachments]);
          });
        }
      });
  }, [VideoChatReducer.MeetingAgendasResponse]);
  const deleteFilefromAttachments = (index) => {
    if ((agendaAttachments[index] = index)) {
      agendaAttachments[index].displayAttachmentName = "";
      agendaAttachments[index].originalAttachmentName = "";
    }
    setAgendaAttachment([...agendaAttachments]);
  };
  const handleUpdate = (attachmentID) => {
    let updateArr = [];
    agendaAttachments.map((data, index) => {
      updateArr.push({
        AgendaAttachmentsID: data.pK_MAAID,
        DisplayAttachmentName: data.displayAttachmentName,
        OriginalAttachmentName: data.originalAttachmentName,
        FK_MAID: attachmentID,
      });
    });
    dispatch(meetingModalAttachment(false));
    dispatch(updateAgendaAttachment(navigate, updateArr, t));
  };
  useEffect(() => {
    let meetingID = localStorage.getItem("MeetingId");
    let obj = { MeetingID: JSON.parse(meetingID) };
    dispatch(getMeetingAgendas(navigate, obj));
  }, []);

  return (
    <div>
      <Modal
        show={VideoChatReducer.isMeetingAttachmentModal}
        setShow={setShow}
        ModalTitle={
          <>
            <Container>
              <Row className="mt-2">
                <Col sm={12} md={12} lg={12} ModalHeaderCloseBtnStyle="mt-2">
                  <h4 ModalHeaderCloseBtnStyle="text-primary fw-bold text-right">
                    <XLg onClick={closeModal} />
                  </h4>
                </Col>
              </Row>
            </Container>
          </>
        }
        ModalBody={
          <Container>
            <Row>
              <Col sm={12} md={12} lg={12}>
                <h4 className="text-primary fw-bold text-center border-bottom">
                  Agenda
                </h4>
              </Col>
            </Row>
            <Row>
              <Col sm={12} lg={12} md={12}>
                <Row>
                  <Col sm={12} md={12} lg={12}>
                    <div className="agendaList">
                      {meetingAgendas.length > 0
                        ? meetingAgendas.map((data, index) => {
                            return (
                              <div className="margin-top-20" key={data.pK_MAID}>
                                <>
                                  <Row>
                                    <Col lg={1} md={1} xs={12}>
                                      <span className="agendaIndex">
                                        {index + 1}
                                      </span>
                                    </Col>
                                    <Col
                                      lg={5}
                                      md={5}
                                      xs={12}
                                      className="MeetingAgendaView p-0"
                                    >
                                      <p className="agendaTitle">
                                        {data.title}
                                      </p>
                                      <Col
                                        sm={12}
                                        lg={12}
                                        md={12}
                                        className="my-1"
                                      >
                                        <Row>
                                          {agendaAttachments.length > 0 &&
                                          agendaAttachments !== null &&
                                          agendaAttachments.filter(
                                            (data, index) =>
                                              data.displayAttachmentName !== ""
                                          )
                                            ? agendaAttachments.map(
                                                (attachmentData) => {
                                                  var ext =
                                                    attachmentData.displayAttachmentName
                                                      .split(".")
                                                      .pop();
                                                  const first =
                                                    attachmentData.displayAttachmentName.split(
                                                      " "
                                                    )[0];
                                                  if (first !== "") {
                                                    return (
                                                      <>
                                                        <Col
                                                          sm={4}
                                                          className={
                                                            styles["file-icon"]
                                                          }
                                                        >
                                                          {ext === "doc" ? (
                                                            <FileIcon
                                                              extension={"docx"}
                                                              size={78}
                                                              type={"document"}
                                                              labelColor={
                                                                "rgba(44, 88, 152)"
                                                              }
                                                            />
                                                          ) : ext === "docx" ? (
                                                            <FileIcon
                                                              extension={"docx"}
                                                              size={78}
                                                              type={"font"}
                                                              labelColor={
                                                                "rgba(44, 88, 152)"
                                                              }
                                                            />
                                                          ) : ext === "xls" ? (
                                                            <FileIcon
                                                              extension={"xls"}
                                                              type={
                                                                "spreadsheet"
                                                              }
                                                              size={78}
                                                              labelColor={
                                                                "rgba(16, 121, 63)"
                                                              }
                                                            />
                                                          ) : ext === "xlsx" ? (
                                                            <FileIcon
                                                              extension={"xls"}
                                                              type={
                                                                "spreadsheet"
                                                              }
                                                              size={78}
                                                              labelColor={
                                                                "rgba(16, 121, 63)"
                                                              }
                                                            />
                                                          ) : ext === "pdf" ? (
                                                            <FileIcon
                                                              extension={"pdf"}
                                                              size={78}
                                                              {...defaultStyles.pdf}
                                                            />
                                                          ) : ext === "png" ? (
                                                            <FileIcon
                                                              extension={"png"}
                                                              size={78}
                                                              type={"image"}
                                                              labelColor={
                                                                "rgba(102, 102, 224)"
                                                              }
                                                            />
                                                          ) : ext === "txt" ? (
                                                            <FileIcon
                                                              extension={"txt"}
                                                              size={78}
                                                              type={"document"}
                                                              labelColor={
                                                                "rgba(52, 120, 199)"
                                                              }
                                                            />
                                                          ) : ext === "jpg" ? (
                                                            <FileIcon
                                                              extension={"jpg"}
                                                              size={78}
                                                              type={"image"}
                                                              labelColor={
                                                                "rgba(102, 102, 224)"
                                                              }
                                                            />
                                                          ) : ext === "jpeg" ? (
                                                            <FileIcon
                                                              extension={"jpeg"}
                                                              size={78}
                                                              type={"image"}
                                                              labelColor={
                                                                "rgba(102, 102, 224)"
                                                              }
                                                            />
                                                          ) : ext === "gif" ? (
                                                            <FileIcon
                                                              extension={"gif"}
                                                              size={78}
                                                              {...defaultStyles.gif}
                                                            />
                                                          ) : null}
                                                          <span
                                                            className={
                                                              styles[
                                                                "deleteBtn"
                                                              ]
                                                            }
                                                          >
                                                            <XCircle
                                                              onClick={() =>
                                                                deleteFilefromAttachments(
                                                                  attachmentData
                                                                )
                                                              }
                                                            />
                                                          </span>
                                                          <p className="fileUploadLabel">
                                                            {first}
                                                          </p>
                                                        </Col>
                                                      </>
                                                    );
                                                  }
                                                }
                                              )
                                            : null}
                                        </Row>
                                      </Col>
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      xs={12}
                                      className="d-flex align-items-start justify-content-center"
                                    >
                                      <CustomUpload
                                        disable={false}
                                        change={fileChangeHandler}
                                        className="UploadFileButton"
                                      />
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      xs={12}
                                      className="MeetingAgendaPresented MeetingAgendaURL"
                                    >
                                      <TextField
                                        disable={true}
                                        name={"PresenterName"}
                                        value={data.presenterName}
                                        applyClass="form-control2"
                                        type="text"
                                        placeholder={"Presenter"}
                                        label="Presented By"
                                      />
                                      <p className="url">{data.UrLs}</p>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      className="d-flex justify-content-end"
                                    >
                                      <Button
                                        text="Update"
                                        variant="primary"
                                        onClick={() =>
                                          handleUpdate(data.pK_MAID)
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </>
                              </div>
                            );
                          })
                        : null}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        }
      />
    </div>
  );
};

export default MeetingAttachmentModal;
