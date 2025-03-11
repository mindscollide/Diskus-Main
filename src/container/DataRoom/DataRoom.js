import React, { useEffect, useRef } from "react";
import "react-dropzone-uploader/dist/styles.css";
import "./Dataroom.css";
import { Spin, Tooltip, Dropdown, Menu, Breadcrumb, Popover } from "antd";
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
import { ChevronDown, Dash, Plus } from "react-bootstrap-icons";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
import Recentadded_emptyIcon from "../../assets/images/Recentadded_emptyIcon.png";
import plus from "../../assets/images/Icon feather-folder.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import styles from "./DataRoom.module.css";
import {
  Button,
  TableToDo,
  Notification,
  UploadTextField,
} from "../../components/elements";
import { Row, Col } from "react-bootstrap";
import BootstrapDropdown from "react-bootstrap/Dropdown";
import { useState } from "react";
import ModalAddFolder from "./ModalAddFolder/ModalAddFolder";
import ModalOptions from "./ModalUploadOptions/ModalOptions";
import ModalCancelUpload from "./ModalCancelUpload/ModalCancelUpload";
import ModalShareFolder from "./ModalShareFolder/ModalShareFolder";
import ModalrequestingAccess from "./ModalrequestingAccess/ModalrequestingAccess";
import ModalShareFile from "./ModalShareFile/ModalShareFile";
import Dragger from "../../components/elements/Dragger/Dragger";
import ModalRenameFolder from "./ModalRenameFolder/ModalRenameFolder";
import ModalOptionsFolder from "./ModalUploadOptions_Folder/ModalOptions_Folder";
import ThreeDotsBreadCrumbs from "../../assets/images/sortingIcons/ThreeDots_Breadcrums.png";
import RightArrowBreadCrumbs from "../../assets/images/sortingIcons/Right_Arrow.png";

import {
  BreadCrumbsList,
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
  validateUserAvailibilityEncryptedStringDataRoomApi,
} from "../../store/actions/DataRoom_actions";
import sharedIcon from "../../assets/images/shared_icon.svg";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import { _justShowDateformat } from "../../commen/functions/date_formater";
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import { useLocation, useNavigate } from "react-router-dom";
import DeleteNotificationBox from "./DeleteNotification/deleteNotification";
import FileRemoveBox from "./FileRemoved/FileRemoveBox";
import ShowRenameNotification from "./ShowRenameNotification/ShowRenameNotification";
import ActionUndoNotification from "./ActionUndoNotification/ActionUndoNotification";
import ModalShareDocument from "./ModalSharedocument/ModalShareDocument";
import {
  CheckFolderisExist,
  CreateFolderEmpty,
  createFolder,
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
} from "./SearchFunctionality/option";
import axios from "axios";
import ModalFileRequest from "./ModalFileRequesting/ModalFileRequesting";
import ViewDetailsModal from "./ViewDetailsModal/ViewDetailsModal";
import {
  clearDataResponseMessageDataRoom2,
  getDataAnalyticsCountApi,
  getFilesandFolderDetailsApi,
  validateEncryptedStringViewFileLinkApi,
  validateEncryptedStringViewFolderLinkApi,
} from "../../store/actions/DataRoom2_actions";
import FileDetailsModal from "./FileDetailsModal/FileDetailsModal";
import copyToClipboard from "../../hooks/useClipBoard";
import {
  clearWorkFlowResponseMessage,
  createWorkflowApi,
  getAllPendingApprovalStatusApi,
} from "../../store/actions/workflow_actions";
import ApprovalSend from "./SignatureApproval/ApprovalSend/ApprovalSend";
import {
  checkFeatureIDAvailability,
  fileFormatforSignatureFlow,
  openDocumentViewer,
} from "../../commen/functions/utils";
import ModalDeleteFile from "./ModalDeleteFile/ModalDeleteFile";
import ModalDeleteFolder from "./ModalDeleteFolder/ModalDeleteFolder";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { convertToArabicNumerals } from "../../commen/functions/regex";

import DescendIcon from "../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../assets/images/sortingIcons/Arrow-up.png";
import Tick from "../../assets/images/Tick-Icon.png";
import MenuPopover from "../../components/elements/popover";
import SpinComponent from "../../components/elements/mainLoader/loader";

