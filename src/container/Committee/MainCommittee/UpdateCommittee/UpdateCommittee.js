import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Checkbox,
  Notification,
  AttachmentViewer,
} from "../../../../components/elements";
import styles from "./UpdateCommittee.module.css";
import CrossIcon from "../../../../assets/images/CrossIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import featherupload from "../../../../assets/images/featherupload.svg";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import Select from "react-select";
import {
  getCommitteeMembersRole,
  getCommitteeTypes,
  saveCommitteeDocumentsApi,
  saveFilesCommitteesApi,
  updateCommittee,
  uploadDocumentsCommitteesApi,
} from "../../../../store/actions/Committee_actions";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/elements/confirmationModal/ConfirmationModal";
import { Upload } from "antd";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import { maxFileSize } from "../../../../commen/functions/utils";
import { isFileSizeValid } from "../../../../commen/functions/convertFileSizeInMB";

const UpdateCommittee = ({ setUpdateComponentpage }) => {
  const { Dragger } = Upload;
  const CommitteeReducergetCommitteeMembersRoles = useSelector(
    (state) => state.CommitteeReducer.getCommitteeMembersRoles
  );

  const CommitteeReducergetCommitteeTypes = useSelector(
    (state) => state.CommitteeReducer.getCommitteeTypes
  );

  const CommitteeReducercreateUpdateCommitteeDataroom = useSelector(
    (state) => state.CommitteeReducer.createUpdateCommitteeDataroom
  );

  const CommitteeReducergetCommitteeByCommitteeID = useSelector(
    (state) => state.CommitteeReducer.getCommitteeByCommitteeID
  );

  const CommitteeReducerreteriveCommitteeDocuments = useSelector(
    (state) => state.CommitteeReducer.reteriveCommitteeDocuments
  );

  const assigneesuser = useSelector((state) => state.assignees.user);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [membersData, setMembersData] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [erorbar, setErrorBar] = useState(false);
  const [folderID, setFolderId] = useState(0);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [filesSending, setFilesSending] = useState([]);

  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  // Committee Members Value
  const [committeeMembersRolesVal, setCommitteeMembersRolesVal] = useState({
    label: "",
    value: 0,
  });
  // Committee Members Options
  const [committeeMembersRolesOptions, setCommitteeMembersRolesOptions] =
    useState([]);

  // Committee Type Value
  const [committeeTypesVal, setCommitteeTypesVal] = useState({
    label: "",
    value: 0,
  });

  // Committee Type Options
  const [newCommitteeTypeOptions, setNewCommitteeTypeOptions] = useState([]);
  const { t } = useTranslation();
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: 0,
    committeeStatus: 0,
    committeeID: 0,
    CreatorID: 0,
  });

  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });
  const closebtn = async () => {
    setUpdateComponentpage(false);
  };
  const InputFielsChangeHandler = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    if (name === "committeeTitle") {
      setCommitteeData({
        ...committeeData,
        committeeTitle: value,
      });
    }
    if (name === "committeeDescription") {
      setCommitteeData({
        ...committeeData,
        committeeDescription: value,
      });
    }
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCommitteeData({
      ...committeeData,
      isTalkGroup: e.target.checked,
    });
  };

  //Input Field Assignee Change
  const onChangeSearch = (item) => {
    setPresenterValue(item);
    setTaskAssignedTo(item.value);
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
  const changeHandlerCommitteeMemberRole = (event) => {
    setCommitteeMembersRolesVal(event);
  };
  const changeCommitteeType = (event) => {
    setCommitteeTypesVal(event);
    setCommitteeData({
      ...committeeData,
      committeeType: event.value,
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

  // add members in state
  const handleAddAttendees = () => {
    let newGroupMembers = [...groupMembers];
    let findRegularRole = committeeMembersRolesOptions.find(
      (roleOpt) => roleOpt.label === "Regular"
    );
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      showMessage(
        t("You-can-add-data-only-from-one-form-option-at-a-time"),
        "error",
        setOpen
      );
      setAttendees([]);
      setTaskAssignedTo(0);
      setCommitteeMembersRolesVal(findRegularRole);
    } else if (taskAssignedTo !== 0) {
      var foundIndex = membersData.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      if (committeeMembersRolesVal.value !== 0) {
        if (foundIndex === -1) {
          // let roleID;
          let newDataForMembers = [];
          // committeeMemberRolesOptions.forEach((data, index) => {
          // if (data.label === participantRoleName) {
          // roleID = data.id;
          newDataForMembers.push({
            FK_UID: taskAssignedTo, //userid
            FK_CMMRID: committeeMembersRolesVal.value, //group member role id
            FK_CMID: 0, //group id
          });
          setMembersData([...membersData, ...newDataForMembers]);
          // }
          // });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === taskAssignedTo) {
                newGroupMembers.push({
                  data,
                  role: committeeMembersRolesVal.value,
                });
                setGroupMembers(newGroupMembers);
              }
            });
          }
          setTaskAssignedTo(0);
          setCommitteeMembersRolesVal(findRegularRole);
          setPresenterValue({
            value: 0,
            label: "",
            name: "",
          });
        } else {
          showMessage(t("User-already-exist"), "error", setOpen);
          setTaskAssignedTo(0);
          setCommitteeMembersRolesVal(findRegularRole);
          setPresenterValue({
            value: 0,
            label: "",
            name: "",
          });
        }
      } else {
        showMessage(
          t("Please-select-committee-member-type-also"),
          "error",
          setOpen
        );
      }
    } else if (attendees.length > 0) {
      let check = false;

      attendees.forEach((data, index) => {
        membersData.forEach((data2, index) => {
          if (data === data2.FK_UID) {
            check = true;
          }
        });
      });
      if (check === true) {
        showMessage(t("User-already-exist"), "error", setOpen);
        setAttendees([]);
        setCommitteeMembersRolesVal(findRegularRole);
      } else {
        if (committeeMembersRolesVal.value !== 0) {
          let newDataForMembers = [];
          attendees.forEach((dataID, index) => {
            newDataForMembers.push({
              FK_UID: dataID, //userid
              FK_CMMRID: committeeMembersRolesVal.value, //group member role id
              FK_CMID: 0, //group id
            });
            setMembersData([...membersData, ...newDataForMembers]);
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: committeeMembersRolesVal.value,
                });
                setGroupMembers(newGroupMembers);
              }
            });
            setAttendees([]);
            setCommitteeMembersRolesVal(findRegularRole);
          });
          setPresenterValue({
            value: 0,
            label: "",
            name: "",
          });
        } else {
          showMessage(
            t("lease-select-committee-member-type-also"),
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
  // for api response of list group roles
  useEffect(() => {
    try {
      if (CommitteeReducergetCommitteeMembersRoles !== null) {
        let committeeMembersRoleOptions = [];
        CommitteeReducergetCommitteeMembersRoles.forEach((data, index) => {
          committeeMembersRoleOptions.push({
            label: data.role,
            value: data.committeeRoleID,
          });
          if (data.committeeRoleID === 1) {
            setCommitteeMembersRolesVal({
              label: data.role,
              value: data.committeeRoleID,
            });
          }
        });
        setCommitteeMembersRolesOptions(committeeMembersRoleOptions);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducergetCommitteeMembersRoles]);

  // for api response of list group Types
  useEffect(() => {
    try {
      if (CommitteeReducergetCommitteeTypes !== null) {
        let committeeTypeOptions = [];
        CommitteeReducergetCommitteeTypes.forEach((data, index) => {
          committeeTypeOptions.push({
            label: data.type,
            value: data.committeeTypeId,
          });
        });
        setNewCommitteeTypeOptions(committeeTypeOptions);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducergetCommitteeTypes]);

  const checkGroupMembers = (GroupMembers) => {
    console.log(GroupMembers, "GroupMembersGroupMembers");
    if (Array.isArray(GroupMembers) && GroupMembers.length > 0) {
      const validIds = [1, 2, 3, 4, 5];
      let hasValidMember = GroupMembers.some((data) =>
        validIds.includes(data.FK_CMMRID)
      );
      return hasValidMember;
    }
    return false;
  };

  const handleClickUpdate = () => {
    if (
      committeeData.committeeTitle !== "" &&
      committeeData.committeeDescription !== "" &&
      committeeData.committeeType !== 0 &&
      committeeData.CreatorID !== 0
    ) {
      if (!checkGroupMembers(membersData)) {
        showMessage(
          t("Please-add-atleast-one-executive-member"),
          "error",
          setOpen
        );
      } else {
        setErrorBar(false);
        let OrganizationID = JSON.parse(localStorage.getItem("organizationID"));
        let Data = {
          CommitteeDetails: {
            CreatorID: committeeData.CreatorID,
            PK_CMID: committeeData.committeeID,
            CommitteesTitle: committeeData.committeeTitle,
            FK_CMSID: committeeData.committeeStatus,
            FK_CMTID: committeeData.committeeType,
            CommitteesDescription: committeeData.committeeDescription,
            ISTalkChatGroup: committeeData.isTalkGroup,
            OrganizationID: OrganizationID,
          },
          CommitteeMembers: membersData,
        };
        dispatch(updateCommittee(navigate, Data, t));
      }
    } else {
      setErrorBar(true);
      showMessage(t("Please fill all the fields"), "error", setOpen);
    }
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    try {
      if (Object.keys(assigneesuser).length > 0) {
        let newData = [];
        setMeetingAttendeesList(assigneesuser);
        assigneesuser.forEach((user, index) => {
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
  }, [assigneesuser]);

  // dispatch apis for committee types and committee member roles
  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t, false));
    dispatch(getCommitteeTypes(navigate, Data, t));
    dispatch(getCommitteeMembersRole(navigate, Data, t));
  }, []);

  useEffect(() => {
    try {
      if (
        CommitteeReducergetCommitteeByCommitteeID !== null &&
        CommitteeReducergetCommitteeByCommitteeID !== undefined
      ) {
        let committeedetails = CommitteeReducergetCommitteeByCommitteeID;
        let newArr = [];
        let newData = [];
        let committeeID = 0;
        if (committeedetails.committeMembers.length > 0) {
          committeedetails.committeMembers.forEach((memberData, index) => {
            committeeID = memberData.committeeID;
            if (meetingAttendeesList.length > 0) {
              meetingAttendeesList.forEach((data, index) => {
                if (data.pK_UID === memberData.pK_UID) {
                  newArr.push({
                    FK_UID: memberData.pK_UID,
                    FK_CMMRID: memberData.committeeRole.committeeRoleID,
                    FK_CMID: memberData.committeeID,
                  });
                  newData.push({
                    data,
                    role: memberData.committeeRole.committeeRoleID,
                  });
                }
              });
            }
          });
        }
        setMembersData(newArr);
        setGroupMembers(newData);
        setCommitteeData({
          ...committeeData,
          CreatorID: committeedetails.creatorID,
          committeeTitle: committeedetails.committeeTitle,
          committeeDescription: committeedetails.committeeDescription,
          isTalkGroup: committeedetails.isTalkChatGroup,
          committeeType: committeedetails.committeeType.committeeTypeId,
          committeeStatus: committeedetails.committeeStatus.committeeStatusID,
          committeeID: committeeID,
        });
        setCommitteeTypesVal({
          label: committeedetails.committeeType.type,
          value: committeedetails.committeeType.committeeTypeId,
        });
      }
    } catch {
      console.log(
        "error in getting data in update committee getCommitteeByCommitteeID"
      );
    }
  }, [CommitteeReducergetCommitteeByCommitteeID, meetingAttendeesList]);

  useEffect(() => {
    if (
      CommitteeReducerreteriveCommitteeDocuments !== null &&
      CommitteeReducerreteriveCommitteeDocuments !== undefined
    ) {
      if (CommitteeReducerreteriveCommitteeDocuments.data.length > 0) {
        let newfolderID = CommitteeReducerreteriveCommitteeDocuments.folderID;
        let filesArr = CommitteeReducerreteriveCommitteeDocuments.data;
        let newArr = [];
        let fileSend = [];
        setFolderId(newfolderID);
        filesArr.forEach((fileData, index) => {
          newArr.push({
            pK_FileID: fileData.pK_FileID,
            DisplayAttachmentName: fileData.displayFileName,
            fk_UserID: fileData.fK_UserID,
          });
          fileSend.push({
            pK_FileID: fileData.pK_FileID,
            DisplayAttachmentName: fileData.displayFileName,
          });
        });
        setFileAttachments(newArr);
        setFilesSending(fileSend);
      }
    }
  }, [CommitteeReducerreteriveCommitteeDocuments]);

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
      let totalFiles = fileList.length + fileAttachments.length;
      let fileSizeArr = fileSize; // Assuming fileSize is already defined somewhere
      let sizezero = true;
      let size = true;

      if (totalFiles > 15) {
        showMessage(t("Not-allowed-more-than-15-files"), "error", setOpen);
        return;
      }

      fileList.forEach((fileData, index) => {
        const { isMorethan } = isFileSizeValid(fileData.size);

        if (!isMorethan) {
          size = false;
        } else if (fileData.size === 0) {
          sizezero = false;
        }

        let fileExists = fileAttachments.some(
          (oldFileData) => oldFileData.DisplayAttachmentName === fileData.name
        );

        if (!size) {
          showMessage(
            t("File-size-should-not-be-greater-than-1-5GB"),
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
    setFileForSend((prevFiles) =>
      prevFiles.filter(
        (fileSend) => fileSend.name !== data.DisplayAttachmentName
      )
    );

    setFilesSending((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );

    setFileAttachments((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );
  };

  const documentsUploadCall = async (folderID) => {
    let newFolder = [...filesSending];
    let fileObj = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsCommitteesApi(navigate, t, newData, folderID, fileObj)
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      //

      await dispatch(
        saveFilesCommitteesApi(navigate, t, fileObj, folderID, newFolder)
      );
    }

    let newData = {
      CommitteeID: Number(committeeData.committeeID),
      UpdateFileList: newFolder.map((fileID) => ({
        PK_FileID: fileID.pK_FileID,
      })),
      // ),
    };

    await dispatch(
      saveCommitteeDocumentsApi(navigate, t, newData, setUpdateComponentpage)
    );
  };

  useEffect(() => {
    if (CommitteeReducercreateUpdateCommitteeDataroom !== 0) {
      let folderIdCreated = CommitteeReducercreateUpdateCommitteeDataroom;
      documentsUploadCall(folderIdCreated);
    }
  }, [CommitteeReducercreateUpdateCommitteeDataroom]);

  const filterFunc = (options, searchText) => {
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
            <span className={styles["Update-Committee-Heading"]}>
              {t("Update-committee")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["Update-Committee-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["details-class-Update-Committee"]}
                          >
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>

                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="create-committee-fields CreateMeetingInput "
                        >
                          <TextField
                            applyClass="form-control2"
                            type="text"
                            name="committeeTitle"
                            placeholder={t("Task-title")}
                            maxLength={300}
                            required={true}
                            change={InputFielsChangeHandler}
                            value={committeeData.committeeTitle}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar && committeeData.committeeTitle === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-title-is-required")}
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
                            name="committeeDescription"
                            maxLength={500}
                            rows="4"
                            placeholder={t("Description")}
                            required={true}
                            change={InputFielsChangeHandler}
                            value={committeeData.committeeDescription}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              committeeData.committeeDescription === ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-description-is-required")}
                          </p>
                        </Col>
                      </Row>

                      <Row className="mt-1">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["CheckboxAlignment"]}
                        >
                          <Row>
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className="Update-committee-Checkbox Saved_money_Tagline"
                            >
                              <Checkbox
                                className="SearchCheckbox "
                                name="IsChat"
                                disabled={
                                  CommitteeReducergetCommitteeByCommitteeID?.isTalkChatGroup
                                    ? true
                                    : false
                                }
                                label2={t("Create-talk-group")}
                                label2Class={styles["Label_Of_CheckBox"]}
                                checked={committeeData.isTalkGroup}
                                onChange={CheckBoxHandler}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={5} md={5} sm={5}>
                          <Select
                            placeholder={t("Committee-type")}
                            onChange={changeCommitteeType}
                            options={newCommitteeTypeOptions}
                            value={
                              committeeTypesVal.value !== 0
                                ? committeeTypesVal
                                : null
                            }
                          />
                        </Col>
                        <Row>
                          <Col className="d-flex justify-content-end">
                            <p
                              className={
                                erorbar &&
                                committeeData.committeeTypeValue === ""
                                  ? styles["errorMessage"]
                                  : styles["errorMessage_hidden"]
                              }
                            >
                              {t("Committee-type-is-required")}
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
                          className={styles["scroll-bar-Update-Committee"]}
                        >
                          {/* Chair person members */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Update-Committee-Head-Heading"]
                                }
                              >
                                {t("Chair-person-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 3) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}
                                      >
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data?.data?.displayProfilePictureName}`}
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
                                              styles["Executive-Member-info"]
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
                                                          "name-Update-Committee"
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
                                                          "Designation-Update-Committee"
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
                                                          "email-Update-Committee"
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
                                            {console.log(
                                              "datadatadatadatadata",
                                              data,
                                              data.data.pK_UID,
                                              committeeData.CreatorID
                                            )}
                                            <img
                                              src={CrossIcon}
                                              className="cursor-pointer"
                                              width={18}
                                              alt=""
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
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}
                              >
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>

                          {/* Vice Chair Person members */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Update-Committee-Head-Heading"]
                                }
                              >
                                {t("Vice-chair-person-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 4) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}
                                      >
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data?.data?.displayProfilePictureName}`}
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
                                              styles["Executive-Member-info"]
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
                                                          "name-Update-Committee"
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
                                                          "Designation-Update-Committee"
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
                                                          "email-Update-Committee"
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
                                            {console.log(
                                              "datadatadatadatadata",
                                              data,
                                              data.data.pK_UID,
                                              committeeData.CreatorID
                                            )}
                                            <img
                                              src={CrossIcon}
                                              className="cursor-pointer"
                                              width={18}
                                              alt=""
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
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}
                              >
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>
                          {/* Secretary */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Update-Committee-Head-Heading"]
                                }
                              >
                                {t("Secretary")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            {groupMembers.length > 0 ? (
                              groupMembers.map((data, index) => {
                                if (data.role === 5) {
                                  return (
                                    <Col lg={6} md={6} sm={6}>
                                      <section
                                        className={styles["Outer_Border-Line"]}
                                      >
                                        <Row>
                                          <Col lg={3} md={3} sm={12}>
                                            <img
                                              src={`data:image/jpeg;base64,${data?.data?.displayProfilePictureName}`}
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
                                              styles["Executive-Member-info"]
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
                                                          "name-Update-Committee"
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
                                                          "Designation-Update-Committee"
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
                                                          "email-Update-Committee"
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
                                            {console.log(
                                              "datadatadatadatadata",
                                              data,
                                              data.data.pK_UID,
                                              committeeData.CreatorID
                                            )}
                                            <img
                                              src={CrossIcon}
                                              className="cursor-pointer"
                                              width={18}
                                              alt=""
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
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}
                              >
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>
                          {/* Executive Members List  */}
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Update-Committee-Head-Heading"]
                                }
                              >
                                {t("Executive-member")}
                              </span>
                            </Col>
                          </Row>
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
                                              styles["Executive-Member-info"]
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
                                                          "name-Update-Committee"
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
                                                          "Designation-Update-Committee"
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
                                                          "email-Update-Committee"
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
                                            {console.log(
                                              "datadatadatadatadata",
                                              data,
                                              data.data.pK_UID,
                                              committeeData.CreatorID
                                            )}
                                            <img
                                              src={CrossIcon}
                                              className="cursor-pointer"
                                              width={18}
                                              alt=""
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
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}
                              >
                                {t("No-member-selected")}
                              </Col>
                            )}
                          </Row>
                          {/* Regular Members List */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-Upadate-Committee-page"]
                                }
                              >
                                {t("Regular-members")}
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
                                              src={`data:image/jpeg;base64,${data?.data?.displayProfilePictureName}`}
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
                                              styles["Executive-Member-info"]
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
                                                          "name-Update-Committee"
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
                                                          "Designation-Update-Committee"
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
                                                          "email-Update-Committee"
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
                                              alt=""
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
                                } else {
                                  return null;
                                }
                              })
                            ) : (
                              <Col
                                sm={12}
                                md={12}
                                lg={12}
                                className={styles["no-member"]}
                              >
                                {t("No-member-selected")}
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
                              <span
                                className={
                                  styles["Addmembers-class-Update-Committee"]
                                }
                              >
                                {t("Add-members")}
                              </span>
                            </Col>
                          </Row>
                          <Row className="mt-3">
                            <Col md={12} lg={12} sm={12}>
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
                            <Col lg={10} md={10} sm={10}>
                              <Select
                                options={committeeMembersRolesOptions}
                                value={
                                  committeeMembersRolesVal?.value !== 0
                                    ? committeeMembersRolesVal
                                    : null
                                }
                                placeholder={t("Type")}
                                onChange={changeHandlerCommitteeMemberRole}
                              />
                            </Col>
                            <Col
                              lg={2}
                              md={2}
                              sm={2}
                              className="d-flex justify-content-end"
                            >
                              <Button
                                className={styles["ADD-Committee-btn"]}
                                onClick={handleAddAttendees}
                                text={t("ADD")}
                              />
                            </Col>
                          </Row>
                          {/* from this point add members are starting */}
                          <Row className="mt-2">
                            <Col
                              lg={12}
                              md={12}
                              sm={12}
                              className={
                                styles["scrollbar-addmember-Update-Committee"]
                              }
                            >
                              {meetingAttendeesList.length > 0
                                ? meetingAttendeesList.map((data, index) => {
                                    console.log(
                                      "meetingAttendeesListmeetingAttendeesList",
                                      data
                                    );
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
                                                src={`data:image/jpeg;base64,${data?.displayProfilePictureName}`}
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
                                                  "Update-Committee-head-info-Add-Members"
                                                ]
                                              }
                                            >
                                              <Row className="mt-1">
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "name-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    {data?.name}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "Designation-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    {data?.designation}
                                                  </span>
                                                </Col>
                                              </Row>
                                              <Row>
                                                <Col lg={12} md={12} sm={12}>
                                                  <span
                                                    className={
                                                      styles[
                                                        "email-Update-Committee"
                                                      ]
                                                    }
                                                  >
                                                    <a>{data.emailAddress}</a>
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
                                                    data.pK_UID
                                                  )
                                                    ? true
                                                    : false
                                                }
                                                classNameDiv=""
                                                onChange={() =>
                                                  checkAttendeeBox(
                                                    data,
                                                    data.pK_UID,
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
                                  })
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
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["UpdateCommitteeAttachment"]}
                        >
                          <Row>
                            {fileAttachments.length > 0
                              ? fileAttachments.map((data, index) => {
                                  return (
                                    <>
                                      <Col
                                        lg={4}
                                        md={4}
                                        sm={12}
                                        className="position-relative "
                                      >
                                        <AttachmentViewer
                                          handleClickRemove={() =>
                                            handleRemoveFile(data)
                                          }
                                          fk_UID={creatorID}
                                          data={data}
                                          id={0}
                                          name={data.DisplayAttachmentName}
                                        />
                                      </Col>
                                    </>
                                  );
                                })
                              : null}
                          </Row>
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
                                  alt=""
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
                            className={styles["Cancell-updatecommittee-btn"]}
                            text={t("Cancel")}
                            onClick={() => setCloseConfirmationBox(true)}
                          />
                          <Button
                            className={styles["Create-updatecommittee-btn"]}
                            text={t("Update")}
                            onClick={handleClickUpdate}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </span>
          </Col>
        </Row>
      </section>
      <ConfirmationModal
        showModal={closeConfirmationBox}
        setShowModal={setCloseConfirmationBox}
        closeBtnClick={closebtn}
        cancelBtnClick={() => setCloseConfirmationBox(false)}
        onHide={() => setCloseConfirmationBox(false)}
      />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default UpdateCommittee;
