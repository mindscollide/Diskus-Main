import React, { useState, useEffect } from "react";
import styles from "./Agenda.module.css";
import { useNavigate } from "react-router-dom";
import { removePropertiesFromObject } from "../../../../../commen/functions/validations";
import { Col, Row } from "react-bootstrap";
import {
  Button,
  Loader,
  Notification,
} from "../../../../../components/elements";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Upload } from "antd";
import {
  convertDateFieldsToUTC,
  convertUtcToGmt,
  resolutionResultTable,
} from "../../../../../commen/functions/date_formater";
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
  AddUpdateAdvanceMeetingAgenda,
  clearResponseMessage,
  GetAdvanceMeetingAgendabyMeetingID,
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

const Agenda = ({ setSceduleMeeting, currentMeeting, isEditMeeting }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  let currentUserID = Number(localStorage.getItem("userID"));

  console.log("isEditMeetingisEditMeeting", isEditMeeting);

  const { NewMeetingreducer, MeetingAgendaReducer, DataRoomReducer } =
    useSelector((state) => state);

  let meetingTitle = localStorage.getItem("MeetingTitle");

  const { Dragger } = Upload;
  const [enableVotingPage, setenableVotingPage] = useState(false);
  const [agendaViewPage, setagendaViewPage] = useState(false);
  const [fileForSend, setFileForSend] = useState([]);

  const [savedViewAgenda, setsavedViewAgenda] = useState(false);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [rows, setRows] = useState([
    {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      presenterID: null,
      description: "",
      presenterName: "",
      startDate: null,
      endDate: null,
      selectedRadio: 1,
      urlFieldMain: "",
      requestContributorURl: 0,
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
          subTitle: "",
          description: "",
          agendaVotingID: 0,
          presenterID: null,
          presenterName: "",
          startDate: null,
          endDate: null,
          subSelectRadio: 1,
          subAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: 0,
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
  console.log("result Dropped files", rows);

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();
    console.log("addrow", (nextID + 1).toString());
    const newMainAgenda = {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      presenterID: null,
      description: "",
      presenterName: "",
      startDate: null,
      endDate: null,
      selectedRadio: 1,
      urlFieldMain: "",
      requestContributorURl: 0,
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
          subTitle: "",
          description: "",
          presenterID: null,
          presenterName: "",
          startDate: null,
          endDate: null,
          subSelectRadio: 1,
          agendaVotingID: 0,
          subAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrl: 0,
          subAgendarequestContributorUrlName: "",
          subAgendarequestContributorEnterNotes: "",
          subfiles: [],
          isLocked: false,
          voteOwner: null,
          isAttachment: false,
          userID: 0,
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
        NewMeetingreducer.getAllMeetingDetails !== null
          ? NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails
              .meetingTitle
          : meetingTitle !== null &&
            meetingTitle !== undefined &&
            meetingTitle !== ""
          ? meetingTitle
          : "",
      IsUpdateFlow: false,
    };
    if (isEditMeeting === true) {
      let getMeetingData = {
        MeetingID: currentMeeting,
      };
      dispatch(GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t));
    }
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    dispatch(CreateUpdateMeetingDataRoomMap(navigate, t, getFolderIDData));
  }, []);

  // // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (str) => {
    if (str.toLowerCase() === "id") {
      return str.toUpperCase();
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      return data.map((item) => removeProperties(item));
    } else if (typeof data === "object" && data !== null) {
      const {
        presenterName,
        requestContributorURlName,
        subAgendarequestContributorUrlName,
        ...rest
      } = data;
      for (const key in rest) {
        rest[key] = removeProperties(rest[key]);
      }
      return rest;
    } else {
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
    const convertedRows = convertDateFieldsToUTC(rows);

    // Wait for all promises to resolve
    await Promise.all(uploadPromises);

    let cleanedData = removeProperties(convertedRows);

    let mappingObject = {};
    newFolder.forEach((folder) => {
      console.log("Save Agenda Data folderfolder", folder);
      mappingObject[folder.displayAttachmentName] = folder.pK_FileID.toString();
    });
    console.log(
      cleanedData,
      "cleanedDatacleanedDatacleanedDatacleanedDatacleanedDatacleanedData"
    );
    // Update files property in capitalizedData
    let updatedData = cleanedData.map((item) => {
      let updatedFiles = item.files.map((file) => {
        let newAttachmentName = mappingObject[file.displayAttachmentName];
        if (newAttachmentName) {
          return {
            ...file,
            originalAttachmentName: newAttachmentName,
          };
        } else {
          return file;
        }
      });

      // Update subfiles property in SubAgenda objects
      let updatedSubAgenda = item.subAgenda.map((subAgenda) => {
        let updatedSubFiles = subAgenda.subfiles.map((subFile) => {
          let newAttachmentName = mappingObject[subFile.displayAttachmentName];
          if (newAttachmentName) {
            return {
              ...subFile,
              originalAttachmentName: newAttachmentName,
            };
          } else {
            return subFile;
          }
        });

        return {
          ...subAgenda,
          subfiles: updatedSubFiles,
        };
      });

      return {
        ...item,
        files: updatedFiles,
        subAgenda: updatedSubAgenda,
      };
    });

    console.log("Save Agenda Data", updatedData);
    let Data = {
      MeetingID: currentMeeting,
      AgendaList: updatedData,
    };

    let capitalizedData = capitalizeKeys(Data);

    console.log("Save Agenda Data", capitalizedData);
    dispatch(
      AddUpdateAdvanceMeetingAgenda(
        capitalizedData,
        navigate,
        t,
        currentMeeting
      )
    );
  };
  console.log(open, "openopenopen");

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
    } else {
      setRows(rows);
    }
  }, [MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !==
        undefined &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.length !== 0
    ) {
      let newData =
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList;
      setRows((prevRows) => {
        const updatedRows = newData.map((agendaItem) => ({
          ...agendaItem,
          startDate: agendaItem.startDate
            ? convertUtcToGmt(agendaItem.startDate)
            : null,
          endDate: agendaItem.endDate
            ? convertUtcToGmt(agendaItem.endDate)
            : null,
          subAgenda: agendaItem.subAgenda
            ? agendaItem.subAgenda.map((subAgenda) => ({
                ...subAgenda,
                startDate: subAgenda.startDate
                  ? convertUtcToGmt(subAgenda.startDate)
                  : null,
                endDate: subAgenda.endDate
                  ? convertUtcToGmt(subAgenda.endDate)
                  : null,
              }))
            : null,
        }));

        return updatedRows;
      });
    } else {
      setRows(rows);
    }
  }, [MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData]);

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
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingAgendaReducer.ResponseMessage]);

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);
  console.log(
    "MeetingAgendaReducerMeetingAgendaReducer",
    MeetingAgendaReducer,
    DataRoomReducer
  );

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
                    //  key={`main-agenda-${rows.id}`}
                    //  droppableId={`main-agenda-${rows.id}`}
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
      {/* {DataRoomReducer.Loading === true ||
      MeetingAgendaReducer.Loading === true ? (
        <Loader />
      ) : null} */}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Agenda;
