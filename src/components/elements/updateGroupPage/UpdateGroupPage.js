import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import featherupload from "../../../assets/images/featherupload.svg";
import Leftploygon from "../../../assets/images/Polygon 3.svg";
import file_image from "../../../assets/images/file_image.svg";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import Rightploygon from "../../../assets/images/Polygon right.svg";
import { Paper } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
  Loader,
} from "./../../../components/elements";
import userImage from "../../../assets/images/user.png";
import styles from "./UpadateGroup.module.css";
import CrossIcon from "../../../assets/images/cancel_meeting_icon.svg";
import Groups from "../../../container/Groups/Groups";
import { useDispatch, useSelector } from "react-redux";
import {
  RetriveDocumentsGroupsApiFunc,
  SaveGroupsDocumentsApiFunc,
  getGroupMembersRoles,
  getOrganizationGroupTypes,
  updateGroup,
  uploadDocumentsGroupsApi,
} from "../../../store/actions/Groups_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import CustomModal from "../modal/Modal";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import { Upload } from "antd";

const UpdateGroupPage = ({ setUpdateComponentpage }) => {
  const { Dragger } = Upload;
  const creatorID = JSON.parse(localStorage.getItem("userID"));
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [fileForSend, setFileForSend] = useState([]);
  const navigate = useNavigate();
  const [viewUpdateGroup, setViewUpdateGroup] = useState(true);
  const { t } = useTranslation();
  const [open, setOpen] = useState({
    flag: false,
    message: "",
  });
  const [erorbar, setErrorBar] = useState(false);
  const { assignees, GroupsReducer, DataRoomReducer } = useSelector(
    (state) => state
  );
  const dispatch = useDispatch();
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [folderID, setFolderID] = useState(0);
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
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

  const [onclickFlag, setOnclickFlag] = useState(false);
  const [membersData, setMembersData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("");
  const participantOptions = [t("Head"), t("Regular")];
  const [groupTypeOptions, setGroupTypeOptions] = useState([]);
  const [participantRoles, setParticipantRoles] = useState([]);
  const [previousFileIDs, setPreviousFileIDs] = useState([]);
  const [groupTypeValue, setGroupTypeValue] = useState("");
  const [organizationGroupType, setOrganizationGroupType] = useState([]);
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
    dispatch(allAssignessList(navigate, t));
    dispatch(getGroupMembersRoles(navigate, Data, t));
    dispatch(getOrganizationGroupTypes(navigate, Data, t));
  }, []);

  //Drop Down Values
  // const searchFilterHandler = (value) => {
  //   let allAssignees = assignees.user;
  //   if (
  //     allAssignees != undefined &&
  //     allAssignees != null &&
  //     allAssignees != NaN &&
  //     allAssignees != []
  //   ) {
  //     return allAssignees
  //       .filter((item) => {
  //         const searchTerm = value.toLowerCase();
  //         const assigneesName = item.name.toLowerCase();
  //         return (
  //           searchTerm &&
  //           assigneesName.startsWith(searchTerm) &&
  //           assigneesName !== searchTerm
  //         );
  //       })
  //       .slice(0, 3)
  //       .map((item) => (
  //         <div
  //           onClick={() => onSearch(item.name, item.pK_UID)}
  //           className="dropdown-row-assignee d-flex flex-row align-items-center"
  //           key={item.pK_UID}
  //         >
  //           <img src={userImage} />
  //           <p className="p-0 m-0">{item.name}</p>
  //         </div>
  //       ));
  //   } else {
  //   }
  // };
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
            searchTerm && assigneesName.startsWith(searchTerm)
            // assigneesName !== searchTerm.toLowerCase()
          );
        })
        .slice(0, 10)
        .map((item) => (
          <div
            onClick={() => onSearch(item.name, item.pK_UID)}
            className="dropdown-row-assignee d-flex align-items-center flex-row"
            key={item.pK_UID}
          >
            {}
            <img
              src={`data:image/jpeg;base64,${item.displayProfilePictureName}`}
              alt=""
              className="user-img"
              draggable="false"
            />
            <p className="p-0 m-0">{item.name}</p>
          </div>
        ));
    } else {
    }
  };

  const onSearch = (name, id) => {
    setOnclickFlag(true);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
  };

  // for meatings  Attendees

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };

  const handleAddAttendees = () => {
    const newMeetingAttendees = [...membersData];
    const newGroupMembers = [...groupMembers];
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      setOpen({
        flag: true,
        message: t("You-can-add-data-only-from-one-form-option-at-a-time"),
      });
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("");
      setTaskAssignedToInput("");
    } else if (taskAssignedTo !== 0) {
      var foundIndex = membersData.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );

      if (participantRoleName === "") {
        setOpen({
          flag: true,
          message: t("Please-select-group-member-type-also"),
        });
      } else {
        if (foundIndex === -1) {
          let roleID;
          participantRoles.map((data, index) => {
            if (data.label === participantRoleName) {
              roleID = data.id;
              newMeetingAttendees.push({
                FK_UID: taskAssignedTo, //userid
                FK_GRMRID: data.id, //group member role id
                FK_GRID: 0, //group id
              });
              setMembersData(newMeetingAttendees);
            }
            setGroupDetails({
              ...GroupDetails,
              GroupMembers: newMeetingAttendees,
            });
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === taskAssignedTo) {
                newGroupMembers.push({
                  data,
                  role: roleID,
                });

                setGroupMembers(newGroupMembers);
              }
            });
          }

          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        } else {
          setOpen({
            flag: true,
            message: t("User-already-exist"),
          });
          setTaskAssignedTo(0);
          setParticipantRoleName("");
          setTaskAssignedToInput("");
        }
      }
    } else if (attendees.length > 0) {
      let check = false;
      let participantOptionsWithID =
        participantOptionsWithIDs &&
        participantOptionsWithIDs.find(
          (data, index) => data.label === participantRoleName
        );
      attendees.map((data, index) => {
        membersData.map((data2, index) => {
          if (data === data2.FK_UID) {
            check = true;
          }
        });
      });
      if (check === true) {
        setOpen({
          flag: true,
          message: t("User-already-exist"),
        });
        setAttendees([]);
        setParticipantRoleName("");
      } else {
        if (participantOptionsWithID !== undefined) {
          attendees.forEach((dataID, index) => {
            newMeetingAttendees.push({
              FK_UID: dataID, //userid
              FK_GRMRID: participantOptionsWithID.id, //group member role id
              FK_GRID: 0, //group id
            });
            setMembersData(newMeetingAttendees);
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
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
        } else {
          setOpen({
            flag: true,
            message: t("Please-select-group-member-type-also"),
          });
        }
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-select-atleast-one-members"),
      });
    }
  };

  const groupTypeChangeHandler = (e, value) => {
    setGroupTypeValue(value);
    let findID = organizationGroupType.find(
      (data, index) => data.label === value
    );
    setGroupDetails({
      ...GroupDetails,
      GroupStatusID: findID.id,
    });
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    if (assignees.user.length > 0) {
      setMeetingAttendeesList(assignees.user);
    }
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

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false);
    if (e.target.value.trimStart() != "") {
      setTaskAssignedToInput(e.target.value.trimStart());
    } else {
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
      setTaskAssignedName("");
    }
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

  const checkGroupMembers = (GroupMembers) => {
    if (Object.keys(GroupMembers).length > 0) {
      let flag1 = GroupMembers.find((data, index) => data.FK_GRMRID === 1);
      let flag2 = GroupMembers.find((data, index) => data.FK_GRMRID === 2);

      if (flag1 != undefined && flag2 != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const checkGroupHead = (groupMembers) => {
    let flag1 = groupMembers.findIndex((data, index) => data.FK_GRMRID === 2);
    return flag1;
  };

  const handleUpdateGroup = () => {
    if (
      GroupDetails.Title !== "" &&
      GroupDetails.Description !== "" &&
      GroupDetails.GroupTypeID !== 0
    ) {
      if (Object.keys(membersData).length === 0) {
        setOpen({
          flag: true,
          message: t("Please-add-atleast-one-group-head-and-one-group-member"),
        });
      } else {
        if (!checkGroupMembers(membersData)) {
          setOpen({
            flag: true,
            message: t(
              "Please-add-atleast-one-group-head-and-one-group-member"
            ),
          });
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
          dispatch(updateGroup(navigate, Data, t, setUpdateComponentpage));
        }
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

      console.log(
        GroupsReducer.getGroupByGroupIdResponse.isTalk,
        "groupDetailsgroupDetailsgroupDetails"
      );
      let newArr = [];
      let newData = [];
      if (groupDetails.groupMembers.length > 0) {
        groupDetails.groupMembers.map((memberData, index) => {
          newArr.push({
            FK_UID: memberData.pK_UID,
            FK_GRMRID: memberData.groupRole.groupRoleID,
            FK_GRID: memberData.groupID,
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.map((data, index) => {
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
      let flag = false;
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
  //Sliders For Attachments

  console.log(fileForSend, "fileForSendfileForSend");
  console.log(fileAttachments, "fileForSendfileForSend");

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

  const handleRemoveFile = (index) => {
    const updatedFies = [...fileAttachments];
    updatedFies.splice(index, 1);
    setFileAttachments(updatedFies);

    const updateFileForSend = [...fileForSend];
    updateFileForSend.splice(index, 1);
    setFileForSend(updateFileForSend);
  };

  // const handleRemoveFile = (data) => {
  //   setFileForSend((prevFiles) =>
  //     prevFiles.filter(
  //       (fileSend) => fileSend.name !== data.DisplayAttachmentName
  //     )
  //   );

  //   setPreviousFileIDs((prevFiles) =>
  //     prevFiles.filter(
  //       (fileSend) =>
  //         fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
  //     )
  //   );

  //   setFileAttachments((prevFiles) =>
  //     prevFiles.filter(
  //       (fileSend) =>
  //         fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
  //     )
  //   );
  // };

  useEffect(() => {
    if (
      GroupsReducer.groupDocuments !== null &&
      GroupsReducer.groupDocuments !== undefined
    ) {
      if (GroupsReducer.groupDocuments.data.length > 0) {
        setFolderID(GroupsReducer.groupDocuments.folderID);
        let retirveArray = [];
        let PrevIds = [];
        GroupsReducer.groupDocuments.data.map((docsData, docsDataindex) => {
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
    const uploadPromises = fileForSend.map(async (newData) => {
      await dispatch(
        uploadDocumentsGroupsApi(navigate, t, newData, folderID, newfile)
      );
    });
    // Wait for all promises to resolve
    await Promise.all(uploadPromises);

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

  return (
    <>
      <section className="MontserratSemiBold-600 color-5a5a5a">
        <Row className="mt-3">
          <Col
            lg={12}
            md={12}
            sm={12}
            className="d-flex justify-content-start "
          >
            <span className={styles["Create-Group-Heading"]}>
              {t("Update-group")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
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
                          className="group-fields CreateMeetingInput"
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            placeholder={t("Task-title")}
                            maxLength={300}
                            required={true}
                            name="tasktitle"
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
                          className="CreateMeetingInput Saved_money_Tagline"
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            rows="4"
                            name="groupdescription"
                            maxLength={500}
                            change={onChangeFunc}
                            placeholder={t("Description")}
                            required={true}
                            value={GroupDetails.Description}
                            // className={styles["Height-of-textarea"]
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
                          className={styles["Checkbox"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="Update-committee-Checkbox Saved_money_Tagline"
                            >
                              <Checkbox
                                className="SearchCheckbox MontserratSemiBold-600"
                                name="IsChat"
                                disabled={
                                  GroupsReducer?.getGroupByGroupIdResponse
                                    ?.isTalk
                                    ? true
                                    : false
                                }
                                label2Class={styles["Label_Of_CheckBox"]}
                                label2={t("Create-talk-group")}
                                // checked={createMeeting.IsChat}
                                onChange={CheckBoxHandler}
                                checked={GroupDetails.isGroupChat}
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
                          className="group-type-select-field CreateMeetingReminder m-0 select-participant-box"
                        >
                          <SelectBox
                            name="grouptype"
                            placeholder={t("Group-type")}
                            option={groupTypeOptions}
                            change={groupTypeChangeHandler}
                            value={groupTypeValue}
                          />
                        </Col>
                        <Row>
                          <Col className="d-flex justify-content-end">
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

                          {/* Group Heads */}
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 2) {
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
                                              styles["group-head-info"]
                                            }
                                          >
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className="mt-1"
                                              >
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
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
                                                        styles[
                                                          "email-create-group"
                                                        ]
                                                      }
                                                    >
                                                      <a>
                                                        {data.data.emailAddress}
                                                      </a>
                                                    </span>
                                                  </Col>
                                                </Row>
                                              </Col>
                                            </Row>
                                          </Col>
                                          {/* {data.data.pK_UID !== GroupDetails.CreatorID && ( */}
                                          <>
                                            <Col
                                              lg={2}
                                              md={2}
                                              sm={12}
                                              className="mt-0  d-flex justify-content-center"
                                            >
                                              <img
                                                src={CrossIcon}
                                                className="cursor-pointer"
                                                width={18}
                                                onClick={() =>
                                                  removeMemberHandler(
                                                    data.data.pK_UID
                                                  )
                                                }
                                                draggable="false"
                                              />
                                            </Col>
                                          </>
                                          {/* )} */}
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
                                className={styles["no-member"]}
                              >
                                {t("No-group-heads-found")}
                              </Col>
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
                                              styles["group-head-info"]
                                            }
                                          >
                                            <Row>
                                              <Col
                                                lg={12}
                                                md={12}
                                                sm={12}
                                                className="mt-1"
                                              >
                                                <Row>
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-group"
                                                        ]
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
                                                        styles[
                                                          "email-create-group"
                                                        ]
                                                      }
                                                    >
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
                                            className="mt-0  d-flex justify-content-center"
                                          >
                                            <img
                                              src={CrossIcon}
                                              width={18}
                                              className="cursor-pointer"
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
                                className={styles["no-member"]}
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
                                {t("Add-Members")}
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
                              <InputSearchFilter
                                placeholder="Search member here"
                                value={taskAssignedToInput}
                                filteredDataHandler={searchFilterHandler(
                                  taskAssignedToInput
                                )}
                                change={onChangeSearch}
                                onclickFlag={onclickFlag}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="group-select-field CreateMeetingReminder "
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
                              className=" d-flex justify-content-end  "
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
                                            <Row className="d-flex gap-2 ">
                                              <Col lg={2} md={2} sm={12}>
                                                <img
                                                  // src={Newprofile}
                                                  alt=""
                                                  src={`data:image/jpeg;base64,${attendeelist.displayProfilePictureName}`}
                                                  width={50}
                                                  height={50}
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
                                                  // checked={false}
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
                      <Row className="mt-1">
                        <Col lg={1} md={1} sm={1} className="mt-4">
                          {fileAttachments.length > 2 ? (
                            <>
                              <Button
                                icon={
                                  <img
                                    src={Leftploygon}
                                    width="20px"
                                    height="15px"
                                    draggable="false"
                                  />
                                }
                                onClick={SlideLeft}
                                className={styles["Leftpolygon"]}
                              />
                            </>
                          ) : null}
                        </Col>
                        <Col lg={10} md={10} sm={10}>
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="ScrolllerFiles_Committees"
                              id="Slider"
                            >
                              {fileAttachments.length > 0
                                ? fileAttachments.map((data, index) => {
                                    return (
                                      <>
                                        <Col
                                          lg={4}
                                          md={4}
                                          sm={12}
                                          className="position-relative gap-2"
                                        >
                                          <span
                                            className={
                                              styles["Crossicon_Class"]
                                            }
                                          >
                                            <img
                                              src={CrossIcon}
                                              height="12.68px"
                                              alt=""
                                              width="12.68px"
                                              onClick={() =>
                                                handleRemoveFile(data)
                                              }
                                            />
                                          </span>
                                          <section
                                            className={styles["Outer_Box"]}
                                          >
                                            <Row>
                                              <Col lg={12} md={12} sm={12}>
                                                <img
                                                  src={file_image}
                                                  width={"100%"}
                                                  alt=""
                                                  draggable="false"
                                                />
                                              </Col>
                                            </Row>

                                            <section
                                              className={
                                                styles["backGround_name_Icon"]
                                              }
                                            >
                                              <Row className="mb-2">
                                                <Col
                                                  lg={12}
                                                  md={12}
                                                  sm={12}
                                                  className={
                                                    styles["IconTextClass"]
                                                  }
                                                >
                                                  <img
                                                    src={pdfIcon}
                                                    height="10px"
                                                    width="10px"
                                                    className={
                                                      styles["IconPDF"]
                                                    }
                                                  />
                                                  <span
                                                    className={
                                                      styles["FileName"]
                                                    }
                                                  >
                                                    {data.DisplayAttachmentName}
                                                  </span>
                                                </Col>
                                              </Row>
                                            </section>
                                          </section>
                                        </Col>
                                      </>
                                    );
                                  })
                                : null}
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={1} md={1} sm={1} className="mt-4">
                          {fileAttachments.length > 2 ? (
                            <>
                              <Button
                                icon={
                                  <img
                                    src={Rightploygon}
                                    width="20px"
                                    height="15px"
                                    draggable="false"
                                  />
                                }
                                onClick={Slideright}
                                className={styles["Leftpolygon"]}
                              />
                            </>
                          ) : null}
                        </Col>
                      </Row>
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
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default UpdateGroupPage;
