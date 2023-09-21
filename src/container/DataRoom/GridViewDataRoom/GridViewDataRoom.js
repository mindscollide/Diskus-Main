import React, { useEffect, useState } from "react";
import { Row, Col, NavDropdown, MenuItem, Dropdown } from "react-bootstrap";
import styles from "./GridViewDataRoom.module.css";
import folderColor from "../../../assets/images/folder_color.svg";

import file_image from "../../../assets/images/file_image.svg";
import {
  getFolderDocumentsApi,
  getDocumentsAndFolderApiScrollbehaviour,
  deleteFileDataroom,
  getDocumentsAndFolderApi,
  deleteFolder,
  dataBehaviour,
  getFolderDocumentsApiScrollBehaviour,
} from "../../../store/actions/DataRoom_actions";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import ArrowUp from "../../../assets/images/Icon awesome-arrow-up.svg";
import ArrowDown from "../../../assets/images/ArrowUp_Dataroom.svg";
import threedots_dataroom from "../../../assets/images/threedots_dataroom.svg";
import ModalShareFolder from "../ModalShareFolder/ModalShareFolder";
import ModalRenameFolder from "../ModalRenameFolder/ModalRenameFolder";
import ModalShareFile from "../ModalShareFile/ModalShareFile";
import ModalRenameFile from "../ModalRenameFile/ModalRenameFile";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { getFileExtension, getIconSource } from "../SearchFunctionality/option";

