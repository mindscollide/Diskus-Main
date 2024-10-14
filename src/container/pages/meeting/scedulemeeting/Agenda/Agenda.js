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
import emptyContributorState from "../../../../../assets/images/Empty_Agenda_Meeting_view.svg";
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
  SaveFilesAgendaApi,
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
  const [isPublishedState, setIsPublishedState] = useState(false);
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
    dispatch(GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t));
    dispatch(getAllAgendaContributorApi(navigate, t, getAllData));
    dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
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
  }, [allPresenters, allSavedPresenters]);

  useEffect(() => {
    if (presenters.length > 0 || Object.keys(presenters).length > 0) {
      const mappedPresenters = presenters.map((presenter) => ({
        value: presenter.userID,
        name: presenter.userName,
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
  }, [allPresenters, allSavedPresenters]);

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
      subAgenda: [],
      canView: true,
      canEdit: true,
    },
  ]);

  const [emptyStateRows, setEmptyStateRows] = useState(false);

  const [currentState, setCurrentState] = useState(rows);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData ===
        undefined ||
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData === null ||
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.length ===
        0 ||
      Object.keys(MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData)
        .length === 0
    ) {
      console.log("updated Rows ROWS ROWS");
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
        subAgenda: [],
        canView: true,
        canEdit: true,
      });
    }
  }, []);

  //Function For Adding Main Agendas
  const addRow = () => {
    const updatedRows = [...rows];
    const nextID = updatedRows.length.toString();

    const newMainAgenda = {
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
      subAgenda: [],
      canEdit: false,
      canView: false,
    };
    updatedRows.push(newMainAgenda);
    console.log("updated Rows", updatedRows);
    setRows(updatedRows);
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

  // const [newFile, setNewFile] = useState([]);

  const updateSave = async (flag) => {
    // Upload documents

    let newFolder = [];
    let newfile = [];

    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        console.log("newDatanewData", newData);
        await dispatch(
          UploadDocumentsAgendaApi(
            navigate,
            t,
            newData,
            folderDataRoomMeeting,
            newFolder,
            newfile
          )
        );
      });
      console.log("uploadPromisesuploadPromises", uploadPromises);
      // Wait for all promises to resolve
      await Promise.all(uploadPromises); //till here the files get upload
      await dispatch(
        SaveFilesAgendaApi(
          navigate,
          t,
          newfile,
          folderDataRoomMeeting,
          newFolder
        )
      );
    }
    // await Promise.all(
    //   fileForSend.map(async (newData) => {
    //     console.log("newDatanewData", newData);
    //     try {
    //       const result = await dispatch(
    //         UploadDocumentsAgendaApi(
    //           navigate,
    //           t,
    //           newData,
    //           folderDataRoomMeeting,
    //           newFolder
    //         )
    //       );
    //       if (result && result.success) {
    //         newfile = [...newfile, result.dummyData];
    //         // setNewFile((prevState) => [...prevState, result.dummyData]);
    //         console.log("newfilenewfile", newfile);
    //         console.log("newfoldernewfolder", newFolder);
    //       }
    //       console.log("resultresult", result);
    //     } catch (error) {
    //       console.error(error);
    //     }
    //   })
    // );

    // Convert date fields to UTC
    const convertedRows = convertDateFieldsToUTC(rows);
    console.log("newfile", newfile);

    // // Save files
    // await dispatch(
    //   SaveFilesAgendaApi(navigate, t, newfile, folderDataRoomMeeting, newFolder)
    // );

    // Process data and update properties
    let cleanedData = removeProperties(convertedRows);
    console.log(
      { newFolder, cleanedData },
      "newFoldernewFoldernewFoldernewFolder"
    );
    let mappingObject = {};
    newFolder.forEach((folder) => {
      mappingObject[folder.displayAttachmentName] = folder.pK_FileID.toString();
    });

    let updatedData = cleanedData.map((item) => ({
      ...item,
      files: item.files.map((file) => ({
        ...file,
        originalAttachmentName:
          mappingObject[file.displayAttachmentName] ||
          file.originalAttachmentName,
      })),
      subAgenda: item.subAgenda.map((subAgenda) => ({
        ...subAgenda,
        subfiles: subAgenda.subfiles.map((subFile) => ({
          ...subFile,
          originalAttachmentName:
            mappingObject[subFile.displayAttachmentName] ||
            subFile.originalAttachmentName,
        })),
      })),
    }));
    console.log(
      { newFolder, cleanedData, mappingObject, updatedData },
      "newFoldernewFoldernewFoldernewFolder"
    );
    // Clear fileForSend array
    setFileForSend([]);

    // Construct data object
    let Data = {
      MeetingID: currentMeetingIDLS,
      AgendaList: updatedData,
    };

    // Capitalize keys in the data object
    let capitalizedData = capitalizeKeys(Data);

    // Dispatch API call to update meeting agenda
    let publishMeetingData = { MeetingID: currentMeeting, StatusID: 1 };
    await dispatch(
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
        setCalendarViewModal,
        setMeetingMaterial,
        setAgenda
      )
    );
  };
  const saveAgendaData = async (flag) => {
    let isValid = true;
    let shouldResetFileForSend = true;

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      const row = rows[rowIndex];

      // Check conditions for the parent objects
      if (row.title === "") {
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
            message: `Start Time is missing in Agenda  ${rowIndex + 1} `,
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
            message: `End Time is missing in Agenda  ${rowIndex + 1} `,
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
      updateSave(flag);
    }
  };

  console.log("fileForSendAgendafileForSendAgenda", fileForSend);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData === null ||
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData ===
        undefined ||
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.length ===
        0 ||
      Object.keys(MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData)
        .length === 0
    ) {
      let updatedRows = [...rows];
      if (rows.length === 1) {
        updatedRows[0].presenterID = allSavedPresenters[0]?.value;
        updatedRows[0].presenterName = allSavedPresenters[0]?.label;
        setRows(updatedRows);
        console.log("updated Rows ROWS ROWS");
      }
    }
  }, [allSavedPresenters, allUsersRC]);

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
      let isPublishedAgenda =
        MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.isPublished;
      setIsPublishedState(isPublishedAgenda);
      setRows((prevRows) => {
        const updatedRows = newData.map((agendaItem) => {
          const { id, presenterID, userID, subAgenda, files, ...rest } =
            agendaItem;
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
                  subfiles: subAgendaItem.subfiles
                    ? [...subAgendaItem.subfiles]
                    : [],
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
            files: agendaItem.files ? [...agendaItem.files] : [],
          };
        });

        return updatedRows;
      });
      setCurrentState((prevRows) => {
        const updatedRows = newData.map((agendaItem) => {
          const { id, presenterID, userID, subAgenda, files, ...rest } =
            agendaItem;
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
                  subfiles: subAgendaItem.subfiles
                    ? [...subAgendaItem.subfiles]
                    : [],
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
            files: agendaItem.files ? [...agendaItem.files] : [],
            subAgenda: updatedSubAgenda,
          };
        });

        return updatedRows;
      });
    } else {
      console.log("updated Rows ROWS ROWS");
      setRows(rows);
    }
  }, [
    MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData,
    // allSavedPresenters,
    // allUsersRC,
  ]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== null &&
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData !== undefined &&
      MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.length !== 0
    ) {
      let newData =
        MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData.agendaList;

      console.log("updated Rows ROWS ROWS");
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

        return [...nonEmptyCurrentRows, ...nonEmptyRows];
      });
    } else {
      // Your existing logic for handling other cases
      console.log("updated Rows ROWS ROWS");
      setRows(rows);
    }
  }, [MeetingAgendaReducer.GetAgendaWithMeetingIDForImportData]);

  useEffect(() => {
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
    } else if (MeetingAgendaReducer.ResponseMessage === t("Voting-saved")) {
      setTimeout(
        setOpen({
          flag: true,
          message: t("Agenda-voting-details-saved-successfully"),
        }),
        3000
      );
    } else if (MeetingAgendaReducer.ResponseMessage === t("Voting-updated")) {
      setTimeout(
        setOpen({
          flag: true,
          message: t("Agenda-voting-details-updated-successfully"),
        }),
        3000
      );
    }
    dispatch(clearResponseMessage(""));
  }, [MeetingAgendaReducer.ResponseMessage]);

  useEffect(() => {
    if (
      MeetingAgendaReducer.MeetingAgendaUpdatedMqtt !== undefined &&
      MeetingAgendaReducer.MeetingAgendaUpdatedMqtt !== null
    ) {
      if (
        currentMeetingIDLS ===
        MeetingAgendaReducer.MeetingAgendaUpdatedMqtt.meetingID
      ) {
        let getMeetingData = {
          MeetingID: currentMeetingIDLS,
        };
        dispatch(
          GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t)
        );
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
  }, [rows.length]);

  console.log("MeetingAgendaReducer", MeetingAgendaReducer);

  console.log("Agenda Data", rows);

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
          {/* <Row className="m-0">
            <Col className="p-0">
              {editorRole.status === "9" ||
              editorRole.status === 9 ||
              editorRole.role === "Agenda Contributor" ? null : (
                <Button
                  text={t("Import-previous-agenda")}
                  className={styles["Import_Agenda_Buttons"]}
                  onClick={importPreviousAgenda}
                />
              )}
            </Col>
          </Row> */}
          <section>
            {editorRole.role === "Agenda Contributor" &&
            rows[0].title === "" ? null : (
              <DragDropContext
                onDragEnd={(result) => onDragEnd(result, rows, setRows)}
              >
                {emptyStateRows === true &&
                (editorRole.role === "Agenda Contributor" ||
                  editorRole.role === "Participant") ? null : (
                  <Row>
                    <Col
                      lg={12}
                      md={12}
                      sm={12}
                      className={
                        rows.length > 1
                          ? `${styles["Scroller_Agenda"]} d-flex flex-column-reverse`
                          : styles["Scroller_Agenda"]
                      }
                    >
                      <Droppable
                        //  key={`main-agenda-${rows.id}`}
                        //  droppableId={`main-agenda-${rows.id}`}
                        droppableId="board"
                        type="PARENT"
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                          >
                            {rows.length > 0
                              ? rows.map((data, index) => {
                                  return (
                                    <>
                                      <div
                                        // className={styles["agenda-border-class"]}
                                        className={
                                          data.canView === false &&
                                          editorRole.role ===
                                            "Agenda Contributor"
                                            ? "d-none"
                                            : styles["agenda-border-class"]
                                        }
                                      >
                                        <ParentAgenda
                                          fileForSend={fileForSend}
                                          setFileForSend={setFileForSend}
                                          currentMeeting={currentMeeting}
                                          data={data}
                                          allUsersRC={allUsersRC}
                                          setAllUsersRC={setAllUsersRC}
                                          index={index}
                                          allSavedPresenters={
                                            allSavedPresenters
                                          }
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
                                          setSubajendaRemoval={
                                            setSubajendaRemoval
                                          }
                                          editorRole={editorRole}
                                          setSelectedID={setSelectedID}
                                        />
                                      </div>
                                      {/* Line Seperator */}
                                      {/* <Row className="mt-3">
                                      <Col lg={12} md={12} sm={12}>
                                        <img
                                          draggable={false}
                                          src={line}
                                          className={
                                            data.canView === false &&
                                            editorRole.role ===
                                              "Agenda Contributor"
                                              ? "d-none"
                                              : styles["LineStyles"]
                                          }
                                        />
                                      </Col>
                                    </Row> */}
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
                )}
              </DragDropContext>
            )}
            {(emptyStateRows === true &&
              (editorRole.role === "Agenda Contributor" ||
                editorRole.role === "Participant")) ||
            (editorRole.role === "Agenda Contributor" &&
              rows[0].title === "") ? (
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
            {/* Seperator For Footer */}
            {editorRole.role === "Participant" ||
            editorRole.role === "Agenda Contributor" ||
            editorRole.status === "9" ||
            editorRole.status === 9 ? null : (
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
                {editorRole.status === "9" ||
                editorRole.status === 9 ||
                editorRole.role === "Agenda Contributor" ? null : (
                  <Button
                    text={t("Import-previous-agenda")}
                    className={styles["Agenda_Buttons"]}
                    onClick={importPreviousAgenda}
                  />
                )}
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
                {/* <Button
                  text={t("Previous")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handlePerviousAgenda}
                /> */}
                {/* <Button
                  text={t("Next")}
                  className={styles["Save_Agenda_btn"]}
                  onClick={handleNextAgenda}
                /> */}

                {editorRole.status === "9" || editorRole.status === 9 ? null : (
                  <Button
                    onClick={() => saveAgendaData(1)}
                    text={t("Next")}
                    className={styles["Save_Agenda_btn"]}
                  />
                )}
                {(Number(editorRole.status) === 11 ||
                  Number(editorRole.status) === 12) &&
                (editorRole.status !== "9" || editorRole.status !== 9) && editorRole.role !== "Agenda Contributor"   ? (
                  <Button
                    disableBtn={
                      Number(currentMeeting) === 0 || isPublishedState === false
                        ? true
                        : false
                    }
                    text={t("Publish")}
                    className={styles["Save_Agenda_btn"]}
                    onClick={() => saveAgendaData(2)}
                  />
                ) : isEditMeeting === true? null : (
                  <Button
                    disableBtn={
                      Number(currentMeeting) === 0 || isPublishedState === false
                        ? true
                        : false
                    }
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
