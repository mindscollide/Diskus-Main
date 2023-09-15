import React, { useEffect, useRef } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Progress, Space, Spin, Tooltip } from "antd";
import "react-circular-progressbar/dist/styles.css";
import Cancellicon from "../../assets/images/cross_dataroom.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/Icon material-delete.svg";
import dot from "../../assets/images/Group 2898.svg";
import DrapDropIcon from "../../assets/images/DrapDropIcon.svg";
import EmptyStateSharewithme from "../../assets/images/SharewithmeEmptyIcon.svg";
import { Plus, XCircleFill } from "react-bootstrap-icons";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
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
  deleteFileDataroom,
  deleteFolder,
  FileisExist,
  getDocumentsAndFolderApi,
  getDocumentsAndFolderApiScrollbehaviour,
  getFolderDocumentsApi,
  isFolder,
  uploadDocumentsApi,
} from "../../store/actions/DataRoom_actions";
import sharedIcon from "../../assets/images/shared_icon.svg";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import { _justShowDateformat } from "../../commen/functions/date_formater";
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import { useNavigate } from "react-router-dom";
import DeleteNotificationBox from "./DeleteNotification/deleteNotification";
import FileRemoveBox from "./FileRemoved/FileRemoveBox";
import ShowRenameNotification from "./ShowRenameNotification/ShowRenameNotification";
import ActionUndoNotification from "./ActionUndoNotification/ActionUndoNotification";
import ModalShareDocument from "./ModalSharedocument/ModalShareDocument";
import {
  CheckFolderisExist,
  CreateFolder_success,
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
  optionsforFolder,
} from "./SearchFunctionality/option";
const DataRoom = () => {
  // tooltip
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showbarupload, setShowbarupload] = useState(false);
  const [progress, setProgress] = useState(0);
  const [inviteModal, setInviteModal] = useState(false);
  const [optionsFileisShown, setOptionsFileisShown] = useState(false);
  const [optionsFolderisShown, setOptionsFolderisShown] = useState(false);
  const { uploadReducer, DataRoomReducer, LanguageReducer } = useSelector(
    (state) => state
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
  const [gridbtnactive, setGridbtnactive] = useState(false);
  const [listviewactive, setListviewactive] = useState(true);
  const [actionundonenotification, setActionundonenotification] =
    useState(false);
  const [collapes, setCollapes] = useState(false);
  const [sharehoverstyle, setSharehoverstyle] = useState(false);
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  // const [tasksAttachments, setTasksAttachments] = useState([]);
  const [deltehoverstyle, setDeltehoverstyle] = useState(false);
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  const [showcanceldownload, setShowcanceldownload] = useState(false);
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
  const [remainingTime, setRemainingTime] = useState(0);
  const [data, setData] = useState([]);
  const [filesSend, setFilesSend] = useState([]);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [filterVal, setFilterVal] = useState("");
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

  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  const [searchDataFields, setSearchDataFields] = useState({
    UserID: userID ? parseInt(userID) : 0,
    OrganizationID: organizationID ? parseInt(organizationID) : organizationID,
    StatusID: 0,
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
    isOwnedByMe: false,
    isNotOwnedByMe: false,
    isSpecificUser: false,
    sRow: 0,
    Length: 50,
    SortBy: 0,
    isDescending: false,
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
    if (!isOnline) {
      // CanceUpload();
    }
  }, [isOnline]);

  const ClosingNotificationRenameFolder = () => {
    setShowrenamenotification(false);
  };

  const showRequestingAccessModal = () => {
    setRequestingAccess(true);
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

  const openFolderModal = () => {
    setFolderModal(true);
  };

  const getFolderDocuments = (folderid) => {
    localStorage.setItem("folderID", folderid);
    dispatch(getFolderDocumentsApi(navigate, folderid, t));
  };

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
                <img src={folderColor} alt="" />
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
            return (
              <>
                <section className="d-flex gap-2">
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                    width={"25px"}
                    height={"25px"}
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
                <img src={folderColor} alt="" />
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
            return (
              <>
                <section className="d-flex gap-2">
                  <img
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                    width={"25px"}
                    height={"25px"}
                  />
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
                        {optionsforFolder(t).map((data, index) => {
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
                        {optionsforFile(t).map((data, index) => {
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
      render: (text, record) => {
        if (record.isFolder) {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <img src={folderColor} alt="" />
              <span
                className={styles["dataroom_table_heading"]}
                onClick={() => getFolderDocuments(record.id)}
              >
                {text} <img src={sharedIcon} alt="" />
              </span>
            </div>
          );
        } else {
          return (
            <div className={`${styles["dataFolderRow"]}`}>
              <img
                src={getIconSource(getFileExtension(record.name))}
                alt=""
                width={"25px"}
                height={"25px"}
              />
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
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [tasksAttachmentsID, setTasksAttachmentsID] = useState(0);

  // this is file Upload
  const handleUploadFile = async ({ file }) => {
    const taskId = Math.floor(Math.random() * 1000000);
    let newJsonCreateFile = {
      TaskId: taskId,
      FileName: "",
      File: {},
      Uploaded: false,
      Uploading: false,
      UploadCancel: false,
      Progress: 0,
      UploadingError: false,
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
  console.log("handleUploadFile", tasksAttachments);

  // this is for file check
  useEffect(() => {
    // its check that reducer state is not null
    if (DataRoomReducer.isFileExsist === true) {
      setUploadOptionsmodal(true);
    } else {
      // if (uploadOptionsmodal) {
      //   setUploadOptionsmodal(false);
      //   if (
      //     Object.keys(detaUplodingForFOlder).length > 0 &&
      //     DataRoomReducer.isFileExsist === null
      //   ) {
      //     console.log("handleUploadFile", tasksAttachments);
      //     dispatch(
      //       uploadDocumentsApi(
      //         navigate,
      //         t,
      //         tasksAttachments,
      //         tasksAttachments.TaskId,
      //         setTasksAttachments,
      //         tasksAttachments,
      //         fileUploadOptions
      //       )
      //     );
      //     setFileUploadOptions(1);
      //     // its call api for create folder
      //   }
      // }
    }
  }, [DataRoomReducer.isFileExsist]);

  // cancel file upload
  const cancelFileUpload = (data) => {
    console.log("cancelFileUpload", data);
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
    // Optionally, you can also cancel the Axios request associated with this task here.
  };
  // this fun triger when upload folder triiger
  const handleChangeFolderUpload = ({ directoryName, fileList }) => {
    try {
      console.log("handleChangeFolderUpload");
      let newJsonCreate = {
        FolderName: "",
        FolderID: 0,
        FileList: [],
        Uploaded: false,
        Uploading: false,
        UploadCancel: false,
        UploadedAttachments: 0,
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
        console.log("handleChangeFolderUpload");
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
    if (folder.UploadCancel) {
      // Skip the upload for this folder if it's canceled
      return;
    }
    try {
      // let shouldContinue = true; // Flag to control API calls
      if (folder.FileList.length > 0) {
        for (const file of folder.FileList) {
          try {
            if (folder.Uploaded === false && folder.UploadCancel === false) {
              const result = await dispatch(
                uploadFile(navigate, file, folder.FolderID, t)
              );
              // Perform other actions with the result
              folder.UploadedAttachments = folder.UploadedAttachments + 1; // Update the count
              setDetaUplodingForFOlder((prevFolders) => [...prevFolders]); // Update state

              // You can wait for some time before proceeding to the next item
              await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second
            }
            // Call your API for the current item
          } catch (error) {
            console.error("handleChangeFolderUpload API call error:", error);
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
  console.log("handleChangeFolderUploadexistingIndex", detaUplodingForFOlder);

  // this hokks triger when folder is created and its updaet its id of anew folder
  useEffect(() => {
    // this is checker of reducer if its not on its initial state
    try {
      if (DataRoomReducer.CreatedFoldersArray.length > 0) {
        // const currentIndexForReplaceName = DataRoomReducer.CreatedFoldersArray.findIndex(
        //   (folder) =>
        //     folder.DisplayFolderNameOLD === directoryNames);
        const existingIndex = detaUplodingForFOlder.findIndex(
          (folder) =>
            folder.FolderName === directoryNames &&
            folder.Uploading === false &&
            folder.FolderID === 0
        );
        // const existingIndex = Object.keys(detaUplodingForFOlder).length - 1;
        console.log("handleChangeFolderUploadexistingIndex", existingIndex);

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
            console.log("handleChangeFolderUploadexistingIndex", updatedFolder);

            // Update the last object's FolderID with dynamicData
            detaUplodingForFOlder[existingIndex] = updatedFolder;
            console.log(
              "handleChangeFolderUploadexistingIndex",
              detaUplodingForFOlder
            );

            // this is checker if its hase no file in it so dont perform any action futer other wise hot this function for upload files
            if (detaUplodingForFOlder[existingIndex].FileList.length > 0) {
              try {
                console.log("handleChangeFolderUpload");

                let currentView = localStorage.getItem("setTableView");
                let viewFolderID = localStorage.getItem("folderID");
                if (viewFolderID !== null) {
                  dispatch(
                    getFolderDocumentsApi(navigate, Number(viewFolderID), t, 1)
                  );
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
                console.log(
                  "handleChangeFolderUploadexistingIndex",
                  detaUplodingForFOlder[existingIndex]
                );

                processArraySequentially(detaUplodingForFOlder[existingIndex]);
                console.log("handleChangeFolderUpload");
              } catch (error) {
                console.error(error);
              }
            } else {
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
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
      dispatch(CreateFolder_success([]));
    }
  };

  const CanceUploadinFromModalTrue = () => {
    setDetaUplodingForFOlder([]);
    setTasksAttachments([]);
    setShowbarupload(false);
    dispatch(CreateFolder_success([]));
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
            Number(filterValue)
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

  // useEffect(() => {
  //   if (
  //     DataRoomReducer.ResponseMessage !== "" &&
  //     DataRoomReducer.ResponseMessage !== t("Data-available") &&
  //     DataRoomReducer.ResponseMessage !== t("No-record-found") &&
  //     DataRoomReducer.ResponseMessage !==
  //       t("No-folder-exist-against-this-name") &&
  //     DataRoomReducer.ResponseMessage !== t("No-duplicate-found")
  //   ) {
  //     setOpen({
  //       open: true,
  //       message: DataRoomReducer.ResponseMessage,
  //     });
  //     setTimeout(() => {
  //       setOpen({
  //         open: false,
  //         message: "",
  //       });
  //     }, 4000);
  //     dispatch(clearDataResponseMessage());
  //   }
  // }, [DataRoomReducer.ResponseMessage]);

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
                <SearchBarComponent
                  setSearchDataFields={setSearchDataFields}
                  searchDataFields={searchDataFields}
                  setSearchTabOpen={setSearchTabOpen}
                  searchTabOpen={searchTabOpen}
                  setSearchbarshow={setSearchbarshow}
                  searchbarshow={searchbarshow}
                />
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
                  {searchTabOpen ? (
                    <SearchComponent
                      setSearchDataFields={setSearchDataFields}
                      searchDataFields={searchDataFields}
                      getFolderDocuments={getFolderDocuments}
                      gridbtnactive={gridbtnactive}
                      listviewactive={listviewactive}
                    />
                  ) : (
                    <>
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
                            // onClick={showCancellUploadModal}
                            onClick={SharewithmeButonShow}
                          />
                        </Col>
                      </Row>
                      {currentView === 2 ? (
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
                                    height={"57vh"}
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
                                      optionsforFolder={optionsforFolder(t)}
                                      optionsforFile={optionsforFile(t)}
                                      sRowsData={sRowsData}
                                      totalRecords={totalRecords}
                                      filter_Value={filterValue}
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
                                    height={"57vh"}
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
                                    <TableToDo
                                      sortDirections={["descend", "ascend"]}
                                      column={shareWithmeColoumns}
                                      className={"DataRoom_Table"}
                                      size={"small"}
                                      onChange={handleSortChange}
                                      rows={getAllData}
                                      pagination={false}
                                    />
                                  </InfiniteScroll>
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
                                </>
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
                                      optionsforFolder={optionsforFolder(t)}
                                      optionsforFile={optionsforFile(t)}
                                      sRowsData={sRowsData}
                                      totalRecords={totalRecords}
                                      filter_Value={filterValue}
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
                                  endMessage=""
                                  loader={
                                    getAllData.length <= totalRecords && (
                                      <>
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
                                      </>
                                    )
                                  }
                                  scrollableTarget="scrollableDiv"
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
                                </InfiniteScroll>
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
      {DataRoomReducer.Loading || LanguageReducer.Loading ? <Loader /> : null}
      {/* <Notification open={open.open} message={open.message} setOpen={setOpen} /> */}
    </>
  );
};
export default DataRoom;
