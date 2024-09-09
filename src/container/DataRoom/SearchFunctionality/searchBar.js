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
import {
  formatDateToMMDDYY,
  formatDateToUTC,
} from "../../../commen/functions/date_formater";
import InputIcon from "react-multi-date-picker/components/input_icon";
import { useSelector } from "react-redux";
import { Tooltip } from "antd";
const SearchBarComponent = ({
  setSearchDataFields,
  searchDataFields,
  setSearchTabOpen,
  searchTabOpen,
  setSearchbarshow,
  searchbarshow,
  setSearchResultFields,
  searchResultsFields,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { assignees } = useSelector((state) => state);
  const searchBarRef = useRef();
  const calendRef = useRef();
  const [searchbarsearchoptions, setSearchbarsearchoptions] = useState(false);
  const [startOpen, setIsStartOpen] = useState(false);
  const [endOpen, setIsEndOpen] = useState(false);
  let userID = localStorage.getItem("userID");
  let organizationID = localStorage.getItem("organizationID");
  let lang = localStorage.getItem("i18nextLng");
  let currentView = localStorage.getItem("setTableView");
  //   its a flag for customs date range
  const [customRangeVisible, setCustomRangeVisible] = useState(false);
  // all assignees
  const [assignessList, setAssignessList] = useState([]);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  // this is for dates validation
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
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

  // Transform the API response to match the options structure
  const transformedOptions = assignessList.map((user) => ({
    value: user.pK_UID,
    label: (
      <>
        <span className="d-flex align-items-center gap-2">
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
        StatusID: 3,
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
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
      setSearchDataFields({
        UserID: userID ? parseInt(userID) : 0,
        OrganizationID: organizationID
          ? parseInt(organizationID)
          : organizationID,
        StatusID: 3,
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
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,
        SortBy: 1,
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
      StatusID: currentView,
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
      isOwnedByMe: 2,
      // isNotOwnedByMe: false,
      isSpecificUser: false,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: false,
    });
    setSearchResultFields({
      Date: null,
      Type: null,
      Location: null,
      People: null,
    });
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
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  // this is for Show Search Options onclick function
  const showSearchResultsOptions = () => {
    setSearchbarshow(false);
    setSearchbarsearchoptions(true);
  };

  // this for document selection on search dropdown
  const handleChangeDocuments = (documentID) => {
    if (documentID === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: true,
        isSpreadSheet: true,
        isPresentation: true,
        isForms: true,
        isPDF: true,
        isFolders: true,
        isVideos: true,
        isAudios: true,
        isSites: true,
        isImages: true,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: true,
        isSpreadSheet: true,
        isPresentation: true,
        isForms: true,
        isPDF: true,
        isFolders: true,
        isVideos: true,
        isAudios: true,
        isSites: true,
        isImages: true,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,
        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: true,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: true,
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
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: true,
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
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: true,
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
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: true,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 6) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        isImages: true,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
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
        isImages: true,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: true,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: true,
        isAudios: false,
        isSites: false,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
        isAudios: false,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: true,
        isVideos: false,
        isAudios: false,
        isSites: false,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 11) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: true,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: false,
        isSites: true,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else if (documentID === 12) {
      setSearchDataFields({
        ...searchDataFields,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: true,
        isSites: false,
        isImages: false,
      });
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isPDF: false,
        isFolders: false,
        isVideos: false,
        isAudios: true,
        isSites: false,
        isImages: false,
        LastModifiedStartDate: "",
        LastModifiedEndDate: "",
        UserIDToSearch: 0,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

        SortBy: 1,
        isDescending: false,
      };
      dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    } else {
      let data = {
        UserID: parseInt(userID),
        OrganizationID: parseInt(organizationID),
        StatusID: 3,
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
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        sRow: 0,
        Length: 10,

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
      isOwnedByMe: 2,
      // isNotOwnedByMe: false,
      isSpecificUser: false,
      sRow: 0,
      Length: 10,

      SortBy: 0,
      isDescending: false,
    });
    setSearchResultFields({
      Date: null,
      Type: null,
      Location: null,
      People: null,
    });
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
    setSelectedEndDate(null);
    setSelectedStartDate(null);
  };

  const SearchiconClickOptions = () => {
    setSearchbarsearchoptions(true);
    if (searchbarshow === true) {
      setSearchbarshow(false);
    }
  };

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
    } else {
    }
  };

  // Search modal Owner handle Change Function
  const handleChangeStatus = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      People: event, // Update the Type field
    }));
    if (event.value === 1) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: 1,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else if (event.value === 2) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: 2,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else if (event.value === 3) {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: 3,
        // isNotOwnedByMe: true,
        isSpecificUser: false,
        UserIDToSearch: 0,
      });
    } else {
      setSearchDataFields({
        ...searchDataFields,
        isOwnedByMe: 3,
        // isNotOwnedByMe: false,
        isSpecificUser: false,
        UserIDToSearch: parseInt(event.value),
      });
    }
  };

  // this is location handler of modal search
  const handleChangeLocationValue = (event) => {
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Location: event, // Update the Type field
    }));
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
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Date: event, // Update the Type field
    }));
    const currentDate = new Date();
    let startDate = null;
    let endDate = null;

    switch (event.value) {
      case 1: // Any-time
        // No specific date range, so no need to set start and end dates.
        setSearchDataFields({
          ...searchDataFields,
          LastModifiedEndDate: "",
          LastModifiedStartDate: "",
        });
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
    setIsStartOpen(false);
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

    setIsEndOpen(false);
  };

  // this is search button handler of serach modal
  const handleSearch = async () => {
    let data = {
      UserID: parseInt(userID),
      OrganizationID: parseInt(organizationID),
      StatusID: Number(searchDataFields.StatusID),
      Title: searchResultBoxFields.itemname,
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
      // isNotOwnedByMe: searchDataFields.isNotOwnedByMe,
      isSpecificUser: searchDataFields.isSpecificUser,
      sRow: 0,
      Length: 10,
      SortBy: 1,
      isDescending: searchDataFields.isDescending,
    };
    await dispatch(searchDocumentsAndFoldersApi(navigate, t, data));
    setSelectedStartDate(null);
    setSelectedEndDate(null);
    setSearchTabOpen(true);
    setSearchbarsearchoptions(false);
    setSearchbarshow(false);
    setIsStartOpen(false);
    setIsEndOpen(false);
    setCustomRangeVisible(false);
    //Back To intial State of Search As Defined
    // setSearchDataFields({
    //   UserID: userID ? parseInt(userID) : 0,
    //   OrganizationID: organizationID
    //     ? parseInt(organizationID)
    //     : organizationID,
    //   StatusID: 3,
    //   Title: "",
    //   isDocument: false,
    //   isSpreadSheet: false,
    //   isPresentation: false,
    //   isForms: false,
    //   isPDF: false,
    //   isFolders: false,
    //   isVideos: false,
    //   isImages: false,
    //   isAudios: false,
    //   isSites: false,
    //   LastModifiedStartDate: "",
    //   LastModifiedEndDate: "",
    //   UserIDToSearch: 0,
    //   isOwnedByMe: 2,
    //   // isNotOwnedByMe: false,
    //   isSpecificUser: false,
    //   sRow: 0,
    //   Length: 10,

    //   SortBy: 0,
    //   isDescending: false,
    // });
    // setSearchResultFields({
    //   Date: null,
    //   Type: null,
    //   Location: null,
    //   People: null,
    // });
    // setSearchResultBoxFields({
    //   documentType: {
    //     value: 0,
    //     label: "",
    //   },
    //   lastModifedDate: {
    //     value: 0,
    //     label: "",
    //   },
    //   documetLocation: {
    //     value: 0,
    //     label: "",
    //   },
    //   itemname: "",
    //   haswords: "",
    //   owner: {
    //     value: 0,
    //     label: "",
    //   },
    //   specifiPeople: "",
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
        labelclass="d-none"
        onClick={searchbardropdownShow}
        onKeyDown={handleOnEnterTitleSearch}
        inputicon={
          searchTabOpen ? (
            <>
              <span className="d-flex gap-2">
                <img
                  draggable="false"
                  src={blackCrossIcon}
                  alt=""
                  className="cursor-pointer"
                  onClick={resteFunctionality}
                />
                <Tooltip placement="bottomLeft" title={t("Search-filters")}>
                  <img
                    draggable="false"
                    src={searchicon}
                    alt=""
                    className="cursor-pointer"
                    onClick={SearchiconClickOptions}
                  />
                </Tooltip>
              </span>
            </>
          ) : (
            <Tooltip placement="bottomLeft" title={t("Search-filters")}>
              <img
                draggable="false"
                src={searchicon}
                alt=""
                className="cursor-pointer"
                onClick={SearchiconClickOptions}
              />
            </Tooltip>
          )
        }
        // clickIcon={SearchiconClickOptions}
        iconclassname={
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
                        draggable="false"
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
                    value={searchResultsFields.Type}
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
                    options={OptionsOwner(t).concat(transformedOptions)}
                    placeholder={t("People")}
                    onChange={handleChangeStatus}
                    value={searchResultsFields.People}
                  />
                </Col>
              </Row>
              <Row className="mt-2 Inputfield_for_data_room">
                <Col lg={12} md={12} sm={12}>
                  <TextField
                    labelclass="textFieldSearch d-none"
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
                    placeholder={t("Location")}
                    onChange={handleChangeLocationValue}
                    value={searchResultsFields.Location}
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
                    value={searchResultsFields.Date}
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
                  >
                    <DatePicker
                      format={"DD MMM, YYYY"}
                      render={
                        <InputIcon
                          placeholder={t("select-start-date")}
                          className={styles["datepicker_input"]}
                        />
                      }
                      onOpenPickNewDate={false}
                      editable={false}
                      containerClassName={styles["datePicker_Container"]}
                      className="datePickerTodoCreate2"
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
                      onOpenPickNewDate={false}
                      render={
                        <InputIcon
                          placeholder={t("select-end-date")}
                          className={styles["datepicker_input"]}
                        />
                      }
                      editable={false}
                      containerClassName={styles["datePicker_Container"]}
                      className="datePickerTodoCreate2"
                      inputMode=""
                      onChange={handleEndDatePickerChange}
                      calendar={calendarValue}
                      locale={localValue}
                      ref={calendRef}
                      minDate={selectedStartDate}
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
                              draggable="false"
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
