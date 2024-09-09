import React, { useState, useEffect, useRef } from "react";
import styles from "./CreateTask.module.css";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";
import {
  AttachmentViewer,
  Button,
  Notification,
  TextField,
} from "../../../../../../components/elements";
import Select from "react-select";
import { Upload } from "antd";
import DrapDropIcon from "../../../../../../assets/images/DrapDropIcon.svg";
import RedCrossIcon from "../../../../../../assets/images/CrossIcon.svg";
import { validateInput } from "../../../../../../commen/functions/regex";
import UnsavedActions from "../UnsavedActionModal/UnsavedActions";
import DatePicker, { DateObject } from "react-multi-date-picker";
import moment from "moment";
import InputIcon from "react-multi-date-picker/components/input_icon";

import {
  showUnsavedActionsModal,
  GetAllMeetingUserApiFunc,
} from "../../../../../../store/actions/NewMeetingActions";
import {
  uploadActionMeetingApi,
  saveTaskDocumentsAndAssigneesApi,
} from "../../../../../../store/actions/Action_Meeting";

import { GetAdvanceMeetingAgendabyMeetingID } from "../../../../../../store/actions/MeetingAgenda_action";
import GroupIcon from "../../../../../../assets/images/groupdropdown.svg";
import ViewActions from "../ViewActions/ViewActions";
import { convertGMTDateintoUTC } from "../../../../../../commen/functions/date_formater";
import {
  CreateToDoList,
  saveFilesTaskApi,
} from "../../../../../../store/actions/ToDoList_action";
import {
  getFileExtension,
  getIconSource,
} from "../../../../../DataRoom/SearchFunctionality/option";
import gregorian from "react-date-object/calendars/gregorian";
import arabic from "react-date-object/calendars/arabic";
import gregorian_ar from "react-date-object/locales/gregorian_ar";
import gregorian_en from "react-date-object/locales/gregorian_en";
const CreateTask = ({
  setCreateaTask,
  currentMeeting,
  setActionState,
  actionState,
  dataroomMapFolderId,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { Dragger } = Upload;
  const { NewMeetingreducer, MeetingAgendaReducer } = useSelector(
    (state) => state
  );
  let currentLanguage = localStorage.getItem("i18nextLng");

  // state for date handler
  const [agendaDueDate, setAgendaDueDate] = useState("");
  //For Custom language datepicker
  const [calendarValue, setCalendarValue] = useState(gregorian);
  const [localValue, setLocalValue] = useState(gregorian_en);
  const calendRef = useRef();
  const [taskAttachments, setTaskAttachments] = useState([]);
  const [onSaveView, setonSaveView] = useState(false);
  const [error, seterror] = useState(false);

  const [selectedTask, setSelectedTask] = useState({
    value: 0,
    label: "",
    name: "",
  });
  const [taskMemberSelect, setTaskMemberSelect] = useState([]);

  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);

  //Notification State
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });

  // Select for select Agenda
  const [selectAgenda, setSelectAgenda] = useState([]);
  const [agendaValue, setAgendaValue] = useState([]);
  const [createTaskID, setCreateTaskID] = useState(0);
  // set file state
  let creatorID = localStorage.getItem("userID");

  const [createTaskDetails, setcreateTaskDetails] = useState({
    PK_TID: 0,
    ActionsToTake: "",
    AssignedTo: [],
    AgendaID: 0,
    date: "",
    Description: "",
    DeadLineTime: "",
  });

  useEffect(() => {
    let Data = {
      MeetingID: Number(currentMeeting),
    };
    let getMeetingData = {
      MeetingID: Number(currentMeeting),
    };
    dispatch(GetAllMeetingUserApiFunc(Data, navigate, t));
    dispatch(GetAdvanceMeetingAgendabyMeetingID(getMeetingData, navigate, t));
  }, []);

  useEffect(() => {
    let createMeetingTaskData = NewMeetingreducer.getMeetingusers;
    if (createMeetingTaskData !== undefined && createMeetingTaskData !== null) {
      let newmembersArray = [];
      if (Object.keys(createMeetingTaskData).length > 0) {
        if (createMeetingTaskData.meetingOrganizers.length > 0) {
          createMeetingTaskData.meetingOrganizers.map(
            (MorganizerData, MorganizerIndex) => {
              let MeetingOrganizerData = {
                value: MorganizerData.userID,
                label: (
                  <>
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex gap-2 align-items-center"
                        >
                          <img
                            src={`data:image/jpeg;base64,${MorganizerData.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            width="18.32px"
                            alt=""
                            draggable="false"
                            className={styles["Image_class_Agenda"]}
                          />
                          <span className={styles["NameDropDown"]}>
                            {MorganizerData.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                name: MorganizerData.userName,
                type: 1,
              };
              if (Number(MorganizerData.userID) === Number(creatorID)) {
                setcreateTaskDetails({
                  ...createTaskDetails,
                  AssignedTo: [MorganizerData.userID],
                });
                setSelectedTask({
                  ...selectedTask,
                  value: MorganizerData.userID,
                  label: (
                    <>
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex gap-2 align-items-center"
                          >
                            <img
                              src={`data:image/jpeg;base64,${MorganizerData.userProfilePicture.displayProfilePictureName}`}
                              height="16.45px"
                              width="18.32px"
                              alt=""
                              draggable="false"
                              className={styles["Image_class_Agenda"]}
                            />
                            <span className={styles["NameDropDown"]}>
                              {MorganizerData.userName}
                            </span>
                          </Col>
                        </Row>
                      </>
                    </>
                  ),
                  name: MorganizerData.userName,
                });
              }
              newmembersArray.push(MeetingOrganizerData);
            }
          );
        }
        if (createMeetingTaskData.meetingAgendaContributors.length > 0) {
          createMeetingTaskData.meetingAgendaContributors.map(
            (meetAgendaContributor, meetAgendaContributorIndex) => {
              let MeetingAgendaContributorData = {
                value: meetAgendaContributor.userID,
                label: (
                  <>
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex gap-2 align-items-center"
                        >
                          <img
                            src={`data:image/jpeg;base64,${meetAgendaContributor.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            alt=""
                            width="18.32px"
                            draggable="false"
                          />
                          <span className={styles["NameDropDown"]}>
                            {meetAgendaContributor.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                name: meetAgendaContributor.userName,

                type: 2,
              };
              if (Number(meetAgendaContributor.userID) === Number(creatorID)) {
                setcreateTaskDetails({
                  ...createTaskDetails,
                  AssignedTo: [meetAgendaContributor.userID],
                });
                setSelectedTask({
                  ...selectedTask,
                  value: meetAgendaContributor.userID,
                  label: (
                    <>
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex gap-2 align-items-center"
                          >
                            <img
                              src={`data:image/jpeg;base64,${meetAgendaContributor.userProfilePicture.displayProfilePictureName}`}
                              height="16.45px"
                              width="18.32px"
                              alt=""
                              draggable="false"
                              className={styles["Image_class_Agenda"]}
                            />
                            <span className={styles["NameDropDown"]}>
                              {meetAgendaContributor.userName}
                            </span>
                          </Col>
                        </Row>
                      </>
                    </>
                  ),
                  name: meetAgendaContributor.userName,
                });
              }
              newmembersArray.push(MeetingAgendaContributorData);
            }
          );
        }
        if (createMeetingTaskData.meetingParticipants.length > 0) {
          createMeetingTaskData.meetingParticipants.map(
            (meetParticipants, meetParticipantsIndex) => {
              let MeetingParticipantsData = {
                value: meetParticipants.userID,
                label: (
                  <>
                    <>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex gap-2 align-items-center"
                        >
                          <img
                            src={`data:image/jpeg;base64,${meetParticipants.userProfilePicture.displayProfilePictureName}`}
                            height="16.45px"
                            width="18.32px"
                            alt=""
                            draggable="false"
                          />
                          <span className={styles["NameDropDown"]}>
                            {meetParticipants.userName}
                          </span>
                        </Col>
                      </Row>
                    </>
                  </>
                ),
                type: 3,
                name: meetParticipants.userName,
              };
              if (Number(meetParticipants.userID) === Number(creatorID)) {
                setcreateTaskDetails({
                  ...createTaskDetails,
                  AssignedTo: [meetParticipants.userID],
                });
                setSelectedTask({
                  ...selectedTask,
                  value: meetParticipants.userID,
                  label: (
                    <>
                      <>
                        <Row>
                          <Col
                            lg={12}
                            md={12}
                            sm={12}
                            className="d-flex gap-2 align-items-center"
                          >
                            <img
                              src={`data:image/jpeg;base64,${meetParticipants.userProfilePicture.displayProfilePictureName}`}
                              height="16.45px"
                              width="18.32px"
                              alt=""
                              draggable="false"
                              className={styles["Image_class_Agenda"]}
                            />
                            <span className={styles["NameDropDown"]}>
                              {meetParticipants.userName}
                            </span>
                          </Col>
                        </Row>
                      </>
                    </>
                  ),
                  name: meetParticipants.userName,
                });
              }
              newmembersArray.push(MeetingParticipantsData);
            }
          );
        }
      }
      console.log(newmembersArray, "pollMeetingDatapollMeetingData");

      setTaskMemberSelect(newmembersArray);
    } else {
      setTaskMemberSelect([]);
    }
  }, [NewMeetingreducer.getMeetingusers]);

  useEffect(() => {
    if (currentLanguage !== undefined && currentLanguage !== null) {
      if (currentLanguage === "en") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_en);
      } else if (currentLanguage === "ar") {
        setCalendarValue(gregorian);
        setLocalValue(gregorian_ar);
      }
    }
  }, [currentLanguage]);

  const changeDateActionCreate = (date) => {
    let meetingDateValueFormat = new DateObject(date).format("DD/MM/YYYY");
    let meetingDateValueFormat2 = new Date(date);
    setAgendaDueDate(meetingDateValueFormat);
    setcreateTaskDetails({
      ...createTaskDetails,
      date: convertGMTDateintoUTC(meetingDateValueFormat2).slice(0, 8),
      DeadLineTime: convertGMTDateintoUTC(meetingDateValueFormat2).slice(8, 14),
    });
  };

  const actionSaveHandler = () => {
    if (
      createTaskDetails.ActionsToTake !== "" &&
      // createTaskDetails.Description !== "" &&
      createTaskDetails.AssignedTo > 0 &&
      createTaskDetails.date !== ""
    ) {
      let Task = {
        Task: {
          PK_TID: createTaskDetails.PK_TID,
          Title: createTaskDetails.ActionsToTake,
          Description: createTaskDetails.Description,
          IsMainTask: true,
          DeadLineDate: createTaskDetails.date,
          DeadLineTime: createTaskDetails.DeadLineTime,
          CreationDateTime: "",
        },
      };
      dispatch(CreateToDoList(navigate, Task, t, setCreateTaskID, 1));
    } else {
      seterror(true);
    }
  };
  console.log(createTaskDetails.date, "creatercreatercreater");

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;
      console.log(fileList, "fileListfileListfileList");
      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }

      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let flag = false;
      let sizezero = true;
      let size = true;

      if (taskAttachments.length > 9) {
        setOpen({
          flag: true,
          message: t("Not-allowed-more-than-10-files"),
        });
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > 10485760) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = taskAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-greater-then-zero"),
            });
          }, 3000);
        } else if (!sizezero) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-size-should-not-be-zero"),
            });
          }, 3000);
        } else if (fileExists) {
          setTimeout(() => {
            setOpen({
              flag: true,
              message: t("File-already-exists"),
            });
          }, 3000);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };
          setTaskAttachments((prevAttachments) => [...prevAttachments, file]);
          fileSizeArr += fileData.originFileObj.size;
          setFileForSend((prevFiles) => [...prevFiles, fileData.originFileObj]);
          setFileSize(fileSizeArr);
        }
      });

      // Update previousFileList to current fileList
      previousFileList = fileList;
    },
    onDrop(e) {},
    customRequest() {},
  };

  // Initialize previousFileList to an empty array
  let previousFileList = [];
 
  const removeFileFunction = (fileData) => {
    setFileForSend((preFileforSend) =>
      preFileforSend.filter(
        (filesendData, index) =>
          filesendData.name !== fileData.DisplayAttachmentName
      )
    );
    setTaskAttachments((fileTaskAttachment) =>
      fileTaskAttachment.filter(
        (prevFiles, index) =>
          prevFiles.DisplayAttachmentName !== fileData.DisplayAttachmentName
      )
    );
  };

  const HandleChange = (e, index) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "ActionsToTake") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setcreateTaskDetails({
          ...createTaskDetails,
          ActionsToTake: valueCheck,
        });
      } else {
        setcreateTaskDetails({
          ...createTaskDetails,
          ActionsToTake: "",
        });
      }
    } else if (name === "Description") {
      let valueCheck = validateInput(value);
      if (valueCheck !== "") {
        setcreateTaskDetails({
          ...createTaskDetails,
          Description: valueCheck,
        });
      } else {
        setcreateTaskDetails({
          ...createTaskDetails,
          Description: "",
        });
      }
    }
  };

  // for upload Action
  const documentsUploadCall = async (dataroomMapFolderId) => {
    let newFolder = [];
    let newSaveFiles = [];
    // if(fileForSend)
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadActionMeetingApi(
          navigate,
          t,
          newData,
          dataroomMapFolderId,
          newFolder
        )
      );
    });
    // Wait for all promises to resolve
    await Promise.all(uploadPromises);
    await dispatch(
      saveFilesTaskApi(
        navigate,
        t,
        newFolder,
        dataroomMapFolderId,
        newSaveFiles
      )
    );
    console.log(
      { uploadPromises, newFolder, newSaveFiles },
      "uploadPromisesuploadPromisesuploadPromises"
    );
    let newAttachmentData = newSaveFiles.map((data, index) => {
      return {
        DisplayAttachmentName: data.DisplayAttachmentName,
        OriginalAttachmentName: data.pK_FileID.toString(),
        FK_TID: Number(createTaskID),
      };
    });
    console.log(
      { newAttachmentData },
      "uploadPromisesuploadPromisesuploadPromises"
    );

    let Data = {
      TaskCreatorID: Number(creatorID),
      TaskAssignedTo: createTaskDetails.AssignedTo,
      TaskID: Number(createTaskID),
      TasksAttachments: newAttachmentData,
    };
    console.log({ Data }, "uploadPromisesuploadPromisesuploadPromises");

    let newData = {
      TaskID: Number(createTaskID),
      MeetingID: Number(currentMeeting),
      AgendaID:
        createTaskDetails.AgendaID !== 0
          ? createTaskDetails.AgendaID.toString()
          : "-1",
    };
    console.log({ newData }, "uploadPromisesuploadPromisesuploadPromises");

    await dispatch(
      saveTaskDocumentsAndAssigneesApi(
        navigate,
        Data,
        t,
        7,
        setCreateaTask,
        newData,
        setCreateTaskID
      )
    );
  };

  useEffect(() => {
    if (createTaskID !== 0) {
      documentsUploadCall(dataroomMapFolderId);
    }
  }, [createTaskID]);

  // useEffect for agenda Dropdown
  useEffect(() => {
    if (
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData &&
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList
    ) {
      let tempAgenda = [];
      MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData.agendaList.forEach(
        (agenda) => {
          // Adding main agenda from agendaList
          tempAgenda.push({
            label: agenda.title,
            value: agenda.id,
          });

          // Adding subAgenda titles
          if (agenda.subAgenda && agenda.subAgenda.length > 0) {
            agenda.subAgenda.forEach((subAgenda) => {
              tempAgenda.push({
                label: subAgenda.subTitle,
                value: subAgenda.subAgendaID,
              });
            });
          }
        }
      );
      setAgendaValue(tempAgenda);
    }
  }, [MeetingAgendaReducer.GetAdvanceMeetingAgendabyMeetingIDData]);

  const onChangeSelectAgenda = (e) => {
    setcreateTaskDetails({
      ...createTaskDetails,
      AgendaID: e.value,
    });
    setSelectAgenda(e);
  };

  const saveButtonFunc = () => {
    seterror(true);
    setonSaveView(true);
  };

  // for selecting Data
  const handleSelectMemberValue = (e) => {
    console.log(e, "valuevaluevaluevaluevalue");
    setcreateTaskDetails({
      ...createTaskDetails,
      AssignedTo: [e.value],
    });
    setSelectedTask(e);
  };

  const handleUnsavedModal = () => {
    dispatch(showUnsavedActionsModal(true));
  };

  return (
    <>
      {onSaveView ? (
        <ViewActions />
      ) : (
        <>
          <section>
            <Row>
              <Col
                lg={12}
                md={12}
                sm={12}
                className={styles["Create_Task_main_Scroller"]}
              >
                {/* <Row className="mt-4">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["MainHeading_Create_Action"]}>
                      ext ever since the 1500s, when an unknown printer took a
                      galley of type and scrambled it to make a type specimen
                      book. It has survived not only five centuries, but also
                      the leap into electronic typesetting, remaining
                      essentially unchanged. It was popularised in the 1960s
                      with the release of Letraset sheets containing Lorem Ipsum
                      passages, and more recently with desktop publishing
                      software like Aldus PageMaker including versions of Lorem
                      Ipsum.
                    </span>
                  </Col>
                </Row> */}
                <Row className="mt-1">
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["SubHeading"]}>
                      {t("Task-title")}{" "}
                      <span className={styles["Steric"]}>*</span>
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      placeholder={t("Task-title")}
                      labelclass={"d-none"}
                      change={HandleChange}
                      maxLength={195}
                      name={"ActionsToTake"}
                      value={createTaskDetails.ActionsToTake}
                    />
                    <Row>
                      <Col>
                        <p
                          className={
                            error && createTaskDetails.ActionsToTake === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Please-enter-action-to-take")}
                        </p>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col lg={5} md={5} sm={5}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["SubHeading"]}>
                          {t("Assigned-to")}
                          <span className={styles["Steric"]}> *</span>
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          classNamePrefix={"Polls_Meeting"}
                          value={selectedTask.value === 0 ? null : selectedTask}
                          options={taskMemberSelect}
                          // closeMenuOnSelect={false}
                          // components={animatedComponents}
                          // isMulti
                          onChange={handleSelectMemberValue}
                          isSearchable={false}
                        />
                        <Row>
                          <Col>
                            <p
                              className={
                                error &&
                                createTaskDetails.AssignedTo.length === 0
                                  ? ` ${styles["errorMessage-inLogin"]} `
                                  : `${styles["errorMessage-inLogin_hidden"]}`
                              }
                            >
                              {t("Please-select-assignees")}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={5} md={5} sm={5}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["SubHeading"]}>
                          {t("Select-agenda")}
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <Select
                          value={selectAgenda}
                          options={agendaValue}
                          onChange={onChangeSelectAgenda}
                          isSearchable={false}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={2} md={2} sm={2}>
                    <Row>
                      <Col lg={12} md={12} sm={12}>
                        <span className={styles["SubHeading"]}>
                          {t("Due-date")}
                          {""}
                          <span className={styles["Steric"]}> *</span>
                        </span>
                      </Col>
                    </Row>
                    <Row>
                      <Col
                        lg={12}
                        md={12}
                        sm={12}
                        className={styles["Create-task"]}
                      >
                        <DatePicker
                          value={agendaDueDate}
                          format={"DD/MM/YYYY"}
                          minDate={moment().toDate()}
                          placeholder="DD/MM/YYYY"
                          render={
                            <InputIcon
                              placeholder="DD/MM/YYYY"
                              className="datepicker_input"
                            />
                          }
                          editable={false}
                          className="datePickerTodoCreate2"
                          onOpenPickNewDate={true}
                          inputMode=""
                          calendar={calendarValue}
                          locale={localValue}
                          ref={calendRef}
                          onFocusedDateChange={changeDateActionCreate}
                          onChange={changeDateActionCreate}
                        />
                        <Row>
                          <Col>
                            <p
                              className={
                                error && createTaskDetails.date === ""
                                  ? ` ${styles["errorMessage-inLogin"]} `
                                  : `${styles["errorMessage-inLogin_hidden"]}`
                              }
                            >
                              {t("Enter-date-must-action")}
                            </p>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <span className={styles["SubHeading"]}>
                      {t("Description")}{" "}
                      {/* <span className={styles["Steric"]}>*</span> */}
                    </span>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12} md={12} sm={12}>
                    <TextField
                      labelclass={"d-none"}
                      change={HandleChange}
                      name={"Description"}
                      value={createTaskDetails.Description}
                      applyClass="Polls_meeting"
                      as={"textarea"}
                      maxLength={295}
                      rows="4"
                      placeholder={t("Description")}
                      // required={true}
                    />
                    {/* <Row>
                      <Col>
                        <p
                          className={
                            error && createTaskDetails.Description === ""
                              ? ` ${styles["errorMessage-inLogin"]} `
                              : `${styles["errorMessage-inLogin_hidden"]}`
                          }
                        >
                          {t("Description-is-required-action")}
                        </p>
                      </Col>
                    </Row> */}
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col lg={12} md={12} sm={12}>
                    <Dragger
                      {...props}
                      fileList={[]}
                      className={
                        styles["dragdrop_attachment_create_resolution"]
                      }
                    >
                      {taskAttachments.length > 0 ? (
                        <>
                          <Row>
                            <Col className={styles["Scroller_Actions_Page"]}>
                              <Row className="ps-3">
                                {taskAttachments.map((data, index) => {
                                  console.log(data, "datadatadata");
                                  return (
                                    <>
                                      <Col lg={2} md={2} sm={2}>
                                        <AttachmentViewer
                                          name={data.DisplayAttachmentName}
                                          fk_UID={creatorID}
                                          data={data}
                                          id={0}
                                          handleClickRemove={() =>
                                            removeFileFunction(data)
                                          }
                                        />
                                        {/* <Row>
                                            <Col lg={10} md={10} sm={10}>
                                              <Row className="mt-2">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className="d-flex gap-2 align-items-center"
                                                >
                                                  <img
                                                    alt="File Format"
                                                    draggable={false}
                                                    src={getIconSource(
                                                      getFileExtension(
                                                        data.DisplayAttachmentName
                                                      )
                                                    )}
                                                    height="31.57px"
                                                    width="31.57px"
                                                  />
                                                  <span
                                                    className={
                                                      styles["FileName"]
                                                    }
                                                    title={
                                                      data.DisplayAttachmentName
                                                    }
                                                  >
                                                    {data.DisplayAttachmentName}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={2}
                                              className="d-flex align-items-center justify-content-start mt-1"
                                            >
                                              <img
                                                alt="dragger"
                                                draggable={false}
                                                src={RedCrossIcon}
                                                height="20.76px"
                                                width="20.76px"
                                                className={
                                                  styles["CrossIconClass"]
                                                }
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  removeFileFunction(index);
                                                }}
                                              />
                                            </Col>
                                          </Row> */}
                                      </Col>
                                    </>
                                  );
                                })}
                              </Row>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        <>
                          <Row>
                            <Col
                              lg={5}
                              md={5}
                              sm={12}
                              className="d-flex justify-content-end align-items-center"
                            >
                              <img
                                draggable={false}
                                src={DrapDropIcon}
                                width={100}
                                className={styles["ClassImage"]}
                                alt=""
                              />
                            </Col>
                            <Col lg={7} md={7} sm={12}>
                              <Row className="mt-3">
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-start"
                                >
                                  <span
                                    className={
                                      styles["ant-upload-text-Meetings"]
                                    }
                                  >
                                    {t("Drag-file-here")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-start"
                                >
                                  <span
                                    className={
                                      styles["Choose_file_style-Meeting"]
                                    }
                                  >
                                    {t("The-following-file-formats-are")}
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  className="d-flex justify-content-start"
                                >
                                  <span
                                    className={
                                      styles["Choose_file_style-Meeting"]
                                    }
                                  >
                                    {t(
                                      "Docx-ppt-pptx-xls-xlsx-jpeg-jpg-and-png"
                                    )}
                                  </span>
                                </Col>
                              </Row>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Dragger>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col
                lg={12}
                md={12}
                sm={12}
                className="d-flex justify-content-end gap-2"
              >
                {/* <Button
                  text={t("Clone-meeting")}
                  className={styles["Cancel_Button_Polls_meeting"]}
                />

                <Button
                  text={t("Delete-meeting")}
                  className={styles["Cancel_Button_Polls_meeting"]}
                />

                <Button
                  text={t("Publish-the-meeting")}
                  className={styles["Cancel_Button_Polls_meeting"]}
                /> */}

                <Button
                  text={t("Cancel")}
                  className={styles["Cancel_Button_Polls_meeting"]}
                  onClick={handleUnsavedModal}
                />

                <Button
                  text={t("Save")}
                  className={styles["Save_Button_Polls_meeting"]}
                  // onClick={saveButtonFunc}
                  onClick={actionSaveHandler}
                />
              </Col>
            </Row>
            {NewMeetingreducer.unsavedActions && (
              <UnsavedActions
                setCreateaTask={setCreateaTask}
                currentMeeting={currentMeeting}
              />
            )}
          </section>
        </>
      )}
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default CreateTask;
