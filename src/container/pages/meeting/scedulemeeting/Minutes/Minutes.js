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
  showUnsaveMinutesFileUpload,
  uploadDocumentsMeetingMinutesApi,
  cleareMinutsData,
  searchNewUserMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import { newTimeFormaterAsPerUTCFullDate } from "../../../../../commen/functions/date_formater";
import AgendaWise from "./AgendaWise/AgendaWise";
import PreviousModal from "../meetingDetails/PreviousModal/PreviousModal";
import {
  getFileExtension,
  getIconSource,
} from "../../../../DataRoom/SearchFunctionality/option";

const Minutes = ({
  setMinutes,
  currentMeeting,
  setSceduleMeeting,
  setMeetingMaterial,
  setactionsPage,
  setDataroomMapFolderId,
  setEdiorRole,
  editorRole,
}) => {
  // Newly Implemented
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let userID = localStorage.getItem("userID");
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const generalMinutes = useSelector(
    (state) => state.NewMeetingreducer.generalMinutes
  );
  const generalminutesDocumentForMeeting = useSelector(
    (state) => state.NewMeetingreducer.generalminutesDocumentForMeeting
  );
  const ShowPreviousModal = useSelector(
    (state) => state.NewMeetingreducer.ShowPreviousModal
  );
  const unsaveFileUploadMinutes = useSelector(
    (state) => state.NewMeetingreducer.unsaveFileUploadMinutes
  );
  const generalMinutesDocument = useSelector(
    (state) => state.NewMeetingreducer.generalMinutesDocument
  );
  const addMinuteID = useSelector(
    (state) => state.NewMeetingreducer.addMinuteID
  );
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const [useCase, setUseCase] = useState(null);
  const [fileSize, setFileSize] = useState(0);
  const [generalShowMore, setGeneralShowMore] = useState(null);
  const [fileForSend, setFileForSend] = useState([]);
  const [general, setGeneral] = useState(true);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [agenda, setAgenda] = useState(false);
  const [prevFlag, setprevFlag] = useState(6);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [updateData, setupdateData] = useState(null);
  const [showMore, setShowMore] = useState(false);
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
  const [addAgendaWiseFields, setAgendaWiseFields] = useState({
    Description: {
      value: "",
      errorMessage: "",
      errorStatus: false,
    },
  });
  const [addAgendaWiseFiles, setaddAgendaWiseFiles] = useState([]);
  const [agendaOptionvalue, setAgendaOptionValue] = useState({
    label: "",
    value: 0,
  });

  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
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
      MeetingID: Number(currentMeeting),
    };
    dispatch(GetAllGeneralMinutesApiFunc(navigate, t, Data, currentMeeting));
    return () => {
      setMessages([]);
      setFileAttachments([]);
      setPreviousFileIDs([]);
      dispatch(cleareMinutsData());
      setUseCase(null);
    };
  }, []);

  useEffect(() => {
    try {
      if (
        (Object.keys(generalMinutes).length > 0 || generalMinutes.length > 0) &&
        (Object.keys(generalminutesDocumentForMeeting).length > 0 ||
          generalminutesDocumentForMeeting.length > 0)
      ) {
        const minutesData = generalMinutes.meetingMinutes;
        const documentsData = generalminutesDocumentForMeeting.data;
        const combinedData = minutesData.map((item1) => {
          const matchingItem = documentsData.find(
            (item2) => item2.pK_MeetingGeneralMinutesID === item1.minuteID
          );
          if (matchingItem) {
            return {
              ...item1,
              minutesAttachmets: matchingItem.files,
            };
          }
          return item1;
        });
        setMessages(combinedData);
      } else {
        setMessages([]);
      }
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  }, [generalMinutes, generalminutesDocumentForMeeting]);

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
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: "",
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
        fileAttachments.forEach((arData, index) => {
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
    console.log(data, "handleEditFunccalled");
    console.log(data, "dataminutesDetails");
    if (data.minutesDetails !== "") {
      console.log(data, "addNoteFieldsaddNoteFieldsaddNoteFields");
      setAddNoteFields({
        Description: {
          value: data.minutesDetails,
          errorMessage: "",
          errorStatus: false,
        },
      });
      setisEdit(true);
    } else {
      console.log("data.minutesDetails is undefined or null");
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
        generalMinutesDocument !== undefined &&
        generalMinutesDocument !== null &&
        generalMinutesDocument.data.length > 0
      ) {
        let files = [];
        let prevData = [];
        generalMinutesDocument.data.map((data, index) => {
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
      } else {
        setFileAttachments([]);
        setPreviousFileIDs([]);
      }
    } catch {}
  }, [generalMinutesDocument]);

  const handleAgendaWiseClick = () => {
    setGeneral(false);
    setAgenda(true);
  };

  const handleGeneralButtonClick = async () => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    await dispatch(
      GetAllGeneralMinutesApiFunc(navigate, t, Data, currentMeeting)
    );
    setAgenda(false);
    setGeneral(true);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const handleAddClick = async () => {
    let Data = {
      MeetingID: currentMeeting,
      MinuteText: addNoteFields.Description.value,
    };
    dispatch(ADDGeneralMinutesApiFunc(navigate, t, Data, currentMeeting));
  };

  const documentUploadingFunc = async (minuteID) => {
    let newfile = [...previousFileIDs];
    if (Object.keys(fileForSend).length > 0) {
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
        FK_MDID: currentMeeting,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };
      dispatch(
        SaveMinutesDocumentsApiFunc(navigate, docsData, t, currentMeeting)
      );
    } else {
      let Meet = {
        MeetingID: Number(currentMeeting),
      };
      await dispatch(
        GetAllGeneralMinutesApiFunc(navigate, t, Meet, currentMeeting)
      );
    }
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
    if (addMinuteID !== 0) {
      documentUploadingFunc(addMinuteID);
    }
  }, [addMinuteID]);

  const handleRemovingTheMinutes = (MinuteData) => {
    let Data = {
      MDID: currentMeeting,
      MeetingGeneralMinutesID: MinuteData.minuteID,
    };
    dispatch(
      DeleteGeneralMinuteDocumentsApiFunc(
        navigate,
        Data,
        t,
        currentMeeting,
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
    if (Object.keys(fileForSend).length > 0) {
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
        FK_MeetingGeneralMinutesID: updateData.minuteID,
        FK_MDID: currentMeeting,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };
      await dispatch(
        SaveMinutesDocumentsApiFunc(navigate, docsData, t, currentMeeting)
      );
    } else {
      let Meet = {
        MeetingID: Number(currentMeeting),
      };
      await dispatch(
        GetAllGeneralMinutesApiFunc(navigate, t, Meet, currentMeeting)
      );
    }

    setFileAttachments([]);
    setisEdit(false);
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
    if (generalShowMore === index) {
      // If the clicked index is the same as the expanded one, collapse it
      setGeneralShowMore(null);
      setShowMore(false);
    } else {
      // If a different index is clicked, expand the clicked section and collapse the previous one
      setGeneralShowMore(index);
      setShowMore(true);
    }
  };

  // Cancel Button
  const handleUNsaveChangesModal = () => {
    // dispatch(showUnsaveMinutesFileUpload(true));
    let userID = localStorage.getItem("userID");
    let meetingpageRow = localStorage.getItem("MeetingPageRows");
    let meetingPageCurrent = parseInt(
      localStorage.getItem("MeetingPageCurrent")
    );
    let currentView = localStorage.getItem("MeetingCurrentView");
    if (agenda) {
      if (
        addAgendaWiseFields.Description.value.trimStart() !== "" ||
        addAgendaWiseFiles.length !== 0 ||
        agendaOptionvalue.value !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(3);
      } else {
        setFileAttachments([]);
        setMinutes(false);
        setSceduleMeeting(false);
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
      }
    } else if (general) {
      if (
        addNoteFields.Description.value.trimStart() !== "" ||
        fileAttachments.length !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(3);
      } else {
        setFileAttachments([]);
        setMinutes(false);
        setSceduleMeeting(false);
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
      }
    }
  };

  // Pervious Button
  const handlePreviousButton = () => {
    if (agenda) {
      if (
        addAgendaWiseFields.Description.value.trimStart() !== "" ||
        addAgendaWiseFiles.length !== 0 ||
        agendaOptionvalue.value !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(1);
      } else {
        setMinutes(false);
        setMeetingMaterial(true);
      }
    } else if (general) {
      if (
        addNoteFields.Description.value.trimStart() !== "" ||
        fileAttachments.length !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(1);
      } else {
        setMinutes(false);
        setMeetingMaterial(true);
      }
    }
    // setMinutes(false);
    // setMeetingMaterial(true);
    // dispatch(showPreviousConfirmationModal(true));
  };

  const handleNextButton = () => {
    if (agenda) {
      if (
        addAgendaWiseFields.Description.value.trimStart() !== "" ||
        addAgendaWiseFiles.length !== 0 ||
        agendaOptionvalue.value !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(2);
      } else {
        setactionsPage(true);
        setMinutes(false);
      }
    } else if (general) {
      if (
        addNoteFields.Description.value.trimStart() !== "" ||
        fileAttachments.length !== 0
      ) {
        dispatch(showUnsaveMinutesFileUpload(true));
        setUseCase(2);
      } else {
        setactionsPage(true);
        setMinutes(false);
      }
    }

    // dispatch(showPreviousConfirmationModal(true));
  };

  useEffect(() => {
    console.log("ResponseMessageResponseMessage", ResponseMessage);
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== t("Record-found") &&
      ResponseMessage !== t("List-updated-successfully")
    ) {
      console.log("ResponseMessageResponseMessage", ResponseMessage);
      setOpen({
        ...open,
        flag: true,
        message: ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
        dispatch(CleareMessegeNewMeeting());
      }, 3000);
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [ResponseMessage]);

  return (
    <section>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12} className="d-flex gap-2">
          <Button
            text={t("General")}
            className={
              general
                ? styles["Button_General"]
                : styles["Button_General_nonActive"]
            }
            onClick={handleGeneralButtonClick}
          />
          <Button
            text={t("Agenda-wise")}
            className={
              agenda
                ? styles["Button_General"]
                : styles["Button_General_nonActive"]
            }
            onClick={handleAgendaWiseClick}
          />
        </Col>
      </Row>

      {agenda ? (
        <AgendaWise
          currentMeeting={currentMeeting}
          editorRole={editorRole}
          agendaOptionvalue={agendaOptionvalue}
          setAgendaOptionValue={setAgendaOptionValue}
          addNoteFields={addAgendaWiseFields}
          setAddNoteFields={setAgendaWiseFields}
          fileAttachments={addAgendaWiseFiles}
          setFileAttachments={setaddAgendaWiseFiles}
        />
      ) : general ? (
        <>
          {Number(editorRole.status) === 1 ||
          Number(editorRole.status) === 11 ||
          Number(editorRole.status) === 12 ? null : (editorRole.role ===
              "Organizer" &&
              Number(editorRole.status) === 9) ||
            (Number(editorRole.status) === 10 &&
              editorRole.role === "Organizer") ? (
            <Row className="mt-4">
              <Col lg={6} md={6} sm={6}>
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
                                  return (
                                    <>
                                      <Col
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        className="position-relative gap-2"
                                      >
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
                                        <section
                                          className={styles["Outer_Box"]}
                                        >
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
                                                  src={getIconSource(
                                                    getFileExtension(
                                                      data.DisplayAttachmentName
                                                    )
                                                  )}
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
              </Col>
            </Row>
          ) : null}

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
                                          {expanded &&
                                          data.minutesDetails.substring(0, 120)
                                            ? t("See-more")
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
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={3}
                                      className="d-flex justify-content-start align-items-center"
                                    >
                                      {Number(editorRole.status) === 1 ||
                                      Number(editorRole.status) === 11 ||
                                      Number(editorRole.status) ===
                                        12 ? null : (editorRole.role ===
                                          "Organizer" &&
                                          Number(editorRole.status) === 9) ||
                                        (Number(editorRole.status) === 10 &&
                                          editorRole.role === "Organizer") ? (
                                        <img
                                          draggable={false}
                                          src={EditIcon}
                                          height="21.55px"
                                          width="21.55px"
                                          className="cursor-pointer"
                                          onClick={() => handleEditFunc(data)}
                                          alt=""
                                        />
                                      ) : null}
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                              <Row className="mt-2">
                                <Col lg={12} md={12} sm={12}>
                                  <span
                                    className={styles["Show_more"]}
                                    onClick={() => handleshowMore(index)}
                                  >
                                    {generalShowMore === index
                                      ? t("Hide-details")
                                      : t("Show-more")}
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
                                                              filesname.displayFileName
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
                              {Number(editorRole.status) === 1 ||
                              Number(editorRole.status) === 11 ||
                              Number(editorRole.status) ===
                                12 ? null : (editorRole.role === "Organizer" &&
                                  Number(editorRole.status) === 9) ||
                                (Number(editorRole.status) === 10 &&
                                  editorRole.role === "Organizer") ? (
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
            >
              {/* <Button
                text={t("Previous")}
                className={styles["Previous_Button"]}
                onClick={handlePreviousButton}
              />
              <Button
                text={t("Next")}
                onClick={handleNextButton}
                className={styles["Button_General"]}
              /> */}
            </Col>
          </Row>
        </>
      ) : null}
      <Row className="mt-5">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex gap-2 justify-content-end"
        >
          <Button
            text={t("Cancel")}
            className={styles["Cancel_button_Minutes"]}
            onClick={handleUNsaveChangesModal}
          />
          <Button
            text={t("Previous")}
            className={styles["Previous_button_Minutes"]}
            onClick={handlePreviousButton}
            // onClick={handleUNsaveChangesModal}
          />
          <Button
            text={t("Next")}
            className={styles["Next_button_Minutes"]}
            onClick={handleNextButton}
          />
        </Col>
      </Row>

      {unsaveFileUploadMinutes && (
        <UnsavedMinutes
          setMinutes={setMinutes}
          setSceduleMeeting={setSceduleMeeting}
          setFileAttachments={setFileAttachments}
          useCase={useCase}
          setactionsPage={setactionsPage}
          setMeetingMaterial={setMeetingMaterial}
        />
      )}

      {ShowPreviousModal && (
        <PreviousModal
          setMinutes={setMinutes}
          setMeetingMaterial={setMeetingMaterial}
          prevFlag={prevFlag}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default Minutes;
