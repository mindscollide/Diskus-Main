import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import featherupload from "../../../../assets/images/featherupload.svg";
import { Paper } from "@mui/material";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  Notification,
  AttachmentViewer,
} from "./../../../../components/elements";
import styles from "./UpadateGroup.module.css";
import CrossIcon from "../../../../assets/images/cancel_meeting_icon.svg";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  SaveGroupsDocumentsApiFunc,
  getGroupMembersRoles,
  getOrganizationGroupTypes,
  saveFilesGroupsApi,
  updateGroup,
  uploadDocumentsGroupsApi,
} from "../../../../store/actions/Groups_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import { Upload } from "antd";
import { maxFileSize } from "../../../../commen/functions/utils";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import ConfirmationModal from "../../../../components/elements/confirmationModal/ConfirmationModal";

const UpdateGroupPage = ({ setUpdateComponentpage }) => {
  const { Dragger } = Upload;
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [fileForSend, setFileForSend] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const [erorbar, setErrorBar] = useState(false);
  const { assignees, GroupsReducer } = useSelector((state) => state);
  const dispatch = useDispatch();
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [folderID, setFolderID] = useState(0);
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [attendees, setAttendees] = useState([]);
  const [GroupDetails, setGroupDetails] = useState({
    Title: "",
    GroupID: 0,
    CreatorID: 0,
    Description: "",
    isGroupChat: true,
    GroupTypeID: 0,
    GroupStatusID: 0,
  });

  const [membersData, setMembersData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const participantOptions = [t("Head"), t("Regular")];
  const userID = localStorage.getItem("userID");
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [groupTypeValue, setGroupTypeValue] = useState("");
  const [organizationGroupType, setOrganizationGroupType] = useState([]);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  const [groupMembersRolesVal, setGroupMembersRolesVal] = useState({
    label: "",
    value: 0,
  });
  const [groupMembersRolesOptions, setGroupMembersRolesOptions] = useState([]);
  const [groupTypesVal, setGroupTypesVal] = useState({
    label: "",
    value: 0,
  });
  const [newGroupTypeOptions, setNewGroupTypeOptions] = useState([]);

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Head"), id: 2 },
    { label: t("Regular"), id: 1 },
  ];

  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t, false));
    dispatch(getGroupMembersRoles(navigate, Data, t));
    dispatch(getOrganizationGroupTypes(navigate, Data, t));
  }, []);

  // for attendies Role handler
  const assigntRoleAttendies = (selectRole) => {
    setGroupMembersRolesVal(selectRole);
  };

  const handleAddAttendees = () => {
    const newMeetingAttendees = [...membersData];
    const newGroupMembers = [...groupMembers];
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      showMessage(
        t("You-can-add-data-only-from-one-form-option-at-a-time"),
        "error",
        setOpen
      );
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
    } else if (taskAssignedTo !== 0) {
      var foundIndex = membersData.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );

      if (groupMembersRolesVal.value === 0) {
        showMessage(
          t("Please-select-group-member-type-also"),
          "error",
          setOpen
        );
      } else {
        if (foundIndex === -1) {
          newMeetingAttendees.push({
            FK_UID: taskAssignedTo, //userid
            FK_GRMRID: groupMembersRolesVal.value, //group member role id
            FK_GRID: 0, //group id
          });
          setMembersData(newMeetingAttendees);
          setGroupDetails({
            ...GroupDetails,
            GroupMembers: newMeetingAttendees,
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === taskAssignedTo) {
                newGroupMembers.push({
                  data,
                  role: groupMembersRolesVal.value,
                });

                setGroupMembers(newGroupMembers);
              }
            });
          }

          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
          setPresenterValue({
            value: 0,
            label: "",
            name: "",
          });
        } else {
          showMessage(t("User-already-exist"), "error", setOpen);
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        }
      }
    } else if (attendees.length > 0) {
      let check = false;

      attendees.forEach((data) => {
        membersData.forEach((data2) => {
          if (data === data2.FK_UID) {
            check = true;
          }
        });
      });
      if (check === true) {
        showMessage(t("User-already-exist"), "error", setOpen);
        setAttendees([]);
        setParticipantRoleName("");
        setPresenterValue({
          value: 0,
          label: "",
          name: "",
        });
      } else {
        if (groupMembersRolesVal.value !== 0) {
          attendees.forEach((dataID, index) => {
            newMeetingAttendees.push({
              FK_UID: dataID, //userid
              FK_GRMRID: groupMembersRolesVal.value, //group member role id
              FK_GRID: 0, //group id
            });
            setMembersData(newMeetingAttendees);
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: groupMembersRolesVal.value,
                });
                setGroupMembers(newGroupMembers);
              }
            });
            setGroupDetails({
              ...GroupDetails,
              GroupMembers: newMeetingAttendees,
            });
            setAttendees([]);
            setParticipantRoleName("");
          });
          setPresenterValue({
            value: 0,
            label: "",
            name: "",
          });
        } else {
          showMessage(
            t("Please-select-group-member-type-also"),
            "error",
            setOpen
          );
        }
      }
    } else {
      showMessage(t("Please-select-atleast-one-members"), "error", setOpen);
      setPresenterValue({
        value: 0,
        label: "",
        name: "",
      });
    }
  };

  // Group type Change Handler
  const groupTypeChangeHandler = (selectValue) => {
    setGroupTypesVal(selectValue);

    setGroupDetails({
      ...GroupDetails,
      GroupTypeID: selectValue.value,
    });
  };

  console.log(GroupDetails.GroupStatusID, "valuevalue");

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assignees.user).length > 0) {
        let newData = [];
        setMeetingAttendeesList(assignees.user);
        assignees.user.forEach((user, index) => {
          newData.push({
            label: (
              <>
                <Row>
                  <Col
                    lg={12}
                    md={12}
                    sm={12}
                    className='d-flex gap-2 align-items-center'>
                    <img
                      src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                      height='16.45px'
                      width='18.32px'
                      draggable='false'
                      alt=''
                    />
                    <span>{user.name}</span>
                  </Col>
                </Row>
              </>
            ),
            value: user.pK_UID,
            name: user.name,
          });
        });
        setAllPresenters(newData);
      }
    } catch (error) {}
  }, [assignees.user]);

  // for api response of list group roles
  useEffect(() => {
    if (
      GroupsReducer.getOrganizationGroupRoles !== null &&
      GroupsReducer.getOrganizationGroupRoles.length > 0
    ) {
      let newRoles = [];
      GroupsReducer.getOrganizationGroupRoles.forEach((data, index) => {
        newRoles.push({
          value: data.groupRoleID,
          label: data.role,
        });
      });
      setGroupMembersRolesOptions(newRoles);
    }
  }, [GroupsReducer.getOrganizationGroupRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupTypes !== null) {
      let newArrGroupType1 = [];

      GroupsReducer.getOrganizationGroupTypes.forEach((data, index) => {
        newArrGroupType1.push({
          value: data.groupTypeID,
          label: data.type,
        });
      });
      setNewGroupTypeOptions(newArrGroupType1);
    }
  }, [GroupsReducer.getOrganizationGroupTypes]);

  //Input Field Assignee Change
  const onChangeSearch = (item) => {
    setPresenterValue(item);
    setTaskAssignedTo(item.value);
  };

  // onChange Function for set input values in state
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "tasktitle") {
      setGroupDetails({
        ...GroupDetails,
        Title: value,
      });
    }
    if (name === "groupdescription") {
      setGroupDetails({
        ...GroupDetails,
        Description: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setGroupDetails({
      ...GroupDetails,
      isGroupChat: e.target.checked,
    });
  };

  const removeMemberHandler = (id) => {
    let getGroupMemberIndex = groupMembers.findIndex(
      (groupmemberdata, index) => groupmemberdata.data.pK_UID === id
    );
    let getIndexCreateGroupDetails = membersData.findIndex(
      (data, index) => data.FK_UID === id
    );
    groupMembers.splice(getGroupMemberIndex, 1);
    membersData.splice(getIndexCreateGroupDetails, 1);
    setGroupMembers([...groupMembers]);
    setMembersData([...membersData]);
  };

  const checkGroupHead = (groupMembers) => {
    let flag1 = groupMembers.findIndex((data, index) => data.FK_GRMRID === 2);
    if (flag1 !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const handleUpdateGroup = () => {
    if (
      GroupDetails.Title !== "" &&
      GroupDetails.Description !== "" &&
      GroupDetails.GroupTypeID !== 0
    ) {
      if (Object.keys(membersData).length === 0) {
        showMessage(t("Please-add-atleast-one-group-head"), "error", setOpen);
      } else {
        if (!checkGroupHead(membersData)) {
          showMessage(t("Please-add-atleast-one-group-head"), "error", setOpen);
        } else {
          setErrorBar(false);
          let OrganizationID = JSON.parse(
            localStorage.getItem("organizationID")
          );
          let Data = {
            GroupDetails: {
              CreatorID: GroupDetails.CreatorID,
              PK_GRID: GroupDetails.GroupID,
              title: GroupDetails.Title,
              Description: GroupDetails.Description,
              FK_GRTID: GroupDetails.GroupTypeID,
              FK_GRSID: GroupDetails.GroupStatusID,
              IsTalk: GroupDetails.isGroupChat,
              OrganizationID: OrganizationID,
            },
            GroupMembers: membersData,
          };
          console.log(Data, "valuevalue");
          dispatch(updateGroup(navigate, Data, t, setUpdateComponentpage));
        }
      }
    } else {
      setErrorBar(true);
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
    }
  };

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      let attendIndex = attendees.findIndex((data, index) => data === id);
      if (attendIndex !== -1) {
        attendees.splice(attendIndex, 1);
        setAttendees([...attendees]);
      }
    } else {
      attendees.push(id);
      setAttendees([...attendees]);
    }
  };

  useEffect(() => {
    if (GroupsReducer.getGroupByGroupIdResponse !== null) {
      let groupDetails = GroupsReducer.getGroupByGroupIdResponse;

      let newArr = [];
      let newData = [];
      if (groupDetails.groupMembers.length > 0) {
        groupDetails.groupMembers.forEach((memberData, index) => {
          newArr.push({
            FK_UID: memberData.pK_UID,
            FK_GRMRID: memberData.groupRole.groupRoleID,
            FK_GRID: memberData.groupID,
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === memberData.pK_UID) {
                return newData.push({
                  data,
                  role: memberData.groupRole.groupRoleID,
                });
              }
            });
          }
        });
      }
      setMembersData(newArr);
      setGroupMembers(newData);
      setGroupTypeValue(groupDetails.groupType.type);
      setGroupTypesVal({
        ...groupTypesVal,
        label: groupDetails.groupType.type,
        value: groupDetails.groupType.groupTypeID,
      });
      setGroupDetails({
        CreatorID: groupDetails.creatorID,
        GroupID: groupDetails.groupID,
        Title: groupDetails.title,
        Description: groupDetails.description,
        isGroupChat: groupDetails.isTalk,
        GroupTypeID: groupDetails.groupType.groupTypeID,
        GroupStatusID: groupDetails.groupStatus.groupStatusID,
      });
    }
  }, [GroupsReducer.getGroupByGroupIdResponse, meetingAttendeesList]);

  const props = {
    name: "file",
    multiple: true,
    showUploadList: false,
    onChange(data) {
      const { fileList } = data;

      // Check if the fileList is the same as the previous one
      if (JSON.stringify(fileList) === JSON.stringify(previousFileList)) {
        return; // Skip processing if it's the same fileList
      }

      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;
      let totalFiles = fileList.length + fileAttachments.length;

      if (totalFiles > 15) {
        showMessage(t("Not-allowed-more-than-15-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        if (fileData.size > maxFileSize) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = fileAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          showMessage(
            t("File-size-should-not-be-greater-then-1-5GB"),
            "error",
            setOpen
          );
        } else if (!sizezero) {
          showMessage(t("File-size-should-not-be-zero"), "error", setOpen);
        } else if (fileExists) {
          showMessage(t("File-already-exists"), "error", setOpen);
        } else {
          let file = {
            DisplayAttachmentName: fileData.name,
            OriginalAttachmentName: fileData.name,
            fileSize: fileData.originFileObj.size,
          };
          setFileAttachments((prevAttachments) => [...prevAttachments, file]);
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

  const handleRemoveFile = (data) => {
    console.log(data, "indexindexindex");
    setFileAttachments((filesData) => {
      return filesData.filter(
        (fileData, index) =>
          fileData.DisplayAttachmentName !== data.DisplayAttachmentName
      );
    });
    setPreviousFileIDs((prevFilesData) => {
      return prevFilesData.filter(
        (prevdata, index) =>
          prevdata.DisplayAttachmentName !== data.DisplayAttachmentName
      );
    });
    if (Object.values(fileForSend).length > 0) {
      setFileForSend((filesData) => {
        return filesData.filter(
          (fileData, index) => fileData.name !== data.DisplayAttachmentName
        );
      });
    }
    console.log(fileForSend, "fileForSendfileForSend");
    // updatedFies.splice(index, 1);
    // setFileAttachments(updatedFies);

    // const updateFileForSend = [...fileForSend];
    // updateFileForSend.splice(index, 1);
    // setFileForSend(updateFileForSend);
  };
  console.log(fileForSend, fileAttachments, "fileForSendfileForSend");

  useEffect(() => {
    if (
      GroupsReducer.groupDocuments !== null &&
      GroupsReducer.groupDocuments !== undefined
    ) {
      if (GroupsReducer.groupDocuments.data.length > 0) {
        setFolderID(GroupsReducer.groupDocuments.folderID);
        let retirveArray = [];
        let PrevIds = [];
        GroupsReducer.groupDocuments.data.forEach((docsData, docsDataindex) => {
          retirveArray.push({
            pK_FileID: docsData.pK_FileID,
            DisplayAttachmentName: docsData.displayFileName,
            fk_UserID: docsData.fK_UserID,
          });
          PrevIds.push({
            pK_FileID: docsData.pK_FileID,
            DisplayAttachmentName: docsData.displayFileName,
          });
        });
        setPreviousFileIDs(PrevIds);
        setFileAttachments(retirveArray);
      }
    }
  }, [GroupsReducer.groupDocuments]);

  const GroupsDocumentCallUpload = async (folderID) => {
    let newfile = [...previousFileIDs];
    let fileObj = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsGroupsApi(navigate, t, newData, folderID, fileObj)
        );
      });
      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      await dispatch(
        saveFilesGroupsApi(navigate, t, fileObj, folderID, newfile)
      );
    }

    let Data = {
      GroupID: Number(GroupDetails.GroupID),
      UpdateFileList: newfile.map((data, index) => {
        return { PK_FileID: Number(data.pK_FileID) };
      }),
    };

    dispatch(
      SaveGroupsDocumentsApiFunc(navigate, Data, t, setUpdateComponentpage)
    );
  };

  useEffect(() => {
    if (GroupsReducer.FolderID !== 0) {
      let folderIDCreated = GroupsReducer.FolderID.folderID;

      GroupsDocumentCallUpload(folderIDCreated);
    }
  }, [GroupsReducer.FolderID]);

  const filterFunc = (options, searchText) => {
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <section className=' color-5a5a5a'>
        <Row className='mt-3'>
          <Col
            lg={12}
            md={12}
            sm={12}
            className='d-flex justify-content-start '>
            <span className={styles["Create-Group-Heading"]}>
              {t("Update-group")}
            </span>
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col lg={12} md={12} sm={12}>
            <Paper className={styles["Update-Group-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["details-class"]}>
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='group-fields CreateMeetingInput'>
                          <TextField
                            applyClass='form-control2'
                            type='text'
                            placeholder={t("Task-title")}
                            maxLength={300}
                            required={true}
                            name='tasktitle'
                            change={onChangeFunc}
                            value={GroupDetails.Title}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && GroupDetails.Title === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }>
                            {t("Group-title-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='CreateMeetingInput Saved_money_Tagline'>
                          <TextField
                            applyClass='text-area-create-group'
                            type='text'
                            as={"textarea"}
                            rows='4'
                            name='groupdescription'
                            maxLength={500}
                            change={onChangeFunc}
                            placeholder={t("Description")}
                            required={true}
                            value={GroupDetails.Description}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && GroupDetails.Description === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }>
                            {t("Group-description-is-required")}
                          </p>
                        </Col>
                      </Row>

                      <Row className='mt-1'>
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["Checkbox"]}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className='Update-committee-Checkbox Saved_money_Tagline'>
                              <Checkbox
                                className='SearchCheckbox '
                                name='IsChat'
                                disabled={
                                  GroupsReducer?.getGroupByGroupIdResponse
                                    ?.isTalk
                                    ? true
                                    : false
                                }
                                label2Class={styles["Label_Of_CheckBox"]}
                                label2={t("Create-talk-group")}
                                onChange={CheckBoxHandler}
                                checked={GroupDetails.isGroupChat}
                                classNameDiv='checkboxParentClass'></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={5} md={5} sm={5}>
                          <Select
                            options={newGroupTypeOptions}
                            onChange={groupTypeChangeHandler}
                            value={
                              groupTypesVal.value !== 0 ? groupTypesVal : null
                            }
                            placeholder={t("Select-group-type")}
                          />
                        </Col>
                        <Row>
                          <Col className='d-flex justify-content-end'>
                            <p
                              className={
                                erorbar && groupTypeValue === ""
                                  ? styles["errorMessage"]
                                  : styles["errorMessage_hidden"]
                              }>
                              {t("Group-type-is-required")}
                            </p>
                          </Col>
                        </Row>
                      </Row>
                      {/* this is members shown area on which the scroll will applied */}
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["scroll-bar-creategroup"]}>
                          <Row className='mt-1'>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Create-group-Head-Heading"]}>
                                {t("Group-head")}
                              </span>
                            </Col>
                          </Row>

                          {/* Group Heads */}
                          <Row className='mt-2'>
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 2) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}>
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data.data.displayProfilePictureName}`}
                                              width={50}
                                              height={50}
                                              alt=''
                                              draggable='false'
                                            />
                                          </Col>
                                          <Col
                                            lg={7}
                                            md={7}
                                            sm={12}
                                            className={
                                              styles["group-head-info"]
                                            }>
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className='mt-1'>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
                                                      }>
                                                      {data.data.name}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "Designation-create-group"
                                                        ]
                                                      }>
                                                      {data.data.designation}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "email-create-group"
                                                        ]
                                                      }>
                                                      <a>
                                                        {data.data.emailAddress}
                                                      </a>
                                                    </span>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={12}
                                              className='mt-0  d-flex justify-content-center'>
                                              <img
                                                src={CrossIcon}
                                                className='cursor-pointer'
                                                alt=''
                                                width={18}
                                                onClick={() =>
                                                  removeMemberHandler(
                                                    data.data.pK_UID
                                                  )
                                                }
                                                draggable='false'
                                              />
                                            </Col>
                                          </>
                                        </Row>
                                      </section>
                                    </Col>
                                  );
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}>
                                {t("No-group-heads-found")}
                              </Col>
                            )}
                          </Row>

                          <Row className='mt-3'>
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["members-create-group-page"]}>
                                {t("Members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className='mt-2'>
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data) => {
                                if (data.role === 1) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}>
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data.data.displayProfilePictureName}`}
                                              width={50}
                                              height={50}
                                              alt=''
                                              draggable='false'
                                            />
                                          </Col>
                                          <Col
                                            lg={7}
                                            md={7}
                                            sm={12}
                                            className={
                                              styles["group-head-info"]
                                            }>
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className='mt-1'>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
                                                      }>
                                                      {data.data.name}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "Designation-create-group"
                                                        ]
                                                      }>
                                                      {data.data.designation}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "email-create-group"
                                                        ]
                                                      }>
                                                      <a>
                                                        {data.data.emailAddress}
                                                      </a>
                                                    </span>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={12}
                                            className='mt-0  d-flex justify-content-center'>
                                            <img
                                              src={CrossIcon}
                                              width={18}
                                              alt=''
                                              className='cursor-pointer'
                                              onClick={() =>
                                                removeMemberHandler(
                                                  data.data.pK_UID
                                                )
                                              }
                                              draggable='false'
                                            />
                                          </Col>
                                        </Row>
                                      </section>
                                    </Col>
                                  );
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}>
                                {t("No-group-memebers-found")}
                              </Col>
                            )}
                          </Row>
                        </Col>
                      </Row>
                      {/* till this point the scroll will be applied  */}
                    </Col>
                    <Col lg={6} md={6} sm={6}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <Row>
                            <Col lg={12} md={12} sm={12}>
                              <span className={styles["Addmembers-class"]}>
                                {t("Add-Members")}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={12}
                              lg={12}
                              sm={12}
                              className='group-fields'>
                              <Select
                                options={allPresenters}
                                maxMenuHeight={140}
                                onChange={onChangeSearch}
                                value={
                                  presenterValue.value === 0
                                    ? null
                                    : presenterValue
                                }
                                placeholder={t("Search-member-here") + " *"}
                                filterOption={filterFunc}
                              />
                            </Col>
                          </Row>
                          <Row className='mt-3'>
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                             >
                           <Select
                                options={groupMembersRolesOptions}
                                onChange={assigntRoleAttendies}
                                value={
                                  groupMembersRolesVal.value !== 0
                                    ? groupMembersRolesVal
                                    : null
                                }
                                placeholder={t("Type")}
                              />
                            </Col>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              className=' d-flex justify-content-end  '>
                              <Button
                                className={styles["ADD-Group-btn"]}
                                text={t("Add")}
                                onClick={handleAddAttendees}
                              />
                            </Col>
                          </Row>
                          {/* from this point add members are starting */}
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={
                                styles["scrollbar-addmember-creategroup"]
                              }>
                              {meetingAttendeesList.length > 0
                                ? meetingAttendeesList.map(
                                    (attendeelist, index) => {
                                      return (
                                        <>
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            className='mt-3'>
                                            <Row className='d-flex gap-2 '>
                                              <Col lg={2} md={2} sm={12}>
                                                <img
                                                  alt=''
                                                  src={`data:image/jpeg;base64,${attendeelist.displayProfilePictureName}`}
                                                  width={50}
                                                  height={50}
                                                  draggable='false'
                                                />
                                              </Col>

                                              <Col
                                                lg={7}
                                                md={7}
                                                sm={12}
                                                className={
                                                  styles[
                                                    "group-head-info-Add-Members"
                                                  ]
                                                }>
                                                <Row className='mt-1'>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
                                                      }>
                                                      {attendeelist.name}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "Designation-create-group"
                                                        ]
                                                      }>
                                                      {attendeelist.designation}
                                                    </span>
                                                  </Col>
                                                </Row>
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "email-create-group"
                                                        ]
                                                      }>
                                                      <a>
                                                        {
                                                          attendeelist.emailAddress
                                                        }
                                                      </a>
                                                    </span>
                                                  </Col>
                                                </Row>
                                              </Col>
                                              <Col
                                                lg={2}
                                                md={2}
                                                sm={12}
                                                className='mt-2 '>
                                                <Checkbox
                                                  checked={
                                                    attendees.includes(
                                                      attendeelist.pK_UID
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                  classNameDiv=''
                                                  onChange={() =>
                                                    checkAttendeeBox(
                                                      attendeelist,
                                                      attendeelist.pK_UID,
                                                      index
                                                    )
                                                  }
                                                  className={
                                                    styles["RememberEmail"]
                                                  }
                                                />
                                              </Col>
                                            </Row>
                                          </Col>
                                        </>
                                      );
                                    }
                                  )
                                : null}
                            </Col>
                          </Row>
                          {/* at this point it is ending  */}
                        </Col>
                      </Row>
                      <Row className='mt-3'>
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Attachments_Heading"]}>
                            {"Attachment"}
                          </span>
                        </Col>
                      </Row>
                      <section className={styles["UpdateGroupAttachments"]}>
                        <Row className='mt-1'>
                          {fileAttachments.length > 0
                            ? fileAttachments.map((data, index) => {
                                return (
                                  <>
                                    <Col lg={4} md={4} sm={4}>
                                      <AttachmentViewer
                                        data={data}
                                        id={0}
                                        handleClickRemove={() =>
                                          handleRemoveFile(data)
                                        }
                                        name={data.DisplayAttachmentName}
                                        fk_UID={userID}
                                      />
                                    </Col>
                                  </>
                                );
                              })
                            : null}
                        </Row>
                      </section>
                      <Row className='mt-2'>
                        <Col lg={12} md={12} sm={12}>
                          <Dragger
                            fileList={[]}
                            {...props}
                            className={
                              styles["dragdrop_attachment_create_resolution"]
                            }>
                            <p className='ant-upload-drag-icon'>
                              <span
                                className={styles["create_resolution_dragger"]}>
                                <img
                                  src={featherupload}
                                  width='18.87px'
                                  height='18.87px'
                                  alt=''
                                  draggable='false'
                                />
                              </span>
                            </p>
                            <p className={styles["ant-upload-text"]}>
                              {t("Drag-&-drop-or")}
                              <span className={styles["Choose_file_style"]}>
                                {t("Choose-file")} {""}
                              </span>
                              <span className={styles["here_text"]}>
                                {t("Here")}
                              </span>
                            </p>
                          </Dragger>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className='d-flex justify-content-end gap-3 mt-4'>
                          <Button
                            className={styles["Cancell-UpgradeGroup-btn"]}
                            text={t("Cancel")}
                            onClick={() => setCloseConfirmationBox(true)}
                          />
                          <Button
                            className={styles["Create-UpgradeGroup-btn"]}
                            text={t("Update")}
                            onClick={handleUpdateGroup}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Paper>
          </Col>
        </Row>
      </section>
      <ConfirmationModal
        showModal={closeConfirmationBox}
        setShowModal={setCloseConfirmationBox}
        cancelBtnClick={() => setCloseConfirmationBox(false)}
        closeBtnClick={() => setUpdateComponentpage(false)}
        onHide={() => setCloseConfirmationBox(false)}
      />
      <Notification
        open={open.open}
        message={open.message}
        setOpen={(status) => setOpen({ ...open, open: status.open })}
        severity={open.severity}
      />
    </>
  );
};

export default UpdateGroupPage;
