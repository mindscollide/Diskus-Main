import React, { useState, useEffect } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { removePropertiesFromObject } from "../../../../../commen/functions/validations";
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
  getAllAgendaContributorApi,
} from "../../../../../store/actions/NewMeetingActions";
import {
  CreateUpdateMeetingDataRoomMap,
  UploadDocumentsAgendaApi,
} from "../../../../../store/actions/MeetingAgenda_action";
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

const Agenda = ({ setSceduleMeeting, currentMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );
  const { Dragger } = Upload;
  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [agendaViewPage, setagendaViewPage] = useState(false);
  const [fileForSend, setFileForSend] = useState([]);

  const [savedViewAgenda, setsavedViewAgenda] = useState(false);

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [rows, setRows] = useState([
    {
      ID: getRandomUniqueNumber().toString(),
      title: "",
      presenterID: null,
      description: "",
      presenterName: "",
      startDate: null,
      endDate: null,
      selectedRadio: "1",
      urlFieldMain: "",
      requestContributorURl: 0,
      MainNote: "",
      requestContributorURlName: "",
      files: [],
      subAgenda: [
        {
          SubAgendaID: getRandomUniqueNumber().toString(),
          SubTitle: "",
          description: "",
          presenterID: null,
          presenterName: "",
          startDate: null,
          endDate: null,
          subSelectRadio: "1",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: 0,
          subAgendarequestContributorUrlName: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [],
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
      presenterID: null,
      description: "",
      presenterName: "",
      startDate: null,
      endDate: null,
      selectedRadio: "1",
      urlFieldMain: "",
      requestContributorURl: 0,
      MainNote: "",
      requestContributorURlName: "",
      files: [],
      subAgenda: [
        {
          SubAgendaID: getRandomUniqueNumber().toString(),
          SubTitle: "",
          description: "",
          presenterID: null,
          presenterName: "",
          startDate: null,
          endDate: null,
          subSelectRadio: "1",
          SubAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: 0,
          subAgendarequestContributorUrlName: "",
          subAgendarequestContributorEnterNotes: "",
          Subfiles: [],
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
    // Enable View page From it
    // setagendaViewPage(true);
    dispatch(showCancelModalAgenda(true));
  };

  useEffect(() => {
    let getAllData = {
      MeetingID: currentMeeting !== null ? currentMeeting : 0,
    };
    let getFolderIDData = {
      MeetingID: currentMeeting,
      MeetingTitle:
        NewMeetingreducer.getAllMeetingDetails.length !== 0
          ? NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails
              .meetingTitle
          : "",
      IsUpdateFlow: false,
    };
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    dispatch(CreateUpdateMeetingDataRoomMap(navigate, t, getFolderIDData));
  }, []);

  // // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (s) => {
    if (s.length > 0) {
      return s[0].toUpperCase() + s.slice(1);
    }
    return s;
  };

  const capitalizeKeys = (obj) => {
    if (Array.isArray(obj)) {
      return obj.map((item) => capitalizeKeys(item));
    } else if (typeof obj === "object" && obj !== null) {
      const newObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newKey = capitalizeFirstLetter(key);
          newObj[newKey] = capitalizeKeys(obj[key]);
        }
      }
      return newObj;
    } else {
      return obj;
    }
  };

  function removeProperties(data) {
    if (Array.isArray(data)) {
      // If data is an array, recursively process each element
      return data.map((item) => removeProperties(item));
    } else if (typeof data === "object" && data !== null) {
      // If data is an object and not null, filter out the properties you want to remove
      const {
        presenterName,
        requestContributorURl,
        subAgendarequestContributorUrlName,
        ...rest
      } = data;
      // Recursively process the remaining properties
      for (const key in rest) {
        rest[key] = removeProperties(rest[key]);
      }
      return rest;
    } else {
      // If data is neither an array nor an object, return it as is
      return data;
    }
  }

  const saveAgendaData = async () => {
    console.log(
      fileForSend,
      "fileForSendfileForSendfileForSendfileForSendfileForSend"
    );
    let newFolder = [];
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        UploadDocumentsAgendaApi(navigate, t, newData, 0, newFolder)
      );
    });

    // Wait for all promises to resolve
    await Promise.all(uploadPromises);

    let cleanedData = removeProperties(rows);

    let capitalizedData = capitalizeKeys(cleanedData);

    let mappingObject = {};
    newFolder.forEach((folder) => {
      mappingObject[folder.DisplayAttachmentName] = folder.pK_FileID.toString();
    });

    // Update capitalizedData with the mappingObject
    let updatedData = capitalizedData.map((item) => {
      let updatedFiles = item.Files.map((file) => {
        let newAttachmentName = mappingObject[file.DisplayAttachmentName];
        if (newAttachmentName) {
          return {
            ...file,
            OriginalAttachmentName: newAttachmentName,
          };
        } else {
          return file;
        }
      });

      return {
        ...item,
        Files: updatedFiles,
      };
    });

    console.log("Save Agenda Data", updatedData);
  };

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);
  console.log("MeetingAgendaReducerMeetingAgendaReducer", MeetingAgendaReducer);

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
                                    fileForSend={fileForSend}
                                    setFileForSend={setFileForSend}
                                    currentMeeting={currentMeeting}
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
                  onClick={saveAgendaData}
                  text={t("Save")}
                  className={styles["Agenda_Buttons"]}
                />

                <Button
                  text={t("Save-and-publish")}
                  className={styles["Agenda_Buttons"]}
                />

                <Button
                  text={t("Save-and-next")}
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
        <VoteModal
          setenableVotingPage={setenableVotingPage}
          currentMeeting={currentMeeting}
        />
      )}
      {NewMeetingreducer.voteConfirmationModal && <VoteModalConfirm />}
      {NewMeetingreducer.importPreviousAgendaModal && <ImportPrevious />}
      {NewMeetingreducer.cancelAgenda && (
        <CancelAgenda setSceduleMeeting={setSceduleMeeting} />
      )}
    </>
  );
};

export default Agenda;
