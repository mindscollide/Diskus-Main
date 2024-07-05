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
import { Upload } from "antd";
import featherupload from "../../../../../assets/images/featherupload.svg";
import DropdownPurple from "./Images/Dropdown-Purple.png";
import MenuIcon from "./Images/MenuIcon.png";
import Leftploygon from "../../../../../assets/images/Polygon 3.svg";
import UnsavedMinutes from "./UnsavedFileUploadMinutes/UnsavedMinutes";
import file_image from "../../../../../assets/images/file_image.svg";
import pdfIcon from "../../../../../assets/images/pdf_icon.svg";
import CrossIcon from "../../../../../assets/images/CrossIcon.svg";
import Rightploygon from "../../../../../assets/images/Polygon right.svg";
import RedCroseeIcon from "../../../../../assets/images/CrossIcon.svg";
import {
  ADDGeneralMinutesApiFunc,
  CleareMessegeNewMeeting,
  DeleteGeneralMinuteDocumentsApiFunc,
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
} from "../../../../../store/actions/NewMeetingActions";
import { newTimeFormaterAsPerUTCFullDate } from "../../../../../commen/functions/date_formater";
import AgendaWise from "./AgendaWise/AgendaWise";
import AddReviewers from "./AddReviewersModal/AddReviewers";
import AttachmentIcon from "./Images/Attachment-Icon.png";
import ArrowDown from "./Images/Arrow-Down.png";
import DefaultAvatar from "./Images/avatar.png";
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
} from "../../../../../store/actions/Minutes_action";

