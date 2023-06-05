import React, { useEffect } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Progress, Space, Tooltip } from "antd";
import Cancellicon from "../../assets/images/x-lg.svg";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import images from "../../assets/images/Imagesandphotos.svg";
import { useDispatch, useSelector } from "react-redux";
import line from "../../assets/images/Path 1810.svg";
import { useTranslation } from "react-i18next";
import rightdirection from "../../assets/images/Path 1691.svg";
import searchicon from "../../assets/images/searchicon.svg";
import audioIcon from "../../assets/images/audioICon.svg";
import person from "../../assets/images/add_new.svg";
import addone from "../../assets/images/addone.svg";
import cross from "../../assets/images/Group 71.png";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/Icon material-delete.svg";
import dot from "../../assets/images/Group 2898.svg";
import ShareIcon from "../../assets/images/ShareIcon.svg";
import add from "../../assets/images/Icon material-group-add.svg";
import Cross from "../../assets/images/cuticon.svg";
import deleterednew from "../../assets/images/delete red new.svg";
import sitesIcon from "../../assets/images/sitesIcon.svg";
import DrapDropIcon from "../../assets/images/DrapDropIcon.svg";
import EmptyStateSharewithme from "../../assets/images/SharewithmeEmptyIcon.svg";
import { ChevronDown, Plus } from "react-bootstrap-icons";
import chevdown from "../../assets/images/chevron-down.svg";
import document from "../../assets/images/color document.svg";
import pdf from "../../assets/images/color pdf.svg";
import rightIcon from "../../assets/images/chevron-right (1).svg";
import video from "../../assets/images/color video.svg";
import spreadsheet from "../../assets/images/color spreadsheet.svg";
import Grid_Not_Selected from "../../assets/images/resolutions/Grid_Not_Selected.svg";
import Grid_Selected from "../../assets/images/resolutions/Grid_Selected.svg";
import List_Not_selected from "../../assets/images/resolutions/List_Not_selected.svg";
import List_Selected from "../../assets/images/resolutions/List_Selected.svg";
import forms from "../../assets/images/color forms.svg";
import start from "../../assets/images/Icon feather-star.svg";
import Select from "react-select";
import profile from "../../assets/images/Userprofile-1.png";
import folderColor from "../../assets/images/folder_color.svg";
import plus from "../../assets/images/Icon feather-folder.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import PDFICON from "../../assets/images/pdf_icon.svg";
import { Paper } from "@material-ui/core";
import styles from "./DataRoom.module.css";

