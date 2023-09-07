import React, { useEffect, useRef } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Progress, Space, Spin, Tooltip } from "antd";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Cancellicon from "../../assets/images/cross_dataroom.svg";
import CrossIcon from "../../assets/images/CrossIcon.svg";
import { LoadingOutlined } from "@ant-design/icons";
import images from "../../assets/images/Imagesandphotos.svg";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import rightdirection from "../../assets/images/Path 1691.svg";
import searchicon from "../../assets/images/searchicon.svg";
import audioIcon from "../../assets/images/audioICon.svg";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/Icon material-delete.svg";
import dot from "../../assets/images/Group 2898.svg";
import ShareIcon from "../../assets/images/ShareIcon.svg";
import Cross from "../../assets/images/cuticon.svg";
import sitesIcon from "../../assets/images/sitesIcon.svg";
import DrapDropIcon from "../../assets/images/DrapDropIcon.svg";
import EmptyStateSharewithme from "../../assets/images/SharewithmeEmptyIcon.svg";
import { Plus, XCircleFill } from "react-bootstrap-icons";
import chevdown from "../../assets/images/chevron_down_white.svg";
import chevronUp from "../../assets/images/chevron_up.svg";
import documentIcon from "../../assets/images/color document.svg";
import pdf from "../../assets/images/color pdf.svg";
import video from "../../assets/images/color video.svg";
import spreadsheet from "../../assets/images/color spreadsheet.svg";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
import forms from "../../assets/images/color forms.svg";
import start from "../../assets/images/Icon feather-star.svg";
import Select from "react-select";
import folderColor from "../../assets/images/folder_color.svg";
import plus from "../../assets/images/Icon feather-folder.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import PDFICON from "../../assets/images/pdf_icon.svg";
import featherfolder from "../../assets/images/feather-folder.svg";
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
  deleteFileDataroom,
  deleteFolder,
  FileisExist,
  getDocumentsAndFolderApi,
  getDocumentsAndFolderApiScrollbehaviour,
  getFolderDocumentsApi,
  isFolder,
} from "../../store/actions/DataRoom_actions";
import sharedIcon from "../../assets/images/shared_icon.svg";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import { _justShowDateformat } from "../../commen/functions/date_formater";
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import { useNavigate } from "react-router-dom";
import CrossIconDropdown from "../../assets/images/cross__sign_dropdown.svg";
import CheckIconDropdown from "../../assets/images/check__sign_dropdown.svg";
import ShowBeforeAfterDate from "./ShowSubMenuforBeforeAfterDate/ShowBeforeAfterDate";
import DeleteNotificationBox from "./DeleteNotification/deleteNotification";
import FileRemoveBox from "./FileRemoved/FileRemoveBox";
import ShowRenameNotification from "./ShowRenameNotification/ShowRenameNotification";
import ActionUndoNotification from "./ActionUndoNotification/ActionUndoNotification";
import ModalShareDocument from "./ModalSharedocument/ModalShareDocument";
import {
  CheckFolderisExist,
  CreateFolder_success,
  FolderisExist_success,
  createFolder,
  folderUploadData,
  uploadFile,
} from "../../store/actions/FolderUploadDataroom";
import ModalRenameFile from "./ModalRenameFile/ModalRenameFile";
import ModalOptionsisExistFolder from "./ModalUploadFolderisExist/ModalUploadFolderisExist";
import { DownOutlined } from "@ant-design/icons";
import audio_Icon from "../../assets/images/AttachmentIcons/audio.svg";
import docIcon from "../../assets/images/AttachmentIcons/doc.svg";
import formsIcon from "../../assets/images/AttachmentIcons/forms.svg";
import notesIcon from "../../assets/images/AttachmentIcons/notes.svg";
import pdfIcon from "../../assets/images/AttachmentIcons/pdf.svg";
import photosIcon from "../../assets/images/AttachmentIcons/photos.svg";
import pptIcon from "../../assets/images/AttachmentIcons/ppt.svg";
import shareIcon from "../../assets/images/AttachmentIcons/share.svg";
import sites_Icon from "../../assets/images/AttachmentIcons/sites.svg";
import videoIcon from "../../assets/images/AttachmentIcons/video.svg";
import xlsFileIcon from "../../assets/images/AttachmentIcons/xls-file.svg";
import { getFolderDocumentsApiScrollBehaviour } from "../../store/actions/DataRoom_actions";
import axios from "axios";

