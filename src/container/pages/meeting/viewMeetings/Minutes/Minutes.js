import React, { useEffect, useState } from "react";
import styles from "./Minutes.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  AttachmentViewer,
  Button,
  Notification,
} from "../../../../../components/elements";
import DeleteCommentGeneral from "./deleteCommentModal/DeleteCommentGeneral";
import { Col, Row } from "react-bootstrap";
import ReactQuill, { Quill } from "react-quill";
import { useRef } from "react";
import { Tooltip, Upload } from "antd";
import featherupload from "../../../../../assets/images/featherupload.svg";
import DropdownPurple from "./Images/Dropdown-Purple.png";
import MenuIcon from "./Images/MenuIcon.png";
import WarningIcon from "../../../../../assets/images/warning.png";
import UnsavedMinutes from "./UnsavedFileUploadMinutes/UnsavedMinutes";
import RedCroseeIcon from "../../../../../assets/images/CrossIcon.svg";
import {
  ADDGeneralMinutesApiFunc,
  CleareMessegeNewMeeting,
  RetriveDocumentsMeetingGenralMinutesApiFunc,
  SaveMinutesDocumentsApiFunc,
  UpdateMinutesGeneralApiFunc,
  GetAllGeneralMinutesApiFunc,
  GetAllAgendaWiseMinutesApiFunc,
  showUnsaveMinutesFileUpload,
  uploadDocumentsMeetingMinutesApi,
  cleareAllState,
  InviteToCollaborateMinutesApiFunc,
  saveFilesMeetingMinutesApi,
  DocumentsOfMeetingGenralMinutesApiFunc,
  AllDocumentsForAgendaWiseMinutesApiFunc,
} from "../../../../../store/actions/NewMeetingActions";
import AgendaWise from "./AgendaWise/AgendaWise";
import AddReviewers from "./AddReviewersModal/AddReviewers";
import AttachmentIcon from "./Images/Attachment-Icon.png";
import ArrowDown from "./Images/Arrow-Down.png";
import EditIcon from "./Images/Edit-Icon.png";
import {
  convertToGMTMinuteTime,
  convertDateToGMTMinute,
} from "../../../../../commen/functions/time_formatter";
import VersionHistory from "./AgendaWise/VersionHistoryModal/VersionHistory";
import RevisionHistory from "./AgendaWise/RevisionHistoryModal/RevisionHistory";
import {
  DeleteMinuteReducer,
  GetMinuteReviewDetailsByOrganizerByMinuteId_Api,
  GetMinutesVersionHistoryWithCommentsApi,
  deleteCommentModalGeneral,
  GetMinuteReviewStatsForOrganizerByMeetingId,
  CleareMessegeMinutes,
  GetPublishedMeetingMinutesApi,
  GetAllOrganizationUsersForReview,
  GetMinuteReviewFlowByMeetingId,
  GetStatsForPublishingMinutesByWorkFlowId,
} from "../../../../../store/actions/Minutes_action";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";
import { DataRoomDownloadFileApiFunc } from "../../../../../store/actions/DataRoom_actions";
import { getFileExtension } from "../../../../DataRoom/SearchFunctionality/option";
import {
  fileFormatforSignatureFlow,
  removeHTMLTagsAndTruncate,
} from "../../../../../commen/functions/utils";
import ApprovalIncompleteModal from "./approvalIncompleteModal/ApprovalIncompleteModal";
import PublishAnywayModal from "./publishAnywayModal/PublishAnywayModal";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../context/MeetingContext";

