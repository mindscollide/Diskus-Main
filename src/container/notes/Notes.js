import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import styles from "./Notes.module.css";
import NotesMainEmpty from "../../assets/images/NotesMain_Empty.svg";
import ModalViewNote from "./modalViewNote/ModalViewNote";
import ModalAddNote from "./modalAddNote/ModalAddNote";
import ModalUpdateNote from "./modalUpdateNote/ModalUpdateNote";
import ClipIcon from "../../assets/images/AttachmentNotes.svg";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import searchicon from "../../assets/images/searchicon.svg";
import PlusExpand from "../../assets/images/Plus-notesExpand.svg";
import MinusExpand from "../../assets/images/close-accordion.svg";
import BlackCrossIcon from "../../assets/images/BlackCrossIconModals.svg";
import EditIconNote from "../../assets/images/EditIconNotes.svg";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Plus } from "react-bootstrap-icons";
import DatePicker, { DateObject } from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import Select from "react-select";
import {
  AttachmentViewer,
  Button,
  Notification,
  TextField,
} from "../../components/elements";
import { Tooltip } from "antd";
import {
  GetNotes,
  GetNotesByIdAPI,
  RetrieveNotesDocumentAPI,
} from "../../store/actions/Notes_actions";
import {
  _justShowDateformat,
  _justShowDay,
} from "../../commen/functions/date_formater";
import { useNavigate } from "react-router-dom";
import CustomPagination from "../../commen/functions/customPagination/Paginations";
import CustomAccordion from "../../components/elements/accordian/CustomAccordion";
import { useNotesContext } from "../../context/NotesContext";
import { regexOnlyForNumberNCharacters } from "../../commen/functions/regex";
import { OptionsDocument } from "../DataRoom/SearchFunctionality/option";
const Notes = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const calendRef = useRef();
  let currentLanguage = localStorage.getItem("i18nextLng");
  const { NotesReducer } = useSelector((state) => state);

  const { createNotesModal, setCreateNotesModal } = useNotesContext();

  //Get Current User ID
  let createrID = localStorage.getItem("userID");
  let OrganizationID = localStorage.getItem("organizationID");
  let notesPage = JSON.parse(localStorage.getItem("notesPage"));
  let notesPagesize = localStorage.getItem("notesPageSize");
  const [totalRecords, setTotalRecords] = useState(0);
  //Test Accordian states start
  const [updateNotesModal, setUpdateNotesModal] = useState(false);
  // for modal Add notes

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  // for modal Update notes
  const [updateShow, setUpdateShow] = useState(false);
  const [notes, setNotes] = useState([]);
  //for view modal notes
  const [viewModalShow, setViewModalShow] = useState(false);
  const [isExpanded, setExpanded] = useState(false);
  const [searchnotes, setSearchnotes] = useState(false);
  const [searchResultsFields, setSearchResultFields] = useState({
    Type: null,
  });
  const [searchBoxState, setsearchBoxState] = useState({
    searchByTitle: "",
    Date: "",
    DateView: "",
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
  });
  const [noteSearchState, setNoteSearchState] = useState({
    searchValue: "",
  });
  const [enterpressed, setEnterpressed] = useState(false);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);

  //For Arabic lanaguage
  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);
  useEffect(() => {
    try {
      if (notesPagesize !== null && notesPage !== null) {
        let Data = {
          UserID: parseInt(createrID),
          OrganizationID: JSON.parse(OrganizationID),
          Title: "",
          isDocument: false,
          isSpreadSheet: false,
          isPresentation: false,
          isForms: false,
          isImages: false,
          isPDF: false,
          isVideos: false,
          isAudios: false,
          isSites: false,
          CreatedDate: "",
          PageNumber: JSON.parse(notesPage),
          Length: JSON.parse(notesPagesize),
        };
        dispatch(GetNotes(navigate, Data, t));
      } else {
        localStorage.setItem("notesPage", 1);
        localStorage.setItem("notesPageSize", 50);

        let Data = {
          UserID: parseInt(createrID),
          OrganizationID: JSON.parse(OrganizationID),
          Title: "",
          isDocument: false,
          isSpreadSheet: false,
          isPresentation: false,
          isForms: false,
          isImages: false,
          isPDF: false,
          isVideos: false,
          isAudios: false,
          isSites: false,
          CreatedDate: "",
          PageNumber: 1,
          Length: 50,
        };
        dispatch(GetNotes(navigate, Data, t));
      }
      setCreateNotesModal(false);
      setViewModalShow(false);
      setUpdateShow(false);
      return () => {
        localStorage.removeItem("notesPage");
        localStorage.removeItem("notesPageSize");
      };
    } catch (error) {
      console.log(error, "error");
    }
  }, []);

  // render Notes Data
  useEffect(() => {
    try {
      if (
        NotesReducer.GetAllNotesResponse !== null &&
        NotesReducer.GetAllNotesResponse !== undefined
      ) {
        setTotalRecords(NotesReducer.GetAllNotesResponse.totalRecords);
        if (NotesReducer.GetAllNotesResponse.getNotes === null) {
          setNotes([]);
        } else if (
          Array.isArray(NotesReducer.GetAllNotesResponse.getNotes) &&
          NotesReducer.GetAllNotesResponse.getNotes.length > 0
        ) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data) => {
            notes.push({
              date: data.date,
              description: data.description,
              fK_NotesStatus: data.fK_NotesStatus,
              fK_OrganizationID: data.fK_OrganizationID,
              fK_UserID: data.fK_UserID,
              isAttachment: data.isAttachment,
              isStarred: data.isStarred,
              modifiedDate: data.modifiedDate,
              modifiedTime: data.modifiedTime,
              notesAttachments: data.notesAttachments,
              notesStatus: data.notesStatus,
              organizationName: data.organizationName,
              pK_NotesID: data.pK_NotesID,
              time: data.time,
              title: data.title,
              username: data.username,
            });
          });
          setNotes(notes);
        } else if (
          typeof NotesReducer.GetAllNotesResponse.getNotes === "object" &&
          Object.keys(NotesReducer.GetAllNotesResponse.getNotes).length > 0
        ) {
          let notes = [];
          NotesReducer.GetAllNotesResponse.getNotes.map((data) => {
            notes.push({
              date: data.date,
              description: data.description,
              fK_NotesStatus: data.fK_NotesStatus,
              fK_OrganizationID: data.fK_OrganizationID,
              fK_UserID: data.fK_UserID,
              isAttachment: data.isAttachment,
              isStarred: data.isStarred,
              modifiedDate: data.modifiedDate,
              modifiedTime: data.modifiedTime,
              notesAttachments: data.notesAttachments,
              notesStatus: data.notesStatus,
              organizationName: data.organizationName,
              pK_NotesID: data.pK_NotesID,
              time: data.time,
              title: data.title,
              username: data.username,
            });
          });
          setNotes(notes);
        } else {
          setNotes([]);
        }
      } else {
        setNotes([]);
      }
    } catch (error) {}
  }, [NotesReducer.GetAllNotesResponse]);

  //for open Add User Notes Modal
  const modalAddUserModal = async (e) => {
    setCreateNotesModal(true);
  };
  // for open Update User Notes Modal
  const editIconModal = async (id) => {
    dispatch(
      GetNotesByIdAPI(
        navigate,
        id,
        t,
        setViewModalShow,
        setUpdateShow,
        setUpdateNotesModal,
        4
      )
    );
    //Retrive Documents of the Notes
    let Data = {
      NoteID: Number(id),
    };
    dispatch(RetrieveNotesDocumentAPI(navigate, Data, t));
  };

  //for open View User Notes Modal
  const viewNotesModal = async (id, event) => {
    dispatch(
      GetNotesByIdAPI(
        navigate,
        id,
        t,
        setViewModalShow,
        setUpdateShow,
        setUpdateNotesModal,
        1
      )
    );
    //Retrive Documents of the Notes
    let Data = {
      NoteID: Number(id),
    };
    dispatch(RetrieveNotesDocumentAPI(navigate, Data, t));
  };

  const handelChangeNotesPagination = async (current, pageSize) => {
    localStorage.setItem("notesPage", current);
    localStorage.setItem("notesPageSize", pageSize);
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
      Title: "",
      PageNumber: Number(current),
      Length: Number(pageSize),
    };
    dispatch(GetNotes(navigate, Data, t));
  };

  const handleClickExpand = (number) => {
    if (isExpanded === number) {
      setExpanded(false);
    } else {
      setExpanded(number);
    }
  };

  //Searching Notes

  const HandleSearchboxNameTitle = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "searchbytitle") {
      let UpdateValue = regexOnlyForNumberNCharacters(value);
      if (UpdateValue !== "") {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: UpdateValue,
        });
      } else {
        setsearchBoxState({
          ...searchBoxState,
          searchByTitle: "",
        });
      }
    }
  };

  const HandleSearchNotessMain = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "SearchVal") {
      if (value !== "") {
        setNoteSearchState({
          ...noteSearchState,
          searchValue: value,
        });
      } else {
        setNoteSearchState({
          ...noteSearchState,
          searchValue: "",
        });
      }
    }
  };

  const handleKeyDownSearch = (e) => {
    if (e.key === "Enter") {
      setEnterpressed(true);
      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: noteSearchState.searchValue,
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isImages: false,
        isPDF: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        CreatedDate: "",
        PageNumber: 1,
        Length: 50,
      };
      dispatch(GetNotes(navigate, Data, t));
    }
  };

  const handleResettingPage = () => {
    setNoteSearchState({
      ...noteSearchState,
      searchValue: "",
    });
    setSearchnotes(false);
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isImages: false,
      isPDF: false,
      isVideos: false,
      isAudios: false,
      isSites: false,
      CreatedDate: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(GetNotes(navigate, Data, t));
  };

  const HandleShowSearch = () => {
    setNoteSearchState({
      ...noteSearchState,
      searchValue: "",
    });
    setSearchnotes(true);
  };

  const handleMainSearchModal = () => {
    if (
      searchBoxState.searchByTitle !== "" ||
      searchBoxState.Date !== "" ||
      searchBoxState.DateView !== ""
    ) {
      setSearchnotes(false);

      setsearchBoxState({
        ...searchBoxState,
        searchByTitle: "",
        Date: "",
        DateView: "",
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
      });

      setSearchResultFields((prevState) => ({
        ...prevState,
        Type: null,
      }));

      let Data = {
        UserID: parseInt(createrID),
        OrganizationID: JSON.parse(OrganizationID),
        Title: "",
        isDocument: false,
        isSpreadSheet: false,
        isPresentation: false,
        isForms: false,
        isImages: false,
        isPDF: false,
        isVideos: false,
        isAudios: false,
        isSites: false,
        CreatedDate: "",
        PageNumber: 1,
        Length: 50,
      };

      dispatch(GetNotes(navigate, Data, t));
    } else {
      setSearchnotes(false);
      setsearchBoxState({
        ...searchBoxState,
        searchByTitle: "",
        Date: "",
        DateView: "",
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
      });

      setsearchBoxState({
        ...searchBoxState,
        searchByTitle: "",
        Date: "",
        DateView: "",
      });
      setSearchResultFields((prevState) => ({
        ...prevState,
        Type: null,
      }));
    }
  };

  //Search Date Picker OnChange
  const meetingDateChangeHandler = (date) => {
    // Always format the API date in a standard format
    let DateFormat = new DateObject(date).format("YYYY-MM-DD");

    // Format the display date based on the locale
    let DateFormatView = new DateObject(date)
      .setLocale(localValue)
      .format("DD/MM/YYYY");

    setsearchBoxState({
      ...searchBoxState,
      Date: DateFormat, // Standard date for API
      DateView: DateFormatView, // Localized display date
    });
  };

  const ResetSearchBtn = () => {
    setsearchBoxState({
      ...searchBoxState,
      searchByTitle: "",
      Date: "",
      DateView: "",
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
    });
    setSearchResultFields((prevState) => ({
      ...prevState,
      Type: null,
    }));
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
      Title: "",
      isDocument: false,
      isSpreadSheet: false,
      isPresentation: false,
      isForms: false,
      isImages: false,
      isPDF: false,
      isVideos: false,
      isAudios: false,
      isSites: false,
      CreatedDate: "",
      PageNumber: 1,
      Length: 50,
    };
    dispatch(GetNotes(navigate, Data, t));
  };

  //Searching Through Documents

  // this is onchange envent of search modal Documnet
  const handleChangeDocumentsOptions = (event) => {
    console.log(event, "eventeventevent");
    setSearchResultFields((prevState) => ({
      ...prevState, // Copy the existing state
      Type: event, // Update the Type field
    }));
    if (event.value === 1) {
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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
      setsearchBoxState({
        ...searchBoxState,
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

  const handleSearchEvent = () => {
    let Data = {
      UserID: parseInt(createrID),
      OrganizationID: JSON.parse(OrganizationID),
      Title: searchBoxState.searchByTitle,
      isDocument: searchBoxState.isDocument,
      isSpreadSheet: searchBoxState.isSpreadSheet,
      isPresentation: searchBoxState.isPresentation,
      isForms: searchBoxState.isForms,
      isImages: searchBoxState.isImages,
      isPDF: searchBoxState.isPDF,
      isVideos: searchBoxState.isVideos,
      isAudios: searchBoxState.isAudios,
      isSites: searchBoxState.isSites,
      CreatedDate: searchBoxState.Date,
      PageNumber: 1,
      Length: 50,
    };
    dispatch(GetNotes(navigate, Data, t));
  };

  return (
    <>
      <div className={styles["notescontainer"]}>
        <Row className="mt-3">
          <Col lg={8} md={8} sm={12} className="d-flex gap-4 ">
            <h1 className={styles["notes-heading-size"]}>{t("Notes")}</h1>

            <Button
              text={t("Create-new-note")}
              icon={<Plus width={20} height={20} fontWeight={800} />}
              className={styles["create-note-btn"]}
              onClick={modalAddUserModal}
            />
          </Col>
          <Col sm={12} md={4} lg={4}>
            <span className="position-relative w-100">
              <TextField
                width={"100%"}
                placeholder={t("Search")}
                applyClass={"PollingSearchInput"}
                name={"SearchVal"}
                value={noteSearchState.searchValue}
                change={HandleSearchNotessMain}
                onKeyDown={handleKeyDownSearch}
                labelclass="d-none"
                inputicon={
                  <>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className="d-flex gap-2 align-items-center"
                      >
                        {noteSearchState.searchValue && enterpressed ? (
                          <>
                            <img
                              src={BlackCrossIcon}
                              className="cursor-pointer"
                              draggable="false"
                              alt=""
                              onClick={handleResettingPage}
                            />
                          </>
                        ) : null}
                        <Tooltip
                          placement="bottomLeft"
                          title={t("Search-filters")}
                        >
                          <img
                            src={searchicon}
                            alt=""
                            className={styles["Search_Bar_icon_class"]}
                            draggable="false"
                            onClick={HandleShowSearch}
                          />
                        </Tooltip>
                      </Col>
                    </Row>
                  </>
                }
                iconclassname={styles["polling_searchinput"]}
              />
              {searchnotes ? (
                <>
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={styles["SearhBar_Polls"]}
                    >
                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end"
                        >
                          <img
                            src={BlackCrossIcon}
                            className={styles["Cross_Icon_Styling"]}
                            width="16px"
                            height="16px"
                            alt=""
                            onClick={handleMainSearchModal}
                            draggable="false"
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <TextField
                            placeholder={t("Notes-title")}
                            applyClass={"Search_Modal_Fields"}
                            labelclass="d-none"
                            name={"searchbytitle"}
                            value={searchBoxState.searchByTitle}
                            change={HandleSearchboxNameTitle}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col lg={6} md={6} sm={6}>
                          <DatePicker
                            value={searchBoxState.DateView}
                            format={"DD/MM/YYYY"}
                            placeholder="DD/MM/YYYY"
                            render={
                              <InputIcon
                                placeholder="DD/MM/YYYY"
                                className="datepicker_input"
                              />
                            }
                            editable={false}
                            className="datePickerTodoCreate2"
                            onOpenPickNewDate={false}
                            calendar={calendarValue} // Arabic calendar
                            locale={localValue} // Arabic locale
                            ref={calendRef}
                            onFocusedDateChange={meetingDateChangeHandler}
                          />
                        </Col>
                        <Col lg={6} md={6} sm={6}>
                          <Select
                            options={OptionsDocument(t)}
                            placeholder={t("With-attachments")}
                            isSearchable={false}
                            onChange={handleChangeDocumentsOptions}
                            value={searchResultsFields.Type}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-4">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-end gap-2"
                        >
                          <Button
                            text={t("Reset")}
                            className={styles["Reset_Button_polls_SearchModal"]}
                            onClick={ResetSearchBtn}
                          />
                          <Button
                            text={t("Search")}
                            type={"submit"}
                            className={
                              styles["Search_Button_polls_SearchModal"]
                            }
                            onClick={handleSearchEvent}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </>
              ) : null}
            </span>
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={12} className={styles["notesViewContainer"]}>
            {/* Test Accordian Body Starts  */}
            {notes.length > 0 && notes !== null && notes !== undefined ? (
              notes.map((data, index) => {
                console.log(data, "datdayaminyamin");
                return (
                  <CustomAccordion
                    StartField={data.title}
                    isExpand={isExpanded}
                    notesID={data.pK_NotesID}
                    handleClickTitleNotes={() =>
                      viewNotesModal(data?.pK_NotesID)
                    }
                    centerField={
                      <>
                        {" "}
                        {data?.isAttachment ? (
                          <span>
                            <img
                              draggable="false"
                              alt=""
                              src={ClipIcon}
                              width="15.96px"
                              height="14.68px"
                              className={
                                styles["attachIcon-In-Collapse-material"]
                              }
                            />
                          </span>
                        ) : (
                          <span>
                            <img draggable="false" width={15} alt="" />
                          </span>
                        )}
                        <span
                          className={styles["collapse-text-attached-material"]}
                        >
                          {`${_justShowDateformat(
                            data?.modifiedDate + data?.modifiedTime
                          )} ${" | "} ${_justShowDay(
                            data?.modifiedDate + data?.modifiedTime
                          )}`}
                        </span>
                      </>
                    }
                    endField={
                      <>
                        {data.notesAttachments.length > 0 && (
                          <>
                            {isExpanded === JSON.parse(data?.pK_NotesID) ? (
                              <span
                                className={styles["MinusIcon_span"]}
                                onClick={() =>
                                  handleClickExpand(data?.pK_NotesID)
                                }
                              >
                                <img
                                  draggable="false"
                                  src={MinusExpand}
                                  className={styles["MinusIcon"]}
                                  alt=""
                                />
                              </span>
                            ) : (
                              <span
                                className={styles["PlusIcon_span"]}
                                onClick={() =>
                                  handleClickExpand(data?.pK_NotesID)
                                }
                              >
                                <img
                                  draggable="false"
                                  src={PlusExpand}
                                  alt=""
                                  className={styles["PlusIcon"]}
                                  onClick={() =>
                                    handleClickExpand(data?.pK_NotesID)
                                  }
                                />
                              </span>
                            )}
                          </>
                        )}
                        <Tooltip placement="bottomLeft" title={t("Edit")}>
                          <img
                            draggable="false"
                            src={EditIconNote}
                            width={17}
                            alt=""
                            className={styles["editIcon-In-Collapse-material"]}
                            onClick={() => editIconModal(data?.pK_NotesID)}
                          />
                        </Tooltip>
                      </>
                    }
                    attachmentsRow={
                      <>
                        {isExpanded === data?.pK_NotesID && (
                          <Row>
                            <Col
                              sm={12}
                              lg={12}
                              md={12}
                              className={styles["NotesAttachments"]}
                            >
                              {data?.notesAttachments.length > 0
                                ? data?.notesAttachments.map((file) => {
                                    return (
                                      <AttachmentViewer
                                        data={file}
                                        id={0}
                                        name={file.displayFileName}
                                      />
                                    );
                                  })
                                : null}
                            </Col>
                          </Row>
                        )}
                      </>
                    }
                  />
                );
              })
            ) : (
              <Row>
                <Col
                  sm={12}
                  md={12}
                  lg={12}
                  className={styles["emptyNotesState"]}
                >
                  <img draggable="false" src={NotesMainEmpty} alt="" />
                  <p className={styles["emptystatetext"]}>
                    {t("Notes-you-add-appear-here")}
                  </p>
                </Col>
              </Row>
            )}
          </Col>

          <Col
            sm={12}
            md={12}
            lg={12}
            className="d-flex justify-content-center my-3 pagination-groups-table"
          >
            {notes !== null && notes !== undefined && notes.length > 0 ? (
              <>
                <CustomPagination
                  current={
                    notesPage !== null && notesPage !== undefined
                      ? notesPage
                      : 1
                  }
                  showSizer={true}
                  pageSizeOptionsValues={["30", "50", "100", "200"]}
                  onChange={handelChangeNotesPagination}
                  total={totalRecords}
                  pageSize={notesPagesize !== null ? notesPagesize : 50}
                  className={styles["PaginationStyle-Notes"]}
                />
              </>
            ) : null}
          </Col>
        </Row>
        {/* Test Accordian Ends  */}
      </div>
      {createNotesModal && <ModalAddNote />}

      {updateShow ? (
        <ModalUpdateNote
          updateNotes={updateShow}
          setUpdateNotes={setUpdateShow}
        />
      ) : null}

      {viewModalShow ? (
        <ModalViewNote
          viewNotes={viewModalShow}
          setViewNotes={setViewModalShow}
        />
      ) : null}
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Notes;
