/**
 * @file DataRoom.js
 * @description Main DataRoom container component.
 *
 * Responsibilities:
 *  - Renders the top-level Data Room UI (tabs, toolbar, table/grid views).
 *  - Manages file & folder listing across five views:
 *      1 = My Documents   2 = Shared With Me   3 = All
 *      4 = Recently Added  5 = Send for Approval
 *  - Handles file/folder upload (single file, multi-file, full folder tree).
 *  - Handles MQTT real-time updates for shared/removed files & folders.
 *  - Handles sorting, infinite-scroll pagination, breadcrumb navigation,
 *    search, rename, delete, download, share, and signature-flow creation.
 *  - Validates encrypted deep-link tokens for shared folder/file URLs.
 */

// ─── React & core ─────────────────────────────────────────────────────────────
import React, { useEffect, useRef } from "react";
import { useState } from "react";

// ─── Styles ───────────────────────────────────────────────────────────────────
import "react-dropzone-uploader/dist/styles.css";
import "./Dataroom.css";
import "react-circular-progressbar/dist/styles.css";
import styles from "./DataRoom.module.css";

// ─── Ant Design ───────────────────────────────────────────────────────────────
import { Spin, Tooltip, Dropdown, Menu, Breadcrumb, Popover } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

// ─── Redux ────────────────────────────────────────────────────────────────────
import { useDispatch, useSelector } from "react-redux";

// ─── Routing ──────────────────────────────────────────────────────────────────
import { useLocation, useNavigate } from "react-router-dom";

// ─── i18n ─────────────────────────────────────────────────────────────────────
import { useTranslation } from "react-i18next";

// ─── Bootstrap ────────────────────────────────────────────────────────────────
import { Row, Col } from "react-bootstrap";
import BootstrapDropdown from "react-bootstrap/Dropdown";

// ─── Bootstrap icons ──────────────────────────────────────────────────────────
import { ChevronDown, Dash, Plus } from "react-bootstrap-icons";

// ─── Infinite scroll ──────────────────────────────────────────────────────────
import InfiniteScroll from "react-infinite-scroll-component";

// ─── HTTP client ──────────────────────────────────────────────────────────────
import axios from "axios";

// ─── Shared UI components ─────────────────────────────────────────────────────
import {
  Button,
  TableToDo,
  Notification,
  UploadTextField,
} from "../../components/elements";
import Dragger from "../../components/elements/Dragger/Dragger";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import MenuPopover from "../../components/elements/popover";
import SpinComponent from "../../components/elements/mainLoader/loader";

// ─── Feature modals ───────────────────────────────────────────────────────────
import ModalAddFolder from "./ModalAddFolder/ModalAddFolder";
import ModalOptions from "./ModalUploadOptions/ModalOptions";
import ModalCancelUpload from "./ModalCancelUpload/ModalCancelUpload";
import ModalShareFolder from "./ModalShareFolder/ModalShareFolder";
import ModalShareFile from "./ModalShareFile/ModalShareFile";
import ModalRenameFolder from "./ModalRenameFolder/ModalRenameFolder";
import ModalOptionsFolder from "./ModalUploadOptions_Folder/ModalOptions_Folder";
import ModalRenameFile from "./ModalRenameFile/ModalRenameFile";
import ModalOptionsisExistFolder from "./ModalUploadFolderisExist/ModalUploadFolderisExist";
import ModalFileRequest from "./ModalFileRequesting/ModalFileRequesting";
import ModalDeleteFile from "./ModalDeleteFile/ModalDeleteFile";
import ModalDeleteFolder from "./ModalDeleteFolder/ModalDeleteFolder";

// ─── Notification / status overlay components ─────────────────────────────────
import DeleteNotificationBox from "./DeleteNotification/deleteNotification";
import FileRemoveBox from "./FileRemoved/FileRemoveBox";
import ShowRenameNotification from "./ShowRenameNotification/ShowRenameNotification";
import ActionUndoNotification from "./ActionUndoNotification/ActionUndoNotification";

// ─── View components ──────────────────────────────────────────────────────────
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import ViewDetailsModal from "./ViewDetailsModal/ViewDetailsModal";
import FileDetailsModal from "./FileDetailsModal/FileDetailsModal";
import ApprovalSend from "./SignatureApproval/ApprovalSend/ApprovalSend";

// ─── Search components ────────────────────────────────────────────────────────
import SearchBarComponent from "./SearchFunctionality/searchBar";
import SearchComponent from "./SearchFunctionality/searchComponent";
import UploadindUiComponent from "./uploadindPopUp/uploadindUiComponent";

// ─── Redux actions — DataRoom ─────────────────────────────────────────────────
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
  getFolderDocumentsApiScrollBehaviour,
} from "../../store/actions/DataRoom_actions";

// ─── Redux actions — DataRoom2 (file/folder details & analytics) ──────────────
import {
  clearDataResponseMessageDataRoom2,
  getDataAnalyticsCountApi,
  getFilesandFolderDetailsApi,
  validateEncryptedStringViewFileLinkApi,
  validateEncryptedStringViewFolderLinkApi,
} from "../../store/actions/DataRoom2_actions";

// ─── Redux actions — Folder upload ───────────────────────────────────────────
import {
  CheckFolderisExist,
  CreateFolderEmpty,
  createFolder,
  uploadFile,
} from "../../store/actions/FolderUploadDataroom";

// ─── Redux actions — Workflow / signature ────────────────────────────────────
import {
  clearWorkFlowResponseMessage,
  createWorkflowApi,
} from "../../store/actions/workflow_actions";

// ─── Utility functions ────────────────────────────────────────────────────────
import { _justShowDateformat } from "../../commen/functions/date_formater";
import copyToClipboard from "../../hooks/useClipBoard";
import {
  checkFeatureIDAvailability,
  fileFormatforSignatureFlow,
  openDocumentViewer,
} from "../../commen/functions/utils";
import { showMessage } from "../../components/elements/snack_bar/utill";
import { convertToArabicNumerals } from "../../commen/functions/regex";
import {
  formatFileSize,
  formatKBtoMB,
  formatMB,
} from "../../commen/functions/convertFileSizeInMB";
import { useTableScrollBottom } from "../../commen/functions/useTableScrollBottom";
import { useScrollerAuditBottom } from "../../commen/functions/useScrollerAuditBottom";

// ─── Context menu option sets (permission-based) ──────────────────────────────
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

// ─── Sorting icons ────────────────────────────────────────────────────────────
import DescendIcon from "../../assets/images/sortingIcons/SorterIconDescend.png";
import AscendIcon from "../../assets/images/sortingIcons/SorterIconAscend.png";
import ArrowDownIcon from "../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../assets/images/sortingIcons/Arrow-up.png";
import Tick from "../../assets/images/Tick-Icon.png";
import ThreeDotsBreadCrumbs from "../../assets/images/sortingIcons/ThreeDots_Breadcrums.png";
import RightArrowBreadCrumbs from "../../assets/images/sortingIcons/Right_Arrow.png";

// ─── Image assets ─────────────────────────────────────────────────────────────
import Cancellicon from "../../assets/images/cross_dataroom.svg";
import hoverdelete from "../../assets/images/hover_delete.svg";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/delete_dataroom.png";
import dot from "../../assets/images/Group 2898.svg";
import DrapDropIcon from "../../assets/images/DrapDropIcon.svg";
import EmptyStateSharewithme from "../../assets/images/SharewithmeEmptyIcon.svg";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
import Recentadded_emptyIcon from "../../assets/images/Recentadded_emptyIcon.png";
import plus from "../../assets/images/Icon feather-folder.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import sharedIcon from "../../assets/images/shared_icon.svg";
import folderColor from "../../assets/images/folder_color.svg";

/**
 * DataRoom — main page component.
 *
 * View IDs stored in localStorage key "setTableView":
 *   1 = My Documents
 *   2 = Shared With Me
 *   3 = All Documents
 *   4 = Recently Added
 *   5 = Send for Approval
 */
