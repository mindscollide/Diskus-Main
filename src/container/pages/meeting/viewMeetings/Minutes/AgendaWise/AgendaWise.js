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
import DeleteCommentAgenda from "../deleteCommentModal/DeleteCommentModalAgendaWise";
import Select from "react-select";
import { Col, Row } from "react-bootstrap";
import { useRef } from "react";
import { Upload } from "antd";
import featherupload from "../../../../../../assets/images/featherupload.svg";
import ReactQuill, { Quill } from "react-quill";
// import EditIcon from "../../../../../../assets/images/Edit-Icon.png";
import { useSelector } from "react-redux";
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
import AttachmentIcon from "./../Images/Attachment-Icon.png";
import ArrowDown from "./../Images/Arrow-Down.png";
import DropdownPurple from "./../Images/Dropdown-Purple.png";
import DefaultAvatar from "./../Images/avatar.png";
import EditIcon from "./../Images/Edit-Icon.png";
import MenuIcon from "./../Images/MenuIcon.png";
import DeleteIcon from "./../Images/DeleteIcon.png";
import {
  GetMinuteReviewDetailsByOrganizerByMinuteId_Api,
  GetMinutesVersionHistoryWithCommentsApi,
  deleteCommentModalAgenda,
} from "../../../../../../store/actions/Minutes_action";
import VersionHistory from "./VersionHistoryModal/VersionHistory";
import RevisionHistory from "./RevisionHistoryModal/RevisionHistory";
import {
  GetMinuteReviewStatsForOrganizerByMeetingId,
  DeleteMinuteReducer,
} from "../../../../../../store/actions/Minutes_action";
import { transform } from "lodash";
import {
  convertToGMTMinuteTime,
  convertDateToGMTMinute,
} from "../../../../../../commen/functions/time_formatter";