const DataRoom = () => {
  let DataRoomString = localStorage.getItem("DataRoomEmail");
  let CurrentLanguage = localStorage.getItem("i18nextLng");
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

  const { DataRoomReducer, webViewer } = useSelector((state) => state);
  const SignatureResponseMessage = useSelector(
    (state) => state.SignatureWorkFlowReducer.ResponseMessage
  );
  const BreadCrumbsListArr = useSelector(
    (state) => state.DataRoomReducer.BreadCrumbsList
  );
  const searchBarRef = useRef();
  const threedotFile = useRef();
  const threedotFolder = useRef();
  const [shareFileModal, setShareFileModal] = useState(false);
  const [foldermodal, setFolderModal] = useState(false);
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
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
  const [totalRecords, setTotalRecords] = useState(0); // Initial filter value
  let viewFolderID = localStorage.getItem("folderID");
  const docSignedCrAction = localStorage.getItem("docSignedCrAction");
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
  const [allDocumentsTitleSorter, setAllDocumentsTitleSorter] = useState(null);
  const [allOwnerSorter, setAllOwnerSorter] = useState(null);
  const [allLastModifiedSorter, setAllLastModifiedSorter] = useState(null);
  const [shareDateSorter, setShareDateSorter] = useState(null);

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
  console.log(DataRoomFileAndFoldersDetailsResponseMessage, "Message");
  const [fileDataforAnalyticsCount, setFileDataforAnalyticsCount] =
    useState(null);
  // this is for notification
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
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
  const [visible, setVisible] = useState(false);

  const filters = [
    {
      text: "Last-modified",
      value: "2",
    },
    {
      text:"Last-modified-by-me",
      value: "3",
    },
    {
      text: "Last-open-by-me",
      value: "4",
    },
  ];
  const [searchResultsFields, setSearchResultFields] = useState({
    Date: null,
    Type: null,
    Location: null,
    People: null,
  });
  //State For the Detail View Of File And Folder
  const [detailView, setDetailView] = useState(false);

  const [selectedValue, setSelectValue] = useState({
    label: "Last-modified",
    value: 2,
  });


  // State to manage popover visibility
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  // Toggle the popover visibility
  const togglePopover = () => setIsPopoverVisible(!isPopoverVisible);

  useEffect(() => {
    try {
      if (DataRoomString !== undefined && DataRoomString !== null) {
        console.log("Test Dataroom");
        const remainingString = DataRoomString;
        console.log(remainingString, "remainingStringremainingString");
        setDataRoomString(remainingString);
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
        navigate("/Diskus/dataroom");
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
      // let newData = { IsCreator: true };
      // await dispatch(getAllPendingApprovalStatusApi(navigate, t, newData, 1));

      setGetAllData([]);
      setSharedwithmebtn(true);
      localStorage.removeItem("folderID");
      if (searchoptions) {
        setSearchoptions(false);
      }
    } else {
      let getData = await dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 1)
      );
      console.log(getData, "getDatagetDatagetData");
      localStorage.removeItem("folderID");
    }
    dispatch(BreadCrumbsList([]));
  };

  useEffect(() => {
    if (docSignedCrAction !== null) {
      localStorage.setItem("setTableView", 5);
    }
  }, [docSignedCrAction]);

  useEffect(() => {
    try {
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
    let viewFol_action = localStorage.getItem("viewFolderLink");
    let documentViewer = localStorage.getItem("documentViewer");
    if (docSignedCrAction === null) {
      if (currentView !== null) {
        if (localStorage.getItem("BoardDeckFolderID") === null) {
          apiCalling();
        }
      } else {
        localStorage.setItem("setTableView", 3);
        dispatch(getDocumentsAndFolderApi(navigate, 3, t, 1));
        localStorage.removeItem("folderID");
        localStorage.removeItem("BoardDeckFolderID");
      }
    }

    if (viewFol_action !== null) {
      const callApi = async () => {
        // Validate the encrypted committee view ID
        const getResponse = await dispatch(
          validateEncryptedStringViewFolderLinkApi(viewFol_action, navigate, t)
        );
        console.log(getResponse, "viewFol_action");
        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          // Set necessary states and flags for viewing committee details
          localStorage.setItem(
            "folderID",
            getResponse.response.response.folderID
          );
          await dispatch(
            getFolderDocumentsApi(
              navigate,
              getResponse?.response?.response?.folderID,
              t,
              2,
              null,
              BreadCrumbsListArr
            )
          );
        }
        localStorage.removeItem("viewFolderLink"); // Cleanup the localStorage key
      };
      callApi();
      // let ext = documentViewer?.split(".").pop();
      // openDocumentViewer(ext, documentViewer, dispatch, navigate, t, null);
    }
    if (documentViewer !== null) {
      const callApi = async () => {
        // Validate the encrypted committee view ID
        const getResponse = await dispatch(
          validateEncryptedStringViewFileLinkApi(documentViewer, navigate, t)
        );
        console.log(getResponse, "viewFol_action");

        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          let ext = getResponse.response.fileName?.split(".").pop();
          let record = { id: getResponse.response.response.fileID };
          console.log(
            record,
            "validateEncryptedStringViewFileLinkApivalidateEncryptedStringViewFileLinkApi"
          );
          const pdfData = {
            taskId: getResponse.response.response.fileID,
            commingFrom: 4,
            fileName: getResponse.response.fileName,
            attachmentID: getResponse.response.response.fileID,
            isPermission: getResponse.response.response.permissionID,
          };
          console.log(
            pdfData,
            "validateEncryptedStringViewFileLinkApivalidateEncryptedStringViewFileLinkApi"
          );

          const pdfDataJson = JSON.stringify(pdfData);
          openDocumentViewer(ext, pdfDataJson, dispatch, navigate, t, record);
          localStorage.removeItem("documentViewer"); // Cleanup the localStorage key
        }
      };
      callApi();
    }
    return () => {
      localStorage.removeItem("folderID");
      localStorage.removeItem("setTableView");
      localStorage.removeItem("BoardDeckFolderID");
    };
  }, [docSignedCrAction]);

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
  };

  const showShareFileModal = (id, name) => {
    // getSharedFileUsersApi
    let Data = { FileID: id };

    dispatch(getSharedFileUsersApi(navigate, Data, t, setShareFileModal));
    setFolderId(id);
    setFileName(name);
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
    dispatch(BreadCrumbsList([]));

    localStorage.setItem("setTableView", 5);

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
    dispatch(BreadCrumbsList([]));

    setGetAllData([]);
    localStorage.setItem("setTableView", 2);
    await dispatch(getDocumentsAndFolderApi(navigate, 2, t, 1));
    setSharedwithmebtn(true);
    localStorage.removeItem("folderID");
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const MydocumentButtonShow = async () => {
    setSRowsData(0);
    dispatch(BreadCrumbsList([]));
    setGetAllData([]);

    localStorage.setItem("setTableView", 1);
    await dispatch(getDocumentsAndFolderApi(navigate, 1, t, 1));
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const AllDocuments = async () => {
    setSRowsData(0);
    dispatch(BreadCrumbsList([]));
    localStorage.setItem("setTableView", 3);
    localStorage.removeItem("folderID");
    setGetAllData([]);

    await dispatch(getDocumentsAndFolderApi(navigate, 3, t, 1));
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const RecentTab = async () => {
    setSRowsData(0);
    dispatch(BreadCrumbsList([]));

    localStorage.setItem("setTableView", 4);
    localStorage.removeItem("folderID");
    setGetAllData([]);

    let Data = {
      UserID: Number(userID),
      OrganizationID: Number(organizationID),
    };
    await dispatch(getRecentDocumentsApi(navigate, t, Data));
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  const openFolderModal = () => {
    setFolderModal(true);
  };

  const getFolderDocuments = async (folderid, record) => {
    localStorage.setItem("folderID", folderid);
    await dispatch(
      getFolderDocumentsApi(
        navigate,
        folderid,
        t,
        2,
        record,
        BreadCrumbsListArr
      )
    );
    setSearchTabOpen(false);
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
      } else {
        setIsFileDeleteId(record.id);
        setIsFileDelete(true);
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

  // Menu click handler for selecting filters
  const handleMenuClick = (filterValue) => {
    setSelectValue({
      label: filterValue.text,
      value: filterValue.value,
    });
  };

  const handleApplyFilter = () => {
    handeClickSortingFunc(1, selectedValue.value);

    setVisible(false);
  };

  const resetFilter = () => {
    setSelectValue({
      label: "Last-modified",
      value: 2,
    });

    setVisible(false);
  };

  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => {
            console.log(filter, "filterfilterfilter");
            handleMenuClick(filter);
          }}>
          <div className='d-flex justify-content-start gap-2'>
            <span>{t(filter.text)}</span>
            {selectedValue.value !== 0 &&
              Number(selectedValue.value) === Number(filter.value) && (
                <span className='checkmark'>
                  <img src={Tick} alt='' />
                </span>
              )}
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className='d-flex align-items-center justify-content-between mx-2'>
        <Button
          text={t("Reset")}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={t('Ok')}
          disableBtn={selectedValue === null ? true : false}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );
  //

  const handeClickSortingFunc = (viewValue, statusID) => {
    if (Number(viewValue) === 1 || Number(viewValue) === 3) {
      // this is for All Tab and My Document tab
      if (Number(statusID) === 1) {
        // Document Name Sorter
        setAllDocumentsTitleSorter((order) => {
          if (order === "descend") {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  1,
                  false
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false
                )
              );
            }

            return "ascend";
          } else {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  1,
                  true
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true
                )
              );
            }
            return "descend";
          }
        });
      } else if (Number(statusID) === 5) {
        //  Owner name sorting
        setAllOwnerSorter((order) => {
          if (order === "descend") {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  5,
                  false
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false
                )
              );
            }

            return "ascend";
          } else {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  5,
                  true
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true
                )
              );
            }
            return "descend";
          }
        });
      } else if (
        Number(statusID) === 2 ||
        Number(statusID) === 3 ||
        Number(statusID) === 4
      ) {
        // Last Modified Date Sorter
        setAllLastModifiedSorter((order) => {
          if (order === "descend") {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  Number(statusID),
                  false
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false
                )
              );
            }

            return "ascend";
          } else {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  Number(statusID),
                  true
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true
                )
              );
            }

            return "descend";
          }
        });
      }
    } else {
      if (Number(statusID) === 2) {
        // Share Date
        // setShareDateSorter
        setShareDateSorter((order) => {
          if (order === "descend") {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  Number(statusID),
                  false
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false
                )
              );
            }

            return "ascend";
          } else {
            if (viewFolderID !== null) {
              dispatch(
                getFolderDocumentsApi(
                  navigate,
                  Number(viewFolderID),
                  t,
                  1,
                  null,
                  null,
                  Number(statusID),
                  true
                )
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true
                )
              );
            }

            return "descend";
          }
        });
      }
    }
  };

  const MyDocumentsColumns = [
    {
      title: (
        <>
          <span className='d-flex gap-2'>
            {t("Name")}{" "}
            {allDocumentsTitleSorter === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: "30%",
      align: "start",
      ellipsis: true,
      onHeaderCell: () => ({
        onClick: () => {
          handeClickSortingFunc(1, 1);
        },
      }),
      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div
                className={`${styles["dataFolderRow"]}`}
                onClick={() => getFolderDocuments(data.id, data)}>
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  <img src={folderColor} alt='' draggable='false' />
                  {/* <abbr title={text} className='d-flex gap-1'> */}

                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}>
                    {text}
                  </span>
                  <img src={sharedIcon} alt='' draggable='false' />
                </Tooltip>
                {/* </abbr> */}
              </div>
            );
          } else {
            return (
              <section className={styles["fileRow"]}>
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=''
                    width={"25px"}
                    height={"25px"}
                  />

                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                  </span>
                  <img src={sharedIcon} alt='' draggable='false' />
                </Tooltip>
              </section>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div
                className={`${styles["dataFolderRow"]}`}
                onClick={() => getFolderDocuments(data.id, data)}>
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  <img src={folderColor} alt='' draggable='false' />

                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}>
                    {text}{" "}
                  </span>
                </Tooltip>
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
                />
                <Tooltip title={text} showArrow={false} placement='top'>
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                  </span>
                </Tooltip>
              </section>
            );
          }
        }
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center gap-2'>
            {t("Owner")}{" "}
            {allOwnerSorter === "descend" ? (
              <img src={DescendIcon} alt='' />
            ) : (
              <img src={AscendIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "owner",
      key: "owner",
      align: "center",
      width: "10%",
      onHeaderCell: () => ({
        onClick: () => {
          handeClickSortingFunc(1, 5);
        },
      }),
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: (
        <span className='d-flex justify-content-center align-items-center gap-2'>
          <span className={styles["datemodifiedfilter"]}>
            {t(selectedValue.label)}
          </span>
          {allLastModifiedSorter === "descend" ? (
            <img src={ArrowUpIcon} alt='' />
          ) : (
            <img src={ArrowDownIcon} alt='' />
          )}
        </span>
      ),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "20%",
      align: "center",
      filterIcon: (filtered) => (
        <ChevronDown className='ChevronPolls' onClick={handleClickChevron} />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}>
          <div />
        </Dropdown>
      ),
      onHeaderCell: () => ({
        onClick: () => {
          handeClickSortingFunc(1, selectedValue.value);
        },
      }),
      render: (text, data) => {
        return (
          <span className={styles["dataroom_table_heading"]}>
            {_justShowDateformat(text, CurrentLanguage)}
          </span>
        );
      },
    },
    {
      title: t("File-size"),
      dataIndex: "fileSize",
      key: "fileSize",
      width: "10%",
      align: "center",
      render: (text, record) => {
        console.log(record, "recordrecordrecordrecord");
        if (record.isFolder) {
          return <Dash />;
        } else {
          return (
            <span className={styles["ownerName"]}>{`${convertToArabicNumerals(
              text,
              CurrentLanguage
            )} MB`}</span>
          );
        }
      },
    },
    {
      title: (
        <span className={styles["dataroom_location"]}>{t("Location")}</span>
      ),
      dataIndex: "location",
      key: "location",
      width: "10%",
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return (
          <span className={styles["Dataroom__mydocument_location"]}>
            {t(text)}
          </span>
        );
      },
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "20%",
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

        // Simplify MenuPopover props setup
        const getMenuPopover = (listData) => (
          <MenuPopover
            imageImage={dot}
            listData={listData}
            record={record}
            t={t}
            listOnClickFunction={fileOptionsSelect}
          />
        );

        return (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex justify-content-end gap-2 position-relative otherstuff'>
              {record.isShared ? (
                <>
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
                  </div>
                  <span className={styles["threeDot__Icon"]}>
                    {" "}
                    {record.isFolder
                      ? // Folder Logic
                        record.permissionID === 2
                        ? getMenuPopover(optionsforFolderEditor)
                        : record.permissionID === 1
                        ? getMenuPopover(optionsforFolderViewer)
                        : record.permissionID === 3
                        ? getMenuPopover(optionsforFolderEditableNonShareable)
                        : null
                      : // File Logic
                      record.permissionID === 2
                      ? getMenuPopover(optionsforFileEditor)
                      : record.permissionID === 1
                      ? getMenuPopover(optionsforFileViewer)
                      : record.permissionID === 3
                      ? getMenuPopover(optionsforFileEditableNonShareable)
                      : null}{" "}
                  </span>{" "}
                </>
              ) : (
                <>
                  {/* Non-Shared Items */}
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
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);
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
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);
                            }
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <span className={styles["threeDot__Icon"]}>
                    {record.isFolder
                      ? getMenuPopover(optionsforFolder)
                      : fileFormatforSignatureFlow.includes(fileExtension)
                      ? getMenuPopover(optionsforPDFandSignatureFlow) // Example: Adjust as needed
                      : getMenuPopover(optionsforFile)}
                  </span>
                </>
              )}
            </Col>
          </Row>
        );
      },
    },
  ];

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

  const MyRecentTab = [
    {
      title: (
        <>
          <span>{t("Name")}</span>
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: "100px",
      align: "start",

      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt='' draggable='false' />
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  {" "}
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id, data)}>
                    {text} <img src={sharedIcon} alt='' draggable='false' />
                  </span>
                </Tooltip>
              </div>
            );
          } else {
            <div className={styles["dataFolderRow"]}>
              <Tooltip
                title={text}
                showArrow={false}
                placement='top'
                className='d-flex gap-1'>
                <img
                  src={getIconSource(getFileExtension(data.name))}
                  alt=''
                  width={"25px"}
                  height={"25px"}
                />

                <span
                  onClick={(e) => handleLinkClick(e, data)}
                  className={styles["dataroom_table_heading"]}>
                  {text}
                </span>
              </Tooltip>
            </div>;
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  <img src={folderColor} alt='' draggable='false' />
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id, data)}>
                    {text}{" "}
                  </span>
                </Tooltip>
              </div>
            );
          } else {
            return (
              <section className={styles["fileRow"]}>
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement='top'
                  className='d-flex gap-1'>
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=''
                    width={"25px"}
                    height={"25px"}
                  />
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}>
                    {text}
                  </span>
                </Tooltip>
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
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: t("Last-modified"),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "110px",
      align: "center",

      render: (text, data) => {
        return (
          <span className={styles["dataroom_table_heading"]}>
            {_justShowDateformat(text, CurrentLanguage)}
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
      render: (text, record) => {
        if (record.isFolder) {
          return <Dash />;
        } else {
          {
            console.log("File-size", text);
          }
          return (
            <span className={styles["ownerName"]}>
              {`${convertToArabicNumerals(text, CurrentLanguage)} MB`}
            </span>
          );
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
      render: (text, record) => {
        return (
          <span className={styles["Dataroom__mydocument_location"]}>
            {t(text)}
          </span>
        );
      },
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "20%",
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

        // Simplify MenuPopover props setup
        const getMenuPopover = (listData) => (
          <MenuPopover
            imageImage={dot}
            listData={listData}
            record={record}
            t={t}
            listOnClickFunction={fileOptionsSelect}
          />
        );

        return (
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className='d-flex justify-content-end gap-2 position-relative otherstuff'>
              {record.isShared ? (
                <>
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
                  </div>
                  <span className={styles["threeDot__Icon"]}>
                    {" "}
                    {record.isFolder
                      ? // Folder Logic
                        record.permissionID === 2
                        ? getMenuPopover(optionsforFolderEditor)
                        : record.permissionID === 1
                        ? getMenuPopover(optionsforFolderViewer)
                        : record.permissionID === 3
                        ? getMenuPopover(optionsforFolderEditableNonShareable)
                        : null
                      : // File Logic
                      record.permissionID === 2
                      ? getMenuPopover(optionsforFileEditor)
                      : record.permissionID === 1
                      ? getMenuPopover(optionsforFileViewer)
                      : record.permissionID === 3
                      ? getMenuPopover(optionsforFileEditableNonShareable)
                      : null}{" "}
                  </span>{" "}
                </>
              ) : (
                <>
                  {/* Non-Shared Items */}
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
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);
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
                            } else {
                              setIsFileDeleteId(record.id);
                              setIsFileDelete(true);
                            }
                          }}
                        />
                      </span>
                    </Tooltip>
                  </div>
                  <span className={styles["threeDot__Icon"]}>
                    {record.isFolder
                      ? getMenuPopover(optionsforFolder)
                      : fileFormatforSignatureFlow.includes(fileExtension)
                      ? getMenuPopover(optionsforPDFandSignatureFlow) // Example: Adjust as needed
                      : getMenuPopover(optionsforFile)}
                  </span>
                </>
              )}
            </Col>
          </Row>
        );
      },
    },
  ];

  const handleLinkClick = (e, record) => {
    console.log(record, "preventDefault");
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
      console.log(ext, "preventDefault");
      openDocumentViewer(ext, pdfDataJson, dispatch, navigate, t, record);
    }
  };

  //Notification Redirection for Files and folder Read and Right
  useEffect(() => {
    //For Folder View Rights
    if (
      JSON.parse(
        localStorage.getItem("DataRoomOperationsForFolderViewerRights")
      ) === true
    ) {
      let NotificaitonClickFolderID = localStorage.getItem(
        "NotificationClickFolderID"
      );
      dispatch(
        getFolderDocumentsApi(navigate, Number(NotificaitonClickFolderID), t)
      );
    }
    return () => {
      localStorage.removeItem("DataRoomOperations");
      localStorage.removeItem("NotificationClickFileID");
      localStorage.removeItem("NotificationClickFileName");
      localStorage.removeItem("DataRoomOperationsForFileEditorRights");
      localStorage.removeItem("DataRoomOperationsForFolderViewerRights");
      localStorage.removeItem("NotificationClickFolderID");
    };
  }, []);

  const shareWithmeColoumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      align: "start",
      width: "250px",
      render: (text, record) => {
        let ext = record.name.split(".").pop();

        if (record.isFolder) {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <Tooltip
                className='d-flex gap-1 '
                placement='top'
                title={text}
                showArrow={false}>
                <img src={folderColor} alt='' draggable='false' />
                <span
                  className={styles["dataroom_table_heading"]}
                  onClick={() => getFolderDocuments(record.id, record)}>
                  {text}
                </span>
                <img src={sharedIcon} alt='' draggable='false' />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <Tooltip
                className='d-flex gap-1 '
                placement='top'
                title={text}
                showArrow={false}>
                <img
                  src={getIconSource(getFileExtension(record.name))}
                  alt=''
                  width={"25px"}
                  height={"25px"}
                />
                <span
                  className={styles["dataroom_table_heading"]}
                  onClick={(e) => handleLinkClick(e, record)}>
                  {record.name}
                </span>
                <img src={sharedIcon} alt='' draggable='false' />
              </Tooltip>
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
      align: "center",
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
      },
    },
    {
      title: (
        <>
          <span className='d-flex justify-content-center align-items-center gap-2'>
            {t("Share-date")}
            {shareDateSorter === "descend" ? (
              <img src={ArrowUpIcon} alt='' />
            ) : (
              <img src={ArrowDownIcon} alt='' />
            )}
          </span>
        </>
      ),
      dataIndex: "sharedDate",
      key: "sharedDate",
      width: "90px",
      align: "center",
      onHeaderCell: () => ({
        onClick: () => {
          handeClickSortingFunc(2, 2);
        },
      }),
      render: (text, record) => {
        if (text !== "") {
          return (
            <span className={styles["dataroom_table_heading"]}>
              {_justShowDateformat(text, CurrentLanguage)}
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
        // Simplify MenuPopover props setup
        const getMenuPopover = (listData) => (
          <MenuPopover
            imageImage={dot}
            listData={listData}
            record={record}
            t={t}
            listOnClickFunction={fileOptionsSelect}
          />
        );
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className='d-flex justify-content-end gap-2 position-relative otherstuff'>
                <>
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
                  </div>
                  <span className={styles["threeDot__Icon"]}>
                    {" "}
                    {record.isFolder
                      ? // Folder Logic
                        record.permissionID === 2
                        ? getMenuPopover(optionsforFolderEditor)
                        : record.permissionID === 1
                        ? getMenuPopover(optionsforFolderViewer)
                        : record.permissionID === 3
                        ? getMenuPopover(optionsforFolderEditableNonShareable)
                        : null
                      : // File Logic
                      record.permissionID === 2
                      ? getMenuPopover(optionsforFileEditor)
                      : record.permissionID === 1
                      ? getMenuPopover(optionsforFileViewer)
                      : record.permissionID === 3
                      ? getMenuPopover(optionsforFileEditableNonShareable)
                      : null}{" "}
                  </span>{" "}
                </>
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

    setDetaUplodingForFOlder([]);
    setTasksAttachments([]);
    setShowbarupload(false);
    setCanselingDetaUplodingForFOlder(false);
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
      showMessage(DataRoomReducer.ResponseMessage, "success", setOpen);
      dispatch(clearDataResponseMessage());
    }
    if (
      DataRoomReducer.FolderisExistMessage !== "" &&
      DataRoomReducer.FolderisExistMessage !== t("Folder-already-exist")
    ) {
      showMessage(DataRoomReducer.FolderisExistMessage, "success", setOpen);
      dispatch(clearDataResponseMessage());
    }
    if (
      DataRoomReducer.FileisExistMessage !== "" &&
      DataRoomReducer.FileisExistMessage !== t("File-already-exist")
    ) {
      showMessage(DataRoomReducer.FileisExistMessage, "success", setOpen);
      dispatch(clearDataResponseMessage());
    }
    if (DataRoomFileAndFoldersDetailsResponseMessage !== "") {
      showMessage(
        DataRoomFileAndFoldersDetailsResponseMessage,
        "success",
        setOpen
      );
      dispatch(clearDataResponseMessageDataRoom2());
    }
  }, [
    DataRoomReducer.FileisExistMessage,
    DataRoomReducer.FolderisExistMessage,
    DataRoomReducer.ResponseMessage,
    DataRoomFileAndFoldersDetailsResponseMessage,
  ]);

  useEffect(() => {
    if (
      SignatureResponseMessage !== "" &&
      SignatureResponseMessage !== undefined &&
      SignatureResponseMessage !== null &&
      SignatureResponseMessage !== t("Created-successfully")
    ) {
      showMessage(SignatureResponseMessage, "success", setOpen);
      dispatch(clearWorkFlowResponseMessage());
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

  const handleClickGetFolderData = async (id, record, index) => {
    if (record?.main !== undefined && record?.main !== null && record?.main) {
      let currentView = localStorage.getItem("setTableView");
      if (currentView && Number(currentView) === 4) {
        let Data = {
          UserID: Number(userID),
          OrganizationID: Number(organizationID),
        };
        await dispatch(getRecentDocumentsApi(navigate, t, Data));
      } else {
        await dispatch(getDocumentsAndFolderApi(navigate, record.id, t, 1));
      }
      localStorage.removeItem("folderID");

      dispatch(BreadCrumbsList([]));
    } else {
      console.log(index, "indexindex");
      dispatch(
        getFolderDocumentsApi(
          navigate,
          Number(id),
          t,
          5,
          record,
          BreadCrumbsListArr
        )
      );
    }
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
                <BootstrapDropdown className={styles["DataRoom_DropDown"]}>
                  <BootstrapDropdown.Toggle title={t("New")}>
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
                  </BootstrapDropdown.Toggle>

                  <BootstrapDropdown.Menu
                    className={styles["dropdown_menu_dataroom"]}>
                    <BootstrapDropdown.Item
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
                    </BootstrapDropdown.Item>
                    <BootstrapDropdown.Item
                      className={styles["dataroom_dropdown_item"]}>
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
                    </BootstrapDropdown.Item>
                    <BootstrapDropdown.Item
                      className={styles["dataroom_dropdown_item"]}>
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
                            onChange={handleChangeFolderUpload}
                          />
                        </Col>
                      </Row>
                    </BootstrapDropdown.Item>
                  </BootstrapDropdown.Menu>
                </BootstrapDropdown>
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
                <span className={styles["Data_room_paper"]}>
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
                      showShareFolderModal={showShareFolderModal}
                      showShareFileModal={showShareFileModal}
                      setShowreanmemodal={setShowreanmemodal}
                      setRenameFolderData={setRenameFolderData}
                      setShowRenameFile={setShowRenameFile}
                      setRenameFileData={setRenameFileData}
                      setDetailView={setDetailView}
                      setIsFolderDeleteId={setIsFolderDeleteId}
                      setIsFolderDelete={setIsFolderDelete}
                      setIsFileDeleteId={setIsFileDeleteId}
                      setIsFileDelete={setIsFileDelete}
                      setFileDataforAnalyticsCount={
                        setFileDataforAnalyticsCount
                      }
                      // setFileDataforAnalyticsCount
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
                        {BreadCrumbsListArr.length > 0 && (
                          <>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className='mt-3 d-flex align-items-center gap-2'>
                              <Breadcrumb
                                prefixCls='dataroombreadCrumbs'
                                separator={<img src={RightArrowBreadCrumbs} />}>
                                {/* Show three dots if more than 2 items */}
                                {BreadCrumbsListArr.length > 2 && (
                                  <Breadcrumb.Item>
                                    <Popover
                                      className='breadCrumbsItems'
                                      openClassName='openPopOverClass'
                                      overlayClassName='overClass'
                                      content={
                                        <div>
                                          {BreadCrumbsListArr.slice(0, -2).map(
                                            (item, index) => (
                                              <div
                                                key={item.id}
                                                className={
                                                  styles[
                                                    "breadCrumbsThreeDotsDiv"
                                                  ]
                                                }
                                                onClick={() =>
                                                  handleClickGetFolderData(
                                                    item.id,
                                                    item,
                                                    index
                                                  )
                                                }>
                                                <div
                                                  className={
                                                    styles[
                                                      "breadCrumbsThreeDotsDiv_Row"
                                                    ]
                                                  }>
                                                  <img src={folderColor} />
                                                  <p className='m-0'>
                                                    {item.name}
                                                  </p>
                                                </div>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      }
                                      trigger='click'
                                      visible={isPopoverVisible}
                                      onVisibleChange={setIsPopoverVisible}
                                      placement='bottomLeft'
                                      defaultOpen={false}
                                      showArrow={false}>
                                      <img
                                        src={ThreeDotsBreadCrumbs}
                                        style={{ cursor: "pointer" }}
                                        alt='More Breadcrumbs'
                                        onClick={togglePopover}
                                      />
                                    </Popover>
                                  </Breadcrumb.Item>
                                )}

                                {/* Show only last 2 items if length > 2 */}
                                {BreadCrumbsListArr.slice(
                                  BreadCrumbsListArr.length > 2 ? -2 : 0
                                ).map((item, index) => (
                                  <Breadcrumb.Item
                                    key={item.id}
                                    onClick={() =>
                                      handleClickGetFolderData(
                                        item.id,
                                        item,
                                        index
                                      )
                                    }>
                                    {item.name}
                                  </Breadcrumb.Item>
                                ))}
                              </Breadcrumb>
                            </Col>
                          </>
                        )}
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
                                  <Row className='mt-2'>
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className='d-flex justify-content-center'>
                                        <SpinComponent />
                                      {/* <Spin /> */}
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
                                          <>
                                            <span className='vh-100 text-center'>
                                              <p>No Recent Data Found</p>
                                            </span>
                                          </>
                                        ),
                                      }}
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
                                          <Row className='mt-2'>
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className='d-flex justify-content-center'>
                                                <SpinComponent />
                                              {/* <Spin /> */}
                                            </Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Row className='text-center mt-4'>
                                    <Col lg={12} sm={12} md={12}>
                                      <img src={Recentadded_emptyIcon} alt='' />
                                    </Col>
                                    <Col lg={12} sm={12} md={12}>
                                      <p className={styles["Recently_Added"]}>
                                        {t("Recently-added")}
                                      </p>
                                      <span
                                        className={
                                          styles["Recently_Added_tagLine"]
                                        }>
                                        {t(
                                          "This-space-is-ready-to-showcase-your-latest-additions-what-will-you-add-next"
                                        )}
                                      </span>
                                  <SpinComponent /> 
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
                                    overflowY: "auto",
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
                                    className={"DataRoom_Table"}
                                    rows={getAllData}
                                    pagination={false}
                                    scroll={{ x: "max-content", y: "visible" }}
                                    // onChange={handleSortMyDocuments}
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
                                  <SpinComponent />
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      )}
                    </>
                  )}
                </span>
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
      {showbarupload && (
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
      )}

      {foldermodal && (
        <ModalAddFolder
          addfolder={foldermodal}
          setAddfolder={setFolderModal}
          setIsExistFolder={setIsExistFolder}
        />
      )}

      {uploadOptionsmodal && (
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
      )}

      {canselingDetaUplodingForFOlder && (
        <ModalCancelUpload
          canselingDetaUplodingForFOlder={canselingDetaUplodingForFOlder}
          setCanselingDetaUplodingForFOlder={setCanselingDetaUplodingForFOlder}
          CanceUploadinFromModalTrue={CanceUploadinFromModalTrue}
        />
      )}

      {sharefoldermodal && (
        <ModalShareFolder
          sharefolder={sharefoldermodal}
          setSharefolder={setSharefoldermodal}
          folderId={folderId}
          folderName={folderName}
        />
      )}

      {requestingAccess && (
        <ModalrequestingAccess
          requestingAccess={requestingAccess}
          setRequestingAccess={setRequestingAccess}
        />
      )}

      {showrenamemodal && (
        <>
          <ModalRenameFolder
            renamefolder={showrenamemodal}
            setRenamefolder={setShowreanmemodal}
            setnotification={setShowrenamenotification}
            isRenameFolderData={isRenameFolderData}
          />
        </>
      )}
      {shareFileModal && (
        <ModalShareFile
          folderId={folderId}
          fileName={fileName}
          setShareFile={setShareFileModal}
          shareFile={shareFileModal}
        />
      )}

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

      {isFolderExist && (
        <ModalOptionsisExistFolder
          setFolderUploadOptions={setFolderUploadOptions}
          folderUploadOptions={folderUploadOptions}
          directoryNames={directoryNames}
          setIsFolderExist={setIsFolderExist}
          isFolderExist={isFolderExist}
          detaUplodingForFOlder={detaUplodingForFOlder}
          setDetaUplodingForFOlder={setDetaUplodingForFOlder}
        />
      )}

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
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};
export default DataRoom;
