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
  const { Dragger } = Upload;
  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [agendaViewPage, setagendaViewPage] = useState(false);
  const [cancelModalView, setCancelModalView] = useState(false);
  const [savedViewAgenda, setsavedViewAgenda] = useState(false);
  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [rows, setRows] = useState([
    {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      presenterID: null,
      description: "",
      presenterName: "",
      startDate: null,
      endDate: null,
      selectedRadio: 1,
      urlFieldMain: "",
      // requestContributorURl: 0,
      mainNote: "",
      requestContributorURlName: "",
      files: [],
      isLocked: false,
      voteOwner: null,
      isAttachment: false,
      userID: 0,
      subAgenda: [
        {
          subAgendaID: getRandomUniqueNumber().toString() + "A",
          agendaVotingID: 0,
          subTitle: "",
          description: "",
          agendaVotingID: 0,
          presenterID: null,
          presenterName: "",
          startDate: null,
          endDate: null,
          subSelectRadio: 1,
          subAgendaUrlFieldRadio: "",
          // subAgendarequestContributorUrl: 0,
          subAgendarequestContributorUrlName: "",
          subAgendarequestContributorEnterNotes: "",
          subfiles: [],
          isLocked: false,
          voteOwner: null,
          isAttachment: false,
          userID: 0,
        },
      ],
    },
  ]);
  useEffect(() => {
    let Data = {
      MeetingID: Number(advanceMeetingModalID),
    };
    dispatch(GetAdvanceMeetingAgendabyMeetingID(Data, navigate, t));
  }, []);

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
    if (
      GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      GetAdvanceMeetingAgendabyMeetingIDData !== undefined &&
      GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
    ) {
      setRows(GetAdvanceMeetingAgendabyMeetingIDData.agendaList);
    }
  }, [GetAdvanceMeetingAgendabyMeetingIDData]);
console.log("GetAdvanceMeetingAgendabyMeetingIDData",GetAdvanceMeetingAgendabyMeetingIDData)
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
                  onClick={handleCancelBtn}
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
    </>
  );
};

export default Agenda;
