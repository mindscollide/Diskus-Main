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

  const onDragEnd = (result, itemType) => {
    console.log("onDragEnd", result);

    // Dropped nowhere
    if (!result.destination) {
      return;
    }

    if (result.type === "PARENT") {
      const reorderedRows = [...rows];
      const [movedRow] = reorderedRows.splice(result.source.index, 1);
      reorderedRows.splice(result.destination.index, 0, movedRow);
      setRows(reorderedRows);
      console.log("onDragEnd Parent", reorderedRows);
    } else if (result.type === "SUB_AGENDA") {
      const sourceParentIndex = parseInt(
        result.source.droppableId.split("-")[2]
      );
      const destinationParentIndex = parseInt(
        result.destination.droppableId.split("-")[2]
      );
      const sourceIndex = result.source.index;
      const destinationIndex = result.destination.index;
      console.log("onDragEnd SUB_AGENDA", sourceIndex);
      console.log("onDragEnd SUB_AGENDA", destinationIndex);
      if (sourceParentIndex === destinationParentIndex) {
        // Reordering within the same parent
        const updatedParent = { ...rows[sourceParentIndex] };
        const [movedSubAgenda] = updatedParent.subAgenda.splice(sourceIndex, 1);
        updatedParent.subAgenda.splice(destinationIndex, 0, movedSubAgenda);
        const updatedRows = [...rows];
        updatedRows[sourceParentIndex] = updatedParent;
        setRows(updatedRows);
        console.log("onDragEnd SUB_AGENDA", updatedRows);
      } else {
        // Moving from one parent to another
        const sourceParent = { ...rows[sourceParentIndex] };
        const destinationParent = { ...rows[destinationParentIndex] };
        const [movedSubAgenda] = sourceParent.subAgenda.splice(sourceIndex, 1);
        destinationParent.subAgenda.splice(destinationIndex, 0, movedSubAgenda);
        const updatedRows = [...rows];
        updatedRows[sourceParentIndex] = sourceParent;
        updatedRows[destinationParentIndex] = destinationParent;
        setRows(updatedRows);
        console.log("onDragEnd SUB_AGENDA", updatedRows);
      }
    } else if (result.type === "attachment") {
      // Handle attachment drag-and-drop
      const sourceParentType = result.source.droppableId.split("-")[0];
      const destinationParentType =
        result.destination.droppableId.split("-")[0];

      console.log("onDragEnd sourceParentType", sourceParentType);
      console.log("onDragEnd destinationParentType", destinationParentType);
      if (sourceParentType === "parent" && destinationParentType === "parent") {
        const sourceParentIndex = parseInt(
          result.source.droppableId.split("-")[1]
        );
        const destinationParentIndex = parseInt(
          result.destination.droppableId.split("-")[1]
        );
        // Attachment is moved between different parent agendas
        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;
        const sourceParent = { ...rows[sourceParentIndex] };
        const destinationParent = { ...rows[destinationParentIndex] };
        const movedAttachment = sourceParent.files.splice(sourceIndex, 1)[0];
        destinationParent.files.splice(destinationIndex, 0, movedAttachment);
        const updatedRows = [...rows];
        updatedRows[sourceParentIndex] = sourceParent;
        updatedRows[destinationParentIndex] = destinationParent;
        setRows(updatedRows);
        console.log(
          "Attachment moved between different parent agendas",
          updatedRows
        );
      } else if (
        sourceParentType === "subAgendaID" &&
        destinationParentType === "parent"
      ) {
        const sourceIndex = result.source.droppableId;
        const parts = sourceIndex.split("-");
        const destination = result.destination.droppableId;
        const parentsDestination = destination.split("-");
        // Find the indices of "subAgendaID" and "parent" in the array
        const subAgenda = parts.indexOf("subAgendaID");
        const parentIndex = parts.indexOf("parent");
        const parentDestinationIndex = parentsDestination.indexOf("parent");
        // Fetch the values next to "subAgendaID" and "parent"
        const subAgendaID = parts[subAgenda + 1];
        const sourceParentID = parts[parentIndex + 1];
        const findSourcePrentIndex = rows.findIndex(
          (obj) => obj.ID === sourceParentID
        );
        const destinationParentID =
          parentsDestination[parentDestinationIndex + 1];
        const destinationParentIndex = rows.findIndex(
          (obj) => obj.ID === destinationParentID
        );
        const destinationIndex = result.destination.index;
        // Get the source parent and sub-agenda objects
        const sourceParent = { ...rows[findSourcePrentIndex] };
        const duplicatedObjectIndex = sourceParent.subAgenda.findIndex(
          (obj) => obj.SubAgendaID === subAgendaID
        );
        const sourceSubAgenda = sourceParent.subAgenda[duplicatedObjectIndex];

        // Remove the attachment from the source sub-agenda
        const movedAttachment = sourceSubAgenda.Subfiles.splice(
          result.source.index,
          1
        )[0];

        // Add the removed attachment to the destination parent's files array at the specified index
        const destinationParent = { ...rows[destinationParentIndex] };
        destinationParent.files.splice(destinationIndex, 0, movedAttachment);

        // Update the rows data with the modified parent and sub-agenda objects
        const updatedRows = [...rows];
        updatedRows[findSourcePrentIndex] = sourceParent;
        updatedRows[destinationParentIndex] = destinationParent;
        setRows(updatedRows);
      } else if (
        sourceParentType === "parent" &&
        destinationParentType === "subAgendaID"
      ) {
        // Attachment is moved from sub agenda to parent agenda
        const destination = result.destination.droppableId;
        const destinationParts = destination.split("-");
        // destination Parent ID Index in responce
        const destinationParentIDIndex = destinationParts.indexOf("parent");
        // destination Parent ID in responce
        const destinationParentID =
          destinationParts[destinationParentIDIndex + 1];
        // find index of parent in main json data
        const findDestinationParentIDIndex = rows.findIndex(
          (obj) => obj.ID === destinationParentID
        );

        const destinationParent = { ...rows[findDestinationParentIDIndex] };
        //  sub agend index in responce
        const destinationSubAgendaIDIndex =
          destinationParts.indexOf("subAgendaID");
        // sub Agenda ID in jason responce
        const destinationSubAgendaID =
          destinationParts[destinationSubAgendaIDIndex + 1];
        // find sub Agenda of that parent index
        const findDestinationSubAgendaIDIndex =
          destinationParent.subAgenda.findIndex(
            (obj) => obj.SubAgendaID === destinationSubAgendaID
          );
        const source = result.source.droppableId;
        const sourceParts = source.split("-");
        // source parent ID index from responce
        const parentSourceIndex = sourceParts.indexOf("parent");
        // source parent ID  from responce
        const ParentSourcID = sourceParts[parentSourceIndex + 1];
        // find parent index from main json
        const findSourceParentIDIndex = rows.findIndex(
          (obj) => obj.ID === ParentSourcID
        );

        // Find the source and destination parent agendas and sub-agendas
        const sourceParent = { ...rows[findSourceParentIDIndex] };
        const destinationSubAgenda =
          destinationParent.subAgenda[findDestinationSubAgendaIDIndex];
        // Find the attachment to be moved from the source parent's files
        const movedAttachment = sourceParent.files.splice(
          result.source.index,
          1
        )[0];

        // Add the removed attachment to the destination sub-agenda's Subfiles array
        destinationSubAgenda.Subfiles.splice(
          result.destination.index,
          0,
          movedAttachment
        );

        // Update the rows data with the modified source and destination parent agendas
        const updatedRows = [...rows];
        updatedRows[findSourceParentIDIndex] = sourceParent;
        updatedRows[findDestinationParentIDIndex] = destinationParent;
        setRows(updatedRows);
      } else if (
        sourceParentType === "subAgendaID" &&
        destinationParentType === "subAgendaID"
      ) {
        // Attachment is moved between different sub-agendas
      }
    }
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
            <DragDropContext onDragEnd={onDragEnd}>
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
