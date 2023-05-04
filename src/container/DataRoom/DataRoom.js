import React, { useEffect } from "react";
import "react-dropzone-uploader/dist/styles.css";
import { Progress, Space, Tooltip } from "antd";
import Cancellicon from "../../assets/images/x-lg.svg";

// import Dropzone from "react-dropzone-uploader";
import { InboxOutlined } from "@ant-design/icons";
// import type { props } from "antd";
import { message, Upload } from "antd";
import { FileUploadToDo } from "../../store/actions/Upload_action";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import person from "../../assets/images/add_new.svg";

import addone from "../../assets/images/addone.svg";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/Icon material-delete.svg";
import dot from "../../assets/images/Group 2898.svg";
import add from "../../assets/images/Icon material-group-add.svg";
import file from "../../assets/images/Icon metro-file-pdf.svg";
import Cross from "../../assets/images/cuticon.svg";
import deleterednew from "../../assets/images/delete red new.svg";
import icon from "../../assets/images/Group 2958.svg";
import { ChevronDown } from "react-bootstrap-icons";
import chevdown from "../../assets/images/chevron-down.svg";
import document from "../../assets/images/111.svg";
import dropBar from "../../assets/images/dropdown-icon-chatmessage.png";
import pdf from "../../assets/images/222.svg";
import PDFfileICon from "../../assets/images/337946.svg";
import folder from "../../assets/images/333.svg";
import video from "../../assets/images/444.svg";
import spreadsheet from "../../assets/images/555.svg";
import list from "../../assets/images/list.svg";
import grid from "../../assets/images/grid.svg";
import forms from "../../assets/images/666.svg";
import start from "../../assets/images/Icon feather-star.svg";
import icon1 from "../../assets/images/Group 3092.svg";
import icon2 from "../../assets/images/Path 1752.svg";
import icon3 from "../../assets/images/Background Complete.svg";
import Select from "react-select";
import icon4 from "../../assets/images/Group 3431.svg";
import profile from "../../assets/images/Userprofile-1.png";
import plus from "../../assets/images/Icon feather-folder-plus.svg";
import fileupload from "../../assets/images/Group 2891.svg";
import { Paper } from "@material-ui/core";
import styles from "./DataRoom.module.css";
import {
  Button,
  TextField,
  TableToDo,
  SelectBox,
  Checkbox,
  UploadTextField,
} from "../../components/elements";
import { Row, Col, Dropdown } from "react-bootstrap";
import { useState } from "react";
import ModalAddFolder from "../ModalAddFolder/ModalAddFolder";
import ModalOptions from "../ModalUploadOptions/ModalOptions";
import ModalCancelUpload from "../ModalCancelUpload/ModalCancelUpload";
import ModalShareFolder from "../ModalShareFolder/ModalShareFolder";
import ModalrequestingAccess from "../ModalrequestingAccess/ModalrequestingAccess";
import Dragger from "../../components/elements/Dragger/Dragger";

