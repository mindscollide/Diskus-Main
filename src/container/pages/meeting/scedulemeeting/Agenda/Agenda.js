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
import NextAgenda from "./NextAgenda/NextAgenda";
import PreviousAgenda from "./PreviousAgenda/PreviousAgenda";
import {
  previousTabAgenda,
  nextTabAgenda,
} from "../../../../../store/actions/MeetingAgenda_action";

const Agenda = ({
  setSceduleMeeting,
  currentMeeting,
  isEditMeeting,
  editorRole,
  setEdiorRole,
  dataroomMapFolderId,
  setMeetingMaterial,
  setAgenda,
  setParticipants,
  setPublishState,
  setAdvanceMeetingModalID,
  setViewFlag,
  setEditFlag,
  setCalendarViewModal,
  setDataroomMapFolderId,
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
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenters, setPresenters] = useState([]);
  const [savedViewAgenda, setsavedViewAgenda] = useState(false);

  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  const [agendaItemRemovedIndex, setAgendaItemRemovedIndex] = useState(0);
  const [mainAgendaRemovalIndex, setMainAgendaRemovalIndex] = useState(0);
  const [selectedID, setSelectedID] = useState(0);
  const [subajendaRemoval, setSubajendaRemoval] = useState(0);

  useEffect(() => {
    let getAllData = {
      MeetingID: currentMeetingIDLS !== null ? currentMeetingIDLS : 0,
    };
    let getMeetingData = {
      MeetingID: currentMeetingIDLS,
    };
    let Data = {
      MeetingID: currentMeetingIDLS,
    };
    dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
    dispatch(GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t));
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
  }, []);

  useEffect(() => {
    if (
      NewMeetingreducer.getMeetingusers !== undefined &&
      NewMeetingreducer.getMeetingusers !== null &&
      NewMeetingreducer.getMeetingusers.length !== 0
    ) {
      const newData = {
        meetingOrganizers: NewMeetingreducer.getMeetingusers.meetingOrganizers,
        meetingParticipants:
          NewMeetingreducer.getMeetingusers.meetingParticipants,
        meetingAgendaContributors:
          NewMeetingreducer.getMeetingusers.meetingAgendaContributors,
      };
      setAllPresenters(newData);
    }
  }, [NewMeetingreducer?.getMeetingusers]);

  useEffect(() => {
    if (allPresenters.lenth > 0 || Object.keys(allPresenters).length > 0) {
      const allPresentersReducer = [
        ...allPresenters.meetingOrganizers,
        ...allPresenters.meetingAgendaContributors,
        ...allPresenters.meetingParticipants,
      ];
      setPresenters(allPresentersReducer);
    }
  }, [allPresenters]);

  useEffect(() => {
    if (presenters.lenth > 0 || Object.keys(presenters).length > 0) {
      const mappedPresenters = presenters.map((presenter) => ({
        value: presenter.userID,
        label: (
          <>
            <Row>
              <Col lg={12} md={12} sm={12} className="d-flex gap-2">
                <img
                  alt=""
                  src={`data:image/jpeg;base64,${presenter.userProfilePicture.displayProfilePictureName}`}
                  width="17px"
                  height="17px"
                  className={styles["Image_class_Agenda"]}
                />
                <span className={styles["Name_Class"]}>
                  {presenter.userName}
                </span>
              </Col>
            </Row>
          </>
        ),
      }));
      setAllSavedPresenters((prevPresenters) => {
        if (
          JSON.stringify(prevPresenters) !== JSON.stringify(mappedPresenters)
        ) {
          return mappedPresenters;
        }
        return prevPresenters; // No change, return the current state
      });
    }
  }, [allPresenters]);

  console.log("allSavedPresenters", allSavedPresenters);

  const [rows, setRows] = useState([
    {
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      description: "",
      presenterID: allSavedPresenters[0]?.value,
      presenterName: allSavedPresenters[0]?.label,
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
          presenterID: allSavedPresenters[0]?.value,
          presenterName: allSavedPresenters[0]?.label,
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

  const [currentState, setCurrentState] = useState(rows);

  useEffect(() => {
    setRows({
      ...rows,
      iD: getRandomUniqueNumber().toString() + "A",
      title: "",
      agendaVotingID: 0,
      presenterID: allSavedPresenters[0]?.value,
      presenterName: allSavedPresenters[0]?.label,
      description: "",
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
          presenterID: allSavedPresenters[0]?.value,
          presenterName: allSavedPresenters[0]?.label,
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
      subAgenda: [],
    };
    updatedRows.push(newMainAgenda);
    setRows(updatedRows);
    console.log(updatedRows, "updatedRowsupdatedRows");
  };

  //SubAgenda Statemanagement

  const importPreviousAgenda = () => {
    dispatch(showImportPreviousAgendaModal(true));
  };

  const handleNextAgenda = () => {
    if (JSON.stringify(currentState) !== JSON.stringify(rows)) {
      dispatch(nextTabAgenda(true));
    } else {
      setMeetingMaterial(true);
      setAgenda(false);
    }
  };

  const handlePerviousAgenda = () => {
    if (JSON.stringify(currentState) !== JSON.stringify(rows)) {
      dispatch(previousTabAgenda(true));
    } else {
      setAgenda(false);
      setParticipants(true);
    }
  };

  const handleCancelClick = async () => {
    if (JSON.stringify(currentState) !== JSON.stringify(rows)) {
      dispatch(showCancelModalAgenda(true));
    } else {
      let searchData = {
        Date: "",
        Title: "",
        HostName: "",
        UserID: Number(userID),
        PageNumber:
          meetingPageCurrent !== null ? Number(meetingPageCurrent) : 1,
        Length: meetingpageRow !== null ? Number(meetingpageRow) : 50,
        PublishedMeetings:
          currentView && Number(currentView) === 1 ? true : false,
      };
      await dispatch(searchNewUserMeeting(navigate, searchData, t));
      setSceduleMeeting(false);
      localStorage.setItem("folderDataRoomMeeting", 0);
    }
  };

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
        contributor,
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

  const saveAgendaData = async (flag) => {
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

      setFileForSend([]);

      let Data = {
        MeetingID: currentMeetingIDLS,
        AgendaList: updatedData,
      };

      let capitalizedData = capitalizeKeys(Data);
      let publishMeetingData = { MeetingID: currentMeeting, StatusID: 1 };
      dispatch(
        AddUpdateAdvanceMeetingAgenda(
          capitalizedData,
          navigate,
          t,
          currentMeetingIDLS,
          flag,
          publishMeetingData,
          setEdiorRole,
          setAdvanceMeetingModalID,
          setDataroomMapFolderId,
          setSceduleMeeting,
          setPublishState,
          setCalendarViewModal
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
      setCurrentState((prevRows) => {
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
      setRows([
        {
          iD: getRandomUniqueNumber().toString() + "A",
          title: "",
          agendaVotingID: 0,
          presenterID: allSavedPresenters[0]?.value,
          presenterName: allSavedPresenters[0]?.label,
          description: "",
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
              presenterID: allSavedPresenters[0]?.value,
              presenterName: allSavedPresenters[0]?.label,
              description: "",
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
    }
  }, [
    MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData,
    allSavedPresenters,
    allUsersRC,
  ]);

  // useEffect(() => {
  //   if (
  //     MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== null &&
  //     MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== undefined &&
  //     MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.length !== 0
  //   ) {
  //     let newData =
  //       MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.agendaList;

  //     let areSubAgendasEmpty;

  //     let allRowsAndSubAgendasEmpty;

  //     let isAgendaEmpty;

  //     allRowsAndSubAgendasEmpty = rows.every((agendaItem) => {
  //       isAgendaEmpty =
  //         agendaItem.title === "" &&
  //         agendaItem.description === "" &&
  //         agendaItem.presenterID === 0 &&
  //         agendaItem.presenterName === "" &&
  //         agendaItem.startDate === "" &&
  //         agendaItem.endDate === "" &&
  //         agendaItem.urlFieldMain === "" &&
  //         agendaItem.mainNote === "" &&
  //         agendaItem.requestContributorURlName === "" &&
  //         agendaItem.files.length === 0 &&
  //         agendaItem.isLocked === false &&
  //         agendaItem.voteOwner === null &&
  //         agendaItem.isAttachment === false &&
  //         agendaItem.userID === 0 &&
  //         (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0);
  //       if (agendaItem.subAgenda.length > 0) {
  //         areSubAgendasEmpty =
  //           !agendaItem.subAgenda ||
  //           (agendaItem.subAgenda.length > 0 &&
  //             agendaItem.subAgenda.every((subAgendaItem) => {
  //               return (
  //                 subAgendaItem.subTitle === "" &&
  //                 subAgendaItem.description === "" &&
  //                 subAgendaItem.presenterID === 0 &&
  //                 subAgendaItem.presenterName === "" &&
  //                 subAgendaItem.startDate === "" &&
  //                 subAgendaItem.endDate === "" &&
  //                 subAgendaItem.subAgendarequestContributorUrlName === "" &&
  //                 subAgendaItem.subAgendarequestContributorEnterNotes === "" &&
  //                 subAgendaItem.subAgendaUrlFieldRadio === "" &&
  //                 subAgendaItem.subfiles.length === 0 &&
  //                 subAgendaItem.isLocked === false &&
  //                 subAgendaItem.voteOwner === null &&
  //                 subAgendaItem.isAttachment === false &&
  //                 subAgendaItem.userID === 0
  //               );
  //             }));
  //         if (areSubAgendasEmpty === true) {
  //           isAgendaEmpty = true;
  //         }
  //       } else {
  //         areSubAgendasEmpty = true;
  //       }

  //       console.log(
  //         "allRowsAndSubAgendasEmpty ",
  //         isAgendaEmpty,
  //         areSubAgendasEmpty
  //       );

  //       return isAgendaEmpty && areSubAgendasEmpty;
  //     });

  //     console.log("allRowsAndSubAgendasEmpty", allRowsAndSubAgendasEmpty);

  //     setRows((prevRows) => {
  //       const updatedRows = newData.map((agendaItem) => {
  //         const {
  //           id,
  //           title,
  //           agendaVotingID,
  //           presenterID,
  //           description,
  //           presenterName,
  //           startDate,
  //           endDate,
  //           selectedRadio,
  //           urlFieldMain,
  //           mainNote,
  //           requestContributorURlName,
  //           files,
  //           isLocked,
  //           voteOwner,
  //           isAttachment,
  //           userID,
  //           subAgenda,
  //           ...rest
  //         } = agendaItem;
  //         const updatedSubAgenda = subAgenda
  //           ? subAgenda.map((subAgendaItem) => {
  //               const {
  //                 subAgendaID,
  //                 agendaVotingID,
  //                 subTitle,
  //                 description,
  //                 presenterID,
  //                 presenterName,
  //                 startDate,
  //                 endDate,
  //                 subSelectRadio,
  //                 subAgendaUrlFieldRadio,
  //                 subAgendarequestContributorUrlName,
  //                 subAgendarequestContributorEnterNotes,
  //                 subfiles,
  //                 isLocked,
  //                 voteOwner,
  //                 isAttachment,
  //                 userID,
  //                 ...subAgendaRest
  //               } = subAgendaItem;
  //               return {
  //                 ...subAgendaRest,
  //                 subAgendaID,
  //                 agendaVotingID: 0,
  //                 subTitle,
  //                 description,
  //                 presenterID: 0,
  //                 presenterName: "",
  //                 startDate: subAgendaItem.startDate
  //                   ? convertUtcToGmt(subAgendaItem.startDate)
  //                   : null,
  //                 endDate: subAgendaItem.endDate
  //                   ? convertUtcToGmt(subAgendaItem.endDate)
  //                   : null,
  //                 subSelectRadio: 1,
  //                 subAgendaUrlFieldRadio: "",
  //                 subAgendarequestContributorUrlName: "",
  //                 subAgendarequestContributorEnterNotes: "",
  //                 subfiles: [],
  //                 isLocked,
  //                 voteOwner: null,
  //                 isAttachment: false,
  //                 userID: 0,
  //               };
  //             })
  //           : null;

  //         return {
  //           ...rest,
  //           iD: id,
  //           title,
  //           agendaVotingID: 0,
  //           presenterID: 0,
  //           description,
  //           presenterName: "",
  //           startDate: agendaItem.startDate
  //             ? convertUtcToGmt(agendaItem.startDate)
  //             : null,
  //           endDate: agendaItem.endDate
  //             ? convertUtcToGmt(agendaItem.endDate)
  //             : null,
  //           selectedRadio: 1,
  //           urlFieldMain: "",
  //           mainNote: "",
  //           requestContributorURlName: "",
  //           files: [],
  //           isLocked: false,
  //           voteOwner: null,
  //           isAttachment: false,
  //           userID: 0,
  //           subAgenda: updatedSubAgenda,
  //         };
  //       });
  //       return allRowsAndSubAgendasEmpty
  //         ? updatedRows
  //         : [...prevRows, ...updatedRows];
  //     });
  //     setCurrentState((prevRows) => {
  //       const updatedRows = newData.map((agendaItem) => {
  //         const {
  //           id,
  //           title,
  //           agendaVotingID,
  //           presenterID,
  //           description,
  //           presenterName,
  //           startDate,
  //           endDate,
  //           selectedRadio,
  //           urlFieldMain,
  //           mainNote,
  //           requestContributorURlName,
  //           files,
  //           isLocked,
  //           voteOwner,
  //           isAttachment,
  //           userID,
  //           subAgenda,
  //           ...rest
  //         } = agendaItem;
  //         const updatedSubAgenda = subAgenda
  //           ? subAgenda.map((subAgendaItem) => {
  //               const {
  //                 subAgendaID,
  //                 agendaVotingID,
  //                 subTitle,
  //                 description,
  //                 presenterID,
  //                 presenterName,
  //                 startDate,
  //                 endDate,
  //                 subSelectRadio,
  //                 subAgendaUrlFieldRadio,
  //                 subAgendarequestContributorUrlName,
  //                 subAgendarequestContributorEnterNotes,
  //                 subfiles,
  //                 isLocked,
  //                 voteOwner,
  //                 isAttachment,
  //                 userID,
  //                 ...subAgendaRest
  //               } = subAgendaItem;
  //               return {
  //                 ...subAgendaRest,
  //                 subAgendaID,
  //                 agendaVotingID: 0,
  //                 subTitle,
  //                 description,
  //                 presenterID: 0,
  //                 presenterName: "",
  //                 startDate: subAgendaItem.startDate
  //                   ? convertUtcToGmt(subAgendaItem.startDate)
  //                   : null,
  //                 endDate: subAgendaItem.endDate
  //                   ? convertUtcToGmt(subAgendaItem.endDate)
  //                   : null,
  //                 subSelectRadio: 1,
  //                 subAgendaUrlFieldRadio: "",
  //                 subAgendarequestContributorUrlName: "",
  //                 subAgendarequestContributorEnterNotes: "",
  //                 subfiles: [],
  //                 isLocked,
  //                 voteOwner: null,
  //                 isAttachment: false,
  //                 userID: 0,
  //               };
  //             })
  //           : null;

  //         return {
  //           ...rest,
  //           iD: id,
  //           title,
  //           agendaVotingID: 0,
  //           presenterID: 0,
  //           description,
  //           presenterName: "",
  //           startDate: agendaItem.startDate
  //             ? convertUtcToGmt(agendaItem.startDate)
  //             : null,
  //           endDate: agendaItem.endDate
  //             ? convertUtcToGmt(agendaItem.endDate)
  //             : null,
  //           selectedRadio: 1,
  //           urlFieldMain: "",
  //           mainNote: "",
  //           requestContributorURlName: "",
  //           files: [],
  //           isLocked: false,
  //           voteOwner: null,
  //           isAttachment: false,
  //           userID: 0,
  //           subAgenda: updatedSubAgenda,
  //         };
  //       });

  //       // If all rows and sub-agendas are empty, replace the entire state; otherwise, push new data
  //       return allRowsAndSubAgendasEmpty
  //         ? updatedRows
  //         : [...prevRows, ...updatedRows];
  //     });
  //   } else {
  //     // Your existing logic for handling other cases
  //     setRows([
  //       {
  //         iD: getRandomUniqueNumber().toString() + "A",
  //         title: "",
  //         agendaVotingID: 0,
  //         presenterID: 0,
  //         description: "",
  //         presenterName: "",
  //         startDate: "",
  //         endDate: "",
  //         selectedRadio: 1,
  //         urlFieldMain: "",
  //         mainNote: "",
  //         requestContributorURlName: "",
  //         files: [],
  //         isLocked: false,
  //         voteOwner: null,
  //         isAttachment: false,
  //         userID: 0,
  //         subAgenda: [
  //           {
  //             subAgendaID: getRandomUniqueNumber().toString() + "A",
  //             agendaVotingID: 0,
  //             subTitle: "",
  //             description: "",
  //             presenterID: 0,
  //             presenterName: "",
  //             startDate: "",
  //             endDate: "",
  //             subSelectRadio: 1,
  //             subAgendaUrlFieldRadio: "",
  //             subAgendarequestContributorUrlName: "",
  //             subAgendarequestContributorEnterNotes: "",
  //             subfiles: [],
  //             isLocked: false,
  //             voteOwner: null,
  //             isAttachment: false,
  //             userID: 0,
  //           },
  //         ],
  //       },
  //     ]);
  //   }
  // }, [MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== null &&
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== undefined &&
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.length !== 0
    ) {
      let newData =
        MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.agendaList;

      setRows((prevRows) => {
        const updatedRows = newData.map((agendaItem) => {
          const {
            id,
            title,
            agendaVotingID,
            presenterID,
            description,
            presenterName,
            startDate,
            endDate,
            selectedRadio,
            urlFieldMain,
            mainNote,
            requestContributorURlName,
            files,
            isLocked,
            voteOwner,
            isAttachment,
            userID,
            subAgenda,
            ...rest
          } = agendaItem;
          const updatedSubAgenda = subAgenda
            ? subAgenda.map((subAgendaItem) => {
                const {
                  subAgendaID,
                  agendaVotingID,
                  subTitle,
                  description,
                  presenterID,
                  presenterName,
                  startDate,
                  endDate,
                  subSelectRadio,
                  subAgendaUrlFieldRadio,
                  subAgendarequestContributorUrlName,
                  subAgendarequestContributorEnterNotes,
                  subfiles,
                  isLocked,
                  voteOwner,
                  isAttachment,
                  userID,
                  ...subAgendaRest
                } = subAgendaItem;
                return {
                  ...subAgendaRest,
                  subAgendaID,
                  agendaVotingID: 0,
                  subTitle,
                  description,
                  presenterID: 0,
                  presenterName: "",
                  startDate: subAgendaItem.startDate
                    ? convertUtcToGmt(subAgendaItem.startDate)
                    : null,
                  endDate: subAgendaItem.endDate
                    ? convertUtcToGmt(subAgendaItem.endDate)
                    : null,
                  subSelectRadio: 1,
                  subAgendaUrlFieldRadio: "",
                  subAgendarequestContributorUrlName: "",
                  subAgendarequestContributorEnterNotes: "",
                  subfiles: [],
                  isLocked,
                  voteOwner: null,
                  isAttachment: false,
                  userID: 0,
                };
              })
            : null;

          return {
            ...rest,
            iD: id,
            title,
            agendaVotingID: 0,
            presenterID: 0,
            description,
            presenterName: "",
            startDate: agendaItem.startDate
              ? convertUtcToGmt(agendaItem.startDate)
              : null,
            endDate: agendaItem.endDate
              ? convertUtcToGmt(agendaItem.endDate)
              : null,
            selectedRadio: 1,
            urlFieldMain: "",
            mainNote: "",
            requestContributorURlName: "",
            files: [],
            isLocked: false,
            voteOwner: null,
            isAttachment: false,
            userID: 0,
            subAgenda: updatedSubAgenda,
          };
        });

        let isAgendaEmpty;
        let isAgendaEmptyCR;
        let areSubAgendasEmpty;
        let areSubAgendasEmptyCR;

        const nonEmptyRows = updatedRows.filter((agendaItem) => {
          isAgendaEmpty =
            agendaItem.title === "" &&
            agendaItem.description === "" &&
            // agendaItem.presenterID === 0 &&
            // agendaItem.presenterName === "" &&
            agendaItem.startDate === "" &&
            agendaItem.endDate === "" &&
            agendaItem.urlFieldMain === "" &&
            agendaItem.mainNote === "" &&
            agendaItem.requestContributorURlName === "" &&
            agendaItem.files.length === 0 &&
            agendaItem.isLocked === false &&
            agendaItem.voteOwner === null &&
            agendaItem.isAttachment === false &&
            agendaItem.userID === 0 &&
            (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0);
          areSubAgendasEmpty = true;
          console.log("result isAgendaEmpty", isAgendaEmpty);
          if (agendaItem.subAgenda.length > 0 && isAgendaEmpty === false) {
            areSubAgendasEmpty =
              !agendaItem.subAgenda ||
              agendaItem.subAgenda.length === 0 ||
              agendaItem.subAgenda.every((subAgendaItem) => {
                return (
                  subAgendaItem.subTitle === "" &&
                  subAgendaItem.description === "" &&
                  // subAgendaItem.presenterID === 0 &&
                  // subAgendaItem.presenterName === "" &&
                  subAgendaItem.startDate === "" &&
                  subAgendaItem.endDate === "" &&
                  subAgendaItem.subAgendarequestContributorUrlName === "" &&
                  subAgendaItem.subAgendarequestContributorEnterNotes === "" &&
                  subAgendaItem.subAgendaUrlFieldRadio === "" &&
                  subAgendaItem.subfiles.length === 0 &&
                  subAgendaItem.isLocked === false &&
                  subAgendaItem.voteOwner === null &&
                  subAgendaItem.isAttachment === false &&
                  subAgendaItem.userID === 0
                );
              });
            if (areSubAgendasEmpty === true) {
              isAgendaEmpty = true;
            } else {
              isAgendaEmpty = false;
            }
            console.log("result isAgendaEmpty", isAgendaEmpty);
          } else {
            areSubAgendasEmpty = true;
          }
          console.log(
            "result agenda empty non empty",
            isAgendaEmpty,
            areSubAgendasEmpty
          );
          // Include only non-empty items
          return !(isAgendaEmpty && areSubAgendasEmpty);
        });

        // Filter out empty rows from the current state
        const nonEmptyCurrentRows = prevRows.filter((agendaItem) => {
          isAgendaEmptyCR =
            agendaItem.title === "" &&
            agendaItem.description === "" &&
            // agendaItem.presenterID === 0 &&
            // agendaItem.presenterName === "" &&
            agendaItem.startDate === "" &&
            agendaItem.endDate === "" &&
            agendaItem.urlFieldMain === "" &&
            agendaItem.mainNote === "" &&
            agendaItem.requestContributorURlName === "" &&
            agendaItem.files.length === 0 &&
            agendaItem.isLocked === false &&
            agendaItem.voteOwner === null &&
            agendaItem.isAttachment === false &&
            agendaItem.userID === 0 &&
            (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0);
          areSubAgendasEmptyCR = true;
          if (agendaItem.subAgenda.length > 0 && isAgendaEmptyCR === false) {
            areSubAgendasEmptyCR =
              !agendaItem.subAgenda ||
              agendaItem.subAgenda.length === 0 ||
              agendaItem.subAgenda.every((subAgendaItem) => {
                return (
                  subAgendaItem.subTitle === "" &&
                  subAgendaItem.description === "" &&
                  // subAgendaItem.presenterID === 0 &&
                  // subAgendaItem.presenterName === "" &&
                  subAgendaItem.startDate === "" &&
                  subAgendaItem.endDate === "" &&
                  subAgendaItem.subAgendarequestContributorUrlName === "" &&
                  subAgendaItem.subAgendarequestContributorEnterNotes === "" &&
                  subAgendaItem.subAgendaUrlFieldRadio === "" &&
                  subAgendaItem.subfiles.length === 0 &&
                  subAgendaItem.isLocked === false &&
                  subAgendaItem.voteOwner === null &&
                  subAgendaItem.isAttachment === false &&
                  subAgendaItem.userID === 0
                );
              });
            if (areSubAgendasEmptyCR === true) {
              isAgendaEmptyCR = true;
            } else {
              isAgendaEmptyCR = false;
            }
            console.log("result isAgendaEmptyCR", isAgendaEmptyCR);
          } else {
            areSubAgendasEmptyCR = true;
          }
          console.log(
            "result agenda empty non empty",
            isAgendaEmptyCR,
            areSubAgendasEmptyCR
          );

          // Include only non-empty items
          return !(isAgendaEmptyCR && areSubAgendasEmptyCR);
        });

        console.log("result nonEmptyRows", nonEmptyRows);

        console.log("result nonEmptyCurrentRows", nonEmptyCurrentRows);

        return [...nonEmptyCurrentRows, ...nonEmptyRows];
      });
      setCurrentState((prevRows) => {
        const updatedRows = newData.map((agendaItem) => {
          const {
            id,
            title,
            agendaVotingID,
            presenterID,
            description,
            presenterName,
            startDate,
            endDate,
            selectedRadio,
            urlFieldMain,
            mainNote,
            requestContributorURlName,
            files,
            isLocked,
            voteOwner,
            isAttachment,
            userID,
            subAgenda,
            ...rest
          } = agendaItem;
          const updatedSubAgenda = subAgenda
            ? subAgenda.map((subAgendaItem) => {
                const {
                  subAgendaID,
                  agendaVotingID,
                  subTitle,
                  description,
                  presenterID,
                  presenterName,
                  startDate,
                  endDate,
                  subSelectRadio,
                  subAgendaUrlFieldRadio,
                  subAgendarequestContributorUrlName,
                  subAgendarequestContributorEnterNotes,
                  subfiles,
                  isLocked,
                  voteOwner,
                  isAttachment,
                  userID,
                  ...subAgendaRest
                } = subAgendaItem;
                return {
                  ...subAgendaRest,
                  subAgendaID,
                  agendaVotingID: 0,
                  subTitle,
                  description,
                  presenterID: 0,
                  presenterName: "",
                  startDate: subAgendaItem.startDate
                    ? convertUtcToGmt(subAgendaItem.startDate)
                    : null,
                  endDate: subAgendaItem.endDate
                    ? convertUtcToGmt(subAgendaItem.endDate)
                    : null,
                  subSelectRadio: 1,
                  subAgendaUrlFieldRadio: "",
                  subAgendarequestContributorUrlName: "",
                  subAgendarequestContributorEnterNotes: "",
                  subfiles: [],
                  isLocked,
                  voteOwner: null,
                  isAttachment: false,
                  userID: 0,
                };
              })
            : null;

          return {
            ...rest,
            iD: id,
            title,
            agendaVotingID: 0,
            presenterID: 0,
            description,
            presenterName: "",
            startDate: agendaItem.startDate
              ? convertUtcToGmt(agendaItem.startDate)
              : null,
            endDate: agendaItem.endDate
              ? convertUtcToGmt(agendaItem.endDate)
              : null,
            selectedRadio: 1,
            urlFieldMain: "",
            mainNote: "",
            requestContributorURlName: "",
            files: [],
            isLocked: false,
            voteOwner: null,
            isAttachment: false,
            userID: 0,
            subAgenda: updatedSubAgenda,
          };
        });

        let isAgendaEmpty;
        let isAgendaEmptyCR;
        let areSubAgendasEmpty;
        let areSubAgendasEmptyCR;

        const nonEmptyRows = updatedRows.filter((agendaItem) => {
          isAgendaEmpty =
            agendaItem.title === "" &&
            agendaItem.description === "" &&
            // agendaItem.presenterID === 0 &&
            // agendaItem.presenterName === "" &&
            agendaItem.startDate === "" &&
            agendaItem.endDate === "" &&
            agendaItem.urlFieldMain === "" &&
            agendaItem.mainNote === "" &&
            agendaItem.requestContributorURlName === "" &&
            agendaItem.files.length === 0 &&
            agendaItem.isLocked === false &&
            agendaItem.voteOwner === null &&
            agendaItem.isAttachment === false &&
            agendaItem.userID === 0 &&
            (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0);
          areSubAgendasEmpty = true;
          console.log("result isAgendaEmpty", isAgendaEmpty);
          if (agendaItem.subAgenda.length > 0 && isAgendaEmpty === false) {
            areSubAgendasEmpty =
              !agendaItem.subAgenda ||
              agendaItem.subAgenda.length === 0 ||
              agendaItem.subAgenda.every((subAgendaItem) => {
                return (
                  subAgendaItem.subTitle === "" &&
                  subAgendaItem.description === "" &&
                  // subAgendaItem.presenterID === 0 &&
                  // subAgendaItem.presenterName === "" &&
                  subAgendaItem.startDate === "" &&
                  subAgendaItem.endDate === "" &&
                  subAgendaItem.subAgendarequestContributorUrlName === "" &&
                  subAgendaItem.subAgendarequestContributorEnterNotes === "" &&
                  subAgendaItem.subAgendaUrlFieldRadio === "" &&
                  subAgendaItem.subfiles.length === 0 &&
                  subAgendaItem.isLocked === false &&
                  subAgendaItem.voteOwner === null &&
                  subAgendaItem.isAttachment === false &&
                  subAgendaItem.userID === 0
                );
              });
            if (areSubAgendasEmpty === true) {
              isAgendaEmpty = true;
            } else {
              isAgendaEmpty = false;
            }
            console.log("result isAgendaEmpty", isAgendaEmpty);
          } else {
            areSubAgendasEmpty = true;
          }
          console.log(
            "result agenda empty non empty",
            isAgendaEmpty,
            areSubAgendasEmpty
          );
          // Include only non-empty items
          return !(isAgendaEmpty && areSubAgendasEmpty);
        });

        // Filter out empty rows from the current state
        const nonEmptyCurrentRows = prevRows.filter((agendaItem) => {
          isAgendaEmptyCR =
            agendaItem.title === "" &&
            agendaItem.description === "" &&
            // agendaItem.presenterID === 0 &&
            // agendaItem.presenterName === "" &&
            agendaItem.startDate === "" &&
            agendaItem.endDate === "" &&
            agendaItem.urlFieldMain === "" &&
            agendaItem.mainNote === "" &&
            agendaItem.requestContributorURlName === "" &&
            agendaItem.files.length === 0 &&
            agendaItem.isLocked === false &&
            agendaItem.voteOwner === null &&
            agendaItem.isAttachment === false &&
            agendaItem.userID === 0 &&
            (!agendaItem.subAgenda || agendaItem.subAgenda.length === 0);
          areSubAgendasEmptyCR = true;
          if (agendaItem.subAgenda.length > 0 && isAgendaEmptyCR === false) {
            areSubAgendasEmptyCR =
              !agendaItem.subAgenda ||
              agendaItem.subAgenda.length === 0 ||
              agendaItem.subAgenda.every((subAgendaItem) => {
                return (
                  subAgendaItem.subTitle === "" &&
                  subAgendaItem.description === "" &&
                  // subAgendaItem.presenterID === 0 &&
                  // subAgendaItem.presenterName === "" &&
                  subAgendaItem.startDate === "" &&
                  subAgendaItem.endDate === "" &&
                  subAgendaItem.subAgendarequestContributorUrlName === "" &&
                  subAgendaItem.subAgendarequestContributorEnterNotes === "" &&
                  subAgendaItem.subAgendaUrlFieldRadio === "" &&
                  subAgendaItem.subfiles.length === 0 &&
                  subAgendaItem.isLocked === false &&
                  subAgendaItem.voteOwner === null &&
                  subAgendaItem.isAttachment === false &&
                  subAgendaItem.userID === 0
                );
              });
            if (areSubAgendasEmptyCR === true) {
              isAgendaEmptyCR = true;
            } else {
              isAgendaEmptyCR = false;
            }
            console.log("result isAgendaEmptyCR", isAgendaEmptyCR);
          } else {
            areSubAgendasEmptyCR = true;
          }
          console.log(
            "result agenda empty non empty",
            isAgendaEmptyCR,
            areSubAgendasEmptyCR
          );

          // Include only non-empty items
          return !(isAgendaEmptyCR && areSubAgendasEmptyCR);
        });

        console.log("result nonEmptyRows", nonEmptyRows);

        console.log("result nonEmptyCurrentRows", nonEmptyCurrentRows);

        return [...nonEmptyCurrentRows, ...nonEmptyRows];
      });
    } else {
      // Your existing logic for handling other cases
      setRows(rows);
    }
  }, [MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData]);

  // useEffect(() => {
  //   console.log("State changed:", currentState);

  //   if (JSON.stringify(currentState) !== JSON.stringify(rows)) {
  //     console.log("Rows have changed");
  //   } else {
  //     console.log("Rows Have Not Changed");
  //   }
  // }, [currentState, rows]);

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
    } else if (
      MeetingAgendaReducer.ResponseMessage ===
      t("Agendas-imported-successfully")
    ) {
      setTimeout(
        setOpen({
          ...open,
          flag: true,
          message: t("Agendas-imported-successfully"),
        }),
        3000
      );
    } else if (MeetingAgendaReducer.ResponseMessage === t("No-agendas-exist")) {
      setTimeout(
        setOpen({
          ...open,
          flag: true,
          message: t("No-agendas-exist"),
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
                                    editorRole={editorRole}
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
            {editorRole.role === "Participant" ||
            editorRole.role === "Agenda Contributor" ? null : (
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
                <Button
                  text={t("Import-previous-agenda")}
                  className={styles["Agenda_Buttons"]}
                  onClick={importPreviousAgenda}
                />
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
                  className={styles["Save_Agenda_btn"]}
                  onClick={handlePerviousAgenda}
                />
                <Button
                  text={t("Next")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handleNextAgenda}
                />

                <Button
                  onClick={() => saveAgendaData(1)}
                  text={t("Save")}
                  className={styles["Save_Agenda_btn"]}
                />
                {Number(editorRole.status) === 11 ||
                Number(editorRole.status) === 12 ? (
                  <Button
                    disableBtn={Number(currentMeeting) === 0 ? true : false}
                    text={t("Publish")}
                    className={styles["Save_Agenda_btn"]}
                    onClick={() => saveAgendaData(2)}
                  />
                ) : isEditMeeting === true ? null : (
                  <Button
                    disableBtn={Number(currentMeeting) === 0 ? true : false}
                    text={t("Publish")}
                    className={styles["Save_Agenda_btn"]}
                    onClick={() => saveAgendaData(2)}
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
      {MeetingAgendaReducer.PreviousTabAgenda && (
        <PreviousAgenda
          setAgenda={setAgenda}
          setParticipants={setParticipants}
        />
      )}
      {MeetingAgendaReducer.NextTabAgenda && (
        <NextAgenda
          setMeetingMaterial={setMeetingMaterial}
          setAgenda={setAgenda}
        />
      )}

      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default Agenda;
