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
  setViewTab,
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
import {
  dashboardCalendarEvent,
  validateEncryptedStringViewMeetingLinkApi,
} from "../../store/actions/NewMeetingActions";
import {
  createConvert,
  getCurrentDateTimeUTC,
} from "../../commen/functions/date_formater";
import {
  getViewMeetingByMeetingIdApi,
  joinMeetingApi,
  setCurrentMeetingInfo,
  UpdateMeetingStatusApi,
} from "../../store/actions/NewMeeting2.actions";
import { useMeetingContext } from "../../context/MeetingContext";
import {
  MEETING_STATUS,
  PARTICIPANT_ROLE,
  MEETING_VIEWS,
} from "./commonComponents/meeting.constants";
import {
  isMeetingActive,
  isMeetingPublished,
  getParticipantRole,
  buildVideoTalk,
  buildEditorRole,
  getMeetingFilters,
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
    setIsQuickMeetingView,
  } = useNewMeetingContext();

  const { setEditorRole, setVideoTalk } = useMeetingContext();

  const { handleViewMeeting, handleJoinMeeting } = useMeetingListActions();

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
          PublishedMeetings: true,
          ProposedMeetings: false,
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

    localStorage.setItem("MeetingCurrentView", MEETING_VIEWS.PUBLISHED);
    localStorage.setItem("MeetingPageRows", 30);
    localStorage.setItem("MeetingPageCurrent", 1);
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

  // ─── View Meeting Link Handler ───────────────────────────────────────────
  useEffect(() => {
    let viewMeetingRoute = localStorage.getItem("viewMeetingLink");

    if (!viewMeetingRoute) return;

    const handleViewMeetingLink = async () => {
      try {
        const getResponse = await dispatch(
          validateEncryptedStringViewMeetingLinkApi(
            viewMeetingRoute,
            navigate,
            t,
          ),
        );

        if (getResponse.isExecuted && getResponse.responseCode === 1) {
          const {
            attendeeId,
            isQuickMeeting,
            meetingID,
            meetingStatusId,
            organizationID,
            userID,
            isChat,
            talkGroupId,
            isVideo,
            videoCallUrl,
            isMinutePublished,
          } = getResponse.response;

          const role = getParticipantRole(attendeeId);

          // If meeting is active, join immediately
          if (isMeetingActive(meetingStatusId)) {
            localStorage.setItem("videoCallURL", videoCallUrl);
            setVideoTalk(
              buildVideoTalk({
                isChat,
                isVideoCall: isVideo,
                talkGroupID: talkGroupId,
              }),
            );
            setEditorRole(
              buildEditorRole(
                { statusID: meetingStatusId, isPrimaryOrganizer: false },
                role,
              ),
            );

            dispatch(
              joinMeetingApi(
                navigate,
                t,
                {
                  VideoCallURL: videoCallUrl,
                  FK_MDID: Number(meetingID),
                  DateTime: getCurrentDateTimeUTC(),
                },
                "JoinMeetingFromListing",
                {
                  role,
                  isQuickMeeting,
                  record: { FK_MDID: meetingID },
                  setIsQuickMeetingView,
                },
              ),
            );
            return;
          }

          // Handle quick meeting view
          if (isQuickMeeting) {
            await dispatch(
              getViewMeetingByMeetingIdApi(
                navigate,
                t,
                { MeetingID: meetingID },
                "ViewQuickMeetingFromListing",
                { setIsQuickMeetingView },
              ),
            );
            return;
          }

          // Handle advance meeting view
          dispatch(setCurrentMeetingInfo({ meetingID }));
          dispatch(toggleViewMeetingModal(true));
          dispatch(setViewTab("meetingDetails"));
          setEditorRole(
            buildEditorRole(
              { statusID: meetingStatusId, isPrimaryOrganizer: false },
              role,
            ),
          );
        }
      } catch (error) {
        console.error("View meeting link error:", error);
      } finally {
        localStorage.removeItem("viewMeetingLink");
      }
    };

    handleViewMeetingLink();
  }, [localStorage.getItem("viewMeetingLink")]);

  useEffect(() => {
    if (state !== null) {
      try {
        const { message = "", response = null } = state;

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

        if (message === "MeetingPollCreated") {
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
      } catch (error) {}
    }
  }, [state]);

  useEffect(() => {
    if (state !== null) {
      try {
        const {
          key,
          value: { meetingStatusId, isQuickMeeting, meetingID, attendeeId },
        } = state;

        if (key === "viewMeeting_action") {
          // If the meeting is Published State
          if (meetingStatusId === 1) {
            // If the is Quick Meeting, then open the Quick Meeting View Modal
            if (isQuickMeeting) {
              dispatch(
                getViewMeetingByMeetingIdApi(
                  navigate,
                  t,
                  { MeetingID: meetingID },
                  "ViewQuickMeetingFromListing",
                  { setIsQuickMeetingView },
                ),
              );
            }
            // if the meeting is not Quick Meeting, then open the Advance Meeting View Modal

            const role =
              attendeeId === 2
                ? "Participant"
                : attendeeId === 3
                  ? "Agenda Contributor"
                  : "Organizer";

            setEditorRole(
              buildEditorRole(
                {
                  status: meetingStatusId,
                  isPrimaryOrganizer: false,
                },
                role,
              ),
            );

            dispatch(setCurrentMeetingInfo({ meetingID: meetingID }));
            dispatch(toggleViewMeetingModal(true));
            dispatch(setViewTab("meetingDetails"));
          }
        }
        navigate(pathname, {
          replace: true,
          state: null,
        });
      } catch (error) {}
    }
  }, [state]);

  // ─── Calendar Dashboard Event Handler ──────────────────────────────────
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

  const handleStartMeeting = async (record) => {
    const meetingId = Number(record.pK_MDID);
    const startRequest = {
      MeetingID: meetingId,
      StatusID: MEETING_STATUS.ACTIVE,
    };

    // Handle advance meeting start
    if (!record.isQuickMeeting) {
      dispatch(
        UpdateMeetingStatusApi(
          navigate,
          t,
          startRequest,
          "startMeetingFromMainListing",
          { record },
        ),
      );

      setVideoTalk(buildVideoTalk(record));
      localStorage.setItem("videoCallURL", record.videoCallURL);
      localStorage.setItem("isMinutePublished", record.isMinutePublished);
      localStorage.setItem("meetingTitle", record.title);

      setEditorRole({
        status: String(MEETING_STATUS.ACTIVE),
        role: "Organizer",
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      });
      return;
    }

    // Handle quick meeting start
    dispatch(
      UpdateMeetingStatusApi(
        navigate,
        t,
        startRequest,
        "startQuickMeetingFromMainListing",
        { record, setIsQuickMeetingView },
      ),
    );
  };

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

  const HandleCloseSearchModalMeeting = () => {
    setSearchMeeting(false);
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
          Date: createConvert(new Date(searchFields.Date)).slice(0, 8),
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
    setSearchFeilds({
      MeetingTitle: "",
      Date: "",
      OrganizerName: "",
      DateView: "",
    });
    console.log(searchFields, searchText, "handleClickSearch");
  };

  // ─── Create Handlers ──────────────────────────────────────────────────

  const handleCreateAdvanceMeeting = () => {
    dispatch(setAdvanceMeetingRoute(1));
    dispatch(toggleCreateEditMeetingModal(true));
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
