import React, { useState, useEffect } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button, Notification } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import {
  searchNewUserMeeting,
  viewAdvanceMeetingPublishPageFlag,
  viewAdvanceMeetingUnpublishPageFlag,
} from "../../../../../store/actions/NewMeetingActions";
import {
  GetAdvanceMeetingAgendabyMeetingID,
  clearAgendaReducerState,
  clearResponseMessage,
} from "../../../../../store/actions/MeetingAgenda_action";
import emptyContributorState from "../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
import MainAjendaItemRemoved from "./MainAgendaItemsRemove/MainAjendaItemRemoved";
import PermissionConfirmation from "./AdvancePermissionModal/PermissionConfirmModal/PermissionConfirmation";
import VoteModal from "./VoteModal/VoteModal";
import VoteModalConfirm from "./VoteModal/VoteModalConfirmation/VoteModalConfirm";
import ImportPrevious from "./ImportPreviousAgenda/ImportPrevious";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ParentAgenda from "./ParentAgenda";
import { onDragEnd } from "./drageFunction";
import VotingPage from "./VotingPage/VotingPage";
import CancelAgenda from "./CancelAgenda/CancelAgenda";
import CancelButtonModal from "../meetingDetails/CancelButtonModal/CancelButtonModal";
import CastVoteAgendaModal from "./VotingPage/CastVoteAgendaModal/CastVoteAgendaModal";
import ViewVoteModal from "./VotingPage/ViewVoteModal/ViewVoteModal";
import { showMessage } from "../../../../../components/elements/snack_bar/utill";

const Agenda = ({
  setParticipants,
  setAgenda,
  setMeetingMaterial,
  setViewAdvanceMeetingModal,
  setPolls,
  setMinutes,
  advanceMeetingModalID,
  editorRole,
  setEdiorRole,
  setAdvanceMeetingModalID,
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

  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [cancelModalView, setCancelModalView] = useState(false);
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
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = localStorage.getItem("MeetingPageCurrent");
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [rows, setRows] = useState([]);
  const [emptyStateRows, setEmptyStateRows] = useState(false);

  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
    return () => {
      dispatch(clearAgendaReducerState());
      setRows([]);
    };
  }, []);

  const handleCancelMeetingNoPopup = () => {
    let searchData = {
      Date: "",
      Title: "",
      HostName: "",
      UserID: Number(userID),
      PageNumber: meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
      Length: meetingpageRow !== null ? Number(meetingpageRow) : 30,
      PublishedMeetings:
        currentView && Number(currentView) === 1 ? true : false,
    };
    console.log("chek search meeting");
    dispatch(searchNewUserMeeting(navigate, searchData, t));
    setViewAdvanceMeetingModal(false);
    dispatch(viewAdvanceMeetingPublishPageFlag(false));
    dispatch(viewAdvanceMeetingUnpublishPageFlag(false));

    setAgenda(false);
    localStorage.removeItem("folderDataRoomMeeting");
    setEdiorRole({ status: null, role: null });
    setAdvanceMeetingModalID(null);
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

  useEffect(() => {
    console.log("openopenopen", MeetingAgendaReducer.ResponseMessage);
    if (MeetingAgendaReducer.ResponseMessage === t("Record-saved")) {
      showMessage(t("Record-saved"), "error", setOpen);
    } else if (MeetingAgendaReducer.ResponseMessage === t("Record-updated")) {
      showMessage(t("Record-updated"), "error", setOpen);
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingAgendaReducer.ResponseMessage]);

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
          MeetingID: Number(advanceMeetingModalID),
        };
        dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
      }
    }
  }, [MeetingAgendaReducer.MeetingAgendaUpdatedMqtt]);

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
      {enableVotingPage ? (
        <VotingPage />
      ) : (
        <>
          <section>
            {emptyStateRows === true &&
            (editorRole.role === "Agenda Contributor" ||
              editorRole.role === "Participant") ? null : (
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
            )}
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
      {cancelAgenda && (
        <CancelAgenda setSceduleMeeting={setViewAdvanceMeetingModal} />
      )}
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
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default Agenda;
