import React, { useState, useEffect, useRef } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row, Container } from "react-bootstrap";
import {
  Button,
  Notification,
  Modal,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import CancelMeetingMaterial from "./CancelMeetingMaterial/CancelMeetingMaterial";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "antd";
import {
  FetchMeetingURLApi,
  LeaveCurrentMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import {
  GetAdvanceMeetingAgendabyMeetingIDForView,
  clearAgendaReducerState,
  printAgenda,
  exportAgenda,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";
import {
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../store/actions/VideoMain_actions";
import PresenterView from "../../../../../assets/images/Recent Activity Icons/Video/PresenterView.png";
import StopImage from "../../../../../assets/images/Recent Activity Icons/Video/StopImage.png";

import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
  maxHostVideoCallPanel,
  maxParticipantVideoCallPanel,
  getParticipantMeetingJoinMainApi,
  leaveMeetingOnlogout,
  nonMeetingVideoGlobalModal,
  videoIconOrButtonState,
  participantVideoButtonState,
  clearMessegesVideoFeature,
  startOrStopPresenterGlobal,
  presenterViewGlobalState,
  openPresenterViewMainApi,
  stopPresenterViewMainApi,
  joinPresenterViewMainApi,
  leavePresenterViewMainApi,
} from "../../../../../store/actions/VideoFeature_actions";
import emptyContributorState from "../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ParentAgenda from "./ParentAgenda";
import AllFilesModal from "./AllFilesModal/AllFilesModal";
// import ExportAgendaModal from "./ExportAgendaModal/ExportAgendaModal";
import FullScreenAgendaModal from "./FullScreenAgendaModal/FullScreenAgendaModal";
import ParticipantInfoModal from "./ParticipantInfoModal/ParticipantInfoModal";
import PrintExportAgendaModal from "./PrintExportAgendaModal/PrintExportAgendaModal";
import SelectAgendaModal from "./SelectAgendaModal/SelectAgendaModal";
import ShareEmailModal from "./ShareEmailModal/ShareEmailModal";
import { onDragEnd } from "./drageFunction";
import ExpandAgendaIcon from "./AV-Images/Expand-Agenda-Icon.png";
import MenuIcon from "./AV-Images/Menu-Icon.png";
import ParticipantsInfo from "./AV-Images/Participants-Icon.png";
import ParticipantsInfoDisabled from "./AV-Images/Participants-Icon-disabled.png";
import PrintIcon from "./AV-Images/Print-Icon.png";
import ExportIcon from "./AV-Images/Export-Icon.png";
import VideocameraIcon from "./AV-Images/Videocamera-Icon.png";
import ShareIcon from "./AV-Images/Share-Icon.png";
import LeaveMeetingIcon from "./AV-Images/Leave-Meeting.svg";
import TalkInactiveIcon from "./AV-Images/Talk Inactive.svg";
import { getCurrentDateTimeUTC } from "../../../../../commen/functions/date_formater";
import {
  GetAllUserChats,
  GetAllUsers,
  GetGroupMessages,
  activeChat,
} from "../../../../../store/actions/Talk_action";
import {
  activeChatBoxGS,
  addNewChatScreen,
  chatBoxActiveFlag,
  createGroupScreen,
  createShoutAllScreen,
  footerActionStatus,
  footerShowHideStatus,
  headerShowHideStatus,
  recentChatFlag,
} from "../../../../../store/actions/Talk_Feature_actions";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";
import MaxHostVideoCallComponent from "../../meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import NormalHostVideoCallComponent from "../../meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import ParticipantVideoCallComponent from "../../meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import NormalParticipantVideoComponent from "../../meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import MaxParticipantVideoDeniedComponent from "../../meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../../meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";
import { useMeetingContext } from "../../../../../context/MeetingContext";
import { userLogOutApiFunc } from "../../../../../store/actions/Auth_Sign_Out";
import NonMeetingVideoModal from "../nonMeetingVideoModal/NonMeetingVideoModal";

const AgendaViewer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { MeetingAgendaReducer, talkStateData } = useSelector((state) => state);
  const {
    editorRole,
    setEditorRole,
    setViewAdvanceMeetingModal,
    advanceMeetingModalID,
    setAdvanceMeetingModalID,
    setMeetingMaterial,
    setMinutes,
    videoTalk,
  } = useMeetingContext();

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));
  let currentMeetingVideoURL = localStorage.getItem("videoCallURL");

  let currentMeeting = localStorage.getItem("currentMeetingID");
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let meetingTitle = localStorage.getItem("meetingTitle");

  const GetAdvanceMeetingAgendabyMeetingIDForViewData = useSelector(
    (state) =>
      state.MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDForViewData
  );

  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );

  const agendaResponseMessage = useSelector(
    (state) => state.MeetingAgendaReducer.ResponseMessage
  );

  const AgendaVideoResponseMessage = useSelector(
    (state) => state.videoFeatureReducer.ResponseMessage
  );
  console.log(AgendaVideoResponseMessage, "ResponseMessageResponseMessage");

  const MaximizeHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.MaximizeHostVideoFlag
  );

  const NormalHostVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.NormalHostVideoFlag
  );

  const maximizeParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.maximizeParticipantVideoFlag
  );

  const normalParticipantVideoFlag = useSelector(
    (state) => state.videoFeatureReducer.normalParticipantVideoFlag
  );

  const maxParticipantVideoDeniedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoDeniedFlag
  );

  const maxParticipantVideoRemovedFlag = useSelector(
    (state) => state.videoFeatureReducer.maxParticipantVideoRemovedFlag
  );

  //For Non Video MEeting Modal
  const nonMeetingVideo = useSelector(
    (state) => state.videoFeatureReducer.nonMeetingVideo
  );

  const enableDisableVideoState = useSelector(
    (state) => state.videoFeatureReducer.enableDisableVideoState
  );

  console.log(enableDisableVideoState, "enableDisableVideoState");

  // FOr Participant Enable and Disable check Video Icon
  const participantEnableVideoState = useSelector(
    (state) => state.videoFeatureReducer.participantEnableVideoState
  );

  const presenterViewFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewFlag
  );

  const presenterViewHostFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewHostFlag
  );

  const presenterViewJoinFlag = useSelector(
    (state) => state.videoFeatureReducer.presenterViewJoinFlag
  );

  const presenterMeetingId = useSelector(
    (state) => state.videoFeatureReducer.presenterMeetingId
  );
  console.log(presenterViewFlag, "presenterViewFlagpresenterViewFlag");
  // start and stop Presenter View
  // const startOrStopPresenter = useSelector(
  //   (state) => state.videoFeatureReducer.startOrStopPresenter
  // );

  const leaveMeetingOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnLogoutResponse
  );
  const [menuAgenda, setMenuAgenda] = useState(false);

  const closeMenuAgenda = useRef(null);

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);
  const [fullScreenView, setFullScreenView] = useState(false);
  const [agendaSelectOptionView, setAgendaSelectOptionView] = useState(false);
  // const [exportAgendaView, setExportAgendaView] = useState(false);
  const [printAgendaView, setPrintAgendaView] = useState(false);
  const [shareEmailView, setShareEmailView] = useState(false);
  const [showMoreFilesView, setShowMoreFilesView] = useState(false);
  const [participantInfoView, setParticipantInfoView] = useState(false);

  const [fileDataAgenda, setFileDataAgenda] = useState([]);
  const [agendaName, setAgendaName] = useState("");
  const [agendaIndex, setAgendaIndex] = useState(-1);
  const [subAgendaIndex, setSubAgendaIndex] = useState(-1);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("AdvanceMeetingOperations")) === true) {
      let NotificationClickMeetingID = localStorage.getItem(
        "NotificationAdvanceMeetingID"
      );
      let Data = {
        MeetingID:
          advanceMeetingModalID === "0" ||
          advanceMeetingModalID === 0 ||
          advanceMeetingModalID === null ||
          advanceMeetingModalID === undefined
            ? Number(NotificationClickMeetingID)
            : Number(advanceMeetingModalID),
      };
      dispatch(GetAdvanceMeetingAgendabyMeetingIDForView(Data, navigate, t));
    } else {
      let Data = {
        MeetingID:
          advanceMeetingModalID === "0" ||
          advanceMeetingModalID === 0 ||
          advanceMeetingModalID === null ||
          advanceMeetingModalID === undefined
            ? Number(currentMeeting)
            : Number(advanceMeetingModalID),
      };
      dispatch(GetAdvanceMeetingAgendabyMeetingIDForView(Data, navigate, t));
    }

    return () => {
      dispatch(clearAgendaReducerState());
      setRows([]);
    };
  }, []);

  useEffect(() => {
    if (
      GetAdvanceMeetingAgendabyMeetingIDForViewData !== null &&
      GetAdvanceMeetingAgendabyMeetingIDForViewData !== undefined &&
      GetAdvanceMeetingAgendabyMeetingIDForViewData.length !== 0
    ) {
      setRows(GetAdvanceMeetingAgendabyMeetingIDForViewData.agendaList);
    }
  }, [GetAdvanceMeetingAgendabyMeetingIDForViewData]);

  useEffect(() => {
    if (rows.length !== 0) {
      // Check if any of the canView values is true
      const anyCanViewTrue = rows.some((row) => row.canView);

      // Update the emptyStateRows state based on the condition
      setEmptyStateRows(!anyCanViewTrue);
    } else {
      setEmptyStateRows(false);
    }
  }, [rows]);

  const menuPopupAgenda = () => {
    setMenuAgenda(!menuAgenda);
  };

  const handleOutsideClick = (event) => {
    if (
      closeMenuAgenda.current &&
      !closeMenuAgenda.current.contains(event.target) &&
      menuAgenda
    ) {
      setMenuAgenda(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuAgenda]);

  const fullScreenModal = () => {
    setFullScreenView(!fullScreenView);
  };

  const participantModal = () => {
    setParticipantInfoView(!participantInfoView);
  };

  const printModal = () => {
    dispatch(printAgenda(true));
    setAgendaSelectOptionView(!agendaSelectOptionView);
  };

  const exportModal = () => {
    dispatch(exportAgenda(true));
    setAgendaSelectOptionView(!agendaSelectOptionView);
  };

  const shareEmailModal = () => {
    setShareEmailView(!shareEmailView);
  };

  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);

  const leaveCallHost = () => {
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: initiateRoomID,
      IsCaller: true,
      CallTypeID: currentCallType,
    };
    dispatch(LeaveCall(Data, navigate, t));
    let Data2 = {
      VideoCallURL: currentMeetingVideoURL,
    };
    dispatch(
      FetchMeetingURLApi(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization,
        1,
        meetingTitle,
        advanceMeetingModalID
      )
    );
    localStorage.setItem("meetingTitle", meetingTitle);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("activeCall", true);
    localStorage.setItem("callerID", 0);
    localStorage.setItem("recipentCalledID", 0);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", true);
  };

  const leaveCallParticipant = () => {
    let roomID = localStorage.getItem("acceptedRoomID");
    let Data = {
      OrganizationID: currentOrganization,
      RoomID: roomID,
      IsCaller: false,
      CallTypeID: callTypeID,
    };
    dispatch(LeaveCall(Data, navigate, t));
    let Data2 = {
      VideoCallURL: currentMeetingVideoURL,
    };
    dispatch(
      FetchMeetingURLApi(
        Data2,
        navigate,
        t,
        currentUserID,
        currentOrganization,
        1,
        meetingTitle,
        advanceMeetingModalID
      )
    );
    localStorage.setItem("meetingTitle", meetingTitle);
    const emptyArray = [];
    localStorage.setItem("callerStatusObject", JSON.stringify(emptyArray));
    dispatch(normalizeVideoPanelFlag(true));
    dispatch(maximizeVideoPanelFlag(false));
    dispatch(minimizeVideoPanelFlag(false));
    dispatch(leaveCallModal(false));
    setInitiateVideoModalOto(false);
    dispatch(participantPopup(false));
    localStorage.setItem("CallType", 0);
    localStorage.setItem("activeCall", true);
    dispatch(callRequestReceivedMQTT({}, ""));
    dispatch(videoChatPanel(false));
    localStorage.setItem("isMeetingVideo", true);
  };

  const joinMeetingCall = () => {
    if (activeCall === false && isMeeting === false) {
      let Data = {
        VideoCallURL: currentMeetingVideoURL,
      };
      dispatch(
        FetchMeetingURLApi(
          Data,
          navigate,
          t,
          currentUserID,
          currentOrganization,
          1,
          meetingTitle,
          advanceMeetingModalID
        )
      );
      localStorage.setItem("meetingTitle", meetingTitle);
    } else if (activeCall === true && isMeeting === false) {
      setInitiateVideoModalOto(true);
      dispatch(callRequestReceivedMQTT({}, ""));
    }
  };

  const leaveMeeting = async (flag) => {
    let leaveMeetingData = {
      FK_MDID: Number(currentMeeting),
      DateTime: getCurrentDateTimeUTC(),
    };
    await dispatch(
      LeaveCurrentMeeting(
        navigate,
        t,
        leaveMeetingData,
        false,
        false,
        setEditorRole,
        setAdvanceMeetingModalID,
        setViewAdvanceMeetingModal
      )
    );
    // if (flag) {
    //   console.log("mqtt mqmqmqmqmqmq");
    //   await dispatch(leaveMeetingOnlogout(false));
    //   dispatch(userLogOutApiFunc(navigate, t));
    // }
  };

  // useEffect(() => {
  //   try {
  //     if (leaveMeetingOnLogoutResponse) {
  //       if (fullScreenView === false) {
  //         console.log("mqtt mqmqmqmqmqmq");
  //         leaveMeeting(true);
  //       }
  //     }
  //   } catch {}
  // }, [leaveMeetingOnLogoutResponse]);

  const groupChatInitiation = (talkGroupID) => {
    if (
      talkGroupID !== 0 &&
      talkStateData.AllUserChats.AllUserChatsData !== undefined &&
      talkStateData.AllUserChats.AllUserChatsData !== null &&
      talkStateData.AllUserChats.AllUserChatsData.length !== 0
    ) {
      dispatch(createShoutAllScreen(false));
      dispatch(addNewChatScreen(false));
      dispatch(footerActionStatus(false));
      dispatch(createGroupScreen(false));
      dispatch(chatBoxActiveFlag(false));
      dispatch(recentChatFlag(true));
      dispatch(activeChatBoxGS(true));
      dispatch(chatBoxActiveFlag(true));
      dispatch(headerShowHideStatus(true));
      dispatch(footerShowHideStatus(true));
      let chatGroupData = {
        UserID: parseInt(userID),
        ChannelID: currentOrganization,
        GroupID: talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(userID),
          parseInt(currentOrganization),
          t
        )
      );
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(GetAllUsers(navigate, parseInt(userID), currentOrganization, t));

      let allChatMessages =
        talkStateData.AllUserChats.AllUserChatsData.allMessages;
      const foundRecord = allChatMessages.find(
        (item) => item.id === talkGroupID
      );
      if (foundRecord) {
        dispatch(activeChat(foundRecord));
      }
      localStorage.setItem("activeOtoChatID", talkGroupID);
    }
  };

  useEffect(() => {
    if (agendaResponseMessage === t("Success")) {
      showMessage(t("Email-sent-successfully"), "error", setOpen);
      dispatch(clearResponseMessage(""));
    }
    if (agendaResponseMessage === t("Invalid-data")) {
      showMessage(t("Invalid-data"), "error", setOpen);
      dispatch(clearResponseMessage(""));
    }
  }, [agendaResponseMessage]);

  useEffect(() => {
    if (AgendaVideoResponseMessage === t("Could-not-join-call")) {
      showMessage(t("Could-not-join-call"), "Success", setOpen);
      dispatch(clearMessegesVideoFeature(""));
    }
  }, [AgendaVideoResponseMessage]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.MeetingAgendaStartedData !== undefined &&
      MeetingAgendaReducer.MeetingAgendaStartedData !== null
    ) {
      setRows((prevState) => {
        const updatedState = prevState.map((item) => {
          if (
            item.id === MeetingAgendaReducer.MeetingAgendaStartedData.agendaID
          ) {
            console.log("Updating main item:", item);
            return {
              ...item,
              voteOwner: {
                ...item.voteOwner,
                currentVotingClosed: true,
              },
            };
          } else if (
            item.subAgenda.some(
              (subItem) =>
                subItem.subAgendaID ===
                MeetingAgendaReducer.MeetingAgendaStartedData.agendaID
            )
          ) {
            return {
              ...item,
              subAgenda: item.subAgenda.map((subItem) => {
                if (
                  subItem.subAgendaID ===
                  MeetingAgendaReducer.MeetingAgendaStartedData.agendaID
                ) {
                  return {
                    ...subItem,
                    voteOwner: {
                      ...subItem.voteOwner,
                      currentVotingClosed: true,
                    },
                  };
                }
                return subItem;
              }),
            };
          }
          return item;
        });

        return updatedState;
      });
    }
  }, [MeetingAgendaReducer.MeetingAgendaStartedData]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.MeetingAgendaEndedData !== undefined &&
      MeetingAgendaReducer.MeetingAgendaEndedData !== null
    ) {
      setRows((prevState) => {
        const updatedState = prevState.map((item) => {
          if (
            item.id === MeetingAgendaReducer.MeetingAgendaEndedData.agendaID
          ) {
            return {
              ...item,
              voteOwner: {
                ...item.voteOwner,
                currentVotingClosed: false,
              },
            };
          } else if (
            item.subAgenda.some(
              (subItem) =>
                subItem.subAgendaID ===
                MeetingAgendaReducer.MeetingAgendaEndedData.agendaID
            )
          ) {
            return {
              ...item,
              subAgenda: item.subAgenda.map((subItem) => {
                if (
                  subItem.subAgendaID ===
                  MeetingAgendaReducer.MeetingAgendaEndedData.agendaID
                ) {
                  return {
                    ...subItem,
                    voteOwner: {
                      ...subItem.voteOwner,
                      currentVotingClosed: false,
                    },
                  };
                }
                return subItem;
              }),
            };
          }
          return item;
        });

        return updatedState;
      });
    }
  }, [MeetingAgendaReducer.MeetingAgendaEndedData]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.MeetingAgendaUpdatedMqtt !== undefined &&
      MeetingAgendaReducer.MeetingAgendaUpdatedMqtt !== null
    ) {
      if (
        Number(advanceMeetingModalID) ===
        MeetingAgendaReducer.MeetingAgendaUpdatedMqtt.meetingID
      ) {
        let Data = {
          MeetingID:
            advanceMeetingModalID === "0" || advanceMeetingModalID === 0
              ? Number(currentMeeting)
              : Number(advanceMeetingModalID),
        };
        dispatch(GetAdvanceMeetingAgendabyMeetingIDForView(Data, navigate, t));
      }
    }
  }, [MeetingAgendaReducer.MeetingAgendaUpdatedMqtt]);

  const onClickVideoIconOpenVideo = () => {
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );

    let nonMeetingCheck = JSON.parse(
      sessionStorage.getItem("NonMeetingVideoCall")
    );

    if (nonMeetingCheck) {
      dispatch(nonMeetingVideoGlobalModal(true));
    } else {
      if (!isMeetingVideoHostCheck) {
        dispatch(participantVideoButtonState(true));
        // Jab ParticipantEnableVideoState False hoga tab maxParticipantVideoPanel open hoga
        if (!participantEnableVideoState) {
          dispatch(maxParticipantVideoCallPanel(true));
        }
      } else {
        localStorage.setItem("isMeetingVideoHostCheck", true);
        dispatch(videoIconOrButtonState(true));
        if (!enableDisableVideoState) {
          let data = {
            MeetingId: Number(currentMeeting),
            VideoCallURL: String(currentMeetingVideoURL),
            IsMuted: false,
            HideVideo: false,
          };
          dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
        } else {
          console.log("No Need To Hit");
        }
      }
    }
  };

  const onClickStartPresenter = () => {
    let isMeetingVideo = JSON.parse(localStorage.getItem("isMeetingVideo"));
    let data = {
      VideoCallURL: String(currentMeetingVideoURL || ""),
      Guid: "",
      WasInVideo: Boolean(isMeetingVideo),
    };
    dispatch(openPresenterViewMainApi(t, navigate, data, currentMeeting, 4));
  };

  const onClickStopPresenter = (value) => {
    console.log("onClickStopPresenter", value);
    // presenterViewHostFlag
    // ? t("Stop-presenting")
    // : presenterViewJoinFlag
    // ? t("Leave-presenting")
    // : t("Join-presenting")}
    try {
      let currentMeetingID = Number(localStorage.getItem("currentMeetingID"));
      let callAcceptedRoomID = localStorage.getItem("acceptedRoomID");

      // if (presenterMeetingId === currentMeeting) {
      console.log("Check Stop");
      if (value === 1) {
        let data = {
          MeetingID: currentMeetingID,
          RoomID: callAcceptedRoomID,
        };
        sessionStorage.setItem("StopPresenterViewAwait", true);
        dispatch(stopPresenterViewMainApi(navigate, t, data));
      } else if (value === 2) {
        console.log("onClickStopPresenter", value);
        let currentMeetingVideoURL = localStorage.getItem("videoCallURL");
        let data = { VideoCallURL: String(currentMeetingVideoURL) };
        console.log("onClickStopPresenter", data);
        dispatch(joinPresenterViewMainApi(navigate, t, data));
      } else if (value === 3) {
        let presenterGuid = localStorage.getItem("PresenterGuid");
        let data = {
          RoomID: String(callAcceptedRoomID),
          UserGUID: String(presenterGuid),
          Name: String(meetingTitle),
        };
        dispatch(leavePresenterViewMainApi(navigate, t, data, 1));
      }
      // }
    } catch (error) {}
  };

  return (
    <>
      {emptyStateRows === true &&
      (editorRole.role === "Agenda Contributor" ||
        editorRole.role === "Participant") ? (
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center mt-3"
            >
              <img
                draggable={false}
                src={emptyContributorState}
                width="274.05px"
                alt=""
                height="230.96px"
                className={styles["Image-Add-Agenda"]}
              />
            </Col>
          </Row>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className="d-flex justify-content-center mt-3"
            >
              <span className={styles["Empty_state_heading"]}>
                {t("No-agenda-availabe-to-discuss").toUpperCase()}
              </span>
            </Col>
          </Row>
        </>
      ) : null}
      <>
        <section>
          {emptyStateRows === true &&
          (editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant") ? null : (
            <>
              {rows.length > 0 ? (
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className="d-flex justify-content-end align-items-center text-end gap-2 mt-3"
                  >
                    <div className={styles["icons-block"]}>
                      {videoTalk?.isChat ? (
                        <Tooltip placement="topRight" title={t("Start-chat")}>
                          <div
                            className={styles["box-agendas-leave"]}
                            onClick={() =>
                              groupChatInitiation(videoTalk?.talkGroupID)
                            }
                          >
                            <img src={TalkInactiveIcon} alt="" />
                          </div>
                        </Tooltip>
                      ) : null}

                      {/* {editorRole.status === "10" ||
                      editorRole.status === 10 ? (
                        <Tooltip
                          placement="topRight"
                          title={t("Leave-meeting")}
                        >
                          <div
                            className={styles["box-agendas-leave"]}
                            onClick={() => leaveMeeting(false)}
                          >
                            <img src={LeaveMeetingIcon} alt="" />
                          </div>
                        </Tooltip>
                      ) : null} */}

                      {editorRole.status === 10 ||
                      editorRole.status === "10" ? (
                        <>
                          {presenterViewFlag ? (
                            <Tooltip>
                              <div
                                className={styles["Stop-presenter-view-class"]}
                                onClick={() =>
                                  onClickStopPresenter(
                                    presenterViewHostFlag
                                      ? 1
                                      : presenterViewJoinFlag
                                      ? 3
                                      : 2
                                  )
                                }
                              >
                                <img src={StopImage} />
                                <p>
                                  {presenterViewHostFlag
                                    ? t("Stop-presenting")
                                    : presenterViewJoinFlag
                                    ? t("Leave-presenting")
                                    : t("Join-presenting")}
                                </p>
                              </div>
                            </Tooltip>
                          ) : (
                            <Tooltip>
                              <div
                                className={styles["Start-presenter-view-class"]}
                                onClick={onClickStartPresenter}
                              >
                                <img src={PresenterView} />
                                <p>{t("Start-presenting")}</p>
                              </div>
                            </Tooltip>
                          )}
                        </>
                      ) : null}

                      {(editorRole.status === "10" ||
                        editorRole.status === 10) &&
                      videoTalk?.isVideoCall ? (
                        <Tooltip
                          placement="topRight"
                          title={t("Enable-video-call")}
                        >
                          <div
                            className={
                              enableDisableVideoState ||
                              participantEnableVideoState ||
                              presenterViewFlag
                                ? styles["disabled-box-agenda-camera"]
                                : styles["box-agendas-camera"]
                            }
                            // onClick={joinMeetingCall}
                          >
                            <img
                              src={VideocameraIcon}
                              alt=""
                              onClick={
                                presenterViewFlag === false
                                  ? onClickVideoIconOpenVideo
                                  : undefined
                              }
                            />
                          </div>
                        </Tooltip>
                      ) : null}

                      {/* 
                      <Tooltip placement="topRight" title={t("Expand")}>
                        <div
                          className={styles["box-agendas"]}
                          onClick={fullScreenModal}
                        >
                          <img src={ExpandAgendaIcon} alt="" />
                        </div>
                      </Tooltip> */}

                      <div
                        onClick={menuPopupAgenda}
                        className={styles["box-agendas"]}
                        ref={closeMenuAgenda}
                      >
                        <Tooltip placement="topRight" title={t("More")}>
                          <img src={MenuIcon} alt="" />
                        </Tooltip>
                        <div
                          className={
                            menuAgenda
                              ? `${
                                  styles["popup-agenda-menu"]
                                } ${"opacity-1 pe-auto"}`
                              : `${
                                  styles["popup-agenda-menu"]
                                } ${"opacity-0 pe-none"}`
                          }
                        >
                          <span
                            className={
                              editorRole.status === 9 ||
                              editorRole.status === "9"
                                ? null
                                : styles["disabledEntity"]
                            }
                            onClick={
                              editorRole.status === 9 ||
                              editorRole.status === "9"
                                ? participantModal
                                : null
                            }
                          >
                            <img
                              width={20}
                              src={
                                editorRole.status === 9 ||
                                editorRole.status === "9"
                                  ? ParticipantsInfo
                                  : ParticipantsInfoDisabled
                              }
                              alt=""
                            />
                            {t("Participants-info")}
                          </span>
                          <span onClick={printModal}>
                            <img width={20} src={PrintIcon} alt="" />
                            {t("Print")}
                          </span>
                          <span onClick={exportModal}>
                            <img width={20} src={ExportIcon} alt="" />

                            {t("Export-pdf")}
                          </span>
                          <span onClick={shareEmailModal} className="border-0">
                            <img width={20} src={ShareIcon} alt="" />
                            {t("Share-email")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              ) : null}
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, rows, setRows)}
              >
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className={styles["Scroller_Agenda"]}
                  >
                    <Droppable droppableId="board" type="PARENT">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {rows.length > 0 ? (
                            rows.map((data, index) => {
                              return (
                                <>
                                  <ParentAgenda
                                    data={data}
                                    index={index}
                                    rows={rows}
                                    setRows={setRows}
                                    setFileDataAgenda={setFileDataAgenda}
                                    fileDataAgenda={fileDataAgenda}
                                    setAgendaName={setAgendaName}
                                    agendaName={agendaName}
                                    setAgendaIndex={setAgendaIndex}
                                    agendaIndex={agendaIndex}
                                    setSubAgendaIndex={setSubAgendaIndex}
                                    subAgendaIndex={subAgendaIndex}
                                    setMainAgendaRemovalIndex={
                                      setMainAgendaRemovalIndex
                                    }
                                    agendaItemRemovedIndex={
                                      agendaItemRemovedIndex
                                    }
                                    setAgendaItemRemovedIndex={
                                      setAgendaItemRemovedIndex
                                    }
                                    setSubajendaRemoval={setSubajendaRemoval}
                                    editorRole={editorRole}
                                    advanceMeetingModalID={
                                      advanceMeetingModalID
                                    }
                                    setShowMoreFilesView={setShowMoreFilesView}
                                  />
                                </>
                              );
                            })
                          ) : (
                            <>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center mt-3"
                                >
                                  <img
                                    draggable={false}
                                    src={emptyContributorState}
                                    width="274.05px"
                                    alt=""
                                    height="230.96px"
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center mt-3"
                                >
                                  <span
                                    className={styles["Empty_state_heading"]}
                                  >
                                    {t("Add-agenda").toUpperCase()}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-center"
                                >
                                  <span
                                    className={styles["Empty_state_Subheading"]}
                                  >
                                    {t(
                                      "Add-some-purpose-start-by-creating-your-agenda"
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </>
                          )}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                </Row>
              </DragDropContext>
            </>
          )}
        </section>
      </>
      {cancelMeetingMaterial && (
        <CancelMeetingMaterial
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
        />
      )}
      <Notification open={open} setOpen={setOpen} />

      {/* {fullScreenView ? (
        <FullScreenAgendaModal
          setFullScreenView={setFullScreenView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          advanceMeetingModalID={advanceMeetingModalID}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          setMeetingMaterial={setMeetingMaterial}
          setMinutes={setMinutes}
          rows={rows}
          setRows={setRows}
          setMenuAgenda={setMenuAgenda}
          menuAgenda={menuAgenda}
          setParticipantInfoView={setParticipantInfoView}
          participantInfoView={participantInfoView}
          setAgendaSelectOptionView={setAgendaSelectOptionView}
          agendaSelectOptionView={agendaSelectOptionView}
          setShareEmailView={setShareEmailView}
          shareEmailView={shareEmailView}
          videoTalk={videoTalk}
        />
      ) : null} */}
      {agendaSelectOptionView ? (
        <SelectAgendaModal
          setAgendaSelectOptionView={setAgendaSelectOptionView}
          setPrintAgendaView={setPrintAgendaView}
        />
      ) : null}
      {/* {exportAgendaView ? (
        <ExportAgendaModal setExportAgendaView={setExportAgendaView} />
      ) : null} */}
      {printAgendaView ? (
        <PrintExportAgendaModal
          setPrintAgendaView={setPrintAgendaView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          advanceMeetingModalID={advanceMeetingModalID}
          setAdvanceMeetingModalID={setAdvanceMeetingModalID}
          setMeetingMaterial={setMeetingMaterial}
          setMinutes={setMinutes}
          rows={rows}
          setRows={setRows}
        />
      ) : null}
      {shareEmailView ? (
        <ShareEmailModal setShareEmailView={setShareEmailView} />
      ) : null}
      {showMoreFilesView ? (
        <AllFilesModal
          agendaName={agendaName}
          fileDataAgenda={fileDataAgenda}
          setShowMoreFilesView={setShowMoreFilesView}
          agendaIndex={agendaIndex}
          subAgendaIndex={subAgendaIndex}
          setFileDataAgenda={setFileDataAgenda}
          setAgendaName={setAgendaName}
          setAgendaIndex={setAgendaIndex}
          setSubAgendaIndex={setSubAgendaIndex}
        />
      ) : null}
      {participantInfoView ? (
        <ParticipantInfoModal
          advanceMeetingModalID={advanceMeetingModalID}
          setParticipantInfoView={setParticipantInfoView}
        />
      ) : null}
      <Modal
        show={initiateVideoModalOto}
        onHide={() => {
          setInitiateVideoModalOto(false);
        }}
        setShow={setInitiateVideoModalOto}
        modalFooterClassName="d-none"
        centered
        size={"sm"}
        className="callCheckModal"
        ModalBody={
          <>
            <Container>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <p> {t("Disconnect-current-call")} </p>
                </Col>
              </Row>
              <Row className="mt-3 mb-4">
                <Col
                  lg={12}
                  sm={12}
                  md={12}
                  className="d-flex justify-content-center gap-2"
                >
                  <Button
                    text={
                      callerID === currentUserID || callerID === 0
                        ? t("End Host")
                        : callerID !== currentUserID
                        ? t("End Participant")
                        : null
                    }
                    className="leave-meeting-options__btn leave-meeting-red-button"
                    onClick={
                      callerID === currentUserID || callerID === 0
                        ? leaveCallHost
                        : callerID !== currentUserID
                        ? leaveCallParticipant
                        : null
                    }
                  />

                  <Button
                    text={t("Cancel")}
                    className="leave-meeting-options__btn leave-meeting-gray-button"
                    onClick={() => setInitiateVideoModalOto(false)}
                  />
                </Col>
              </Row>
            </Container>
          </>
        }
      />

      {MaximizeHostVideoFlag && <MaxHostVideoCallComponent />}
      {NormalHostVideoFlag && <NormalHostVideoCallComponent />}
      {maximizeParticipantVideoFlag && <ParticipantVideoCallComponent />}
      {normalParticipantVideoFlag && <NormalParticipantVideoComponent />}
      {maxParticipantVideoDeniedFlag && <MaxParticipantVideoDeniedComponent />}
      {maxParticipantVideoRemovedFlag && (
        <MaxParticipantVideoRemovedComponent />
      )}
      {nonMeetingVideo && <NonMeetingVideoModal />}
    </>
  );
};

export default AgendaViewer;
