import React, { useState, useEffect, useRef } from "react";
import styles from "./FullScreenAgendaModal.module.css";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import { Button, Modal } from "./../../../../../../components/elements";
import {
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../../store/actions/VideoMain_actions";
import {
  FetchMeetingURLApi,
  LeaveCurrentMeeting,
} from "../../../../../../store/actions/NewMeetingActions";
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
} from "../../../../../../store/actions/VideoFeature_actions";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import emptyContributorState from "./../../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ParentAgenda from "./../ParentAgenda";
import AllFilesModal from "./../AllFilesModal/AllFilesModal";
import { onDragEnd } from "./../drageFunction";
import CollapseAgendaIcon from "./../AV-Images/Collapse-Agenda-Icon.png";
import VideocameraIcon from "./../AV-Images/Videocamera-Icon.png";
import { Tooltip } from "antd";
import MenuIcon from "./../AV-Images/Menu-Icon.png";
import PrintIcon from "./../AV-Images/Print-Icon.png";
import ExportIcon from "./../AV-Images/Export-Icon.png";
import ShareIcon from "./../AV-Images/Share-Icon.png";
import ParticipantsInfo from "./../AV-Images/Participants-Icon.png";
import ParticipantsInfoDisabled from "./../AV-Images/Participants-Icon-disabled.png";
import LeaveMeetingIcon from "./../AV-Images/Leave-Meeting.svg";
import TalkInactiveIcon from "./../AV-Images/Talk Inactive.svg";
import {
  exportAgenda,
  printAgenda,
} from "../../../../../../store/actions/MeetingAgenda_action";
import {
  GetAllUserChats,
  GetAllUsers,
  GetGroupMessages,
  activeChat,
} from "../../../../../../store/actions/Talk_action";
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
} from "../../../../../../store/actions/Talk_Feature_actions";
import { getCurrentDateTimeUTC } from "../../../../../../commen/functions/date_formater";
import MaxHostVideoCallComponent from "../../../meetingVideoCall/maxHostVideoCallComponent/MaxHostVideoCallComponent";
import NormalHostVideoCallComponent from "../../../meetingVideoCall/normalHostVideoCallComponent/NormalHostVideoCallComponent";
import ParticipantVideoCallComponent from "../../../meetingVideoCall/maxParticipantVideoCallComponent/maxParticipantVideoCallComponent";
import NormalParticipantVideoComponent from "../../../meetingVideoCall/normalParticipantVideoComponent/NormalParticipantVideoComponent";
import MaxParticipantVideoDeniedComponent from "../../../meetingVideoCall/maxParticipantVideoDeniedComponent/maxParticipantVideoDeniedComponent";
import MaxParticipantVideoRemovedComponent from "../../../meetingVideoCall/maxParticipantVideoRemovedComponent/maxParticipantVideoRemovedComponent";
import { useMeetingContext } from "../../../../../../context/MeetingContext";
import { userLogOutApiFunc } from "../../../../../../store/actions/Auth_Sign_Out";

