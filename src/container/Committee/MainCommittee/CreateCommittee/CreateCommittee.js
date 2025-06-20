import React, { useEffect, useRef, useState } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import featherupload from "../../../../assets/images/featherupload.svg";
import CrossIcon from "../../../../assets/images/CrossIcon.svg";
import { Upload } from "antd";
import Select from "react-select";
import {
  TextField,
  Button,
  Checkbox,
  Notification,
  AttachmentViewer,
} from "./../../../../components/elements";
import styles from "./CreateCommittee.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  createcommittee,
  getCommitteeMembersRole,
  getCommitteeTypes,
  saveFilesCommitteesApi,
  uploadDocumentsCommitteesApi,
} from "../../../../store/actions/Committee_actions";
import { allAssignessList } from "../../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../../../../components/elements/confirmationModal/ConfirmationModal";
import { saveCommitteeDocumentsApi } from "../../../../store/actions/Committee_actions";
import { showMessage } from "../../../../components/elements/snack_bar/utill";
import { isFileSizeValid } from "../../../../commen/functions/convertFileSizeInMB";
const CreateCommittee = ({ setCreategrouppage }) => {
  const { Dragger } = Upload;
  const navigate = useNavigate();

  const CommitteeReducergetCommitteeMembersRoles = useSelector(
    (state) => state.CommitteeReducer.getCommitteeMembersRoles
  );

  const CommitteeReducergetCommitteeTypes = useSelector(
    (state) => state.CommitteeReducer.getCommitteeTypes
  );

  const CommitteeReducercreateUpdateCommitteeDataroom = useSelector(
    (state) => state.CommitteeReducer.createUpdateCommitteeDataroom
  );

  const assigneesuser = useSelector((state) => state.assignees.user);
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [erorbar, setErrorBar] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);

  // Committee Members Roles
  const [committeeMembersRolesVal, setCommitteeMembersRolesVal] = useState({
    label: "",
    value: 0,
  });

  console.log(
    committeeMembersRolesVal,
    "committeeMembersRolesValcommitteeMembersRolesVal"
  );
  const [committeeMembersRolesOptions, setCommitteeMembersRolesOptions] =
    useState([]);

  // Committee Type Value
  const [committeeTypesVal, setCommitteeTypesVal] = useState({
    label: "",
    value: 0,
  });
  const [newCommitteeTypeOptions, setNewCommitteeTypeOptions] = useState([]);
  const CommitteeTitle = useRef(null);
  // for   select participant Role Name
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [open, setOpen] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  // for initial State
  const [createCommitteeDetails, setCreateCommitteeDetails] = useState({
    PK_CMID: 0,
    CommitteesTitle: "",
    FK_CMSID: 0,
    CommitteeType: 0,
    CommitteesDescription: "",
    ISTalkChatGroup: true,
    OrganizationID: 0,
    CreatorID: 0,
    CommitteeMembers: [],
  });
  const chcekFlag = false;
  useEffect(() => {
    try {
      CommitteeTitle.current.focus();
      let organizationID = JSON.parse(localStorage.getItem("organizationID"));
      let Data = {
        OrganizationID: organizationID,
      };
      dispatch(allAssignessList(navigate, t, false));

      dispatch(getCommitteeTypes(navigate, Data, t));
      dispatch(getCommitteeMembersRole(navigate, Data, t));
    } catch (error) {
      console.log(error, "error");
    }
  }, [chcekFlag]);

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

  // Group type Change Handler
  const CommitteeTypeChangeHandler = (event) => {
    setCommitteeTypesVal(event);
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      CommitteeType: event.value,
    });
  };

  // onChange Function for set input values in state
  const onChangeFunc = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === "committeetitle") {
      setCreateCommitteeDetails({
        ...createCommitteeDetails,
        CommitteesTitle: value,
      });
    }
    if (name === "committeedescription") {
      setCreateCommitteeDetails({
        ...createCommitteeDetails,
        CommitteesDescription: value,
      });
    }
  };

  // remove member handler
  const removeMemberHandler = (id) => {
    const updatedCreateCommitteeDetails = {
      ...createCommitteeDetails,
      CommitteeMembers: createCommitteeDetails.CommitteeMembers.filter(
        (item) => item.FK_UID !== id
      ),
    };
    setCreateCommitteeDetails(updatedCreateCommitteeDetails);
    const meetingAttendeesMembers = meetingAttendees.filter(
      (item) => item.FK_UID !== id
    );
    setMeetingAttendees(meetingAttendeesMembers);
    const updatedCommitteeMembers = groupMembers.filter(
      (item) => item.data.pK_UID !== id
    );
    setGroupMembers(updatedCommitteeMembers);
  };

  // change handler changeHandlerCommitteeMemberRole
  const changeHandlerCommitteeMemberRole = (event) => {
    setCommitteeMembersRolesVal(event);
  };
  // Add Attendees Hanlder
  const handleAddAttendees = () => {
    let newMeetingAttendees = [...meetingAttendees];
    let newGroupMembers = [...groupMembers];
    let findRegularRole = committeeMembersRolesOptions.find(
      (roleOpt) => roleOpt.label === "Regular Members"
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

      setPresenterValue({
        label: "",
        value: 0,
        name: "",
      });
    } else if (taskAssignedTo !== 0) {
      var foundIndex = meetingAttendees.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      if (committeeMembersRolesVal.value !== 0) {
        if (foundIndex === -1) {
          newMeetingAttendees.push({
            FK_UID: taskAssignedTo, //userid
            FK_CMMRID: committeeMembersRolesVal.value, //group member role id
            FK_CMID: 0, //group id
          });
          setMeetingAttendees(newMeetingAttendees);

          setCreateCommitteeDetails({
            ...createCommitteeDetails,
            CommitteeMembers: newMeetingAttendees,
          });

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
          setAttendees([]);
          setTaskAssignedTo(0);
          setCommitteeMembersRolesVal(findRegularRole);

          setPresenterValue({
            label: "",
            value: 0,
            name: "",
          });
        } else {
          showMessage(t("User-already-exist"), "error", setOpen);
          setAttendees([]);
          setTaskAssignedTo(0);
          setCommitteeMembersRolesVal(findRegularRole);

          setPresenterValue({
            label: "",
            value: 0,
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
        newMeetingAttendees.forEach((data2, index) => {
          if (data === data2.FK_UID) {
            check = true;
          }
        });
      });
      if (check === true) {
        showMessage(t("User-already-exist"), "error", setOpen);
        setAttendees([]);
        setCommitteeMembersRolesVal(findRegularRole);

        setPresenterValue({
          label: "",
          value: 0,
          name: "",
        });
      } else {
        if (committeeMembersRolesVal.value !== 0) {
          attendees.forEach((dataID, index) => {
            newMeetingAttendees.push({
              FK_UID: dataID, //userid
              FK_CMMRID: committeeMembersRolesVal.value, //group member role id
              FK_CMID: 0, //group id
            });
            setMeetingAttendees(newMeetingAttendees);
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: committeeMembersRolesVal.value,
                });
                setGroupMembers(newGroupMembers);
              }
            });
            setCreateCommitteeDetails({
              ...createCommitteeDetails,
              CommitteeMembers: newMeetingAttendees,
            });
            setAttendees([]);
            setTaskAssignedTo(0);
            setCommitteeMembersRolesVal(findRegularRole);
            setPresenterValue({
              label: "",
              value: 0,
              name: "",
            });
          });
        } else {
          showMessage(
            t("Please-select-committee-member-type-also"),
            "error",
            setOpen
          );
        }
      }
    } else {
      showMessage(t("Please-select-atleast-one-members"), "error", setOpen);
      setAttendees([]);
      setTaskAssignedTo(0);
      setCommitteeMembersRolesVal(findRegularRole);
      setPresenterValue({
        label: "",
        value: 0,
        name: "",
      });
    }
  };

  //Input Field Assignee Change
  const onChangeSearch = (item) => {
    setPresenterValue(item);
    setTaskAssignedTo(item.value);
  };

  // onChange function for group chat
  const CheckBoxHandler = (e) => {
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      ISTalkChatGroup: e.target.checked,
    });
  };

  const handleCloseBtn = () => {
    setCreategrouppage(false);
  };

  const checkAttendeeBox = (id) => {
    setAttendees((prevAttendees) =>
      prevAttendees.includes(id)
        ? prevAttendees.filter((attendeeID) => attendeeID !== id)
        : [...prevAttendees, id]
    );
  };

  console.log(attendees, "attendeesattendees");
  console.log(groupMembers, "attendeesattendees");
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

  const handleSubmitCreateGroup = async () => {
    if (
      createCommitteeDetails.CommitteesTitle !== "" &&
      createCommitteeDetails.CommitteesDescription !== "" &&
      createCommitteeDetails.CommitteeType !== 0 &&
      createCommitteeDetails.CreatorID !== 0
    ) {
      if (!checkGroupMembers(createCommitteeDetails.CommitteeMembers)) {
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
            CreatorID: createCommitteeDetails.CreatorID,
            CommitteesTitle: createCommitteeDetails.CommitteesTitle,
            CommitteesDescription: createCommitteeDetails.CommitteesDescription,
            PK_CMID: 0,
            FK_CMSID: 3,
            FK_CMTID: createCommitteeDetails.CommitteeType,
            ISTalkChatGroup: createCommitteeDetails.ISTalkChatGroup,
            OrganizationID: OrganizationID,
          },
          CommitteeMembers: createCommitteeDetails.CommitteeMembers,
        };
        dispatch(createcommittee(navigate, Data, t));
      }
    } else {
      setErrorBar(true);
      showMessage(t("Please-fill-all-the-fields"), "error", setOpen);
    }
  };
  const documentsUploadCall = async (folderID) => {
    let newFolder = [];
    let newfile = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsCommitteesApi(navigate, t, newData, folderID, newfile)
        );
      });

      // Wait for all promises to resolve
      await Promise.all(uploadPromises);

      await dispatch(
        saveFilesCommitteesApi(navigate, t, newfile, folderID, newFolder)
      );
    }

    let newCommitteeID = localStorage.getItem("CommitteeID");
    let newData = {
      CommitteeID: Number(newCommitteeID),
      UpdateFileList: newFolder.map((fileID) => ({
        PK_FileID: fileID.pK_FileID,
      })),
    };

    await dispatch(
      saveCommitteeDocumentsApi(navigate, t, newData, setCreategrouppage)
    );
  };

  useEffect(() => {
    try {
      if (CommitteeReducercreateUpdateCommitteeDataroom !== 0) {
        let folderIdCreated = CommitteeReducercreateUpdateCommitteeDataroom;
        documentsUploadCall(folderIdCreated);
      }
    } catch (error) {
      console.log(error, "error");
    }
  }, [CommitteeReducercreateUpdateCommitteeDataroom]);

  // set Meeting Attendees By default creator
  useEffect(() => {
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      CreatorID: creatorID,
    });
  }, [meetingAttendeesList]);

  //Upload File

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

      if (totalFiles > 10) {
        showMessage(t("Not-allowed-more-than-10-files"), "error", setOpen);
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
            pK_FileID: 0,
            fk_UserID: Number(creatorID),
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

    setFileAttachments((prevFiles) =>
      prevFiles.filter(
        (fileSend) =>
          fileSend.DisplayAttachmentName !== data.DisplayAttachmentName
      )
    );
  };

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
            <span className={styles["Create-Committee-Heading"]}>
              {t("Create-new-committee")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <span className={styles["Create-Committee-paper"]}>
              <Row>
                <Col lg={12} md={12} sm={12}>
                  <Row>
                    <Col lg={6} md={6} sm={6}>
                      <Row>
                        <Col lg={12} md={12} sm={12}>
                          <span
                            className={styles["details-class-Create-Committee"]}
                          >
                            {t("Details")}
                          </span>
                        </Col>
                      </Row>

                      <Row className="mt-2">
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className="create-committee-fields CreateMeetingInput"
                        >
                          <Form.Control
                            ref={CommitteeTitle}
                            type="text"
                            placeholder={t("Committee-title-Committee")}
                            required={true}
                            name="committeetitle"
                            className={styles["create_committee_title"]}
                            maxLength={300}
                            value={createCommitteeDetails.CommitteesTitle}
                            onChange={onChangeFunc}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              createCommitteeDetails.CommitteesTitle === ""
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
                          className="CreateMeetingInput Saved_money_Tagline "
                        >
                          <TextField
                            applyClass="text-area-create-group"
                            type="text"
                            as={"textarea"}
                            maxLength={500}
                            value={createCommitteeDetails.CommitteesDescription}
                            rows="4"
                            placeholder={t("Group-Description")}
                            required={true}
                            name="committeedescription"
                            change={onChangeFunc}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <p
                            className={
                              erorbar &&
                              createCommitteeDetails.CommitteesDescription ===
                                ""
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-description-is-required")}
                          </p>
                        </Col>
                      </Row>
                      <Row className="mt-2">
                        <Col
                          lg={6}
                          md={6}
                          sm={6}
                          className={styles["CheckAlignment"]}
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
                                checked={createCommitteeDetails.ISTalkChatGroup}
                                onChange={CheckBoxHandler}
                                classNameDiv="checkboxParentClass"
                              ></Checkbox>
                            </Col>
                          </Row>
                        </Col>
                        <Col lg={1} md={1} sm={1}></Col>
                        <Col lg={5} md={5} sm={5}>
                          <Select
                            options={newCommitteeTypeOptions}
                            value={
                              committeeTypesVal.value !== 0
                                ? committeeTypesVal
                                : null
                            }
                            placeholder={t("Committee-type")}
                            onChange={CommitteeTypeChangeHandler}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col className={styles["Committee_error_coloumn"]}>
                          <p
                            className={
                              erorbar && committeeTypesVal.value === 0
                                ? styles["errorMessage"]
                                : styles["errorMessage_hidden"]
                            }
                          >
                            {t("Committee-type-is-required")}
                          </p>
                        </Col>
                      </Row>
                      {/* this is members shown area on which the scroll will applied */}
                      <Row>
                        <Col
                          lg={12}
                          md={12}
                          sm={12}
                          className={styles["scroll-bar-createCommittee"]}
                        >
                          {/* Chair Person Member */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-create-Committee-page"]
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
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className="my-2"
                                      key={data.pK_UID}
                                    >
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
                                            sm={7}
                                            className={
                                              styles[
                                                "group-head-info-Create-Committee"
                                              ]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "name-create-Committee"
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
                                                      "Designation-create-Committee"
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
                                                      "email-create-Committee"
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
                                              alt=""
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
                            )}
                          </Row>
                          {/* Vice Chair Person Member */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-create-Committee-page"]
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
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className="my-2"
                                      key={data.pK_UID}
                                    >
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
                                            sm={7}
                                            className={
                                              styles[
                                                "group-head-info-Create-Committee"
                                              ]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "name-create-Committee"
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
                                                      "Designation-create-Committee"
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
                                                      "email-create-Committee"
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
                                              alt=""
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
                            )}
                          </Row>
                          {/* Secretary */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-create-Committee-page"]
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
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className="my-2"
                                      key={data.pK_UID}
                                    >
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
                                            sm={7}
                                            className={
                                              styles[
                                                "group-head-info-Create-Committee"
                                              ]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "name-create-Committee"
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
                                                      "Designation-create-Committee"
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
                                                      "email-create-Committee"
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
                                              alt=""
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
                            )}
                          </Row>
                          {/* Executive Members List */}
                          <Row className="mt-1">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["Create-Committee-Head-Heading"]
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
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className="my-2"
                                      key={data.pK_UID}
                                    >
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
                                            sm={7}
                                            className={
                                              styles[
                                                "group-head-info-Create-Committee"
                                              ]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "name-create-Committee"
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
                                                      "Designation-create-Committee"
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
                                                      "email-create-Committee"
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
                                              alt=""
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
                            )}
                          </Row>
                          {/* Regular Members List */}
                          <Row className="mt-3">
                            <Col lg={12} md={12} sm={12}>
                              <span
                                className={
                                  styles["members-create-Committee-page"]
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
                                    <Col
                                      lg={6}
                                      md={6}
                                      sm={6}
                                      className="mt-2"
                                      key={data.pK_UID}
                                    >
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
                                            sm={7}
                                            className={
                                              styles[
                                                "group-head-info-Create-Committee"
                                              ]
                                            }
                                          >
                                            <Row className="mt-1">
                                              <Col lg={12} md={12} sm={12}>
                                                <span
                                                  className={
                                                    styles[
                                                      "name-create-Committee"
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
                                                      "Designation-create-Committee"
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
                                                      "email-create-Committee"
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
                                              alt=""
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
                              <>
                                <Col
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  className={styles["No-member"]}
                                >
                                  {t("No-member-selected")}
                                </Col>
                              </>
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
                                  styles["Addmembers-class-Create-Committee"]
                                }
                              >
                                {t("Add-members") + "*"}
                              </span>
                            </Col>
                          </Row>
                          <Row>
                            <Col
                              md={12}
                              lg={12}
                              sm={12}
                              className="create-committee-fields InputSearchForCreateCommittee"
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
                                placeholder={t("Search-member-here") + "*"}
                                filterOption={filterFunc}
                              />
                            </Col>
                          </Row>

                          <Row className="mt-3">
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
                                styles["scrollbar-addmember-createcommittee"]
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
                                            className="mt-4"
                                            key={index}
                                          >
                                            <Row className="d-flex gap-2">
                                              <Col lg={2} md={2} sm={12}>
                                                <img
                                                  src={`data:image/jpeg;base64,${attendeelist?.displayProfilePictureName}`}
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
                                                    "group-head-info-Add-Members-Create-Committee"
                                                  ]
                                                }
                                              >
                                                <Row className="mt-1">
                                                  <Col lg={12} md={12} sm={12}>
                                                    <span
                                                      className={
                                                        styles[
                                                          "name-create-Committee"
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
                                                          "Designation-create-Committee"
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
                                                          "email-create-Committee"
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
                                                      attendeelist.pK_UID
                                                    )
                                                  }
                                                  className={
                                                    styles[
                                                      "RememberEmail-Create-Committee"
                                                    ]
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
                      <section className={styles["files_View"]}>
                        <Row className="mt-1">
                          {fileAttachments.length > 0
                            ? fileAttachments.map((data, index) => {
                                return (
                                  <>
                                    <Col lg={4} md={4} sm={4}>
                                      <AttachmentViewer
                                        handleClickRemove={() =>
                                          handleRemoveFile(data)
                                        }
                                        name={data.DisplayAttachmentName}
                                        id={data.pK_FileID}
                                        data={data}
                                        fk_UID={creatorID}
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
                            className={styles["Cancell-CreateCommittee-btn"]}
                            text={t("Cancel")}
                            onClick={() => setCloseConfirmationBox(true)}
                          />
                          <Button
                            className={styles["Create-CreateCommittee-btn"]}
                            text={t("Create")}
                            onClick={handleSubmitCreateGroup}
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
        onHide={() => setCloseConfirmationBox(false)}
        closeBtnClick={handleCloseBtn}
        cancelBtnClick={() => setCloseConfirmationBox(false)}
        setShowModal={setCloseConfirmationBox}
      />
      <Notification open={open} setOpen={setOpen} />
    </>
  );
};

export default CreateCommittee;
