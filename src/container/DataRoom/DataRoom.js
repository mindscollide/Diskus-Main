import React, { useEffect, useRef } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Progress, Space, Spin, Tooltip } from "antd";
import "react-circular-progressbar/dist/styles.css";
import Cancellicon from "../../assets/images/cross_dataroom.svg";
import hoverdelete from "../../assets/images/hover_delete.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/delete_dataroom.png";
import dot from "../../assets/images/Group 2898.svg";
import DrapDropIcon from "../../assets/images/DrapDropIcon.svg";
import EmptyStateSharewithme from "../../assets/images/SharewithmeEmptyIcon.svg";
import { Dash, Plus, XCircleFill } from "react-bootstrap-icons";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
import Recentadded_emptyIcon from "../../assets/images/Recentadded_emptyIcon.png";
import start from "../../assets/images/Icon feather-star.svg";
import plus from "../../assets/images/Icon feather-folder.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import { CircularProgress, Paper } from "@material-ui/core";
import styles from "./DataRoom.module.css";
import {
  Button,
  TextField,
  TableToDo,
  Loader,
  Notification,
  UploadTextField,
} from "../../components/elements";
import { Row, Col, Dropdown } from "react-bootstrap";
import { useState } from "react";
import ModalAddFolder from "./ModalAddFolder/ModalAddFolder";
import ModalOptions from "./ModalUploadOptions/ModalOptions";
import ModalCancelUpload from "./ModalCancelUpload/ModalCancelUpload";
import ModalShareFolder from "./ModalShareFolder/ModalShareFolder";
import ModalrequestingAccess from "./ModalrequestingAccess/ModalrequestingAccess";
import ModalShareFile from "./ModalShareFile/ModalShareFile";
import Dragger from "../../components/elements/Dragger/Dragger";
import ModalCancelDownload from "./ModalCancelDownload/ModalCancelDownload";
import ModalRenameFolder from "./ModalRenameFolder/ModalRenameFolder";
import ModalOptionsFolder from "./ModalUploadOptions_Folder/ModalOptions_Folder";
import {
  clearDataResponseMessage,
  dataBehaviour,
  DataRoomDownloadFileApiFunc,
  DataRoomDownloadFolderApiFunc,
  deleteFileDataroom,
  deleteFolder,
  deleteSharedFileDataroom,
  deleteSharedFolderDataroom,
  FileisExist,
  fileSharedMQTT,
  folderSharedMQTT,
  getDocumentsAndFolderApi,
  getDocumentsAndFolderApiScrollbehaviour,
  getFolderDocumentsApi,
  getRecentDocumentsApi,
  getSharedFileUsersApi,
  getSharedFolderUsersApi,
  isFolder,
  showFileDetailsModal,
  uploadDocumentsApi,
  validateUserAvailibilityEncryptedStringDataRoomApi,
} from "../../store/actions/DataRoom_actions";
import sharedIcon from "../../assets/images/shared_icon.svg";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import { _justShowDateformat } from "../../commen/functions/date_formater";
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DeleteNotificationBox from "./DeleteNotification/deleteNotification";
import FileRemoveBox from "./FileRemoved/FileRemoveBox";
import ShowRenameNotification from "./ShowRenameNotification/ShowRenameNotification";
import ActionUndoNotification from "./ActionUndoNotification/ActionUndoNotification";
import ModalShareDocument from "./ModalSharedocument/ModalShareDocument";
import {
  CheckFolderisExist,
  CreateFolder_success,
  CreateFolderEmpty,
  createFolder,
  folderUploadData,
  uploadFile,
} from "../../store/actions/FolderUploadDataroom";
import ModalRenameFile from "./ModalRenameFile/ModalRenameFile";
import ModalOptionsisExistFolder from "./ModalUploadFolderisExist/ModalUploadFolderisExist";
import { DownOutlined } from "@ant-design/icons";
import folderColor from "../../assets/images/folder_color.svg";
import { getFolderDocumentsApiScrollBehaviour } from "../../store/actions/DataRoom_actions";
import InfiniteScroll from "react-infinite-scroll-component";
import UploadindUiComponent from "./uploadindPopUp/uploadindUiComponent";
import SearchBarComponent from "./SearchFunctionality/searchBar";
import SearchComponent from "./SearchFunctionality/searchComponent";
import {
  getFileExtension,
  getIconSource,
  optionsforFile,
  optionsforFileEditableNonShareable,
  optionsforFileEditor,
  optionsforFileViewer,
  optionsforFolderEditableNonShareable,
  optionsforFolderViewer,
  optionsforFolderEditor,
  optionsforFolder,
  optionsforPDFandSignatureFlow,
  optionShareTabForViewerRole,
  optionShareTabForEditorRole,
} from "./SearchFunctionality/option";
import { allAssignessList } from "../../store/actions/Get_List_Of_Assignees";
import axios from "axios";
import ModalFileRequest from "./ModalFileRequesting/ModalFileRequesting";
import ViewDetailsModal from "./ViewDetailsModal/ViewDetailsModal";
import {
  clearDataResponseMessageDataRoom2,
  getDataAnalyticsCountApi,
  getFilesandFolderDetailsApi,
} from "../../store/actions/DataRoom2_actions";
import FileDetailsModal from "./FileDetailsModal/FileDetailsModal";
import copyToClipboard from "../../hooks/useClipBoard";
import {
  clearWorkFlowResponseMessage,
  createWorkflowApi,
  getAllPendingApprovalStatusApi,
  getAllSignaturesDocumentsforCreatorApi,
} from "../../store/actions/workflow_actions";
import ApprovalSend from "./SignatureApproval/ApprovalSend/ApprovalSend";
import {
  checkFeatureIDAvailability,
  fileFormatforSignatureFlow,
  openDocumentViewer,
} from "../../commen/functions/utils";
import ModalDeleteFile from "./ModalDeleteFile/ModalDeleteFile";
import ModalDeleteFolder from "./ModalDeleteFolder/ModalDeleteFolder";
import {
  validateExtensionsforHTMLPage,
  validationExtension,
} from "../../commen/functions/validations";
import { getAnnotationsOfDataroomAttachement } from "../../store/actions/webVieverApi_actions";

