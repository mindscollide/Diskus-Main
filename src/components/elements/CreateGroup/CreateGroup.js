import React, { useEffect, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import featherupload from "../../../assets/images/featherupload.svg";
import { Paper } from "@material-ui/core";
import deleteButtonCreateMeeting from "../../../assets/images/cancel_meeting_icon.svg";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  Notification,
  AttachmentViewer,
} from "./../../../components/elements";
import styles from "./CreateGroup.module.css";
import Select from "react-select";

import { useSelector, useDispatch } from "react-redux";
import {
  SaveGroupsDocumentsApiFunc,
  createGroup,
  getGroupMembersRoles,
  getOrganizationGroupTypes,
  saveFilesGroupsApi,
  uploadDocumentsGroupsApi,
} from "../../../store/actions/Groups_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import { Upload } from "antd";

const CreateGroup = ({ setCreategrouppage }) => {
  const { Dragger } = Upload;
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const { assignees, GroupsReducer } = useSelector((state) => state);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [fileSize, setFileSize] = useState(0);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [erorbar, setErrorBar] = useState(false);
  const [fileForSend, setFileForSend] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [createGroupDetails, setCreateGroupDetails] = useState({
    Title: "",
    Description: "",
    isGroupChat: true,
    GroupTypeID: 0,
    CreatorID: 0,
    GroupStatusID: 0,
    GroupMembers: [],
  });

  const GroupeTitle = useRef(null);
  const [groupMembers, setGroupMembers] = useState([]);
  // for   select participant Role Name
  const [folderID, setFolderID] = useState(0);
  const [participantRoleName, setParticipantRoleName] = useState(t("Regular"));
  const participantOptions = [t("Head"), t("Regular")];
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [groupTypeValue, setGroupTypeValue] = useState("");
  const [organizationGroupType, setOrganizationGroupType] = useState([]);
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  // for Participant id's
  const participantOptionsWithIDs = [
    { label: t("Head"), id: 2 },
    { label: t("Regular"), id: 1 },
  ];
  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    GroupeTitle.current.focus();
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t, false));
    dispatch(getGroupMembersRoles(navigate, Data, t));
    dispatch(getOrganizationGroupTypes(navigate, Data, t));
  }, []);

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };

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
                    className="d-flex gap-2 align-items-center"
                  >
                    <img
                      src={`data:image/jpeg;base64,${user?.displayProfilePictureName}`}
                      height="16.45px"
                      width="18.32px"
                      draggable="false"
                      alt=""
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
      let newArr = [];
      GroupsReducer.getOrganizationGroupRoles.map((data, index) => {
        newArr.push({
          label: data.role,
          id: data.groupRoleID,
        });
      });

      setParticipantRoles([...newArr]);
    }
  }, [GroupsReducer.getOrganizationGroupRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (GroupsReducer.getOrganizationGroupTypes !== null) {
      let newArr = [];
      let newArrGroupType = [];
      GroupsReducer.getOrganizationGroupTypes.map((data, index) => {
        newArr.push({
          label: data.type,
          id: data.groupTypeID,
        });
        newArrGroupType.push(data.type);
      });
      setGroupTypeOptions([...newArrGroupType]);
      setOrganizationGroupType([...newArr]);
    }
  }, [GroupsReducer.getOrganizationGroupTypes]);

  // set Meeting Attendees By default creator
  useEffect(() => {
    if (
      meetingAttendeesList !== null &&
      meetingAttendeesList !== undefined &&
      meetingAttendeesList.length > 0
    ) {
      setCreateGroupDetails({
        ...createGroupDetails,
        CreatorID: creatorID,
      });
    }
  }, [meetingAttendeesList]);

  const handleAddAttendees = () => {
    // Create new copies of state variables to avoid state mutations
    const newMeetingAttendees = [...meetingAttendees];
    const newGroupMembers = [...groupMembers];

    // Check if there's a selected user and a role
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      setOpen({
        flag: true,
        message: t("You-can-add-data-from-only-one-form-option-at-a-time"),
      });
    } else if (!participantRoleName) {
      setOpen({
        flag: true,
        message: t("Please-select-a-group-member-type-as-well"),
      });
    } else if (taskAssignedTo !== 0) {
      const foundIndex = newMeetingAttendees.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );

      if (foundIndex === -1) {
        // Find the role ID based on the selected role name
        const roleID = participantOptionsWithIDs.find(
          (data) => data.label === participantRoleName
        )?.id;

        // Add the new attendee to the meeting attendees list
        newMeetingAttendees.push({
          FK_UID: taskAssignedTo,
          FK_GRMRID: roleID,
          FK_GRID: 0,
        });

        // Update the state with the new attendees and role
        setMeetingAttendees(newMeetingAttendees);
        setCreateGroupDetails({
          ...createGroupDetails,
          GroupMembers: newMeetingAttendees,
        });

        // Find the selected user's data and role
        const selectedUser = meetingAttendeesList.find(
          (data) => data.pK_UID === taskAssignedTo
        );
        const role = roleID ? roleID : 0;
        newGroupMembers.push({ data: selectedUser, role });

        // Update the group members list
        setGroupMembers(newGroupMembers);

        // Clear input fields and reset state
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setAttendees([]);
        setPresenterValue({
          value: 0,
          label: "",
          name: "",
        });
      } else {
        setOpen({
          flag: true,
          message: t("User-already-exists"),
        });
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setAttendees([]);
      }
    } else if (attendees.length > 0) {
      let check = false;
      const participantOptionsWithID = participantOptionsWithIDs.find(
        (data) => data.label === participantRoleName
      );

      groupMembers.forEach((data) => {
        attendees.forEach((data2) => {
          if (data.data.pK_UID === data2) {
            check = true;
          }
        });
      });

      if (check === true) {
        setOpen({
          flag: true,
          message: t("User-already-exists"),
        });
        setAttendees([]);
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setPresenterValue({
          value: 0,
          label: "",
          name: "",
        });
      } else if (participantOptionsWithID !== undefined) {
        attendees.forEach((dataID) => {
          newMeetingAttendees.push({
            FK_UID: dataID,
            FK_GRMRID: participantOptionsWithID.id,
            FK_GRID: 0,
          });

          const selectedUser = meetingAttendeesList.find(
            (data) => data.pK_UID === dataID
          );
          const role = participantOptionsWithID.id;
          newGroupMembers.push({ data: selectedUser, role });
        });

        // Update the state with new attendees, group members, and role
        setMeetingAttendees(newMeetingAttendees);
        setGroupMembers(newGroupMembers);
        setCreateGroupDetails({
          ...createGroupDetails,
          GroupMembers: newMeetingAttendees,
        });

        // Clear input fields and reset state
        setAttendees([]);
        setPresenterValue({
          value: 0,
          label: "",
          name: "",
        });
        setParticipantRoleName("");
      } else {
        setOpen({
          flag: true,
          message: t("Please-select-a-group-member-type-as-well"),
        });
        setTaskAssignedTo(0);
        setParticipantRoleName("");
        setTaskAssignedToInput("");
        setAttendees([]);
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-select-at-least-one-member"),
      });
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
      setAttendees([]);
      setPresenterValue({
        value: 0,
        label: "",
        name: "",
      });
    }
  };

  // Group type Change Handler
  const groupTypeChangeHandler = (e, value) => {
    setGroupTypeValue(value);

    let findID = organizationGroupType.find(
      (data, index) => data.label === value
    );

    setCreateGroupDetails({
      ...createGroupDetails,
      GroupTypeID: findID.id,
    });
  };
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
      setCreateGroupDetails({
        ...createGroupDetails,
        Title: value,
      });
    }
    if (name === "groupdescription") {
      setCreateGroupDetails({
        ...createGroupDetails,
        Description: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCreateGroupDetails({
      ...createGroupDetails,
      isGroupChat: e.target.checked,
    });
  };

  // remove member handler
  const removeMemberHandler = (id) => {
    const updatedCreateGroupDetails = {
      ...createGroupDetails,
      GroupMembers: createGroupDetails.GroupMembers.filter(
        (item) => item.FK_UID !== id
      ),
    };
    const meeetingAttendeesdata = meetingAttendees.filter(
      (item) => item.FK_UID !== id
    );
    setMeetingAttendees(meeetingAttendeesdata);

    setCreateGroupDetails(updatedCreateGroupDetails);
    const updatedGroupMembers = groupMembers.filter(
      (item) => item.data.pK_UID !== id
    );
    setGroupMembers(updatedGroupMembers);
  };

  const checkGroupMembers = (GroupMembers) => {
    if (Object.keys(GroupMembers).length > 0) {
      let flag2 = GroupMembers.find((data, index) => data.FK_GRMRID === 2);

      if (flag2 != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleSubmitCreateGroup = async () => {
    if (
      createGroupDetails.Title !== "" &&
      createGroupDetails.Description !== "" &&
      createGroupDetails.GroupTypeID !== 0 &&
      createGroupDetails.CreatorID !== 0
    ) {
      if (!checkGroupMembers(createGroupDetails.GroupMembers)) {
        setOpen({
          flag: true,
          message: t("Please-add-atleast-one-group-head"),
        });
      } else {
        setErrorBar(false);
        let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
        let Data = {
          GroupDetails: {
            CreatorID: createGroupDetails.CreatorID,
            title: createGroupDetails.Title,
            Description: createGroupDetails.Description,
            FK_GRTID: createGroupDetails.GroupTypeID,
            FK_GRSID: 1,
            IsTalk: createGroupDetails.isGroupChat,
            OrganizationID: OrganizationID,
          },
          GroupMembers: meetingAttendees,
        };

        dispatch(createGroup(navigate, Data, t, setCreategrouppage));
      }
    } else {
      setErrorBar(true);
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      setAttendees((prevFiles) =>
        prevFiles.filter((attnedeeID) => attnedeeID !== id)
      );
    } else {
      setAttendees([...attendees, id]);
    }
  };

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

      if (fileAttachments.length > 9) {
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

        let fileExists = fileAttachments.some(
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

  const handleRemoveFile = (index) => {
    const updatedFies = [...fileAttachments];
    updatedFies.splice(index, 1);
    setFileAttachments(updatedFies);
  };

  const GroupsDocumentCallUpload = async (folderID) => {
    let newFolder = [];
    let newfile = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsGroupsApi(
            navigate,
            t,
            newData,
            folderID,
            // newFolder,
            newfile
          )
        );
      });
      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      await dispatch(
        saveFilesGroupsApi(navigate, t, newfile, folderID, newFolder)
      );
    }

    let groupID = localStorage.getItem("groupID");

    let Data = {
      GroupID: Number(groupID),
      UpdateFileList: newFolder.map((data, index) => {
        return { PK_FileID: data.pK_FileID };
      }),
    };
    dispatch(SaveGroupsDocumentsApiFunc(navigate, Data, t, setCreategrouppage));
  };

  useEffect(() => {
    if (GroupsReducer.FolderID !== 0) {
      setFolderID(GroupsReducer.FolderID);
      let folderIDCreated = GroupsReducer.FolderID;
      GroupsDocumentCallUpload(folderIDCreated);
    }
  }, [GroupsReducer.FolderID]);

  const filterFunc = (options, searchText) => {
    //
    if (options.data.name.toLowerCase().includes(searchText.toLowerCase())) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <>
      <section className=" color-5a5a5a">
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-start "
          >
            <span className={styles["Create-Group-Heading"]}>
              {t("Create-new-group")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Paper className={styles["Create-Group-paper"]}>
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
                      <Row className="mt-3">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="Group_input_field "
                        >
                          <Form.Control
                            applyClass="form-control2"
                            ref={GroupeTitle}
                            type="text"
                            maxLength={300}
                            placeholder={t("Group-title")}
                            required={true}
                            value={createGroupDetails.Title}
                            onChange={onChangeFunc}
                            name="tasktitle"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && createGroupDetails.Title === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Group-title-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="Group_input_field CreateMeetingInput "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="8"
                            value={createGroupDetails.Description}
                            maxLength={500}
                            placeholder={t("Group-Description")}
                            required={true}
                            change={onChangeFunc}
                            name="groupdescription"
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && createGroupDetails.Description === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Group-description-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row className="mt-1">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["CheckBoxalign"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="UpdateCheckbox Saved_money_Tagline"
                            >
                              <Checkbox
                                className="SearchCheckbox "
                                name="IsChat"
                                label2Class={styles["Label_Of_CheckBox"]}
                                label2={t("Create-talk-group")}
                                checked={createGroupDetails.isGroupChat}
                                onChange={CheckBoxHandler}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col
                          lg={5}
                          md={5}
                          sm={5}
                          className="group-type-select-field m-0 CreateMeetingReminder"
                        >
                          <SelectBox
                            name="grouptype"
                            placeholder={t("Group-Type-Group")}
                            option={groupTypeOptions}
                            change={groupTypeChangeHandler}
                            value={groupTypeValue}
                          />
                        </Col>
                        <Row>
                          <Col
                            className={styles["create-grouperror-type-heading"]}
                          >
                            <p
                              className={
                                erorbar && groupTypeValue === ""
                                  ? styles["errorMessage"]
                                  : styles["errorMessage_hidden"]
                              }
                            >
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
                          className={styles["scroll-bar-creategroup"]}
                        >
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["Create-group-Head-Heading"]}
                              >
                                {t("Group-head")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((renderdata, index) => {
                                if (renderdata.role === 2) {
                                  return (
                                    <>
                                      <Col lg={6} md={6} sm={6}>
                                        <section
                                          className={
                                            styles["Outer_Border-Line"]
                                          }
                                        >
                                          <Row>
                                            <Col lg={3} md={3} sm={12}>
                                              <img
                                                src={`data:image/jpeg;base64,${renderdata.data.displayProfilePictureName}`}
                                                width={50}
                                                alt=""
                                                height={50}
                                                draggable="false"
                                              />
                                            </Col>
                                            <Col
                                              lg={7}
                                              md={7}
                                              sm={7}
                                              className={
                                                styles["group-head-info"]
                                              }
                                            >
                                              <Row className="mt-1">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "name-create-group"
                                                      ]
                                                    }
                                                  >
                                                    {renderdata.data.name}
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
                                                    }
                                                  >
                                                    {
                                                      renderdata.data
                                                        .designation
                                                    }
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
                                                    }
                                                  >
                                                    <a>
                                                      {" "}
                                                      {
                                                        renderdata.data
                                                          .emailAddress
                                                      }
                                                    </a>
                                                  </span>
                                                </Col>
                                              </Row>
                                            </Col>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={2}
                                              className="d-flex align-items-center"
                                            >
                                              <img
                                                src={deleteButtonCreateMeeting}
                                                className="cursor-pointer"
                                                width={20}
                                                height={20}
                                                alt=""
                                                onClick={() =>
                                                  removeMemberHandler(
                                                    renderdata.data.pK_UID
                                                  )
                                                }
                                                draggable="false"
                                              />
                                            </Col>
                                          </Row>
                                        </section>
                                      </Col>
                                    </>
                                  );
                                }
                              })
                            ) : (
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["no-members-found"]}
                                >
                                  {t("No-group-heads-found")}
                                </Col>
                              </>
                            )}
                          </Row>
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={styles["members-create-group-page"]}
                              >
                                {t("Members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 1) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}
                                      >
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data.data.displayProfilePictureName}`}
                                              width={50}
                                              alt=""
                                              height={50}
                                              draggable="false"
                                            />
                                          </Col>
                                          <Col
                                            lg={7}
                                            md={7}
                                            sm={7}
                                            className={
                                              styles["group-head-info"]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles["name-create-group"]
                                                  }
                                                >
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
                                                  }
                                                >
                                                  {data.data.designation}
                                                </span>
                                              </Col>
                                            </Row>
                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles["email-create-group"]
                                                  }
                                                >
                                                  <a>
                                                    {" "}
                                                    {data.data.emailAddress}
                                                  </a>
                                                </span>
                                              </Col>
                                            </Row>
                                          </Col>
                                          <Col
                                            lg={2}
                                            md={2}
                                            sm={2}
                                            className="d-flex align-items-center"
                                          >
                                            <img
                                              alt=""
                                              src={deleteButtonCreateMeeting}
                                              width={20}
                                              className="cursor-pointer"
                                              height={20}
                                              onClick={() =>
                                                removeMemberHandler(
                                                  data.data.pK_UID
                                                )
                                              }
                                              draggable="false"
                                            />
                                          </Col>
                                        </Row>
                                      </section>
                                    </Col>
                                  );
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-members-found"]}
                              >
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
                                {t("Add-members") + "*"}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={12}
                              lg={12}
                              sm={12}
                              className="group-fields"
                            >
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
                          <Row className="mt-4">
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="group-select-field  CreateMeetingReminder   "
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Type")}
                                option={participantOptions}
                                value={participantRoleName}
                                change={assigntRoleAttendies}
                              />
                            </Col>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              className=" d-flex justify-content-end"
                            >
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
                              }
                            >
                              {meetingAttendeesList.length > 0
                                ? meetingAttendeesList.map(
                                    (attendeelist, index) => {
                                      return (
                                        <>
                                          <Col
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            className="mt-3"
                                          >
                                            <Row className="d-flex gap-2">
                                              <Col lg={2} md={2} sm={12}>
                                                <img
                                                  src={`data:image/jpeg;base64,${attendeelist.displayProfilePictureName}`}
                                                  width={50}
                                                  height={50}
                                                  alt=""
                                                  draggable="false"
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
                                                }
                                              >
                                                <Row className="mt-1">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
                                                      }
                                                    >
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
                                                      }
                                                    >
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
                                                      }
                                                    >
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
                                                className="mt-2 "
                                              >
                                                <Checkbox
                                                  checked={
                                                    attendees.includes(
                                                      attendeelist.pK_UID
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                  classNameDiv=""
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
                      <Row className="mt-3">
                        <Col lg={12} md={12} sm={12}>
                          <span className={styles["Attachments_Heading"]}>
                            {"Attachment"}
                          </span>
                        </Col>
                      </Row>
                      <section className={styles["CreateGroupAttachments"]}>
                        <Row>
                          {fileAttachments.length > 0
                            ? fileAttachments.map((data, index) => {
                                return (
                                  <>
                                    <Col lg={4} md={4} sm={4}>
                                      <AttachmentViewer
                                        data={data}
                                        name={data.DisplayAttachmentName}
                                        fk_UID={creatorID}
                                        id={0}
                                        handleClickRemove={() => {
                                          handleRemoveFile(index);
                                        }}
                                      />
                                    </Col>
                                  </>
                                );
                              })
                            : null}
                        </Row>
                      </section>
                      <Row className="mt-2">
                        <Col lg={12} md={12} sm={12}>
                          <Dragger
                            fileList={[]}
                            {...props}
                            className={
                              styles["dragdrop_attachment_create_resolution"]
                            }
                          >
                            <p className="ant-upload-drag-icon">
                              <span
                                className={styles["create_resolution_dragger"]}
                              >
                                <img
                                  src={featherupload}
                                  width="18.87px"
                                  alt=""
                                  height="18.87px"
                                  draggable="false"
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
                          className="d-flex justify-content-end gap-3 mt-4"
                        >
                          <Button
                            className={styles["Cancell-CreateGroup-btn"]}
                            text={t("Cancel")}
                            onClick={() => setCloseConfirmationBox(true)}
                          />
                          <Button
                            className={styles["Create-CreateGroup-btn"]}
                            text={t("Create")}
                            onClick={handleSubmitCreateGroup}
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
        closeBtnClick={() => setCreategrouppage(false)}
        onHide={() => setCloseConfirmationBox(false)}
        cancelBtnClick={() => setCloseConfirmationBox(false)}
        setShowModal={setCloseConfirmationBox}
      />
      <Notification setOpen={setOpen} open={open.flag} message={open.message} />
    </>
  );
};

export default CreateGroup;