const DataRoom = () => {
  // tooltip
  const [showbarupload, setShowbarupload] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [progress, setProgress] = useState(0);
  const text = <span>Share</span>;
  const Deltooltip = <span>Delete</span>;
  const eventClickHandler = () => {};
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { uploadReducer } = useSelector((state) => state);
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [foldermodal, setFolderModal] = useState(false);
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  const [canceluploadmodal, setCanceluploadmodal] = useState(false);
  const [sharemebtn, setSharemebtn] = useState(false);
  const [searchbarshow, setSearchbarshow] = useState(false);
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [searchoptions, setSearchoptions] = useState(false);
  const [gridbtnactive, setGridbtnactive] = useState(false);
  const [listviewactive, setListviewactive] = useState(false);
  const [sharehoverstyle, setSharehoverstyle] = useState(false);
  const [sharefoldermodal, setSharefoldermodal] = useState(false);
  const [mydocumentbtnactive, setMydocumentbtnactive] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [deltehoverstyle, setDeltehoverstyle] = useState(false);
  const [sharedwithmebtn, setSharedwithmebtn] = useState(false);
  const [requestingAccess, setRequestingAccess] = useState(false);
  const [uploadCounter, setUploadCounter] = useState(0);
  const [remainingTime, setRemainingTime] = useState(null);
  const [data, setData] = useState([]);
  const [filterVal, setFilterVal] = useState("");
  console.log(filterVal, "filterValfilterVal");
  const [rows, setRow] = useState([1]);

  const closeSearchBar = () => {
    setShowbarupload(false);
  };
  const MinimizeOption = () => {
    setMinimize(true);
  };
  const deleteafterhover = () => {
    setDeltehoverstyle(true);
    setSharehoverstyle(false);
  };
  const options = [{ value: "Viewer", label: "Viewer" }];
  const optionsNew = [
    {
      value: "New Folder",
      label: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <img
              src={plus}
              height="10.8"
              width="12px"
              // onClick={openFolderModal}
            />
            <span className={styles["new_folder"]}>New Folder</span>
          </Col>
        </Row>
      ),
    },
    {
      value: "File Upload",
      label: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <img src={plus} height="10.8" width="12px" />
            <span className={styles["new_folder"]}>File Upload</span>
          </Col>
        </Row>
      ),
    },
    {
      value: "New Folder",
      label: (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <img
              src={plus}
              height="10.8"
              width="12px"
              className={styles["Folder_icon"]}
            />
            <span className={styles["new_folder"]}>Folder Upload</span>
          </Col>
        </Row>
      ),
    },
  ];
  const optionsLocations = [{ value: "Viewer", label: "Viewer" }];
  const optionsPeople = [{ value: "Viewer", label: "Viewer" }];
  const optionsLastmodified = [{ value: "Viewer", label: "Viewer" }];
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
  };

  const showShareFolderModal = () => {
    setSharefoldermodal(true);
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
    setSearchoptions(true);
  };
  const searchbardropdownShow = () => {
    setSearchbarshow(!searchbarshow);
  };
  const SharewithmeButonShow = () => {
    setSharemebtn(true);
    setSharedwithmebtn(true);
    setMydocumentbtnactive(false);
  };

  const MydocumentButtonShow = () => {
    setSharemebtn(false);
    setMydocumentbtnactive(true);
    setSharedwithmebtn(false);
  };
  const showCancellUploadModal = () => {
    setCanceluploadmodal(true);
  };
  const showUploadOptionsModal = () => {
    setUploadOptionsmodal(!uploadOptionsmodal);
  };

  const openFolderModal = () => {
    setFolderModal(true);
  };

  useEffect(() => {
    setTasksAttachments([]);
    dispatch(FileUploadToDo(data, t));
  }, []);
  useEffect(() => {
    if (uploadReducer.uploadDocumentsList !== null) {
      tasksAttachments.push({
        DisplayAttachmentName:
          uploadReducer.uploadDocumentsList.displayFileName,
        OriginalAttachmentName:
          uploadReducer.uploadDocumentsList.originalFileName,
      });
      setTasksAttachments([...tasksAttachments]);
    }
  }, [uploadReducer.uploadDocumentsList]);
  const MyDocumentsColumns = [
    {
      title: t("Name"),
      dataIndex: "Name",
      key: "Name",
      width: "250px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Owner"),
      dataIndex: "Owner",
      key: "Owner",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Last_modified"),
      dataIndex: "Lastmodified",
      key: "Lastmodified",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("File-size"),
      dataIndex: "Filesize",
      key: "Filesize",
      width: "90px",
      sortDirections: ["descend", "ascend"],
    },
    {
      title: t("Location"),
      dataIndex: "Location",
      key: "Location",
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
  const MyDocumentsRowData = [
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
      Owner: (
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
      Lastmodified: (
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
      Location: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img src={person} width="13px" height="10.71px" />
              <span>{t("Shared-with-me")}</span>
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
              {sharehoverstyle ? (
                <>
                  <Tooltip placement="topLeft" title={text}>
                    <img
                      src={addone}
                      height="10.71px"
                      width="15.02px"
                      className={styles["HoverStyle"]}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip placement="topLeft" title={text}>
                    <img
                      src={add}
                      height="10.71px"
                      width="15.02px"
                      onClick={showShareFolderModal}
                    />
                  </Tooltip>
                </>
              )}

              <img
                src={download}
                height="10.71px"
                width="15.02px"
                onClick={showRequestingAccessModal}
              />
              {deltehoverstyle ? (
                <>
                  <Tooltip placement="topLeft" title={Deltooltip}>
                    <img
                      src={deleterednew}
                      height="10.71px"
                      width="15.02px"
                      className={styles["Deletehover"]}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  <Tooltip placement="topLeft" title={Deltooltip}>
                    <img
                      src={del}
                      height="10.71px"
                      width="15.02px"
                      onClick={deleteafterhover}
                    />
                  </Tooltip>
                </>
              )}

              <img src={start} height="10.71px" width="15.02px" />

              <img src={dot} height="10.71px" width="15.02px" />
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
              {tasksAttachments.length > 0
                ? tasksAttachments.map((data, index) => {
                    console.log(data, "datadatadatadatadatadatadatadatadata");
                    return (
                      <>
                        <img src={PDFfileICon} height="18px" width="18px" />
                        <span className={styles["name_of_life"]}>
                          {data.DisplayAttachmentName}
                        </span>
                        <img src={person} width="13.44px" height="10.71px" />
                      </>
                    );
                  })
                : null}
            </Col>
          </Row>
        </>
      ),
      Owner: (
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
      Lastmodified: (
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
      Location: (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex gap-2 align-items-center"
            >
              <img src={person} width="13.44px" height="10.71px" />
              <span>{t("Shared-with-me")}</span>
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
                src={add}
                height="10.71px"
                width="15.02px"
                onClick={showCancellUploadModal}
              />
              <img
                src={download}
                height="10.71px"
                width="15.02px"
                onClick={showUploadOptionsModal}
              />
              <img src={del} height="10.71px" width="15.02px" />
              <img src={start} height="10.71px" width="15.02px" />
              <img src={dot} height="10.71px" width="15.02px" />
            </Col>
          </Row>
        </>
      ),
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
              <img src={dot} height="10.71px" width="15.02px" />
            </Col>
          </Row>
        </>
      ),
    },
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
              <img src={PDFfileICon} height="18px" width="18px" />
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
              <img src={dot} height="10.71px" width="15.02px" />
            </Col>
          </Row>
        </>
      ),
    },
  ];
  console.log("uploadCounter", uploadCounter);
  return (
    <>
      <section className={styles["DataRoom_container"]}>
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
                    <div>
                      <img src={document} height="19.25px" width="16.85px" />
                      <span className={styles["DropDown_name"]}>Document</span>
                    </div>
                    <div>
                      <img src={pdf} height="19.25px" width="16.85px" />
                      <span className={styles["DropDown_name"]}>PDF</span>
                    </div>
                    <div>
                      <img src={folder} height="18.99px" width="21.11px" />
                      <span className={styles["DropDown_name"]}>folder</span>
                    </div>
                    <div>
                      <img src={video} height="20.53px" width="17.97px" />
                      <span className={styles["DropDown_name"]}>video</span>
                    </div>
                    <div>
                      <img src={spreadsheet} height="19.76px" width="19.78px" />
                      <span className={styles["DropDown_name"]}>
                        spreadsheet
                      </span>
                    </div>
                    <div>
                      <img src={forms} height="20.24px" width="18.65px" />
                      <span className={styles["DropDown_name"]}>forms</span>
                    </div>
                    <div>
                      <img src={video} height="20.53px" width="17.97px" />
                      <span className={styles["DropDown_name"]}>video</span>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-4">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Show_more_options"]}
                  >
                    <span
                      className={styles["Search_option_text_span"]}
                      onClick={showSearchResultsOptions}
                    >
                      Show Search Options
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}
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
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="CreateMeetingReminder m-0 select-participant-box"
                  >
                    <SelectBox placeholder="File Type" />
                  </Col>
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="CreateMeetingReminder m-0 select-participant-box"
                  >
                    <SelectBox placeholder="Data modified" />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="CreateMeetingReminder m-0 select-participant-box"
                  >
                    <SelectBox placeholder="Data modified" />
                  </Col>
                  <Col lg={6} md={6} sm={6} className="mt-2">
                    <TextField
                      placeholder="Item name"
                      labelClass="textFieldSearch d-none"
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      placeholder="Enter a team the matches part of the file name"
                      labelClass="textFieldSearch d-none"
                    />
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col
                    lg={6}
                    md={6}
                    sm={6}
                    className="CreateMeetingReminder m-0 select-participant-box"
                  >
                    <SelectBox placeholder="Data modified" />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end gap-3"
                  >
                    <Button
                      text="Cancel"
                      className={styles["cancell_Search_button_Dataroom"]}
                    />
                    <Button
                      text="Search"
                      className={styles["Search_Search_button_Dataroom"]}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : null}

        <Row className="mt-3">
          <Col sm={12} md={12} lg={12}>
            <Row>
              <Col
                lg={5}
                md={5}
                sm={5}
                className="d-flex justify-content-start gap-3"
              >
                <span className={styles["Data_room_heading"]}>
                  {t("Data-room")}
                </span>
                <Dropdown
                  className={styles["New_button_DataRoom"]}
                  onClick={eventClickHandler}
                  align={"start"}
                >
                  <Dropdown.Toggle title={t("New")}>
                    {t("New")}
                    <ChevronDown />
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
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
                            {t(" New-folder")}
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
                            setShowbarupload={setShowbarupload}
                            progress={progress}
                            setProgress={setProgress}
                            setUploadCounter={setUploadCounter}
                            uploadCounter={uploadCounter}
                            setRemainingTime={setRemainingTime}
                            remainingTime={remainingTime}
                          />
                          {/* <span className={styles["New_folder"]}>
                            {t("File-upload")}
                          </span> */}
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
                          className=" d-flex gap-1 align-items-center"
                        >
                          <img src={plus} height="10.8" width="12px" />
                          <span className={styles["Folder_Upload"]}>
                            {t("Folder-upload")}
                          </span>
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
                className="d-flex  justify-content-end "
              >
                <div onClick={searchbardropdownShow}>
                  <TextField
                    width="611px"
                    name={filterVal}
                    change={handleFilter}
                    placeholder={t("Search")}
                    labelClass="textFieldSearch d-none"
                  />
                </div>
                <img
                  src={searchicon}
                  height="19px"
                  width="19px"
                  className={styles["Search_Icon"]}
                  // onClick={searchbardropdownShow}
                  onClick={SearchiconClickOptions}
                />
              </Col>
              <Col lg={1} md={1} sm={1}>
                <Button
                  icon={
                    <img
                      src={grid}
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
                      src={list}
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

            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Paper className={styles["Data_room_paper"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-3">
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
                            <Col lg={3} md={3} sm={3}>
                              <Select
                                options={options}
                                placeholder="Documents"
                                // className={styles["Editor_select"]}
                                // onChange={handlechange}
                              />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <Select
                                options={optionsLocations}
                                placeholder="Location"
                                // className={styles["Editor_select"]}
                                // onChange={handlechange}
                              />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <Select
                                options={optionsPeople}
                                placeholder="People"
                                // className={styles["Editor_select"]}
                                // onChange={handlechange}
                              />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <Select
                                options={optionsLastmodified}
                                placeholder="Last modified"
                                // className={styles["Editor_select"]}
                                // onChange={handlechange}
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
                          <span className={styles["Clear_All_btn"]}>
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
                          {/* {rows.length > 0 &&
                          rows !== undefined &&
                          rows !== null ? ( */}
                          <>
                            <TableToDo
                              sortDirections={["descend", "ascend"]}
                              column={shareWithmeColoumns}
                              className={"Resolution"}
                              rows={SharedwithmeTableData}
                            />
                          </>
                          {/* ) : ( */}
                          <>
                            <Row className="mt-4">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-center"
                              >
                                <img
                                  src={icon1}
                                  height="166.94px"
                                  width="238.06px"
                                  className={styles["Folder_Icon"]}
                                />
                                <img
                                  src={icon2}
                                  width="106.55px"
                                  height="121.37px"
                                  className={styles["Search_icon"]}
                                />
                                <img
                                  src={icon3}
                                  height="105.36px"
                                  width="85.53px"
                                  className={styles["paper_Icon"]}
                                />
                                <img
                                  src={icon4}
                                  height="53.04px"
                                  width="53.04"
                                  className={styles["spark_icon"]}
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
                                  {t(" With-you")}
                                </span>
                              </Col>
                            </Row>
                          </>
                          {/* )} */}
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      <Row className="mt-3">
                        <Col lg={12} sm={12} md={12}>
                          {/* {rows.length > 0 &&
                          rows !== undefined &&
                          rows !== null ? ( */}
                          <>
                            <TableToDo
                              sortDirections={["descend", "ascend"]}
                              column={MyDocumentsColumns}
                              className={"Resolution"}
                              rows={MyDocumentsRowData}
                            />
                            {showbarupload && uploadCounter != 0 ? (
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
                                              className={styles["Progress_bar"]}
                                            >
                                              {parseInt(progress) + "%"}
                                            </Space>
                                            <Space
                                              className={styles["Progress_bar"]}
                                            >
                                              {remainingTime + "Sec remaining"}
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
                                        {tasksAttachments.length > 0
                                          ? tasksAttachments.map(
                                              (data, index) => {
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
                                                      className="d-flex gap-2 mt-2"
                                                    >
                                                      <Space>
                                                        <Space direction="vertical">
                                                          <img
                                                            src={PDFfileICon}
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
                                                            {
                                                              data.DisplayAttachmentName
                                                            }
                                                          </span>
                                                        </Space>
                                                      </Space>
                                                      {progress > 0 && (
                                                        <Progress
                                                          percent={progress}
                                                        />
                                                      )}
                                                    </Col>
                                                  </>
                                                );
                                              }
                                            )
                                          : null}
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>
                              </>
                            ) : null}
                          </>
                          {/* ) : (y */}
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
                                  setShowbarupload={setShowbarupload}
                                  progress={progress}
                                  setProgress={setProgress}
                                  setUploadCounter={setUploadCounter}
                                  uploadCounter={uploadCounter}
                                  setRemainingTime={setRemainingTime}
                                  remainingTime={remainingTime}
                                  Icon={
                                    <img
                                      src={icon}
                                      heigh="356.89"
                                      width="356.89"
                                    />
                                  }
                                />
                              </Col>
                            </Row>
                          </>
                          {/* )} */}
                        </Col>
                      </Row>
                    </>
                  )}
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
        />
      ) : null}
      {requestingAccess ? (
        <ModalrequestingAccess
          requestingAccess={requestingAccess}
          setRequestingAccess={setRequestingAccess}
        />
      ) : null}
    </>
  );
};

export default DataRoom;
