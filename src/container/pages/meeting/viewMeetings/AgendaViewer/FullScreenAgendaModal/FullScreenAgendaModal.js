import React, { useState, useEffect, useRef } from "react";
import styles from "./FullScreenAgendaModal.module.css";
import { useNavigate } from "react-router-dom";
import { Container, Col, Row } from "react-bootstrap";
import {
  Button,
  Notification,
  Modal,
} from "./../../../../../../components/elements";
import {
  callRequestReceivedMQTT,
  LeaveCall,
} from "../../../../../../store/actions/VideoMain_actions";
import { FetchMeetingURLApi } from "../../../../../../store/actions/NewMeetingActions";
import {
  normalizeVideoPanelFlag,
  videoChatPanel,
  maximizeVideoPanelFlag,
  minimizeVideoPanelFlag,
  leaveCallModal,
  participantPopup,
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

const FullScreenAgendaModal = ({
  setFullScreenView,
  setViewAdvanceMeetingModal,
  advanceMeetingModalID,
  setAdvanceMeetingModalID,
  setMeetingMaterial,
  setMinutes,
  editorRole,
  setEdiorRole,
  setactionsPage,
  rows,
  setRows,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const GetAdvanceMeetingAgendabyMeetingIDData = useSelector(
    (state) => state.MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData
  );

  const cancelMeetingMaterial = useSelector(
    (state) => state.NewMeetingreducer.cancelMeetingMaterial
  );

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  let currentMeeting = Number(localStorage.getItem("currentMeetingID"));
  let currentUserID = Number(localStorage.getItem("userID"));
  let currentOrganization = Number(localStorage.getItem("organizationID"));
  let isMeeting = JSON.parse(localStorage.getItem("isMeeting"));
  let meetingTitle = localStorage.getItem("meetingTitle");

  let activeCall = JSON.parse(localStorage.getItem("activeCall"));

  let initiateRoomID = localStorage.getItem("initiateCallRoomID");

  let currentCallType = Number(localStorage.getItem("CallType"));

  let callTypeID = Number(localStorage.getItem("callTypeID"));

  let callerID = Number(localStorage.getItem("callerID"));

  // const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);

  const [showMoreFilesView, setShowMoreFilesView] = useState(false);

  const [fileDataAgenda, setFileDataAgenda] = useState([]);
  const [agendaName, setAgendaName] = useState("");
  const [agendaIndex, setAgendaIndex] = useState(-1);
  const [subAgendaIndex, setSubAgendaIndex] = useState(-1);

  // useEffect(() => {
  //   let Data = {
  //     MeetingID: Number(advanceMeetingModalID),
  //   };
  //   dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
  //   return () => {
  //     dispatch(clearAgendaReducerState());
  //     setRows([]);
  //   };
  // }, []);

  const handleCancelMeetingNoPopup = () => {
    // let searchData = {
    //   Date: "",
    //   Title: "",
    //   HostName: "",
    //   UserID: Number(userID),
    //   PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
    //   Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
    //   PublishedMeetings:
    //     currentView && Number(currentView) === 1 ? true : false,
    // };
    // dispatch(searchNewUserMeeting(navigate, searchData, t));
    // localStorage.removeItem("folderDataRoomMeeting");
    // setViewAdvanceMeetingModal(false);
    // dispatch(viewAdvanceMeetingPublishPageFlag(false));
    // dispatch(viewAdvanceMeetingUnpublishPageFlag(false));
    // setactionsPage(false);
  };

  const handleClickSave = () => {
    setMinutes(true);
    setMeetingMaterial(false);
  };

  // useEffect(() => {
  //   if (
  //     GetAdvanceMeetingAgendabyMeetingIDData !== null &&
  //     GetAdvanceMeetingAgendabyMeetingIDData !== undefined &&
  //     GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
  //   ) {
  //     setRows(GetAdvanceMeetingAgendabyMeetingIDData.agendaList);
  //   }
  // }, [GetAdvanceMeetingAgendabyMeetingIDData]);

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
      MeetingID: currentMeeting,
    };
    dispatch(
      FetchMeetingURLApi(Data2, navigate, t, currentUserID, currentOrganization)
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
      MeetingID: currentMeeting,
    };
    dispatch(
      FetchMeetingURLApi(Data2, navigate, t, currentUserID, currentOrganization)
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
        MeetingID: currentMeeting,
      };
      dispatch(
        FetchMeetingURLApi(
          Data,
          navigate,
          t,
          currentUserID,
          currentOrganization,
          1
        )
      );
      localStorage.setItem("meetingTitle", meetingTitle);
      setFullScreenView(false);
    } else if (activeCall === true && isMeeting === false) {
      setInitiateVideoModalOto(true);
      dispatch(callRequestReceivedMQTT({}, ""));
      setFullScreenView(false);
    }
  };

  return (
    <Modal
      show={true}
      modalFooterClassName={"d-block"}
      modalHeaderClassName={"d-block"}
      onHide={() => setFullScreenView(false)}
      // size={"xl"}
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

              <Tooltip placement="topRight" title={t("Collapse")}>
                <div
                  className={styles["box-agendas"]}
                  onClick={() => setFullScreenView(false)}
                >
                  <img src={CollapseAgendaIcon} alt="" />
                </div>
              </Tooltip>

              {editorRole.status === "10" || editorRole.status === 10 ? (
                <Tooltip placement="topRight" title={t("Enable-video-call")}>
                  <div
                    className={styles["box-agendas-camera"]}
                    onClick={joinMeetingCall}
                  >
                    <img src={VideocameraIcon} alt="" />
                  </div>
                </Tooltip>
              ) : null}
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
