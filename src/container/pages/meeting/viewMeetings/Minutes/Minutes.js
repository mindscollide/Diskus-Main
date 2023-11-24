import React, { useEffect, useState } from "react";
import styles from "./Minutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Notification } from "../../../../../components/elements";
import { Col, Row } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import { useRef } from "react";
import { Upload } from "antd";
import featherupload from "../../../../../assets/images/featherupload.svg";
import Leftploygon from "../../../../../assets/images/Polygon 3.svg";
import UnsavedMinutes from "./UnsavedFileUploadMinutes/UnsavedMinutes";
import file_image from "../../../../../assets/images/file_image.svg";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import Rightploygon from "../../../../../assets/images/Polygon right.svg";
import RedCroseeIcon from "../../../../../assets/images/CrossIcon.svg";
import EditIcon from "../../../../../assets/images/Edit-Icon.png";
import {
  ADDGeneralMinutesApiFunc,
  CleareMessegeNewMeeting,
  DeleteGeneralMinuteDocumentsApiFunc,
  RetriveDocumentsMeetingGenralMinutesApiFunc,
  SaveMinutesDocumentsApiFunc,
  UpdateMinutesGeneralApiFunc,
  GetAllGeneralMinutesApiFunc,
  searchNewUserMeeting,
  showPreviousConfirmationModal,
  showUnsaveMinutesFileUpload,
  uploadDocumentsMeetingMinutesApi,
  showAllGeneralMinutesFailed,
  cleareAllState,
} from "../../../../../store/actions/NewMeetingActions";
import { newTimeFormaterAsPerUTCFullDate } from "../../../../../commen/functions/date_formater";
import AgendaWise from "./AgendaWise/AgendaWise";

