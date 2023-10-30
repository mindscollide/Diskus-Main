import React, { useEffect, useRef, useState } from "react";
import sharedIcon from "../../../assets/images/shared_icon.svg";
import folderColor from "../../../assets/images/folder_color.svg";
import CheckIconDropdown from "../../../assets/images/check__sign_dropdown.svg";
import CrossIconDropdown from "../../../assets/images/cross__sign_dropdown.svg";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd/lib";
import { Row, Col } from "react-bootstrap";
import { Button, Modal, TableToDo } from "../../../components/elements";
import GridViewDataRoom from "../GridViewDataRoom/GridViewDataRoom";
import styles from "./searchComponent.module.css";
import stylesss from "../DataRoom.module.css";
import {
  getFileExtension,
  getIconSource,
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
  formatDateToUTC,
  _justShowDateformat,
} from "../../../commen/functions/date_formater";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {
  dataBehaviour,
  searchDocumentsAndFoldersApi,
} from "../../../store/actions/DataRoom_actions";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import InputIcon from "react-multi-date-picker/components/input_icon";
import InfiniteScroll from "react-infinite-scroll-component";
const SearchComponent = ({
  setSearchDataFields,
  searchDataFields,
  getFolderDocuments,
  gridbtnactive,
  listviewactive,
  setSearchResultFields,
  searchResultsFields,
  setSearchTabOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const calendRef = useRef();
  const { DataRoomReducer, assignees } = useSelector((state) => state);
  const [searchAllData, setSearchAllData] = useState([]);
  const [sRowsData, setSRowsData] = useState(0);
  const [customRangeVisible, setCustomRangeVisible] = useState(false);
  const [dateValue, setDateValue] = useState(t("Date-modified"));
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  // all assignees
  const [assignessList, setAssignessList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0); // Initial filter value
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 36,
      }}
      spin
    />
  );
  let userID = localStorage.getItem("userID");
  let lang = localStorage.getItem("i18nextLng");
  let organizationID = localStorage.getItem("organizationID");
  // these are search columns
  const searchColumns = [
    {
      title: t("Name"),
      dataIndex: "name",
      key: "name",
      width: "200px",
      sortDirections: ["descend", "ascend"],
      ellipsis: true,
      render: (text, data) => {
        if (data.isShared) {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]} ${"d-flex gap-2"}`}>
                <img draggable="false" src={folderColor} alt="" />
                <abbr title={text}>
                  <span
                    className={`${
                      stylesss["dataroom_table_heading"]
                    } ${"cursor-pointer"}`}
                    onClick={() => getFolderDocuments(data.id)}
                  >
                    {text} <img draggable="false" src={sharedIcon} alt="" />
                  </span>
                </abbr>
              </div>
            );
          } else {
            return (
              <>
                <section className="d-flex gap-2">
                  <img
                    draggable="false"
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                  />
                  <abbr title={text}>
                    <span className={stylesss["dataroom_table_heading"]}>
                      {text} <img draggable="false" src={sharedIcon} alt="" />
                    </span>
                  </abbr>
                </section>
              </>
            );
          }
        } else {
          if (data.isFolder) {
            return (
              <div className={`${styles["dataFolderRow"]} ${"d-flex gap-2"}`}>
                <img draggable="false" src={folderColor} alt="" />
                <abbr title={text}>
                  <span
                    className={`${
                      stylesss["dataroom_table_heading"]
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
                    draggable="false"
                    src={getIconSource(getFileExtension(data.name))}
                    alt=""
                  />

                  <abbr title={text}>
                    <span className={stylesss["dataroom_table_heading"]}>
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
          <span className={stylesss["dataroom_table_heading"]}>
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
    try {
      if (
        DataRoomReducer.SearchFilesAndFoldersResponse !== null &&
        DataRoomReducer.SearchFilesAndFoldersResponse !== undefined &&
        DataRoomReducer.SearchFilesAndFoldersResponse.length > 0
      ) {
        if (DataRoomReducer.dataBehaviour) {
          dispatch(dataBehaviour(false));
          let copyData = [...searchAllData];
          DataRoomReducer.SearchFilesAndFoldersResponse.map((data, index) => {
            copyData.push(data);
          });
          setSearchAllData(copyData);
          setTotalRecords(DataRoomReducer.SearchFileListCount);
          setSRowsData(
            (prev) =>
              prev + DataRoomReducer.SearchFilesAndFoldersResponse.length
          );
        } else {
          dispatch(dataBehaviour(false));
          setSearchAllData(DataRoomReducer.SearchFilesAndFoldersResponse);
          setTotalRecords(DataRoomReducer.SearchFileListCount);
          setSRowsData(DataRoomReducer.SearchFilesAndFoldersResponse.length);
        }
      } else {
        // setSearchAllData([]);
      }
    } catch (error) {}
  }, [
    DataRoomReducer.SearchFilesAndFoldersResponse,
    DataRoomReducer.SearchFileListCount,
  ]);

  // Transform the API response to match the options structure
  const transformedOptions = assignessList.map((user) => ({
    value: user.pK_UID,
    label: (
      <>
        <span className="d-flex align-items-center gap-2" key={user.pK_UID}>
          <img
            draggable="false"
            width={"25px"}
            height="25px"
            className="rounded-circle  "
            src={`data:image/jpeg;base64,${user.displayProfilePictureName}`}
            alt=""
          />
          {user.name}
        </span>
      </>
    ),
  }));

  //this is user list
  useEffect(() => {
    try {
      if (assignees.user) {
        const filteredApiResponse = assignees.user.filter(
          (user) => !userID.includes(user.pK_UID)
        );
        setAssignessList(filteredApiResponse);
      }
    } catch {}
  }, [assignees.user]);

  // api call onscroll
  const handleSortMyDocuments = (pagination, filters, sorter) => {};
  const handleScroll = async (e) => {
    if (sRowsData <= totalRecords) {
      await dispatch(dataBehaviour(true));
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
        isImages: searchDataFields.isImages,
        isAudios: searchDataFields.isAudios,
        isSites: searchDataFields.isSites,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: 0,
        isOwnedByMe: true,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: sRowsData,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      await dispatch(searchDocumentsAndFoldersApi(navigate, t, data, 1));
    }
  };
  console.log(searchResultsFields, "searchResultsFieldssearchResultsFields");
  // this is onchange envent of search modal Documnet
  const handleChangeDocumentsOptions = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Type: event, // Update the Type field
    }));
    if (event.value === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: true,
        isSpreadSheet: true,
        isPresentation: true,
        isForms: true,
        isPDF: true,
        isFolders: true,
        isVideos: true,
        isImages: true,
        isAudios: true,
        isSites: true,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: searchDataFields.StatusID,
        Title: searchDataFields.Title,
        isDocument: true,
        isSpreadSheet: true,
        isPresentation: true,
        isForms: true,
        isPDF: true,
        isFolders: true,
        isVideos: true,
        isImages: true,
        isAudios: true,
        isSites: true,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: true,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 6) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isImages: true,
        isAudios: false,
        isSites: false,
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
        isVideos: false,
        isImages: true,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
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
        isImages: false,
        isAudios: false,
        isSites: false,
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
        isImages: false,
        isAudios: false,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 11) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isImages: false,
        isAudios: false,
        isSites: true,
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
        isVideos: false,
        isImages: false,
        isAudios: false,
        isSites: true,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 12) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isImages: false,
        isAudios: true,
        isSites: false,
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
        isVideos: false,
        isImages: false,
        isAudios: true,
        isSites: false,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: searchDataFields.isOwnedByMe,
        //  isNotOwnedByMe: false,

        isSpecificUser: searchDataFields.isSpecificUser,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
    }
  };
  // this is for Location
  const handleChangeLocationValue = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Location: event, // Update the Type field
    }));
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
      isImages: searchDataFields.isImages,
      isAudios: searchDataFields.isAudios,
      isSites: searchDataFields.isSites,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: 0,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      //  isNotOwnedByMe: false,

      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
  };

  // this is for  people
  const handleChangeStatus = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      People: event, // Update the Type field
    }));
    if (event.value === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        //     isNotOwnedByMe: false,

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
        isImages: searchDataFields.isImages,
        isAudios: searchDataFields.isAudios,
        isSites: searchDataFields.isSites,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        UserIDToSearch: 0,
        isOwnedByMe: false,
        //     isNotOwnedByMe: false,

        isSpecificUser: false,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: true,
        //     isNotOwnedByMe: false,

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
        isImages: searchDataFields.isImages,
        isAudios: searchDataFields.isAudios,
        isSites: searchDataFields.isSites,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: true,
        //     isNotOwnedByMe: false,

        isSpecificUser: false,
        UserIDToSearch: 0,
        sRow: 0,
        Length: 10,
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
        isImages: searchDataFields.isImages,
        isAudios: searchDataFields.isAudios,
        isSites: searchDataFields.isSites,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: false,
        isNotOwnedByMe: true,
        isSpecificUser: false,
        UserIDToSearch: 0,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: true,
        //     isNotOwnedByMe: false,

        isSpecificUser: true,
        UserIDToSearch: parseInt(event.value),
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
        isImages: searchDataFields.isImages,
        isAudios: searchDataFields.isAudios,
        isSites: searchDataFields.isSites,
        LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
        LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
        isOwnedByMe: true,
        //     isNotOwnedByMe: false,

        isSpecificUser: true,
        UserIDToSearch: parseInt(event.value),
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: searchDataFields.isDescending,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    }
  };

  // Search Box Last modified Date handle Change Function
  const handleChangeLastModifedDate = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Date: event, // Update the Type field
    }));
    setDateValue(event.label);
    const currentDate = new Date();
    let startDate = null;
    let endDate = null;
    let data = {};
    switch (event.value) {
      case 1: // Any-time
        // No specific date range, so no need to set start and end dates.
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: "",
          LastModifiedEndDate: "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
          SortBy: 1,
          isDescending: searchDataFields.isDescending,
        };
        dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: formatDateToUTC(startDate)
            ? formatDateToUTC(startDate)
            : "",
          LastModifiedEndDate: formatDateToUTC(endDate)
            ? formatDateToUTC(endDate)
            : "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: formatDateToUTC(startDate)
            ? formatDateToUTC(startDate)
            : "",
          LastModifiedEndDate: formatDateToUTC(endDate)
            ? formatDateToUTC(endDate)
            : "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: formatDateToUTC(startDate)
            ? formatDateToUTC(startDate)
            : "",
          LastModifiedEndDate: formatDateToUTC(endDate)
            ? formatDateToUTC(endDate)
            : "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: formatDateToUTC(startDate)
            ? formatDateToUTC(startDate)
            : "",
          LastModifiedEndDate: formatDateToUTC(endDate)
            ? formatDateToUTC(endDate)
            : "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
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
          isImages: searchDataFields.isImages,
          isAudios: searchDataFields.isAudios,
          isSites: searchDataFields.isSites,
          LastModifiedStartDate: formatDateToUTC(startDate)
            ? formatDateToUTC(startDate)
            : "",
          LastModifiedEndDate: formatDateToUTC(endDate)
            ? formatDateToUTC(endDate)
            : "",
          UserIDToSearch: searchDataFields.UserIDToSearch,
          isOwnedByMe: searchDataFields.isOwnedByMe,
          //  isNotOwnedByMe: false,

          isSpecificUser: searchDataFields.isSpecificUser,
          sRow: 0,
          Length: 10,
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

  // this is for cleare state
  const handleClearAllSearchOptions = () => {
    setSearchTabOpen(false);
    // setSearchbarsearchoptions(false);
    setDateValue(t("Date-modified"));
    setSearchDataFields({
      UserID: userID ? parseInt(userID) : 0,
      OrganizationID: organizationID
        ? parseInt(organizationID)
        : organizationID,
      StatusID: 3,
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
      isImages: false,
      isAudios: false,
      isSites: false,
      LastModifiedStartDate: "",
      LastModifiedEndDate: "",
      UserIDToSearch: 0,
      isOwnedByMe: false,
      //     isNotOwnedByMe: false,

      isSpecificUser: false,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: false,
    });
    let data = {
      UserID: userID ? parseInt(userID) : 0,
      OrganizationID: organizationID
        ? parseInt(organizationID)
        : organizationID,
      StatusID: 3,
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
      isImages: false,
      isAudios: false,
      isSites: false,
      LastModifiedStartDate: "",
      LastModifiedEndDate: "",
      UserIDToSearch: 0,
      isOwnedByMe: false,
      //     isNotOwnedByMe: false,

      isSpecificUser: false,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: false,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    setSearchResultFields({
      Date: null,
      Type: null,
      Location: {
        value: 3,
        label: t("Any-where-in-dataRoom"),
      },
      People: null,
    });

    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  // this is select for start date
  const handleStartDatePickerChange = (dates) => {
    const formattedStarttDate = dates
      ? new DateObject(dates).format("DD MMMM, YYYY")
      : "";
    setSelectedStartDate(dates);
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
    setSelectedEndDate(dates);
    setSearchDataFields({
      ...searchDataFields,
      LastModifiedEndDate: formattedEndtDate,
    });
  };

  // this is search button handler of serach modal
  const handleSearchThroughCustomeRange = async () => {
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
      isImages: searchDataFields.isImages,
      isAudios: searchDataFields.isAudios,
      isSites: searchDataFields.isSites,
      LastModifiedStartDate: formatDateToUTC(
        searchDataFields.LastModifiedStartDate
      )
        ? formatDateToUTC(searchDataFields.LastModifiedStartDate)
        : "",
      LastModifiedEndDate: formatDateToUTC(searchDataFields.LastModifiedEndDate)
        ? formatDateToUTC(searchDataFields.LastModifiedEndDate)
        : "",
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      //  isNotOwnedByMe: false,

      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
      SortBy: searchDataFields.SortBy,
      isDescending: searchDataFields.isDescending,
    };
    await dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    setCustomRangeVisible(false);
  };

  // const cross button on documents dropdowns
  const ClearDocumentsType = () => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Type: null, // Update the Type field
    }));
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
      isImages: false,
      isAudios: false,
      isSites: false,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      //  isNotOwnedByMe: false,

      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    setSearchDataFields({
      ...searchDataFields,
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isPDF: false,
      isFolders: false,
      isVideos: false,
      isImages: false,
      isAudios: false,
      isSites: false,
    });
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
  };

  // document location clear function
  const ClearDocumentLocation = () => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Location: {
        value: 3,
        label: t("Any-where-in-dataRoom"),
      }, // Update the Type field
    }));
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 3,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      isImages: searchDataFields.isImages,
      isAudios: searchDataFields.isAudios,
      isSites: searchDataFields.isSites,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      //  isNotOwnedByMe: false,

      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
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
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      People: null, // Update the Type field
    }));
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 3,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      isImages: searchDataFields.isImages,
      isAudios: searchDataFields.isAudios,
      isSites: searchDataFields.isSites,
      LastModifiedStartDate: searchDataFields.LastModifiedStartDate,
      LastModifiedEndDate: searchDataFields.LastModifiedEndDate,
      isOwnedByMe: true,
      isSpecificUser: false,
      UserIDToSearch: 0,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      isOwnedByMe: false,
      isSpecificUser: false,
      UserIDToSearch: 0,
    });
  };

  // Clear Last Modified Date
  const clearLastModified = () => {
    let newData = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: 3,
      Title: searchDataFields.Title,
      isDocument: searchDataFields.isDocument,
      isSpreadSheet: searchDataFields.isSpreadSheet,
      isPresentation: searchDataFields.isPresentation,
      isForms: searchDataFields.isForms,
      isPDF: searchDataFields.isPDF,
      isFolders: searchDataFields.isFolders,
      isVideos: searchDataFields.isVideos,
      isImages: searchDataFields.isImages,
      isAudios: searchDataFields.isAudios,
      isSites: searchDataFields.isSites,
      LastModifiedEndDate: "",
      LastModifiedStartDate: "",
      UserIDToSearch: searchDataFields.UserIDToSearch,
      isOwnedByMe: searchDataFields.isOwnedByMe,
      //  isNotOwnedByMe: false,

      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    dispatch(searchDocumentsAndFoldersApi(navigate, t, newData));
    setSearchDataFields({
      ...searchDataFields,
      LastModifiedEndDate: "",
      LastModifiedStartDate: "",
    });
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Date: null, // Update the Type field
    }));
    setDateValue(t("Date-modified"));

    setSelectedStartDate(null);
    setSelectedEndDate(null);
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
          searchDataFields.isVideos ||
          searchDataFields.isImages ||
          searchDataFields.isAudios ||
          searchDataFields.isSites ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img
                draggable="false"
                width="12px"
                height="12px"
                alt=""
                src={CheckIconDropdown}
              />
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
                  : searchDataFields.isVideos
                  ? t("Audio")
                  : searchDataFields.isVideos
                  ? t("Image")
                  : searchDataFields.isVideos
                  ? t("Sites")
                  : searchDataFields.isDocument &&
                    searchDataFields.isDocument &&
                    searchDataFields.isSpreadSheet &&
                    searchDataFields.isPresentation &&
                    searchDataFields.isForms &&
                    searchDataFields.isPDF &&
                    searchDataFields.isFolders &&
                    searchDataFields.isVideos &&
                    searchDataFields.isImages &&
                    searchDataFields.isAudios &&
                    searchDataFields.isSites
                  ? t("Any")
                  : null}
              </p>
              <img
                draggable="false"
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
              <img
                draggable="false"
                width="12px"
                height="12px"
                alt=""
                src={CheckIconDropdown}
              />
              <p className={styles["overflow-text"]}>
                {searchDataFields.StatusID === 1
                  ? t("My-documents")
                  : searchDataFields.StatusID === 2
                  ? t("Shared-with-me")
                  : t("Any-where-in-dataRoom")}
              </p>
              <img
                draggable="false"
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
            />
          )}
        </Col>
        <Col
          lg={2}
          md={2}
          sm={3}
          className={styles["select-dropdowns-height-DataRoom"]}
        >
          {searchDataFields.isOwnedByMe || searchDataFields.isSpecificUser ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img
                draggable="false"
                width="12px"
                alt=""
                height="12px"
                src={CheckIconDropdown}
              />
              <p className={styles["overflow-text"]}>
                {searchDataFields.isOwnedByMe
                  ? t("Owned-by-me")
                  : searchDataFields.isSpecificUser
                  ? t("Specific-person")
                  : t("Anyone")}
              </p>
              <img
                draggable="false"
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
              options={OptionsOwner(t).concat(transformedOptions)}
              placeholder={t("People")}
              classNamePrefix={"searchResult_Document"}
              onChange={handleChangeStatus}
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
          {searchDataFields.LastModifiedStartDate !== "" &&
          searchDataFields.LastModifiedEndDate !== "" ? (
            <div className={styles["dropdown__Document_Value"]}>
              <img
                draggable="false"
                width="12px"
                height="12px"
                alt=""
                src={CheckIconDropdown}
              />
              <p className={styles["overflow-text"]}> {dateValue}</p>
              <img
                draggable="false"
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
          <InfiniteScroll
            dataLength={searchAllData.length}
            next={handleScroll}
            style={{
              overflowX: "hidden",
              overflowY: "auto",
            }}
            hasMore={searchAllData.length === totalRecords ? false : true}
            height={"54vh"}
            endMessage=""
            loader={
              searchAllData.length <= totalRecords && (
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
              data={searchAllData}
              optionsforFolder={optionsforFolder(t)}
              optionsforFile={optionsforFile(t)}
              setSearchTabOpen={setSearchTabOpen}
            />
          </InfiniteScroll>
        </>
      ) : searchAllData &&
        searchAllData !== undefined &&
        searchAllData !== null &&
        listviewactive === true ? (
        <>
          <InfiniteScroll
            dataLength={searchAllData.length}
            next={handleScroll}
            style={{
              overflowX: "hidden",
            }}
            hasMore={searchAllData.length === totalRecords ? false : true}
            height={"57vh"}
            endMessage=""
            loader={
              searchAllData.length <= totalRecords && (
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
              column={searchColumns}
              className={"DataRoom_Table"}
              rows={searchAllData}
              pagination={false}
              onChange={handleSortMyDocuments}
              size={"middle"}
            />
          </InfiniteScroll>
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
                  format={"DD MMM, YYYY"}
                  render={
                    <InputIcon
                      placeholder={t("select-start-date")}
                      className={styles["datepicker_input"]}
                    />
                  }
                  containerClassName={stylesss["datePicker_Container"]}
                  onOpenPickNewDate={true}
                  editable={false}
                  className="datePickerTodoCreate2"
                  // value={searchDataFields.LastModifiedStartDate}
                  onChange={handleStartDatePickerChange}
                  inputMode=""
                  calendar={calendarValue}
                  locale={localValue}
                  ref={calendRef}
                  maxDate={selectedEndDate}
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
                  format={"DD MMM, YYYY"}
                  render={
                    <InputIcon
                      placeholder={t("select-end-date")}
                      className={styles["datepicker_input"]}
                    />
                  }
                  containerClassName={stylesss["datePicker_Container"]}
                  className="datePickerTodoCreate2"
                  onOpenPickNewDate={true}
                  editable={false}
                  inputMode=""
                  onChange={handleEndDatePickerChange}
                  calendar={calendarValue}
                  // value={searchDataFields.LastModifiedEndDate}
                  locale={localValue}
                  ref={calendRef}
                  minDate={selectedStartDate}
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