const Minutes = ({
  setMinutes,
  advanceMeetingModalID,
  setViewAdvanceMeetingModal,
  setMeetingMaterial,
  setactionsPage,
  editorRole,
}) => {
  // Newly Implemented
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const Delta = Quill.import("delta");
  let userID = localStorage.getItem("userID");
  let folderID = localStorage.getItem("folderDataRoomMeeting");
  let currentLanguage = localStorage.getItem("i18nextLng");
  const editorRef = useRef(null);
  const { Dragger } = Upload;

  const { MinutesReducer, NewMeetingreducer } = useSelector((state) => state);

  const generalMinutes = useSelector(
    (state) => state.NewMeetingreducer.generalMinutes
  );
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
  const [fileSize, setFileSize] = useState(0);
  const [useCase, setUseCase] = useState(null);

  const [fileForSend, setFileForSend] = useState([]);
  const [general, setGeneral] = useState(true);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [messages, setMessages] = useState([]);
  const [agenda, setAgenda] = useState(false);
  const [organizerID, setOrganizerID] = useState(0);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [isEdit, setisEdit] = useState(false);
  const [updateData, setupdateData] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [generalShowMore, setGeneralShowMore] = useState(null);
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
  console.log("fileSizefileSize", fileSize);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  const modules = {
    toolbar: {
      container: [
        [
          { size: ["14px", "16px", "18px"] },
          { font: ["impact", "courier", "comic", "Montserrat"] },
          { bold: "bold" }, // Set 'bold' directly as a string
          { italic: "italic" }, // Set 'italic' directly as a string
          { underline: "underline" }, // Set 'underline' directly as a string
          { color: [] },
          { background: [] },
          { align: [] },
          { list: "ordered" },
          { list: "bullet" },
        ],
      ],
      handlers: {},
      clipboard: { matchVisual: false },
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
    dispatch(
      GetAllGeneralMinutesApiFunc(navigate, t, Data, advanceMeetingModalID)
    );

    dispatch(GetMinuteReviewStatsForOrganizerByMeetingId(Data2, navigate, t));
    return () => {
      setUseCase(null);
      setMessages([]);
      setFileAttachments([]);
      setPreviousFileIDs([]);
      dispatch(cleareAllState());
    };
  }, []);

  useEffect(() => {
    try {
      if (
        (Object.keys(generalMinutes).length > 0 || generalMinutes.length > 0) &&
        (Object.keys(generalminutesDocumentForMeeting).length > 0 ||
          generalminutesDocumentForMeeting.length > 0)
      ) {
        console.log(
          generalMinutes.organizerID,
          "generalMinutesgeneralMinutesgeneralMinutes"
        );

        console.log("generalMinutesgeneralMinutes", generalMinutes);
        const minutesData = generalMinutes.meetingMinutes;
        const documentsData = generalminutesDocumentForMeeting.data;
        setOrganizerID(generalMinutes.organizerID);
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

  //Edit Button Function
  const handleEditFunc = async (data) => {
    setupdateData(data);
    console.log(data, "handleEditFunccalled");
    console.log(data, "dataminutesDetails");
    if (data.description !== "") {
      console.log(data, "addNoteFieldsaddNoteFieldsaddNoteFields");
      setAddNoteFields({
        Description: {
          value: data.description,
          errorMessage: "",
          errorStatus: false,
        },
      });
      setisEdit(true);
    } else {
      console.log("data.description is undefined or null");
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
    setAgenda(false);
    setGeneral(true);
  };

  const toggleExpansion = () => {
    setExpanded(!expanded);
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

      let docsData = {
        FK_MeetingGeneralMinutesID: updateData.minuteID,
        FK_MDID: advanceMeetingModalID,
        UpdateFileList: newfile.map((data, index) => {
          return { PK_FileID: Number(data.pK_FileID) };
        }),
      };
      await dispatch(
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
      ResponseMessage.trim() !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("No-records-found") &&
      ResponseMessage !== "" &&
      ResponseMessage !== t("No-record-found") &&
      ResponseMessage !== t("List-updated-successfully") &&
      ResponseMessage !== t("No-data-available")
    ) {
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
    if (
      ResponseMessageMinute.trim() !== "" &&
      ResponseMessageMinute !== t("No-record-found") &&
      ResponseMessageMinute !== t("No-records-found") &&
      ResponseMessageMinute !== "" &&
      ResponseMessageMinute !== t("No-record-found") &&
      ResponseMessageMinute !== t("List-updated-successfully") &&
      ResponseMessageMinute !== t("No-data-available") &&
      ResponseMessageMinute !== t("Minute-review-flow-not-found") &&
      ResponseMessageMinute !== t("Data-available")
    ) {
      setOpen({
        ...open,
        flag: true,
        message: ResponseMessageMinute,
      });
      setTimeout(() => {
        setOpen({
          ...open,
          flag: false,
          message: "",
        });
        dispatch(CleareMessegeMinutes());
      }, 3000);
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

  const [openIndices, setOpenIndices] = useState([]);

  const [addReviewers, setAddReviewers] = useState(false);

  const [showPublishMinutes, setShowPublishMinutes] = useState(false);

  const closeMenuMinute = useRef(null);

  const addReviewersModal = () => {
    let newData = {
      MeetingID: Number(advanceMeetingModalID),
    };

    dispatch(
      GetAllAgendaWiseMinutesApiFunc(
        navigate,
        newData,
        t,
        Number(advanceMeetingModalID),
        false,
        setAddReviewers,
        true
      )
    );

    dispatch(
      GetAllGeneralMinutesApiFunc(
        navigate,
        t,
        newData,
        Number(advanceMeetingModalID)
      )
    );
  };

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

  const menuPopupMinute = (id) => {
    setOpenMenuId(openMenuId === id ? null : id); // Toggle the menu for the clicked item
  };

  // const transformData = (data) => {
  //   return data.map((item) => ({
  //     minuteID: item.minuteID,
  //     description: item.minutesDetails,
  //     attachments: item.minutesAttachmets,
  //     uploader: {
  //       userID: item.userID,
  //       orignalProfilePictureName:
  //         item.userProfilePicture.orignalProfilePictureName,
  //       displayProfilePictureName:
  //         item.userProfilePicture.displayProfilePictureName,
  //     },
  //     lastUpdatedDate: item.lastUpdatedDate,
  //     lastUpdatedTime: item.lastUpdatedTime,
  //     userID: item.userID,
  //     userName: item.userName,
  //   }));
  // };

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
      };
    });
  };

  useEffect(() => {
    try {
      const generalMinutes = NewMeetingreducer.generalMinutes;

      if (generalMinutes && Object.keys(generalMinutes).length > 0) {
        const minutesData = generalMinutes.meetingMinutes;
        const documentsData = generalminutesDocumentForMeeting.data;
        console.log(
          "minutesDataminutesDataminutesData",
          minutesData,
          documentsData
        );
        const combinedData = transformData(minutesData, documentsData);
        setMinutesData(combinedData);
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
  }, [NewMeetingreducer.generalMinutes]);

  console.log("minutesDataminutesDataminutesData", minutesData);

  // useEffect(() => {
  //   if (
  //     NewMeetingreducer.generalMinutes !== undefined &&
  //     NewMeetingreducer.generalMinutes !== null &&
  //     NewMeetingreducer.generalMinutes.length !== 0
  //   ) {
  //     let data = NewMeetingreducer.generalMinutes.meetingMinutes;
  //     const transformedData = transformData(data);
  //     setMinutesData(transformedData);
  //   } else {
  //     setMinutesData([]);
  //   }
  //   return () => {
  //     setMinutesData([]);
  //   };
  // }, [NewMeetingreducer.generalMinutes]);

  console.log("MinutesReducerMinutesReducer", MinutesReducer);

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

  return showPublishMinutes ? (
    <>
      {minutesData.map((data, index) => {
        const isOpen = openIndices.includes(index);
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
                          {index + 1 + "." + " " + data.title}
                        </p>
                        <span>
                          {data.attachments.length > 0 ? (
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
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="position-relative"
                        >
                          <div className={styles["uploaded-details"]}>
                            <Row className={styles["inherit-height"]}>
                              <Col lg={10} md={10} sm={12}>
                                <p className={styles["minutes-text"]}>
                                  {data.description}
                                </p>
                                {data.attachments.length > 0 ? (
                                  <Row>
                                    {data.attachments.map((fileData, index) => (
                                      <Col lg={3} md={3} sm={12}>
                                        <AttachmentViewer
                                          fk_UID={fileData.fK_UserID}
                                          handleClickRemove={() =>
                                            handleRemoveFile(fileData)
                                          }
                                          data={fileData}
                                          id={0}
                                          name={fileData.displayFileName}
                                        />
                                      </Col>
                                    ))}
                                  </Row>
                                ) : null}
                              </Col>
                              <Col
                                lg={2}
                                md={2}
                                sm={12}
                                className="position-relative p-0"
                              >
                                <Row className="m-0">
                                  <Col lg={12} md={12} sm={12} className="p-0">
                                    <span className={styles["bar-line"]}></span>
                                    <p
                                      className={`${styles["uploadedbyuser"]} m-0`}
                                    >
                                      Uploaded By
                                    </p>
                                    <div className={styles["gap-ti"]}>
                                      <img
                                        src={DefaultAvatar}
                                        className={styles["Image"]}
                                        alt=""
                                        draggable={false}
                                      />
                                      <p className={styles["agendaCreater"]}>
                                        {data.uploader.name}
                                      </p>
                                    </div>
                                    <p
                                      className={`${styles["uploadedbyuser"]} mt-3`}
                                    >
                                      Uploaded By
                                    </p>
                                    <div className={styles["gap-ti"]}>
                                      <img
                                        src={DefaultAvatar}
                                        className={styles["Image"]}
                                        alt=""
                                        draggable={false}
                                      />
                                      <img
                                        src={DefaultAvatar}
                                        className={styles["Image"]}
                                        alt=""
                                        draggable={false}
                                      />{" "}
                                      <img
                                        src={DefaultAvatar}
                                        className={styles["Image"]}
                                        alt=""
                                        draggable={false}
                                      />
                                      <img
                                        src={DefaultAvatar}
                                        className={styles["Image"]}
                                        alt=""
                                        draggable={false}
                                      />
                                      <span
                                        className={styles["reviewer-count"]}
                                      >
                                        +9
                                      </span>
                                    </div>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </div>
                        </Col>
                      </Row>
                      {data.subMinutes.map((subMinuteData, subMinuteIndex) => (
                        <div>
                          <Row className="mx-50">
                            <Col lg={12} md={12} sm={12}>
                              <p className={styles["Parent-title-heading"]}>
                                {index +
                                  1 +
                                  "." +
                                  subMinuteIndex +
                                  1 +
                                  " " +
                                  subMinuteData.title}
                              </p>
                            </Col>
                          </Row>
                          <Row className="mxl-50">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="position-relative"
                            >
                              <div
                                className={styles["version-control-wrapper"]}
                              >
                                <span></span>
                              </div>
                              <div className={styles["uploaded-details"]}>
                                <Row className={styles["inherit-height"]}>
                                  <Col lg={10} md={10} sm={12}>
                                    <p className={styles["minutes-text"]}>
                                      {subMinuteData.description}
                                    </p>
                                    {subMinuteData.attachments.length > 0 ? (
                                      <Row>
                                        {subMinuteData.attachments.map(
                                          (subFileData, subFileIndex) => (
                                            <Col lg={3} md={3} sm={12}>
                                              <AttachmentViewer
                                                id={0}
                                                name={
                                                  subFileData.displayFileName
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
                                    className="position-relative"
                                  >
                                    <Row className="m-0">
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className="p-0"
                                      >
                                        <span
                                          className={styles["bar-line"]}
                                        ></span>
                                        <p
                                          className={`${styles["uploadedbyuser"]} m-0`}
                                        >
                                          Uploaded By
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={DefaultAvatar}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <p
                                            className={styles["agendaCreater"]}
                                          >
                                            {data.uploader.name}
                                          </p>
                                        </div>
                                        <p
                                          className={`${styles["uploadedbyuser"]} mt-3`}
                                        >
                                          Uploaded By
                                        </p>
                                        <div className={styles["gap-ti"]}>
                                          <img
                                            src={DefaultAvatar}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <img
                                            src={DefaultAvatar}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />{" "}
                                          <img
                                            src={DefaultAvatar}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <img
                                            src={DefaultAvatar}
                                            className={styles["Image"]}
                                            alt=""
                                            draggable={false}
                                          />
                                          <span
                                            className={styles["reviewer-count"]}
                                          >
                                            +9
                                          </span>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </Row>
                        </div>
                      ))}
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
        <Row className="mt-3">
          <Col lg={6} md={6} sm={12} className="d-flex gap-2">
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
            className="d-flex justify-content-between align-items-center"
          >
            <p className={styles["Attachments"]}>{t("Attachments")}</p>
            <div className={styles["button-block"]}>
              <Button
                text={t("Publish-minutes")}
                className={styles["PublishMinutes"]}
                onClick={() => setShowPublishMinutes(true)}
              />
              <Button
                text={t("Add-reviewers")}
                className={styles["Add_Reviewers"]}
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
                        md={6}
                        sm={12}
                        className="d-flex gap-2 justify-content-end"
                      >
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
                                  console.log(
                                    fileAttachments,
                                    "fileAttachmentsfileAttachments"
                                  );
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

                    <Row className="mt-2">
                      <Col lg={12} md={12} sm={12}>
                        <Dragger
                          fileList={[]}
                          {...props}
                          className={
                            styles["dragdrop_attachment_create_resolution"]
                          }
                        >
                          <p className="ant-upload-drag-icon">
                            <span
                              className={styles["create_resolution_dragger"]}
                            >
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
              return (
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["ScrollerMinutes"]}
                  >
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
                                {`${t("General-minute")} ${+index + 1}`}
                              </p>
                              <span>
                                {data.attachments.length > 0 ? (
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
                            <Row>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="position-relative"
                              >
                                <div className={styles["uploaded-details"]}>
                                  <img
                                    draggable={false}
                                    src={RedCroseeIcon}
                                    height="20.76px"
                                    width="20.76px"
                                    className={styles["RedCrossClass"]}
                                    onClick={() => {
                                      dispatch(deleteCommentModalGeneral(true));
                                      dispatch(DeleteMinuteReducer(data));
                                    }}
                                    alt=""
                                  />
                                  <Row className={styles["inherit-height"]}>
                                    <Col lg={9} md={9} sm={12}>
                                      <p
                                        dangerouslySetInnerHTML={{
                                          __html: data.description,
                                        }}
                                        className={styles["minutes-text"]}
                                      ></p>
                                      {data.attachments.length > 0 ? (
                                        <Row>
                                          {data.attachments.map(
                                            (fileData, index) => (
                                              <Col lg={3} md={3} sm={12}>
                                                <AttachmentViewer
                                                  id={fileData.pK_FileID}
                                                  name={
                                                    fileData.displayFileName
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
                                              src={`data:image/jpeg;base64,${data.uploader.displayProfilePictureName}`}
                                              className={styles["Image"]}
                                              alt=""
                                              draggable={false}
                                            />
                                            <p
                                              className={
                                                styles["agendaCreater"]
                                              }
                                            >
                                              {data.userName}
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
                                              onClick={() =>
                                                handleEditFunc(data)
                                              }
                                              alt=""
                                            />
                                            <div
                                              onClick={() =>
                                                menuPopupMinute(data.minuteID)
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
                                                }
                                              >
                                                <span
                                                  onClick={() =>
                                                    // setShowRevisionHistory(true)
                                                    handleClickShowRevision(
                                                      data,
                                                      data.minuteID
                                                    )
                                                  }
                                                >
                                                  {t("Revisions")}
                                                  <p className="m-0"> 3 </p>
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
                                              data.lastUpdatedDate +
                                                data.lastUpdatedTime
                                            ) + ","}
                                          </p>
                                          <p
                                            className={styles["date-uploader"]}
                                          >
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

            {/* <Row className="mt-2">
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["ScrollerMinutes"]}
              >
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
                                      {data.minutesAttachmets.map(
                                        (filesname, index) => {
                                          console.log(
                                            filesname,
                                            "filesnamefilesname"
                                          );
                                          return (
                                            <>
                                              <Col lg={3} md={3} sm={3}>
                                                <AttachmentViewer
                                                  name={
                                                    filesname.displayFileName
                                                  }
                                                  data={filesname}
                                                  id={0}
                                                />
                                              </Col>
                                            </>
                                          );
                                        }
                                      )}
                                    </Row>
                                  </>
                                ) : null}
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
                                    width="20.76px"
                                    className={styles["RedCrossClass"]}
                                    onClick={() =>
                                      handleRemovingTheMinutes(data)
                                    }
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
            </Row> */}
          </>
        ) : null}
        <Row className="mt-5">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-end gap-2"
          >
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

        {addReviewers ? (
          <AddReviewers
            addReviewers={addReviewers}
            setAddReviewers={setAddReviewers}
            advanceMeetingModalID={advanceMeetingModalID}
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

        {MinutesReducer.deleteMinuteGeneral ? (
          <DeleteCommentGeneral
            advanceMeetingModalID={advanceMeetingModalID}
            setAddNoteFields={setAddNoteFields}
            addNoteFields={addNoteFields}
            setFileAttachments={setFileAttachments}
          />
        ) : null}

        <Notification
          setOpen={setOpen}
          open={open.flag}
          message={open.message}
        />
      </section>
    </>
  );
};

export default Minutes;
