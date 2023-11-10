import React, { useState, useEffect } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../../../components/elements";
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
import { GetAdvanceMeetingAgendabyMeetingID } from "../../../../../store/actions/MeetingAgenda_action";
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

const Agenda = ({
  setSceduleMeeting,
  setParticipants,
  setAgenda,
  setMeetingMaterial,
  setViewAdvanceMeetingModal,
  setPolls,
  setMinutes,
  advanceMeetingModalID,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let currentMeetingID = Number(localStorage.getItem("meetingID"));
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

  // For cancel with no modal Open
  let userID = localStorage.getItem("userID");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let currentView = localStorage.getItem("MeetingCurrentView");

  const [rows, setRows] = useState([
    {
      ID: getRandomUniqueNumber().toString(),
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "1",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [],
      subAgenda: [
        {
          SubAgendaID: getRandomUniqueNumber().toString(),
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "1",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          subfiles: [],
        },
      ],
    },
  ]);
  console.log("result Dropped files", rows);

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();
    console.log("addrow", (nextID + 1).toString());
    const newMainAgenda = {
      ID: getRandomUniqueNumber().toString(),
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "1",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [],
      subAgenda: [
        {
          SubAgendaID: getRandomUniqueNumber().toString(),
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "1",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          subfiles: [],
        },
      ],
    };
    updatedRows.push(newMainAgenda);
    setRows(updatedRows);
    console.log(updatedRows, "updatedRowsupdatedRows");
  };

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

  //SubAgenda Statemanagement

  const handlePreviousAgenda = () => {
    dispatch(showImportPreviousAgendaModal(true));
  };

  const handleSavedViewAgenda = () => {
    setsavedViewAgenda(true);
  };

  const EnableAgendaView = () => {
    // Enable View page From it
    // setagendaViewPage(true);
    dispatch(showCancelModalAgenda(true));
  };

  const handleCancelBtn = () => {
    setCancelModalView(true);
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
    let Data = {
      MeetingID: 1216,
    };
    dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
  }, []);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !==
        undefined &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
    ) {
      setRows(
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList
      );
    }
  }, [MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData]);

  console.log("MeetingAgendaReducer", MeetingAgendaReducer);

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
                        {rows.length > 0
                          ? rows.map((data, index) => {
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
                                  />
                                </>
                              );
                            })
                          : null}

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
                {/* <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_Organizers_view"]}
                  onClick={handleCancelBtn}
                /> */}
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

      {NewMeetingreducer.agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          rows={rows}
          setSubajendaRemoval={setSubajendaRemoval}
          subajendaRemoval={subajendaRemoval}
          setAgendaItemRemovedIndex={setAgendaItemRemovedIndex}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {NewMeetingreducer.mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          setMainAgendaRemovalIndex={setMainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.advancePermissionModal && <AdvancePersmissionModal />}
      {NewMeetingreducer.advancePermissionConfirmation && (
        <PermissionConfirmation />
      )}
      {NewMeetingreducer.voteAgendaModal && (
        <VoteModal setenableVotingPage={setenableVotingPage} />
      )}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
      {NewMeetingreducer.cancelAgenda && (
        <CancelAgenda setSceduleMeeting={setSceduleMeeting} />
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
    </>
  );
};

export default Agenda;
