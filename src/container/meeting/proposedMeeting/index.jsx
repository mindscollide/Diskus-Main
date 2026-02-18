import React, { useContext, useEffect, useMemo, useState } from "react";
import { Col, Row, ProgressBar } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "react-bootstrap-icons";
import { Checkbox, Menu, Popover } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment";

// Context
import { MeetingContext } from "../../../context/MeetingContext";
import { useNewMeetingContext } from "../../../context/NewMeetingContext";

// Components
import { Button, Table } from "../../../components/elements";
import CustomButton from "../../../components/elements/button/Button";
import EmptyTableComponent from "../../pages/meeting/EmptyTableComponent/EmptyTableComponent";
import SceduleProposedmeeting from "../../pages/meeting/scedulemeeting/meetingDetails/ProposedMeeting/SceduleProposedMeeting/SceduleProposedmeeting";
import DeleteMeetingModal from "../../pages/meeting/scedulemeeting/meetingDetails/ProposedMeeting/DeleteMeetingModal/DeleteMeetingModal";
import DeleteMeetingConfirmationModal from "../../pages/meeting/deleteMeetingConfirmationModal/deleteMeetingConfirmationModal";

// Date formatters
import {
  forRecentActivity,
  getDifferentisDateisPassed,
  newTimeFormaterAsPerUTCFullDate,
  utcConvertintoGMT,
} from "../../../commen/functions/date_formater";

// Status helper
import { StatusValue } from "../../pages/meeting/statusJson";

// Redux actions
import {
  GetAllMeetingDetailsApiFunc,
  showSceduleProposedMeeting,
  scheduleMeetingPageFlag,
  viewProposeDateMeetingPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
  viewProposeOrganizerMeetingPageFlag,
  viewMeetingFlag,
  meetingDetailsGlobalFlag,
  organizersGlobalFlag,
  agendaContributorsGlobalFlag,
  participantsGlobalFlag,
  agendaGlobalFlag,
  meetingMaterialGlobalFlag,
  minutesGlobalFlag,
  proposedMeetingDatesGlobalFlag,
  actionsGlobalFlag,
  pollsGlobalFlag,
  attendanceGlobalFlag,
  uploadGlobalFlag,
  meetingAgendaContributorAdded,
  meetingAgendaContributorRemoved,
  meetingOrganizerAdded,
  meetingOrganizerRemoved,
  validateStringParticipantProposedApi,
  GetAllProposedMeetingDateApiFunc,
  GetAllSavedparticipantsAPI,
  validateStringUserMeetingProposedDatesPollsApi,
  ProposedMeetingViewFlagAction,
  meetingStatusProposedMqtt,
} from "../../../store/actions/NewMeetingActions";

import {
  GetAllUserChats,
  activeChat,
} from "../../../store/actions/Talk_action";

import { UpdateOrganizersMeeting } from "../../../store/actions/MeetingOrganizers_action";

// Utils
import {
  convertToArabicNumerals,
  truncateString,
} from "../../../commen/functions/regex";
import { checkFeatureIDAvailability } from "../../../commen/functions/utils";
import {
  getAllUnpublishedMeetingData,
  mqttMeetingData,
} from "../../../hooks/meetingResponse/response";

// Icons
import rspvGreenIcon from "../../../assets/images/rspvGreen.svg";
import EditIcon from "../../../assets/images/New Meeting Listing Icons/EditMeeting.png";
import CancelMeetingIcon from "../../../assets/images/New Meeting Listing Icons/CancelMeeting.png";
import SortIconAscend from "../../../assets/images/sortingIcons/SorterIconAscend.png";
import SortIconDescend from "../../../assets/images/sortingIcons/SorterIconDescend.png";
import ArrowDownIcon from "../../../assets/images/sortingIcons/Arrow-down.png";
import ArrowUpIcon from "../../../assets/images/sortingIcons/Arrow-up.png";
import ChevronDownIcon from "../../../assets/images/dropdown-icon.png";

