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
import { useMeetingListActions } from "@/container/meeting/commonComponents/useMeetingListActions";
import { useMeetingLinkActions } from "@/container/meeting/commonComponents/useMeetingLinkActions";
import ProposedMeetingList from "@/container/meeting/proposedMeetingFlow";
import DraftNeetingList from "@/container/meeting/draftMeeting";
import PublishedMeetingList from "@/container/meeting/publishMeeting";
import DatePicker from "react-multi-date-picker";
import InputIcon from "react-multi-date-picker/components/input_icon";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { useLocation, useNavigate } from "react-router-dom";
import { clearMeetingState } from "@/store/actions/NewMeetingActions";
import { useDispatch, useSelector } from "react-redux";
import CreateEditAdvanceMeeting from "./advanceMeeting/createEditAdvanceMeeting";
import CreateEditProposedMeetingModal from "./proposedMeetingFlow/SceduleProposedMeeting/SceduleProposedmeeting";
import ViewMeetingModal from "./advanceMeeting/viewAdvanceMeeting";
import CreateQuickMeeting from "./quickMeeting/CreateQuickMeeting/CreateQuickMeeting";
import UpdateQuickMeeting from "./quickMeeting/UpdateQuickMeeting/UpdateQuickMeeting";
import ViewQuickMeeting from "./quickMeeting/ViewQuickMeeting";
import {
  setAdvanceMeetingRoute,
  setProposedMeetingRoute,
  toggleCreateEditMeetingModal,
  toggleCreateEditProposedMeetingModal,
  toggleViewMeetingModal,
  toggleViewProposedMeetingModal,
  toggleIsParticipantProposedMeetingDates,
} from "../../store/actions/ModalStates_actions";
import { GetAllMeetingTypesNewFunction } from "@/store/actions/NewMeetingActions";
import { listOfMeetingsApi } from "@/store/actions/NewMeeting2.actions";
import ProposedNewMeeting from "./proposedMeetingFlow/ProposedNewMeeting/ProposedNewMeeting";
import ViewProposedMeetingModal from "./proposedMeetingFlow/ViewProposedMeetingModal/ViewProposedMeetingModal";
import ViewParticipantsDates from "./proposedMeetingFlow/ViewParticipantsDates/ViewParticipantsDates";
import { dashboardCalendarEvent } from "../../store/actions/NewMeetingActions";
import { createConvert } from "../../commen/functions/date_formater";
import { resetCurrentMeetingInfo } from "../../store/actions/NewMeeting2.actions";
import { useMeetingContext } from "../../context/MeetingContext";
import {
  PARTICIPANT_ROLE,
  MEETING_VIEWS,
} from "./commonComponents/meeting.constants";
import {
  isMeetingActive,
  getMeetingFilters,
  isMeetingPublished,
} from "./commonComponents/meeting.utils";