const DataRoom = () => {
  // tooltip
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showbarupload, setShowbarupload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inviteModal, setInviteModal] = useState(false);
  // console.log(navigator.onLine, "navigatornavigatornavigatornavigator");
  const [optionsFileisShown, setOptionsFileisShown] = useState(false);
  const [optionsFolderisShown, setOptionsFolderisShown] = useState(false);
  const [optionsforFolder, setOptionsforFolder] = useState([
    { label: "Share", value: 1 },
    { label: "Rename", value: 2 },
    { label: "View Details", value: 3 },
    { label: "Download", value: 4 },
    { label: "Remove", value: 5 },
  ]);
  const [optionsforFile, setOptionsforFile] = useState([
    { label: "Open With", value: 1, labelIcon: PDFICON },
    { label: "Share", value: 2, labelIcon: PDFICON },
    { label: "Rename", value: 3, labelIcon: PDFICON },
    { label: "View Details", value: 4, labelIcon: PDFICON },
    { label: "Download", value: 5, labelIcon: PDFICON },
    { label: "Remove", value: 6, labelIcon: PDFICON },
  ]);
  const { t } = useTranslation();
  const { uploadReducer, DataRoomReducer, LanguageReducer } = useSelector(
    (state) => state
  );
  const searchBarRef = useRef();
  const threedotFile = useRef();
  const threedotFolder = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [shareFileModal, setShareFileModal] = useState(false);
  const [foldermodal, setFolderModal] = useState(false);
  const [fileforUploadFolder, setFilesforUploadFolder] = useState([]);
  const [foldernameforUploadFolder, setFolderNameforUploadFolder] =
    useState("");
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  const [canceluploadmodal, setCanceluploadmodal] = useState(false);
  // const [sharemebtn, setSharemebtn] = useState(false);
  const [searchbarshow, setSearchbarshow] = useState(false);
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [searchoptions, setSearchoptions] = useState(false);
  const [sRowsData, setSRowsData] = useState(0);
  const [gridbtnactive, setGridbtnactive] = useState(false);
  const [listviewactive, setListviewactive] = useState(true);
  const [optionsthreedoticon, setOptionsthreedoticon] = useState(false);
  const [actionundonenotification, setActionundonenotification] =
    useState(false);
  const [cancelUpload, setCancelUpload] = useState(false);
  const [collapes, setCollapes] = useState(false);
  const [sharehoverstyle, setSharehoverstyle] = useState(false);
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  // const [mydocumentbtnactive, setMydocumentbtnactive] = useState(false);
  // const [alldocumentAcitve, setAllDocumentActive] = useState(true);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  console.log(tasksAttachments, "tasksAttachments");
  const [deltehoverstyle, setDeltehoverstyle] = useState(false);
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  const [showcanceldownload, setShowcanceldownload] = useState(false);
  const [customrangemoreoptions, setCustomerangemoreoptions] = useState(false);
  const [showrenamenotification, setShowrenamenotification] = useState(false);
  const [showrenamemodal, setShowreanmemodal] = useState(false);
  const [showrenameFile, setShowRenameFile] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [fileremoved, setFileremoved] = useState(false);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [deletenotification, setDeletenotification] = useState(false);
  const [isExistFolder, setIsExistFolder] = useState(false);
  const [isFolderExist, setIsFolderExist] = useState(false);
  const [isRenameFolderData, setRenameFolderData] = useState(null);
  const [isRenameFileData, setRenameFileData] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [data, setData] = useState([]);
  const [filesSend, setFilesSend] = useState([]);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [filterVal, setFilterVal] = useState("");
  const [sorted, setSorted] = useState(false);
  console.log(sorted, "sortedsortedsortedsorted");
  const dispatch = useDispatch();
  const [lengthValue, setLengthValue] = useState(0);
  const navigate = useNavigate();
  const [threeDotOptions, setThreeDotOptions] = useState(0);
  const [folderID, setFolderID] = useState([]);
  const [filterValue, setFilterValue] = useState(0);
  const [sortByValue, setSortByValue] = useState(true);
  const [rows, setRow] = useState([]);
  const [uploadDocumentAgain, setUploadDocumentAgain] = useState(null);
  const [getAllData, setGetAllData] = useState([]);
  const [showsubmenu, setShowsubmenu] = useState(false);
  const [searchDocumentTypeValue, setSearchDocumentTypeValue] = useState(0);
  const currentView = JSON.parse(localStorage.getItem("setTableView"));
  const [currentSort, setCurrentSort] = useState("descend"); // Initial sort order
  const [currentFilter, setCurrentFilter] = useState(t("Last-modified"));
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentFilterID, setCurrentFilterID] = useState(2); // Initial filter value
  let viewFolderID = localStorage.getItem("folderID");
  const [cancelToken, setCancelToken] = useState(axios.CancelToken.source());
  const [searchResultBoxFields, setSearchResultBoxFields] = useState({
    documentType: {
      value: 0,
      label: "",
    },
    lastModifedDate: {
      value: 0,
      label: "",
    },
    documetLocation: {
      value: 0,
      label: "",
    },
    itemname: "",
    haswords: "",
    owner: {
      value: 0,
      label: "",
    },
    specifiPeople: "",
  });
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  const [searchResultsFields, setSearchResultFields] = useState({
    lastModifiedDate: {
      value: 0,
      label: "",
    },
    DocumentType: {
      label: "",
      value: 0,
    },
    documentLocation: {
      value: 0,
      label: "",
    },
    userPermission: {
      value: 0,
      label: "",
    },
  });

  // thi state contains current file name which is ude to creat new folder
  const [directoryNames, setDirectoryNames] = useState("");
  // this state contain file which is in the folder
  const [fileLists, setFileLists] = useState([]);
  const [open, setOpen] = useState({
    open: false,
    message: "",
  });

  useEffect(() => {
    try {
      window.addEventListener("click", function (e) {
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
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t));
    } else {
      localStorage.setItem("setTableView", 3);
      dispatch(getDocumentsAndFolderApi(navigate, 3, t));
    }
    return () => {
      localStorage.removeItem("folderID");
    };
  }, []);

  useEffect(() => {
    // Add an event listener to track changes in online status
    const handleOnlineStatusChange = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    return () => {
      // Remove the event listeners when the component unmounts
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
    };
  }, []);

  useEffect(() => {
    if (!isOnline) {
      CanceApicalling();
    }
  }, [isOnline]);

  const showCustomerangetOptions = () => {
    setCustomerangemoreoptions(!customrangemoreoptions);
  };

  const ClosingNotificationRenameFolder = () => {
    setShowrenamenotification(false);
  };

  const closeSearchBar = () => {
    setCancelToken(axios.CancelToken.source());
    setShowbarupload(false);
    setTasksAttachments([]);
  };

  const OptionsDocument = [
    {
      value: 1,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={""} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Any")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 2,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={documentIcon} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Document")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 3,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={spreadsheet} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Spreadsheets")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 4,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={video} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Presentaion")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 5,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={forms} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Forms")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 6,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={images} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Photos")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 7,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={pdf} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("PDFs")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 8,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={video} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Videos")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 9,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={ShareIcon} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Share")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 10,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={folderColor} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Folder")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 11,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={sitesIcon} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Sites")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 12,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-2"
            >
              <img src={audioIcon} alt="" height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Audio")}
              </span>
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const OptionsDocument2 = [
    {
      value: 2,
      imgSrc: documentIcon,
      label: t("Document"),
    },
    {
      value: 3,
      imgSrc: spreadsheet,
      label: t("Spreadsheets"),
    },
    {
      value: 4,
      imgSrc: video,
      label: t("Presentaion"),
    },
    {
      value: 5,
      imgSrc: forms,
      label: t("Forms"),
    },
    {
      value: 6,
      imgSrc: images,
      label: t("Photos"),
    },
    {
      value: 7,
      imgSrc: pdf,
      label: t("PDFs"),
    },
    {
      value: 8,
      imgSrc: video,
      label: t("Videos"),
    },
    {
      value: 9,
      imgSrc: ShareIcon,
      label: t("Share"),
    },
    {
      value: 10,
      imgSrc: folderColor,
      label: t("Folder"),
    },
    {
      value: 11,
      imgSrc: sitesIcon,
      label: t("Sites"),
    },
    {
      value: 12,
      imgSrc: audioIcon,
      label: t("Audio"),
    },
  ];

  const optionsLocations = [
    { value: 1, label: t("Any-where-in-dataRoom") },
    { value: 2, label: t("My-documents") },
    { value: 3, label: t("Shared-with-me") },
  ];

  const OptionsOwner = [
    { value: 1, label: t("Anyone") },
    { value: 2, label: t("Owned-by-me") },
    { value: 3, label: t("Not-owned-by-me") },
    { value: 4, label: t("Specific-person") },
  ];

  // const optionsPeople = [{ value: 1, label: t("Viewer") }];

  const optionsLastmodified = [
    { value: 1, label: t("Any-time") },
    { value: 2, label: t("Today") },
    { value: 3, label: t("Last-7-days") },
    { value: 4, label: t("Last-30-days") },
    { value: 5, label: t("This-year-(2023)") },
    { value: 6, label: t("Last-year-(2022)") },
    {
      value: 7,
      label: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex align-items-center gap-3"
            >
              <span>{t("Custome-range")}</span>
              <img
                src={rightdirection}
                height="5.21px"
                alt=""
                width="8.83px"
                onClick={showCustomerangetOptions}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 8,
      label: (
        <>
          <Button text={t("Clear")} className={styles["Clear_button"]} />
        </>
      ),
    },
  ];

  const showRequestingAccessModal = () => {
    setRequestingAccess(true);
  };

  const handleFilter = (e) => {
    if (e.target.value === "") {
      setData(rows);
    } else {
      const filterData = rows.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setData(filterData);
    }
    setFilterVal(e.target.value);
  };

  const SearchiconClickOptions = () => {
    setSearchbarsearchoptions(true);
    if (searchbarshow === true) {
      setSearchbarshow(false);
    }
  };

  const showShareFolderModal = (id, name) => {
    setFolderId(id);
    setFolderName(name);
    setSharefoldermodal(true);
    setSharehoverstyle(true);
    setDeltehoverstyle(false);
  };

  const showShareFileModal = (id, name) => {
    setFolderId(id);
    setFileName(name);
    setShareFileModal(true);
    setSharehoverstyle(true);
    setDeltehoverstyle(false);
  };

  const handleGridView = () => {
    setGridbtnactive(true);
    setListviewactive(false);
  };

  const handlelistview = () => {
    setListviewactive(true);
    setGridbtnactive(false);
  };

  const SearchiconClickOptionsHide = () => {
    setSearchbarsearchoptions(false);
    setSearchResultBoxFields({
      documentType: {
        value: 0,
        label: "",
      },
      lastModifedDate: {
        value: 0,
        label: "",
      },
      documetLocation: {
        value: 0,
        label: "",
      },
      itemname: "",
      haswords: "",
      owner: {
        value: 0,
        label: "",
      },
      specifiPeople: "",
    });
    setSearchResultFields({
      lastModifiedDate: {
        value: 0,
        label: "",
      },
      DocumentType: {
        label: "",
        value: 0,
      },
      documentLocation: {
        value: 0,
        label: "",
      },
      userPermission: {
        value: 0,
        label: "",
      },
    });
  };

  const showSearchResultsOptions = () => {
    setSearchbarshow(false);
    setSearchbarsearchoptions(true);
  };

  const searchbardropdownShow = () => {
    setSearchbarshow(!searchbarshow);
    if (searchbarsearchoptions === true) {
      setSearchbarsearchoptions(false);
    }
  };

  const SharewithmeButonShow = async () => {
    setSRowsData(0);
    localStorage.setItem("setTableView", 2);
    await dispatch(getDocumentsAndFolderApi(navigate, 2, t));
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
    await dispatch(getDocumentsAndFolderApi(navigate, 1, t));
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
    await dispatch(getDocumentsAndFolderApi(navigate, 3, t));
    setGetAllData([]);
    localStorage.removeItem("folderID");
    setSharedwithmebtn(false);
    if (searchoptions) {
      setSearchoptions(false);
    }
  };

  // const showCancellUploadModal = () => {
  //   setCanceluploadmodal(true);
  // };

  // const showUploadOptionsModal = () => {
  //   setUploadOptionsmodal(!uploadOptionsmodal);
  // };

  const openFolderModal = () => {
    setFolderModal(true);
  };

  const getFolderDocuments = (folderid) => {
    localStorage.setItem("folderID", folderid);
    dispatch(getFolderDocumentsApi(navigate, folderid, t));
  };

  // const foldersHandler = (id) => {
  //   if (folderID.includes(id)) {
  //     let findFolderIDIndex = getAllData.findIndex(
  //       (data, index) => data.id === id
  //     );
  //     if (findFolderIDIndex !== -1) {
  //       let removeFind = folderID.splice(findFolderIDIndex, 1);
  //       setFolderID([...removeFind]);
  //     }
  //   } else {
  //     setFolderID([...folderID, id]);
  //   }
  // };

  const fileOptionsSelect = (data, record) => {
    if (data.value === 3) {
      setShowRenameFile(true);
      setRenameFileData(record);
    } else if (data.value === 2) {
      showShareFileModal(record.id, record.name);
    } else if (data.value === 6) {
      dispatch(deleteFileDataroom(navigate, record.id, t));
    }
  };

  const folderOptionsSelect = (data, record) => {
    if (data.value === 2) {
      setShowreanmemodal(true);
      setRenameFolderData(record);
    } else if (data.value === 1) {
      showShareFolderModal(record.id, record.name);
    } else if (data.value === 5) {
      dispatch(deleteFolder(navigate, record.id, t));
    }
  };

  const handleFilterMenuClick = async (filterValue) => {
    console.log(filterValue, "filterValuefilterValuefilterValue");
    setCurrentFilterID(filterValue);
    // setCurrentFilter(filterValue);
    // fetchDataWithFilter(filterValue);
  };

  // useEffect(() => {
  //   if (currentFilter !== null && currentFilter !== undefined, currentFilter !== "") {
  //     dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, currentFilter));
  //   }
  // }, [currentFilter])
  const handleSortChange = (pagination, filters, sorter) => {
    console.log(filters, sorter, "filtersfiltersfilters");
    if (sorter.field === "sharedDate") {
      if (sorter.order === "ascend") {
        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 2)
        );
      } else {
        dispatch(
          getDocumentsAndFolderApi(navigate, currentView, t, 2, true, 2)
        );
      }
    }
    // if (sorter.field === "name") {
    //   if (sorter.order === "ascend") {
    //     dispatch(
    //       getDocumentsAndFolderApi(
    //         navigate,
    //         Number(currentView),
    //         t,
    //         2,
    //         false,
    //         1
    //       )
    //     );
    //   } else {
    //     dispatch(
    //       getDocumentsAndFolderApi(navigate, Number(currentView), t, 2, true, 1)
    //     );
    //   }
    // }
    // if (sorter.field === "owner") {
    //   if (sorter.order === "ascend") {
    //     dispatch(
    //       getDocumentsAndFolderApi(
    //         navigate,
    //         Number(currentView),
    //         t,
    //         2,
    //         false,
    //         1
    //       )
    //     );
    //   } else {
    //     dispatch(
    //       getDocumentsAndFolderApi(navigate, Number(currentView), t, 2, true, 1)
    //     );
    //   }
    // }
    // if (filters.)
    setCurrentSort(sorter?.order);
    fetchDataWithSorting(sorter?.order);
  };

  const handleSortMyDocuments = (pagination, filters, sorter) => {
    if (sorter.field === "name") {
      if (sorter.order === "ascend") {
        dispatch(
          getDocumentsAndFolderApi(
            navigate,
            Number(currentView),
            t,
            2,
            false,
            1
          )
        );
      } else {
        dispatch(
          getDocumentsAndFolderApi(navigate, Number(currentView), t, 2, true, 1)
        );
      }
    }
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
      // setSorted(true)
      // dispatch(dataBehaviour(true))
      dispatch(
        getDocumentsAndFolderApi(
          navigate,
          Number(currentView),
          t,
          2,
          true,
          filterValue
        )
      );
    }

    // if (sorter.field === "modifiedDate") {
    //   if (sorter.order === "ascend") {
    //     dispatch(getDocumentsAndFolderApi(navigate, Number(currentView), t, 2, false, 2));
    //   } else {
    //     dispatch(getDocumentsAndFolderApi(navigate, Number(currentView), t, 2, false, 2));
    //   }
    // }
  };
  const fetchDataWithFilter = async (filterValue) => {
    // dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, true, filterValue));
    // Call your API with the selected filter value and current sort order
    // Update the data state with the response data
  };

  const fetchDataWithSorting = async (sortOrder) => {
    // Call your API with the selected sort order and current filter value
    // Update the data state with the response data
  };

  const MyDocumentsColumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: "200px",
      sortDirections: ["descend", "ascend"],

      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={featherfolder} alt="" />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}
                  >
                    {text} <img src={sharedIcon} alt="" />
                  </span>
                </abbr>
              </div>
            );
          } else {
            let FindExt = data?.name?.split(".")[1];
            return (
              <>
                <section className="d-flex gap-2">
                  <img
                    src={
                      FindExt === "png" ||
                      FindExt === "jpg" ||
                      FindExt === "jpeg"
                        ? photosIcon
                        : FindExt === "docx" ||
                          FindExt === "doc" ||
                          FindExt === "txt"
                        ? docIcon
                        : FindExt === "mp4"
                        ? videoIcon
                        : FindExt === "pdf"
                        ? pdfIcon
                        : FindExt === "xls" || FindExt === "xlsx"
                        ? xlsFileIcon
                        : FindExt === "ppt" || FindExt === "pptx"
                        ? pptIcon
                        : null
                    }
                    alt=""
                  />
                  <abbr title={text}>
                    <span className={styles["dataroom_table_heading"]}>
                      {text} <img src={sharedIcon} alt="" />
                    </span>
                  </abbr>
                </section>
              </>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <img src={featherfolder} alt="" />
                <abbr title={text}>
                  <span
                    className={`${
                      styles["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}
                  >
                    {text}{" "}
                  </span>
                </abbr>
              </div>
            );
          } else {
            let FindExt = data?.name?.split(".")[1];
            return (
              <>
                <section className="d-flex gap-2">
                  {FindExt === "png" ||
                  FindExt === "jpg" ||
                  FindExt === "jpeg" ? (
                    <img src={photosIcon} alt="" />
                  ) : FindExt === "docx" ||
                    FindExt === "doc" ||
                    FindExt === "txt" ? (
                    <img src={docIcon} alt="" />
                  ) : FindExt === "mp4" ? (
                    <img src={videoIcon} alt="" />
                  ) : FindExt === "xls" || FindExt === "xlsx" ? (
                    <img src={xlsFileIcon} alt="" />
                  ) : FindExt === "ppt" || FindExt === "pptx" ? (
                    <img src={pptIcon} alt="" />
                  ) : FindExt === undefined ? (
                    <img src={docIcon} alt="" />
                  ) : (
                    <img src={docIcon} alt="" />
                  )}

                  <abbr title={text}>
                    <span className={styles["dataroom_table_heading"]}>
                      {text}
                    </span>
                  </abbr>
                </section>
              </>
            );
          }
        }
      },
      sorter: (a, b) => a.name.toLowerCase() < b.name.toLowerCase(),
    },
    {
      title: t("Owner"),
      dataIndex: "owner",
      key: "owner",
      width: "90px",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.owner.toLowerCase() < b.owner.toLowerCase(),
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
      sortOrder: true,
      filters: [
        {
          text: t("Last-modified"),
          value: 2,
        },
        {
          text: t("Last-modified-by-me"),
          value: 3,
        },
        {
          text: t("Last-open-by-me"),
          value: 4,
        },
        // ... other filters ...
      ],
      filterIcon: (filtered) => (
        <DownOutlined className="filter-chevron-icon-todolist" />
      ),
      sortDirections: ["descend", "ascend"],
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
      sortDirections: ["descend", "ascend"],
      render: (text, record) => {
        return <span className={styles["ownerName"]}>{text}</span>;
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
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2 position-relative otherstuff"
              >
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
                        onClick={showRequestingAccessModal}
                      />
                    </span>
                  </Tooltip>
                  {record.isShared === true && record.permissionID === 1 ? (
                    <Tooltip placement="topRight" title={t("Delete")}>
                      <span className={styles["delete__Icon"]}>
                        <img
                          src={del}
                          height="10.71px"
                          alt=""
                          width="15.02px"
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
                  ) : record.isShared === false ? (
                    <Tooltip placement="topRight" title={t("Delete")}>
                      <span className={styles["delete__Icon"]}>
                        <img
                          src={del}
                          height="10.71px"
                          alt=""
                          width="15.02px"
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
                  ) : null}

                  <Tooltip placement="topRight" title={t("Start")}>
                    <span className={styles["start__Icon"]}>
                      <img
                        src={start}
                        alt=""
                        className={styles["start__Icon_img"]}
                        height="10.71px"
                        width="15.02px"
                      />
                    </span>
                  </Tooltip>
                </div>

                <span className={styles["threeDot__Icon"]}>
                  {record.isFolder ? (
                    <Dropdown
                      className={`${
                        styles["options_dropdown"]
                      } ${"dataroom_options"}`}
                    >
                      <Dropdown.Toggle id="dropdown-autoclose-true">
                        <img
                          src={dot}
                          alt=""
                          width="15.02px"
                          height="10.71px"
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {optionsforFolder.map((data, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => folderOptionsSelect(data, record)}
                            >
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
                      } ${"dataroom_options"}`}
                    >
                      <Dropdown.Toggle id="dropdown-autoclose-true">
                        <img
                          src={dot}
                          alt=""
                          width="15.02px"
                          height="10.71px"
                        />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {optionsforFile.map((data, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => fileOptionsSelect(data, record)}
                            >
                              {data.label}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  )}
                </span>
              </Col>
            </Row>
          </>
        );
      },
    },
  ];

  const shareWithmeColoumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: "250px",
      sortDirections: ["descend", "ascend"],
      sorter: (a, b) => a.name.toLowerCase() < b.name.toLowerCase(),
      render: (text, record) => {
        if (record.isFolder) {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <img src={featherfolder} alt="" />
              <span
                className={styles["dataroom_table_heading"]}
                onClick={() => getFolderDocuments(record.id)}
              >
                {text} <img src={sharedIcon} alt="" />
              </span>
            </div>
          );
        } else {
          let FindExt = record.name.split(".")[1];
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              {FindExt === "png" || FindExt === "jpg" || FindExt === "jpeg" ? (
                <img src={photosIcon} alt="" />
              ) : FindExt === "docx" ||
                FindExt === "doc" ||
                FindExt === "txt" ? (
                <img src={docIcon} alt="" />
              ) : FindExt === "mp4" ? (
                <img src={videoIcon} alt="" />
              ) : FindExt === "xls" || FindExt === "xlsx" ? (
                <img src={xlsFileIcon} alt="" />
              ) : FindExt === "ppt" || FindExt === "pptx" ? (
                <img src={pptIcon} alt="" />
              ) : null}
              <span
                className={styles["dataroom_table_heading"]}
                // onClick={() => getFolderDocuments(data.id)}
              >
                {text} <img src={sharedIcon} alt="" />
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
        return (
          <span className={styles["dataroom_table_heading"]}>
            {_justShowDateformat(text)}
          </span>
        );
      },
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (Selectoptions) => {
    if (Selectoptions.value === 7) {
      setShowsubmenu(true);
    } else {
      setIsOpen(false);
      setShowsubmenu(false);
      setSearchResultFields({
        ...searchResultsFields,
        lastModifiedDate: {
          label: Selectoptions.label,
          value: Selectoptions.value,
        },
      });
    }
  };

  const handleUploadFile = async ({ file }) => {
    await dispatch(folderUploadData(null));
    dispatch(
      FileisExist(
        navigate,
        file.name,
        t,
        file,
        setProgress,
        setRemainingTime,
        remainingTime,
        setShowbarupload,
        setTasksAttachments,
        setUploadOptionsmodal,
        setUploadDocumentAgain
        // cancelToken
      )
    );
  };

  // this fun triger when upload folder triiger
  const handleChangeFolderUpload = ({ directoryName, fileList }) => {
    try {
      // this is used for prevent multi trigger
      if (directoryName !== directoryNames) {
        // this is use to set data in sate of current upload
        if (directoryName) {
          setDirectoryNames(directoryName);
        }
        if (fileList) {
          setFileLists(fileList);
        }
      }
    } catch (error) {
      // Handle errors
    }
  };

  // when state update of upload new file this use effect call
  useEffect(() => {
    // its chekrer for the directory name given from upload
    if (directoryNames !== "") {
      try {
        // this is api call fo check folder exist or not
        dispatch(CheckFolderisExist(navigate, directoryNames, t));
      } catch (error) {
        console.error("Error in checkFolderFun:", error);
        // Handle any errors that occur during the API call
      }
    } else {
    }
  }, [directoryNames, fileLists]);

  // this hooks update when check folder responce update and also its shoulde not be equal to nul
  useEffect(() => {
    // its check that reducer state is not null
    if (DataRoomReducer.FolderisExistCheck === true) {
      // its check that reducer state is true its open modal for this
      setIsFolderExist(true);
      // when modal opnen the its set reducer value null so else vlue cannot hit again if hook triiger by defult for any how
      dispatch(FolderisExist_success(null));
    } else {
      // its check that reducer state is false the its again check directory not null for current folder creation
      if (
        directoryNames !== "" &&
        DataRoomReducer.FolderisExistCheck === false
      ) {
        // iits call api for create folder
        dispatch(createFolder(navigate, t, directoryNames, 0));
      }
    }
  }, [DataRoomReducer.FolderisExistCheck]);

  // this hokks triger when folder is created and its updaet its id of anew folder
  useEffect(() => {
    // this is checker of reducer if its not on its initial state
    try {
      if (DataRoomReducer.CreatedFolderID !== 0) {
        // this is checker if its hase no file in it so dont perform any action futer other wise hot this function for upload files

        if (fileLists.length > 0) {
          try {
            // if (cancelUpload) {
            // return;
            // } else {
            processArraySequentially();
            // }
          } catch (error) {
            console.error(error);
          }
        } else {
        }
      }
    } catch (error) {
      console.error(error);
    }
  }, [DataRoomReducer.CreatedFolderID]);

  // this function call for current files which is in the folder
  const processArraySequentially = async () => {
    let newarray = [...fileLists];
    // let shouldContinue = true; // Flag to control API calls
    if (newarray.length > 0) {
      for (const file of newarray) {
        try {
          // Call your API for the current item
          const result = await dispatch(
            uploadFile(
              navigate,
              file,
              DataRoomReducer.CreatedFolderID,
              t,
              setProgress,
              setRemainingTime,
              remainingTime,
              setShowbarupload,
              setTasksAttachments,
              cancelToken
              // abortController.signal
            )
          );
          // Perform other actions with the result

          // You can wait for some time before proceeding to the next item
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
        } catch (error) {
          console.error("handleChangeFolderUpload API call error:", error);
        }
      }
    }

    setDirectoryNames("");
    dispatch(CreateFolder_success(0));
    let currentView = localStorage.getItem("setTableView");
    let viewFolderID = localStorage.getItem("folderID");
    if (viewFolderID !== null) {
      dispatch(getFolderDocumentsApi(navigate, Number(viewFolderID), t, 1));
    } else {
      dispatch(getDocumentsAndFolderApi(navigate, Number(currentView), t, 2));
    }

    // All API calls are complete, you can perform other actions here
  };
  const cancelfunc = () => {
    cancelToken.cancel("API call canceled by user");
    console.log("API call was canceled.");
  };

  const CanceApicalling = () => {
    cancelfunc();
  };
  const handleChangeLocationValue = (event) => {
    setSearchResultBoxFields({
      ...searchResultBoxFields,
      documetLocation: {
        label: event.label,
        value: event.value,
      },
    });
  };

  const handleChangeOptionsLocation = (event) => {
    setSearchResultFields({
      ...searchResultsFields,
      documentLocation: {
        label: event.label,
        value: event.value,
      },
    });
  };

  // Search Box Owner handle Change Function
  const handleChangeStatus = (event) => {
    setSearchResultBoxFields({
      ...searchResultBoxFields,
      owner: {
        label: event.label,
        value: event.value,
      },
    });
  };

  // handle Change input fields in search box
  const handleChangeInputFieldinSearchBox = (event) => {
    let { name, value } = event.target;
    if (name === "SpecificNameorEmail") {
      setSearchResultBoxFields({
        ...searchResultBoxFields,
        specifiPeople: value,
      });
    } else if (name === "Haswordsinfile") {
      setSearchResultBoxFields({
        ...searchResultBoxFields,
        haswords: value,
      });
    } else if (name === "Enterfilename") {
      setSearchResultBoxFields({
        ...searchResultBoxFields,
        itemname: value,
      });
    }
  };

  const handleChangeDocuments = (documentID) => {
    setSearchDocumentTypeValue(documentID);
    setSearchoptions(true);

    // Create a Promise to handle the mapping operation
    const mapPromise = new Promise((resolve) => {
      OptionsDocument.forEach((data, index) => {
        if (data.value === documentID) {
          setSearchResultFields({
            ...searchResultsFields,
            DocumentType: {
              value: data.value,
              label: data.label,
            },
          });
        }
        // Resolve the promise after processing all elements
        if (index === OptionsDocument.length - 1) {
          resolve();
        }
      });
    });

    // Wait for the mapping operation to complete before hiding the search bar
    mapPromise.then(() => {
      setSearchbarshow(false);
    });
  };

  // Search Box Document Type handle Change Function
  const handleChangeDocumentsOptions = (event) => {
    setSearchResultBoxFields({
      ...searchResultBoxFields,
      documentType: {
        label: event.label,
        value: event.value,
      },
    });
  };

  // Search Box Last modified Date handle Change Function
  const handleChangeLastModifedDate = (event) => {
    setSearchResultBoxFields({
      ...searchResultBoxFields,
      lastModifedDate: {
        label: event.label,
        value: event.value,
      },
    });
  };

  // Handle Search Button in Search Box Function
  const handleSearch = () => {
    setSearchbarsearchoptions(false);
    setSearchoptions(true);
    setSearchResultFields({
      ...searchResultsFields,
      lastModifiedDate: {
        value: searchResultBoxFields.lastModifedDate.value,
        label: searchResultBoxFields.lastModifedDate.label,
      },
      documentLocation: {
        value: searchResultBoxFields.documetLocation.value,
        label: searchResultBoxFields.documetLocation.label,
      },
      DocumentType: {
        value: searchResultBoxFields.documentType.value,
        label: searchResultBoxFields.documentType.label,
      },
      userPermission: {
        label: searchResultBoxFields.owner.label,
        value: searchResultBoxFields.owner.value,
      },
    });
  };

  const handleClearAllSearchOptions = () => {
    setSearchResultFields({
      ...searchResultsFields,
      lastModifiedDate: {
        value: searchResultBoxFields.lastModifedDate.value,
        label: searchResultBoxFields.lastModifedDate.label,
      },
      documentLocation: {
        value: searchResultBoxFields.documetLocation.value,
        label: searchResultBoxFields.documetLocation.label,
      },
      DocumentType: {
        value: searchResultBoxFields.documentType.value,
        label: searchResultBoxFields.documentType.label,
      },
      userPermission: {
        label: searchResultBoxFields.owner.label,
        value: searchResultBoxFields.owner.value,
      },
    });
  };

  // Handle Change User Permission in Search Result Row
  const handleChangeUserPermission = (event) => {
    setSearchResultFields({
      ...searchResultsFields,
      userPermission: {
        label: event.label,
        value: event.value,
      },
    });
  };

  // Search Box Document Type handle Change Function
  const handleChangeDocumentsinSearchResult = (event) => {
    setSearchResultFields({
      ...searchResultsFields,
      DocumentType: {
        label: event.label,
        value: event.value,
      },
    });
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

  // api call onscroll
  const handleScroll = async (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      await dispatch(dataBehaviour(true));
      if (sRowsData < totalRecords) {
        console.log(
          sRowsData,
          totalRecords,
          "totalRecordstotalRecordstotalRecords"
        );
        if (DataRoomReducer.dataBehaviour === false) {
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
                Number(filterValue)
              )
            );
          }
        }
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
      DataRoomReducer.ResponseMessage !== t("Data-available") &&
      DataRoomReducer.ResponseMessage !== t("No-record-found") &&
      DataRoomReducer.ResponseMessage !==
        t("No-folder-exist-against-this-name") &&
      DataRoomReducer.ResponseMessage !== t("No-duplicate-found")
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
      }, 4000);
      dispatch(clearDataResponseMessage());
    }
  }, [DataRoomReducer.ResponseMessage]);

  useEffect(() => {
    console.log(
      DataRoomReducer,
      "getAllDocumentandShareFolderResponsegetAllDocumentandShareFolderResponse"
    );
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
        // setGetAllData([]);
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
        // setGetAllData([]);
      }
    } catch {}
  }, [DataRoomReducer.getFolderDocumentResponse]);

  useEffect(() => {
    if (uploadReducer.uploadDocumentsList !== null) {
      let attachmentData = {
        DisplayAttachmentName:
          uploadReducer.uploadDocumentsList.displayFileName,
        OriginalAttachmentName:
          uploadReducer.uploadDocumentsList.originalFileName,
      };
      setTasksAttachments((prev) => [...prev, attachmentData]);
      // setTasksAttachments([...tasksAttachments, attachmentData]);
    }
  }, [uploadReducer.uploadDocumentsList]);
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
        <Row className="mt-3">
          <Col sm={12} md={12} lg={12}>
            <Row>
              <Col lg={2} md={2} sm={2}>
                <span className={styles["Data_room_heading"]}>
                  {t("Data-room")}
                </span>
              </Col>
              <Col
                lg={3}
                md={3}
                sm={12}
                className="d-flex justify-content-start"
              >
                <Dropdown
                  className="DataRoom_DropDown"
                  // onClick={eventClickHandler}
                  align={"start"}
                >
                  <Dropdown.Toggle title={t("New")}>
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
                  </Dropdown.Toggle>

                  <Dropdown.Menu className={styles["dropdown_menu_dataroom"]}>
                    <Dropdown.Item
                      className="dropdown-item"
                      onClick={openFolderModal}
                    >
                      <Row className="mt-2">
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
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item"
                      // onClick={handleCreateTodo}
                    >
                      <Row className="mt-1">
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
                            handleFileUploadRequest={handleUploadFile}
                            setProgress={setProgress}
                          />
                        </Col>
                      </Row>
                    </Dropdown.Item>
                    <Dropdown.Item className="dropdown-item_folder">
                      <Row className="mt-1">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=" d-flex gap-1 align-items-center"
                        >
                          <img src={plus} height="10.8" alt="" width="12px" />
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
              <Col
                lg={6}
                md={6}
                sm={6}
                className="d-flex position-relative Inputfield_for_data_room justify-content-end "
              >
                <div className="position-relative">
                  <TextField
                    value={filterVal}
                    change={handleFilter}
                    placeholder={t("Search")}
                    applyClass={"dataRoomSearchInput"}
                    labelClass="d-none"
                    onClick={searchbardropdownShow}
                    inputicon={
                      <img src={searchicon} alt="" className="cursor-pointer" />
                    }
                    clickIcon={SearchiconClickOptions}
                    iconClassName={styles["dataroom_searchinput"]}
                  />
                  {searchbarsearchoptions ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["Drop_Down_searchBar_Options"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end position-relative"
                            >
                              <Button
                                className={styles["CrossButton"]}
                                icon={
                                  <img
                                    className="cursor-pointer"
                                    src={Cross}
                                    width="10.35px"
                                    height="10.01px"
                                    alt=""
                                  />
                                }
                                onClick={SearchiconClickOptionsHide}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height"
                            >
                              <Select
                                options={OptionsDocument}
                                placeholder={t("Documents")}
                                isSearchable={false}
                                onChange={handleChangeDocumentsOptions}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height"
                            >
                              <Select
                                options={OptionsOwner}
                                placeholder={"Owner"}
                                onChange={handleChangeStatus}
                              />
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height m-0 "
                            >
                              {searchResultBoxFields.owner.value === 4 && (
                                <TextField
                                  value={searchResultBoxFields.specifiPeople}
                                  labelClass="textFieldSearch d-none"
                                  change={handleChangeInputFieldinSearchBox}
                                  name="SpecificNameorEmail"
                                  placeholder={t("Enter-name-or-email-address")}
                                />
                              )}
                            </Col>
                          </Row>
                          <Row className="mt-2 d-flex align-items-center">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className=" Inputfield_for_data_room"
                            >
                              <TextField
                                placeholder={t(
                                  "Has-the-words-found-inside-the-file"
                                )}
                                labelClass="textFieldSearch d-none"
                                name="Haswordsinfile"
                                change={handleChangeInputFieldinSearchBox}
                                value={searchResultBoxFields.haswords}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-2 Inputfield_for_data_room">
                            <Col lg={12} md={12} sm={12}>
                              <TextField
                                labelClass="textFieldSearch d-none"
                                placeholder={t(
                                  "Enter-a-team-the-matches-part-of-the-file-name"
                                )}
                                value={searchResultBoxFields.itemname}
                                name="Enterfilename"
                                change={handleChangeInputFieldinSearchBox}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height"
                            >
                              <Select
                                options={optionsLocations}
                                placeholder={t("Location-anywhere")}
                                onChange={handleChangeLocationValue}
                              />
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className="select-dropdowns-height"
                            >
                              <Select
                                options={optionsLastmodified}
                                placeholder={t("Date-modified")}
                                onChange={handleChangeLastModifedDate}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-5">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="d-flex justify-content-end gap-3"
                            >
                              <Button
                                text={t("Cancel")}
                                className={
                                  styles["cancell_Search_button_Dataroom"]
                                }
                                onClick={SearchiconClickOptionsHide}
                              />
                              <Button
                                text={t("Search")}
                                className={
                                  styles["Search_Search_button_Dataroom"]
                                }
                                onClick={handleSearch}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  <section ref={searchBarRef}>
                    {searchbarshow ? (
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className={styles["Drop_Down_searchBar"]}
                          >
                            <Row className="mt-3">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className=" d-flex gap-5 justify-content-center text-center"
                              >
                                {OptionsDocument2.map((data, index) => {
                                  return (
                                    <>
                                      <span
                                        key={index}
                                        onClick={() =>
                                          handleChangeDocuments(data.value)
                                        }
                                        className="cursor-pointer"
                                      >
                                        <img
                                          src={data.imgSrc}
                                          height="19.25px"
                                          alt=""
                                          width="16.85px"
                                        />
                                        <span
                                          className={styles["DropDown_name"]}
                                        >
                                          {data.label}
                                        </span>
                                      </span>
                                    </>
                                  );
                                })}
                              </Col>
                            </Row>
                            <Row className="mt-4">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["Show_more_options"]}
                              >
                                <Row>
                                  <Col
                                    lg={12}
                                    md={12}
                                    sm={12}
                                    className="d-flex align-items-center mt-2"
                                  >
                                    <span
                                      className={
                                        styles["Search_option_text_span"]
                                      }
                                      onClick={showSearchResultsOptions}
                                    >
                                      {t("Show-search-options")}
                                    </span>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </>
                    ) : null}
                  </section>
                </div>
              </Col>
              <Col
                lg={1}
                md={1}
                sm={12}
                className="d-flex justify-content-center"
              >
                <span className={styles["lsit_grid_buttons"]}>
                  <Button
                    icon={
                      <img
                        src={gridbtnactive ? Grid_Selected : Grid_Not_Selected}
                        height="25.27px"
                        width="25.27px"
                        alt=""
                        className={styles["grid_view_Icon"]}
                      />
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
                      <img
                        src={listviewactive ? List_Selected : List_Not_selected}
                        height="25.27px"
                        width="25.27px"
                        alt=""
                        className={styles["list_view_Icon"]}
                      />
                    }
                    className={
                      listviewactive
                        ? `${styles["List_view_btn_active"]}`
                        : `${styles["List_view_btn"]}`
                    }
                    onClick={handlelistview}
                  />
                </span>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col lg={12} md={12} sm={12}>
                <Paper className={styles["Data_room_paper"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                      <Button
                        text={t("All")}
                        className={
                          currentView === 3
                            ? `${styles["allDocuments_btn_active"]}`
                            : `${styles["allDocuments_btn"]}`
                        }
                        // onClick={showUploadOptionsModal}
                        onClick={AllDocuments}
                      />
                      <Button
                        text={t("My-document")}
                        className={
                          currentView === 1
                            ? `${styles["myDocument_btn_active"]}`
                            : `${styles["myDocument_btn"]}`
                        }
                        // onClick={showUploadOptionsModal}
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
                    </Col>
                  </Row>
                  {searchoptions ? (
                    <>
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Search_result_Heading"]}>
                            {t("Search-results")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={7} md={7} sm={12}>
                          <Row>
                            <Col
                              lg={3}
                              md={3}
                              sm={12}
                              className="select-dropdowns-height-DataRoom"
                            >
                              {searchResultsFields.DocumentType.value !== 0 ? (
                                <div
                                  className={styles["dropdown__Document_Value"]}
                                >
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CheckIconDropdown}
                                  />
                                  <p className={styles["overflow-text"]}>
                                    {searchResultsFields.DocumentType.label}
                                  </p>
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CrossIconDropdown}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSearchResultFields({
                                        ...searchResultsFields,
                                        DocumentType: {
                                          label: "",
                                          value: 0,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              ) : (
                                <Select
                                  classNamePrefix={"searchResult_Document"}
                                  options={OptionsDocument}
                                  placeholder={t("Documents")}
                                  isSearchable={false}
                                  onChange={handleChangeDocumentsinSearchResult}
                                  // defaultValue={{
                                  //   value: searchResultsFields.DocumentType.value,
                                  //   label: searchResultsFields.DocumentType.label
                                  // }}
                                />
                              )}
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              {searchResultsFields.documentLocation.value !==
                              0 ? (
                                <div
                                  className={styles["dropdown__Document_Value"]}
                                >
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CheckIconDropdown}
                                  />
                                  <p className={styles["overflow-text"]}>
                                    {searchResultsFields.documentLocation.label}
                                  </p>
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CrossIconDropdown}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSearchResultFields({
                                        ...searchResultsFields,
                                        documentLocation: {
                                          label: "",
                                          value: 0,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              ) : (
                                <Select
                                  classNamePrefix={"searchResult_Document"}
                                  options={optionsLocations}
                                  placeholder={t("Location")}
                                  isSearchable={false}
                                  onChange={handleChangeOptionsLocation}
                                  // value={{
                                  //   value: searchResultsFields.documentLocation.value,
                                  //   label: searchResultsFields.documentLocation.label
                                  // }}
                                />
                              )}
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              {searchResultsFields.userPermission.value !==
                              0 ? (
                                <div
                                  className={styles["dropdown__Document_Value"]}
                                >
                                  <img
                                    width="12px"
                                    alt=""
                                    height="12px"
                                    src={CheckIconDropdown}
                                  />
                                  <p className={styles["overflow-text"]}>
                                    {searchResultsFields.userPermission.label}
                                  </p>
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CrossIconDropdown}
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSearchResultFields({
                                        ...searchResultsFields,
                                        userPermission: {
                                          label: "",
                                          value: 0,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              ) : (
                                <Select
                                  options={OptionsOwner}
                                  placeholder={t("People")}
                                  classNamePrefix={"searchResult_Document"}
                                  onChange={handleChangeUserPermission}
                                  isSearchable={false}
                                  // value={{
                                  //   label: searchResultsFields.userPermission.label,
                                  //   value: searchResultsFields.userPermission.value
                                  // }}
                                />
                              )}
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom position-relative"
                            >
                              {searchResultsFields.lastModifiedDate.value !==
                              0 ? (
                                <div
                                  className={styles["dropdown__Document_Value"]}
                                >
                                  <img
                                    width="12px"
                                    height="12px"
                                    alt=""
                                    src={CheckIconDropdown}
                                  />
                                  <p className={styles["overflow-text"]}>
                                    {" "}
                                    {searchResultsFields.lastModifiedDate.label}
                                  </p>
                                  <img
                                    width="12px"
                                    height="12px"
                                    src={CrossIconDropdown}
                                    alt=""
                                    className="cursor-pointer"
                                    onClick={() => {
                                      setSearchResultFields({
                                        ...searchResultsFields,
                                        lastModifiedDate: {
                                          label: "",
                                          value: 0,
                                        },
                                      });
                                    }}
                                  />
                                </div>
                              ) : (
                                <Select
                                  options={optionsLastmodified}
                                  classNamePrefix={"searchResult_Document"}
                                  placeholder={
                                    <span
                                      className={styles["placeholder-text"]}
                                    >
                                      {t("Last-modified")}
                                    </span>
                                  }
                                  onChange={handleChange}
                                  isSearchable={false}
                                  // value={{
                                  //   value: searchResultsFields.lastModifiedDate.value,
                                  //   label: searchResultsFields.lastModifiedDate.label
                                  // }}
                                />
                              )}
                              {showsubmenu && (
                                <ShowBeforeAfterDate
                                  showsubmenu={showsubmenu}
                                  setShowsubmenu={setShowsubmenu}
                                />
                              )}
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          lg={5}
                          md={5}
                          sm={12}
                          className="d-flex justify-content-start align-items-center"
                        >
                          <span
                            className={styles["Clear_All_btn"]}
                            onClick={handleClearAllSearchOptions}
                            // onClick={CleatingSearchOptions}
                          >
                            {t("Clear-all")}
                          </span>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {currentView === 2 ? (
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
                                optionsforFolder={optionsforFolder}
                                optionsforFile={optionsforFile}
                                sRowsData={sRowsData}
                                totalRecords={totalRecords}
                                filter_Value={filterValue}
                              />
                            </>
                          ) : getAllData.length > 0 &&
                            getAllData !== undefined &&
                            getAllData !== null &&
                            listviewactive === true ? (
                            <>
                              <section
                                style={{
                                  height: 380,
                                  overflowY: "scroll",
                                  overflowX: "hidden",
                                }}
                                onScroll={handleScroll}
                              >
                                <TableToDo
                                  sortDirections={["descend", "ascend"]}
                                  column={shareWithmeColoumns}
                                  className={"DataRoom_Table"}
                                  size={"small"}
                                  onChange={handleSortChange}
                                  rows={getAllData}
                                  pagination={false}
                                />
                                {DataRoomReducer.TableSpinner && (
                                  <Row>
                                    <Col
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      className="d-flex justify-content-center align-items-center my-4"
                                    >
                                      <Spin indicator={antIcon} />
                                    </Col>
                                  </Row>
                                )}
                              </section>
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
                                  <img src={EmptyStateSharewithme} alt="" />
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
                                    className={styles["Messege_nofiles_shared"]}
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
                                    className={styles["Messege_nofiles_shared"]}
                                  >
                                    {t("With-you")}
                                  </span>
                                </Col>
                              </Row>
                            </>
                          )}
                          {DataRoomReducer.TableSpinner && (
                            <Row>
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className="d-flex justify-content-center align-items-center my-4"
                              >
                                <Spin indicator={antIcon} />
                              </Col>
                            </Row>
                          )}
                        </Col>
                      </Row>
                    </>
                  ) : (
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
                                optionsforFolder={optionsforFolder}
                                optionsforFile={optionsforFile}
                                sRowsData={sRowsData}
                                totalRecords={totalRecords}
                                filter_Value={filterValue}
                              />
                            </>
                          ) : getAllData.length > 0 &&
                            getAllData !== undefined &&
                            getAllData !== null &&
                            listviewactive === true ? (
                            <>
                              <section
                                style={{
                                  height: 380,
                                  overflowY: "scroll",
                                  overflowX: "hidden",
                                }}
                                onScroll={handleScroll}
                              >
                                <TableToDo
                                  sortDirections={["descend", "ascend"]}
                                  column={MyDocumentsColumns}
                                  className={"DataRoom_Table"}
                                  rows={getAllData}
                                  pagination={false}
                                  onChange={handleSortMyDocuments}
                                  // rowSelection={rowSelection}
                                  size={"middle"}
                                />
                                {DataRoomReducer.TableSpinner && (
                                  <Row>
                                    <Col
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      className="d-flex justify-content-center align-items-center my-4"
                                    >
                                      <Spin indicator={antIcon} />
                                    </Col>
                                  </Row>
                                )}
                              </section>
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
                                  <span className={styles["Messege_nofiles"]}>
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
                                  <span className={styles["Tag_line_nofiles"]}>
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
                                    className={styles["DragDropIconDataRoom"]}
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
                            </>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      {showbarupload ? (
        DataRoomReducer.folderUploadData !== null ? (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={
                  collapes
                    ? styles["Back_ground_For_uploader_active"]
                    : styles["Back_ground_For_uploader_folder"]
                }
              >
                <Row>
                  <Col lg={12} md={12} sm={12} className={styles["Blue_Strip"]}>
                    <Row className="mt-2">
                      <Col
                        lg={9}
                        md={9}
                        sm={9}
                        className="d-flex justify-content-start gap-3"
                      >
                        <span className={styles["Uploading"]}>
                          {`${t("Uploading")} ${
                            Object.keys(tasksAttachments).length
                          } ${t("items")}`}
                          {/* {} */}
                          {/* {Object.keys(tasksAttachments).length} {} */}
                        </span>
                        <Space className={styles["Progress_bar"]}>
                          {parseInt(progress) + "%"}
                        </Space>
                        <Space className={styles["Progress_bar"]}>
                          {remainingTime + t("Sec-remaining")}
                        </Space>
                      </Col>

                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="d-flex justify-content-end gap-2 mt-1"
                      >
                        {collapes ? (
                          <img
                            src={chevronUp}
                            width={9}
                            alt=""
                            className="cursor-pointer"
                            onClick={() => setCollapes(false)}
                          />
                        ) : (
                          <img
                            src={chevdown}
                            alt=""
                            width={9}
                            className="cursor-pointer"
                            onClick={() => setCollapes(true)}
                          />
                        )}

                        <img
                          src={Cancellicon}
                          width={9}
                          alt=""
                          className="cursor-pointer"
                          onClick={closeSearchBar}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_bar_of_BarUploder_folder"]}
                  >
                    <Col sm={12} md={12} lg={12} className="">
                      <Row>
                        <Col
                          sm={9}
                          md={9}
                          lg={9}
                          className="d-flex align-items-center gap-3"
                        >
                          <img src={featherfolder} width={20} alt="" />
                          <span>
                            {" "}
                            {DataRoomReducer.folderUploadData.displayFolderName}
                          </span>
                          <span>
                            {`${
                              Object.keys(tasksAttachments).length
                            }  ${"Of"}  ${fileLists.length}  `}{" "}
                          </span>
                        </Col>
                        <Col
                          sm={3}
                          md={3}
                          lg={3}
                          className={styles["progress_bar"]}
                        >
                          <CircularProgressbar
                            value={Object.keys(tasksAttachments).length}
                            maxValue={fileLists.length}
                            // text={`${percentage}%`}
                            className={styles["folderProgress"]}
                            // value={progress}
                          />
                          {/* <Progress
                            type="circle"
                            className={styles["folderProgress"]}
                            percent={progress}
                            width={20}
                            showInfo={false}
                            size={20}
                          /> */}
                          <img
                            src={CrossIcon}
                            alt=""
                            onClick={CanceApicalling}
                            className={styles["crossIcon"]}
                          />
                          {/* <XCircleFill
                            onClick={() => CanceApicalling()}
                            className={styles["crossIcon"]}
                            size={20}
                          /> */}
                        </Col>
                      </Row>
                    </Col>
                    {/* {Object.values(tasksAttachments).length > 0
                      ? Object.values(tasksAttachments).map((data, index) => {
                          return (
                            <>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                key={index}
                                className="d-flex gap-1 mt-2 flex-column mb-3"
                              >
                                <Space
                                  direction="vertical"
                                  className="d-flex flex-row"
                                >
                                  <img
                                    src={PDFICON}
                                    height="16px"
                                    alt=""
                                    width="16px"
                                    className={styles["Icon_in_Bar"]}
                                  />
                                  <span
                                    className={styles["name_of_life_in_Bar"]}
                                  >
                                    {data.name}
                                  </span>
                                </Space>
                                {progress > 0 && (
                                  <Progress percent={progress} />
                                )}
                              </Col>
                            </>
                          );
                        })
                      : null} */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={
                  collapes
                    ? styles["Back_ground_For_uploader_active"]
                    : styles["Back_ground_For_uploader"]
                }
              >
                <Row>
                  <Col lg={12} md={12} sm={12} className={styles["Blue_Strip"]}>
                    <Row className="mt-2">
                      <Col
                        lg={9}
                        md={9}
                        sm={9}
                        className="d-flex justify-content-start gap-3"
                      >
                        <span className={styles["Uploading"]}>
                          {t("Uploading")}{" "}
                          {Object.keys(tasksAttachments).length} {t("items")}
                        </span>
                        <Space className={styles["Progress_bar"]}>
                          {parseInt(progress) + "%"}
                        </Space>
                        <Space className={styles["Progress_bar"]}>
                          {remainingTime + t("Sec-remaining")}
                        </Space>
                      </Col>

                      <Col
                        lg={3}
                        md={3}
                        sm={3}
                        className="d-flex justify-content-end gap-2 mt-1"
                      >
                        {collapes ? (
                          <img
                            src={chevronUp}
                            width={9}
                            alt=""
                            className="cursor-pointer"
                            onClick={() => setCollapes(false)}
                          />
                        ) : (
                          <img
                            src={chevdown}
                            alt=""
                            width={9}
                            className="cursor-pointer"
                            onClick={() => setCollapes(true)}
                          />
                        )}

                        <img
                          src={Cancellicon}
                          width={9}
                          alt=""
                          className="cursor-pointer"
                          onClick={closeSearchBar}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_bar_of_BarUploder"]}
                  >
                    {Object.values(tasksAttachments).length > 0
                      ? Object.values(tasksAttachments).map((data, index) => {
                          return (
                            <>
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                key={index}
                                className="d-flex gap-1 mt-2 flex-column mb-3"
                              >
                                <Space
                                  direction="vertical"
                                  className="d-flex flex-row"
                                >
                                  <img
                                    src={PDFICON}
                                    height="16px"
                                    alt=""
                                    width="16px"
                                    className={styles["Icon_in_Bar"]}
                                  />
                                  <span
                                    className={styles["name_of_life_in_Bar"]}
                                  >
                                    {data.name}
                                  </span>
                                </Space>
                                {progress > 0 && (
                                  <Progress percent={progress} />
                                )}
                              </Col>
                            </>
                          );
                        })
                      : null}
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        )
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
          UploadOptions={uploadOptionsmodal}
          setUploadOptions={setUploadOptionsmodal}
          uploadDocumentfile={uploadDocumentAgain}
          setProgress={setProgress}
          setRemainingTime={setRemainingTime}
          remainingTime={remainingTime}
          setShowbarupload={setShowbarupload}
          setTasksAttachments={setTasksAttachments}
          // uploadOptionsonClickBtn={handleUploadDocuemtuploadOptions}
        />
      ) : null}
      {canceluploadmodal ? (
        <ModalCancelUpload
          cancellupload={canceluploadmodal}
          setcancellupload={setCanceluploadmodal}
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
      {showcanceldownload ? (
        <ModalCancelDownload
          cancelDownload={showcanceldownload}
          setCancelDownload={setShowcanceldownload}
        />
      ) : null}
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
      {isFolderExist && (
        <ModalOptionsisExistFolder
          directoryNames={directoryNames}
          setIsFolderExist={setIsFolderExist}
          isFolderExist={isFolderExist}
        />
      )}
      {showrenameFile && (
        <ModalRenameFile
          isRenameFileData={isRenameFileData}
          showrenameFile={showrenameFile}
          setShowRenameFile={setShowRenameFile}
        />
      )}
      {DataRoomReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      {/* <Loader /> */}
      <Notification open={open.open} message={open.message} setOpen={setOpen} />
    </>
  );
};
export default DataRoom;
