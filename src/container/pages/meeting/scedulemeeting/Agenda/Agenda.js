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
  GetAllMeetingUserApiFunc,
  searchNewUserMeeting,
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
import { UpdateOrganizersMeeting } from "../../../../../store/actions/MeetingOrganizers_action";

const Agenda = ({
  setSceduleMeeting,
  currentMeeting,
  isEditMeeting,
  ediorRole,
  dataroomMapFolderId,
  setMeetingMaterial,
  setAgenda,
  setParticipants,
  setPublishState,
  setAdvanceMeetingModalID,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  let currentView = localStorage.getItem("MeetingCurrentView");
  let meetingpageRow = localStorage.getItem("MeetingPageRows");
  let meetingPageCurrent = parseInt(localStorage.getItem("MeetingPageCurrent"));
  let userID = localStorage.getItem("userID");
  let folderDataRoomMeeting = Number(
    localStorage.getItem("folderDataRoomMeeting")
  );
  const navigate = useNavigate();

  const [allSavedPresenters, setAllSavedPresenters] = useState([]);

  const [allUsersRC, setAllUsersRC] = useState([]);

  const { NewMeetingreducer, MeetingAgendaReducer, DataRoomReducer } =
    useSelector((state) => state);

  let meetingTitle = localStorage.getItem("MeetingTitle");

  let currentMeetingIDLS = Number(localStorage.getItem("currentMeetingLS"));

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
  const [selectedID, setSelectedID] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);
  const [rows, setRows] = useState([
    {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      presenterID: 0,
      description: "",
      presenterName: "",
      startDate: "",
      endDate: "",
      selectedRadio: 1,
      urlFieldMain: "",
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
          presenterID: 0,
          presenterName: "",
          startDate: "",
          endDate: "",
          subSelectRadio: 1,
          subAgendaUrlFieldRadio: "",
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

  useEffect(() => {
    setRows({
      ...rows,
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      presenterID: 0,
      description: "",
      presenterName: "",
      startDate: "",
      endDate: "",
      selectedRadio: 1,
      urlFieldMain: "",
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
          presenterID: 0,
          presenterName: "",
          startDate: "",
          endDate: "",
          subSelectRadio: 1,
          subAgendaUrlFieldRadio: "",
          subAgendarequestContributorUrlName: "",
          subAgendarequestContributorEnterNotes: "",
          subfiles: [],
          isLocked: false,
          voteOwner: null,
          isAttachment: false,
          userID: 0,
        },
      ],
    });
  }, []);

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();
    console.log("addrow", (nextID + 1).toString());
    const newMainAgenda = {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      presenterID: 0,
      description: "",
      presenterName: "",
      startDate: "",
      endDate: "",
      selectedRadio: 1,
      urlFieldMain: "",
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
          presenterID: 0,
          presenterName: "",
          startDate: "",
          endDate: "",
          subSelectRadio: 1,
          subAgendaUrlFieldRadio: "",
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

  const handleNextAgenda = () => {
    setMeetingMaterial(true);
    setAgenda(false);
    // setsavedViewAgenda(true);
  };

  const handlePerviousAgenda = () => {
    setAgenda(false);
    setParticipants(true);
  };

  const EnableAgendaView = () => {
    // Enable View page From it
    // setagendaViewPage(true);
    dispatch(showCancelModalAgenda(true));
  };
  const handlePublishClick = () => {
    let Data = { MeetingID: currentMeeting, StatusID: 1 };
    dispatch(
      UpdateOrganizersMeeting(
        navigate,
        Data,
        t,
        5,
        setPublishState,
        setAdvanceMeetingModalID,
        setViewFlag,
        setEditFlag,
        setCalendarViewModal,
        setSceduleMeeting
      )
    );
    // setSceduleMeeting(false);
  };
  const handleCancelClick = async () => {
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
    await dispatch(searchNewUserMeeting(navigate, searchData, t));
    setSceduleMeeting(false);
    localStorage.setItem("folderDataRoomMeeting", 0);
  };
  useEffect(() => {
    let getAllData = {
      MeetingID: currentMeetingIDLS !== null ? currentMeetingIDLS : 0,
    };
    // let getFolderIDData = {
    //   MeetingID: currentMeetingIDLS,
    //   MeetingTitle:
    //     NewMeetingreducer.getAllMeetingDetails !== null
    //       ? NewMeetingreducer.getAllMeetingDetails.advanceMeetingDetails
    //           .meetingTitle
    //       : meetingTitle !== null &&
    //         meetingTitle !== undefined &&
    //         meetingTitle !== ""
    //       ? meetingTitle
    //       : "",
    //   IsUpdateFlow: false,
    // };
    // if (isEditMeeting === true) {
    let getMeetingData = {
      MeetingID: currentMeetingIDLS,
    };
    let Data = {
      MeetingID: currentMeetingIDLS,
    };
    dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
    dispatch(GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t));
    // }
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    // dispatch(CreateUpdateMeetingDataRoomMap(navigate, t, getFolderIDData));
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
        userProfilePicture,
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
    let isValid = true;
    let shouldResetFileForSend = true;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      // Check conditions for the parent objects
      if (row.title === "") {
        console.log(`Parent object title is missing at index ${rowIndex}`);
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `Title is missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      if (row.startDate === "") {
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `Start Date is missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      if (row.endDate === "") {
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `End Date is missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      if (row.presenterID === 0) {
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `Presenter is missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      if (row.selectedRadio === 1) {
        shouldResetFileForSend = false;
      }

      if (row.selectedRadio === 2 && row.urlFieldMain === "") {
        console.log(
          `Parent object urlMain should not be empty at index ${rowIndex}`
        );
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `URL is missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      if (
        row.selectedRadio === 3 &&
        (row.userID === 0 || row.mainNote === "")
      ) {
        // console.log(
        //   `Parent object userID should not be 0 and mainNote should not be empty at index ${rowIndex}`
        // );
        setTimeout(
          setOpen({
            ...open,
            flag: true,
            message: `UserID/Note missing in Agenda  ${rowIndex + 1} `,
          }),
          3000
        );
        isValid = false;
        break;
      }

      // Check conditions for subAgenda objects
      if (row.subAgenda && row.subAgenda.length > 0) {
        for (let subIndex = 0; subIndex < row.subAgenda.length; subIndex++) {
          const subAgendaItem = row.subAgenda[subIndex];

          if (subAgendaItem.subTitle === "") {
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `Title is missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break;
          }

          if (subAgendaItem.startDate === "") {
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `Start Date is missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break; // Stop processing if subAgenda startDate is missing
          }

          if (subAgendaItem.endDate === "") {
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `End Date is missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break; // Stop processing if subAgenda endDate is missing
          }

          if (subAgendaItem.presenterID === 0) {
            console.log(
              `SubAgenda presenterID is missing at index ${rowIndex}, subAgenda index ${subIndex}`
            );
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `Presenter is missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break; // Stop processing if subAgenda presenterID is missing
          }
          if (subAgendaItem.subSelectRadio === 1) {
            shouldResetFileForSend = false;
          }
          if (
            subAgendaItem.subSelectRadio === 2 &&
            subAgendaItem.subAgendaUrlFieldRadio === ""
          ) {
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `URL is missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break;
          }

          if (
            subAgendaItem.subSelectRadio === 3 &&
            (subAgendaItem.userID === 0 ||
              subAgendaItem.subAgendarequestContributorEnterNotes === "")
          ) {
            setTimeout(
              setOpen({
                ...open,
                flag: true,
                message: `UserID/Note missing in Agenda  ${rowIndex + 1}.${
                  subIndex + 1
                }`,
              }),
              3000
            );
            isValid = false;
            break;
          }
        }
      }
    }

    if (shouldResetFileForSend) {
      setFileForSend([]);
    }

    if (isValid) {
      // All conditions are met, apply your feature here
      console.log("All conditions met. Applying your feature...");
      let newFolder = [];
      console.log("fileForSendfileForSend", fileForSend);
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          UploadDocumentsAgendaApi(
            navigate,
            t,
            newData,
            folderDataRoomMeeting,
            newFolder
          )
        );
      });
      const convertedRows = convertDateFieldsToUTC(rows);

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      let cleanedData = removeProperties(convertedRows);

      let mappingObject = {};
      newFolder.forEach((folder) => {
        mappingObject[folder.displayAttachmentName] =
          folder.pK_FileID.toString();
      });

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
            let newAttachmentName =
              mappingObject[subFile.displayAttachmentName];
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

      let Data = {
        MeetingID: currentMeetingIDLS,
        AgendaList: updatedData,
      };

      let capitalizedData = capitalizeKeys(Data);
      dispatch(
        AddUpdateAdvanceMeetingAgenda(
          capitalizedData,
          navigate,
          t,
          currentMeetingIDLS
        )
      );
    } else {
      console.log("Some conditions not met. Feature not applied.");
    }
  };

  console.log(open, "openopenopen");

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !== null &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData !==
        undefined &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.length !==
        0 &&
      allSavedPresenters !== undefined &&
      allUsersRC !== undefined
    ) {
      let newData =
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList;
      setRows((prevRows) => {
        const updatedRows = newData.map((agendaItem) => {
          const { id, presenterID, userID, subAgenda, ...rest } = agendaItem;
          const matchingPresenter = allSavedPresenters.find(
            (presenter) => presenter.value === presenterID
          );
          const matchinguserID = allUsersRC.find(
            (rcuser) => rcuser.value === userID
          );
          const updatedSubAgenda = subAgenda
            ? subAgenda.map((subAgendaItem) => {
                const { subAgendaID, presenterID, userID, ...subAgendaRest } =
                  subAgendaItem;
                const matchingSubPresenter = allSavedPresenters.find(
                  (subPresenter) => subPresenter.value === presenterID
                );
                const matchingSubUserID = allUsersRC.find(
                  (subRcuser) => subRcuser.value === userID
                );
                return {
                  subAgendaID,
                  ...subAgendaRest,
                  presenterID, // Retain presenterID
                  userID,
                  subAgendarequestContributorUrlName: matchingSubUserID
                    ? matchingSubUserID.label
                    : "",
                  presenterName: matchingSubPresenter
                    ? matchingSubPresenter.label
                    : "",
                  startDate: subAgendaItem.startDate
                    ? convertUtcToGmt(subAgendaItem.startDate)
                    : null,
                  endDate: subAgendaItem.endDate
                    ? convertUtcToGmt(subAgendaItem.endDate)
                    : null,
                  subfiles: subAgendaItem.subfiles,
                };
              })
            : null;

          return {
            iD: id,
            ...rest,
            presenterID,
            presenterName: matchingPresenter ? matchingPresenter.label : "",
            userID,
            requestContributorURlName: matchinguserID
              ? matchinguserID.label
              : "",
            startDate: agendaItem.startDate
              ? convertUtcToGmt(agendaItem.startDate)
              : null,
            endDate: agendaItem.endDate
              ? convertUtcToGmt(agendaItem.endDate)
              : null,
            subAgenda: updatedSubAgenda,
          };
        });

        return updatedRows;
      });
    } else {
      setRows(rows);
    }
  }, [
    MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData,
    allSavedPresenters,
    allUsersRC,
  ]);

  console.log("allSavedPresenters", allSavedPresenters);
  console.log("allRCUSERS", allUsersRC);

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

  console.log("NewMeetingreducerNewMeetingreducer", NewMeetingreducer);
  console.log(
    "MeetingAgendaReducerMeetingAgendaReducer",
    MeetingAgendaReducer,
    DataRoomReducer
  );

  console.log("dataroomMapFolderIddataroomMapFolderId", folderDataRoomMeeting);

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
                                    allUsersRC={allUsersRC}
                                    setAllUsersRC={setAllUsersRC}
                                    index={index}
                                    allSavedPresenters={allSavedPresenters}
                                    setAllSavedPresenters={
                                      setAllSavedPresenters
                                    }
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
                                    setSelectedID={setSelectedID}
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
            {ediorRole.role === "Participant" ||
            ediorRole.role === "Agenda Contributor" ? null : (
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
                              alt=""
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
            )}
            <Row className="mt-4">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                {/* <Button
                  text={t("Import-previous-agenda")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handlePreviousAgenda}
                /> */}
                <Button
                  text={t("Cancel")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handleCancelClick}
                />
                {/* 
                <Button
                  text={t("Save-and-publish")}
                  className={styles["Agenda_Buttons"]}
                /> */}
                <Button
                  text={t("Previous")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handlePerviousAgenda}
                />
                <Button
                  text={t("Next")}
                  className={styles["Agenda_Buttons"]}
                  onClick={handleNextAgenda}
                />

                <Button
                  onClick={saveAgendaData}
                  text={t("Save")}
                  className={styles["Agenda_Buttons"]}
                />
                {Number(ediorRole.status) === 11 ||
                Number(ediorRole.status) === 12 ? (
                  <Button
                    disableBtn={Number(currentMeeting) === 0 ? true : false}
                    text={t("Publish")}
                    className={styles["Save_Agenda_btn"]}
                    onClick={handlePublishClick}
                  />
                ) : isEditMeeting === true ? null : (
                  <Button
                    disableBtn={Number(currentMeeting) === 0 ? true : false}
                    text={t("Publish")}
                    className={styles["Save_Agenda_btn"]}
                    onClick={handlePublishClick}
                  />
                )}

                {/* <Button
                  text={t("Publish")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handlePublishClick}
                /> */}
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
      {NewMeetingreducer.advancePermissionModal && (
        <AdvancePersmissionModal
          setSelectedID={setSelectedID}
          selectedID={selectedID}
        />
      )}
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