const FullScreenAgendaModal = ({
  setFullScreenView,
  advanceMeetingModalID,
  rows,
  setRows,
  setParticipantInfoView,
  participantInfoView,
  setAgendaSelectOptionView,
  agendaSelectOptionView,
  setShareEmailView,
  shareEmailView,
  videoTalk,
  setAdvanceMeetingModalID,
  setViewAdvanceMeetingModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { talkStateData } = useSelector((state) => state);

  const leaveMeetingOnLogoutResponse = useSelector(
    (state) => state.videoFeatureReducer.leaveMeetingOnLogoutResponse
  );
  const { setEditorRole, editorRole } = useMeetingContext();
  console.log("Agenda View Full");
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [menuAgendaFull, setMenuAgendaFull] = useState(false);

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let meetingTitle = localStorage.getItem("meetingTitle");
  let currentMeetingVideoURL = localStorage.getItem("videoCallURL");

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));

  const closeMenuAgenda = useRef(null);

  // const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);

  const [showMoreFilesView, setShowMoreFilesView] = useState(false);

  const [fileDataAgenda, setFileDataAgenda] = useState([]);
  const [agendaName, setAgendaName] = useState("");
  const [agendaIndex, setAgendaIndex] = useState(-1);
  const [subAgendaIndex, setSubAgendaIndex] = useState(-1);

  useEffect(() => {
    console.log("Agenda View Full");
    if (rows.length !== 0) {
      const anyCanViewTrue = rows.some((row) => row.canView);
      setEmptyStateRows(!anyCanViewTrue);
    } else {
      setEmptyStateRows(false);
    }
  }, [rows]);

  const [initiateVideoModalOto, setInitiateVideoModalOto] = useState(false);

  const leaveCallHost = () => {
    console.log("Agenda View Full");
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
    console.log("Agenda View Full");
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

  const menuPopupAgenda = () => {
    console.log("Agenda View Full");
    setMenuAgendaFull(!menuAgendaFull);
  };

  const participantModal = () => {
    console.log("Agenda View Full");
    setParticipantInfoView(!participantInfoView);
  };

  const printModal = () => {
    console.log("Agenda View Full");
    dispatch(printAgenda(true));
    setAgendaSelectOptionView(!agendaSelectOptionView);
  };

  const exportModal = () => {
    console.log("Agenda View Full");
    dispatch(exportAgenda(true));
    setAgendaSelectOptionView(!agendaSelectOptionView);
  };

  const shareEmailModal = () => {
    console.log("Agenda View Full");
    setShareEmailView(!shareEmailView);
  };

  const groupChatInitiation = (talkGroupID) => {
    console.log("Agenda View Full");
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
        UserID: parseInt(currentUserID),
        ChannelID: currentOrganization,
        GroupID: talkGroupID,
        NumberOfMessages: 50,
        OffsetMessage: 0,
      };
      dispatch(
        GetAllUserChats(
          navigate,
          parseInt(currentUserID),
          parseInt(currentOrganization),
          t
        )
      );
      dispatch(GetGroupMessages(navigate, chatGroupData, t));
      dispatch(
        GetAllUsers(navigate, parseInt(currentUserID), currentOrganization, t)
      );

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
    setFullScreenView(false);
  };

  const leaveMeeting = async (flag) => {
    console.log("Agenda View Full");
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
    console.log("mqtt mqmqmqmqmqmq", flag);
    if (flag) {
      console.log("mqtt mqmqmqmqmqmq");
      await dispatch(leaveMeetingOnlogout(false));
      dispatch(userLogOutApiFunc(navigate, t));
    }
  };
  useEffect(() => {
    try {
      if (leaveMeetingOnLogoutResponse) {
        console.log("mqtt mqmqmqmqmqmq");
        leaveMeeting(true);
      }
    } catch {}
  }, [leaveMeetingOnLogoutResponse]);

  const handleOutsideClick = (event) => {
    console.log("Agenda View Full");
    event.preventDefault();
    if (
      closeMenuAgenda.current &&
      !closeMenuAgenda.current.contains(event.target) &&
      menuAgendaFull
    ) {
      setMenuAgendaFull(false);
    }
  };

  useEffect(() => {
    console.log("Agenda View Full");
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuAgendaFull]);

  const onClickVideoIconOpenVideo = () => {
    console.log("Agenda View Full");
    let isMeetingVideoHostCheck = JSON.parse(
      localStorage.getItem("isMeetingVideoHostCheck")
    );

    let meetingVideoData = {
      roleID:
        editorRole.role === "Participant"
          ? 2
          : isMeetingVideoHostCheck
          ? 10
          : 2,
    };
    console.log(meetingVideoData, "meetingVideoData");

    if (meetingVideoData.roleID === 2) {
      dispatch(maxParticipantVideoCallPanel(true));
    } else {
      let data = {
        MeetingId: Number(currentMeeting),
        VideoCallURL: String(currentMeetingVideoURL),
        IsMuted: false,
        HideVideo: false,
      };
      dispatch(getParticipantMeetingJoinMainApi(navigate, t, data));
    }
  };

  return (
    <Modal
      show={true}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-block"}
      onHide={() => setFullScreenView(false)}
      fullscreen={true}
      className={
        showMoreFilesView ? "FullScreenModal blurEffect" : "FullScreenModal"
      }
      ModalTitle={
        <>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              className={styles["agendaViewerHeader"]}
            >
              <p className={styles["FileModalTitle"]}>{t("Agenda-viewer")}</p>
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

                {editorRole.status === "10" || editorRole.status === 10 ? (
                  <Tooltip placement="topRight" title={t("Leave-meeting")}>
                    <div
                      className={styles["box-agendas-leave"]}
                      onClick={() => leaveMeeting(false)}
                    >
                      <img src={LeaveMeetingIcon} alt="" />
                    </div>
                  </Tooltip>
                ) : null}

                {(editorRole.status === "10" || editorRole.status === 10) &&
                videoTalk?.isVideoCall ? (
                  <Tooltip placement="topRight" title={t("Enable-video-call")}>
                    <div
                      className={styles["box-agendas-camera"]}
                      // onClick={joinMeetingCall}
                    >
                      <img
                        src={VideocameraIcon}
                        alt=""
                        onClick={onClickVideoIconOpenVideo}
                      />
                    </div>
                  </Tooltip>
                ) : null}

                <Tooltip placement="topRight" title={t("Collapse")}>
                  <div
                    className={styles["box-agendas"]}
                    onClick={() => setFullScreenView(false)}
                  >
                    <img src={CollapseAgendaIcon} alt="" />
                  </div>
                </Tooltip>

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
                      menuAgendaFull
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
                        editorRole.status === 9 || editorRole.status === "9"
                          ? null
                          : styles["disabledEntity"]
                      }
                      onClick={
                        editorRole.status === 9 || editorRole.status === "9"
                          ? participantModal
                          : null
                      }
                    >
                      <img
                        width={20}
                        src={
                          editorRole.status === 9 || editorRole.status === "9"
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
        </>
      }
      ModalBody={
        <section>
          {emptyStateRows === true &&
          (editorRole.role === "Agenda Contributor" ||
            editorRole.role === "Participant") ? (
            <section>
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
            </section>
          ) : null}
          <section>
            {emptyStateRows === true &&
            (editorRole.role === "Agenda Contributor" ||
              editorRole.role === "Participant") ? null : (
              <>
                <DragDropContext
                  onDragEnd={(result) => onDragEnd(result, rows, setRows)}
                >
                  <Row className={styles["horizontalSpacing"]}>
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
                                      setShowMoreFilesView={
                                        setShowMoreFilesView
                                      }
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
                                      className={
                                        styles["Empty_state_Subheading"]
                                      }
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
          </section>
        </section>
      }
    />
  );
};

export default FullScreenAgendaModal;