// Styles (reuse ProposedMeeting styles)
import styles from "../../pages/meeting/scedulemeeting/meetingDetails/ProposedMeeting/ProposedMeeting.module.css";

const ProposedMeetingList = ({
  setViewProposeDatePoll,
  setViewProposeOrganizerPoll,
  setAdvanceMeetingModalID,
  setSceduleMeeting,
  setEditMeeting,
  setCurrentMeetingID,
  setDataroomMapFolderId,
  setResponseByDate,
  setVideoTalk,
  setProposedNewMeeting,
  setIsProposedMeetEdit,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ─── Context ───
  const {
    meetingsRecords,
    setMeetingsRecords,
    totalMeetingRecords,
    isMeetingTypeFilter,
    proposedMeetingData,
  } = useNewMeetingContext();

  const {
    deleteMeetingConfirmationModal,
    setDeleteMeetingConfirmationModal,
    setEditorRole,
    setEndMeetingConfirmationModal,
    setDeleteMeetingRecord,
    setViewAdvanceMeetingModal,
    viewAdvanceMeetingModal,
  } = useContext(MeetingContext);

  // ─── Redux selectors ───
  const searchMeetings = useSelector(
    (state) => state.NewMeetingreducer.searchMeetings,
  );
  const sceduleproposedMeeting = useSelector(
    (state) => state.NewMeetingreducer.sceduleproposedMeeting,
  );
  const deleteMeetingModal = useSelector(
    (state) => state.NewMeetingreducer.deleteMeetingModal,
  );
  const allMeetingsSocketData = useSelector(
    (state) => state.meetingIdReducer.allMeetingsSocketData,
  );
  const meetingStatusProposedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusProposedMqttData,
  );
  const meetingStatusPublishedMqttData = useSelector(
    (state) => state.NewMeetingreducer.meetingStatusPublishedMqttData,
  );
  const mqttMeetingAcAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcAdded,
  );
  const mqttMeetingAcRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingAcRemoved,
  );
  const mqttMeetingOrgAdded = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgAdded,
  );
  const mqttMeetingOrgRemoved = useSelector(
    (state) => state.NewMeetingreducer.mqttMeetingOrgRemoved,
  );

  // ─── Local state ───
  const [rows, setRow] = useState([]);
  const [dublicatedrows, setDublicatedrows] = useState([]);
  const [publishState, setPublishState] = useState(null);
  const [meetingTitleSort, setMeetingTitleSort] = useState("ascend");
  const [meetingDateSort, setMeetingDateSort] = useState("ascend");
  const [duplicatedRows, setDuplicatedRows] = useState([]);

  // ─── LocalStorage ───
  let currentUserId = localStorage.getItem("userID");
  let currentOrganizationId = localStorage.getItem("organizationID");
  let MeetingProp = localStorage.getItem("meetingprop");
  let UserMeetPropoDatPoll = localStorage.getItem("UserMeetPropoDatPoll");
  const currentLanguage = localStorage.getItem("i18nextLng");

  // ─── Handlers ───
  const viewProposeDatePollHandler = (
    isParticipant,
    isAgendaContributor,
    isOrganiser,
    id,
    responseDeadLine,
  ) => {
    localStorage.setItem("viewProposeDatePollMeetingID", id);
    if (isParticipant) {
      setResponseByDate(responseDeadLine);
      setViewProposeDatePoll(true);
      dispatch(viewProposeDateMeetingPageFlag(true));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(agendaGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(true));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    } else if (isAgendaContributor) {
      // no-op
    } else if (isOrganiser) {
      dispatch(showSceduleProposedMeeting(true));
      setViewProposeOrganizerPoll(false);
      dispatch(viewProposeOrganizerMeetingPageFlag(false));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(agendaGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(false));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    }
  };

  const handleOpenViewModal = async (data) => {
    setAdvanceMeetingModalID(data.pK_MDID);
    setViewAdvanceMeetingModal(true);
  };

  const handleEditMeeting = async (id, agendaContributorFlag, record) => {
    if (agendaContributorFlag === false && record.status === "12") {
      let Data = { MeetingID: Number(id) };
      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          false,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          2,
        ),
      );
      await dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, true));
      await dispatch(GetAllProposedMeetingDateApiFunc(Data, navigate, t, true));
      setIsProposedMeetEdit(true);
      setProposedNewMeeting(true);
    } else {
      let Data = { MeetingID: Number(id) };
      await dispatch(
        GetAllMeetingDetailsApiFunc(
          navigate,
          t,
          Data,
          false,
          setCurrentMeetingID,
          setSceduleMeeting,
          setDataroomMapFolderId,
          0,
          1,
        ),
      );
      dispatch(scheduleMeetingPageFlag(true));
    }
  };

  const changeDateStartHandler2 = (date) => {
    let newDate;
    if (date.length > 8) {
      let newDate2 = forRecentActivity(date);
      newDate = moment(newDate2).format("DD MMMM YYYY");
    } else {
      newDate = moment(date).format("DD MMMM YYYY");
    }
    return newDate;
  };

  const handleClickDeleteMeeting = async (record) => {
    let Data = { MeetingID: record.pK_MDID, StatusID: 4 };
    setDeleteMeetingRecord(Data);
    setDeleteMeetingConfirmationModal(true);
  };

  // ─── More popover content ───
  const moreButtons = (record) => {
    const handleEdit = () => {
      if (record.isAgendaContributor) {
        dispatch(agendaGlobalFlag(true));
        dispatch(meetingDetailsGlobalFlag(false));
      } else if (record.isOrganizer) {
        dispatch(agendaGlobalFlag(false));
        dispatch(meetingDetailsGlobalFlag(true));
      }
      setEditorRole({
        status: record.status,
        role: record.isAgendaContributor ? "Agenda Contributor" : "Organizer",
        isPrimaryOrganizer: record.isPrimaryOrganizer,
      });
      handleEditMeeting(record.pK_MDID, record.isAgendaContributor, record);
      setVideoTalk({
        isChat: record.isChat,
        isVideoCall: record.isVideoCall,
        talkGroupID: record.talkGroupID,
      });
      localStorage.setItem("videoCallURL", record.videoCallURL);
      setEditMeeting(true);
      dispatch(viewMeetingFlag(true));
      dispatch(meetingDetailsGlobalFlag(false));
      dispatch(organizersGlobalFlag(false));
      dispatch(agendaContributorsGlobalFlag(false));
      dispatch(participantsGlobalFlag(false));
      dispatch(meetingMaterialGlobalFlag(false));
      dispatch(minutesGlobalFlag(false));
      dispatch(proposedMeetingDatesGlobalFlag(false));
      dispatch(actionsGlobalFlag(false));
      dispatch(pollsGlobalFlag(false));
      dispatch(attendanceGlobalFlag(false));
      dispatch(uploadGlobalFlag(false));
    };

    const handleDelete = () => {
      let Data = { MeetingID: record.pK_MDID, StatusID: 4 };
      setDeleteMeetingRecord(Data);
      setDeleteMeetingConfirmationModal(true);
    };

    return (
      <div className={styles.morebuttons}>
        <div className={styles.morebtn} onClick={handleEdit}>
          <img src={EditIcon} alt="" width="16" height="16" />
          <span>{t("Edit-meeting")}</span>
        </div>
        <div className={styles.morebtn} onClick={handleDelete}>
          <img src={CancelMeetingIcon} alt="" width="16" height="16" />
          <span>{t("Delete-meeting")}</span>
        </div>
      </div>
    );
  };

  // ─── Handle table sorting ───
  const handleChangeMeetingTable = (pagination, filters, sorter) => {
    setMeetingTitleSort(null);
    setMeetingDateSort(null);
    if (sorter.order) {
      switch (sorter.columnKey) {
        case "title":
          setMeetingTitleSort(sorter.order);
          break;
        case "date":
          setMeetingDateSort(sorter.order);
          break;
        default:
          break;
      }
    }
  };

  // ─── Table columns ───
  const columns = useMemo(() => {
    return [
      // Meeting Title
      {
        title: (
          <div className="d-flex align-items-center gap-2">
            <span>{t("Meeting-title")}</span>
            {meetingTitleSort === "ascend" ? (
              <img src={SortIconAscend} alt="SortIconAscend" />
            ) : (
              <img src={SortIconDescend} alt="SortIconDescend" />
            )}
          </div>
        ),
        dataIndex: "title",
        key: "title",
        width: 350,
        ellipsis: true,
        sorter: (a, b) => a.title.localeCompare(b.title),
        sortOrder: meetingTitleSort,
        render: (text, record) => (
          <span
            onClick={() => {
              dispatch(ProposedMeetingViewFlagAction(true));
              try {
                let Data = { MeetingID: Number(record.pK_MDID) };
                dispatch(
                  GetAllMeetingDetailsApiFunc(
                    navigate,
                    t,
                    Data,
                    false,
                    setCurrentMeetingID,
                    setSceduleMeeting,
                    setDataroomMapFolderId,
                    0,
                    2,
                  ),
                );
                dispatch(GetAllSavedparticipantsAPI(Data, navigate, t, true));
                dispatch(
                  GetAllProposedMeetingDateApiFunc(Data, navigate, t, true),
                );
              } catch (error) {
                console.log(error, "apis call Error");
              }
            }}
            className={styles.tableRow}
          >
            {text}
          </span>
        ),
      },

      // Deadline
      {
        title: (
          <div className="d-flex align-items-center justify-content-center gap-2">
            <span>{t("Deadline")}</span>
            {meetingDateSort === "ascend" ? (
              <img src={ArrowDownIcon} alt="ArrowUpIcon" />
            ) : (
              <img src={ArrowUpIcon} alt="ArrowDownIcon" />
            )}
          </div>
        ),
        dataIndex: "date",
        key: "date",
        width: 150,
        align: "center",
        sorter: (a, b) => {
          const dateA = new Date(
            a.dateOfMeeting.substring(0, 4),
            parseInt(a.dateOfMeeting.substring(4, 6)) - 1,
            a.dateOfMeeting.substring(6, 8),
          );
          const dateB = new Date(
            b.dateOfMeeting.substring(0, 4),
            parseInt(b.dateOfMeeting.substring(4, 6)) - 1,
            b.dateOfMeeting.substring(6, 8),
          );
          return dateA - dateB;
        },
        sortOrder: meetingDateSort,
        render: (text, record) => {
          let meetingDate = forRecentActivity(
            record.dateOfMeeting + record.meetingStartTime,
          );
          return <>{`${moment(meetingDate).format("Do MMM, YYYY")}`}</>;
        },
      },

      // Meeting Type
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            {t("Meeting-type")}
          </span>
        ),
        dataIndex: "meetingType",
        key: "meetingType",
        width: 140,
        align: "center",
        filters: isMeetingTypeFilter.map((filter) => ({
          text: filter.text,
          value: filter.value,
        })),
        defaultFilteredValue: isMeetingTypeFilter.map((f) => f.value),
        filterResetToDefaultFilteredValue: true,
        onFilter: (value, record) =>
          Number(record.meetingType) === Number(value),
        filterIcon: (filtered) => (
          <ChevronDown
            className={`filter-chevron-icon-todolist ${
              filtered ? "active" : ""
            }`}
          />
        ),
        render: (_, record) => {
          const meetingType = Number(record.meetingType);
          const matchedFilter = isMeetingTypeFilter.find(
            (f) => Number(f.value) === meetingType,
          );
          if (record.isQuickMeeting && meetingType === 1) {
            return t("Quick-meeting");
          }
          return matchedFilter ? t(matchedFilter.text) : "";
        },
      },

      // Vote
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            {t("Vote")}
          </span>
        ),
        dataIndex: "meetingAction",
        width: 90,
        align: "center",
        key: "vote",
        render: (text, record) => {
          let maxValue = record.meetingPoll?.totalNoOfDirectors;
          let value = record.meetingPoll?.totalNoOfDirectorsVoted;
          let allVoterVotedCompleted =
            value === maxValue && value === 0 && maxValue === 0
              ? null
              : record.meetingPoll?.totalNoOfDirectors ===
                record.meetingPoll?.totalNoOfDirectorsVoted;
          if (record.meetingPoll) {
            return (
              allVoterVotedCompleted && (
                <img
                  src={rspvGreenIcon}
                  height="17.06px"
                  width="17.06px"
                  alt=""
                  draggable="false"
                />
              )
            );
          }
          return null;
        },
      },

      // Poll
      {
        title: (
          <span className="d-flex justify-content-center align-items-center">
            {t("Poll")}
          </span>
        ),
        dataIndex: "meetingAction",
        width: 110,
        align: "center",
        key: "poll",
        render: (text, record) => {
          let maxValue = record.meetingPoll?.totalNoOfDirectors;
          let value = record.meetingPoll?.totalNoOfDirectorsVoted;
          let allVoterVotedCompleted =
            value === maxValue && value === 0 && maxValue === 0
              ? null
              : record.meetingPoll?.totalNoOfDirectors ===
                record.meetingPoll?.totalNoOfDirectorsVoted;
          if (record.meetingPoll) {
            return allVoterVotedCompleted ? (
              <img
                src={rspvGreenIcon}
                height="17.06px"
                width="17.06px"
                alt=""
                draggable="false"
              />
            ) : (
              <span className={styles["PollRatioValue"]}>
                {currentLanguage === "en"
                  ? `${record.meetingPoll?.totalNoOfDirectorsVoted} / ${record.meetingPoll?.totalNoOfDirectors}`
                  : `${convertToArabicNumerals(
                      record.meetingPoll?.totalNoOfDirectorsVoted,
                    )} / ${convertToArabicNumerals(
                      record.meetingPoll?.totalNoOfDirectors,
                    )}`}
              </span>
            );
          }
          return null;
        },
      },

      // Action (Send Reply / View Poll)
      {
        title: "",
        dataIndex: "meetingAction",
        width: 130,
        key: "action",
        render: (text, record) => {
          const isResponseDateGone = forRecentActivity(
            `${record.responseDeadLine}000000`,
          );
          const currentDateObj = new Date();
          const isViewPollShown = getDifferentisDateisPassed(
            currentDateObj,
            isResponseDateGone,
          );

          return record.isParticipant ? (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text="Send Reply"
                  disableBtn={isViewPollShown ? true : false}
                  onClick={() =>
                    viewProposeDatePollHandler(
                      true,
                      false,
                      false,
                      record.pK_MDID,
                      record.responseDeadLine,
                    )
                  }
                />
              </div>
            </div>
          ) : record.isOrganizer ? (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <div>
                <CustomButton
                  className={styles.MoreMeetingButton}
                  text="View Poll"
                  onClick={() =>
                    viewProposeDatePollHandler(
                      false,
                      false,
                      true,
                      record.pK_MDID,
                    )
                  }
                />
              </div>
            </div>
          ) : null;
        },
      },

      // More Popover
      {
        title: "",
        dataIndex: "meetingAction",
        width: 130,
        key: "more",
        render: (text, record) => {
          let isOrganizer = record.isOrganizer;
          return (
            isOrganizer && (
              <div className="d-flex justify-content-center align-items-center gap-2">
                <div>
                  <Popover
                    content={moreButtons(record)}
                    trigger="click"
                    overlayClassName="MoreButtons_overlay"
                    showArrow={false}
                    placement="bottomRight"
                  >
                    <CustomButton
                      className={styles.MoreMeetingButton}
                      text="More"
                      icon2={<img src={ChevronDownIcon} width={10} />}
                    />
                  </Popover>
                </div>
              </div>
            )
          );
        },
      },
    ];
  }, [meetingTitleSort, meetingDateSort, isMeetingTypeFilter]);

  // ─── useEffect: Socket data ───
  useEffect(() => {
    if (allMeetingsSocketData !== null) {
      let tableRowsData = [...rows];
      var foundIndex = tableRowsData.findIndex(
        (x) => x.pK_MDID === allMeetingsSocketData.pK_MDID,
      );
      if (foundIndex !== -1) {
        const newState = tableRowsData.map((obj, index) => {
          if (foundIndex === index) return allMeetingsSocketData;
          return obj;
        });
        setRow(newState);
      } else {
        setRow([allMeetingsSocketData, ...rows]);
      }
    }
  }, [allMeetingsSocketData]);

  // ─── useEffect: searchMeetings ───
  useEffect(() => {
    try {
      if (searchMeetings !== null && searchMeetings !== undefined) {
        if (
          searchMeetings.meetings !== null &&
          searchMeetings.meetings !== undefined &&
          searchMeetings.meetings.length > 0
        ) {
          if (checkFeatureIDAvailability(12)) {
            setRow(searchMeetings.meetings);
            setDublicatedrows(searchMeetings.meetings);
          } else {
            let filterOutPropsed = searchMeetings.meetings.filter(
              (data) => data.status !== "12",
            );
            setRow(filterOutPropsed);
            setDublicatedrows(filterOutPropsed);
          }
        } else {
          setRow([]);
          setDublicatedrows([]);
        }
      } else {
        setRow([]);
        setDublicatedrows([]);
      }
    } catch (error) {}
    return () => {
      setRow([]);
      setDublicatedrows([]);
    };
  }, [searchMeetings]);

  // ─── useEffect: Publish state ───
  useEffect(() => {
    if (publishState) {
      const filteredArray = rows.filter(
        (item) => item.pK_MDID !== publishState,
      );
      setRow(filteredArray);
      setPublishState(null);
    }
  }, [publishState]);

  // ─── useEffect: Proposed MQTT ───
  useEffect(() => {
    if (
      meetingStatusProposedMqttData !== null &&
      meetingStatusProposedMqttData !== undefined
    ) {
      const updateMeetingData = async () => {
        let meetingData = meetingStatusProposedMqttData;
        const indexToUpdate = rows.findIndex(
          (obj) => obj.pK_MDID === meetingData.pK_MDID,
        );
        let getMeetingDataArray = await getAllUnpublishedMeetingData(
          [meetingData],
          1,
        );
        const getMeetingData = getMeetingDataArray[0];
        if (indexToUpdate !== -1) {
          let updatedRows = [...rows];
          updatedRows[indexToUpdate] = getMeetingData;
          setRow(updatedRows);
        } else {
          let updatedRows = [getMeetingData, ...rows];
          setRow(updatedRows);
        }
      };
      updateMeetingData();
      dispatch(meetingStatusProposedMqtt(null));
    }
  }, [meetingStatusProposedMqttData]);

  // ─── useEffect: Published MQTT (remove from proposed) ───
  useEffect(() => {
    if (
      meetingStatusPublishedMqttData !== null &&
      meetingStatusPublishedMqttData !== undefined
    ) {
      let meetingData = meetingStatusPublishedMqttData;
      try {
        const updatedRows = rows.filter(
          (obj) => obj.pK_MDID !== meetingData.pK_MDID,
        );
        setRow(updatedRows);
      } catch {}
    }
  }, [meetingStatusPublishedMqttData]);

  // ─── useEffect: Meeting Prop link ───
  useEffect(() => {
    if (MeetingProp !== null) {
      const callApi = async () => {
        try {
          let getApiResponse = await validateStringParticipantProposedApi(
            MeetingProp,
            navigate,
            t,
          )(dispatch);
          if (getApiResponse) {
            localStorage.setItem(
              "viewProposeDatePollMeetingID",
              getApiResponse.meetingID,
            );
            localStorage.removeItem("meetingprop");
            setResponseByDate(getApiResponse.deadline);
            setViewProposeDatePoll(true);
            dispatch(viewProposeDateMeetingPageFlag(true));
            dispatch(meetingDetailsGlobalFlag(false));
            dispatch(organizersGlobalFlag(false));
            dispatch(agendaContributorsGlobalFlag(false));
            dispatch(participantsGlobalFlag(false));
            dispatch(agendaGlobalFlag(false));
            dispatch(meetingMaterialGlobalFlag(false));
            dispatch(minutesGlobalFlag(false));
            dispatch(proposedMeetingDatesGlobalFlag(true));
            dispatch(actionsGlobalFlag(false));
            dispatch(pollsGlobalFlag(false));
            dispatch(attendanceGlobalFlag(false));
            dispatch(uploadGlobalFlag(false));
          }
        } catch (error) {
          console.error("Error in API call:", error);
          localStorage.removeItem("meetingprop");
        }
      };
      callApi();
    }
  }, [MeetingProp]);

  // ─── useEffect: UserMeetPropoDatPoll link ───
  useEffect(() => {
    if (UserMeetPropoDatPoll !== null) {
      try {
        const callApi1 = async () => {
          try {
            let getApiResponse =
              await validateStringUserMeetingProposedDatesPollsApi(
                UserMeetPropoDatPoll,
                navigate,
                t,
              )(dispatch);
            if (getApiResponse) {
              localStorage.setItem(
                "viewProposeDatePollMeetingID",
                getApiResponse.meetingID,
              );
              localStorage.removeItem("UserMeetPropoDatPoll");
              dispatch(showSceduleProposedMeeting(true));
              setViewProposeOrganizerPoll(false);
              dispatch(viewProposeOrganizerMeetingPageFlag(false));
              dispatch(meetingDetailsGlobalFlag(false));
              dispatch(organizersGlobalFlag(false));
              dispatch(agendaContributorsGlobalFlag(false));
              dispatch(participantsGlobalFlag(false));
              dispatch(agendaGlobalFlag(false));
              dispatch(meetingMaterialGlobalFlag(false));
              dispatch(minutesGlobalFlag(false));
              dispatch(proposedMeetingDatesGlobalFlag(false));
              dispatch(actionsGlobalFlag(false));
              dispatch(pollsGlobalFlag(false));
              dispatch(attendanceGlobalFlag(false));
              dispatch(uploadGlobalFlag(false));
            }
          } catch (error) {
            console.error("Error in API call:", error);
            localStorage.removeItem("UserMeetPropoDatPoll");
          }
        };
        callApi1();
      } catch (error) {}
    }
  }, [UserMeetPropoDatPoll]);

  return (
    <section>
      <Row>
        <Col lg={12} md={12} sm={12} className="w-100">
          <Table
            onChange={handleChangeMeetingTable}
            className="MeetingTable"
            column={columns}
            size={"small"}
            rows={proposedMeetingData}
            sticky={true}
            pagination={false}
            locale={{
              emptyText: <EmptyTableComponent />,
            }}
            scroll={{
              y: 450,
            }}
          />
        </Col>
      </Row>
      {sceduleproposedMeeting && (
        <SceduleProposedmeeting
          setDataroomMapFolderId={setDataroomMapFolderId}
          setCurrentMeetingID={setCurrentMeetingID}
          setSceduleMeeting={setSceduleMeeting}
        />
      )}
      {deleteMeetingModal && <DeleteMeetingModal />}
      {deleteMeetingConfirmationModal && <DeleteMeetingConfirmationModal />}
    </section>
  );
};

export default ProposedMeetingList;