const MainMeeting = () => {
  const { t } = useTranslation();
  const { state, pathname } = useLocation();

  let currentView = Number(localStorage.getItem("MeetingCurrentView"));
  let meetingpageRow = Number(localStorage.getItem("MeetingPageRows"));
  let meetingPageCurrent = Number(localStorage.getItem("MeetingPageCurrent"));

  const getALlMeetingTypes = useSelector(
    (state) => state.NewMeetingreducer.getALlMeetingTypes,
  );
  const createEditMeetingModal = useSelector(
    (state) => state.ModalStatesReducer.isCreateEditMeetingModal,
  );
  const isViewMeetingModal = useSelector(
    (state) => state.ModalStatesReducer.isViewMeetingModal,
  );
  const createEditProposedMeetingModal = useSelector(
    (state) => state.ModalStatesReducer.isCreateEditProposedMeetingModal,
  );
  const isViewProposedMeetingModal = useSelector(
    (state) => state.ModalStatesReducer.isViewProposedMeetingModal,
  );
  const isParticiapntRespondProposedMeeting = useSelector(
    (state) => state.ModalStatesReducer.isParticiapntRespondProposedMeeting,
  );

  const CalendarDashboardEventData = useSelector(
    (state) => state.NewMeetingreducer.CalendarDashboardEventData,
  );

  const calendRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    isQuickMeetingCreate,
    setIsQuickMeetingCreate,
    isQuickMeetingUpdate,
    setIsQuickMeetingUpdate,
    isQuickMeetingView,
  } = useNewMeetingContext();

  const { setEditorRole } = useMeetingContext();

  const { handleViewMeeting, handleJoinMeeting, handleStartMeeting } =
    useMeetingListActions();
  const { openMeetingFromLinkData, handleEncryptedMeetingLink } =
    useMeetingLinkActions();

  const [searchText, setSearchText] = useState("");
  const [localValue, setLocalValue] = useState(gregorian_en);
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [entereventIcon, setentereventIcon] = useState(false);
  const [searchMeeting, setSearchMeeting] = useState(false);

  const [searchFields, setSearchFeilds] = useState({
    MeetingTitle: "",
    Date: "",
    OrganizerName: "",
    DateView: "",
  });
  // ─── Initial Load ─────────────────────────────────────────────────────────
  useEffect(() => {
    const userID = Number(localStorage.getItem("userID"));
    const currentView =
      localStorage.getItem("MeetingCurrentView") !== null
        ? Number(localStorage.getItem("MeetingCurrentView"))
        : 1;
    const filters = getMeetingFilters(currentView);
    dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: userID,
          PageNumber: 1,
          Length: 30,
          ...filters,
        },
        "mainListing",
        {},
      ),
    );

    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      dispatch(GetAllMeetingTypesNewFunction(navigate, t));
    }
    localStorage.setItem("MeetingCurrentView", currentView);

    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);

    return () => {
      localStorage.removeItem("MeetingCurrentView");
      localStorage.removeItem("MeetingPageRows");
      localStorage.removeItem("MeetingPageCurrent");
    };
  }, []);

  // ─── Reset view/edit modal flags on unmount ──────────────────────────────
  // These live in the shared ModalStatesReducer (also read by Committee.js
  // and Groups.js), so leaving them true would make whichever tab renders
  // next pop the same modal straight back open on arrival.
  useEffect(() => {
    return () => {
      dispatch(toggleCreateEditMeetingModal(false));
      dispatch(toggleViewMeetingModal(false));
      dispatch(toggleCreateEditProposedMeetingModal(false));
      dispatch(toggleViewProposedMeetingModal(false));
      dispatch(toggleIsParticipantProposedMeetingDates(false));
    };
  }, []);
  // ─── Email links (view / agenda-edit / start / update) ───────────────────
  // PrivateRoutes stashes the token before this page's first render, so read
  // it here on mount (not from a render-time const that only updates on a
  // later re-render). Only one link is handled; any other stale link keys are
  // dropped so they can't hijack a later visit. A started meeting joins
  // straight away, otherwise it opens like a listing click.
  useEffect(() => {
    const emailLinks = [
      ["mtAgUpdate", "agenda"],
      ["viewMeetingLink", "meetingDetails"],
      ["meetingStr", "meetingDetails"],
      ["meetingUpd", "meetingDetails"],
    ];
    const [linkKey, linkTab] =
      emailLinks.find(([key]) => localStorage.getItem(key)) || [];
    emailLinks.forEach(([key]) => {
      if (key !== linkKey) localStorage.removeItem(key);
    });
    if (linkKey) {
      handleEncryptedMeetingLink(localStorage.getItem(linkKey), linkKey, linkTab);
    }
  }, []);

  useEffect(() => {
    if (state !== null) {

      console.log("state?.key", state?.key, state?.value, state);

      try {
        const { message = "", response = null } = state;

        if (message === "throughUpcomingEvents") {
          return;
        }

        let obj = {
          isQuickMeeting: response.isQuickMeeting,
          pK_MDID: response.MeetingID,
          isParticipant: response.attendeeRole === "Participant",
          isAgendaContributor: response.attendeeRole === "AgendaContributor",
          isOrganizer: response.attendeeRole === "Organizer",
          isPrimaryOrganizer: false,
          status: response.meetingStatusID,
          videoCallURL: response.videoCallUrl,
          isChat: response.isChat,
          isVideoCall: response.isVideoCall,
          talkGroupID: response.talkGroupID,
        };

        console.log("messagemessage", message, response);

        if (message === "proposedmeeting") {
          loadMeetings({
            PublishedMeetings: false,
            ProposedMeetings: true,
            view: MEETING_VIEWS.PROPOSED,
          });

          // setCurrentCommitteeMeetingTabActive(2);
        }
        if (message === "ViewMeeting") {
          loadMeetings({
            PublishedMeetings: true,
            ProposedMeetings: false,
            view: MEETING_VIEWS.PUBLISHED,
          });

          handleViewMeeting(obj);
        }
        if (message === "JoinMeeting") {
          loadMeetings({
            PublishedMeetings: true,
            ProposedMeetings: false,
            view: MEETING_VIEWS.PUBLISHED,
          });

          handleJoinMeeting(obj);
        }

        if (message === "Poll_Created_In_Meeting") {
          loadMeetings({
            PublishedMeetings: true,
            ProposedMeetings: false,
            view: MEETING_VIEWS.PUBLISHED,
          });
          handleViewMeeting(obj, "polls");
        }

        if (message === "MeetingListing") {
          loadMeetings({
            PublishedMeetings: true,
            ProposedMeetings: false,
            view: MEETING_VIEWS.PUBLISHED,
          });
        }
        navigate(pathname, {
          replace: true,
          state: null,
        });
      } catch (error) {
        console.error("src/container/meeting/index.jsx:", error);
      }
    }
  }, [state]);

  // /Redirected (EmailActionHandler) hands the validated link data over via
  // navigation state — same data shape as the token flows above.
  useEffect(() => {
    if (state?.key === "viewMeeting_action" && state?.value) {
      openMeetingFromLinkData(state.value, "meetingDetails").catch((error) =>
        console.error("src/container/meeting/index.jsx:", error),
      );
      navigate(pathname, {
        replace: true,
        state: null,
      });
    }
  }, [state]);

  useEffect(() => {
    if (!CalendarDashboardEventData) {
      dispatch(dashboardCalendarEvent(null));
      return;
    }

    try {
      const data = CalendarDashboardEventData;
      const statusId = Number(data.status);

      // Handle ACTIVE meetings (status = 10)
      if (isMeetingActive(statusId)) {
        // All active meetings - join regardless of role
        console.log("Active meeting - joining:", data);
        handleJoinMeeting(data);
      }
      // Handle PUBLISHED meetings (status = 1)
      else if (isMeetingPublished(statusId)) {
        if (data.IsViewOpenOnly) {
          console.log("View only meeting");
          handleViewMeeting(data);
        } else {
          console.log("Meeting about to start:", data);
          handleStartMeeting(data);
        }
      }

      dispatch(dashboardCalendarEvent(null));
    } catch (error) {
      console.error("Dashboard calendar event error:", error);
      dispatch(dashboardCalendarEvent(null));
    }
  }, [CalendarDashboardEventData]);

  // ─── Meeting Handlers ──────────────────────────────────────────────────

  // ─── Tab Handlers ──────────────────────────────────────────────────

  const handlePublishedMeeting = async () => {
    await loadMeetings({
      PublishedMeetings: true,
      ProposedMeetings: false,
      view: MEETING_VIEWS.PUBLISHED,
    });
  };

  const handleDraftMeeting = async () => {
    await loadMeetings({
      PublishedMeetings: false,
      ProposedMeetings: false,
      view: MEETING_VIEWS.DRAFT,
    });
  };

  const handleProposedMeeting = async () => {
    await loadMeetings({
      PublishedMeetings: false,
      ProposedMeetings: true,
      view: MEETING_VIEWS.PROPOSED,
    });
  };

  const loadMeetings = async ({
    PublishedMeetings,
    ProposedMeetings,
    view,
  }) => {
    dispatch(clearMeetingState());

    if (
      getALlMeetingTypes.length === 0 &&
      Object.keys(getALlMeetingTypes).length === 0
    ) {
      await dispatch(GetAllMeetingTypesNewFunction(navigate, t, true));
    }

    const userID = Number(localStorage.getItem("userID"));
    await dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: userID,
          PageNumber: 1,
          Length: 30,
          PublishedMeetings,
          ProposedMeetings,
        },
        "mainListing",
        {},
      ),
    );

    localStorage.setItem("MeetingCurrentView", view);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);

    // Reset search
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

  // ─── Search Handlers ──────────────────────────────────────────────────

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleKeyPress = async (event) => {
    if (event.key === "Enter" && searchText !== "") {
      const currentView = Number(localStorage.getItem("MeetingCurrentView"));
      const filters = getMeetingFilters(currentView);

      await dispatch(
        listOfMeetingsApi(
          navigate,
          t,
          {
            Date: "",
            Title: searchText,
            HostName: "",
            UserID: Number(localStorage.getItem("userID")),
            PageNumber: meetingPageCurrent ? Number(meetingPageCurrent) : 1,
            Length: meetingpageRow ? Number(meetingpageRow) : 50,
            ...filters,
          },
          "mainListing",
          {},
        ),
      );
      setentereventIcon(true);
    }
  };

  const handleClearSearch = async () => {
    const currentView = Number(localStorage.getItem("MeetingCurrentView"));
    const filters = getMeetingFilters(currentView);

    await dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(localStorage.getItem("userID")),
          PageNumber: meetingPageCurrent ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow ? Number(meetingpageRow) : 50,
          ...filters,
        },
        "mainListing",
        {},
      ),
    );

    setSearchText("");
    setentereventIcon(false);
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
  };

  const HandleShowSearch = () => {
    setSearchMeeting(!searchMeeting);
    setSearchText("");
  };

  const HandleCloseSearchModalMeeting = async () => {
    setSearchMeeting(false);

    // A search is currently applied: closing must undo it, not just hide the
    // form. Previously the fields were cleared but the API was never called, so
    // the list stayed filtered while the modal looked reset. handleClearSearch
    // hits the API with empty filters and clears the fields, top box and ✕.
    if (entereventIcon) {
      await handleClearSearch();
      return;
    }

    // Nothing was searched (fields may just have been typed into) — the list is
    // not filtered, so there is nothing to reset on the server.
    setSearchFeilds({
      ...searchFields,
      Date: "",
      DateView: "",
      MeetingTitle: "",
      OrganizerName: "",
    });
  };

  const searchMeetingChangeHandler = (event) => {
    const { name, value } = event.target;
    setSearchFeilds({
      ...searchFields,
      [name]: value,
    });
  };

  const meetingDateChangeHandler = (value) => {
    setSearchFeilds({
      ...searchFields,
      Date: value,
      DateView: value,
    });
  };

  const handleClickSearch = async () => {
    const currentView = Number(localStorage.getItem("MeetingCurrentView"));
    const filters = getMeetingFilters(currentView);

    await dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: searchFields.Date !== "" ? createConvert(new Date(searchFields.Date)).slice(0, 8) : "",
          Title: searchFields.MeetingTitle,
          HostName: searchFields.OrganizerName,
          UserID: Number(localStorage.getItem("userID")),
          PageNumber: meetingPageCurrent ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow ? Number(meetingpageRow) : 50,
          ...filters,
        },
        "mainListing",
        {},
      ),
    );
    console.log(searchFields, searchText, "handleClickSearch");

    // The search is now applied, so tidy up the UI to match:
    //  - `entereventIcon` doubles as "a search is applied" (it is what shows
    //    the reset ✕ in the top box). Without it, once this modal closes there
    //    was no way to see or undo the filter. It stays off when every field
    //    was empty, because that request just returns the unfiltered list.
    //  - clear the modal's fields and the top box, so nothing stale is left
    //    behind for the next search, then close the modal.
    const hasCriteria =
      searchFields.MeetingTitle.trim() !== "" ||
      searchFields.OrganizerName.trim() !== "" ||
      searchFields.Date !== "";
    setentereventIcon(hasCriteria);
    setSearchText("");
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
    setSearchMeeting(false);
  };

  const handleClickReset = async () => {
    const currentView = Number(localStorage.getItem("MeetingCurrentView"));
    const filters = getMeetingFilters(currentView);

    await dispatch(
      listOfMeetingsApi(
        navigate,
        t,
        {
          Date: "",
          Title: "",
          HostName: "",
          UserID: Number(localStorage.getItem("userID")),
          PageNumber: meetingPageCurrent ? Number(meetingPageCurrent) : 1,
          Length: meetingpageRow ? Number(meetingpageRow) : 50,
          ...filters,
        },
        "mainListing",
        {},
      ),
    );

    setSearchText("");
    // The list is unfiltered again, so the "search applied" ✕ must go too.
    setentereventIcon(false);
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
    // Close the modal as well, matching what Search does — Reset used to leave
    // an empty form sitting open.
    setSearchMeeting(false);
  };

  // ─── Create Handlers ──────────────────────────────────────────────────

  const handleCreateAdvanceMeeting = () => {
    dispatch(setAdvanceMeetingRoute(1));
    dispatch(toggleCreateEditMeetingModal(true));
    setEditorRole({
      status: "11",
      role: "Organizer",
      isPrimaryOrganizer: true,
    });
    dispatch(resetCurrentMeetingInfo())
    
  };

  const handleCreateProposedMeeting = () => {
    dispatch(setProposedMeetingRoute(1));
    dispatch(toggleCreateEditProposedMeetingModal(true));
  };

  // ─── Render Logic ──────────────────────────────────────────────────

  if (createEditMeetingModal) {
    return <CreateEditAdvanceMeeting />;
  }
  if (isViewMeetingModal) {
    return <ViewMeetingModal />;
  }
  if (createEditProposedMeetingModal) {
    return <ProposedNewMeeting />;
  }
  if (isViewProposedMeetingModal) {
    return <ViewProposedMeetingModal />;
  }
  if (isParticiapntRespondProposedMeeting) {
    return <ViewParticipantsDates />;
  }

  return (
    <>
      {/* Header Section */}
      <Row>
        <Col sm={12} md={12} lg={6} className='d-flex align-items-center'>
          <span className={styles["NewMeetinHeading"]}>{t("Meetings")}</span>
          <span>
            <ReactBootstrapDropdown className='SceduleMeetingButton d-inline-block position-relative ms-2'>
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
                {checkFeatureIDAvailability(1) && (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={() => setIsQuickMeetingCreate(true)}>
                    {t("Quick-meeting")}
                  </ReactBootstrapDropdown.Item>
                )}
                {checkFeatureIDAvailability(9) && (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={handleCreateAdvanceMeeting}>
                    {t("Create-board-meeting")}
                  </ReactBootstrapDropdown.Item>
                )}
                {checkFeatureIDAvailability(12) && (
                  <ReactBootstrapDropdown.Item
                    className={styles["dropdown-item"]}
                    onClick={handleCreateProposedMeeting}>
                    {t("Proposed-board-meeting")}
                  </ReactBootstrapDropdown.Item>
                )}
              </ReactBootstrapDropdown.Menu>
            </ReactBootstrapDropdown>
          </span>
        </Col>

        {/* Search Section */}
        <Col sm={12} md={12} lg={6}>
          <div className='position-relative'>
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
                    {entereventIcon && (
                      <img
                        src={BlackCrossIcon}
                        className='cursor-pointer'
                        onClick={handleClearSearch}
                        alt=''
                        draggable='false'
                      />
                    )}
                    <img
                      src={searchIcon}
                      className={styles["Search_Bar_icon_class"]}
                      onClick={HandleShowSearch}
                      alt=''
                      draggable='false'
                    />
                  </Col>
                </Row>
              }
              iconclassname={styles["polling_searchinput"]}
            />

            {/* Advanced Search Modal */}
            {searchMeeting && (
              <Row>
                <Col
                  lg={12}
                  md={12}
                  sm={12}
                  className={styles["Search-Box_meeting"]}>
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
                        calendar={calendarValue}
                        locale={localValue}
                        ref={calendRef}
                        onFocusedDateChange={meetingDateChangeHandler}
                      />
                    </Col>
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

                  <Row className='mt-4'>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className='d-flex justify-content-end gap-2'>
                      <Button
                        text={t("Reset")}
                        className={styles["ResetButtonMeeting"]}
                        onClick={handleClickReset}
                      />
                      <Button
                        text={t("Search")}
                        className={styles["SearchButtonMeetings"]}
                        onClick={handleClickSearch}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </Row>

      {/* Meeting Tabs and List Section */}
      <section className={styles.MeetingWrapper}>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <span className={styles["PaperStylesMeetingTwoPage"]}>
              <Row>
                <Col lg={12} md={12} sm={12} className='d-flex gap-2'>
                  <Button
                    text={t("Published")}
                    className={
                      currentView === MEETING_VIEWS.PUBLISHED
                        ? styles["meetingTab-active"]
                        : styles["meetingTab"]
                    }
                    onClick={handlePublishedMeeting}
                  />
                  <Button
                    text={t("Draft")}
                    className={
                      currentView === MEETING_VIEWS.DRAFT
                        ? styles["meetingTab-active"]
                        : styles["meetingTab"]
                    }
                    onClick={handleDraftMeeting}
                  />
                  <Button
                    text={t("Proposed")}
                    className={
                      currentView === MEETING_VIEWS.PROPOSED
                        ? styles["meetingTab-active"]
                        : styles["meetingTab"]
                    }
                    onClick={handleProposedMeeting}
                  />
                </Col>
              </Row>

              {currentView === MEETING_VIEWS.PROPOSED ? (
                <ProposedMeetingList />
              ) : currentView === MEETING_VIEWS.DRAFT ? (
                <DraftNeetingList />
              ) : currentView === MEETING_VIEWS.PUBLISHED ? (
                <PublishedMeetingList />
              ) : null}
            </span>
          </Col>
        </Row>

        {isQuickMeetingCreate && <CreateQuickMeeting checkFlag={5} />}
        {isQuickMeetingUpdate && <UpdateQuickMeeting checkFlag={4} />}
        {isQuickMeetingView && <ViewQuickMeeting />}
      </section>
    </>
  );
};

export default MainMeeting;
