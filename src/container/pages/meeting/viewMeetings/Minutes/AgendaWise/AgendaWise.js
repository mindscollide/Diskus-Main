import React, { useEffect, useState } from "react";
import styles from "./AgendaWise.module.css";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Tooltip } from "antd";
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
  SaveAgendaWiseDocumentsApiFunc,
  UpdateAgendaWiseMinutesApiFunc,
  saveFilesMeetingagendaWiseMinutesApi,
  uploadDocumentsMeetingAgendaWiseMinutesApi,
} from "../../../../../../store/actions/NewMeetingActions";
import { GetAdvanceMeetingAgendabyMeetingIDForAgendaWiseMinutes } from "../../../../../../store/actions/AgendaWiseAgendaAction";
import AttachmentIcon from "./../Images/Attachment-Icon.png";
import ArrowDown from "./../Images/Arrow-Down.png";
import DropdownPurple from "./../Images/Dropdown-Purple.png";
import EditIcon from "./../Images/Edit-Icon.png";
import MenuIcon from "./../Images/MenuIcon.png";
import DeleteIcon from "./../Images/DeleteIcon.png";
import WarningIcon from "../../../../../../assets/images/warning.png";
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
import {
  convertToGMTMinuteTime,
  convertDateToGMTMinute,
} from "../../../../../../commen/functions/time_formatter";
import { DataRoomDownloadFileApiFunc } from "../../../../../../store/actions/DataRoom_actions";
import { getFileExtension } from "../../../../../DataRoom/SearchFunctionality/option";
import { removeHTMLTagsAndTruncate } from "../../../../../../commen/functions/utils";
import { showMessage } from "../../../../../../components/elements/snack_bar/utill";
import { useMeetingContext } from "../../../../../../context/MeetingContext";

