import React, { useEffect, useState } from "react";
import styles from "./AgendaWise.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../../../../../components/elements";
import Select from "react-select";
import { Accordion, Col, Row } from "react-bootstrap";
import { useRef } from "react";
import { Upload } from "antd";
import featherupload from "../../../../../../assets/images/featherupload.svg";
import ReactQuill, { Quill } from "react-quill";
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
  cleareAllState,
  saveFilesMeetingagendaWiseMinutesApi,
  uploadDocumentsMeetingAgendaWiseMinutesApi,
} from "../../../../../../store/actions/NewMeetingActions";
import { GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes } from "../../../../../../store/actions/AgendaWiseAgendaAction";
import FilesMappingAgendaWiseMinutes from "./FilesMappingAgendaWiseMinutes";
import { removeHTMLTagsAndTruncate } from "../../../../../../commen/functions/utils";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

const AgendaWise = ({
  currentMeeting,
  agendaOptionvalue,
  setAgendaOptionValue,
  addAgendaWiseFields,
  setAgendaWiseFields,
  fileAttachments,
  setFileAttachments,
}) => {
  const { editorRole } = useMeetingContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [isEdit, setisEdit] = useState(false);
  const [accordianExpand, setAccordianExpand] = useState(false);
  const [organizerID, setOrganizerID] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");

  const agendaWiseMinutesReducer = useSelector(
    (state) => state.NewMeetingreducer.agendaWiseMinutesReducer
  );
  const getallDocumentsForAgendaWiseMinutes = useSelector(
    (state) => state.NewMeetingreducer.getallDocumentsForAgendaWiseMinutes
  );
  const agendaWiseMinuteID = useSelector(
    (state) => state.NewMeetingreducer.agendaWiseMinuteID
  );
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const RetriveAgendaWiseDocuments = useSelector(
    (state) => state.NewMeetingreducer.RetriveAgendaWiseDocuments
  );
  const AllAgendas = useSelector(
    (state) => state.AgendaWiseAgendaListReducer.AllAgendas
  );
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const [fileForSend, setFileForSend] = useState([]);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [updateData, setupdateData] = useState({
    MinutesID: 0,
  });
  const [agendaOptions, setAgendaOptions] = useState([]);
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  const [showMore, setShowMore] = useState(false);
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
    return () => {
      setMessages([]);
      setFileAttachments([]);
      setPreviousFileIDs([]);
      dispatch(cleareAllState());
    };
  }, []);

  useEffect(() => {
    try {
      if (AllAgendas !== null && AllAgendas !== undefined) {
        let NewData = [];
        AllAgendas.agendaList.forEach((agenda, index) => {
          console.log(agenda, "agendaListagendaList");
          NewData.push({
            value: agenda.id,
            label: agenda.title,
          });

          agenda.subAgenda.forEach((subajendaData, index) => {
            NewData.push({
              value: subajendaData.subAgendaID,
              label: subajendaData.subTitle,
            });
          });
        });
        setAgendaOptions(NewData);
      }
    } catch {}
  }, [AllAgendas]);

  // Combined Data for both Documents and Minutes Agenda Wise
  useEffect(() => {
    try {
      if (
        agendaWiseMinutesReducer !== null &&
        agendaWiseMinutesReducer &&
        getallDocumentsForAgendaWiseMinutes !== null &&
        getallDocumentsForAgendaWiseMinutes !== undefined
      ) {
        const minutesData = agendaWiseMinutesReducer.agendaWiseMinutes;

        const documentsData = getallDocumentsForAgendaWiseMinutes.data;

        // Grouping data based on agendaID
        const groupedData = minutesData.reduce((acc, item1) => {
          const matchingItems = documentsData.filter(
            (item2) => item2.pK_MeetingAgendaMinutesID === item1.minuteID
          );

          // Check if there are matching items
          if (matchingItems.length > 0) {
            const agendaID = item1.agendaID;

            // Check if there is an existing entry for the agendaID
            if (!acc[agendaID]) {
              acc[agendaID] = [];
            }

            // Push combined data to the grouped array
            acc[agendaID].push({
              ...item1,
              minutesAttachmets: matchingItems,
            });
          }

          return acc;
        }, {});

        // Convert groupedData object to an array of values
        const combinedDataArray = Object.values(groupedData).flat();
        console.log(combinedDataArray, "groupedDatagroupedDatagroupedData");

        // Store combined data in the messages state
        setMessages(combinedDataArray);
      } else {
        setMessages([]);
      }
    } catch (error) {
      // Handle any errors here
      console.error(error);
    }
  }, [agendaWiseMinutesReducer, getallDocumentsForAgendaWiseMinutes]);

  // Grouping the messages by agendaID while maintaining the unique titles
  const groupedMessages = messages.reduce((acc, curr) => {
    if (!acc[curr.agendaID]) {
      acc[curr.agendaID] = {
        agendaID: curr.agendaID,
        agendaTitle: curr.agendaTitle,
        items: [
          {
            minuteID: curr.minuteID,
            minutesDetails: curr.minutesDetails,
            userID: curr.userID,
            userName: curr.userName,
            lastUpdatedDate: curr.lastUpdatedDate,
            lastUpdatedTime: curr.lastUpdatedTime,
            userProfilePicture: curr.userProfilePicture,
            minutesAttachmets: curr.minutesAttachmets,
            agendaTitle: curr.agendaTitle,
          },
        ],
      };
    } else {
      acc[curr.agendaID].items.push({
        minuteID: curr.minuteID,
        minutesDetails: curr.minutesDetails,
        userID: curr.userID,
        userName: curr.userName,
        lastUpdatedDate: curr.lastUpdatedDate,
        lastUpdatedTime: curr.lastUpdatedTime,
        userProfilePicture: curr.userProfilePicture,
        minutesAttachmets: curr.minutesAttachmets,
        agendaTitle: curr.agendaTitle,
      });
    }

    console.log(acc, "returnreturnreturn");
    return acc;
  }, {});

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
        [{ header: [2, 3, 4, false] }],
        [{ font: ["impact", "courier", "comic", "Montserrat"] }],
        ["bold", "italic", "underline", "blockquote"],
        [{ color: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      handlers: {},
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
  };

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;

      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }

      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;

      if (fileAttachments.length > 9) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > 10485760) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = fileAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          showMessage(
            t("File-size-should-not-be-greater-then-zero"),
            "error",
            setOpen
          );
        } else if (!sizezero) {
          showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
        } else if (fileExists) {
          showMessage(t("File-already-exists"), "error", setOpen);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };
          setFileAttachments((prevAttachments) => [...prevAttachments, file]);
          fileSizeArr += fileData.originFileObj.size;
          setFileForSend((prevFiles) => [...prevFiles, fileData.originFileObj]);
          setFileSize(fileSizeArr);
        }
      });

      // Update previousFileList to current fileList
      previousFileList = fileList;
    },
    onDrop(e) {},
    customRequest() {},
  };
  // Initialize previousFileList to an empty array
  let previousFileList = [];

  const onTextChange = (content, delta, source) => {
    const deltaOps = delta.ops || [];

    const contentTrimmed = content.trim();

    // Check if any image is being pasted
    const containsImage = deltaOps.some((op) => op.insert && op.insert.image);
    if (containsImage) {
      setAgendaWiseFields({
        ...addAgendaWiseFields,
        Description: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      if (source === "user" && String(content).length >= 501) {
        console.log(
          removeHTMLTagsAndTruncate(String(content)),
          removeHTMLTagsAndTruncate(String(content)).length,
          "Test String"
        );
        // Update state only if no image is detected in the content
        setAgendaWiseFields({
          ...addAgendaWiseFields,
          Description: {
            value: removeHTMLTagsAndTruncate(String(content)),
            errorMessage: "",
            errorStatus: false,
          },
        });
      } else {
        setAgendaWiseFields({
          ...addAgendaWiseFields,
          Description: {
            value: content,
            errorMessage:
              contentTrimmed !== ""
                ? ""
                : addAgendaWiseFields.Description.errorMessage,
            errorStatus: contentTrimmed === "",
          },
        });
      }
    }
    // else {
    //   if (source === "user") {
    //     // Update state only if no image is detected in the content
    //     setAgendaWiseFields({
    //       ...addAgendaWiseFields,
    //       Description: {
    //         value: content,
    //         errorMessage:
    //           contentTrimmed !== ""
    //             ? ""
    //             : addAgendaWiseFields.Description.errorMessage,
    //         errorStatus: contentTrimmed === "",
    //       },
    //     });
    //   }
    // }
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

  const handleAddClickAgendaWise = () => {
    // Directly use the state value for checking instead of relying on a separate variable
    const content = addAgendaWiseFields.Description.value.trim();
    const isDescriptionNotEmpty = content !== "";
    const isAgendaSelected = agendaOptionvalue.value !== 0;

    if (isDescriptionNotEmpty && isAgendaSelected) {
      let Data = {
        AgendaID: agendaSelect.agendaSelectOptions.id,
        MinuteText: content,
      };
      dispatch(AddAgendaWiseMinutesApiFunc(navigate, Data, t, false));
      setAgendaOptionValue({
        value: 0,
        label: "",
      });
    } else {
      if (!isDescriptionNotEmpty) {
        setAgendaWiseFields((prevState) => ({
          ...prevState,
          Description: {
            ...prevState.Description,
            errorMessage: t("Minutes-text-is-required"),
            errorStatus: true,
          },
        }));
      }

      if (!isAgendaSelected) {
        showMessage(t("Select-agenda"), "error", setOpen);
      }
    }
  };

  const documentUploadingFunc = async (minuteID) => {
    let newFolder = [];
    let newfile = [];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsMeetingAgendaWiseMinutesApi(
          navigate,
          t,
          newData,
          folderID,
          // newFolder,
          newfile
        )
      );
    });

    // Wait for all promises to resolve
    await Promise.all(uploadPromises);
    await dispatch(
      saveFilesMeetingagendaWiseMinutesApi(
        navigate,
        t,
        newfile,
        folderID,
        newFolder
      )
    );
    let docsData = {
      FK_MeetingAgendaMinutesID: minuteID,
      FK_MDID: currentMeeting,
      UpdateFileList: newFolder.map((data, index) => {
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
    if (agendaWiseMinuteID !== 0) {
      console.log(agendaWiseMinuteID, "agendaWiseMinuteIDagendaWiseMinuteID");
      documentUploadingFunc(agendaWiseMinuteID);
    }
  }, [agendaWiseMinuteID]);

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
    setFileForSend([]);
    setAgendaOptionValue({
      label: "",
      value: 0,
    });
    setisEdit(false);
  };

  //handle Edit functionality
  const handleEditFunc = async (data) => {
    setupdateData({
      MinutesID: data.minuteID,
    });
    let Data = {
      FK_MeetingAgendaMinutesID: data.minuteID,
    };
    await dispatch(
      AgendaWiseRetriveDocumentsMeetingMinutesApiFunc(navigate, Data, t)
    );
    if (data.minutesDetails !== undefined && data.minutesDetails !== null) {
      let findOptionValue = agendaOptions.filter(
        (agendaOption, index) => agendaOption.label === data.agendaTitle
      );
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

  //Retirive Document of Specific Minutes
  useEffect(() => {
    try {
      if (
        RetriveAgendaWiseDocuments !== null &&
        RetriveAgendaWiseDocuments !== undefined &&
        RetriveAgendaWiseDocuments.data.length > 0
      ) {
        let files = [];
        let prevData = [];
        RetriveAgendaWiseDocuments.data.forEach((data, index) => {
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
  }, [RetriveAgendaWiseDocuments]);

  //Handle Update Button Api
  const handleUpdateFuncagendaWise = async () => {
    let UpdateDataAgendaWise = {
      MinuteID: Number(updateData.MinutesID),
      MinuteText: addAgendaWiseFields.Description.value,
    };
    dispatch(
      UpdateAgendaWiseMinutesApiFunc(navigate, UpdateDataAgendaWise, t, false)
    );

    let newfile = [...previousFileIDs];
    let fileObj = [];
    if (Object.keys(fileForSend).length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsMeetingAgendaWiseMinutesApi(
            navigate,
            t,
            newData,
            folderID,
            fileObj
          )
        );
      });
      // Wait for all promises to resolve
      await Promise.all(uploadPromises);
      await dispatch(
        saveFilesMeetingagendaWiseMinutesApi(
          navigate,
          t,
          fileObj,
          folderID,
          newfile
        )
      );
      let docsData = {
        FK_MeetingAgendaMinutesID: Number(updateData.MinutesID),
        FK_MDID: currentMeeting,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };

      dispatch(
        SaveAgendaWiseDocumentsApiFunc(navigate, docsData, t, currentMeeting)
      );
    } else if (newfile.length > 0) {
      let docsData = {
        FK_MeetingAgendaMinutesID: Number(updateData.MinutesID),
        FK_MDID: currentMeeting,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };

      dispatch(
        SaveAgendaWiseDocumentsApiFunc(navigate, docsData, t, currentMeeting)
      );
    } else {
    }

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
    setFileForSend([]);
    setisEdit(false);
  };

  const handleRemovingTheMinutesAgendaWise = (AgendaWiseData) => {
    let minutesID = 0;
    AgendaWiseData.items.forEach((id, index) => {
      minutesID = Number(id.minuteID);
    });

    let Data = {
      MDID: currentMeeting,
      MeetingAgendaMinutesID: Number(minutesID),
    };

    dispatch(
      DeleteAgendaWiseMinutesDocumentsApiFunc(
        navigate,
        Data,
        t,
        currentMeeting,
        minutesID
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
    setShowMoreIndex((prevIndex) => (prevIndex === index ? null : index));
    setShowMore((prevState) => !prevState);
  };

  //Handling of the Response Messege
  useEffect(() => {
    if (
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available")
    ) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
  }, [ResponseMessage]);

  const toggleAcordion = (agendaID) => {
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
        (Number(editorRole.status) === 10 && editorRole.role === "Organizer") ||
        (editorRole.role === "Agenda Contributor" &&
          Number(editorRole.status) === 9) ||
        (Number(editorRole.status) === 10 &&
          editorRole.role === "Agenda Contributor") ? (
        <>
          {" "}
          <Row className='mt-4'>
            <Col lg={6} md={6} sm={6}>
              <Select
                options={agendaOptions}
                maxMenuHeight={140}
                value={{
                  value: agendaOptionvalue.value,
                  label: agendaOptionvalue.label,
                }}
                onChange={handleAgendaSelect}
                isSearchable={false}
              />
            </Col>
          </Row>
          <Row className='mt-4'>
            <Col lg={6} md={6} sm={6}>
              <Row className={styles["Add-note-QuillRow"]}>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["Arabic_font_Applied"]}>
                  <ReactQuill
                    ref={editorRef}
                    theme='snow'
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
              <Row className='mt-5'>
                <Col>
                  <p
                    className={
                      addAgendaWiseFields.Description.errorStatus &&
                      addAgendaWiseFields.Description.value === ""
                        ? ` ${styles["errorNotesMessage"]} `
                        : `${styles["errorNotesMessage_hidden"]}`
                    }>
                    {addAgendaWiseFields.Description.errorMessage}
                  </p>
                </Col>
              </Row>
              {/* Button For Saving the The Minutes  */}
              <Row className='mt-0'>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex gap-2 justify-content-end'>
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
              <section className={styles["viewAgendaWiseAttachments"]}>
                {fileAttachments.length > 0 ? (
                  <>
                    <Row className='mt-1'>
                      {fileAttachments.length > 0
                        ? fileAttachments.map((data, index) => {
                            console.log(data, "datadatadata");
                            return (
                              <>
                                <Col lg={4} md={4} sm={4}>
                                  <AttachmentViewer
                                    data={data}
                                    id={0}
                                    name={data.DisplayAttachmentName}
                                    fk_UID={userID}
                                    handleClickRemove={() =>
                                      handleRemoveFile(data)
                                    }
                                  />
                                </Col>
                              </>
                            );
                          })
                        : null}
                    </Row>
                  </>
                ) : null}
              </section>

              <Row className='mt-2'>
                <Col lg={12} md={12} sm={12}>
                  <Dragger
                    fileList={[]}
                    {...props}
                    className={styles["dragdrop_attachment_create_resolution"]}>
                    <p className='ant-upload-drag-icon'>
                      <span className={styles["create_resolution_dragger"]}>
                        <img
                          src={featherupload}
                          width='18.87px'
                          height='18.87px'
                          draggable='false'
                          alt=''
                        />
                      </span>
                    </p>
                    <p className={styles["ant-upload-text"]}>
                      {t("Drag-&-drop-or")}
                      <span className={styles["Choose_file_style"]}>
                        {t("Choose-file")}
                      </span>{" "}
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
      <Row className='mt-2'>
        <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
          {Object.values(groupedMessages).map((data, index) => {
            console.log(data, "groupedMessagesgroupedMessages");
            return (
              <>
                {/* Display agendaTitle once */}

                {/* Map associated minutes within AccordionDetails */}
                <Row key={data.agendaID}>
                  <Col lg={12} md={12} sm={12} className={` ${"mt-2"}`}>
                    <Accordion
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                      prefix='minutes_accordion'
                      className={styles["notes_accordion"]}
                      key={data.agendaID}
                      // onChange={handleChangeExpanded(data?.pK_NotesID)}
                    >
                      <Accordion.Header
                        onClick={() =>
                          toggleAcordion(JSON.parse(data.agendaID))
                        }>
                        <Row className='w-100'>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className='mt-2 d-flex align-items-center'>
                            <span className='AgendaTitleClass'>
                              {data.agendaTitle.slice(0, 100)}
                            </span>
                          </Col>
                        </Row>
                      </Accordion.Header>
                      <Accordion.Body key={index}>
                        <Row>
                          <Col
                            sm={12}
                            lg={12}
                            md={12}
                            className={styles["NotesAttachments"]}>
                            <section className={styles["Sizing_Saved_Minutes"]}>
                              {data.items.map((Itemsdata, detailIndex) => {
                                console.log(
                                  data,
                                  "groupedMessagesgroupedMessages"
                                );
                                return (
                                  <>
                                    <div key={detailIndex}>
                                      <Row className='mt-2'>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className={styles["Box_Minutes"]}>
                                          <Row>
                                            <Col lg={8} md={8} sm={8}>
                                              <Row className='mt-3'>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Title_File"]
                                                    }>
                                                    {expanded ? (
                                                      <>
                                                        <span
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              Itemsdata.minutesDetails.substring(
                                                                0,
                                                                120
                                                              ),
                                                          }}></span>
                                                        ...
                                                      </>
                                                    ) : (
                                                      <span
                                                        dangerouslySetInnerHTML={{
                                                          __html:
                                                            Itemsdata.minutesDetails,
                                                        }}></span>
                                                    )}

                                                    <span
                                                      className={
                                                        styles[
                                                          "Show_more_Styles"
                                                        ]
                                                      }
                                                      onClick={toggleExpansion}>
                                                      {expanded &&
                                                      Itemsdata.minutesDetails.substring(
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
                                                    }>
                                                    {newTimeFormaterAsPerUTCFullDate(
                                                      Itemsdata.lastUpdatedDate +
                                                        Itemsdata.lastUpdatedTime,
                                                      currentLanguage
                                                    )}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row className='mt-2'>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles["Show_more"]
                                                    }
                                                    onClick={() =>
                                                      handleshowMore(
                                                        detailIndex
                                                      )
                                                    }>
                                                    {showMoreIndex ===
                                                    detailIndex
                                                      ? t("Hide-details")
                                                      : t("Show-more")}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <FilesMappingAgendaWiseMinutes
                                                showMoreIndex={showMoreIndex}
                                                Itemsdata={Itemsdata}
                                                showMore={showMore}
                                                detailIndex={detailIndex}
                                              />
                                            </Col>
                                            <Col
                                              lg={4}
                                              md={4}
                                              sm={4}
                                              className='mt-4'>
                                              <section className='d-flex justify-content-end gap-4'>
                                                <img
                                                  draggable={false}
                                                  src={`data:image/jpeg;base64,${Itemsdata?.userProfilePicture?.displayProfilePictureName}`}
                                                  height='39px'
                                                  width='39px'
                                                  alt=''
                                                  className={
                                                    styles["Profile_minutes"]
                                                  }
                                                />
                                                <div
                                                  className={`
                                                     ${
                                                       styles["Line_heigh"]
                                                     } ${"d-flex flex-column"} `}>
                                                  <span
                                                    className={
                                                      styles["Uploaded_heading"]
                                                    }>
                                                    {t("Uploaded-by")}
                                                  </span>
                                                  <span
                                                    className={styles["Name"]}>
                                                    {Itemsdata.userName}
                                                  </span>
                                                </div>
                                                {Number(editorRole.status) ===
                                                  1 ||
                                                Number(editorRole.status) ===
                                                  11 ||
                                                Number(editorRole.status) ===
                                                  12 ? null : (editorRole.role ===
                                                    "Organizer" &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 9) ||
                                                  (Number(editorRole.status) ===
                                                    10 &&
                                                    editorRole.role ===
                                                      "Organizer") ||
                                                  (editorRole.role ===
                                                    "Agenda Contributor" &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 9) ||
                                                  (Number(editorRole.status) ===
                                                    10 &&
                                                    editorRole.role ===
                                                      "Agenda Contributor") ? (
                                                  <img
                                                    draggable={false}
                                                    src={EditIcon}
                                                    alt=''
                                                    height='21.55px'
                                                    width='21.55px'
                                                    className='cursor-pointer mt-2'
                                                    onClick={() =>
                                                      handleEditFunc(Itemsdata)
                                                    }
                                                  />
                                                ) : null}
                                              </section>
                                            </Col>
                                          </Row>
                                          {Number(editorRole.status) === 1 ||
                                          Number(editorRole.status) === 11 ||
                                          Number(editorRole.status) ===
                                            12 ? null : (editorRole.role ===
                                              "Organizer" &&
                                              Number(editorRole.status) ===
                                                9) ||
                                            (Number(editorRole.status) === 10 &&
                                              editorRole.role ===
                                                "Organizer") ||
                                            (editorRole.role ===
                                              "Agenda Contributor" &&
                                              Number(editorRole.status) ===
                                                9) ||
                                            (Number(editorRole.status) === 10 &&
                                              editorRole.role ===
                                                "Agenda Contributor") ||
                                            userID === organizerID ? (
                                            <img
                                              draggable={false}
                                              src={RedCroseeIcon}
                                              height='20.76px'
                                              alt=''
                                              width='20.76px'
                                              className={
                                                styles["RedCrossClass"]
                                              }
                                              onClick={() =>
                                                handleRemovingTheMinutesAgendaWise(
                                                  data
                                                )
                                              }
                                            />
                                          ) : null}
                                        </Col>
                                      </Row>
                                    </div>
                                  </>
                                );
                              })}
                            </section>
                          </Col>
                        </Row>
                      </Accordion.Body>
                    </Accordion>
                  </Col>
                </Row>
              </>
            );
          })}
        </Col>
      </Row>

      <Notification open={open} setOpen={setOpen} />
    </section>
  );
};

export default AgendaWise;
