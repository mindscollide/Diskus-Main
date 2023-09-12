import React, { useEffect, useRef, useState } from "react";
import docIcon from "../../../assets/images/AttachmentIcons/doc.svg";
import pdfIcon from "../../../assets/images/AttachmentIcons/pdf.svg";
import photosIcon from "../../../assets/images/AttachmentIcons/photos.svg";
import pptIcon from "../../../assets/images/AttachmentIcons/ppt.svg";
import videoIcon from "../../../assets/images/AttachmentIcons/video.svg";
import xlsFileIcon from "../../../assets/images/AttachmentIcons/xls-file.svg";
import sharedIcon from "../../../assets/images/shared_icon.svg";
import featherfolder from "../../../assets/images/feather-folder.svg";
import CheckIconDropdown from "../../../assets/images/check__sign_dropdown.svg";
import CrossIconDropdown from "../../../assets/images/cross__sign_dropdown.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd/lib";
import { Row, Col } from "react-bootstrap";
import { Button, Modal, TableToDo } from "../../../components/elements";
import GridViewDataRoom from "../GridViewDataRoom/GridViewDataRoom";
import styles from "./searchComponent.module.css";
import {
  OptionsDocument,
  optionsforFile,
  optionsforFolder,
  optionsLastmodified,
  optionsLocations,
  OptionsOwner,
} from "./option";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  formatDateToMMDDYY,
  _justShowDateformat,
} from "../../../commen/functions/date_formater";
import DatePicker, { DateObject } from "react-multi-date-picker";
import { searchDocumentsAndFoldersApi } from "../../../store/actions/DataRoom_actions";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
const SearchComponent = ({
  setSearchDataFields,
  searchDataFields,
  getFolderDocuments,
  gridbtnactive,
  listviewactive,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const calendRef = useRef();
  const { DataRoomReducer } = useSelector((state) => state);
  const [searchAllData, setSearchAllData] = useState([]);
  const [customRangeVisible, setCustomRangeVisible] = useState(false);
  const [dateValue, setDateValue] = useState(t("Last-modified"));
  let lang = localStorage.getItem("i18nextLng");
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);

  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );

  // these are search columns
  const searchColumns = [
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
      title: t("Last-modified"),
      dataIndex: "modifiedDate",
      key: "modifiedDate",
      width: "110px",
      align: "center",
      sorter: true,
      sortOrder: true,
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
  ];
  useEffect(() => {
    if (lang !== undefined) {
      if (lang === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (lang === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [lang]);
  // this is for deta set into table
  useEffect(() => {
    console.log(
      DataRoomReducer.SearchFilesAndFoldersResponse,
      "DataRoomReducer.SearchFilesAndFoldersResponse"
    );
    try {
      if (DataRoomReducer.SearchFilesAndFoldersResponse) {
        setSearchAllData(DataRoomReducer.SearchFilesAndFoldersResponse);
      } else {
        setSearchAllData([]);
      }
    } catch (error) {}
  }, [DataRoomReducer.SearchFilesAndFoldersResponse]);
  // api call onscroll
  const handleSortMyDocuments = (pagination, filters, sorter) => {};

  const handleScroll = async (e) => {
    // const { scrollHeight, scrollTop, clientHeight } = e.target;
    // if (scrollHeight - scrollTop === clientHeight) {
    //   if (sRowsData < totalRecords) {
    //     if (DataRoomReducer.dataBehaviour === false) {
    //       if (
    //         viewFolderID !== null &&
    //         viewFolderID !== undefined &&
    //         Number(viewFolderID) !== 0
    //       ) {
    //       } else {
    //       }
    //     }
    //   }
    // }
  };

  // this is onchange envent of search component Documnet
  const handleChangeDocumentsOptions = (event) => {
    if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: true,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: true,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 3) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: true,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: true,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 4) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: true,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: true,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 5) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: true,
        isPDF: false,
        isFolders: false,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: true,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 7) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: true,
        isFolders: false,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: true,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 10) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: true,
        isVideos: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: true,
        isVideos: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 8) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: true,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: true,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
    }
  };
  // this is for Location
  const handleChangeLocationValue = (event) => {
    setSearchDataFields({
      ...searchDataFields,
      StatusID: parseInt(event.value),
    });
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: parseInt(event.value),
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: 0,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 50,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
  };
  // this is for  people
  const handleChangeStatus = (event) => {
    if (event.value === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: searchDataFields.isDocument,
        isSpreadSheet: searchDataFields.isSpreadSheet,
        isPresentation: searchDataFields.isPresentation,
        isForms: searchDataFields.isForms,
        isPDF: searchDataFields.isPDF,
        isFolders: searchDataFields.isFolders,
        isVideos: searchDataFields.isVideos,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: 0,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: true,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: searchDataFields.isDocument,
        isSpreadSheet: searchDataFields.isSpreadSheet,
        isPresentation: searchDataFields.isPresentation,
        isForms: searchDataFields.isForms,
        isPDF: searchDataFields.isPDF,
        isFolders: searchDataFields.isFolders,
        isVideos: searchDataFields.isVideos,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: true,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 3) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: true,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: searchDataFields.isDocument,
        isSpreadSheet: searchDataFields.isSpreadSheet,
        isPresentation: searchDataFields.isPresentation,
        isForms: searchDataFields.isForms,
        isPDF: searchDataFields.isPDF,
        isFolders: searchDataFields.isFolders,
        isVideos: searchDataFields.isVideos,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: false,
        isNotOwnedByMe: true,
        isSpecificUser: false,
        UserIDToSearch: 0,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: true,
        UserIDToSearch: parseInt(userID),
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: searchDataFields.isDocument,
        isSpreadSheet: searchDataFields.isSpreadSheet,
        isPresentation: searchDataFields.isPresentation,
        isForms: searchDataFields.isForms,
        isPDF: searchDataFields.isPDF,
        isFolders: searchDataFields.isFolders,
        isVideos: searchDataFields.isVideos,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: true,
        UserIDToSearch: parseInt(userID),
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    }
  };

  // Search Box Last modified Date handle Change Function
  const handleChangeLastModifedDate = (event) => {
    setDateValue(event.label);
    const currentDate = new Date();
    let startDate = null;
    let endDate = null;
    let DateNewStart = new Date(startDate);
    const formattedNewDate = formatDateToMMDDYY(DateNewStart);
    let DateEndStart = new Date(endDate);
    const formattedEndDate = formatDateToMMDDYY(DateEndStart);
    const validFormattedNewDate =
      formattedNewDate !== "NaN" ? formattedNewDate : "";
    const validFormattedEndDate =
      formattedEndDate !== "NaN" ? formattedEndDate : "";
    let data = {};
    switch (event.value) {
      case 1: // Any-time
        // No specific date range, so no need to set start and end dates.
        setCustomRangeVisible(false);
        break;
      case 2: // Today
        startDate = new Date(currentDate);
        endDate = new Date(currentDate);
        setCustomRangeVisible(false);
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: endDate,
          LastModifiedStartDate: startDate,
        });
        data = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(organizationID),
          StatusID: searchDataFields.StatusID,
          Title: searchDataFields.Title,
          isDocument: searchDataFields.isDocument,
          isSpreadSheet: searchDataFields.isSpreadSheet,
          isPresentation: searchDataFields.isPresentation,
          isForms: searchDataFields.isForms,
          isPDF: searchDataFields.isPDF,
          isFolders: searchDataFields.isFolders,
          isVideos: searchDataFields.isVideos,
          LastModifiedStartDate: validFormattedNewDate,
          LastModifiedEndDate: validFormattedEndDate,
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 50,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
        break;
      case 3: // Last 7 days
        endDate = new Date(currentDate);
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 7);
        setCustomRangeVisible(false);
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: endDate,
          LastModifiedStartDate: startDate,
        });

        data = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(organizationID),
          StatusID: searchDataFields.StatusID,
          Title: searchDataFields.Title,
          isDocument: searchDataFields.isDocument,
          isSpreadSheet: searchDataFields.isSpreadSheet,
          isPresentation: searchDataFields.isPresentation,
          isForms: searchDataFields.isForms,
          isPDF: searchDataFields.isPDF,
          isFolders: searchDataFields.isFolders,
          isVideos: searchDataFields.isVideos,
          LastModifiedStartDate: validFormattedNewDate,
          LastModifiedEndDate: validFormattedEndDate,
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 50,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
        break;
      case 4: // Last 30 days
        endDate = new Date(currentDate);
        startDate = new Date(currentDate);
        startDate.setDate(currentDate.getDate() - 30);
        setCustomRangeVisible(false);
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: endDate,
          LastModifiedStartDate: startDate,
        });
        data = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(organizationID),
          StatusID: searchDataFields.StatusID,
          Title: searchDataFields.Title,
          isDocument: searchDataFields.isDocument,
          isSpreadSheet: searchDataFields.isSpreadSheet,
          isPresentation: searchDataFields.isPresentation,
          isForms: searchDataFields.isForms,
          isPDF: searchDataFields.isPDF,
          isFolders: searchDataFields.isFolders,
          isVideos: searchDataFields.isVideos,
          LastModifiedStartDate: validFormattedNewDate,
          LastModifiedEndDate: validFormattedEndDate,
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 50,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
        break;
      case 5: // This year (2023)
        startDate = new Date(currentDate.getFullYear(), 0, 1); // January 1, 2023
        endDate = new Date(currentDate);
        setCustomRangeVisible(false);
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: endDate,
          LastModifiedStartDate: startDate,
        });
        data = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(organizationID),
          StatusID: searchDataFields.StatusID,
          Title: searchDataFields.Title,
          isDocument: searchDataFields.isDocument,
          isSpreadSheet: searchDataFields.isSpreadSheet,
          isPresentation: searchDataFields.isPresentation,
          isForms: searchDataFields.isForms,
          isPDF: searchDataFields.isPDF,
          isFolders: searchDataFields.isFolders,
          isVideos: searchDataFields.isVideos,
          LastModifiedStartDate: validFormattedNewDate,
          LastModifiedEndDate: validFormattedEndDate,
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 50,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
        break;
      case 6: // Last year (2022)
        startDate = new Date(currentDate.getFullYear() - 1, 0, 1); // January 1, 2022
        endDate = new Date(currentDate.getFullYear() - 1, 11, 31); // December 31, 2022
        setCustomRangeVisible(false);
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: endDate,
          LastModifiedStartDate: startDate,
        });
        data = {
          UserID: parseInt(userID),
          OrganizationID: parseInt(organizationID),
          StatusID: searchDataFields.StatusID,
          Title: searchDataFields.Title,
          isDocument: searchDataFields.isDocument,
          isSpreadSheet: searchDataFields.isSpreadSheet,
          isPresentation: searchDataFields.isPresentation,
          isForms: searchDataFields.isForms,
          isPDF: searchDataFields.isPDF,
          isFolders: searchDataFields.isFolders,
          isVideos: searchDataFields.isVideos,
          LastModifiedStartDate: validFormattedNewDate,
          LastModifiedEndDate: validFormattedEndDate,
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 50,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
        break;
      case 7: // Custom range
        setCustomRangeVisible(true);
        break;
      default:
        break;
    }
    return { startDate, endDate };
  };

  // thisw is for cleare state
  const handleClearAllSearchOptions = () => {
    setDateValue(t("Last-modified"));
    setSearchDataFields({
      UserID: userID ? parseInt(userID) : 0,
      OrganizationID: organizationID
        ? parseInt(organizationID)
        : organizationID,
      StatusID: 0,
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
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
    let data = {
      UserID: userID ? parseInt(userID) : 0,
      OrganizationID: organizationID
        ? parseInt(organizationID)
        : organizationID,
      StatusID: 0,
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
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
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
  };

  // this is select for start date
  const handleStartDatePickerChange = (dates) => {
    const formattedStarttDate = dates
      ? new DateObject(dates).format("DD MMMM, YYYY")
      : "";
    console.log("handleStartDatePickerChange", formattedStarttDate);
    setSearchDataFields({
      ...searchDataFields,
      LastModifiedStartDate: formattedStarttDate,
    });
  };

  // this is select for end date
  const handleEndDatePickerChange = (dates) => {
    const formattedEndtDate = dates
      ? new DateObject(dates).format("DD MMMM, YYYY")
      : "";

    setSearchDataFields({
      ...searchDataFields,
      LastModifiedEndDate: formattedEndtDate,
    });
  };

  // this is search button handler of serach modal
  const handleSearchThroughCustomeRange = async () => {
    let DateNewStart = new Date(searchDataFields.LastModifiedStartDate);
    const formattedNewDate = formatDateToMMDDYY(DateNewStart);
    let DateEndStart = new Date(searchDataFields.LastModifiedEndDate);
    const formattedEndDate = formatDateToMMDDYY(DateEndStart);
    const validFormattedNewDate =
      formattedNewDate !== "NaN" ? formattedNewDate : "";
    const validFormattedEndDate =
      formattedEndDate !== "NaN" ? formattedEndDate : "";

    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: searchDataFields.StatusID,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      LastModifiedStartDate: validFormattedNewDate,
      LastModifiedEndDate: validFormattedEndDate,
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 50,
      SortBy: searchDataFields.SortBy,
      isDescending: searchDataFields.isDescending,
    };
    await dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    setCustomRangeVisible(false);
  };

  // const cross button on documents dropdowns
  const ClearDocumentsType = () => {
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: searchDataFields.StatusID,
      Title: searchDataFields.Title,
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 50,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
    });
  };

  // document location clear function
  const ClearDocumentLocation = () => {
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 0,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 50,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      StatusID: 0,
    });
  };

  // document people type

  const clearPeopleType = () => {
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 0,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      isOwnedByMe: false,
      isNotOwnedByMe: false,
      isSpecificUser: false,
      UserIDToSearch: 0,
      sRow: 0,
      Length: 50,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      isOwnedByMe: false,
      isNotOwnedByMe: false,
      isSpecificUser: false,
      UserIDToSearch: 0,
    });
  };

  // Clear Last Modified Date
  const clearLastModified = () => {
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 0,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      LastModifiedEndDate: "",
      LastModifiedStartDate: "",
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 50,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      LastModifiedEndDate: "",
      LastModifiedStartDate: "",
    });
  };

  return (
    <>
      <Row className="mt-3">
        <Col lg={12} md={12} sm={12}>
          <span className={styles["Search_result_Heading"]}>
            {t("Search-results")}
          </span>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col
          lg={2}
          md={2}
          sm={12}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          {searchDataFields.isDocument ||
          searchDataFields.isDocument ||
          searchDataFields.isSpreadSheet ||
          searchDataFields.isPresentation ||
          searchDataFields.isForms ||
          searchDataFields.isPDF ||
          searchDataFields.isFolders ||
          searchDataFields.isVideos ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img width="12px" height="12px" alt="" src={CheckIconDropdown} />
              <p className={styles["overflow-text"]}>
                {searchDataFields.isDocument
                  ? t("Document")
                  : searchDataFields.isSpreadSheet
                  ? t("Spreadsheets")
                  : searchDataFields.isPresentation
                  ? t("Presentaion")
                  : searchDataFields.isForms
                  ? t("Forms")
                  : searchDataFields.isPDF
                  ? t("PDFs")
                  : searchDataFields.isFolders
                  ? t("Folder")
                  : searchDataFields.isVideos
                  ? t("Videos")
                  : t("Any")}
              </p>
              <img
                width="12px"
                height="12px"
                alt=""
                src={CrossIconDropdown}
                className="cursor-pointer"
                onClick={ClearDocumentsType}
              />
            </div>
          ) : (
            <Select
              classNamePrefix={"searchResult_Document"}
              options={OptionsDocument(t)}
              placeholder={t("Documents")}
              isSearchable={false}
              onChange={handleChangeDocumentsOptions}
              // defaultValue={{
              //   value: searchResultsFields.DocumentType.value,
              //   label: searchResultsFields.DocumentType.label
              // }}
            />
          )}
        </Col>
        <Col
          lg={2}
          md={2}
          sm={3}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          {searchDataFields.StatusID !== 0 ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img width="12px" height="12px" alt="" src={CheckIconDropdown} />
              <p className={styles["overflow-text"]}>
                {searchDataFields.StatusID === 1
                  ? t("My-documents")
                  : searchDataFields.StatusID === 2
                  ? t("Shared-with-me")
                  : t("Any-where-in-dataRoom")}
              </p>
              <img
                width="12px"
                height="12px"
                alt=""
                src={CrossIconDropdown}
                className="cursor-pointer"
                onClick={ClearDocumentLocation}
              />
            </div>
          ) : (
            <Select
              classNamePrefix={"searchResult_Document"}
              options={optionsLocations(t)}
              placeholder={t("Location")}
              isSearchable={false}
              onChange={handleChangeLocationValue}
              // value={{
              //   value: searchResultsFields.documentLocation.value,
              //   label: searchResultsFields.documentLocation.label
              // }}
            />
          )}
        </Col>
        <Col
          lg={2}
          md={2}
          sm={3}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          {searchDataFields.isOwnedByMe ||
          searchDataFields.isNotOwnedByMe ||
          searchDataFields.isSpecificUser ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img width="12px" alt="" height="12px" src={CheckIconDropdown} />
              <p className={styles["overflow-text"]}>
                {searchDataFields.isOwnedByMe
                  ? t("Owned-by-me")
                  : searchDataFields.isNotOwnedByMe
                  ? t("Not-owned-by-me")
                  : searchDataFields.isSpecificUser
                  ? t("Specific-person")
                  : t("Anyone")}
              </p>
              <img
                width="12px"
                height="12px"
                alt=""
                src={CrossIconDropdown}
                className="cursor-pointer"
                onClick={clearPeopleType}
              />
            </div>
          ) : (
            <Select
              options={OptionsOwner(t)}
              placeholder={t("People")}
              classNamePrefix={"searchResult_Document"}
              onChange={handleChangeStatus}
              isSearchable={false}
              // value={{
              //   label: searchResultsFields.userPermission.label,
              //   value: searchResultsFields.userPermission.value
              // }}
            />
          )}
        </Col>
        <Col
          lg={2}
          md={2}
          sm={2}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          {searchDataFields.LastModifiedStartDate !== "" &&
          searchDataFields.LastModifiedEndDate !== "" ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img width="12px" height="12px" alt="" src={CheckIconDropdown} />
              <p className={styles["overflow-text"]}> {dateValue}</p>
              <img
                width="12px"
                height="12px"
                src={CrossIconDropdown}
                alt=""
                className="cursor-pointer"
                onClick={clearLastModified}
              />
            </div>
          ) : (
            <Select
              options={optionsLastmodified(t)}
              classNamePrefix={"searchResult_Document"}
              placeholder={
                <span className={styles["placeholder-text"]}>{dateValue}</span>
              }
              onChange={handleChangeLastModifedDate}
              isSearchable={false}
            />
          )}
        </Col>
        <Col
          lg={2}
          md={2}
          sm={2}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          <span
            className={styles["Clear_All_btn"]}
            onClick={handleClearAllSearchOptions}
          >
            {t("Clear-all")}
          </span>
        </Col>
      </Row>
      {searchAllData &&
      searchAllData !== undefined &&
      searchAllData !== null &&
      gridbtnactive ? (
        <>
          <GridViewDataRoom
            data={searchAllData}
            optionsforFolder={optionsforFolder(t)}
            optionsforFile={optionsforFile(t)}
            // sRowsData={sRowsData}
            // totalRecords={totalRecords}
            // filter_Value={filterValue}
          />
        </>
      ) : searchAllData &&
        searchAllData !== undefined &&
        searchAllData !== null &&
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
              column={searchColumns}
              className={"DataRoom_Table"}
              rows={searchAllData}
              pagination={false}
              onChange={handleSortMyDocuments}
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
        <div className={styles["empty-search-state"]}>
          <Row className="mt-2">
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center"
            >
              <span className={styles["Message_nofiles"]}>
                {t("There-are-no-items-here")}
              </span>
            </Col>
          </Row>
        </div>
      )}
      <Modal
        show={customRangeVisible}
        onHide={() => {
          setCustomRangeVisible(false);
        }}
        setShow={setCustomRangeVisible}
        // modalFooterClassName="modalMeetingCreateFooter"
        centered
        ModalTitle={
          <>
            <Row>
              <Col>
                <span className={styles["custom_date_range_heading"]}>
                  {t("Custom-date-range")}
                </span>
              </Col>
            </Row>
          </>
        }
        ModalBody={
          <>
            <Row className="mt-2">
              <Col
                lg={6}
                md={6}
                sm={12}
                className={styles["datePickerTodoCreate2"]}
              >
                <DatePicker
                  format={"MM DD, YYYY"}
                  render={
                    <InputIcon
                      placeholder={t("select-start-date")}
                      className={styles["datepicker_input"]}
                    />
                  }
                  editable={false}
                  // value={searchDataFields.LastModifiedStartDate}
                  onChange={handleStartDatePickerChange}
                  inputMode=""
                  calendar={calendarValue}
                  locale={localValue}
                  ref={calendRef}
                />
              </Col>
              <Col
                lg={6}
                md={6}
                sm={6}
                className={styles["datePickerTodoCreate2"]}
              >
                {" "}
                <DatePicker
                  format={"MM DD, YYYY"}
                  render={
                    <InputIcon
                      placeholder={t("select-end-date")}
                      className={styles["datepicker_input"]}
                    />
                  }
                  editable={false}
                  inputMode=""
                  onChange={handleEndDatePickerChange}
                  calendar={calendarValue}
                  // value={searchDataFields.LastModifiedEndDate}
                  locale={localValue}
                  ref={calendRef}
                />
              </Col>
            </Row>
          </>
        }
        ModalFooter={
          <>
            <Button
              text={t("Search")}
              className={styles["cancell_Search_button_Dataroom"]}
              onClick={handleSearchThroughCustomeRange}
            />
          </>
        }
      />
    </>
  );
};
export default SearchComponent;
