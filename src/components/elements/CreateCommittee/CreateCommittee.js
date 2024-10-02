import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import { Paper } from "@material-ui/core";
import featherupload from "../../../assets/images/featherupload.svg";
import Leftploygon from "../../../assets/images/Polygon 3.svg";
import file_image from "../../../assets/images/file_image.svg";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import Rightploygon from "../../../assets/images/Polygon right.svg";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { Upload } from "antd";
import Select from "react-select";
import userImage from "../../../assets/images/user.png";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
  AttachmentViewer,
} from "./../../../components/elements";
import styles from "./CreateCommittee.module.css";
import Committee from "../../../container/Committee/Committee";

import { useSelector, useDispatch } from "react-redux";
import {
  createcommittee,
  getCommitteeMembersRole,
  getCommitteeTypes,
  saveFilesCommitteesApi,
  uploadDocumentsCommitteesApi,
} from "../../../store/actions/Committee_actions";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import { Spin } from "antd";
import { saveCommitteeDocumentsApi } from "../../../store/actions/Committee_actions";
import {
  getFileExtension,
  getIconSource,
} from "../../../container/DataRoom/SearchFunctionality/option";
const CreateCommittee = ({ setCreategrouppage }) => {
  const { Dragger } = Upload;
  const navigate = useNavigate();
  const [viewCreateCommittee, setViewCreateCommittee] = useState(true);
  const { assignees, CommitteeReducer } = useSelector((state) => state);
  // for meatings  Attendees List
  const [meetingAttendeesList, setMeetingAttendeesList] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);
  const [erorbar, setErrorBar] = useState(false);
  const [attendees, setAttendees] = useState([]);
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [meetingAttendees, setMeetingAttendees] = useState([]);
  const [committeeTypeValue, setCommitteeTypeValue] = useState("");
  const [committeeTypesOptions, setCommitteeTypesOptions] = useState([]);
  const [committeeTypesValues, setCommitteeTypesValues] = useState([]);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [fileSize, setFileSize] = useState(0);
  const [fileForSend, setFileForSend] = useState([]);
  const [allPresenters, setAllPresenters] = useState([]);
  const [presenterValue, setPresenterValue] = useState({
    value: 0,
    label: "",
    name: "",
  });

  const [committeeMemberRolesOptions, setCommitteeMemberRolesOptions] =
    useState([]);
  const [committeeMemberRolesValues, setCommitteeMemberRolesValues] = useState(
    []
  );
  const [onclickFlag, setOnclickFlag] = useState(false);
  const [closeConfirmationBox, setCloseConfirmationBox] = useState(false);
  const CommitteeTitle = useRef(null);
  // for   select participant Role Name
  const [participantRoleName, setParticipantRoleName] = useState("Regular");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [open, setOpen] = useState({
    flag: false,
    message: "",
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

  useEffect(() => {
    CommitteeTitle.current.focus();
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t, false));

    dispatch(getCommitteeTypes(navigate, Data, t));
    dispatch(getCommitteeMembersRole(navigate, Data, t));
  }, []);

  // for api response of list group roles
  useEffect(() => {
    if (CommitteeReducer.getCommitteeMembersRoles !== null) {
      let committeeMembersRoleValues = [];
      let committeeMembersRoleOptions = [];
      CommitteeReducer.getCommitteeMembersRoles.map((data, index) => {
        committeeMembersRoleOptions.push({
          label: data.role,
          id: data.committeeRoleID,
        });
        committeeMembersRoleValues.push(data.role);
      });

      setCommitteeMemberRolesOptions(committeeMembersRoleOptions);
      setCommitteeMemberRolesValues(committeeMembersRoleValues);
    }
  }, [CommitteeReducer.getCommitteeMembersRoles]);

  // for api response of list group Types
  useEffect(() => {
    if (CommitteeReducer.getCommitteeTypes !== null) {
      let committeeTypeValues = [];
      let committeeTypeOptions = [];
      CommitteeReducer.getCommitteeTypes.map((data, index) => {
        committeeTypeOptions.push({
          label: data.type,
          id: data.committeeTypeId,
        });
        committeeTypeValues.push(data.type);
      });
      setCommitteeTypesOptions(committeeTypeOptions);
      setCommitteeTypesValues(committeeTypeValues);
    }
  }, [CommitteeReducer.getCommitteeTypes]);

  const searchFilterHandler = (value) => {
    if (meetingAttendeesList.length > 0) {
      return meetingAttendeesList
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
  // Group type Change Handler
  const CommitteeTypeChangeHandler = (e, value) => {
    setCommitteeTypeValue(value);
    let findID = committeeTypesOptions.find(
      (data, index) => data.label === value
    );
    setCreateCommitteeDetails({
      ...createCommitteeDetails,
      CommitteeType: findID.id,
    });
  };

  // on Search filter for add members
  const onSearch = (name, id) => {
    setOnclickFlag(true);
    setTaskAssignedToInput(name);
    setTaskAssignedTo(id);
    setTaskAssignedName(name);
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
  const changeHandlerCommitteeMemberRole = (e, value) => {
    setParticipantRoleName(value);
  };
  // Add Attendees Hanlder
  const handleAddAttendees = () => {
    let newMeetingAttendees = [...meetingAttendees];
    let newGroupMembers = [...groupMembers];
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      setOpen({
        flag: true,
        message: t("You-can-add-data-only-from-one-form-option-at-a-time"),
      });
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("Regular");
      setTaskAssignedToInput("");
      setPresenterValue({
        label: "",
        value: 0,
        name: "",
      });
    } else if (taskAssignedTo !== 0) {
      var foundIndex = meetingAttendees.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      if (participantRoleName !== "") {
        if (foundIndex === -1) {
          let roleID;
          committeeMemberRolesOptions.map((data, index) => {
            if (data.label === participantRoleName) {
              roleID = data.id;
              newMeetingAttendees.push({
                FK_UID: taskAssignedTo, //userid
                FK_CMMRID: data.id, //group member role id
                FK_CMID: 0, //group id
              });
              setMeetingAttendees(newMeetingAttendees);
            }
            setCreateCommitteeDetails({
              ...createCommitteeDetails,
              CommitteeMembers: newMeetingAttendees,
            });
          });
          if (meetingAttendeesList.length > 0) {
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === taskAssignedTo) {
                newGroupMembers.push({
                  data,
                  role: roleID,
                });
                setGroupMembers(newGroupMembers);
              }
            });
          }
          setAttendees([]);
          setTaskAssignedTo(0);
          setParticipantRoleName("Regular");
          setTaskAssignedToInput("");
          setPresenterValue({
            label: "",
            value: 0,
            name: "",
          });
        } else {
          setOpen({
            flag: true,
            message: t("User-already-exist"),
          });

          setAttendees([]);
          setTaskAssignedTo(0);
          setParticipantRoleName("Regular");
          setTaskAssignedToInput("");
          setPresenterValue({
            label: "",
            value: 0,
            name: "",
          });
        }
      } else {
        setOpen({
          flag: true,
          message: t("Please-select-committee-member-type-also"),
        });
      }
    } else if (attendees.length > 0) {
      let check = false;
      let participantOptionsWithID =
        committeeMemberRolesOptions &&
        committeeMemberRolesOptions.find(
          (data, index) => data.label === participantRoleName
        );
      attendees.forEach((data, index) => {
        newMeetingAttendees.forEach((data2, index) => {
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
        setParticipantRoleName("Regular");
        setPresenterValue({
          label: "",
          value: 0,
          name: "",
        });
      } else {
        if (participantOptionsWithID !== undefined) {
          attendees.forEach((dataID, index) => {
            newMeetingAttendees.push({
              FK_UID: dataID, //userid
              FK_CMMRID: participantOptionsWithID.id, //group member role id
              FK_CMID: 0, //group id
            });
            setMeetingAttendees(newMeetingAttendees);
            meetingAttendeesList.forEach((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
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
            setParticipantRoleName("Regular");
            setTaskAssignedToInput("");
            setPresenterValue({
              label: "",
              value: 0,
              name: "",
            });
          });
        } else {
          setOpen({
            flag: true,
            message: t("Please-select-committee-member-type-also"),
          });
        }
      }
    } else {
      setOpen({
        flag: true,
        message: t("Please-select-atleast-one-members"),
      });
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("Regular");
      setTaskAssignedToInput("");
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
    // setOnclickFlag(false);
    // if (e.target.value.trimStart() !== "") {
    //   setTaskAssignedToInput(e.target.value.trimStart());
    // } else {
    //   setTaskAssignedToInput("");
    //   setTaskAssignedTo(0);
    //   setTaskAssignedName("");
    // }
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

  const checkAttendeeBox = (data, id, index) => {
    if (attendees.includes(id)) {
      setAttendees((prevFiles) =>
        prevFiles.filter((attnedeeID) => attnedeeID !== id)
      );
    } else {
      setAttendees([...attendees, id]);
    }
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

  const checkGroupMembers = (GroupMembers) => {
    if (Object.keys(GroupMembers).length > 0) {
      let flag2 = GroupMembers.find((data, index) => data.FK_CMMRID === 2);
      if (flag2 !== undefined) {
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
      createCommitteeDetails.CommitteesTitle !== "" &&
      createCommitteeDetails.CommitteesDescription !== "" &&
      createCommitteeDetails.CommitteeType !== 0 &&
      createCommitteeDetails.CreatorID !== 0
    ) {
      if (!checkGroupMembers(createCommitteeDetails.CommitteeMembers)) {
        setOpen({
          flag: true,
          message: t("Please-add-atleast-one-executive-member"),
        });
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
      setOpen({
        flag: true,
        message: t("Please-fill-all-the-fields"),
      });
    }
  };
  const documentsUploadCall = async (folderID) => {
    let newFolder = [];
    let newfile = [];
    if (fileForSend.length > 0) {
      const uploadPromises = fileForSend.map(async (newData) => {
        await dispatch(
          uploadDocumentsCommitteesApi(
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
    if (CommitteeReducer.createUpdateCommitteeDataroom !== 0) {
      console.log(
        CommitteeReducer.createUpdateCommitteeDataroom,
        "CommitteeReducerCommitteeReducerCommitteeReducer"
      );
      let folderIdCreated = CommitteeReducer.createUpdateCommitteeDataroom;
      documentsUploadCall(folderIdCreated);
    }
  }, [CommitteeReducer.createUpdateCommitteeDataroom]);
  // // set Meeting Attendees By default creator
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

  //Sliders For Attachments

  const SlideLeft = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft - 300;
  };

  const Slideright = () => {
    var Slider = document.getElementById("Slider");
    Slider.scrollLeft = Slider.scrollLeft + 300;
  };

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
            <Paper className={styles["Create-Committee-paper"]}>
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

                      <Row className="mt-4">
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
                      <Row className="mt-1">
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
                        <Col
                          lg={5}
                          md={5}
                          sm={5}
                          className="commmittee-type-select-field CreateMeetingReminder Saved_money_Tagline"
                        >
                          <SelectBox
                            name="Participant"
                            placeholder={t("Committee-type-committee")}
                            option={committeeTypesValues}
                            value={committeeTypeValue}
                            change={CommitteeTypeChangeHandler}
                          />
                        </Col>
                      </Row>

                      <Row>
                        <Col className={styles["Committee_error_coloumn"]}>
                          <p
                            className={
                              erorbar && committeeTypeValue === ""
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
                                    <Col lg={6} md={6} sm={6} className="my-2">
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
                                    <Col lg={6} md={6} sm={6} className="mt-2">
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
                                    <Col lg={6} md={6} sm={6} className="my-2">
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
                                    <Col lg={6} md={6} sm={6} className="my-2">
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
                                    <Col lg={6} md={6} sm={6} className="my-2">
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
                            <Col
                              lg={10}
                              md={10}
                              sm={10}
                              className="committee-select-fields CreateMeetingReminder   "
                            >
                              <SelectBox
                                name="Participant"
                                placeholder={t("Type")}
                                option={committeeMemberRolesValues}
                                value={participantRoleName}
                                change={changeHandlerCommitteeMemberRole}
                                // change={assigntRoleAttendies}
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
                              {meetingAttendeesList.length > 0 ? (
                                meetingAttendeesList.map(
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
                                                // checked={rememberEmail}
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
                              ) : (
                                <Spin />
                              )}
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
            </Paper>
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
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default CreateCommittee;
