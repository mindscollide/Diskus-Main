import React, { useRef, useState, useEffect } from "react";
import styles from "./meeting.module.css";
import { useTranslation } from "react-i18next";
import { Row, Col, Tooltip } from "react-bootstrap";
import ReactBootstrapDropdown from "react-bootstrap/Dropdown";
import { Plus } from "react-bootstrap-icons";
import { checkFeatureIDAvailability } from "@/commen/functions/utils";
import { Button, TextField } from "@/components/elements";
import searchIcon from "@/assets/images/searchicon.svg";
import BlackCrossIcon from "@/assets/images/BlackCrossIconModals.svg";
import { useNewMeetingContext } from "@/context/NewMeetingContext";
import CustomPagination from "@/commen/functions/customPagination/Paginations";
import ProposedMeetingList from "@/container/meeting/proposedMeeting";
import DraftNeetingList from "@/container/meeting/draftMeeting";
import PublishedMeetingList from "@/container/meeting/publishMeeting";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useNavigate } from "react-router-dom";
import {
  clearMeetingState,
  GetAllMeetingTypesNewFunction,
  searchNewUserMeeting,
} from "@/store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import CreateEditAdvanceMeeting from "./advanceMeeting/createEditAdvanceMeeting";

/**
 * MainMeeting Component
 *
 * This component serves as the main dashboard for meeting management.
 * It provides:
 * - Tabs for different meeting states (Published, Draft, Proposed)
 * - Search functionality with filters
 * - Schedule meeting dropdown with feature-based access control
 * - Dynamic rendering of meeting lists based on selected tab
 *
 * @component
 * @returns {JSX.Element} The rendered component
 */