const AgendaWise = ({
  advanceMeetingModalID,
  editorRole,
  agendaOptionvalue,
  setAgendaOptionValue,
  addNoteFields,
  setAddNoteFields,
  fileAttachments,
  setFileAttachments,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  const Delta = Quill.import("delta");

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [isEdit, setisEdit] = useState(false);
  const [fileSize, setFileSize] = useState(0);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { NewMeetingreducer, AgendaWiseAgendaListReducer, MinutesReducer } =
    useSelector((state) => state);
  const editorRef = useRef(null);
  const { Dragger } = Upload;
  const [fileForSend, setFileForSend] = useState([]);
  const [accordianExpand, setAccordianExpand] = useState(false);
  const [general, setGeneral] = useState(false);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [agenda, setAgenda] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [organizerID, setOrganizerID] = useState(0);
  const [expandedFiles, setExpandedFiles] = useState([]);
  const [minuteID, setMinuteID] = useState(0);
  const [updateData, setupdateData] = useState(null);
  const [agendaOptions, setAgendaOptions] = useState([]);

  const [showMore, setShowMore] = useState(false);
  const [showMoreIndex, setShowMoreIndex] = useState(null);
  const [agendaID, setAgendaID] = useState([]);
  const [agendaSelect, setAgendaSelect] = useState({
    agendaSelectOptions: {
      id: 0,
      title: "",
    },
  });

  console.log(
    AgendaWiseAgendaListReducer.AllAgendas,
    "AgendaWiseAgendaListReducer"
  );

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
  // useEffect(() => {
  //   try {
  //     if (
  //       NewMeetingreducer.agendaWiseMinutesReducer !== null &&
  //       NewMeetingreducer.agendaWiseMinutesReducer &&
  //       NewMeetingreducer.getallDocumentsForAgendaWiseMinutes !== null &&
  //       NewMeetingreducer.getallDocumentsForAgendaWiseMinutes !== undefined
  //     ) {
  //       const minutesData =
  //         NewMeetingreducer.agendaWiseMinutesReducer.agendaWiseMinutes;
  //       const documentsData =
  //         NewMeetingreducer.getallDocumentsForAgendaWiseMinutes.data;
  //       setOrganizerID(NewMeetingreducer.agendaWiseMinutesReducer.organizerID);
  //       const combinedData = minutesData.map((item1) => {
  //         const matchingItem = documentsData.find(
  //           (item2) => item2.pK_MeetingAgendaMinutesID === item1.minuteID
  //         );
  //         if (matchingItem) {
  //           return {
  //             ...item1,
  //             minutesAttachmets: matchingItem.files,
  //           };
  //         }
  //         return item1;
  //       });
  //       setMessages(combinedData);
  //     } else {
  //       setMessages([]);
  //     }
  //   } catch (error) {
  //     // Handle any errors here
  //     console.error(error);
  //   }
  // }, [
  //   NewMeetingreducer.agendaWiseMinutesReducer,
  //   NewMeetingreducer.getallDocumentsForAgendaWiseMinutes,
  // ]);

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
      clipboard: { matchVisual: false },
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
      let flag = false;
      let sizezero = true;
      let size = true;

      if (fileAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
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
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            });
          }, 3000);
        } else if (!sizezero) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            });
          }, 3000);
        } else if (fileExists) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            });
          }, 3000);
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
    const deltaOps = delta.ops || [];

    // Check if any image is being pasted
    const containsImage = deltaOps.some((op) => op.insert && op.insert.image);
    if (containsImage) {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: "",
          errorMessage: "",
          errorStatus: false,
        },
      });
    } else {
      if (source === "user") {
        // Update state only if no image is detected in the content
        setAddNoteFields({
          ...addNoteFields,
          Description: {
            value: content,
            errorMessage: "",
            errorStatus: false,
          },
        });
      }
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

  const handleAddClickAgendaWise = () => {
    // Directly use the state value for checking instead of relying on a separate variable
    const content = addNoteFields.Description.value.trim();
    const isDescriptionNotEmpty = content !== "";
    const isAgendaSelected = agendaOptionvalue.value !== 0;

    if (isDescriptionNotEmpty && isAgendaSelected) {
      let Data = {
        AgendaID: agendaSelect.agendaSelectOptions.id,
        MinuteText: content,
      };
      dispatch(AddAgendaWiseMinutesApiFunc(navigate, Data, t));
      setAgendaOptionValue({
        value: 0,
        label: "",
      });
    } else {
      if (!isDescriptionNotEmpty) {
        setAddNoteFields((prevState) => ({
          ...prevState,
          Description: {
            ...prevState.Description,
            errorMessage: t("Minutes-text-is-required"),
            errorStatus: true,
          },
        }));
      }

      if (!isAgendaSelected) {
        setOpen({
          flag: true,
          message: t("Select-agenda"),
        });
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
      FK_MDID: advanceMeetingModalID,
      UpdateFileList: newFolder.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };
    dispatch(
      SaveAgendaWiseDocumentsApiFunc(
        navigate,
        docsData,
        t,
        advanceMeetingModalID
      )
    );

    setFileAttachments([]);
    setPreviousFileIDs([]);
    setFileForSend([]);
    setAgendaOptionValue({
      label: "",
      value: 0,
    });
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
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
    console.log(addNoteFields, "addNoteFieldsaddNoteFieldsaddNoteFields");
    setAddNoteFields({
      ...addNoteFields,
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
    setFileAttachments([]);
    setPreviousFileIDs([]);
    setisEdit(false);
  };

  //handle Edit functionality
  const handleEditFunc = (data) => {
    setupdateData(data);
    if (data.description !== "") {
      let findOptionValue = agendaOptions.filter(
        (agendaOption, index) => agendaOption.label === data.agendaTitle
      );
      console.log(data, "addNoteFieldsaddNoteFieldsaddNoteFields");
      setAddNoteFields({
        Description: {
          value: data.description,
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
    setisEdit(true);
    console.log(data, "handleEditFunchandleEditFunc");
    let Data = {
      FK_MeetingAgendaMinutesID: data.minuteID,
    };
    dispatch(
      AgendaWiseRetriveDocumentsMeetingMinutesApiFunc(navigate, Data, t)
    );
  };

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

  //Handle Update Button Api
  const handleUpdateFuncagendaWise = async () => {
    let UpdateDataAgendaWise = {
      MinuteID: updateData.minuteID,
      MinuteText: addNoteFields.Description.value,
    };
    dispatch(UpdateAgendaWiseMinutesApiFunc(navigate, UpdateDataAgendaWise, t));

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
        FK_MeetingAgendaMinutesID: updateData.minuteID,
        FK_MDID: advanceMeetingModalID,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };

      dispatch(
        SaveAgendaWiseDocumentsApiFunc(
          navigate,
          docsData,
          t,
          advanceMeetingModalID
        )
      );
    } else if (newfile.length > 0) {
      let docsData = {
        FK_MeetingAgendaMinutesID: Number(updateData.MinutesID),
        FK_MDID: advanceMeetingModalID,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };

      dispatch(
        SaveAgendaWiseDocumentsApiFunc(
          navigate,
          docsData,
          t,
          advanceMeetingModalID
        )
      );
    } else {
    }

    setAgendaOptionValue({
      label: "",
      value: 0,
    });
    setAddNoteFields({
      ...addNoteFields,
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
    console.log(AgendaWiseData, "AgendaWiseDataAgendaWiseData");
    let minuteID = 0;
    AgendaWiseData.items.map((id, index) => {
      minuteID = id.minuteID;
    });
    let Data = {
      MDID: advanceMeetingModalID,
      MeetingAgendaMinutesID: Number(minuteID),
    };

    dispatch(
      DeleteAgendaWiseMinutesDocumentsApiFunc(
        navigate,
        Data,
        t,
        advanceMeetingModalID,
        minuteID
      )
    );
    setAddNoteFields({
      ...addNoteFields,
      Description: {
        value: "",
        errorMessage: "",
        errorStatus: true,
      },
    });

    setFileAttachments([]);
    // setAgendaOptions([]);
  };

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
    if (
      NewMeetingreducer.ResponseMessage.trim() !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found") &&
      NewMeetingreducer.ResponseMessage !== t("No-records-found") &&
      NewMeetingreducer.ResponseMessage !== "" &&
      NewMeetingreducer.ResponseMessage !== t("No-record-found") &&
      NewMeetingreducer.ResponseMessage !== t("List-updated-successfully") &&
      NewMeetingreducer.ResponseMessage !== t("No-data-available")
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

  useEffect(() => {
    let Data = {
      isAgenda: true,
      MeetingID: Number(advanceMeetingModalID),
    };
    let Data2 = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetMinuteReviewStatsForOrganizerByMeetingId(Data, navigate, t));
    dispatch(
      GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes(
        Data2,
        navigate,
        t,
        advanceMeetingModalID
      )
    );
    return () => {
      setMessages([]);
      setFileAttachments([]);
      setPreviousFileIDs([]);
      dispatch(cleareAllState());
    };
  }, []);

  // NEW WORK OWAIS!!!!!!!!! ->>>> cxxx|::::::::::::::>

  const [openMenuId, setOpenMenuId] = useState(null);

  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const [minutesData, setMinutesData] = useState([]);

  const [openIndices, setOpenIndices] = useState([]);

  const [openReviewerDetail, setOpenReviewerDetail] = useState([]);
  const [openReviewerDetailSubminute, setOpenReviewerDetailSubminute] =
    useState([]);

  const [menuMinute, setMenuMinute] = useState(false);

  const [minuteReviewData, setMinuteReviewData] = useState(null);

  const closeMenuMinute = useRef(null);

  const menuPopupMinute = (id) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle the menu for the clicked item
  };

  const handleOutsideClick = (event) => {
    if (
      closeMenuMinute.current &&
      !closeMenuMinute.current.contains(event.target) &&
      menuMinute
    ) {
      setMenuMinute(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuMinute]);

  const accordianClick = (data, id, index) => {
    setOpenIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
    console.log("openIndices", openIndices);
  };

  const openCloseReviewerDetail = (index) => {
    setOpenReviewerDetail((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const openCloseReviewerDetailSubminute = (index) => {
    setOpenReviewerDetailSubminute((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

  // useEffect(() => {
  //   // Check if agendaWiseMinutesReducer is not null, undefined, and has at least one key
  //   if (
  //     NewMeetingreducer.agendaWiseMinutesReducer !== null &&
  //     NewMeetingreducer.agendaWiseMinutesReducer !== undefined &&
  //     Object.keys(NewMeetingreducer.agendaWiseMinutesReducer).length > 0
  //   ) {
  //     // Store agendaWiseMinutesReducer in a local variable
  //     let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
  //     // Initialize an empty array to hold the transformed data
  //     let transformedData = [];

  //     // Iterate through each parent agenda in the agenda hierarchy list
  //     reducerData.agendaHierarchyList.forEach((parentAgenda) => {
  //       // Find the parent agenda details in the agendaWiseMinutes array
  //       let parentAgendaDetails = reducerData.agendaWiseMinutes.find(
  //         (minute) => minute.agendaID === parentAgenda.pK_MAID
  //       );

  //       // Initialize an array to hold sub-minutes of the parent agenda
  //       let subMinutes = [];
  //       // Iterate through each child agenda of the parent agenda
  //       parentAgenda.childAgendas.forEach((childAgenda) => {
  //         // Filter the minutes that match the child agenda ID and push to subMinutes
  //         let childMinutes = reducerData.agendaWiseMinutes.filter(
  //           (minute) => minute.agendaID === childAgenda.pK_MAID
  //         );
  //         subMinutes.push(...childMinutes);
  //       });

  //       // Check if parent agenda details exist to determine if it's parent data
  //       let isParentData = !!parentAgendaDetails;

  //       // If there are parent agenda details or sub-minutes, create a parent agenda object
  //       if (isParentData || subMinutes.length > 0) {
  //         // If parent agenda details exist, use them, otherwise use childAgenda's parentTitle
  //         let agendaTitle = isParentData
  //           ? parentAgendaDetails.agendaTitle
  //           : parentAgenda.childAgendas.find((childAgenda) =>
  //               subMinutes.some(
  //                 (minute) => minute.agendaID === childAgenda.pK_MAID
  //               )
  //             )?.parentTitle || "";
  //         let parentAgendaObj = {
  //           // Use parent agenda details if they exist, otherwise default to 0
  //           agendaID: isParentData ? parentAgendaDetails.agendaID : 0,
  //           minuteID: isParentData ? parentAgendaDetails.minuteID : 0,
  //           description: isParentData ? parentAgendaDetails.minutesDetails : "",
  //           // Use parent agenda title if it exists, otherwise fallback to a default title
  //           agendaTitle: agendaTitle,
  //           isParentData: isParentData,
  //           attachments: isParentData
  //             ? parentAgendaDetails.minutesAttachmets
  //             : [],
  //           uploader: isParentData
  //             ? parentAgendaDetails.userProfilePicture
  //             : [],
  //           lastUpdatedDate: isParentData
  //             ? parentAgendaDetails.lastUpdatedDate
  //             : "",
  //           lastUpdatedTime: isParentData
  //             ? parentAgendaDetails.lastUpdatedTime
  //             : "",
  //           userID: isParentData ? parentAgendaDetails.userID : 0,
  //           userName: isParentData ? parentAgendaDetails.userName : "",
  //           // Map subMinutes to include only the necessary properties
  //           subMinutes: subMinutes.map((subMinute) => ({
  //             agendaID: subMinute.agendaID,
  //             minuteID: subMinute.minuteID,
  //             description: subMinute.minutesDetails,
  //             // Use parent agenda title if it exists, otherwise fallback to a default title
  //             agendaTitle: subMinute.agendaTitle,
  //             attachments: subMinute.minutesAttachmets,
  //             uploader: subMinute.userProfilePicture,
  //             lastUpdatedDate: subMinute.lastUpdatedDate,
  //             lastUpdatedTime: subMinute.lastUpdatedTime,
  //             userID: subMinute.userID,
  //             userName: subMinute.userName,
  //           })),
  //         };

  //         // Push the parent agenda object to the transformed data array
  //         transformedData.push(parentAgendaObj);
  //       }
  //     });

  //     // Log the transformed data to the console
  //     setMinutesData(transformedData);
  //     console.log("transformedData", transformedData);
  //   }
  // }, [NewMeetingreducer.agendaWiseMinutesReducer]);

  useEffect(() => {
    // Check if agendaWiseMinutesReducer is not null, undefined, and has at least one key
    if (
      NewMeetingreducer.agendaWiseMinutesReducer !== null &&
      NewMeetingreducer.agendaWiseMinutesReducer !== undefined &&
      Object.keys(NewMeetingreducer.agendaWiseMinutesReducer).length > 0
    ) {
      // Store agendaWiseMinutesReducer in a local variable
      let reducerData = NewMeetingreducer.agendaWiseMinutesReducer;
      // Initialize an empty array to hold the transformed data
      let transformedData = [];

      // Iterate through each parent agenda in the agenda hierarchy list
      reducerData.agendaHierarchyList.forEach((parentAgenda) => {
        // Find the parent agenda details in the agendaWiseMinutes array
        let parentAgendaMinutes = reducerData.agendaWiseMinutes.filter(
          (minute) => minute.agendaID === parentAgenda.pK_MAID
        );

        // Initialize an array to hold sub-minutes of the parent agenda
        let subMinutes = [];
        // Iterate through each child agenda of the parent agenda
        parentAgenda.childAgendas.forEach((childAgenda) => {
          // Filter the minutes that match the child agenda ID and push to subMinutes
          let childMinutes = reducerData.agendaWiseMinutes.filter(
            (minute) => minute.agendaID === childAgenda.pK_MAID
          );
          subMinutes.push(...childMinutes);
        });

        // Check if parent agenda details exist to determine if it's parent data
        let isParentData = parentAgendaMinutes.length > 0;

        // If there are parent agenda details or sub-minutes, create a parent agenda object
        if (isParentData || subMinutes.length > 0) {
          // If parent agenda details exist, use them, otherwise use childAgenda's parentTitle
          let agendaTitle = isParentData
            ? parentAgendaMinutes[0].agendaTitle
            : parentAgenda.childAgendas.find((childAgenda) =>
                subMinutes.some(
                  (minute) => minute.agendaID === childAgenda.pK_MAID
                )
              )?.parentTitle || "";

          let parentAgendaObj = {
            agendaID: parentAgenda.pK_MAID,
            agendaTitle: agendaTitle,
            isParentData: isParentData,
            minuteData: parentAgendaMinutes.map((minute) => ({
              minuteID: minute.minuteID,
              description: minute.minutesDetails,
              attachments: minute.minutesAttachmets,
              uploader: minute.userProfilePicture,
              lastUpdatedDate: minute.lastUpdatedDate,
              lastUpdatedTime: minute.lastUpdatedTime,
              userID: minute.userID,
              userName: minute.userName,
            })),
            subMinutes: parentAgenda.childAgendas.map((childAgenda) => {
              let childMinutes = subMinutes.filter(
                (minute) => minute.agendaID === childAgenda.pK_MAID
              );
              return {
                agendaID: childAgenda.pK_MAID,
                agendaTitle: childMinutes[0]?.agendaTitle || "",
                minuteData: childMinutes.map((minute) => ({
                  minuteID: minute.minuteID,
                  description: minute.minutesDetails,
                  attachments: minute.minutesAttachmets,
                  uploader: minute.userProfilePicture,
                  lastUpdatedDate: minute.lastUpdatedDate,
                  lastUpdatedTime: minute.lastUpdatedTime,
                  userID: minute.userID,
                  userName: minute.userName,
                })),
              };
            }),
          };

          // Push the parent agenda object to the transformed data array
          transformedData.push(parentAgendaObj);
        }
      });

      // Log the transformed data to the console
      setMinutesData(transformedData);
      console.log("transformedData", transformedData);
    }
  }, [NewMeetingreducer.agendaWiseMinutesReducer]);

  useEffect(() => {
    if (
      MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData !== null &&
      MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData !==
        undefined
    ) {
      setMinuteReviewData(
        MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData
      );
    } else {
      setMinuteReviewData(null);
    }
  }, [MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData]);

  console.log("minutesDataminutesData", minutesData);

  // When you click on Revision History Button then the api will hit and If minute has revison then open a modal
  const handleClickShowRevision = (data, MinuteID) => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
      MinuteID: Number(MinuteID),
      IsAgendaMinute: true,
    };
    dispatch(
      GetMinuteReviewDetailsByOrganizerByMinuteId_Api(
        Data,
        navigate,
        t,
        setShowRevisionHistory
      )
    );
  };

  // When you click on Show Verison History Button then the api will hit and If minute has Version History then open a modal
  const handleClickShowVersionHistory = (data, MinuteID) => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
      MinuteID: Number(MinuteID),
      IsAgendaMinute: true,
    };
    dispatch(
      GetMinutesVersionHistoryWithCommentsApi(
        Data,
        navigate,
        t,
        setShowVersionHistory
      )
    );
  };

  return (
    <section className={styles["agenda-wise-minutes"]}>
      {Number(editorRole.status) === 1 ||
      Number(editorRole.status) === 11 ||
      Number(editorRole.status) === 12 ? null : (editorRole.role ===
          "Organizer" &&
          Number(editorRole.status) === 9) ||
        (Number(editorRole.status) === 10 &&
          editorRole.role === "Organizer") ? (
        <>
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
                  <Select
                    options={agendaOptions}
                    maxMenuHeight={140}
                    value={{
                      value: agendaOptionvalue.value,
                      label: agendaOptionvalue.label,
                    }}
                    placeholder={t("Select-agenda")}
                    onChange={handleAgendaSelect}
                    isSearchable={false}
                  />
                  <ReactQuill
                    ref={editorRef}
                    theme="snow"
                    value={addNoteFields.Description.value || ""}
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
                      addNoteFields.Description.errorStatus &&
                      addNoteFields.Description.value === ""
                        ? ` ${styles["errorNotesMessage"]} `
                        : `${styles["errorNotesMessage_hidden"]}`
                    }
                  >
                    {addNoteFields.Description.errorMessage}
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
              <section className={styles["viewAgendaWiseAttachments"]}>
                {fileAttachments.length > 0 ? (
                  <>
                    <Row className="mt-1">
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
              <Row className="mt-2">
                <Col lg={12} md={12} sm={12}>
                  <Dragger
                    fileList={[]}
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
                      </span>{" "}
                      <span className={styles["here_text"]}>{t("Here")}</span>
                    </p>
                  </Dragger>
                </Col>
              </Row>
            </Col>
          </Row>
        </>
      ) : null}
      {minutesData.map((data, index) => {
        const isOpen = openIndices.includes(index);
        const isOpenReviewer = openReviewerDetail.includes(index);
        return (
          <Row className="mt-2">
            <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
              <>
                <div>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="mt-2">
                      <div
                        onClick={() =>
                          accordianClick(data, data.minuteID, index)
                        }
                        className={
                          isOpen
                            ? styles["agenda-wrapper-closed"]
                            : styles["agenda-wrapper-open"]
                        }
                      >
                        <p className={styles["agenda-title"]}>
                          {index + 1 + "." + " " + data.agendaTitle}
                        </p>
                        <span>
                          {data.minuteData.length > 0 &&
                          data?.minuteData[0]?.attachments.length > 0 ? (
                            <img
                              className={styles["Attachment"]}
                              alt=""
                              src={AttachmentIcon}
                            />
                          ) : null}
                          <img
                            alt=""
                            src={ArrowDown}
                            className={
                              isOpen
                                ? styles["Arrow"]
                                : styles["Arrow_Expanded"]
                            }
                          />
                        </span>
                      </div>
                    </Col>
                  </Row>
                  {isOpen ? (
                    <>
                      {isOpenReviewer && minuteReviewData !== null ? (
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div
                              className={styles["reviewer-progress-wrapper"]}
                            >
                              <Row>
                                <Col lg={11} md={11} sm={12}>
                                  <div
                                    className={styles["reviewer-progress-text"]}
                                  >
                                    <p className="m-0">{t("Total")} 03</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Accepted")} 01</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Rejected")} 01</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Pending")} 01</p>
                                  </div>
                                </Col>
                                <Col lg={1} md={1} sm={12} className="text-end">
                                  <img
                                    alt=""
                                    src={DropdownPurple}
                                    className={
                                      isOpenReviewer
                                        ? `${styles["Arrow"]} cursor-pointer`
                                        : `${styles["Arrow_Expanded"]} cursor-pointer`
                                    }
                                    onClick={() =>
                                      openCloseReviewerDetail(index)
                                    }
                                  />
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      ) : !isOpenReviewer && minuteReviewData !== null ? (
                        <Row>
                          <Col lg={12} md={12} sm={12}>
                            <div
                              className={styles["reviewer-progress-wrapper"]}
                            >
                              <Row>
                                <Col lg={11} md={11} sm={12}>
                                  <div
                                    className={styles["reviewer-progress-text"]}
                                  >
                                    <p className="m-0">{t("Total")} 03</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Accepted")} 01</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Rejected")} 01</p>
                                    <span>|</span>
                                    <p className="m-0">{t("Pending")} 01</p>
                                  </div>
                                </Col>
                                <Col lg={1} md={1} sm={12} className="text-end">
                                  <img
                                    alt=""
                                    src={DropdownPurple}
                                    className={
                                      isOpenReviewer
                                        ? `${styles["Arrow"]} cursor-pointer`
                                        : `${styles["Arrow_Expanded"]} cursor-pointer`
                                    }
                                    onClick={() =>
                                      openCloseReviewerDetail(index)
                                    }
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <p
                                    className={`${styles["text-wrapper-review"]}`}
                                  >
                                    <span className={styles["Review-accepted"]}>
                                      Review Accepted:
                                    </span>{" "}
                                    Alessandra Costa, Emily Davis, Matthew
                                    Jones, Christopher Martinez, Elizabeth
                                    Garcia, Olivia Nguyen, Ethan Patel, Madison
                                    Kim, Tyler Chen, Sophia Gupta, Mason Kumar,
                                    Ava Wong, Logan Singh, Jackson Li, Chloe
                                    Patel, Noah Patel, Lily Chang, Lucas Patel,
                                    Amelia Tran.
                                  </p>
                                  <p
                                    className={`${styles["text-wrapper-review"]}`}
                                  >
                                    <span className={styles["Review-declined"]}>
                                      Review Rejected:
                                    </span>{" "}
                                    Alex Rodriguez, Samantha Lee.
                                  </p>
                                  <p
                                    className={`${styles["text-wrapper-review"]}`}
                                  >
                                    <span className={styles["Review-pending"]}>
                                      Review Pending:
                                    </span>{" "}
                                    Sarah Jenkins, Joshua Clark, Megan
                                    Rodriguez, Brandon Young.
                                  </p>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      ) : null}
                      {data.isParentData ? (
                        <>
                          {data.minuteData.map((parentMinutedata, index) => (
                            <Row key={index}>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative"
                              >
                                <div className={styles["uploaded-details"]}>
                                  <img
                                    className={styles["delete-icon"]}
                                    src={DeleteIcon}
                                    alt=""
                                    onClick={() => {
                                      dispatch(deleteCommentModalAgenda(true));
                                      dispatch(
                                        DeleteMinuteReducer(parentMinutedata)
                                      );
                                    }}
                                  />
                                  <Row className={styles["inherit-height"]}>
                                    <Col lg={9} md={9} sm={12}>
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: parentMinutedata.description,
                                        }}
                                        className={styles["minutes-text"]}
                                      ></p>
                                      {parentMinutedata.attachments.length >
                                      0 ? (
                                        <Row>
                                          {parentMinutedata.attachments.map(
                                            (fileData, index) => (
                                              <Col lg={3} md={3} sm={12}>
                                                <AttachmentViewer
                                                  name={fileData.name}
                                                />
                                              </Col>
                                            )
                                          )}
                                        </Row>
                                      ) : null}
                                    </Col>
                                    <Col
                                      lg={3}
                                      md={3}
                                      sm={12}
                                      className="position-relative"
                                    >
                                      <Row className="m-0">
                                        <Col
                                          lg={9}
                                          md={9}
                                          sm={12}
                                          className="p-0"
                                        >
                                          <span
                                            className={styles["bar-line"]}
                                          ></span>
                                          <p
                                            className={styles["uploadedbyuser"]}
                                          >
                                            {t("Uploaded-by")}
                                          </p>
                                          <div className={styles["gap-ti"]}>
                                            <img
                                              src={`data:image/jpeg;base64,${parentMinutedata.uploader.displayProfilePictureName}`}
                                              className={styles["Image"]}
                                              alt=""
                                              draggable={false}
                                            />
                                            <p
                                              className={
                                                styles["agendaCreater"]
                                              }
                                            >
                                              {parentMinutedata.userName}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          className="d-grid justify-content-end p-0"
                                        >
                                          <div>
                                            <img
                                              className="cursor-pointer mx-2"
                                              src={EditIcon}
                                              alt=""
                                              onClick={() =>
                                                handleEditFunc(parentMinutedata)
                                              }
                                            />
                                            <div
                                              onClick={() =>
                                                menuPopupMinute(
                                                  parentMinutedata.minuteID
                                                )
                                              }
                                              className={styles["box-agendas"]}
                                              ref={closeMenuMinute}
                                            >
                                              <img
                                                className="cursor-pointer"
                                                src={MenuIcon}
                                                alt=""
                                              />
                                              <div
                                                className={
                                                  openMenuId ===
                                                  parentMinutedata.minuteID
                                                    ? `${
                                                        styles[
                                                          "popup-agenda-menu"
                                                        ]
                                                      } ${"opacity-1 pe-auto"}`
                                                    : `${
                                                        styles[
                                                          "popup-agenda-menu"
                                                        ]
                                                      } ${"opacity-0 pe-none"}`
                                                }
                                              >
                                                <span
                                                  onClick={
                                                    () =>
                                                      // handleClickShowRevision(
                                                      //   data,
                                                      //   parentMinutedata.minuteID
                                                      // )
                                                    setShowRevisionHistory(true)
                                                  }
                                                >
                                                  {t("Revisions")}
                                                  <p className="m-0"> 3 </p>
                                                </span>
                                                <span
                                                  onClick={() =>
                                                    // handleClickShowVersionHistory(
                                                    //   data,
                                                    //   parentMinutedata.minuteID
                                                    // )
                                                    setShowVersionHistory(true)
                                                  }
                                                  className="border-0"
                                                >
                                                  {t("Version-history")}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </Col>
                                      </Row>
                                      <Row>
                                        <Col lg={12} md={12} sm={12}>
                                          <p
                                            className={styles["time-uploader"]}
                                          >
                                            {convertToGMTMinuteTime(
                                              parentMinutedata.lastUpdatedDate +
                                                parentMinutedata.lastUpdatedTime
                                            ) + ","}
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}
                                          >
                                            {convertDateToGMTMinute(
                                              parentMinutedata.lastUpdatedDate +
                                                parentMinutedata.lastUpdatedTime
                                            )}
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          ))}
                        </>
                      ) : null}
                      {data.subMinutes.map((subMinuteData, subMinuteIndex) => {
                        const isOpenReviewerSubminute =
                          openReviewerDetailSubminute.includes(subMinuteIndex);
                        return (
                          <div>
                            {subMinuteData.minuteData.length === 0 ? null : (
                              <Row className="mx-50">
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["Parent-title-heading"]}>
                                    {index +
                                      1 +
                                      "." +
                                      subMinuteIndex +
                                      1 +
                                      " " +
                                      subMinuteData.agendaTitle}
                                  </p>
                                </Col>
                              </Row>
                            )}
                            {isOpenReviewerSubminute === false &&
                            minuteReviewData !== null ? (
                              <Row className="mxl-50">
                                <Col lg={12} md={12} sm={12}>
                                  <div
                                    className={
                                      styles["reviewer-progress-wrapper"]
                                    }
                                  >
                                    <Row>
                                      <Col lg={11} md={11} sm={12}>
                                        <div
                                          className={
                                            styles["reviewer-progress-text"]
                                          }
                                        >
                                          <p className="m-0">{t("Total")} 03</p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Accepted")} 01
                                          </p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Rejected")} 01
                                          </p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Pending")} 01
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className="text-end"
                                      >
                                        <img
                                          alt=""
                                          src={DropdownPurple}
                                          className={
                                            isOpenReviewerSubminute
                                              ? `${styles["Arrow"]} cursor-pointer`
                                              : `${styles["Arrow_Expanded"]} cursor-pointer`
                                          }
                                          onClick={() =>
                                            openCloseReviewerDetailSubminute(
                                              subMinuteIndex
                                            )
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            ) : isOpenReviewerSubminute === true &&
                              minuteReviewData !== null ? (
                              <Row className="mxl-50">
                                <Col lg={12} md={12} sm={12}>
                                  <div
                                    className={
                                      styles["reviewer-progress-wrapper"]
                                    }
                                  >
                                    <Row>
                                      <Col lg={11} md={11} sm={12}>
                                        <div
                                          className={
                                            styles["reviewer-progress-text"]
                                          }
                                        >
                                          <p className="m-0">{t("Total")} 03</p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Accepted")} 01
                                          </p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Rejected")} 01
                                          </p>
                                          <span>|</span>
                                          <p className="m-0">
                                            {t("Pending")} 01
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className="text-end"
                                      >
                                        <img
                                          alt=""
                                          src={DropdownPurple}
                                          className={
                                            openReviewerDetailSubminute
                                              ? `${styles["Arrow"]} cursor-pointer`
                                              : `${styles["Arrow_Expanded"]} cursor-pointer`
                                          }
                                          onClick={() =>
                                            openCloseReviewerDetailSubminute(
                                              subMinuteIndex
                                            )
                                          }
                                        />
                                      </Col>
                                    </Row>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={
                                              styles["Review-accepted"]
                                            }
                                          >
                                            Review Accepted:
                                          </span>{" "}
                                          Alessandra Costa, Emily Davis, Matthew
                                          Jones, Christopher Martinez, Elizabeth
                                          Garcia, Olivia Nguyen, Ethan Patel,
                                          Madison Kim, Tyler Chen, Sophia Gupta,
                                          Mason Kumar, Ava Wong, Logan Singh,
                                          Jackson Li, Chloe Patel, Noah Patel,
                                          Lily Chang, Lucas Patel, Amelia Tran.
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={
                                              styles["Review-declined"]
                                            }
                                          >
                                            Review Rejected:
                                          </span>{" "}
                                          Alex Rodriguez, Samantha Lee.
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}
                                        >
                                          <span
                                            className={styles["Review-pending"]}
                                          >
                                            Review Pending:
                                          </span>{" "}
                                          Sarah Jenkins, Joshua Clark, Megan
                                          Rodriguez, Brandon Young.
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            ) : null}
                            {subMinuteData.minuteData.map(
                              (minuteDataSubminute) => (
                                <Row className="mxl-50">
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="position-relative"
                                  >
                                    <div
                                      className={
                                        styles["version-control-wrapper"]
                                      }
                                    >
                                      <span></span>
                                    </div>
                                    <div className={styles["uploaded-details"]}>
                                      <Row className={styles["inherit-height"]}>
                                        <Col lg={9} md={9} sm={12}>
                                          <p
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                minuteDataSubminute.description,
                                            }}
                                            className={styles["minutes-text"]}
                                          ></p>
                                          {minuteDataSubminute.attachments
                                            .length > 0 ? (
                                            <Row>
                                              {minuteDataSubminute.attachments.map(
                                                (subFileData, subFileIndex) => (
                                                  <Col lg={3} md={3} sm={12}>
                                                    <AttachmentViewer
                                                      name={subFileData.name}
                                                    />
                                                  </Col>
                                                )
                                              )}
                                            </Row>
                                          ) : null}
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          className="position-relative"
                                        >
                                          <Row className="m-0">
                                            <Col
                                              lg={9}
                                              md={9}
                                              sm={12}
                                              className="p-0"
                                            >
                                              <span
                                                className={styles["bar-line"]}
                                              ></span>
                                              <p
                                                className={
                                                  styles["uploadedbyuser"]
                                                }
                                              >
                                                {t("Uploaded-by")}
                                              </p>
                                              <div className={styles["gap-ti"]}>
                                                <img
                                                  src={`data:image/jpeg;base64,${minuteDataSubminute.uploader.displayProfilePictureName}`}
                                                  className={styles["Image"]}
                                                  alt=""
                                                  draggable={false}
                                                />
                                                <p
                                                  className={
                                                    styles["agendaCreater"]
                                                  }
                                                >
                                                  {minuteDataSubminute.userName}
                                                </p>
                                              </div>
                                            </Col>
                                            <Col
                                              lg={3}
                                              md={3}
                                              sm={12}
                                              className="d-grid justify-content-end p-0"
                                            >
                                              <div>
                                                <img
                                                  className="cursor-pointer mx-2"
                                                  src={EditIcon}
                                                  alt=""
                                                  onClick={() =>
                                                    handleEditFunc(
                                                      minuteDataSubminute
                                                    )
                                                  }
                                                />
                                                <div
                                                  onClick={() =>
                                                    menuPopupMinute(
                                                      minuteDataSubminute.minuteID
                                                    )
                                                  }
                                                  className={
                                                    styles["box-agendas"]
                                                  }
                                                  ref={closeMenuMinute}
                                                >
                                                  <img
                                                    className="cursor-pointer"
                                                    src={MenuIcon}
                                                    alt=""
                                                  />
                                                  <div
                                                    className={
                                                      openMenuId ===
                                                      minuteDataSubminute.minuteID
                                                        ? `${
                                                            styles[
                                                              "popup-agenda-menu"
                                                            ]
                                                          } ${"opacity-1 pe-auto"}`
                                                        : `${
                                                            styles[
                                                              "popup-agenda-menu"
                                                            ]
                                                          } ${"opacity-0 pe-none"}`
                                                    }
                                                  >
                                                    <span
                                                      onClick={() =>
                                                        // handleClickShowRevision(
                                                        //   data,
                                                        //   minuteDataSubminute.minuteID
                                                        // )
                                                    setShowRevisionHistory(true)

                                                      }
                                                    >
                                                      {t("Revisions")}
                                                      <p className="m-0"> 3 </p>
                                                    </span>
                                                    <span
                                                      onClick={() =>
                                                        // handleClickShowVersionHistory(
                                                        //   data,
                                                        //   minuteDataSubminute.minuteID
                                                        // )
                                                        setShowVersionHistory(
                                                          true
                                                        )
                                                      }
                                                      className="border-0"
                                                    >
                                                      {t("Version-history")}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            </Col>
                                          </Row>
                                          <Row>
                                            <Col lg={12} md={12} sm={12}>
                                              <p
                                                className={
                                                  styles["time-uploader"]
                                                }
                                              >
                                                {convertToGMTMinuteTime(
                                                  minuteDataSubminute.lastUpdatedDate +
                                                    minuteDataSubminute.lastUpdatedTime
                                                ) + ","}
                                              </p>
                                              <p
                                                className={
                                                  styles["date-uploader"]
                                                }
                                              >
                                                {convertDateToGMTMinute(
                                                  minuteDataSubminute.lastUpdatedDate +
                                                    minuteDataSubminute.lastUpdatedTime
                                                )}
                                              </p>
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </div>
                                    <img
                                      className={styles["delete-icon"]}
                                      src={DeleteIcon}
                                      alt=""
                                      onClick={() => {
                                        dispatch(
                                          deleteCommentModalAgenda(true)
                                        );
                                        dispatch(
                                          DeleteMinuteReducer(
                                            minuteDataSubminute
                                          )
                                        );
                                      }}
                                    />
                                  </Col>
                                </Row>
                              )
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : null}
                </div>
              </>
            </Col>
          </Row>
        );
      })}

      {MinutesReducer.deleteMinuteAgenda ? (
        <DeleteCommentAgenda
          advanceMeetingModalID={advanceMeetingModalID}
          setAddNoteFields={setAddNoteFields}
          addNoteFields={addNoteFields}
          setFileAttachments={setFileAttachments}
        />
      ) : null}

      {showVersionHistory ? (
        <VersionHistory
          showVersionHistory={showVersionHistory}
          setShowVersionHistory={setShowVersionHistory}
        />
      ) : null}

      {showRevisionHistory ? (
        <RevisionHistory
          showRevisionHistory={showRevisionHistory}
          setShowRevisionHistory={setShowRevisionHistory}
        />
      ) : null}

      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </section>
  );
};

export default AgendaWise;