const Minutes = () => {
  // Newly Implemented
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    editorRole,
    setMinutes,
    advanceMeetingModalID,
    setViewAdvanceMeetingModal,
    setMeetingMaterial,
    setactionsPage,
  } = useMeetingContext();

  let userID = localStorage.getItem("userID");
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  let currentLanguage = localStorage.getItem("i18nextLng");
  let currentDate = getCurrentDateTimeUTC();
  let currentDateOnly = currentDate.slice(0, 8);
  const editorRef = useRef(null);
  const { Dragger } = Upload;

  let isAgenda = false;

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  //All REviewers List
  const [allReviewers, setAllReviewers] = useState([]);

  const generalminutesDocumentForMeeting = useSelector(
    (state) => state.NewMeetingreducer.generalminutesDocumentForMeeting
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

  const ResponseMessageMinute = useSelector(
    (state) => state.MinutesReducer.ResponseMessage
  );
  // Initialize previousFileList to an empty array
  let previousFileList = [];
  const [fileSize, setFileSize] = useState(0);
  const [useCase, setUseCase] = useState(null);
  const [isMinutePublishable, setIsMinutePublishable] = useState(false);
  const [fileForSend, setFileForSend] = useState([]);
  const [general, setGeneral] = useState(true);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [agenda, setAgenda] = useState(false);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [isEdit, setisEdit] = useState(false);
  const [updateData, setupdateData] = useState(null);
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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

  let isMinutePublished = localStorage.getItem("isMinutePublished");

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

  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    let Data2 = {
      isAgenda: false,
      MeetingID: Number(advanceMeetingModalID),
    };

    if (JSON.parse(isMinutePublished) === true) {
      dispatch(GetPublishedMeetingMinutesApi(Data, navigate, t));
      let MeetingDocs = {
        MDID: Data.MeetingID,
      };
      dispatch(
        DocumentsOfMeetingGenralMinutesApiFunc(navigate, MeetingDocs, t)
      );
      dispatch(
        AllDocumentsForAgendaWiseMinutesApiFunc(navigate, MeetingDocs, t)
      );
    } else {
      dispatch(
        GetAllGeneralMinutesApiFunc(navigate, t, Data, advanceMeetingModalID)
      );

      dispatch(GetMinuteReviewStatsForOrganizerByMeetingId(Data2, navigate, t));
    }

    dispatch(GetMinuteReviewFlowByMeetingId(Data, navigate, t));
    return () => {
      setUseCase(null);
      setFileAttachments([]);
      setPreviousFileIDs([]);
      dispatch(cleareAllState());
    };
  }, [isMinutePublished]);

  const onTextChange = (content, delta, source) => {
    if (source === "user") {
      const containsImage = delta.ops?.some((op) => op.insert?.image);

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
        let isEmptyContent = content === "<p><br></p>";
        if (String(content).length >= 501) {
          console.log(
            removeHTMLTagsAndTruncate(String(content)),
            removeHTMLTagsAndTruncate(String(content)).length,
            "Test String"
          );
          setAddNoteFields({
            ...addNoteFields,
            Description: {
              value: removeHTMLTagsAndTruncate(String(content)),
              errorMessage: "",
              errorStatus: false,
            },
          });
        } else {
          setAddNoteFields({
            ...addNoteFields,
            Description: {
              value: isEmptyContent ? "" : content,
              errorMessage: "",
              errorStatus: false,
            },
          });
        }

        console.log(String(content).length, content, "String Length ....");
      }
    }
  };

  console.log("addNoteFieldsaddNoteFields", addNoteFields);
  console.log(isMinutePublishable, "isMinutePublishable");
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
      console.log("testtesttest", fileAttachments, fileList);
      if (fileList.length > 10) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
        return;
      } else {
        if (fileAttachments.length > 9) {
          showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
          return;
        } else {
          fileList.forEach((fileData, index) => {
            if (fileData.size > 10485760) {
              size = false;
            } else if (fileData.size === 0) {
              sizezero = false;
            }

            let fileExists = fileAttachments.some(
              (oldFileData) =>
                oldFileData.DisplayAttachmentName === fileData.name
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
              setFileAttachments((prevAttachments) => [
                ...prevAttachments,
                file,
              ]);
              fileSizeArr += fileData.originFileObj.size;
              setFileForSend((prevFiles) => [
                ...prevFiles,
                fileData.originFileObj,
              ]);
              setFileSize(fileSizeArr);
            }
          });
          // Update previousFileList to current fileList
          previousFileList = fileList;
        }
      }
    },
    onDrop(e) {},
    customRequest() {},
  };

  //Edit Button Function
  const handleEditFunc = async (data) => {
    setupdateData(data);
    if (data.description !== "") {
      setAddNoteFields({
        Description: {
          value: data.description,
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

  const handleGeneralButtonClick = () => {
    let Meet = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(
      GetAllGeneralMinutesApiFunc(navigate, t, Meet, advanceMeetingModalID)
    );
    let Data2 = {
      isAgenda: false,
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetMinuteReviewStatsForOrganizerByMeetingId(Data2, navigate, t));
    setAgenda(false);
    setGeneral(true);
  };

  const handleAddClick = async () => {
    if (addNoteFields.Description.value !== "") {
      let Data = {
        MeetingID: advanceMeetingModalID,
        MinuteText: addNoteFields.Description.value,
      };
      dispatch(
        ADDGeneralMinutesApiFunc(navigate, t, Data, advanceMeetingModalID)
      );
    } else {
      setAddNoteFields({
        ...addNoteFields,
        Description: {
          value: addNoteFields.Description.value,
          errorMessage:
            addNoteFields.Description.value === ""
              ? t("Minutes-text-is-required")
              : addNoteFields.Description.errorMessage,
          errorStatus:
            addNoteFields.Description.value === ""
              ? true
              : addNoteFields.Description.errorStatus,
        },
      });
    }
  };

  console.log("addNoteFieldsaddNoteFields", addNoteFields);

  const documentUploadingFunc = async (minuteID) => {
    let newFolder = [];
    let newfile = [];
    if (Object.keys(fileForSend).length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsMeetingMinutesApi(
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
        saveFilesMeetingMinutesApi(navigate, t, newfile, folderID, newFolder)
      );
      let docsData = {
        FK_MeetingGeneralMinutesID: minuteID,
        FK_MDID: advanceMeetingModalID,
        UpdateFileList: newFolder.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };
      dispatch(
        SaveMinutesDocumentsApiFunc(
          navigate,
          docsData,
          t,
          advanceMeetingModalID
        )
      );
    } else {
      let Meet = {
        MeetingID: Number(advanceMeetingModalID),
      };
      await dispatch(
        GetAllGeneralMinutesApiFunc(navigate, t, Meet, advanceMeetingModalID)
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

  //Download the document
  const downloadDocument = (record) => {
    let data = {
      FileID: record.pK_FileID,
    };
    dispatch(
      DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
    );
  };

  const pdfData = (record, ext) => {
    console.log("PDFDATAPDFDATA", record);
    let Data = {
      taskId: 1,
      commingFrom: 4,
      fileName: record[0].displayFileName,
      attachmentID: record[0].pK_FileID,
    };
    let pdfDataJson = JSON.stringify(Data);
    if (fileFormatforSignatureFlow.includes(ext)) {
      window.open(
        `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
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
    setisEdit(false);
    setFileAttachments([]);
    setFileForSend([]);
    setPreviousFileIDs([]);
  };

  //Updating the text of min
  const handleUpdateFunc = async () => {
    let Data = {
      MinuteID: updateData.minuteID,
      MinuteText: addNoteFields.Description.value,
    };

    let fileUploadFlag = Object.keys(fileForSend).length > 0;

    dispatch(
      UpdateMinutesGeneralApiFunc(
        navigate,
        Data,
        t,
        false,
        null,
        false,
        false,
        false,
        false,
        false,
        fileUploadFlag
      )
    );

    let newfile = [...previousFileIDs];
    let fileObj = [];

    if (Object.keys(fileForSend).length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsMeetingMinutesApi(
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
        saveFilesMeetingMinutesApi(navigate, t, fileObj, folderID, newfile)
      );
    }

    let docsData = {
      FK_MeetingGeneralMinutesID: updateData.minuteID,
      FK_MDID: advanceMeetingModalID,
      UpdateFileList:
        newfile.length > 0
          ? newfile.map((data) => ({ PK_FileID: Number(data.pK_FileID) }))
          : [],
    };

    await dispatch(
      SaveMinutesDocumentsApiFunc(navigate, docsData, t, advanceMeetingModalID)
    );

    setFileAttachments([]);
    setFileForSend([]);
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

  //Invite To Collaborate

  const handleInvitetoCollaborateView = () => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(InviteToCollaborateMinutesApiFunc(navigate, Data, t));
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
  };

  useEffect(() => {
    if (
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available") &&
      ResponseMessage !== t("Something-went-wrong") &&
      ResponseMessage !== t("Record-available")
    ) {
      showMessage(ResponseMessage, "success", setOpen);
      dispatch(CleareMessegeNewMeeting());
    } else {
      dispatch(CleareMessegeNewMeeting());
    }
    if (
      ResponseMessageMinute !== t("No-record-found") &&
      ResponseMessageMinute !== t("No-records-found") &&
      ResponseMessageMinute !== "" &&
      ResponseMessageMinute !== t("Record-found") &&
      ResponseMessageMinute !== t("List-updated-successfully") &&
      ResponseMessageMinute !== t("No-data-available") &&
      ResponseMessageMinute !== t("Minute-review-flow-stats-not-available") &&
      ResponseMessageMinute !== t("Minute-review-flow-not-found") &&
      ResponseMessageMinute !== t("Something-went-wrong") &&
      ResponseMessageMinute !== t("Record-available")
    ) {
      showMessage(ResponseMessageMinute, "success", setOpen);
      dispatch(CleareMessegeMinutes());
    } else {
      dispatch(CleareMessegeMinutes());
    }
  }, [ResponseMessage, ResponseMessageMinute]);

  // OWAIS WORK cxx|:::::::>

  const [openMenuId, setOpenMenuId] = useState(null);

  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const [openReviewerDetail, setOpenReviewerDetail] = useState([]);

  const [minuteReviewData, setMinuteReviewData] = useState(null);

  const [minutesData, setMinutesData] = useState([]);
  console.log(minutesData, "minutesDataminutesData");
  const [minutesDataAgenda, setMinutesDataAgenda] = useState(null);

  const [publishMinutesDataAgenda, setPublishMinutesDataAgenda] = useState([]);
  const [publishMinutesDataGeneral, setPublishMinutesDataGeneral] = useState(
    []
  );

  const [openIndices, setOpenIndices] = useState([]);
  const [openIndicesGeneral, setOpenIndicesGeneral] = useState([]);

  const [addReviewers, setAddReviewers] = useState(false);

  const [deadLineDate, setDeadLineDate] = useState(null);

  const [approvalModal, setApprovalModal] = useState(false);
  const [publishAnywayModal, setPublishAnywayModal] = useState(false);

  const closeMenuMinute = useRef(null);

  const addReviewersModal = async () => {
    let newData = {
      MeetingID: Number(advanceMeetingModalID),
    };

    await dispatch(
      GetAllOrganizationUsersForReview(navigate, t, setAllReviewers)
    );

    await dispatch(GetMinuteReviewFlowByMeetingId(newData, navigate, t));

    await dispatch(
      GetAllGeneralMinutesApiFunc(
        navigate,
        t,
        newData,
        Number(advanceMeetingModalID)
      )
    );

    await dispatch(
      GetAllAgendaWiseMinutesApiFunc(
        navigate,
        newData,
        t,
        Number(advanceMeetingModalID),
        false,
        false,
        true
      )
    );

    await setAddReviewers(true);
  };

  const accordianClick = (data, id, index) => {
    setOpenIndices((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const accordianClickGeneral = (data, id, index) => {
    setOpenIndicesGeneral((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const openCloseReviewerDetail = (index) => {
    setOpenReviewerDetail((prevIndices) =>
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index]
    );
  };

  const menuPopupMinute = (id) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle the menu for the clicked item
  };

  const transformData = (data, generalMinutesData) => {
    if (!data || !generalMinutesData) return [];

    return data.map((item) => {
      const matchedMinute = generalMinutesData.find(
        (minute) => minute.pK_MeetingGeneralMinutesID === item.minuteID
      );

      const updatedAttachments = matchedMinute
        ? (item.minutesAttachmets || []).map((attachment) => {
            const matchedFile = (matchedMinute.files || []).find(
              (file) => file.pK_FileID === attachment.fileID
            );
            return matchedFile ? matchedFile : attachment;
          })
        : item.minutesAttachmets || [];

      return {
        minuteID: item.minuteID,
        description: item.minutesDetails || "",
        attachments: updatedAttachments,
        uploader: {
          userID: item.userID || null,
          orignalProfilePictureName:
            item.userProfilePicture?.orignalProfilePictureName || "",
          displayProfilePictureName:
            item.userProfilePicture?.displayProfilePictureName || "",
        },
        lastUpdatedDate: item.lastUpdatedDate || "",
        lastUpdatedTime: item.lastUpdatedTime || "",
        userID: item.userID || null,
        userName: item.userName || "",
        isEditable: item.isEditable,
      };
    });
  };

  const transformAgendaData = (documentsData, agendaData) => {
    if (!documentsData || !agendaData) return [];

    const updateMinutesAttachments = (agendaMinutes, documentsData) => {
      return agendaMinutes.map((minute) => {
        const matchedDocument = documentsData.find(
          (doc) => doc.pK_MeetingAgendaMinutesID === minute.minuteID
        );

        const updatedAttachments = matchedDocument
          ? (minute.minutesAttachmets || []).map((attachment) => {
              const matchedFile = (matchedDocument.files || []).find(
                (file) => file.pK_FileID === attachment.fileID
              );
              return matchedFile ? matchedFile : attachment;
            })
          : minute.minutesAttachmets || [];

        return {
          ...minute,
          minutesAttachmets: updatedAttachments,
        };
      });
    };

    const transformChildAgendas = (childAgendas, documentsData) => {
      return childAgendas.map((child) => ({
        ...child,
        agendaMinutes: updateMinutesAttachments(
          child.agendaMinutes,
          documentsData
        ),
        childAgendas: transformChildAgendas(child.childAgendas, documentsData),
      }));
    };

    return agendaData.map((agenda) => ({
      ...agenda,
      agendaMinutes: updateMinutesAttachments(
        agenda.agendaMinutes,
        documentsData
      ),
      childAgendas: transformChildAgendas(agenda.childAgendas, documentsData),
    }));
  };

  const transformDataPublishGeneral = (documentsData, dataToTransform) => {
    if (!documentsData || !dataToTransform) return [];

    return dataToTransform.map((item) => {
      const matchedMinute = documentsData.find(
        (minute) => minute.pK_MeetingGeneralMinutesID === item.minuteID
      );

      const updatedAttachments = matchedMinute
        ? (item.minutesAttachmets || []).map((attachment) => {
            const matchedFile = (matchedMinute.files || []).find(
              (file) => file.pK_FileID === attachment.fileID
            );
            return matchedFile ? matchedFile : attachment;
          })
        : item.minutesAttachmets || [];

      return {
        ...item,
        minutesAttachmets: updatedAttachments,
      };
    });
  };

  useEffect(() => {
    try {
      const generalMinutes = NewMeetingreducer.generalMinutes;

      if (generalMinutes && Object.keys(generalMinutes).length > 0) {
        const minutesData = generalMinutes.meetingMinutes;
        // Ensure generalMinutesDocumentForMeeting is defined
        const documentsData = generalminutesDocumentForMeeting.data;
        const combinedData = transformData(minutesData, documentsData);

        if (
          MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData &&
          MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData
            .minuteReviewStatsModelList &&
          MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData
            .minuteReviewStatsModelList.length > 0
        ) {
          const { minuteReviewStatsModelList } =
            MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData;

          const updatedCombinedData = combinedData.map((combinData) => {
            const matchedStats = minuteReviewStatsModelList.find(
              (minuteStatsData) =>
                combinData.minuteID === minuteStatsData.minuteID
            );
            return matchedStats
              ? { ...combinData, MinuteStats: matchedStats }
              : combinData;
          });

          setMinutesData(updatedCombinedData);
        } else {
          setMinutesData(combinedData);
        }
      } else {
        setMinutesData([]);
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinutesData([]);
    }

    return () => {
      setMinutesData([]);
    };
  }, [
    NewMeetingreducer.generalMinutes,
    MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData,
  ]);

  useEffect(() => {
    if (
      NewMeetingreducer.agendaWiseMinutesReducer !== null &&
      NewMeetingreducer.agendaWiseMinutesReducer !== undefined
    ) {
      setMinutesDataAgenda(NewMeetingreducer.agendaWiseMinutesReducer);
    } else {
      setMinutesDataAgenda(null);
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

  useEffect(() => {
    if (
      MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== null &&
      MinutesReducer.GetMinuteReviewFlowByMeetingIdData !== undefined
    ) {
      setDeadLineDate(
        MinutesReducer.GetMinuteReviewFlowByMeetingIdData.workFlow.workFlow.deadlineDatetime.slice(
          0,
          8
        )
      );
      setIsMinutePublishable(
        MinutesReducer.GetMinuteReviewFlowByMeetingIdData.isMinutePublishable
      );
    } else {
      setDeadLineDate(null);
      setIsMinutePublishable(false);
    }
  }, [MinutesReducer.GetMinuteReviewFlowByMeetingIdData]);

  // When you click on Show Verison History Button then the api will hit and If minute has Version History then open a modal
  const handleClickShowVersionHistory = (data, MinuteID) => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
      MinuteID: Number(MinuteID),
      IsAgendaMinute: false,
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

  // When you click on Revision History Button then the api will hit and If minute has revison then open a modal
  const handleClickShowRevision = (data, MinuteID) => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
      MinuteID: Number(MinuteID),
      IsAgendaMinute: false,
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

  const publishMeetingMinutes = () => {
    // let Data = { MeetingID: Number(advanceMeetingModalID) };
    let workFlowID =
      MinutesReducer.GetMinuteReviewFlowByMeetingIdData.workFlow.workFlow
        .pK_WorkFlow_ID;
    let Data = { WorkFlowID: workFlowID };
    dispatch(
      GetStatsForPublishingMinutesByWorkFlowId(
        Data,
        navigate,
        t,
        setApprovalModal,
        setPublishAnywayModal
      )
    );
  };

  useEffect(() => {
    if (
      MinutesReducer.GetPublishedMinutes !== null &&
      MinutesReducer.GetPublishedMinutes !== undefined &&
      NewMeetingreducer?.getallDocumentsForAgendaWiseMinutes &&
      generalminutesDocumentForMeeting
    ) {
      let dataToTransform =
        MinutesReducer?.GetPublishedMinutes?.generalPublishedMinutes;
      let dataToTransformAgenda =
        MinutesReducer?.GetPublishedMinutes?.agendaWisePublishedMinutes;
      let documentDataAgenda =
        NewMeetingreducer?.getallDocumentsForAgendaWiseMinutes?.data;
      let documentsData = generalminutesDocumentForMeeting?.data;
      const resultedData = transformDataPublishGeneral(
        documentsData,
        dataToTransform
      );
      const resultedDataAgenda = transformAgendaData(
        documentDataAgenda,
        dataToTransformAgenda
      );
      console.log(
        {
          resultedData,
          documentDataAgenda,
          dataToTransformAgenda,
          dataToTransform,
          resultedDataAgenda,
        },
        "resultedDataresultedData"
      );

      setPublishMinutesDataGeneral(resultedData);
      setPublishMinutesDataAgenda(resultedDataAgenda);
    }
  }, [
    MinutesReducer.GetPublishedMinutes,
    generalminutesDocumentForMeeting,
    NewMeetingreducer?.getallDocumentsForAgendaWiseMinutes,
  ]);
  console.log({ publishMinutesDataGeneral }, "resultedDataresultedData");
  console.log({ publishMinutesDataAgenda }, "resultedDataresultedData");

  return JSON.parse(isMinutePublished) ? (
    <>
      {publishMinutesDataAgenda.map((data, index) => {
        const isOpen = openIndices.includes(index);
        const hasAttachments = data?.childAgendas?.some((childAgendaData) =>
          childAgendaData?.agendaMinutes?.some(
            (childAgendaMinuteData) =>
              childAgendaMinuteData?.minutesAttachmets?.length > 0
          )
        );
        return (
          <Row className='mt-2'>
            <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
              <>
                <div>
                  <Row>
                    <Col lg={12} md={12} sm={12} className='mt-2'>
                      <div
                        onClick={() =>
                          accordianClick(data, data.agendaID, index)
                        }
                        className={
                          isOpen
                            ? styles["agenda-wrapper-closed"]
                            : styles["agenda-wrapper-open"]
                        }>
                        <p className={styles["agenda-title"]}>
                          {index + 1 + "." + " " + data.agendaTitle}
                        </p>
                        <span className='d-flex justify-content-center align-items-center'>
                          {data?.agendaMinutes?.minutesAttachmets?.length > 0 ||
                          hasAttachments ? (
                            <img
                              className={styles["Attachment"]}
                              alt=''
                              src={AttachmentIcon}
                            />
                          ) : null}
                          <img
                            alt=''
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
                      {data.agendaMinutes.map(
                        (parentMinuteData, subMinuteIndex) => {
                          const maxVisibleImages = 4;
                          const approvedByUsers =
                            parentMinuteData.approvedByUsers;
                          const visibleApprovedUsers = approvedByUsers.slice(
                            0,
                            maxVisibleImages
                          );
                          const remainingCount =
                            approvedByUsers.length - maxVisibleImages;
                          return (
                            <div>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className='position-relative'>
                                  <div
                                    className={
                                      styles["version-control-wrapper"]
                                    }>
                                    <span></span>
                                  </div>
                                  <div className={styles["uploaded-details"]}>
                                    <Row className={styles["inherit-height"]}>
                                      <Col lg={10} md={10} sm={12}>
                                        <p
                                          dangerouslySetInnerHTML={{
                                            __html:
                                              parentMinuteData.minutesDetails,
                                          }}
                                          className={
                                            styles["minutes-text"]
                                          }></p>
                                        {parentMinuteData.minutesAttachmets
                                          .length > 0 ? (
                                          <Row>
                                            {parentMinuteData.minutesAttachmets.map(
                                              (subFileData, subFileIndex) => (
                                                <Col lg={3} md={3} sm={12}>
                                                  <AttachmentViewer
                                                    handleClickDownload={() =>
                                                      downloadDocument(
                                                        subFileData
                                                      )
                                                    }
                                                    fk_UID={0}
                                                    handleClickRemove={() =>
                                                      handleRemoveFile(
                                                        subFileData
                                                      )
                                                    }
                                                    data={
                                                      parentMinuteData.minutesAttachmets
                                                    }
                                                    id={subFileData.pK_FileID}
                                                    name={
                                                      subFileData.displayFileName
                                                    }
                                                    handleEyeIcon={() =>
                                                      pdfData(
                                                        parentMinuteData.minutesAttachmets,
                                                        getFileExtension(
                                                          subFileData?.displayFileName
                                                        )
                                                      )
                                                    }
                                                  />
                                                  {/* <AttachmentViewer
                                                    id={0}
                                                    name={
                                                      subFileData.displayFileName
                                                    }
                                                  /> */}
                                                </Col>
                                              )
                                            )}
                                          </Row>
                                        ) : null}
                                      </Col>
                                      <Col
                                        lg={2}
                                        md={2}
                                        sm={12}
                                        className='position-relative'>
                                        <Row className='m-0'>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className='p-0'>
                                            <span
                                              className={
                                                styles["bar-line"]
                                              }></span>
                                            <p
                                              className={`${styles["uploadedbyuser"]} m-0`}>
                                              {t("Uploaded-by")}
                                            </p>
                                            <div className={styles["gap-ti"]}>
                                              <img
                                                src={`data:image/jpeg;base64,${parentMinuteData?.userProfilePicture?.displayProfilePictureName}`}
                                                className={styles["Image"]}
                                                alt=''
                                                draggable={false}
                                              />
                                              <p
                                                className={
                                                  styles["agendaCreater"]
                                                }>
                                                {parentMinuteData.userName}
                                              </p>
                                            </div>
                                            <p
                                              className={`${styles["uploadedbyuser"]} mt-3`}>
                                              {t("Approved-by")}
                                            </p>
                                            <div className={styles["gap-ti"]}>
                                              {visibleApprovedUsers.map(
                                                (
                                                  approvedUserList,
                                                  subFileIndex
                                                ) => (
                                                  <img
                                                    key={subFileIndex}
                                                    src={`data:image/jpeg;base64,${approvedUserList?.displayProfilePictureName}`}
                                                    className={styles["Image"]}
                                                    alt=''
                                                    draggable={false}
                                                  />
                                                )
                                              )}
                                              {remainingCount > 0 && (
                                                <span
                                                  className={
                                                    styles["reviewer-count"]
                                                  }>
                                                  +{remainingCount}
                                                </span>
                                              )}
                                            </div>
                                          </Col>
                                        </Row>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          );
                        }
                      )}

                      {data.childAgendas.map(
                        (childAgendaData, subMinuteIndex) => {
                          return (
                            <div>
                              <Row className='mx-50'>
                                <Col lg={12} md={12} sm={12}>
                                  <p className={styles["Parent-title-heading"]}>
                                    {index +
                                      1 +
                                      "." +
                                      subMinuteIndex +
                                      1 +
                                      " " +
                                      childAgendaData.agendaTitle}
                                  </p>
                                </Col>
                              </Row>
                              {childAgendaData.agendaMinutes.map(
                                (childAgendaMinuteData, subMinuteIndex) => {
                                  const maxVisibleImages = 4;
                                  const approvedByUsers =
                                    childAgendaMinuteData.approvedByUsers;
                                  const visibleApprovedUsers =
                                    approvedByUsers.slice(0, maxVisibleImages);
                                  const remainingCount =
                                    approvedByUsers.length - maxVisibleImages;
                                  return (
                                    <Row
                                      className={
                                        currentLanguage === "ar"
                                          ? "mxr-50"
                                          : "mxl-50"
                                      }>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className='position-relative'>
                                        <div
                                          className={
                                            styles["version-control-wrapper"]
                                          }>
                                          <span></span>
                                        </div>
                                        <div
                                          className={
                                            styles["uploaded-details"]
                                          }>
                                          <Row
                                            className={
                                              styles["inherit-height"]
                                            }>
                                            <Col lg={10} md={10} sm={12}>
                                              <p
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    childAgendaMinuteData.minutesDetails,
                                                }}
                                                className={
                                                  styles["minutes-text"]
                                                }></p>
                                              {childAgendaMinuteData
                                                .minutesAttachmets.length >
                                              0 ? (
                                                <Row>
                                                  {childAgendaMinuteData.minutesAttachmets.map(
                                                    (
                                                      subFileData,
                                                      subFileIndex
                                                    ) => (
                                                      <Col
                                                        lg={3}
                                                        md={3}
                                                        sm={12}>
                                                        {/* <AttachmentViewer
                                                          id={0}
                                                          name={
                                                            subFileData.displayFileName
                                                          }
                                                        /> */}
                                                        <AttachmentViewer
                                                          handleClickDownload={() =>
                                                            downloadDocument(
                                                              subFileData
                                                            )
                                                          }
                                                          fk_UID={0}
                                                          handleClickRemove={() =>
                                                            handleRemoveFile(
                                                              subFileData
                                                            )
                                                          }
                                                          data={
                                                            childAgendaMinuteData.minutesAttachmets
                                                          }
                                                          id={
                                                            subFileData.pK_FileID
                                                          }
                                                          name={
                                                            subFileData.displayFileName
                                                          }
                                                          handleEyeIcon={() =>
                                                            pdfData(
                                                              childAgendaMinuteData.minutesAttachmets,
                                                              getFileExtension(
                                                                subFileData?.displayFileName
                                                              )
                                                            )
                                                          }
                                                        />
                                                      </Col>
                                                    )
                                                  )}
                                                </Row>
                                              ) : null}
                                            </Col>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={12}
                                              className='position-relative'>
                                              <Row className='m-0'>
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className='p-0'>
                                                  <span
                                                    className={
                                                      styles["bar-line"]
                                                    }></span>
                                                  <p
                                                    className={`${styles["uploadedbyuser"]} m-0`}>
                                                    {t("Uploaded-by")}
                                                  </p>
                                                  <div
                                                    className={
                                                      styles["gap-ti"]
                                                    }>
                                                    <img
                                                      // src={DefaultAvatar}
                                                      src={`data:image/jpeg;base64,${childAgendaMinuteData?.userProfilePicture?.displayProfilePictureName}`}
                                                      className={
                                                        styles["Image"]
                                                      }
                                                      alt=''
                                                      draggable={false}
                                                    />
                                                    <p
                                                      className={
                                                        styles["agendaCreater"]
                                                      }>
                                                      {
                                                        childAgendaMinuteData.userName
                                                      }
                                                    </p>
                                                  </div>
                                                  <p
                                                    className={`${styles["uploadedbyuser"]} mt-3`}>
                                                    {t("Approved-by")}
                                                  </p>
                                                  <div
                                                    className={
                                                      styles["gap-ti"]
                                                    }>
                                                    {visibleApprovedUsers.map(
                                                      (
                                                        approvedUserList,
                                                        subFileIndex
                                                      ) => (
                                                        <img
                                                          key={subFileIndex}
                                                          src={`data:image/jpeg;base64,${approvedUserList?.displayProfilePictureName}`}
                                                          className={
                                                            styles["Image"]
                                                          }
                                                          alt=''
                                                          draggable={false}
                                                        />
                                                      )
                                                    )}
                                                    {remainingCount > 0 && (
                                                      <span
                                                        className={
                                                          styles[
                                                            "reviewer-count"
                                                          ]
                                                        }>
                                                        +{remainingCount}
                                                      </span>
                                                    )}
                                                  </div>
                                                </Col>
                                              </Row>
                                            </Col>
                                          </Row>
                                        </div>
                                      </Col>
                                    </Row>
                                  );
                                }
                              )}
                            </div>
                          );
                        }
                      )}
                    </>
                  ) : null}
                </div>
              </>
            </Col>
          </Row>
        );
      })}

      {publishMinutesDataGeneral.map((data, index) => {
        const isOpen = openIndicesGeneral.includes(index);
        const maxVisibleImages = 4;
        const approvedByUsers = data.approvedByUsers;
        const visibleApprovedUsers = approvedByUsers.slice(0, maxVisibleImages);
        const remainingCount = approvedByUsers.length - maxVisibleImages;
        return (
          <Row className='mt-2'>
            <Col lg={12} md={12} sm={12} className={styles["ScrollerMinutes"]}>
              <>
                <div>
                  <Row>
                    <Col lg={12} md={12} sm={12} className='mt-2'>
                      <div
                        onClick={() =>
                          accordianClickGeneral(data, data.minuteID, index)
                        }
                        className={
                          isOpen
                            ? styles["agenda-wrapper-closed"]
                            : styles["agenda-wrapper-open"]
                        }>
                        <p className={styles["agenda-title"]}>
                          {index + 1 + "." + " " + t("General-minute")}
                        </p>
                        <span className='d-flex justify-content-center align-items-center'>
                          {data.minutesAttachmets.length > 0 ? (
                            <img
                              className={styles["Attachment"]}
                              alt=''
                              src={AttachmentIcon}
                            />
                          ) : null}
                          <img
                            alt=''
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
                      <div>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className='position-relative'>
                            <div className={styles["version-control-wrapper"]}>
                              <span></span>
                            </div>
                            <div className={styles["uploaded-details"]}>
                              <Row className={styles["inherit-height"]}>
                                <Col lg={10} md={10} sm={12}>
                                  <p
                                    dangerouslySetInnerHTML={{
                                      __html: data.minutesDetails,
                                    }}
                                    className={styles["minutes-text"]}></p>
                                  {data.minutesAttachmets.length > 0 ? (
                                    <Row>
                                      {data.minutesAttachmets.map(
                                        (subFileData, subFileIndex) => (
                                          <Col lg={3} md={3} sm={12}>
                                            <AttachmentViewer
                                              handleClickDownload={() =>
                                                downloadDocument(subFileData)
                                              }
                                              fk_UID={0}
                                              handleClickRemove={() =>
                                                handleRemoveFile(subFileData)
                                              }
                                              data={data.minutesAttachmets}
                                              id={subFileData.pK_FileID}
                                              name={subFileData.displayFileName}
                                              handleEyeIcon={() =>
                                                pdfData(
                                                  data.minutesAttachmets,
                                                  getFileExtension(
                                                    subFileData?.displayFileName
                                                  )
                                                )
                                              }
                                            />
                                          </Col>
                                        )
                                      )}
                                    </Row>
                                  ) : null}
                                </Col>
                                <Col
                                  lg={2}
                                  md={2}
                                  sm={12}
                                  className='position-relative'>
                                  <Row className='m-0'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='p-0'>
                                      <span
                                        className={styles["bar-line"]}></span>
                                      <p
                                        className={`${styles["uploadedbyuser"]} m-0`}>
                                        {t("Uploaded-by")}
                                      </p>
                                      <div className={styles["gap-ti"]}>
                                        <img
                                          src={`data:image/jpeg;base64,${data?.userProfilePicture?.displayProfilePictureName}`}
                                          className={styles["Image"]}
                                          alt=''
                                          draggable={false}
                                        />
                                        <p className={styles["agendaCreater"]}>
                                          {data.userName}
                                        </p>
                                      </div>
                                      <p
                                        className={`${styles["uploadedbyuser"]} mt-3`}>
                                        {t("Approved-by")}
                                      </p>
                                      <div className={styles["gap-ti"]}>
                                        {visibleApprovedUsers.map(
                                          (approvedUserList, subFileIndex) => (
                                            <img
                                              key={subFileIndex}
                                              src={`data:image/jpeg;base64,${approvedUserList?.displayProfilePictureName}`}
                                              className={styles["Image"]}
                                              alt=''
                                              draggable={false}
                                            />
                                          )
                                        )}
                                        {remainingCount > 0 && (
                                          <span
                                            className={
                                              styles["reviewer-count"]
                                            }>
                                            +{remainingCount}
                                          </span>
                                        )}
                                      </div>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            </Col>
          </Row>
        );
      })}
    </>
  ) : (
    <>
      <section>
        <Row className='mt-3'>
          <Col lg={6} md={6} sm={12} className='d-flex gap-2'>
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
                  ? styles["Button_Agenda"]
                  : styles["Button_Agenda_nonActive"]
              }
              onClick={handleAgendaWiseClick}
            />
          </Col>
          <Col
            lg={6}
            md={6}
            sm={12}
            className='d-flex justify-content-between align-items-center'>
            {Number(editorRole.status) === 1 ||
            Number(editorRole.status) === 11 ||
            Number(editorRole.status) === 12 ? null : (editorRole.role ===
                "Organizer" &&
                Number(editorRole.status) === 9) ||
              (Number(editorRole.status) === 10 &&
                editorRole.role === "Organizer") ? (
              <p className={styles["Attachments"]}>{t("Attachments")}</p>
            ) : (
              <p></p>
            )}
            <div className={styles["button-block"]}>
              {isMinutePublishable === true ||
              (editorRole.role === "Organizer" &&
                Number(editorRole.status) === 9 &&
                deadLineDate &&
                deadLineDate <= currentDateOnly) ||
              (Number(editorRole.status) === 10 &&
                editorRole.role === "Organizer" &&
                deadLineDate &&
                deadLineDate <= currentDateOnly &&
                isMinutePublishable === true) ? (
                <Button
                  text={t("Publish-minutes")}
                  className={styles["PublishMinutes"]}
                  onClick={publishMeetingMinutes}
                />
              ) : null}
              <Button
                text={t("Add-reviewers")}
                className={styles["Add_Reviewers"]}
                // disableBtn={minutesData.length > 0 ? true : false}
                onClick={addReviewersModal}
              />
            </div>
          </Col>
        </Row>
        {agenda ? (
          <AgendaWise
            advanceMeetingModalID={advanceMeetingModalID}
            editorRole={editorRole}
            agendaOptionvalue={agendaOptionvalue}
            setAgendaOptionValue={setAgendaOptionValue}
            addNoteFields={addAgendaWiseFields}
            setAddNoteFields={setAgendaWiseFields}
            fileAttachments={addAgendaWiseFiles}
            setFileAttachments={setaddAgendaWiseFiles}
            addReviewers={addReviewers}
            setAddReviewers={setAddReviewers}
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
              <>
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
                    <Row className='mt-5'>
                      <Col>
                        <p
                          className={
                            addNoteFields.Description.errorStatus &&
                            addNoteFields.Description.value === ""
                              ? ` ${styles["errorNotesMessage"]} `
                              : `${styles["errorNotesMessage_hidden"]}`
                          }>
                          {addNoteFields.Description.errorMessage}
                        </p>
                      </Col>
                    </Row>
                    {/* Button For Saving the The Minutes  */}
                    <Row className='mt-0'>
                      <Col
                        lg={12}
                        md={6}
                        sm={12}
                        className='d-flex gap-2 justify-content-end'>
                        <Button
                          text={t("Reset")}
                          className={styles["Reset_Button"]}
                          onClick={handleResetBtnFunc}
                        />
                        {isEdit === true ? (
                          <>
                            <Button
                              text={t("Update")}
                              className={styles["Button_Save"]}
                              onClick={handleUpdateFunc}
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              text={t("Save")}
                              className={styles["Button_Save"]}
                              onClick={handleAddClick}
                            />
                          </>
                        )}
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={6} md={6} sm={6}>
                    <section className={styles["viewMinutesAttachments"]}>
                      {fileAttachments.length > 0 ? (
                        <>
                          <Row>
                            {fileAttachments.length > 0
                              ? fileAttachments.map((data, index) => {
                                  return (
                                    <>
                                      <Col lg={4} md={4} sm={4}>
                                        <AttachmentViewer
                                          fk_UID={userID}
                                          handleClickRemove={() =>
                                            handleRemoveFile(data)
                                          }
                                          data={fileAttachments}
                                          id={0}
                                          name={data.DisplayAttachmentName}
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
                          className={
                            styles["dragdrop_attachment_create_resolution"]
                          }>
                          <p className='ant-upload-drag-icon'>
                            <span
                              className={styles["create_resolution_dragger"]}>
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
                            <span className={styles["here_text"]}>
                              {t("Here")}
                            </span>
                          </p>
                        </Dragger>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}
            {/* Mapping of The Create Minutes */}
            {minutesData.map((data, index) => {
              const isOpen = openIndices.includes(index);
              const isOpenReviewer = openReviewerDetail.includes(index);
              let isRejectedMemberHas =
                data?.MinuteStats &&
                data?.MinuteStats?.rejectedByUsers.length > 0
                  ? true
                  : false;

              console.log({ isRejectedMemberHas, data }, "isRejectedMemberHas");
              return (
                <Row className='mt-2'>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["ScrollerMinutes"]}>
                    <>
                      <div>
                        <Row>
                          <Col lg={12} md={12} sm={12} className='mt-2'>
                            <div
                              onClick={() =>
                                accordianClick(data, data.minuteID, index)
                              }
                              className={
                                isOpen
                                  ? styles["agenda-wrapper-closed"]
                                  : styles["agenda-wrapper-open"]
                              }>
                              <p className={styles["agenda-title"]}>
                                {`${t("General-minute")} ${+index + 1}`}
                              </p>
                              <span>
                                {isRejectedMemberHas && (
                                  <Tooltip
                                    placement='top'
                                    showArrow={false}
                                    title={t("Reviewed")}>
                                    <img
                                      className={styles["Attachment"]}
                                      alt=''
                                      src={WarningIcon}
                                    />
                                  </Tooltip>
                                )}
                                {data.attachments.length > 0 ? (
                                  <img
                                    className={styles["Attachment"]}
                                    alt=''
                                    src={AttachmentIcon}
                                  />
                                ) : null}
                                <img
                                  alt=''
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
                            {isOpenReviewer &&
                            minuteReviewData !== null &&
                            data?.MinuteStats ? (
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <div
                                    className={
                                      styles["reviewer-progress-wrapper"]
                                    }>
                                    <Row>
                                      <Col lg={11} md={11} sm={12}>
                                        <div
                                          className={
                                            styles["reviewer-progress-text"]
                                          }>
                                          <p className='m-0'>
                                            {t("Total")}{" "}
                                            {data?.MinuteStats?.totalReviews}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Pending")}{" "}
                                            {data?.MinuteStats?.pending}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Accepted")}{" "}
                                            {data?.MinuteStats?.accepted}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Reviewed")}{" "}
                                            {data?.MinuteStats?.rejected}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className={
                                          currentLanguage === "ar"
                                            ? "text-start"
                                            : "text-end"
                                        }>
                                        <img
                                          alt=''
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
                            ) : !isOpenReviewer &&
                              minuteReviewData !== null &&
                              data?.MinuteStats ? (
                              <Row>
                                <Col lg={12} md={12} sm={12}>
                                  <div
                                    className={
                                      styles["reviewer-progress-wrapper"]
                                    }>
                                    <Row>
                                      <Col lg={11} md={11} sm={12}>
                                        <div
                                          className={
                                            styles["reviewer-progress-text"]
                                          }>
                                          <p className='m-0'>
                                            {t("Total")}{" "}
                                            {data?.MinuteStats?.totalReviews}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Pending")}{" "}
                                            {data?.MinuteStats?.pending}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Accepted")}{" "}
                                            {data?.MinuteStats?.accepted}
                                          </p>
                                          <span>|</span>
                                          <p className='m-0'>
                                            {t("Reviewed")}{" "}
                                            {data?.MinuteStats?.rejected}
                                          </p>
                                        </div>
                                      </Col>
                                      <Col
                                        lg={1}
                                        md={1}
                                        sm={12}
                                        className={
                                          currentLanguage === "ar"
                                            ? "text-start"
                                            : "text-end"
                                        }>
                                        <img
                                          alt=''
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
                                          className={`${styles["text-wrapper-review"]}`}>
                                          <span
                                            className={
                                              styles["Review-pending"]
                                            }>
                                            Review Pending:
                                          </span>
                                          {data?.MinuteStats?.pendingUsers
                                            ?.length > 0 &&
                                            data?.MinuteStats?.pendingUsers.map(
                                              (minutePendingUser, index) =>
                                                index ===
                                                data.MinuteStats.pendingUsers
                                                  .length -
                                                  1
                                                  ? `${minutePendingUser}`
                                                  : `${minutePendingUser}, `
                                            )}
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}>
                                          <span
                                            className={
                                              styles["Review-accepted"]
                                            }>
                                            Review Accepted:
                                          </span>{" "}
                                          {data?.MinuteStats?.acceptedByUsers
                                            ?.length > 0 &&
                                            data?.MinuteStats?.acceptedByUsers.map(
                                              (minuteAcceptedUser, index) =>
                                                index ===
                                                data.MinuteStats.acceptedByUsers
                                                  .length -
                                                  1
                                                  ? `${minuteAcceptedUser}`
                                                  : `${minuteAcceptedUser}, `
                                            )}
                                        </p>
                                        <p
                                          className={`${styles["text-wrapper-review"]}`}>
                                          <span
                                            className={
                                              styles["Review-declined"]
                                            }>
                                            Review Rejected:
                                          </span>{" "}
                                          {/* {data?.MinuteStats?.rejectedByUsers
                                            ?.length > 0 &&
                                            data?.MinuteStats?.rejectedByUsers?.map(
                                              (minuteRejectedUser, index) =>
                                                `${minuteRejectedUser}, `
                                            )} */}
                                          {data?.MinuteStats?.rejectedByUsers
                                            ?.length > 0 &&
                                            data?.MinuteStats?.rejectedByUsers.map(
                                              (minuteRejectedUser, index) =>
                                                index ===
                                                data.MinuteStats.rejectedByUsers
                                                  .length -
                                                  1
                                                  ? `${minuteRejectedUser}`
                                                  : `${minuteRejectedUser}, `
                                            )}
                                        </p>
                                      </Col>
                                    </Row>
                                  </div>
                                </Col>
                              </Row>
                            ) : null}
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className='position-relative'>
                                <div className={styles["uploaded-details"]}>
                                  {(
                                    (data.isEditable === true &&
                                      Number(editorRole.status) === 1) ||
                                    (data.isEditable === true &&
                                      Number(editorRole.status) === 11) ||
                                    (data.isEditable === true &&
                                      Number(editorRole.status) === 12)
                                      ? null
                                      : (data.isEditable === true &&
                                          editorRole.role === "Organizer" &&
                                          Number(editorRole.status) === 9) ||
                                        (data.isEditable === true &&
                                          Number(editorRole.status) === 10 &&
                                          editorRole.role === "Organizer")
                                  ) ? (
                                    <img
                                      draggable={false}
                                      src={RedCroseeIcon}
                                      height='20.76px'
                                      width='20.76px'
                                      className={styles["RedCrossClass"]}
                                      onClick={() => {
                                        dispatch(
                                          deleteCommentModalGeneral(true)
                                        );
                                        dispatch(DeleteMinuteReducer(data));
                                      }}
                                      alt=''
                                    />
                                  ) : null}
                                  <Row className={styles["inherit-height"]}>
                                    <Col lg={9} md={9} sm={12}>
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: data.description,
                                        }}
                                        className={styles["minutes-text"]}></p>
                                      {data.attachments.length > 0 ? (
                                        <Row>
                                          {data.attachments.map(
                                            (fileData, index) => (
                                              <Col lg={3} md={3} sm={12}>
                                                <AttachmentViewer
                                                  handleClickDownload={() =>
                                                    downloadDocument(fileData)
                                                  }
                                                  fk_UID={0}
                                                  handleClickRemove={() =>
                                                    handleRemoveFile(fileData)
                                                  }
                                                  data={data.attachments}
                                                  id={fileData.pK_FileID}
                                                  name={
                                                    fileData.displayFileName
                                                  }
                                                  handleEyeIcon={() =>
                                                    pdfData(
                                                      data.attachments,
                                                      getFileExtension(
                                                        fileData?.displayFileName
                                                      )
                                                    )
                                                  }
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
                                      className='position-relative'>
                                      <Row className='m-0'>
                                        <Col
                                          lg={9}
                                          md={9}
                                          sm={12}
                                          className='p-0'>
                                          <span
                                            className={
                                              styles["bar-line"]
                                            }></span>
                                          <p
                                            className={
                                              styles["uploadedbyuser"]
                                            }>
                                            {t("Uploaded-by")}
                                          </p>
                                          <div className={styles["gap-ti"]}>
                                            <img
                                              src={`data:image/jpeg;base64,${data.uploader.displayProfilePictureName}`}
                                              className={styles["Image"]}
                                              alt=''
                                              draggable={false}
                                            />
                                            <p
                                              className={
                                                styles["agendaCreater"]
                                              }>
                                              {data.userName}
                                            </p>
                                          </div>
                                        </Col>
                                        <Col
                                          lg={3}
                                          md={3}
                                          sm={12}
                                          className='d-grid justify-content-end p-0'>
                                          <div>
                                            {(
                                              (data.isEditable === true &&
                                                Number(editorRole.status) ===
                                                  1) ||
                                              (data.isEditable === true &&
                                                Number(editorRole.status) ===
                                                  11) ||
                                              (data.isEditable === true &&
                                                Number(editorRole.status) ===
                                                  12)
                                                ? null
                                                : (data.isEditable === true &&
                                                    editorRole.role ===
                                                      "Organizer" &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 9) ||
                                                  (data.isEditable === true &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 10 &&
                                                    editorRole.role ===
                                                      "Organizer")
                                            ) ? (
                                              <img
                                                className='cursor-pointer mx-2'
                                                src={EditIcon}
                                                onClick={() =>
                                                  handleEditFunc(data)
                                                }
                                                alt=''
                                              />
                                            ) : null}
                                            <div
                                              onClick={() =>
                                                menuPopupMinute(data.minuteID)
                                              }
                                              className={styles["box-agendas"]}
                                              ref={closeMenuMinute}>
                                              <img
                                                className='cursor-pointer'
                                                src={MenuIcon}
                                                alt=''
                                              />
                                              <div
                                                className={
                                                  openMenuId === data.minuteID
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
                                                }>
                                                <span
                                                  onClick={() =>
                                                    // setShowRevisionHistory(
                                                    //   true
                                                    // )
                                                    handleClickShowRevision(
                                                      data,
                                                      data.minuteID
                                                    )
                                                  }>
                                                  {t("Revisions")}
                                                </span>
                                                <span
                                                  onClick={
                                                    () =>
                                                      handleClickShowVersionHistory(
                                                        data,
                                                        data.minuteID
                                                      )
                                                    // setShowVersionHistory(true)
                                                  }
                                                  className='border-0'>
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
                                            className={styles["time-uploader"]}>
                                            {convertToGMTMinuteTime(
                                              data.lastUpdatedDate +
                                                data.lastUpdatedTime
                                            ) + ","}
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}>
                                            {convertDateToGMTMinute(
                                              data.lastUpdatedDate +
                                                data.lastUpdatedTime
                                            )}
                                          </p>
                                        </Col>
                                      </Row>
                                    </Col>
                                  </Row>
                                </div>
                              </Col>
                            </Row>
                          </>
                        ) : null}
                      </div>
                    </>
                  </Col>
                </Row>
              );
            })}
          </>
        ) : null}
        <Row className='mt-5'>
          <Col
            lg={12}
            md={12}
            sm={12}
            className='d-flex justify-content-end gap-2'>
            {editorRole.isPrimaryOrganizer === true ? (
              <Button
                text={t("Invite-to-collaborate")}
                className={styles["Invite_Button"]}
                onClick={handleInvitetoCollaborateView}
              />
            ) : null}

            {/* <Button
            text={t("Previous")}
            className={styles["Previous_Button"]}
            onClick={handlePreviousButton}
          /> */}
            <Button
              text={t("Next")}
              onClick={handleNextButton}
              className={styles["Button_Next"]}
            />
          </Col>
        </Row>
        {unsaveFileUploadMinutes && (
          <UnsavedMinutes
            setMinutes={setMinutes}
            setSceduleMeeting={setViewAdvanceMeetingModal}
            setFileAttachments={setFileAttachments}
            useCase={useCase}
            setactionsPage={setactionsPage}
            setMeetingMaterial={setMeetingMaterial}
          />
        )}
        {addReviewers && (
          <AddReviewers
            addReviewers={addReviewers}
            allReviewers={allReviewers}
            setAddReviewers={setAddReviewers}
            advanceMeetingModalID={advanceMeetingModalID}
          />
        )}
        {showVersionHistory && (
          <VersionHistory
            showVersionHistory={showVersionHistory}
            setShowVersionHistory={setShowVersionHistory}
          />
        )}
        {showRevisionHistory && (
          <RevisionHistory
            showRevisionHistory={showRevisionHistory}
            setShowRevisionHistory={setShowRevisionHistory}
            isAgenda={isAgenda}
            advanceMeetingModalID={advanceMeetingModalID}
          />
        )}
        {MinutesReducer.deleteMinuteGeneral && (
          <DeleteCommentGeneral
            advanceMeetingModalID={advanceMeetingModalID}
            setAddNoteFields={setAddNoteFields}
            addNoteFields={addNoteFields}
            setFileAttachments={setFileAttachments}
          />
        )}
        {approvalModal ? (
          <ApprovalIncompleteModal
            approvalModal={approvalModal}
            setApprovalModal={setApprovalModal}
            setPublishAnywayModal={setPublishAnywayModal}
            advanceMeetingModalID={advanceMeetingModalID}
          />
        ) : null}

        {publishAnywayModal ? (
          <PublishAnywayModal
            publishAnywayModal={publishAnywayModal}
            setPublishAnywayModal={setPublishAnywayModal}
            setApprovalModal={setApprovalModal}
            advanceMeetingModalID={advanceMeetingModalID}
          />
        ) : null}

        <Notification open={open} setOpen={setOpen} />
      </section>
    </>
  );
};

export default Minutes;
