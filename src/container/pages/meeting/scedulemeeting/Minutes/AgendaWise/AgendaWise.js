import React, { useEffect, useState } from "react";
import styles from "./AgendaWise.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PlusExpand from "../../../../../../assets/images/Plus-notesExpand.svg";
import MinusExpand from "../../../../../../assets/images/close-accordion.svg";
import { useDispatch } from "react-redux";
import { Button, Notification } from "../../../../../../components/elements";
import { Accordion, AccordionSummary } from "@material-ui/core";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import { useRef } from "react";
import { Upload } from "antd";
import featherupload from "../../../../../../assets/images/featherupload.svg";
import ReactQuill, { Quill } from "react-quill";
import Leftploygon from "../../../../../../assets/images/Polygon 3.svg";
import file_image from "../../../../../../assets/images/file_image.svg";
import { AccordionDetails } from "@mui/material";
import CrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import Rightploygon from "../../../../../../assets/images/Polygon right.svg";
import RedCroseeIcon from "../../../../../../assets/images/CrossIcon.svg";
import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { useSelector } from "react-redux";
import { newTimeFormaterAsPerUTCFullDate } from "../../../../../../commen/functions/date_formater";

import {
  AddAgendaWiseMinutesApiFunc,
  AgendaWiseRetriveDocumentsMeetingMinutesApiFunc,
  CleareMessegeNewMeeting,
  DeleteAgendaWiseMinutesDocumentsApiFunc,
  SaveAgendaWiseDocumentsApiFunc,
  UpdateAgendaWiseMinutesApiFunc,
  uploadDocumentsMeetingAgendaWiseMinutesApi,
} from "../../../../../../store/actions/NewMeetingActions";
import { GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes } from "../../../../../../store/actions/AgendaWiseAgendaAction";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";

