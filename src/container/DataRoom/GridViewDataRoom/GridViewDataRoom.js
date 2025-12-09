import React, { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Dropdown } from "react-bootstrap";
import styles from "./GridViewDataRoom.module.css";
import folderColor from "../../../assets/images/folder_color.svg";
import file_image from "../../../assets/images/file_image.svg";
import {
  getFolderDocumentsApi,
  deleteFileDataroom,
  getDocumentsAndFolderApi,
  deleteFolder,
  getSharedFileUsersApi,
  getSharedFolderUsersApi,
  DataRoomDownloadFolderApiFunc,
  DataRoomDownloadFileApiFunc,
  deleteSharedFolderDataroom,
  deleteSharedFileDataroom,
} from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowUp from "../../../assets/images/Icon awesome-arrow-up.svg";
import ArrowDown from "../../../assets/images/ArrowUp_Dataroom.svg";
import threedots_dataroom from "../../../assets/images/threedots_dataroom.svg";
import ModalShareFolder from "../ModalShareFolder/ModalShareFolder";
import ModalRenameFolder from "../ModalRenameFolder/ModalRenameFolder";
import ModalShareFile from "../ModalShareFile/ModalShareFile";
import ModalRenameFile from "../ModalRenameFile/ModalRenameFile";
import {
  getFileExtension,
  getIconSource,
  optionsforFile,
  optionsforFolder,
  optionsforPDFandSignatureFlow,
} from "../SearchFunctionality/option";
import {
  optionsforFileEditableNonShareable,
  optionsforFileEditor,
  optionsforFileViewer,
  optionsforFolderEditableNonShareable,
  optionsforFolderViewer,
  optionsforFolderEditor,
} from "../SearchFunctionality/option";
import {
  getDataAnalyticsCountApi,
  getFilesandFolderDetailsApi,
} from "../../../store/actions/DataRoom2_actions";
import { createWorkflowApi } from "../../../store/actions/workflow_actions";
import {
  checkFeatureIDAvailability,
  fileFormatforSignatureFlow,
  openDocumentViewer,
} from "../../../commen/functions/utils";
import {
  validateExtensionsforHTMLPage,
  validationExtension,
} from "../../../commen/functions/validations";
import { getAnnotationsOfDataroomAttachement } from "../../../store/actions/webVieverApi_actions";
import MenuPopover from "../../../components/elements/popover";
const GridViewDataRoom = ({
  data,
  setSearchTabOpen,
  setDetailView,
  setFileDataforAnalyticsCount,
}) => {
  const gridViewScroller = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  const currentView = Number(localStorage.getItem("setTableView"));
  const [showrenameFile, setShowRenameFile] = useState(false);
  const [shareFileModal, setShareFileModal] = useState(false);
  const [sortIon, setSortIcon] = useState(false);
  const [showrenameFolder, setShowreanmeFolder] = useState(false);
  const [folderId, setFolderId] = useState(0);
  const [fileName, setFileName] = useState("");
  const [folderName, setFolderName] = useState("");
  const [isRenameFolderData, setRenameFolderData] = useState(null);
  const [filterValue, setFilterValue] = useState({
    label: "Name",
    value: 1,
  });
  const [filterShareTabValue, setFilteShareTabrValue] = useState({
    label: "Name",
    value: 2,
  });
  const filterOptionsValues = [
    { label: "Name", value: 1 },
    { label: "Last-modifed", value: 2 },
    { label: "Last-modified-by-me", value: 3 },
    { label: "Last-open-by-me", value: 4 },
  ];
  const filterOptionsShareTab = [
    { label: "Share-date", value: 2 },
    { label: "Name", value: 1 },
    { label: "Last-modifed", value: 3 },
    { label: "Last-modified-by-me", value: 4 },
    { label: "Last-open-by-me", value: 5 },
  ];

  const getFolderDocuments = (folderid) => {
    localStorage.setItem("folderID", folderid);
    dispatch(getFolderDocumentsApi(navigate, folderid, t));
    setSearchTabOpen(false);
    if (currentView !== null) {
      localStorage.setItem("setTableView", currentView);
    } else {
      localStorage.setItem("setTableView", 3);
    }
  };

  const handleClickFilter = (filterValue) => {
    setFilterValue({
      label: filterValue.label,
      value: filterValue.value,
    });
    if (filterValue.value === 1) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 1, sortIon)
      );
    } else if (filterValue.value === 2) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 2, sortIon)
      );
    } else if (filterValue.value === 3) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 3, sortIon)
      );
    } else if (filterValue.value === 4) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 4, sortIon)
      );
    }
  };

  const handleShareTabFilter = (filterValue) => {
    if (filterValue.value === 1) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 1, sortIon)
      );
    } else if (filterValue.value === 2) {
      dispatch(
        getDocumentsAndFolderApi(navigate, currentView, t, 2, 2, sortIon)
      );
    }
    setFilteShareTabrValue({
      label: filterValue.label,
      value: filterValue.value,
    });
  };

  const handleClickSortDecsending = () => {
    setSortIcon(false);
    dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, 1, true));
  };

  const handleClickSortAscending = () => {
    setSortIcon(true);
    dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, 1, false));
  };

  const showShareFileModal = (id, name) => {
    // getSharedFileUsersApi
    let Data = { FileID: id };

    dispatch(getSharedFileUsersApi(navigate, Data, t, setShareFileModal));
    setFolderId(id);
    setFileName(name);
  };

  const showShareFolderModal = (id, name) => {
    // getSharedFolderUsersApi;
    let Data = { FolderID: id };
    dispatch(getSharedFolderUsersApi(navigate, Data, t, setSharefoldermodal));
    setFolderId(id);
    setFolderName(name);
  };

  const handleClickFile = (e, record) => {
    if (checkFeatureIDAvailability(20)) {
      let ext = record.name.split(".").pop();

      const pdfData = {
        taskId: record.id,
        commingFrom: 4,
        fileName: record.name,
        attachmentID: record.id,
        isPermission: record.permissionID,
      };
      const pdfDataJson = JSON.stringify(pdfData);
      if (validationExtension(ext)) {
        window.open(
          `/Diskus/documentViewer?pdfData=${encodeURIComponent(pdfDataJson)}`,
          "_blank",
          "noopener noreferrer"
        );
      } else if (validateExtensionsforHTMLPage(ext)) {
        let dataRoomData = {
          FileID: record.id,
        };
        dispatch(
          getAnnotationsOfDataroomAttachement(navigate, t, dataRoomData)
        );
      }
    }
  };

  const fileOptionsSelect = (data, record, pdfDataJson) => {
    if (data.value === 1) {
      if (checkFeatureIDAvailability(20)) {
        let ext = record.name.split(".").pop();

        // Open on Apryse
        const pdfData = {
          taskId: record.id,
          commingFrom: 4,
          fileName: record.name,
          attachmentID: record.id,
          isPermission: record.permissionID,
        };
        const pdfDataJson = JSON.stringify(pdfData);
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
        setShowreanmeFolder(true);
        setRenameFolderData(record);
      } else {
        setShowRenameFile(true);
        setRenameFolderData(record);
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
        dispatch(deleteFolder(navigate, record.id, t));
      } else {
        dispatch(deleteFileDataroom(navigate, record.id, t));
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
      const pdfDataforSignature = {
        taskId: record.id,
        commingFrom: 4,
        fileName: record.name,
        attachmentID: record.id,
        isPermission: record.permissionID,
        isNew: true,
      };
      const pdfDataJsonSignature = JSON.stringify(pdfDataforSignature);
      // Create Signature Flow
      let dataRoomData = {
        FileID: Number(record.id),
      };
      dispatch(
        createWorkflowApi(dataRoomData, navigate, t, pdfDataJsonSignature)
      );
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

  useEffect(() => {
    const div = gridViewScroller.current;
    if (!div) return;

    const handleScrollGridView = () => {
      // Only allow vertical scroll detection
      const scrollTop = div.scrollTop;
      const clientHeight = div.clientHeight;
      const scrollHeight = div.scrollHeight;

      // Check if user reached the bottom
      if (scrollTop + clientHeight >= scrollHeight - 0) {
        console.log("Reached bottom → calling API");
      }
    };

    div.addEventListener("scroll", handleScrollGridView);

    return () => {
      div.removeEventListener("scroll", handleScrollGridView);
    };
  }, []);

  const dataGrid = useMemo(() => {
    return data;
  }, [data]);

  return (
    <>
      <Row>
        <Col sm={12} lg={12} md={12} className={styles["folderContainer"]}>
          <section
            ref={gridViewScroller}
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              overflowX: "hidden"
            }}>
            <Row>
              <Col
                sm={12}
                md={12}
                lg={12}
                className='d-flex gap-2 align-items-center justify-content-start'>
                {currentView === 1 || currentView === 3 || currentView === 4 ? (
                  <>
                    <Dropdown
                      drop='down'
                      align='start'
                      className={`${
                        styles["options_dropdown"]
                      } ${"dataroom_options"}`}>
                      <Dropdown.Toggle id='dropdown-autoclose-true'>
                        <span className={styles["Name_heading__gridView"]}>
                          {t(filterValue.label)}
                        </span>
                        {/* {filterValue.label} */}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {filterOptionsValues.map((data, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => handleClickFilter(data)}>
                              {t(data.label)}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                    {sortIon ? (
                      <img
                        src={ArrowUp}
                        width='15.02px'
                        height='10.71px'
                        alt=''
                        className={styles["sortIconGrid"]}
                        onClick={handleClickSortDecsending}
                      />
                    ) : (
                      <img
                        src={ArrowDown}
                        alt=''
                        width='15.02px'
                        height='10.71px'
                        className={styles["sortIconGrid"]}
                        onClick={handleClickSortAscending}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <Dropdown
                      drop='down'
                      align='start'
                      className={`${
                        styles["options_dropdown"]
                      } ${"dataroom_options"}`}>
                      <Dropdown.Toggle id='dropdown-autoclose-true'>
                        <span className={styles["Name_heading__gridView"]}>
                          {t(filterShareTabValue.label)}
                        </span>
                        {/* {filterValue.label} */}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        {filterOptionsShareTab.map((data, index) => {
                          return (
                            <Dropdown.Item
                              key={index}
                              onClick={() => handleShareTabFilter(data)}>
                              {t(data.label)}
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                    {sortIon ? (
                      <img
                        src={ArrowUp}
                        width='15.02px'
                        className={styles["sortIconGrid"]}
                        onClick={handleClickSortDecsending}
                        alt=''
                        height='10.71px'
                      />
                    ) : (
                      <img
                        src={ArrowDown}
                        width='15.02px'
                        className={styles["sortIconGrid"]}
                        alt=''
                        height='10.71px'
                        onClick={handleClickSortAscending}
                      />
                    )}
                  </>
                )}
              </Col>
              <Col sm={12} md={12} lg={12}>
                <span className={styles["border_bottom__gridView"]}></span>
              </Col>
            </Row>
            <Row>
              <Col sm={12} lg={12} md={12} className={styles["FolderHeading"]}>
                {t("Folders")}
              </Col>
            </Row>
            <Row>
              {dataGrid?.length > 0
                ? dataGrid
                    .filter((data) => data.isFolder === true)
                    .map((fileData, index) => {
                      const getMenuPopover = (listData) => (
                        <MenuPopover
                          imageImage={threedots_dataroom}
                          listData={listData}
                          record={fileData}
                          t={t}
                          listOnClickFunction={fileOptionsSelect}
                        />
                      );
                      if (fileData.isShared) {
                        return (
                          <>
                            <Col sm={12} md={2} lg={2} key={index}>
                              <div className={styles["gridViewFolder__name"]}>
                                <span
                                  className={styles["folderName__text"]}
                                  onClick={() =>
                                    getFolderDocuments(fileData.id)
                                  }>
                                  <img
                                    src={folderColor}
                                    alt=''
                                    draggable='false'
                                  />{" "}
                                  {fileData.name}
                                </span>
                                {fileData.permissionID === 2
                                  ? getMenuPopover(optionsforFolderEditor)
                                  : fileData.permissionID === 1
                                  ? getMenuPopover(optionsforFolderViewer)
                                  : fileData.permissionID === 3
                                  ? getMenuPopover(
                                      optionsforFolderEditableNonShareable
                                    )
                                  : null}
                              </div>
                            </Col>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <Col sm={12} md={2} lg={2} key={index}>
                              <div className={styles["gridViewFolder__name"]}>
                                <span
                                  className={styles["folderName__text"]}
                                  onClick={() =>
                                    getFolderDocuments(fileData.id)
                                  }>
                                  <img
                                    src={folderColor}
                                    alt=''
                                    draggable='false'
                                  />{" "}
                                  {fileData.name}
                                </span>

                                {getMenuPopover(optionsforFolder)}
                              </div>
                            </Col>
                          </>
                        );
                      }
                    })
                : null}
            </Row>
            <Row>
              <Col sm={12} lg={12} md={12} className={styles["FolderHeading"]}>
                {t("Files")}
              </Col>
            </Row>
            <Row>
              {dataGrid?.length > 0
                ? dataGrid
                    .filter((data) => data.isFolder === false)
                    .map((fileData, index) => {
                      let getExtension = getFileExtension(fileData.name);

                      // Simplify MenuPopover props setup
                      const getMenuPopover = (listData) => (
                        <MenuPopover
                          imageImage={threedots_dataroom}
                          listData={listData}
                          record={fileData}
                          t={t}
                          listOnClickFunction={fileOptionsSelect}
                        />
                      );
                      if (fileData.isShared) {
                        return (
                          <>
                            <Col
                              sm={12}
                              md={2}
                              lg={2}
                              className={styles["gridViewFolder"]}>
                              <div className={styles["fileview__Box"]}>
                                <Row>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      src={file_image}
                                      width={"100%"}
                                      alt=''
                                      draggable='false'
                                    />
                                  </Col>
                                  <Col sm={12} md={12} lg={12}>
                                    <div
                                      className={styles["gridViewFile__name"]}>
                                      <span
                                        className={styles["folderFile__text"]}
                                        onClick={(e) =>
                                          handleClickFile(e, fileData)
                                        }>
                                        <img
                                          src={getIconSource(
                                            getFileExtension(fileData.name)
                                          )}
                                          alt=''
                                          width={"25px"}
                                          height={"25px"}
                                          draggable='false'
                                        />{" "}
                                        {fileData.name}
                                      </span>
                                      {fileData.permissionID === 2
                                        ? getMenuPopover(optionsforFileEditor)
                                        : fileData.permissionID === 1
                                        ? getMenuPopover(optionsforFileViewer)
                                        : fileData.permissionID === 3
                                        ? getMenuPopover(
                                            optionsforFileEditableNonShareable
                                          )
                                        : null}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </>
                        );
                      } else {
                        return (
                          <>
                            <Col
                              sm={12}
                              md={2}
                              lg={2}
                              className={styles["gridViewFolder"]}>
                              <div className={styles["fileview__Box"]}>
                                <Row>
                                  <Col sm={12} md={12} lg={12}>
                                    <img
                                      src={file_image}
                                      width={"100%"}
                                      alt=''
                                      draggable='false'
                                    />
                                  </Col>
                                  <Col sm={12} md={12} lg={12}>
                                    <div
                                      className={styles["gridViewFile__name"]}>
                                      <span
                                        className={styles["folderFile__text"]}
                                        onClick={(e) =>
                                          handleClickFile(e, fileData)
                                        }>
                                        <img
                                          src={getIconSource(
                                            getFileExtension(fileData.name)
                                          )}
                                          alt=''
                                          draggable='false'
                                          width={"25px"}
                                          height={"25px"}
                                        />{" "}
                                        {fileData.name}
                                      </span>
                                      {fileFormatforSignatureFlow.includes(
                                        getExtension
                                      )
                                        ? getMenuPopover(
                                            optionsforPDFandSignatureFlow
                                          )
                                        : getMenuPopover(optionsforFile)}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </Col>
                          </>
                        );
                      }
                    })
                : null}
            </Row>
          </section>
        </Col>
      </Row>
      {sharefoldermodal && (
        <ModalShareFolder
          folderName={folderName}
          folderId={folderId}
          sharefolder={sharefoldermodal}
          setSharefolder={setSharefoldermodal}
        />
      )}
      {shareFileModal && (
        <ModalShareFile
          fileName={fileName}
          folderId={folderId}
          shareFile={shareFileModal}
          setShareFile={setShareFileModal}
        />
      )}
      {showrenameFile && (
        <ModalRenameFile
          isRenameFileData={isRenameFolderData}
          showrenameFile={showrenameFile}
          setShowRenameFile={setShowRenameFile}
        />
      )}
      {showrenameFolder && (
        <ModalRenameFolder
          isRenameFolderData={isRenameFolderData}
          renamefolder={showrenameFolder}
          setRenamefolder={setShowreanmeFolder}
        />
      )}
    </>
  );
};

export default GridViewDataRoom;