const Minutes = ({
  setMinutes,
  setPolls,
  setAttendance,
  // setAgenda,
  setactionsPage,
  setMeetingMaterial,
  editorRole,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setSceduleMeeting,
}) => {
  const [fileSize, setFileSize] = useState(0);
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  console.log(folderID, "folderIDfolderIDfolderIDfolderID");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");
  const { NewMeetingreducer } = useSelector((state) => state);
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const [fileForSend, setFileForSend] = useState([]);
  const [general, setGeneral] = useState(true);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [agenda, setAgenda] = useState(false);
  const [prevFlag, setprevFlag] = useState(6);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [expandedFiles, setExpandedFiles] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [minuteID, setMinuteID] = useState(0);
  const [updateData, setupdateData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [generalShowMore, setGeneralShowMore] = useState(false);
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [addNoteFields, setAddNoteFields] = useState({
    Description: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });

  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let userID = localStorage.getItem("userID");
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
  console.log("fileSizefileSize", fileSize);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: {
      container: [
        {
          size: ["14px", "16px", "18px"],
        },
        { font: ["impact", "courier", "comic", "Montserrat"] },
        { bold: {} },
        { italic: {} },
        { underline: {} },

        { color: [] },
        { background: [] },
        { align: [] },
        { list: "ordered" },
        { list: "bullet" },
      ],
      handlers: {},
    },
  };

  useEffect(() => {
    let Data = {
      MeetingID: advanceMeetingModalID,
    };
    dispatch(
      GetAllGeneralMinutesApiFunc(navigate, t, Data, advanceMeetingModalID)
    );
    return () => {
      setFileAttachments([]);
      dispatch(cleareAllState());
    };
  }, []);

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.generalMinutes !== null &&
        NewMeetingreducer.generalMinutes
      ) {
        if (NewMeetingreducer.generalMinutes.meetingMinutes.length > 0) {
          let newarr = [];
          NewMeetingreducer.generalMinutes.meetingMinutes.map((data, index) => {
            console.log(data, "generalMinutesgeneralMinutes");
            newarr.push(data);
            setMinuteID(data.minuteID);
          });
          setMessages(newarr);
        }
      }
    } catch {}
  }, [NewMeetingreducer.generalMinutes]);

  //onChange function for React Quill
  const onTextChange = (content, delta, source) => {
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText) {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    }
  };

  //Props for File Dragger
  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { status } = data.file;
      let fileSizeArr;
      if (fileAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
      } else if (fileAttachments.length > 0) {
        let flag = false;
        let sizezero;
        let size;
        fileAttachments.map((arData, index) => {
          if (arData.DisplayAttachmentName === data.file.originFileObj.name) {
            flag = true;
          }
        });
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else if (flag === true) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
            fk_UserID: Number(userID),
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
          // dispatch(FileUploadToDo(navigate, data.file.originFileObj, t));
        }
      } else {
        let sizezero;
        let size;
        if (data.file.size > 10485760) {
          size = false;
        } else if (data.file.size === 0) {
          sizezero = false;
        }
        if (size === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            }),
            3000
          );
        } else if (sizezero === false) {
          setTimeout(
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            }),
            3000
          );
        } else {
          let file = {
            DisplayAttachmentName: data.file.name,
            OriginalAttachmentName: data.file.name,
            fileSize: data.file.originFileObj.size,
            fk_UserID: Number(userID),
          };
          setFileAttachments([...fileAttachments, file]);
          fileSizeArr = data.file.originFileObj.size + fileSize;
          setFileForSend([...fileForSend, data.file.originFileObj]);
          setFileSize(fileSizeArr);
        }
      }
    },
    onDrop(e) {},
    customRequest() {},
  };

  //Sliders For Attachments

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  //Edit Button Function
  const handleEditFunc = async (data) => {
    setupdateData(data);
    if (data.minutesDetails !== "") {
      setAddNoteFields({
        Description: {
          value: data.minutesDetails,
          errorMessage: "",
          errorStatus: false,
        },
      });
      setisEdit(true);
    } else {
    }
    let Retrive = {
      FK_MeetingGeneralMinutesID: data.minuteID,
    };
    await dispatch(
      RetriveDocumentsMeetingGenralMinutesApiFunc(navigate, Retrive, t)
    );
    // Ensure data.minutesDetails is not undefined or null before setting the state
  };

  //For getting documents Agains Single Minutes Saved
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.generalMinutesDocument !== undefined &&
        NewMeetingreducer.generalMinutesDocument !== null
      ) {
        let files = [];
        let prevData = [];
        NewMeetingreducer.generalMinutesDocument.data.map((data, index) => {
          files.push({
            DisplayAttachmentName: data.displayFileName,
            fileID: data.pK_FileID,
          });
          prevData.push({
            pK_FileID: data.pK_FileID,
            DisplayAttachmentName: data.displayFileName,
          });
        });
        setFileAttachments(files);
        setPreviousFileIDs(prevData);
      }
    } catch {}
  }, [NewMeetingreducer.generalMinutesDocument]);

  const handleAgendaWiseClick = () => {
    setGeneral(false);
    setAgenda(true);
  };

  const handleGeneralButtonClick = () => {
    setAgenda(false);
    setGeneral(true);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };
  const handleAddClick = async () => {
    let Data = {
      MeetingID: advanceMeetingModalID,
      MinuteText: addNoteFields.Description.value,
    };
    dispatch(
      ADDGeneralMinutesApiFunc(navigate, t, Data, advanceMeetingModalID)
    );
    setFileAttachments([]);
  };

  const documentUploadingFunc = async (minuteID) => {
    let newfile = [...previousFileIDs];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsMeetingMinutesApi(
          navigate,
          t,
          newData,
          folderID,
          newfile
        )
      );
    });

    // Wait for all promises to resolve
    await Promise.all(uploadPromises);

    let docsData = {
      FK_MeetingGeneralMinutesID: minuteID,
      FK_MDID: advanceMeetingModalID,
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    dispatch(
      SaveMinutesDocumentsApiFunc(navigate, docsData, t, advanceMeetingModalID)
    );
    setFileAttachments([]);
    setPreviousFileIDs([]);
    setFileForSend([]);
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
  };
  useEffect(() => {
    if (NewMeetingreducer.addMinuteID !== 0) {
      documentUploadingFunc(NewMeetingreducer.addMinuteID);
    }
  }, [NewMeetingreducer.addMinuteID]);

  const handleRemovingTheMinutes = (MinuteData) => {
    let Data = {
      MDID: advanceMeetingModalID,
      MeetingGeneralMinutesID: MinuteData.minuteID,
    };
    dispatch(
      DeleteGeneralMinuteDocumentsApiFunc(
        navigate,
        Data,
        t,
        advanceMeetingModalID,
        MinuteData
      )
    );
  };

  //UPloading the Documents
  const handleRemoveFile = (data) => {
    setFileForSend((prevFiles) =>
      prevFiles.filter(
        (fileSend) => fileSend.name !== data.DisplayAttachmentName
      )
    );

    setPreviousFileIDs((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );

    setFileAttachments((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );
  };

  const handleResetBtnFunc = () => {
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
    setFileAttachments([]);
    setPreviousFileIDs([]);
  };
  //Updating the text of min
  const handleUpdateFunc = async () => {
    let Data = {
      MinuteID: updateData.minuteID,
      MinuteText: addNoteFields.Description.value,
    };
    dispatch(UpdateMinutesGeneralApiFunc(navigate, Data, t));

    let newfile = [...previousFileIDs];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsMeetingMinutesApi(
          navigate,
          t,
          newData,
          folderID,
          newfile
        )
      );
    });

    // Wait for all promises to resolve
    await Promise.all(uploadPromises);
    let docsData = {
      FK_MeetingGeneralMinutesID: minuteID,
      FK_MDID: advanceMeetingModalID,
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    dispatch(SaveMinutesDocumentsApiFunc(navigate, docsData, t));
    setisEdit(false);
    setFileAttachments([]);
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
  };

  const handleshowMore = (index) => {
    setGeneralShowMore(index);
    setShowMore(!showMore);
  };

  const handleUNsaveChangesModal = () => {
    try {
      const isDescriptionEmpty = addNoteFields.Description.value === "";
      const areFileAttachmentsEmpty = fileAttachments.length === 0;

      if (isDescriptionEmpty && areFileAttachmentsEmpty && isEdit === false) {
        // Your code when both description and file attachments are empty
        setMinutes(false);
        setSceduleMeeting(false);
        setViewAdvanceMeetingModal(false);
        localStorage.removeItem("folderDataRoomMeeting");
        dispatch(showUnsaveMinutesFileUpload(false));

        let searchData = {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(userID),
          PageNumber:
            meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
          PublishedMeetings:
            currentView && Number(currentView) === 1 ? true : false,
        };
        dispatch(searchNewUserMeeting(navigate, searchData, t));
      } else {
        dispatch(showUnsaveMinutesFileUpload(true));
      }
    } catch (error) {}
  };
  const handlePreviousBtn = () => {
    try {
      const isDescriptionEmpty = addNoteFields.Description.value === "";
      const areFileAttachmentsEmpty = fileAttachments.length === 0;

      if (isDescriptionEmpty && areFileAttachmentsEmpty && isEdit === false) {
        // Your code when both description and file attachments are empty
        // setMinutes(false);
        // setSceduleMeeting(false);
        // setViewAdvanceMeetingModal(false);
        dispatch(showUnsaveMinutesFileUpload(false));
        setMinutes(false);
        setMeetingMaterial(true);

        // let searchData = {
        //   Date: "",
        //   Title: "",
        //   HostName: "",
        //   UserID: Number(userID),
        //   PageNumber:
        //     meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        //   Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        //   PublishedMeetings:
        //     currentView && Number(currentView) === 1 ? true : false,
        // };
        // dispatch(searchNewUserMeeting(navigate, searchData, t));
      } else {
        dispatch(showUnsaveMinutesFileUpload(true));
      }
    } catch (error) {}
  };
  const handleNext = () => {
    try {
      const isDescriptionEmpty = addNoteFields.Description.value === "";
      const areFileAttachmentsEmpty = fileAttachments.length === 0;

      if (isDescriptionEmpty && areFileAttachmentsEmpty && isEdit === false) {
        console.log(
          addNoteFields.Description.value,
          "setSceduleMeetingsetSceduleMeeting"
        );

        // Your code when both description and file attachments are empty
        // setMinutes(false);
        // setSceduleMeeting(false);
        // setViewAdvanceMeetingModal(false);
        dispatch(showUnsaveMinutesFileUpload(false));
        setactionsPage(true);
        setMinutes(false);

        // let searchData = {
        //   Date: "",
        //   Title: "",
        //   HostName: "",
        //   UserID: Number(userID),
        //   PageNumber:
        //     meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        //   Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        //   PublishedMeetings:
        //     currentView && Number(currentView) === 1 ? true : false,
        // };
        // dispatch(searchNewUserMeeting(navigate, searchData, t));
      } else {
        dispatch(showUnsaveMinutesFileUpload(true));
      }
    } catch (error) {}
  };

  const handlePreviousButton = () => {
    dispatch(showPreviousConfirmationModal(true));
  };
  console.log(
    NewMeetingreducer.ResponseMessage,
    NewMeetingreducer,
    "ResponseMessage222"
  );
  useEffect(() => {
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("Data-available") &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available") &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: NewMeetingreducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
      }, 3000);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [NewMeetingreducer.ResponseMessage]);

  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex gap-2">
          <Button
            text={t("General")}
            className={styles["Button_General"]}
            onClick={handleGeneralButtonClick}
          />
          <Button
            text={t("Agenda-wise")}
            className={styles["Button_General"]}
            onClick={handleAgendaWiseClick}
          />
        </Col>
      </Row>

      {agenda ? (
        <AgendaWise
          advanceMeetingModalID={advanceMeetingModalID}
          editorRole={editorRole}
        />
      ) : general ? (
        <>
          <Row className="mt-4">
            <Col lg={6} md={6} sm={6}>
              {(editorRole.role === "Organizer" &&
                Number(editorRole.status) === 10) ||
              Number(editorRole.status) === 9 ? (
                <>
                  <Row className={styles["Add-note-QuillRow"]}>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      className={styles["Arabic_font_Applied"]}
                    >
                      <ReactQuill
                        ref={editorRef}
                        theme="snow"
                        value={addNoteFields.Description.value || ""}
                        placeholder={t("Note-details")}
                        onChange={onTextChange}
                        modules={modules}
                        className={styles["quill-height-addNote"]}
                        style={{
                          direction: currentLanguage === "ar" ? "rtl" : "ltr",
                        }}
                      />
                    </Col>
                  </Row>
                  {/* Button For Saving the The Minutes  */}
                  <Row className="mt-5">
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className="d-flex gap-2 justify-content-end"
                    >
                      <Button
                        text={t("Reset")}
                        className={styles["Previous_Button"]}
                        onClick={handleResetBtnFunc}
                      />
                      {isEdit === true ? (
                        <>
                          <Button
                            text={t("Update")}
                            className={styles["Button_General"]}
                            onClick={handleUpdateFunc}
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            text={t("Save")}
                            className={styles["Button_General"]}
                            onClick={handleAddClick}
                          />
                        </>
                      )}
                    </Col>
                  </Row>
                </>
              ) : null}
            </Col>
            <Col lg={6} md={6} sm={6}>
              {fileAttachments.length > 0 ? (
                <>
                  <Row className="mt-1">
                    <Col lg={1} md={1} sm={1} className="mt-4">
                      {fileAttachments.length > 2 ? (
                        <>
                          <Button
                            icon={
                              <img
                                src={Leftploygon}
                                width="20px"
                                height="15px"
                                draggable="false"
                                alt=""
                              />
                            }
                            onClick={SlideLeft}
                            className={styles["Leftpolygon"]}
                          />
                        </>
                      ) : null}
                    </Col>
                    <Col lg={10} md={10} sm={10}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="ScrolllerFiles_Committees"
                          id="Slider"
                        >
                          {fileAttachments.length > 0
                            ? fileAttachments.map((data, index) => {
                                console.log(
                                  data,
                                  "fileAttachmentsfileAttachments"
                                );
                                return (
                                  <>
                                    <Col
                                      lg={4}
                                      md={4}
                                      sm={12}
                                      className="position-relative gap-2"
                                    >
                                      {(editorRole.role === "Organizer" &&
                                        Number(editorRole.status) === 10) ||
                                      Number(editorRole.status) === 9 ? (
                                        <span
                                          className={styles["Crossicon_Class"]}
                                        >
                                          <img
                                            src={CrossIcon}
                                            height="12.68px"
                                            width="12.68px"
                                            onClick={() =>
                                              handleRemoveFile(data)
                                            }
                                            alt=""
                                          />
                                        </span>
                                      ) : null}

                                      <section className={styles["Outer_Box"]}>
                                        <Row>
                                          <Col lg={12} md={12} sm={12}>
                                            <img
                                              src={file_image}
                                              width={"100%"}
                                              alt=""
                                              draggable="false"
                                            />
                                          </Col>
                                        </Row>

                                        <section
                                          className={
                                            styles["backGround_name_Icon"]
                                          }
                                        >
                                          <Row className="mb-2">
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className={
                                                styles["IconTextClass"]
                                              }
                                            >
                                              <img
                                                src={pdfIcon}
                                                height="10px"
                                                width="10px"
                                                className={styles["IconPDF"]}
                                                alt=""
                                              />
                                              <span
                                                className={styles["FileName"]}
                                              >
                                                {data.DisplayAttachmentName}
                                              </span>
                                            </Col>
                                          </Row>
                                        </section>
                                      </section>
                                    </Col>
                                  </>
                                );
                              })
                            : null}
                        </Col>
                      </Row>
                    </Col>
                    <Col lg={1} md={1} sm={1} className="mt-4">
                      {fileAttachments.length > 2 ? (
                        <>
                          <Button
                            icon={
                              <img
                                src={Rightploygon}
                                width="20px"
                                height="15px"
                                draggable="false"
                                alt=""
                              />
                            }
                            onClick={Slideright}
                            className={styles["Leftpolygon"]}
                          />
                        </>
                      ) : null}
                    </Col>
                  </Row>
                </>
              ) : null}
              {(editorRole.role === "Organizer" &&
                Number(editorRole.status) === 10) ||
              Number(editorRole.status) === 9 ? (
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <Dragger
                      {...props}
                      className={
                        styles["dragdrop_attachment_create_resolution"]
                      }
                    >
                      <p className="ant-upload-drag-icon">
                        <span className={styles["create_resolution_dragger"]}>
                          <img
                            src={featherupload}
                            width="18.87px"
                            height="18.87px"
                            draggable="false"
                            alt=""
                          />
                        </span>
                      </p>
                      <p className={styles["ant-upload-text"]}>
                        {t("Drag-&-drop-or")}
                        <span className={styles["Choose_file_style"]}>
                          {t("Choose-file")}
                        </span>
                        <span className={styles["here_text"]}>{t("Here")}</span>
                      </p>
                    </Dragger>
                  </Col>
                </Row>
              ) : null}
            </Col>
          </Row>
          {/* Mapping of The Create Minutes */}
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
              {messages.length > 0
                ? messages.map((data, index) => {
                    console.log("className", data);
                    return (
                      <>
                        <section className={styles["Sizing_Saved_Minutes"]}>
                          <Row className="mt-3">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["Box_Minutes"]}
                            >
                              <Row>
                                <Col lg={8} md={8} sm={8}>
                                  <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12}>
                                      <span className={styles["Title_File"]}>
                                        {expanded ? (
                                          <>
                                            <span
                                              dangerouslySetInnerHTML={{
                                                __html:
                                                  data.minutesDetails.substring(
                                                    0,
                                                    120
                                                  ),
                                              }}
                                            ></span>
                                            ...
                                          </>
                                        ) : (
                                          <span
                                            dangerouslySetInnerHTML={{
                                              __html: data.minutesDetails,
                                            }}
                                          ></span>
                                        )}

                                        <span
                                          className={styles["Show_more_Styles"]}
                                          onClick={toggleExpansion}
                                        >
                                          {!expanded &&
                                          data.minutesDetails.substring(0, 120)
                                            ? t("See-more")
                                            : ""}
                                          {expanded &&
                                          data.minutesDetails.substring(0, 120)
                                            ? t("See-less")
                                            : ""}
                                        </span>
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row>
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={
                                          styles["Date_Minutes_And_time"]
                                        }
                                      >
                                        {newTimeFormaterAsPerUTCFullDate(
                                          data.lastUpdatedDate +
                                            data.lastUpdatedTime
                                        )}
                                      </span>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col lg={4} md={4} sm={4} className="mt-4">
                                  <Row className="d-flex justify-content-end">
                                    <Col lg={2} md={2} sm={2}>
                                      <img
                                        draggable={false}
                                        src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                        height="39px"
                                        width="39px"
                                        className={styles["Profile_minutes"]}
                                        alt=""
                                      />
                                    </Col>
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className={styles["Line_heigh"]}
                                    >
                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <span
                                            className={
                                              styles["Uploaded_heading"]
                                            }
                                          >
                                            {t("Uploaded-by")}
                                          </span>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <span className={styles["Name"]}>
                                            {data.userName}
                                          </span>
                                        </Col>
                                      </Row>
                                    </Col>
                                    {(editorRole.role === "Organizer" &&
                                      Number(editorRole.status) === 10) ||
                                    Number(editorRole.status) === 9 ? (
                                      <Col
                                        lg={3}
                                        md={3}
                                        sm={3}
                                        className="d-flex justify-content-start align-items-center"
                                      >
                                        <img
                                          draggable={false}
                                          src={EditIcon}
                                          height="21.55px"
                                          width="21.55px"
                                          className="cursor-pointer"
                                          onClick={() => handleEditFunc(data)}
                                          alt=""
                                        />
                                      </Col>
                                    ) : null}
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Show_more"]}
                                    onClick={() => handleshowMore(index)}
                                  >
                                    Show more
                                  </span>
                                </Col>
                              </Row>
                              {generalShowMore === index &&
                              showMore === true ? (
                                <>
                                  <Row>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className={styles["DocsScroller"]}
                                    >
                                      <Row className="mt-3">
                                        {data.minutesAttachmets.map(
                                          (filesname, index) => {
                                            console.log(
                                              filesname,
                                              "filesnamefilesname"
                                            );
                                            return (
                                              <>
                                                <Col
                                                  lg={2}
                                                  md={2}
                                                  sm={12}
                                                  className="position-relative gap-2"
                                                >
                                                  <section
                                                    className={
                                                      styles["Outer_Box"]
                                                    }
                                                  >
                                                    <Row>
                                                      <Col
                                                        lg={12}
                                                        md={12}
                                                        sm={12}
                                                      >
                                                        <img
                                                          src={file_image}
                                                          width={"100%"}
                                                          alt=""
                                                          draggable="false"
                                                        />
                                                      </Col>
                                                    </Row>

                                                    <section
                                                      className={
                                                        styles[
                                                          "backGround_name_Icon"
                                                        ]
                                                      }
                                                    >
                                                      <Row className="mb-2">
                                                        <Col
                                                          lg={12}
                                                          md={12}
                                                          sm={12}
                                                          className={
                                                            styles[
                                                              "IconTextClass"
                                                            ]
                                                          }
                                                        >
                                                          <img
                                                            src={pdfIcon}
                                                            height="10px"
                                                            width="10px"
                                                            className={
                                                              styles["IconPDF"]
                                                            }
                                                            alt=""
                                                          />
                                                          <span
                                                            className={
                                                              styles["FileName"]
                                                            }
                                                          >
                                                            {
                                                              data.DisplayAttachmentName
                                                            }
                                                          </span>
                                                        </Col>
                                                      </Row>
                                                    </section>
                                                  </section>
                                                </Col>
                                              </>
                                            );
                                          }
                                        )}
                                        <Col lg={12} md={12} sm={12}></Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </>
                              ) : null}
                              {(editorRole.role === "Organizer" &&
                                Number(editorRole.status) === 10) ||
                              Number(editorRole.status) === 9 ? (
                                <img
                                  draggable={false}
                                  src={RedCroseeIcon}
                                  height="20.76px"
                                  width="20.76px"
                                  className={styles["RedCrossClass"]}
                                  onClick={() => handleRemovingTheMinutes(data)}
                                  alt=""
                                />
                              ) : null}
                            </Col>
                          </Row>
                        </section>
                      </>
                    );
                  })
                : null}
            </Col>
          </Row>
          <Row className="mt-3">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            ></Col>
          </Row>
        </>
      ) : null}
      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-3"
        >
          <Button
            text={t("Cancel")}
            className={styles["Cancel_button_Minutes"]}
            onClick={handleUNsaveChangesModal}
          />
          <Button
            text={t("Previous")}
            className={styles["Save_button_Minutes"]}
            onClick={handlePreviousBtn}
          />
          <Button
            text={t("Next")}
            className={styles["Save_button_Minutes"]}
            onClick={handleNext}
          />
          {/* <Button
            text={t("Cancel")}
            className={styles["Cancel_button_Minutes"]}
            onClick={handleUNsaveChangesModal}
          />
          <Button
            text={t("Next")}
            className={styles["Save_button_Minutes"]}
            onClick={handleNext}
          /> */}
        </Col>
      </Row>

      {NewMeetingreducer.unsaveFileUploadMinutes && (
        <UnsavedMinutes
          setMinutes={setMinutes}
          setSceduleMeeting={setSceduleMeeting}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default Minutes;
