import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import Select from 'react-select'
import styles from "./ScheduleNewResolution.module.css";
import userImage from "../../../assets/images/user.png";
import { CheckOutlined } from "@ant-design/icons";
import { Space, Switch } from "antd";
import line from "../../../assets/images/line.png";
import FileIcon, { defaultStyles } from "react-file-icon";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import { FileUploadToDo } from "../../../store/actions/Upload_action";
import { useDispatch, useSelector } from "react-redux";
import { InboxOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import featherupload from "../../../assets/images/featherupload.svg";
import newprofile from "../../../assets/images/newprofile.png";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import { message, Upload } from "antd";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  MultiDatePicker
} from "./../../../components/elements";
import { useState } from "react";
import ModalresolutionRemove from "../../../container/ModalresolutionRemove/ModalresolutionRemove";
import ModalCancellResolution from "../../../container/ModalCancellResolution/ModalCancellResolution";
import ModalUpdateresolution from "../../../container/ModalUpdateResolution/ModalUpdateresolution";
import ModalDiscardResolution from "../../../container/ModalDiscardResolution/ModalDiscardResolution";
import EmployeeinfoCard from "../Employeeinfocard/EmployeeinfoCard";
import DatePicker from "react-multi-date-picker";
import { getAllVotingMethods, getAllResolutionStatus } from "../../../store/actions/Resolution_actions";
import { stringValidation } from "../../../commen/functions/validations";
import { createResolutionDateTime } from "../../../commen/functions/date_formater";
import moment from "moment";