import {
  Button,
  TextField,
  TableToDo,
  SelectBox,
  Loader,
  Notification,
  Checkbox,
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
import {
  clearDataResponseMessage,
  deleteFileDataroom,
  deleteFolder,
  FileisExist,
  getDocumentsAndFolderApi,
  getFolderDocumentsApi,
  getSharedFilesandFolderApi,
  uploadDocumentsApi,
} from "../../store/actions/DataRoom_actions";
import sharedIcon from "../../assets/images/shared_icon.svg";
import UploadDataFolder from "../../components/elements/Dragger/UploadFolder";
import { _justShowDateformat } from "../../commen/functions/date_formater";
import CustomCheckbox from "../../components/elements/check_box/Checkbox";
import FileIcon, { defaultStyles } from "react-file-icon";
import GridViewDataRoom from "./GridViewDataRoom/GridViewDataRoom";
import { useNavigate } from "react-router-dom";
import { Data } from "emoji-mart";
const DataRoom = () => {
  // tooltip
  const [showbarupload, setShowbarupload] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [progress, setProgress] = useState(0);
  const text = <span>Share</span>;
  const Deltooltip = <span>Delete</span>;
  const eventClickHandler = () => { };
  const { t } = useTranslation();
  const { uploadReducer, DataRoomReducer } = useSelector((state) => state);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [shareFileModal, setShareFileModal] = useState(false);
  const [foldermodal, setFolderModal] = useState(false);
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  const [canceluploadmodal, setCanceluploadmodal] = useState(false);
  const [sharemebtn, setSharemebtn] = useState(false);
  const [searchbarshow, setSearchbarshow] = useState(false);
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [searchoptions, setSearchoptions] = useState(false);
  const [gridbtnactive, setGridbtnactive] = useState(false);
  const [listviewactive, setListviewactive] = useState(true);
  const [optionsthreedoticon, setOptionsthreedoticon] = useState(false);
  const [actionundonenotification, setActionundonenotification] =
    useState(false);
  const [sharehoverstyle, setSharehoverstyle] = useState(false);
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  const [mydocumentbtnactive, setMydocumentbtnactive] = useState(false);
  const [alldocumentAcitve, setAllDocumentActive] = useState(false)
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [deltehoverstyle, setDeltehoverstyle] = useState(false);
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  const [showcanceldownload, setShowcanceldownload] = useState(false);
  const [customrangemoreoptions, setCustomerangemoreoptions] = useState(false);
  const [showrenamenotification, setShowrenamenotification] = useState(false);
  const [showrenamemodal, setShowreanmemodal] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [fileremoved, setFileremoved] = useState(false);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [deletenotification, setDeletenotification] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [data, setData] = useState([]);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [filterVal, setFilterVal] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [folderID, setFolderID] = useState([]);
  const [rows, setRow] = useState([]);
  const [getAllData, setGetAllData] = useState([]);
  const [showsubmenu, setShowsubmenu] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDocumentsId, setDocumentId] = useState(0)
  const [searchDocumentTypeValue, setSearchDocumentTypeValue] = useState(0);
  const [searchDocumentType, setSearchDocumentType] = useState({
    label: "",
    value: 0
  })
  const [locationValue, setLocationValue] = useState({
    label: "",
    value: 0
  })
  console.log(searchDocumentType, "searchDocumentTypeValuesearchDocumentTypeValuesearchDocumentTypeValue")
  const [searchModalOptions, setSearchModalOptions] = useState({
    Location: "",
    DateModified: "",
    ItemName: "",
    OwnerType: "",
    LocationValue: "",
    OwnerTypeValue: "",
    EnterMember: "",
  });
  console.log(showbarupload, "showbaruploadshowbaruploadshowbarupload")


  const [open, setOpen] = useState({
    open: false,
    message: "",
  });
  const showCustomerangetOptions = () => {
    setCustomerangemoreoptions(!customrangemoreoptions);
  };

  const ClosingNotificationRenameFolder = () => {
    setShowrenamenotification(false);
  };
  const OpenRenameFolderModal = () => {
    setShowreanmemodal(true);
  };
  const OpenCancelDownloadModal = () => {
    setShowcanceldownload(true);
  };

  const OpenthreeDotDropdown = () => {
    setOptionsthreedoticon(!optionsthreedoticon);
  };

  const openFileremovedNotification = () => {
    setFileremoved(true);
  };

  const closeSearchBar = () => {
    setShowbarupload(false);
    setTasksAttachments([]);
  };

  const MinimizeOption = () => {
    setMinimize(true);
  };

  const deleteafterhover = () => {
    setDeltehoverstyle(true);
    setSharehoverstyle(false);
    setDeletenotification(true);
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
              <img src={document} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Document")}
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
              <img src={spreadsheet} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Spreadsheets")}
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
              <img src={video} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Presentaion")}
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
              <img src={forms} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Forms")}
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
              <img src={images} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Photos")}
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
              <img src={pdf} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("PDFs")}
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
              <img src={video} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Videos")}
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
              <img src={ShareIcon} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Share")}
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
              <img src={folderColor} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Folder")}
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
              <img src={sitesIcon} height="17px" width="17px" />
              <span className={styles["Option_Document_button"]}>
                {t("Sites")}
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
              <img src={audioIcon} height="17px" width="17px" />
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
      value: 1,
      imgSrc: document,
      label: t("Document")
    },
    {
      value: 2,
      imgSrc: spreadsheet,
      label: t("Spreadsheets")
    },
    {
      value: 3,
      imgSrc: video,
      label: t("Presentaion")
    },
    {
      value: 4,
      imgSrc: forms,
      label: t("Forms")
    },
    {
      value: 5,
      imgSrc: images,
      label: t("Photos")
    },
    {
      value: 6,
      imgSrc: pdf,
      label: t("PDFs")
    },
    {
      value: 7,
      imgSrc: video,
      label: t("Videos")
    },
    {
      value: 8,
      imgSrc: ShareIcon,
      label: t("Share")
    },
    {
      value: 9,
      imgSrc: folderColor,
      label: t("Folder")
    },
    {
      value: 10,
      imgSrc: sitesIcon,
      label: t("Sites")
    },
    {
      value: 11,
      imgSrc: audioIcon,
      label: t("Audio")
    },

  ];

  const optionsLocations = [
    { value: 1, label: "Any Where in DataRoom" },
    { value: 2, label: "My Documents" },
    { value: 3, label: "Shared with me" },
  ];

  const OptionsOwner = [
    { value: 1, label: "Owned by me" },
    { value: 2, label: "Not Owned by me" },
    { value: 3, label: "Specific person" },
  ];
  const optionsPeople = [{ value: 1, label: "Viewer" }];
  const optionsLastmodified = [
    { value: 1, label: "Today" },
    { value: 2, label: "Last 7 days" },
    { value: 3, label: "Last 30 days" },
    { value: 4, label: "This year (2023)" },
    { value: 5, label: "Last year (2022)" },
    {
      value: 6,
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
                width="8.83px"
                onClick={showCustomerangetOptions}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      value: 7,
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
    if (e.target.value == "") {
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
      setSearchbarshow(false)
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
  };
  const showSearchResultsOptions = () => {
    setSearchoptions(!searchoptions);
    setSearchbarshow(true)
  };
  const searchbardropdownShow = () => {
    setSearchbarshow(!searchbarshow);
    if (searchbarsearchoptions === true) {
      setSearchbarsearchoptions(false)
    }
  };

  const SharewithmeButonShow = async () => {
    await dispatch(getDocumentsAndFolderApi(navigate, 2, t));
    setSharemebtn(true);
    setSharedwithmebtn(true);
    setAllDocumentActive(false);
    setMydocumentbtnactive(false);
    localStorage.removeItem("folderID");
  };

  const MydocumentButtonShow = async () => {
    await dispatch(getDocumentsAndFolderApi(navigate, 1, t));
    localStorage.removeItem("folderID");
    setAllDocumentActive(false)
    setSharemebtn(false);
    setMydocumentbtnactive(true);
    setSharedwithmebtn(false);
  };

  const AllDocuments = async () => {
    await dispatch(getDocumentsAndFolderApi(navigate, 3, t));
    localStorage.removeItem("folderID");
    setSharemebtn(false);
    setAllDocumentActive(true)
    setMydocumentbtnactive(false);
    setSharedwithmebtn(false);
  }
  const showCancellUploadModal = () => {
    setCanceluploadmodal(true);
  };
  const showUploadOptionsModal = () => {
    setUploadOptionsmodal(!uploadOptionsmodal);
  };

  const openFolderModal = () => {
    setFolderModal(true);
  };

  const getFolderDocuments = (folderid) => {
    localStorage.setItem("folderID", folderid);
    dispatch(getFolderDocumentsApi(navigate, folderid, t));
  };

  useEffect(() => {
    if (
      DataRoomReducer.getFolderDocumentResponse !== null &&
      DataRoomReducer.getFolderDocumentResponse !== undefined &&
      DataRoomReducer.getFolderDocumentResponse.length > 0
    ) {
      setGetAllData(DataRoomReducer.getFolderDocumentResponse);
    }
  }, [DataRoomReducer.getFolderDocumentResponse]);

  useEffect(() => {
    if (uploadReducer.uploadDocumentsList !== null) {
      let attachmentData = []
      attachmentData.push({
        DisplayAttachmentName:
          uploadReducer.uploadDocumentsList.displayFileName,
        OriginalAttachmentName:
          uploadReducer.uploadDocumentsList.originalFileName,
      });
      setTasksAttachments(attachmentData);
    }
  }, [uploadReducer.uploadDocumentsList]);

  const foldersHandler = (id) => {
    console.log(
      id,
      getAllData,
      folderID,
      "findFolderIDIndexfindFolderIDIndexfindFolderIDIndex"
    );
    if (folderID.includes(id)) {
      let findFolderIDIndex = getAllData.findIndex(
        (data, index) => data.id === id
      );
      console.log(
        findFolderIDIndex,
        "findFolderIDIndexfindFolderIDIndexfindFolderIDIndex"
      );
      if (findFolderIDIndex !== -1) {
        let removeFind = folderID.splice(findFolderIDIndex, 1);
        setFolderID([...removeFind]);
      }
    } else {
      setFolderID([...folderID, id]);
    }
    // if (folderID.includes(id)) {
    //   let findFolderIDIndex = getAllData.findIndex((data, index) => data.id === id)
    //   console.log(findFolderIDIndex, "findFolderIDIndexfindFolderIDIndexfindFolderIDIndex")
    //   if (findFolderIDIndex !== -1) {
    //     folderID.splice(findFolderIDIndex, 1)
    //     setFolderID([...folderID])
    //   } else {
    //     console.log(findFolderIDIndex, "findFolderIDIndexfindFolderIDIndexfindFolderIDIndex")
    //     folderID.push(id)
    //     setFolderID([...folderID])
    //   }

    // } else {
    //   setFolderID([...folderID, id])
    // }
  };
  const MyDocumentsColumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: "250px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        console.log(data, "21212");
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <CustomCheckbox
                  checked={folderID.includes(data.id) ? true : false}
                  onChange={() => foldersHandler(data.id, data)}
                />
                <span
                  className="me-2"
                  onClick={() => getFolderDocuments(data.id)}
                >
                  {text} <img src={sharedIcon} />
                </span>
              </div>
            );
          } else {
            let findExt = text.split(".").pop();
            return (
              <span className="d-flex align-items-center cursor-pointer gap-2">
                <FileIcon size={22} extension={findExt} />
                {text} <img src={sharedIcon} />
              </span>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]}`}>
                <CustomCheckbox
                  checked={folderID.includes(data.id) ? true : false}
                  onChange={() => foldersHandler(data.id, data)}
                />
                <span
                  className="me-2"
                  onClick={() => getFolderDocuments(data.id)}
                >
                  {text}{" "}
                </span>
              </div>
            );
          } else {
            let findExt = text.split(".").pop();
            return (
              <span className="d-flex align-items-center cursor-pointer gap-2">
                <FileIcon size={22} extension={findExt} />
                {text}
              </span>
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
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Last_modified"),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "110px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        return <span>{_justShowDateformat(text)}</span>;
      },
    },
    {
      title: t("File-size"),
      dataIndex: "fileSize",
      key: "fileSize",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: (
        <span className={styles["dataroom_location"]}>{t("Location")}</span>
      ),
      dataIndex: "location",
      key: "location",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "180px",
      sortDirections: ["descend", "ascend"],
      render: (text, data) => {
        console.log(data, "datadatadatadatadatadatadata");
        return (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <>
                  <img
                    src={addone}
                    height="10.71px"
                    width="15.02px"
                    className={styles["HoverStyle"]}
                    onClick={() => {
                      if (data.isFolder) {
                        showShareFolderModal(data.id, data.name);
                      } else {
                        showShareFileModal(data.id, data.name);
                      }
                    }}
                  />
                </>

                <img
                  src={download}
                  height="10.71px"
                  width="15.02px"
                  onClick={showRequestingAccessModal}
                />

                <>
                  <Tooltip placement="topLeft" title={Deltooltip}>
                    <img
                      src={del}
                      height="10.71px"
                      width="15.02px"
                      onClick={() => {
                        if (data.isFolder) {
                          dispatch(deleteFolder(navigate, data.id, t));
                        } else {
                          dispatch(deleteFileDataroom(navigate, data.id, t));
                        }
                      }}
                    />
                  </Tooltip>
                </>

                <img src={start} height="10.71px" width="15.02px" />

                <img src={dot} height="10.71px" width="15.02px" />
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
      dataIndex: "Name",
      key: "Name",
      width: "250px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Shared_by"),
      dataIndex: "Sharedby",
      key: "Sharedby",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Share_date"),
      dataIndex: "Sharedate",
      key: "Sharedate",
      width: "90px",
      sortDirections: ["descend", "ascend"],
      filters: [
        {
          text: t("Shared_date"),
          value: "Shared date",
          className: currentLanguage,
        },
        {
          text: t("Last_modified"),
          value: "Last modified",
        },
        {
          text: t("Last_modified_by_me"),
          value: "Last modified by me",
        },
        {
          text: t("Last_open_by_me"),
          value: "Last open by me",
        },
      ],
      filterIcon: (filtered) => (
        <ChevronDown className="filter-chevron-icon-todolist" />
      ),
    },
    {
      title: t("File-size"),
      dataIndex: "Filesize",
      key: "Filesize",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },

    {
      dataIndex: "OtherStuff",
      key: "OtherStuff",
      width: "180px",
      sortDirections: ["descend", "ascend"],
    },
  ];

  const SharedwithmeTableData = [
    {
      key: "1",
      Name: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <Checkbox />
              <span className={styles["Folder_style"]}>Folder</span>
            </Col>
          </Row>
        </>
      ),
      Sharedby: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-start gap-1"
            >
              <img
                src={profile}
                height="22"
                width="22"
                className={styles["profile_picture"]}
              />
              <span className={styles["Name_particiapnt"]}>Saad Fudda</span>
            </Col>
          </Row>
        </>
      ),
      Sharedate: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Lastmodified_date"]}>
                22nd December,2022
              </span>
            </Col>
          </Row>
        </>
      ),
      Filesize: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex ">
              <span className={styles["File_size_Style"]}>1 MB</span>
            </Col>
          </Row>
        </>
      ),

      OtherStuff: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <img
                src={dot}
                height="10.71px"
                width="15.02px"
                onClick={OpenthreeDotDropdown}
              />
            </Col>
          </Row>
        </>
      ),
    },
    {
      key: "2",
      Name: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img src={PDFICON} height="18px" width="18px" />
              <span className={styles["name_of_life"]}>DairaLogo.pdf</span>
              <img src={person} width="13.44px" height="10.71px" />
            </Col>
          </Row>
        </>
      ),
      Sharedby: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-start gap-1"
            >
              <img
                src={profile}
                height="22"
                width="22"
                className={styles["profile_picture"]}
              />
              <span className={styles["Name_particiapnt"]}>Saad Fudda</span>
            </Col>
          </Row>
        </>
      ),
      Sharedate: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12}>
              <span className={styles["Lastmodified_date"]}>
                22nd December,2022
              </span>
            </Col>
          </Row>
        </>
      ),
      Filesize: (
        <>
          <Row>
            <Col lg={12} md={12} sm={12} className="d-flex ">
              <span className={styles["File_size_Style"]}>1 MB</span>
            </Col>
          </Row>
        </>
      ),

      OtherStuff: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-end gap-2"
            >
              <img
                src={dot}
                height="10.71px"
                width="15.02px"
                onClick={OpenCancelDownloadModal}
              />
            </Col>
          </Row>
        </>
      ),
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (Selectoptions) => {
    console.log("selectoptionsselectoptionsselectoptions", Selectoptions);
    if (Selectoptions.value === "Custom Range") {
      setShowsubmenu(!showsubmenu);
    } else {
      setIsOpen(false);
      setShowsubmenu(false);
    }
  };
  const handleUploadFile = ({ file }) => {
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
        setTasksAttachments
      )
    );
  };
  const handleUploadFolder = ({ file }) => {
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
        setTasksAttachments
      )
    );
  };
  const handleOpen = () => {
    console.log("handleOpen", isOpen);
    setIsOpen(true);
  };
  const onSelectChange = (selectedRowKeys, selectedRows) => {
    setSelectedRows(selectedRows);
  };
  console.log(selectedRows, "selectedRowsselectedRowsselectedRows")
  const rowSelection = {
    selectedRows,
    onChange: onSelectChange,
    onSelect: (e) => {
      console.log(e, "selectedRowsselectedRowsselectedRows")
    }

  }

  const handleChangeLocationValue = (event) => {
    console.log(event, "handleChangeLocationValue")
    setLocationValue({
      label: event.label,
      value: event.value
    })
  }
  const handleChangeDocuments = (documentID) => {
    setSearchDocumentTypeValue(documentID)
    OptionsDocument.map((data, index) => {
      if (data.value === documentID) {
        setSearchDocumentType({
          label: data.label,
          value: data.value
        })
      }
    })
  }
  const handleSearch = () => {
    setSearchoptions(true)
  }
  const handleClearAllSearchOptions = () => {
    setSearchoptions(false)
  }
  useEffect(() => {
    if (
      DataRoomReducer.ResponseMessage !== "" &&
      DataRoomReducer.ResponseMessage !== t("Data-available") &&
      DataRoomReducer.ResponseMessage !== t("No-record-found") &&
      DataRoomReducer.ResponseMessage !== t("No-folder-exist-against-this-name") &&
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
    if (
      DataRoomReducer.getAllDocumentandShareFolderResponse !== null &&
      DataRoomReducer.getAllDocumentandShareFolderResponse !== undefined &&
      DataRoomReducer.getAllDocumentandShareFolderResponse.length > 0
    ) {
      setGetAllData(DataRoomReducer.getAllDocumentandShareFolderResponse);
    } else {
      setGetAllData([]);
    }
  }, [DataRoomReducer.getAllDocumentandShareFolderResponse]);

  useEffect(() => {
    dispatch(getDocumentsAndFolderApi(navigate, 3, t));
  }, []);

  return (
    <>
      <section className={styles["DataRoom_container"]}>
        {showsubmenu ? (
          <>
            <Row>
              <Col className={styles["Drop_down_Documents"]}>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <Select placeholder={t("After")} />
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <Select placeholder={t("Before")} />
                  </Col>
                </Row>

                <Row className="mt-5">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center"
                  >
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Line_down"]}
                      >
                        <img src={line} width="151px" />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2"
                  >
                    <Button
                      text={t("Cancel")}
                      className={styles["cancell_button_expandDropdown"]}
                    />
                    <Button
                      text={t("Apply")}
                      className={styles["Apply_button_expandDropdown"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}

        {deletenotification ? (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Delete_notification_bar"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center mt-2"
                  >
                    <span className={styles["Folder_removed_heading"]}>
                      {t("Folder-removed")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
        {fileremoved ? (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Delete_notification_bar"]}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center mt-2"
                  >
                    <span className={styles["Folder_removed_heading"]}>
                      {t("File-removed")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
        {optionsthreedoticon ? (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Drop_Down_container"]}
              >
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex gap-4 align-items-center "
                  >
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("Open-with")}
                    </span>
                    <img src={rightIcon} width={12} />
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("Share")}
                    </span>
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("Download")}
                    </span>
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("View-detail")}
                    </span>
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span
                      className={styles["Options_name_threedotdropdown"]}
                      onClick={OpenRenameFolderModal}
                    >
                      {t("Rename")}
                    </span>
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("Remove")}
                    </span>
                  </Col>
                  <hr className={styles["hr-Line_tag"]} />
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Options_name_threedotdropdown"]}>
                      {t("Analytics")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
        {showrenamenotification ? (
          <>
            <Row>
              <Col
                lf={12}
                md={12}
                sm={12}
                className={styles["backgeound_Rename_notification"]}
              >
                <Row className="mt-2">
                  <Col lg={9} md={9} sm={9}>
                    <span className={styles["Tag_line_rename_notfication"]}>
                      "Folder 1 renamed to "Folder renamed"
                    </span>
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <span className={styles["Tag_line_rename_notfication"]}>
                      UNDO
                    </span>
                  </Col>
                  <Col lg={1} md={1} sm={1}>
                    <img
                      src={cross}
                      height="15px"
                      width="15px"
                      onClick={ClosingNotificationRenameFolder}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
        {/* not called yet */}
        {actionundonenotification ? (
          <>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["background_action_unDone"]}
              >
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["Action_undone_notification"]}>
                      {t("Action-undone")}
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
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
                  onClick={eventClickHandler}
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
                          <img src={fileupload} height="10.8" width="12px" />
                          <UploadTextField
                            title={t("File-upload")}
                            handleFileUploadRequest={handleUploadFile}
                            setProgress={setProgress}
                          />
                        </Col>
                      </Row>
                    </Dropdown.Item>
                    <Dropdown.Item
                      className="dropdown-item_folder"
                    // onClick={handleCreateTodo}
                    >
                      <Row className="mt-1">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className=" d-flex gap-1 align-items-center"
                        >
                          <img src={plus} height="10.8" width="12px" />
                          <UploadDataFolder
                            title={t("Folder-upload")}
                            setProgress={setProgress}
                            customRequestFolderUpload={handleUploadFolder}
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
                    onDoubleClick={searchbardropdownShow}
                    inputicon={<img src={searchicon} />}
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
                              className="d-flex justify-content-end"
                            >
                              <Button
                                className={styles["CrossButton"]}
                                icon={
                                  <img src={Cross} width="10.35px" height="10.01px" />
                                }
                                onClick={SearchiconClickOptionsHide}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-1">
                            <Col lg={6} md={6} sm={6} className="select-dropdowns-height">

                            </Col>
                            <Col lg={6} md={6} sm={6} className="select-dropdowns-height">
                              <Select
                                options={optionsLastmodified}
                                placeholder={t("Date-modified")}
                                closeMenuOnSelect={false}
                                value={searchModalOptions.DateModified}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={6} md={6} sm={6} className="select-dropdowns-height d-flex align-items-center">
                              <Select
                                options={optionsLocations}
                                placeholder={t("Location")}
                                closeMenuOnSelect={false}
                                onChange={handleChangeLocationValue}
                                value={{
                                  value: locationValue.value,
                                  label: locationValue.label
                                }}
                              />
                            </Col>
                            <Col
                              lg={6}
                              md={6}
                              sm={6}
                              className=" Inputfield_for_data_room"
                            >
                              <TextField
                                placeholder="Item name"
                                labelClass="textFieldSearch d-none"
                                value={searchModalOptions.ItemName}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3 Inputfield_for_data_room">
                            <Col lg={12} md={12} sm={12}>
                              <TextField
                                placeholder="Enter a team the matches part of the file name"
                                labelClass="textFieldSearch d-none"
                                value={searchModalOptions.EnterMember}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col lg={6} md={6} sm={6} className="select-dropdowns-height">
                              <Select
                                options={OptionsOwner}
                                placeholder={t("Owner")}
                                closeMenuOnSelect={false}
                                value={searchModalOptions.OwnerTypeValue}
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
                                className={styles["cancell_Search_button_Dataroom"]}
                                onClick={SearchiconClickOptionsHide}
                              />
                              <Button
                                text={t("Search")}
                                className={styles["Search_Search_button_Dataroom"]}
                                onClick={handleSearch}
                              />
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </>
                  ) : null}
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
                                    <span key={index} onClick={() => handleChangeDocuments(data.value)} className="border-bottom-0">
                                      <img src={data.imgSrc} height="19.25px" width="16.85px" />
                                      <span className={styles["DropDown_name"]}>{data.label}</span>
                                    </span>
                                  </>
                                )
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
                                    className={styles["Search_option_text_span"]}
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
                </div>
              </Col>
              <Col lg={1} md={1} sm={12} className="d-flex justify-content-center">
                <Button
                  icon={
                    <img
                      src={gridbtnactive ? Grid_Selected : Grid_Not_Selected}
                      height="25.27px"
                      width="25.27px"
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
                          alldocumentAcitve
                            ? `${styles["allDocuments_btn_active"]}`
                            : `${styles["allDocuments_btn"]}`
                        }
                        // onClick={showUploadOptionsModal}
                        onClick={AllDocuments}
                      />
                      <Button
                        text={t("My-document")}
                        className={
                          mydocumentbtnactive
                            ? `${styles["myDocument_btn_active"]}`
                            : `${styles["myDocument_btn"]}`
                        }
                        // onClick={showUploadOptionsModal}
                        onClick={MydocumentButtonShow}
                      />
                      <Button
                        text={t("Shared-with-me")}
                        className={
                          sharedwithmebtn
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
                        <Col lg={6} md={6} sm={6}>
                          <Row>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              <Select
                                options={OptionsDocument}
                                placeholder={t("Documents")}
                                closeMenuOnSelect={false}
                                value={{
                                  value: searchDocumentType.value,
                                  label: searchDocumentType.label
                                }}
                              />
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              <Select
                                options={optionsLocations}
                                placeholder={t("Location")}
                                closeMenuOnSelect={false}
                                value={{
                                  value: locationValue.value,
                                  label: locationValue.label
                                }}
                              />
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              <Select
                                options={optionsPeople}
                                placeholder={t("People")}
                                closeMenuOnSelect={false}
                              />
                            </Col>
                            <Col
                              lg={3}
                              md={3}
                              sm={3}
                              className="select-dropdowns-height-DataRoom"
                            >
                              <Select
                                options={optionsLastmodified}
                                onChange={handleChange}
                                // menuIsOpen={isOpen}
                                onMenuOpen={handleOpen}
                              />
                            </Col>
                          </Row>
                        </Col>
                        <Col
                          lg={1}
                          md={1}
                          sm={1}
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
                  {sharemebtn ? (
                    <>
                      <Row className="mt-3">
                        <Col lg={12} sm={12} md={12}>
                          {getAllData.length > 0 &&
                            getAllData !== undefined &&
                            getAllData !== null &&
                            gridbtnactive ? (
                            <>
                              <GridViewDataRoom data={getAllData} />
                            </>
                          ) : getAllData.length > 0 &&
                            getAllData !== undefined &&
                            getAllData !== null &&
                            listviewactive === true ? (
                            <>
                              <TableToDo
                                sortDirections={["descend", "ascend"]}
                                column={MyDocumentsColumns}
                                className={"Resolution"}
                                size={"middle"}
                                rows={getAllData}
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
                                  <img src={EmptyStateSharewithme} />
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
                              <GridViewDataRoom data={getAllData} />
                            </>
                          ) : getAllData.length > 0 &&
                            getAllData !== undefined &&
                            getAllData !== null &&
                            listviewactive === true ? (
                            <>
                              <TableToDo
                                sortDirections={["descend", "ascend"]}
                                column={MyDocumentsColumns}
                                className={styles["DataRoom_Table"]}
                                rows={getAllData}
                                // rowSelection={rowSelection}
                                size={"middle"}
                                onRow={(record, rowIndex) => {
                                  return {
                                    onClick: event => {
                                      console.log(event.target.lastChild.data, record, "asasasasas")
                                    }, // click row
                                  };
                                }}
                              />

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
                  {showbarupload ? (
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={
                            styles["Back_ground_For_uploader"]
                          }
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={styles["Blue_Strip"]}
                            >
                              <Row className="mt-2">
                                <Col
                                  lg={9}
                                  md={9}
                                  sm={9}
                                  className="d-flex justify-content-start gap-3"
                                >
                                  <span
                                    className={styles["Uploading"]}
                                  >
                                    {t("Uploading")} {uploadCounter}{" "}
                                    {t("items")}
                                  </span>
                                  <Space
                                    className={
                                      styles["Progress_bar"]
                                    }
                                  >
                                    {parseInt(progress) + "%"}
                                  </Space>
                                  <Space
                                    className={
                                      styles["Progress_bar"]
                                    }
                                  >
                                    {remainingTime +
                                      t("Sec-remaining")}
                                  </Space>
                                </Col>

                                <Col
                                  lg={3}
                                  md={3}
                                  sm={3}
                                  className="d-flex justify-content-end gap-2 mt-1"
                                >
                                  <img
                                    src={chevdown}
                                    width={9}

                                  // width="8.49px"
                                  // height="4.46px"
                                  />
                                  <img
                                    src={Cancellicon}
                                    width={9}
                                    onClick={closeSearchBar}
                                  // width="6.94px"
                                  // height="6.71px"
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
                              className={
                                styles["Scroller_bar_of_BarUploder"]
                              }
                            >
                              {Object.values(tasksAttachments)
                                .length > 0
                                ? Object.values(
                                  tasksAttachments
                                ).map((data, index) => {
                                  console.log(
                                    data,
                                    "datadatadatadatadatadatadatadatadata"
                                  );
                                  return (
                                    <>
                                      <Col
                                        lg={12}
                                        md={12}
                                        sm={12}
                                        className="d-flex gap-1 mt-2 flex-column"
                                      >
                                        <Space
                                          direction="vertical"
                                          className="d-flex flex-row"
                                        >
                                          <img
                                            src={PDFICON}
                                            height="16px"
                                            width="16px"
                                            className={
                                              styles[
                                              "Icon_in_Bar"
                                              ]
                                            }
                                          />
                                          <span
                                            className={
                                              styles[
                                              "name_of_life_in_Bar"
                                              ]
                                            }
                                          >
                                            {data.name}
                                          </span>
                                        </Space>
                                        {progress > 0 && (
                                          <Progress
                                            percent={progress}
                                          />
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
                  ) : null}
                </Paper>
              </Col>
            </Row>
          </Col>
        </Row>
      </section>

      {foldermodal ? (
        <ModalAddFolder addfolder={foldermodal} setAddfolder={setFolderModal} />
      ) : null}
      {uploadOptionsmodal ? (
        <ModalOptions
          UploadOptions={uploadOptionsmodal}
          setUploadOptions={setUploadOptionsmodal}
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
      {DataRoomReducer.Loading ? <Loader /> : null}
      <Notification open={open.open} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default DataRoom;