const AgendaWise = ({
  advanceMeetingModalID,
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
  const { editorRole } = useMeetingContext();

  let folderID = localStorage.getItem("folderDataRoomMeeting");

  let isAgenda = true;

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [openMenuId, setOpenMenuId] = useState(null);

  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);

  const [minutesData, setMinutesData] = useState([]);

  const [openIndices, setOpenIndices] = useState([]);

  const [isOpenDrawerMinute, setIsOpenDrawerMinute] = useState(null);

  const [isOpenDrawerSubMinute, setIsOpenDrawerSubMinute] = useState(null);

  const [menuMinute, setMenuMinute] = useState(false);

  const [minuteReviewData, setMinuteReviewData] = useState(null);

  const closeMenuMinute = useRef(null);

  const [isEdit, setisEdit] = useState(false);

  const [fileSize, setFileSize] = useState(0);

  let currentLanguage = localStorage.getItem("i18nextLng");

  const { NewMeetingreducer, AgendaWiseAgendaListReducer, MinutesReducer } =
    useSelector((state) => state);
  const ResponseMessage = useSelector(
    (state) => state.NewMeetingreducer.ResponseMessage
  );
  const agendaWiseMinuteID = useSelector(
    (state) => state.NewMeetingreducer.agendaWiseMinuteID
  );
  const RetriveAgendaWiseDocuments = useSelector(
    (state) => state.NewMeetingreducer.RetriveAgendaWiseDocuments
  );
  const agendaWiseMinutesReducer = useSelector(
    (state) => state.NewMeetingreducer.agendaWiseMinutesReducer
  );
  const getallDocumentsForAgendaWiseMinutes = useSelector(
    (state) => state.NewMeetingreducer.getallDocumentsForAgendaWiseMinutes
  );
  const AllAgendas = useSelector(
    (state) => state.AgendaWiseAgendaListReducer.AllAgendas
  );
  const GetMinuteReviewStatsForOrganizerByMeetingIdData = useSelector(
    (state) =>
      state.MinutesReducer.GetMinuteReviewStatsForOrganizerByMeetingIdData
  );
  const deleteMinuteAgenda = useSelector(
    (state) => state.MinutesReducer.deleteMinuteAgenda
  );

  const editorRef = useRef(null);

  const { Dragger } = Upload;

  const [fileForSend, setFileForSend] = useState([]);

  const [previousFileIDs, setPreviousFileIDs] = useState([]);

  const [updateData, setupdateData] = useState(null);

  const [agendaOptions, setAgendaOptions] = useState([]);

  const [agendaSelect, setAgendaSelect] = useState({
    agendaSelectOptions: {
      id: 0,
      title: "",
    },
  });

  let userID = localStorage.getItem("userID");
  var Size = Quill.import("attributors/style/size");
  Size.whitelist = ["14px", "16px", "18px"];
  Quill.register(Size, true);
  var FontAttributor = Quill.import("formats/font");
  var fonts = ["impact", "courier", "comic"];
  FontAttributor.whitelist = fonts;
  Quill.register(FontAttributor, true);

  useEffect(() => {
    try {
      if (AllAgendas !== null && AllAgendas !== undefined) {
        let NewData = [];
        AllAgendas.agendaList.map((agenda, index) => {
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
        });
        setAgendaOptions(NewData);
      }
    } catch {}
  }, [AllAgendas]);

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
  // Initialize previousFileList to an empty array
  let previousFileList = [];

  const onTextChange = (content, delta, source) => {
    if (source === "user") {
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
        let isEmptyContent = content === "<p><br></p>";
        if (String(content).length >= 501) {
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
      dispatch(
        AddAgendaWiseMinutesApiFunc(navigate, Data, t, setAgendaOptionValue)
      );
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
    if (agendaWiseMinuteID !== 0) {
      console.log(agendaWiseMinuteID, "agendaWiseMinuteIDagendaWiseMinuteID");
      documentUploadingFunc(agendaWiseMinuteID);
    }
  }, [agendaWiseMinuteID]);

  //Download the document
  const downloadDocument = (record) => {
    let data = {
      FileID: record.pK_FileID,
    };
    dispatch(
      DataRoomDownloadFileApiFunc(navigate, data, t, record.displayFileName)
    );
  };

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

  const pdfData = (record, ext) => {
    console.log("PDFDATAPDFDATA", record);
    let Data = {
      taskId: 4,
      commingFrom: 4,
      fileName: record[0].displayFileName,
      attachmentID: record[0].pK_FileID,
    };
    let pdfDataJson = JSON.stringify(Data);
    if (
      ext === "pdf" ||
      ext === "doc" ||
      ext === "docx" ||
      ext === "xlx" ||
      ext === "xlsx"
    ) {
      window.open(
        `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
        "_blank",
        "noopener noreferrer"
      );
    }
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
    setisEdit(false);
    setFileAttachments([]);
    setFileForSend([]);
    setPreviousFileIDs([]);
  };
  console.log(agendaOptions, "descriptiondescription");

  //handle Edit functionality
  const handleEditFunc = (data, title) => {
    console.log(agendaOptions, "descriptiondescription");
    console.log(data, title, "descriptiondescription");
    setupdateData(data);
    if (data.description !== "") {
      console.log(data.description, "descriptiondescription");
      let findOptionValue = agendaOptions.filter(
        (agendaOption, index) => agendaOption.label === title
      );
      console.log(findOptionValue, "descriptiondescription");
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
          title: title,
        },
      });
      setAgendaOptionValue({
        label: title,
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

  useEffect(() => {
    try {
      if (
        RetriveAgendaWiseDocuments !== null &&
        RetriveAgendaWiseDocuments !== undefined &&
        RetriveAgendaWiseDocuments.data.length > 0
      ) {
        let files = [];
        let prevData = [];
        RetriveAgendaWiseDocuments.data.map((data, index) => {
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
      MinuteID: updateData.minuteID,
      MinuteText: addNoteFields.Description.value,
    };
    dispatch(
      UpdateAgendaWiseMinutesApiFunc(
        navigate,
        UpdateDataAgendaWise,
        t,
        false,
        null,
        false,
        false,
        false,
        false,
        true,
        setAgendaOptionValue,
        setAddNoteFields,
        addNoteFields,
        setFileAttachments,
        setFileForSend,
        setisEdit
      )
    );

    let newfile = [...previousFileIDs];
    let fileObj = [];
    if (Object.keys(fileForSend).length > 0) {
      console.log(updateData.minuteID, "updateDataupdateData");

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
      console.log(updateData, "updateDataupdateData");

      let docsData = {
        FK_MeetingAgendaMinutesID: Number(updateData.minuteID),
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
      // If newfile is empty, call the API with an empty docsData

      console.log(updateData.minuteID, "updateDataupdateData");
      let docsData = {
        FK_MeetingAgendaMinutesID: Number(updateData.minuteID),
        FK_MDID: advanceMeetingModalID,
        UpdateFileList: [],
      };

      dispatch(
        SaveAgendaWiseDocumentsApiFunc(
          navigate,
          docsData,
          t,
          advanceMeetingModalID
        )
      );
    }
  };

  // useEffect(() => {
  //   if (
  //     ResponseMessage !== t("No-record-found") &&
  //     ResponseMessage !== t("No-records-found") &&
  //     ResponseMessage !== "" &&
  //     ResponseMessage !== t("No-record-found") &&
  //     ResponseMessage !== t("List-updated-successfully") &&
  //     ResponseMessage !== t("No-data-available")
  //   ) {
  //     console.log(ResponseMessage, "ResponseMessageResponseMessage");
  //     showMessage(ResponseMessage, "success", setOpen);
  //     dispatch(CleareMessegeNewMeeting());
  //   } else {
  //     dispatch(CleareMessegeNewMeeting());
  //   }
  // }, [ResponseMessage]);

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
        advanceMeetingModalID,
        false,
        false
      )
    );
    return () => {
      setFileAttachments([]);
      setPreviousFileIDs([]);
      // dispatch(cleareAllState());
    };
  }, []);

  // NEW WORK OWAIS!!!!!!!!! ->>>> cxxx|::::::::::::::>

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

  const openMinuteDrawer = (minuteID) => {
    if (isOpenDrawerMinute === minuteID) {
      setIsOpenDrawerMinute(null);
    } else {
      setIsOpenDrawerMinute(minuteID);
    }
  };
  const openSubMinuteDrawer = (subMinuteID) => {
    if (isOpenDrawerSubMinute === subMinuteID) {
      setIsOpenDrawerSubMinute(null);
    } else {
      setIsOpenDrawerSubMinute(subMinuteID);
    }
  };

  function hasAttachments(data) {
    // Helper function to check if any minuteData object has attachments
    const checkMinuteData = (minutes) => {
      return minutes.some(
        (minute) => minute.attachments && minute.attachments.length > 0
      );
    };

    // Check the parent minuteData
    if (checkMinuteData(data.minuteData)) {
      return true;
    }

    // Check the subMinutes minuteData
    if (data.subMinutes && data.subMinutes.length > 0) {
      return data.subMinutes.some((subMinute) =>
        checkMinuteData(subMinute.minuteData)
      );
    }

    return false;
  }

  useEffect(() => {
    try {
      const reducerData = agendaWiseMinutesReducer;
      if (reducerData && Object.keys(reducerData).length > 0) {
        let transformedData = [];

        console.log("Initial transformedData:", transformedData);

        reducerData.agendaHierarchyList.forEach((parentAgenda) => {
          let parentAgendaMinutes = reducerData.agendaWiseMinutes.filter(
            (minute) => minute.agendaID === parentAgenda.pK_MAID
          );

          let subMinutes = [];
          parentAgenda.childAgendas.forEach((childAgenda) => {
            let childMinutes = reducerData.agendaWiseMinutes.filter(
              (minute) => minute.agendaID === childAgenda.pK_MAID
            );
            subMinutes.push(...childMinutes);
          });

          let isParentData = parentAgendaMinutes.length > 0;
          if (isParentData || subMinutes.length > 0) {
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
                isEditable: minute.isEditable,
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
                    isEditable: minute.isEditable,
                  })),
                };
              }),
            };

            transformedData.push(parentAgendaObj);
          }
        });

        console.log(
          "Transformed Data before attachment update:",
          transformedData
        );

        transformedData.forEach((agenda) => {
          agenda.minuteData.forEach((minute) => {
            let matchingData = getallDocumentsForAgendaWiseMinutes.data.find(
              (entry) => entry.pK_MeetingAgendaMinutesID === minute.minuteID
            );
            if (matchingData) {
              minute.attachments = matchingData.files || [];
            }
          });

          agenda.subMinutes.forEach((subAgenda) => {
            subAgenda.minuteData.forEach((minute) => {
              let matchingData = getallDocumentsForAgendaWiseMinutes.data.find(
                (entry) => entry.pK_MeetingAgendaMinutesID === minute.minuteID
              );
              if (matchingData) {
                minute.attachments = matchingData.files || [];
              }
            });
          });
        });

        console.log(
          "Transformed Data after attachment update:",
          transformedData
        );

        if (
          GetMinuteReviewStatsForOrganizerByMeetingIdData &&
          GetMinuteReviewStatsForOrganizerByMeetingIdData
            .minuteReviewStatsModelList.length > 0
        ) {
          const { minuteReviewStatsModelList } =
            GetMinuteReviewStatsForOrganizerByMeetingIdData;

          let newTransformedData = transformedData.map((agenda) => {
            agenda.minuteData = agenda.minuteData.map((minute) => {
              let matchedStats = minuteReviewStatsModelList.find(
                (stats) => minute.minuteID === stats.minuteID
              );
              return matchedStats
                ? { ...minute, MinuteStats: matchedStats }
                : minute;
            });

            agenda.subMinutes = agenda.subMinutes.map((subAgenda) => {
              subAgenda.minuteData = subAgenda.minuteData.map((minute) => {
                let matchedStats = minuteReviewStatsModelList.find(
                  (stats) => minute.minuteID === stats.minuteID
                );
                return matchedStats
                  ? { ...minute, MinuteStats: matchedStats }
                  : minute;
              });
              return subAgenda;
            });

            return agenda;
          });
          console.log(
            newTransformedData,
            "newTransformedDatanewTransformedData"
          );
          setMinutesData(newTransformedData);
        } else {
          setMinutesData(transformedData);
        }

        console.log("Final transformedData:", transformedData);
      } else {
        setMinutesData([]);
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      setMinutesData([]);
    }
  }, [
    agendaWiseMinutesReducer,
    getallDocumentsForAgendaWiseMinutes,
    GetMinuteReviewStatsForOrganizerByMeetingIdData,
  ]);

  useEffect(() => {
    if (
      GetMinuteReviewStatsForOrganizerByMeetingIdData !== null &&
      GetMinuteReviewStatsForOrganizerByMeetingIdData !== undefined
    ) {
      setMinuteReviewData(GetMinuteReviewStatsForOrganizerByMeetingIdData);
    } else {
      setMinuteReviewData(null);
    }
  }, [GetMinuteReviewStatsForOrganizerByMeetingIdData]);

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

  console.log("Minutes of Agenda", minutesData);

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
          <Row className='mt-4'>
            <Col lg={6} md={6} sm={6}>
              <Row className={styles["Add-note-QuillRow"]}>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  className={styles["Arabic_font_Applied"]}>
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
          </Row>
        </>
      ) : null}
      {minutesData.map((data, index) => {
        console.log(data, "minutesDataminutesDataminutesData");
        const isOpen = openIndices.includes(index);
        let attachmentResult = hasAttachments(data);
        let isRejectedMemberHas = data.minuteData.filter(
          (data, index) => data?.MinuteStats?.rejectedByUsers.length > 0
        );
        console.log(
          isRejectedMemberHas,
          "isRejectedMemberHasisRejectedMemberHas"
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
                          accordianClick(data, data.minuteID, index)
                        }
                        className={
                          isOpen
                            ? styles["agenda-wrapper-closed"]
                            : styles["agenda-wrapper-open"]
                        }>
                        <p className={styles["agenda-title"]}>
                          {index + 1 + "." + " " + data.agendaTitle}
                        </p>
                  
                        <span className='d-flex align-items-start justify-content-center'>
                          {isRejectedMemberHas.length > 0 && (
                            <Tooltip
                              placement='top'
                              showArrow={false}
                              title={`Rejected By ${isRejectedMemberHas[0]?.MinuteStats?.rejected} Members`}>
                              <img
                                className={styles["Attachment"]}
                                alt=''
                                src={WarningIcon}
                              />
                            </Tooltip>
                          )}
                          {/* //data.minuteData.length > 0 && */}
                          {attachmentResult ? (
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
                      {data.isParentData ? (
                        <>
                          {data.minuteData.map((parentMinutedata, index) => {
                            console.log(
                              { parentMinutedata },
                              "parentMinutedataparentMinutedata"
                            );
                            return (
                              <>
                                {minuteReviewData !== null &&
                                parentMinutedata?.MinuteStats ? (
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
                                                {
                                                  parentMinutedata?.MinuteStats
                                                    ?.totalReviews
                                                }
                                              </p>
                                              <span>|</span>

                                              <p className='m-0'>
                                                {t("Pending")}{" "}
                                                {
                                                  parentMinutedata?.MinuteStats
                                                    ?.pending
                                                }
                                              </p>
                                              <span>|</span>

                                              <p className='m-0'>
                                                {t("Accepted")}{" "}
                                                {
                                                  parentMinutedata?.MinuteStats
                                                    ?.accepted
                                                }
                                              </p>
                                              <span>|</span>
                                              <p className='m-0'>
                                                {t("Reviewed")}{" "}
                                                {
                                                  parentMinutedata?.MinuteStats
                                                    ?.rejected
                                                }
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
                                                isOpenDrawerMinute ===
                                                parentMinutedata.minuteID
                                                  ? `${styles["Arrow"]} cursor-pointer`
                                                  : `${styles["Arrow_Expanded"]} cursor-pointer`
                                              }
                                              onClick={() =>
                                                openMinuteDrawer(
                                                  parentMinutedata.minuteID
                                                )
                                              }
                                            />
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col
                                            lg={12}
                                            md={12}
                                            sm={12}
                                            className={
                                              isOpenDrawerMinute ===
                                              parentMinutedata.minuteID
                                                ? styles["ParentMinuteExtend"]
                                                : styles[
                                                    "ParentMinuteNotExtend"
                                                  ]
                                            }>
                                            <p
                                              className={`${styles["text-wrapper-review"]}`}>
                                              <span
                                                className={
                                                  styles["Review-pending"]
                                                }>
                                                Review Pending:
                                              </span>{" "}
                                              {parentMinutedata?.MinuteStats
                                                ?.pendingUsers?.length > 0 &&
                                                parentMinutedata?.MinuteStats?.pendingUsers.map(
                                                  (pendingUserData, index) =>
                                                    index ===
                                                    parentMinutedata.MinuteStats
                                                      .pendingUsers.length -
                                                      1
                                                      ? `${pendingUserData}`
                                                      : `${pendingUserData}, `
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
                                              {parentMinutedata?.MinuteStats
                                                ?.acceptedByUsers?.length > 0 &&
                                                parentMinutedata?.MinuteStats?.acceptedByUsers.map(
                                                  (acceptedUser, index) =>
                                                    index ===
                                                    parentMinutedata.MinuteStats
                                                      .acceptedByUsers.length -
                                                      1
                                                      ? `${acceptedUser}`
                                                      : `${acceptedUser}, `
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
                                              {/* {parentMinutedata?.MinuteStats
                                                ?.rejectedByUsers?.length > 0 &&
                                                parentMinutedata?.MinuteStats?.rejectedByUsers?.map(
                                                  (rejectedUser, index) =>
                                                    `${rejectedUser}, `
                                                )} */}
                                              {parentMinutedata?.MinuteStats
                                                ?.rejectedByUsers?.length > 0 &&
                                                parentMinutedata?.MinuteStats?.rejectedByUsers.map(
                                                  (rejectedUser, index) =>
                                                    index ===
                                                    parentMinutedata.MinuteStats
                                                      .rejectedByUsers.length -
                                                      1
                                                      ? `${rejectedUser}`
                                                      : `${rejectedUser}, `
                                                )}
                                            </p>
                                          </Col>
                                        </Row>
                                      </div>
                                    </Col>
                                  </Row>
                                ) : null}
                                <Row key={index}>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className='position-relative'>
                                    <div className={styles["uploaded-details"]}>
                                      {(
                                        (parentMinutedata.isEditable === true &&
                                          Number(editorRole.status) === 1) ||
                                        (parentMinutedata.isEditable === true &&
                                          Number(editorRole.status) === 11) ||
                                        (parentMinutedata.isEditable === true &&
                                          Number(editorRole.status) === 12)
                                          ? null
                                          : (parentMinutedata.isEditable ===
                                              true &&
                                              editorRole.role === "Organizer" &&
                                              Number(editorRole.status) ===
                                                9) ||
                                            (parentMinutedata.isEditable ===
                                              true &&
                                              Number(editorRole.status) ===
                                                10 &&
                                              editorRole.role === "Organizer")
                                      ) ? (
                                        <img
                                          className={styles["delete-icon"]}
                                          src={DeleteIcon}
                                          alt=''
                                          onClick={() => {
                                            dispatch(
                                              deleteCommentModalAgenda(true)
                                            );
                                            dispatch(
                                              DeleteMinuteReducer(
                                                parentMinutedata
                                              )
                                            );
                                          }}
                                        />
                                      ) : null}
                                      <Row className={styles["inherit-height"]}>
                                        <Col lg={9} md={9} sm={12}>
                                          <p
                                            dangerouslySetInnerHTML={{
                                              __html:
                                                parentMinutedata?.description,
                                            }}
                                            className={
                                              styles["minutes-text"]
                                            }></p>
                                          {parentMinutedata?.attachments
                                            ?.length > 0 ? (
                                            <Row>
                                              {parentMinutedata.attachments.map(
                                                (fileData, index) => (
                                                  <Col lg={3} md={3} sm={12}>
                                                    <AttachmentViewer
                                                      handleClickDownload={() =>
                                                        downloadDocument(
                                                          fileData
                                                        )
                                                      }
                                                      fk_UID={0}
                                                      handleClickRemove={() =>
                                                        handleRemoveFile(
                                                          fileData
                                                        )
                                                      }
                                                      data={
                                                        parentMinutedata.attachments
                                                      }
                                                      id={fileData.pK_FileID}
                                                      name={
                                                        fileData.displayFileName
                                                      }
                                                      handleEyeIcon={() =>
                                                        pdfData(
                                                          parentMinutedata.attachments,
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
                                                  src={`data:image/jpeg;base64,${parentMinutedata.uploader.displayProfilePictureName}`}
                                                  className={styles["Image"]}
                                                  alt=''
                                                  draggable={false}
                                                />
                                                <p
                                                  className={
                                                    styles["agendaCreater"]
                                                  }>
                                                  {parentMinutedata.userName}
                                                </p>
                                              </div>
                                            </Col>
                                            <Col
                                              lg={3}
                                              md={3}
                                              sm={12}
                                              className='d-grid justify-content-end p-0'>
                                              <div className='d-flex justify-content-center align-items-center'>
                                                {(
                                                  (parentMinutedata.isEditable ===
                                                    true &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 1) ||
                                                  (parentMinutedata.isEditable ===
                                                    true &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 11) ||
                                                  (parentMinutedata.isEditable ===
                                                    true &&
                                                    Number(
                                                      editorRole.status
                                                    ) === 12)
                                                    ? null
                                                    : (parentMinutedata.isEditable ===
                                                        true &&
                                                        editorRole.role ===
                                                          "Organizer" &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 9) ||
                                                      (parentMinutedata.isEditable ===
                                                        true &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 10 &&
                                                        editorRole.role ===
                                                          "Organizer")
                                                ) ? (
                                                  <img
                                                    className='cursor-pointer mx-2'
                                                    src={EditIcon}
                                                    alt=''
                                                    onClick={() =>
                                                      handleEditFunc(
                                                        parentMinutedata,
                                                        data.agendaTitle
                                                      )
                                                    }
                                                  />
                                                ) : null}
                                                <div
                                                  onClick={() =>
                                                    menuPopupMinute(
                                                      parentMinutedata.minuteID
                                                    )
                                                  }
                                                  className={
                                                    styles["box-agendas"]
                                                  }
                                                  ref={closeMenuMinute}>
                                                  <img
                                                    className='cursor-pointer'
                                                    src={MenuIcon}
                                                    alt=''
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
                                                    }>
                                                    <span
                                                      onClick={
                                                        () =>
                                                          handleClickShowRevision(
                                                            data,
                                                            parentMinutedata.minuteID
                                                          )
                                                        // setShowRevisionHistory(true)
                                                      }>
                                                      {t("Revisions")}
                                                    </span>
                                                    <span
                                                      onClick={
                                                        () =>
                                                          handleClickShowVersionHistory(
                                                            data,
                                                            parentMinutedata.minuteID
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
                                                className={
                                                  styles["time-uploader"]
                                                }>
                                                {convertToGMTMinuteTime(
                                                  parentMinutedata.lastUpdatedDate +
                                                    parentMinutedata.lastUpdatedTime
                                                ) + ","}
                                              </p>
                                              <p
                                                className={
                                                  styles["date-uploader"]
                                                }>
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
                              </>
                            );
                          })}
                        </>
                      ) : null}
                      {data.subMinutes.map((subMinuteData, subMinuteIndex) => {
                        return (
                          <div>
                            {subMinuteData.minuteData.length === 0 ? null : (
                              <Row className='mx-50'>
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
                            <>
                              {subMinuteData.minuteData.map(
                                (minuteDataSubminute) => (
                                  <>
                                    {minuteReviewData !== null &&
                                    minuteDataSubminute?.MinuteStats ? (
                                      <Row
                                        className={
                                          currentLanguage === "ar"
                                            ? "mxr-50"
                                            : "mxl-50"
                                        }>
                                        <Col lg={12} md={12} sm={12}>
                                          <div
                                            className={
                                              styles[
                                                "reviewer-progress-wrapper"
                                              ]
                                            }>
                                            <Row>
                                              <Col lg={11} md={11} sm={12}>
                                                <div
                                                  className={
                                                    styles[
                                                      "reviewer-progress-text"
                                                    ]
                                                  }>
                                                  <p className='m-0'>
                                                    {t("Total")}{" "}
                                                    {
                                                      minuteDataSubminute
                                                        ?.MinuteStats
                                                        ?.totalReviews
                                                    }
                                                  </p>
                                                  <span>|</span>
                                                  <p className='m-0'>
                                                    {t("Pending")}{" "}
                                                    {
                                                      minuteDataSubminute
                                                        ?.MinuteStats?.pending
                                                    }
                                                  </p>
                                                  <span>|</span>
                                                  <p className='m-0'>
                                                    {t("Accepted")}{" "}
                                                    {
                                                      minuteDataSubminute
                                                        ?.MinuteStats?.accepted
                                                    }
                                                  </p>
                                                  <span>|</span>
                                                  <p className='m-0'>
                                                    {t("Reviewed")}{" "}
                                                    {
                                                      minuteDataSubminute
                                                        ?.MinuteStats?.rejected
                                                    }
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
                                                    minuteDataSubminute.minuteID ===
                                                    isOpenDrawerSubMinute
                                                      ? `${styles["Arrow"]} cursor-pointer`
                                                      : `${styles["Arrow_Expanded"]} cursor-pointer`
                                                  }
                                                  onClick={() =>
                                                    openSubMinuteDrawer(
                                                      minuteDataSubminute.minuteID
                                                    )
                                                  }
                                                />
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className={
                                                  minuteDataSubminute.minuteID ===
                                                  isOpenDrawerSubMinute
                                                    ? styles["subMinuteExtend"]
                                                    : styles[
                                                        "subMinuteNotExtend"
                                                      ]
                                                }>
                                                <p
                                                  className={`${styles["text-wrapper-review"]}`}>
                                                  <span
                                                    className={
                                                      styles["Review-pending"]
                                                    }>
                                                    Review Pending:
                                                  </span>{" "}
                                                  {minuteDataSubminute
                                                    ?.MinuteStats?.pendingUsers
                                                    ?.length > 0 &&
                                                    minuteDataSubminute?.MinuteStats?.pendingUsers.map(
                                                      (
                                                        pendingUserData,
                                                        index
                                                      ) =>
                                                        index ===
                                                        minuteDataSubminute
                                                          .MinuteStats
                                                          .pendingUsers.length -
                                                          1
                                                          ? `${pendingUserData}`
                                                          : `${pendingUserData}, `
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
                                                  {minuteDataSubminute
                                                    ?.MinuteStats
                                                    ?.acceptedByUsers?.length >
                                                    0 &&
                                                    minuteDataSubminute?.MinuteStats?.acceptedByUsers.map(
                                                      (
                                                        acceptedUserData,
                                                        index
                                                      ) =>
                                                        index ===
                                                        minuteDataSubminute
                                                          .MinuteStats
                                                          .acceptedByUsers
                                                          .length -
                                                          1
                                                          ? `${acceptedUserData}`
                                                          : `${acceptedUserData}, `
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
                                                  {minuteDataSubminute
                                                    ?.MinuteStats
                                                    ?.rejectedByUsers?.length >
                                                    0 &&
                                                    minuteDataSubminute?.MinuteStats?.rejectedByUsers.map(
                                                      (
                                                        rejectedUserData,
                                                        index
                                                      ) =>
                                                        index ===
                                                        minuteDataSubminute
                                                          .MinuteStats
                                                          .rejectedByUsers
                                                          .length -
                                                          1
                                                          ? `${rejectedUserData}`
                                                          : `${rejectedUserData}, `
                                                    )}
                                                </p>
                                              </Col>
                                            </Row>
                                          </div>
                                        </Col>
                                      </Row>
                                    ) : null}

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
                                            <Col lg={9} md={9} sm={12}>
                                              <p
                                                dangerouslySetInnerHTML={{
                                                  __html:
                                                    minuteDataSubminute.description,
                                                }}
                                                className={
                                                  styles["minutes-text"]
                                                }></p>
                                              {minuteDataSubminute.attachments
                                                .length > 0 ? (
                                                <Row>
                                                  {minuteDataSubminute.attachments.map(
                                                    (
                                                      subFileData,
                                                      subFileIndex
                                                    ) => (
                                                      <Col
                                                        lg={3}
                                                        md={3}
                                                        sm={12}>
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
                                                            minuteDataSubminute.attachments
                                                          }
                                                          id={
                                                            subFileData.pK_FileID
                                                          }
                                                          name={
                                                            subFileData.displayFileName
                                                          }
                                                          handleEyeIcon={() =>
                                                            pdfData(
                                                              minuteDataSubminute.attachments,
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
                                                  <div
                                                    className={
                                                      styles["gap-ti"]
                                                    }>
                                                    <img
                                                      src={`data:image/jpeg;base64,${minuteDataSubminute.uploader.displayProfilePictureName}`}
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
                                                        minuteDataSubminute.userName
                                                      }
                                                    </p>
                                                  </div>
                                                </Col>
                                                <Col
                                                  lg={3}
                                                  md={3}
                                                  sm={12}
                                                  className='d-grid justify-content-end p-0'>
                                                  <div className='d-flex justify-content-center align-items-center'>
                                                    {(
                                                      (minuteDataSubminute.isEditable ===
                                                        true &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 1) ||
                                                      (minuteDataSubminute.isEditable ===
                                                        true &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 11) ||
                                                      (minuteDataSubminute.isEditable ===
                                                        true &&
                                                        Number(
                                                          editorRole.status
                                                        ) === 12)
                                                        ? null
                                                        : (minuteDataSubminute.isEditable ===
                                                            true &&
                                                            editorRole.role ===
                                                              "Organizer" &&
                                                            Number(
                                                              editorRole.status
                                                            ) === 9) ||
                                                          (minuteDataSubminute.isEditable ===
                                                            true &&
                                                            Number(
                                                              editorRole.status
                                                            ) === 10 &&
                                                            editorRole.role ===
                                                              "Organizer")
                                                    ) ? (
                                                      <img
                                                        className='cursor-pointer mx-2'
                                                        src={EditIcon}
                                                        alt=''
                                                        onClick={() =>
                                                          handleEditFunc(
                                                            minuteDataSubminute,
                                                            subMinuteData.agendaTitle
                                                          )
                                                        }
                                                      />
                                                    ) : null}
                                                    <div
                                                      onClick={() =>
                                                        menuPopupMinute(
                                                          minuteDataSubminute.minuteID
                                                        )
                                                      }
                                                      className={
                                                        styles["box-agendas"]
                                                      }
                                                      ref={closeMenuMinute}>
                                                      <img
                                                        className='cursor-pointer'
                                                        src={MenuIcon}
                                                        alt=''
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
                                                        }>
                                                        <span
                                                          onClick={
                                                            () =>
                                                              handleClickShowRevision(
                                                                minuteDataSubminute,
                                                                minuteDataSubminute.minuteID
                                                              )
                                                            // setShowRevisionHistory(true)
                                                          }>
                                                          {t("Revisions")}
                                                        </span>
                                                        <span
                                                          onClick={() =>
                                                            handleClickShowVersionHistory(
                                                              data,
                                                              minuteDataSubminute.minuteID
                                                            )
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
                                                    className={
                                                      styles["time-uploader"]
                                                    }>
                                                    {convertToGMTMinuteTime(
                                                      minuteDataSubminute.lastUpdatedDate +
                                                        minuteDataSubminute.lastUpdatedTime
                                                    ) + ","}
                                                  </p>
                                                  <p
                                                    className={
                                                      styles["date-uploader"]
                                                    }>
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
                                        {(minuteDataSubminute.isEditable &&
                                          Number(editorRole.status) === 1) ||
                                        Number(editorRole.status) === 11 ||
                                        Number(editorRole.status) ===
                                          12 ? null : (minuteDataSubminute.isEditable &&
                                            editorRole.role === "Organizer" &&
                                            Number(editorRole.status) === 9) ||
                                          (minuteDataSubminute.isEditable &&
                                            Number(editorRole.status) === 10 &&
                                            editorRole.role === "Organizer") ? (
                                          <img
                                            className={styles["delete-icon"]}
                                            src={DeleteIcon}
                                            alt=''
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
                                        ) : null}
                                      </Col>
                                    </Row>
                                  </>
                                )
                              )}
                            </>
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

      {deleteMinuteAgenda ? (
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
          isAgenda={isAgenda}
          advanceMeetingModalID={advanceMeetingModalID}
        />
      ) : null}
    </section>
  );
};

export default AgendaWise;