const ScheduleNewResolution = () => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { ResolutionReducer, assignees } = useSelector(state => state)
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  console.log(ResolutionReducer, "ResolutionReducerResolutionReducerResolutionReducer")
  const [isVoter, setVoter] = useState(true)
  const [votingMethods, setVotingMethods] = useState([])
  const [decision, setDecision] = useState({
    label: "Pending", value: 1
  })
  const [voters, setVoters] = useState([])
  const [nonVoter, setNonVoters] = useState([])
  const [reminderData, setReminderData] = useState([{
    label: "10 minutes before", value: 1
  }, {
    label: "30 minutes before", value: 2
  }, {
    label: "1 hour before", value: 3
  }, {
    label: "5 hours before", value: 4
  }, {
    label: "1 day before", value: 5
  }, {
    label: "1 day before", value: 6
  }, {
    label: "7 days before", value: 7
  }])
  console.log("votingMethodsvotingMethods", votingMethods)
  //Attendees States
  const [circulationDateTime, setCirculationDateTime] = useState({
    date: "",
    time: ""
  })
  const [votingDateTime, setVotingDateTime] = useState({
    date: "",
    time: ""
  })
  const [decisionDateTime, setDecisionDateTime] = useState({
    date: "",
    time: ""
  })
  console.log(circulationDateTime, votingDateTime, decisionDateTime, "circulationDateTimecirculationDateTime")
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [isNonVoter, setNonVoter] = useState(false)
  const [resolutioncancel, setResolutioncancel] = useState(false);
  const [showmodal, setShowmodal] = useState(false);
  const [resolutionupdate, setResolutionupdate] = useState(false);
  const [discardresolution, setDsicardresolution] = useState(false);
  const [tasksAttachments, setTasksAttachments] = useState([]);
  const [createResolutionData, setCreateResolutionData] = useState({
    FK_ResolutionStatusID: 0,
    FK_ResolutionVotingMethodID: 0,
    Title: "",
    Description: "",
    NotesToVoter: "",
    CirculationDateTime: "",
    DeadlineDateTime: "",
    FK_ResolutionReminderFrequency_ID: 0,
    FK_ResolutionDecision_ID: 3,
    DecisionAnnouncementDateTime: "",
    IsResolutionPublic: false,
  })
  console.log("createResolutionDatacreateResolutionData", createResolutionData)

  const ShowVoter = () => {
    setVoter(true)
    setNonVoter(false)
  }
  const ShowNonVoters = () => {
    setVoter(false)
    setNonVoter(true)
  }

  const resolutiondiscard = () => {
    setDsicardresolution(true);
  };

  const reslotionupdatemodal = () => {
    setResolutionupdate(true);
  };

  const resolutioncancell = () => {
    setResolutioncancel(true);
  };

  const removeuser = () => {
    setShowmodal(true);
  };

  useEffect(() => { }, [])
  //On Click Of Dropdown Value
  const onSearch = (name, id) => {
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setTaskAssignedToInput(e.target.value.trimStart());
  };

  const ReminderChangeHandler = (e) => {
    setCreateResolutionData({
      ...createResolutionData,
      FK_ResolutionReminderFrequency_ID: e.value
    })
  }
  //Drop Down Values
  const searchFilterHandler = (value) => {
    let allAssignees = assignees.user;
    if (
      allAssignees != undefined &&
      allAssignees != null &&
      allAssignees != NaN &&
      allAssignees != []
    ) {
      return allAssignees
        .filter((item) => {
          const searchTerm = value.toLowerCase();
          const assigneesName = item.name.toLowerCase();
          return (
            searchTerm &&
            assigneesName.startsWith(searchTerm) &&
            assigneesName !== searchTerm
          );
        })
        .slice(0, 3)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex flex-row align-items-center"
            key={item.pK_UID}
          >
            <img src={userImage} />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
    }
  };

  const deleteFilefromAttachments = (data, index) => {
    let searchIndex = tasksAttachments;
    searchIndex.splice(index, 1);
    setTasksAttachments([...tasksAttachments]);
  };

  const addVoters = () => {
    console.log(taskAssignedTo, "setTaskAssignedTosetTaskAssignedTo")
    let newVoter = [];
    newVoter.push({
      FK_UID: 748,
      FK_VotingStatus_ID: 3,
      Notes: "",
      Email: "owais@user.com"

    })
  }
  const addNonVoter = () => {
    console.log(taskAssignedTo, "setTaskAssignedTosetTaskAssignedTo")
  }

  const createResolution = () => {

    let Data = {
      ResolutionModel: {
        FK_ResolutionStatusID: createResolutionData.FK_ResolutionStatusID,
        FK_ResolutionVotingMethodID: createResolutionData.FK_ResolutionVotingMethodID,
        Title: createResolutionData.Title,
        NotesToVoter: createResolutionData.NotesToVoter,
        CirculationDateTime: createResolutionDateTime(moment(circulationDateTime.date, "YYYYMMDD").format("YYYYMMDD") + circulationDateTime.time.replace(":", "") + "00"),
        DeadlineDateTime: createResolutionDateTime(moment(decisionDateTime.date, "YYYYMMDD").format("YYYYMMDD") + decisionDateTime.time.replace(":", "") + "00"),
        FK_ResolutionReminderFrequency_ID: createResolutionData.FK_ResolutionReminderFrequency_ID,
        FK_ResolutionDecision_ID: 3,
        DecisionAnnouncementDateTime: createResolutionDateTime(moment(decisionDateTime.date, "YYYYMMDD").format("YYYYMMDD") + decisionDateTime.time.replace(":", "") + "00"),
        IsResolutionPublic: createResolutionData.IsResolutionPublic,
        FK_OrganizationID: JSON.parse(localStorage.getItem("organizationID")),
        FK_UID: JSON.parse(localStorage.getItem("userID"))
      }
    }
    console.log(Data, "DataData")

  }
  // const uploadFilesToDo = (data) => {
  //   const uploadFilePath = data.target.value;
  //   const uploadedFile = data.target.files[0];
  //   var ext = uploadedFile.name.split(".").pop();
  //   console.log("uploadedFile", uploadedFile.name);
  //   let file = tasksAttachments.TasksAttachments;
  //   if (
  //     ext === "doc" ||
  //     ext === "docx" ||
  //     ext === "xls" ||
  //     ext === "xlsx" ||
  //     ext === "pdf" ||
  //     ext === "png" ||
  //     ext === "txt" ||
  //     ext === "jpg" ||
  //     ext === "jpeg" ||
  //     ext === "gif"
  //   ) {
  //     let data;
  //     let sizezero;
  //     let size;
  //     if (file.length > 0) {
  //       file.map((filename, index) => {
  //         if (filename.DisplayFileName === uploadedFile.name) {
  //           data = false;
  //         }
  //       });
  //       if (uploadedFile.size > 10000000) {
  //         size = false;
  //       } else if (uploadedFile.size === 0) {
  //         sizezero = false;
  //       }
  //       if (data === false) {
  //       } else if (size === false) {
  //       } else if (sizezero === false) {
  //       } else {
  //         dispatch(FileUploadToDo(uploadedFile));
  //       }
  //     } else {
  //       let size;
  //       let sizezero;
  //       if (uploadedFile.size > 10000000) {
  //         size = false;
  //       } else if (uploadedFile.size === 0) {
  //         sizezero = false;
  //       }
  //       if (size === false) {
  //       } else if (sizezero === false) {
  //       } else {
  //         dispatch(FileUploadToDo(uploadedFile));
  //       }
  //     }
  //   }
  //   file.push({
  //     PK_TAID: 0,
  //     DisplayAttachmentName: uploadedFile.name,
  //     OriginalAttachmentName: uploadFilePath,
  //     CreationDateTime: "",
  //     FK_TID: 0,
  //   });
  //   setTasksAttachments({ ["TasksAttachments"]: file });
  // };

  const props = {
    name: "file",
    multiple: true,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    showUploadList: false,
    onChange(data) {
      console.log(data.fileList, "daatadaad");

      setTasksAttachments(data.fileList);
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
    customRequest() { },
  };

  // Check is Resolution Checker Handler
  const handleChangeChecker = (e, checked) => {
    console.log(e.target.checked, checked, "testing1212")
    setCreateResolutionData({
      ...createResolutionData,
      IsResolutionPublic: e.target.checked
    })
  }

  // Resolution Voting Method ID
  const detailDropDownhandler = (e) => {
    console.log(" handleChangehandleChangehandleChangehandleChange", e)
    setCreateResolutionData({
      ...createResolutionData,
      FK_ResolutionVotingMethodID: e.value
    })
  }

  // title and description change Handler
  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    console.log("handleChangehandleChangehandleChange", name, value)
    if (name === "ResolutionTitle") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "")
      if (valueCheck !== "") {
        setCreateResolutionData({
          ...createResolutionData,
          Title: valueCheck
        })
      } else {
        setCreateResolutionData({
          ...createResolutionData,
          Title: ""
        })
      }
    }
    if (name === "ResolutionDescription") {
      let valueCheck = value.replace(/[^a-zA-Z ]/g, "")
      if (valueCheck !== "") {
        setCreateResolutionData({
          ...createResolutionData,
          NotesToVoter: valueCheck
        })
      } else {
        setCreateResolutionData({
          ...createResolutionData,
          NotesToVoter: ""
        })
      }
    }
  }
  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        setMeetingAttendeesList(assignees.user);
      }
    } catch (error) {
    }
  }, [assignees.user]);
  // Get Voting Methods
  useEffect(() => {
    if (ResolutionReducer.GetAllVotingMethods !== null) {
      let newArr = [];
      ResolutionReducer.GetAllVotingMethods.map((data, index) => {
        newArr.push({
          value: data.pK_ResolutionVotingMethodID,
          label: data.votingMethod
        })
      })
      setVotingMethods(newArr)
    }
  }, [ResolutionReducer.GetAllVotingMethods])

  useEffect(() => {
    dispatch(getAllVotingMethods(t))
    dispatch(getAllResolutionStatus(t))
  }, [])

  return (
    <>
      <Container>
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Row className="mt-3">
              <Col lg={12} md={12} sm={12}>
                <span className={styles["Resolution_create_heading"]}>
                  {t("Schedule-new-resolution")}
                </span>
              </Col>
            </Row>
            <Paper className={styles["Create_new_resolution_paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12} className={styles["IN_draft_Box"]}>
                  <span className={styles["Draft_messege"]}>
                    {t("In-draft")}
                  </span>
                </Col>
              </Row>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={5} md={5} sm={5}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Details_New_resolution"]}>
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput"
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Resolution-title")}
                            required={true}
                            value={createResolutionData.Title}
                            maxLength={300}
                            name="ResolutionTitle"
                            change={handleChange}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                        >
                          <Select
                            name="Participant"
                            placeholder={t("Voting-deadline")}
                            className="select-voting-deadline"
                            options={votingMethods}
                            isSearchable={false}
                            onChange={detailDropDownhandler}
                          />
                        </Col>
                        <Col
                          lg={6}
                          md={6}
                          sm={6}

                        >
                          <Select
                            name=""
                            placeholder={t("Decision")}
                            className="select-voting-deadline"
                            defaultValue={{
                              label: decision.label,
                              value: decision.value,
                            }}
                            isDisabled={true}

                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="4"
                            placeholder={t("Notes")}
                            value={createResolutionData.NotesToVoter}
                            required={true}
                            maxLength={500}
                            name="ResolutionDescription"
                            change={handleChange}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Circulation_heading"]}>
                            {t("Circulation")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        >
                          <TextField type="date" labelClass="d-none" change={(e) => {
                            setCirculationDateTime({
                              ...circulationDateTime,
                              date: e.target.value
                            })
                          }} />

                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        ><TextField type="time" labelClass="d-none" change={(e) => {
                          setCirculationDateTime({
                            ...circulationDateTime,
                            time: e.target.value
                          })
                        }} />

                        </Col>

                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={
                              styles["Voting_deadline_Create_resolution"]
                            }
                          >
                            {t("Voting-deadline")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        ><TextField type="date" labelClass="d-none" change={(e) => {
                          setVotingDateTime({
                            ...votingDateTime,
                            date: e.target.value
                          })
                        }} />

                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        ><TextField type="time" labelClass="d-none" change={(e) => {
                          setVotingDateTime({
                            ...votingDateTime,
                            time: e.target.value
                          })
                        }} />

                        </Col>

                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={
                              styles["decision_annoucement_Createresoulution"]
                            }
                          >
                            {t("Descision-announcement")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        ><TextField type="date" labelClass="d-none" change={(e) => {
                          setDecisionDateTime({
                            ...decisionDateTime,
                            date: e.target.value
                          })
                        }}
                          />

                        </Col>
                        <Col
                          lg={6}
                          sm={6}
                          md={6}
                          className="CreateMeetingReminder  "
                        ><TextField type="time" labelClass="d-none" change={(e) => {
                          setDecisionDateTime({
                            ...decisionDateTime,
                            time: e.target.value
                          })
                        }} />

                        </Col>

                      </Row>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Reminder"]}>
                            {t("Reminder-frequency")}
                          </span>
                        </Col>
                      </Row>
                      <Row className="mt-0">
                        <Col
                          lg={6}
                          md={6}
                          sm={12}
                          className="CreateMeetingReminder "
                        >
                          <Select
                            name="Participant"
                            placeholder={t("Time")}
                            className="select-voting-deadline"
                            options={reminderData}
                            onChange={ReminderChangeHandler}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="UpdateCheckbox  d-flex justify-content-start"
                        >
                          <Checkbox
                            className="SearchCheckbox MontserratSemiBold-600"
                            name="IsChat"
                            checked={createResolutionData.IsResolutionPublic}
                            label={t("Make-resolution-public")}
                            onChange={handleChangeChecker}
                            classNameDiv="checkboxParentClass"
                          ></Checkbox>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      lg={1}
                      md={1}
                      sm={false}
                      className="d-flex justify-content-center"
                    >
                      <img src={line} height="586px" />
                    </Col>
                    <Col lg={6} md={6} sm={12}>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="d-flex justify-content-start gap-3"
                        >
                          <Button
                            text={t("Voters")}
                            className={isVoter ?
                              styles["Voters_Btn_Createresolution_Active"] : styles["Voters_Btn_Createresolution"]
                            }
                            onClick={ShowVoter}
                          />
                          <Button
                            text={t("Non-voters")}
                            className={isNonVoter ?
                              styles["Non_Voters_Btn_Createresolution_Active"] : styles["Non_Voters_Btn_Createresolution"]
                            }
                            onClick={ShowNonVoters}
                          />
                        </Col>
                      </Row>
                      {isVoter ? (
                        <>
                          <Col lg={12} md={12} sm={12}>

                            <Row className="mt-2">
                              <Col
                                lg={5}
                                md={5}
                                sm={5}
                                className="CreateMeetingInput "
                              >
                                <InputSearchFilter
                                  placeholder={t("Add-attendees")}
                                  className="taskassignee"
                                  value={taskAssignedToInput}
                                  filteredDataHandler={searchFilterHandler(
                                    taskAssignedToInput
                                  )}
                                  change={onChangeSearch}
                                />
                              </Col>

                              <Col
                                lg={5}
                                md={5}
                                sm={5}
                                className="CreateMeetingInput "
                              >
                                <TextField
                                  applyClass="text-area-create-group"
                                  type="text"
                                  placeholder={t("Email")}
                                  required={true}
                                />
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Button
                                  text={t("ADD")}
                                  className={
                                    styles["ADD_Button_Createresolution"]
                                  }
                                  onClick={addVoters}
                                />
                              </Col>
                            </Row>
                            {/* for participants */}
                            <Row className="mt-5">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["scroll-bar-Create-resolution"]}
                              >
                                <Row>
                                  <Col lg={6} md={6} sm={6}>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <EmployeeinfoCard
                                          Employeename="Saad Fudda"
                                          Employeeemail="Saadfudda@gmail.com"
                                          Icon={
                                            <img
                                              src={CrossIcon}
                                              width="18px"
                                              height="18px"
                                              onClick={removeuser}
                                            />
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Col>
                                </Row>



                              </Col>
                            </Row>
                            {/* for participants end */}

                            <Row className="mt-5">
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Attachments_resolution"]}
                                >
                                  {t("Attachments")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <Row>
                                  <Col
                                    sm={12}
                                    lg={12}
                                    md={12}
                                    className="todoModalCreateModal"
                                  >
                                    {tasksAttachments.length > 0
                                      ? tasksAttachments.map((data, index) => {
                                        var ext = data.name.split(".").pop();

                                        const first = data.name.split(" ")[0];
                                        return (
                                          <Col
                                            sm={12}
                                            lg={2}
                                            md={2}
                                            className="modaltodolist-attachment-icon"
                                          >
                                            <FileIcon
                                              extension={ext}
                                              size={78}
                                              labelColor={"rgba(97,114,214,1)"}
                                            // {...defaultStyles.ext}
                                            />
                                            <span className="deleteBtn">
                                              <img
                                                src={deleteButtonCreateMeeting}
                                                width={15}
                                                height={15}
                                                onClick={() =>
                                                  deleteFilefromAttachments(
                                                    data,
                                                    index
                                                  )
                                                }
                                              />
                                            </span>
                                            <p className="modaltodolist-attachment-text">
                                              {first}
                                            </p>
                                          </Col>
                                        );
                                      })
                                      : null}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <Dragger {...props}>
                                  <p className="ant-upload-drag-icon">
                                    <span>
                                      <img
                                        src={featherupload}
                                        width="18.87px"
                                        height="18.87px"
                                      />
                                    </span>
                                  </p>
                                  <p className="ant-upload-text">
                                    {t("Drag-&-drop-or")}
                                    <span> {t("Choose-file")} </span> {t("Here")}
                                  </p>
                                </Dragger>
                              </Col>
                            </Row>

                            <Row className="mt-5">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end gap-3"
                              >
                                <Button
                                  text={t("Save")}
                                  className={
                                    styles["Save_button_Createresolution"]
                                  }
                                  onClick={createResolution}
                                />
                                <Button
                                  text={t("Circulate")}
                                  className={
                                    styles["circulate_button_Createresolution"]
                                  }

                                />
                              </Col>
                            </Row>
                          </Col>
                        </>
                      ) : isNonVoter ? (
                        <>
                          <Col lg={12} md={12} sm={12}>

                            <Row className="mt-2">
                              <Col
                                lg={5}
                                md={5}
                                sm={5}
                                className="CreateMeetingInput "
                              >
                                <InputSearchFilter
                                  placeholder={t("Add-attendees")}
                                  className="taskassignee"
                                  value={taskAssignedToInput}
                                  filteredDataHandler={searchFilterHandler(
                                    taskAssignedToInput
                                  )}
                                  change={onChangeSearch}
                                />
                              </Col>

                              <Col
                                lg={5}
                                md={5}
                                sm={5}
                                className="CreateMeetingInput "
                              >
                                <TextField
                                  applyClass="text-area-create-group"
                                  type="text"
                                  placeholder={t("Email")}
                                  required={true}
                                />
                              </Col>
                              <Col lg={2} md={2} sm={2}>
                                <Button
                                  text={t("ADD")}
                                  className={
                                    styles["ADD_Button_Createresolution"]
                                  }
                                  onClick={addNonVoter}
                                />
                              </Col>
                            </Row>
                            {/* for participants */}
                            <Row className="mt-5">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className={styles["scroll-bar-Create-resolution"]}
                              >
                                <Row>
                                  <Col lg={6} md={6} sm={6}>
                                    <Row>
                                      <Col lg={12} md={12} sm={12}>
                                        <EmployeeinfoCard
                                          Employeename="Saad Fudda"
                                          Employeeemail="Saadfudda@gmail.com"
                                          Icon={
                                            <img
                                              src={CrossIcon}
                                              width="18px"
                                              height="18px"
                                              onClick={removeuser}
                                            />
                                          }
                                        />
                                      </Col>
                                    </Row>
                                  </Col>

                                </Row>

                              </Col>
                            </Row>
                            {/* for participants end */}

                            <Row className="mt-5">
                              <Col lg={12} md={12} sm={12}>
                                <span
                                  className={styles["Attachments_resolution"]}
                                >
                                  {t(" Attachments")}
                                </span>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <Row>
                                  <Col
                                    sm={12}
                                    lg={12}
                                    md={12}
                                    className="todoModalCreateModal"
                                  >
                                    {tasksAttachments.length > 0
                                      ? tasksAttachments.map((data, index) => {
                                        var ext = data.name.split(".").pop();

                                        const first = data.name.split(" ")[0];
                                        return (
                                          <Col
                                            sm={12}
                                            lg={2}
                                            md={2}
                                            className="modaltodolist-attachment-icon"
                                          >
                                            <FileIcon
                                              extension={ext}
                                              size={78}
                                              labelColor={"rgba(97,114,214,1)"}
                                            // {...defaultStyles.ext}
                                            />
                                            <span className="deleteBtn">
                                              <img
                                                src={deleteButtonCreateMeeting}
                                                width={15}
                                                height={15}
                                                onClick={() =>
                                                  deleteFilefromAttachments(
                                                    data,
                                                    index
                                                  )
                                                }
                                              />
                                            </span>
                                            <p className="modaltodolist-attachment-text">
                                              {first}
                                            </p>
                                          </Col>
                                        );
                                      })
                                      : null}
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row>
                              <Col lg={12} md={12} sm={12}>
                                <Dragger {...props}>
                                  <p className="ant-upload-drag-icon">
                                    <span>
                                      <img
                                        src={featherupload}
                                        width="18.87px"
                                        height="18.87px"
                                      />
                                    </span>
                                  </p>
                                  <p className="ant-upload-text">
                                    {t("Drag-&-drop-or")}
                                    <span> {t("Choose-file")} </span> {t("Here")}
                                  </p>
                                </Dragger>
                              </Col>
                            </Row>

                            <Row className="mt-5">
                              <Col
                                lg={12}
                                md={12}
                                sm={12}
                                className="d-flex justify-content-end gap-3"
                              >
                                <Button
                                  text={t("Cancel")}
                                  className={
                                    styles["Save_button_Createresolution"]
                                  }
                                  onClick={resolutioncancell}
                                />
                                <Button
                                  text={t("Discard")}
                                  className={
                                    styles["Discard_button_Createresolution"]
                                  }
                                  onClick={resolutiondiscard}
                                />

                                <Button
                                  text={t("Update")}
                                  className={
                                    styles["Update_button_Createresolution"]
                                  }
                                  onClick={reslotionupdatemodal}
                                />

                                <Button
                                  text={t("Circulate")}
                                  className={
                                    styles["circulate_button_Createresolution"]
                                  }
                                />
                              </Col>
                            </Row>
                          </Col>
                        </>
                      ) : null}
                    </Col>


                  </Row>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </Container>
      {showmodal ? (
        <ModalresolutionRemove
          removeparticipant={showmodal}
          setRemoveparticipant={setShowmodal}
        />
      ) : null}
      {resolutioncancel ? (
        <ModalCancellResolution
          cancelresolution={resolutioncancel}
          setCancelresolution={setResolutioncancel}
        />
      ) : null}
      {resolutionupdate ? (
        <ModalUpdateresolution
          updateresolution={resolutionupdate}
          setUpdateresolution={setResolutionupdate}
        />
      ) : null}

      {discardresolution ? (
        <ModalDiscardResolution
          discardresolution={discardresolution}
          setDiscardresolution={setDsicardresolution}
        />
      ) : null}
    </>
  );
};

export default ScheduleNewResolution;
