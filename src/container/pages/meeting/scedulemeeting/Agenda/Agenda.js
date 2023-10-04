import React, { useState } from "react";
import styles from "./Agenda.module.css";
import { Col, Row } from "react-bootstrap";
import { Button } from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "antd";
import plusFaddes from "../../../../../assets/images/PlusFadded.svg";
import line from "../../../../../assets/images/LineAgenda.svg";
import AgenItemremovedModal from "./AgendaItemRemovedModal/AgenItemremovedModal";
import { showImportPreviousAgendaModal } from "../../../../../store/actions/NewMeetingActions";
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
import { onDragEnd } from "./drageFunction";

const Agenda = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { NewMeetingreducer } = useSelector((state) => state);
  const { Dragger } = Upload;
  const [agendaViewPage, setagendaViewPage] = useState(false);

  const [savedViewAgenda, setsavedViewAgenda] = useState(false);

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [rows, setRows] = useState([
    {
      ID: "0",
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "0",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [
        {
          FileID: "0",
          name: "MeetingAgendas",
        },
        {
          FileID: "1",
          name: "Saif Meeting",
        },
        {
          FileID: "2",
          name: "Owais Meeting",
        },
        {
          FileID: "3",
          name: "Tresmark",
        },
        {
          FileID: "4",
          name: "Minds Collide",
        },
        {
          FileID: "5",
          name: "Aun File",
        },
        {
          FileID: "6",
          name: "Ali Raza Mamdani",
        },
        {
          FileID: "7",
          name: "Talha",
        },
        {
          FileID: "8",
          name: "Jawad Faisal",
        },
        {
          FileID: "9",
          name: "Fahad Hassan",
        },
        {
          FileID: "10",
          name: "Saroush Yahyas",
        },
      ],
      subAgenda: [
        {
          SubAgendaID: "0",
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "0",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [
            {
              name: "MeetingAgendas",
              FileID: "91",
            },
            {
              name: "DiskusMeetings",
              FileID: "92",
            },
            {
              name: "AxisMeetings",
              FileID: "93",
            },
            {
              name: "Bahria Auditoriom Meetings to be published",
              FileID: "94",
            },
            {
              name: "MeetingAgendas",
              FileID: "95",
            },
            {
              name: "MeetingAgendas",
              FileID: "91",
            },
            {
              name: "MeetingAgendas",
              FileID: "96",
            },
            {
              name: "MeetingAgendas",
              FileID: "97",
            },
            {
              name: "MeetingAgendas",
              FileID: "98",
            },
            {
              name: "MeetingAgendas",
              FileID: "100",
            },
          ],
        },
      ],
    },
  ]);

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();
    console.log("addrow", (nextID + 1).toString());
    const newMainAgenda = {
      ID: nextID,
      title: "",
      selectedOption: null,
      startDate: null,
      endDate: null,
      selectedRadio: "0",
      urlFieldMain: "",
      requestContributorURl: "",
      MainNote: "",
      files: [
        {
          name: "MeetingAgendas",
          FileID: "113",
        },
      ],
      subAgenda: [
        {
          SubAgendaID: (nextID + 1).toString(),
          SubTitle: "",
          selectedOption: null,
          startDate: null,
          endDate: null,
          subSelectRadio: "0",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [
            {
              name: "MeetingAgendas",
              FileID: "111",
            },
            // ... (other file objects)
          ],
        },
      ],
    };
    updatedRows.push(newMainAgenda);
    setRows(updatedRows);
    console.log(updatedRows, "updatedRowsupdatedRows");
  };

  //SubAgenda Statemanagement

  const handlePreviousAgenda = () => {
    dispatch(showImportPreviousAgendaModal(true));
  };

  const handleSavedViewAgenda = () => {
    setsavedViewAgenda(true);
  };

  const EnableAgendaView = () => {
    setagendaViewPage(true);
  };

  return (
    <>
      {savedViewAgenda ? (
        <SaveAgendaView />
      ) : agendaViewPage ? (
        <AgendaView />
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
                  <Droppable
                    //  key={`main-agenda-${rows.ID}`}
                    //  droppableId={`main-agenda-${rows.ID}`}
                    droppableId="board"
                    type="PARENT"
                  >
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
                                  {/* Line Seperator */}
                                  <Row className="mt-3">
                                    <Col lg={12} md={12} sm={12}>
                                      <img
                                        draggable={false}
                                        src={line}
                                        className={styles["LineStyles"]}
                                      />
                                    </Col>
                                  </Row>
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
            {/* Seperator For Footer */}
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <Button
                  text={
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-center gap-2 align-items-center"
                        >
                          <img
                            draggable={false}
                            src={plusFaddes}
                            height="10.77px"
                            width="10.77px"
                          />
                          <span className={styles["Add_Agen_Heading"]}>
                            {t("Add-agenda")}
                          </span>
                        </Col>
                      </Row>
                    </>
                  }
                  className={styles["AddMoreBtnAgenda"]}
                  onClick={addRow}
                />
              </Col>
            </Row>
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                <Button
                  text={t("Import-previous-agenda")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handlePreviousAgenda}
                />
                <Button
                  text={t("Cancel")}
                  className={styles["Agenda_Buttons"]}
                  onClick={EnableAgendaView}
                />
                <Button
                  text={t("Save-and-Next")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handleSavedViewAgenda}
                />
              </Col>
            </Row>
          </section>
        </>
      )}

      {NewMeetingreducer.agendaItemRemoved && (
        <AgenItemremovedModal
          setRows={setRows}
          setSubajendaRemoval={setSubajendaRemoval}
          agendaItemRemovedIndex={agendaItemRemovedIndex}
        />
      )}
      {NewMeetingreducer.mainAgendaItemRemoved && (
        <MainAjendaItemRemoved
          mainAgendaRemovalIndex={mainAgendaRemovalIndex}
          rows={rows}
          setRows={setRows}
        />
      )}
      {NewMeetingreducer.advancePermissionModal && <AdvancePersmissionModal />}
      {NewMeetingreducer.advancePermissionConfirmation && (
        <PermissionConfirmation />
      )}
      {NewMeetingreducer.voteAgendaModal && <VoteModal />}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
    </>
  );
};

export default Agenda;