const DataRoom = () => {
  const currentUrl = window.location.href;
  let DataRoomString = localStorage.getItem("DataRoomEmail");

  // tooltip
  const dispatch = useDispatch();
  const location = useLocation();
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showbarupload, setShowbarupload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inviteModal, setInviteModal] = useState(false);
  const [optionsFileisShown, setOptionsFileisShown] = useState(false);
  const [optionsFolderisShown, setOptionsFolderisShown] = useState(false);
  const [dataRoomString, setDataRoomString] = useState("");
  const {
    uploadReducer,
    DataRoomReducer,
    LanguageReducer,
    SignatureWorkFlowReducer,
    webViewer,
  } = useSelector((state) => state);
  const SignatureResponseMessage = useSelector(
    (state) => state.SignatureWorkFlowReducer.ResponseMessage
  );
  const searchBarRef = useRef();
  const threedotFile = useRef();
  const threedotFolder = useRef();
  const [shareFileModal, setShareFileModal] = useState(false);
  const [foldermodal, setFolderModal] = useState(false);
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  const [canceluploadmodal, setCanceluploadmodal] = useState(false);
  const [searchbarshow, setSearchbarshow] = useState(false);
  const [searchoptions, setSearchoptions] = useState(false);
  const [sRowsData, setSRowsData] = useState(0);
  const [RequestFile, setRequestFile] = useState(false);
  const [gridbtnactive, setGridbtnactive] = useState(false);
  const [listviewactive, setListviewactive] = useState(true);
  const [actionundonenotification, setActionundonenotification] =
    useState(false);
  const [collapes, setCollapes] = useState(false);
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  const [showrenamenotification, setShowrenamenotification] = useState(false);
  const [showrenamemodal, setShowreanmemodal] = useState(false);
  const [showrenameFile, setShowRenameFile] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [fileremoved, setFileremoved] = useState(false);
  const [deletenotification, setDeletenotification] = useState(false);
  const [isExistFolder, setIsExistFolder] = useState(false);
  const [isFolderExist, setIsFolderExist] = useState(false);
  const [isRenameFolderData, setRenameFolderData] = useState(null);
  const [isRenameFileData, setRenameFileData] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState(0);
  const [getAllData, setGetAllData] = useState([]);
  const currentView = JSON.parse(localStorage.getItem("setTableView"));
  const [sortValue, setSortValue] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const [currentSort, setCurrentSort] = useState("descend"); // Initial sort order
  const [currentFilter, setCurrentFilter] = useState(t("Last-modified"));
  const [totalRecords, setTotalRecords] = useState(0); // Initial filter value
  let viewFolderID = localStorage.getItem("folderID");
  // thi state contains current file name which is ude to creat new folder
  const [directoryNames, setDirectoryNames] = useState("");
  // this state contain UploadingFolders Data
  const [detaUplodingForFOlder, setDetaUplodingForFOlder] = useState([]);
  // this is the state of existing modal option select
  const [folderUploadOptions, setFolderUploadOptions] = useState(1);
  // we are setting search tab for all view in different tab
  const [searchTabOpen, setSearchTabOpen] = useState(false);
  // this is canseling modal of uploadin and stop uploading

  const [isFileDelete, setIsFileDelete] = useState(false);
  const [isFolderDelete, setIsFolderDelete] = useState(false);

  const [isFileDeleteId, setIsFileDeleteId] = useState(0);
  const [isFolderDeleteId, setIsFolderDeleteId] = useState(0);

  const [canselingDetaUplodingForFOlder, setCanselingDetaUplodingForFOlder] =
    useState(false);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  // this is for only file upload states
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [tasksAttachmentsID, setTasksAttachmentsID] = useState(0);
  const DataRoomFileAndFoldersDetailsResponseMessage = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer.ResponseMessage
  );
  console.log(DataRoomFileAndFoldersDetailsResponseMessage, "Message")
  const [fileDataforAnalyticsCount, setFileDataforAnalyticsCount] =
    useState(null);
  // this is for notification
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  const [searchDataFields, setSearchDataFields] = useState({
    UserID: userID ? parseInt(userID) : 0,
    OrganizationID: organizationID ? parseInt(organizationID) : organizationID,
    StatusID: 3,
    Title: "",
    isDocument: false,
    isSpreadSheet: false,
    isPresentation: false,
    isForms: false,
    isPDF: false,
    isFolders: false,
    isVideos: false,
    isAudios: false,
    isSites: false,
    isImages: false,
    LastModifiedStartDate: "",
    LastModifiedEndDate: "",
    UserIDToSearch: 0,
    isOwnedByMe: 2,
    isSpecificUser: false,
    sRow: 0,
    Length: 10,
    SortBy: 1,
    isDescending: false,
  });
  const [searchResultsFields, setSearchResultFields] = useState({
    Date: null,
    Type: null,
    Location: null,
    People: null,
  });
  //State For the Detail View Of File And Folder
  const [detailView, setDetailView] = useState(false);

  useEffect(() => {
    try {
      if (DataRoomString !== undefined && DataRoomString !== null) {
        console.log("Test Dataroom");
        const remainingString = DataRoomString
        console.log(remainingString, "remainingStringremainingString");
        // setRequestingAccess(true);
        let Data = { Link: remainingString };

        dispatch(
          validateUserAvailibilityEncryptedStringDataRoomApi(
            navigate,
            Data,
            t,
            setShareFileModal,
            setRequestFile
          )
        );
      } else {
        navigate("/DisKus/dataroom");
      }
    } catch (error) {
      console.log("Test Dataroom", error);
    }

    return () => {
      localStorage.removeItem("DataRoomEmail");
    };
  }, [DataRoomString]);
  const apiCalling = async () => {
    if (currentView === 4) {
      let Data = {
        UserID: Number(userID),
        OrganizationID: Number(organizationID),
      };
      dispatch(getRecentDocumentsApi(navigate, t, Data));
    } else if (currentView === 5) {
      let newData = { IsCreator: true };
      await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
      // let Data = { pageNo: 1, pageSize: 10 };
      // await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));

      setGetAllData([]);
      setSharedwithmebtn(true);
      localStorage.removeItem("folderID");
      if (searchoptions) {
        setSearchoptions(false);
      }
    } else {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 1));
      localStorage.removeItem("folderID");
    }
  };
  useEffect(() => {
    try {
      if (performance.navigation.type === 1) {
        //     dispatch(allAssignessList(navigate, t,false));
      }
      window.addEventListener("click", async function (e) {
        let clsname = e.target.className;
        if (typeof clsname === "string") {
          let arr = clsname && clsname.split("_");
          if (arr !== undefined) {
            if (searchbarshow === true) {
              if (
                arr[0] !== "DataRoom" &&
                arr[1] !== "Drop" &&
                arr[2] !== "Down" &&
                arr[3] !== "searchBar"
              ) {
                setSearchbarshow(false);
              }
            } else if (arr[2] === "dataRoomSearchInput") {
              setSearchbarshow(true);
            }
          }
        }
      });
    } catch {}
    if (currentView !== null) {
      apiCalling();
      // if (currentView === 4) {
      //   let Data = {
      //     UserID: Number(userID),
      //     OrganizationID: Number(organizationID),
      //   };
      //   dispatch(getRecentDocumentsApi(navigate, t, Data));
      // } else if (currentView === 5) {
      //   let newData = { IsCreator: true };
      //   dispatch(getAllPendingApprovalStatusApi(navigate, t, newData));
      //   let Data = { pageNo: 1, pageSize: 10 };
      //   dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));
      //   setGetAllData([]);
      //   setSharedwithmebtn(true);
      //   localStorage.removeItem("folderID");
      //   if (searchoptions) {
      //     setSearchoptions(false);
      //   }
      // } else {
      //   dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 1));
      //   localStorage.removeItem("folderID");
      // }
    } else {
      localStorage.setItem("setTableView", 3);
      dispatch(getDocumentsAndFolderApi(navigate, 3, t, 1));
      localStorage.removeItem("folderID");
    }
    return () => {
      localStorage.removeItem("folderID");
      localStorage.removeItem("setTableView");
    };
  }, []);

  useEffect(() => {
    // Add an event listener to track changes in online status
    const handleOnlineStatusChange = () => {
      setIsOnline(window.navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      // Remove the event listeners when the component unmounts
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  const base64ToBlob = (base64, mimeType) => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  const displayBlobAsHtml = (blob) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      // Get the HTML content from the Blob
      const htmlContent = event.target.result;

      // Open a new tab
      const newTab = window.open();

      if (newTab) {
        // Create a new document in the new tab
        const doc = newTab.document;

        // Set up the document structure
        doc.open();
        doc.write(`
          <html>
            <head>
              <title>HTML Content</title>
            </head>
            <body style="margin:0; padding:0;">
              <div id="html-content" style="width:100%; height:100%; padding:0 15px;"></div>
            </body>
          </html>
        `);
        doc.close();

        // Inject the HTML content into the div
        const container = doc.getElementById("html-content");
        container.innerHTML = htmlContent;
      } else {
        console.error("Failed to open new tab");
      }
    };

    reader.readAsText(blob);
  };

  useEffect(() => {
    if ((webViewer.attachmentBlob, webViewer.isHTML === true)) {
      try {
        const base64String = base64ToBlob(
          webViewer.attachmentBlob,
          "text/html"
        );
        displayBlobAsHtml(base64String);
      } catch (error) {
        console.error("Error converting blob to base64:", error);
      }
      console.log(
        webViewer.attachmentBlob,
        "webViewer.attachmentBlobwebViewer.attachmentBlobwebViewer.attachmentBlob"
      );
    }
  }, [webViewer.attachmentBlob, webViewer.isHTML]);

  useEffect(() => {
    try {
      if (
        DataRoomReducer.getAllDocumentandShareFolderResponse !== null &&
        DataRoomReducer.getAllDocumentandShareFolderResponse !== undefined &&
        DataRoomReducer.getAllDocumentandShareFolderResponse.data.length > 0
      ) {
        if (DataRoomReducer.dataBehaviour) {
          dispatch(dataBehaviour(false));
          let copyData = [...getAllData];
          DataRoomReducer.getAllDocumentandShareFolderResponse.data.map(
            (data, index) => {
              copyData.push(data);
            }
          );
          setGetAllData(copyData);
          setSRowsData(
            (prev) =>
              prev +
              DataRoomReducer.getAllDocumentandShareFolderResponse.data.length
          );
          setTotalRecords(
            DataRoomReducer.getAllDocumentandShareFolderResponse.totalCount
          );
        } else {
          dispatch(dataBehaviour(false));
          setSRowsData(
            DataRoomReducer.getAllDocumentandShareFolderResponse.data.length
          );
          setTotalRecords(
            DataRoomReducer.getAllDocumentandShareFolderResponse.totalCount
          );
          setGetAllData(
            DataRoomReducer.getAllDocumentandShareFolderResponse.data
          );
        }
      } else {
        setGetAllData([]);
      }
      // }
    } catch (error) {}
  }, [DataRoomReducer.getAllDocumentandShareFolderResponse]);

  useEffect(() => {
    try {
      if (
        DataRoomReducer.getFolderDocumentResponse !== null &&
        DataRoomReducer.getFolderDocumentResponse !== undefined
      ) {
        if (DataRoomReducer.isFolder === 1) {
          dispatch(isFolder(0));
          if (DataRoomReducer.getFolderDocumentResponse?.data.length > 0) {
            if (DataRoomReducer.dataBehaviour) {
              dispatch(dataBehaviour(false));
              let newCopy = [...getAllData];
              DataRoomReducer.getFolderDocumentResponse?.data.map(
                (data, index) => newCopy.push(data)
              );
              setGetAllData(newCopy);
              setTotalRecords(
                DataRoomReducer.getFolderDocumentResponse.totalCount
              );
              setSRowsData(
                (prev) =>
                  prev + DataRoomReducer.getFolderDocumentResponse.data.length
              );
            } else {
              setGetAllData(DataRoomReducer.getFolderDocumentResponse.data);
              setTotalRecords(
                DataRoomReducer.getFolderDocumentResponse.totalCount
              );
              setSRowsData(
                DataRoomReducer.getFolderDocumentResponse.data.length
              );
            }
          }
        } else if (DataRoomReducer.isFolder === 2) {
          dispatch(isFolder(0));
          setGetAllData([]);
        }
      } else {
        setGetAllData([]);
      }
    } catch {}
  }, [DataRoomReducer.getFolderDocumentResponse]);
  // for internet

  useEffect(() => {
    try {
      if (
        DataRoomReducer.RecentDocuments !== null &&
        DataRoomReducer.RecentDocuments !== undefined
      ) {
        if (DataRoomReducer.RecentDocuments.data.length > 0) {
          let RecentData = DataRoomReducer.RecentDocuments.data;
          setGetAllData(RecentData);
        }
      }
    } catch {}
  }, [DataRoomReducer.RecentDocuments]);

  useEffect(() => {
    if (
      DataRoomReducer.getCreateFolderLink !== null &&
      DataRoomReducer.getCreateFolderLink !== ""
    ) {
      copyToClipboard(DataRoomReducer.getCreateFolderLink);
    }
  }, [DataRoomReducer.getCreateFolderLink]);

  // Share File MQTT
  useEffect(() => {
    if (DataRoomReducer.FileSharedMQTT !== null) {
      console.log(DataRoomReducer.FileSharedMQTT, currentView, "datadatadata");

      try {
        let fileData;
        const { data } = DataRoomReducer.FileSharedMQTT;
        console.log(data, "datadatadata");

        if (currentView === 2) {
          // currentView 2 for Share with me

          fileData = {
            id: data?.pK_FileID,
            sharingID: data?.pK_FileSharingID,
            name: data?.displayFileName,
            diskusName: null,
            owner: data?.sharedByUser,
            modifiedDate: data?.filesModel?.modifiedDate,
            sharedDate: data?.sharedDate,
            isFolder: false,
            permissionID: data.fK_PermissionID,
            fileSize: data?.filesModel?.fileSize,
            fileSizeOnDisk: 0,
            location: "Shared With Me",
            isShared: true,
          };
          setGetAllData([fileData, ...getAllData]);
          setTotalRecords((totalValue) => totalValue + 1);

          console.log(fileData, "datadatadata");
        } else if (currentView === 3) {
          // currentView 3 for All Tab

          fileData = {
            id: data?.pK_FileID,
            sharingID: data?.pK_FileSharingID,
            name: data?.displayFileName,
            diskusName: null,
            owner: data?.sharedByUser,
            modifiedDate: data?.filesModel?.modifiedDate,
            sharedDate: data?.sharedDate,
            isFolder: false,
            permissionID: data.fK_PermissionID,
            fileSize: data?.filesModel?.fileSize,
            fileSizeOnDisk: 0,
            location: "Shared With Me",
            isShared: true,
          };
          setGetAllData([fileData, ...getAllData]);
          setTotalRecords((totalValue) => totalValue + 1);
        }
        dispatch(fileSharedMQTT(null));
      } catch (error) {
        console.log(error);
      }
    }
  }, [DataRoomReducer.FileSharedMQTT]);
  // Remove File MQTT
  useEffect(() => {
    if (DataRoomReducer.FileRemoveMQTT !== null) {
      try {
        let fileID = Number(DataRoomReducer.FileRemoveMQTT);
        if (currentView === 2 || currentView === 3) {
          setGetAllData((getllData) => {
            return getAllData.filter((data, index) => data.id !== fileID);
          });
          setTotalRecords((totalValue) => totalValue - 1);
        }
      } catch (error) {
        console.log(error, "datadatadata");
      }
    }
  }, [DataRoomReducer.FileRemoveMQTT]);
  // Remove Folder MQTT
  useEffect(() => {
    if (DataRoomReducer.FolderRemoveMQTT !== null) {
      try {
        let folderID = Number(DataRoomReducer.FolderRemoveMQTT);
        if (currentView === 3) {
          setGetAllData((getllData) => {
            return getAllData.filter((data, index) => data.id !== folderID);
          });
          setTotalRecords((totalValue) => totalValue - 1);
        } else if (currentView === 2) {
        }
      } catch (error) {
        console.log(error);
      }
    }
  }, [DataRoomReducer.FolderRemoveMQTT]);

  // Share Folder MQTT
  useEffect(() => {
    if (DataRoomReducer.FolderSharedMQTT !== null) {
      let folderData;
      const { data } = DataRoomReducer.FolderSharedMQTT;

      try {
        if (currentView === 3) {
          // currentView 3 for All Tab
          folderData = {
            id: data.pK_FolderID,
            sharingID: data.pK_FolderSharingID,
            name: data.displayFolderName,
            diskusName: null,
            owner: data.sharedByUser,
            modifiedDate: data.folderDetails.modifiedDate,
            sharedDate: data.sharedDate,
            isFolder: true,
            permissionID: data.fK_PermissionID,
            fileSize: 0,
            fileSizeOnDisk: 0,
            location: "Shared With Me",
            isShared: true,
          };
          setGetAllData([folderData, ...getAllData]);
          setTotalRecords((totalValue) => totalValue + 1);
        } else if (currentView === 2) {
          // currentView 2 for Share with me

          folderData = {
            id: data.pK_FolderID,
            sharingID: data.pK_FolderSharingID,
            name: data.displayFolderName,
            diskusName: null,
            owner: data.sharedByUser,
            modifiedDate: data.folderDetails.modifiedDate,
            sharedDate: data.sharedDate,
            isFolder: true,
            permissionID: data.fK_PermissionID,
            fileSize: 0,
            fileSizeOnDisk: 0,
            location: "Shared With Me",
            isShared: true,
          };
          setGetAllData([folderData, ...getAllData]);
          setTotalRecords((totalValue) => totalValue + 1);
        }

        dispatch(folderSharedMQTT(null));
      } catch (error) {
        console.log(error);
      }
    }
  }, [DataRoomReducer.FolderSharedMQTT]);

  const ClosingNotificationRenameFolder = () => {
    setShowrenamenotification(false);
  };

  const showRequestingAccessModal = (record) => {
    if (record.isFolder === true) {
      let data = {
        FolderID: Number(record.id),
      };
      dispatch(DataRoomDownloadFolderApiFunc(navigate, data, t, record.name));
    } else {
      let data = {
        FileID: Number(record.id),
      };
      dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, record.name));
    }
  };

  const showShareFolderModal = (id, name) => {
    // getSharedFolderUsersApi;
    let Data = { FolderID: id };
    dispatch(getSharedFolderUsersApi(navigate, Data, t, setSharefoldermodal));
    setFolderId(id);
    setFolderName(name);
    // setSharefoldermodal(true);
    // setSharehoverstyle(true);
    // setDeltehoverstyle(false);
  };

  const showShareFileModal = (id, name) => {
    // getSharedFileUsersApi
    let Data = { FileID: id };

    dispatch(getSharedFileUsersApi(navigate, Data, t, setShareFileModal));
    setFolderId(id);
    setFileName(name);
    // setShareFileModal(true);
    // setSharehoverstyle(true);
    // setDeltehoverstyle(false);
  };

  const handleGridView = () => {
    setGridbtnactive(true);
    setListviewactive(false);
  };

  const handlelistview = () => {
    setListviewactive(true);
    setGridbtnactive(false);
  };
  const SendForApprovalButton = async () => {
    setSRowsData(0);

    localStorage.setItem("setTableView", 5);
    // getAllPendingApprovalStatusApi
    let newData = { IsCreator: true };
    await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));
    // let Data = { sRow: 0, Length: 10 };
    // await dispatch(getAllSignaturesDocumentsforCreatorApi(navigate, t, Data));

    //  localStorage.set
    setGetAllData([]);
    setSharedwithmebtn(true);
    localStorage.removeItem("folderID");
    if (searchoptions) {
      setSearchoptions(false);
    }
  };
  const SharewithmeButonShow = async () => {
    setSRowsData(0);

    localStorage.setItem("setTableView", 2);
    await dispatch(getDocumentsAndFolderApi(navigate, 2, t, 1));
    setGetAllData([]);
    setSharedwithmebtn(true);
    localStorage.removeItem("folderID");
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const MydocumentButtonShow = async () => {
    setSRowsData(0);
    localStorage.setItem("setTableView", 1);
    await dispatch(getDocumentsAndFolderApi(navigate, 1, t, 1));
    setGetAllData([]);
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const AllDocuments = async () => {
    setSRowsData(0);
    localStorage.setItem("setTableView", 3);
    localStorage.removeItem("folderID");

    await dispatch(getDocumentsAndFolderApi(navigate, 3, t, 1));
    setGetAllData([]);
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const RecentTab = async () => {
    setSRowsData(0);
    localStorage.setItem("setTableView", 4);
    localStorage.removeItem("folderID");

    let Data = {
      UserID: Number(userID),
      OrganizationID: Number(organizationID),
    };
    await dispatch(getRecentDocumentsApi(navigate, t, Data));
    setGetAllData([]);
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const openFolderModal = () => {
    setFolderModal(true);
  };

  const getFolderDocuments = async (folderid) => {
    localStorage.setItem("folderID", folderid);
    await dispatch(getFolderDocumentsApi(navigate, folderid, t));
    setSearchTabOpen(false);
    // localStorage.setItem("setTableView", 3);
  };

  const fileOptionsSelect = (data, record, pdfDataJson) => {
    if (data.value === 1) {
      if (checkFeatureIDAvailability(20)) {
        // Open on Apryse
        let ext = record?.name?.split(".").pop();
        openDocumentViewer(ext, pdfDataJson, dispatch, navigate, t, record);
      }
    } else if (data.value === 2) {
      // Share File Modal
      if (record.isFolder) {
        showShareFolderModal(record.id, record.name);
      } else {
        showShareFileModal(record.id, record.name);
      }
    } else if (data.value === 3) {
      // Rename Folder and File
      if (record.isFolder) {
        setShowreanmemodal(true);
        setRenameFolderData(record);
      } else {
        setShowRenameFile(true);
        setRenameFileData(record);
      }
    } else if (data.value === 4) {
      // View Details File and Folder
      if (record.isFolder) {
        let Data = {
          ID: record.id,
          isFolder: true,
        };
        dispatch(getFilesandFolderDetailsApi(navigate, t, Data, setDetailView));
      } else {
        let Data = {
          ID: record.id,
          isFolder: false,
        };
        dispatch(getFilesandFolderDetailsApi(navigate, t, Data, setDetailView));
      }
    } else if (data.value === 5) {
      // Download File and Folder
      if (record.isFolder === true) {
        let data = {
          FolderID: Number(record.id),
        };
        dispatch(DataRoomDownloadFolderApiFunc(navigate, data, t, record.name));
      } else {
        let data = {
          FileID: Number(record.id),
        };
        dispatch(DataRoomDownloadFileApiFunc(navigate, data, t, record.name));
      }
    } else if (data.value === 6) {
      // Delete File and Folder
      if (record.isFolder) {
        setIsFolderDeleteId(record.id);
        setIsFolderDelete(true);
        // dispatch(deleteFolder(navigate, record.id, t));
      } else {
        setIsFileDeleteId(record.id);
        setIsFileDelete(true);

        // dispatch(deleteFileDataroom(navigate, record.id, t));
      }
      // Delete File
    } else if (data.value === 7) {
      if (record.isFolder) {
        let Data = {
          FileID: Number(record.id),
        };
        dispatch(
          getDataAnalyticsCountApi(
            navigate,
            t,
            Data,
            record,
            setFileDataforAnalyticsCount
          )
        );
      } else {
        // Get Anayltics  for the document
        let Data = {
          FileID: Number(record.id),
        };
        dispatch(
          getDataAnalyticsCountApi(
            navigate,
            t,
            Data,
            record,
            setFileDataforAnalyticsCount
          )
        );
      }
    } else if (data.value === 8) {
      // Create Signature Flow
      let dataRoomData = {
        FileID: Number(record.id),
      };
      dispatch(createWorkflowApi(dataRoomData, navigate, t, pdfDataJson));
    } else if (data.value === 9) {
      if (record.isFolder) {
        let removeSharedFolder = {
          FolderSharingID: record.sharingID,
        };
        dispatch(deleteSharedFolderDataroom(navigate, removeSharedFolder, t));
      } else {
        // Remove Shared File
        let removeShareData = {
          FileSharingID: Number(record.sharingID),
        };
        dispatch(deleteSharedFileDataroom(navigate, removeShareData, t));
      }
    }
  };
  //

  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter.field === "sharedDate") {
      if (sorter.order === "ascend") {
        setIsAscending(false);

        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 1, 2, false)
        );
      } else {
        setIsAscending(true);

        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 1, 2, true)
        );
      }
    }
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleSortMyDocuments = (pagination, filters, sorter) => {
    console.log(
      { filters, sorter },
      "handleSortMyDocumentshandleSortMyDocuments"
    );
    if (sorter.field === "name") {
      setSortValue(1);
      if (sorter.order === "ascend") {
        setIsAscending(false);
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            1,
            1,
            false
          )
        );
      } else {
        setIsAscending(true);

        dispatch(
          getDocumentsAndFolderApi(navigate, Number(currentView), t, 1, 1, true)
        );
      }
    }
    if (sorter.field === "modifiedDate") {
      if (filters.modifiedDate !== null) {
        let getFilterValue = filters.modifiedDate[0];
        if (getFilterValue === 2) {
          setCurrentFilter(t("Last-modified"));
          setFilterValue(2);
        } else if (getFilterValue === 3) {
          setCurrentFilter(t("Last-modified-by-me"));
          setFilterValue(3);
        } else if (getFilterValue === 4) {
          setFilterValue(4);
          setCurrentFilter(t("Last-open-by-me"));
        }
        setSortValue(getFilterValue);
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            1,
            Number(getFilterValue),
            isAscending
          )
        );
      } else {
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            1,
            Number(2),
            isAscending
          )
        );
      }
    }

    if (sorter.field === "owner") {
      setSortValue(5);

      if (sorter.order === "descend" || sorter.order === undefined) {
        setIsAscending(true);
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            1,
            Number(5),
            true
          )
        );
      } else if (sorter.order === "ascend") {
        setIsAscending(false);

        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            1,
            Number(5),
            false
          )
        );
      }
    }
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const handleSortMyRecentTab = (pagination, filters, sorter) => {
    if (sorter.field === "name") {
      if (sorter.order === "ascend") {
        setIsAscending(false);

        dispatch(getDocumentsAndFolderApi(navigate, 5, t, 1, 1, false));
      } else {
        setIsAscending(true);

        dispatch(getDocumentsAndFolderApi(navigate, 5, t, 1, 1, true));
      }
    }
    if (sorter.field === "modifiedDate") {
      if (filters.modifiedDate !== null) {
        let getFilterValue = filters.modifiedDate[0];
        if (getFilterValue === 2) {
          setCurrentFilter(t("Last-modified"));
          setFilterValue(2);
        } else if (getFilterValue === 3) {
          setCurrentFilter(t("Last-modified-by-me"));
          setFilterValue(3);
        } else if (getFilterValue === 4) {
          setFilterValue(4);
          setCurrentFilter(t("Last-open-by-me"));
        }
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            5,
            t,
            1,
            Number(getFilterValue),
            isAscending
          )
        );
      } else {
        dispatch(getDocumentsAndFolderApi(navigate, 5, t, 1, Number(2), true));
      }
    }

    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const MyRecentTab = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "100px",

      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      render: (text, data) => {
        console.log(data, "datadatadatadata");

        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt='' draggable='false' />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}>
                    {text} <img src={sharedIcon} alt='' draggable='false' />
                  </span>
                </abbr>
              </div>
            );
          } else {
            <div className={styles["dataFolderRow"]}>
              <img
                src={getIconSource(getFileExtension(data.name))}
                alt=''
                width={"25px"}
                height={"25px"}
                className='me-2'
              />
              <abbr title={text}>
                <span
                  onClick={(e) => handleLinkClick(e, data)}
                  className={styles["dataroom_table_heading"]}>
                  {text}
                </span>
              </abbr>
            </div>;
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt='' draggable='false' />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}>
                    {text}{" "}
                  </span>
                </abbr>
              </div>
            );
          } else {
            return (
              <section className={styles["fileRow"]}>
                <img
                  src={getIconSource(getFileExtension(data.name))}
                  alt=''
                  width={"25px"}
                  height={"25px"}
                  className='me-2'
                />
                <abbr title={text}>
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                  </span>
                </abbr>
              </section>
            );
          }
        }
      },
    },
    {
      title: t("Owner"),
      dataIndex: "owner",
      key: "owner",
      width: "90px",
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "owner" && sortedInfo.order,
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: currentFilter,
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "110px",
      align: "center",
      sorter: true,
      filters: [
        {
          text: t("Last-modified"),
          value: "2",
        },
        {
          text: t("Last-modified-by-me"),
          value: "3",
        },
        {
          text: t("Last-open-by-me"),
          value: "4",
        },
        // ... other filters ...
      ],
      defaultFilteredValue: ["2", "3", "4"],
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <DownOutlined className='filter-chevron-icon-todolist' />
      ),
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "modifiedDate" && sortedInfo.order,
      render: (text, data) => {
        return (
          <span className={styles["dataroom_table_heading"]}>
            {_justShowDateformat(text)}
          </span>
        );
      },
    },
    {
      title: t("File-size"),
      dataIndex: "fileSize",
      key: "fileSize",
      width: "90px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.isFolder) {
          return <Dash />;
        } else {
          return <span className={styles["ownerName"]}>{`${text} MB`}</span>;
        }
      },
    },
    {
      title: (
        <span className={styles["dataroom_location"]}>{t("Location")}</span>
      ),
      dataIndex: "location",
      key: "location",
      width: "90px",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return (
          <span className={styles["Dataroom__mydocument_location"]}>
            {text}
          </span>
        );
      },
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "180px",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        const pdfData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
        };
        let fileExtension = getFileExtension(record.name);
        const pdfDataJson = JSON.stringify(pdfData);
        const pdfDataforSignature = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
          isNew: true,
        };
        const pdfDataJsonSignature = JSON.stringify(pdfDataforSignature);

        if (record.isShared) {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                  <div className='tablerowFeatures'>
                    {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      //  Share Icon

                      <Tooltip placement='topRight' title={t("Share")}>
                        <span className={styles["share__Icon"]}>
                          <svg
                            className={styles["share__Icon_img"]}
                            onClick={() => {
                              if (record.isFolder) {
                                showShareFolderModal(record.id, record.name);
                              } else {
                                showShareFileModal(record.id, record.name);
                              }
                            }}
                            xmlns='http://www.w3.org/2000/svg'
                            width='16.022'
                            height='11.71'
                            viewBox='0 0 16.022 11.71'>
                            <path
                              id='Icon_material-group-add'
                              data-name='Icon material-group-add'
                              d='M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z'
                              transform='translate(0.5 -7)'
                              fill='none'
                              stroke='#5a5a5a'
                            />
                          </svg>
                        </span>
                      </Tooltip>
                    )}
                    {/* Download Icon */}
                    <Tooltip placement='topRight' title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=''
                          height='10.71px'
                          width='15.02px'
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>
                    {/* {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      <Tooltip placement="topRight" title={t("Delete")}>
                        <span className={styles["delete__Icon"]}>
                          <img
                            src={hoverdelete}
                            height="10.71px"
                            alt=""
                            width="15.02px"
                            className={styles["delete__Icon_img_hover"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                          <img
                            src={del}
                            height="12.17px"
                            alt=""
                            width="9.47px"
                            className={styles["delete__Icon_img"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                        </span>
                      </Tooltip>
                    )} */}
                  </div>

                  <Tooltip placement='topRight' title={t("More")}>
                    <span className={styles["threeDot__Icon"]}>
                      {record.isFolder ? (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {record.permissionID === 2
                              ? optionsforFolderEditor(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(data, record)
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 1
                              ? optionsforFolderViewer(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(data, record)
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 3
                              ? optionsforFolderEditableNonShareable(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(data, record)
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : null}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {record.permissionID === 2
                              ? optionsforFileEditor(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 1
                              ? optionsforFileViewer(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 3
                              ? optionsforFileEditableNonShareable(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(
                                            data,
                                            record,
                                            pdfDataJson
                                          )
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : null}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </>
          );
        } else {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                  <div className='tablerowFeatures'>
                    <Tooltip placement='topRight' title={t("Share")}>
                      <span className={styles["share__Icon"]}>
                        <svg
                          className={styles["share__Icon_img"]}
                          onClick={() => {
                            if (record.isFolder) {
                              showShareFolderModal(record.id, record.name);
                            } else {
                              showShareFileModal(record.id, record.name);
                            }
                          }}
                          xmlns='http://www.w3.org/2000/svg'
                          width='16.022'
                          height='11.71'
                          viewBox='0 0 16.022 11.71'>
                          <path
                            id='Icon_material-group-add'
                            data-name='Icon material-group-add'
                            d='M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z'
                            transform='translate(0.5 -7)'
                            fill='none'
                            stroke='#5a5a5a'
                          />
                        </svg>
                      </span>
                    </Tooltip>
                    <Tooltip placement='topRight' title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=''
                          height='10.71px'
                          width='15.02px'
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip placement='topRight' title={t("Delete")}>
                      <span className={styles["delete__Icon"]}>
                        <img
                          src={hoverdelete}
                          height='10.71px'
                          alt=''
                          width='15.02px'
                          className={styles["delete__Icon_img_hover"]}
                          onClick={() => {
                            if (record.isFolder) {
                              dispatch(deleteFolder(navigate, record.id, t));
                            } else {
                              dispatch(
                                deleteFileDataroom(navigate, record.id, t)
                              );
                            }
                          }}
                        />
                        <img
                          src={del}
                          height='12.17px'
                          alt=''
                          width='9.47px'
                          className={styles["delete__Icon_img"]}
                          onClick={() => {
                            if (record.isFolder) {
                              dispatch(deleteFolder(navigate, record.id, t));
                            } else {
                              dispatch(
                                deleteFileDataroom(navigate, record.id, t)
                              );
                            }
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>

                  <Tooltip placement='topRight' title={t("More")}>
                    <span className={styles["threeDot__Icon"]}>
                      {record.isFolder ? (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {optionsforFolder(t).map((data, index) => {
                              return (
                                <Dropdown.Item
                                  key={index}
                                  onClick={() =>
                                    fileOptionsSelect(data, record)
                                  }>
                                  {data.label}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {fileFormatforSignatureFlow.includes(fileExtension)
                              ? optionsforPDFandSignatureFlow(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(
                                            data,
                                            record,
                                            pdfDataJsonSignature
                                          )
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : optionsforFile(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </>
          );
        }
      },
    },
  ];

  const handleLinkClick = (e, record) => {
    e.preventDefault();
    if (checkFeatureIDAvailability(20)) {
      const pdfData = {
        taskId: record.id,
        commingFrom: 4,
        fileName: record.name,
        attachmentID: record.id,
        isPermission: record.permissionID,
      };
      const pdfDataJson = JSON.stringify(pdfData);
      let ext = record.name.split(".").pop();
      openDocumentViewer(ext, pdfDataJson, dispatch, navigate, t, record);
    }
  };

  const MyDocumentsColumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      sorter: true,
      width: "200px",
      ellipsis: true,
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "name" && sortedInfo.order,
      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt='' draggable='false' />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}>
                    {text} <img src={sharedIcon} alt='' draggable='false' />
                  </span>
                </abbr>
              </div>
            );
          } else {
            return (
              <section className={styles["fileRow"]}>
                <img
                  src={getIconSource(getFileExtension(data.name))}
                  alt=''
                  width={"25px"}
                  height={"25px"}
                  className='me-2'
                />
                <abbr title={text}>
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                    <img src={sharedIcon} alt='' draggable='false' />
                  </span>
                </abbr>
              </section>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt='' draggable='false' />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}>
                    {text}{" "}
                  </span>
                </abbr>
              </div>
            );
          } else {
            return (
              <section className={styles["fileRow"]}>
                <img
                  src={getIconSource(getFileExtension(data.name))}
                  alt=''
                  width={"25px"}
                  height={"25px"}
                  className='me-2'
                />
                <abbr title={text}>
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                  </span>
                </abbr>
              </section>
            );
          }
        }
      },
    },
    {
      title: t("Owner"),
      dataIndex: "owner",
      key: "owner",
      width: "90px",
      sortDirections: ["ascend", "descend"],
      sorter: true,
      sortOrder: sortedInfo.columnKey === "owner" && sortedInfo.order,
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: <span className='text-center'>{currentFilter}</span>,
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "110px",
      align: "center",
      sorter: true,
      filters: [
        {
          text: t("Last-modified"),
          value: "2",
        },
        {
          text: t("Last-modified-by-me"),
          value: "3",
        },
        {
          text: t("Last-open-by-me"),
          value: "4",
        },
        // ... other filters ...
      ],
      defaultFilteredValue: ["2", "3", "4"],
      filterResetToDefaultFilteredValue: true,
      filterIcon: (filtered) => (
        <DownOutlined className='filter-chevron-icon-todolist' />
      ),
      sortDirections: ["ascend", "descend"],
      sortOrder: sortedInfo.columnKey === "modifiedDate" && sortedInfo.order,
      render: (text, data) => {
        return (
          <span className={styles["dataroom_table_heading"]}>
            {_justShowDateformat(text)}
          </span>
        );
      },
    },
    {
      title: t("File-size"),
      dataIndex: "fileSize",
      key: "fileSize",
      width: "90px",
      align: "center",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        if (record.isFolder) {
          return <Dash />;
        } else {
          return <span className={styles["ownerName"]}>{`${text} MB`}</span>;
        }
      },
    },
    {
      title: (
        <span className={styles["dataroom_location"]}>{t("Location")}</span>
      ),
      dataIndex: "location",
      key: "location",
      width: "90px",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return (
          <span className={styles["Dataroom__mydocument_location"]}>
            {text}
          </span>
        );
      },
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "180px",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        const pdfData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
        };
        let fileExtension = getFileExtension(record.name);
        const pdfDataJson = JSON.stringify(pdfData);
        const pdfDataforSignature = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
          isNew: true,
        };
        const pdfDataJsonSignature = JSON.stringify(pdfDataforSignature);

        if (record.isShared) {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                  <div className='tablerowFeatures'>
                    {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      //  Share Icon

                      <Tooltip placement='topRight' title={t("Share")}>
                        <span className={styles["share__Icon"]}>
                          <svg
                            className={styles["share__Icon_img"]}
                            onClick={() => {
                              if (record.isFolder) {
                                showShareFolderModal(record.id, record.name);
                              } else {
                                showShareFileModal(record.id, record.name);
                              }
                            }}
                            xmlns='http://www.w3.org/2000/svg'
                            width='16.022'
                            height='11.71'
                            viewBox='0 0 16.022 11.71'>
                            <path
                              id='Icon_material-group-add'
                              data-name='Icon material-group-add'
                              d='M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z'
                              transform='translate(0.5 -7)'
                              fill='none'
                              stroke='#5a5a5a'
                            />
                          </svg>
                        </span>
                      </Tooltip>
                    )}
                    {/* Download Icon */}
                    <Tooltip placement='topRight' title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=''
                          height='10.71px'
                          width='15.02px'
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>
                    {/* {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      <Tooltip placement="topRight" title={t("Delete")}>
                        <span className={styles["delete__Icon"]}>
                          <img
                            src={hoverdelete}
                            height="10.71px"
                            alt=""
                            width="15.02px"
                            className={styles["delete__Icon_img_hover"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                          <img
                            src={del}
                            height="12.17px"
                            alt=""
                            width="9.47px"
                            className={styles["delete__Icon_img"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                        </span>
                      </Tooltip>
                    )} */}
                  </div>

                  <Tooltip placement='topRight' title={t("More")}>
                    <span className={styles["threeDot__Icon"]}>
                      {record.isFolder ? (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {record.permissionID === 2
                              ? optionsforFolderEditor(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(data, record)
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 1
                              ? optionsforFolderViewer(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(data, record)
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 3
                              ? optionsforFolderEditableNonShareable(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(data, record)
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : null}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {record.permissionID === 2
                              ? optionsforFileEditor(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 1
                              ? optionsforFileViewer(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })
                              : record.permissionID === 3
                              ? optionsforFileEditableNonShareable(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(
                                            data,
                                            record,
                                            pdfDataJson
                                          )
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : null}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </>
          );
        } else {
          return (
            <>
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                  <div className='tablerowFeatures'>
                    <Tooltip placement='topRight' title={t("Share")}>
                      <span className={styles["share__Icon"]}>
                        <svg
                          className={styles["share__Icon_img"]}
                          onClick={() => {
                            if (record.isFolder) {
                              showShareFolderModal(record.id, record.name);
                            } else {
                              showShareFileModal(record.id, record.name);
                            }
                          }}
                          xmlns='http://www.w3.org/2000/svg'
                          width='16.022'
                          height='11.71'
                          viewBox='0 0 16.022 11.71'>
                          <path
                            id='Icon_material-group-add'
                            data-name='Icon material-group-add'
                            d='M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z'
                            transform='translate(0.5 -7)'
                            fill='none'
                            stroke='#5a5a5a'
                          />
                        </svg>
                      </span>
                    </Tooltip>
                    <Tooltip placement='topRight' title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=''
                          height='10.71px'
                          width='15.02px'
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>

                    <Tooltip placement='topRight' title={t("Delete")}>
                      <span className={styles["delete__Icon"]}>
                        <img
                          src={hoverdelete}
                          height='10.71px'
                          alt=''
                          width='15.02px'
                          className={styles["delete__Icon_img_hover"]}
                          onClick={() => {
                            if (record.isFolder) {
                              setIsFolderDeleteId(record.id);
                              setIsFolderDelete(true);

                              // dispatch(deleteFolder(navigate, record.id, t));
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);

                              // dispatch(deleteFileDataroom(navigate, record.id, t));
                            }
                          }}
                        />
                        <img
                          src={del}
                          height='12.17px'
                          alt=''
                          width='9.47px'
                          className={styles["delete__Icon_img"]}
                          onClick={() => {
                            if (record.isFolder) {
                              setIsFolderDeleteId(record.id);
                              setIsFolderDelete(true);
                              // dispatch(deleteFolder(navigate, record.id, t));
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);

                              // dispatch(deleteFileDataroom(navigate, record.id, t));
                            }
                            // if (record.isFolder) {
                            //   dispatch(deleteFolder(navigate, record.id, t));
                            // } else {
                            //   dispatch(
                            //     deleteFileDataroom(navigate, record.id, t)
                            //   );
                            // }
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>

                  <Tooltip placement='topRight' title={t("More")}>
                    <span className={styles["threeDot__Icon"]}>
                      {record.isFolder ? (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {optionsforFolder(t).map((data, index) => {
                              return (
                                <Dropdown.Item
                                  key={index}
                                  onClick={() =>
                                    fileOptionsSelect(data, record)
                                  }>
                                  {data.label}
                                </Dropdown.Item>
                              );
                            })}
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        <Dropdown
                          className={`${
                            styles["options_dropdown"]
                          } ${"dataroom_options"}`}>
                          <Dropdown.Toggle id='dropdown-autoclose-true'>
                            <img
                              src={dot}
                              alt=''
                              width='15.02px'
                              height='10.71px'
                            />
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            {fileFormatforSignatureFlow.includes(fileExtension)
                              ? optionsforPDFandSignatureFlow(t).map(
                                  (data, index) => {
                                    return (
                                      <Dropdown.Item
                                        key={index}
                                        onClick={() =>
                                          fileOptionsSelect(
                                            data,
                                            record,
                                            pdfDataJsonSignature
                                          )
                                        }>
                                        {data.label}
                                      </Dropdown.Item>
                                    );
                                  }
                                )
                              : optionsforFile(t).map((data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                })}
                            {}
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </span>
                  </Tooltip>
                </Col>
              </Row>
            </>
          );
        }
      },
    },
  ];

  const shareWithmeColoumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: "250px",
      render: (text, record) => {
        console.log(record, "datadatadatadata");

        let ext = record.name.split(".").pop();

        if (record.isFolder) {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <img src={folderColor} alt='' draggable='false' />
              <span
                className={styles["dataroom_table_heading"]}
                onClick={() => getFolderDocuments(record.id)}>
                {text} <img src={sharedIcon} alt='' draggable='false' />
              </span>
            </div>
          );
        } else {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <img
                src={getIconSource(getFileExtension(record.name))}
                alt=''
                width={"25px"}
                height={"25px"}
              />
              <span
                className={styles["dataroom_table_heading"]}
                onClick={(e) => handleLinkClick(e, record)}>
                {record.name} <img src={sharedIcon} alt='' draggable='false' />
              </span>
            </div>
          );
        }
      },
    },
    {
      title: t("Shared-by"),
      dataIndex: "owner",
      key: "owner",
      width: "90px",
      // sorter: true,
      // sortOrder: currentSort,
      // sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: t("Share-date"),
      dataIndex: "sharedDate",
      key: "sharedDate",
      width: "90px",
      sorter: true,
      sortDirections: ["descend", "ascend"],
      sortOrder: currentSort,
      render: (text, record) => {
        if (text !== "") {
          return (
            <span className={styles["dataroom_table_heading"]}>
              {_justShowDateformat(text)}
            </span>
          );
        }
      },
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "180px",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        const pdfData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
        };
        let fileExtension = getFileExtension(record.name);
        const pdfDataJson = JSON.stringify(pdfData);
        const pdfDataforSignature = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
          isNew: true,
        };
        const pdfDataJsonSignature = JSON.stringify(pdfDataforSignature);

        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                <div className='tablerowFeatures'>
                  {record.permissionID === 1 ||
                  record.permissionID === 3 ? null : (
                    //  Share Icon

                    <Tooltip placement='topRight' title={t("Share")}>
                      <span className={styles["share__Icon"]}>
                        <svg
                          className={styles["share__Icon_img"]}
                          onClick={() => {
                            if (record.isFolder) {
                              showShareFolderModal(record.id, record.name);
                            } else {
                              showShareFileModal(record.id, record.name);
                            }
                          }}
                          xmlns='http://www.w3.org/2000/svg'
                          width='16.022'
                          height='11.71'
                          viewBox='0 0 16.022 11.71'>
                          <path
                            id='Icon_material-group-add'
                            data-name='Icon material-group-add'
                            d='M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z'
                            transform='translate(0.5 -7)'
                            fill='none'
                            stroke='#5a5a5a'
                          />
                        </svg>
                      </span>
                    </Tooltip>
                  )}
                  {/* Download Icon */}
                  <Tooltip placement='topRight' title={t("Download")}>
                    <span className={styles["download__Icon"]}>
                      <img
                        src={download}
                        alt=''
                        height='10.71px'
                        width='15.02px'
                        className={styles["download__Icon_img"]}
                        onClick={() => showRequestingAccessModal(record)}
                      />
                    </span>
                  </Tooltip>
                  {/* {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      <Tooltip placement="topRight" title={t("Delete")}>
                        <span className={styles["delete__Icon"]}>
                          <img
                            src={hoverdelete}
                            height="10.71px"
                            alt=""
                            width="15.02px"
                            className={styles["delete__Icon_img_hover"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                          <img
                            src={del}
                            height="12.17px"
                            alt=""
                            width="9.47px"
                            className={styles["delete__Icon_img"]}
                            onClick={() => {
                              if (record.isFolder) {
                                dispatch(deleteFolder(navigate, record.id, t));
                              } else {
                                dispatch(
                                  deleteFileDataroom(navigate, record.id, t)
                                );
                              }
                            }}
                          />
                        </span>
                      </Tooltip>
                    )} */}
                </div>

                <Tooltip placement='topRight' title={t("More")}>
                  <span className={styles["threeDot__Icon"]}>
                    {record.isFolder ? (
                      <Dropdown
                        className={`${
                          styles["options_dropdown"]
                        } ${"dataroom_options"}`}>
                        <Dropdown.Toggle id='dropdown-autoclose-true'>
                          <img
                            src={dot}
                            alt=''
                            width='15.02px'
                            height='10.71px'
                          />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {record.permissionID === 2
                            ? optionsforFolderEditor(t).map((data, index) => {
                                return (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      fileOptionsSelect(data, record)
                                    }>
                                    {data.label}
                                  </Dropdown.Item>
                                );
                              })
                            : record.permissionID === 1
                            ? optionsforFolderViewer(t).map((data, index) => {
                                return (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      fileOptionsSelect(data, record)
                                    }>
                                    {data.label}
                                  </Dropdown.Item>
                                );
                              })
                            : record.permissionID === 3
                            ? optionsforFolderEditableNonShareable(t).map(
                                (data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(data, record)
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                }
                              )
                            : null}
                        </Dropdown.Menu>
                      </Dropdown>
                    ) : (
                      <Dropdown
                        className={`${
                          styles["options_dropdown"]
                        } ${"dataroom_options"}`}>
                        <Dropdown.Toggle id='dropdown-autoclose-true'>
                          <img
                            src={dot}
                            alt=''
                            width='15.02px'
                            height='10.71px'
                          />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {record.permissionID === 2
                            ? optionsforFileEditor(t).map((data, index) => {
                                return (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      fileOptionsSelect(
                                        data,
                                        record,
                                        pdfDataJson
                                      )
                                    }>
                                    {data.label}
                                  </Dropdown.Item>
                                );
                              })
                            : record.permissionID === 1
                            ? optionsforFileViewer(t).map((data, index) => {
                                return (
                                  <Dropdown.Item
                                    key={index}
                                    onClick={() =>
                                      fileOptionsSelect(
                                        data,
                                        record,
                                        pdfDataJson
                                      )
                                    }>
                                    {data.label}
                                  </Dropdown.Item>
                                );
                              })
                            : record.permissionID === 3
                            ? optionsforFileEditableNonShareable(t).map(
                                (data, index) => {
                                  return (
                                    <Dropdown.Item
                                      key={index}
                                      onClick={() =>
                                        fileOptionsSelect(
                                          data,
                                          record,
                                          pdfDataJson
                                        )
                                      }>
                                      {data.label}
                                    </Dropdown.Item>
                                  );
                                }
                              )
                            : null}
                        </Dropdown.Menu>
                      </Dropdown>
                    )}
                  </span>
                </Tooltip>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  useEffect(() => {
    if (location.state !== null) {
      let fileObj = location.state;
      handleUploadFilefromDashbard(fileObj);
    }
  }, [location.state]);

  const handleUploadFilefromDashbard = async (file) => {
    const taskId = Math.floor(Math.random() * 1000000);
    const axiosCancelSource = axios.CancelToken.source();
    let newJsonCreateFile = {
      TaskId: taskId,
      FileName: "",
      File: {},
      Uploaded: false,
      Uploading: false,
      UploadCancel: false,
      Progress: 0,
      UploadingError: false,
      NetDisconnect: false,
      axiosCancelToken: axiosCancelSource,
    };
    if (file.name && Object.keys(file).length > 0) {
      newJsonCreateFile = {
        TaskId: newJsonCreateFile.TaskId,
        FileName: file.name,
        File: file,
        Uploaded: newJsonCreateFile.Uploaded,
        Uploading: newJsonCreateFile.Uploading,
        UploadCancel: newJsonCreateFile.UploadCancel,
        Progress: newJsonCreateFile.Progress,
        UploadingError: newJsonCreateFile.UploadingError,
        NetDisconnect: false,
        axiosCancelToken: axiosCancelSource,
      };
      setTasksAttachmentsID(newJsonCreateFile.TaskId);
      setTasksAttachments((prevTasks) => ({
        ...prevTasks,
        [taskId]: newJsonCreateFile,
      }));
      dispatch(
        FileisExist(
          navigate,
          t,
          newJsonCreateFile,
          setTasksAttachments,
          tasksAttachments,
          setShowbarupload,
          showbarupload
        )
      );
    }
  };

  // this is file Upload
  const handleUploadFile = async ({ file }) => {
    const taskId = Math.floor(Math.random() * 1000000);
    const axiosCancelSource = axios.CancelToken.source();
    let newJsonCreateFile = {
      TaskId: taskId,
      FileName: "",
      File: {},
      Uploaded: false,
      Uploading: false,
      UploadCancel: false,
      Progress: 0,
      UploadingError: false,
      NetDisconnect: false,
      axiosCancelToken: axiosCancelSource,
    };
    if (file.name && Object.keys(file).length > 0) {
      newJsonCreateFile = {
        TaskId: newJsonCreateFile.TaskId,
        FileName: file.name,
        File: file,
        Uploaded: newJsonCreateFile.Uploaded,
        Uploading: newJsonCreateFile.Uploading,
        UploadCancel: newJsonCreateFile.UploadCancel,
        Progress: newJsonCreateFile.Progress,
        UploadingError: newJsonCreateFile.UploadingError,
        NetDisconnect: false,
        axiosCancelToken: axiosCancelSource,
      };
      setTasksAttachmentsID(newJsonCreateFile.TaskId);
      setTasksAttachments((prevTasks) => ({
        ...prevTasks,
        [taskId]: newJsonCreateFile,
      }));
      dispatch(
        FileisExist(
          navigate,
          t,
          newJsonCreateFile,
          setTasksAttachments,
          tasksAttachments,
          setShowbarupload,
          showbarupload
        )
      );
    }
  };

  // this is for file check
  useEffect(() => {
    // its check that reducer state is not null
    if (DataRoomReducer.isFileExsist === true) {
      setUploadOptionsmodal(true);
    } else {
    }
  }, [DataRoomReducer.isFileExsist]);

  // cancel file upload
  const cancelFileUpload = (data) => {
    setTasksAttachments((prevTasks) => ({
      ...prevTasks,
      [data.TaskId]: {
        ...prevTasks[data.TaskId],
        UploadCancel: true,
        Uploaded: false,
        Uploading: false,
        Progress: 0,
      },
    }));
    if (data.axiosCancelToken) {
      data.axiosCancelToken.cancel("Upload canceled");
    }

    // Optionally, you can also cancel the Axios request associated with this task here.
  };
  // const isOnline = navigator.onLine;

  // Handle online status changes
  const handleOnlineStatusChange = (event) => {
    let isOnline = navigator.onLine;

    // Loop through your attachments and update NetDisconnect
    for (const taskId in tasksAttachments) {
      if (tasksAttachments.hasOwnProperty(taskId)) {
        const attachment = tasksAttachments[taskId];
        if (attachment.Uploading && !isOnline) {
          // Update NetDisconnect to true for the file
          setTasksAttachments((prevTasks) => ({
            ...prevTasks,
            [taskId]: {
              ...attachment,
              NetDisconnect: true,
              Uploading: false,
            },
          }));
        }
      }
    }
    if (!isOnline) {
      // Loop through your detaUplodingForFOlder array and update NetDisconnect
      const updatedFolders = detaUplodingForFOlder.map((folder) => {
        if (folder.Uploading && folder.Uploaded === false) {
          return {
            ...folder,
            NetDisconnect: true,
            Uploading: false,
          };
        }
        return folder;
      });

      setDetaUplodingForFOlder(updatedFolders);
    }
  };

  useEffect(() => {
    // Listen for online/offline events
    // window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Cleanup event listeners when the component unmounts
    return () => {
      // window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, [tasksAttachments, detaUplodingForFOlder]);

  // this fun triger when upload folder triiger
  const handleChangeFolderUpload = ({ directoryName, fileList }) => {
    const axiosCancelSource = axios.CancelToken.source();

    try {
      let newJsonCreate = {
        FolderName: "",
        FolderID: 0,
        FileList: [],
        Uploaded: false,
        Uploading: false,
        UploadCancel: false,
        UploadedAttachments: 0,
        NetDisconnect: false,
      };
      // this is use to set data in sate of current upload
      if (directoryName) {
        newJsonCreate = {
          FolderName: directoryName,
          FileList: fileList,
          FolderID: newJsonCreate.FolderID,
          Uploaded: newJsonCreate.Uploaded,
          Uploading: newJsonCreate.Uploading,
          UploadCancel: newJsonCreate.UploadCancel,
          UploadedAttachments: newJsonCreate.UploadedAttachments,
          NetDisconnect: false,
          axiosCancelToken: axiosCancelSource,
        };

        setDirectoryNames(directoryName);
        setDetaUplodingForFOlder((prevFolders) => [
          ...prevFolders,
          newJsonCreate,
        ]);
        dispatch(CheckFolderisExist(navigate, newJsonCreate, t));
      }
    } catch (error) {
      // Handle errors
    }
  };

  useEffect(() => {
    // its check that reducer state is not null
    if (DataRoomReducer.FolderisExistCheck === true) {
      setIsFolderExist(true);
    } else {
      if (isFolderExist) {
        setIsFolderExist(false);
        if (
          directoryNames !== "" &&
          Object.keys(detaUplodingForFOlder).length > 0 &&
          DataRoomReducer.FolderisExistCheck === null
        ) {
          const existingIndex = Object.keys(detaUplodingForFOlder).length - 1;
          // its call api for create folder
          if (existingIndex >= 0) {
            dispatch(
              createFolder(
                navigate,
                t,
                detaUplodingForFOlder[existingIndex],
                setShowbarupload,
                showbarupload,
                folderUploadOptions
              )
            );
            setFolderUploadOptions(1);
          }
        }
      }
      // its check that reducer state is false the its again check directory not null for current folder creation
      if (
        directoryNames !== "" &&
        Object.keys(detaUplodingForFOlder).length > 0 &&
        DataRoomReducer.FolderisExistCheck === false
      ) {
        const existingIndex = Object.keys(detaUplodingForFOlder).length - 1;
        // iits call api for create folder
        if (existingIndex >= 0) {
          dispatch(
            createFolder(
              navigate,
              t,
              detaUplodingForFOlder[existingIndex],
              setShowbarupload,
              showbarupload,
              0
            )
          );
        }
      }
    }
  }, [DataRoomReducer.FolderisExistCheck]);

  // this function call for current files which is in the folder
  const processArraySequentially = async (folder) => {
    let isOnline = navigator.onLine;
    if (folder.UploadCancel || folder.NetDisconnect) {
      // Skip the upload for this folder if it's canceled or there's a network disconnect
      return;
    }
    try {
      let continueUploading = true; // Flag to control API calls
      if (folder.FileList.length > 0) {
        for (const file of folder.FileList) {
          try {
            if (
              folder.Uploaded === false &&
              folder.UploadCancel === false &&
              folder.NetDisconnect === false &&
              continueUploading
            ) {
              const result = await dispatch(
                uploadFile(
                  navigate,
                  file,
                  folder.FolderID,
                  t,
                  folder.NetDisconnect
                  // cancelToken
                )
              );
              // Perform other actions with the result
              folder.UploadedAttachments = folder.UploadedAttachments + 1; // Update the count
              setDetaUplodingForFOlder((prevFolders) => [...prevFolders]); // Update state

              // You can wait for some time before proceeding to the next item
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            } else {
              continueUploading = false;
            }

            // Check for network disconnect and stop uploading if it occurs
            if (!navigator.onLine) {
              continueUploading = false;
            }

            // Call your API for the current item
          } catch (error) {}
          // If continueUploading is false, break out of the loop
          if (!continueUploading) {
            break;
          }
        }
      }

      setDirectoryNames("");
      folder.Uploaded = true;
      folder.Uploading = false;
      setDetaUplodingForFOlder((prevFolders) => [...prevFolders]);
      // dispatch(CreateFolder_success(0));
      // All API calls are complete, you can perform other actions here
    } catch {}
  };

  // this hokks triger when folder is created and its updaet its id of anew folder
  useEffect(() => {
    // this is checker of reducer if its not on its initial state
    try {
      if (DataRoomReducer.CreatedFoldersArray.length > 0) {
        const existingIndex = detaUplodingForFOlder.findIndex(
          (folder) =>
            folder.FolderName === directoryNames &&
            folder.Uploading === false &&
            folder.FolderID === 0
        );
        if (existingIndex >= 0) {
          if (
            detaUplodingForFOlder[existingIndex].Uploaded === false &&
            detaUplodingForFOlder[existingIndex].UploadCancel === false &&
            detaUplodingForFOlder[existingIndex].Uploading === false
          ) {
            const updatedFolder = {
              ...detaUplodingForFOlder[existingIndex],
              FolderName:
                DataRoomReducer.CreatedFoldersArray[existingIndex].FolderName, // Set the new folder name here
              FolderID: parseInt(
                DataRoomReducer.CreatedFoldersArray[existingIndex].FolderID
              ), // Set the new folder ID here
              Uploading: true,
            };
            // Update the last object's FolderID with dynamicData
            detaUplodingForFOlder[existingIndex] = updatedFolder;
            // this is checker if its hase no file in it so dont perform any action futer other wise hot this function for upload files
            if (detaUplodingForFOlder[existingIndex].FileList.length > 0) {
              try {
                let currentView = localStorage.getItem("setTableView");
                let viewFolderID = localStorage.getItem("folderID");
                if (viewFolderID !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(viewFolderID), t, 1)
                  );
                } else {
                  if (Number(currentView) === 4) {
                    let Data = {
                      UserID: Number(userID),
                      OrganizationID: Number(organizationID),
                    };
                    dispatch(getRecentDocumentsApi(navigate, t, Data));
                  } else {
                    dispatch(
                      getDocumentsAndFolderApi(
                        navigate,
                        Number(currentView),
                        t,
                        2
                      )
                    );
                  }
                }
                processArraySequentially(detaUplodingForFOlder[existingIndex]);
              } catch (error) {}
            } else {
            }
          }
        }
      }
    } catch (error) {}
  }, [DataRoomReducer.CreatedFoldersArray]);

  const cancelUpload = (folder) => {
    folder.UploadCancel = true;
    folder.Uploading = false;
    setDetaUplodingForFOlder((prevFolders) => [...prevFolders]);
  };

  // this is used for canle all uploadind
  const CanceUpload = () => {
    const dataArray = Object.values(tasksAttachments);
    const combinedArray = [...detaUplodingForFOlder, ...dataArray];
    const isUploading = combinedArray.some((obj) => obj.Uploading === true);
    if (isUploading) {
      setCanselingDetaUplodingForFOlder(true);
    } else {
      setDetaUplodingForFOlder([]);
      setTasksAttachments([]);
      setShowbarupload(false);
      dispatch(CreateFolderEmpty());
    }
  };

  const CanceUploadinFromModalTrue = async (data) => {
    const dataArray = Object.values(tasksAttachments);
    await dataArray.map((data, index) => {
      data.axiosCancelToken.cancel("Upload canceled");
    });
    detaUplodingForFOlder.map((data, index) => {
      data.UploadCancel = true;
      data.Uploading = false;
      return data;
    });
    dispatch(CreateFolderEmpty());

    // setDetaUplodingForFOlder(newFolderData);
    // cancelToken.cancel("API call canceled by user");
    setDetaUplodingForFOlder([]);
    setTasksAttachments([]);
    setShowbarupload(false);
    setCanselingDetaUplodingForFOlder(false);
    // if (data.axiosCancelToken) {
    //   data.axiosCancelToken.cancel("Upload canceled");
    //
    // }
  };

  const handleOutsideClick = (event) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target) &&
      searchbarshow
    ) {
      setSearchbarshow(false);
    }
    if (
      threedotFolder.current &&
      !threedotFolder.current.contains(event.target) &&
      optionsFolderisShown
    ) {
      setOptionsFolderisShown(false);
    }
    if (
      threedotFile.current &&
      !threedotFile.current.contains(event.target) &&
      optionsFileisShown
    ) {
      setOptionsFileisShown(false);
    }
  };

  // this is working perfect
  const checkCondition = () => {
    const dataArray = Object.values(tasksAttachments);
    const combinedArray = [...detaUplodingForFOlder, ...dataArray];
    if (Object.keys(combinedArray).length === 0) {
      return false;
    }

    const hasUploadingTrue = combinedArray.some(
      (obj) => obj.Uploading === true
    );
    return hasUploadingTrue;
  };

  useEffect(() => {
    const unloadCallback = (event) => {
      if (checkCondition()) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = "";
        }
        return "";
      }
    };
    // For page refresh or tab close
    window.onbeforeunload = function () {
      if (checkCondition()) {
        return "Data will be lost if you leave the page, are you sure?";
      }
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => {
      window.removeEventListener("beforeunload", unloadCallback);
    };
  }, [detaUplodingForFOlder, tasksAttachments]);

  // api call onscroll
  const handleScroll = async (e) => {
    if (sRowsData <= totalRecords) {
      await dispatch(dataBehaviour(true));
      if (
        viewFolderID !== null &&
        viewFolderID !== undefined &&
        Number(viewFolderID) !== 0
      ) {
        await dispatch(
          getFolderDocumentsApiScrollBehaviour(
            navigate,
            viewFolderID,
            t,
            2,
            sRowsData,
            1,
            true
          )
        );
      } else {
        await dispatch(
          getDocumentsAndFolderApiScrollbehaviour(
            navigate,
            currentView,
            t,
            Number(sRowsData),
            Number(sortValue),
            isAscending
          )
        );
      }
    }
  };

  // const handleUploadDocuemtuploadOptions = () => { }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [searchbarshow, optionsFileisShown, optionsFolderisShown]);

  useEffect(() => {
    if (
      DataRoomReducer.ResponseMessage !== "" &&
      DataRoomReducer.ResponseMessage !== t("No-record-found") &&
      DataRoomReducer.ResponseMessage !==
        t("No-folder-exist-against-this-name") &&
      DataRoomReducer.ResponseMessage !== t("No-duplicate-found") &&
      DataRoomReducer.ResponseMessage !== "" &&
      DataRoomReducer.ResponseMessage !== t("Document-uploaded-successfully") &&
      DataRoomReducer.ResponseMessage !== t("Files-saved-successfully")
    ) {
      setOpen({
        open: true,
        message: DataRoomReducer.ResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        dispatch(clearDataResponseMessage());
      }, 4000);
    }
    if (
      DataRoomReducer.FolderisExistMessage !== "" &&
      DataRoomReducer.FolderisExistMessage !== t("Folder-already-exist")
    ) {
      setOpen({
        open: true,
        message: DataRoomReducer.FolderisExistMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        dispatch(clearDataResponseMessage());
      }, 4000);
    }
    if (
      DataRoomReducer.FileisExistMessage !== "" &&
      DataRoomReducer.FileisExistMessage !== t("File-already-exist")
    ) {
      setOpen({
        open: true,
        message: DataRoomReducer.FileisExistMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        dispatch(clearDataResponseMessage());
      }, 4000);
    }
    if (DataRoomFileAndFoldersDetailsResponseMessage !== "") {
      setOpen({
        open: true,
        message: DataRoomFileAndFoldersDetailsResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        dispatch(clearDataResponseMessageDataRoom2());
      }, 4000);
    }
  }, [
    DataRoomReducer.FileisExistMessage,
    DataRoomReducer.FolderisExistMessage,
    DataRoomReducer.ResponseMessage,
    DataRoomFileAndFoldersDetailsResponseMessage,
  ]);
  console.log(
    SignatureResponseMessage,
    "SignatureResponseMessageSignatureResponseMessage"
  );
  useEffect(() => {
    if (
      SignatureResponseMessage !== "" &&
      SignatureResponseMessage !== undefined &&
      SignatureResponseMessage !== null
    ) {
      setOpen({
        open: true,
        message: SignatureResponseMessage,
      });
      setTimeout(() => {
        setOpen({
          open: false,
          message: "",
        });
        dispatch(clearWorkFlowResponseMessage());
      }, 4000);
    }
  }, [SignatureResponseMessage]);

  const handleClickDeleteFolder = () => {
    dispatch(
      deleteFolder(navigate, Number(isFolderDeleteId), t, setIsFolderDelete)
    );
  };
  const handleCancelDeleteFolder = () => {
    setIsFolderDeleteId(0);
    setIsFolderDelete(false);
  };
  const handleCancelDeleteFile = () => {
    setIsFileDeleteId(0);
    setIsFileDelete(false);
  };
  const handleClickDeleteFile = () => {
    dispatch(
      deleteFileDataroom(navigate, Number(isFileDeleteId), t, setIsFileDelete)
    );
  };
  return (
    <>
      <div className={styles["DataRoom_container"]}>
        {deletenotification && <DeleteNotificationBox />}
        {fileremoved && <FileRemoveBox />}
        {showrenamenotification && (
          <ShowRenameNotification
            ClosingNotificationRenameFolder={ClosingNotificationRenameFolder}
          />
        )}
        {actionundonenotification && <ActionUndoNotification />}
        <Row className='mt-3'>
          <Col sm={12} md={12} lg={12}>
            <Row>
              <Col
                lg={4}
                md={4}
                sm={12}
                className='d-flex gap-3 align-items-center'>
                <span className={styles["Data_room_heading"]}>
                  {t("Data-room")}
                </span>
                <Dropdown
                  className={styles["DataRoom_DropDown"]}

                  // onClick={eventClickHandler}
                >
                  <Dropdown.Toggle title={t("New")}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Data_room_btn"]}>
                        <Plus width={20} height={20} fontWeight={800} />
                        <span className={styles["font_size"]}>{t("New")}</span>
                      </Col>
                    </Row>
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={styles["dropdown_menu_dataroom"]}>
                    <Dropdown.Item
                      className={styles["dataroom_dropdown_item"]}
                      onClick={openFolderModal}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=' d-flex gap-2 align-items-center'>
                          <img
                            src={plus}
                            height='10.8'
                            alt=''
                            width='12px'
                            onClick={openFolderModal}
                          />
                          <span className={styles["New_folder"]}>
                            {t("New-folder")}
                          </span>
                        </Col>
                      </Row>
                    </Dropdown.Item>
                    <Dropdown.Item className={styles["dataroom_dropdown_item"]}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=' d-flex gap-2 align-items-center'>
                          <img
                            src={fileupload}
                            alt=''
                            height='10.8'
                            width='12px'
                          />
                          <UploadTextField
                            title={t("File-upload")}
                            multiple={true}
                            handleFileUploadRequest={handleUploadFile}
                            setProgress={setProgress}
                          />
                        </Col>
                      </Row>
                    </Dropdown.Item>
                    <Dropdown.Item className={styles["dataroom_dropdown_item"]}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=' d-flex gap-1 align-items-center'>
                          <img
                            src={plus}
                            height='10.8'
                            alt=''
                            width='12px'
                            draggable='false'
                          />
                          <UploadDataFolder
                            title={t("Folder-upload")}
                            setProgress={setProgress}
                            // customRequestFolderUpload={handleUploadFolder}
                            onChange={handleChangeFolderUpload}
                          />
                        </Col>
                      </Row>
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Col>

              <Col sm={12} md={1} lg={1}></Col>
              <Col
                lg={6}
                md={6}
                sm={12}
                className='d-flex position-relative Inputfield_for_data_room justify-content-end '>
                <SearchBarComponent
                  setSearchDataFields={setSearchDataFields}
                  searchDataFields={searchDataFields}
                  setSearchTabOpen={setSearchTabOpen}
                  searchTabOpen={searchTabOpen}
                  setSearchbarshow={setSearchbarshow}
                  searchbarshow={searchbarshow}
                  setSearchResultFields={setSearchResultFields}
                  searchResultsFields={searchResultsFields}
                />
              </Col>
              <Col
                lg={1}
                md={1}
                sm={12}
                className='d-flex justify-content-center'>
                {currentView !== 5 && (
                  <span className={styles["lsit_grid_buttons"]}>
                    <Button
                      icon={
                        <Tooltip placement='bottomLeft' title={t("Grid-view")}>
                          <img
                            src={
                              gridbtnactive ? Grid_Selected : Grid_Not_Selected
                            }
                            height='25.27px'
                            width='25.27px'
                            alt=''
                            className={styles["grid_view_Icon"]}
                          />
                        </Tooltip>
                      }
                      className={
                        gridbtnactive
                          ? `${styles["grid_view_btn_active"]}`
                          : `${styles["grid_view_btn"]}`
                      }
                      onClick={handleGridView}
                    />
                    <Button
                      icon={
                        <Tooltip placement='bottomLeft' title={t("List-view")}>
                          <img
                            src={
                              listviewactive ? List_Selected : List_Not_selected
                            }
                            height='25.27px'
                            width='25.27px'
                            alt=''
                            className={styles["list_view_Icon"]}
                          />
                        </Tooltip>
                      }
                      className={
                        listviewactive
                          ? `${styles["List_view_btn_active"]}`
                          : `${styles["List_view_btn"]}`
                      }
                      onClick={handlelistview}
                    />
                  </span>
                )}
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col
                lg={detailView ? 8 : 12}
                md={detailView ? 8 : 12}
                sm={detailView ? 8 : 12}>
                <Paper className={styles["Data_room_paper"]}>
                  {searchTabOpen ? (
                    <SearchComponent
                      setSearchDataFields={setSearchDataFields}
                      searchDataFields={searchDataFields}
                      getFolderDocuments={getFolderDocuments}
                      gridbtnactive={gridbtnactive}
                      listviewactive={listviewactive}
                      setSearchResultFields={setSearchResultFields}
                      searchResultsFields={searchResultsFields}
                      setSearchTabOpen={setSearchTabOpen}
                    />
                  ) : (
                    <>
                      <Row>
                        <Col lg={12} md={12} sm={12} className='d-flex gap-3'>
                          <Button
                            text={t("All")}
                            className={
                              currentView === 3
                                ? `${styles["allDocuments_btn_active"]}`
                                : `${styles["allDocuments_btn"]}`
                            }
                            onClick={AllDocuments}
                          />
                          <Button
                            text={t("My-document")}
                            className={
                              currentView === 1
                                ? `${styles["myDocument_btn_active"]}`
                                : `${styles["myDocument_btn"]}`
                            }
                            onClick={MydocumentButtonShow}
                          />
                          <Button
                            text={t("Shared-with-me")}
                            className={
                              currentView === 2
                                ? `${styles["Shared_with_me_btn_active"]}`
                                : `${styles["Shared_with_me_btn"]}`
                            }
                            // onClick={showCancellUploadModal}
                            onClick={SharewithmeButonShow}
                          />
                          {checkFeatureIDAvailability(19) ||
                          checkFeatureIDAvailability(21) ? (
                            <Button
                              text={t("Send-for-approval")}
                              className={
                                currentView === 5
                                  ? `${styles["Send_for_approval_btn_active"]}`
                                  : `${styles["Send_for_approval_btn"]}`
                              }
                              // onClick={showCancellUploadModal}
                              onClick={SendForApprovalButton}
                            />
                          ) : null}

                          {/* ApprovalSend */}
                          <Button
                            text={t("Recently-added")}
                            className={
                              currentView === 4
                                ? `${styles["allDocuments_btn_active"]}`
                                : `${styles["allDocuments_btn"]}`
                            }
                            onClick={RecentTab}
                          />
                        </Col>
                      </Row>
                      {currentView === 2 ? (
                        <>
                          <Row className='mt-3'>
                            <Col lg={12} sm={12} md={12}>
                              {getAllData.length > 0 &&
                              getAllData !== undefined &&
                              getAllData !== null &&
                              gridbtnactive ? (
                                <>
                                  <InfiniteScroll
                                    dataLength={getAllData.length}
                                    next={handleScroll}
                                    style={{
                                      overflowX: "hidden",
                                    }}
                                    hasMore={
                                      getAllData.length === totalRecords
                                        ? false
                                        : true
                                    }
                                    height={"58vh"}
                                    endMessage=''
                                    loader={
                                      getAllData.length <= totalRecords && (
                                        <Row>
                                          <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className='d-flex justify-content-center my-3'>
                                            <Spin indicator={antIcon} />
                                          </Col>
                                        </Row>
                                      )
                                    }>
                                    <GridViewDataRoom
                                      data={getAllData}
                                      sRowsData={sRowsData}
                                      totalRecords={totalRecords}
                                      filter_Value={filterValue}
                                      setSearchTabOpen={setSearchTabOpen}
                                      setDetailView={setDetailView}
                                      setFileDataforAnalyticsCount={
                                        setFileDataforAnalyticsCount
                                      }
                                    />
                                  </InfiniteScroll>
                                </>
                              ) : getAllData.length > 0 &&
                                getAllData !== undefined &&
                                getAllData !== null &&
                                listviewactive === true ? (
                                <>
                                  <InfiniteScroll
                                    dataLength={getAllData.length}
                                    next={handleScroll}
                                    style={{
                                      overflowX: "hidden",
                                    }}
                                    hasMore={
                                      getAllData.length === totalRecords
                                        ? false
                                        : true
                                    }
                                    height={"58vh"}
                                    endMessage=''
                                    loader={
                                      getAllData.length <= totalRecords && (
                                        <Row>
                                          <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className='d-flex justify-content-center my-3'>
                                            <Spin indicator={antIcon} />
                                          </Col>
                                        </Row>
                                      )
                                    }>
                                    <TableToDo
                                      sortDirections={["descend", "ascend"]}
                                      column={shareWithmeColoumns}
                                      className={"DataRoom_Table"}
                                      size={"middle"}
                                      onChange={handleSortChange}
                                      rows={getAllData}
                                      pagination={false}
                                    />
                                  </InfiniteScroll>
                                </>
                              ) : (
                                <>
                                  <Row className='mt-4'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <img
                                        src={EmptyStateSharewithme}
                                        alt=''
                                        draggable='false'
                                      />
                                    </Col>
                                  </Row>
                                  <Row className='mt-4'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <span
                                        className={
                                          styles["Messege_nofiles_shared"]
                                        }>
                                        {t("There-are-no-files-shared")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className='mt-0'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <span
                                        className={
                                          styles["Messege_nofiles_shared"]
                                        }>
                                        {t("With-you")}
                                      </span>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      ) : currentView === 4 ? (
                        <>
                          <Row className='mt-3'>
                            <Col lg={12} sm={12} md={12}>
                              {getAllData.length > 0 ? (
                                <>
                                  {gridbtnactive ? (
                                    <>
                                      <GridViewDataRoom
                                        data={getAllData}
                                        optionsforFolder={optionsforFolder(t)}
                                        optionsforFile={optionsforFile(t)}
                                        sRowsData={sRowsData}
                                        totalRecords={totalRecords}
                                        filter_Value={filterValue}
                                        setSearchTabOpen={setSearchTabOpen}
                                        setDetailView={setDetailView}
                                        setFileDataforAnalyticsCount={
                                          setFileDataforAnalyticsCount
                                        }
                                      />
                                    </>
                                  ) : listviewactive === true ? (
                                    <TableToDo
                                      sortDirections={["descend", "ascend"]}
                                      column={MyRecentTab}
                                      className={"DataRoom_Table"}
                                      rows={getAllData}
                                      pagination={false}
                                      locale={{
                                        emptyText: (
                                          <span className='vh-100 text-center'>
                                            <p>No Recent Data Found</p>
                                          </span>
                                        ),
                                      }}
                                      onChange={handleSortMyRecentTab}
                                      // rowSelection={rowSelection}
                                      size={"middle"}
                                    />
                                  ) : (
                                    <>
                                      <Row className='mt-2'>
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className='d-flex justify-content-center h-100 align-items-center'>
                                          <span
                                            className={
                                              styles["Messege_nofiles"]
                                            }>
                                            {t("There-are-no-items-here")}
                                          </span>
                                        </Col>
                                      </Row>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Row className='text-center mt-4'>
                                    <Col lg={12} sm={12} md={12}>
                                      <img src={Recentadded_emptyIcon} />
                                    </Col>
                                    <Col lg={12} sm={12} md={12}>
                                      <p className={styles["Recently_Added"]}>
                                        {t("Recently-Added")}
                                      </p>
                                      <span
                                        className={
                                          styles["Recently_Added_tagLine"]
                                        }>
                                        {t(
                                          "This-space-is-ready-to-showcase-your-latest-additions-what-will-you-add-next"
                                        )}
                                      </span>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      ) : currentView === 5 ? (
                        <ApprovalSend />
                      ) : (
                        <>
                          <Row className='mt-3'>
                            <Col lg={12} sm={12} md={12}>
                              {getAllData.length > 0 &&
                              getAllData !== undefined &&
                              getAllData !== null &&
                              gridbtnactive ? (
                                <>
                                  <InfiniteScroll
                                    dataLength={getAllData.length}
                                    next={handleScroll}
                                    style={{
                                      overflowX: "hidden",
                                    }}
                                    hasMore={
                                      getAllData.length === totalRecords
                                        ? false
                                        : true
                                    }
                                    height={"55vh"}
                                    endMessage=''
                                    loader={
                                      getAllData.length <= totalRecords && (
                                        <Row>
                                          <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className='d-flex justify-content-center mt-2'>
                                            <Spin indicator={antIcon} />
                                          </Col>
                                        </Row>
                                      )
                                    }>
                                    <GridViewDataRoom
                                      data={getAllData}
                                      sRowsData={sRowsData}
                                      totalRecords={totalRecords}
                                      filter_Value={filterValue}
                                      setSearchTabOpen={setSearchTabOpen}
                                      setDetailView={setDetailView}
                                      setFileDataforAnalyticsCount={
                                        setFileDataforAnalyticsCount
                                      }
                                    />
                                  </InfiniteScroll>
                                </>
                              ) : getAllData.length > 0 &&
                                getAllData !== undefined &&
                                getAllData !== null &&
                                listviewactive === true ? (
                                <InfiniteScroll
                                  dataLength={getAllData.length}
                                  next={handleScroll}
                                  style={{
                                    overflowX: "hidden",
                                  }}
                                  hasMore={
                                    getAllData.length === totalRecords
                                      ? false
                                      : true
                                  }
                                  height={"57vh"}
                                  endMessage=''
                                  loader={
                                    getAllData.length <= totalRecords && (
                                      <>
                                        <Row>
                                          <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className='d-flex justify-content-center mt-2'>
                                            <Spin indicator={antIcon} />
                                          </Col>
                                        </Row>
                                      </>
                                    )
                                  }
                                  scrollableTarget='scrollableDiv'>
                                  <TableToDo
                                    column={MyDocumentsColumns}
                                    sortDirections={["descend", "ascend"]}
                                    className={"DataRoom_Table"}
                                    rows={getAllData}
                                    pagination={false}
                                    // scroll={{x: "max-content"}}
                                    onChange={handleSortMyDocuments}
                                    // rowSelection={rowSelection}
                                    size={"middle"}
                                  />
                                </InfiniteScroll>
                              ) : (
                                <>
                                  <Row className='mt-2'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <span
                                        className={styles["Messege_nofiles"]}>
                                        {t("There-are-no-items-here")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className='mt-3'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <span
                                        className={styles["Tag_line_nofiles"]}>
                                        {t("Start-adding-your-documents")}
                                      </span>
                                    </Col>
                                  </Row>
                                  {/* Dragger Uploader */}
                                  <Row className='mt-4'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                      <Dragger
                                        setProgress={setProgress}
                                        className={
                                          styles["DragDropIconDataRoom"]
                                        }
                                        handleFileDraggerUploadRequest={
                                          handleUploadFile
                                        }
                                        Icon={
                                          <img
                                            src={DrapDropIcon}
                                            heigh='356.89'
                                            width='356.89'
                                            alt=''
                                          />
                                        }
                                      />
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
                </Paper>
              </Col>
              {detailView && (
                <Col lg={4} md={4} sm={4}>
                  <ViewDetailsModal
                    setDetailView={setDetailView}
                    setFolderId={setFolderId}
                    setFolderName={setFolderName}
                    setFileName={setFileName}
                    setSharefoldermodal={setSharefoldermodal}
                    setShareFileModal={setShareFileModal}
                  />
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
      {showbarupload ? (
        <UploadindUiComponent
          detaUplodingForFOlder={detaUplodingForFOlder}
          tasksAttachments={tasksAttachments}
          setCollapes={setCollapes}
          remainingTime={remainingTime}
          cancelUpload={cancelUpload}
          collapes={collapes}
          Cancellicon={Cancellicon}
          progress={progress}
          CanceUpload={CanceUpload}
          cancelFileUpload={cancelFileUpload}
        />
      ) : null}
      {foldermodal ? (
        <ModalAddFolder
          addfolder={foldermodal}
          setAddfolder={setFolderModal}
          setIsExistFolder={setIsExistFolder}
        />
      ) : null}
      {uploadOptionsmodal ? (
        <ModalOptions
          setTasksAttachments={setTasksAttachments}
          tasksAttachments={tasksAttachments}
          setTasksAttachmentsID={setTasksAttachmentsID}
          tasksAttachmentsID={tasksAttachmentsID}
          uploadOptionsmodal={uploadOptionsmodal}
          setUploadOptions={setUploadOptionsmodal}
          setShowbarupload={setShowbarupload}
          showbarupload={showbarupload}
        />
      ) : null}
      {canselingDetaUplodingForFOlder ? (
        <ModalCancelUpload
          canselingDetaUplodingForFOlder={canselingDetaUplodingForFOlder}
          setCanselingDetaUplodingForFOlder={setCanselingDetaUplodingForFOlder}
          CanceUploadinFromModalTrue={CanceUploadinFromModalTrue}
        />
      ) : null}
      {sharefoldermodal ? (
        <ModalShareFolder
          sharefolder={sharefoldermodal}
          setSharefolder={setSharefoldermodal}
          folderId={folderId}
          folderName={folderName}
        />
      ) : null}
      {requestingAccess ? (
        <ModalrequestingAccess
          requestingAccess={requestingAccess}
          setRequestingAccess={setRequestingAccess}
        />
      ) : null}
      {/* {canselingDetaUplodingForFOlder ? (
        <ModalCancelDownload
          cancelDownload={canselingDetaUplodingForFOlder}
          setCancelDownload={canselingDetaUplodingForFOlder}
        />
      ) : null} */}
      {showrenamemodal ? (
        <>
          <ModalRenameFolder
            renamefolder={showrenamemodal}
            setRenamefolder={setShowreanmemodal}
            setnotification={setShowrenamenotification}
            isRenameFolderData={isRenameFolderData}
          />
        </>
      ) : null}
      {shareFileModal ? (
        <ModalShareFile
          folderId={folderId}
          fileName={fileName}
          setShareFile={setShareFileModal}
          shareFile={shareFileModal}
        />
      ) : null}
      {inviteModal && (
        <ModalShareDocument
          inviteModal={inviteModal}
          setInviteModal={setInviteModal}
        />
      )}
      {isExistFolder && (
        <ModalOptionsFolder
          setAddfolder={setFolderModal}
          isExistFolder={isExistFolder}
          setIsExistFolder={setIsExistFolder}
        />
      )}
      {isFolderExist ? (
        <ModalOptionsisExistFolder
          setFolderUploadOptions={setFolderUploadOptions}
          folderUploadOptions={folderUploadOptions}
          directoryNames={directoryNames}
          setIsFolderExist={setIsFolderExist}
          isFolderExist={isFolderExist}
          detaUplodingForFOlder={detaUplodingForFOlder}
          setDetaUplodingForFOlder={setDetaUplodingForFOlder}
        />
      ) : null}
      {showrenameFile && (
        <ModalRenameFile
          isRenameFileData={isRenameFileData}
          showrenameFile={showrenameFile}
          setShowRenameFile={setShowRenameFile}
        />
      )}
      {RequestFile && (
        <ModalFileRequest
          RequestFile={RequestFile}
          setRequestFile={setRequestFile}
        />
      )}
      {DataRoomReducer.fileDetials && (
        <FileDetailsModal
          fileDataforAnalyticsCount={fileDataforAnalyticsCount}
        />
      )}
      {isFileDelete && (
        <ModalDeleteFile
          fileDelete={isFileDelete}
          setFileDeleted={setIsFileDelete}
          handleClickDeleteFileFunc={handleClickDeleteFile}
          handleCancelFileDelete={handleCancelDeleteFile}
        />
      )}
      {isFolderDelete && (
        <ModalDeleteFolder
          isDeleteFolder={isFolderDelete}
          setIsDeleteFolder={setIsFolderDelete}
          handleClickDeleteFolderFunc={handleClickDeleteFolder}
          handleCancelFoldereDelete={handleCancelDeleteFolder}
        />
      )}
      <Notification open={open.open} message={open.message} setOpen={setOpen} />
    </>
  );
};
export default DataRoom;