const DataRoom = () => {
  // ─── Persistent user/session values read from localStorage ──────────────
  /** Encrypted share-link token set by an external invite URL. */
  let DataRoomString = localStorage.getItem("DataRoomEmail");
  /** Active UI language code (e.g. "en", "ar") — controls date formatting. */
  let CurrentLanguage = localStorage.getItem("i18nextLng");

  // ─── Routing & i18n ─────────────────────────────────────────────────────
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // ─── Redux selectors ─────────────────────────────────────────────────────
  /** Full DataRoom reducer slice + webViewer attachment state. */
  const { DataRoomReducer, webViewer } = useSelector((state) => state);
  /** Toast message from the signature workflow reducer. */
  const SignatureResponseMessage = useSelector(
    (state) => state.SignatureWorkFlowReducer.ResponseMessage,
  );
  /** Breadcrumb path array for folder navigation. */
  const BreadCrumbsListArr = useSelector(
    (state) => state.DataRoomReducer.BreadCrumbsList,
  );
  /** Toast message from the file/folder details reducer. */
  const DataRoomFileAndFoldersDetailsResponseMessage = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer.ResponseMessage,
  );
  /** Severity level ("success" | "error" | "warning") for details reducer messages. */
  const errorSeverityState2 = useSelector(
    (state) => state.DataRoomFileAndFoldersDetailsReducer.errorSeverity,
  );
  /** Severity level for main DataRoom reducer messages. */
  const errorSeverityState = useSelector(
    (state) => state.DataRoomReducer.errorSeverity,
  );

  console.log(errorSeverityState2, errorSeverityState, "errorSeverityState2");

  // ─── localStorage session values ─────────────────────────────────────────
  /** Currently authenticated user's ID. */
  let userID = localStorage.getItem("userID");
  /** Currently authenticated user's organization ID. */
  let organizationID = localStorage.getItem("organizationID");
  /** Active tab/view ID (1–5). Read once per render from localStorage. */
  const currentView = JSON.parse(localStorage.getItem("setTableView"));
  /** ID of the folder currently being browsed; null when at root. */
  let viewFolderID = localStorage.getItem("folderID");
  /** Non-null when the user arrived via a "document signed" notification link. */
  const docSignedCrAction = localStorage.getItem("docSignedCrAction");

  // ─── DOM refs ─────────────────────────────────────────────────────────────
  /** Ref for the search bar container — used for outside-click detection. */
  const searchBarRef = useRef();
  /** Ref for the file three-dot menu — used for outside-click detection. */
  const threedotFile = useRef();
  /** Ref for the folder three-dot menu — used for outside-click detection. */
  const threedotFolder = useRef();

  // ─── Ant Design loading spinner ──────────────────────────────────────────
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  // ─── Table state ─────────────────────────────────────────────────────────
  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});

  // ─── Network status ───────────────────────────────────────────────────────
  /** True when the browser reports an active internet connection. */
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // ─── Upload progress / bar state ─────────────────────────────────────────
  /** Controls visibility of the floating upload-progress bar. */
  const [showbarupload, setShowbarupload] = useState(false);
  /** Overall upload progress percentage (0–100). */
  const [progress, setProgress] = useState(0);
  /** Whether the cancel-all-uploads confirmation modal is showing. */
  const [canselingDetaUplodingForFOlder, setCanselingDetaUplodingForFOlder] =
    useState(false);
  /** Active file-upload tasks keyed by their random TaskId. */
  const [tasksAttachments, setTasksAttachments] = useState([]);
  /** TaskId of the most recently enqueued file upload. */
  const [tasksAttachmentsID, setTasksAttachmentsID] = useState(0);
  /** Current root directory name being uploaded (folder upload flow). */
  const [directoryNames, setDirectoryNames] = useState("");
  /** Array of folder-upload job objects tracking progress per folder. */
  const [detaUplodingForFOlder, setDetaUplodingForFOlder] = useState([]);
  /**
   * Option selected when a duplicate folder is detected during upload:
   *   1 = replace, 2 = keep both (default 1).
   */
  const [folderUploadOptions, setFolderUploadOptions] = useState(1);
  /** Remaining estimated upload time in seconds. */
  const [remainingTime, setRemainingTime] = useState(0);

  // ─── Context-menu visibility ──────────────────────────────────────────────
  const [optionsFileisShown, setOptionsFileisShown] = useState(false);
  const [optionsFolderisShown, setOptionsFolderisShown] = useState(false);

  // ─── Deep-link validation state ───────────────────────────────────────────
  /** Local copy of the encrypted share-link string being validated. */
  const [dataRoomString, setDataRoomString] = useState("");

  // ─── Modal visibility flags ───────────────────────────────────────────────
  /** Share-file modal open/closed. */
  const [shareFileModal, setShareFileModal] = useState(false);
  /** Add-new-folder modal open/closed. */
  const [foldermodal, setFolderModal] = useState(false);
  /** File-already-exists upload-options modal open/closed. */
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  /** Share-folder modal open/closed. */
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  /** Rename-folder modal open/closed. */
  const [showrenamemodal, setShowreanmemodal] = useState(false);
  /** Rename-file modal open/closed. */
  const [showrenameFile, setShowRenameFile] = useState(false);
  /** "Folder already exists" upload-conflict modal open/closed. */
  const [isExistFolder, setIsExistFolder] = useState(false);
  /** Folder-exists check result modal open/closed (folder upload flow). */
  const [isFolderExist, setIsFolderExist] = useState(false);
  /** File-request access modal open/closed. */
  const [RequestFile, setRequestFile] = useState(false);
  /** Delete-file confirmation modal open/closed. */
  const [isFileDelete, setIsFileDelete] = useState(false);
  /** Delete-folder confirmation modal open/closed. */
  const [isFolderDelete, setIsFolderDelete] = useState(false);

  // ─── Pending delete IDs ───────────────────────────────────────────────────
  /** ID of the file pending deletion (used when delete modal confirms). */
  const [isFileDeleteId, setIsFileDeleteId] = useState(0);
  /** ID of the folder pending deletion. */
  const [isFolderDeleteId, setIsFolderDeleteId] = useState(0);

  // ─── Rename data ──────────────────────────────────────────────────────────
  /** Record object of the folder being renamed. */
  const [isRenameFolderData, setRenameFolderData] = useState(null);
  /** Record object of the file being renamed. */
  const [isRenameFileData, setRenameFileData] = useState(null);

  // ─── Sharing context ──────────────────────────────────────────────────────
  /** ID of the folder/file currently being shared. */
  const [folderId, setFolderId] = useState(0);
  /** Display name of the file currently being shared. */
  const [fileName, setFileName] = useState("");
  /** Display name of the folder currently being shared. */
  const [folderName, setFolderName] = useState("");

  // ─── Notification overlays ────────────────────────────────────────────────
  /** Shows the delete-success notification banner. */
  const [deletenotification, setDeletenotification] = useState(false);
  /** Shows the file-removed notification banner. */
  const [fileremoved, setFileremoved] = useState(false);
  /** Shows the rename-success notification banner. */
  const [showrenamenotification, setShowrenamenotification] = useState(false);
  /** Shows the action-undone notification banner. */
  const [actionundonenotification, setActionundonenotification] =
    useState(false);

  // ─── View / layout state ──────────────────────────────────────────────────
  /** True when the grid (card) view button is active. */
  const [gridbtnactive, setGridbtnactive] = useState(false);
  /** True when the list (table) view button is active (default). */
  const [listviewactive, setListviewactive] = useState(true);
  /** Controls whether the upload-progress bar is collapsed. */
  const [collapes, setCollapes] = useState(false);
  /** True when the "Shared with me" tab is the active view. */
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  /** True when the detail side-panel is visible. */
  const [detailView, setDetailView] = useState(false);

  // ─── Search state ─────────────────────────────────────────────────────────
  /** True when the search input dropdown is visible. */
  const [searchbarshow, setSearchbarshow] = useState(false);
  /** True when search filter options are expanded. */
  const [searchoptions, setSearchoptions] = useState(false);
  /** True when the full search-results panel is open (replaces the main table). */
  const [searchTabOpen, setSearchTabOpen] = useState(false);

  // ─── Data listing state ───────────────────────────────────────────────────
  /** Flat array of file/folder records currently displayed in the table. */
  const [getAllData, setGetAllData] = useState([]);
  /** Number of rows already loaded (used as offset for pagination). */
  const [sRowsData, setSRowsData] = useState(0);
  /** Total record count returned by the API (used to determine hasMore). */
  const [totalRecords, setTotalRecords] = useState(0);
  /** Current sort field ID passed to the API. */
  const [sortValue, setSortValue] = useState(1);
  /** True = ascending sort order, false = descending. */
  const [isAscending, setIsAscending] = useState(true);
  /** Currently selected filter for the date column (default: Last-modified). */
  const [filterValue, setFilterValue] = useState(0);

  // ─── Column sort direction indicators ────────────────────────────────────
  /** Sort direction ("ascend" | "descend" | null) for the Name column. */
  const [allDocumentsTitleSorter, setAllDocumentsTitleSorter] = useState(null);
  /** Sort direction for the Owner column. */
  const [allOwnerSorter, setAllOwnerSorter] = useState(null);
  /** Sort direction for the Last Modified / date column. */
  const [allLastModifiedSorter, setAllLastModifiedSorter] = useState(null);
  /** Sort direction for the Share Date column (Shared With Me tab). */
  const [shareDateSorter, setShareDateSorter] = useState(null);

  // ─── Analytics / details state ────────────────────────────────────────────
  /** Analytics data for the file/folder whose "Analytics" option was selected. */
  const [fileDataforAnalyticsCount, setFileDataforAnalyticsCount] =
    useState(null);

  // ─── Snack-bar notification state ────────────────────────────────────────
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  /**
   * Search query payload sent to the search API.
   * Type/date/owner filters are toggled individually as boolean flags.
   */
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

  /** Controls visibility of the date-filter dropdown popover. */
  const [visible, setVisible] = useState(false);

  /**
   * Options shown in the date-column filter dropdown.
   * value maps to the statusID used by the sorting API.
   */
  const filters = [
    {
      text: "Last-modified",
      value: "2",
    },
    {
      text: "Last-modified-by-me",
      value: "3",
    },
    {
      text: "Last-open-by-me",
      value: "4",
    },
  ];

  /** Active filter chips from the search results panel (Date / Type / Location / People). */
  const [searchResultsFields, setSearchResultFields] = useState({
    Date: null,
    Type: null,
    Location: null,
    People: null,
  });

  /** Currently selected date-filter option shown in the column header label. */
  const [selectedValue, setSelectValue] = useState({
    label: "Last-modified",
    value: 2,
  });

  /** Controls visibility of the breadcrumb overflow Popover (shows hidden ancestors). */
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  /** Toggles the breadcrumb overflow popover open/closed. */
  const togglePopover = () => setIsPopoverVisible(!isPopoverVisible);

  // ─── Deep-link share validation ───────────────────────────────────────────
  /**
   * Runs when the component mounts with a DataRoomEmail token in localStorage.
   * Validates the encrypted invite link. On success the API either opens the
   * share-file modal or the file-request modal depending on the link type.
   * Cleans up the localStorage key on unmount to prevent stale re-validation.
   */
  useEffect(() => {
    try {
      if (DataRoomString !== undefined && DataRoomString !== null) {
        console.log("Test Dataroom");
        const remainingString = DataRoomString;
        console.log(remainingString, "remainingStringremainingString");
        setDataRoomString(remainingString);
        let Data = { Link: remainingString };

        dispatch(
          validateUserAvailibilityEncryptedStringDataRoomApi(
            navigate,
            Data,
            t,
            setShareFileModal,
            setRequestFile,
          ),
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

  // ─── Initial data fetch helper ────────────────────────────────────────────
  /**
   * Dispatches the correct data-fetch action for the active view.
   *   - View 4 (Recent): fetches recent documents for the current user.
   *   - View 5 (Approval): clears the list and shows the approval component.
   *   - All other views: fetches documents & folders for the given view ID.
   * Also resets the breadcrumb trail to root.
   */
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
        getDocumentsAndFolderApi(navigate, currentView, t, 1),
      );
      console.log(getData, "getDatagetDatagetData");
      localStorage.removeItem("folderID");
    }
    dispatch(BreadCrumbsList([]));
  };

  // ─── docSignedCrAction redirect ───────────────────────────────────────────
  /**
   * When the user arrives via a "document signed" notification link,
   * force the active view to 5 (Send for Approval) so they land on the
   * correct tab.
   */
  useEffect(() => {
    if (docSignedCrAction !== null) {
      localStorage.setItem("setTableView", 5);
    }
  }, [docSignedCrAction]);

  // ─── Mount: initial load + deep-link handling ─────────────────────────────
  /**
   * Runs once on mount (docSignedCrAction dependency is stable on first render).
   *
   * 1. Attaches a global click listener to auto-close the search bar when the
   *    user clicks outside it (detected via CSS class name heuristic).
   * 2. Loads the initial list based on the persisted currentView, unless a
   *    BoardDeck folder redirect is pending.
   * 3. If a "viewFolderLink" token is in localStorage, validates it and
   *    navigates into that shared folder.
   * 4. If a "documentViewer" token is in localStorage, validates it and
   *    opens the Apryse document viewer for that file.
   * Cleans up folderID, setTableView, and BoardDeckFolderID on unmount.
   */
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
          validateEncryptedStringViewFolderLinkApi(viewFol_action, navigate, t),
        );
        console.log(getResponse, "viewFol_action");
        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          // Set necessary states and flags for viewing committee details
          localStorage.setItem(
            "folderID",
            getResponse.response.response.folderID,
          );
          await dispatch(
            getFolderDocumentsApi(
              navigate,
              getResponse?.response?.response?.folderID,
              t,
              2,
              null,
              BreadCrumbsListArr,
            ),
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
          validateEncryptedStringViewFileLinkApi(documentViewer, navigate, t),
        );
        console.log(getResponse, "viewFol_action");

        if (getResponse.isExecuted === true && getResponse.responseCode === 1) {
          let ext = getResponse.response.fileName?.split(".").pop();
          let record = { id: getResponse.response.response.fileID };
          console.log(
            record,
            "validateEncryptedStringViewFileLinkApivalidateEncryptedStringViewFileLinkApi",
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
            "validateEncryptedStringViewFileLinkApivalidateEncryptedStringViewFileLinkApi",
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

  // ─── Network status listener ──────────────────────────────────────────────
  /**
   * Keeps `isOnline` in sync with the browser's online/offline events.
   * This drives the NetDisconnect flag on in-flight uploads.
   */
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

  // ─── HTML file viewer helpers ─────────────────────────────────────────────

  /**
   * Converts a base64-encoded string to a Blob of the given MIME type.
   * @param {string} base64 - Base64 encoded file content.
   * @param {string} mimeType - Target MIME type (e.g. "text/html").
   * @returns {Blob}
   */
  const base64ToBlob = (base64, mimeType) => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
      byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };

  /**
   * Reads an HTML Blob via FileReader and renders its content in a new browser
   * tab. Used when a file with isHTML=true is opened from the webViewer store.
   * @param {Blob} blob - An HTML Blob to display.
   */
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

  // ─── HTML file viewer trigger ─────────────────────────────────────────────
  /**
   * When the webViewer store receives an HTML attachment (isHTML=true),
   * convert the base64 blob to a Blob object and render it in a new tab.
   */
  useEffect(() => {
    if ((webViewer.attachmentBlob, webViewer.isHTML === true)) {
      try {
        const base64String = base64ToBlob(
          webViewer.attachmentBlob,
          "text/html",
        );
        displayBlobAsHtml(base64String);
      } catch (error) {
        console.error("Error converting blob to base64:", error);
      }
      console.log(
        webViewer.attachmentBlob,
        "webViewer.attachmentBlobwebViewer.attachmentBlobwebViewer.attachmentBlob",
      );
    }
  }, [webViewer.attachmentBlob, webViewer.isHTML]);

  // ─── All-documents / shared-folder response handler ───────────────────────
  /**
   * Syncs `getAllData` whenever the root-level document list API responds.
   * - dataBehaviour=true  → append new page to existing list (infinite scroll).
   * - dataBehaviour=false → replace list with fresh first page.
   * Also keeps `sRowsData` (loaded row count) and `totalRecords` in sync.
   */
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
            },
          );
          setGetAllData(copyData);
          setSRowsData(
            (prev) =>
              prev +
              DataRoomReducer.getAllDocumentandShareFolderResponse.data.length,
          );
          setTotalRecords(
            DataRoomReducer.getAllDocumentandShareFolderResponse.totalCount,
          );
        } else {
          dispatch(dataBehaviour(false));
          setSRowsData(
            DataRoomReducer.getAllDocumentandShareFolderResponse.data.length,
          );
          setTotalRecords(
            DataRoomReducer.getAllDocumentandShareFolderResponse.totalCount,
          );
          setGetAllData(
            DataRoomReducer.getAllDocumentandShareFolderResponse.data,
          );
        }
      } else {
        if (DataRoomReducer.dataBehaviour === false) {
          setGetAllData([]);
        }
      }
      // }
    } catch (error) {}
  }, [DataRoomReducer.getAllDocumentandShareFolderResponse]);

  // ─── Folder-contents response handler ────────────────────────────────────
  /**
   * Syncs `getAllData` when the folder-drill-down API responds.
   * isFolder=1 → load/append folder contents.
   * isFolder=2 → clear the list (navigating up / resetting).
   */
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
                (data, index) => newCopy.push(data),
              );
              setGetAllData(newCopy);
              setTotalRecords(
                DataRoomReducer.getFolderDocumentResponse.totalCount,
              );
              setSRowsData(
                (prev) =>
                  prev + DataRoomReducer.getFolderDocumentResponse.data.length,
              );
            } else {
              setGetAllData(DataRoomReducer.getFolderDocumentResponse.data);
              setTotalRecords(
                DataRoomReducer.getFolderDocumentResponse.totalCount,
              );
              setSRowsData(
                DataRoomReducer.getFolderDocumentResponse.data.length,
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

  // ─── Recent documents response handler ───────────────────────────────────
  /**
   * Populates `getAllData` when the Recent Documents API responds (view 4).
   */
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

  // ─── Copy folder share-link to clipboard ──────────────────────────────────
  /**
   * Auto-copies a newly generated folder share link to the clipboard
   * whenever the API returns one.
   */
  useEffect(() => {
    if (
      DataRoomReducer.getCreateFolderLink !== null &&
      DataRoomReducer.getCreateFolderLink !== ""
    ) {
      copyToClipboard(DataRoomReducer.getCreateFolderLink);
    }
  }, [DataRoomReducer.getCreateFolderLink]);

  // ─── MQTT: file shared ────────────────────────────────────────────────────
  /**
   * Real-time handler for an incoming "file shared" MQTT push.
   * Prepends the new file record to the top of `getAllData` for views 2 & 3.
   * Resets the MQTT store slice to null after processing.
   */
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

  // ─── MQTT: file removed ───────────────────────────────────────────────────
  /**
   * Real-time handler for an incoming "file removed" MQTT push.
   * Removes the matching record from `getAllData` in views 2 & 3.
   */
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

  // ─── MQTT: folder removed ─────────────────────────────────────────────────
  /**
   * Real-time handler for an incoming "folder removed" MQTT push.
   * Removes the matching folder record from `getAllData` in view 3.
   */
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

  // ─── MQTT: folder shared ──────────────────────────────────────────────────
  /**
   * Real-time handler for an incoming "folder shared" MQTT push.
   * Prepends the new folder record to `getAllData` for views 2 & 3.
   * Resets the MQTT store slice to null after processing.
   */
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

  // ─── Notification helpers ─────────────────────────────────────────────────

  /** Dismisses the rename-success notification banner. */
  const ClosingNotificationRenameFolder = () => {
    setShowrenamenotification(false);
  };

  // ─── Download handler ─────────────────────────────────────────────────────
  /**
   * Triggers the download API for the given record.
   * Routes to the folder-download or file-download action based on isFolder.
   * @param {object} record - Row record from the table (must have id, isFolder, name).
   */
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

  // ─── Share modal openers ──────────────────────────────────────────────────

  /**
   * Fetches current folder sharing users then opens the share-folder modal.
   * @param {number} id - Folder ID.
   * @param {string} name - Display name shown in the modal header.
   */
  const showShareFolderModal = (id, name) => {
    // getSharedFolderUsersApi;
    let Data = { FolderID: id };
    dispatch(getSharedFolderUsersApi(navigate, Data, t, setSharefoldermodal));
    setFolderId(id);
    setFolderName(name);
  };

  /**
   * Fetches current file sharing users then opens the share-file modal.
   * @param {number} id - File ID.
   * @param {string} name - Display name shown in the modal header.
   */
  const showShareFileModal = (id, name) => {
    // getSharedFileUsersApi
    let Data = { FileID: id };

    dispatch(getSharedFileUsersApi(navigate, Data, t, setShareFileModal));
    setFolderId(id);
    setFileName(name);
  };

  // ─── View toggle handlers ─────────────────────────────────────────────────

  /** Switches the display to card/grid view. */
  const handleGridView = () => {
    setGridbtnactive(true);
    setListviewactive(false);
  };

  /** Switches the display to list/table view. */
  const handlelistview = () => {
    setListviewactive(true);
    setGridbtnactive(false);
  };

  // ─── Tab navigation handlers ──────────────────────────────────────────────

  /**
   * Activates the "Send for Approval" tab (view 5).
   * Resets data, breadcrumbs, folderID and shows the ApprovalSend component.
   */
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

  /**
   * Activates the "Shared With Me" tab (view 2).
   * Resets data and fetches shared items for the current user.
   */
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

  /**
   * Activates the "My Documents" tab (view 1).
   * Resets data and fetches documents owned by the current user.
   */
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

  /**
   * Activates the "All" tab (view 3).
   * Resets data and fetches all accessible documents & folders.
   */
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

  /** Opens the Add New Folder modal. */
  const openFolderModal = () => {
    setFolderModal(true);
  };

  /**
   * Drills into a folder: persists the folderID, fetches its contents, and
   * closes the search panel if it was open.
   * @param {number} folderid - The folder to navigate into.
   * @param {object} record - Full row record (used for breadcrumb construction).
   */
  const getFolderDocuments = async (folderid, record) => {
    localStorage.setItem("folderID", folderid);
    await dispatch(
      getFolderDocumentsApi(
        navigate,
        folderid,
        t,
        2,
        record,
        BreadCrumbsListArr,
      ),
    );
    setSearchTabOpen(false);
  };

  // ─── Context-menu action dispatcher ──────────────────────────────────────
  /**
   * Handles all three-dot menu item clicks for both files and folders.
   *
   * Option value mapping:
   *   1 = Open in document viewer (feature 20 required)
   *   2 = Share
   *   3 = Rename
   *   4 = View details
   *   5 = Download
   *   6 = Delete
   *   7 = Analytics / file details count
   *   8 = Create signature workflow
   *   9 = Remove shared file/folder from "Shared With Me"
   *
   * @param {object} data   - Selected menu option object with a `value` key.
   * @param {object} record - Row record (id, name, isFolder, permissionID, etc.).
   * @param {string} pdfDataJson - JSON-serialized viewer payload for option 1 & 8.
   */
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
            setFileDataforAnalyticsCount,
          ),
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
            setFileDataforAnalyticsCount,
          ),
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

  // ─── Date-filter dropdown handlers ───────────────────────────────────────

  /**
   * Updates the selected date-filter option in local state (does not yet
   * trigger an API call — that happens in handleApplyFilter).
   * @param {object} filterValue - One entry from the `filters` array.
   */
  const handleMenuClick = (filterValue) => {
    setSelectValue({
      label: filterValue.text,
      value: filterValue.value,
    });
  };

  /**
   * Applies the currently selected date filter by triggering a sort API call,
   * then closes the filter dropdown.
   */
  const handleApplyFilter = () => {
    handeClickSortingFunc(1, selectedValue.value);

    setVisible(false);
  };

  /**
   * Resets the date filter back to the default "Last-modified" option
   * and closes the dropdown.
   */
  const resetFilter = () => {
    setSelectValue({
      label: "Last-modified",
      value: 2,
    });

    setVisible(false);
  };

  /** Toggles the date-filter dropdown open/closed via the chevron icon. */
  const handleClickChevron = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  /**
   * Ant Design Menu rendered inside the date-column filter dropdown.
   * Displays the filter options with a checkmark on the selected one,
   * plus Reset / OK action buttons.
   */
  const menu = (
    <Menu>
      {filters.map((filter) => (
        <Menu.Item
          key={filter.value}
          onClick={() => {
            console.log(filter, "filterfilterfilter");
            handleMenuClick(filter);
          }}
        >
          <div className="d-flex justify-content-start gap-2">
            <span>{t(filter.text)}</span>
            {selectedValue.value !== 0 &&
              Number(selectedValue.value) === Number(filter.value) && (
                <span className="checkmark">
                  <img src={Tick} alt="" />
                </span>
              )}
          </div>
        </Menu.Item>
      ))}
      <Menu.Divider />
      <div className="d-flex align-items-center justify-content-between mx-2">
        <Button
          text={t("Reset")}
          className={styles["FilterResetBtn"]}
          onClick={resetFilter}
        />
        <Button
          text={t("Ok")}
          disableBtn={selectedValue === null ? true : false}
          className={styles["ResetOkBtn"]}
          onClick={handleApplyFilter}
        />
      </div>
    </Menu>
  );
  //

  // ─── Column sort handler ──────────────────────────────────────────────────
  /**
   * Toggles the sort direction for a given column and re-fetches the list.
   *
   * @param {number} viewValue - 1 or 3 = My Documents / All tab;
   *                             other values = Shared With Me tab.
   * @param {number} statusID  - Sort field:
   *                             1 = Name, 2 = Last Modified, 3 = Modified by me,
   *                             4 = Last opened by me, 5 = Owner.
   *
   * For folder-drill-down views (viewFolderID != null) the folder API is used;
   * otherwise the root documents API is called.
   * Each call toggles the corresponding sorter state between "ascend" and "descend".
   */
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
                  false,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false,
                ),
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
                  true,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true,
                ),
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
                  false,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false,
                ),
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
                  true,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true,
                ),
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
                  false,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false,
                ),
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
                  true,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true,
                ),
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
                  false,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  false,
                ),
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
                  true,
                ),
              );
            } else {
              dispatch(
                getDocumentsAndFolderApi(
                  navigate,
                  Number(currentView),
                  t,
                  1,
                  Number(statusID),
                  true,
                ),
              );
            }

            return "descend";
          }
        });
      }
    }
  };

  // ─── Table column definitions ─────────────────────────────────────────────

  /**
   * Column schema for the My Documents / All tabs (views 1 & 3).
   * Columns: Name (sortable) | Owner (sortable) | Modified Date (sortable + filterable)
   *          | File Size | Location | Actions (share/download/delete/three-dot menu)
   *
   * The Name cell distinguishes shared vs. own items and files vs. folders,
   * showing the appropriate icon and click handler in each case.
   * The Actions cell renders different icon sets based on permissionID:
   *   1 = Viewer, 2 = Editor, 3 = Editable-non-shareable
   * PDF/DOCX/DOC files additionally show the Signature Flow option.
   */
  const MyDocumentsColumns = [
    {
      title: (
        <>
          <span className="d-flex gap-2">
            {t("Name")}{" "}
            {allDocumentsTitleSorter === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
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
                onClick={() => getFolderDocuments(data.id, data)}
              >
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement="top"
                  className="d-flex gap-1"
                >
                  <img src={folderColor} alt="" draggable="false" />
                  {/* <abbr title={text} className='d-flex gap-1'> */}

                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                  >
                    {text}
                  </span>
                  <img src={sharedIcon} alt="" draggable="false" />
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
                  placement="top"
                  className="d-flex gap-1"
                >
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                    width={"25px"}
                    height={"25px"}
                  />

                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}
                  >
                    {text}
                  </span>
                  <img src={sharedIcon} alt="" draggable="false" />
                </Tooltip>
              </section>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div
                className={`${styles["dataFolderRow"]}`}
                onClick={() => getFolderDocuments(data.id, data)}
              >
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement="top"
                  className="d-flex gap-1"
                >
                  <img src={folderColor} alt="" draggable="false" />

                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                  >
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
                  alt=""
                  width={"25px"}
                  height={"25px"}
                />
                <Tooltip title={text} showArrow={false} placement="top">
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}
                  >
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
          <span className="d-flex justify-content-center gap-2">
            {t("Owner")}{" "}
            {allOwnerSorter === "descend" ? (
              <img src={DescendIcon} alt="" />
            ) : (
              <img src={AscendIcon} alt="" />
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
        <span className="d-flex justify-content-center align-items-center gap-2">
          <span className={styles["datemodifiedfilter"]}>
            {t(selectedValue.label)}
          </span>
          {allLastModifiedSorter === "descend" ? (
            <img src={ArrowUpIcon} alt="" />
          ) : (
            <img src={ArrowDownIcon} alt="" />
          )}
        </span>
      ),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "20%",
      align: "center",
      filterIcon: (filtered) => (
        <ChevronDown className="ChevronPolls" onClick={handleClickChevron} />
      ),
      filterDropdown: () => (
        <Dropdown
          overlay={menu}
          visible={visible}
          onVisibleChange={(open) => setVisible(open)}
        >
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
      dataIndex: "fileSizeOnDisk",
      key: "fileSizeOnDisk",
      width: "10%",
      align: "center",
      render: (text, record) => {
        console.log(record, "File-size");
        if (record.isFolder) {
          return <Dash />;
        } else {
          return (
            // <span className={styles["ownerName"]}>{`${convertToArabicNumerals(
            //   text,
            //   CurrentLanguage
            // )} MB`}</span>
            <span className={styles["ownerName"]}>{formatMB(text)}</span>
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
              className="d-flex justify-content-end gap-2 position-relative otherstuff"
            >
              {record.isShared ? (
                <>
                  <div className="tablerowFeatures">
                    {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      //  Share Icon

                      <Tooltip placement="topRight" title={t("Share")}>
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
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.022"
                            height="11.71"
                            viewBox="0 0 16.022 11.71"
                          >
                            <path
                              id="Icon_material-group-add"
                              data-name="Icon material-group-add"
                              d="M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z"
                              transform="translate(0.5 -7)"
                              fill="none"
                              stroke="#5a5a5a"
                            />
                          </svg>
                        </span>
                      </Tooltip>
                    )}
                    {/* Download Icon */}
                    <Tooltip placement="topRight" title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=""
                          height="10.71px"
                          width="15.02px"
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
                            ? getMenuPopover(
                                optionsforFolderEditableNonShareable,
                              )
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
                  <div className="tablerowFeatures">
                    <Tooltip placement="topRight" title={t("Share")}>
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
                          xmlns="http://www.w3.org/2000/svg"
                          width="16.022"
                          height="11.71"
                          viewBox="0 0 16.022 11.71"
                        >
                          <path
                            id="Icon_material-group-add"
                            data-name="Icon material-group-add"
                            d="M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z"
                            transform="translate(0.5 -7)"
                            fill="none"
                            stroke="#5a5a5a"
                          />
                        </svg>
                      </span>
                    </Tooltip>
                    <Tooltip placement="topRight" title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=""
                          height="10.71px"
                          width="15.02px"
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>

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
                          height="12.17px"
                          alt=""
                          width="9.47px"
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
                      : [
                            "pdf".toLowerCase(),
                            "docx".toLowerCase(),
                            "doc".toLowerCase(),
                          ].includes(fileExtension.toLowerCase())
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

  /**
   * Ant Design Table `onChange` handler.
   * Only acts on the "sharedDate" column sorter — re-fetches with the
   * correct ascending/descending flag and keeps filteredInfo/sortedInfo
   * in sync for controlled table state.
   */
  const handleSortChange = (pagination, filters, sorter) => {
    if (sorter.field === "sharedDate") {
      if (sorter.order === "ascend") {
        setIsAscending(false);

        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 1, 2, false),
        );
      } else {
        setIsAscending(true);

        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 1, 2, true),
        );
      }
    }
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  /**
   * Column schema for the Recently Added tab (view 4).
   * Columns: Name | Owner | Last Modified | File Size | Location | Actions
   * No sortable headers — recent items are always ordered by recency.
   */
  const MyRecentTab = [
    {
      title: (
        <>
          <span>{t("Name")}</span>
        </>
      ),
      dataIndex: "name",
      key: "name",
      width: "140px",
      align: "start",
      ellipsis: true,

      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={folderColor} alt="" draggable="false" />
                <Tooltip
                  title={text}
                  showArrow={false}
                  placement="top"
                  className="d-flex gap-1"
                >
                  {" "}
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id, data)}
                  >
                    {text} <img src={sharedIcon} alt="" draggable="false" />
                  </span>
                </Tooltip>
              </div>
            );
          } else {
            <div className={styles["dataFolderRow"]}>
              <Tooltip
                title={text}
                showArrow={false}
                placement="top"
                className="d-flex gap-1"
              >
                <img
                  src={getIconSource(getFileExtension(data.name))}
                  alt=""
                  width={"25px"}
                  height={"25px"}
                />

                <span
                  onClick={(e) => handleLinkClick(e, data)}
                  className={styles["dataroom_table_heading"]}
                >
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
                  placement="top"
                  className="d-flex gap-1"
                >
                  <img src={folderColor} alt="" draggable="false" />
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id, data)}
                  >
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
                  placement="top"
                  className="d-flex gap-1 align-items-center"
                >
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                    width={"25px"}
                    height={"25px"}
                  />
                  <span
                    onClick={(e) => handleLinkClick(e, data)}
                    className={styles["dataroom_table_heading"]}
                  >
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
      dataIndex: "fileSizeOnDisk",
      key: "fileSizeOnDisk",
      width: "90px",
      align: "center",
      render: (text, record) => {
        if (record.isFolder) {
          return <Dash />;
        } else {
          {
            console.log("File-size", text);
          }
          return <span className={styles["ownerName"]}>{formatMB(text)}</span>;
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
              className="d-flex justify-content-end gap-2 position-relative otherstuff"
            >
              {record.isShared ? (
                <>
                  <div className="tablerowFeatures">
                    {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      //  Share Icon

                      <Tooltip placement="topRight" title={t("Share")}>
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
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.022"
                            height="11.71"
                            viewBox="0 0 16.022 11.71"
                          >
                            <path
                              id="Icon_material-group-add"
                              data-name="Icon material-group-add"
                              d="M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z"
                              transform="translate(0.5 -7)"
                              fill="none"
                              stroke="#5a5a5a"
                            />
                          </svg>
                        </span>
                      </Tooltip>
                    )}
                    {/* Download Icon */}
                    <Tooltip placement="topRight" title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=""
                          height="10.71px"
                          width="15.02px"
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
                            ? getMenuPopover(
                                optionsforFolderEditableNonShareable,
                              )
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
                  <div className="tablerowFeatures">
                    <Tooltip placement="topRight" title={t("Share")}>
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
                          xmlns="http://www.w3.org/2000/svg"
                          width="16.022"
                          height="11.71"
                          viewBox="0 0 16.022 11.71"
                        >
                          <path
                            id="Icon_material-group-add"
                            data-name="Icon material-group-add"
                            d="M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z"
                            transform="translate(0.5 -7)"
                            fill="none"
                            stroke="#5a5a5a"
                          />
                        </svg>
                      </span>
                    </Tooltip>
                    <Tooltip placement="topRight" title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=""
                          height="10.71px"
                          width="15.02px"
                          className={styles["download__Icon_img"]}
                          onClick={() => showRequestingAccessModal(record)}
                        />
                      </span>
                    </Tooltip>

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
                          height="12.17px"
                          alt=""
                          width="9.47px"
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
                      : ["pdf".toLowerCase(), "docx".toLowerCase()].includes(
                            fileExtension.toLowerCase(),
                          )
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

  /**
   * Opens a file in the Apryse document viewer when the user clicks its name
   * in the table. Requires feature flag 20 to be enabled.
   * @param {React.SyntheticEvent} e - Click event (prevented to avoid navigation).
   * @param {object} record - Row record containing id, name, permissionID.
   */
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

  // ─── Notification deep-link: folder viewer rights ─────────────────────────
  /**
   * On mount, checks if the user arrived via a notification that granted
   * folder-viewer rights. If so, auto-navigates into that folder.
   * Cleans up all notification-related localStorage keys on unmount.
   */
  //Notification Redirection for Files and folder Read and Right
  useEffect(() => {
    //For Folder View Rights
    if (
      JSON.parse(
        localStorage.getItem("DataRoomOperationsForFolderViewerRights"),
      ) === true
    ) {
      let NotificaitonClickFolderID = localStorage.getItem(
        "NotificationClickFolderID",
      );
      dispatch(
        getFolderDocumentsApi(navigate, Number(NotificaitonClickFolderID), t),
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

  /**
   * Column schema for the Shared With Me tab (view 2).
   * Columns: Name | Shared By | Share Date (sortable) | Actions
   * Actions are permission-gated: viewers cannot share but can download.
   */
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
                className="d-flex gap-1 "
                placement="top"
                title={text}
                showArrow={false}
              >
                <img src={folderColor} alt="" draggable="false" />
                <span
                  className={styles["dataroom_table_heading"]}
                  onClick={() => getFolderDocuments(record.id, record)}
                >
                  {text}
                </span>
                <img src={sharedIcon} alt="" draggable="false" />
              </Tooltip>
            </div>
          );
        } else {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <Tooltip
                className="d-flex gap-1 "
                placement="top"
                title={text}
                showArrow={false}
              >
                <img
                  src={getIconSource(getFileExtension(record.name))}
                  alt=""
                  width={"25px"}
                  height={"25px"}
                />
                <span
                  className={styles["dataroom_table_heading"]}
                  onClick={(e) => handleLinkClick(e, record)}
                >
                  {record.name}
                </span>
                <img src={sharedIcon} alt="" draggable="false" />
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
          <span className="d-flex justify-content-center align-items-center gap-2">
            {t("Share-date")}
            {shareDateSorter === "descend" ? (
              <img src={ArrowUpIcon} alt="" />
            ) : (
              <img src={ArrowDownIcon} alt="" />
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
                className="d-flex justify-content-end gap-2 position-relative otherstuff"
              >
                <>
                  <div className="tablerowFeatures">
                    {record.permissionID === 1 ||
                    record.permissionID === 3 ? null : (
                      //  Share Icon

                      <Tooltip placement="topRight" title={t("Share")}>
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
                            xmlns="http://www.w3.org/2000/svg"
                            width="16.022"
                            height="11.71"
                            viewBox="0 0 16.022 11.71"
                          >
                            <path
                              id="Icon_material-group-add"
                              data-name="Icon material-group-add"
                              d="M6.325,11.619H3.953V9.148H2.372v2.472H0v1.648H2.372v2.472H3.953V13.267H6.325Zm3.953.824a2.413,2.413,0,0,0,2.364-2.472,2.37,2.37,0,1,0-4.736,0A2.42,2.42,0,0,0,10.278,12.443Zm0,1.648c-1.581,0-4.744.824-4.744,2.472V18.21h9.488V16.562C15.022,14.915,11.859,14.091,10.278,14.091Z"
                              transform="translate(0.5 -7)"
                              fill="none"
                              stroke="#5a5a5a"
                            />
                          </svg>
                        </span>
                      </Tooltip>
                    )}
                    {/* Download Icon */}
                    <Tooltip placement="topRight" title={t("Download")}>
                      <span className={styles["download__Icon"]}>
                        <img
                          src={download}
                          alt=""
                          height="10.71px"
                          width="15.02px"
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
                            ? getMenuPopover(
                                optionsforFolderEditableNonShareable,
                              )
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

  // ─── Dashboard file-drop upload ───────────────────────────────────────────
  /**
   * When the user drags a file onto the Dashboard and is redirected here,
   * the file object is passed via React Router `location.state`.
   * This effect picks it up and triggers the upload flow.
   */
  useEffect(() => {
    if (location.state !== null) {
      let fileObj = location.state;
      handleUploadFilefromDashbard(fileObj);
    }
  }, [location.state]);

  /**
   * Enqueues a file that arrived from the Dashboard drag-drop flow.
   * Builds a task descriptor, adds it to `tasksAttachments`, then calls
   * the FileisExist API to check for duplicates before uploading.
   * @param {File} file - The File object passed via router state.
   */
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
          showbarupload,
        ),
      );
    }
  };

  /**
   * Handles a file selected via the toolbar "New → Upload file" control.
   * Creates a task descriptor with a random TaskId, registers it in
   * `tasksAttachments`, then dispatches `FileisExist` to check for
   * server-side duplicates before the actual upload begins.
   * @param {{ file: File }} param0 - Ant Design Upload onChange payload.
   */
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
          showbarupload,
        ),
      );
    }
  };

  /**
   * Watches `DataRoomReducer.isFileExsist`. When the FileisExist API responds
   * `true` (duplicate found), opens the upload-options conflict modal.
   */
  // this is for file check
  useEffect(() => {
    // its check that reducer state is not null
    if (DataRoomReducer.isFileExsist === true) {
      setUploadOptionsmodal(true);
    } else {
    }
  }, [DataRoomReducer.isFileExsist]);

  /**
   * Cancels an in-progress single-file upload by setting its task state to
   * cancelled and calling the Axios cancel token to abort the HTTP request.
   * @param {{ TaskId: number, axiosCancelToken: import('axios').CancelTokenSource }} data - Task descriptor for the upload to cancel.
   */
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

  /**
   * Fires when the browser goes offline (`offline` window event).
   * Marks any actively-uploading single-file tasks with `NetDisconnect: true`
   * and does the same for any in-progress folder uploads tracked in
   * `detaUplodingForFOlder`, halting further chunk dispatches.
   * @param {Event} event - The native offline/online event (unused directly;
   *   `navigator.onLine` is read instead for reliability).
   */
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

  /**
   * Registers/re-registers the `offline` event listener whenever
   * `tasksAttachments` or `detaUplodingForFOlder` change so
   * `handleOnlineStatusChange` always closes over the latest state.
   * Cleans up on unmount or before the next run.
   */
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

  /**
   * Handles a folder selected via the toolbar "New → Upload folder" control.
   * Builds a folder-upload descriptor, appends it to `detaUplodingForFOlder`,
   * and dispatches `CheckFolderisExist` to detect server-side name conflicts.
   * @param {{ directoryName: string, fileList: File[] }} param0
   *   - `directoryName`: root folder name chosen by the user.
   *   - `fileList`: flat array of File objects inside that folder.
   */
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

  /**
   * Watches `DataRoomReducer.FolderisExistCheck` to drive the folder-upload
   * conflict flow:
   * - `true`  → folder name already exists on server; set `isFolderExist` to
   *             show the conflict modal (user picks replace/rename/skip).
   * - `null`  → API returned no match (name is free) after previously being
   *             `true`; dispatch `createFolder` with `folderUploadOptions`
   *             (the option chosen in the modal).
   * - `false` → no duplicate found on the first check; dispatch `createFolder`
   *             with option 0 (create new, no conflict resolution needed).
   */
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
                folderUploadOptions,
              ),
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
              0,
            ),
          );
        }
      }
    }
  }, [DataRoomReducer.FolderisExistCheck]);

  /**
   * Sequentially uploads every file inside a folder descriptor.
   * Iterates `folder.FileList` one-by-one, dispatching `uploadFile` for each.
   * Stops early if the folder is cancelled (`UploadCancel`) or the network
   * drops (`NetDisconnect` / `navigator.onLine`). A 1-second delay is
   * inserted between uploads to avoid overwhelming the server.
   * Marks the folder as `Uploaded: true` when all files finish.
   * @param {Object} folder - Entry from `detaUplodingForFOlder` with a
   *   populated `FolderID` (assigned after `createFolder` succeeds).
   */
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
                  folder.NetDisconnect,
                  // cancelToken
                ),
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

  /**
   * Fires whenever `DataRoomReducer.CreatedFoldersArray` updates (i.e. after
   * `createFolder` succeeds and the reducer stores the new folder metadata).
   * Finds the matching pending folder in `detaUplodingForFOlder` by name,
   * patches its `FolderID` and marks it `Uploading: true`, then:
   *   1. Refreshes the file listing for the current view so the new folder
   *      appears in the UI immediately.
   *   2. Calls `processArraySequentially` to start uploading the folder's files.
   * Folders with an empty `FileList` are skipped (no files to upload).
   */
  // this hokks triger when folder is created and its updaet its id of anew folder
  useEffect(() => {
    // this is checker of reducer if its not on its initial state
    try {
      if (DataRoomReducer.CreatedFoldersArray.length > 0) {
        const existingIndex = detaUplodingForFOlder.findIndex(
          (folder) =>
            folder.FolderName === directoryNames &&
            folder.Uploading === false &&
            folder.FolderID === 0,
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
                DataRoomReducer.CreatedFoldersArray[existingIndex].FolderID,
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
                    getFolderDocumentsApi(navigate, Number(viewFolderID), t, 1),
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
                        2,
                      ),
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

  /**
   * Cancels a single folder upload by mutating its descriptor flags and
   * triggering a state refresh so the progress bar reflects the cancellation.
   * @param {Object} folder - The folder descriptor from `detaUplodingForFOlder`.
   */
  const cancelUpload = (folder) => {
    folder.UploadCancel = true;
    folder.Uploading = false;
    setDetaUplodingForFOlder((prevFolders) => [...prevFolders]);
  };

  /**
   * Initiates the "cancel all uploads" flow.
   * If any upload (file or folder) is still in progress, sets
   * `canselingDetaUplodingForFOlder` to show a confirmation modal.
   * If nothing is uploading, clears all upload state immediately and
   * hides the progress bar.
   */
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

  /**
   * Confirmed "cancel all" handler — called when the user clicks OK in the
   * cancellation confirmation modal.
   * Cancels every Axios token for single-file tasks, marks all folder uploads
   * as cancelled, resets all upload state, hides the progress bar, and
   * dismisses the confirmation modal.
   * @param {*} data - Unused; kept for API consistency with the modal callback.
   */
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

  /**
   * Global document click handler that closes floating UI elements when the
   * user clicks outside of them:
   *   - `searchBarRef`   → hides the search bar if `searchbarshow` is true.
   *   - `threedotFolder` → hides the folder context menu if
   *                        `optionsFolderisShown` is true.
   *   - `threedotFile`   → hides the file context menu if
   *                        `optionsFileisShown` is true.
   * @param {MouseEvent} event - The native click event.
   */
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

  /**
   * Returns `true` if any upload (file or folder) is currently in progress.
   * Used by the `beforeunload` guard to decide whether to warn the user
   * before navigating away.
   * @returns {boolean}
   */
  // this is working perfect
  const checkCondition = () => {
    const dataArray = Object.values(tasksAttachments);
    const combinedArray = [...detaUplodingForFOlder, ...dataArray];
    if (Object.keys(combinedArray).length === 0) {
      return false;
    }

    const hasUploadingTrue = combinedArray.some(
      (obj) => obj.Uploading === true,
    );
    return hasUploadingTrue;
  };

  /**
   * Attaches a `beforeunload` listener that warns the user if they try to
   * close the tab or navigate away while an upload is still running.
   * Re-runs whenever upload state changes so `checkCondition` reflects
   * the latest values. Cleans up on unmount.
   */
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

  /**
   * Infinite-scroll trigger registered via `useScrollerAuditBottom`.
   * Fires when the user scrolls to the bottom of the page (50 px threshold).
   * Loads the next page of results:
   *   - If inside a folder (`viewFolderID` set) → `getFolderDocumentsApiScrollBehaviour`
   *   - Otherwise → `getDocumentsAndFolderApiScrollbehaviour`
   * Skips the dispatch if all records are already loaded
   * (`getAllData.length === totalRecords`).
   */
  // api call onscroll

  useScrollerAuditBottom(async () => {
    if (getAllData.length !== totalRecords) {
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
              true,
            ),
          );
        } else {
          await dispatch(
            getDocumentsAndFolderApiScrollbehaviour(
              navigate,
              currentView,
              t,
              Number(sRowsData),
              Number(sortValue),
              isAscending,
            ),
          );
        }
      }
    }
  }, 50);

  /**
   * Mounts/re-mounts the global `click` listener for `handleOutsideClick`.
   * Deps: `searchbarshow`, `optionsFileisShown`, `optionsFolderisShown` —
   * ensures the handler always closes over the current visibility flags.
   */
  // const handleUploadDocuemtuploadOptions = () => { }
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [searchbarshow, optionsFileisShown, optionsFolderisShown]);

  /**
   * Watches three DataRoom reducer message fields and surfaces them as
   * snackbar notifications via `showMessage`:
   *   - `ResponseMessage`       — generic API responses (errors, successes),
   *                               excluding several known non-error strings.
   *   - `FolderisExistMessage`  — folder duplicate check messages, excluding
   *                               "Folder-already-exist" (handled by modal).
   *   - `FileisExistMessage`    — file duplicate check messages, excluding
   *                               "File-already-exist" (handled by modal).
   * Dispatches `clearDataResponseMessage` after showing each message.
   */
  useEffect(() => {
    if (
      DataRoomReducer.ResponseMessage !== "" &&
      DataRoomReducer.ResponseMessage !== t("No-record-found") &&
      DataRoomReducer.ResponseMessage !==
        t("No-folder-exist-against-this-name") &&
      DataRoomReducer.ResponseMessage !== t("No-duplicate-found") &&
      DataRoomReducer.ResponseMessage !== "" &&
      DataRoomReducer.ResponseMessage !== t("Document-uploaded-successfully") &&
      DataRoomReducer.ResponseMessage !== t("Files-saved-successfully") &&
      errorSeverityState !== null
    ) {
      showMessage(DataRoomReducer.ResponseMessage, errorSeverityState, setOpen);
      dispatch(clearDataResponseMessage());
    }
    if (
      DataRoomReducer.FolderisExistMessage !== "" &&
      DataRoomReducer.FolderisExistMessage !== t("Folder-already-exist")
    ) {
      showMessage(
        DataRoomReducer.FolderisExistMessage,
        errorSeverityState,
        setOpen,
      );
      dispatch(clearDataResponseMessage());
    }
    if (
      DataRoomReducer.FileisExistMessage !== "" &&
      DataRoomReducer.FileisExistMessage !== t("File-already-exist")
    ) {
      showMessage(
        DataRoomReducer.FileisExistMessage,
        errorSeverityState,
        setOpen,
      );
      dispatch(clearDataResponseMessage());
    }
  }, [
    DataRoomReducer.FileisExistMessage,
    DataRoomReducer.FolderisExistMessage,
    DataRoomReducer.ResponseMessage,
    errorSeverityState,
  ]);
  /**
   * Shows snackbar messages from the DataRoom2 slice
   * (`DataRoomFileAndFoldersDetailsResponseMessage`) and clears them via
   * `clearDataResponseMessageDataRoom2` after display.
   */
  useEffect(() => {
    if (DataRoomFileAndFoldersDetailsResponseMessage !== "") {
      showMessage(
        DataRoomFileAndFoldersDetailsResponseMessage,
        errorSeverityState2,
        setOpen,
      );
      dispatch(clearDataResponseMessageDataRoom2());
    }
  }, [DataRoomFileAndFoldersDetailsResponseMessage, errorSeverityState2]);

  /**
   * Shows snackbar messages from the Signature workflow slice
   * (`SignatureResponseMessage`), skipping blank/undefined/null values and
   * "Created-successfully" (that state is handled elsewhere). Clears the
   * message via `clearWorkFlowResponseMessage` after display.
   */
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

  /**
   * Confirms folder deletion — dispatches `deleteFolder` with the pending
   * folder ID stored in `isFolderDeleteId`.
   */
  const handleClickDeleteFolder = () => {
    dispatch(
      deleteFolder(navigate, Number(isFolderDeleteId), t, setIsFolderDelete),
    );
  };

  /**
   * Cancels the folder delete confirmation modal without deleting anything.
   * Resets `isFolderDeleteId` and hides the modal.
   */
  const handleCancelDeleteFolder = () => {
    setIsFolderDeleteId(0);
    setIsFolderDelete(false);
  };

  /**
   * Cancels the file delete confirmation modal without deleting anything.
   * Resets `isFileDeleteId` and hides the modal.
   */
  const handleCancelDeleteFile = () => {
    setIsFileDeleteId(0);
    setIsFileDelete(false);
  };
  /**
   * Confirms file deletion — dispatches `deleteFileDataroom` with the pending
   * file ID stored in `isFileDeleteId`.
   */
  const handleClickDeleteFile = () => {
    dispatch(
      deleteFileDataroom(navigate, Number(isFileDeleteId), t, setIsFileDelete),
    );
  };

  /**
   * Breadcrumb click handler. Navigates the listing to the clicked crumb:
   *   - If `record.main` is truthy (root crumb) → reloads the root view for
   *     the current tab (view 4 uses Recent, all others use
   *     `getDocumentsAndFolderApi`) and clears the breadcrumb trail.
   *   - Otherwise → drills into the sub-folder by dispatching
   *     `getFolderDocumentsApi` with behaviour code 5 (breadcrumb navigation),
   *     passing the existing `BreadCrumbsListArr` so the trail is updated.
   * @param {number} id     - Folder ID to navigate into.
   * @param {Object} record - Breadcrumb record; `record.main` flags the root.
   * @param {number} index  - Position of the crumb in the breadcrumb array.
   */
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
          BreadCrumbsListArr,
        ),
      );
    }
  };

  /**
   * `next` callback passed to the `<InfiniteScroll>` component.
   * Loads the next page of records when the user scrolls to the bottom:
   *   - Inside a folder (`viewFolderID !== 0`) →
   *     `getFolderDocumentsApiScrollBehaviour`
   *   - Root view → `getDocumentsAndFolderApiScrollbehaviour`
   * Returns early if the full dataset is already loaded.
   */
  const handleScroll = () => {
    if (getAllData.length >= totalRecords) return; // No more data

    dispatch(dataBehaviour(true));

    const viewFolderID = Number(localStorage.getItem("folderID") || 0);

    if (viewFolderID !== 0) {
      // Load more from inside a folder
      dispatch(
        getFolderDocumentsApiScrollBehaviour(
          navigate,
          viewFolderID,
          t,
          2,
          sRowsData, // already loaded rows
          1,
          true,
        ),
      );
    } else {
      // Load more from root
      dispatch(
        getDocumentsAndFolderApiScrollbehaviour(
          navigate,
          currentView,
          t,
          Number(sRowsData),
          1,
          isAscending,
        ),
      );
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────
  //
  // Layout overview:
  //   1. Toast / notification overlays (delete, remove, rename, undo) — rendered
  //      as floating fixed elements above the content.
  //   2. Top toolbar row:
  //        [Left]  "Data room" heading + "New" dropdown (folder / file / folder upload)
  //        [Center] SearchBarComponent
  //        [Right]  Grid/List view toggle (hidden on view 5 – Send for Approval)
  //   3. View tabs row: All | My Documents | Shared With Me |
  //                     Send for Approval (feature-gated) | Recently Added
  //   4. Breadcrumbs (shown when inside a folder; overflow via Popover)
  //   5. Content pane — switches on `currentView`:
  //        2 → Shared With Me    (grid or table, no InfiniteScroll wrapper)
  //        4 → Recently Added    (grid with InfiniteScroll, or table)
  //        5 → <ApprovalSend />  (entirely delegated to sub-component)
  //        default → My Docs / All  (grid with InfiniteScroll, or table,
  //                                  or drag-drop empty state)
  //      When `detailView` is true a side-panel <ViewDetailsModal> is shown.
  //   6. Floating upload progress bar (<UploadindUiComponent>) — visible while
  //      `showbarupload` is true.
  //   7. Modal portal layer — all modal components rendered here (conditionally):
  //        ModalAddFolder, ModalOptions (file conflict), ModalCancelUpload,
  //        ModalShareFolder, ModalRenameFolder, ModalShareFile,
  //        ModalOptionsFolder, ModalOptionsisExistFolder, ModalRenameFile,
  //        ModalFileRequest, FileDetailsModal, ModalDeleteFile,
  //        ModalDeleteFolder, Notification snackbar.
  return (
    <>
      <div className={styles["DataRoom_container"]}>
        {/* ── Floating toast notifications ─────────────────────────────────── */}
        {deletenotification && <DeleteNotificationBox />}
        {fileremoved && <FileRemoveBox />}
        {showrenamenotification && (
          <ShowRenameNotification
            ClosingNotificationRenameFolder={ClosingNotificationRenameFolder}
          />
        )}
        {actionundonenotification && <ActionUndoNotification />}
        <Row>
          <Col sm={12} md={12} lg={12}>
            {/* ── Top toolbar ───────────────────────────────────────────────── */}
            <Row>
              <Col
                lg={4}
                md={4}
                sm={12}
                className="d-flex gap-3 align-items-center"
              >
                <span className={styles["Data_room_heading"]}>
                  {t("Data-room")}
                </span>
                {/* "New" dropdown: New Folder / File Upload / Folder Upload */}
                <BootstrapDropdown className={styles["DataRoom_DropDown"]}>
                  <BootstrapDropdown.Toggle title={t("New")}>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Data_room_btn"]}
                      >
                        <Plus width={20} height={20} fontWeight={800} />
                        <span className={styles["font_size"]}>{t("New")}</span>
                      </Col>
                    </Row>
                  </BootstrapDropdown.Toggle>

                  <BootstrapDropdown.Menu
                    className={styles["dropdown_menu_dataroom"]}
                  >
                    <BootstrapDropdown.Item
                      className={styles["dataroom_dropdown_item"]}
                      onClick={openFolderModal}
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=" d-flex gap-2 align-items-center"
                        >
                          <img
                            src={plus}
                            height="10.8"
                            alt=""
                            width="12px"
                            onClick={openFolderModal}
                          />
                          <span className={styles["New_folder"]}>
                            {t("New-folder")}
                          </span>
                        </Col>
                      </Row>
                    </BootstrapDropdown.Item>
                    <BootstrapDropdown.Item
                      className={styles["dataroom_dropdown_item"]}
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=" d-flex gap-2 align-items-center"
                        >
                          <img
                            src={fileupload}
                            alt=""
                            height="10.8"
                            width="12px"
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
                      className={styles["dataroom_dropdown_item"]}
                    >
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=" d-flex gap-1 align-items-center"
                        >
                          <img
                            src={plus}
                            height="10.8"
                            alt=""
                            width="12px"
                            draggable="false"
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
              {/* ── Search bar ────────────────────────────────────────────── */}
              <Col
                lg={6}
                md={6}
                sm={12}
                className="d-flex position-relative Inputfield_for_data_room justify-content-end "
              >
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
              {/* ── Grid / List view toggle (hidden on Send-for-Approval tab) ── */}
              <Col
                lg={1}
                md={1}
                sm={12}
                className="d-flex justify-content-center"
              >
                {currentView !== 5 && (
                  <span className={styles["lsit_grid_buttons"]}>
                    <Button
                      icon={
                        <Tooltip placement="bottomLeft" title={t("Grid-view")}>
                          <img
                            src={
                              gridbtnactive ? Grid_Selected : Grid_Not_Selected
                            }
                            height="25.27px"
                            width="25.27px"
                            alt=""
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
                        <Tooltip placement="bottomLeft" title={t("List-view")}>
                          <img
                            src={
                              listviewactive ? List_Selected : List_Not_selected
                            }
                            height="25.27px"
                            width="25.27px"
                            alt=""
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
            {/* ── View tabs + breadcrumbs + content area ─────────────────────── */}
            <Row>
              {/* Content pane narrows to 8 cols when the detail side-panel is open */}
              <Col
                lg={detailView ? 8 : 12}
                md={detailView ? 8 : 12}
                sm={detailView ? 8 : 12}
              >
                <span className={styles["Data_room_paper"]}>
                  {/* Search results overlay replaces normal listing */}
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
                    />
                  ) : (
                    <>
                      {/* ── Tab buttons ─────────────────────────────────── */}
                      <Row>
                        <Col lg={12} md={12} sm={12} className="d-flex gap-3">
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
                        {/* ── Breadcrumbs (visible when inside a folder) ── */}
                        {BreadCrumbsListArr.length > 0 && (
                          <>
                            <Col
                              sm={12}
                              md={12}
                              lg={12}
                              className="mt-3 d-flex align-items-center gap-2"
                            >
                              {/* Ant Design Breadcrumb with right-arrow separator */}
                              <Breadcrumb
                                prefixCls="dataroombreadCrumbs"
                                separator={
                                  <img src={RightArrowBreadCrumbs} alt="" />
                                }
                              >
                                {/* Show three dots if more than 2 items */}
                                {BreadCrumbsListArr.length > 2 && (
                                  <Breadcrumb.Item>
                                    <Popover
                                      className="breadCrumbsItems"
                                      openClassName="openPopOverClass"
                                      overlayClassName="overClass"
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
                                                    index,
                                                  )
                                                }
                                              >
                                                <div
                                                  className={
                                                    styles[
                                                      "breadCrumbsThreeDotsDiv_Row"
                                                    ]
                                                  }
                                                >
                                                  <img
                                                    src={folderColor}
                                                    alt=""
                                                  />
                                                  <p className="m-0">
                                                    {item.name}
                                                  </p>
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      }
                                      trigger="click"
                                      visible={isPopoverVisible}
                                      onVisibleChange={setIsPopoverVisible}
                                      placement="bottomLeft"
                                      defaultOpen={false}
                                      showArrow={false}
                                    >
                                      <img
                                        src={ThreeDotsBreadCrumbs}
                                        style={{ cursor: "pointer" }}
                                        alt="More Breadcrumbs"
                                        onClick={togglePopover}
                                      />
                                    </Popover>
                                  </Breadcrumb.Item>
                                )}

                                {/* Show only last 2 items if length > 2 */}
                                {BreadCrumbsListArr.slice(
                                  BreadCrumbsListArr.length > 2 ? -2 : 0,
                                ).map((item, index) => (
                                  <Breadcrumb.Item
                                    key={item.id}
                                    onClick={() =>
                                      handleClickGetFolderData(
                                        item.id,
                                        item,
                                        index,
                                      )
                                    }
                                  >
                                    {item.name}
                                  </Breadcrumb.Item>
                                ))}
                              </Breadcrumb>
                            </Col>
                          </>
                        )}
                      </Row>
                      {/* ── Per-view content ────────────────────────────── */}
                      {currentView === 2 ? (
                        // View 2: Shared With Me — no InfiniteScroll wrapper
                        <>
                          <Row className="mt-3">
                            <Col lg={12} sm={12} md={12}>
                              {getAllData.length > 0 &&
                              getAllData !== undefined &&
                              getAllData !== null &&
                              gridbtnactive ? (
                                <>
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
                                </>
                              ) : getAllData.length > 0 &&
                                getAllData !== undefined &&
                                getAllData !== null &&
                                listviewactive === true ? (
                                <>
                                  <TableToDo
                                    sortDirections={["descend", "ascend"]}
                                    column={shareWithmeColoumns}
                                    className={"DataRoom_Table"}
                                    size={"middle"}
                                    onChange={handleSortChange}
                                    rows={getAllData}
                                    pagination={false}
                                    scroll={{ y: 400, x: "100%" }}
                                  />
                                </>
                              ) : (
                                <>
                                  <Row className="mt-4">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      <img
                                        src={EmptyStateSharewithme}
                                        alt=""
                                        draggable="false"
                                      />
                                    </Col>
                                  </Row>
                                  <Row className="mt-4">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      <span
                                        className={
                                          styles["Messege_nofiles_shared"]
                                        }
                                      >
                                        {t("There-are-no-files-shared")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className="mt-0">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      <span
                                        className={
                                          styles["Messege_nofiles_shared"]
                                        }
                                      >
                                        {t("With-you")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className="mt-2">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      {/* <Spin /> */}
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      ) : currentView === 4 ? (
                        // View 4: Recently Added — grid has InfiniteScroll wrapper
                        <>
                          <Row className="mt-3">
                            <Col lg={12} sm={12} md={12}>
                              {getAllData.length > 0 ? (
                                <>
                                  {gridbtnactive ? (
                                    <>
                                      <InfiniteScroll
                                        dataLength={getAllData.length}
                                        next={handleScroll}
                                        hasMore={
                                          getAllData.length < totalRecords
                                        } // cleaner
                                        height="58vh"
                                        style={{ overflowX: "hidden" }}
                                        endMessage=""
                                      >
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
                                      </InfiniteScroll>
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
                                            <span className="vh-100 text-center">
                                              <p>{t("No-recent-data-found")}</p>
                                            </span>
                                          </>
                                        ),
                                      }}
                                      size={"middle"}
                                    />
                                  ) : (
                                    <>
                                      <Row className="mt-2">
                                        <Col
                                          lg={12}
                                          md={12}
                                          sm={12}
                                          className="d-flex justify-content-center h-100 align-items-center"
                                        >
                                          <span
                                            className={
                                              styles["Messege_nofiles"]
                                            }
                                          >
                                            {t("There-are-no-items-here")}
                                          </span>
                                          <Row className="mt-2">
                                            <Col
                                              lg={12}
                                              md={12}
                                              sm={12}
                                              className="d-flex justify-content-center"
                                            ></Col>
                                          </Row>
                                        </Col>
                                      </Row>
                                    </>
                                  )}
                                </>
                              ) : (
                                <>
                                  <Row className="text-center mt-4">
                                    <Col lg={12} sm={12} md={12}>
                                      <img src={Recentadded_emptyIcon} alt="" />
                                    </Col>
                                    <Col lg={12} sm={12} md={12}>
                                      <p className={styles["Recently_Added"]}>
                                        {t("Recently-added")}
                                      </p>
                                      <span
                                        className={
                                          styles["Recently_Added_tagLine"]
                                        }
                                      >
                                        {t(
                                          "This-space-is-ready-to-showcase-your-latest-additions-what-will-you-add-next",
                                        )}
                                      </span>
                                      <div className="d-flex justify-content-center align-items-center"></div>
                                    </Col>
                                  </Row>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      ) : currentView === 5 ? (
                        // View 5: Send for Approval — fully delegated
                        <ApprovalSend />
                      ) : (
                        // Views 1 & 3: My Documents / All
                        // Grid uses InfiniteScroll; list uses table;
                        // empty state shows a drag-drop Dragger.
                        <>
                          <Row className="mt-3">
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
                                    endMessage=""
                                    loader={
                                      getAllData.length <= totalRecords && (
                                        <Row>
                                          <Col
                                            sm={12}
                                            md={12}
                                            lg={12}
                                            className="d-flex justify-content-center mt-2"
                                          >
                                            <Spin indicator={antIcon} />
                                          </Col>
                                        </Row>
                                      )
                                    }
                                  >
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
                                  <TableToDo
                                    column={MyDocumentsColumns}
                                    className={"DataRoom_Table"}
                                    rows={getAllData}
                                    pagination={false}
                                    scroll={{ y: 400, x: "100%" }}
                                    footer={() => {
                                      return (
                                        DataRoomReducer.dataBehaviour && (
                                          <Spin indicator={antIcon} />
                                        )
                                      );
                                    }}
                                  />
                                  <Row>
                                    <Col
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      className="d-flex justify-content-center align-items-center"
                                    ></Col>
                                  </Row>
                                </>
                              ) : (
                                <>
                                  <Row className="mt-2">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      <span
                                        className={styles["Messege_nofiles"]}
                                      >
                                        {t("There-are-no-items-here")}
                                      </span>
                                    </Col>
                                  </Row>
                                  <Row className="mt-3">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
                                      <span
                                        className={styles["Tag_line_nofiles"]}
                                      >
                                        {t("Start-adding-your-documents")}
                                      </span>
                                    </Col>
                                  </Row>
                                  {/* Dragger Uploader */}
                                  <Row className="mt-4">
                                    <Col
                                      lg={12}
                                      md={12}
                                      sm={12}
                                      className="d-flex justify-content-center"
                                    >
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
                                            heigh="356.89"
                                            width="356.89"
                                            alt=""
                                          />
                                        }
                                      />
                                    </Col>
                                  </Row>
                                  <div className="d-flex justify-content-center align-items-center"></div>
                                </>
                              )}
                            </Col>
                          </Row>
                        </>
                      )}
                      <></>
                    </>
                  )}
                </span>
              </Col>
              {/* ── Detail side-panel (file/folder analytics) ──────────────── */}
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
      {/* ── Floating upload progress bar ─────────────────────────────────── */}
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

      {/* ── Modal portal layer ───────────────────────────────────────────── */}
      {/* Create new folder */}
      {foldermodal && (
        <ModalAddFolder
          addfolder={foldermodal}
          setAddfolder={setFolderModal}
          setIsExistFolder={setIsExistFolder}
        />
      )}

      {/* File duplicate conflict resolution (replace / keep both / skip) */}
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

      {/* Confirm "cancel all uploads" */}
      {canselingDetaUplodingForFOlder && (
        <ModalCancelUpload
          canselingDetaUplodingForFOlder={canselingDetaUplodingForFOlder}
          setCanselingDetaUplodingForFOlder={setCanselingDetaUplodingForFOlder}
          CanceUploadinFromModalTrue={CanceUploadinFromModalTrue}
        />
      )}

      {/* Share folder with other users */}
      {sharefoldermodal && (
        <ModalShareFolder
          sharefolder={sharefoldermodal}
          setSharefolder={setSharefoldermodal}
          folderId={folderId}
          folderName={folderName}
        />
      )}

      {/* Rename folder */}
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
      {/* Share file with other users */}
      {shareFileModal && (
        <ModalShareFile
          folderId={folderId}
          fileName={fileName}
          setShareFile={setShareFileModal}
          shareFile={shareFileModal}
        />
      )}

      {/* Folder name conflict during manual "New Folder" creation */}
      {isExistFolder && (
        <ModalOptionsFolder
          setAddfolder={setFolderModal}
          isExistFolder={isExistFolder}
          setIsExistFolder={setIsExistFolder}
        />
      )}

      {/* Folder name conflict during folder upload */}
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

      {/* Rename file */}
      {showrenameFile && (
        <ModalRenameFile
          isRenameFileData={isRenameFileData}
          showrenameFile={showrenameFile}
          setShowRenameFile={setShowRenameFile}
        />
      )}

      {/* Request access to a file */}
      {RequestFile && (
        <ModalFileRequest
          RequestFile={RequestFile}
          setRequestFile={setRequestFile}
        />
      )}

      {/* File analytics / details panel (triggered by row click in list view) */}
      {DataRoomReducer.fileDetials && (
        <FileDetailsModal
          fileDataforAnalyticsCount={fileDataforAnalyticsCount}
        />
      )}

      {/* Delete file confirmation */}
      {isFileDelete && (
        <ModalDeleteFile
          fileDelete={isFileDelete}
          setFileDeleted={setIsFileDelete}
          handleClickDeleteFileFunc={handleClickDeleteFile}
          handleCancelFileDelete={handleCancelDeleteFile}
        />
      )}

      {/* Delete folder confirmation */}
      {isFolderDelete && (
        <ModalDeleteFolder
          isDeleteFolder={isFolderDelete}
          setIsDeleteFolder={setIsFolderDelete}
          handleClickDeleteFolderFunc={handleClickDeleteFolder}
          handleCancelFoldereDelete={handleCancelDeleteFolder}
        />
      )}
      {/* Global snackbar notification */}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default DataRoom;