const AgendaWise = ({
  currentMeeting,
  editorRole,
  agendaOptionvalue,
  setAgendaOptionValue,
  addAgendaWiseFields,
  setAgendaWiseFields,
  fileAttachments,
  setFileAttachments,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [isEdit, setisEdit] = useState(false);
  const [organizerID, setOrganizerID] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { NewMeetingreducer, AgendaWiseAgendaListReducer } = useSelector(
    (state) => state
  );

  // const ResponseMessage = useSelector(
  //   (state) => state.NewMeetingreducer.ResponseMessage
  // );

  console.log(NewMeetingreducer.ResponseMessage, "editorRefeditorRefeditorRef");
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const [fileForSend, setFileForSend] = useState([]);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  // const [fileAttachments, setFileAttachments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [updateData, setupdateData] = useState(null);
  const [agendaOptions, setAgendaOptions] = useState([]);
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  const [showMore, setShowMore] = useState(false);
  // const [agendaOptionvalue, setAgendaOptionValue] = useState({
  //   label: "",
  //   value: 0,
  // });
  const [agendaID, setAgendaID] = useState([]);
  const [agendaSelect, setAgendaSelect] = useState({
    agendaSelectOptions: {
      id: 0,
      title: "",
    },
  });

  useEffect(() => {
    let Data = {
      MeetingID: currentMeeting,
    };
    dispatch(
      GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes(
        Data,
        navigate,
        t,
        currentMeeting
      )
    );
  }, []);

  useEffect(() => {
    try {
      if (
        AgendaWiseAgendaListReducer.AllAgendas !== null &&
        AgendaWiseAgendaListReducer.AllAgendas !== undefined
      ) {
        let NewData = [];
        console.log(
          AgendaWiseAgendaListReducer.AllAgendas,
          "agendaListagendaList"
        );
        AgendaWiseAgendaListReducer.AllAgendas.agendaList.map(
          (agenda, index) => {
            console.log(agenda, "agendaListagendaList");
            NewData.push({
              value: agenda.id,
              label: agenda.title,
            });

            agenda.subAgenda.map((subajendaData, index) => {
              NewData.push({
                value: subajendaData.subAgendaID,
                label: subajendaData.subTitle,
              });
            });
          }
        );
        setAgendaOptions(NewData);
        setAgendaID(NewData);
      }
    } catch {}
  }, [AgendaWiseAgendaListReducer.AllAgendas]);

  // Combined Data for both Documents and Minutes Agenda Wise
  useEffect(() => {
    try {
      if (
        NewMeetingreducer.agendaWiseMinutesReducer !== null &&
        NewMeetingreducer.agendaWiseMinutesReducer &&
        NewMeetingreducer.getallDocumentsForAgendaWiseMinutes !== null &&
        NewMeetingreducer.getallDocumentsForAgendaWiseMinutes !== undefined
      ) {
        console.log(
          NewMeetingreducer.agendaWiseMinutesReducer.organizerID,
          "NewMeetingreducerNewMeetingreducer"
        );

        const minutesData =
          NewMeetingreducer.agendaWiseMinutesReducer.agendaWiseMinutes;

        const documentsData =
          NewMeetingreducer.getallDocumentsForAgendaWiseMinutes.data;
        setOrganizerID(NewMeetingreducer.agendaWiseMinutesReducer.organizerID);
        const combinedData = minutesData.map((item1) => {
          const matchingItem = documentsData.find(
            (item2) => item2.pK_MeetingAgendaMinutesID === item1.minuteID
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
  }, [
    NewMeetingreducer.agendaWiseMinutesReducer,
    NewMeetingreducer.getallDocumentsForAgendaWiseMinutes,
  ]);

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

  const toggleExpansion = () => {
    setExpanded(!expanded);
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

  const onTextChange = (content, delta, source) => {
    const plainText = content.replace(/(<([^>]+)>)/gi, "");
    if (source === "user" && plainText) {
      setAgendaWiseFields({
        ...addAgendaWiseFields,
        Description: {
          value: content,
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      // setAgendaWiseFields({
      //   ...addAgendaWiseFields,
      //   Description: {
      //     value: "",
      //     errorMessage: "",
      //     errorStatus: false,
      //   },
      // });
    }
  };

  const handleAgendaSelect = (selectoptions) => {
    setAgendaSelect({
      ...agendaSelect,
      agendaSelectOptions: {
        id: selectoptions.value,
        title: selectoptions.label,
      },
    });
    setAgendaOptionValue({
      label: selectoptions.label,
      value: selectoptions.value,
    });
  };

  const handleAddClickAgendaWise = async () => {
    if (agendaSelect.agendaSelectOptions.id === 0) {
      setOpen({
        flag: true,
        message: t("Select-agenda"),
      });
      return;
    }

    if (addAgendaWiseFields.Description.value !== "") {
      let Data = {
        AgendaID: agendaSelect.agendaSelectOptions.id,
        MinuteText: addAgendaWiseFields.Description.value,
      };
      dispatch(AddAgendaWiseMinutesApiFunc(navigate, Data, t));
      setAgendaOptionValue({
        value: 0,
        label: "",
      });
    } else {
      setAgendaWiseFields({
        ...addAgendaWiseFields,
        Description: {
          value: addAgendaWiseFields.Description.value,
          errorMessage:
            addAgendaWiseFields.Description.value === ""
              ? t("Minutes-text-is-required")
              : addAgendaWiseFields.Description.errorMessage,
          errorStatus:
            addAgendaWiseFields.Description.value === ""
              ? true
              : addAgendaWiseFields.Description.errorStatus,
        },
      });
      setOpen({
        flag: true,
        message: t("Select-agenda"),
      });
    }
  };

  const documentUploadingFunc = async (minuteID) => {
    let newfile = [...previousFileIDs];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsMeetingAgendaWiseMinutesApi(
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
      FK_MeetingAgendaMinutesID: minuteID,
      FK_MDID: currentMeeting,
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    dispatch(
      SaveAgendaWiseDocumentsApiFunc(navigate, docsData, t, currentMeeting)
    );

    setFileAttachments([]);
    setPreviousFileIDs([]);
    setFileForSend([]);
    setAgendaWiseFields({
      ...addAgendaWiseFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
    setAgendaOptionValue({
      label: "",
      value: 0,
    });
  };
  // For getting the MinuteID
  useEffect(() => {
    if (NewMeetingreducer.agendaWiseMinuteID !== 0) {
      console.log(
        NewMeetingreducer.agendaWiseMinuteID,
        "agendaWiseMinuteIDagendaWiseMinuteID"
      );
      documentUploadingFunc(NewMeetingreducer.agendaWiseMinuteID);
    }
  }, [NewMeetingreducer.agendaWiseMinuteID]);

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
    console.log(addAgendaWiseFields, "addNoteFieldsaddNoteFieldsaddNoteFields");
    setAgendaWiseFields({
      ...addAgendaWiseFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
    setFileAttachments([]);
    setPreviousFileIDs([]);
    setAgendaOptionValue({
      label: "",
      value: 0,
    });
  };

  //handle Edit functionality

  const handleEditFunc = async (data) => {
    setupdateData(data.minuteID);
    let Data = {
      FK_MeetingAgendaMinutesID: data.minuteID,
    };
    await dispatch(
      AgendaWiseRetriveDocumentsMeetingMinutesApiFunc(navigate, Data, t)
    );
    console.log(data, "setAddNoteFieldssetAddNoteFields");
    if (data.minutesDetails !== undefined && data.minutesDetails !== null) {
      let findOptionValue = agendaOptions.filter(
        (agendaOption, index) => agendaOption.label === data.agendaTitle
      );
      console.log(data.minutesDetails, "setAddNoteFieldssetAddNoteFields");
      setAgendaWiseFields({
        Description: {
          value: data.minutesDetails,
          errorMessage: "",
          errorStatus: false,
        },
      });
      setAgendaSelect({
        ...agendaSelect,
        agendaSelectOptions: {
          id: findOptionValue.value,
          title: data.agendaTitle,
        },
      });
      setAgendaOptionValue({
        label: data.agendaTitle,
        value: findOptionValue.value,
      });
      setisEdit(true);
    } else {
      console.log("data.minutesDetails is undefined or null");
    }
  };

  console.log(addAgendaWiseFields, "addNoteFieldsaddNoteFields");

  useEffect(() => {
    try {
      if (
        NewMeetingreducer.RetriveAgendaWiseDocuments !== null &&
        NewMeetingreducer.RetriveAgendaWiseDocuments !== undefined &&
        NewMeetingreducer.RetriveAgendaWiseDocuments.data.length > 0
      ) {
        console.log(
          NewMeetingreducer.RetriveAgendaWiseDocuments,
          "RetriveAgendaWiseDocuments"
        );

        let files = [];
        let prevData = [];
        NewMeetingreducer.RetriveAgendaWiseDocuments.data.map((data, index) => {
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
  }, [NewMeetingreducer.RetriveAgendaWiseDocuments]);

  const handleUpdateFuncagendaWise = async () => {
    let UpdateDataAgendaWise = {
      MinuteID: updateData.minuteID,
      MinuteText: addAgendaWiseFields.Description.value,
    };
    dispatch(UpdateAgendaWiseMinutesApiFunc(navigate, UpdateDataAgendaWise, t));

    let newfile = [...previousFileIDs];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsMeetingAgendaWiseMinutesApi(
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
    console.log(messages, "messagesmessages");
    console.log(currentMeeting, "messagesmessages");

    console.log(newfile, "messagesmessages");

    let docsData = {
      FK_MeetingAgendaMinutesID: updateData.minuteID,
      FK_MDID: currentMeeting,
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    console.log(docsData, "messagesmessages");
    dispatch(
      SaveAgendaWiseDocumentsApiFunc(navigate, docsData, t, currentMeeting)
    );

    setAgendaOptionValue({
      label: "",
      value: 0,
    });
    setAgendaWiseFields({
      ...addAgendaWiseFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });
    setFileAttachments([]);
    setisEdit(false);
  };

  const handleRemovingTheMinutesAgendaWise = (AgendaWiseData) => {
    console.log(AgendaWiseData, "AgendaWiseDataAgendaWiseData");

    let Data = {
      MDID: currentMeeting,
      MeetingAgendaMinutesID: AgendaWiseData.minuteID,
    };

    dispatch(
      DeleteAgendaWiseMinutesDocumentsApiFunc(
        navigate,
        Data,
        t,
        currentMeeting,
        AgendaWiseData,
        agendaSelect.agendaSelectOptions.id
      )
    );
    setAgendaWiseFields({
      ...addAgendaWiseFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });

    setFileAttachments([]);
    // setAgendaOptions([]);
  };

  //Expanding and collapsing function

  const handleshowMore = (index) => {
    if (showMoreIndex === index && showMore) {
      // If the clicked index is the same as the expanded one, collapse it
      setShowMoreIndex(null);
      setShowMore(false);
    } else {
      // If a different index is clicked or it's not expanded, expand the clicked section
      setShowMoreIndex(index);
      setShowMore(true);
    }
  };

  useEffect(() => {
    console.log(
      "ResponseMessageResponseMessage",
      NewMeetingreducer.ResponseMessage
    );
    if (
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-records-found") &&
      NewMeetingreducer.ResponseMessage !== t("Record-found") &&
      NewMeetingreducer.ResponseMessage !== t("List-updated-successfully")
    ) {
      console.log(
        "ResponseMessageResponseMessage",
        NewMeetingreducer.ResponseMessage
      );
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

  const [accordianExpand, setAccordianExpand] = useState(false);

  const toggleAcordion = (agendaID) => {
    console.log(agendaID, "notesIDnotesIDnotesID");
    // setExpanded((prev) => (prev === notesID ? true : false));
    if (accordianExpand === agendaID) {
      setAccordianExpand(false);
    } else {
      setAccordianExpand(agendaID);
    }
    // setExpand(!isExpand);
  };

  return (
    <section>
      {Number(editorRole.status) === 1 ||
      Number(editorRole.status) === 11 ||
      Number(editorRole.status) === 12 ? null : (editorRole.role ===
          "Organizer" &&
          Number(editorRole.status) === 9) ||
        (Number(editorRole.status) === 10 &&
          editorRole.role === "Organizer") ? (
        <>
          {" "}
          <Row className="mt-4">
            <Col lg={6} md={6} sm={6}>
              <Select
                options={agendaOptions}
                value={{
                  value: agendaOptionvalue.value,
                  label: agendaOptionvalue.label,
                }}
                onChange={handleAgendaSelect}
                isSearchable={false}
              />
            </Col>
          </Row>
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
                    value={addAgendaWiseFields.Description.value || ""}
                    placeholder={t("Minutes-details")}
                    onChange={onTextChange}
                    modules={modules}
                    className={styles["quill-height-addNote"]}
                    style={{
                      direction: currentLanguage === "ar" ? "rtl" : "ltr",
                    }}
                  />
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <p
                    className={
                      addAgendaWiseFields.Description.errorStatus &&
                      addAgendaWiseFields.Description.value === ""
                        ? ` ${styles["errorNotesMessage"]} `
                        : `${styles["errorNotesMessage_hidden"]}`
                    }
                  >
                    {addAgendaWiseFields.Description.errorMessage}
                  </p>
                </Col>
              </Row>
              {/* Button For Saving the The Minutes  */}
              <Row className="mt-0">
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
                        onClick={handleUpdateFuncagendaWise}
                      />
                    </>
                  ) : (
                    <>
                      <Button
                        text={t("Save")}
                        className={styles["Button_General"]}
                        onClick={handleAddClickAgendaWise}
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
                                console.log(data, "datadatadata");
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
                                          alt=""
                                          onClick={() => handleRemoveFile(data)}
                                        />
                                      </span>
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
                    className={styles["dragdrop_attachment_create_resolution"]}
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
          </Row>{" "}
        </>
      ) : null}

      {/* Mapping of The Create Minutes */}
      <Row className="mt-2">
        <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
          {messages.length > 0
            ? messages.map((data, index) => {
                console.log("className", data);
                return (
                  <>
                    <Row>
                      <Col lg={12} md={12} sm={12} className="mt-2">
                        <Accordion
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                          className={styles["notes_accordion"]}
                          key={data?.agendaID}
                          // onChange={handleChangeExpanded(data?.pK_NotesID)}
                        >
                          <AccordionSummary
                            disableRipple={true}
                            disableTouchRipple={true}
                            focusRipple={false}
                            radioGroup={false}
                            IconButtonProps={{
                              onClick: () =>
                                toggleAcordion(JSON.parse(data?.agendaID)),
                            }}
                            expandIcon={
                              accordianExpand === JSON.parse(data?.agendaID) ? (
                                <img
                                  draggable="false"
                                  src={MinusExpand}
                                  className={styles["MinusIcon"]}
                                  alt=""
                                />
                              ) : (
                                <img
                                  draggable="false"
                                  src={PlusExpand}
                                  alt=""
                                  className={styles["PlusIcon"]}
                                />
                              )
                            }
                            aria-controls="panel1a-content"
                            className="TestAccordian position-relative"
                          >
                            <Row>
                              <Col lg={6} md={6} sm={12}>
                                <div
                                  className={
                                    styles["header-of-collapse-material"]
                                  }
                                >
                                  <Row className="mt-1">
                                    <Col lg={12} md={12} sm={12}>
                                      <span
                                        className={styles["AgendaTitleClass"]}
                                      >
                                        {data.agendaTitle.slice(0, 100)}
                                      </span>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                              <Col
                                lg={3}
                                md={3}
                                sm={12}
                                className="d-flex gap-3 align-items-center"
                              ></Col>
                            </Row>
                          </AccordionSummary>

                          <AccordionDetails key={index}>
                            <Row>
                              <Col
                                sm={12}
                                lg={12}
                                md={12}
                                className={styles["NotesAttachments"]}
                              >
                                <section
                                  className={styles["Sizing_Saved_Minutes"]}
                                >
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
                                              <span
                                                className={styles["Title_File"]}
                                              >
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
                                                      __html:
                                                        data.minutesDetails,
                                                    }}
                                                  ></span>
                                                )}

                                                <span
                                                  className={
                                                    styles["Show_more_Styles"]
                                                  }
                                                  onClick={toggleExpansion}
                                                >
                                                  {expanded &&
                                                  data.minutesDetails.substring(
                                                    0,
                                                    120
                                                  )
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
                                                  styles[
                                                    "Date_Minutes_And_time"
                                                  ]
                                                }
                                              >
                                                {newTimeFormaterAsPerUTCFullDate(
                                                  data.lastUpdatedDate +
                                                    data.lastUpdatedTime
                                                ).toString()}
                                              </span>
                                            </Col>
                                          </Row>
                                          <Row className="mt-2">
                                            <Col lg={12} md={12} sm={12}>
                                              <span
                                                className={styles["Show_more"]}
                                                onClick={() =>
                                                  handleshowMore(index)
                                                }
                                              >
                                                {showMoreIndex === index &&
                                                showMore
                                                  ? t("Hide-details")
                                                  : t("Show-more")}
                                              </span>
                                            </Col>
                                          </Row>
                                          {showMoreIndex === index &&
                                          showMore === true ? (
                                            <>
                                              <Row>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className={
                                                    styles["DocsScroller"]
                                                  }
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
                                                              lg={3}
                                                              md={3}
                                                              sm={12}
                                                              className="position-relative gap-2"
                                                            >
                                                              <section
                                                                className={
                                                                  styles[
                                                                    "Outer_Box"
                                                                  ]
                                                                }
                                                              >
                                                                <Row>
                                                                  <Col
                                                                    lg={12}
                                                                    md={12}
                                                                    sm={12}
                                                                  >
                                                                    <img
                                                                      src={
                                                                        file_image
                                                                      }
                                                                      width={
                                                                        "100%"
                                                                      }
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
                                                                        src={getIconSource(
                                                                          getFileExtension(
                                                                            filesname.displayFileName
                                                                          )
                                                                        )}
                                                                        height="10px"
                                                                        alt=""
                                                                        width="10px"
                                                                        className={
                                                                          styles[
                                                                            "IconPDF"
                                                                          ]
                                                                        }
                                                                      />
                                                                      <span
                                                                        className={
                                                                          styles[
                                                                            "FileName"
                                                                          ]
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
                                                    <Col
                                                      lg={12}
                                                      md={12}
                                                      sm={12}
                                                    ></Col>
                                                  </Row>
                                                </Col>
                                              </Row>
                                            </>
                                          ) : null}
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={3}
                                          className="mt-4"
                                        >
                                          <Row className="d-flex justify-content-end">
                                            <Col lg={2} md={2} sm={2}>
                                              <img
                                                draggable={false}
                                                src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                                height="39px"
                                                width="39px"
                                                alt=""
                                                className={
                                                  styles["Profile_minutes"]
                                                }
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
                                                  <span
                                                    className={styles["Name"]}
                                                  >
                                                    {data.userName}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={4}
                                              md={4}
                                              sm={4}
                                              className="d-flex justify-content-start align-items-center"
                                            >
                                              {Number(editorRole.status) ===
                                                1 ||
                                              Number(editorRole.status) ===
                                                11 ||
                                              Number(editorRole.status) ===
                                                12 ? null : (editorRole.role ===
                                                  "Organizer" &&
                                                  Number(editorRole.status) ===
                                                    9) ||
                                                (Number(editorRole.status) ===
                                                  10 &&
                                                  editorRole.role ===
                                                    "Organizer") ? (
                                                <img
                                                  draggable={false}
                                                  src={EditIcon}
                                                  alt=""
                                                  height="21.55px"
                                                  width="21.55px"
                                                  className="cursor-pointer"
                                                  onClick={() =>
                                                    handleEditFunc(data)
                                                  }
                                                />
                                              ) : null}
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                      {Number(editorRole.status) === 1 ||
                                      Number(editorRole.status) === 11 ||
                                      Number(editorRole.status) ===
                                        12 ? null : (editorRole.role ===
                                          "Organizer" &&
                                          Number(editorRole.status) === 9) ||
                                        (Number(editorRole.status) === 10 &&
                                          editorRole.role === "Organizer") ||
                                        userID === organizerID ? (
                                        <img
                                          draggable={false}
                                          src={RedCroseeIcon}
                                          height="20.76px"
                                          alt=""
                                          width="20.76px"
                                          className={styles["RedCrossClass"]}
                                          onClick={() =>
                                            handleRemovingTheMinutesAgendaWise(
                                              data
                                            )
                                          }
                                        />
                                      ) : null}
                                    </Col>
                                  </Row>
                                </section>
                              </Col>
                            </Row>
                          </AccordionDetails>
                        </Accordion>
                      </Col>
                    </Row>
                  </>
                );
              })
            : null}
        </Col>
      </Row>
      {/* <Row className="mt-3">
        <Col
          lg={12}
          md={12}
          sm={12}
          className="d-flex justify-content-end gap-2"
        >
          <Button text={t("Previous")} className={styles["Previous_Button"]} />
          <Button text={t("Next")} className={styles["Button_General"]} />
        </Col>
      </Row> */}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default AgendaWise;
