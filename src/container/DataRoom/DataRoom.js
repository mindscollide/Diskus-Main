import React from "react";
import { useTranslation } from "react-i18next";
import searchicon from "../../assets/images/searchicon.svg";
import down from "../../assets/images/down.png";
import person from "../../assets/images/person.png";
import download from "../../assets/images/Icon feather-download.svg";
import del from "../../assets/images/Icon material-delete.svg";
import dot from "../../assets/images/Group 2898.svg";
import add from "../../assets/images/Icon material-group-add.svg";
import file from "../../assets/images/Icon metro-file-pdf.svg";
import Cross from "../../assets/images/cuticon.svg";
import icon from "../../assets/images/Group 2958.svg";
import { ChevronDown } from "react-bootstrap-icons";
import document from "../../assets/images/111.svg";
import pdf from "../../assets/images/222.svg";
import folder from "../../assets/images/333.svg";
import video from "../../assets/images/444.svg";
import spreadsheet from "../../assets/images/555.svg";
import forms from "../../assets/images/666.svg";
import start from "../../assets/images/Icon feather-star.svg";
import icon1 from "../../assets/images/Group 3092.svg";
import icon2 from "../../assets/images/Path 1752.svg";
import icon3 from "../../assets/images/Background Complete.svg";
import icon4 from "../../assets/images/Group 3431.svg";
import profile from "../../assets/images/Userprofile-1.png";
import plus from "../../assets/images/Icon feather-folder-plus.svg";
import { Paper } from "@material-ui/core";
import styles from "./DataRoom.module.css";
import {
  Button,
  TextField,
  TableToDo,
  SelectBox,
  Checkbox,
} from "../../components/elements";
import { Row, Col } from "react-bootstrap";
import { useState } from "react";
import ModalAddFolder from "../ModalAddFolder/ModalAddFolder";
import ModalOptions from "../ModalUploadOptions/ModalOptions";
import ModalCancelUpload from "../ModalCancelUpload/ModalCancelUpload";

const DataRoom = () => {
  const { t } = useTranslation();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const [dropdown, setDropDown] = useState(false);
  const [foldermodal, setFolderModal] = useState(false);
  const [uploadOptionsmodal, setUploadOptionsmodal] = useState(false);
  const [canceluploadmodal, setCanceluploadmodal] = useState(false);
  const [sharemebtn, setSharemebtn] = useState(false);
  const [searchbarshow, setSearchbarshow] = useState(false);
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [searchoptions, setSearchoptions] = useState(false);
  const [data, setData] = useState([]);
  const [filterVal, setFilterVal] = useState("");
  console.log(filterVal, "filterValfilterVal");
  const [rows, setRow] = useState([1]);

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
  };

  const MydocumentButtonShow = () => {
    setSharemebtn(false);
  };
  const showCancellUploadModal = () => {
    setCanceluploadmodal(true);
  };
  const showUploadOptionsModal = () => {
    setUploadOptionsmodal(!uploadOptionsmodal);
  };
  const selectDropdownbox = () => {
    setDropDown(!dropdown);
  };
  const openFolderModal = () => {
    setFolderModal(true);
  };

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
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <Checkbox />
              <span>Folder</span>
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
              <img src={add} height="10.71px" width="15.02px" />
              <img src={download} height="10.71px" width="15.02px" />
              <img src={del} height="10.71px" width="15.02px" />
              <img src={start} height="10.71px" width="15.02px" />
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
              <img src={file} height="14.73px" width="12.63px" />
              <span className={styles["name_of_life"]}>DairaLogo.pdf</span>
              <img src={person} width="13.44px" height="10.71px" />
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
              <img src={add} height="10.71px" width="15.02px" />
              <img src={download} height="10.71px" width="15.02px" />
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
            <Col lg={12} md={12} sm={12} className="d-flex gap-2">
              <Checkbox />
              <span>Folder</span>
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
              <img src={file} height="14.73px" width="12.63px" />
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
        {dropdown ? (
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className={styles["DropDown"]}>
                <Row className="mt-2">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2 align-items-center"
                  >
                    <img
                      src={plus}
                      height="10.8"
                      width="12px"
                      onClick={openFolderModal}
                    />
                    <span className={styles["New_folder"]}>New Folder</span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-center gap-2 align-items-center"
                  >
                    <img src={plus} height="10.8" width="12px" />
                    <span className={styles["New_folder"]}>File Upload</span>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end align-items-center  "
                  >
                    <img
                      src={plus}
                      height="10.8"
                      width="12px"
                      className={styles["Folder_icon"]}
                    />
                    <span className={styles["Folder_Upload"]}>
                      Folder Upload
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
              <Col
                lg={5}
                md={5}
                sm={5}
                className="d-flex justify-content-start gap-3"
              >
                <span className={styles["Data_room_heading"]}>
                  {t("Data_room")}
                </span>
                <Button
                  className={styles["Data_room_new_btn"]}
                  text={t("New")}
                  icon={
                    <img
                      src={down}
                      height="6px"
                      width="13px"
                      className={styles["Dropdown_btn"]}
                    />
                  }
                  onClick={selectDropdownbox}
                />
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
              <Col lg={1} md={1} sm={1}></Col>
            </Row>

            <Row className="mt-2">
              <Col lg={12} md={12} sm={12}>
                <Paper className={styles["Data_room_paper"]}>
                  <Row>
                    <Col lg={12} md={12} sm={12} className="d-flex gap-3">
                      <Button
                        text={t("My-document")}
                        className={styles["myDocument_btn"]}
                        // onClick={showUploadOptionsModal}
                        onClick={MydocumentButtonShow}
                      />
                      <Button
                        text={t("Shared-with-me")}
                        className={styles["Shared_with_me_btn"]}
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
                            Search Results
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <Row>
                            <Col lg={3} md={3} sm={3}>
                              <SelectBox placeholder="File type" />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <SelectBox placeholder="Location" />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <SelectBox placeholder="people" />
                            </Col>
                            <Col lg={3} md={3} sm={3}>
                              <SelectBox placeholder="Last Modified" />
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
                            Clear All
                          </span>
                        </Col>
                      </Row>
                    </>
                  ) : null}
                  {sharemebtn ? (
                    <>
                      <Row className="mt-3">
                        <Col lg={12} sm={12} md={12}>
                          {rows.length > 0 &&
                          rows !== undefined &&
                          rows !== null ? (
                            <>
                              <TableToDo
                                sortDirections={["descend", "ascend"]}
                                column={shareWithmeColoumns}
                                className={"Resolution"}
                                rows={SharedwithmeTableData}
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
                                    There are no Files Shared!
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
                                    With you!
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
                          {rows.length > 0 &&
                          rows !== undefined &&
                          rows !== null ? (
                            <>
                              <TableToDo
                                sortDirections={["descend", "ascend"]}
                                column={MyDocumentsColumns}
                                className={"Resolution"}
                                rows={MyDocumentsRowData}
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
                                    There are no items here!
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
                                    Start adding your documents
                                  </span>
                                </Col>
                              </Row>
                              <Row className="mt-4">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center"
                                >
                                  <img
                                    src={icon}
                                    heigh="356.89"
                                    width="356.89"
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
    </>
  );
};

export default DataRoom;
