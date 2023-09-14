import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { Button, TextField } from "../../../components/elements";
import { searchDocumentsAndFoldersApi } from "../../../store/actions/DataRoom_actions";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "../DataRoom.module.css";
import Cross from "../../../assets/images/cuticon.svg";
import blackCrossIcon from "../../../assets/images/BlackCrossIconModals.svg";
import searchicon from "../../../assets/images/searchicon.svg";
import Select from "react-select";
import DatePicker, { DateObject } from "react-multi-date-picker";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import {
  OptionsDocument2,
  OptionsDocument,
  optionsLocations,
  OptionsOwner,
  optionsLastmodified,
} from "./option";
import { formatDateToMMDDYY } from "../../../commen/functions/date_formater";
import InputIcon from "react-multi-date-picker/components/input_icon";
const SearchBarComponent = ({
  setSearchDataFields,
  searchDataFields,
  setSearchTabOpen,
  searchTabOpen,
  setSearchbarshow,
  searchbarshow,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const searchBarRef = useRef();
  const calendRef = useRef();
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [startOpen, setIsStartOpen] = useState(false);
  const [endOpen, setIsEndOpen] = useState(false);
  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  //   its a flag for customs date range
  const [customRangeVisible, setCustomRangeVisible] = useState(false);
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
  console.log(searchResultsFields, "searchResultsFieldssearchResultsFields");
  let lang = localStorage.getItem("i18nextLng");
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);

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
  // this is used for input title
  const handleTitleSearch = (e) => {
    setSearchDataFields({ ...searchDataFields, ["Title"]: e.target.value });
  };

  //   this handler for title enter seacrh
  const handleOnEnterTitleSearch = (event) => {
    if (event.key === "Enter" && searchDataFields.Title !== "") {
      setSearchTabOpen(true);
      setSearchbarshow(false);
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 1,
        Title: searchDataFields.Title,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
      setSearchDataFields({
        UserID: userID ? parseInt(userID) : 0,
        OrganizationID: organizationID
          ? parseInt(organizationID)
          : organizationID,
        StatusID: 0,
        Title: searchDataFields.Title,
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
    }
  };

  //   this is for oprn drope down on click on input field
  const searchbardropdownShow = () => {
    setSearchbarshow(true);
    if (searchbarsearchoptions === true) {
      setSearchbarsearchoptions(false);
    }
  };

  // this is for reset functionality
  const resteFunctionality = () => {
    setSearchTabOpen(false);
    setSearchbarsearchoptions(false);
    setSearchbarshow(true);
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
  };

  // this is for Show Search Options onclick function
  const showSearchResultsOptions = () => {
    setSearchbarshow(false);
    setSearchbarsearchoptions(true);
  };

  // this for document selection on search dropdown
  const handleChangeDocuments = (documentID) => {
    if (documentID === 2) {
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
        StatusID: 1,
        Title: "",
        isDocument: true,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 3) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: true,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 4) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: true,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 5) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: true,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 7) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: true,
        isFolders: false,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 10) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: true,
        isVideos: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 8) {
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
        StatusID: 1,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: true,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 1,
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
        UserIDToSearch: parseInt(userID),
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 50,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    }
    setSearchTabOpen(true);

    // i have to remove it
    // Create a Promise to handle the mapping operation
    const mapPromise = new Promise((resolve) => {
      OptionsDocument(t).forEach((data, index) => {
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
        if (index === OptionsDocument(t).length - 1) {
          resolve();
        }
      });
    });

    // Wait for the mapping operation to complete before hiding the search bar
    mapPromise.then(() => {
      setSearchbarshow(false);
    });
  };

  // this is cross icon of search modal
  const SearchiconClickOptionsHide = () => {
    setSearchTabOpen(false);
    setSearchbarsearchoptions(false);
    setSearchbarshow(false);
    setIsStartOpen(false);
    setIsEndOpen(false);
    setCustomRangeVisible(false);
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
  };

  const SearchiconClickOptions = () => {
    setSearchbarsearchoptions(true);
    if (searchbarshow === true) {
      setSearchbarshow(false);
    }
  };

  // this is onchange envent of search modal Documnet
  const handleChangeDocumentsOptions = (event) => {
    setSearchResultFields({
      ...searchResultsFields,
      DocumentType: {
        value: event.value,
        label: event.label,
      },
    });
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
    } else {
    }
  };

  // Search modal Owner handle Change Function
  const handleChangeStatus = (event) => {
    if (event.value === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: true,
        isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else if (event.value === 3) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: true,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: false,
        isNotOwnedByMe: false,
        isSpecificUser: true,
        UserIDToSearch: parseInt(userID),
      });
    }
  };

  // this is location handler of modal search
  const handleChangeLocationValue = (event) => {
    setSearchDataFields({
      ...searchDataFields,
      StatusID: parseInt(event.value),
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

  // Search Box Last modified Date handle Change Function
  const handleChangeLastModifedDate = (event) => {
    const currentDate = new Date();
    let startDate = null;
    let endDate = null;

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
        break;
      case 7: // Custom range
        setCustomRangeVisible(true);
        break;
      default:
        break;
    }
    return { startDate, endDate };
  };

  // this is toggle for calender open and close
  const toggleCalendar = (value) => {
    if (value === 1) {
      setIsStartOpen(!startOpen);
      setIsEndOpen(false);
    } else if (value === 2) {
      setIsEndOpen(!endOpen);
      setIsStartOpen(false);
    }
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

    setIsStartOpen(false);
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

    setIsEndOpen(false);
  };

  // this is search button handler of serach modal
  const handleSearch = async () => {
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
      sRow: searchDataFields.sRow,
      Length: 50,
      SortBy: searchDataFields.SortBy,
      isDescending: searchDataFields.isDescending,
    };
    await dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    setSearchTabOpen(false);
    setSearchbarsearchoptions(false);
    setSearchbarshow(false);
    setIsStartOpen(false);
    setIsEndOpen(false);
    setCustomRangeVisible(false);
    // setSearchDataFields({
    //   UserID: userID ? parseInt(userID) : 0,
    //   OrganizationID: organizationID
    //     ? parseInt(organizationID)
    //     : organizationID,
    //   StatusID: 0,
    //   Title: "",
    //   isDocument: false,
    //   isSpreadSheet: false,
    //   isPresentation: false,
    //   isForms: false,
    //   isPDF: false,
    //   isFolders: false,
    //   isVideos: false,
    //   LastModifiedStartDate: "",
    //   LastModifiedEndDate: "",
    //   UserIDToSearch: 0,
    //   isOwnedByMe: false,
    //   isNotOwnedByMe: false,
    //   isSpecificUser: false,
    //   sRow: 0,
    //   Length: 50,
    //   SortBy: 0,
    //   isDescending: false,
    // });
  };

  const handleOutsideClick = (event) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target) &&
      searchbarshow
    ) {
      setSearchbarshow(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [searchbarshow]);

  return (
    <div className="position-relative">
      <TextField
        value={searchDataFields.Title}
        change={handleTitleSearch}
        placeholder={t("Search")}
        applyClass={"dataRoomSearchInput"}
        labelClass="d-none"
        onClick={searchbardropdownShow}
        onKeyDown={handleOnEnterTitleSearch}
        inputicon={
          searchTabOpen ? (
            <>
              <span className="d-flex gap-2">
                <img
                  src={blackCrossIcon}
                  alt=""
                  className="cursor-pointer-cross"
                  onClick={resteFunctionality}
                />
                <img
                  src={searchicon}
                  alt=""
                  className="cursor-pointer"
                  onClick={SearchiconClickOptions}
                />
              </span>
            </>
          ) : (
            <img
              src={searchicon}
              alt=""
              className="cursor-pointer"
              onClick={SearchiconClickOptions}
            />
          )
        }
        // clickIcon={SearchiconClickOptions}
        iconClassName={
          searchTabOpen
            ? styles["dataroom_searchinput"]
            : styles["dataroom_searchinput2"]
        }
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
                  lg={12}
                  md={12}
                  sm={12}
                  className="select-dropdowns-height"
                >
                  <Select
                    options={OptionsDocument(t)}
                    placeholder={t("Documents")}
                    isSearchable={false}
                    onChange={handleChangeDocumentsOptions}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="select-dropdowns-height"
                >
                  <Select
                    options={OptionsOwner(t)}
                    placeholder={"Owner"}
                    onChange={handleChangeStatus}
                    defaultValue={{
                      value: "",
                      label: "",
                    }}
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
                  lg={12}
                  md={12}
                  sm={12}
                  className="select-dropdowns-height"
                >
                  <Select
                    options={optionsLocations(t)}
                    placeholder={t("Location-anywhere")}
                    onChange={handleChangeLocationValue}
                  />
                </Col>
              </Row>
              <Row className="mt-2">
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className="select-dropdowns-height"
                >
                  <Select
                    options={optionsLastmodified(t)}
                    placeholder={t("Date-modified")}
                    onChange={handleChangeLastModifedDate}
                  />
                </Col>
              </Row>
              {customRangeVisible && (
                <Row className="mt-2">
                  <Col
                    lg={6}
                    md={6}
                    sm={12}
                    className={styles["datePickerTodoCreate2"]}
                    // className={styles["select-dropdowns-height-search"]}
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
                      locale={localValue}
                      ref={calendRef}
                    />
                  </Col>
                </Row>
              )}

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
                    {OptionsDocument2(t).map((data, index) => {
                      return (
                        <>
                          <span
                            key={index}
                            onClick={() => handleChangeDocuments(data.value)}
                            className="cursor-pointer"
                          >
                            <img
                              src={data.imgSrc}
                              height="19.25px"
                              alt=""
                              width="16.85px"
                            />
                            <span className={styles["DropDown_name"]}>
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
      </section>
    </div>
  );
};
export default SearchBarComponent;
