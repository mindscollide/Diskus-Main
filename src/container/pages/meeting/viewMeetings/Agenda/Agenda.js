import React, { useState, useEffect } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Notification } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "antd";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import line from "../../../../../assets/images/LineAgenda.svg";
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import {
  showCancelModalAgenda,
  showImportPreviousAgendaModal,
  searchNewUserMeeting,
} from "../../../../../store/actions/NewMeetingActions";
import {
  GetAdvanceMeetingAgendabyMeetingID,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";
import emptyContributorState from "../../../../../assets/images/emptyStateContributor.svg";

import MainAjendaItemRemoved from "./MainAgendaItemsRemove/MainAjendaItemRemoved";
import AdvancePersmissionModal from "./AdvancePermissionModal/AdvancePersmissionModal";
import PermissionConfirmation from "./AdvancePermissionModal/PermissionConfirmModal/PermissionConfirmation";
import VoteModal from "./VoteModal/VoteModal";
import VoteModalConfirm from "./VoteModal/VoteModalConfirmation/VoteModalConfirm";
import ImportPrevious from "./ImportPreviousAgenda/ImportPrevious";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import SaveAgendaView from "./SavedAgendaView/SaveAgendaView";
import AgendaView from "./AgendaView/AgendaView";
import ParentAgenda from "./ParentAgenda";
import { getRandomUniqueNumber, onDragEnd } from "./drageFunction";
import VotingPage from "./VotingPage/VotingPage";
import CancelAgenda from "./CancelAgenda/CancelAgenda";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
import CastVoteAgendaModal from "./VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import ViewVoteModal from "./VotingPage/ViewVoteModal/ViewVoteModal";

const Agenda = ({
  setSceduleMeeting,
  setParticipants,
  setAgenda,
  setMeetingMaterial,
  setViewAdvanceMeetingModal,
  setPolls,
  setMinutes,
  advanceMeetingModalID,
  ediorRole,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const agendaItemRemoved = useSelector(
    (state) => state.NewMeetingreducer.agendaItemRemoved
  );
  const mainAgendaItemRemoved = useSelector(
    (state) => state.NewMeetingreducer.mainAgendaItemRemoved
  );
  const advancePermissionModal = useSelector(
    (state) => state.NewMeetingreducer.advancePermissionModal
  );
  const advancePermissionConfirmation = useSelector(
    (state) => state.NewMeetingreducer.advancePermissionConfirmation
  );
  const voteAgendaModal = useSelector(
    (state) => state.NewMeetingreducer.voteAgendaModal
  );
  const voteConfirmationModal = useSelector(
    (state) => state.NewMeetingreducer.voteConfirmationModal
  );
  const importPreviousAgendaModal = useSelector(
    (state) => state.NewMeetingreducer.importPreviousAgendaModal
  );
  const cancelAgenda = useSelector(
    (state) => state.NewMeetingreducer.cancelAgenda
  );
  const GetAdvanceMeetingAgendabyMeetingIDData = useSelector(
    (state) => state.MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData
  );

  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );

  const { Dragger } = Upload;
  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [agendaViewPage, setagendaViewPage] = useState(false);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [savedViewAgenda, setsavedViewAgenda] = useState(false);
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [rows, setRows] = useState([]);
  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
  }, []);
  //   updatedRows.push(newMainAgenda);
  //   setRows(updatedRows);
  //   console.log(updatedRows, "updatedRowsupdatedRows");
  // };

  const handleCancelMeetingNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setViewAdvanceMeetingModal(false);
    setAgenda(false);
  };

  const handlePreviousBtn = () => {
    setAgenda(false);
    setParticipants(true);
  };

  const handleNextBtn = () => {
    setAgenda(false);
    setMeetingMaterial(true);
  };

  useEffect(() => {
    if (
      GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      GetAdvanceMeetingAgendabyMeetingIDData !== undefined &&
      GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
    ) {
      setRows(GetAdvanceMeetingAgendabyMeetingIDData.agendaList);
    }
  }, [GetAdvanceMeetingAgendabyMeetingIDData]);
  console.log(
    "GetAdvanceMeetingAgendabyMeetingIDData",
    GetAdvanceMeetingAgendabyMeetingIDData
  );

  useEffect(() => {
    console.log("openopenopen", MeetingAgendaReducer.ResponseMessage);
    if (MeetingAgendaReducer.ResponseMessage === t("Record-saved")) {
      setTimeout(
        setOpen({
          ...open,
          flag: true,
          message: "Record Saved",
        }),
        3000
      );
    } else if (MeetingAgendaReducer.ResponseMessage === t("Record-updated")) {
      setTimeout(
        setOpen({
          ...open,
          flag: true,
          message: "Record Updated",
        }),
        3000
      );
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingAgendaReducer.ResponseMessage]);

  return (
    <>
      {savedViewAgenda ? (
        <SaveAgendaView />
      ) : agendaViewPage ? (
        <AgendaView />
      ) : enableVotingPage ? (
        <VotingPage />
      ) : (
        <>
          <section>
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
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {rows.length > 0 ? (
                          rows.map((data, index) => {
                            return (
                              <>
                                <ParentAgenda
                                  data={data}
                                  index={index}
                                  rows={rows}
                                  setRows={setRows}
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
                                  ediorRole={ediorRole}
                                  advanceMeetingModalID={advanceMeetingModalID}
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
                                className="d-flex justify-content-center"
                              >
                                <span className={styles["Empty_state_heading"]}>
                                  {t("No-Agenda-found")}
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
                                  {t("There-are-no-agenda")}
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
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Meeting_Details"]}
                  onClick={handleCancelMeetingNoPopup}
                />
                <Button
                  text={t("Previous")}
                  className={styles["Next_Button_Organizers_view"]}
                  onClick={handlePreviousBtn}
                />
                <Button
                  text={t("Next")}
                  className={styles["Next_Button_Organizers_view"]}
                  onClick={handleNextBtn}
                />
              </Col>
            </Row>
          </section>
        </>
      )}

      {agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          rows={rows}
          setSubajendaRemoval={setSubajendaRemoval}
          subajendaRemoval={subajendaRemoval}
          setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          setMainAgendaRemovalIndex={setMainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {advancePermissionModal && <AdvancePersmissionModal />}
      {advancePermissionConfirmation && <PermissionConfirmation />}
      {voteAgendaModal && (
        <VoteModal setenableVotingPage={setenableVotingPage} />
      )}
      {voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.castVoteAgendaPage && <CastVoteAgendaModal />}
      {NewMeetingreducer.viewVotesAgenda && (
        <ViewVoteModal advanceMeetingModalID={advanceMeetingModalID} />
      )}
      {importPreviousAgendaModal && <ImportPrevious />}
      {cancelAgenda && <CancelAgenda setSceduleMeeting={setSceduleMeeting} />}
      {cancelModalView && (
        <CancelButtonModal
          setCancelModalView={setCancelModalView}
          cancelModalView={cancelModalView}
          setViewAdvanceMeetingModal={setViewAdvanceMeetingModal}
          setAgenda={setAgenda}
          setPolls={setPolls}
          setMinutes={setMinutes}
        />
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Agenda;