const MainMeeting = () => {
  const { t } = useTranslation(); // Internationalization hook

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");

  // Redux state and actions
  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes
  );

  // Refs and hooks
  const calendRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Context for meeting state management
  const {
    currentTab,
    setCurrentTab,
    isCreateEditMeeting,
    setIsCreateEditMeeting,
  } = useNewMeetingContext();

  // Local state management
  const [searchText, setSearchText] = useState("");
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [entereventIcon, setentereventIcon] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);

  /**
   * Search fields state object
   * @property {string} MeetingTitle - Title of the meeting to search
   * @property {string} Date - Selected date for filtering
   * @property {string} OrganizerName - Name of the meeting organizer
   * @property {string} DateView - Formatted date for display
   */
  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });

  useEffect(() => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: true,
      ProposedMeetings: false,
    };

    dispatch(searchNewUserMeeting(navigate, searchData, t));
    // Fetch meeting types if not already loaded
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }
    localStorage.setItem("MeetingCurrentView", 1);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
  }, []);
  /**
   * Handles closing the search modal and resetting search fields
   */
  const HandleCloseSearchModalMeeting = () => {
    setSearchMeeting({
      ...searchMeeting,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
  };

  /**
   * Handles changes in search input fields
   * @param {Object} event - The input change event
   */
  const searchMeetingChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === "MeetingTitle") {
      setSearchFeilds({
        ...searchFields,
        MeetingTitle: value,
      });
    } else if (name === "OrganizerName") {
      setSearchFeilds({
        ...searchFields,
        OrganizerName: value,
      });
    }
  };

  /**
   * Handles date selection from date picker
   * @param {Date} value - Selected date value
   */
  const meetingDateChangeHandler = (value) => {
    setSearchFeilds({
      ...searchFields,
      Date: value,
      DateView: value,
    });
  };

  /**
   * Fetches and displays published meetings
   * Clears previous state and initializes search with published meetings filter
   */
  const handlePublishedMeeting = async () => {
    dispatch(clearMeetingState());

    // Prepare search parameters for published meetings
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: true,
      ProposedMeetings: false,
    };

    // Fetch meeting types if not already loaded
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }

    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));

    // Update localStorage with current view state
    localStorage.setItem("MeetingCurrentView", 1);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);

    // Reset search fields and UI state
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  /**
   * Fetches and displays draft (unpublished) meetings
   * Clears previous state and initializes search with draft meetings filter
   */
  const handleDraftMeeting = async () => {
    dispatch(clearMeetingState());

    // Prepare search parameters for draft meetings
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: false,
      ProposedMeetings: false,
    };

    // Fetch meeting types if not already loaded
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }

    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));

    // Update localStorage with current view state
    localStorage.setItem("MeetingCurrentView", 3);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);

    // Reset search fields and UI state
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  /**
   * Fetches and displays proposed meetings
   * Clears previous state and initializes search with proposed meetings filter
   */
  const handleProposedMeeting = async () => {
    dispatch(clearMeetingState());

    // Prepare search parameters for proposed meetings
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: 1,
      Length: 30,
      PublishedMeetings: false,
      ProposedMeetings: true,
    };

    // Fetch meeting types if not already loaded
    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }

    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));

    // Update localStorage with current view state
    localStorage.setItem("MeetingCurrentView", 2);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);

    // Reset search fields and UI state
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
    setSearchMeeting(false);
    setSearchText("");
    setentereventIcon(false);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && searchText !== "") {
      let searchData = {
        Date: "",
        Title: searchText,
        HostName: "",
        UserID: Number(localStorage.getItem("userID")),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        PublishedMeetings: Number(currentView) === 1 ? true : false,
      };
      console.log("chek search meeting");
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      setentereventIcon(true);
    }
  };

  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
    setSearchText("");
  };

  // Clear Search Input Value with reset all settings
  const handleClearSearch = async () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(localStorage.getItem("userID")),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSearchText("");
    setentereventIcon(false);
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
  };

  if (isCreateEditMeeting) {
    return <CreateEditAdvanceMeeting />;
  }

  return (
    <>
      {/* Header Section - Contains title and schedule meeting dropdown */}
      <Row>
        <Col sm={12} md={12} lg={6} className='d-flex align-items-center  '>
          <span className={styles["NewMeetinHeading"]}>{t("Meetings")}</span>
          <span>
            {/* Schedule Meeting Dropdown - Feature-based access control */}
            <ReactBootstrapDropdown
              className='SceduleMeetingButton d-inline-block position-relative ms-2'
              // onClick={eventClickHandler}
            >
              <ReactBootstrapDropdown.Toggle title={t("Schedule-a-meeting")}>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["schedule_button"]}>
                    <Plus width={20} height={20} fontWeight={800} />
                    <span> {t("Schedule-a-meeting")}</span>
                  </Col>
                </Row>
              </ReactBootstrapDropdown.Toggle>

              <ReactBootstrapDropdown.Menu>
                {/* Quick meeting option - Feature ID 1 */}
                {checkFeatureIDAvailability(1) ? (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    // onClick={CreateQuickMeetingFunc}
                  >
                    {t("Quick-meeting")}
                  </ReactBootstrapDropdown.Item>
                ) : null}

                {/* Advance meeting option - Feature ID 9 */}
                {checkFeatureIDAvailability(9) ? (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={() => setIsCreateEditMeeting(true)}>
                    {t("Advance-meeting")}
                  </ReactBootstrapDropdown.Item>
                ) : null}

                {/* Propose new meeting option - Feature ID 12 */}
                {checkFeatureIDAvailability(12) ? (
                  <>
                    <ReactBootstrapDropdown.Item
                      className={styles["dropdown-item"]}
                      // onClick={openProposedNewMeetingPage}
                    >
                      {t("Propose-new-meeting")}
                    </ReactBootstrapDropdown.Item>
                  </>
                ) : null}
              </ReactBootstrapDropdown.Menu>
            </ReactBootstrapDropdown>
          </span>
        </Col>

        {/* Search Section */}
        <Col sm={12} md={12} lg={6}>
          <div className='position-relative'>
            {/* Main search input field */}
            <TextField
              width={"100%"}
              placeholder={t("Search-on-meeting-title")}
              applyClass={"meetingSearch"}
              name={"SearchVal"}
              labelclass='d-none'
              value={searchText}
              change={handleSearchChange}
              onKeyDown={handleKeyPress}
              inputicon={
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    {/* Clear search icon - shows when search is active */}
                    {entereventIcon === true ? (
                      <img
                        src={BlackCrossIcon}
                        className='cursor-pointer'
                        onClick={handleClearSearch}
                        alt=''
                        draggable='false'
                      />
                    ) : null}
                    {/* Advanced search filters toggle */}
                    <Tooltip placement='bottomLeft' title={t("Search-filters")}>
                      <img
                        src={searchIcon}
                        className={styles["Search_Bar_icon_class"]}
                        onClick={HandleShowSearch} // Add click functionality here
                        alt=''
                        draggable='false'
                      />
                    </Tooltip>
                  </Col>
                </Row>
              }
              iconclassname={styles["polling_searchinput"]}
            />

            {/* Advanced Search Modal - Conditional rendering */}
            {searchMeeting ? (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Search-Box_meeting"]}>
                    {/* Modal header with close button */}
                    <Row className='mt-2'>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex justify-content-end'>
                        <img
                          src={BlackCrossIcon}
                          className={styles["Cross_Icon_Styling"]}
                          width='16px'
                          height='16px'
                          onClick={HandleCloseSearchModalMeeting}
                          alt=''
                          draggable='false'
                        />
                      </Col>
                    </Row>

                    {/* Search form fields */}
                    <Row className='mt-4'>
                      <Col lg={12} md={12} sm={12}>
                        <TextField
                          placeholder={t("Meeting-title")}
                          applyClass={"meetinInnerSearch"}
                          labelclass='d-none'
                          name='MeetingTitle'
                          value={searchFields.MeetingTitle}
                          change={searchMeetingChangeHandler}
                        />
                      </Col>
                    </Row>

                    <Row className='mt-3'>
                      {/* Date picker field */}
                      <Col lg={6} md={6} sm={12}>
                        <DatePicker
                          value={searchFields.DateView}
                          format={"DD/MM/YYYY"}
                          placeholder='DD/MM/YYYY'
                          render={
                            <InputIcon
                              placeholder='DD/MM/YYYY'
                              className='datepicker_input'
                            />
                          }
                          editable={false}
                          className='datePickerTodoCreate2'
                          onOpenPickNewDate={false}
                          calendar={calendarValue} // Arabic calendar
                          locale={localValue} // Arabic locale
                          ref={calendRef}
                          onFocusedDateChange={meetingDateChangeHandler}
                        />
                      </Col>

                      {/* Organizer name field */}
                      <Col lg={6} md={6} sm={12}>
                        <TextField
                          placeholder={t("Organizer-name")}
                          labelclass='d-none'
                          name='OrganizerName'
                          applyClass={"meetinInnerSearch"}
                          value={searchFields.OrganizerName}
                          change={searchMeetingChangeHandler}
                        />
                      </Col>
                    </Row>

                    {/* Search action buttons */}
                    <Row className='mt-4'>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className='d-flex justify-content-end gap-2'>
                        <Button
                          text={t("Reset")}
                          className={styles["ResetButtonMeeting"]}
                          // onClick={handleReset}
                        />
                        <Button
                          text={t("Search")}
                          className={styles["SearchButtonMeetings"]}
                          // onClick={handleSearch}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            ) : null}
          </div>
        </Col>
      </Row>

      {/* Meeting Tabs and List Section */}
      <Row>
        <Col lg={12} md={12} sm={12}>
          <span className={styles["PaperStylesMeetingTwoPage"]}>
            {/* Tab navigation buttons */}
            <Row>
              <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                <Button
                  text={t("Published")}
                  className={
                    localStorage.getItem("MeetingCurrentView") !== null &&
                    Number(localStorage.getItem("MeetingCurrentView")) === 1
                      ? styles["publishedMeetingButton-active"]
                      : styles["publishedMeetingButton"]
                  }
                  onClick={handlePublishedMeeting}
                />
                <Button
                  text={t("Draft")}
                  className={
                    localStorage.getItem("MeetingCurrentView") !== null &&
                    Number(localStorage.getItem("MeetingCurrentView")) === 3
                      ? styles["UnpublishedMeetingButton-active"]
                      : styles["UnpublishedMeetingButton"]
                  }
                  onClick={handleDraftMeeting}
                />
                <Button
                  text={t("Proposed")}
                  className={
                    localStorage.getItem("MeetingCurrentView") !== null &&
                    Number(localStorage.getItem("MeetingCurrentView")) === 2
                      ? styles["UnpublishedMeetingButton-active"]
                      : styles["UnpublishedMeetingButton"]
                  }
                  onClick={handleProposedMeeting}
                />
              </Col>
            </Row>

            {/* Conditional rendering of meeting lists based on selected tab */}
            {localStorage.getItem("MeetingCurrentView") !== null &&
            Number(localStorage.getItem("MeetingCurrentView")) === 2 ? (
              <ProposedMeetingList />
            ) : localStorage.getItem("MeetingCurrentView") !== null &&
              Number(localStorage.getItem("MeetingCurrentView")) === 3 ? (
              <DraftNeetingList />
            ) : localStorage.getItem("MeetingCurrentView") !== null &&
              Number(localStorage.getItem("MeetingCurrentView")) === 1 ? (
              <PublishedMeetingList />
            ) : null}

            {/* Pagination section - Currently commented out */}
          </span>
        </Col>
      </Row>
    </>
  );
};

export default MainMeeting;
