import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Newprofile from "../../../assets/images/newprofile.png";
import userImage from "../../../assets/images/user.png";
import { Paper } from "@material-ui/core";
import {
  TextField,
  Button,
  Checkbox,
  SelectBox,
  InputSearchFilter,
  Notification,
} from "./../../../components/elements";
import styles from "./UpdateCommittee.module.css";
import CrossIcon from "../../../assets/images/CrossIcon.svg";
import { useSelector, useDispatch } from "react-redux";
import featherupload from "../../../assets/images/featherupload.svg";
import Leftploygon from "../../../assets/images/Polygon 3.svg";
import file_image from "../../../assets/images/file_image.svg";
import pdfIcon from "../../../assets/images/pdf_icon.svg";
import Rightploygon from "../../../assets/images/Polygon right.svg";
import { allAssignessList } from "../../../store/actions/Get_List_Of_Assignees";
import {
  getCommitteeMembersRole,
  getCommitteeTypes,
  saveCommitteeDocumentsApi,
  saveFilesCommitteesApi,
  updateCommittee,
  uploadDocumentsCommitteesApi,
} from "../../../store/actions/Committee_actions";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "../confirmationModal/ConfirmationModal";
import { Upload } from "antd";

const UpdateCommittee = ({ setUpdateComponentpage }) => {
  const { Dragger } = Upload;
  const { CommitteeReducer, assignees } = useSelector((state) => state);
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
  const [committeeTypesOptions, setCommitteeTypesOptions] = useState([]);
  const [committeeTypesValues, setCommitteeTypesValues] = useState([]);
  const [committeeMemberRolesOptions, setCommitteeMemberRolesOptions] =
    useState([]);
  const [committeeMemberRolesValues, setCommitteeMemberRolesValues] = useState(
    []
  );
  let creatorID = JSON.parse(localStorage.getItem("userID"));
  const [taskAssignedToInput, setTaskAssignedToInput] = useState("");
  const [taskAssignedTo, setTaskAssignedTo] = useState(0);
  const [taskAssignedName, setTaskAssignedName] = useState("");
  const [participantRoleName, setParticipantRoleName] = useState("Regular");
  const { t } = useTranslation();
  const [onclickFlag, setOnclickFlag] = useState(false);
  const [committeeData, setCommitteeData] = useState({
    committeeTitle: "",
    committeeDescription: "",
    isTalkGroup: false,
    committeeType: "",
    committeeStatus: 0,
    committeeID: 0,
    committeeTypeValue: null,
    CreatorID: 0,
  });

  const [open, setOpen] = useState({
    flag: false,
    message: "",
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

  // for attendies Role handler
  const assigntRoleAttendies = (e, value) => {
    setParticipantRoleName(value);
  };

  //Input Field Assignee Change
  const onChangeSearch = (e) => {
    setOnclickFlag(false);
    if (e.target.value.trimStart() !== "") {
      setTaskAssignedToInput(e.target.value.trimStart());
    } else {
      setTaskAssignedToInput("");
      setTaskAssignedTo(0);
      setTaskAssignedName("");
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

  const changeCommitteeType = (e, value) => {
    let findID = committeeTypesOptions.find(
      (data, index) => data.label === value
    );

    setCommitteeData({
      ...committeeData,
      committeeType: findID.id,
      committeeTypeValue: findID.label,
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
    if (taskAssignedTo !== 0 && attendees.length > 0) {
      setOpen({
        flag: true,
        message: t("You-can-add-data-only-from-one-form-option-at-a-time"),
      });
      setAttendees([]);
      setTaskAssignedTo(0);
      setParticipantRoleName("Regular");
      setTaskAssignedToInput("");
    } else if (taskAssignedTo !== 0) {
      var foundIndex = membersData.findIndex(
        (x) => x.FK_UID === taskAssignedTo
      );
      if (participantRoleName !== "") {
        if (foundIndex === -1) {
          let roleID;
          let newDataForMembers = [];
          committeeMemberRolesOptions.forEach((data, index) => {
            if (data.label === participantRoleName) {
              roleID = data.id;
              newDataForMembers.push({
                FK_UID: taskAssignedTo, //userid
                FK_CMMRID: data.id, //group member role id
                FK_CMID: 0, //group id
              });
              setMembersData([...membersData, ...newDataForMembers]);
            }
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
          setParticipantRoleName("Regular");
          setTaskAssignedToInput("");
        } else {
          setOpen({
            flag: true,
            message: t("User-already-exist"),
          });
          setTaskAssignedTo(0);
          setParticipantRoleName("Regular");
          setTaskAssignedToInput("");
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
        setParticipantRoleName("Regular");
      } else {
        if (participantOptionsWithID !== undefined) {
          let newDataForMembers = [];
          attendees.map((dataID, index) => {
            newDataForMembers.push({
              FK_UID: dataID, //userid
              FK_CMMRID: participantOptionsWithID.id, //group member role id
              FK_CMID: 0, //group id
            });
            setMembersData([...membersData, ...newDataForMembers]);
            meetingAttendeesList.map((data, index) => {
              if (data.pK_UID === dataID) {
                newGroupMembers.push({
                  data,
                  role: participantOptionsWithID.id,
                });
                setGroupMembers(newGroupMembers);
              }
            });
            setAttendees([]);
            setParticipantRoleName("Regular");
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
    }
  };

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

  const checkGroupMembers = (GroupMembers) => {
    if (Object.keys(GroupMembers).length > 0) {
      let flag2 = GroupMembers.find((data, index) => data.FK_CMMRID === 2);

      if (flag2 != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleClickUpdate = () => {
    if (
      committeeData.committeeTitle !== "" &&
      committeeData.committeeDescription !== "" &&
      committeeData.committeeType !== 0 &&
      committeeData.CreatorID !== 0
    ) {
      if (!checkGroupMembers(membersData)) {
        setOpen({
          flag: true,
          message: t("Please-add-atleast-one-executive-member"),
        });
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
      setOpen({
        flag: true,
        message: t("Please fill all the fields"),
      });
    }
  };

  // for api reponce of list of all assignees
  useEffect(() => {
    if (assignees.user.length > 0) {
      setMeetingAttendeesList(assignees.user);
    }
  }, [assignees.user]);

  // dispatch apis for committee types and committee member roles
  useEffect(() => {
    let organizationID = JSON.parse(localStorage.getItem("organizationID"));
    let Data = {
      OrganizationID: organizationID,
    };
    dispatch(allAssignessList(navigate, t));
    dispatch(getCommitteeTypes(navigate, Data, t));
    dispatch(getCommitteeMembersRole(navigate, Data, t));
  }, []);

  useEffect(() => {
    try {
      if (
        CommitteeReducer.getCommitteeByCommitteeID !== null &&
        CommitteeReducer.getCommitteeByCommitteeID !== undefined
      ) {
        let committeedetails = CommitteeReducer.getCommitteeByCommitteeID;
        let newArr = [];
        let newData = [];
        let committeeID = 0;
        if (committeedetails.committeMembers.length > 0) {
          committeedetails.committeMembers.map((memberData, index) => {
            committeeID = memberData.committeeID;
            if (meetingAttendeesList.length > 0) {
              meetingAttendeesList.map((data, index) => {
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
          committeeTypeValue: committeedetails.committeeType.type,
          committeeID: committeeID,
        });
      }
    } catch {
      console.log(
        "error in getting data in update committee getCommitteeByCommitteeID"
      );
    }
  }, [CommitteeReducer.getCommitteeByCommitteeID, meetingAttendeesList]);

  useEffect(() => {
    if (
      CommitteeReducer.reteriveCommitteeDocuments !== null &&
      CommitteeReducer.reteriveCommitteeDocuments !== undefined
    ) {
      if (CommitteeReducer.reteriveCommitteeDocuments.data.length > 0) {
        let newfolderID = CommitteeReducer.reteriveCommitteeDocuments.folderID;
        let filesArr = CommitteeReducer.reteriveCommitteeDocuments.data;
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
  }, [CommitteeReducer.reteriveCommitteeDocuments]);

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

  const handleDoubleCLickFile = () => {};

  useEffect(() => {
    if (CommitteeReducer.createUpdateCommitteeDataroom !== 0) {
      let folderIdCreated = CommitteeReducer.createUpdateCommitteeDataroom;
      documentsUploadCall(folderIdCreated);
    }
  }, [CommitteeReducer.createUpdateCommitteeDataroom]);

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
            <span className={styles["Update-Committee-Heading"]}>
              {t("Update-committee")}
            </span>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col lg={12} md={12} sm={12}>
            <Paper className={styles["Update-Committee-paper"]}>
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
                            // className={styles["Height-of-textarea"]
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
                                className="SearchCheckbox MontserratSemiBold-600"
                                name="IsChat"
                                disabled={
                                  CommitteeReducer?.getCommitteeByCommitteeID
                                    ?.isTalkChatGroup
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
                        <Col
                          lg={5}
                          md={5}
                          sm={5}
                          className="committee-update-type-select-fields CreateMeetingReminder ml-0 "
                        >
                          <SelectBox
                            // name="Participant"
                            placeholder={t("Committee-type")}
                            value={committeeData.committeeTypeValue || ""}
                            option={committeeTypesValues}
                            change={changeCommitteeType}
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
                          {/* Group Heads */}
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
                          <Row>
                            <Col
                              md={12}
                              lg={12}
                              sm={12}
                              className="create-committee-fields Update_committee_input_searchfield"
                            >
                              <InputSearchFilter
                                placeholder={t("Search-member-here")}
                                value={taskAssignedToInput}
                                filteredDataHandler={searchFilterHandler(
                                  taskAssignedToInput
                                )}
                                change={onChangeSearch}
                                onclickFlag={onclickFlag}
                              />
                            </Col>
                          </Row>
                          <Row className="mt-4">
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
                                change={assigntRoleAttendies}
                                value={participantRoleName}
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
                                              width="12.68px"
                                              onClick={() =>
                                                handleRemoveFile(data)
                                              }
                                            />
                                          </span>
                                          <section
                                            className={styles["Outer_Box"]}
                                            onClick={handleDoubleCLickFile}
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
            </Paper>
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
      <Notification open={open.flag} message={open.message} setOpen={setOpen} />
    </>
  );
};

export default UpdateCommittee;