const GridViewDataRoom = ({
  data,
  optionsforFolder,
  optionsforFile,
  sRowsData,
  totalRecords,
  filter_Value,
  setSearchTabOpen,
}) => {
  console.log(totalRecords, "totalRecordstotalRecords");
  console.log(filter_Value, "ValueValueValue");
  console.log(
    optionsforFolder,
    optionsforFile,
    "optionsforFileoptionsforFileoptionsforFile"
  );
  const { DataRoomReducer } = useSelector((state) => state);
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
  const [isDataforGrid, setDataForGrid] = useState([]);
  const [isRenameFolderData, setRenameFolderData] = useState(null);
  const [filterValue, setFilterValue] = useState({
    label: t("Name"),
    value: 1,
  });
  const [filterShareTabValue, setFilteShareTabrValue] = useState({
    label: t("Name"),
    value: 2,
  });
  const filterOptionsValues = [
    { label: t("Name"), value: 1 },
    { label: t("Last-modifed"), value: 2 },
    { label: t("Last-modified-by-me"), value: 3 },
    { label: t("Last-open-by-me"), value: 4 },
  ];
  const filterOptionsShareTab = [
    { label: t("Share-date"), value: 2 },
    { label: t("Name"), value: 1 },
    { label: t("Last-modifed"), value: 3 },
    { label: t("Last-modified-by-me"), value: 4 },
    { label: t("Last-open-by-me"), value: 5 },
  ];

  const getFolderDocuments = (folderid) => {
    console.log(folderid, "folderidfolderidfolderidfolderid");
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
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 1));
    } else if (filterValue.value === 2) {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 2));
    } else if (filterValue.value === 3) {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 3));
    } else if (filterValue.value === 4) {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 4));
    }
  };

  const handleShareTabFilter = (filterValue) => {
    if (filterValue.value === 1) {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 1));
    } else if (filterValue.value === 2) {
      dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 2));
    }
    setFilteShareTabrValue({
      label: filterValue.label,
      value: filterValue.value,
    });
  };

  const handleClickforFolder = (dataId, record) => {
    setFolderId(dataId.value);
    if (dataId.value === 2) {
      setShowreanmeFolder(true);
      setRenameFolderData(record);
    } else if (dataId.value === 1) {
      setSharefoldermodal(true);
      setFolderName(record.name);
    } else if (dataId.value === 5) {
      dispatch(deleteFolder(navigate, record.id, t));
    }
  };

  const handleClickSortDecsending = () => {
    setSortIcon(false);
    dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, true, 1));
  };

  const handleClickSortAscending = () => {
    setSortIcon(true);
    dispatch(getDocumentsAndFolderApi(navigate, currentView, t, 2, false, 1));
  };

  const handleClickforFile = (dataId, record) => {
    setFolderId(dataId.value);
    if (dataId.value === 3) {
      setShowRenameFile(true);
      setRenameFolderData(record);
    } else if (dataId.value === 2) {
      setFileName(record.name);
      setShareFileModal(true);
    } else if (dataId.value === 6) {
      dispatch(deleteFileDataroom(navigate, record.id, t));
    }
    console.log(dataId);
  };

  useEffect(() => {
    if (data !== null && data !== undefined) {
      setDataForGrid(data);
    }
  }, [data]);

  return (
    <>
      <Row>
        <Col sm={12} lg={12} md={12} className={styles["folderContainer"]}>
          <Row>
            <Col
              sm={12}
              md={12}
              lg={12}
              className="d-flex gap-2 align-items-center justify-content-start"
            >
              {currentView === 1 || currentView === 3 ? (
                <>
                  <Dropdown
                    drop="down"
                    align="start"
                    className={`${
                      styles["options_dropdown"]
                    } ${"dataroom_options"}`}
                  >
                    <Dropdown.Toggle id="dropdown-autoclose-true">
                      <span className={styles["Name_heading__gridView"]}>
                        {filterValue.label}
                      </span>
                      {/* {filterValue.label} */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {filterOptionsValues.map((data, index) => {
                        return (
                          <Dropdown.Item
                            key={index}
                            onClick={() => handleClickFilter(data)}
                          >
                            {data.label}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                  {sortIon ? (
                    <img
                      src={ArrowUp}
                      width="15.02px"
                      height="10.71px"
                      alt=""
                      className={styles["sortIconGrid"]}
                      onClick={handleClickSortDecsending}
                    />
                  ) : (
                    <img
                      src={ArrowDown}
                      alt=""
                      width="15.02px"
                      height="10.71px"
                      className={styles["sortIconGrid"]}
                      onClick={handleClickSortAscending}
                    />
                  )}
                </>
              ) : (
                <>
                  <Dropdown
                    drop="down"
                    align="start"
                    className={`${
                      styles["options_dropdown"]
                    } ${"dataroom_options"}`}
                  >
                    <Dropdown.Toggle id="dropdown-autoclose-true">
                      <span className={styles["Name_heading__gridView"]}>
                        {filterShareTabValue.label}
                      </span>
                      {/* {filterValue.label} */}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {filterOptionsShareTab.map((data, index) => {
                        return (
                          <Dropdown.Item
                            key={index}
                            onClick={() => handleShareTabFilter(data)}
                          >
                            {data.label}
                          </Dropdown.Item>
                        );
                      })}
                    </Dropdown.Menu>
                  </Dropdown>
                  {sortIon ? (
                    <img
                      src={ArrowUp}
                      width="15.02px"
                      className={styles["sortIconGrid"]}
                      onClick={handleClickSortDecsending}
                      alt=""
                      height="10.71px"
                    />
                  ) : (
                    <img
                      src={ArrowDown}
                      width="15.02px"
                      className={styles["sortIconGrid"]}
                      alt=""
                      height="10.71px"
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
          <Row key={Math.random()}>
            <Col sm={12} lg={12} md={12} className={styles["FolderHeading"]}>
              {t("Folders")}
            </Col>
          </Row>
          <Row>
            {isDataforGrid?.length > 0
              ? isDataforGrid.map((fileData, index) => {
                  if (fileData.isFolder) {
                    return (
                      <>
                        <Col sm={12} md={2} lg={2} key={index}>
                          <div className={styles["gridViewFolder__name"]}>
                            <span
                              className={styles["folderName__text"]}
                              onClick={() => getFolderDocuments(fileData.id)}
                            >
                              <img src={folderColor} alt="" />{" "}
                              {fileData.name}
                            </span>
                            {!fileData.isShared && (
                              <span className={styles["three_dot__gridView"]}>
                                <Dropdown
                                  drop="down"
                                  align="start"
                                  className={`${
                                    styles["options_dropdown"]
                                  } ${"dataroom_options"}`}
                                >
                                  <Dropdown.Toggle id="dropdown-autoclose-true">
                                    <img
                                      alt=""
                                      src={threedots_dataroom}
                                      width="15.02px"
                                      height="10.71px"
                                    />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {optionsforFolder.map((data, index) => {
                                      return (
                                        <Dropdown.Item
                                          key={index}
                                          onClick={() =>
                                            handleClickforFolder(data, fileData)
                                          }
                                        >
                                          {data.label}
                                        </Dropdown.Item>
                                      );
                                    })}
                                  </Dropdown.Menu>
                                </Dropdown>
                              </span>
                            )}
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
            {isDataforGrid?.length > 0
              ? isDataforGrid.map((fileData, index) => {
                  if (!fileData.isFolder) {
                    return (
                      <>
                        <Col
                          sm={12}
                          md={2}
                          lg={2}
                          className={styles["gridViewFolder"]}
                        >
                          <div className={styles["fileview__Box"]}>
                            <Row>
                              <Col sm={12} md={12} lg={12}>
                                <img src={file_image} width={"100%"} alt="" />
                              </Col>
                              <Col sm={12} md={12} lg={12}>
                                <div className={styles["gridViewFile__name"]}>
                                  <span className={styles["folderFile__text"]}>
                                    <img src={getIconSource(getFileExtension(fileData.name))} alt="" />{" "}
                                    {fileData.name}
                                  </span>
                                  {!fileData.isShared && (
                                    <span
                                      className={styles["three_dot__gridView"]}
                                    >
                                      <Dropdown
                                        drop="down"
                                        align="start"
                                        className={`${
                                          styles["options_dropdown"]
                                        } ${"dataroom_options"}`}
                                      >
                                        <Dropdown.Toggle id="dropdown-autoclose-true">
                                          <img
                                            src={threedots_dataroom}
                                            width="15.02px"
                                            height="10.71px"
                                            alt=""
                                          />
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                          {optionsforFile.map((data, index) => {
                                            return (
                                              <Dropdown.Item
                                                key={index}
                                                onClick={() =>
                                                  handleClickforFile(
                                                    data,
                                                    fileData
                                                  )
                                                }
                                              >
                                                {data.label}
                                              </Dropdown.Item>
                                            );
                                          })}
                                        </Dropdown.Menu>
                                      </Dropdown>
                                      {/* <img src={threedots_dataroom} onClick={() => handleClickforFile(fileData.id)} /> */}
                                    </span>
                                  )}
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
